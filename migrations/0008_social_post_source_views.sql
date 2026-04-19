-- Track public visits to /social/p/:id/sources so we can measure how
-- often readers click through to the public source-receipts panel and
-- which platforms drive the most verifiers.
CREATE TABLE IF NOT EXISTS "social_post_source_views" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "post_id" varchar NOT NULL,
  "platform" varchar(50),
  "referrer" text,
  "referrer_host" varchar(255),
  "user_agent" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_spsv_post_id" ON "social_post_source_views" ("post_id");
CREATE INDEX IF NOT EXISTS "idx_spsv_created_at" ON "social_post_source_views" ("created_at");
CREATE INDEX IF NOT EXISTS "idx_spsv_platform" ON "social_post_source_views" ("platform");
