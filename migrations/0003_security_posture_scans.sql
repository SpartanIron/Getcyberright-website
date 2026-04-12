CREATE TABLE IF NOT EXISTS "security_posture_scans" (
  "id" serial PRIMARY KEY,
  "overall_score" integer NOT NULL,
  "grade" varchar(2) NOT NULL,
  "categories" jsonb NOT NULL,
  "issues" jsonb NOT NULL,
  "remediations_applied" jsonb,
  "checks_run" integer NOT NULL,
  "checks_passed" integer NOT NULL,
  "trigger_type" varchar(20) NOT NULL DEFAULT 'scheduled',
  "scanned_at" timestamp DEFAULT now() NOT NULL
);
