<<<<<<< HEAD
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models (custom email/password authentication with MFA)
export * from "./models/auth";

// Gamification - User Progress
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  scansCompleted: integer("scans_completed").default(0),
  lessonsCompleted: integer("lessons_completed").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActivityDate: timestamp("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserProgress = typeof userProgress.$inferSelect;

// Gamification - Badge Definitions
export const badgeDefinitions = pgTable("badge_definitions", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // scanner, education, streak, community
  tier: text("tier").notNull(), // bronze, silver, gold, platinum
  requirement: text("requirement").notNull(),
  points: integer("points").default(0),
  iconName: text("icon_name"),
});

export type BadgeDefinition = typeof badgeDefinitions.$inferSelect;

// Gamification - User Earned Badges
export const userBadges = pgTable("user_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  badgeId: varchar("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
  progress: integer("progress").default(0),
  maxProgress: integer("max_progress").default(1),
});

export type UserBadge = typeof userBadges.$inferSelect;

// Family Codewords - User's saved codewords
export const familyCodewords = pgTable("family_codewords", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  codeword: text("codeword").notNull(),
  style: text("style").notNull(), // simple, phrase, memorable
  familyName: text("family_name"),
  isActive: boolean("is_active").default(true),
=======
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
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

<<<<<<< HEAD
export type FamilyCodeword = typeof familyCodewords.$inferSelect;

// Audio Analysis History (for deepfake checks)
export const audioAnalysisHistory = pgTable("audio_analysis_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  fileName: text("file_name"),
  fileSize: integer("file_size"),
  isDeepfake: boolean("is_deepfake"),
  confidence: integer("confidence"),
  riskLevel: text("risk_level"),
  analysisResult: text("analysis_result"), // JSON string of indicators
  createdAt: timestamp("created_at").defaultNow(),
});

