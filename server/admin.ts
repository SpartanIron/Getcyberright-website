import type { Express, Request, Response, NextFunction } from "express";
import { db } from "./db";
import { storage } from "./storage";
import { users, contactMessages, newsletterSubscribers, scamReports, toolUsage, insertToolUsageSchema, platformAnnouncements, insertAnnouncementSchema, trendingThreats, insertTrendingThreatSchema, userFeedback, cyberSafetyGuides, cyberThreatAlerts, scamIntelligence, socialPosts, growthTasks, shieldScans, exposureScans, exposureFindings, adminNotificationSettings, adminNotificationSettingsSchema, supportReplies, articleComments, newsArticles, savedReplies, insertSavedReplySchema } from "@shared/schema";
import { sendEmail, isEmailConfigured } from "./email-service";
import { isAuthenticated } from "./auth";
import { eq, desc, count, sql, and, lte, or, isNull, gte } from "drizzle-orm";
import { securityLogger } from "./security";
import { z } from "zod";
import bcrypt from "bcryptjs";

export const ADMIN_ROLES = ["super_admin", "admin", "editor", "viewer"] as const;
export type AdminRole = typeof ADMIN_ROLES[number];

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  super_admin: 4,
  admin: 3,
  editor: 2,
  viewer: 1,
};

export function hasMinimumRole(userRole: string | null | undefined, requiredRole: AdminRole): boolean {
  if (!userRole) return false;
  const userLevel = ROLE_HIERARCHY[userRole as AdminRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  if (userLevel === undefined || requiredLevel === undefined) return false;
  return userLevel >= requiredLevel;
}

const updateUserSchema = z.object({
  isAdmin: z.boolean().optional(),
  subscriptionTier: z.enum(["free", "essential", "professional", "enterprise"]).optional(),
  emailVerified: z.boolean().optional(),
  role: z.enum(ADMIN_ROLES).optional(),
});

const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(12, "Password must be at least 12 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  role: z.enum([...ADMIN_ROLES, "user"] as const).default("user"),
  subscriptionTier: z.enum(["free", "essential", "professional", "enterprise"]).default("free"),
  mustChangePassword: z.boolean().default(true),
});

