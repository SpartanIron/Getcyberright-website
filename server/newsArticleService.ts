import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "crypto";
import { storage } from "./storage";
import { fetchRealThreats, type RawFeedItem } from "./trendingThreatService";
import type { InsertNewsArticle, NewsArticle } from "@shared/schema";
import { generateSocialPostsForNewsBatch } from "./newsSocialEngine";
import {
  scanJargon,
  annotateInlineDefinitions,
  gateCuratedPlainEnglish,
  classifyCuratedTopic,
  fetchAndHashImage,
  generateBrandedCardSvg,
  isCuratedSource,
} from "./newsCurationGuard";

async function fetchOgImage(url: string): Promise<string | null> {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh. Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
  ];

  for (const ua of userAgents) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": ua,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Cache-Control": "no-cache",
        },
        redirect: "follow",
      });
      clearTimeout(timeout);
      if (!res.ok) continue;
      const html = await res.text();

      if (html.includes('challenge-platform') || html.includes('Just a moment')) {
        console.log(`[NewsService] Cloudflare challenge detected for: ${url}`);
        continue;
      }

      const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (ogMatch?.[1] && !ogMatch[1].includes('1x1') && !ogMatch[1].includes('pixel')) {
        return ogMatch[1].replace(/^http:\/\//i, 'https://').replace(/&amp;/g, '&');
      }

      const twitterMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
        || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
      if (twitterMatch?.[1] && !twitterMatch[1].includes('1x1')) {
        return twitterMatch[1].replace(/^http:\/\//i, 'https://').replace(/&amp;/g, '&');
      }

      const schemaMatch = html.match(/"image"\s*:\s*"(https?:\/\/[^"]+)"/i);
      if (schemaMatch?.[1] && !schemaMatch[1].includes('1x1') && !schemaMatch[1].includes('pixel') && !schemaMatch[1].includes('logo')) {
        return schemaMatch[1].replace(/^http:\/\//i, 'https://');
      }

      return null; // Page loaded but has no extractable image - no point retrying with different UA
    } catch {
      continue;
    }
  }
  return null;
}

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const CATEGORY_MAP: Record<string, string> = {
  breach: "Action Needed",
  "data leak": "Action Needed",
  "data breach": "Action Needed",
  "records exposed": "Action Needed",
  "records stolen": "Action Needed",
  "million records": "Action Needed",
  "billion records": "Action Needed",
  "zero-day": "Action Needed",
  "actively exploited": "Action Needed",
  "change your password": "Action Needed",
  "update now": "Action Needed",
  "update your": "Action Needed",
  leak: "Cybersecurity",
  hack: "Cybersecurity",
  ransomware: "Cybersecurity",
  malware: "Cybersecurity",
  phishing: "Cybersecurity",
  scam: "Cybersecurity",
  fraud: "Cybersecurity",
  vulnerability: "Cybersecurity",
  exploit: "Cybersecurity",
  attack: "Cybersecurity",
  ai: "AI",
  "artificial intelligence": "AI",
  "machine learning": "AI",
  deepfake: "AI",
  chatgpt: "AI",
  "large language": "AI",
  privacy: "Tech",
  "data protection": "Tech",
  regulation: "Tech",
  gdpr: "Tech",
  update: "Tech",
  patch: "Tech",
  apple: "Tech",
  google: "Tech",
  microsoft: "Tech",
};

