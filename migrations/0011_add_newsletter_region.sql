-- Add region column to newsletter_subscribers for region-tailored newsletter sends
ALTER TABLE newsletter_subscribers
  ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'US';
