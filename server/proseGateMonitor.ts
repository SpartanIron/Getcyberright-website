// Prose-gate monitor.
//
// Background watcher that samples recently-persisted social posts (drafts +
// blocked) and re-runs them through `auditPostContent`, isolating posts whose
// only remaining audit failures come from the new plain-prose grounding gate
// (added in task #26). Surfacing these gives admins:
//
//   1. Aggregate FP / TP stats — how often the prose gate alone is blocking
//      otherwise-passing posts.
//   2. A queue of "suspect" blocked posts to triage. Admins can confirm a
//      false-positive (which clears the block back to `draft` so the normal
//      review/publish flow can take over) or confirm a true-positive (kept
//      blocked).
//
// The signature of a prose-gate failure is well-known: `kind === "phrase"`
// AND `reason.startsWith("Plain-prose claim lacks source support")`. Other
// `phrase` failures (forbidden vague-attribution phrases) are kept distinct.

import { storage } from "./storage";
import type { SocialPost } from "@shared/schema";
import { auditPostContent, type AuditFailure, type ClaimAuditResult } from "./socialClaimAuditor";
import { stripCitationReceipt } from "./socialCitationReceipt";
import { buildGuideBundle, buildAlertBundle, buildScamBundle, type SourceBundle } from "./socialSourceBundle";

export type ProseGateClassification =
  | "prose_only_block"   // Re-audit fails AND every failure is from the prose gate.
  | "mixed_block"        // Re-audit fails; prose gate contributes alongside other failures.
  | "non_prose_block"    // Re-audit fails; no prose-gate failure (other extractor caught it).
  | "would_pass_now"     // Was blocked, but re-audit passes (e.g. source bundle changed).
  | "clean_pass"         // Draft / non-blocked status whose re-audit still passes.
  | "no_bundle"          // Bundle could not be rebuilt — cannot re-audit.
  | "unaudited";         // Skipped (legacy post with no auditVerdict, etc.).

export interface ProseGateSuspect {
  postId: string;
  contentTitle: string;
  contentType: string;
  contentId: string | null;
  platform: string;
  status: string;
  classification: ProseGateClassification;
  reAuditVerdict: "pass" | "fail";
  proseFailures: AuditFailure[];
  otherFailures: AuditFailure[];
  postContent: string;
  acknowledgedAt: string | null;
  acknowledgedAs: "false_positive" | "true_positive" | null;
  createdAt: string | null;
}

export interface ProseGateAuditStats {
  lastRunAt: string | null;
  sampleSize: number;
  sampled: number;
  classifications: Record<ProseGateClassification, number>;
  // FP estimate: of all re-audited blocked posts, what fraction is the prose
  // gate solely responsible for blocking.
  blockedSampled: number;
  proseOnlyBlockedCount: number;
  estimatedProseFalsePositiveRate: number; // proseOnlyBlockedCount / blockedSampled (0..1)
  // Confirmed-by-admin breakdown.
  acknowledgedFalsePositives: number;
  acknowledgedTruePositives: number;
}

interface MonitorState {
  lastRunAt: string | null;
  lastStats: ProseGateAuditStats;
  suspects: Map<string, ProseGateSuspect>;
}

const EMPTY_STATS: ProseGateAuditStats = {
  lastRunAt: null,
  sampleSize: 0,
  sampled: 0,
  classifications: {
    prose_only_block: 0,
    mixed_block: 0,
    non_prose_block: 0,
    would_pass_now: 0,
    clean_pass: 0,
    no_bundle: 0,
    unaudited: 0,
  },
  blockedSampled: 0,
  proseOnlyBlockedCount: 0,
  estimatedProseFalsePositiveRate: 0,
  acknowledgedFalsePositives: 0,
  acknowledgedTruePositives: 0,
};

const state: MonitorState = {
  lastRunAt: null,
  lastStats: { ...EMPTY_STATS, classifications: { ...EMPTY_STATS.classifications } },
  suspects: new Map(),
};

let schedulerStarted = false;

function toIsoOrNull(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed.toISOString();
  }
  return null;
}

function isProseGateFailure(f: AuditFailure): boolean {
  return f.kind === "phrase" && typeof f.reason === "string" && f.reason.startsWith("Plain-prose claim lacks source support");
}

function partitionFailures(audit: ClaimAuditResult): { prose: AuditFailure[]; other: AuditFailure[] } {
  const prose: AuditFailure[] = [];
  const other: AuditFailure[] = [];
  for (const f of audit.failures) {
    if (isProseGateFailure(f)) prose.push(f);
    else other.push(f);
  }
  return { prose, other };
}

