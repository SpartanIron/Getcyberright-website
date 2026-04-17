import { db } from "./db";
import { cyberSafetyGuides } from "@shared/schema";
import { eq, and, gte } from "drizzle-orm";
import { getCyberWeatherSnapshot } from "./scamIntelAggregator";

let lastRunWeek: string | null = null;

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

async function generateArticleWithClaude(snapshot: ReturnType<typeof getCyberWeatherSnapshot>): Promise<{ title: string; excerpt: string; content: string } | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.log("[cyber-weather] ANTHROPIC_API_KEY not set, using template.");
    return null;
  }
  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });
    const prompt = `You are writing a weekly "Cyber Weather Report" for GetCyberRight, a family-focused cybersecurity site. Use the snapshot below to write a 600-800 word article in plain, friendly language for non-technical families. Avoid em dashes. Include: short intro, "What's heating up this week" section listing 3-5 country movers and dominant scam types, "Stay safe" section with 4 concrete tips. End with one sentence telling readers to check the live dashboard.

Snapshot (week ${snapshot.weekStart} to ${snapshot.weekEnd}):
- Total tracked incidents: ${snapshot.totalIncidents.toLocaleString()}
- Total losses tracked: $${(snapshot.totalLossesUsd / 1_000_000_000).toFixed(1)}B
- Top country movers: ${snapshot.topMovers.map(m => `${m.country} (${m.direction === "up" ? "+" : "-"}${m.trendPercent}%)`).join(", ") || "none"}
- Dominant scam types: ${snapshot.dominantScamTypes.map(t => `${t.label} (${t.share}%)`).join(", ") || "mixed"}
- Critical countries: ${snapshot.criticalCountries.map(c => `${c.country} (${c.recentIncidents.toLocaleString()})`).join(", ") || "none"}
- New patterns: ${snapshot.newScamPatterns.join("; ") || "none"}

Return strict JSON: { "title": string, "excerpt": string (1 sentence under 200 chars), "content": string (markdown article body, no front matter) }`;
    const resp = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });
    const textBlock = resp.content.find((c: any) => c.type === "text") as any;
    const raw = textBlock?.text || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.title || !parsed.content) return null;
    return { title: parsed.title, excerpt: parsed.excerpt || "", content: parsed.content };
  } catch (e: any) {
    console.warn("[cyber-weather] Claude generation failed, using template:", e?.message);
    return null;
  }
}

function templateArticle(snapshot: ReturnType<typeof getCyberWeatherSnapshot>): { title: string; excerpt: string; content: string } {
  const movers = snapshot.topMovers.length ? snapshot.topMovers.map(m => `- ${m.country}: ${m.direction === "up" ? "+" : "-"}${m.trendPercent}%`).join("\n") : "- No notable movement this week.";
  const types = snapshot.dominantScamTypes.length ? snapshot.dominantScamTypes.map(t => `- ${t.label} (${t.share}% of reports)`).join("\n") : "- Mixed activity.";
  const newPatterns = snapshot.newScamPatterns.length ? snapshot.newScamPatterns.map(p => `- ${p}`).join("\n") : "- No newly identified patterns.";
  const title = `Cyber Weather: Week of ${snapshot.weekStart}`;
  const content = `# ${title}\n\nThis week, GetCyberRight tracked **${snapshot.totalIncidents.toLocaleString()} scam reports** across our global feed of ${snapshot.criticalCountries.length} critical countries. Here is what families need to know.\n\n## What's heating up this week\n\n**Country movers:**\n${movers}\n\n**Dominant scam types:**\n${types}\n\n**New patterns we are watching:**\n${newPatterns}\n\n## Stay safe this week\n\n1. **Verify before you trust.** Any unexpected message asking for money or personal info deserves a slow second look. Call the company back on a number you find yourself.\n2. **Talk to your family.** Share one scam from this report at dinner. Older relatives and teens both benefit from knowing what is circulating right now.\n3. **Lock down your accounts.** Turn on two-factor authentication wherever you can, and check that your important account recovery emails still work.\n4. **Report what you see.** Forwarding suspicious texts and emails to your country's reporting service helps shut these operations down faster.\n\nFor live updates and country-specific risk, visit the GetCyberRight Scam Intelligence Dashboard.`;
  const excerpt = `This week we tracked ${snapshot.totalIncidents.toLocaleString()} scam reports. ${snapshot.topMovers[0] ? `${snapshot.topMovers[0].country} is up ${snapshot.topMovers[0].trendPercent}%.` : "Activity is steady."}`;
  return { title, excerpt, content };
}

export async function generateWeeklyCyberWeather(): Promise<{ created: boolean; slug?: string; reason?: string }> {
  const snapshot = getCyberWeatherSnapshot();
  if (lastRunWeek === snapshot.weekStart) return { created: false, reason: "already-generated-this-week" };
  const slug = `cyber-weather-${snapshot.weekStart}`;
  const existing = await db.select().from(cyberSafetyGuides).where(eq(cyberSafetyGuides.slug, slug)).limit(1);
  if (existing[0]) { lastRunWeek = snapshot.weekStart; return { created: false, slug, reason: "already-exists" }; }
  const aiArticle = await generateArticleWithClaude(snapshot);
  const article = aiArticle || templateArticle(snapshot);
  try {
    const wordCount = article.content.split(/\s+/).length;
    await db.insert(cyberSafetyGuides).values({
      slug,
      title: article.title,
      metaDescription: article.excerpt || article.title,
      content: article.content,
      category: "scam-intelligence",
      tags: ["cyber-weather", "weekly-report", "scam-intelligence"],
      targetKeywords: ["cyber weather", "scam trends", "weekly scam report"],
      cluster: "scam-intelligence",
      wordCount,
      readingTimeMinutes: Math.max(3, Math.round(wordCount / 200)),
      status: "published",
      publishedAt: new Date(),
      authorName: "GetCyberRight Intelligence Team",
      generatedByAi: true,
      aiModel: "claude-haiku-4-5-20251001",
    } as any);
    lastRunWeek = snapshot.weekStart;
    console.log(`[cyber-weather] Published weekly article: ${slug}`);
    return { created: true, slug };
  } catch (e: any) {
    console.error("[cyber-weather] Failed to insert article:", e?.message);
    return { created: false, reason: e?.message };
  }
}

function nextMondayUtc8am(): Date {
  const now = new Date();
  const next = new Date(now);
  next.setUTCHours(8, 0, 0, 0);
  const day = next.getUTCDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  next.setUTCDate(now.getUTCDate() + daysUntilMonday);
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

export function startCyberWeatherScheduler(): void {
  const scheduleNext = () => {
    const next = nextMondayUtc8am();
    const delay = next.getTime() - Date.now();
    setTimeout(async () => {
      try { await generateWeeklyCyberWeather(); } catch (e: any) { console.error("[cyber-weather] scheduled run failed:", e?.message); }
      scheduleNext();
    }, delay);
    console.log(`[cyber-weather] Next weekly article scheduled for ${next.toISOString()}`);
  };
  setTimeout(() => { generateWeeklyCyberWeather().catch(() => {}); }, 10 * 60 * 1000);
  scheduleNext();
}
