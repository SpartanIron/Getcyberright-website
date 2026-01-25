import { 
  users, articles, resources, newsletters, cyberAssessments, userAssessmentResults, cyberAchievements, userAchievements,
  featuredPeople, podcasts, blogPosts, dailyTipsSubscriptions, dailyTips, techEvents,
  threatStats, ageGroupStats, regionalAttackTypes, safetyTipTemplates, emailSendLog, partnershipInquiries, userFeedback, weeklyDigests, scamTrends, auditLogs, securityAlerts, scamCheckerUsage, breachCheckerUsage,
  breachMonitoringSubscriptions, breachCheckResults, toolUsage, contactSubmissions,
  webauthnCredentials, webauthnChallenges,
  type User, type InsertUser,
  type AuditLog, type InsertAuditLog,
  type WebauthnCredential, type InsertWebauthnCredential,
  type WebauthnChallenge, type InsertWebauthnChallenge,
  type Article, type InsertArticle,
  type Resource, type InsertResource,
  type Newsletter, type InsertNewsletter,
  type CyberAssessment, type InsertCyberAssessment,
  type UserAssessmentResult, type InsertUserAssessmentResult,
  type CyberAchievement, type InsertCyberAchievement,
  type UserAchievement, type InsertUserAchievement,
  type FeaturedPerson, type InsertFeaturedPerson,
  type Podcast, type InsertPodcast,
  type BlogPost, type InsertBlogPost,
  type DailyTipsSubscription,
  type TechEvent, type InsertTechEvent,
  type ThreatStat, type InsertThreatStat,
  type AgeGroupStat, type InsertAgeGroupStat,
  type RegionalAttackType, type InsertRegionalAttackType,
  type SafetyTipTemplate, type InsertSafetyTipTemplate,
  type PartnershipInquiry, type InsertPartnershipInquiry,
  type UserFeedback, type InsertUserFeedback,
  type WeeklyDigest, type InsertWeeklyDigest,
  type DailyTip, type InsertDailyTip,
  type ScamTrend,
  type SecurityAlert, type InsertSecurityAlert,
  type ToolUsage, type InsertToolUsage,
  type ContactSubmission, type InsertContactSubmission
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, count, gt, gte, sql } from "drizzle-orm";
import crypto from "crypto";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    await this.seedCyberAssessmentData();
    await this.seedAchievementData();
    await this.seedTechEventsData();
    await this.seedThreatStatsData();
  }

  private async seedCyberAssessmentData() {
    try {
      // Check if assessment data already exists
      const existingAssessments = await db.select().from(cyberAssessments).limit(1);
      if (existingAssessments.length > 0) {
        return; // Data already seeded
      }

      // Seed cybersecurity assessment questions
      const assessmentData: InsertCyberAssessment[] = [
        {
          title: "Password Security Fundamentals",
          category: "Authentication",
          description: "Test your knowledge of password security best practices",
          difficulty: "beginner",
          scenario: "You are setting up a new account for a critical business application.",
          question: "Which of the following is the most secure password strategy?",
          options: [
            "Using the same strong password across all accounts",
            "Using a unique complex password with multi-factor authentication",
            "Using a simple password that's easy to remember",
            "Sharing passwords with trusted colleagues for backup access"
          ],
          correctAnswer: 1,
          explanation: "A unique complex password combined with multi-factor authentication provides the strongest security. Reusing passwords creates vulnerabilities if one account is compromised.",
          points: 10,
          tags: ["passwords", "authentication", "mfa"]
        },
        {
          title: "Phishing Email Detection",
          category: "Social Engineering",
          description: "Learn to identify sophisticated phishing attempts",
          difficulty: "intermediate",
          scenario: "You receive an urgent email claiming to be from your bank asking you to verify your account.",
          question: "What is the most reliable way to verify if this email is legitimate?",
          options: [
            "Click the link in the email to check",
            "Reply to the email asking for verification",
            "Contact your bank directly using their official phone number",
            "Forward the email to friends for their opinion"
          ],
          correctAnswer: 2,
          explanation: "Always verify suspicious communications through official channels. Legitimate institutions will never ask for sensitive information via email.",
          points: 15,
          tags: ["phishing", "social-engineering", "email-security"]
        }
      ];

      await db.insert(cyberAssessments).values(assessmentData);
      console.log("Cyber assessment data seeded successfully");
    } catch (error) {
      console.error("Error seeding cyber assessment data:", error);
    }
  }

  private async seedAchievementData() {
    try {
      // Check if achievement data already exists
      const existingAchievements = await db.select().from(cyberAchievements).limit(1);
      if (existingAchievements.length > 0) {
        return; // Data already seeded
      }

      // Seed cyber achievements
      const achievementData: InsertCyberAchievement[] = [
        {
          title: "First Assessment",
          category: "Getting Started",
          description: "Complete your first cybersecurity assessment",
          badgeIcon: "🎯",
          requirement: "Complete 1 assessment",
          points: 10
        },
        {
          title: "Perfect Score",
          category: "Excellence",
          description: "Score 100% on any assessment",
          badgeIcon: "⭐",
          requirement: "Achieve perfect score",
          points: 25
        }
      ];

      await db.insert(cyberAchievements).values(achievementData);
      console.log("Achievement data seeded successfully");
    } catch (error) {
      console.error("Error seeding achievement data:", error);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.passwordResetToken, token));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPassword(id: number, passwordHash: string): Promise<void> {
    // Increment tokenVersion to invalidate all existing sessions
    await db
      .update(users)
      .set({ 
        passwordHash, 
        mustChangePassword: false, 
        tokenVersion: sql`COALESCE(${users.tokenVersion}, 0) + 1`,
        updatedAt: new Date() 
      })
      .where(eq(users.id, id));
  }

  async setPasswordResetToken(id: number, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ passwordResetToken: token, passwordResetExpires: expires })
      .where(eq(users.id, id));
  }

  async clearPasswordResetToken(id: number): Promise<void> {
    await db
      .update(users)
      .set({ passwordResetToken: null, passwordResetExpires: null })
      .where(eq(users.id, id));
  }

  async setEmailVerificationToken(id: number, token: string, expires: Date): Promise<void> {
    await db
      .update(users)
      .set({ emailVerificationToken: token, emailVerificationExpires: expires })
      .where(eq(users.id, id));
  }

  async verifyEmail(id: number): Promise<void> {
    await db
      .update(users)
      .set({ emailVerified: true, emailVerificationToken: null, emailVerificationExpires: null })
      .where(eq(users.id, id));
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailVerificationToken, token))
      .limit(1);
    return user;
  }

  // Articles
  async getArticles(options: { category?: string; featured?: boolean; breaking?: boolean; limit?: number } = {}): Promise<Article[]> {
    let query = db.select().from(articles);
    
    const conditions = [];
    if (options.category) {
      conditions.push(eq(articles.category, options.category));
    }
    if (options.featured !== undefined) {
      conditions.push(eq(articles.featured, options.featured));
    }
    if (options.breaking !== undefined) {
      conditions.push(eq(articles.breaking, options.breaking));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(articles.publishedAt));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query;
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async updateArticle(id: number, updates: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchArticles(query: string): Promise<Article[]> {
    return await db
      .select()
      .from(articles)
      .where(
        like(articles.title, `%${query}%`)
      )
      .orderBy(desc(articles.publishedAt));
  }

  // Resources
  async getResources(options: { type?: string; category?: string; difficulty?: string; limit?: number } = {}): Promise<Resource[]> {
    let query = db.select().from(resources);
    
    const conditions = [];
    if (options.type) {
      conditions.push(eq(resources.type, options.type));
    }
    if (options.category) {
      conditions.push(eq(resources.category, options.category));
    }
    if (options.difficulty) {
      conditions.push(eq(resources.difficulty, options.difficulty));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query;
  }

  async getResource(id: number): Promise<Resource | undefined> {
    const [resource] = await db.select().from(resources).where(eq(resources.id, id));
    return resource || undefined;
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const [resource] = await db
      .insert(resources)
      .values(insertResource)
      .returning();
    return resource;
  }

  // Newsletter
  async subscribeNewsletter(email: string, options?: {
    weeklyDigest?: boolean;
    digitalSafetyTips?: boolean;
    tipsFrequency?: string;
    audience?: string;
    region?: string;
    alertPriority?: string;
  }): Promise<Newsletter> {
    const [newsletter] = await db
      .insert(newsletters)
      .values({ 
        email, 
        weeklyDigest: options?.weeklyDigest ?? true, 
        digitalSafetyTips: options?.digitalSafetyTips ?? false,
        tipsFrequency: options?.tipsFrequency ?? 'weekly',
        audience: options?.audience ?? 'all',
        region: options?.region ?? 'global',
        alertPriority: options?.alertPriority ?? 'all',
        active: true 
      })
      .returning();
    return newsletter;
  }

  async updateNewsletterPreferences(email: string, options: {
    weeklyDigest?: boolean;
    digitalSafetyTips?: boolean;
    tipsFrequency?: string;
    audience?: string;
    region?: string;
    alertPriority?: string;
  }): Promise<Newsletter | undefined> {
    const updateData: any = {};
    if (options.weeklyDigest !== undefined) updateData.weeklyDigest = options.weeklyDigest;
    if (options.digitalSafetyTips !== undefined) updateData.digitalSafetyTips = options.digitalSafetyTips;
    if (options.tipsFrequency !== undefined) updateData.tipsFrequency = options.tipsFrequency;
    if (options.audience !== undefined) updateData.audience = options.audience;
    if (options.region !== undefined) updateData.region = options.region;
    if (options.alertPriority !== undefined) updateData.alertPriority = options.alertPriority;
    
    const [updated] = await db
      .update(newsletters)
      .set(updateData)
      .where(eq(newsletters.email, email))
      .returning();
    return updated;
  }

  async getNewsletterSubscriptions(): Promise<Newsletter[]> {
    return await db.select().from(newsletters).orderBy(desc(newsletters.subscribedAt));
  }

  async deleteNewsletterSubscription(id: number): Promise<boolean> {
    const result = await db.delete(newsletters).where(eq(newsletters.id, id));
    return true;
  }

  async deleteDailyTipsSubscription(id: number): Promise<boolean> {
    await db.delete(dailyTipsSubscriptions).where(eq(dailyTipsSubscriptions.id, id));
    return true;
  }

  // Cyber Awareness Assessment System
  async getCyberAssessments(options: { category?: string; difficulty?: string; limit?: number } = {}): Promise<CyberAssessment[]> {
    let query = db.select().from(cyberAssessments);
    
    const conditions = [];
    if (options.category) {
      conditions.push(eq(cyberAssessments.category, options.category));
    }
    if (options.difficulty) {
      conditions.push(eq(cyberAssessments.difficulty, options.difficulty));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query;
  }

  async getCyberAssessment(id: number): Promise<CyberAssessment | undefined> {
    const [assessment] = await db.select().from(cyberAssessments).where(eq(cyberAssessments.id, id));
    return assessment || undefined;
  }

  async createAssessmentResult(insertResult: InsertUserAssessmentResult): Promise<UserAssessmentResult> {
    const [result] = await db
      .insert(userAssessmentResults)
      .values(insertResult)
      .returning();
    return result;
  }

  async getUserAssessmentResults(sessionId: string): Promise<UserAssessmentResult[]> {
    return await db
      .select()
      .from(userAssessmentResults)
      .where(eq(userAssessmentResults.sessionId, sessionId))
      .orderBy(desc(userAssessmentResults.completedAt));
  }

  async getUserScore(sessionId: string): Promise<{ 
    totalScore: number; 
    correctAnswers: number; 
    totalQuestions: number; 
    categoryBreakdown: Record<string, { correct: number; total: number; score: number }> 
  }> {
    const results = await this.getUserAssessmentResults(sessionId);
    
    const totalQuestions = results.length;
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalScore = results.reduce((sum, r) => {
      if (r.isCorrect && r.assessmentId) {
        return sum + 10; // Base points per correct answer
      }
      return sum;
    }, 0);

    const categoryBreakdown: Record<string, { correct: number; total: number; score: number }> = {};
    
    // Group results by category would require joining with assessments table
    // For now, return basic stats
    
    return {
      totalScore,
      correctAnswers,
      totalQuestions,
      categoryBreakdown
    };
  }
  
  // Achievements System
  async getCyberAchievements(): Promise<CyberAchievement[]> {
    return await db.select().from(cyberAchievements).orderBy(desc(cyberAchievements.points));
  }

  async getUserAchievements(sessionId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.sessionId, sessionId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async createUserAchievement(insertAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const [achievement] = await db
      .insert(userAchievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }

  async checkAndUnlockAchievements(sessionId: string): Promise<UserAchievement[]> {
    const newAchievements: UserAchievement[] = [];
    const userScore = await this.getUserScore(sessionId);
    const existingAchievements = await this.getUserAchievements(sessionId);
    const existingAchievementIds = existingAchievements.map(a => a.achievementId);

    // Check for "First Assessment" achievement
    if (userScore.totalQuestions >= 1 && !existingAchievementIds.includes(1)) {
      const newAchievement = await this.createUserAchievement({
        sessionId: sessionId,
        achievementId: 1,
        username: null
      });
      newAchievements.push(newAchievement);
    }

    // Check for "Perfect Score" achievement
    const accuracy = userScore.totalQuestions > 0 ? (userScore.correctAnswers / userScore.totalQuestions) * 100 : 0;
    if (accuracy === 100 && userScore.totalQuestions > 0 && !existingAchievementIds.includes(2)) {
      const newAchievement = await this.createUserAchievement({
        sessionId: sessionId,
        achievementId: 2,
        username: null
      });
      newAchievements.push(newAchievement);
    }

    return newAchievements;
  }

  // Featured People
  async getFeaturedPeople(options: { featured?: boolean; limit?: number } = {}): Promise<FeaturedPerson[]> {
    const currentMonth = new Date().getMonth() + 1;
    const rotationGroup = Math.ceil(currentMonth / 3);
    
    let query = db.select().from(featuredPeople);
    
    query = query.where(eq(featuredPeople.rotationGroup, rotationGroup));
    query = query.orderBy(
      desc(featuredPeople.priority), 
      desc(featuredPeople.impactScore), 
      desc(featuredPeople.createdAt)
    );
    
    const displayLimit = options.limit || 10;
    query = query.limit(displayLimit);
    
    return await query;
  }

  async getFeaturedPerson(id: number): Promise<FeaturedPerson | undefined> {
    const [person] = await db.select().from(featuredPeople).where(eq(featuredPeople.id, id));
    return person || undefined;
  }

  async createFeaturedPerson(insertPerson: InsertFeaturedPerson): Promise<FeaturedPerson> {
    const [person] = await db
      .insert(featuredPeople)
      .values(insertPerson)
      .returning();
    return person;
  }

  async updateFeaturedPerson(id: number, updates: Partial<InsertFeaturedPerson>): Promise<FeaturedPerson | undefined> {
    const [person] = await db
      .update(featuredPeople)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(featuredPeople.id, id))
      .returning();
    return person || undefined;
  }

  async deleteFeaturedPerson(id: number): Promise<boolean> {
    const result = await db.delete(featuredPeople).where(eq(featuredPeople.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Podcasts
  async getPodcasts(options: { featured?: boolean; category?: string; limit?: number } = {}): Promise<Podcast[]> {
    let query = db.select().from(podcasts);
    
    const conditions = [];
    if (options.featured !== undefined) {
      conditions.push(eq(podcasts.featured, options.featured));
    }
    if (options.category) {
      conditions.push(eq(podcasts.category, options.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(podcasts.publishedAt));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query;
  }

  async getPodcast(id: number): Promise<Podcast | undefined> {
    const [podcast] = await db.select().from(podcasts).where(eq(podcasts.id, id));
    return podcast || undefined;
  }

  async createPodcast(insertPodcast: InsertPodcast): Promise<Podcast> {
    const [podcast] = await db
      .insert(podcasts)
      .values(insertPodcast)
      .returning();
    return podcast;
  }

  async updatePodcast(id: number, updates: Partial<InsertPodcast>): Promise<Podcast | undefined> {
    const [podcast] = await db
      .update(podcasts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(podcasts.id, id))
      .returning();
    return podcast || undefined;
  }

  async deletePodcast(id: number): Promise<boolean> {
    const result = await db.delete(podcasts).where(eq(podcasts.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Blog Posts
  async getBlogPosts(options: { published?: boolean; featured?: boolean; category?: string; limit?: number } = {}): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    const conditions = [];
    if (options.published !== undefined) {
      conditions.push(eq(blogPosts.published, options.published));
    }
    if (options.featured !== undefined) {
      conditions.push(eq(blogPosts.featured, options.featured));
    }
    if (options.category) {
      conditions.push(eq(blogPosts.category, options.category));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    query = query.orderBy(desc(blogPosts.publishedAt));
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    return await query;
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post || undefined;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return (result.rowCount || 0) > 0;
  }

  async subscribeDailyTips(email: string, audience: string, options?: { frequency?: string; region?: string; alertPriority?: string }): Promise<DailyTipsSubscription> {
    const existing = await db.select().from(dailyTipsSubscriptions).where(eq(dailyTipsSubscriptions.email, email));
    
    if (existing.length > 0) {
      const [updated] = await db
        .update(dailyTipsSubscriptions)
        .set({ 
          audience, 
          isActive: true, 
          unsubscribedAt: null,
          ...(options?.frequency && { frequency: options.frequency }),
          ...(options?.region && { region: options.region }),
          ...(options?.alertPriority && { alertPriority: options.alertPriority })
        })
        .where(eq(dailyTipsSubscriptions.email, email))
        .returning();
      return updated;
    }

    const [subscription] = await db
      .insert(dailyTipsSubscriptions)
      .values({ 
        email, 
        audience,
        ...(options?.frequency && { frequency: options.frequency }),
        ...(options?.region && { region: options.region }),
        ...(options?.alertPriority && { alertPriority: options.alertPriority })
      })
      .returning();
    return subscription;
  }

  async unsubscribeDailyTips(email: string): Promise<boolean> {
    const result = await db
      .update(dailyTipsSubscriptions)
      .set({ isActive: false, unsubscribedAt: new Date() })
      .where(eq(dailyTipsSubscriptions.email, email));
    return (result.rowCount || 0) > 0;
  }

  async getDailyTipsSubscriptions(audience?: string): Promise<DailyTipsSubscription[]> {
    let query = db.select().from(dailyTipsSubscriptions).where(eq(dailyTipsSubscriptions.isActive, true));
    
    if (audience && audience !== 'all') {
      const subs = await db.select().from(dailyTipsSubscriptions)
        .where(and(
          eq(dailyTipsSubscriptions.isActive, true),
          eq(dailyTipsSubscriptions.audience, audience)
        ));
      return subs;
    }
    
    return await query;
  }

  async getAllDailyTipsSubscriptions(): Promise<DailyTipsSubscription[]> {
    return await db.select().from(dailyTipsSubscriptions).orderBy(desc(dailyTipsSubscriptions.subscribedAt));
  }

  // Tech Events and Conferences
  async getTechEvents(options: { category?: string; featured?: boolean; upcoming?: boolean; limit?: number } = {}): Promise<TechEvent[]> {
    let events = await db.select().from(techEvents).orderBy(techEvents.startDate);
    
    if (options.category) {
      events = events.filter(e => e.category === options.category);
    }
    
    if (options.featured !== undefined) {
      events = events.filter(e => e.featured === options.featured);
    }
    
    if (options.upcoming) {
      const now = new Date();
      events = events.filter(e => new Date(e.startDate) >= now);
    }
    
    if (options.limit) {
      events = events.slice(0, options.limit);
    }
    
    return events;
  }

  async getTechEvent(id: number): Promise<TechEvent | undefined> {
    const [event] = await db.select().from(techEvents).where(eq(techEvents.id, id));
    return event || undefined;
  }

  async createTechEvent(event: InsertTechEvent): Promise<TechEvent> {
    const [created] = await db.insert(techEvents).values(event).returning();
    return created;
  }

  private async seedTechEventsData() {
    try {
      const existingEvents = await db.select().from(techEvents).limit(1);
      if (existingEvents.length > 0) {
        return;
      }

      const eventsData: InsertTechEvent[] = [
        {
          name: "RSA Conference 2026",
          organizer: "RSA Security LLC",
          description: "The world's leading cybersecurity conference bringing together industry experts, practitioners, and vendors.",
          startDate: new Date("2026-05-04"),
          endDate: new Date("2026-05-07"),
          location: "Moscone Center",
          city: "San Francisco",
          country: "USA",
          category: "cybersecurity",
          url: "https://www.rsaconference.com",
          imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "Black Hat USA 2026",
          organizer: "Informa Tech",
          description: "Premier technical cybersecurity conference featuring cutting-edge research and training.",
          startDate: new Date("2026-08-01"),
          endDate: new Date("2026-08-06"),
          location: "Mandalay Bay Convention Center",
          city: "Las Vegas",
          country: "USA",
          category: "cybersecurity",
          url: "https://www.blackhat.com",
          imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "DEF CON 34",
          organizer: "DEF CON Communications",
          description: "The world's largest and longest-running underground hacking conference.",
          startDate: new Date("2026-08-06"),
          endDate: new Date("2026-08-09"),
          location: "Las Vegas Convention Center",
          city: "Las Vegas",
          country: "USA",
          category: "cybersecurity",
          url: "https://defcon.org",
          imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "Google I/O 2026",
          organizer: "Google",
          description: "Google's annual developer conference showcasing new products, APIs, and developer tools.",
          startDate: new Date("2026-05-12"),
          endDate: new Date("2026-05-14"),
          location: "Shoreline Amphitheatre",
          city: "Mountain View",
          country: "USA",
          category: "tech",
          url: "https://io.google",
          imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=400&h=200&fit=crop",
          isVirtual: true,
          isFree: true,
          featured: true
        },
        {
          name: "AWS re:Invent 2026",
          organizer: "Amazon Web Services",
          description: "The largest cloud computing conference with announcements, training, and networking.",
          startDate: new Date("2026-11-30"),
          endDate: new Date("2026-12-04"),
          location: "The Venetian",
          city: "Las Vegas",
          country: "USA",
          category: "cloud",
          url: "https://reinvent.awsevents.com",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "Microsoft Ignite 2026",
          organizer: "Microsoft",
          description: "Microsoft's premier conference for IT professionals and developers.",
          startDate: new Date("2026-11-16"),
          endDate: new Date("2026-11-20"),
          location: "McCormick Place",
          city: "Chicago",
          country: "USA",
          category: "tech",
          url: "https://ignite.microsoft.com",
          imageUrl: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=200&fit=crop",
          isVirtual: true,
          isFree: false,
          featured: false
        },
        {
          name: "Gartner Security & Risk Summit 2026",
          organizer: "Gartner",
          description: "Strategic insights for security and risk management leaders.",
          startDate: new Date("2026-06-08"),
          endDate: new Date("2026-06-10"),
          location: "Gaylord National Resort",
          city: "National Harbor",
          country: "USA",
          category: "cybersecurity",
          url: "https://www.gartner.com/en/conferences/na/security-risk-management-us",
          imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: false
        },
        {
          name: "CES 2026",
          organizer: "Consumer Technology Association",
          description: "The most influential tech event in the world showcasing innovation.",
          startDate: new Date("2026-01-06"),
          endDate: new Date("2026-01-09"),
          location: "Las Vegas Convention Center",
          city: "Las Vegas",
          country: "USA",
          category: "tech",
          url: "https://www.ces.tech",
          imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "Cisco Live US 2026",
          organizer: "Cisco Systems",
          description: "Premier destination for Cisco customers and partners for training and networking.",
          startDate: new Date("2026-06-14"),
          endDate: new Date("2026-06-18"),
          location: "Mandalay Bay",
          city: "Las Vegas",
          country: "USA",
          category: "tech",
          url: "https://www.ciscolive.com",
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: false
        },
        {
          name: "InfoSec World 2026",
          organizer: "ISACA",
          description: "Business-focused security conference for executives and practitioners.",
          startDate: new Date("2026-04-06"),
          endDate: new Date("2026-04-08"),
          location: "Walt Disney World Swan Resort",
          city: "Orlando",
          country: "USA",
          category: "cybersecurity",
          url: "https://www.infosecworldusa.com",
          imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: false
        },
        {
          name: "Africa Cyber Security Conference 2026",
          organizer: "ACSC",
          description: "Leading cybersecurity conference for African IT professionals and leaders.",
          startDate: new Date("2026-09-14"),
          endDate: new Date("2026-09-16"),
          location: "Kigali Convention Centre",
          city: "Kigali",
          country: "Rwanda",
          category: "cybersecurity",
          url: "https://africacybersecurityconference.com",
          imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "AI Summit London 2026",
          organizer: "The AI Summit",
          description: "The world's first and largest conference for business AI applications.",
          startDate: new Date("2026-06-10"),
          endDate: new Date("2026-06-11"),
          location: "ExCeL London",
          city: "London",
          country: "UK",
          category: "ai",
          url: "https://theaisummit.com/london/",
          imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: false
        },
        {
          name: "NeurIPS 2026",
          organizer: "Neural Information Processing Systems Foundation",
          description: "Premier machine learning and computational neuroscience conference.",
          startDate: new Date("2026-12-06"),
          endDate: new Date("2026-12-12"),
          location: "Vancouver Convention Centre",
          city: "Vancouver",
          country: "Canada",
          category: "ai",
          url: "https://neurips.cc",
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop",
          isVirtual: true,
          isFree: false,
          featured: true
        },
        {
          name: "Strata Data Conference 2026",
          organizer: "O'Reilly Media",
          description: "Making data work for business through big data and AI technologies.",
          startDate: new Date("2026-03-24"),
          endDate: new Date("2026-03-26"),
          location: "San Jose Convention Center",
          city: "San Jose",
          country: "USA",
          category: "data",
          url: "https://www.oreilly.com/conferences/strata-data-conference.html",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: false
        },
        {
          name: "Mobile World Congress 2026",
          organizer: "GSMA",
          description: "The world's largest mobile technology exhibition and conference.",
          startDate: new Date("2026-02-23"),
          endDate: new Date("2026-02-26"),
          location: "Fira Gran Via",
          city: "Barcelona",
          country: "Spain",
          category: "tech",
          url: "https://www.mwcbarcelona.com",
          imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "Web Summit 2026",
          organizer: "Web Summit",
          description: "The largest technology conference in the world with 70,000+ attendees.",
          startDate: new Date("2026-11-02"),
          endDate: new Date("2026-11-05"),
          location: "Altice Arena",
          city: "Lisbon",
          country: "Portugal",
          category: "tech",
          url: "https://websummit.com",
          imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: true
        },
        {
          name: "HIMSS Global Health Conference 2026",
          organizer: "HIMSS",
          description: "Healthcare information and technology conference for digital health transformation.",
          startDate: new Date("2026-03-09"),
          endDate: new Date("2026-03-13"),
          location: "Orange County Convention Center",
          city: "Orlando",
          country: "USA",
          category: "tech",
          url: "https://www.himss.org/global-health-conference-exhibition",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=200&fit=crop",
          isVirtual: false,
          isFree: false,
          featured: false
        },
        {
          name: "KubeCon + CloudNativeCon North America 2026",
          organizer: "Cloud Native Computing Foundation",
          description: "The flagship conference gathering cloud native and Kubernetes community.",
          startDate: new Date("2026-10-12"),
          endDate: new Date("2026-10-15"),
          location: "Salt Palace Convention Center",
          city: "Salt Lake City",
          country: "USA",
          category: "cloud",
          url: "https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/",
          imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
          isVirtual: true,
          isFree: false,
          featured: false
        }
      ];

      await db.insert(techEvents).values(eventsData);
      console.log("Tech events data seeded successfully with", eventsData.length, "events");
    } catch (error) {
      console.error("Error seeding tech events data:", error);
    }
  }

  private async seedThreatStatsData() {
    try {
      const existingStats = await db.select().from(threatStats).limit(1);
      if (existingStats.length > 0) {
        return;
      }

      const statsData: InsertThreatStat[] = [
        {
          statKey: "global_losses",
          value: "$12.5B",
          label: "Global Losses (2023)",
          description: "Total reported cybercrime losses worldwide",
          source: "FBI IC3 Report",
          sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3Report.pdf",
          category: "financial",
          colorTheme: "teal",
          displayOrder: 1,
          reportYear: 2023
        },
        {
          statKey: "most_targeted_age",
          value: "60+",
          label: "Age Group Most Targeted",
          description: "Seniors face the highest financial losses from cybercrime",
          source: "FBI IC3 Report",
          sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3Report.pdf",
          category: "demographics",
          colorTheme: "amber",
          displayOrder: 2,
          reportYear: 2023
        },
        {
          statKey: "youth_harassment",
          value: "40%",
          label: "Youth Online Harassment",
          description: "Percentage of youth ages 10-17 experiencing cyberbullying",
          source: "Cyberbullying Research Center",
          sourceUrl: "https://cyberbullying.org/facts",
          category: "youth",
          colorTheme: "cyan",
          displayOrder: 3,
          reportYear: 2023
        },
        {
          statKey: "mobile_fraud_rise",
          value: "300%",
          label: "Mobile Money Fraud Rise",
          description: "Increase in mobile money fraud in Africa from 2020-2024",
          source: "INTERPOL Africa",
          sourceUrl: "https://www.interpol.int/en/Crimes/Cybercrime",
          category: "africa",
          colorTheme: "red",
          displayOrder: 4,
          reportYear: 2024
        }
      ];

      const ageGroupData: InsertAgeGroupStat[] = [
        { ageGroup: "Under 20", percentage: 8, colorClass: "bg-cyan-400", displayOrder: 1, source: "FBI Internet Crime Report 2023" },
        { ageGroup: "20-29", percentage: 15, colorClass: "bg-teal-400", displayOrder: 2, source: "FBI Internet Crime Report 2023" },
        { ageGroup: "30-49", percentage: 35, colorClass: "bg-green-400", displayOrder: 3, source: "FBI Internet Crime Report 2023" },
        { ageGroup: "50-59", percentage: 20, colorClass: "bg-orange-400", displayOrder: 4, source: "FBI Internet Crime Report 2023" },
        { ageGroup: "60+", percentage: 22, colorClass: "bg-amber-400", displayOrder: 5, source: "FBI Internet Crime Report 2023" }
      ];

      const regionalData: InsertRegionalAttackType[] = [
        { region: "Africa", attackTypes: "Mobile Money Fraud, SIM Swap, WhatsApp Scams", colorClass: "bg-amber-400", displayOrder: 1, source: "INTERPOL Africa Assessment 2024" },
        { region: "North America", attackTypes: "Investment Fraud, BEC, Tech Support Scams", colorClass: "bg-teal-400", displayOrder: 2, source: "FBI IC3 Report 2023" },
        { region: "Europe", attackTypes: "Ransomware, Phishing, Data Breaches", colorClass: "bg-cyan-400", displayOrder: 3, source: "Europol IOCTA 2024" },
        { region: "Asia Pacific", attackTypes: "Romance Scams, E-commerce Fraud, Crypto Scams", colorClass: "bg-purple-400", displayOrder: 4, source: "APAC Cybersecurity Report 2024" }
      ];

      await db.insert(threatStats).values(statsData);
      await db.insert(ageGroupStats).values(ageGroupData);
      await db.insert(regionalAttackTypes).values(regionalData);
      console.log("Threat statistics data seeded successfully");
    } catch (error) {
      console.error("Error seeding threat stats data:", error);
    }
  }

  async getThreatStats(): Promise<ThreatStat[]> {
    return await db.select().from(threatStats).orderBy(threatStats.displayOrder);
  }

  async getThreatStat(statKey: string): Promise<ThreatStat | undefined> {
    const [stat] = await db.select().from(threatStats).where(eq(threatStats.statKey, statKey));
    return stat || undefined;
  }

  async updateThreatStat(statKey: string, updates: Partial<InsertThreatStat>): Promise<ThreatStat | undefined> {
    const [stat] = await db
      .update(threatStats)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(threatStats.statKey, statKey))
      .returning();
    return stat || undefined;
  }

  async getAgeGroupStats(): Promise<AgeGroupStat[]> {
    return await db.select().from(ageGroupStats).orderBy(ageGroupStats.displayOrder);
  }

  async updateAgeGroupStat(id: number, updates: Partial<InsertAgeGroupStat>): Promise<AgeGroupStat | undefined> {
    const [stat] = await db
      .update(ageGroupStats)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(ageGroupStats.id, id))
      .returning();
    return stat || undefined;
  }

  async getRegionalAttackTypes(): Promise<RegionalAttackType[]> {
    return await db.select().from(regionalAttackTypes).orderBy(regionalAttackTypes.displayOrder);
  }

  async updateRegionalAttackType(id: number, updates: Partial<InsertRegionalAttackType>): Promise<RegionalAttackType | undefined> {
    const [stat] = await db
      .update(regionalAttackTypes)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(regionalAttackTypes.id, id))
      .returning();
    return stat || undefined;
  }

  async getAllThreatData(): Promise<{
    stats: ThreatStat[];
    ageGroups: AgeGroupStat[];
    regions: RegionalAttackType[];
  }> {
    const [stats, ageGroups, regions] = await Promise.all([
      this.getThreatStats(),
      this.getAgeGroupStats(),
      this.getRegionalAttackTypes()
    ]);
    return { stats, ageGroups, regions };
  }

  // Safety Tip Templates
  async getSafetyTipTemplates(options: { 
    audience?: string; 
    dayType?: string; 
    activeOnly?: boolean 
  } = {}): Promise<SafetyTipTemplate[]> {
    let tips = await db.select().from(safetyTipTemplates).orderBy(safetyTipTemplates.timesUsed);
    
    if (options.activeOnly !== false) {
      tips = tips.filter(t => t.isActive);
    }
    
    if (options.audience && options.audience !== 'all') {
      tips = tips.filter(t => t.audience === options.audience || t.audience === 'all');
    }
    
    if (options.dayType) {
      tips = tips.filter(t => t.dayType === options.dayType);
    }
    
    return tips;
  }

  async getSafetyTipTemplate(id: number): Promise<SafetyTipTemplate | undefined> {
    const [tip] = await db.select().from(safetyTipTemplates).where(eq(safetyTipTemplates.id, id));
    return tip || undefined;
  }

  async getNextTipForAudience(audience: string, dayType: string): Promise<SafetyTipTemplate | undefined> {
    const tips = await this.getSafetyTipTemplates({ audience, dayType, activeOnly: true });
    if (tips.length === 0) return undefined;
    return tips[0];
  }

  async markTipAsUsed(tipId: number): Promise<void> {
    await db.update(safetyTipTemplates)
      .set({ 
        timesUsed: gt(safetyTipTemplates.timesUsed, 0) ? safetyTipTemplates.timesUsed : 1,
        lastUsedAt: new Date() 
      })
      .where(eq(safetyTipTemplates.id, tipId));
    
    await db.execute(sql`UPDATE safety_tip_templates SET times_used = times_used + 1 WHERE id = ${tipId}`);
  }

  async createSafetyTipTemplate(tip: InsertSafetyTipTemplate): Promise<SafetyTipTemplate> {
    const [created] = await db.insert(safetyTipTemplates).values(tip).returning();
    return created;
  }

  async updateSafetyTipTemplate(id: number, updates: Partial<InsertSafetyTipTemplate>): Promise<SafetyTipTemplate | undefined> {
    const [updated] = await db.update(safetyTipTemplates)
      .set(updates)
      .where(eq(safetyTipTemplates.id, id))
      .returning();
    return updated || undefined;
  }

  async logEmailSend(subscriptionId: number, tipId: number, status: string, errorMessage?: string): Promise<void> {
    await db.insert(emailSendLog).values({
      subscriptionId,
      tipId,
      status,
      errorMessage
    });
  }

  async getActiveSubscribersForAudience(audience: string): Promise<DailyTipsSubscription[]> {
    if (audience === 'all') {
      return await db.select().from(dailyTipsSubscriptions)
        .where(eq(dailyTipsSubscriptions.isActive, true));
    }
    
    return await db.select().from(dailyTipsSubscriptions)
      .where(and(
        eq(dailyTipsSubscriptions.isActive, true),
        eq(dailyTipsSubscriptions.audience, audience)
      ));
  }

  // Partnership/Advertising Inquiries
  async createPartnershipInquiry(inquiry: InsertPartnershipInquiry): Promise<PartnershipInquiry> {
    const [created] = await db.insert(partnershipInquiries).values(inquiry).returning();
    return created;
  }

  async getPartnershipInquiries(options?: { status?: string; limit?: number }): Promise<PartnershipInquiry[]> {
    let results = await db.select().from(partnershipInquiries).orderBy(desc(partnershipInquiries.createdAt));
    
    if (options?.status) {
      results = results.filter(i => i.status === options.status);
    }
    
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }
    
    return results;
  }

  async getPartnershipInquiry(id: number): Promise<PartnershipInquiry | undefined> {
    const [inquiry] = await db.select().from(partnershipInquiries).where(eq(partnershipInquiries.id, id));
    return inquiry || undefined;
  }

  async updatePartnershipInquiryStatus(id: number, status: string, notes?: string): Promise<PartnershipInquiry | undefined> {
    const updates: Partial<PartnershipInquiry> = { 
      status, 
      updatedAt: new Date() 
    };
    if (notes !== undefined) {
      updates.notes = notes;
    }
    
    const [updated] = await db.update(partnershipInquiries)
      .set(updates)
      .where(eq(partnershipInquiries.id, id))
      .returning();
    return updated || undefined;
  }

  // User Feedback
  async createFeedback(feedback: InsertUserFeedback): Promise<UserFeedback> {
    const [created] = await db.insert(userFeedback).values(feedback).returning();
    return created;
  }

  async getAllFeedback(): Promise<UserFeedback[]> {
    return await db.select().from(userFeedback).orderBy(desc(userFeedback.createdAt));
  }

  // Tool Usage Tracking
  async trackToolUsage(usage: InsertToolUsage): Promise<ToolUsage> {
    const [created] = await db.insert(toolUsage).values(usage).returning();
    return created;
  }

  async getToolUsageStats(): Promise<{ toolName: string; action: string; count: number }[]> {
    const results = await db.select({
      toolName: toolUsage.toolName,
      action: toolUsage.action,
      count: count()
    })
    .from(toolUsage)
    .groupBy(toolUsage.toolName, toolUsage.action)
    .orderBy(desc(count()));
    
    return results.map(r => ({
      toolName: r.toolName,
      action: r.action || 'unknown',
      count: Number(r.count)
    }));
  }

  async getToolUsageByTool(toolName: string): Promise<ToolUsage[]> {
    return await db.select().from(toolUsage)
      .where(eq(toolUsage.toolName, toolName))
      .orderBy(desc(toolUsage.createdAt));
  }

  // Contact Submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [created] = await db.insert(contactSubmissions).values(submission).returning();
    return created;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async markContactAsRead(id: number): Promise<ContactSubmission | undefined> {
    const [updated] = await db.update(contactSubmissions)
      .set({ isRead: true })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return updated || undefined;
  }

  async markContactAsReplied(id: number): Promise<ContactSubmission | undefined> {
    const [updated] = await db.update(contactSubmissions)
      .set({ isReplied: true })
      .where(eq(contactSubmissions.id, id))
      .returning();
    return updated || undefined;
  }

  // Subscriber Preferences
  async updateDailyTipsPreferences(email: string, options: { frequency?: string; region?: string; alertPriority?: string }): Promise<DailyTipsSubscription | undefined> {
    const updates: Record<string, string> = {};
    if (options.frequency) updates.frequency = options.frequency;
    if (options.region) updates.region = options.region;
    if (options.alertPriority) updates.alertPriority = options.alertPriority;
    
    if (Object.keys(updates).length === 0) return undefined;
    
    const [updated] = await db.update(dailyTipsSubscriptions)
      .set(updates)
      .where(eq(dailyTipsSubscriptions.email, email))
      .returning();
    return updated || undefined;
  }

  async getSubscriberByToken(token: string): Promise<DailyTipsSubscription | undefined> {
    const [subscriber] = await db.select().from(dailyTipsSubscriptions)
      .where(eq(dailyTipsSubscriptions.preferenceToken, token));
    return subscriber || undefined;
  }

  async generatePreferenceToken(email: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    await db.update(dailyTipsSubscriptions)
      .set({ preferenceToken: token })
      .where(eq(dailyTipsSubscriptions.email, email));
    return token;
  }

  async getNewsletterByToken(token: string): Promise<Newsletter | undefined> {
    const [newsletter] = await db.select().from(newsletters)
      .where(eq(newsletters.preferenceToken, token));
    return newsletter || undefined;
  }

  // Weekly Digest Management
  async createWeeklyDigest(digest: InsertWeeklyDigest): Promise<WeeklyDigest> {
    const [created] = await db.insert(weeklyDigests).values(digest).returning();
    return created;
  }

  async getWeeklyDigests(status?: string): Promise<WeeklyDigest[]> {
    if (status) {
      return await db.select().from(weeklyDigests)
        .where(eq(weeklyDigests.status, status))
        .orderBy(desc(weeklyDigests.createdAt));
    }
    return await db.select().from(weeklyDigests).orderBy(desc(weeklyDigests.createdAt));
  }

  async getWeeklyDigest(id: number): Promise<WeeklyDigest | undefined> {
    const [digest] = await db.select().from(weeklyDigests).where(eq(weeklyDigests.id, id));
    return digest || undefined;
  }

  async updateWeeklyDigest(id: number, updates: Partial<InsertWeeklyDigest>): Promise<WeeklyDigest | undefined> {
    const [updated] = await db.update(weeklyDigests)
      .set(updates)
      .where(eq(weeklyDigests.id, id))
      .returning();
    return updated || undefined;
  }

  async approveWeeklyDigest(id: number, approvedBy: string): Promise<WeeklyDigest | undefined> {
    const [updated] = await db.update(weeklyDigests)
      .set({ 
        status: 'approved', 
        approvedBy, 
        approvedAt: new Date() 
      })
      .where(eq(weeklyDigests.id, id))
      .returning();
    return updated || undefined;
  }

  async markWeeklyDigestSent(id: number, recipientCount: number): Promise<WeeklyDigest | undefined> {
    const [updated] = await db.update(weeklyDigests)
      .set({ 
        status: 'sent', 
        sentAt: new Date(),
        recipientCount 
      })
      .where(eq(weeklyDigests.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteWeeklyDigest(id: number): Promise<boolean> {
    const result = await db.delete(weeklyDigests).where(eq(weeklyDigests.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getWeeklyDigestSubscribers(): Promise<Newsletter[]> {
    return await db.select().from(newsletters)
      .where(and(
        eq(newsletters.active, true),
        eq(newsletters.weeklyDigest, true)
      ));
  }

  // Daily Tips Management
  async createDailyTip(tip: InsertDailyTip): Promise<DailyTip> {
    const [newTip] = await db.insert(dailyTips).values(tip).returning();
    return newTip;
  }

  async getDailyTips(status?: string): Promise<DailyTip[]> {
    if (status) {
      return await db.select().from(dailyTips)
        .where(eq(dailyTips.status, status))
        .orderBy(desc(dailyTips.createdAt));
    }
    return await db.select().from(dailyTips).orderBy(desc(dailyTips.createdAt));
  }

  async getDailyTip(id: number): Promise<DailyTip | undefined> {
    const [tip] = await db.select().from(dailyTips).where(eq(dailyTips.id, id));
    return tip;
  }

  async approveDailyTip(id: number, approvedBy: string): Promise<DailyTip | undefined> {
    const [tip] = await db.update(dailyTips)
      .set({ status: 'approved', approvedBy, approvedAt: new Date() })
      .where(eq(dailyTips.id, id))
      .returning();
    return tip;
  }

  async markDailyTipSent(id: number, recipientCount: number): Promise<DailyTip | undefined> {
    const [tip] = await db.update(dailyTips)
      .set({ status: 'sent', sentAt: new Date(), recipientCount })
      .where(eq(dailyTips.id, id))
      .returning();
    return tip;
  }

  async deleteDailyTip(id: number): Promise<boolean> {
    await db.delete(dailyTips).where(eq(dailyTips.id, id));
    return true;
  }

  async getDigitalSafetyTipsSubscribers(audience: string): Promise<Newsletter[]> {
    if (audience === 'all') {
      return await db.select().from(newsletters)
        .where(and(
          eq(newsletters.active, true),
          eq(newsletters.digitalSafetyTips, true)
        ));
    }
    return await db.select().from(newsletters)
      .where(and(
        eq(newsletters.active, true),
        eq(newsletters.digitalSafetyTips, true),
        eq(newsletters.audience, audience)
      ));
  }

  private getISOWeek(date: Date): { weekNumber: number; year: number } {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return { weekNumber, year: d.getUTCFullYear() };
  }

  async recordScamTrend(scamType: string, keywords?: string[], region?: string): Promise<void> {
    const now = new Date();
    const { weekNumber, year } = this.getISOWeek(now);
    
    const existing = await db.select().from(scamTrends)
      .where(and(
        eq(scamTrends.scamType, scamType),
        eq(scamTrends.weekNumber, weekNumber),
        eq(scamTrends.year, year)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      await db.update(scamTrends)
        .set({ 
          count: sql`${scamTrends.count} + 1`,
          lastSeenAt: now
        })
        .where(eq(scamTrends.id, existing[0].id));
    } else {
      await db.insert(scamTrends).values({
        scamType,
        keywords: keywords || [],
        region,
        count: 1,
        weekNumber,
        year
      });
    }
  }

  async getScamTrends(options?: { weeks?: number; scamType?: string }): Promise<ScamTrend[]> {
    const weeks = options?.weeks || 4;
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
    
    let query = db.select().from(scamTrends)
      .where(gte(scamTrends.firstSeenAt, cutoffDate))
      .orderBy(desc(scamTrends.count));
    
    return await query;
  }

  async getTopScamTrends(limit: number = 5, region?: string): Promise<{ scamType: string; count: number; trend: string }[]> {
    const now = new Date();
    const { weekNumber: currentWeek, year: currentYear } = this.getISOWeek(now);
    
    const lastWeekDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const { weekNumber: lastWeek, year: lastWeekYear } = this.getISOWeek(lastWeekDate);

    const currentConditions = [
      eq(scamTrends.weekNumber, currentWeek),
      eq(scamTrends.year, currentYear)
    ];
    if (region) {
      currentConditions.push(eq(scamTrends.region, region));
    }

    const currentTrends = await db.select({
      scamType: scamTrends.scamType,
      count: sql<number>`SUM(${scamTrends.count})::int`
    })
      .from(scamTrends)
      .where(and(...currentConditions))
      .groupBy(scamTrends.scamType)
      .orderBy(desc(sql`SUM(${scamTrends.count})`))
      .limit(limit);

    const lastConditions = [
      eq(scamTrends.weekNumber, lastWeek),
      eq(scamTrends.year, lastWeekYear)
    ];
    if (region) {
      lastConditions.push(eq(scamTrends.region, region));
    }

    const lastTrends = await db.select({
      scamType: scamTrends.scamType,
      count: sql<number>`SUM(${scamTrends.count})::int`
    })
      .from(scamTrends)
      .where(and(...lastConditions))
      .groupBy(scamTrends.scamType);

    const lastTrendsMap = new Map(lastTrends.map(t => [t.scamType, t.count]));

    return currentTrends.map(trend => {
      const lastCount = lastTrendsMap.get(trend.scamType) || 0;
      let trendDirection = 'stable';
      if (trend.count > lastCount * 1.2) trendDirection = 'rising';
      else if (trend.count < lastCount * 0.8) trendDirection = 'falling';
      
      return {
        scamType: trend.scamType,
        count: trend.count,
        trend: trendDirection
      };
    });
  }

  // Two-Factor Authentication
  async setTwoFactorSecret(userId: number, secret: string): Promise<void> {
    await db.update(users)
      .set({ twoFactorSecret: secret })
      .where(eq(users.id, userId));
  }

  async enableTwoFactor(userId: number): Promise<void> {
    await db.update(users)
      .set({ twoFactorEnabled: true })
      .where(eq(users.id, userId));
  }

  async disableTwoFactor(userId: number): Promise<void> {
    await db.update(users)
      .set({ twoFactorEnabled: false, twoFactorSecret: null })
      .where(eq(users.id, userId));
  }

  // Audit Logging
  async createAuditLog(log: InsertAuditLog): Promise<AuditLog> {
    const [result] = await db.insert(auditLogs).values(log).returning();
    return result;
  }

  async getAuditLogs(options?: { userId?: number; action?: string; limit?: number }): Promise<AuditLog[]> {
    const conditions = [];
    if (options?.userId) conditions.push(eq(auditLogs.userId, options.userId));
    if (options?.action) conditions.push(eq(auditLogs.action, options.action));
    
    const query = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
    
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
    
    if (options?.limit) {
      query.limit(options.limit);
    } else {
      query.limit(100);
    }
    
    return await query;
  }

  // Security Alerts
  async getSecurityAlerts(options?: { severity?: string; category?: string; unreadOnly?: boolean; limit?: number }): Promise<SecurityAlert[]> {
    const conditions = [];
    if (options?.severity) conditions.push(eq(securityAlerts.severity, options.severity));
    if (options?.category) conditions.push(eq(securityAlerts.category, options.category));
    if (options?.unreadOnly) conditions.push(eq(securityAlerts.isRead, false));
    
    const query = db.select().from(securityAlerts).orderBy(desc(securityAlerts.createdAt));
    
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }
    
    if (options?.limit) {
      query.limit(options.limit);
    } else {
      query.limit(50);
    }
    
    return await query;
  }

  async getSecurityAlert(id: number): Promise<SecurityAlert | undefined> {
    const [result] = await db.select().from(securityAlerts).where(eq(securityAlerts.id, id));
    return result;
  }

  async createSecurityAlert(alert: InsertSecurityAlert): Promise<SecurityAlert> {
    const [result] = await db.insert(securityAlerts).values(alert).returning();
    return result;
  }

  async markAlertAsRead(id: number): Promise<void> {
    await db.update(securityAlerts)
      .set({ isRead: true })
      .where(eq(securityAlerts.id, id));
  }

  async acknowledgeAlert(id: number, userId: number): Promise<void> {
    await db.update(securityAlerts)
      .set({ 
        isAcknowledged: true,
        acknowledgedBy: userId,
        acknowledgedAt: new Date()
      })
      .where(eq(securityAlerts.id, id));
  }

  async getUnreadAlertCount(): Promise<number> {
    const [result] = await db.select({ count: count() })
      .from(securityAlerts)
      .where(eq(securityAlerts.isRead, false));
    return result?.count || 0;
  }

  // Scam Checker Usage Tracking
  async logScamCheckerUsage(analysisType: string, resultRisk?: string, region?: string): Promise<void> {
    try {
      console.log('[ScamCheckerUsage] Starting log for:', analysisType, resultRisk, region);
      const insertData = {
        analysisType,
        resultRisk: resultRisk || null,
        region: region || 'unknown'
      };
      console.log('[ScamCheckerUsage] Insert data:', JSON.stringify(insertData));
      await db.insert(scamCheckerUsage).values(insertData);
      console.log('[ScamCheckerUsage] Successfully logged usage');
    } catch (error: any) {
      console.error('[ScamCheckerUsage] FAILED to log usage:', error?.message || error);
      console.error('[ScamCheckerUsage] Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      // Don't throw - we don't want to break the user's scam check if logging fails
    }
  }

  async getScamCheckerStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    byRisk: Record<string, number>;
    byRegion: Record<string, number>;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get all usage records
    const allRecords = await db.select().from(scamCheckerUsage);

    // Calculate totals
    const total = allRecords.length;
    
    // Group by type
    const byType: Record<string, number> = {};
    allRecords.forEach(r => {
      byType[r.analysisType] = (byType[r.analysisType] || 0) + 1;
    });

    // Group by risk
    const byRisk: Record<string, number> = {};
    allRecords.forEach(r => {
      if (r.resultRisk) {
        byRisk[r.resultRisk] = (byRisk[r.resultRisk] || 0) + 1;
      }
    });

    // Group by region
    const byRegion: Record<string, number> = {};
    allRecords.forEach(r => {
      const region = (r as any).region || 'unknown';
      byRegion[region] = (byRegion[region] || 0) + 1;
    });

    // Count by time period
    const today = allRecords.filter(r => r.createdAt && r.createdAt >= startOfToday).length;
    const thisWeek = allRecords.filter(r => r.createdAt && r.createdAt >= startOfWeek).length;
    const thisMonth = allRecords.filter(r => r.createdAt && r.createdAt >= startOfMonth).length;

    return { total, byType, byRisk, byRegion, today, thisWeek, thisMonth };
  }

  // Breach Checker Usage Tracking
  async logBreachCheckerUsage(checkType: string, breachesFound: number, passwordExposed: boolean, monitoringSignup: boolean): Promise<void> {
    try {
      console.log('[BreachCheckerUsage] Logging:', checkType, breachesFound, passwordExposed, monitoringSignup);
      await db.insert(breachCheckerUsage).values({
        checkType,
        breachesFound,
        passwordExposed,
        monitoringSignup
      });
      console.log('[BreachCheckerUsage] Logged successfully');
    } catch (error) {
      console.error('[BreachCheckerUsage] Error logging usage:', error);
      throw error;
    }
  }

  async getBreachCheckerStats(): Promise<{
    total: number;
    byType: Record<string, number>;
    totalBreachesFound: number;
    passwordExposures: number;
    monitoringSignups: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const allRecords = await db.select().from(breachCheckerUsage);
    const total = allRecords.length;
    
    const byType: Record<string, number> = {};
    allRecords.forEach(r => {
      byType[r.checkType] = (byType[r.checkType] || 0) + 1;
    });

    const totalBreachesFound = allRecords.reduce((sum, r) => sum + (r.breachesFound || 0), 0);
    const passwordExposures = allRecords.filter(r => r.passwordExposed).length;
    const monitoringSignups = allRecords.filter(r => r.monitoringSignup).length;

    const today = allRecords.filter(r => r.createdAt && r.createdAt >= startOfToday).length;
    const thisWeek = allRecords.filter(r => r.createdAt && r.createdAt >= startOfWeek).length;
    const thisMonth = allRecords.filter(r => r.createdAt && r.createdAt >= startOfMonth).length;

    return { total, byType, totalBreachesFound, passwordExposures, monitoringSignups, today, thisWeek, thisMonth };
  }

  // Breach Monitoring
  async createBreachMonitoringSubscription(subscription: {
    email: string;
    monitoredEmails: string[];
    newsletterId?: number;
    unsubscribeToken?: string;
  }): Promise<{ id: number; email: string; monitoredEmails: string[] }> {
    const [result] = await db.insert(breachMonitoringSubscriptions).values({
      email: subscription.email,
      monitoredEmails: subscription.monitoredEmails,
      newsletterId: subscription.newsletterId || null,
      unsubscribeToken: subscription.unsubscribeToken || crypto.randomBytes(32).toString('hex'),
      isActive: true,
      totalBreachesFound: 0
    }).returning();
    return { id: result.id, email: result.email, monitoredEmails: result.monitoredEmails };
  }

  async getBreachMonitoringSubscription(email: string): Promise<{ id: number; email: string; monitoredEmails: string[]; isActive: boolean; totalBreachesFound: number } | undefined> {
    const [result] = await db.select().from(breachMonitoringSubscriptions).where(eq(breachMonitoringSubscriptions.email, email));
    if (!result) return undefined;
    return {
      id: result.id,
      email: result.email,
      monitoredEmails: result.monitoredEmails,
      isActive: result.isActive || false,
      totalBreachesFound: result.totalBreachesFound || 0
    };
  }

  async updateBreachMonitoringSubscription(id: number, updates: { monitoredEmails?: string[]; isActive?: boolean; lastCheckedAt?: Date; totalBreachesFound?: number }): Promise<void> {
    await db.update(breachMonitoringSubscriptions)
      .set(updates)
      .where(eq(breachMonitoringSubscriptions.id, id));
  }

  async saveBreachCheckResult(result: {
    email: string;
    subscriptionId?: number;
    breachName: string;
    breachDomain?: string;
    breachDate?: Date;
    exposedDataTypes?: string[];
    description?: string;
    severity?: string;
    isPasswordExposed?: boolean;
  }): Promise<{ id: number }> {
    const [inserted] = await db.insert(breachCheckResults).values({
      email: result.email,
      subscriptionId: result.subscriptionId || null,
      breachName: result.breachName,
      breachDomain: result.breachDomain || null,
      breachDate: result.breachDate || null,
      exposedDataTypes: result.exposedDataTypes || null,
      description: result.description || null,
      severity: result.severity || null,
      isPasswordExposed: result.isPasswordExposed || false,
      isNotified: false
    }).returning({ id: breachCheckResults.id });
    return { id: inserted.id };
  }

  async getBreachCheckResults(email: string): Promise<Array<{
    id: number;
    breachName: string;
    breachDomain: string | null;
    breachDate: Date | null;
    exposedDataTypes: string[] | null;
    severity: string | null;
    isPasswordExposed: boolean;
    discoveredAt: Date;
  }>> {
    const results = await db.select().from(breachCheckResults)
      .where(eq(breachCheckResults.email, email))
      .orderBy(desc(breachCheckResults.discoveredAt));
    return results.map(r => ({
      id: r.id,
      breachName: r.breachName,
      breachDomain: r.breachDomain,
      breachDate: r.breachDate,
      exposedDataTypes: r.exposedDataTypes,
      severity: r.severity,
      isPasswordExposed: r.isPasswordExposed || false,
      discoveredAt: r.discoveredAt || new Date()
    }));
  }

  // WebAuthn (Passkeys) Methods
  async createWebauthnCredential(credential: InsertWebauthnCredential): Promise<WebauthnCredential> {
    const [inserted] = await db.insert(webauthnCredentials).values(credential).returning();
    return inserted;
  }

  async getWebauthnCredentialsByUserId(userId: number): Promise<WebauthnCredential[]> {
    return await db.select().from(webauthnCredentials)
      .where(eq(webauthnCredentials.userId, userId))
      .orderBy(desc(webauthnCredentials.createdAt));
  }

  async getWebauthnCredentialById(credentialId: string): Promise<WebauthnCredential | undefined> {
    const [credential] = await db.select().from(webauthnCredentials)
      .where(eq(webauthnCredentials.credentialId, credentialId))
      .limit(1);
    return credential;
  }

  async updateWebauthnCredentialCounter(credentialId: string, counter: number): Promise<void> {
    await db.update(webauthnCredentials)
      .set({ counter, lastUsed: new Date() })
      .where(eq(webauthnCredentials.credentialId, credentialId));
  }

  async deleteWebauthnCredential(id: number): Promise<boolean> {
    const result = await db.delete(webauthnCredentials)
      .where(eq(webauthnCredentials.id, id));
    return true;
  }

  async createWebauthnChallenge(challenge: InsertWebauthnChallenge): Promise<WebauthnChallenge> {
    const [inserted] = await db.insert(webauthnChallenges).values(challenge).returning();
    return inserted;
  }

  async getWebauthnChallenge(challenge: string): Promise<WebauthnChallenge | undefined> {
    const [result] = await db.select().from(webauthnChallenges)
      .where(eq(webauthnChallenges.challenge, challenge))
      .limit(1);
    return result;
  }

  async getPendingChallengesForUser(userId: number, type: string): Promise<WebauthnChallenge[]> {
    const results = await db.select().from(webauthnChallenges)
      .where(and(
        eq(webauthnChallenges.userId, userId),
        eq(webauthnChallenges.type, type)
      ))
      .orderBy(desc(webauthnChallenges.createdAt));
    return results;
  }

  async deleteWebauthnChallenge(challenge: string): Promise<void> {
    await db.delete(webauthnChallenges)
      .where(eq(webauthnChallenges.challenge, challenge));
  }

  async cleanupExpiredChallenges(): Promise<void> {
    await db.delete(webauthnChallenges)
      .where(sql`${webauthnChallenges.expiresAt} < NOW()`);
  }
}

export const storage = new DatabaseStorage();