const TOOL_MAPPING: Record<string, { url: string; name: string }> = {
  breach: { url: "https://www.getcyberright.com/breach-dashboard", name: "Breach Monitor" },
  leak: { url: "https://www.getcyberright.com/shield", name: "GCR Data Shield" },
  phishing: { url: "https://www.getcyberright.com/scam-checker", name: "GCR Scam Guard" },
  scam: { url: "https://www.getcyberright.com/scam-checker", name: "GCR Scam Guard" },
  fraud: { url: "https://www.getcyberright.com/scam-checker", name: "GCR Scam Guard" },
  password: { url: "https://www.getcyberright.com/password-generator", name: "Password Generator" },
  malware: { url: "https://www.getcyberright.com/cyber-threat-radar", name: "Cyber Threat Radar" },
  ransomware: { url: "https://www.getcyberright.com/cyber-threat-radar", name: "Cyber Threat Radar" },
  vulnerability: { url: "https://www.getcyberright.com/cyber-threat-radar", name: "Cyber Threat Radar" },
  child: { url: "https://www.getcyberright.com/kids", name: "Kids Safety Hub" },
  kid: { url: "https://www.getcyberright.com/kids", name: "Kids Safety Hub" },
  teen: { url: "https://www.getcyberright.com/kids", name: "Kids Safety Hub" },
  senior: { url: "https://www.getcyberright.com/seniors", name: "Senior Safety Hub" },
  elder: { url: "https://www.getcyberright.com/seniors", name: "Senior Safety Hub" },
  identity: { url: "https://www.getcyberright.com/shield", name: "GCR Data Shield" },
  data: { url: "https://www.getcyberright.com/shield", name: "GCR Data Shield" },
};

function detectCategory(title: string, summary: string): string {
  const text = (title + " " + summary).toLowerCase();
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (text.includes(keyword)) return category;
  }
  return "Cybersecurity";
}

function detectRelatedTool(title: string, summary: string): { url: string; name: string } | null {
  const text = (title + " " + summary).toLowerCase();
  for (const [keyword, tool] of Object.entries(TOOL_MAPPING)) {
    if (text.includes(keyword)) return tool;
  }
  return null;
}

function detectUrgency(title: string, summary: string): number {
  const text = (title + " " + summary).toLowerCase();
  const highUrgency = ["zero-day", "0-day", "critical", "actively exploited", "emergency", "breaking", "millions affected", "mass breach"];
  const medUrgency = ["warning", "vulnerability", "patch", "update now", "alert", "exposed", "ransomware"];

  if (highUrgency.some(kw => text.includes(kw))) return 5;
  if (medUrgency.some(kw => text.includes(kw))) return 3;
  return 1;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 200)
    .replace(/-$/, "");
}

interface ProcessedArticle {
  index: number;
  familyTitle: string;
  excerpt: string;
  content: string;
}

const BREACH_KEYWORDS = [
  "breach", "breached", "data leak", "leaked", "exposed", "stolen data",
  "hack", "hacked", "compromised", "ransomware", "records exposed",
  "personal data", "customer data", "employee data", "million records",
  "billion records", "data theft", "identity theft", "credit card",
  "social security", "passwords stolen", "credentials",
];

function isBreachArticle(title: string, summary: string): boolean {
  const text = (title + " " + summary).toLowerCase();
  return BREACH_KEYWORDS.some(kw => text.includes(kw));
}

function scoreRelevance(item: RawFeedItem): number {
  const text = (item.title + " " + item.summary).toLowerCase();
  let score = 0;

  const actionableKeywords = [
    "password", "update", "patch", "change", "enable", "disable", "check",
    "protect", "secure", "warning", "alert", "affected", "impacted",
    "stolen", "exposed", "leaked", "breach", "compromised",
  ];
  const familyKeywords = [
    "family", "parent", "child", "kid", "teen", "senior", "elder",
    "phone", "email", "social media", "app", "account", "bank",
    "identity", "personal", "consumer", "customer", "user",
    "scam", "phishing", "fraud", "trick", "fake",
  ];
  const irrelevantKeywords = [
    "stock price", "ipo", "earnings", "quarterly", "revenue",
    "hiring", "layoff", "appointed", "ceo", "board of directors",
    "geopolitical", "military", "espionage", "nation-state",
    "defi", "nft", "blockchain", "cryptocurrency mining",
    "kernel", "compiler", "api endpoint", "sdk", "devops",
    "immigration", "election", "political", "partisan",
  ];

  for (const kw of actionableKeywords) {
    if (text.includes(kw)) score += 3;
  }
  for (const kw of familyKeywords) {
    if (text.includes(kw)) score += 2;
  }
  for (const kw of irrelevantKeywords) {
    if (text.includes(kw)) score -= 5;
  }

  if (isBreachArticle(item.title, item.summary)) score += 5;

  return score;
}

