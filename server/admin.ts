import type { Express, Request, Response, NextFunction } from "express";
import { db } from "./db";
import { users, contactMessages, newsletterSubscribers, scamReports } from "@shared/schema";
import { authStorage } from "./replit_integrations/auth";
import { eq, desc, count, sql } from "drizzle-orm";
import { securityLogger } from "./security";

// Admin middleware - checks if user is authenticated and has isAdmin = true
export const isAdmin = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.claims?.sub;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await authStorage.getUser(userId);
    if (!user || !user.isAdmin) {
      securityLogger.warn("Unauthorized admin access attempt", { userId });
      return res.status(403).json({ error: "Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export function registerAdminRoutes(app: Express) {
  // Dashboard stats
  app.get("/api/admin/stats", isAdmin, async (req, res) => {
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
  app.get("/api/admin/users", isAdmin, async (req, res) => {
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

  app.patch("/api/admin/users/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { isAdmin: makeAdmin, subscriptionTier } = req.body;
      
      const updateData: any = {};
      if (typeof makeAdmin === "boolean") updateData.isAdmin = makeAdmin;
      if (subscriptionTier) updateData.subscriptionTier = subscriptionTier;
      
      const [updated] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();
      
      securityLogger.info("Admin updated user", { 
        adminId: req.user.claims.sub, 
        targetUserId: id, 
        changes: updateData 
      });
      
      res.json({ user: updated });
    } catch (error) {
      console.error("Admin update user error:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", isAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Prevent self-deletion
      if (id === req.user.claims.sub) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      await db.delete(users).where(eq(users.id, id));
      
      securityLogger.info("Admin deleted user", { 
        adminId: req.user.claims.sub, 
        deletedUserId: id 
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Contact messages management
  app.get("/api/admin/contact-messages", isAdmin, async (req, res) => {
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

  app.delete("/api/admin/contact-messages/:id", isAdmin, async (req, res) => {
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
  app.get("/api/admin/newsletter-subscribers", isAdmin, async (req, res) => {
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

  app.delete("/api/admin/newsletter-subscribers/:id", isAdmin, async (req, res) => {
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
  app.get("/api/admin/newsletter-subscribers/export", isAdmin, async (req, res) => {
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
  app.get("/api/admin/scam-reports", isAdmin, async (req, res) => {
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

  app.delete("/api/admin/scam-reports/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(scamReports).where(eq(scamReports.id, id));
      res.json({ success: true });
    } catch (error) {
      console.error("Admin delete scam report error:", error);
      res.status(500).json({ error: "Failed to delete scam report" });
    }
  });

  // Check if current user is admin
  app.get("/api/admin/check", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.json({ isAdmin: false });
      }
      
      const user = await authStorage.getUser(userId);
      res.json({ isAdmin: user?.isAdmin || false });
    } catch (error) {
      res.json({ isAdmin: false });
    }
  });
}
