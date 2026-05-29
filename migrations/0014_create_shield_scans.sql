-- Migration 0014: Create shield_scans table for Data Shield scan tracking
-- This table stores individual Data Shield scans run by users

CREATE TABLE IF NOT EXISTS "shield_scans" (
    "scan_id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "created_at" timestamp NOT NULL DEFAULT now(),
    "first_name" text NOT NULL,
    "last_name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text,
    "address" text,
    "city" text,
    "state" text,
    "zip" text,
    "user_id" varchar,
    "status" text NOT NULL DEFAULT 'pending',
    "results" jsonb,
    "brokers_found" integer DEFAULT 0,
    "brokers_removed" integer DEFAULT 0,
    "scan_score" integer DEFAULT 0,
    "lead_id" varchar,
    "is_subscribed" boolean DEFAULT false,
    "unsubscribed_at" timestamp,
    "next_scan_at" timestamp,
    "deleted_at" timestamp,
    "updated_at" timestamp NOT NULL DEFAULT now()
  );

-- Index for fast lookup by user_id and status
CREATE INDEX IF NOT EXISTS "shield_scans_user_id_idx" ON "shield_scans" ("user_id");
CREATE INDEX IF NOT EXISTS "shield_scans_status_idx" ON "shield_scans" ("status");
CREATE INDEX IF NOT EXISTS "shield_scans_deleted_at_idx" ON "shield_scans" ("deleted_at");
CREATE INDEX IF NOT EXISTS "shield_scans_lead_id_idx" ON "shield_scans" ("lead_id");
