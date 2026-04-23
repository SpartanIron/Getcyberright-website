-- Migration 0013: Add extension_tokens and site_reputation tables
-- These tables support the GCR Scam Guard browser extension authentication
-- and community trust scoring features.

-- Extension authentication tokens table (used by browser extension sign-in)
CREATE TABLE IF NOT EXISTS "extension_tokens" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "token" varchar(128) NOT NULL UNIQUE,
    "expires_at" timestamp NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
  );

CREATE INDEX IF NOT EXISTS "extension_tokens_user_id_idx" ON "extension_tokens" ("user_id");
CREATE INDEX IF NOT EXISTS "extension_tokens_token_idx" ON "extension_tokens" ("token");

-- Site reputation table (used by extension community trust scoring)
CREATE TABLE IF NOT EXISTS "site_reputation" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "domain_hash" varchar(64) NOT NULL UNIQUE,
    "domain" varchar(255) NOT NULL,
    "visit_count" integer DEFAULT 0 NOT NULL,
    "flag_count" integer DEFAULT 0 NOT NULL,
    "safe_count" integer DEFAULT 0 NOT NULL,
    "community_score" integer DEFAULT 50 NOT NULL,
    "last_visited_at" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
  );

CREATE INDEX IF NOT EXISTS "site_reputation_domain_hash_idx" ON "site_reputation" ("domain_hash");
CREATE INDEX IF NOT EXISTS "site_reputation_community_score_idx" ON "site_reputation" ("community_score");

-- Add shield subscription columns to users table if not already present
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shield_subscription_tier" varchar DEFAULT 'free';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shield_subscription_expires_at" timestamp;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripe_customer_id" varchar;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "review_queue_notify_mode" varchar DEFAULT 'all';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "notify_review_queue_email" boolean DEFAULT true;