export type AudioAnalysisHistory = typeof audioAnalysisHistory.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  category: true,
  message: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true),
  preferences: text("preferences").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export const newsletterIssues = pgTable("newsletter_issues", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subject: text("subject").notNull(),
  contentHtml: text("content_html").notNull(),
  contentText: text("content_text").notNull(),
  threatSummary: text("threat_summary"),
  protectionTip: text("protection_tip"),
  familyTopic: text("family_topic"),
  quickWins: text("quick_wins").array(),
  status: text("status").notNull().default("draft"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  recipientCount: integer("recipient_count").default(0),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNewsletterIssueSchema = createInsertSchema(newsletterIssues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNewsletterIssue = z.infer<typeof insertNewsletterIssueSchema>;
export type NewsletterIssue = typeof newsletterIssues.$inferSelect;

export const scamReports = pgTable("scam_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scamType: text("scam_type").notNull(),
  description: text("description").notNull(),
  scammerContact: text("scammer_contact"),
  amountLost: text("amount_lost"),
  reporterEmail: text("reporter_email"),
  anonymous: text("anonymous").default("true"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScamReportSchema = createInsertSchema(scamReports).pick({
  scamType: true,
  description: true,
  scammerContact: true,
  amountLost: true,
  reporterEmail: true,
  anonymous: true,
});

export type InsertScamReport = z.infer<typeof insertScamReportSchema>;
export type ScamReport = typeof scamReports.$inferSelect;

// Tool Usage Analytics
export const toolUsage = pgTable("tool_usage", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  toolName: text("tool_name").notNull(),
  userId: varchar("user_id"), // null for anonymous users
  sessionId: varchar("session_id"), // track anonymous sessions
  countryCode: varchar("country_code", { length: 2 }),
  completed: boolean("completed").default(false),
  metadata: text("metadata"), // JSON string for additional data
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertToolUsageSchema = createInsertSchema(toolUsage).pick({
  toolName: true,
  userId: true,
  sessionId: true,
  countryCode: true,
  completed: true,
  metadata: true,
});

export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;
export type ToolUsage = typeof toolUsage.$inferSelect;

// ============================================
// THREAT INTELLIGENCE FEED INTEGRATION SYSTEM
// ============================================

// Threat Feed Registry - Metadata about each data source
export const threatFeeds = pgTable("threat_feeds", {
  id: varchar("id").primaryKey(), // e.g., "cisa-alerts", "phishtank", "nvd-cve"
  name: text("name").notNull(),
  description: text("description"),
  sourceUrl: text("source_url").notNull(),
  sourceType: text("source_type").notNull(), // api, rss, json, html, pdf
  category: text("category").notNull(), // government, security-research, industry, standards
  priority: integer("priority").default(5), // 1-10, higher = more important
  scheduleInterval: integer("schedule_interval").default(3600), // seconds between updates
  isActive: boolean("is_active").default(true),
  requiresAuth: boolean("requires_auth").default(false),
  authConfig: text("auth_config"), // JSON with auth details (encrypted)
  parserConfig: text("parser_config"), // JSON with parsing rules
  lastSuccessfulRun: timestamp("last_successful_run"),
  lastAttemptedRun: timestamp("last_attempted_run"),
  lastError: text("last_error"),
  itemCount: integer("item_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ThreatFeed = typeof threatFeeds.$inferSelect;
export type InsertThreatFeed = typeof threatFeeds.$inferInsert;

// Feed Run History - Track each ingestion attempt
export const feedRuns = pgTable("feed_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  feedId: varchar("feed_id").notNull(),
  status: text("status").notNull(), // pending, running, success, failed, partial
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  itemsIngested: integer("items_ingested").default(0),
  itemsUpdated: integer("items_updated").default(0),
  itemsSkipped: integer("items_skipped").default(0),
  errorMessage: text("error_message"),
  durationMs: integer("duration_ms"),
  triggeredBy: text("triggered_by").default("scheduler"), // scheduler, manual, webhook
});

export type FeedRun = typeof feedRuns.$inferSelect;

// Threat Items - Normalized intelligence from all sources
export const threatItems = pgTable("threat_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  feedId: varchar("feed_id").notNull(),
  externalId: text("external_id"), // ID from the source
  contentHash: text("content_hash"), // For deduplication
  itemType: text("item_type").notNull(), // alert, advisory, indicator, statistic, report, vulnerability
  title: text("title").notNull(),
  summary: text("summary"),
  content: text("content"), // Full content or JSON
  severity: text("severity"), // critical, high, medium, low, informational
  confidence: integer("confidence"), // 0-100
  regions: text("regions"), // JSON array of region codes
  tags: text("tags"), // JSON array of tags
  indicators: text("indicators"), // JSON array of IOCs (URLs, IPs, hashes)
  affectedAudiences: text("affected_audiences"), // JSON array: seniors, kids, parents, business
  sourceUrl: text("source_url"),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  ingestedAt: timestamp("ingested_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export type ThreatItem = typeof threatItems.$inferSelect;
export type InsertThreatItem = typeof threatItems.$inferInsert;

// Content Refresh Mappings - Link threat items to platform content
export const contentRefreshMappings = pgTable("content_refresh_mappings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threatItemId: varchar("threat_item_id").notNull(),
  contentType: text("content_type").notNull(), // page, section, statistic, alert
  contentPath: text("content_path").notNull(), // e.g., "/seniors", "dashboard.threatTrends"
  lastRefreshed: timestamp("last_refreshed").defaultNow(),
  autoUpdate: boolean("auto_update").default(true),
});

export type ContentRefreshMapping = typeof contentRefreshMappings.$inferSelect;

// Feed Health Alerts - Track issues with feeds
export const feedHealthAlerts = pgTable("feed_health_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  feedId: varchar("feed_id").notNull(),
  alertType: text("alert_type").notNull(), // stale, error, degraded, rate_limited
  severity: text("severity").notNull(), // warning, critical
  message: text("message").notNull(),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type FeedHealthAlert = typeof feedHealthAlerts.$inferSelect;

// Content Pages Registry - Catalog of all educational content for governance
export const contentPages = pgTable("content_pages", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  path: text("path").notNull(),
  section: text("section").notNull(), // kids, seniors, parents, educators, small-business, tools, general
  audience: text("audience").notNull(), // kids, seniors, parents, educators, business, all
  topics: text("topics").array().notNull(), // phishing, malware, identity-theft, social-engineering, etc.
  lastManualUpdate: timestamp("last_manual_update"),
  freshnessScore: integer("freshness_score").default(100), // 0-100 score
  priorityLevel: text("priority_level").default("normal"), // low, normal, high, critical
  needsReview: boolean("needs_review").default(false),
  reviewReason: text("review_reason"),
  relatedThreatCount: integer("related_threat_count").default(0),
  lastThreatMatch: timestamp("last_threat_match"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ContentPage = typeof contentPages.$inferSelect;
export type InsertContentPage = typeof contentPages.$inferInsert;

// Content Audit Log - Track content review and update actions
export const contentAuditLog = pgTable("content_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull(),
  action: text("action").notNull(), // flagged, reviewed, updated, dismissed
  triggeredBy: text("triggered_by").notNull(), // system, admin, threat-match
  threatItemId: varchar("threat_item_id"),
  notes: text("notes"),
  previousScore: integer("previous_score"),
  newScore: integer("new_score"),
  performedBy: varchar("performed_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ContentAuditLog = typeof contentAuditLog.$inferSelect;

// NIST 800-53 Compliance - Control Families
export const complianceControlFamilies = pgTable("compliance_control_families", {
  id: varchar("id").primaryKey(), // e.g., "AC", "AU", "SC"
  name: text("name").notNull(),
  description: text("description").notNull(),
  totalControls: integer("total_controls").default(0),
  implementedControls: integer("implemented_controls").default(0),
  partialControls: integer("partial_controls").default(0),
  notApplicableControls: integer("not_applicable_controls").default(0),
  complianceScore: integer("compliance_score").default(0), // 0-100
  priority: text("priority").default("medium"), // low, medium, high, critical
  lastAssessment: timestamp("last_assessment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ComplianceControlFamily = typeof complianceControlFamilies.$inferSelect;

// NIST 800-53 Compliance - Individual Controls
export const complianceControls = pgTable("compliance_controls", {
  id: varchar("id").primaryKey(), // e.g., "AC-1", "AC-2", "AU-1"
  familyId: varchar("family_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  implementationStatus: text("implementation_status").default("not_implemented"), // implemented, partial, planned, not_implemented, not_applicable
  priority: text("priority").default("moderate"), // low, moderate, high
  evidence: text("evidence"), // JSON array of evidence items
  platformFeatures: text("platform_features"), // JSON array of related platform features
  gaps: text("gaps"), // JSON array of identified gaps
  recommendations: text("recommendations"),
  lastAssessment: timestamp("last_assessment"),
  assessedBy: varchar("assessed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ComplianceControl = typeof complianceControls.$inferSelect;

// Compliance Assessment History
export const complianceAssessments = pgTable("compliance_assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentType: text("assessment_type").notNull(), // full, family, control
  targetId: varchar("target_id"), // family or control ID if targeted
  overallScore: integer("overall_score"),
  implementedCount: integer("implemented_count").default(0),
  partialCount: integer("partial_count").default(0),
  gapsCount: integer("gaps_count").default(0),
  summary: text("summary"),
  performedBy: varchar("performed_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ComplianceAssessment = typeof complianceAssessments.$inferSelect;

// ============================================
// TRAINING SYSTEM - Cybersecurity Curriculum
// ============================================

// Training Audiences
export const TRAINING_AUDIENCES = ["kids", "parents", "seniors", "educators", "small-business"] as const;
export type TrainingAudience = typeof TRAINING_AUDIENCES[number];

// Training Levels
export const TRAINING_LEVELS = ["foundation", "intermediate", "advanced"] as const;
export type TrainingLevel = typeof TRAINING_LEVELS[number];

// Competency Domains (aligned with NIST NICE Framework)
export const COMPETENCY_DOMAINS = [
  "threat-recognition",
  "password-security",
  "privacy-protection",
  "safe-online-behavior",
  "device-security",
  "social-engineering",
  "incident-response"
] as const;
export type CompetencyDomain = typeof COMPETENCY_DOMAINS[number];

// Learning Paths - Audience-specific curriculum tracks
export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  audience: text("audience").notNull(), // kids, parents, seniors, educators, small-business
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // foundation, intermediate, advanced
  estimatedHours: integer("estimated_hours").default(3),
  prerequisites: text("prerequisites").array(),
  learningOutcomes: text("learning_outcomes").array(),
  certificateName: text("certificate_name"),
  iconName: text("icon_name"),
  color: text("color"),
  sortOrder: integer("sort_order").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type LearningPath = typeof learningPaths.$inferSelect;
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;

// Training Modules - Groups of related lessons within a path
export const trainingModules = pgTable("training_modules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathId: varchar("path_id").notNull(),
  domain: text("domain").notNull(), // competency domain
  title: text("title").notNull(),
  description: text("description").notNull(),
  learningObjectives: text("learning_objectives").array(),
  estimatedMinutes: integer("estimated_minutes").default(30),
  sortOrder: integer("sort_order").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TrainingModule = typeof trainingModules.$inferSelect;
export const insertTrainingModuleSchema = createInsertSchema(trainingModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTrainingModule = z.infer<typeof insertTrainingModuleSchema>;

// Training Lessons - Individual learning units
export const trainingLessons = pgTable("training_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contentType: text("content_type").notNull(), // text, video, interactive, scenario
  contentHtml: text("content_html"), // Rich content
  videoUrl: text("video_url"),
  scenarioData: text("scenario_data"), // JSON for interactive scenarios
  keyTakeaways: text("key_takeaways").array(),
  estimatedMinutes: integer("estimated_minutes").default(10),
  sortOrder: integer("sort_order").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TrainingLesson = typeof trainingLessons.$inferSelect;
export const insertTrainingLessonSchema = createInsertSchema(trainingLessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTrainingLesson = z.infer<typeof insertTrainingLessonSchema>;

// Training Quizzes - Assessment tied to modules
export const trainingQuizzes = pgTable("training_quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  moduleId: varchar("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").default(70), // percentage
  maxAttempts: integer("max_attempts").default(3),
  timeLimit: integer("time_limit"), // minutes, null = unlimited
  shuffleQuestions: boolean("shuffle_questions").default(true),
  showCorrectAnswers: boolean("show_correct_answers").default(true),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type TrainingQuiz = typeof trainingQuizzes.$inferSelect;
export const insertTrainingQuizSchema = createInsertSchema(trainingQuizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertTrainingQuiz = z.infer<typeof insertTrainingQuizSchema>;

// Quiz Questions
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  quizId: varchar("quiz_id").notNull(),
  questionType: text("question_type").notNull(), // multiple-choice, true-false, scenario
  questionText: text("question_text").notNull(),
  options: text("options").array(), // JSON array of options
  correctAnswer: text("correct_answer").notNull(), // answer or index
  explanation: text("explanation"), // Shown after answering
  scenarioContext: text("scenario_context"), // For scenario-based questions
  difficulty: text("difficulty").default("medium"), // easy, medium, hard
  points: integer("points").default(10),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

// User Learning Progress - Tracks completion
export const userLearningProgress = pgTable("user_learning_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pathId: varchar("path_id"),
  moduleId: varchar("module_id"),
  lessonId: varchar("lesson_id"),
  status: text("status").notNull().default("not_started"), // not_started, in_progress, completed
  progressPercent: integer("progress_percent").default(0),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserLearningProgress = typeof userLearningProgress.$inferSelect;
export const insertUserLearningProgressSchema = createInsertSchema(userLearningProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUserLearningProgress = z.infer<typeof insertUserLearningProgressSchema>;

// Quiz Attempts - Tracks user quiz performance
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  quizId: varchar("quiz_id").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  percentScore: integer("percent_score").notNull(),
  passed: boolean("passed").notNull(),
  answers: text("answers"), // JSON of question ID -> user answer
  timeSpentSeconds: integer("time_spent_seconds"),
  attemptNumber: integer("attempt_number").default(1),
  completedAt: timestamp("completed_at").defaultNow(),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

// Training Certificates - Earned upon path completion
export const trainingCertificates = pgTable("training_certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  pathId: varchar("path_id").notNull(),
  certificateName: text("certificate_name").notNull(),
  certificateNumber: text("certificate_number").notNull(),
  issueDate: timestamp("issue_date").defaultNow(),
  expiryDate: timestamp("expiry_date"), // null = no expiry
  finalScore: integer("final_score"),
  verificationUrl: text("verification_url"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TrainingCertificate = typeof trainingCertificates.$inferSelect;
export const insertTrainingCertificateSchema = createInsertSchema(trainingCertificates).omit({
  id: true,
  createdAt: true,
});
export type InsertTrainingCertificate = z.infer<typeof insertTrainingCertificateSchema>;

// ============================================
// DATA BROKER REMOVAL SYSTEM
// ============================================

export const DATA_BROKER_CATEGORIES = [
  "people-search",
  "marketing",
  "financial",
  "location",
  "recruitment",
  "background-check",
  "social-media-aggregator",
  "public-records",
  "health",
  "advertising",
] as const;
export type DataBrokerCategory = typeof DATA_BROKER_CATEGORIES[number];

export const OPT_OUT_METHODS = ["web-form", "email", "mail", "phone", "api", "account-deletion", "mixed"] as const;
export type OptOutMethod = typeof OPT_OUT_METHODS[number];

export const REMOVAL_STATUS = [
  "not_started",
  "scan_found",
  "request_generated",
  "request_sent",
  "in_progress",
  "confirmed_removed",
  "re_appeared",
  "failed",
  "not_found",
] as const;
export type RemovalStatus = typeof REMOVAL_STATUS[number];

export const dataBrokers = pgTable("data_brokers", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  dataTypesCollected: text("data_types_collected").array(),
  optOutMethod: text("opt_out_method").notNull(),
  optOutUrl: text("opt_out_url"),
  optOutEmail: text("opt_out_email"),
  optOutMailAddress: text("opt_out_mail_address"),
  optOutPhone: text("opt_out_phone"),
  optOutInstructions: text("opt_out_instructions"),
  difficulty: text("difficulty").notNull().default("medium"),
  estimatedProcessingDays: integer("estimated_processing_days").default(30),
  requiresIdVerification: boolean("requires_id_verification").default(false),
  requiresAccountCreation: boolean("requires_account_creation").default(false),
  legalBasis: text("legal_basis").array(),
  countriesApplicable: text("countries_applicable").array(),
  riskLevel: text("risk_level").default("medium"),
  monthlyVisitors: text("monthly_visitors"),
  parentCompany: text("parent_company"),
  relatedBrokers: text("related_brokers").array(),
  automationFeasibility: text("automation_feasibility").default("manual"),
  privacyPolicyUrl: text("privacy_policy_url"),
  dataRetentionPolicy: text("data_retention_policy"),
  verificationMethod: text("verification_method"),
  lastVerifiedBy: text("last_verified_by"),
  sourceVersion: integer("source_version").default(1),
  isActive: boolean("is_active").default(true),
  lastVerified: timestamp("last_verified"),
  lastProcessChange: timestamp("last_process_change"),
  avgResponseDays: integer("avg_response_days"),
  difficultyRating: integer("difficulty_rating").default(5),
  successRate: integer("success_rate"),
  totalRemovalRequests: integer("total_removal_requests").default(0),
  totalSuccessfulRemovals: integer("total_successful_removals").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type DataBroker = typeof dataBrokers.$inferSelect;
export const insertDataBrokerSchema = createInsertSchema(dataBrokers).omit({
  createdAt: true,
  updatedAt: true,
});
export type InsertDataBroker = z.infer<typeof insertDataBrokerSchema>;

export const userVaultProfiles = pgTable("user_vault_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  profileName: text("profile_name").notNull().default("Primary"),
  fullName: text("full_name"),
  previousNames: text("previous_names").array(),
  emails: text("emails").array(),
  phoneNumbers: text("phone_numbers").array(),
  currentAddress: text("current_address"),
  previousAddresses: text("previous_addresses").array(),
  dateOfBirth: text("date_of_birth"),
  relativeNames: text("relative_names").array(),
  employerNames: text("employer_names").array(),
  dataMinimized: boolean("data_minimized").default(false),
  retentionExpiresAt: timestamp("retention_expires_at"),
  lastAccessedAt: timestamp("last_accessed_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserVaultProfile = typeof userVaultProfiles.$inferSelect;
export const insertUserVaultProfileSchema = createInsertSchema(userVaultProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUserVaultProfile = z.infer<typeof insertUserVaultProfileSchema>;

export const exposureScans = pgTable("exposure_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  vaultProfileId: varchar("vault_profile_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalBrokersScanned: integer("total_brokers_scanned").default(0),
  totalExposuresFound: integer("total_exposures_found").default(0),
  privacyScore: integer("privacy_score"),
  riskLevel: text("risk_level"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExposureScan = typeof exposureScans.$inferSelect;
export const insertExposureScanSchema = createInsertSchema(exposureScans).omit({
  id: true,
  createdAt: true,
});
export type InsertExposureScan = z.infer<typeof insertExposureScanSchema>;

export const exposureFindings = pgTable("exposure_findings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scanId: varchar("scan_id").notNull(),
  userId: varchar("user_id").notNull(),
  brokerId: varchar("broker_id").notNull(),
  dataTypesExposed: text("data_types_exposed").array(),
  exposureLevel: text("exposure_level").default("medium"),
  detectedAt: timestamp("detected_at").defaultNow(),
});

export type ExposureFinding = typeof exposureFindings.$inferSelect;

export const removalRequests = pgTable("removal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  brokerId: varchar("broker_id").notNull(),
  vaultProfileId: varchar("vault_profile_id").notNull(),
  findingId: varchar("finding_id"),
  status: text("status").notNull().default("not_started"),
  requestMethod: text("request_method"),
  requestContent: text("request_content"),
  requestSentAt: timestamp("request_sent_at"),
  followUpCount: integer("follow_up_count").default(0),
  maxFollowUps: integer("max_follow_ups").default(3),
  lastFollowUpAt: timestamp("last_follow_up_at"),
  confirmedRemovedAt: timestamp("confirmed_removed_at"),
  reAppearedAt: timestamp("re_appeared_at"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  lastError: text("last_error"),
  nextRetryAt: timestamp("next_retry_at"),
  escalationLevel: integer("escalation_level").default(0),
  jurisdictionApplied: text("jurisdiction_applied"),
  legalBasisUsed: text("legal_basis_used"),
  complianceDeadline: timestamp("compliance_deadline"),
  verificationRequired: boolean("verification_required").default(false),
  verificationCompletedAt: timestamp("verification_completed_at"),
  changeDetectedAt: timestamp("change_detected_at"),
  lastCheckedAt: timestamp("last_checked_at"),
  complianceStatus: text("compliance_status").default("pending"),
  responseReceivedAt: timestamp("response_received_at"),
  regulatoryDeadlineDays: integer("regulatory_deadline_days"),
  isOverdue: boolean("is_overdue").default(false),
  nonComplianceReported: boolean("non_compliance_reported").default(false),
  nonComplianceReportedAt: timestamp("non_compliance_reported_at"),
  proofOfRemoval: text("proof_of_removal"),
  removalEvidence: text("removal_evidence").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type RemovalRequest = typeof removalRequests.$inferSelect;
export const insertRemovalRequestSchema = createInsertSchema(removalRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRemovalRequest = z.infer<typeof insertRemovalRequestSchema>;

export const monitoringSchedules = pgTable("monitoring_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  vaultProfileId: varchar("vault_profile_id").notNull(),
  frequencyDays: integer("frequency_days").default(90),
  nextScanDate: timestamp("next_scan_date"),
  lastScanDate: timestamp("last_scan_date"),
  lastRunStatus: text("last_run_status"),
  lastRunError: text("last_run_error"),
  totalReappearances: integer("total_reappearances").default(0),
  consecutiveFailures: integer("consecutive_failures").default(0),
  isActive: boolean("is_active").default(true),
  totalScansCompleted: integer("total_scans_completed").default(0),
  autoReRemoval: boolean("auto_re_removal").default(false),
  autoReRemovalCount: integer("auto_re_removal_count").default(0),
  notifyOnNewExposure: boolean("notify_on_new_exposure").default(true),
  notifyOnReAppearance: boolean("notify_on_re_appearance").default(true),
  notifyOnComplianceDeadline: boolean("notify_on_compliance_deadline").default(true),
  monitoringMode: text("monitoring_mode").default("periodic"),
  darkWebMonitoring: boolean("dark_web_monitoring").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type MonitoringSchedule = typeof monitoringSchedules.$inferSelect;

export const privacyReports = pgTable("privacy_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  scanId: varchar("scan_id"),
  privacyScore: integer("privacy_score").notNull(),
  totalBrokersChecked: integer("total_brokers_checked").default(0),
  totalExposures: integer("total_exposures").default(0),
  totalRemoved: integer("total_removed").default(0),
  totalInProgress: integer("total_in_progress").default(0),
  totalPending: integer("total_pending").default(0),
  categoryBreakdown: text("category_breakdown"),
  riskAssessment: text("risk_assessment"),
  recommendations: text("recommendations").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PrivacyReport = typeof privacyReports.$inferSelect;

export const optOutContent = pgTable("opt_out_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  brokerId: varchar("broker_id").notNull(),
  removalRequestId: varchar("removal_request_id"),
  regulatoryFramework: text("regulatory_framework").notNull().default("CCPA"),
  templateType: text("template_type").notNull().default("deletion_request"),
  subject: text("subject"),
  body: text("body").notNull(),
  legalCitations: text("legal_citations").array(),
  attachmentDescriptions: text("attachment_descriptions").array(),
  deliveryMethod: text("delivery_method").default("email"),
  sentAt: timestamp("sent_at"),
  sentTo: text("sent_to"),
  responseReceivedAt: timestamp("response_received_at"),
  responseContent: text("response_content"),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type OptOutContent = typeof optOutContent.$inferSelect;
export const insertOptOutContentSchema = createInsertSchema(optOutContent).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertOptOutContent = z.infer<typeof insertOptOutContentSchema>;

export const removalAuditLog = pgTable("removal_audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  previousState: text("previous_state"),
  newState: text("new_state"),
  metadata: jsonb("metadata"),
=======
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  username: text("username"),
  action: text("action").notNull(),
  details: text("details"),
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

<<<<<<< HEAD
export type RemovalAuditLog = typeof removalAuditLog.$inferSelect;

export const removalVerifications = pgTable("removal_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  removalRequestId: varchar("removal_request_id").notNull(),
  brokerId: varchar("broker_id").notNull(),
  verificationType: text("verification_type").notNull().default("re_scan"),
  status: text("status").notNull().default("pending"),
  dataStillPresent: boolean("data_still_present"),
  evidenceUrl: text("evidence_url"),
  evidenceScreenshot: text("evidence_screenshot"),
  notes: text("notes"),
  scheduledFor: timestamp("scheduled_for"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type RemovalVerification = typeof removalVerifications.$inferSelect;
export const insertRemovalVerificationSchema = createInsertSchema(removalVerifications).omit({
  id: true,
  createdAt: true,
});
export type InsertRemovalVerification = z.infer<typeof insertRemovalVerificationSchema>;

export const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  not_started: ["scan_found", "request_generated", "pending", "request_sent", "failed"],
  scan_found: ["request_generated", "not_found"],
  request_generated: ["request_sent", "pending", "failed"],
  pending: ["request_sent", "failed", "request_generated"],
  request_sent: ["in_progress", "confirmed_removed", "failed"],
  in_progress: ["confirmed_removed", "failed", "verifying"],
  verifying: ["confirmed_removed", "re_appeared", "failed"],
  confirmed_removed: ["re_appeared", "verified_removed"],
  verified_removed: ["re_appeared"],
  failed: ["request_generated", "not_started"],
  re_appeared: ["request_generated", "in_progress"],
  not_found: ["scan_found"],
};
=======
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
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
