import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for express-session
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Subscription tiers with hierarchy ranking
export const SUBSCRIPTION_TIERS = {
  FREE: "free",
  ESSENTIAL: "essential",
  PROFESSIONAL: "professional",
  ENTERPRISE: "enterprise",
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

// Tier hierarchy for access control (higher rank = more access)
export const TIER_HIERARCHY: Record<SubscriptionTier, number> = {
  [SUBSCRIPTION_TIERS.FREE]: 0,
  [SUBSCRIPTION_TIERS.ESSENTIAL]: 1,
  [SUBSCRIPTION_TIERS.PROFESSIONAL]: 2,
  [SUBSCRIPTION_TIERS.ENTERPRISE]: 3,
};

export const FREE_ACCESS_UNTIL = new Date("2026-10-01T00:00:00Z");

export function isFreeAccessPeriod(): boolean {
  return new Date() < FREE_ACCESS_UNTIL;
}

// Helper to check if a tier has access to a required tier
export function hasTierAccess(userTier: string, requiredTier: string): boolean {
  if (isFreeAccessPeriod()) return true;
  const userRank = TIER_HIERARCHY[userTier as SubscriptionTier] ?? 0;
  const requiredRank = TIER_HIERARCHY[requiredTier as SubscriptionTier];
  if (requiredRank === undefined) {
    return false;
  }
  return userRank >= requiredRank;
}

// User storage table with custom authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  passwordHash: text("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Email verification
  emailVerified: boolean("email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token"),
  emailVerificationExpires: timestamp("email_verification_expires"),
  
  // Password reset
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  
  // MFA (TOTP)
  mfaEnabled: boolean("mfa_enabled").default(false),
  mfaSecret: varchar("mfa_secret"),
  mfaBackupCodes: text("mfa_backup_codes"),
  
  // Account security
  failedLoginAttempts: varchar("failed_login_attempts").default("0"),
  lockedUntil: timestamp("locked_until"),
  lastLoginAt: timestamp("last_login_at"),
  lastLoginIp: varchar("last_login_ip"),
  
  // Force password change on first login
  mustChangePassword: boolean("must_change_password").default(false),
  
  // Scam Guard Subscription
  subscriptionTier: varchar("subscription_tier").default("free"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: varchar("stripe_customer_id"),
  
  // Data Shield Subscription
  shieldSubscriptionTier: varchar("shield_subscription_tier").default("free"),
  shieldSubscriptionExpiresAt: timestamp("shield_subscription_expires_at"),
  
  // GCR Data Shield trial
  shieldTrialStartedAt: timestamp("shield_trial_started_at"),
  
  // Admin
  isAdmin: boolean("is_admin").default(false),
  role: varchar("role").default("user"),

  // Admin notification preferences
  notifyReviewQueueEmail: boolean("notify_review_queue_email").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Registration schema
export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  mfaCode: z.string().optional(),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(12, "Password must be at least 12 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// MFA verification schema
export const mfaVerifySchema = z.object({
  code: z.string().length(6, "MFA code must be 6 digits"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type MfaVerifyInput = z.infer<typeof mfaVerifySchema>;

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
