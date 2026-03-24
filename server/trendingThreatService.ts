import Anthropic from "@anthropic-ai/sdk";
import Parser from "rss-parser";
import { db } from "./db";
import { trendingThreats } from "@shared/schema";
import { eq, and, lt, sql } from "drizzle-orm";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const rssParser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "GetCyberRight/1.0 (Cybersecurity Education Platform)",
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent', { keepArray: false }],
      ['media:thumbnail', 'mediaThumbnail', { keepArray: false }],
    ],
  },
});

export interface RawFeedItem {
  title: string;
  link: string;
  summary: string;
  source: string;
  pubDate?: string;
  imageUrl?: string;
}

interface SimplifiedThreat {
  title: string;
  summary: string;
  source: string;
  category: string;
  severity: string;
  regions: string[];
  audience: string;
  linkUrl: string;
}

const TRUSTED_FEEDS = [
  {
    url: "https://www.cisa.gov/cybersecurity-advisories/all.xml",
    source: "CISA",
    fallbackUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories",
  },
  {
    url: "https://www.securityweek.com/feed/",
    source: "SecurityWeek",
    fallbackUrl: "https://www.securityweek.com/",
  },
  {
    url: "https://feeds.feedburner.com/TheHackersNews",
    source: "The Hacker News",
    fallbackUrl: "https://thehackernews.com/",
  },
  {
    url: "https://krebsonsecurity.com/feed/",
    source: "Krebs on Security",
    fallbackUrl: "https://krebsonsecurity.com/",
  },
  {
    url: "https://www.darkreading.com/rss.xml",
    source: "Dark Reading",
    fallbackUrl: "https://www.darkreading.com/",
  },
  {
    url: "https://grahamcluley.com/feed/",
    source: "Graham Cluley",
    fallbackUrl: "https://grahamcluley.com/",
  },
  {
    url: "https://therecord.media/feed",
    source: "The Record by Recorded Future",
    fallbackUrl: "https://therecord.media/",
  },
  {
    url: "https://www.wired.com/feed/category/security/latest/rss",
    source: "WIRED Security",
    fallbackUrl: "https://www.wired.com/category/security/",
  },
  {
    url: "https://techcrunch.com/category/security/feed/",
    source: "TechCrunch Security",
    fallbackUrl: "https://techcrunch.com/category/security/",
  },
  {
    url: "https://www.ncsc.gov.uk/api/1/services/v1/all-rss-feed.xml",
    source: "UK NCSC",
    fallbackUrl: "https://www.ncsc.gov.uk/",
  },
  {
    url: "https://www.europol.europa.eu/rss.xml",
    source: "Europol",
    fallbackUrl: "https://www.europol.europa.eu/media-press/newsroom/news",
  },
  {
    url: "https://arstechnica.com/tag/security/feed/",
    source: "Ars Technica Security",
    fallbackUrl: "https://arstechnica.com/tag/security/",
  },
  {
    url: "https://cyberscoop.com/feed/",
    source: "CyberScoop",
    fallbackUrl: "https://cyberscoop.com/",
  },
  {
    url: "https://www.schneier.com/feed/atom/",
    source: "Schneier on Security",
    fallbackUrl: "https://www.schneier.com/",
  },
  {
    url: "https://blog.google/threat-analysis-group/rss/",
    source: "Google Threat Analysis Group",
    fallbackUrl: "https://blog.google/threat-analysis-group/",
  },
  {
    url: "https://www.microsoft.com/en-us/security/blog/feed/",
    source: "Microsoft Security Blog",
    fallbackUrl: "https://www.microsoft.com/en-us/security/blog/",
  },
  {
    url: "https://www.bleepingcomputer.com/feed/",
    source: "BleepingComputer",
    fallbackUrl: "https://www.bleepingcomputer.com/",
  },
  {
    url: "https://databreaches.net/feed/",
    source: "DataBreaches.net",
    fallbackUrl: "https://databreaches.net/",
  },
  {
    url: "https://www.troyhunt.com/rss/",
    source: "Troy Hunt",
    fallbackUrl: "https://www.troyhunt.com/",
  },
  {
    url: "https://www.zdnet.com/topic/security/rss.xml",
    source: "ZDNet Security",
    fallbackUrl: "https://www.zdnet.com/topic/security/",
  },
];

const REGION_DEFINITIONS: Record<string, string> = {
  "US": "United States",
  "CA": "Canada",
  "GB": "United Kingdom",
  "EU": "Europe (EU member states)",
  "AU": "Australia",
  "NZ": "New Zealand",
  "AF_WEST": "West Africa (Ghana, Nigeria, Senegal, etc.)",
  "AF_EAST": "East Africa (Kenya, Tanzania, Uganda, etc.)",
  "AF_SOUTH": "Southern Africa (South Africa, Botswana, etc.)",
  "SA": "South America",
  "AS_SOUTH": "South Asia (India, Pakistan, Bangladesh, etc.)",
  "AS_SOUTHEAST": "Southeast Asia (Philippines, Indonesia, Malaysia, etc.)",
  "GLOBAL": "Global (affects all regions)",
};

