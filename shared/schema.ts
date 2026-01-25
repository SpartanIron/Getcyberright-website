import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  passwordHash: text("password_hash"),
  role: text("role").default("user"),
  isActive: boolean("is_active").default(true),
  mustChangePassword: boolean("must_change_password").default(true),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  lastLogin: timestamp("last_login"),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  tokenVersion: integer("token_version").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  username: text("username"),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const webauthnCredentials = pgTable("webauthn_credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  credentialId: text("credential_id").notNull().unique(),
  credentialPublicKey: text("credential_public_key").notNull(),
  counter: integer("counter").notNull().default(0),
  credentialDeviceType: text("credential_device_type"),
  credentialBackedUp: boolean("credential_backed_up").default(false),
  transports: text("transports"),
  deviceName: text("device_name"),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const webauthnChallenges = pgTable("webauthn_challenges", {
  id: serial("id").primaryKey(),
  challenge: text("challenge").notNull().unique(),
  userId: integer("user_id"),
  type: text("type").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // News, Tutorial, Career, Analysis, Interview
  author: text("author").notNull(),
  authorTitle: text("author_title"),
  authorAvatar: text("author_avatar"),
  imageUrl: text("image_url"),
  url: text("url"),
  source: text("source"),
  publishedAt: timestamp("published_at").defaultNow(),
  readTime: integer("read_time").default(5),
  featured: boolean("featured").default(false),
  breaking: boolean("breaking").default(false),
});

export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull(), // free, premium, certification, career, tools
  category: text("category").notNull(),
  provider: text("provider"),
  price: text("price"),
  difficulty: text("difficulty"), // beginner, intermediate, advanced
});

export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"), // subscriber's first name for personalization
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  active: boolean("active").default(true),
  weeklyDigest: boolean("weekly_digest").default(true), // receive weekly fraud alerts
  digitalSafetyTips: boolean("digital_safety_tips").default(false), // receive digital safety tips
  tipsFrequency: text("tips_frequency").default("weekly"), // daily, thrice_weekly, weekly
  audience: text("audience").default("all"), // youth, senior, parent, traveler, all
  preferenceToken: text("preference_token"), // for managing preferences without login
  region: text("region").default("global"), // global, north_america, europe, asia_pacific, africa, latin_america, middle_east
  alertPriority: text("alert_priority").default("all"), // all, essentials_only (critical threats only)
});

