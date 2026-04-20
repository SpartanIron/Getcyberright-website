ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "review_queue_notify_mode" varchar DEFAULT 'all';

UPDATE "users"
SET "review_queue_notify_mode" = 'mute'
WHERE "notify_review_queue_email" = false
  AND ("review_queue_notify_mode" IS NULL OR "review_queue_notify_mode" = 'all');