const AUDIENCE_DEFINITIONS: Record<string, string> = {
  "seniors": "Older adults (60+) who may be less familiar with technology",
  "families": "Parents and caregivers protecting their households",
  "children": "Young people under 18 and their online safety",
  "general": "All internet users regardless of age or background",
};

export async function fetchRealThreats(): Promise<RawFeedItem[]> {
  const allItems: RawFeedItem[] = [];

  const feedPromises = TRUSTED_FEEDS.map(async (feed) => {
    try {
      const parsed = await rssParser.parseURL(feed.url);
      const recent = (parsed.items || []).slice(0, 3);
      return recent.map((item: any) => {
        let imageUrl: string | undefined;
        if (item.enclosure?.url && /\.(jpg|jpeg|png|webp|gif)/i.test(item.enclosure.url)) {
          imageUrl = item.enclosure.url;
        }

        if (!imageUrl && item.mediaThumbnail) {
          const thumb = item.mediaThumbnail;
          imageUrl = thumb.$?.url || thumb.url || (typeof thumb === 'string' ? thumb : undefined);
        }

        if (!imageUrl && item.mediaContent) {
          const mc = item.mediaContent;
          imageUrl = mc.$?.url || mc.url || (typeof mc === 'string' ? mc : undefined);
        }

        if (!imageUrl && item['media:content']?.['$']?.url) {
          imageUrl = item['media:content']['$'].url;
        }
        if (!imageUrl && item['media:thumbnail']?.['$']?.url) {
          imageUrl = item['media:thumbnail']['$'].url;
        }

        if (!imageUrl && item.itunes?.image) {
          imageUrl = item.itunes.image;
        }

        if (!imageUrl) {
          const contentHtml = item.content || item['content:encoded'] || item.description || '';
          const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch?.[1] && !imgMatch[1].includes('gravatar') && !imgMatch[1].includes('pixel') && !imgMatch[1].includes('1x1') && !imgMatch[1].includes('feedburner')) {
            imageUrl = imgMatch[1];
          }
        }

        if (imageUrl) {
          imageUrl = imageUrl.replace(/&amp;/g, '&').replace(/^http:\/\//i, 'https://');
        }
        return {
          title: item.title || "Untitled",
          link: item.link || feed.fallbackUrl,
          summary: (item.contentSnippet || item.content || item.title || "").substring(0, 500),
          source: feed.source,
          pubDate: item.pubDate || item.isoDate,
          imageUrl,
        };
      });
    } catch (error) {
      console.warn(`Failed to fetch RSS from ${feed.source}:`, error instanceof Error ? error.message : error);
      return [];
    }
  });

  const results = await Promise.allSettled(feedPromises);
  let successCount = 0;
  for (const result of results) {
    if (result.status === "fulfilled" && result.value.length > 0) {
      allItems.push(...result.value);
      successCount++;
    }
  }

  console.log(`Fetched ${allItems.length} items from ${successCount} feeds`);

  return allItems
    .sort((a, b) => {
      const dateA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
      const dateB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 60);
}

async function simplifyForAudience(
  feedItems: RawFeedItem[],
  existingTitles: string[]
): Promise<SimplifiedThreat[]> {
  const regionList = Object.entries(REGION_DEFINITIONS)
    .map(([code, name]) => `- ${code}: ${name}`)
    .join("\n");

  const audienceList = Object.entries(AUDIENCE_DEFINITIONS)
    .map(([code, desc]) => `- ${code}: ${desc}`)
    .join("\n");

  const existingList = existingTitles.length > 0
    ? `\nAlready displayed (do NOT duplicate or closely resemble these):\n${existingTitles.map(t => `- ${t}`).join("\n")}`
    : "";

  const feedSummary = feedItems
    .map((item, i) => `[${i}] SOURCE: ${item.source}\nTITLE: ${item.title}\nURL: ${item.link}\nSUMMARY: ${item.summary}`)
    .join("\n\n");

  const prompt = `You are a cybersecurity educator for GetCyberRight.com, a free family-focused cybersecurity education platform.

Below are REAL cybersecurity threat reports from trusted security news sources. Select the 4-6 most relevant threats that everyday people (families, seniors, children) should know about. Then rewrite each one in simple, plain language.

REAL THREAT REPORTS:
${feedSummary}

RULES:
- ONLY use threats from the reports above. Do NOT invent threats.
- Keep each threat's original source URL (linkUrl) exactly as provided - this is critical for credibility.
- Rewrite titles to be clear and understandable to non-technical people (but keep them factual).
- Write 2-3 sentence summaries in plain language with actionable advice people can follow.
- Never use em dashes. Use commas and periods instead.
- Assign appropriate regions and audiences based on who the threat affects most.
- Prioritize threats that affect everyday people over corporate/enterprise-only threats.
- Skip highly technical vulnerabilities that only affect IT professionals.
${existingList}

Available regions:
${regionList}

Available audiences:
${audienceList}

Respond with a JSON array. Each object must have:
- title: Clear, plain-language title (rewritten from the original)
- summary: 2-3 sentences in simple language with actionable advice
- source: The news source name exactly as provided (e.g. "CISA", "BleepingComputer", "The Hacker News")
- category: One of: scam, phishing, malware, fraud, data_breach, vulnerability, identity_theft
- severity: One of: low, medium, high, critical
- regions: Array of region codes this threat affects (use GLOBAL if it affects everyone)
- audience: One of: seniors, families, children, general
- linkUrl: The EXACT original URL from the report (do NOT change or fabricate URLs)
- originalIndex: The index number [N] of the source report you used

Respond ONLY with the JSON array, no other text.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 8192,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  let parsed: (SimplifiedThreat & { originalIndex?: number })[];
  try {
    const jsonText = content.text.trim().replace(/^```json?\n?/, "").replace(/\n?```$/, "");
    parsed = JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse AI response:", content.text);
    throw new Error("Failed to parse simplified threat data from AI");
  }

  const validCategories = ["scam", "phishing", "malware", "fraud", "data_breach", "vulnerability", "identity_theft"];
  const validSeverities = ["low", "medium", "high", "critical"];
  const validAudiences = ["seniors", "families", "children", "general"];
  const validRegions = Object.keys(REGION_DEFINITIONS);

  return parsed
    .filter(t =>
      t.title && t.summary && t.source &&
      validCategories.includes(t.category) &&
      validSeverities.includes(t.severity) &&
      validAudiences.includes(t.audience) &&
      Array.isArray(t.regions) && t.regions.every(r => validRegions.includes(r)) &&
      t.linkUrl && t.linkUrl.startsWith("http")
    )
    .map(t => {
      const idx = t.originalIndex;
      const originalItem = (idx !== undefined && idx >= 0 && idx < feedItems.length) ? feedItems[idx] : null;
      const verifiedUrl = originalItem ? originalItem.link : t.linkUrl;

      return {
        title: t.title.replace(/\u2014/g, ",").replace(/\u2013/g, ","),
        summary: t.summary.replace(/\u2014/g, ",").replace(/\u2013/g, ","),
        source: t.source,
        category: t.category,
        severity: t.severity,
        regions: t.regions,
        audience: t.audience,
        linkUrl: verifiedUrl,
      };
    });
}

export async function refreshTrendingThreats(): Promise<{ added: number; expired: number }> {
  const now = new Date();
  const expiredResult = await db
    .update(trendingThreats)
    .set({ isActive: false })
    .where(
      and(
        eq(trendingThreats.isActive, true),
        lt(trendingThreats.expiresAt, now)
      )
    )
    .returning();

  const expiredCount = expiredResult.length;

  const existingActive = await db
    .select({ title: trendingThreats.title })
    .from(trendingThreats)
    .where(eq(trendingThreats.isActive, true));

  const existingTitles = existingActive.map(t => t.title);

  let newThreats: SimplifiedThreat[] = [];
  try {
    console.log("Fetching real threats from trusted RSS feeds...");
    const rawItems = await fetchRealThreats();
    console.log(`Fetched ${rawItems.length} items from ${TRUSTED_FEEDS.length} feeds`);

    if (rawItems.length === 0) {
      console.warn("No items fetched from any RSS feed. Skipping refresh.");
      return { added: 0, expired: expiredCount };
    }

    newThreats = await simplifyForAudience(rawItems, existingTitles);
    console.log(`AI simplified ${newThreats.length} threats for public display`);
  } catch (error) {
    console.error("Failed to fetch/simplify trending threats:", error);
    return { added: 0, expired: expiredCount };
  }

  let addedCount = 0;
  for (const threat of newThreats) {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await db.insert(trendingThreats).values({
        title: threat.title,
        summary: threat.summary,
        source: threat.source,
        category: threat.category,
        severity: threat.severity,
        regions: threat.regions,
        audience: threat.audience,
        linkUrl: threat.linkUrl,
        isActive: true,
        isAutoGenerated: true,
        displayOrder: 0,
        expiresAt,
      });
      addedCount++;
    } catch (error) {
      console.error("Failed to insert threat:", threat.title, error);
    }
  }

  console.log(`Trending threats refresh: expired ${expiredCount}, added ${addedCount} (from real feeds)`);
  return { added: addedCount, expired: expiredCount };
}

export function startThreatRefreshScheduler() {
  console.log("Trending threat refresh scheduler started (every 6 hours) - using real RSS feeds");
  refreshTrendingThreats().catch(err =>
    console.error("Initial threat refresh failed:", err)
  );

  setInterval(() => {
    refreshTrendingThreats().catch(err =>
      console.error("Scheduled threat refresh failed:", err)
    );
  }, 6 * 60 * 60 * 1000);
}

export { REGION_DEFINITIONS, AUDIENCE_DEFINITIONS };
