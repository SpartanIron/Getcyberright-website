-- Migration 0015: Fix shield_scans table - add missing columns required by Drizzle ORM schema
-- Resolves 500 error on GCR Data Shield form submission (POST /api/scan)
-- The 0014 migration created shield_scans but was missing columns that shieldScanService.ts inserts into

-- Add missing consent tracking columns
ALTER TABLE "shield_scans"
  ADD COLUMN IF NOT EXISTS "exposure_score" text,
  ADD COLUMN IF NOT EXISTS "raw_results" jsonb,
  ADD COLUMN IF NOT EXISTS "consent_given" boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "consent_timestamp" timestamp,
  ADD COLUMN IF NOT EXISTS "consent_ip" text;

-- Create shield_leads table if it does not exist yet
CREATE TABLE IF NOT EXISTS "shield_leads" (
    "lead_id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "scan_id" varchar,
    "last_scan_id" varchar,
    "email" text NOT NULL,
    "alert_email" text NOT NULL,
    "next_scan_due" timestamp,
    "created_at" timestamp NOT NULL DEFAULT now(),
    "opted_in" boolean DEFAULT true
  );

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS "shield_leads_scan_id_idx" ON "shield_leads" ("scan_id");
CREATE INDEX IF NOT EXISTS "shield_leads_email_idx" ON "shield_leads" ("email");
