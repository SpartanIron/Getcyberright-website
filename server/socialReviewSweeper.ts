import { db } from "./db";
import { socialPosts } from "@shared/schema";
import { and, eq, isNull, lt } from "drizzle-orm";
import { notifyPendingReviewQueue, executeReviewAction, notifyReactivePublished } from "./socialReviewNotifier";
import { storage } from "./storage";

let sweeperStarted = false;
let sweepInFlight = false;

// Safety cap so a backlog can never fan out into a burst of live posts in one
// cycle. Upstream generation cadence already limits how many reactive posts
// exist, but this bounds the blast radius regardless.
const AUTO_PUBLISH_MAX_PER_CYCLE = 12;

export async function sweepExpiredReviewPosts(): Promise<number> {
  const now = new Date();
  const result = await db
    .update(socialPosts)
    .set({
      status: "discarded",
      publishError: "Review window expired without admin approval",
    })
    .where(and(eq(socialPosts.status, "review_pending"), lt(socialPosts.reviewExpiresAt, now)))
    .returning({ id: socialPosts.id, title: socialPosts.contentTitle });

  if (result.length > 0) {
    console.log(`[ReviewSweeper] Discarded ${result.length} expired review_pending posts`);
  }
  return result.length;
}

// Auto-publish reactive (trend_insight) posts that pass the automatic claim
// audit + quality gate, then email a "published, here's how to pull it down"
// notice. Posts flagged at creation (auditVerdict "fail") are left untouched so
// they still surface in the human-review digest below. Posts that fail the
// re-audit are moved to "blocked" by executeReviewAction and are not retried.
export async function autoPublishPassingReactivePosts(): Promise<number> {
  let candidates: typeof socialPosts.$inferSelect[];
  try {
    candidates = await db
      .select()
      .from(socialPosts)
      .where(and(eq(socialPosts.status, "review_pending"), eq(socialPosts.contentType, "trend_insight")));
  } catch (err: any) {
    console.error("[ReviewSweeper] auto-publish query failed:", err?.message || err);
    return 0;
  }

  let published = 0;
  let processed = 0;
  for (const post of candidates) {
    if (post.auditVerdict === "fail") continue; // pre-flagged, leave for a human
    if (processed >= AUTO_PUBLISH_MAX_PER_CYCLE) break;

    // Atomic claim so overlapping cycles or multiple app instances can never
    // double-publish the same post. Only the worker that flips notified_at from
    // NULL proceeds; everyone else skips. (notified_at also keeps the post out
    // of the human-review digest, which is correct once we are publishing it.)
    let claimed: { id: string }[];
    try {
      claimed = await db
        .update(socialPosts)
        .set({ notifiedAt: new Date() })
        .where(
          and(
            eq(socialPosts.id, post.id),
            eq(socialPosts.status, "review_pending"),
            isNull(socialPosts.notifiedAt),
          ),
        )
        .returning({ id: socialPosts.id });
    } catch (err: any) {
      console.error("[ReviewSweeper] auto-publish claim failed:", err?.message || err);
      continue;
    }
    if (claimed.length === 0) continue; // another worker already claimed it

    processed++;
    try {
      const result = await executeReviewAction(post.id, "approve");
      if (result.ok) {
        const updated = await storage.getSocialPostById(post.id);
        if (updated && updated.status === "published") {
          published++;
          await notifyReactivePublished(updated).catch((e: any) =>
            console.error("[ReviewSweeper] published-notice failed:", e?.message || e),
          );
          console.log(`[ReviewSweeper] Auto-published reactive post "${post.contentTitle}" (${post.platform})`);
        }
      } else {
        console.warn(
          `[ReviewSweeper] Reactive post not auto-published "${post.contentTitle}" (${post.platform}): ${result.message}`,
        );
      }
    } catch (err: any) {
      console.error("[ReviewSweeper] auto-publish failed:", err?.message || err);
    }
  }
  return published;
}

async function runSweepCycle() {
  // Single-flight guard: if a previous cycle is still running (e.g. a slow Buffer
  // publish ran longer than the interval), skip rather than overlap. Overlapping
  // cycles are the most likely way the same post could be processed twice.
  if (sweepInFlight) {
    console.log("[ReviewSweeper] previous cycle still running, skipping this tick");
    return;
  }
  sweepInFlight = true;
  try {
    try {
      await sweepExpiredReviewPosts();
    } catch (err: any) {
      console.error("[ReviewSweeper] sweep failed:", err?.message || err);
    }
    try {
      await autoPublishPassingReactivePosts();
    } catch (err: any) {
      console.error("[ReviewSweeper] auto-publish cycle failed:", err?.message || err);
    }
    try {
      await notifyPendingReviewQueue();
    } catch (err: any) {
      console.error("[ReviewSweeper] notify failed:", err?.message || err);
    }
  } finally {
    sweepInFlight = false;
  }
}

export function startReviewSweeper(intervalMs = 5 * 60 * 1000) {
  if (sweeperStarted) return;
  sweeperStarted = true;
  console.log(`[ReviewSweeper] Started, sweeping every ${intervalMs / 1000}s`);
  runSweepCycle();
  setInterval(runSweepCycle, intervalMs);
}
