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
