import { storage } from "./storage";
import { runContentAutomationBatch, getContentAutomationStats, optimizeGuideInternalLinks } from "./contentAutomationService";
import { distributeGuideContent, distributeThreatAlertContent, getSocialDistributionStats } from "./socialDistributionService";
import { isBufferConfigured, publishAllDraftsViaBuffer } from "./bufferPublisher";
import { generateAndPublishTrendAwarePosts, isWithinAnyPostingWindow } from "./trendAwareSocialEngine";
import { checkAndGenerateSeriesPosts } from "./contentSeriesEngine";
import type { InsertGrowthTask } from "@shared/schema";

const TASK_TYPES = {
  GENERATE_ARTICLES: "generate_articles",
  GENERATE_SCAM_PAGE: "generate_scam_page",
  GENERATE_THREAT_ALERT: "generate_threat_alert",
  DISTRIBUTE_SOCIAL: "distribute_social",
  SEND_EMAIL_ALERT: "send_email_alert",
  OPTIMIZE_LINKS: "optimize_internal_links",
  RECORD_METRICS: "record_platform_metrics",
  REFRESH_THREAT_FEEDS: "refresh_threat_feeds",
  AUTO_PUBLISH: "auto_publish",
} as const;

import * as fs from "fs";
import * as path from "path";

const SETTINGS_FILE = path.join(process.cwd(), ".local", "orchestrator-settings.json");

function loadAutoPublishSetting(): boolean {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
      return data.autoPublishEnabled !== false;
    }
    return true;
  } catch {
    return true;
  }
}

function saveAutoPublishSetting(enabled: boolean): void {
  try {
    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ autoPublishEnabled: enabled }, null, 2));
  } catch (err: any) {
    console.error("[GrowthOrchestrator] Failed to save auto-publish setting:", err.message);
  }
}

let autoPublishEnabled = true;

async function executeTask(taskId: string, taskType: string, payload: Record<string, unknown> | null): Promise<Record<string, unknown>> {
  switch (taskType) {
    case TASK_TYPES.GENERATE_ARTICLES: {
      const count = (payload?.count as number) || 3;
      const ids = await runContentAutomationBatch(count);
      return { generatedCount: ids.length, guideIds: ids, status: "drafts_created" };
    }

    case TASK_TYPES.DISTRIBUTE_SOCIAL: {
      const contentType = payload?.contentType as string;
      const contentId = payload?.contentId as string;
      if (contentType === "guide") {
        const guide = await storage.getGuideById(contentId);
        if (guide) {
          const postIds = await distributeGuideContent(guide);
          return { postsCreated: postIds.length };
        }
      } else if (contentType === "threat_alert") {
        const alert = await storage.getThreatAlertById(contentId);
        if (alert) {
          const postIds = await distributeThreatAlertContent(alert);
          return { postsCreated: postIds.length };
        }
      }
      return { error: "Content not found" };
    }

    case TASK_TYPES.OPTIMIZE_LINKS: {
      const guideId = payload?.guideId as string;
      if (guideId) {
        await optimizeGuideInternalLinks(guideId);
        return { optimized: true };
      }
      return { error: "No guide ID" };
    }

    case TASK_TYPES.RECORD_METRICS: {
      const stats = await collectPlatformMetrics();
      await storage.recordPlatformMetrics(stats);
      return stats;
    }

    case TASK_TYPES.AUTO_PUBLISH: {
      if (!autoPublishEnabled) {
        return { skipped: true, reason: "Auto-publish disabled" };
      }
      const maxPublish = (payload?.count as number) || 3;
      const allDrafts = await storage.getAllGuides("draft");
      const draftGuides = allDrafts.slice(0, maxPublish);
      let published = 0;
      for (const guide of draftGuides) {
        try {
          await storage.updateGuide(guide.id, { status: "published", publishedAt: new Date() } as any);
          await distributeGuideContent(guide);
          published++;
          console.log(`[GrowthOrchestrator] Auto-published guide: "${guide.title}"`);
        } catch (err: any) {
          console.error(`[GrowthOrchestrator] Failed to auto-publish guide ${guide.id}:`, err.message);
        }
      }
      await publishAllDraftsViaBuffer();
      return { published, total: draftGuides.length };
    }

    default:
      return { error: `Unknown task type: ${taskType}` };
  }
}

