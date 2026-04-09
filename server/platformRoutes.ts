import { type Express, type Request, type Response } from "express";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./auth";
import { isAdminMiddleware } from "./admin";

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
import {
  insertCyberSafetyGuideSchema,
  insertScamIntelligenceSchema,
  insertCyberThreatAlertSchema,
  cyberSafetyGuides,
  scamIntelligence,
  cyberThreatAlerts,
} from "@shared/schema";
import {
  generateGuideDraft,
  runContentAutomationBatch,
  getContentAutomationStats,
  getUnusedKeywords,
} from "./contentAutomationService";
import {
  distributeGuideContent,
  distributeThreatAlertContent,
  distributeScamIntelContent,
  getSocialDistributionStats,
} from "./socialDistributionService";
import { publishPost, getConnectedPlatforms, publishAllDrafts } from "./socialPublisher";
import { getBufferStatus, isBufferConfigured } from "./bufferPublisher";
import {
  getLinkedInAuthUrl,
  validateOAuthState,
  exchangeCodeForToken,
  getLinkedInProfile,
  findOrganizationId,
  isLinkedInDirectConfigured,
  publishDirectToLinkedIn,
} from "./linkedinDirectPublisher";
import {
  getFacebookAuthUrl,
  validateFBOAuthState,
  exchangeFBCodeForToken,
  getLongLivedToken,
  getUserPages,
  isFacebookDirectConfigured,
  publishDirectToFacebook,
} from "./facebookDirectPublisher";
import { serveImagePath } from "./socialImageService";
import * as fs from "fs";
import * as path from "path";
import {
  scheduleTask,
  processPendingTasks,
  getOrchestratorDashboard,
  setAutoPublish,
  getAutoPublishStatus,
} from "./growthOrchestrator";
import { z } from "zod";

const guideUpdateSchema = insertCyberSafetyGuideSchema.partial();
const scamIntelUpdateSchema = insertScamIntelligenceSchema.partial();
const threatAlertUpdateSchema = insertCyberThreatAlertSchema.partial();

const socialPostUpdateSchema = z.object({
  status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
}).strict();

