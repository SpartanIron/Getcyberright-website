ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author" text DEFAULT 'Jude Annan, CISM';
ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author_role" text DEFAULT 'Founder & Chief Security Strategist';
