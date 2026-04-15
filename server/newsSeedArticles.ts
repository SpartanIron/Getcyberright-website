import postgres from "postgres";

/**
 * Seeds the database with required tables and initial news articles.
 * Creates social_posts, growth_tasks, and platform_metrics tables if missing.
 * Uses the raw postgres client to bypass Drizzle ORM entirely.
 */
export async function seedNewsArticles(): Promise<number> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("[news-seed] DATABASE_URL not set. Skipping seed.");
    return 0;
  }

  const client = postgres(connectionString);

  try {
    // Ensure news_articles table exists with correct schema
    await client.unsafe(`
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
      )
    `);
    console.log("[news-seed] Ensured news_articles table exists.");

    // Ensure social_posts table exists (required by GrowthOrchestrator, ContentTier, NewsSocial)
    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS "social_posts" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "content_type" text NOT NULL,
        "content_id" varchar NOT NULL,
        "content_title" text NOT NULL,
        "platform" text NOT NULL,
        "post_content" text NOT NULL,
        "hashtags" text[] DEFAULT '{}',
        "image_url" text,
        "scheduled_at" timestamp,
        "published_at" timestamp,
        "status" text NOT NULL DEFAULT 'draft',
        "publish_error" text,
        "engagement_metrics" jsonb,
        "utm_campaign" text,
        "post_style" text,
        "created_at" timestamp DEFAULT now()
      )
    `);
    console.log("[news-seed] Ensured social_posts table exists.");

    // Ensure growth_tasks table exists (required by GrowthOrchestrator)
    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS "growth_tasks" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "task_type" text NOT NULL,
        "task_name" text NOT NULL,
        "status" text NOT NULL DEFAULT 'pending',
        "priority" text NOT NULL DEFAULT 'normal',
        "payload" jsonb,
        "result" jsonb,
        "error_message" text,
        "scheduled_at" timestamp,
        "started_at" timestamp,
        "completed_at" timestamp,
        "retry_count" integer DEFAULT 0,
        "max_retries" integer DEFAULT 3,
        "created_at" timestamp DEFAULT now()
      )
    `);
    console.log("[news-seed] Ensured growth_tasks table exists.");

    // Ensure platform_metrics table exists (required by GrowthOrchestrator dashboard)
    await client.unsafe(`
      CREATE TABLE IF NOT EXISTS "platform_metrics" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "metric_date" timestamp NOT NULL,
        "articles_published" integer DEFAULT 0,
        "keywords_covered" integer DEFAULT 0,
        "scam_pages_generated" integer DEFAULT 0,
        "alerts_generated" integer DEFAULT 0,
        "social_posts_created" integer DEFAULT 0,
        "subscriber_count" integer DEFAULT 0,
        "subscriber_growth" integer DEFAULT 0,
        "total_page_views" integer DEFAULT 0,
        "tool_usage_count" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now()
      )
    `);
    console.log("[news-seed] Ensured platform_metrics table exists.");

    const countResult = await client`SELECT COUNT(*)::int AS cnt FROM "news_articles"`;
    const count = countResult[0].cnt;
    if (count > 0) {
      console.log(`[news-seed] Already have ${count} articles. Skipping seed.`);
      await client.end();
      return 0;
    }

    console.log("[news-seed] Table is empty. Inserting seed articles...");
    const articles = getSeedArticles();
    let inserted = 0;

    for (const article of articles) {
      try {
        await client`
          INSERT INTO "news_articles" (
            "title", "slug", "excerpt", "content", "category",
            "source", "source_url", "original_title", "image_url",
            "urgency_level", "related_tool_url", "related_tool_name",
            "author", "author_role", "published_at"
          ) VALUES (
            ${article.title}, ${article.slug}, ${article.excerpt}, ${article.content}, ${article.category},
            ${article.source}, ${article.sourceUrl}, ${article.originalTitle}, ${article.imageUrl},
            ${article.urgencyLevel}, ${article.relatedToolUrl}, ${article.relatedToolName},
            ${article.author}, ${article.authorRole}, ${article.publishedAt}
          )
          ON CONFLICT ("slug") DO NOTHING
        `;
        inserted++;
        console.log(`[news-seed] Inserted: ${article.slug}`);
      } catch (err: any) {
        console.error(`[news-seed] INSERT failed for "${article.slug}": ${err.message || err}`);
        console.error("[news-seed] Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      }
    }

    console.log(`[news-seed] Seeded ${inserted} of ${articles.length} articles.`);
    await client.end();
    return inserted;
  } catch (err: any) {
    console.error(`[news-seed] Fatal error: ${err.message || err}`);
    console.error("[news-seed] Stack:", err.stack);
    try { await client.end(); } catch {}
    return 0;
  }
}

