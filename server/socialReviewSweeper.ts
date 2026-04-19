import { db } from "./db";
import { socialPosts } from "@shared/schema";
import { and, eq, lt } from "drizzle-orm";
import { notifyPendingReviewQueue } from "./socialReviewNotifier";

let sweeperStarted = false;

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

async function runSweepCycle() {
  try {
    await sweepExpiredReviewPosts();
  } catch (err: any) {
    console.error("[ReviewSweeper] sweep failed:", err?.message || err);
  }
  try {
    await notifyPendingReviewQueue();
  } catch (err: any) {
    console.error("[ReviewSweeper] notify failed:", err?.message || err);
  }
}

export function startReviewSweeper(intervalMs = 5 * 60 * 1000) {
  if (sweeperStarted) return;
  sweeperStarted = true;
  console.log(`[ReviewSweeper] Started, sweeping every ${intervalMs / 1000}s`);
  runSweepCycle();
  setInterval(runSweepCycle, intervalMs);
}
