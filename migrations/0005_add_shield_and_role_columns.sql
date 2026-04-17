-- Add missing columns to users table
-- These columns are defined in shared/models/auth.ts but were absent from the initial migration,
-- causing admin seeding and login queries to fail with "Failed query" errors.

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shield_subscription_tier" varchar DEFAULT 'free';
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shield_subscription_expires_at" timestamp;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "shield_trial_started_at" timestamp;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "role" varchar DEFAULT 'user';