const scheduleTaskSchema = z.object({
  taskType: z.string().min(1).max(100),
  taskName: z.string().min(1).max(200),
  payload: z.record(z.unknown()).optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

const processTasksSchema = z.object({
  batchSize: z.number().int().min(1).max(20).optional(),
});

export function registerPlatformRoutes(app: Express): void {

  // ─── Public Threat Intelligence Stats ─────────────────────────────

  app.get("/api/threat-stats", async (_req: Request, res: Response) => {
    try {
      const { threatStats, ageGroupStats, regionalAttackTypes } = await import("@shared/schema");
      const stats = await db.select().from(threatStats).orderBy(threatStats.displayOrder);
      const ageGroups = await db.select().from(ageGroupStats).orderBy(ageGroupStats.displayOrder);
      const regions = await db.select().from(regionalAttackTypes).orderBy(regionalAttackTypes.displayOrder);

      if (stats.length === 0) {
        const { insertThreatStatSchema, insertAgeGroupStatSchema, insertRegionalAttackTypeSchema } = await import("@shared/schema");
        await db.insert(threatStats).values([
          { statKey: "global_losses", value: "$16.6B", label: "Global Losses (2024)", description: "Total reported cybercrime losses worldwide", source: "FBI IC3 Report", sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2024_IC3Report.pdf", category: "financial", colorTheme: "teal", displayOrder: 1, reportYear: 2024 },
          { statKey: "most_targeted_age", value: "60+", label: "Age Group Most Targeted", description: "Seniors face the highest financial losses from cybercrime", source: "FBI IC3 Report", sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3Report.pdf", category: "demographics", colorTheme: "amber", displayOrder: 2, reportYear: 2023 },
          { statKey: "youth_harassment", value: "40%", label: "Youth Online Harassment", description: "Percentage of youth ages 10-17 experiencing cyberbullying", source: "Cyberbullying Research Center", sourceUrl: "https://cyberbullying.org/facts", category: "youth", colorTheme: "cyan", displayOrder: 3, reportYear: 2023 },
          { statKey: "mobile_fraud_rise", value: "300%", label: "Mobile Money Fraud Rise", description: "Increase in mobile money fraud in Africa from 2020-2024", source: "INTERPOL Africa", sourceUrl: "https://www.interpol.int/en/Crimes/Cybercrime", category: "africa", colorTheme: "red", displayOrder: 4, reportYear: 2024 },
        ]);
        await db.insert(ageGroupStats).values([
          { ageGroup: "Under 20", percentage: 8, colorClass: "bg-cyan-400", displayOrder: 1, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "20-29", percentage: 15, colorClass: "bg-teal-400", displayOrder: 2, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "30-49", percentage: 35, colorClass: "bg-green-400", displayOrder: 3, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "50-59", percentage: 20, colorClass: "bg-orange-400", displayOrder: 4, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "60+", percentage: 22, colorClass: "bg-amber-400", displayOrder: 5, source: "FBI Internet Crime Report 2023" },
        ]);
        await db.insert(regionalAttackTypes).values([
          { region: "Africa", attackTypes: "Mobile Money Fraud, SIM Swap, WhatsApp Scams", colorClass: "bg-amber-400", displayOrder: 1, source: "INTERPOL Africa Assessment 2024" },
          { region: "North America", attackTypes: "Investment Fraud, BEC, Tech Support Scams", colorClass: "bg-teal-400", displayOrder: 2, source: "FBI IC3 Report 2023" },
          { region: "Europe", attackTypes: "Ransomware, Phishing, Data Breaches", colorClass: "bg-cyan-400", displayOrder: 3, source: "Europol IOCTA 2024" },
          { region: "Asia Pacific", attackTypes: "Romance Scams, E-commerce Fraud, Crypto Scams", colorClass: "bg-purple-400", displayOrder: 4, source: "APAC Cybersecurity Report 2024" },
        ]);
        console.log("[threat-stats] Seeded threat statistics data");
        const newStats = await db.select().from(threatStats).orderBy(threatStats.displayOrder);
        const newAgeGroups = await db.select().from(ageGroupStats).orderBy(ageGroupStats.displayOrder);
        const newRegions = await db.select().from(regionalAttackTypes).orderBy(regionalAttackTypes.displayOrder);
        return res.json({ stats: newStats, ageGroups: newAgeGroups, regions: newRegions });
      }

      res.json({ stats, ageGroups, regions });
    } catch (error: any) {
      console.error("[threat-stats] Error:", error?.message || error);
      res.status(500).json({ error: "Failed to fetch threat statistics" });
    }
  });

  // ─── Public Guide Routes ───────────────────────────────────────────

  app.get("/api/guides", async (_req: Request, res: Response) => {
    try {
      const category = _req.query.category as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
      const guides = await storage.getPublishedGuides(category, limit);
      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.get("/api/guides/:slug", async (req: Request, res: Response) => {
    try {
      const guide = await storage.getGuideBySlug(req.params.slug);
      if (!guide || guide.status !== "published") {
        return res.status(404).json({ error: "Guide not found" });
      }
      res.json(guide);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch guide" });
    }
  });

  // ─── Public Scam Intelligence Routes ───────────────────────────────

  app.get("/api/scam-intel", async (_req: Request, res: Response) => {
    try {
      const category = _req.query.category as string | undefined;
      const region = _req.query.region as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
      const scams = await storage.getPublishedScamIntel(category, limit);
      if (region && region !== "GLOBAL") {
        const regionUpper = region.toUpperCase();
        const regionScams = scams.filter((s: any) =>
          s.regions && Array.isArray(s.regions) && (
            s.regions.some((r: string) => r.toUpperCase() === regionUpper) ||
            s.regions.some((r: string) => r.toUpperCase() === "GLOBAL")
          )
        );
        const nonRegionScams = scams.filter((s: any) =>
          !s.regions || !Array.isArray(s.regions) || s.regions.length === 0 ||
          (!s.regions.some((r: string) => r.toUpperCase() === regionUpper) &&
           !s.regions.some((r: string) => r.toUpperCase() === "GLOBAL"))
        );
        return res.json([...regionScams, ...nonRegionScams]);
      }
      res.json(scams);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scam intelligence" });
    }
  });

  app.get("/api/scam-intel/cross-link/:scamSlug", async (req: Request, res: Response) => {
    try {
      const scamSlug = req.params.scamSlug.toLowerCase();
      const keywords = scamSlug.replace(/-/g, " ").split(" ").filter(w => w.length > 2);
      const allIntel = await storage.getPublishedScamIntel(undefined, 200);
      const matches = allIntel.filter((intel: any) => {
        const name = (intel.scamName || "").toLowerCase();
        const category = (intel.scamCategory || "").toLowerCase();
        const slug = (intel.slug || "").toLowerCase();
        return keywords.some(kw => name.includes(kw) || category.includes(kw) || slug.includes(kw));
      }).slice(0, 5).map((intel: any) => ({
        slug: intel.slug,
        scamName: intel.scamName,
        riskLevel: intel.riskLevel,
        reportCount: intel.reportCount || 0,
      }));
      res.json(matches);
    } catch (error: any) {
      res.json([]);
    }
  });

  app.get("/api/scam-intel/:slug", async (req: Request, res: Response) => {
    try {
      const scam = await storage.getScamIntelBySlug(req.params.slug);
      if (!scam || scam.status !== "published") {
        return res.status(404).json({ error: "Scam intelligence not found" });
      }
      res.json(scam);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scam intelligence" });
    }
  });

  // ─── Public Threat Alert Routes ────────────────────────────────────

  app.get("/api/alerts", async (_req: Request, res: Response) => {
    try {
      const category = _req.query.category as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
      const alerts = await storage.getPublishedThreatAlerts(category, limit);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch threat alerts" });
    }
  });

  app.get("/api/alerts/:slug", async (req: Request, res: Response) => {
    try {
      const alert = await storage.getThreatAlertBySlug(req.params.slug);
      if (!alert || alert.status !== "published") {
        return res.status(404).json({ error: "Threat alert not found" });
      }
      res.json(alert);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch threat alert" });
    }
  });

  // ─── Public Social Posts ───────────────────────────────────────────

  app.get("/api/social-posts", async (_req: Request, res: Response) => {
    try {
      const platform = _req.query.platform as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 20;
      const posts = await storage.getSocialPosts("published", limit);
      const filtered = platform ? posts.filter((p) => p.platform === platform) : posts;
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  // ─── Admin Guide Management ────────────────────────────────────────

  app.get("/api/admin/guides", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const guides = await storage.getAllGuides(status);
      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.post("/api/admin/guides", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const parsed = insertCyberSafetyGuideSchema.parse(req.body);
      const guide = await storage.createGuide(parsed);
      res.status(201).json(guide);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid guide data" });
    }
  });

  app.patch("/api/admin/guides/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = guideUpdateSchema.parse(req.body);
      const guide = await storage.updateGuide(req.params.id, validated);
      if (!guide) return res.status(404).json({ error: "Guide not found" });
      res.json(guide);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update guide" });
    }
  });

  app.post("/api/admin/guides/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getGuideById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Guide not found" });
      const wasAlreadyPublished = existing.status === "published";
      const now = new Date();
      const result = await db.update(cyberSafetyGuides)
        .set({ status: "published", publishedAt: existing.publishedAt || now, updatedAt: now })
        .where(eq(cyberSafetyGuides.id, req.params.id))
        .returning();
      const published = result[0];

      if (!wasAlreadyPublished) {
        try {
          await distributeGuideContent(published);
          console.log(`[publish] Auto-generated social posts for guide: ${published.title}`);
        } catch (socialErr) {
          console.error("[publish] Social distribution failed (non-blocking):", socialErr);
        }
      }

      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish guide" });
    }
  });

  app.delete("/api/admin/guides/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteGuide(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Guide not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete guide" });
    }
  });

  // ─── Admin Scam Intelligence Management ────────────────────────────

  app.get("/api/admin/scam-intel", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const scams = await storage.getAllScamIntel(status);
      res.json(scams);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scam intelligence" });
    }
  });

  app.post("/api/admin/scam-intel", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const parsed = insertScamIntelligenceSchema.parse(req.body);
      const scam = await storage.createScamIntel(parsed);
      res.status(201).json(scam);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid scam data" });
    }
  });

  app.patch("/api/admin/scam-intel/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = scamIntelUpdateSchema.parse(req.body);
      const scam = await storage.updateScamIntel(req.params.id, validated);
      if (!scam) return res.status(404).json({ error: "Scam intel not found" });
      res.json(scam);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update scam intel" });
    }
  });

  app.post("/api/admin/scam-intel/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getScamIntelById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Scam intel not found" });
      const wasAlreadyPublished = existing.status === "published";
      const result = await db.update(scamIntelligence)
        .set({ status: "published", lastUpdated: new Date() })
        .where(eq(scamIntelligence.id, req.params.id))
        .returning();
      const published = result[0];

      if (!wasAlreadyPublished) {
        try {
          await distributeScamIntelContent(published);
          console.log(`[publish] Auto-generated social posts for scam intel: ${published.scamName}`);
        } catch (socialErr) {
          console.error("[publish] Social distribution failed (non-blocking):", socialErr);
        }
      }

      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish scam intel" });
    }
  });

  app.delete("/api/admin/scam-intel/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteScamIntel(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Scam intel not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete scam intel" });
    }
  });

  // ─── Admin Threat Alert Management ─────────────────────────────────

  app.get("/api/admin/threat-alerts", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const alerts = await storage.getAllThreatAlerts(status);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch threat alerts" });
    }
  });

  app.post("/api/admin/threat-alerts", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const parsed = insertCyberThreatAlertSchema.parse(req.body);
      const alert = await storage.createThreatAlert(parsed);
      res.status(201).json(alert);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid alert data" });
    }
  });

  app.patch("/api/admin/threat-alerts/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = threatAlertUpdateSchema.parse(req.body);
      const alert = await storage.updateThreatAlert(req.params.id, validated);
      if (!alert) return res.status(404).json({ error: "Alert not found" });
      res.json(alert);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update alert" });
    }
  });

  app.post("/api/admin/threat-alerts/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getThreatAlertById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Alert not found" });
      const wasAlreadyPublished = existing.status === "published";
      const now = new Date();
      const result = await db.update(cyberThreatAlerts)
        .set({ status: "published", publishedAt: existing.publishedAt || now, updatedAt: now })
        .where(eq(cyberThreatAlerts.id, req.params.id))
        .returning();
      const published = result[0];

      if (!wasAlreadyPublished) {
        try {
          await distributeThreatAlertContent(published);
          console.log(`[publish] Auto-generated social posts for alert: ${published.threatName}`);
        } catch (socialErr) {
          console.error("[publish] Social distribution failed (non-blocking):", socialErr);
        }

        if (published.riskLevel === "critical" || published.riskLevel === "high") {
          try {
            const { sendAlertToSubscribers } = await import("./newsletterService");
            await sendAlertToSubscribers(published.threatName, published.description, `/alerts/${published.slug}`);
            console.log(`[publish] Email alert sent for high-risk alert: ${published.threatName}`);
          } catch (emailErr) {
            console.error("[publish] Email alert failed (non-blocking):", emailErr);
          }
        }
      }

      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish alert" });
    }
  });

  app.delete("/api/admin/threat-alerts/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteThreatAlert(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Alert not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete alert" });
    }
  });

  // ─── Admin Social Post Management ──────────────────────────────────

  app.get("/api/admin/social-posts", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const posts = await storage.getSocialPosts(status, limit);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  app.patch("/api/admin/social-posts/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = socialPostUpdateSchema.parse(req.body);
      const post = await storage.updateSocialPost(req.params.id, validated);
      if (!post) return res.status(404).json({ error: "Social post not found" });
      res.json(post);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update social post" });
    }
  });

  app.post("/api/admin/social-posts/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const result = await publishPost(req.params.id);
      if (result.success) {
        res.json({ success: true, externalId: result.externalId, platform: result.platform });
      } else {
        res.status(400).json({ success: false, error: result.error, platform: result.platform });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish post" });
    }
  });

  app.post("/api/admin/social-posts/publish-all", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const results = await publishAllDrafts();
      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      res.json({ succeeded, failed, total: results.length, results });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish posts" });
    }
  });

  app.get("/api/admin/social/connected-platforms", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    const platforms = getConnectedPlatforms();
    const bufferStatus = await getBufferStatus();

    if (bufferStatus.configured) {
      platforms.push({
        name: "buffer",
        isConfigured: bufferStatus.configured,
        requiredVars: ["BUFFER_API_KEY"],
      });
    }

    res.json({ platforms, buffer: bufferStatus });
  });

  app.get("/api/admin/social/buffer-status", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    const status = await getBufferStatus();
    res.json(status);
  });

  app.post("/api/admin/social/test-publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { generateAndPublishTrendAwarePosts } = await import("./trendAwareSocialEngine");
      const platform = req.body.platform || "linkedin";
      console.log(`[TestPublish] Manual test publish triggered for ${platform}`);
      const result = await generateAndPublishTrendAwarePosts({ skipRateLimit: true, skipDuplicateCheck: true, platformFilter: platform });
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error("[TestPublish] Error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ─── Content Automation Endpoints ──────────────────────────────────

  app.post("/api/admin/content-automation/generate", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const generateSchema = z.object({
        keyword: z.string().min(1).max(200).optional(),
        cluster: z.string().min(1).max(200).optional(),
      });
      const { keyword, cluster } = generateSchema.parse(req.body);
      if (keyword && cluster) {
        const id = await generateGuideDraft(keyword, cluster);
        if (!id) return res.status(400).json({ error: "Failed to generate guide" });
        res.json({ guideId: id });
      } else {
        const count = req.body.count || 3;
        const ids = await runContentAutomationBatch(count);
        res.json({ generatedCount: ids.length, guideIds: ids });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Content automation failed" });
    }
  });

  app.get("/api/admin/content-automation/stats", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const stats = await getContentAutomationStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch content stats" });
    }
  });

  app.get("/api/admin/content-automation/unused-keywords", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const keywords = await getUnusedKeywords(limit);
      res.json(keywords);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch unused keywords" });
    }
  });

  // ─── Social Distribution Endpoints ─────────────────────────────────

  app.post("/api/admin/social-distribution/generate", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { contentType, contentId } = req.body;
      let postIds: string[] = [];

      if (contentType === "guide") {
        const guide = await storage.getGuideById(contentId);
        if (!guide) return res.status(404).json({ error: "Guide not found" });
        postIds = await distributeGuideContent(guide);
      } else if (contentType === "threat_alert") {
        const alert = await storage.getThreatAlertById(contentId);
        if (!alert) return res.status(404).json({ error: "Alert not found" });
        postIds = await distributeThreatAlertContent(alert);
      } else if (contentType === "scam_intel") {
        const scam = await storage.getScamIntelById(contentId);
        if (!scam) return res.status(404).json({ error: "Scam intel not found" });
        postIds = await distributeScamIntelContent(scam);
      } else {
        return res.status(400).json({ error: "Invalid content type" });
      }

      res.json({ postsCreated: postIds.length, postIds });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Social distribution failed" });
    }
  });

  app.get("/api/admin/social-distribution/stats", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const stats = await getSocialDistributionStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch social stats" });
    }
  });

  app.get("/api/admin/social-distribution/utm-campaigns", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const allPosts = await storage.getSocialPosts(undefined, 500);
      const campaigns: Record<string, {
        campaignId: string;
        posts: number;
        platforms: string[];
        contentTypes: string[];
        titles: string[];
        published: number;
        drafts: number;
        failed: number;
        postStyles: string[];
        dateRange: { earliest: string; latest: string };
      }> = {};

      for (const post of allPosts) {
        const campaignId = post.utmCampaign || "untagged";
        if (!campaigns[campaignId]) {
          campaigns[campaignId] = {
            campaignId,
            posts: 0,
            platforms: [],
            contentTypes: [],
            titles: [],
            published: 0,
            drafts: 0,
            failed: 0,
            postStyles: [],
            dateRange: { earliest: "", latest: "" },
          };
        }
        const c = campaigns[campaignId];
        c.posts++;
        if (!c.platforms.includes(post.platform)) c.platforms.push(post.platform);
        if (!c.contentTypes.includes(post.contentType)) c.contentTypes.push(post.contentType);
        if (!c.titles.includes(post.contentTitle)) c.titles.push(post.contentTitle);
        if (post.postStyle && !c.postStyles.includes(post.postStyle)) c.postStyles.push(post.postStyle);
        if (post.status === "published") c.published++;
        else if (post.status === "draft") c.drafts++;
        else if (post.status === "failed") c.failed++;
        const dateStr = post.createdAt ? new Date(post.createdAt).toISOString().slice(0, 10) : "";
        if (dateStr) {
          if (!c.dateRange.earliest || dateStr < c.dateRange.earliest) c.dateRange.earliest = dateStr;
          if (!c.dateRange.latest || dateStr > c.dateRange.latest) c.dateRange.latest = dateStr;
        }
      }

      const sorted = Object.values(campaigns).sort((a, b) => {
        if (a.dateRange.latest && b.dateRange.latest) return b.dateRange.latest.localeCompare(a.dateRange.latest);
        return b.posts - a.posts;
      });

      const taggedCount = allPosts.filter(p => p.utmCampaign).length;
      const untaggedCount = allPosts.length - taggedCount;

      res.json({
        totalPosts: allPosts.length,
        taggedPosts: taggedCount,
        untaggedPosts: untaggedCount,
        tagRate: allPosts.length > 0 ? Math.round((taggedCount / allPosts.length) * 100) : 0,
        campaigns: sorted,
        utmNote: "Connect Google Analytics to see traffic driven by each campaign. Filter by utm_source (platform), utm_medium (social), utm_campaign (content type + date), and utm_content (content slug).",
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch UTM campaign data" });
    }
  });

  // ─── Growth Orchestrator Endpoints ─────────────────────────────────

  app.get("/api/admin/growth/dashboard", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const dashboard = await getOrchestratorDashboard();
      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch growth dashboard" });
    }
  });

  app.post("/api/admin/growth/schedule-task", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { taskType, taskName, payload, priority } = scheduleTaskSchema.parse(req.body);
      const taskId = await scheduleTask(taskType, taskName, payload, undefined, priority);
      res.json({ taskId });
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(500).json({ error: error.message || "Failed to schedule task" });
    }
  });

  app.post("/api/admin/growth/process-tasks", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { batchSize } = processTasksSchema.parse(req.body);
      const completed = await processPendingTasks(batchSize || 5);
      res.json({ completed });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to process tasks" });
    }
  });

  app.get("/api/admin/growth/tasks", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const tasks = await storage.getGrowthTasks(status, limit);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch growth tasks" });
    }
  });

  app.get("/api/admin/growth/metrics", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const metrics = await storage.getLatestPlatformMetrics(days);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/admin/growth/auto-publish", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    res.json({ enabled: getAutoPublishStatus() });
  });

  app.post("/api/admin/growth/auto-publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "enabled must be a boolean" });
    }
    setAutoPublish(enabled);
    res.json({ enabled: getAutoPublishStatus() });
  });


  app.get("/api/admin/growth/task-stats", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const tasks = await storage.getGrowthTasks(undefined, 200);
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentTasks = tasks.filter(t => t.createdAt && new Date(t.createdAt) >= thirtyDaysAgo);
      const weekTasks = tasks.filter(t => t.createdAt && new Date(t.createdAt) >= oneWeekAgo);

      const completed = recentTasks.filter(t => t.status === "completed");
      const failed = recentTasks.filter(t => t.status === "failed");
      const pending = recentTasks.filter(t => t.status === "pending");
      const running = recentTasks.filter(t => t.status === "running");

      const byType: Record<string, { total: number; completed: number; failed: number }> = {};
      for (const task of recentTasks) {
        if (!byType[task.taskType]) {
          byType[task.taskType] = { total: 0, completed: 0, failed: 0 };
        }
        byType[task.taskType].total++;
        if (task.status === "completed") byType[task.taskType].completed++;
        if (task.status === "failed") byType[task.taskType].failed++;
      }

      const successRate = recentTasks.length > 0
        ? Math.round((completed.length / (completed.length + failed.length || 1)) * 100)
        : 0;

      const recentActivity = tasks.slice(0, 10).map(t => ({
        id: t.id,
        taskType: t.taskType,
        taskName: t.taskName,
        status: t.status,
        errorMessage: t.errorMessage,
        createdAt: t.createdAt,
        completedAt: t.completedAt,
      }));

      res.json({
        summary: {
          totalThisMonth: recentTasks.length,
          totalThisWeek: weekTasks.length,
          completed: completed.length,
          failed: failed.length,
          pending: pending.length,
          running: running.length,
          successRate,
        },
        byType,
        recentActivity,
      });
    } catch (error) {
      console.error("Growth task stats error:", error);
      res.status(500).json({ error: "Failed to fetch task stats" });
    }
  });

  app.get("/api/auth/linkedin/authorize", (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL || "judekwekujude@gmail.com";
    const key = req.query.key;
    if (key !== process.env.LINKEDIN_SETUP_KEY && key !== "gcr-linkedin-setup-2026") {
      return res.status(401).send("Add ?key=gcr-linkedin-setup-2026 to authorize");
    }
    const authUrl = getLinkedInAuthUrl();
    res.redirect(authUrl);
  });

  app.get("/api/auth/linkedin/callback", async (req, res) => {
    try {
      const { code, state, error: oauthError } = req.query;

      if (oauthError) {
        return res.status(400).send(`LinkedIn OAuth error: ${escapeHtml(String(oauthError))}`);
      }

      if (!code || !state) {
        return res.status(400).send("Missing code or state parameter");
      }

      if (!validateOAuthState(state as string)) {
        return res.status(400).send("Invalid OAuth state. Please try again.");
      }

      const tokenData = await exchangeCodeForToken(code as string);
      const profile = await getLinkedInProfile(tokenData.access_token);
      const orgId = await findOrganizationId(tokenData.access_token);

      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

      const html = `<!DOCTYPE html>
<html><head><title>LinkedIn Connected</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; }
.card { background: #133a4f; border-radius: 12px; padding: 32px; }
h1 { color: #E8732A; margin-top: 0; }
.token-box { background: #0d2230; border: 1px solid #1a4a5e; border-radius: 8px; padding: 16px; margin: 16px 0; word-break: break-all; font-family: monospace; font-size: 13px; }
.label { color: #8ab4c7; font-size: 14px; margin-bottom: 4px; }
.success { color: #4ade80; }
.info { color: #94a3b8; font-size: 14px; margin-top: 12px; }
button { background: #E8732A; color: white; border: none; padding: 12px 24px; border-radius: 24px; cursor: pointer; font-size: 16px; margin-top: 16px; }
</style></head>
<body><div class="card">
<h1>LinkedIn Connected Successfully</h1>
<p class="success">Authenticated as: ${escapeHtml(String(profile.name))}</p>
${orgId ? `<p class="success">Organization ID found: ${escapeHtml(String(orgId))}</p>` : '<p style="color:#fbbf24">No organization admin access found. You may need to add the app to your LinkedIn Company Page.</p>'}
<div>
<p class="label">Access Token (save this as LINKEDIN_ACCESS_TOKEN):</p>
<div class="token-box">${escapeHtml(String(tokenData.access_token))}</div>
</div>
${orgId ? `<div>
<p class="label">Organization ID (save this as LINKEDIN_ORGANIZATION_ID):</p>
<div class="token-box">${escapeHtml(String(orgId))}</div>
</div>` : ""}
<p class="info">Token expires: ${escapeHtml(String(expiresAt))}</p>
${tokenData.refresh_token ? `<div>
<p class="label">Refresh Token (save this as LINKEDIN_REFRESH_TOKEN):</p>
<div class="token-box">${escapeHtml(String(tokenData.refresh_token))}</div>
</div>` : ""}
<p class="info">Copy the values above and add them as environment variables, or click below to save automatically.</p>
<form method="POST" action="/api/auth/linkedin/save-token">
<input type="hidden" name="access_token" value="${escapeHtml(String(tokenData.access_token))}" />
<input type="hidden" name="expires_at" value="${escapeHtml(String(expiresAt))}" />
${orgId ? `<input type="hidden" name="organization_id" value="${escapeHtml(String(orgId))}" />` : ""}
${tokenData.refresh_token ? `<input type="hidden" name="refresh_token" value="${escapeHtml(String(tokenData.refresh_token))}" />` : ""}
<button type="submit">Save Token Automatically</button>
</form>
</div></body></html>`;

      res.send(html);
    } catch (error: any) {
      console.error("[LinkedIn OAuth] Callback error:", error);
      res.status(500).send(`LinkedIn OAuth failed: ${escapeHtml(error.message || "Unknown error")}`);
    }
  });

  app.post("/api/auth/linkedin/save-token", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { access_token, organization_id, refresh_token, expires_at } = req.body;

      if (!access_token) {
        return res.status(400).json({ error: "Missing access token" });
      }

      process.env.LINKEDIN_ACCESS_TOKEN = access_token;
      if (organization_id) process.env.LINKEDIN_ORGANIZATION_ID = organization_id;
      if (refresh_token) process.env.LINKEDIN_REFRESH_TOKEN = refresh_token;

      console.log("[LinkedIn] Token saved to process.env. Org ID:", organization_id || "not found");
      console.log("[LinkedIn] Token expires:", expires_at);

      res.send(`<!DOCTYPE html>
<html><head><title>Token Saved</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; text-align: center; }
h1 { color: #4ade80; }
p { color: #94a3b8; }
a { color: #E8732A; }
</style></head>
<body>
<h1>Token Saved Successfully</h1>
<p>LinkedIn direct publishing is now active for this session.</p>
<p>Important: Add LINKEDIN_ACCESS_TOKEN${organization_id ? " and LINKEDIN_ORGANIZATION_ID" : ""} as environment variables in Replit Secrets for persistence across restarts.</p>
<p><a href="/admin">Go to Admin Dashboard</a></p>
</body></html>`);
    } catch (error: any) {
      console.error("[LinkedIn] Save token error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/linkedin/status", isAuthenticated, isAdminMiddleware, (_req, res) => {
    res.json({
      configured: isLinkedInDirectConfigured(),
      hasToken: !!process.env.LINKEDIN_ACCESS_TOKEN,
      hasOrgId: !!process.env.LINKEDIN_ORGANIZATION_ID,
      hasRefreshToken: !!process.env.LINKEDIN_REFRESH_TOKEN,
    });
  });

  app.post("/api/linkedin/test-post", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Missing text" });

      const result = await publishDirectToLinkedIn(text);
      res.json(result);
    } catch (error: any) {
      console.error("[LinkedIn] Test post error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/facebook/authorize", (req, res) => {
    const key = req.query.key;
    if (key !== process.env.FACEBOOK_SETUP_KEY && key !== "gcr-facebook-setup-2026") {
      return res.status(401).send("Add ?key=gcr-facebook-setup-2026 to authorize");
    }
    const authUrl = getFacebookAuthUrl();
    res.redirect(authUrl);
  });

  app.get("/api/auth/facebook/callback", async (req, res) => {
    try {
      const { code, state, error: oauthError, error_description } = req.query;

      if (oauthError) {
        return res.status(400).send(`Facebook OAuth error: ${escapeHtml(String(oauthError))} - ${escapeHtml(String(error_description || ""))}`);
      }

      if (!code || !state) {
        return res.status(400).send("Missing code or state parameter");
      }

      if (!validateFBOAuthState(state as string)) {
        return res.status(400).send("Invalid OAuth state. Please try again.");
      }

      const shortToken = await exchangeFBCodeForToken(code as string);
      const longToken = await getLongLivedToken(shortToken.access_token);
      const pages = await getUserPages(longToken.access_token);

      const expiresAt = longToken.expires_in
        ? new Date(Date.now() + longToken.expires_in * 1000).toISOString()
        : "Never (permanent page token)";

      const pagesHtml = pages.map(p => `
        <div style="background:#0d2230;border:1px solid #1a4a5e;border-radius:8px;padding:16px;margin:12px 0;">
          <p style="color:#4ade80;font-size:16px;margin:0 0 8px"><strong>${escapeHtml(String(p.name))}</strong> (${escapeHtml(String(p.category))})</p>
          <p class="label">Page ID:</p>
          <div class="token-box">${escapeHtml(String(p.id))}</div>
          <p class="label">Page Access Token:</p>
          <div class="token-box">${escapeHtml(String(p.access_token))}</div>
          <form method="POST" action="/api/auth/facebook/save-token">
            <input type="hidden" name="page_id" value="${escapeHtml(String(p.id))}" />
            <input type="hidden" name="page_name" value="${escapeHtml(String(p.name))}" />
            <input type="hidden" name="page_access_token" value="${escapeHtml(String(p.access_token))}" />
            <input type="hidden" name="user_access_token" value="${escapeHtml(String(longToken.access_token))}" />
            <button type="submit">Use This Page</button>
          </form>
        </div>
      `).join("");

      const html = `<!DOCTYPE html>
<html><head><title>Facebook Connected</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; }
.card { background: #133a4f; border-radius: 12px; padding: 32px; }
h1 { color: #E8732A; margin-top: 0; }
.token-box { background: #0d2230; border: 1px solid #1a4a5e; border-radius: 8px; padding: 12px; margin: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px; }
.label { color: #8ab4c7; font-size: 14px; margin-bottom: 4px; }
.success { color: #4ade80; }
.info { color: #94a3b8; font-size: 14px; margin-top: 12px; }
button { background: #E8732A; color: white; border: none; padding: 10px 20px; border-radius: 24px; cursor: pointer; font-size: 14px; margin-top: 8px; }
</style></head>
<body><div class="card">
<h1>Facebook Connected Successfully</h1>
<p class="info">User token expires: ${escapeHtml(String(expiresAt))}</p>
${pages.length > 0
  ? `<p class="success">Found ${pages.length} page(s) you manage. Select the one to use for posting:</p>${pagesHtml}`
  : '<p style="color:#fbbf24">No pages found. Make sure you are an admin of the GetCyberRight Facebook page.</p>'
}
</div></body></html>`;

      res.send(html);
    } catch (error: any) {
      console.error("[Facebook OAuth] Callback error:", error);
      res.status(500).send(`Facebook OAuth failed: ${escapeHtml(error.message || "Unknown error")}`);
    }
  });

  app.post("/api/auth/facebook/save-token", async (req, res) => {
    try {
      const { page_id, page_name, page_access_token, user_access_token } = req.body;

      if (!page_id || !page_access_token) {
        return res.status(400).json({ error: "Missing page ID or token" });
      }

      process.env.FACEBOOK_PAGE_ID = page_id;
      process.env.FACEBOOK_PAGE_ACCESS_TOKEN = page_access_token;
      if (user_access_token) process.env.FACEBOOK_USER_ACCESS_TOKEN = user_access_token;

      console.log(`[Facebook] Page saved: ${page_name} (${page_id})`);

      res.send(`<!DOCTYPE html>
<html><head><title>Facebook Page Saved</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; text-align: center; }
h1 { color: #4ade80; }
p { color: #94a3b8; }
a { color: #E8732A; }
</style></head>
<body>
<h1>Facebook Page Connected</h1>
<p>${page_name} is now set up for direct publishing.</p>
<p>Important: Add FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN as environment variables in Replit Secrets for persistence across restarts.</p>
<p><a href="/admin">Go to Admin Dashboard</a></p>
</body></html>`);
    } catch (error: any) {
      console.error("[Facebook] Save token error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/facebook/status", isAuthenticated, isAdminMiddleware, (_req, res) => {
    res.json({
      configured: isFacebookDirectConfigured(),
      hasPageToken: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      hasPageId: !!process.env.FACEBOOK_PAGE_ID,
      pageId: process.env.FACEBOOK_PAGE_ID || null,
    });
  });

  app.post("/api/facebook/test-post", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Missing text" });

      const result = await publishDirectToFacebook(text);
      res.json(result);
    } catch (error: any) {
      console.error("[Facebook] Test post error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
