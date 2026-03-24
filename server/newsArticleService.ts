import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { fetchRealThreats, type RawFeedItem } from "./trendingThreatService";
import type { InsertNewsArticle } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const CATEGORY_MAP: Record<string, string> = {
  breach: "Cybersecurity",
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
  phishing: { url: "https://www.getcyberright.com/scam-checker", name: "Scam Checker" },
  scam: { url: "https://www.getcyberright.com/scam-checker", name: "Scam Checker" },
  fraud: { url: "https://www.getcyberright.com/scam-checker", name: "Scam Checker" },
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
  familyTitle: string;
  excerpt: string;
  content: string;
}

async function simplifyFeedItems(items: RawFeedItem[]): Promise<ProcessedArticle[]> {
  const itemsText = items.map((item, i) =>
    `[${i}] TITLE: ${item.title}\nSOURCE: ${item.source}\nSUMMARY: ${item.summary.substring(0, 400)}`
  ).join("\n\n");

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4000,
      messages: [{
        role: "user",
        content: `You are a cybersecurity journalist writing for families and everyday internet users — NOT for IT professionals.

For each of the following news items, create a family-friendly article. Use simple, clear language. Explain technical terms. Focus on what this means for regular people and what they should do.

${itemsText}

For EACH item, output a JSON object with:
- "index": the item number
- "familyTitle": a clear, non-sensationalized headline that a parent or grandparent would understand (do NOT just copy the original title)
- "excerpt": 1-2 sentence summary explaining why this matters to families (max 200 chars)
- "content": 3-5 paragraph article body. Structure: What happened → Why it matters to you → What you should do now. Use simple language. No jargon.

Output a JSON array of these objects. Output ONLY the JSON array, no markdown.`
      }]
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error: any) {
    console.error("[NewsService] AI simplification failed:", error.message);
    return [];
  }
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

  const batch = newItems.slice(0, 8);
  console.log(`[NewsService] Processing ${batch.length} new articles...`);

  const simplified = await simplifyFeedItems(batch);
  let created = 0;

  for (const article of simplified) {
    const feedItem = batch[article.index];
    if (!feedItem) continue;

    const category = detectCategory(feedItem.title, feedItem.summary);
    const urgency = detectUrgency(feedItem.title, feedItem.summary);
    const relatedTool = detectRelatedTool(feedItem.title, feedItem.summary);
    const baseSlug = generateSlug(article.familyTitle || feedItem.title);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    try {
      await storage.createNewsArticle({
        title: article.familyTitle || feedItem.title,
        slug,
        excerpt: article.excerpt || feedItem.summary.substring(0, 200),
        content: article.content || null,
        category,
        source: feedItem.source,
        sourceUrl: feedItem.link,
        originalTitle: feedItem.title,
        urgencyLevel: urgency,
        relatedToolUrl: relatedTool?.url || null,
        relatedToolName: relatedTool?.name || null,
        publishedAt: feedItem.pubDate ? new Date(feedItem.pubDate) : new Date(),
      });
      created++;
    } catch (err: any) {
      if (err.message?.includes("duplicate key")) continue;
      console.error(`[NewsService] Failed to store article: ${err.message}`);
    }
  }

  console.log(`[NewsService] Created ${created} new articles`);
  return created;
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
  console.log("[NewsService] Starting news article scheduler (every 4 hours)");

  setTimeout(async () => {
    const existingCount = await storage.getNewsArticleCount();
    if (existingCount > 0) {
      console.log(`[NewsService] ${existingCount} articles already exist, skipping initial fetch`);
      return;
    }
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
  }, 4 * 60 * 60 * 1000);
}
