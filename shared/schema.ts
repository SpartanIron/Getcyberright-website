import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, serial } from "drizzle-orm/pg-core";
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export const experienceWaitlist = pgTable("experience_waitlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  name: text("name"),
  type: text("type").notNull().default("family"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExperienceWaitlistSchema = createInsertSchema(experienceWaitlist).pick({
  email: true,
  name: true,
  type: true,
}).extend({
  email: z.string().email("Please enter a valid email address"),
  type: z.enum(["family", "vendor"]).default("family"),
});

export type InsertExperienceWaitlist = z.infer<typeof insertExperienceWaitlistSchema>;
export type ExperienceWaitlist = typeof experienceWaitlist.$inferSelect;

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull().default("New Chat"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

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
  privacyMode: text("privacy_mode").default("standard"),
  priorityLevel: text("priority_level").default("normal"),
  complianceFrameworks: text("compliance_frameworks").array(),
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

export const vaultAuditLogs = pgTable("vault_audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  action: text("action").notNull(),
  vaultProfileId: varchar("vault_profile_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  fieldsAccessed: text("fields_accessed").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type VaultAuditLog = typeof vaultAuditLogs.$inferSelect;

export const userVaultKeys = pgTable("user_vault_keys", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  vaultKeySalt: text("vault_key_salt").notNull(),
  encryptedVaultKey: text("encrypted_vault_key").notNull(),
  vaultKeyVerification: text("vault_key_verification").notNull(),
  keyDerivationIterations: integer("key_derivation_iterations").notNull().default(600000),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserVaultKey = typeof userVaultKeys.$inferSelect;

export const exposureScans = pgTable("exposure_scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  vaultProfileId: varchar("vault_profile_id").notNull(),
  status: text("status").notNull().default("pending"),
  totalBrokersScanned: integer("total_brokers_scanned").default(0),
  totalExposuresFound: integer("total_exposures_found").default(0),
  privacyScore: integer("privacy_score"),
  riskLevel: text("risk_level"),
  identityRiskScore: integer("identity_risk_score"),
  breachCount: integer("breach_count").default(0),
  profilesDiscovered: integer("profiles_discovered").default(0),
  activeBrokersFound: integer("active_brokers_found").default(0),
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
  verificationMethod: text("verification_method").default("broker_analysis"),
  verificationDetails: text("verification_details"),
  confidenceScore: integer("confidence_score").default(0),
  sourceEvidence: text("source_evidence"),
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
  alertThresholdNewExposures: integer("alert_threshold_new_exposures").default(1),
  alertThresholdRiskScore: integer("alert_threshold_risk_score").default(70),
  reindexDetection: boolean("reindex_detection").default(true),
  lastRiskScore: integer("last_risk_score"),
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
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

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

export const brokerWalkthroughs = pgTable("broker_walkthroughs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull(),
  brokerName: text("broker_name").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  estimatedMinutes: integer("estimated_minutes").default(5),
  requiresCaptcha: boolean("requires_captcha").default(false),
  requiresAccount: boolean("requires_account").default(false),
  requiresId: boolean("requires_id").default(false),
  requiresPhone: boolean("requires_phone").default(false),
  optOutUrl: text("opt_out_url"),
  steps: jsonb("steps").notNull(),
  tips: text("tips").array(),
  lastVerified: timestamp("last_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BrokerWalkthrough = typeof brokerWalkthroughs.$inferSelect;
export const insertBrokerWalkthroughSchema = createInsertSchema(brokerWalkthroughs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBrokerWalkthrough = z.infer<typeof insertBrokerWalkthroughSchema>;

export const securityAlerts = pgTable("security_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).notNull().default("medium"),
  category: varchar("category", { length: 50 }).notNull().default("advisory"),
  source: varchar("source", { length: 100 }).notNull(),
  sourceUrl: text("source_url").notNull(),
  affectedSystems: text("affected_systems"),
  recommendations: text("recommendations"),
  isRead: boolean("is_read").default(false),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
export type SecurityAlert = typeof securityAlerts.$inferSelect;

export const breachMonitoringSubscriptions = pgTable("breach_monitoring_subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull(),
  monitoredEmails: text("monitored_emails").array(),
  isActive: boolean("is_active").default(true),
  unsubscribeToken: varchar("unsubscribe_token", { length: 100 }),
  lastCheckedAt: timestamp("last_checked_at"),
  totalBreachesFound: integer("total_breaches_found").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
export type BreachMonitoringSubscription = typeof breachMonitoringSubscriptions.$inferSelect;

export const breachCheckResults = pgTable("breach_check_results", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull(),
  subscriptionId: integer("subscription_id"),
  breachName: varchar("breach_name", { length: 255 }).notNull(),
  breachDomain: varchar("breach_domain", { length: 255 }),
  breachDate: timestamp("breach_date"),
  exposedDataTypes: text("exposed_data_types").array(),
  severity: varchar("severity", { length: 20 }).default("medium"),
  isPasswordExposed: boolean("is_password_exposed").default(false),
  isNotified: boolean("is_notified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
export type BreachCheckResult = typeof breachCheckResults.$inferSelect;

export const profileDiscoveries = pgTable("profile_discoveries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  scanId: varchar("scan_id"),
  brokerId: varchar("broker_id").notNull(),
  profileUrl: text("profile_url"),
  searchMethod: text("search_method").notNull(),
  nameMatch: boolean("name_match").default(false),
  cityMatch: boolean("city_match").default(false),
  stateMatch: boolean("state_match").default(false),
  ageMatch: boolean("age_match").default(false),
  matchScore: integer("match_score").default(0),
  extractedName: text("extracted_name"),
  extractedCity: text("extracted_city"),
  extractedState: text("extracted_state"),
  extractedAge: text("extracted_age"),
  extractedRelatives: text("extracted_relatives").array(),
  rawSnippet: text("raw_snippet"),
  responseTimeMs: integer("response_time_ms"),
  isConfirmedMatch: boolean("is_confirmed_match").default(false),
  status: text("status").notNull().default("found"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ProfileDiscovery = typeof profileDiscoveries.$inferSelect;
export const insertProfileDiscoverySchema = createInsertSchema(profileDiscoveries).omit({
  id: true,
  createdAt: true,
});
export type InsertProfileDiscovery = z.infer<typeof insertProfileDiscoverySchema>;

export const brokerPerformance = pgTable("broker_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brokerId: varchar("broker_id").notNull(),
  totalRequests: integer("total_requests").default(0),
  successfulRemovals: integer("successful_removals").default(0),
  failedRemovals: integer("failed_removals").default(0),
  averageRemovalDays: integer("average_removal_days"),
  reappearanceCount: integer("reappearance_count").default(0),
  reappearanceRate: integer("reappearance_rate").default(0),
  lastSuccessAt: timestamp("last_success_at"),
  lastFailureAt: timestamp("last_failure_at"),
  fingerprint: text("fingerprint"),
  bestMethod: text("best_method"),
  commonFailureReasons: text("common_failure_reasons").array(),
  avgResponseTimeDays: integer("avg_response_time_days"),
  complianceRate: integer("compliance_rate").default(100),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BrokerPerformance = typeof brokerPerformance.$inferSelect;

export const shieldScans = pgTable("shield_scans", {
  scanId: varchar("scan_id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  zip: text("zip"),
  userId: varchar("user_id"),
  exposureScore: text("exposure_score"),
  rawResults: jsonb("raw_results"),
  status: text("status").notNull().default("pending"),
  consentGiven: boolean("consent_given").notNull().default(false),
  consentTimestamp: timestamp("consent_timestamp"),
  consentIp: text("consent_ip"),
  deletedAt: timestamp("deleted_at"),
});

export type ShieldScan = typeof shieldScans.$inferSelect;
export const insertShieldScanSchema = createInsertSchema(shieldScans).omit({
  scanId: true,
  createdAt: true,
  deletedAt: true,
});
export type InsertShieldScan = z.infer<typeof insertShieldScanSchema>;

export const shieldLeads = pgTable("shield_leads", {
  leadId: varchar("lead_id").primaryKey().default(sql`gen_random_uuid()`),
  scanId: varchar("scan_id"),
  lastScanId: varchar("last_scan_id"),
  email: text("email").notNull(),
  alertEmail: text("alert_email").notNull(),
  nextScanDue: timestamp("next_scan_due"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  optedIn: boolean("opted_in").default(true),
});

export type ShieldLead = typeof shieldLeads.$inferSelect;
export const insertShieldLeadSchema = createInsertSchema(shieldLeads).omit({
  leadId: true,
  createdAt: true,
});
export type InsertShieldLead = z.infer<typeof insertShieldLeadSchema>;

// AI Prompt Library - Prompts stored in database
export const aiPrompts = pgTable("ai_prompts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  promptText: text("prompt_text").notNull(),
  audience: text("audience").array().notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  useCase: text("use_case").notNull(),
  safetyNote: text("safety_note"),
  iconName: text("icon_name").notNull(),
  isActive: boolean("is_active").default(true),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type AiPrompt = typeof aiPrompts.$inferSelect;
export const insertAiPromptSchema = createInsertSchema(aiPrompts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertAiPrompt = z.infer<typeof insertAiPromptSchema>;

// AI Prompt Reviews - AI-suggested improvements and new prompts
export const promptReviews = pgTable("prompt_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  promptId: varchar("prompt_id"),
  reviewType: text("review_type").notNull(),
  proposedTitle: text("proposed_title"),
  proposedPromptText: text("proposed_prompt_text"),
  proposedTags: text("proposed_tags").array(),
  proposedUseCase: text("proposed_use_case"),
  proposedSafetyNote: text("proposed_safety_note"),
  proposedAudience: text("proposed_audience").array(),
  proposedCategory: text("proposed_category"),
  proposedIconName: text("proposed_icon_name"),
  rationale: text("rationale"),
  qualityScore: integer("quality_score"),
  aiModel: text("ai_model"),
  status: text("status").notNull().default("pending"),
  reviewRunId: varchar("review_run_id"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PromptReview = typeof promptReviews.$inferSelect;
export const insertPromptReviewSchema = createInsertSchema(promptReviews).omit({
  id: true,
  createdAt: true,
});
export type InsertPromptReview = z.infer<typeof insertPromptReviewSchema>;

// Prompt Review Runs - Tracks batch review executions
export const promptReviewRuns = pgTable("prompt_review_runs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull().default("running"),
  triggerType: text("trigger_type").notNull(),
  promptsReviewed: integer("prompts_reviewed").default(0),
  improvementsSuggested: integer("improvements_suggested").default(0),
  newPromptsSuggested: integer("new_prompts_suggested").default(0),
  summary: text("summary"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export type PromptReviewRun = typeof promptReviewRuns.$inferSelect;

// Platform Announcements
export const platformAnnouncements = pgTable("platform_announcements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull().default("update"),
  priority: text("priority").notNull().default("normal"),
  linkUrl: text("link_url"),
  linkText: text("link_text"),
  isActive: boolean("is_active").notNull().default(true),
  startsAt: timestamp("starts_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAnnouncementSchema = createInsertSchema(platformAnnouncements).omit({
  id: true,
  createdAt: true,
});

export type PlatformAnnouncement = typeof platformAnnouncements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

// Trending Threats
export const trendingThreats = pgTable("trending_threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  source: text("source").notNull(),
  category: text("category").notNull().default("scam"),
  severity: text("severity").notNull().default("high"),
  linkUrl: text("link_url"),
  regions: text("regions").array().notNull().default(sql`ARRAY['GLOBAL']::text[]`),
  audience: text("audience").notNull().default("general"),
  isActive: boolean("is_active").notNull().default(true),
  isAutoGenerated: boolean("is_auto_generated").notNull().default(false),
  displayOrder: integer("display_order").notNull().default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrendingThreatSchema = createInsertSchema(trendingThreats).omit({
  id: true,
  createdAt: true,
});

export type TrendingThreat = typeof trendingThreats.$inferSelect;
export type InsertTrendingThreat = z.infer<typeof insertTrendingThreatSchema>;

export const userFeedback = pgTable("user_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  message: text("message").notNull(),
  email: text("email"),
  page: text("page"),
  status: text("status").notNull().default("new"),
  adminNotes: text("admin_notes"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback).omit({
  id: true,
  status: true,
  adminNotes: true,
  createdAt: true,
  updatedAt: true,
});

export type UserFeedback = typeof userFeedback.$inferSelect;
export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;

// Cyber Safety Guides - Database-driven article publishing engine
export const cyberSafetyGuides = pgTable("cyber_safety_guides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: text("title").notNull(),
  metaDescription: text("meta_description").notNull(),
  content: text("content").notNull(),
  headings: jsonb("headings").$type<{ level: number; text: string; id: string }[]>().default([]),
  tableOfContents: jsonb("table_of_contents").$type<{ text: string; anchor: string; level: number }[]>().default([]),
  faq: jsonb("faq").$type<{ question: string; answer: string }[]>().default([]),
  category: text("category").notNull(),
  tags: text("tags").array().default([]),
  targetKeywords: text("target_keywords").array().default([]),
  cluster: text("cluster"),
  wordCount: integer("word_count").default(0),
  readingTimeMinutes: integer("reading_time_minutes").default(0),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  authorName: text("author_name").default("GetCyberRight Team"),
  featuredImage: text("featured_image"),
  relatedGuideIds: text("related_guide_ids").array().default([]),
  relatedScamSlugs: text("related_scam_slugs").array().default([]),
  relatedToolPaths: text("related_tool_paths").array().default([]),
  seoScore: integer("seo_score").default(0),
  generatedByAi: boolean("generated_by_ai").default(false),
  aiModel: text("ai_model"),
  lastAiReviewAt: timestamp("last_ai_review_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCyberSafetyGuideSchema = createInsertSchema(cyberSafetyGuides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  publishedAt: true,
  seoScore: true,
});

export type CyberSafetyGuide = typeof cyberSafetyGuides.$inferSelect;
export type InsertCyberSafetyGuide = z.infer<typeof insertCyberSafetyGuideSchema>;

// Scam Intelligence - Enhanced scam database for auto-generated pages
export const scamIntelligence = pgTable("scam_intelligence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  scamName: text("scam_name").notNull(),
  scamCategory: text("scam_category").notNull(),
  platformUsed: text("platform_used").array().default([]),
  targetAudience: text("target_audience").array().default([]),
  exampleMessages: jsonb("example_messages").$type<{ context: string; message: string }[]>().default([]),
  warningSigns: text("warning_signs").array().default([]),
  preventionTips: text("prevention_tips").array().default([]),
  howItWorks: jsonb("how_it_works").$type<{ step: number; title: string; description: string }[]>().default([]),
  riskLevel: text("risk_level").notNull().default("medium"),
  metaDescription: text("meta_description"),
  faq: jsonb("faq").$type<{ question: string; answer: string }[]>().default([]),
  relatedScamSlugs: text("related_scam_slugs").array().default([]),
  regions: text("regions").array().default([]),
  reportCount: integer("report_count").default(0),
  averageLoss: text("average_loss"),
  dateDetected: timestamp("date_detected").defaultNow(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  status: text("status").notNull().default("draft"),
  generatedByAi: boolean("generated_by_ai").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScamIntelligenceSchema = createInsertSchema(scamIntelligence).omit({
  id: true,
  reportCount: true,
  createdAt: true,
});

export type ScamIntelligence = typeof scamIntelligence.$inferSelect;
export type InsertScamIntelligence = z.infer<typeof insertScamIntelligenceSchema>;

// Cyber Threat Alerts - Emerging threat monitoring with alert pages
export const cyberThreatAlerts = pgTable("cyber_threat_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  threatName: text("threat_name").notNull(),
  threatCategory: text("threat_category").notNull(),
  description: text("description").notNull(),
  detailedAnalysis: text("detailed_analysis"),
  riskLevel: text("risk_level").notNull().default("medium"),
  affectedPlatforms: text("affected_platforms").array().default([]),
  indicators: jsonb("indicators").$type<{ type: string; value: string; description: string }[]>().default([]),
  mitigationSteps: text("mitigation_steps").array().default([]),
  sourceUrls: text("source_urls").array().default([]),
  cveIds: text("cve_ids").array().default([]),
  regions: text("regions").array().default([]),
  targetAudience: text("target_audience").default("general"),
  metaDescription: text("meta_description"),
  relatedAlertIds: text("related_alert_ids").array().default([]),
  relatedGuideSlugs: text("related_guide_slugs").array().default([]),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  sourceType: text("source_type"),
  generatedByAi: boolean("generated_by_ai").default(false),
  dateDetected: timestamp("date_detected").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCyberThreatAlertSchema = createInsertSchema(cyberThreatAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type CyberThreatAlert = typeof cyberThreatAlerts.$inferSelect;
export type InsertCyberThreatAlert = z.infer<typeof insertCyberThreatAlertSchema>;

// Social Distribution - Generated social media posts
export const socialPosts = pgTable("social_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentType: text("content_type").notNull(),
  contentId: varchar("content_id").notNull(),
  contentTitle: text("content_title").notNull(),
  platform: text("platform").notNull(),
  postContent: text("post_content").notNull(),
  hashtags: text("hashtags").array().default([]),
  imageUrl: text("image_url"),
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  status: text("status").notNull().default("draft"),
  publishError: text("publish_error"),
  engagementMetrics: jsonb("engagement_metrics").$type<{ views?: number; clicks?: number; shares?: number }>(),
  utmCampaign: text("utm_campaign"),
  postStyle: text("post_style"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSocialPostSchema = createInsertSchema(socialPosts).omit({
  id: true,
  publishedAt: true,
  engagementMetrics: true,
  createdAt: true,
});

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;

// Growth Orchestrator - Automation task tracking
export const growthTasks = pgTable("growth_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  taskType: text("task_type").notNull(),
  taskName: text("task_name").notNull(),
  status: text("status").notNull().default("pending"),
  priority: text("priority").notNull().default("normal"),
  payload: jsonb("payload").$type<Record<string, unknown>>(),
  result: jsonb("result").$type<Record<string, unknown>>(),
  errorMessage: text("error_message"),
  scheduledAt: timestamp("scheduled_at"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  retryCount: integer("retry_count").default(0),
  maxRetries: integer("max_retries").default(3),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGrowthTaskSchema = createInsertSchema(growthTasks).omit({
  id: true,
  result: true,
  errorMessage: true,
  startedAt: true,
  completedAt: true,
  retryCount: true,
  createdAt: true,
});

export type GrowthTask = typeof growthTasks.$inferSelect;
export type InsertGrowthTask = z.infer<typeof insertGrowthTaskSchema>;

// Platform Growth Metrics - Dashboard analytics
export const platformMetrics = pgTable("platform_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricDate: timestamp("metric_date").notNull(),
  articlesPublished: integer("articles_published").default(0),
  keywordsCovered: integer("keywords_covered").default(0),
  scamPagesGenerated: integer("scam_pages_generated").default(0),
  alertsGenerated: integer("alerts_generated").default(0),
  socialPostsCreated: integer("social_posts_created").default(0),
  subscriberCount: integer("subscriber_count").default(0),
  subscriberGrowth: integer("subscriber_growth").default(0),
  totalPageViews: integer("total_page_views").default(0),
  toolUsageCount: integer("tool_usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PlatformMetric = typeof platformMetrics.$inferSelect;

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

// Threat Intelligence Stats - Global cybercrime statistics
export const threatStats = pgTable("threat_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  statKey: varchar("stat_key", { length: 100 }).notNull().unique(),
  value: text("value").notNull(),
  label: text("label").notNull(),
  description: text("description"),
  source: text("source"),
  sourceUrl: text("source_url"),
  category: text("category"),
  colorTheme: text("color_theme"),
  displayOrder: integer("display_order").default(0),
  reportYear: integer("report_year"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertThreatStatSchema = createInsertSchema(threatStats).omit({ id: true, updatedAt: true });
export type ThreatStat = typeof threatStats.$inferSelect;
export type InsertThreatStat = z.infer<typeof insertThreatStatSchema>;

// Age Group Statistics - Cybercrime demographics breakdown
export const ageGroupStats = pgTable("age_group_stats", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  ageGroup: text("age_group").notNull(),
  percentage: integer("percentage").notNull(),
  colorClass: text("color_class"),
  displayOrder: integer("display_order").default(0),
  source: text("source"),
});

export const insertAgeGroupStatSchema = createInsertSchema(ageGroupStats).omit({ id: true });
export type AgeGroupStat = typeof ageGroupStats.$inferSelect;
export type InsertAgeGroupStat = z.infer<typeof insertAgeGroupStatSchema>;

// Regional Attack Types - Regional cybercrime patterns
export const regionalAttackTypes = pgTable("regional_attack_types", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  region: text("region").notNull(),
  attackTypes: text("attack_types").notNull(),
  colorClass: text("color_class"),
  displayOrder: integer("display_order").default(0),
  source: text("source"),
});

export const insertRegionalAttackTypeSchema = createInsertSchema(regionalAttackTypes).omit({ id: true });
export type RegionalAttackType = typeof regionalAttackTypes.$inferSelect;
export type InsertRegionalAttackType = z.infer<typeof insertRegionalAttackTypeSchema>;

export const scanHistory = pgTable("scan_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  contentSnippet: text("content_snippet").notNull(),
  contentType: text("content_type").notNull(),
  riskLevel: text("risk_level").notNull(),
  riskScore: integer("risk_score").default(0),
  resultSummary: text("result_summary"),
  flagsFound: integer("flags_found").default(0),
  sourceComponent: text("source_component"),
  sessionId: varchar("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanHistorySchema = createInsertSchema(scanHistory).omit({ id: true, createdAt: true });
export type ScanHistoryEntry = typeof scanHistory.$inferSelect;
export type InsertScanHistory = z.infer<typeof insertScanHistorySchema>;

export const communityScamReports = pgTable("community_scam_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  reportType: text("report_type").notNull(),
  url: text("url"),
  votes: integer("votes").default(1),
  status: text("status").default("pending"),
  reporterSessionId: varchar("reporter_session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCommunityScamReportSchema = createInsertSchema(communityScamReports).omit({ id: true, votes: true, status: true, createdAt: true });
export type CommunityScamReport = typeof communityScamReports.$inferSelect;
export type InsertCommunityScamReport = z.infer<typeof insertCommunityScamReportSchema>;

export const scanReports = pgTable("scan_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shareId: varchar("share_id").notNull(),
  contentSnippet: text("content_snippet").notNull(),
  contentType: text("content_type").notNull(),
  riskLevel: text("risk_level").notNull(),
  riskScore: integer("risk_score").default(0),
  resultSummary: text("result_summary"),
  flagsFound: integer("flags_found").default(0),
  flagDetails: text("flag_details"),
  aiAnalysis: text("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScanReportSchema = createInsertSchema(scanReports).omit({ id: true, createdAt: true });
export type ScanReport = typeof scanReports.$inferSelect;
export type InsertScanReport = z.infer<typeof insertScanReportSchema>;

export const scamOfWeek = pgTable("scam_of_week", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  scamType: text("scam_type").notNull(),
  tips: text("tips").notNull(),
  exampleMessage: text("example_message"),
  severity: text("severity").default("high"),
  weekStart: timestamp("week_start").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScamOfWeekSchema = createInsertSchema(scamOfWeek).omit({ id: true, createdAt: true });
export type ScamOfWeek = typeof scamOfWeek.$inferSelect;
export type InsertScamOfWeek = z.infer<typeof insertScamOfWeekSchema>;

export const siteReputation = pgTable("site_reputation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domainHash: varchar("domain_hash", { length: 64 }).notNull().unique(),
  domain: text("domain").notNull(),
  visitCount: integer("visit_count").default(0),
  flagCount: integer("flag_count").default(0),
  safeCount: integer("safe_count").default(0),
  communityScore: integer("community_score").default(50),
  lastVisited: timestamp("last_visited").defaultNow(),
  lastFlagged: timestamp("last_flagged"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type SiteReputation = typeof siteReputation.$inferSelect;

export const extensionTokens = pgTable("extension_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExtensionToken = typeof extensionTokens.$inferSelect;

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  category: text("category").notNull().default("Cybersecurity"),
  source: text("source").notNull(),
  sourceUrl: text("source_url").notNull(),
  originalTitle: text("original_title"),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  urgencyLevel: integer("urgency_level").default(1),
  relatedToolUrl: text("related_tool_url"),
  relatedToolName: text("related_tool_name"),
  author: text("author").default("Jude Annan, CISM"),
  authorRole: text("author_role").default("Managing Partner"),
  authorAvatarUrl: text("author_avatar_url"),
  tags: text("tags").array().default(sql`ARRAY[]::text[]`),
  keyTakeaways: text("key_takeaways").array().default(sql`ARRAY[]::text[]`),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export const articleComments = pgTable("article_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").notNull().references(() => newsArticles.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("approved"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertArticleCommentSchema = createInsertSchema(articleComments).omit({
  id: true,
  createdAt: true,
  status: true,
  authorName: true,
  authorEmail: true,
  userId: true,
}).extend({
  content: z.string().min(2).max(2000),
});

export type ArticleComment = typeof articleComments.$inferSelect;
export type InsertArticleComment = z.infer<typeof insertArticleCommentSchema>;

export const maskedIdentities = pgTable("masked_identities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  alias: varchar("alias", { length: 255 }).notNull().unique(),
  aliasType: varchar("alias_type", { length: 20 }).notNull(),
  realValue: text("real_value").notNull(),
  label: varchar("label", { length: 100 }),
  serviceName: varchar("service_name", { length: 200 }),
  serviceCategory: varchar("service_category", { length: 50 }),
  isActive: boolean("is_active").default(true),
  forwardingEnabled: boolean("forwarding_enabled").default(true),
  totalForwarded: integer("total_forwarded").default(0),
  totalBlocked: integer("total_blocked").default(0),
  lastActivityAt: timestamp("last_activity_at"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMaskedIdentitySchema = createInsertSchema(maskedIdentities).omit({
  id: true,
  totalForwarded: true,
  totalBlocked: true,
  lastActivityAt: true,
  createdAt: true,
  updatedAt: true,
});

export type MaskedIdentity = typeof maskedIdentities.$inferSelect;
export type InsertMaskedIdentity = z.infer<typeof insertMaskedIdentitySchema>;

export const maskedIdentityActivity = pgTable("masked_identity_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  identityId: varchar("identity_id").notNull(),
  userId: varchar("user_id").notNull(),
  eventType: varchar("event_type", { length: 30 }).notNull(),
  senderAddress: text("sender_address"),
  subject: text("subject"),
  action: varchar("action", { length: 20 }).notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type MaskedIdentityActivityEntry = typeof maskedIdentityActivity.$inferSelect;

export const notificationThreats = pgTable("notification_threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  domain: varchar("domain", { length: 255 }).notNull(),
  threatType: varchar("threat_type", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  reportCount: integer("report_count").default(1),
  sampleContent: text("sample_content"),
  firstSeenAt: timestamp("first_seen_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
});

export type NotificationThreat = typeof notificationThreats.$inferSelect;

export const engagementOpportunities = pgTable("engagement_opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  platform: text("platform").notNull(),
  sourceType: text("source_type").notNull(),
  sourceUrl: text("source_url"),
  platformSearchUrl: text("platform_search_url"),
  sourceAuthor: text("source_author"),
  sourceTitle: text("source_title").notNull(),
  sourceSnippet: text("source_snippet"),
  topic: text("topic").notNull(),
  relevanceScore: integer("relevance_score").default(0),
  suggestedComment: text("suggested_comment"),
  approvedComment: text("approved_comment"),
  status: text("status").notNull().default("discovered"),
  discoveredAt: timestamp("discovered_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  postedAt: timestamp("posted_at"),
  dismissedAt: timestamp("dismissed_at"),
  postError: text("post_error"),
});

export const insertEngagementOpportunitySchema = createInsertSchema(engagementOpportunities).omit({
  id: true,
  approvedAt: true,
  postedAt: true,
  dismissedAt: true,
});

export type EngagementOpportunity = typeof engagementOpportunities.$inferSelect;
export type InsertEngagementOpportunity = z.infer<typeof insertEngagementOpportunitySchema>;

export const securityPostureScans = pgTable("security_posture_scans", {
  id: serial("id").primaryKey(),
  overallScore: integer("overall_score").notNull(),
  grade: varchar("grade", { length: 2 }).notNull(),
  categories: jsonb("categories").notNull(),
  issues: jsonb("issues").notNull(),
  remediationsApplied: jsonb("remediations_applied"),
  checksRun: integer("checks_run").notNull(),
  checksPassed: integer("checks_passed").notNull(),
  triggerType: varchar("trigger_type", { length: 20 }).notNull().default("scheduled"),
  scannedAt: timestamp("scanned_at").defaultNow().notNull(),
});

export type SecurityPostureScan = typeof securityPostureScans.$inferSelect;
