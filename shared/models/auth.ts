import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
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

// Helper to check if a tier has access to a required tier
export function hasTierAccess(userTier: string, requiredTier: string): boolean {
  const userRank = TIER_HIERARCHY[userTier as SubscriptionTier] ?? 0;
  const requiredRank = TIER_HIERARCHY[requiredTier as SubscriptionTier];
  if (requiredRank === undefined) {
    // Unknown required tier - deny access for safety
    return false;
  }
  return userRank >= requiredRank;
}

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier").default("free"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  stripeCustomerId: varchar("stripe_customer_id"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
