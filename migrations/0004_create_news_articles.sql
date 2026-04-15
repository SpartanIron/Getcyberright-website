-- Create news_articles table (was missing from initial migration)
CREATE TABLE IF NOT EXISTS "news_articles" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "slug" varchar(255) NOT NULL UNIQUE,
  "excerpt" text NOT NULL,
  "content" text,
  "category" text NOT NULL DEFAULT 'Cybersecurity',
  "source" text NOT NULL,
  "source_url" text NOT NULL,
  "original_title" text,
  "image_url" text,
  "thumbnail_url" text,
  "urgency_level" integer DEFAULT 1,
  "related_tool_url" text,
  "related_tool_name" text,
  "author" text DEFAULT 'Jude Annan, CISM',
  "author_role" text DEFAULT 'Managing Partner',
  "published_at" timestamp DEFAULT now(),
  "created_at" timestamp DEFAULT now()
);
