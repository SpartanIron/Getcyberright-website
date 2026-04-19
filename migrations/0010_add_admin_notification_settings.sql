ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "notify_review_queue_email" boolean DEFAULT true;

CREATE TABLE IF NOT EXISTS "admin_notification_settings" (
  "id" varchar PRIMARY KEY DEFAULT 'global',
  "slack_webhook_url" text,
  "webhook_url" text,
  "updated_at" timestamp DEFAULT now(),
  "updated_by" varchar
);