async function rebuildBundle(post: SocialPost): Promise<SourceBundle | null> {
  try {
    if (!post.contentId) return null;
    if (post.contentType === "guide") {
      const g = await storage.getGuideById(post.contentId);
      return g ? buildGuideBundle(g) : null;
    }
    if (post.contentType === "threat_alert") {
      const a = await storage.getThreatAlertById(post.contentId);
      return a ? buildAlertBundle(a) : null;
    }
    if (post.contentType === "scam_intel") {
      const s = await storage.getScamIntelById(post.contentId);
      return s ? buildScamBundle(s) : null;
    }
    // trend_insight + others: bundle was transient; reconstruct from persisted
    // citations + extractedClaims when possible.
    const citations = (post.citations || []) as SourceBundle["citations"];
    const claims = (post.extractedClaims || []) as { text?: string; context?: string }[];
    if (!citations || citations.length === 0) return null;
    return {
      recordId: post.contentId || post.id,
      recordType: post.contentType || "unknown",
      title: post.contentTitle,
      canonicalUrl: citations[0]?.url || "",
      category: post.contentType || "unknown",
      citations,
      allowedClaims: claims.map((c) => String(c?.text ?? "").trim()).filter(Boolean),
      contextForLLM: claims.map((c) => String(c?.context ?? "").trim()).filter(Boolean).join(" "),
    };
  } catch {
    return null;
  }
}

function classify(post: SocialPost, audit: ClaimAuditResult): ProseGateClassification {
  const { prose, other } = partitionFailures(audit);
  if (audit.verdict === "pass") {
    return post.status === "blocked" ? "would_pass_now" : "clean_pass";
  }
  if (prose.length > 0 && other.length === 0) return "prose_only_block";
  if (prose.length > 0 && other.length > 0) return "mixed_block";
  return "non_prose_block";
}

export interface RunOptions {
  sampleSize?: number;
  // When true, mutates the in-memory suspect list. Internal scheduled runs
  // pass true; ad-hoc API queries also pass true so admins see fresh data.
  mutateSuspects?: boolean;
}

export async function runProseGateAudit(opts: RunOptions = {}): Promise<ProseGateAuditStats> {
  const sampleSize = Math.max(10, Math.min(opts.sampleSize ?? 100, 500));
  const mutate = opts.mutateSuspects !== false;

  // Sample the last N posts split across the two statuses we care about:
  // blocked (to measure FP rate) and draft (to measure clean-pass continuity).
  // Pull each status separately because storage.getSocialPosts only filters
  // by single status.
  const halfBlocked = Math.ceil(sampleSize / 2);
  const halfDrafts = sampleSize - halfBlocked;
  const [blocked, drafts] = await Promise.all([
    storage.getSocialPosts("blocked", halfBlocked),
    storage.getSocialPosts("draft", halfDrafts),
  ]);

  const sample: SocialPost[] = [...blocked, ...drafts];

  const classifications: Record<ProseGateClassification, number> = {
    prose_only_block: 0,
    mixed_block: 0,
    non_prose_block: 0,
    would_pass_now: 0,
    clean_pass: 0,
    no_bundle: 0,
    unaudited: 0,
  };

  const freshSuspects = new Map<string, ProseGateSuspect>();
  // Denominator for the FP rate: blocked posts that were actually re-audited
  // (bundle rebuilt + audit ran). Excludes no_bundle / unaudited so the rate
  // is not understated by skipped posts.
  let blockedReAuditedCount = 0;
  // Numerator: of those, how many had only prose-gate failures.
  let blockedProseOnlyCount = 0;

  for (const post of sample) {
    const bundle = await rebuildBundle(post);
    if (!bundle) {
      classifications.no_bundle++;
      continue;
    }
    let audit: ClaimAuditResult;
    try {
      audit = auditPostContent(stripCitationReceipt(post.postContent || ""), bundle);
    } catch {
      classifications.unaudited++;
      continue;
    }
    if (post.status === "blocked") blockedReAuditedCount++;
    const cls = classify(post, audit);
    classifications[cls]++;
    if (post.status === "blocked" && cls === "prose_only_block") {
      blockedProseOnlyCount++;
    }

    // Surface anything where the prose gate is implicated and the post is
    // currently blocked. Admins use this list to triage.
    if ((cls === "prose_only_block" || cls === "would_pass_now") && post.status === "blocked") {
      const { prose, other } = partitionFailures(audit);
      const prior = state.suspects.get(post.id);
      const suspect: ProseGateSuspect = {
        postId: post.id,
        contentTitle: post.contentTitle,
        contentType: post.contentType,
        contentId: post.contentId || null,
        platform: post.platform,
        status: post.status,
        classification: cls,
        reAuditVerdict: audit.verdict,
        proseFailures: prose,
        otherFailures: other,
        postContent: post.postContent || "",
        acknowledgedAt: prior?.acknowledgedAt ?? null,
        acknowledgedAs: prior?.acknowledgedAs ?? null,
        createdAt: toIsoOrNull(post.createdAt),
      };
      freshSuspects.set(post.id, suspect);
    }
  }

  // Carry forward any acknowledged suspects that fell out of the sample so
  // the admin's TP/FP audit trail is preserved.
  if (mutate) {
    for (const [id, prior] of state.suspects.entries()) {
      if (!freshSuspects.has(id) && prior.acknowledgedAt) {
        freshSuspects.set(id, prior);
      }
    }
    state.suspects = freshSuspects;
  }

  let acknowledgedFalsePositives = 0;
  let acknowledgedTruePositives = 0;
  for (const s of state.suspects.values()) {
    if (s.acknowledgedAs === "false_positive") acknowledgedFalsePositives++;
    if (s.acknowledgedAs === "true_positive") acknowledgedTruePositives++;
  }

  const stats: ProseGateAuditStats = {
    lastRunAt: new Date().toISOString(),
    sampleSize,
    sampled: sample.length,
    classifications,
    blockedSampled: blockedReAuditedCount,
    proseOnlyBlockedCount: blockedProseOnlyCount,
    estimatedProseFalsePositiveRate:
      blockedReAuditedCount > 0 ? blockedProseOnlyCount / blockedReAuditedCount : 0,
    acknowledgedFalsePositives,
    acknowledgedTruePositives,
  };

  if (mutate) {
    state.lastRunAt = stats.lastRunAt;
    state.lastStats = stats;
  }

  return stats;
}

