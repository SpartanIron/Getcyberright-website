/**
 * AI cost guard.
 *
 * Every Anthropic `messages.create` / `messages.stream` call in this process goes
 * through this module (it patches the SDK's Messages prototype once at import), so
 * the ~25 call sites across the codebase are protected without editing each one.
 *
 * What it enforces (set as Railway variables; no code change needed, Railway restarts the service):
 *   AI_ENABLED=false                    -> block all AI calls (kill switch)
 *   AI_BACKGROUND_ENABLED=false         -> block scheduled/background AI calls only
 *   AI_DAILY_BUDGET_USD_BACKGROUND=3    -> per-UTC-day spend cap for background jobs
 *   AI_DAILY_BUDGET_USD_INTERACTIVE=5   -> per-UTC-day spend cap for user-facing calls
 *   AI_BACKGROUND_MAX_CALLS_PER_HOUR=60 -> rolling hourly call cap for background jobs
 *   AI_BACKGROUND_CONCURRENCY=2         -> max simultaneous background calls
 *   AI_INTERACTIVE_CONCURRENCY=6        -> max simultaneous user-facing calls
 *   AI_MAX_OUTPUT_TOKENS=4000           -> clamps max_tokens on every request
 *   AI_BACKGROUND_MODEL=claude-haiku-4-5 (optional) -> force a cheaper model for background jobs
 *   AI_STARTUP_GRACE_SECONDS=300        -> no background AI calls right after boot/deploy
 *
 * Also:
 *   - Circuit breaker: stops calling the API after "credit balance too low" / auth
 *     errors (30 min) or rate limits / overload (60 s) instead of hammering it.
 *   - Usage ledger: tokens and estimated USD per day/kind/feature in the
 *     `ai_usage_daily` table (shared across replicas), plus one log line per call.
 *
 * Calls are "background" when they run inside runAsBackground(); everything else
 * (HTTP request handlers) is "interactive".
 */
import Anthropic from "@anthropic-ai/sdk";
import { AsyncLocalStorage } from "node:async_hooks";
import postgres from "postgres";

type Kind = "interactive" | "background";

// ---------- configuration ----------
function envBool(name: string, def: boolean): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return def;
  return !["false", "0", "no", "off"].includes(v.trim().toLowerCase());
}
function envNum(name: string, def: number): number {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v >= 0 ? v : def;
}
function cfg() {
  return {
    enabled: envBool("AI_ENABLED", true),
    backgroundEnabled: envBool("AI_BACKGROUND_ENABLED", true),
    budget: {
      background: envNum("AI_DAILY_BUDGET_USD_BACKGROUND", 3),
      interactive: envNum("AI_DAILY_BUDGET_USD_INTERACTIVE", 5),
    } as Record<Kind, number>,
    bgCallsPerHour: envNum("AI_BACKGROUND_MAX_CALLS_PER_HOUR", 60),
    concurrency: {
      background: Math.max(1, envNum("AI_BACKGROUND_CONCURRENCY", 2)),
      interactive: Math.max(1, envNum("AI_INTERACTIVE_CONCURRENCY", 6)),
    } as Record<Kind, number>,
    maxOutputTokens: Math.max(1, envNum("AI_MAX_OUTPUT_TOKENS", 4000)),
    backgroundModel: process.env.AI_BACKGROUND_MODEL?.trim() || "",
    startupGraceMs: envNum("AI_STARTUP_GRACE_SECONDS", 300) * 1000,
  };
}

// ---------- context ----------
const ctx = new AsyncLocalStorage<{ kind: Kind }>();
/** Run fn (and every timer/promise it schedules) as background AI work. */
export function runAsBackground<T>(fn: () => T): T {
  return ctx.run({ kind: "background" }, fn);
}
function currentKind(): Kind {
  return ctx.getStore()?.kind ?? "interactive";
}

export class AIGuardBlockedError extends Error {
  readonly status = 503;
  constructor(public readonly reason: string) {
    super(`[AIGuard] AI call blocked: ${reason}`);
    this.name = "AIGuardBlockedError";
  }
}

