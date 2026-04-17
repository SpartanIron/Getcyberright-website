import crypto from "crypto";
import fs from "fs";
import path from "path";

export interface FreshnessRecord {
  url: string;
  publisher: string;
  country?: string;
  citationName?: string;
  tier?: "A" | "B" | "C";
  lastCheckedAt: string;
  lastSuccessAt?: string;
  contentHash?: string;
  status: "fresh" | "stale" | "unreachable" | "unverified";
  httpStatus?: number;
  changedAt?: string;
  notes?: string;
}

const STATE_FILE = path.join(process.cwd(), "data", "source-freshness.json");
const CHECK_TIMEOUT_MS = 12000;
const CHECK_USER_AGENT = "GetCyberRight-FreshnessMonitor/1.0 (+https://www.getcyberright.com/scam-intelligence/methodology)";

let state: Map<string, FreshnessRecord> = new Map();
let lastRunAt: string | null = null;
let lastRunSummary: { total: number; fresh: number; stale: number; unreachable: number; unverified: number } | null = null;
let monitorInterval: NodeJS.Timeout | null = null;
let startupTimeout: NodeJS.Timeout | null = null;
let runInFlight = false;

function ensureDataDir() {
  try { fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true }); } catch {}
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, "utf8");
      const parsed = JSON.parse(raw) as { records?: FreshnessRecord[]; lastRunAt?: string; lastRunSummary?: any };
      state = new Map((parsed.records || []).map(r => [r.url, r]));
      lastRunAt = parsed.lastRunAt || null;
      lastRunSummary = parsed.lastRunSummary || null;
    }
  } catch (err: any) {
    console.warn("[freshness] failed to load state:", err?.message);
  }
}

function persistState() {
  ensureDataDir();
  try {
    const payload = {
      lastRunAt,
      lastRunSummary,
      records: Array.from(state.values()),
    };
    const tmp = STATE_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2));
    fs.renameSync(tmp, STATE_FILE);
  } catch (err: any) {
    console.warn("[freshness] failed to persist state:", err?.message);
  }
}

async function checkUrl(record: Pick<FreshnessRecord, "url" | "publisher" | "country" | "citationName" | "tier">): Promise<FreshnessRecord> {
  const url = record.url;
  const now = new Date().toISOString();
  const prev = state.get(url);
  const base: FreshnessRecord = {
    ...record,
    lastCheckedAt: now,
    status: prev?.status || "unverified",
    contentHash: prev?.contentHash,
    lastSuccessAt: prev?.lastSuccessAt,
    httpStatus: prev?.httpStatus,
    changedAt: prev?.changedAt,
    notes: prev?.notes,
  };

  if (!url || !/^https?:\/\//i.test(url)) {
    base.status = "unverified";
    base.notes = "No verifiable URL on record";
    return base;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "user-agent": CHECK_USER_AGENT, "accept": "text/html,application/xhtml+xml,application/pdf,*/*" },
      signal: controller.signal,
    });

    base.httpStatus = res.status;
    if (!res.ok) {
      base.status = "unreachable";
      base.notes = `HTTP ${res.status}`;
      return base;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    base.lastSuccessAt = now;

    if (prev?.contentHash && prev.contentHash !== hash) {
      base.status = "stale";
      base.changedAt = now;
      base.notes = "Publisher page changed since last verification; re-verify citation.";
      console.warn(`[freshness] CHANGE DETECTED publisher=${record.publisher} url=${url}`);
    } else if (!prev?.contentHash) {
      base.status = "fresh";
      base.notes = "Initial baseline captured";
    } else {
      base.status = prev.status === "stale" ? "stale" : "fresh";
      base.changedAt = prev.changedAt;
      base.notes = prev.status === "stale" ? prev.notes : undefined;
    }
    base.contentHash = hash;
    return base;
  } catch (err: any) {
    base.status = "unreachable";
    base.notes = err?.name === "AbortError" ? "Request timed out" : (err?.message || "Fetch failed");
    return base;
  } finally {
    clearTimeout(timeout);
  }
}

export async function runFreshnessCheck(citations: Array<{ url: string; publisher: string; country?: string; citationName?: string; tier?: "A" | "B" | "C" }>): Promise<{ total: number; fresh: number; stale: number; unreachable: number; unverified: number }> {
  if (runInFlight) {
    console.log("[freshness] run already in progress; skipping overlapping invocation");
    return lastRunSummary || { total: 0, fresh: 0, stale: 0, unreachable: 0, unverified: 0 };
  }
  runInFlight = true;
  try {
  const checks = await Promise.allSettled(citations.map(c => checkUrl(c)));
  const summary = { total: 0, fresh: 0, stale: 0, unreachable: 0, unverified: 0 };
  for (const result of checks) {
    if (result.status !== "fulfilled") continue;
    const rec = result.value;
    state.set(rec.url, rec);
    summary.total += 1;
    summary[rec.status] += 1;
  }
  lastRunAt = new Date().toISOString();
  lastRunSummary = summary;
  persistState();
  console.log(`[freshness] check complete: ${JSON.stringify(summary)}`);
  return summary;
  } finally {
    runInFlight = false;
  }
}

export function getFreshnessSnapshot() {
  return {
    lastRunAt,
    lastRunSummary,
    records: Array.from(state.values()).sort((a, b) => {
      const order: Record<string, number> = { stale: 0, unreachable: 1, unverified: 2, fresh: 3 };
      const oa = order[a.status] ?? 9;
      const ob = order[b.status] ?? 9;
      if (oa !== ob) return oa - ob;
      return a.publisher.localeCompare(b.publisher);
    }),
  };
}

export function startFreshnessMonitor(getCitations: () => Array<{ url: string; publisher: string; country?: string; citationName?: string; tier?: "A" | "B" | "C" }>, intervalMs = 24 * 60 * 60 * 1000) {
  loadState();
  if (monitorInterval) clearInterval(monitorInterval);
  if (startupTimeout) clearTimeout(startupTimeout);
  const tick = () => {
    runFreshnessCheck(getCitations()).catch(err => console.error("[freshness] tick failed:", err?.message));
  };
  startupTimeout = setTimeout(tick, 30 * 1000);
  monitorInterval = setInterval(tick, intervalMs);
  console.log(`[freshness] monitor started, interval=${intervalMs / 1000}s`);
}

export function stopFreshnessMonitor() {
  if (monitorInterval) clearInterval(monitorInterval);
  if (startupTimeout) clearTimeout(startupTimeout);
  monitorInterval = null;
  startupTimeout = null;
}
