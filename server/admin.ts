import type { Express, Request, Response, NextFunction } from "express";
import { db } from "./db";
import { users, contactMessages, newsletterSubscribers, scamReports, toolUsage, insertToolUsageSchema } from "@shared/schema";
import { isAuthenticated } from "./auth";
import { eq, desc, count, sql } from "drizzle-orm";
import { securityLogger } from "./security";
import { z } from "zod";

// Validation schemas for admin operations
const updateUserSchema = z.object({
  isAdmin: z.boolean().optional(),
  subscriptionTier: z.enum(["free", "essential", "professional", "enterprise"]).optional(),
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
      
      // Count premium users
      const [premiumCount] = await db
        .select({ count: count() })
        .from(users)
        .where(sql`${users.subscriptionTier} != 'free' AND ${users.subscriptionTier} IS NOT NULL`);
      
      res.json({
        totalUsers: userCount.count,
        premiumUsers: premiumCount.count,
        contactMessages: messageCount.count,
        newsletterSubscribers: subscriberCount.count,
        scamReports: scamReportCount.count,
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
      
      const { isAdmin: makeAdmin, subscriptionTier } = validationResult.data;
      
      const updateData: any = {};
      if (typeof makeAdmin === "boolean") updateData.isAdmin = makeAdmin;
      if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;
      
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
  'ssl_checker'
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
}
