import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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