// ---------- pricing (USD per million tokens; source: platform.claude.com pricing, Sep 2026) ----------
const PRICES: Array<[RegExp, number, number]> = [
  [/opus-4-(5|6|7|8)|opus-5/, 5, 25],
  [/opus/, 15, 75],
  [/sonnet-5/, 2, 10],
  [/sonnet/, 3, 15],
  [/haiku-4/, 1, 5],
  [/haiku-3-5/, 0.8, 4],
  [/haiku/, 1, 5],
];
export function estimateCostUsd(model: string, usage: any): number {
  const [, inP, outP] = PRICES.find(([re]) => re.test(model || "")) ?? [/./, 3, 15];
  const input = Number(usage?.input_tokens) || 0;
  const output = Number(usage?.output_tokens) || 0;
  const cacheWrite = Number(usage?.cache_creation_input_tokens) || 0;
  const cacheRead = Number(usage?.cache_read_input_tokens) || 0;
  return (input * inP + cacheWrite * inP * 1.25 + cacheRead * inP * 0.1 + output * outP) / 1_000_000;
}

// ---------- ledger (Postgres, falls back to memory) ----------
const utcDay = () => new Date().toISOString().slice(0, 10);
const spent: Record<Kind, number> = { interactive: 0, background: 0 };
let spentDay = utcDay();
let lastSync = 0;
let sql: ReturnType<typeof postgres> | null = null;
let tableReady: Promise<void> | null = null;

function db() {
  if (!sql && process.env.DATABASE_URL) {
    sql = postgres(process.env.DATABASE_URL, { max: 2, idle_timeout: 30, onnotice: () => {} });
  }
  return sql;
}
function ensureTable(): Promise<void> {
  const s = db();
  if (!s) return Promise.resolve();
  if (!tableReady) {
    tableReady = s`
      CREATE TABLE IF NOT EXISTS ai_usage_daily (
        day date NOT NULL,
        kind text NOT NULL,
        feature text NOT NULL,
        calls integer NOT NULL DEFAULT 0,
        blocked integer NOT NULL DEFAULT 0,
        input_tokens bigint NOT NULL DEFAULT 0,
        output_tokens bigint NOT NULL DEFAULT 0,
        cost_usd numeric(12,6) NOT NULL DEFAULT 0,
        PRIMARY KEY (day, kind, feature)
      )`.then(() => undefined);
    tableReady.catch(() => { tableReady = null; });
  }
  return tableReady;
}
function rollDay() {
  const d = utcDay();
  if (d !== spentDay) {
    spentDay = d;
    spent.interactive = 0;
    spent.background = 0;
    lastSync = 0;
  }
}
async function syncSpent(): Promise<void> {
  rollDay();
  const s = db();
  if (!s || Date.now() - lastSync < 30_000) return;
  lastSync = Date.now();
  try {
    await ensureTable();
    const rows = await s`SELECT kind, COALESCE(SUM(cost_usd),0)::float8 AS cost FROM ai_usage_daily WHERE day = ${spentDay} GROUP BY kind`;
    for (const r of rows as any[]) {
      if (r.kind === "interactive" || r.kind === "background") {
        spent[r.kind as Kind] = Math.max(spent[r.kind as Kind], Number(r.cost) || 0);
      }
    }
  } catch (e) {
    warnOnce("db-sync", `ledger read failed, using in-memory totals: ${(e as Error).message}`);
  }
}
function record(kind: Kind, feature: string, fields: { calls?: number; blocked?: number; input?: number; output?: number; cost?: number }) {
  rollDay();
  spent[kind] += fields.cost ?? 0;
  const s = db();
  if (!s) return;
  const day = spentDay;
  ensureTable()
    .then(() => s`
      INSERT INTO ai_usage_daily (day, kind, feature, calls, blocked, input_tokens, output_tokens, cost_usd)
      VALUES (${day}, ${kind}, ${feature}, ${fields.calls ?? 0}, ${fields.blocked ?? 0}, ${fields.input ?? 0}, ${fields.output ?? 0}, ${fields.cost ?? 0})
      ON CONFLICT (day, kind, feature) DO UPDATE SET
        calls = ai_usage_daily.calls + EXCLUDED.calls,
        blocked = ai_usage_daily.blocked + EXCLUDED.blocked,
        input_tokens = ai_usage_daily.input_tokens + EXCLUDED.input_tokens,
        output_tokens = ai_usage_daily.output_tokens + EXCLUDED.output_tokens,
        cost_usd = ai_usage_daily.cost_usd + EXCLUDED.cost_usd`)
    .catch((e) => warnOnce("db-write", `ledger write failed: ${(e as Error).message}`));
}