export const isAdminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const hasRoleAccess = hasMinimumRole(user.role, "viewer");
    
    if (user.isAdmin && !hasRoleAccess) {
      await db.update(users).set({ role: "super_admin" }).where(eq(users.id, user.id));
      user.role = "super_admin";
    }
    
    if (!user.isAdmin && !hasRoleAccess) {
      securityLogger.warn("Unauthorized admin access attempt", { userId: user.id });
      return res.status(403).json({ error: "Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const requireRole = (minimumRole: AdminRole) => {
  return async (req: any, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!hasMinimumRole(user.role, minimumRole)) {
      securityLogger.warn("Insufficient role access attempt", { 
        userId: user.id, 
        userRole: user.role, 
        requiredRole: minimumRole 
      });
      return res.status(403).json({ error: `${minimumRole} access or higher required` });
    }
    next();
  };
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
        .select({
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          emailVerified: users.emailVerified,
          isAdmin: users.isAdmin,
          role: users.role,
          subscriptionTier: users.subscriptionTier,
          subscriptionExpiresAt: users.subscriptionExpiresAt,
          mustChangePassword: users.mustChangePassword,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt));
      res.json({ users: allUsers });
    } catch (error) {
      console.error("Admin users error:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", isAuthenticated, isAdminMiddleware, requireRole("super_admin"), async (req: any, res) => {
    try {
      const validationResult = createUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid data", details: validationResult.error.issues });
      }

      const { email, password, firstName, lastName, role, subscriptionTier, mustChangePassword } = validationResult.data;

      const [existing] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (existing) {
        return res.status(400).json({ error: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const isAdmin = role !== "user" && ADMIN_ROLES.includes(role as AdminRole);

      const [newUser] = await db.insert(users).values({
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: role,
        isAdmin,
        subscriptionTier,
        mustChangePassword,
        emailVerified: true,
      }).returning();

      securityLogger.info("Admin created user", {
        adminId: req.user.id,
        newUserId: newUser.id,
        email: email.toLowerCase(),
        role,
      });

      const { passwordHash: _ph, mfaSecret: _ms, mfaBackupCodes: _mbc, emailVerificationToken: _evt, passwordResetToken: _prt, ...safeUser } = newUser;
      res.json({ user: safeUser });
    } catch (error) {
      console.error("Admin create user error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/admin/users/:id", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const { id } = req.params;
      const requesterRole = req.user.role as AdminRole;
      
      const validationResult = updateUserSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid data", details: validationResult.error.issues });
      }
      
      const { isAdmin: makeAdmin, subscriptionTier, emailVerified, role } = validationResult.data;
      
      if ((role || typeof makeAdmin === "boolean") && !hasMinimumRole(requesterRole, "super_admin")) {
        return res.status(403).json({ error: "Only Super Admins can change user roles or admin status" });
      }
      
      if ((subscriptionTier || typeof emailVerified === "boolean") && !hasMinimumRole(requesterRole, "admin")) {
        return res.status(403).json({ error: "Admin access or higher required to change subscription or verification" });
      }
      
      const updateData: any = {};
      if (typeof makeAdmin === "boolean" && hasMinimumRole(requesterRole, "super_admin")) {
        updateData.isAdmin = makeAdmin;
      }
      if (subscriptionTier && hasMinimumRole(requesterRole, "admin")) {
        updateData.subscriptionTier = subscriptionTier;
      }
      if (typeof emailVerified === "boolean" && hasMinimumRole(requesterRole, "admin")) {
        updateData.emailVerified = emailVerified;
      }
      if (role && hasMinimumRole(requesterRole, "super_admin")) {
        updateData.role = role;
        updateData.isAdmin = ADMIN_ROLES.includes(role as AdminRole);
      }
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No valid updates provided" });
      }
      
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

  app.delete("/api/admin/users/:id", isAuthenticated, isAdminMiddleware, requireRole("super_admin"), async (req: any, res) => {
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

  app.post("/api/admin/users/:id/reset-password", isAuthenticated, isAdminMiddleware, requireRole("admin"), async (req: any, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || typeof newPassword !== "string" || newPassword.length < 12) {
        return res.status(400).json({ error: "Password must be at least 12 characters" });
      }

      const [targetUser] = await db.select().from(users).where(eq(users.id, id));
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await db.update(users).set({
        passwordHash,
        mustChangePassword: true,
        failedLoginAttempts: 0,
        lockedUntil: null,
      }).where(eq(users.id, id));

      securityLogger.info("Admin reset user password", {
        adminId: req.user.id,
        targetUserId: id,
        targetEmail: targetUser.email,
      });

      res.json({ success: true, message: "Password reset successfully. User will be prompted to change password on next login." });
    } catch (error) {
      console.error("Admin reset password error:", error);
      res.status(500).json({ error: "Failed to reset password" });
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

  // ==========================================
  // In-panel email replies (feedback + contact messages)
  // ==========================================

  function escapeHtml(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildReplyHtml(body: string): string {
    const safe = escapeHtml(body).replace(/\n/g, "<br>");
    return `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #1f2937; line-height: 1.6;">
      <p>${safe}</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
      <p style="font-size: 13px; color: #6b7280;">The GetCyberRight Team<br>
      <a href="https://www.getcyberright.com" style="color: #0d9488;">www.getcyberright.com</a></p>
    </div>`;
  }

  async function resolveAdminName(req: any): Promise<{ adminId: string | null; adminName: string | null }> {
    const adminId = req.session?.userId || null;
    if (!adminId) return { adminId: null, adminName: null };
    try {
      const [u] = await db.select().from(users).where(eq(users.id, adminId));
      const name = u ? ([u.firstName, u.lastName].filter(Boolean).join(" ").trim() || u.email || null) : null;
      return { adminId, adminName: name };
    } catch {
      return { adminId, adminName: null };
    }
  }

  const replyBodySchema = z.object({
    subject: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(5000),
  });

  app.post("/api/admin/feedback/:id/reply", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const parsed = replyBodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Subject and message are required" });

      const [item] = await db.select().from(userFeedback).where(eq(userFeedback.id, req.params.id));
      if (!item) return res.status(404).json({ error: "Feedback not found" });
      if (!item.email) return res.status(400).json({ error: "This feedback has no email address to reply to" });
      if (!isEmailConfigured()) return res.status(503).json({ error: "Email sending is not configured on this server" });

      const { adminId, adminName } = await resolveAdminName(req);
      const delivered = await sendEmail({
        to: [item.email],
        subject: parsed.data.subject,
        htmlBody: buildReplyHtml(parsed.data.body),
        textBody: parsed.data.body,
      });
      if (!delivered) return res.status(502).json({ error: "Email provider failed to send the reply" });

      const [reply] = await db.insert(supportReplies).values({
        targetType: "feedback",
        targetId: item.id,
        toEmail: item.email,
        subject: parsed.data.subject,
        body: parsed.data.body,
        adminId,
        adminName,
        delivered,
      }).returning();

      if (item.status === "new") {
        await db.update(userFeedback).set({ status: "in_progress", updatedAt: new Date() }).where(eq(userFeedback.id, item.id));
      }
      res.status(201).json({ reply });
    } catch (error) {
      console.error("Admin feedback reply error:", error);
      res.status(500).json({ error: "Failed to send reply" });
    }
  });

  app.get("/api/admin/feedback/:id/replies", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const replies = await db.select().from(supportReplies)
        .where(and(eq(supportReplies.targetType, "feedback"), eq(supportReplies.targetId, req.params.id)))
        .orderBy(desc(supportReplies.createdAt));
      res.json({ replies });
    } catch (error) {
      console.error("Admin feedback replies error:", error);
      res.status(500).json({ error: "Failed to load replies" });
    }
  });

  app.post("/api/admin/contact-messages/:id/reply", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const parsed = replyBodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Subject and message are required" });

      const [item] = await db.select().from(contactMessages).where(eq(contactMessages.id, req.params.id));
      if (!item) return res.status(404).json({ error: "Message not found" });
      if (!item.email) return res.status(400).json({ error: "This message has no email address to reply to" });
      if (!isEmailConfigured()) return res.status(503).json({ error: "Email sending is not configured on this server" });

      const { adminId, adminName } = await resolveAdminName(req);
      const delivered = await sendEmail({
        to: [item.email],
        subject: parsed.data.subject,
        htmlBody: buildReplyHtml(parsed.data.body),
        textBody: parsed.data.body,
      });
      if (!delivered) return res.status(502).json({ error: "Email provider failed to send the reply" });

      const [reply] = await db.insert(supportReplies).values({
        targetType: "contact",
        targetId: item.id,
        toEmail: item.email,
        subject: parsed.data.subject,
        body: parsed.data.body,
        adminId,
        adminName,
        delivered,
      }).returning();
      res.status(201).json({ reply });
    } catch (error) {
      console.error("Admin contact reply error:", error);
      res.status(500).json({ error: "Failed to send reply" });
    }
  });

  app.get("/api/admin/contact-messages/:id/replies", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const replies = await db.select().from(supportReplies)
        .where(and(eq(supportReplies.targetType, "contact"), eq(supportReplies.targetId, req.params.id)))
        .orderBy(desc(supportReplies.createdAt));
      res.json({ replies });
    } catch (error) {
      console.error("Admin contact replies error:", error);
      res.status(500).json({ error: "Failed to load replies" });
    }
  });

  // ==========================================
  // Unified inbox: aggregates contact messages, user feedback, scam reports,
  // and article comments into one normalized, sortable list with answered flags.
  // ==========================================
  app.get("/api/admin/inbox", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const typeFilter = req.query.type as string | undefined;
      const filter = req.query.filter as string | undefined;

      const [contacts, feedbacks, scams, comments, replies] = await Promise.all([
        db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),
        db.select().from(userFeedback).orderBy(desc(userFeedback.createdAt)),
        db.select().from(scamReports).orderBy(desc(scamReports.createdAt)),
        db
          .select({
            id: articleComments.id,
            authorName: articleComments.authorName,
            authorEmail: articleComments.authorEmail,
            content: articleComments.content,
            parentId: articleComments.parentId,
            isTeamReply: articleComments.isTeamReply,
            createdAt: articleComments.createdAt,
            articleTitle: newsArticles.title,
            articleSlug: newsArticles.slug,
          })
          .from(articleComments)
          .leftJoin(newsArticles, eq(articleComments.articleId, newsArticles.id))
          .orderBy(desc(articleComments.createdAt)),
        db.select().from(supportReplies),
      ]);

      const replied = new Set<string>();
      const replyCount = new Map<string, number>();
      for (const r of replies) {
        const key = `${r.targetType}:${r.targetId}`;
        replied.add(key);
        replyCount.set(key, (replyCount.get(key) || 0) + 1);
      }

      // Top-level comments that already have a team reply attached
      const teamRepliedParents = new Set<string>();
      for (const c of comments) {
        if (c.isTeamReply && c.parentId) teamRepliedParents.add(c.parentId);
      }

      type InboxItem = {
        id: string;
        type: "contact" | "feedback" | "scam" | "comment";
        name: string;
        email: string | null;
        category: string | null;
        title: string;
        preview: string;
        createdAt: Date | null;
        answered: boolean;
        replyCount: number;
        canReply: boolean;
        status: string | null;
        unanswered: boolean;
        meta: Record<string, any>;
      };

      const items: InboxItem[] = [];

      for (const m of contacts) {
        const key = `contact:${m.id}`;
        items.push({
          id: m.id, type: "contact", name: m.name, email: m.email,
          category: m.category, title: `Contact: ${m.category}`, preview: m.message,
          createdAt: m.createdAt, answered: replied.has(key), replyCount: replyCount.get(key) || 0,
          canReply: !!m.email, status: null, unanswered: false, meta: {},
        });
      }

      for (const f of feedbacks) {
        const key = `feedback:${f.id}`;
        items.push({
          id: f.id, type: "feedback", name: f.email || "Anonymous", email: f.email,
          category: f.category, title: `Feedback: ${f.category}`, preview: f.message,
          createdAt: f.createdAt, answered: replied.has(key), replyCount: replyCount.get(key) || 0,
          canReply: !!f.email, status: f.status, unanswered: false, meta: { page: f.page },
        });
      }

      for (const s of scams) {
        const key = `scam:${s.id}`;
        const anon = s.anonymous === "true";
        items.push({
          id: s.id, type: "scam",
          name: anon || !s.reporterEmail ? "Anonymous reporter" : s.reporterEmail,
          email: s.reporterEmail, category: s.scamType, title: `Scam report: ${s.scamType}`,
          preview: s.description, createdAt: s.createdAt, answered: replied.has(key),
          replyCount: replyCount.get(key) || 0, canReply: !!s.reporterEmail, status: null,
          unanswered: false,
          meta: { scammerContact: s.scammerContact, amountLost: s.amountLost, anonymous: anon },
        });
      }

      // Only top-level user comments are inbox items (team replies and nested replies are excluded)
      for (const c of comments) {
        if (c.isTeamReply || c.parentId) continue;
        items.push({
          id: c.id, type: "comment", name: c.authorName, email: c.authorEmail,
          category: null, title: c.articleTitle ? `Comment on: ${c.articleTitle}` : "Article comment",
          preview: c.content, createdAt: c.createdAt, answered: teamRepliedParents.has(c.id),
          replyCount: teamRepliedParents.has(c.id) ? 1 : 0, canReply: !!c.articleSlug, status: null,
          unanswered: false, meta: { articleSlug: c.articleSlug, articleTitle: c.articleTitle },
        });
      }

      for (const it of items) {
        it.unanswered =
          it.canReply && !it.answered &&
          (it.type !== "feedback" || (it.status !== "resolved" && it.status !== "dismissed"));
      }

      let result = items;
      if (typeFilter && ["contact", "feedback", "scam", "comment"].includes(typeFilter)) {
        result = result.filter((i) => i.type === typeFilter);
      }
      if (filter === "unanswered") {
        result = result.filter((i) => i.unanswered);
      }
      result.sort(
        (a, b) => (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0),
      );

      const counts = {
        total: items.length,
        unanswered: items.filter((i) => i.unanswered).length,
        contact: items.filter((i) => i.type === "contact").length,
        feedback: items.filter((i) => i.type === "feedback").length,
        scam: items.filter((i) => i.type === "scam").length,
        comment: items.filter((i) => i.type === "comment").length,
      };

      res.json({ items: result, counts });
    } catch (error) {
      console.error("Admin inbox error:", error);
      res.status(500).json({ error: "Failed to load inbox" });
    }
  });

  // Email reply to a scam report (only when the reporter left an email)
  app.post("/api/admin/scam-reports/:id/reply", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const parsed = replyBodySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Subject and message are required" });

      const [item] = await db.select().from(scamReports).where(eq(scamReports.id, req.params.id));
      if (!item) return res.status(404).json({ error: "Scam report not found" });
      if (!item.reporterEmail) return res.status(400).json({ error: "This report has no email address to reply to" });
      if (!isEmailConfigured()) return res.status(503).json({ error: "Email sending is not configured on this server" });

      const { adminId, adminName } = await resolveAdminName(req);
      const delivered = await sendEmail({
        to: [item.reporterEmail],
        subject: parsed.data.subject,
        htmlBody: buildReplyHtml(parsed.data.body),
        textBody: parsed.data.body,
      });
      if (!delivered) return res.status(502).json({ error: "Email provider failed to send the reply" });

      const [reply] = await db.insert(supportReplies).values({
        targetType: "scam",
        targetId: item.id,
        toEmail: item.reporterEmail,
        subject: parsed.data.subject,
        body: parsed.data.body,
        adminId,
        adminName,
        delivered,
      }).returning();
      res.status(201).json({ reply });
    } catch (error) {
      console.error("Admin scam reply error:", error);
      res.status(500).json({ error: "Failed to send reply" });
    }
  });

  app.get("/api/admin/scam-reports/:id/replies", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const replies = await db.select().from(supportReplies)
        .where(and(eq(supportReplies.targetType, "scam"), eq(supportReplies.targetId, req.params.id)))
        .orderBy(desc(supportReplies.createdAt));
      res.json({ replies });
    } catch (error) {
      console.error("Admin scam replies error:", error);
      res.status(500).json({ error: "Failed to load replies" });
    }
  });

  // Reply to an article comment in-thread (posts a public "GetCyberRight Team" reply)
  app.post("/api/admin/comments/:id/reply", isAuthenticated, isAdminMiddleware, async (req: any, res) => {
    try {
      const content = String(req.body?.content || "").trim();
      if (content.length < 2 || content.length > 2000) {
        return res.status(400).json({ error: "Reply must be between 2 and 2000 characters" });
      }
      const adminId = req.session?.userId;
      if (!adminId) return res.status(401).json({ error: "Not authenticated" });
      const [parent] = await db.select().from(articleComments).where(eq(articleComments.id, req.params.id));
      if (!parent) return res.status(404).json({ error: "Comment not found" });
      const topParentId = parent.parentId || parent.id;
      const [inserted] = await db.insert(articleComments).values({
        articleId: parent.articleId,
        userId: adminId,
        authorName: "GetCyberRight Team",
        authorEmail: null,
        content,
        parentId: topParentId,
        isTeamReply: true,
        status: "approved",
      }).returning();
      res.status(201).json({ comment: inserted });
    } catch (error) {
      console.error("Admin comment reply error:", error);
      res.status(500).json({ error: "Failed to post reply" });
    }
  });

  // Admin-scoped comment delete (respects the role-based admin model).
  // Also removes any replies attached to the deleted comment to avoid orphans.
  app.delete("/api/admin/comments/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      await db.delete(articleComments).where(
        or(eq(articleComments.id, req.params.id), eq(articleComments.parentId, req.params.id)),
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Admin comment delete error:", error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });

  // Saved/canned replies
  app.get("/api/admin/saved-replies", isAuthenticated, isAdminMiddleware, async (_req, res) => {
    try {
      const items = await db.select().from(savedReplies).orderBy(desc(savedReplies.createdAt));
      res.json({ savedReplies: items });
    } catch (error) {
      console.error("Admin saved replies list error:", error);
      res.status(500).json({ error: "Failed to load saved replies" });
    }
  });

  app.post("/api/admin/saved-replies", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const parsed = insertSavedReplySchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Title and message are required" });
      const [item] = await db.insert(savedReplies).values(parsed.data).returning();
      res.status(201).json({ savedReply: item });
    } catch (error) {
      console.error("Admin saved reply create error:", error);
      res.status(500).json({ error: "Failed to save reply" });
    }
  });

  app.delete("/api/admin/saved-replies/:id", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      await db.delete(savedReplies).where(eq(savedReplies.id, req.params.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Admin saved reply delete error:", error);
      res.status(500).json({ error: "Failed to delete saved reply" });
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
        return res.json({ isAdmin: false, role: null });
      }
      
      const isAdmin = user.isAdmin || hasMinimumRole(user.role, "viewer");
      res.json({ isAdmin, role: user.role || "user" });
    } catch (error) {
      res.json({ isAdmin: false, role: null });
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

  app.get("/api/admin/scans/data-broker", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const scans = await db
        .select({
          scanId: shieldScans.scanId,
          firstName: shieldScans.firstName,
          lastName: shieldScans.lastName,
          email: shieldScans.email,
          status: shieldScans.status,
          exposureScore: shieldScans.exposureScore,
          createdAt: shieldScans.createdAt,
          userId: shieldScans.userId,
        })
        .from(shieldScans)
        .orderBy(desc(shieldScans.createdAt))
        .limit(100);

      const [totalCount] = await db.select({ count: count() }).from(shieldScans);
      const [completedCount] = await db.select({ count: count() }).from(shieldScans).where(eq(shieldScans.status, "complete"));

      const exposureScansList = await db
        .select({
          id: exposureScans.id,
          userId: exposureScans.userId,
          status: exposureScans.status,
          brokersScanned: exposureScans.brokersScanned,
          exposuresFound: exposureScans.exposuresFound,
          createdAt: exposureScans.createdAt,
        })
        .from(exposureScans)
        .orderBy(desc(exposureScans.createdAt))
        .limit(100);

      const [exposureTotal] = await db.select({ count: count() }).from(exposureScans);

      res.json({
        shieldScans: {
          total: totalCount.count,
          completed: completedCount.count,
          recent: scans,
        },
        exposureScans: {
          total: exposureTotal.count,
          recent: exposureScansList,
        },
      });
    } catch (error) {
      console.error("Admin data broker scans error:", error);
      res.status(500).json({ error: "Failed to fetch scan data" });
    }
  });

  app.get("/api/admin/scans/scam-checks", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const scamChecks = await db
        .select()
        .from(toolUsage)
        .where(eq(toolUsage.toolName, "scam-checker"))
        .orderBy(desc(toolUsage.createdAt))
        .limit(100);

      const [totalScamChecks] = await db
        .select({ count: count() })
        .from(toolUsage)
        .where(eq(toolUsage.toolName, "scam-checker"));

      const reports = await db
        .select()
        .from(scamReports)
        .orderBy(desc(scamReports.createdAt))
        .limit(50);

      const [totalReports] = await db.select({ count: count() }).from(scamReports);

      res.json({
        scamChecks: {
          total: totalScamChecks.count,
          recent: scamChecks,
        },
        scamReports: {
          total: totalReports.count,
          recent: reports,
        },
      });
    } catch (error) {
      console.error("Admin scam checks error:", error);
      res.status(500).json({ error: "Failed to fetch scam check data" });
    }
  });

  // Admin notification destinations (Slack/webhook) for review-queue digests
  app.get("/api/admin/notification-settings", isAuthenticated, isAdminMiddleware, async (_req, res) => {
    try {
      const rows = await db.select().from(adminNotificationSettings).limit(1);
      const row = rows[0];
      res.json({
        slackWebhookUrl: row?.slackWebhookUrl || "",
        webhookUrl: row?.webhookUrl || "",
        updatedAt: row?.updatedAt || null,
        updatedBy: row?.updatedBy || null,
      });
    } catch (error) {
      console.error("Admin get notification settings error:", error);
      res.status(500).json({ error: "Failed to fetch notification settings" });
    }
  });

  app.put("/api/admin/notification-settings", isAuthenticated, isAdminMiddleware, requireRole("admin"), async (req: any, res) => {
    try {
      const parsed = adminNotificationSettingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data", details: parsed.error.issues });
      }
      const slackWebhookUrl = (parsed.data.slackWebhookUrl || "").trim() || null;
      const webhookUrl = (parsed.data.webhookUrl || "").trim() || null;

      const existing = await db.select().from(adminNotificationSettings).limit(1);
      if (existing[0]) {
        await db
          .update(adminNotificationSettings)
          .set({ slackWebhookUrl, webhookUrl, updatedAt: new Date(), updatedBy: req.user.id })
          .where(eq(adminNotificationSettings.id, existing[0].id));
      } else {
        await db.insert(adminNotificationSettings).values({
          id: "global",
          slackWebhookUrl,
          webhookUrl,
          updatedBy: req.user.id,
        });
      }

      securityLogger.info("Admin updated notification settings", {
        adminId: req.user.id,
        slackConfigured: Boolean(slackWebhookUrl),
        webhookConfigured: Boolean(webhookUrl),
      });
      res.json({ slackWebhookUrl: slackWebhookUrl || "", webhookUrl: webhookUrl || "" });
    } catch (error) {
      console.error("Admin update notification settings error:", error);
      res.status(500).json({ error: "Failed to update notification settings" });
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
