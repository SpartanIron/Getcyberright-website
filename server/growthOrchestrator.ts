import { storage } from "./storage";
import { runContentAutomationBatch, getContentAutomationStats, optimizeGuideInternalLinks } from "./contentAutomationService";
import { distributeGuideContent, distributeThreatAlertContent, getSocialDistributionStats } from "./socialDistributionService";
import { isBufferConfigured, publishAllDraftsViaBuffer } from "./bufferPublisher";
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
      await publishPendingDraftsViaBuffer();
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

let lastBufferPublishDate = "";

async function publishPendingDraftsViaBuffer(): Promise<void> {
  if (!isBufferConfigured()) return;

  const today = new Date().toISOString().split("T")[0];
  if (lastBufferPublishDate === today) return;

  try {
    const drafts = await storage.getSocialPosts("draft", 50);
    const publishable = drafts.filter(d => d.platform !== "alert");
    if (publishable.length === 0) return;

    console.log(`[GrowthOrchestrator] Daily publish: ${publishable.length} draft social posts via Buffer...`);
    const results = await publishAllDraftsViaBuffer();
    const succeeded = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    console.log(`[GrowthOrchestrator] Buffer publish complete: ${succeeded} published, ${failed} failed`);
    lastBufferPublishDate = today;
  } catch (error: any) {
    console.error("[GrowthOrchestrator] Buffer publish batch error:", error.message);
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
      await publishPendingDraftsViaBuffer();
    } catch (e) {
      console.error("[GrowthOrchestrator] Initial Buffer publish error:", e);
    }
  }, 30_000);

  orchestratorInterval = setInterval(async () => {
    try {
      await processPendingTasks();
    } catch (error) {
      console.error("[GrowthOrchestrator] Periodic run error:", error);
    }
    try {
      await publishPendingDraftsViaBuffer();
    } catch (error) {
      console.error("[GrowthOrchestrator] Buffer publish error:", error);
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
