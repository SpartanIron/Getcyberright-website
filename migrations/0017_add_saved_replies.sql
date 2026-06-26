CREATE TABLE IF NOT EXISTS "saved_replies" (
  "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" text NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
