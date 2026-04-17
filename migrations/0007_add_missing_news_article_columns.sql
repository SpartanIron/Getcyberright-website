-- Add missing columns to news_articles table (added by Replit agent locally)
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author_avatar_url" text;
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "tags" text[] DEFAULT '{}';
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "key_takeaways" text[] DEFAULT '{}';
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now();

-- Fix urgency_level type from integer to varchar (schema uses varchar)
ALTER TABLE "news_articles" ALTER COLUMN "urgency_level" TYPE varchar(20) USING CASE 
  WHEN "urgency_level"::text = '1' THEN 'normal'
  WHEN "urgency_level"::text = '2' THEN 'high'  
  WHEN "urgency_level"::text = '3' THEN 'critical'
  ELSE 'normal'
END;
ALTER TABLE "news_articles" ALTER COLUMN "urgency_level" SET DEFAULT 'normal';

-- Migration applied