const hoursAgo = (h: number): string => new Date(Date.now() - h * 3600000).toISOString();

function getSeedArticles() {
  return [
    {
      title: "Why You Need a Password Manager (and How to Pick One)",
      slug: "why-you-need-a-password-manager",
      excerpt: "If you are reusing passwords across sites, you are one data breach away from losing access to every account you own. A password manager generates and stores strong, unique passwords for each site so you do not have to remember them.",
      content: "If you are reusing passwords across sites, you are one data breach away from losing access to every account you own. A password manager generates and stores strong, unique passwords for each site so you do not have to remember them. This article explains what password managers do, how to choose one, and how to get started in under ten minutes.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Why You Need a Password Manager (and How to Pick One)",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(4),
    },
    {
      title: "How to Spot a Phishing Email Before You Click",
      slug: "how-to-spot-phishing-email",
      excerpt: "Phishing emails are getting harder to detect. Learn the five red flags that give away even the most convincing fakes.",
      content: "Phishing emails are getting harder to detect. Learn the five red flags that give away even the most convincing fakes. This guide walks you through real examples and shows you how to verify suspicious messages before clicking any links.",
      category: "Phishing",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "How to Spot a Phishing Email Before You Click",
      imageUrl: null,
      urgencyLevel: 3,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(8),
    },
    {
      title: "Two-Factor Authentication Explained in Plain English",
      slug: "two-factor-authentication-explained",
      excerpt: "Two-factor authentication is one of the best ways to protect your accounts, and it is easier to set up than you think.",
      content: "Two-factor authentication is one of the best ways to protect your accounts, and it is easier to set up than you think. This article breaks down what 2FA is, why it matters, and how to enable it on your most important accounts.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Two-Factor Authentication Explained in Plain English",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(12),
    },
    {
      title: "Is Public Wi-Fi Actually Dangerous? What You Need to Know",
      slug: "is-public-wifi-dangerous",
      excerpt: "Coffee shop Wi-Fi might be convenient, but here is what hackers can see when you connect to an unprotected network.",
      content: "Coffee shop Wi-Fi might be convenient, but here is what hackers can see when you connect to an unprotected network. This guide explains the real risks and the simple steps you can take to stay safe.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Is Public Wi-Fi Actually Dangerous? What You Need to Know",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(16),
    },
    {
      title: "Why Software Updates Matter More Than You Think",
      slug: "why-software-updates-matter",
      excerpt: "That update notification you keep dismissing could be the one thing standing between you and a hacker.",
      content: "That update notification you keep dismissing could be the one thing standing between you and a hacker. This article explains why software updates are critical for security and how to make them automatic.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Why Software Updates Matter More Than You Think",
      imageUrl: null,
      urgencyLevel: 1,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(20),
    },
    {
      title: "I Think I Have Been Hacked: A Step-by-Step Recovery Guide",
      slug: "what-to-do-if-hacked",
      excerpt: "If you suspect your account has been compromised, do not panic. Follow these steps immediately to limit the damage and regain control.",
      content: "If you suspect your account has been compromised, do not panic. Follow these steps immediately to limit the damage and regain control. This recovery guide covers changing passwords, checking for unauthorized access, and reporting the incident.",
      category: "Data Breaches",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "I Think I Have Been Hacked: A Step-by-Step Recovery Guide",
      imageUrl: null,
      urgencyLevel: 3,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(24),
    },
    {
      title: "Social Media Privacy Settings You Should Change Today",
      slug: "social-media-privacy-settings",
      excerpt: "Your social media profiles might be sharing more than you realize. These quick changes take five minutes and drastically reduce your exposure.",
      content: "Your social media profiles might be sharing more than you realize. These quick changes take five minutes and drastically reduce your exposure. This guide covers Facebook, Instagram, TikTok, and LinkedIn privacy settings.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Social Media Privacy Settings You Should Change Today",
      imageUrl: null,
      urgencyLevel: 1,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(28),
    },
    {
      title: "Ransomware: What It Is and How Families Can Protect Themselves",
      slug: "ransomware-family-protection-guide",
      excerpt: "Ransomware locks your files and demands payment. Here is how to protect your family photos, documents, and devices from this growing threat.",
      content: "Ransomware locks your files and demands payment. Here is how to protect your family photos, documents, and devices from this growing threat. This guide covers prevention, backups, and what to do if you are hit.",
      category: "Ransomware",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Ransomware: What It Is and How Families Can Protect Themselves",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(32),
    },
  ];
}