export function getProseGateStats(): ProseGateAuditStats {
  return state.lastStats;
}

export function getProseGateSuspects(): ProseGateSuspect[] {
  return Array.from(state.suspects.values()).sort((a, b) => {
    // Unacknowledged first, newest first.
    if (!a.acknowledgedAt && b.acknowledgedAt) return -1;
    if (a.acknowledgedAt && !b.acknowledgedAt) return 1;
    const aT = a.createdAt ? Date.parse(a.createdAt) : 0;
    const bT = b.createdAt ? Date.parse(b.createdAt) : 0;
    return bT - aT;
  });
}

export async function acknowledgeSuspect(
  postId: string,
  asKind: "false_positive" | "true_positive",
): Promise<{ ok: boolean; error?: string; suspect?: ProseGateSuspect }> {
  const suspect = state.suspects.get(postId);
  if (!suspect) return { ok: false, error: "Suspect not found in current sample. Re-run the audit first." };

  suspect.acknowledgedAt = new Date().toISOString();
  suspect.acknowledgedAs = asKind;

  if (asKind === "false_positive") {
    // Release the block back to draft so the normal review/publish flow takes
    // over. We tag the verdict so the audit log shows admin intervention.
    try {
      await storage.updateSocialPost(postId, {
        status: "draft",
        auditVerdict: "prose_gate_false_positive",
        publishError: null,
      });
      // Keep the in-memory snapshot consistent with the DB so the admin UI
      // doesn't show a stale "blocked" badge until the next scheduled run.
      suspect.status = "draft";
    } catch (err: any) {
      return { ok: false, error: err?.message || "Failed to release block" };
    }
  } else {
    // True positive — keep blocked, just record the confirmation.
    try {
      await storage.updateSocialPost(postId, {
        auditVerdict: "prose_gate_true_positive",
      });
    } catch {
      // Non-fatal; in-memory state still records the acknowledgement.
    }
  }

  state.suspects.set(postId, suspect);

  // Refresh aggregate stats to reflect the new acknowledgements without
  // requiring a full re-sample.
  let fp = 0, tp = 0;
  for (const s of state.suspects.values()) {
    if (s.acknowledgedAs === "false_positive") fp++;
    if (s.acknowledgedAs === "true_positive") tp++;
  }
  state.lastStats = { ...state.lastStats, acknowledgedFalsePositives: fp, acknowledgedTruePositives: tp };

  return { ok: true, suspect };
}

export function startProseGateMonitor(intervalMs = 6 * 60 * 60 * 1000) {
  if (schedulerStarted) return;
  schedulerStarted = true;
  console.log(`[ProseGateMonitor] Started, sampling every ${Math.round(intervalMs / 60000)} min`);
  const tick = async () => {
    try {
      const stats = await runProseGateAudit({ sampleSize: 150, mutateSuspects: true });
      console.log(
        `[ProseGateMonitor] sampled=${stats.sampled} blocked=${stats.blockedSampled} ` +
          `prose_only=${stats.proseOnlyBlockedCount} ` +
          `fp_rate=${(stats.estimatedProseFalsePositiveRate * 100).toFixed(1)}%`,
      );
    } catch (err: any) {
      console.error("[ProseGateMonitor] run failed:", err?.message || err);
    }
  };
  // Delay the first run so app boot stays fast.
  setTimeout(tick, 60 * 1000);
  setInterval(tick, intervalMs);
}
