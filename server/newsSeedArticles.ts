import postgres from "postgres";

/**
 * Seeds the news_articles table with plain-language cybersecurity articles.
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
    // First try to create the table. If it exists, ensure all columns are present.
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

    // Fix schema: add any missing columns from earlier broken table creation
    const fixCols = [
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "excerpt" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "content" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "original_title" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "image_url" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "thumbnail_url" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "urgency_level" integer DEFAULT 1',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "related_tool_url" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "related_tool_name" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author" text',
      'ALTER TABLE "news_articles" ADD COLUMN IF NOT EXISTS "author_role" text',
    ];
    for (const ddl of fixCols) {
      try { await client.unsafe(ddl); } catch (_) {}
    }
    console.log("[news-seed] Ensured all columns exist.");

    const countResult = await client`SELECT COUNT(*)::int AS cnt FROM "news_articles"`;
    const count = countResult[0]?.cnt ?? 0;
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
            ${article.title},
            ${article.slug},
            ${article.excerpt},
            ${article.content},
            ${article.category},
            ${article.source},
            ${article.sourceUrl},
            ${article.originalTitle},
            ${article.imageUrl},
            ${article.urgencyLevel},
            ${article.relatedToolUrl},
            ${article.relatedToolName},
            ${article.author},
            ${article.authorRole},
            ${article.publishedAt}
          )
          ON CONFLICT ("slug") DO NOTHING
        `;
        inserted++;
        console.log(`[news-seed] Inserted: ${article.slug}`);
      } catch (err: any) {
        console.error(`[news-seed] INSERT failed for "${article.slug}": ${err?.message || err}`);
        console.error("[news-seed] Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
      }
    }

    console.log(`[news-seed] Seeded ${inserted} of ${articles.length} articles.`);
    await client.end();
    return inserted;
  } catch (err: any) {
    console.error(`[news-seed] Fatal error: ${err?.message || err}`);
    console.error("[news-seed] Stack:", err?.stack);
    try { await client.end(); } catch (_) {}
    return 0;
  }
}

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 3600000).toISOString();
}
function getSeedArticles() {
  return [
    {
      title: "Why You Need a Password Manager (and How to Pick One)",
      slug: "why-you-need-a-password-manager",
      excerpt: "If you are reusing passwords across sites, you are one data breach away from losing access to everything. Here is how a password manager keeps you safe.",
      content: "If you are reusing passwords across sites, you are one data breach away from losing access to everything. Here is how a password manager keeps you safe. Read the full article for practical tips and detailed guidance.",
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
      publishedAt: hoursAgo(2),
    },
    {
      title: "How to Spot a Phishing Email Before You Click",
      slug: "how-to-spot-phishing-email",
      excerpt: "Phishing emails are getting harder to detect. Learn the five red flags that give away even the most convincing fakes.",
      content: "Phishing emails are getting harder to detect. Learn the five red flags that give away even the most convincing fakes. Read the full article for practical tips and detailed guidance.",
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
      publishedAt: hoursAgo(5),
    },
    {
      title: "Two-Factor Authentication Explained in Plain English",
      slug: "two-factor-authentication-explained",
      excerpt: "Two-factor authentication is one of the best ways to protect your accounts, and it is easier to set up than you think.",
      content: "Two-factor authentication is one of the best ways to protect your accounts, and it is easier to set up than you think. Read the full article for practical tips and detailed guidance.",
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
      publishedAt: hoursAgo(8),
    },
    {
      title: "Is Public Wi-Fi Actually Dangerous? What You Need to Know",
      slug: "is-public-wifi-dangerous",
      excerpt: "Coffee shop Wi-Fi might be convenient, but here is what hackers can see when you connect to an unprotected network.",
      content: "Coffee shop Wi-Fi might be convenient, but here is what hackers can see when you connect to an unprotected network. Read the full article for practical tips and detailed guidance.",
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
      publishedAt: hoursAgo(12),
    },
    {
      title: "Why Software Updates Matter More Than You Think",
      slug: "why-software-updates-matter",
      excerpt: "That update notification you keep dismissing could be the one thing standing between you and a hacker.",
      content: "That update notification you keep dismissing could be the one thing standing between you and a hacker. Read the full article for practical tips and detailed guidance.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Why Software Updates Matter More Than You Think",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(18),
    },
    {
      title: "I Think I Have Been Hacked: A Step-by-Step Recovery Guide",
      slug: "what-to-do-if-hacked",
      excerpt: "If you suspect your account has been compromised, do not panic. Follow these steps immediately to limit the damage.",
      content: "If you suspect your account has been compromised, do not panic. Follow these steps immediately to limit the damage. Read the full article for practical tips and detailed guidance.",
      category: "Data Breaches",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "I Think I Have Been Hacked: A Step-by-Step Recovery Guide",
      imageUrl: null,
      urgencyLevel: 4,
      relatedToolUrl: "/scam-guard",
      relatedToolName: "Scam Guard",
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(24),
    },
    {
      title: "Social Media Privacy Settings You Should Change Today",
      slug: "social-media-privacy-settings",
      excerpt: "Your social media profiles might be sharing more than you realize. These quick changes take five minutes.",
      content: "Your social media profiles might be sharing more than you realize. These quick changes take five minutes. Read the full article for practical tips and detailed guidance.",
      category: "Online Safety",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Social Media Privacy Settings You Should Change Today",
      imageUrl: null,
      urgencyLevel: 2,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(30),
    },
    {
      title: "Ransomware: What It Is and How Families Can Protect Themselves",
      slug: "ransomware-family-protection-guide",
      excerpt: "Ransomware locks your files and demands payment. Here is how to protect your family photos, documents, and memories.",
      content: "Ransomware locks your files and demands payment. Here is how to protect your family photos, documents, and memories. Read the full article for practical tips and detailed guidance.",
      category: "Ransomware",
      source: "GetCyberRight Editorial",
      sourceUrl: "https://www.getcyberright.com/guides",
      originalTitle: "Ransomware: What It Is and How Families Can Protect Themselves",
      imageUrl: null,
      urgencyLevel: 3,
      relatedToolUrl: null,
      relatedToolName: null,
      author: "Jude Annan, CISM",
      authorRole: "Managing Partner",
      publishedAt: hoursAgo(36),
    },
  ];
}