// ---------- limits ----------
const bootAt = Date.now();
const bgCallTimes: number[] = [];
const breaker: Record<Kind, { until: number; reason: string }> = {
  interactive: { until: 0, reason: "" },
  background: { until: 0, reason: "" },
};
const warned = new Map<string, number>();
function warnOnce(key: string, msg: string, everyMs = 60_000) {
  const last = warned.get(key) ?? 0;
  if (Date.now() - last > everyMs) {
    warned.set(key, Date.now());
    console.warn(`[AIGuard] ${msg}`);
  }
}

function checkAllowed(kind: Kind): string | null {
  const c = cfg();
  rollDay();
  if (!c.enabled) return "AI_ENABLED=false";
  if (kind === "background" && !c.backgroundEnabled) return "AI_BACKGROUND_ENABLED=false";
  if (Date.now() < breaker[kind].until) return `circuit open (${breaker[kind].reason})`;
  if (kind === "background" && Date.now() - bootAt < c.startupGraceMs) return "startup grace period";
  if (spent[kind] >= c.budget[kind]) return `daily ${kind} budget reached ($${spent[kind].toFixed(2)} of $${c.budget[kind].toFixed(2)})`;
  if (kind === "background") {
    const hourAgo = Date.now() - 3_600_000;
    while (bgCallTimes.length && bgCallTimes[0] < hourAgo) bgCallTimes.shift();
    if (bgCallTimes.length >= c.bgCallsPerHour) return `hourly background call cap (${c.bgCallsPerHour})`;
  }
  return null;
}

function tripBreaker(err: any) {
  const status = Number(err?.status);
  const msg = String(err?.message ?? "");
  let ms = 0;
  let reason = "";
  let both = false;
  if (/credit balance/i.test(msg)) { ms = 30 * 60_000; reason = "credit balance too low"; both = true; }
  else if (status === 401 || status === 403) { ms = 30 * 60_000; reason = `auth error ${status}`; both = true; }
  else if (status === 429) { ms = 60_000; reason = "rate limited"; }
  else if (status === 529 || /overloaded/i.test(msg)) { ms = 60_000; reason = "API overloaded"; }
  if (!ms) return;
  const until = Date.now() + ms;
  const kinds: Kind[] = both ? ["background", "interactive"] : ["background"];
  for (const k of kinds) breaker[k] = { until, reason };
  console.warn(`[AIGuard] circuit opened for ${kinds.join("+")} for ${Math.round(ms / 1000)}s: ${reason}`);
}

// simple FIFO semaphores
const running: Record<Kind, number> = { interactive: 0, background: 0 };
const waiters: Record<Kind, Array<() => void>> = { interactive: [], background: [] };
async function acquire(kind: Kind) {
  if (running[kind] < cfg().concurrency[kind]) { running[kind]++; return; }
  await new Promise<void>((resolve) => waiters[kind].push(resolve));
  running[kind]++;
}
function release(kind: Kind) {
  running[kind]--;
  const next = waiters[kind].shift();
  if (next) next();
}