export async function scheduleTask(
  taskType: string,
  taskName: string,
  payload?: Record<string, unknown>,
  scheduledAt?: Date,
  priority?: string
): Promise<string> {
  const task: InsertGrowthTask = {
    taskType,
    taskName,
    status: "pending",
    priority: priority || "normal",
    payload: payload || {},
    scheduledAt: scheduledAt || new Date(),
    maxRetries: 3,
  };

  const created = await storage.createGrowthTask(task);
  console.log(`[GrowthOrchestrator] Scheduled task: ${taskName} (${taskType})`);
  return created.id;
}

export async function processPendingTasks(batchSize = 5): Promise<number> {
  const tasks = await storage.getPendingGrowthTasks();
  const now = new Date();
  const ready = tasks.filter((t) => !t.scheduledAt || new Date(t.scheduledAt) <= now);
  const batch = ready.slice(0, batchSize);

  let completed = 0;

  for (const task of batch) {
    try {
      await storage.updateGrowthTask(task.id, {
        status: "running",
        startedAt: new Date(),
      });

      const result = await executeTask(
        task.id,
        task.taskType,
        task.payload as Record<string, unknown> | null
      );

      if (result.error) {
        throw new Error(result.error as string);
      }

      await storage.updateGrowthTask(task.id, {
        status: "completed",
        completedAt: new Date(),
        result,
      });
      completed++;
    } catch (error: any) {
      const retryCount = (task.retryCount || 0) + 1;
      const maxRetries = task.maxRetries || 3;

      await storage.updateGrowthTask(task.id, {
        status: retryCount >= maxRetries ? "failed" : "pending",
        errorMessage: error.message || "Unknown error",
        retryCount,
      });

      console.error(`[GrowthOrchestrator] Task failed: ${task.taskName}`, error.message);
    }
  }

  if (completed > 0) {
    console.log(`[GrowthOrchestrator] Processed ${completed}/${batch.length} tasks`);
  }

  return completed;
}

export async function scheduleWeeklyContentGeneration(): Promise<void> {
  const days = [1, 3, 5];
  const now = new Date();
  const currentDay = now.getDay();

  for (const day of days) {
    if (currentDay === day) {
      const allRecentTasks = await storage.getGrowthTasks(undefined, 20);
      const todayTasks = allRecentTasks.filter(t => {
        const created = new Date(t.createdAt);
        return created.getFullYear() === now.getFullYear() &&
               created.getMonth() === now.getMonth() &&
               created.getDate() === now.getDate();
      });

      const hasArticleTask = todayTasks.some(t => t.taskType === TASK_TYPES.GENERATE_ARTICLES);
      const hasPublishTask = todayTasks.some(t => t.taskType === TASK_TYPES.AUTO_PUBLISH);

      if (!hasArticleTask) {
        await scheduleTask(
          TASK_TYPES.GENERATE_ARTICLES,
          `Weekly article generation (Day ${day})`,
          { count: 2 },
          undefined,
          "high"
        );
      }

      if (autoPublishEnabled && !hasPublishTask) {
        await scheduleTask(
          TASK_TYPES.AUTO_PUBLISH,
          `Auto-publish drafts (Day ${day})`,
          { count: 3 },
          undefined,
          "normal"
        );
      }
    }
  }
}

export function setAutoPublish(enabled: boolean): void {
  autoPublishEnabled = enabled;
  saveAutoPublishSetting(enabled);
  console.log(`[GrowthOrchestrator] Auto-publish ${enabled ? "enabled" : "disabled"} (persisted)`);
}

export function getAutoPublishStatus(): boolean {
  return autoPublishEnabled;
}

export async function scheduleDailyMetrics(): Promise<void> {
  await scheduleTask(
    TASK_TYPES.RECORD_METRICS,
    "Daily platform metrics snapshot",
    {},
    undefined,
    "low"
  );
}

async function collectPlatformMetrics(): Promise<Record<string, number>> {
  const contentStats = await getContentAutomationStats();
  const socialStats = await getSocialDistributionStats();
  const scamCount = await storage.getScamIntelCount("published");
  const alertCount = await storage.getThreatAlertCount("published");

  return {
    articlesPublished: contentStats.publishedGuides,
    keywordsCovered: contentStats.totalKeywords - contentStats.unusedHighPriorityKeywords,
    scamPagesGenerated: scamCount,
    alertsGenerated: alertCount,
    socialPostsCreated: socialStats.totalPosts,
  };
}

