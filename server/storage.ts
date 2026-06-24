import {
  type User,
  type InsertUser,
  type ContactMessage,
  type InsertContactMessage,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type AiPrompt,
  type InsertAiPrompt,
  type PromptReview,
  type InsertPromptReview,
  type PromptReviewRun,
  type UserFeedback,
  type InsertUserFeedback,
  type CyberSafetyGuide,
  type InsertCyberSafetyGuide,
  type ScamIntelligence,
  type InsertScamIntelligence,
  type CyberThreatAlert,
  type InsertCyberThreatAlert,
  type SocialPost,
  type InsertSocialPost,
  type GrowthTask,
  type InsertGrowthTask,
  type PlatformMetric,
  type ScanHistoryEntry,
  type InsertScanHistory,
  type CommunityScamReport,
  type InsertCommunityScamReport,
  type ScanReport,
  type InsertScanReport,
  type ScamOfWeek,
  type InsertScamOfWeek,
  type NewsArticle,
  type InsertNewsArticle,
  type EngagementOpportunity,
  type InsertEngagementOpportunity,
  users,
  contactMessages,
  newsletterSubscribers,
  aiPrompts,
  promptReviews,
  promptReviewRuns,
  userFeedback,
  cyberSafetyGuides,
  scamIntelligence,
  cyberThreatAlerts,
  socialPosts,
  growthTasks,
  platformMetrics,
  scanHistory,
  communityScamReports,
  scanReports,
  scamOfWeek,
  newsArticles,
  engagementOpportunities,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, gte, lte, ilike, or } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;

  getActivePrompts(): Promise<AiPrompt[]>;
  getAllPrompts(): Promise<AiPrompt[]>;
  getPromptById(id: string): Promise<AiPrompt | undefined>;
  getPromptBySlug(slug: string): Promise<AiPrompt | undefined>;
  createPrompt(prompt: InsertAiPrompt): Promise<AiPrompt>;
  updatePrompt(id: string, data: Partial<InsertAiPrompt>): Promise<AiPrompt | undefined>;

  getPromptReviews(status?: string): Promise<PromptReview[]>;
  getPromptReviewById(id: string): Promise<PromptReview | undefined>;
  createPromptReview(review: InsertPromptReview): Promise<PromptReview>;
  updatePromptReviewStatus(id: string, status: string, reviewedBy?: string): Promise<PromptReview | undefined>;

  createPromptReviewRun(triggerType: string): Promise<PromptReviewRun>;
  updatePromptReviewRun(id: string, data: Partial<PromptReviewRun>): Promise<PromptReviewRun | undefined>;
  getPromptReviewRuns(limit?: number): Promise<PromptReviewRun[]>;

  createFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
  getAllFeedback(status?: string): Promise<UserFeedback[]>;
  getFeedbackById(id: string): Promise<UserFeedback | undefined>;
  updateFeedbackStatus(id: string, status: string, adminNotes?: string): Promise<UserFeedback | undefined>;
  getFeedbackCount(): Promise<number>;

  createGuide(guide: InsertCyberSafetyGuide): Promise<CyberSafetyGuide>;
  getGuideBySlug(slug: string): Promise<CyberSafetyGuide | undefined>;
  getGuideById(id: string): Promise<CyberSafetyGuide | undefined>;
  getPublishedGuides(category?: string, limit?: number): Promise<CyberSafetyGuide[]>;
  getAllGuides(status?: string): Promise<CyberSafetyGuide[]>;
  updateGuide(id: string, data: Partial<InsertCyberSafetyGuide>): Promise<CyberSafetyGuide | undefined>;
  deleteGuide(id: string): Promise<boolean>;
  getGuideCount(status?: string): Promise<number>;

  createScamIntel(scam: InsertScamIntelligence): Promise<ScamIntelligence>;
  getScamIntelBySlug(slug: string): Promise<ScamIntelligence | undefined>;
  getScamIntelById(id: string): Promise<ScamIntelligence | undefined>;
  getPublishedScamIntel(category?: string, limit?: number): Promise<ScamIntelligence[]>;
  getAllScamIntel(status?: string): Promise<ScamIntelligence[]>;
  updateScamIntel(id: string, data: Partial<InsertScamIntelligence>): Promise<ScamIntelligence | undefined>;
  deleteScamIntel(id: string): Promise<boolean>;
  getScamIntelCount(status?: string): Promise<number>;

  createThreatAlert(alert: InsertCyberThreatAlert): Promise<CyberThreatAlert>;
  getThreatAlertBySlug(slug: string): Promise<CyberThreatAlert | undefined>;
  getThreatAlertById(id: string): Promise<CyberThreatAlert | undefined>;
  getPublishedThreatAlerts(category?: string, limit?: number): Promise<CyberThreatAlert[]>;
  getAllThreatAlerts(status?: string): Promise<CyberThreatAlert[]>;
  updateThreatAlert(id: string, data: Partial<InsertCyberThreatAlert>): Promise<CyberThreatAlert | undefined>;
  deleteThreatAlert(id: string): Promise<boolean>;
  getThreatAlertCount(status?: string): Promise<number>;

  createSocialPost(post: InsertSocialPost & { id?: string }): Promise<SocialPost>;
  getSocialPosts(status?: string, limit?: number): Promise<SocialPost[]>;
  getSocialPostById(id: string): Promise<SocialPost | undefined>;
  getSocialPostsByContentId(contentType: string, contentId: string): Promise<SocialPost[]>;
  getPublishedSocialPostBySource(sourceRecordType: string, sourceRecordId: string): Promise<SocialPost | undefined>;
  updateSocialPost(id: string, data: Partial<InsertSocialPost & { publishedAt?: Date; publishError?: string | null }>): Promise<SocialPost | undefined>;
  getSocialPostCount(status?: string): Promise<number>;

  createGrowthTask(task: InsertGrowthTask): Promise<GrowthTask>;
  getGrowthTasks(status?: string, limit?: number): Promise<GrowthTask[]>;
  getGrowthTaskById(id: string): Promise<GrowthTask | undefined>;
  updateGrowthTask(id: string, data: Partial<GrowthTask>): Promise<GrowthTask | undefined>;
  getPendingGrowthTasks(taskType?: string): Promise<GrowthTask[]>;

  recordPlatformMetrics(metrics: Partial<PlatformMetric>): Promise<PlatformMetric>;
  getLatestPlatformMetrics(days?: number): Promise<PlatformMetric[]>;

  createScanHistory(entry: InsertScanHistory): Promise<ScanHistoryEntry>;
  getScanHistory(userId: string, limit?: number): Promise<ScanHistoryEntry[]>;

  createCommunityReport(report: InsertCommunityScamReport): Promise<CommunityScamReport>;
  getCommunityReports(status?: string, limit?: number): Promise<CommunityScamReport[]>;
  voteCommunityReport(id: string): Promise<CommunityScamReport | undefined>;

  createScanReport(report: InsertScanReport): Promise<ScanReport>;
  getScanReportByShareId(shareId: string): Promise<ScanReport | undefined>;

  createScamOfWeek(entry: InsertScamOfWeek): Promise<ScamOfWeek>;
  getActiveScamOfWeek(): Promise<ScamOfWeek | undefined>;
  getAllScamOfWeek(limit?: number): Promise<ScamOfWeek[]>;

  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getNewsArticles(category?: string, limit?: number): Promise<NewsArticle[]>;
  getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined>;
  getNewsArticleById(id: string): Promise<NewsArticle | undefined>;
  getNewsArticleBySourceUrl(sourceUrl: string): Promise<NewsArticle | undefined>;
  updateNewsArticle(id: string, patch: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined>;
  searchNewsArticles(query: string, limit?: number): Promise<NewsArticle[]>;
  getNewsArticleCount(): Promise<number>;

  createEngagementOpportunity(opp: InsertEngagementOpportunity): Promise<EngagementOpportunity>;
  getEngagementOpportunities(status?: string, limit?: number): Promise<EngagementOpportunity[]>;
  getEngagementOpportunityById(id: string): Promise<EngagementOpportunity | undefined>;
  updateEngagementOpportunity(id: string, data: Partial<EngagementOpportunity>): Promise<EngagementOpportunity | undefined>;
  deleteEngagementOpportunity(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const result = await db.insert(contactMessages).values(message).returning();
    return result[0];
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const result = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return result[0];
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const result = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return result[0];
  }

  async getActivePrompts(): Promise<AiPrompt[]> {
    return await db.select().from(aiPrompts).where(eq(aiPrompts.isActive, true)).orderBy(aiPrompts.title);
  }

  async getAllPrompts(): Promise<AiPrompt[]> {
    return await db.select().from(aiPrompts).orderBy(aiPrompts.title);
  }

  async getPromptById(id: string): Promise<AiPrompt | undefined> {
    const result = await db.select().from(aiPrompts).where(eq(aiPrompts.id, id));
    return result[0];
  }

  async getPromptBySlug(slug: string): Promise<AiPrompt | undefined> {
    const result = await db.select().from(aiPrompts).where(eq(aiPrompts.slug, slug));
    return result[0];
  }

  async createPrompt(prompt: InsertAiPrompt): Promise<AiPrompt> {
    const result = await db.insert(aiPrompts).values(prompt).returning();
    return result[0];
  }

  async updatePrompt(id: string, data: Partial<InsertAiPrompt>): Promise<AiPrompt | undefined> {
    const result = await db.update(aiPrompts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aiPrompts.id, id))
      .returning();
    return result[0];
  }

  async getPromptReviews(status?: string): Promise<PromptReview[]> {
    if (status) {
      return await db.select().from(promptReviews)
        .where(eq(promptReviews.status, status))
        .orderBy(desc(promptReviews.createdAt));
    }
    return await db.select().from(promptReviews).orderBy(desc(promptReviews.createdAt));
  }

  async getPromptReviewById(id: string): Promise<PromptReview | undefined> {
    const result = await db.select().from(promptReviews).where(eq(promptReviews.id, id));
    return result[0];
  }

  async createPromptReview(review: InsertPromptReview): Promise<PromptReview> {
    const result = await db.insert(promptReviews).values(review).returning();
    return result[0];
  }

  async updatePromptReviewStatus(id: string, status: string, reviewedBy?: string): Promise<PromptReview | undefined> {
    const result = await db.update(promptReviews)
      .set({
        status,
        reviewedBy: reviewedBy || null,
        reviewedAt: new Date(),
      })
      .where(eq(promptReviews.id, id))
      .returning();
    return result[0];
  }

  async createPromptReviewRun(triggerType: string): Promise<PromptReviewRun> {
    const result = await db.insert(promptReviewRuns).values({
      triggerType,
      status: "running",
    }).returning();
    return result[0];
  }

  async updatePromptReviewRun(id: string, data: Partial<PromptReviewRun>): Promise<PromptReviewRun | undefined> {
    const result = await db.update(promptReviewRuns)
      .set(data)
      .where(eq(promptReviewRuns.id, id))
      .returning();
    return result[0];
  }

  async getPromptReviewRuns(limit = 20): Promise<PromptReviewRun[]> {
    return await db.select().from(promptReviewRuns)
      .orderBy(desc(promptReviewRuns.startedAt))
      .limit(limit);
  }
  async createFeedback(feedback: InsertUserFeedback): Promise<UserFeedback> {
    const result = await db.insert(userFeedback).values(feedback).returning();
    return result[0];
  }

  async getAllFeedback(status?: string): Promise<UserFeedback[]> {
    if (status) {
      return await db.select().from(userFeedback)
        .where(eq(userFeedback.status, status))
        .orderBy(desc(userFeedback.createdAt));
    }
    return await db.select().from(userFeedback).orderBy(desc(userFeedback.createdAt));
  }

  async getFeedbackById(id: string): Promise<UserFeedback | undefined> {
    const result = await db.select().from(userFeedback).where(eq(userFeedback.id, id));
    return result[0];
  }

  async updateFeedbackStatus(id: string, status: string, adminNotes?: string): Promise<UserFeedback | undefined> {
    const updateData: Record<string, any> = { status, updatedAt: new Date() };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    const result = await db.update(userFeedback)
      .set(updateData)
      .where(eq(userFeedback.id, id))
      .returning();
    return result[0];
  }

  async getFeedbackCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(userFeedback);
    return Number(result[0].count);
  }

  async createGuide(guide: InsertCyberSafetyGuide): Promise<CyberSafetyGuide> {
    const result = await db.insert(cyberSafetyGuides).values(guide).returning();
    return result[0];
  }

  async getGuideBySlug(slug: string): Promise<CyberSafetyGuide | undefined> {
    const result = await db.select().from(cyberSafetyGuides).where(eq(cyberSafetyGuides.slug, slug));
    return result[0];
  }

  async getGuideById(id: string): Promise<CyberSafetyGuide | undefined> {
    const result = await db.select().from(cyberSafetyGuides).where(eq(cyberSafetyGuides.id, id));
    return result[0];
  }

  async getPublishedGuides(category?: string, limit = 50): Promise<CyberSafetyGuide[]> {
    const conditions = [eq(cyberSafetyGuides.status, "published")];
    if (category) conditions.push(eq(cyberSafetyGuides.category, category));
    return await db.select().from(cyberSafetyGuides)
      .where(and(...conditions))
      .orderBy(desc(cyberSafetyGuides.publishedAt))
      .limit(limit);
  }

  async getAllGuides(status?: string): Promise<CyberSafetyGuide[]> {
    if (status) {
      return await db.select().from(cyberSafetyGuides)
        .where(eq(cyberSafetyGuides.status, status))
        .orderBy(desc(cyberSafetyGuides.createdAt));
    }
    return await db.select().from(cyberSafetyGuides).orderBy(desc(cyberSafetyGuides.createdAt));
  }

  async updateGuide(id: string, data: Partial<InsertCyberSafetyGuide>): Promise<CyberSafetyGuide | undefined> {
    const result = await db.update(cyberSafetyGuides)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cyberSafetyGuides.id, id))
      .returning();
    return result[0];
  }

  async deleteGuide(id: string): Promise<boolean> {
    const result = await db.delete(cyberSafetyGuides).where(eq(cyberSafetyGuides.id, id)).returning();
    return result.length > 0;
  }

  async getGuideCount(status?: string): Promise<number> {
    const conditions = status ? [eq(cyberSafetyGuides.status, status)] : [];
    const result = await db.select({ count: sql<number>`count(*)` }).from(cyberSafetyGuides)
      .where(conditions.length ? and(...conditions) : undefined);
    return Number(result[0].count);
  }

  async createScamIntel(scam: InsertScamIntelligence): Promise<ScamIntelligence> {
    const result = await db.insert(scamIntelligence).values(scam).returning();
    return result[0];
  }

  async getScamIntelBySlug(slug: string): Promise<ScamIntelligence | undefined> {
    const result = await db.select().from(scamIntelligence).where(eq(scamIntelligence.slug, slug));
    return result[0];
  }

  async getScamIntelById(id: string): Promise<ScamIntelligence | undefined> {
    const result = await db.select().from(scamIntelligence).where(eq(scamIntelligence.id, id));
    return result[0];
  }

  async getPublishedScamIntel(category?: string, limit = 50): Promise<ScamIntelligence[]> {
    const conditions = [eq(scamIntelligence.status, "published")];
    if (category) conditions.push(eq(scamIntelligence.scamCategory, category));
    return await db.select().from(scamIntelligence)
      .where(and(...conditions))
      .orderBy(desc(scamIntelligence.lastUpdated))
      .limit(limit);
  }

  async getAllScamIntel(status?: string): Promise<ScamIntelligence[]> {
    if (status) {
      return await db.select().from(scamIntelligence)
        .where(eq(scamIntelligence.status, status))
        .orderBy(desc(scamIntelligence.createdAt));
    }
    return await db.select().from(scamIntelligence).orderBy(desc(scamIntelligence.createdAt));
  }

  async updateScamIntel(id: string, data: Partial<InsertScamIntelligence>): Promise<ScamIntelligence | undefined> {
    const result = await db.update(scamIntelligence)
      .set({ ...data, lastUpdated: new Date() })
      .where(eq(scamIntelligence.id, id))
      .returning();
    return result[0];
  }

  async deleteScamIntel(id: string): Promise<boolean> {
    const result = await db.delete(scamIntelligence).where(eq(scamIntelligence.id, id)).returning();
    return result.length > 0;
  }

  async getScamIntelCount(status?: string): Promise<number> {
    const conditions = status ? [eq(scamIntelligence.status, status)] : [];
    const result = await db.select({ count: sql<number>`count(*)` }).from(scamIntelligence)
      .where(conditions.length ? and(...conditions) : undefined);
    return Number(result[0].count);
  }

  async createThreatAlert(alert: InsertCyberThreatAlert): Promise<CyberThreatAlert> {
    const result = await db.insert(cyberThreatAlerts).values(alert).returning();
    return result[0];
  }

  async getThreatAlertBySlug(slug: string): Promise<CyberThreatAlert | undefined> {
    const result = await db.select().from(cyberThreatAlerts).where(eq(cyberThreatAlerts.slug, slug));
    return result[0];
  }

  async getThreatAlertById(id: string): Promise<CyberThreatAlert | undefined> {
    const result = await db.select().from(cyberThreatAlerts).where(eq(cyberThreatAlerts.id, id));
    return result[0];
  }

  async getPublishedThreatAlerts(category?: string, limit = 50): Promise<CyberThreatAlert[]> {
    const conditions = [eq(cyberThreatAlerts.status, "published")];
    if (category) conditions.push(eq(cyberThreatAlerts.threatCategory, category));
    return await db.select().from(cyberThreatAlerts)
      .where(and(...conditions))
      .orderBy(desc(cyberThreatAlerts.dateDetected))
      .limit(limit);
  }

  async getAllThreatAlerts(status?: string): Promise<CyberThreatAlert[]> {
    if (status) {
      return await db.select().from(cyberThreatAlerts)
        .where(eq(cyberThreatAlerts.status, status))
        .orderBy(desc(cyberThreatAlerts.createdAt));
    }
    return await db.select().from(cyberThreatAlerts).orderBy(desc(cyberThreatAlerts.createdAt));
  }

  async updateThreatAlert(id: string, data: Partial<InsertCyberThreatAlert>): Promise<CyberThreatAlert | undefined> {
    const result = await db.update(cyberThreatAlerts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(cyberThreatAlerts.id, id))
      .returning();
    return result[0];
  }

  async deleteThreatAlert(id: string): Promise<boolean> {
    const result = await db.delete(cyberThreatAlerts).where(eq(cyberThreatAlerts.id, id)).returning();
    return result.length > 0;
  }

  async getThreatAlertCount(status?: string): Promise<number> {
    const conditions = status ? [eq(cyberThreatAlerts.status, status)] : [];
    const result = await db.select({ count: sql<number>`count(*)` }).from(cyberThreatAlerts)
      .where(conditions.length ? and(...conditions) : undefined);
    return Number(result[0].count);
  }

  async createSocialPost(post: InsertSocialPost & { id?: string }): Promise<SocialPost> {
    const result = await db.insert(socialPosts).values(post).returning();
    return result[0];
  }

  async getSocialPostsByContentId(contentType: string, contentId: string): Promise<SocialPost[]> {
    return await db.select().from(socialPosts)
      .where(and(eq(socialPosts.contentType, contentType), eq(socialPosts.contentId, contentId)));
  }

  async getPublishedSocialPostBySource(sourceRecordType: string, sourceRecordId: string): Promise<SocialPost | undefined> {
    const result = await db.select().from(socialPosts)
      .where(and(
        eq(socialPosts.status, "published"),
        eq(socialPosts.sourceRecordType, sourceRecordType),
        eq(socialPosts.sourceRecordId, sourceRecordId),
      ))
      .orderBy(desc(socialPosts.publishedAt))
      .limit(1);
    return result[0];
  }

  async getSocialPosts(status?: string, limit = 50): Promise<SocialPost[]> {
    if (status) {
      return await db.select().from(socialPosts)
        .where(eq(socialPosts.status, status))
        .orderBy(desc(socialPosts.createdAt))
        .limit(limit);
    }
    return await db.select().from(socialPosts).orderBy(desc(socialPosts.createdAt)).limit(limit);
  }

  async getSocialPostById(id: string): Promise<SocialPost | undefined> {
    const result = await db.select().from(socialPosts).where(eq(socialPosts.id, id));
    return result[0];
  }

  async updateSocialPost(id: string, data: Partial<InsertSocialPost & { publishedAt?: Date; publishError?: string | null }>): Promise<SocialPost | undefined> {
    const result = await db.update(socialPosts)
      .set(data)
      .where(eq(socialPosts.id, id))
      .returning();
    return result[0];
  }

  async getSocialPostCount(status?: string): Promise<number> {
    const conditions = status ? [eq(socialPosts.status, status)] : [];
    const result = await db.select({ count: sql<number>`count(*)` }).from(socialPosts)
      .where(conditions.length ? and(...conditions) : undefined);
    return Number(result[0].count);
  }

  async createGrowthTask(task: InsertGrowthTask): Promise<GrowthTask> {
    const result = await db.insert(growthTasks).values(task).returning();
    return result[0];
  }

  async getGrowthTasks(status?: string, limit = 50): Promise<GrowthTask[]> {
    if (status) {
      return await db.select().from(growthTasks)
        .where(eq(growthTasks.status, status))
        .orderBy(desc(growthTasks.createdAt))
        .limit(limit);
    }
    return await db.select().from(growthTasks).orderBy(desc(growthTasks.createdAt)).limit(limit);
  }

  async getGrowthTaskById(id: string): Promise<GrowthTask | undefined> {
    const result = await db.select().from(growthTasks).where(eq(growthTasks.id, id));
    return result[0];
  }

  async updateGrowthTask(id: string, data: Partial<GrowthTask>): Promise<GrowthTask | undefined> {
    const result = await db.update(growthTasks)
      .set(data)
      .where(eq(growthTasks.id, id))
      .returning();
    return result[0];
  }

  async getPendingGrowthTasks(taskType?: string): Promise<GrowthTask[]> {
    const conditions = [eq(growthTasks.status, "pending")];
    if (taskType) conditions.push(eq(growthTasks.taskType, taskType));
    return await db.select().from(growthTasks)
      .where(and(...conditions))
      .orderBy(growthTasks.scheduledAt);
  }

  async recordPlatformMetrics(metrics: Partial<PlatformMetric>): Promise<PlatformMetric> {
    const result = await db.insert(platformMetrics).values({
      metricDate: new Date(),
      ...metrics,
    } as any).returning();
    return result[0];
  }

  async getLatestPlatformMetrics(days = 30): Promise<PlatformMetric[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return await db.select().from(platformMetrics)
      .where(gte(platformMetrics.metricDate, cutoff))
      .orderBy(desc(platformMetrics.metricDate));
  }

  async createScanHistory(entry: InsertScanHistory): Promise<ScanHistoryEntry> {
    const result = await db.insert(scanHistory).values(entry).returning();
    return result[0];
  }

  async getScanHistory(userId: string, limit = 20): Promise<ScanHistoryEntry[]> {
    return await db.select().from(scanHistory)
      .where(eq(scanHistory.userId, userId))
      .orderBy(desc(scanHistory.createdAt))
      .limit(limit);
  }

  async createCommunityReport(report: InsertCommunityScamReport): Promise<CommunityScamReport> {
    const result = await db.insert(communityScamReports).values(report).returning();
    return result[0];
  }

  async getCommunityReports(status?: string, limit = 20): Promise<CommunityScamReport[]> {
    if (status) {
      return await db.select().from(communityScamReports)
        .where(eq(communityScamReports.status, status))
        .orderBy(desc(communityScamReports.votes))
        .limit(limit);
    }
    return await db.select().from(communityScamReports)
      .orderBy(desc(communityScamReports.votes))
      .limit(limit);
  }

  async voteCommunityReport(id: string): Promise<CommunityScamReport | undefined> {
    const result = await db.update(communityScamReports)
      .set({ votes: sql`${communityScamReports.votes} + 1` })
      .where(eq(communityScamReports.id, id))
      .returning();
    return result[0];
  }

  async createScanReport(report: InsertScanReport): Promise<ScanReport> {
    const result = await db.insert(scanReports).values(report).returning();
    return result[0];
  }

  async getScanReportByShareId(shareId: string): Promise<ScanReport | undefined> {
    const result = await db.select().from(scanReports)
      .where(eq(scanReports.shareId, shareId));
    return result[0];
  }

  async createScamOfWeek(entry: InsertScamOfWeek): Promise<ScamOfWeek> {
    const result = await db.insert(scamOfWeek).values(entry).returning();
    return result[0];
  }

  async getActiveScamOfWeek(): Promise<ScamOfWeek | undefined> {
    const result = await db.select().from(scamOfWeek)
      .where(eq(scamOfWeek.isActive, true))
      .orderBy(desc(scamOfWeek.weekStart))
      .limit(1);
    return result[0];
  }

  async getAllScamOfWeek(limit = 10): Promise<ScamOfWeek[]> {
    return await db.select().from(scamOfWeek)
      .orderBy(desc(scamOfWeek.weekStart))
      .limit(limit);
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const { assertSpineFieldsValid } = await import("./editorialSpine");
    assertSpineFieldsValid(article);
    const result = await db.insert(newsArticles).values(article).returning();
    return result[0];
  }

  async getNewsArticles(category?: string, limit = 50): Promise<NewsArticle[]> {
    if (category) {
      return await db.select().from(newsArticles)
        .where(eq(newsArticles.category, category))
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit);
    }
    return await db.select().from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  async getNewsArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug));
    return result[0];
  }

  async getNewsArticleById(id: string): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return result[0];
  }

  async getNewsArticleBySourceUrl(sourceUrl: string): Promise<NewsArticle | undefined> {
    const result = await db.select().from(newsArticles).where(eq(newsArticles.sourceUrl, sourceUrl));
    return result[0];
  }

  async updateNewsArticle(id: string, patch: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const { assertSpineFieldsValid } = await import("./editorialSpine");
    assertSpineFieldsValid(patch);
    const result = await db
      .update(newsArticles)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(newsArticles.id, id))
      .returning();
    return result[0];
  }

  async searchNewsArticles(query: string, limit = 30): Promise<NewsArticle[]> {
    const searchTerm = `%${query}%`;
    return await db.select().from(newsArticles)
      .where(or(
        ilike(newsArticles.title, searchTerm),
        ilike(newsArticles.excerpt, searchTerm),
        ilike(newsArticles.source, searchTerm),
      ))
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  async getNewsArticleCount(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(newsArticles);
    return Number(result[0].count);
  }

  async createEngagementOpportunity(opp: InsertEngagementOpportunity): Promise<EngagementOpportunity> {
    const result = await db.insert(engagementOpportunities).values(opp).returning();
    return result[0];
  }

  async getEngagementOpportunities(status?: string, limit: number = 50): Promise<EngagementOpportunity[]> {
    if (status && status !== "all") {
      return db.select().from(engagementOpportunities)
        .where(eq(engagementOpportunities.status, status))
        .orderBy(desc(engagementOpportunities.relevanceScore))
        .limit(limit);
    }
    return db.select().from(engagementOpportunities)
      .orderBy(desc(engagementOpportunities.discoveredAt))
      .limit(limit);
  }

  async getEngagementOpportunityById(id: string): Promise<EngagementOpportunity | undefined> {
    const result = await db.select().from(engagementOpportunities)
      .where(eq(engagementOpportunities.id, id));
    return result[0];
  }

  async updateEngagementOpportunity(id: string, data: Partial<EngagementOpportunity>): Promise<EngagementOpportunity | undefined> {
    const result = await db.update(engagementOpportunities)
      .set(data)
      .where(eq(engagementOpportunities.id, id))
      .returning();
    return result[0];
  }

  async deleteEngagementOpportunity(id: string): Promise<boolean> {
    const result = await db.delete(engagementOpportunities)
      .where(eq(engagementOpportunities.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