function featureName(): string {
  const prevLimit = Error.stackTraceLimit;
  Error.stackTraceLimit = 30;
  const stack = new Error().stack?.split("\n").slice(1) ?? [];
  Error.stackTraceLimit = prevLimit;
  const SKIP = /^(Promise|Array|new|Object|Timeout|Immediate|process|async|<anonymous>|Generator|Function)(?:\b|$)|guardedCreate|featureName|^Messages\.|MessageStream|APIPromise|runAsBackground/;
  let fileFallback = "";
  for (const line of stack) {
    if (/@anthropic-ai|node:internal|node_modules|AsyncLocalStorage/.test(line)) continue;
    const m = line.match(/at (?:async )?([\w$.<>]+) \(/);
    if (m && !SKIP.test(m[1])) return m[1].slice(0, 80);
    if (!fileFallback) {
      const f = line.match(/[\\/]([\w.-]+)\.(?:ts|js|mjs):\d+/);
      if (f && !/aiGuard/.test(f[1])) fileFallback = f[1];
    }
  }
  return fileFallback || "unknown";
}

function adjustParams(kind: Kind, params: any) {
  const c = cfg();
  const p = { ...params };
  if (typeof p.max_tokens === "number" && p.max_tokens > c.maxOutputTokens) p.max_tokens = c.maxOutputTokens;
  if (kind === "background" && c.backgroundModel) p.model = c.backgroundModel;
  return p;
}

// ---------- install ----------
const INSTALLED = Symbol.for("gcr.aiGuard.installed");
export function installAIGuard() {
  const Messages: any = (Anthropic as any).Messages;
  const proto = Messages?.prototype;
  if (!proto || typeof proto.create !== "function") {
    console.warn("[AIGuard] could not find Anthropic Messages.prototype.create; guard NOT installed");
    return false;
  }
  if (proto[INSTALLED]) return true;
  const originalCreate = proto.create;

  proto.create = function guardedCreate(this: any, params: any, options?: any) {
    const kind = currentKind();
    const feature = featureName();

    // Streaming: the SDK needs the original APIPromise back, so apply the checks
    // synchronously and pass through (streams are only used by the admin chat).
    if (params?.stream) {
      const blocked = checkAllowed(kind);
      if (blocked) {
        record(kind, feature, { blocked: 1 });
        warnOnce(`blocked:${kind}:${blocked}`, `blocked ${kind} call from ${feature}: ${blocked}`);
        throw new AIGuardBlockedError(blocked);
      }
      record(kind, feature, { calls: 1 });
      if (kind === "background") bgCallTimes.push(Date.now());
      return originalCreate.call(this, adjustParams(kind, params), options);
    }

    const self = this;
    return (async () => {
      await syncSpent();
      let blocked = checkAllowed(kind);
      if (blocked) {
        record(kind, feature, { blocked: 1 });
        warnOnce(`blocked:${kind}:${blocked}`, `blocked ${kind} call from ${feature}: ${blocked}`);
        throw new AIGuardBlockedError(blocked);
      }
      await acquire(kind);
      try {
        blocked = checkAllowed(kind); // re-check after waiting in the queue
        if (blocked) {
          record(kind, feature, { blocked: 1 });
          warnOnce(`blocked:${kind}:${blocked}`, `blocked ${kind} call from ${feature}: ${blocked}`);
          throw new AIGuardBlockedError(blocked);
        }
        if (kind === "background") bgCallTimes.push(Date.now());
        const p = adjustParams(kind, params);
        let res: any;
        try {
          res = await originalCreate.call(self, p, options);
        } catch (err) {
          tripBreaker(err);
          record(kind, feature, { calls: 1 });
          throw err;
        }
        const cost = estimateCostUsd(res?.model || p.model, res?.usage);
        record(kind, feature, {
          calls: 1,
          input: (res?.usage?.input_tokens || 0) + (res?.usage?.cache_creation_input_tokens || 0) + (res?.usage?.cache_read_input_tokens || 0),
          output: res?.usage?.output_tokens || 0,
          cost,
        });
        const c = cfg();
        console.log(
          `[AIGuard] ${kind} ${feature} model=${p.model} in=${res?.usage?.input_tokens ?? "?"} out=${res?.usage?.output_tokens ?? "?"} ` +
          `cost=$${cost.toFixed(4)} today=$${spent[kind].toFixed(2)}/$${c.budget[kind].toFixed(2)}`,
        );
        return res;
      } finally {
        release(kind);
      }
    })();
  };
  proto[INSTALLED] = true;
  const c = cfg();
  console.log(
    `[AIGuard] installed: enabled=${c.enabled} background=${c.backgroundEnabled} ` +
    `budget bg=$${c.budget.background}/day ui=$${c.budget.interactive}/day bgCalls/h=${c.bgCallsPerHour} ` +
    `maxOut=${c.maxOutputTokens}${c.backgroundModel ? ` bgModel=${c.backgroundModel}` : ""}`,
  );
  return true;
}

// ---------- single job runner across replicas ----------
/**
 * Runs `start` on exactly one replica, using a Postgres session advisory lock.
 * Other replicas retry every minute and take over if the leader goes away
 * (e.g. during a deploy). If the database is unreachable it fails open and runs
 * the jobs anyway, so features never silently stop.
 */
export function runOnSingleReplica(start: () => void, lockKey = 7_421_001) {
  const url = process.env.DATABASE_URL;
  if (!url) { start(); return; }
  const lockSql = postgres(url, { max: 1, idle_timeout: 0, onnotice: () => {} });
  let started = false;
  const attempt = async () => {
    if (started) return;
    try {
      const [row] = await lockSql`SELECT pg_try_advisory_lock(${lockKey}) AS locked`;
      if (row?.locked) {
        started = true;
        console.log("[AIGuard] this replica holds the background-job lock; starting jobs");
        start();
      } else {
        warnOnce("not-leader", "another replica is running background jobs; standing by", 10 * 60_000);
        setTimeout(attempt, 60_000).unref();
      }
    } catch (e) {
      console.warn(`[AIGuard] job lock unavailable (${(e as Error).message}); starting jobs anyway`);
      started = true;
      start();
    }
  };
  void attempt();
}

installAIGuard();