export async function getOrchestratorDashboard() {
  const contentStats = await getContentAutomationStats();
  const socialStats = await getSocialDistributionStats();
  const recentTasks = await storage.getGrowthTasks(undefined, 20);
  const pendingTasks = await storage.getPendingGrowthTasks();
  const metrics = await storage.getLatestPlatformMetrics(30);
  const scamIntelCount = await storage.getScamIntelCount();
  const alertCount = await storage.getThreatAlertCount();

  const taskStatusCounts: Record<string, number> = {};
  for (const task of recentTasks) {
    taskStatusCounts[task.status] = (taskStatusCounts[task.status] || 0) + 1;
  }

  return {
    content: contentStats,
    social: socialStats,
    scamIntelligence: {
      total: scamIntelCount,
      published: await storage.getScamIntelCount("published"),
    },
    threatAlerts: {
      total: alertCount,
      published: await storage.getThreatAlertCount("published"),
    },
    orchestrator: {
      pendingTasks: pendingTasks.length,
      recentTasks: recentTasks.slice(0, 10),
      taskStatusCounts,
    },
    metrics: metrics.slice(0, 7),
  };
}

function getTodayET(): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const get = (type: string) => parts.find(p => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function toETDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

async function allPlatformsPublishedToday(): Promise<boolean> {
  try {
    const { getBufferChannelsByPlatform } = await import("./bufferPublisher");
    const channels = await getBufferChannelsByPlatform();
    const connectedPlatforms = Object.keys(channels);
    if (connectedPlatforms.length === 0) return false;

    const recentPosts = await storage.getSocialPosts("published", 200);
    const todayET = getTodayET();
    const platformCounts: Record<string, number> = {};
    for (const post of recentPosts) {
      if (!post.publishedAt) continue;
      const postDateET = toETDateString(new Date(post.publishedAt));
      if (postDateET !== todayET) continue;
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    }

    const DAILY_LIMIT = 2;
    const allDone = connectedPlatforms.every(p => (platformCounts[p] || 0) >= DAILY_LIMIT);
    if (allDone) {
      console.log(`[GrowthOrchestrator] All connected platforms (${connectedPlatforms.join(", ")}) at daily limit (${DAILY_LIMIT}/day) for ${todayET} ET`);
    }
    return allDone;
  } catch {
    return false;
  }
}

async function expireStaleDrafts(): Promise<number> {
  try {
    const drafts = await storage.getSocialPosts("draft", 200);
    const now = Date.now();
    let expired = 0;

    for (const draft of drafts) {
      if (!draft.createdAt) continue;
      const ageHours = (now - new Date(draft.createdAt).getTime()) / 3600000;

      const isReactive = draft.contentType === "trend_insight";
      const isNewsEditorial = draft.contentType === "news_article";

      const todayET = getTodayET();
      const draftDateET = draft.createdAt ? toETDateString(new Date(draft.createdAt)) : "";
      const isSameDay = todayET === draftDateET;

      let shouldExpire = false;
      let reason = "";

      if (isReactive && !isSameDay) {
        shouldExpire = true;
        reason = "reactive post older than same day";
      } else if (isNewsEditorial && ageHours > 48) {
        shouldExpire = true;
        reason = "news editorial post older than 48 hours";
      }

      if (shouldExpire) {
        await storage.updateSocialPost(draft.id, {
          status: "failed",
          publishError: `Auto-expired: ${reason}`,
        });
        expired++;
        console.log(`[ContentTier] Expired draft "${draft.contentTitle}" on ${draft.platform}: ${reason}`);
      }
    }

    if (expired > 0) {
      console.log(`[ContentTier] Expired ${expired} stale drafts`);
    }
    return expired;
  } catch (err: any) {
    console.error("[ContentTier] Error expiring stale drafts:", err.message);
    return 0;
  }
}

async function getContentTierCounts(): Promise<{ reactive: number; guide: number; newsEditorial: number; total: number }> {
  const recentPosts = await storage.getSocialPosts("published", 200);
  const sevenDaysAgo = Date.now() - 7 * 86400000;

  let reactive = 0, guide = 0, newsEditorial = 0;
  for (const post of recentPosts) {
    if (!post.publishedAt || new Date(post.publishedAt).getTime() < sevenDaysAgo) continue;
    if (post.contentType === "trend_insight") reactive++;
    else if (post.contentType === "news_article") newsEditorial++;
    else guide++;
  }

  const total = reactive + guide + newsEditorial;
  return { reactive, guide, newsEditorial, total };
}

function selectContentTier(counts: { reactive: number; guide: number; newsEditorial: number; total: number }): "reactive" | "guide" | "news_editorial" {
  if (counts.total < 3) return "guide";

  const reactivePct = (counts.reactive / counts.total) * 100;
  const guidePct = (counts.guide / counts.total) * 100;
  const newsPct = (counts.newsEditorial / counts.total) * 100;

  if (guidePct < 45) return "guide";
  if (reactivePct < 25) return "reactive";
  if (newsPct < 15) return "news_editorial";

  if (guidePct < 55) return "guide";
  if (newsPct < 22) return "news_editorial";
  return "reactive";
}

async function checkBreakingNews(): Promise<void> {
  if (!isBufferConfigured()) return;

  try {
    const recentAlerts = await storage.getPublishedThreatAlerts(undefined, 10);
    const oneHourAgo = Date.now() - 60 * 60 * 1000;

    for (const alert of recentAlerts) {
      const alertTime = new Date(alert.publishedAt || alert.dateDetected).getTime();
      if (alertTime < oneHourAgo) continue;

      const severity = (alert.riskLevel || "").toLowerCase();
      if (severity !== "critical" && severity !== "high") continue;

      const existingPosts = await storage.getSocialPostsByContentId("threat_alert", alert.id);
      if (existingPosts.length > 0) continue;

      console.log(`[BreakingNews] Critical alert detected: "${alert.threatName}" (${severity}). Publishing bonus post.`);

      try {
        const { distributeThreatAlertContent } = await import("./socialDistributionService");
        await distributeThreatAlertContent(alert);

        const breakingDrafts = await storage.getSocialPosts("draft", 20);
        const alertDrafts = breakingDrafts.filter(d =>
          d.contentType === "threat_alert" && d.contentId === alert.id
        );

        if (alertDrafts.length > 0) {
          const { publishPostViaBuffer } = await import("./bufferPublisher");
          for (const draft of alertDrafts) {
            try {
              await publishPostViaBuffer(draft.id);
            } catch (pubErr: any) {
              console.warn(`[BreakingNews] Failed to publish ${draft.platform} draft: ${pubErr.message}`);
            }
          }
          console.log(`[BreakingNews] Breaking news published for: "${alert.threatName}" (${alertDrafts.length} posts)`);
        }
      } catch (err: any) {
        console.error(`[BreakingNews] Failed to publish breaking news: ${err.message}`);
      }
    }
  } catch (error: any) {
    console.error(`[BreakingNews] Check failed: ${error.message}`);
  }
}

async function dailySocialPublish(): Promise<void> {
  if (!isBufferConfigured()) return;

  const allDone = await allPlatformsPublishedToday();
  if (allDone) {
    return;
  }

  try {
    console.log(`[GrowthOrchestrator] Starting daily social publish (3-tier model)...`);

    await expireStaleDrafts();

    const tierCounts = await getContentTierCounts();
    const selectedTier = selectContentTier(tierCounts);
    const tierPcts = tierCounts.total > 0
      ? `guide=${Math.round((tierCounts.guide / tierCounts.total) * 100)}% reactive=${Math.round((tierCounts.reactive / tierCounts.total) * 100)}% news=${Math.round((tierCounts.newsEditorial / tierCounts.total) * 100)}%`
      : "no data yet";
    console.log(`[ContentTier] Current mix (last 7d): ${tierPcts} | Selected tier: ${selectedTier}`);

    if (selectedTier === "reactive") {
      const trendResult = await generateAndPublishTrendAwarePosts();
      console.log(
        `[GrowthOrchestrator] Reactive posts: ${trendResult.published} published (${trendResult.platforms.join(", ") || "none"})`
      );
    } else if (selectedTier === "guide") {
      const drafts = await storage.getSocialPosts("draft", 50);
      const guideDrafts = drafts.filter(d =>
        d.platform !== "alert" &&
        d.contentType !== "trend_insight" &&
        d.contentType !== "news_article"
      );
      if (guideDrafts.length > 0) {
        console.log(`[GrowthOrchestrator] Publishing guide-based content (${guideDrafts.length} drafts available)...`);
        const results = await publishAllDraftsViaBuffer({ tier: "guide" });
        const succeeded = results.filter(r => r.success).length;
        console.log(`[GrowthOrchestrator] Guide posts: ${succeeded} published`);
      } else {
        console.log(`[GrowthOrchestrator] No guide drafts available. Falling back to reactive...`);
        if (isWithinAnyPostingWindow()) {
          const trendResult = await generateAndPublishTrendAwarePosts();
          console.log(`[GrowthOrchestrator] Fallback reactive: ${trendResult.published} published`);
        } else {
          console.log(`[GrowthOrchestrator] Reactive fallback skipped (outside posting windows)`);
        }
      }
    } else {
      const drafts = await storage.getSocialPosts("draft", 50);
      const newsDrafts = drafts.filter(d =>
        d.platform !== "alert" &&
        d.contentType === "news_article"
      );
      if (newsDrafts.length > 0) {
        console.log(`[GrowthOrchestrator] Publishing news editorial content (${newsDrafts.length} drafts available)...`);
        const results = await publishAllDraftsViaBuffer({ tier: "news_editorial" });
        const succeeded = results.filter(r => r.success).length;
        console.log(`[GrowthOrchestrator] News editorial posts: ${succeeded} published`);
      } else {
        console.log(`[GrowthOrchestrator] No news editorial drafts available. Falling back to guide...`);
        const guideDrafts = (await storage.getSocialPosts("draft", 50)).filter(d =>
          d.platform !== "alert" && d.contentType !== "trend_insight"
        );
        if (guideDrafts.length > 0) {
          const results = await publishAllDraftsViaBuffer({ tier: "guide" });
          const succeeded = results.filter(r => r.success).length;
          console.log(`[GrowthOrchestrator] Fallback guide: ${succeeded} published`);
        } else if (isWithinAnyPostingWindow()) {
          console.log(`[GrowthOrchestrator] No drafts available. Generating reactive...`);
          const trendResult = await generateAndPublishTrendAwarePosts();
          console.log(`[GrowthOrchestrator] Fallback reactive: ${trendResult.published} published`);
        } else {
          console.log(`[GrowthOrchestrator] No drafts available, reactive skipped (outside posting windows)`);
        }
      }
    }
  } catch (error: any) {
    console.error("[GrowthOrchestrator] Daily social publish error:", error.message);
  }
}

let orchestratorInterval: ReturnType<typeof setInterval> | null = null;
let schedulerInterval: ReturnType<typeof setInterval> | null = null;

export function startGrowthOrchestrator(): void {
  if (orchestratorInterval) return;

  console.log("[GrowthOrchestrator] Starting growth orchestrator...");
  
  autoPublishEnabled = loadAutoPublishSetting();
  console.log(`[GrowthOrchestrator] Auto-publish: ${autoPublishEnabled ? "enabled" : "disabled"}`);

  setTimeout(async () => {
    try {
      await scheduleWeeklyContentGeneration();
      await scheduleDailyMetrics();
      console.log("[GrowthOrchestrator] Initial scheduling check complete");
    } catch (error) {
      console.error("[GrowthOrchestrator] Initial scheduling error:", error);
    }
    try {
      await processPendingTasks();
    } catch (e) {
      console.error("[GrowthOrchestrator] Initial run error:", e);
    }
    try {
      await dailySocialPublish();
    } catch (e) {
      console.error("[GrowthOrchestrator] Initial social publish error:", e);
    }
  }, 30_000);

  orchestratorInterval = setInterval(async () => {
    try {
      await processPendingTasks();
    } catch (error) {
      console.error("[GrowthOrchestrator] Periodic run error:", error);
    }
    try {
      await checkBreakingNews();
    } catch (error) {
      console.error("[GrowthOrchestrator] Breaking news check error:", error);
    }
    try {
      await checkAndGenerateSeriesPosts();
    } catch (error) {
      console.error("[GrowthOrchestrator] Content series check error:", error);
    }
    try {
      await dailySocialPublish();
    } catch (error) {
      console.error("[GrowthOrchestrator] Social publish error:", error);
    }
  }, 15 * 60 * 1000);

  schedulerInterval = setInterval(async () => {
    try {
      await scheduleWeeklyContentGeneration();
      await scheduleDailyMetrics();
    } catch (error) {
      console.error("[GrowthOrchestrator] Scheduling error:", error);
    }
  }, 24 * 60 * 60 * 1000);

  console.log("[GrowthOrchestrator] Growth orchestrator started (processing every 15 min, scheduling daily)");
}

export function stopGrowthOrchestrator(): void {
  if (orchestratorInterval) {
    clearInterval(orchestratorInterval);
    orchestratorInterval = null;
  }
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
  console.log("[GrowthOrchestrator] Growth orchestrator stopped");
}
