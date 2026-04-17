-- Add missing columns to news_articles table
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author_avatar_url" text;
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}';
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "key_takeaways" text[] DEFAULT '{}';
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "thumbnail_url" text;
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "urgency_level" varchar(20) DEFAULT 'normal';
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "related_tool_url" text;
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "related_tool_name" varchar(255);
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author_role" varchar(255);
