-- Threaded replies for article comments (team replies render with a verified badge)
ALTER TABLE "article_comments" ADD COLUMN IF NOT EXISTS "parent_id" varchar;
ALTER TABLE "article_comments" ADD COLUMN IF NOT EXISTS "is_team_reply" boolean NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "idx_article_comments_parent" ON "article_comments" ("parent_id");

-- In-panel replies to user feedback and contact messages, sent by email and logged for history
CREATE TABLE IF NOT EXISTS "support_replies" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "target_type" varchar(20) NOT NULL,
  "target_id" varchar NOT NULL,
  "admin_id" varchar,
  "admin_name" text,
  "to_email" text NOT NULL,
  "subject" text NOT NULL,
  "body" text NOT NULL,
  "delivered" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "idx_support_replies_target" ON "support_replies" ("target_type", "target_id", "created_at" DESC);
