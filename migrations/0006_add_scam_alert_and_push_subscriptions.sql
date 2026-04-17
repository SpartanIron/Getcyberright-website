-- Add scam_alert_subscriptions table
CREATE TABLE IF NOT EXISTS "scam_alert_subscriptions" (
  "id" serial PRIMARY KEY,
  "email" varchar(255) NOT NULL,
  "country_code" varchar(10),
  "scam_type" varchar(100),
  "severity_min" varchar(20) DEFAULT 'medium',
  "frequency" varchar(20) DEFAULT 'daily',
  "verified" boolean DEFAULT false,
  "verify_token" varchar(255),
  "unsubscribe_token" varchar(255),
  "last_sent_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

-- Add push_subscriptions table
CREATE TABLE IF NOT EXISTS "push_subscriptions" (
  "id" serial PRIMARY KEY,
  "endpoint" text NOT NULL UNIQUE,
  "p256dh" text NOT NULL,
  "auth" text NOT NULL,
  "country_code" varchar(10),
  "created_at" timestamp DEFAULT now()
);

-- Add article_comments table matching the Drizzle schema
CREATE TABLE IF NOT EXISTS "article_comments" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "article_id" varchar NOT NULL REFERENCES "news_articles"("id") ON DELETE CASCADE,
  "user_id" varchar NOT NULL,
  "author_name" text NOT NULL,
  "author_email" text,
  "content" text NOT NULL,
  "status" varchar(20) NOT NULL DEFAULT 'approved',
  "created_at" timestamp DEFAULT now()
);
