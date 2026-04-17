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

-- Add article_comments table (if not exists) - no FK constraint to avoid type mismatch
CREATE TABLE IF NOT EXISTS "article_comments" (
  "id" serial PRIMARY KEY,
  "article_slug" varchar(500) NOT NULL,
  "user_id" varchar(255),
  "content" text NOT NULL,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
