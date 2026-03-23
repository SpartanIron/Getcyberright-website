import type { Express, Request, Response, NextFunction } from "express";
import { db } from "./db";
import { storage } from "./storage";
import { users, contactMessages, newsletterSubscribers, scamReports, toolUsage, insertToolUsageSchema, platformAnnouncements, insertAnnouncementSchema, trendingThreats, insertTrendingThreatSchema, userFeedback, cyberSafetyGuides, cyberThreatAlerts, scamIntelligence, socialPosts, growthTasks } from "@shared/schema";
import { isAuthenticated } from "./auth";
import { eq, desc, count, sql, and, lte, or, isNull, gte } from "drizzle-orm";
import { securityLogger } from "./security";
import { z } from "zod";

// Validation schemas for admin operations
const updateUserSchema = z.object({
  isAdmin: z.boolean().optional(),
  subscriptionTier: z.enum(["free", "essential", "professional", "enterprise"]).optional(),
  emailVerified: z.boolean().optional(),
});

// Admin middleware - checks if authenticated user has isAdmin = true
// Must be used AFTER isAuthenticated middleware
export const isAdminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    if (!user.isAdmin) {
      securityLogger.warn("Unauthorized admin access attempt", { userId: user.id });
      return res.status(403).json({ error: "Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export function registerAdminRoutes(app: Express) {
  // Dashboard stats - protected by both isAuthenticated and isAdminMiddleware
  app.get("/api/admin/stats", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const [userCount] = await db.select({ count: count() }).from(users);
      const [messageCount] = await db.select({ count: count() }).from(contactMessages);
      const [subscriberCount] = await db.select({ count: count() }).from(newsletterSubscribers);
      const [scamReportCount] = await db.select({ count: count() }).from(scamReports);
      const [feedbackCount] = await db.select({ count: count() }).from(userFeedback);
      const [newFeedbackCount] = await db.select({ count: count() }).from(userFeedback).where(eq(userFeedback.status, "new"));
      
      const [premiumCount] = await db
        .select({ count: count() })
        .from(users)
        .where(sql`${users.subscriptionTier} != 'free' AND ${users.subscriptionTier} IS NOT NULL`);
      
      const [guideCount] = await db.select({ count: count() }).from(cyberSafetyGuides);
      const [publishedGuideCount] = await db.select({ count: count() }).from(cyberSafetyGuides).where(eq(cyberSafetyGuides.status, "published"));
      const [alertCount] = await db.select({ count: count() }).from(cyberThreatAlerts);
      const [publishedAlertCount] = await db.select({ count: count() }).from(cyberThreatAlerts).where(eq(cyberThreatAlerts.status, "published"));
      const [scamIntelCount] = await db.select({ count: count() }).from(scamIntelligence);
      const [socialPostCount] = await db.select({ count: count() }).from(socialPosts);
      const [draftSocialCount] = await db.select({ count: count() }).from(socialPosts).where(eq(socialPosts.status, "draft"));

      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const [recentGuideCount] = await db.select({ count: count() }).from(cyberSafetyGuides).where(gte(cyberSafetyGuides.createdAt, oneWeekAgo));
      const [recentSubscriberCount] = await db.select({ count: count() }).from(newsletterSubscribers).where(gte(newsletterSubscribers.createdAt, oneWeekAgo));

      const [pendingTaskCount] = await db.select({ count: count() }).from(growthTasks).where(eq(growthTasks.status, "pending"));

      res.json({
        totalUsers: userCount.count,
        premiumUsers: premiumCount.count,
        contactMessages: messageCount.count,
        newsletterSubscribers: subscriberCount.count,
        scamReports: scamReportCount.count,
        totalFeedback: feedbackCount.count,
        newFeedback: newFeedbackCount.count,
        totalGuides: guideCount.count,
        publishedGuides: publishedGuideCount.count,
        totalAlerts: alertCount.count,
        publishedAlerts: publishedAlertCount.count,
        totalScamIntel: scamIntelCount.count,
        totalSocialPosts: socialPostCount.count,
        draftSocialPosts: draftSocialCount.count,
        guidesThisWeek: recentGuideCount.count,
        newSubscribersThisWeek: recentSubscriberCount.count,
        pendingTasks: pendingTaskCount.count,
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // User management
  app.get("/api/admin/users", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const allUsers = await db
        .select()
        .from(users)
        .orderBy(desc(users.createdAt));
      res.json({ users: allUsers });
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body with Zod
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid data", details: validationResult.error.errors });
      }
      
      const { isAdmin: makeAdmin, subscriptionTier, emailVerified } = validationResult.data;
      
      const updateData: any = {};
      if (typeof makeAdmin === "boolean") updateData.isAdmin = makeAdmin;
      if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;
      if (typeof emailVerified === "boolean") updateData.emailVerified = emailVerified;
      
      const [updated] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();
      
      securityLogger.info("Admin updated user", { 
        adminId: req.user.id, 
        targetUserId: id, 
        changes: updateData 
      });
      
      res.json({ user: updated });
    } catch (error) {
      console.error("Admin update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Prevent self-deletion
      if (id === req.user.id) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      await db.delete(users).where(eq(users.id, id));
      
      securityLogger.info("Admin deleted user", { 
        adminId: req.user.id, 
        deletedUserId: id 
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Contact messages management
  app.get("/api/admin/contact-messages", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const messages = await db
        .select()
        .from(contactMessages)
        .orderBy(desc(contactMessages.createdAt));
      res.json({ messages });
    } catch (error) {
      console.error("Admin messages error:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.delete("/api/admin/contact-messages/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(contactMessages).where(eq(contactMessages.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete message error:", error);
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  // Newsletter subscribers management
  app.get("/api/admin/newsletter-subscribers", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const subscribers = await db
        .select()
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.createdAt));
      res.json({ subscribers });
    } catch (error) {
      console.error("Admin subscribers error:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });

  app.delete("/api/admin/newsletter-subscribers/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete subscriber error:", error);
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  // Export newsletter subscribers as CSV
  app.get("/api/admin/newsletter-subscribers/export", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const subscribers = await db
        .select()
        .from(newsletterSubscribers)
        .orderBy(desc(newsletterSubscribers.createdAt));
      
      const csv = "Email,Subscribed At\n" + subscribers
        .map(s => `"${s.email}","${s.createdAt?.toISOString() || ''}"`)
        .join("\n");
      
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=newsletter-subscribers.csv");
      res.send(csv);
    } catch (error) {
      console.error("Admin export subscribers error:", error);
      res.status(500).json({ error: "Failed to export subscribers" });
    }
  });

  // Scam reports management
  app.get("/api/admin/scam-reports", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const reports = await db
        .select()
        .from(scamReports)
        .orderBy(desc(scamReports.createdAt));
      res.json({ reports });
    } catch (error) {
      console.error("Admin scam reports error:", error);
      res.status(500).json({ error: "Failed to fetch scam reports" });
    }
  });

  app.delete("/api/admin/scam-reports/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(scamReports).where(eq(scamReports.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete scam report error:", error);
      res.status(500).json({ error: "Failed to delete scam report" });
    }
  });

  // Check if current user is admin - protected by isAuthenticated to ensure proper session
  app.get("/api/admin/check", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.json({ isAdmin: false });
      }
      
      res.json({ isAdmin: user.isAdmin || false });
    } catch (error) {
      res.json({ isAdmin: false });
    }
  });

  // Tool Usage Analytics - Admin Stats
  app.get("/api/admin/tool-analytics", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      // Get total usage per tool
      const toolStats = await db
        .select({
          toolName: toolUsage.toolName,
          totalUsage: count(),
          completedCount: sql<number>`COUNT(*) FILTER (WHERE ${toolUsage.completed} = true)`,
        })
        .from(toolUsage)
        .groupBy(toolUsage.toolName)
        .orderBy(sql`COUNT(*) DESC`);

      // Get usage by country
      const countryStats = await db
        .select({
          countryCode: toolUsage.countryCode,
          totalUsage: count(),
        })
        .from(toolUsage)
        .where(sql`${toolUsage.countryCode} IS NOT NULL`)
        .groupBy(toolUsage.countryCode)
        .orderBy(sql`COUNT(*) DESC`)
        .limit(10);

      // Get daily usage for last 30 days
      const dailyUsage = await db
        .select({
          date: sql<string>`DATE(${toolUsage.createdAt})`,
          totalUsage: count(),
        })
        .from(toolUsage)
        .where(sql`${toolUsage.createdAt} >= NOW() - INTERVAL '30 days'`)
        .groupBy(sql`DATE(${toolUsage.createdAt})`)
        .orderBy(sql`DATE(${toolUsage.createdAt})`);

      // Get total counts
      const [totalCount] = await db.select({ count: count() }).from(toolUsage);
      const [uniqueUsers] = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${toolUsage.userId})` })
        .from(toolUsage)
        .where(sql`${toolUsage.userId} IS NOT NULL`);
      const [uniqueSessions] = await db
        .select({ count: sql<number>`COUNT(DISTINCT ${toolUsage.sessionId})` })
        .from(toolUsage);

      // Get recent usage
      const recentUsage = await db
        .select()
        .from(toolUsage)
        .orderBy(desc(toolUsage.createdAt))
        .limit(20);

      res.json({
        summary: {
          totalUsage: totalCount.count,
          uniqueUsers: uniqueUsers.count,
          uniqueSessions: uniqueSessions.count,
        },
        toolStats,
        countryStats,
        dailyUsage,
        recentUsage,
      });
    } catch (error) {
      console.error("Admin tool analytics error:", error);
      res.status(500).json({ error: "Failed to fetch tool analytics" });
    }
  });
}

// Allowed tool names for validation
const ALLOWED_TOOLS = [
  'scam-checker',
  'password-generator', 
  'family-codeword',
  'url-scanner',
  'phone-lookup',
  'qr-scanner',
  'deepfake-education',
  'dezi-ai',
  'voice-detector',
  'security-scanner',
  'email-header-check',
  'data-broker-guest-scan',
  'data-broker-vault-save',
  'data-broker-exposure-scan',
  'data-broker-removal-request',
  'data-broker-optout-generate',
  'data-broker-monitoring-setup',
  'data-broker-monitoring-run',
];

// Simple in-memory rate limiter for tracking endpoint
const trackingRateLimiter = new Map<string, { count: number; resetTime: number }>();
const TRACKING_RATE_LIMIT = 30; // max requests per window
const TRACKING_RATE_WINDOW = 60 * 1000; // 1 minute window

function checkTrackingRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = trackingRateLimiter.get(ip);
  
  if (!entry || now > entry.resetTime) {
    trackingRateLimiter.set(ip, { count: 1, resetTime: now + TRACKING_RATE_WINDOW });
    return true;
  }
  
  if (entry.count >= TRACKING_RATE_LIMIT) {
    return false;
  }
  
  entry.count++;
  return true;
}

// Public endpoint for logging tool usage (with rate limiting)
export function registerToolTrackingRoutes(app: Express) {
  app.post("/api/track/tool", async (req: any, res) => {
    try {
      // Rate limiting check
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      if (!checkTrackingRateLimit(clientIP)) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      const validation = insertToolUsageSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid data" });
      }

      const { toolName, sessionId, countryCode, completed, metadata } = validation.data;
      
      // Validate tool name against allowlist
      if (!ALLOWED_TOOLS.includes(toolName)) {
        return res.status(400).json({ error: "Invalid tool name" });
      }
      
      // Limit metadata length to prevent abuse
      if (metadata && metadata.length > 500) {
        return res.status(400).json({ error: "Metadata too large" });
      }
      
      // Get user ID from session if authenticated
      const userId = req.user?.id || null;

      await db.insert(toolUsage).values({
        toolName,
        userId,
        sessionId,
        countryCode,
        completed: completed || false,
        metadata,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Tool tracking error:", error);
      res.status(500).json({ error: "Failed to track tool usage" });
    }
  });

  // === Platform Announcements ===

  // Public: Get active announcements (no auth required)
  app.get("/api/announcements", async (_req, res) => {
    try {
      const now = new Date();
      const manualAnnouncements = await db
        .select()
        .from(platformAnnouncements)
        .where(
          and(
            eq(platformAnnouncements.isActive, true),
            or(
              isNull(platformAnnouncements.startsAt),
              lte(platformAnnouncements.startsAt, now)
            ),
            or(
              isNull(platformAnnouncements.expiresAt),
              gte(platformAnnouncements.expiresAt, now)
            )
          )
        )
        .orderBy(desc(platformAnnouncements.createdAt));

      let alertAnnouncements: any[] = [];
      try {
        const recentAlerts = await storage.getPublishedThreatAlerts(undefined, 5);
        alertAnnouncements = recentAlerts
          .filter(alert => alert.riskLevel === 'critical' || alert.riskLevel === 'high')
          .slice(0, 3)
          .map(alert => ({
            id: `alert-${alert.id}`,
            title: alert.threatName,
            content: alert.metaDescription || alert.description?.slice(0, 120) || '',
            type: 'scam_alert' as const,
            priority: alert.riskLevel === 'critical' ? 'urgent' as const : 'normal' as const,
            isActive: true,
            linkUrl: `/alerts/${alert.slug}`,
            linkText: 'View details',
            startsAt: alert.publishedAt || alert.createdAt,
            expiresAt: null,
            createdAt: alert.publishedAt || alert.createdAt,
          }));
      } catch (alertErr) {
        console.error("Failed to fetch threat alerts for announcements:", alertErr);
      }

      const allAnnouncements = [...manualAnnouncements, ...alertAnnouncements];

      res.json({ announcements: allAnnouncements });
    } catch (error) {
      console.error("Fetch announcements error:", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // Admin: Get all announcements
  app.get("/api/admin/announcements", isAuthenticated, isAdminMiddleware, async (_req, res) => {
    try {
      const announcements = await db
        .select()
        .from(platformAnnouncements)
        .orderBy(desc(platformAnnouncements.createdAt));

      res.json({ announcements });
    } catch (error) {
      console.error("Admin fetch announcements error:", error);
      res.status(500).json({ error: "Failed to fetch announcements" });
    }
  });

  // Admin: Create announcement
  app.post("/api/admin/announcements", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const parsed = insertAnnouncementSchema.parse(req.body);
      const [announcement] = await db
        .insert(platformAnnouncements)
        .values(parsed)
        .returning();

      res.json({ announcement });
    } catch (error) {
      console.error("Create announcement error:", error);
      res.status(500).json({ error: "Failed to create announcement" });
    }
  });

  // Admin: Update announcement
  app.patch("/api/admin/announcements/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = insertAnnouncementSchema.partial();
      const parsed = updateSchema.parse(req.body);
      const [updated] = await db
        .update(platformAnnouncements)
        .set(parsed)
        .where(eq(platformAnnouncements.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Announcement not found" });
      }
      res.json({ announcement: updated });
    } catch (error) {
      console.error("Update announcement error:", error);
      res.status(500).json({ error: "Failed to update announcement" });
    }
  });

  // Admin: Delete announcement
  app.delete("/api/admin/announcements/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(platformAnnouncements).where(eq(platformAnnouncements.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete announcement error:", error);
      res.status(500).json({ error: "Failed to delete announcement" });
    }
  });

  // === Trending Threats ===

  // Public: Get active trending threats
  app.get("/api/trending-threats", async (req, res) => {
    try {
      const region = (req.query.region as string || "GLOBAL").toUpperCase();

      const threats = await db
        .select()
        .from(trendingThreats)
        .where(
          and(
            eq(trendingThreats.isActive, true),
            or(
              sql`${trendingThreats.regions} @> ARRAY[${region}]::text[]`,
              sql`${trendingThreats.regions} @> ARRAY['GLOBAL']::text[]`
            )
          )
        )
        .orderBy(trendingThreats.displayOrder, desc(trendingThreats.createdAt))
        .limit(6);

      const SOURCE_URL_FALLBACKS: Record<string, string> = {
        "CISA": "https://www.cisa.gov/news-events/cybersecurity-advisories",
        "BleepingComputer": "https://www.bleepingcomputer.com/",
        "The Hacker News": "https://thehackernews.com/",
        "Krebs": "https://krebsonsecurity.com/",
        "Dark Reading": "https://www.darkreading.com/",
        "FBI": "https://www.ic3.gov/Home/ComplaintChoice",
        "FTC": "https://consumer.ftc.gov/scams",
      };
      const threatsWithUrls = threats.map(t => {
        if (!t.linkUrl) {
          const match = Object.entries(SOURCE_URL_FALLBACKS).find(([k]) => t.source.includes(k));
          return { ...t, linkUrl: match ? match[1] : "https://www.cisa.gov/news-events/cybersecurity-advisories" };
        }
        return t;
      });
      res.json({ threats: threatsWithUrls, detectedRegion: region });
    } catch (error) {
      console.error("Fetch trending threats error:", error);
      res.status(500).json({ error: "Failed to fetch trending threats" });
    }
  });

  // Admin: Get all trending threats
  app.get("/api/admin/trending-threats", isAuthenticated, isAdminMiddleware, async (_req, res) => {
    try {
      const threats = await db
        .select()
        .from(trendingThreats)
        .orderBy(trendingThreats.displayOrder, desc(trendingThreats.createdAt));

      res.json({ threats });
    } catch (error) {
      console.error("Admin fetch trending threats error:", error);
      res.status(500).json({ error: "Failed to fetch trending threats" });
    }
  });

  // Admin: Create trending threat
  app.post("/api/admin/trending-threats", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const parsed = insertTrendingThreatSchema.parse(req.body);
      const [threat] = await db
        .insert(trendingThreats)
        .values(parsed)
        .returning();

      res.json({ threat });
    } catch (error) {
      console.error("Create trending threat error:", error);
      res.status(500).json({ error: "Failed to create trending threat" });
    }
  });

  // Admin: Update trending threat
  app.patch("/api/admin/trending-threats/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updateSchema = insertTrendingThreatSchema.partial();
      const parsed = updateSchema.parse(req.body);
      const [updated] = await db
        .update(trendingThreats)
        .set(parsed)
        .where(eq(trendingThreats.id, id))
        .returning();

      if (!updated) {
        return res.status(404).json({ error: "Trending threat not found" });
      }
      res.json({ threat: updated });
    } catch (error) {
      console.error("Update trending threat error:", error);
      res.status(500).json({ error: "Failed to update trending threat" });
    }
  });

  // Admin: Manually refresh trending threats (trigger AI generation)
  app.post("/api/admin/trending-threats/refresh", isAuthenticated, isAdminMiddleware, async (_req, res) => {
    try {
      const { refreshTrendingThreats } = await import("./trendingThreatService");
      const result = await refreshTrendingThreats();
      res.json({ success: true, ...result });
    } catch (error) {
      console.error("Manual threat refresh error:", error);
      res.status(500).json({ error: "Failed to refresh threats" });
    }
  });

  // Admin: Delete trending threat
  app.delete("/api/admin/trending-threats/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(trendingThreats).where(eq(trendingThreats.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Delete trending threat error:", error);
      res.status(500).json({ error: "Failed to delete trending threat" });
    }
  });

  app.get("/api/admin/feedback", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const feedback = status
        ? await db.select().from(userFeedback).where(eq(userFeedback.status, status)).orderBy(desc(userFeedback.createdAt))
        : await db.select().from(userFeedback).orderBy(desc(userFeedback.createdAt));
      res.json({ feedback });
    } catch (error) {
      console.error("Admin feedback error:", error);
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  app.patch("/api/admin/feedback/:id", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      const schema = z.object({
        status: z.enum(["new", "in_progress", "resolved", "dismissed"]).optional(),
        adminNotes: z.string().max(2000).optional(),
      });
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data" });
      }
      const updateData: Record<string, any> = { updatedAt: new Date() };
      if (parsed.data.status) updateData.status = parsed.data.status;
      if (parsed.data.adminNotes !== undefined) updateData.adminNotes = parsed.data.adminNotes;
      const [updated] = await db.update(userFeedback).set(updateData).where(eq(userFeedback.id, id)).returning();
      if (!updated) return res.status(404).json({ error: "Feedback not found" });
      res.json({ feedback: updated });
    } catch (error) {
      console.error("Admin feedback update error:", error);
      res.status(500).json({ error: "Failed to update feedback" });
    }
  });
}
