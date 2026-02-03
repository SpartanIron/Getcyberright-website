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
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

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