// Cached news for production persistence across cold starts
export const cachedNews = pgTable("cached_news", {
  id: text("id").primaryKey(), // Hash of URL
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  category: text("category").notNull(),
  author: text("author"),
  source: text("source").notNull(),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  audienceTag: text("audience_tag"),
  cachedAt: timestamp("cached_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedAt: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  subscribedAt: true,
  active: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  createdAt: true,
});
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;

export const insertWebauthnCredentialSchema = createInsertSchema(webauthnCredentials).omit({
  id: true,
  createdAt: true,
});
export type WebauthnCredential = typeof webauthnCredentials.$inferSelect;
export type InsertWebauthnCredential = z.infer<typeof insertWebauthnCredentialSchema>;

export const insertWebauthnChallengeSchema = createInsertSchema(webauthnChallenges).omit({
  id: true,
  createdAt: true,
});
export type WebauthnChallenge = typeof webauthnChallenges.$inferSelect;
export type InsertWebauthnChallenge = z.infer<typeof insertWebauthnChallengeSchema>;

export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;

export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;

// Cyber Awareness Assessment Tables
export const cyberAssessments = pgTable("cyber_assessments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // phishing, passwords, social-engineering, etc.
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  scenario: text("scenario").notNull(),
  question: text("question").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  points: integer("points").notNull().default(10),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAssessmentResults = pgTable("user_assessment_results", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  username: text("username"),
  assessmentId: integer("assessment_id").references(() => cyberAssessments.id),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  timeSpent: integer("time_spent"), // in seconds
  completedAt: timestamp("completed_at").defaultNow(),
});

export const cyberAchievements = pgTable("cyber_achievements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  badgeIcon: text("badge_icon").notNull(),
  category: text("category").notNull(),
  requirement: text("requirement").notNull(),
  points: integer("points").notNull().default(50),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  username: text("username"),
  achievementId: integer("achievement_id").references(() => cyberAchievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Insert schemas for cyber awareness
export const insertCyberAssessmentSchema = createInsertSchema(cyberAssessments, {
  options: z.array(z.string()),
  tags: z.array(z.string()).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertUserAssessmentResultSchema = createInsertSchema(userAssessmentResults).omit({
  id: true,
  completedAt: true,
});

export const insertCyberAchievementSchema = createInsertSchema(cyberAchievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

// Types for cyber awareness
export type CyberAssessment = typeof cyberAssessments.$inferSelect;
export type InsertCyberAssessment = z.infer<typeof insertCyberAssessmentSchema>;

export type UserAssessmentResult = typeof userAssessmentResults.$inferSelect;
export type InsertUserAssessmentResult = z.infer<typeof insertUserAssessmentResultSchema>;

export type CyberAchievement = typeof cyberAchievements.$inferSelect;
export type InsertCyberAchievement = z.infer<typeof insertCyberAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;



// Featured People in Cybersecurity
export const featuredPeople = pgTable("featured_people", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  bio: text("bio").notNull(),
  achievements: text("achievements").array().notNull(),
  expertise: text("expertise").array().notNull(),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  websiteUrl: text("website_url"),
  featured: boolean("featured").default(false),
  impactScore: integer("impact_score").default(0),
  yearsExperience: integer("years_experience"),
  certifications: text("certifications").array().default([]),
  publications: text("publications").array().default([]),
  rotationGroup: integer("rotation_group").default(1), // 1-4 for quarterly rotation
  priority: integer("priority").default(0), // Higher priority = more likely to be shown
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Podcasts
export const podcasts = pgTable("podcasts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hostName: text("host_name").notNull(),
  guestName: text("guest_name"),
  guestTitle: text("guest_title"),
  guestCompany: text("guest_company"),
  duration: text("duration"), // e.g., "45:30"
  episodeNumber: integer("episode_number"),
  season: integer("season"),
  audioUrl: text("audio_url"),
  transcriptUrl: text("transcript_url"),
  thumbnailUrl: text("thumbnail_url"),
  tags: text("tags").array().default([]),
  category: text("category").notNull().default("General"),
  featured: boolean("featured").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blog Posts (Enhanced Articles)
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  authorTitle: text("author_title"),
  authorAvatar: text("author_avatar"),
  imageUrl: text("image_url"),
  tags: text("tags").array().default([]),
  readTime: integer("read_time"),
  featured: boolean("featured").default(false),
  published: boolean("published").default(true),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFeaturedPersonSchema = createInsertSchema(featuredPeople).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPodcastSchema = createInsertSchema(podcasts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type FeaturedPerson = typeof featuredPeople.$inferSelect;
export type InsertFeaturedPerson = z.infer<typeof insertFeaturedPersonSchema>;

export type Podcast = typeof podcasts.$inferSelect;
export type InsertPodcast = z.infer<typeof insertPodcastSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// Daily Tips Subscription
export const dailyTipsSubscriptions = pgTable("daily_tips_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  audience: text("audience").notNull(), // youth, senior, all
  frequency: text("frequency").default("daily"), // daily, thrice_weekly, weekly
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  preferenceToken: text("preference_token"), // for managing preferences without login
  region: text("region").default("global"), // global, north_america, europe, asia_pacific, africa, latin_america, middle_east
  country: text("country"), // specific country within region (e.g., "us", "uk", "au")
  alertPriority: text("alert_priority").default("all"), // all, essentials_only (critical threats only)
});

export const insertDailyTipsSubscriptionSchema = createInsertSchema(dailyTipsSubscriptions).omit({
  id: true,
  subscribedAt: true,
  unsubscribedAt: true,
  isActive: true,
  preferenceToken: true,
});

export type DailyTipsSubscription = typeof dailyTipsSubscriptions.$inferSelect;
export type InsertDailyTipsSubscription = z.infer<typeof insertDailyTipsSubscriptionSchema>;

// Weekly Digest Queue - for admin review before sending
export const weeklyDigests = pgTable("weekly_digests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  newsItems: text("news_items").notNull(), // JSON array of news article IDs/summaries
  threatAlerts: text("threat_alerts"), // JSON array of threat alerts
  status: text("status").default("draft"), // draft, pending_review, approved, sent
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count"),
});

export const insertWeeklyDigestSchema = createInsertSchema(weeklyDigests).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  sentAt: true,
  recipientCount: true,
});

export type WeeklyDigest = typeof weeklyDigests.$inferSelect;
export type InsertWeeklyDigest = z.infer<typeof insertWeeklyDigestSchema>;

// Daily Tips Queue - for admin review before sending
export const dailyTips = pgTable("daily_tips", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  tipContent: text("tip_content").notNull(), // Main tip text
  audience: text("audience").notNull().default("all"), // youth, senior, parent, traveler, all
  region: text("region").default("global"), // global, north_america, europe, asia_pacific, africa, latin_america, middle_east
  category: text("category"), // phishing, password, social_media, scam, privacy, etc.
  actionItems: text("action_items"), // JSON array of actionable steps
  funFact: text("fun_fact"), // Optional engaging fact
  sourceReference: text("source_reference"), // Reference to authoritative source (FBI IC3, CISA, etc.)
  regionalNote: text("regional_note"), // Region-specific context or reporting info
  status: text("status").default("draft"), // draft, approved, sent
  scheduledFor: timestamp("scheduled_for"),
  createdAt: timestamp("created_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count"),
});

export const insertDailyTipSchema = createInsertSchema(dailyTips).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  sentAt: true,
  recipientCount: true,
});

export type DailyTip = typeof dailyTips.$inferSelect;
export type InsertDailyTip = z.infer<typeof insertDailyTipSchema>;

// Scheduled Email Queue - for automated emails with validation
export const scheduledEmails = pgTable("scheduled_emails", {
  id: serial("id").primaryKey(),
  emailType: text("email_type").notNull(), // daily_tip, newsletter, weekly_digest
  audience: text("audience").notNull(), // youth, senior, all
  subject: text("subject").notNull(),
  htmlContent: text("html_content").notNull(),
  textContent: text("text_content"),
  status: text("status").default("pending_validation"), // pending_validation, validated, approved, rejected, sent, failed
  scheduledFor: timestamp("scheduled_for").notNull(),
  validationScore: integer("validation_score"), // 0-100 AI validation score
  validationNotes: text("validation_notes"), // AI feedback on content
  validatedAt: timestamp("validated_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: text("approved_by"), // "auto" for auto-approved, or admin username
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count"),
  successCount: integer("success_count"),
  failureCount: integer("failure_count"),
  createdAt: timestamp("created_at").defaultNow(),
  region: text("region"), // optional region targeting
  country: text("country"), // optional country targeting
});

export const insertScheduledEmailSchema = createInsertSchema(scheduledEmails).omit({
  id: true,
  validatedAt: true,
  approvedAt: true,
  sentAt: true,
  recipientCount: true,
  successCount: true,
  failureCount: true,
  createdAt: true,
});

export type ScheduledEmail = typeof scheduledEmails.$inferSelect;
export type InsertScheduledEmail = z.infer<typeof insertScheduledEmailSchema>;

// Tech Events and Conferences
export const techEvents = pgTable("tech_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizer: text("organizer").notNull(),
  description: text("description").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  location: text("location").notNull(),
  city: text("city"),
  country: text("country").notNull(),
  category: text("category").notNull(), // cybersecurity, ai, tech, data, cloud
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  isVirtual: boolean("is_virtual").default(false),
  isFree: boolean("is_free").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTechEventSchema = createInsertSchema(techEvents).omit({
  id: true,
  createdAt: true,
});

export type TechEvent = typeof techEvents.$inferSelect;
export type InsertTechEvent = z.infer<typeof insertTechEventSchema>;

// Threat Statistics for dynamic cybercrime data
export const threatStats = pgTable("threat_stats", {
  id: serial("id").primaryKey(),
  statKey: text("stat_key").notNull().unique(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  source: text("source").notNull(),
  sourceUrl: text("source_url"),
  category: text("category").notNull(),
  colorTheme: text("color_theme").default("teal"),
  displayOrder: integer("display_order").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
  reportYear: integer("report_year"),
});

export const ageGroupStats = pgTable("age_group_stats", {
  id: serial("id").primaryKey(),
  ageGroup: text("age_group").notNull(),
  percentage: integer("percentage").notNull(),
  colorClass: text("color_class").notNull(),
  displayOrder: integer("display_order").default(0),
  source: text("source").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const regionalAttackTypes = pgTable("regional_attack_types", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  attackTypes: text("attack_types").notNull(),
  colorClass: text("color_class").notNull(),
  displayOrder: integer("display_order").default(0),
  source: text("source").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertThreatStatSchema = createInsertSchema(threatStats).omit({
  id: true,
  lastUpdated: true,
});

export const insertAgeGroupStatSchema = createInsertSchema(ageGroupStats).omit({
  id: true,
  lastUpdated: true,
});

export const insertRegionalAttackTypeSchema = createInsertSchema(regionalAttackTypes).omit({
  id: true,
  lastUpdated: true,
});

export type ThreatStat = typeof threatStats.$inferSelect;
export type InsertThreatStat = z.infer<typeof insertThreatStatSchema>;

export type AgeGroupStat = typeof ageGroupStats.$inferSelect;
export type InsertAgeGroupStat = z.infer<typeof insertAgeGroupStatSchema>;

export type RegionalAttackType = typeof regionalAttackTypes.$inferSelect;
export type InsertRegionalAttackType = z.infer<typeof insertRegionalAttackTypeSchema>;

// Safety Tip Templates for automated email campaigns
export const safetyTipTemplates = pgTable("safety_tip_templates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  audience: text("audience").notNull(), // youth, senior, all
  category: text("category").notNull(), // awareness, action, scam-alert, privacy, mobile-money
  dayType: text("day_type").notNull(), // monday (awareness), friday (action)
  isActive: boolean("is_active").default(true),
  timesUsed: integer("times_used").default(0),
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Email Send Log for tracking sent emails
export const emailSendLog = pgTable("email_send_log", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id").notNull(),
  tipId: integer("tip_id").notNull(),
  sentAt: timestamp("sent_at").defaultNow(),
  status: text("status").notNull(), // sent, failed, bounced
  errorMessage: text("error_message"),
});

export const insertSafetyTipTemplateSchema = createInsertSchema(safetyTipTemplates).omit({
  id: true,
  timesUsed: true,
  lastUsedAt: true,
  createdAt: true,
});

export type SafetyTipTemplate = typeof safetyTipTemplates.$inferSelect;
export type InsertSafetyTipTemplate = z.infer<typeof insertSafetyTipTemplateSchema>;

export type EmailSendLog = typeof emailSendLog.$inferSelect;

// Partnership/Advertising Inquiries
export const partnershipInquiries = pgTable("partnership_inquiries", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  interest: text("interest").notNull(), // banner, sponsored, newsletter, partnership, multiple, other
  budget: text("budget"), // under-500, 500-1000, 1000-5000, 5000-plus, discuss
  message: text("message").notNull(),
  website: text("website"),
  status: text("status").default("new"), // new, contacted, in-progress, closed, rejected
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPartnershipInquirySchema = createInsertSchema(partnershipInquiries).omit({
  id: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
});

export type PartnershipInquiry = typeof partnershipInquiries.$inferSelect;
export type InsertPartnershipInquiry = z.infer<typeof insertPartnershipInquirySchema>;

// User Feedback
export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // general, bug, feature, scam-checker, content
  rating: integer("rating"), // 1-5
  message: text("message").notNull(),
  email: text("email"),
  page: text("page"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({
  id: true,
  createdAt: true,
});

export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;

// Scam Trends Tracking (anonymized)
export const scamTrends = pgTable("scam_trends", {
  id: serial("id").primaryKey(),
  scamType: text("scam_type").notNull(),
  keywords: text("keywords").array(),
  region: text("region"),
  count: integer("count").default(1),
  firstSeenAt: timestamp("first_seen_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  weekNumber: integer("week_number").notNull(),
  year: integer("year").notNull(),
});

export const insertScamTrendSchema = createInsertSchema(scamTrends).omit({
  id: true,
  firstSeenAt: true,
  lastSeenAt: true,
});

export type ScamTrend = typeof scamTrends.$inferSelect;
export type InsertScamTrend = z.infer<typeof insertScamTrendSchema>;

// Security Alerts for breach/vulnerability notifications
export const securityAlerts = pgTable("security_alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, high, medium, low, info
  category: text("category").notNull(), // breach, vulnerability, phishing, malware, scam, advisory
  source: text("source"), // FBI IC3, CISA, INTERPOL, etc.
  sourceUrl: text("source_url"),
  affectedSystems: text("affected_systems"), // What systems/software are affected
  recommendations: text("recommendations"), // What users should do
  isRead: boolean("is_read").default(false),
  isAcknowledged: boolean("is_acknowledged").default(false),
  acknowledgedBy: integer("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  expiresAt: timestamp("expires_at"), // Optional expiration for time-sensitive alerts
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSecurityAlertSchema = createInsertSchema(securityAlerts).omit({
  id: true,
  isRead: true,
  isAcknowledged: true,
  acknowledgedBy: true,
  acknowledgedAt: true,
  createdAt: true,
});

export type SecurityAlert = typeof securityAlerts.$inferSelect;
export type InsertSecurityAlert = z.infer<typeof insertSecurityAlertSchema>;

// Scam Checker Usage Tracking
export const scamCheckerUsage = pgTable("scam_checker_usage", {
  id: serial("id").primaryKey(),
  analysisType: text("analysis_type").notNull(), // url, qr, image, phone, email, situation
  resultRisk: text("result_risk"), // safe, suspicious, dangerous, unknown
  region: text("region"), // na, eu, africa, asia, latam, me, oceania, unknown
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScamCheckerUsageSchema = createInsertSchema(scamCheckerUsage).omit({
  id: true,
  createdAt: true,
});

export type ScamCheckerUsage = typeof scamCheckerUsage.$inferSelect;
export type InsertScamCheckerUsage = z.infer<typeof insertScamCheckerUsageSchema>;

// Breach Checker Usage Tracking
export const breachCheckerUsage = pgTable("breach_checker_usage", {
  id: serial("id").primaryKey(),
  checkType: text("check_type").notNull(), // email, password
  breachesFound: integer("breaches_found").default(0),
  passwordExposed: boolean("password_exposed").default(false),
  monitoringSignup: boolean("monitoring_signup").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBreachCheckerUsageSchema = createInsertSchema(breachCheckerUsage).omit({
  id: true,
  createdAt: true,
});

export type BreachCheckerUsage = typeof breachCheckerUsage.$inferSelect;
export type InsertBreachCheckerUsage = z.infer<typeof insertBreachCheckerUsageSchema>;

// Breach Monitoring Subscriptions - for proactive breach alerts
export const breachMonitoringSubscriptions = pgTable("breach_monitoring_subscriptions", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(), // subscriber's email for notifications
  monitoredEmails: text("monitored_emails").array().notNull(), // emails being monitored (up to 5)
  newsletterId: integer("newsletter_id").references(() => newsletters.id), // link to newsletter subscription
  isActive: boolean("is_active").default(true),
  lastCheckedAt: timestamp("last_checked_at"),
  totalBreachesFound: integer("total_breaches_found").default(0),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  unsubscribeToken: text("unsubscribe_token"),
});

// Breach Check Results - detailed breach information
export const breachCheckResults = pgTable("breach_check_results", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(), // the email that was checked
  subscriptionId: integer("subscription_id").references(() => breachMonitoringSubscriptions.id),
  breachName: text("breach_name").notNull(),
  breachDomain: text("breach_domain"),
  breachDate: timestamp("breach_date"),
  exposedDataTypes: text("exposed_data_types").array(), // email, password, phone, etc.
  description: text("description"),
  severity: text("severity"), // critical, high, medium, low
  isPasswordExposed: boolean("is_password_exposed").default(false),
  actionsTaken: text("actions_taken").array(), // user's actions
  isNotified: boolean("is_notified").default(false),
  notifiedAt: timestamp("notified_at"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
});

// Password Exposure Check Results (k-anonymity)
export const passwordExposureChecks = pgTable("password_exposure_checks", {
  id: serial("id").primaryKey(),
  passwordHash: text("password_hash").notNull(), // SHA-1 hash prefix (first 5 chars only for k-anonymity)
  exposureCount: integer("exposure_count").default(0), // times found in breaches
  checkedAt: timestamp("checked_at").defaultNow(),
  riskLevel: text("risk_level"), // safe, low, medium, high, critical
});

export const insertBreachMonitoringSubscriptionSchema = createInsertSchema(breachMonitoringSubscriptions).omit({
  id: true,
  subscribedAt: true,
  lastCheckedAt: true,
  totalBreachesFound: true,
});

export const insertBreachCheckResultSchema = createInsertSchema(breachCheckResults).omit({
  id: true,
  discoveredAt: true,
  notifiedAt: true,
});

export const insertPasswordExposureCheckSchema = createInsertSchema(passwordExposureChecks).omit({
  id: true,
  checkedAt: true,
});

export type BreachMonitoringSubscription = typeof breachMonitoringSubscriptions.$inferSelect;
export type InsertBreachMonitoringSubscription = z.infer<typeof insertBreachMonitoringSubscriptionSchema>;

export type BreachCheckResult = typeof breachCheckResults.$inferSelect;
export type InsertBreachCheckResult = z.infer<typeof insertBreachCheckResultSchema>;

export type PasswordExposureCheck = typeof passwordExposureChecks.$inferSelect;
export type InsertPasswordExposureCheck = z.infer<typeof insertPasswordExposureCheckSchema>;

// Unified Tool Usage Tracking - tracks all platform tools in one place
export const toolUsage = pgTable("tool_usage", {
  id: serial("id").primaryKey(),
  toolName: text("tool_name").notNull(), // scam_checker, password_generator, breach_checker, safety_quiz, quick_assessment
  action: text("action"), // e.g., url_check, phone_check, password_generate, passphrase_generate
  metadata: text("metadata"), // JSON string for additional details
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertToolUsageSchema = createInsertSchema(toolUsage).omit({
  id: true,
  createdAt: true,
});

export type ToolUsage = typeof toolUsage.$inferSelect;
export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;

// Contact Form Submissions
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  topic: text("topic"),
  subject: text("subject"),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  isReplied: boolean("is_replied").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  isRead: true,
  isReplied: true,
  createdAt: true,
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Re-export chat models for the Anthropic integration
export * from "./models/chat";

// Re-export auth models for Replit Auth integration
export * from "./models/auth";