function filterByRelevance(items: RawFeedItem[]): RawFeedItem[] {
  const scored = items.map(item => ({ item, score: scoreRelevance(item) }));
  scored.sort((a, b) => b.score - a.score);

  const filtered = scored.filter(s => s.score > 0);
  const dropped = scored.length - filtered.length;
  if (dropped > 0) {
    console.log(`[NewsService] Relevance filter: kept ${filtered.length}, dropped ${dropped} irrelevant articles`);
  }

  return filtered.map(s => s.item);
}

function prioritizeArticles(items: RawFeedItem[]): RawFeedItem[] {
  const actionNeeded: RawFeedItem[] = [];
  const highUrgency: RawFeedItem[] = [];
  const rest: RawFeedItem[] = [];

  for (const item of items) {
    const text = (item.title + " " + item.summary).toLowerCase();
    if (isBreachArticle(item.title, item.summary)) {
      actionNeeded.push(item);
    } else if (["zero-day", "critical", "actively exploited", "emergency"].some(kw => text.includes(kw))) {
      highUrgency.push(item);
    } else {
      rest.push(item);
    }
  }

  return [...actionNeeded, ...highUrgency, ...rest];
}

async function simplifyBatch(items: RawFeedItem[], startIndex: number): Promise<ProcessedArticle[]> {
  const itemsText = items.map((item, i) =>
    `[${startIndex + i}] TITLE: ${item.title}\nSOURCE: ${item.source}\nSUMMARY: ${item.summary.substring(0, 400)}`
  ).join("\n\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `You are a cybersecurity journalist writing for families and everyday internet users. NOT for IT professionals. Your goal is to help people understand threats AND take action.

For each of the following news items, create a family-friendly article. Focus on: Is this something families need to worry about? What should they actually DO?

${itemsText}

For EACH item, output a JSON object with:
- "index": the item number (MUST match the number in brackets)
- "familyTitle": a clear, calm headline a parent or grandparent would understand. Frame around what matters to THEM, not the attacker. Example: "Your School Records May Have Been Exposed. Here's What To Do" instead of "Hackers Breach Education Platform"
- "excerpt": 1-2 sentence summary explaining why this matters to families (max 200 chars)
- "content": 4-6 paragraph article body with this structure:
  1. What happened (1 paragraph, simple language, no jargon)
  2. Who is affected and how (1 paragraph; be specific: "If you use [service], your email and password may have been exposed")
  3. What you should do RIGHT NOW (1-2 paragraphs; give numbered, specific steps like "1. Change your password on [site] 2. Enable two-factor authentication 3. Watch for suspicious emails")
  4. How to stay protected long-term (1 paragraph - connect to broader safety habits)

WRITING RULES:
- NEVER use em dashes (\u2014), en dashes (\u2013), or double hyphens (--). Restructure sentences using periods, commas, semicolons, or colons instead. For example, write "Your data may be at risk. Here is what to do." NOT "Your data may be at risk \u2014 here is what to do."
- Use short, clear sentences. Break up long paragraphs.
- Use proper paragraph breaks between sections.
- Use numbered lists for action steps.
- Write complete sentences with proper punctuation. Every sentence must end with a period, question mark, or exclamation point.
- NEVER fabricate statistics, numbers, percentages, or data points. Zero tolerance for hallucination.
- NEVER reference old research, outdated studies, annual reports, or past-year data. Only use facts from the provided news item.
- Do NOT use filler phrases like "studies show", "research indicates", "experts say", or "according to a report". Either cite a specific fact from the source or leave it out.
- Every claim must be traceable to the provided news item. No generic authority appeals.

IMPORTANT: You MUST output exactly ${items.length} objects, one for each input item. Do not skip any.
Output a JSON array of these objects. Output ONLY the JSON array, no markdown.`
      }]
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const articles = Array.isArray(parsed) ? parsed : [];
    return articles.map(sanitizeArticle);
  } catch (error: any) {
    console.error(`[NewsService] AI batch simplification failed:`, error.message);
    return [];
  }
}

function sanitizeArticleText(text: string): string {
  return text
    .replace(/\s*[\u2014\u2013]\s*/g, ". ")
    .replace(/\s*--\s*/g, ". ")
    .replace(/\.\.\s/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function sanitizeArticle(article: ProcessedArticle): ProcessedArticle {
  // Aggregated copy keeps original wording but inlines plain-English definitions
  // for any blocked jargon (e.g. "RCE (remote takeover of a device)") on first use.
  const title = sanitizeArticleText(article.familyTitle);
  const excerpt = annotateInlineDefinitions(sanitizeArticleText(article.excerpt));
  const content = annotateInlineDefinitions(sanitizeArticleText(article.content));
  const scan = scanJargon([title, excerpt, content].join("\n"));
  if (scan.blockedTerms.length > 0) {
    console.log(`[NewsService] Inline-defined jargon: ${scan.blockedTerms.slice(0, 5).join(", ")}`);
  }
  return { ...article, familyTitle: title, excerpt, content };
}

function createFallbackArticle(item: RawFeedItem, index: number): ProcessedArticle {
  const sentences = item.summary.split(/[.!?]+/).filter(s => s.trim().length > 20);
  const content = sentences.length > 0
    ? `${item.title}\n\n${sentences.slice(0, 3).map(s => s.trim() + '.').join(' ')}\n\nStay informed and take steps to protect yourself and your family. Visit GetCyberRight for tools and guides to help you stay safe online.`
    : `${item.title}\n\nThis story is developing. Check back for updates on how this may affect you and your family.\n\nIn the meantime, make sure your passwords are strong and unique, and be cautious of any suspicious emails or messages related to this topic.`;

  return {
    index,
    familyTitle: item.title,
    excerpt: item.summary.substring(0, 200),
    content,
  };
}

async function simplifyFeedItems(items: RawFeedItem[]): Promise<ProcessedArticle[]> {
  const BATCH_SIZE = 4;
  const allResults: ProcessedArticle[] = [];

  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const chunk = items.slice(i, i + BATCH_SIZE);
    const results = await simplifyBatch(chunk, i);

    if (results.length > 0) {
      const returnedIndexes = new Set(results.map(r => r.index));
      allResults.push(...results);

      for (let j = 0; j < chunk.length; j++) {
        const expectedIndex = i + j;
        if (!returnedIndexes.has(expectedIndex)) {
          console.log(`[NewsService] AI skipped article index ${expectedIndex}, using fallback`);
          allResults.push(createFallbackArticle(chunk[j], expectedIndex));
        }
      }
    } else {
      console.log(`[NewsService] AI failed for batch starting at ${i}, using fallbacks for ${chunk.length} articles`);
      chunk.forEach((item, j) => {
        allResults.push(createFallbackArticle(item, i + j));
      });
    }

    if (i + BATCH_SIZE < items.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return allResults;
}

async function processAndStoreArticles(feedItems: RawFeedItem[]): Promise<number> {
  const newItems: RawFeedItem[] = [];

  for (const item of feedItems) {
    if (!item.link) continue;
    const existing = await storage.getNewsArticleBySourceUrl(item.link);
    if (!existing) {
      newItems.push(item);
    }
  }

  if (newItems.length === 0) {
    console.log("[NewsService] No new articles to process");
    return 0;
  }

  const relevant = filterByRelevance(newItems);
  if (relevant.length === 0) {
    console.log("[NewsService] No relevant articles after filtering");
    return 0;
  }
  const prioritized = prioritizeArticles(relevant);
  const batch = prioritized.slice(0, 15);
  const actionCount = batch.filter(b => isBreachArticle(b.title, b.summary)).length;
  console.log(`[NewsService] Processing ${batch.length} articles (${actionCount} action-needed, ${newItems.length, relevant.length} dropped by relevance filter)...`);

  const simplified = await simplifyFeedItems(batch);
  let created = 0;
  const createdArticles: NewsArticle[] = [];

  const ogImagePromises = batch.map(async (item) => {
    if (item.imageUrl) return item.imageUrl;
    return await fetchOgImage(item.link);
  });
  const ogImages = await Promise.all(ogImagePromises);

  for (const article of simplified) {
    const feedItem = batch[article.index];
    if (!feedItem) continue;

    const category = detectCategory(feedItem.title, feedItem.summary);
    const urgency = detectUrgency(feedItem.title, feedItem.summary);
    const relatedTool = detectRelatedTool(feedItem.title, feedItem.summary);
    const baseSlug = generateSlug(article.familyTitle || feedItem.title);
    const urlHash = createHash("md5").update(feedItem.link).digest("hex").slice(0, 8);
    const slug = `${baseSlug}-${urlHash}`;
    const rawImage = ogImages[article.index] || null;
    let resolvedImage = rawImage?.replace(/^http:\/\//i, "https://") || null;
    const articleType: "curated" | "aggregated" = isCuratedSource(feedItem.source)
      ? "curated"
      : "aggregated";

    // Curated pieces never reuse a publisher image. They always get a unique,
    // branded GetCyberRight card seeded by title + category. Aggregated pieces
    // keep the publisher og:image untouched.
    let imageHash: string | null = null;
    if (articleType === "curated") {
      const card = generateBrandedCardSvg(
        article.familyTitle || feedItem.title,
        category,
      );
      resolvedImage = card.dataUrl;
      imageHash = card.hash;

      // Hash collision is theoretically possible if two curated titles + category
      // produce identical text; if so, salt with the slug to keep uniqueness.
      try {
        const { db } = await import("./db");
        const { newsArticles } = await import("@shared/schema");
        const { eq } = await import("drizzle-orm");
        const dup = await db
          .select({ id: newsArticles.id })
          .from(newsArticles)
          .where(eq(newsArticles.imageHash, imageHash))
          .limit(1);
        if (dup.length > 0) {
          const salted = generateBrandedCardSvg(
            `${article.familyTitle || feedItem.title} · ${slug.slice(-8)}`,
            category,
          );
          resolvedImage = salted.dataUrl;
          imageHash = salted.hash;
        }
      } catch (err) {
        console.warn(`[NewsService] Image hash dedup check failed: ${(err as Error).message}`);
      }
    }

    const titleForStore = article.familyTitle || feedItem.title;
    const excerptForStore = article.excerpt || feedItem.summary.substring(0, 200);
    const contentForStore = article.content || null;

    // Curated pieces are gated by the no-jargon contract. If any blocked terms
    // remain after AI processing, skip publication and log for editorial review.
    if (articleType === "curated") {
      const gate = gateCuratedPlainEnglish(titleForStore, excerptForStore, contentForStore || "");
      if (!gate.ok) {
        console.warn(
          `[NewsService] Curated piece blocked by jargon gate (${gate.blockedTerms.join(", ")}): "${titleForStore.slice(0, 60)}"`,
        );
        continue;
      }
    }

    const curatedTopic =
      articleType === "curated"
        ? classifyCuratedTopic(titleForStore, excerptForStore, category)
        : null;

    try {
      const isLearning =
        category === "Learning" ||
        titleForStore.toLowerCase().includes("training") ||
        titleForStore.toLowerCase().includes("certification");
      const stored = await storage.createNewsArticle({
        title: titleForStore,
        slug,
        excerpt: excerptForStore,
        content: contentForStore,
        category,
        source: feedItem.source,
        sourceUrl: feedItem.link,
        originalTitle: feedItem.title,
        imageUrl: resolvedImage,
        thumbnailUrl: resolvedImage,
        urgencyLevel: urgency,
        relatedToolUrl: relatedTool?.url || null,
        relatedToolName: relatedTool?.name || null,
        author:
          articleType === "curated"
            ? "Jude Annan, CISM"
            : isLearning
              ? "GCR Editorial Team"
              : "Jude Annan, CISM",
        authorRole:
          articleType === "curated"
            ? "Managing Partner, GetCyberRight"
            : isLearning
              ? "Education & Awareness"
              : "Managing Partner",
        articleType,
        curatedTopic,
        imageHash,
        publishedAt: feedItem.pubDate ? new Date(feedItem.pubDate) : new Date(),
      });
      created++;
      createdArticles.push(stored);
    } catch (err: any) {
      if (err.message?.includes("duplicate key")) continue;
      console.error(`[NewsService] Failed to store article: ${err.message}`);
    }
  }

  console.log(`[NewsService] Created ${created} new articles`);

  if (createdArticles.length > 0) {
    setTimeout(async () => {
      try {
        console.log(`[NewsService] Triggering social post generation for ${createdArticles.length} new articles...`);
        const socialResult = await generateSocialPostsForNewsBatch(createdArticles);
        console.log(`[NewsService] Social generation complete: ${socialResult.totalCreated} posts from ${socialResult.articlesProcessed} articles`);
      } catch (err: any) {
        console.error(`[NewsService] Social generation failed:`, err.message);
      }
    }, 5000);
  }

  return created;
}

export async function sanitizeExistingArticles(): Promise<number> {
  const { db } = await import("./db");
  const { newsArticles } = await import("@shared/schema");
  const { eq } = await import("drizzle-orm");

  const allArticles = await db.select().from(newsArticles);
  let cleaned = 0;

  for (const article of allArticles) {
    const cleanTitle = sanitizeArticleText(article.title);
    const cleanExcerpt = sanitizeArticleText(article.excerpt);
    const cleanContent = article.content ? sanitizeArticleText(article.content) : article.content;

    if (cleanTitle !== article.title || cleanExcerpt !== article.excerpt || cleanContent !== article.content) {
      await db.update(newsArticles).set({
        title: cleanTitle,
        excerpt: cleanExcerpt,
        content: cleanContent,
      }).where(eq(newsArticles.id, article.id));
      cleaned++;
      console.log(`[NewsService] Sanitized article: "${article.title}" -> "${cleanTitle}"`);
    }
  }

  console.log(`[NewsService] Sanitized ${cleaned} of ${allArticles.length} total articles`);
  return cleaned;
}

export async function refreshNewsArticles(): Promise<number> {
  try {
    const feedItems = await fetchRealThreats();
    return await processAndStoreArticles(feedItems);
  } catch (error: any) {
    console.error("[NewsService] Refresh failed:", error.message);
    return 0;
  }
}

export function startNewsScheduler() {
  console.log("[NewsService] Starting news article scheduler (daily refresh)");

  setTimeout(async () => {
    try {
      const cleaned = await sanitizeExistingArticles();
      if (cleaned > 0) {
        console.log(`[NewsService] Startup sanitization: cleaned ${cleaned} articles`);
      }
    } catch (err: any) {
      console.error(`[NewsService] Startup sanitization failed:`, err.message);
    }

    const existingCount = await storage.getNewsArticleCount();
    if (existingCount >= 15) {
      console.log(`[NewsService] ${existingCount} articles already exist, skipping initial fetch`);
      return;
    }
    console.log(`[NewsService] Only ${existingCount} articles exist, fetching more...`);
    const count = await refreshNewsArticles();
    console.log(`[NewsService] Initial refresh: ${count} articles created`);
  }, 10000);

  setInterval(async () => {
    try {
      const count = await refreshNewsArticles();
      if (count > 0) {
        console.log(`[NewsService] Scheduled refresh: ${count} new articles`);
      }
    } catch (err: any) {
      console.error("[NewsService] Scheduled refresh error:", err.message);
    }
  }, 24 * 60 * 60 * 1000);
}
