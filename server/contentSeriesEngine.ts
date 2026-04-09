import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { enforceAndSanitize, sanitizeContent } from "./socialPostPolicy";
import { tagAllGcrLinks, ensureGcrLink } from "./utmTracking";
import type { InsertSocialPost } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

type SeriesType = "weekly_threat_brief" | "scam_of_the_week" | "family_cyber_tip" | "myth_buster";

interface SeriesConfig {
  name: string;
  frequency: "weekly";
  dayOfWeek: number;
  description: string;
}

const SERIES_CONFIGS: Record<SeriesType, SeriesConfig> = {
  weekly_threat_brief: {
    name: "Weekly Threat Brief",
    frequency: "weekly",
    dayOfWeek: 1,
    description: "Monday roundup of the top cybersecurity stories from the past week",
  },
  scam_of_the_week: {
    name: "Scam of the Week",
    frequency: "weekly",
    dayOfWeek: 3,
    description: "Wednesday deep-dive into one specific scam pattern currently targeting families",
  },
  family_cyber_tip: {
    name: "Family Cyber Tip",
    frequency: "weekly",
    dayOfWeek: 5,
    description: "Friday practical tip families can implement over the weekend",
  },
  myth_buster: {
    name: "Myth Buster Monday",
    frequency: "weekly",
    dayOfWeek: 1,
    description: "Monday myth-busting post that corrects a common cybersecurity misconception",
  },
};

function getETDayOfWeek(): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  });
  const weekday = formatter.format(new Date());
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? new Date().getDay();
}

async function hasSeriesPostThisWeek(seriesType: SeriesType): Promise<boolean> {
  try {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const contentTypeKey = `series_${seriesType}`;

    const [published, drafts] = await Promise.all([
      storage.getSocialPosts("published", 50),
      storage.getSocialPosts("draft", 50),
    ]);
    const allPosts = [...published, ...drafts];

    return allPosts.some(p => {
      if (p.contentType !== contentTypeKey) return false;
      const postTime = new Date(p.publishedAt || p.createdAt || 0).getTime();
      return postTime > oneWeekAgo;
    });
  } catch {
    return false;
  }
}

export function getTodaysSeries(): SeriesType[] {
  const dayOfWeek = getETDayOfWeek();
  return (Object.entries(SERIES_CONFIGS) as [SeriesType, SeriesConfig][])
    .filter(([, config]) => config.dayOfWeek === dayOfWeek)
    .map(([type]) => type);
}

async function gatherSeriesContext(seriesType: SeriesType): Promise<string> {
  const parts: string[] = [];

  if (seriesType === "weekly_threat_brief") {
    const alerts = await storage.getPublishedThreatAlerts(undefined, 10);
    if (alerts.length > 0) {
      parts.push("RECENT THREAT ALERTS (past week):");
      for (const a of alerts.slice(0, 7)) {
        parts.push(`- ${a.threatName} (${a.threatCategory}, ${a.riskLevel}) https://www.getcyberright.com/alerts/${a.slug}`);
      }
    }
    const posts = await storage.getSocialPosts("published", 20);
    const weekPosts = posts.filter(p => {
      if (!p.publishedAt) return false;
      return Date.now() - new Date(p.publishedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    });
    if (weekPosts.length > 0) {
      parts.push("\nTOPICS COVERED THIS WEEK:");
      for (const p of weekPosts.slice(0, 10)) {
        parts.push(`- ${p.title || p.postContent.slice(0, 60)}`);
      }
    }
  }

  if (seriesType === "scam_of_the_week") {
    const scams = await storage.getPublishedScamIntel(undefined, 5);
    if (scams.length > 0) {
      parts.push("LATEST SCAM INTELLIGENCE:");
      for (const s of scams.slice(0, 5)) {
        parts.push(`- ${s.scamName} (${s.scamCategory}) https://www.getcyberright.com/scam-intel/${s.slug}`);
      }
    }
  }

  if (seriesType === "family_cyber_tip") {
    const guides = await storage.getPublishedGuides(undefined, 10);
    if (guides.length > 0) {
      parts.push("AVAILABLE GUIDES (link to the most relevant):");
      for (const g of guides.slice(0, 8)) {
        parts.push(`- "${g.title}" (${g.category}) https://www.getcyberright.com/guides/${g.slug}`);
      }
    }
  }

  return parts.join("\n");
}

export async function generateSeriesPost(seriesType: SeriesType): Promise<{ linkedin: string; facebook: string } | null> {
  const config = SERIES_CONFIGS[seriesType];
  if (!config) return null;

  const alreadyPosted = await hasSeriesPostThisWeek(seriesType);
  if (alreadyPosted) {
    console.log(`[ContentSeries] ${config.name} already posted this week, skipping`);
    return null;
  }

  const context = await gatherSeriesContext(seriesType);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are the editorial voice of GetCyberRight, a trusted family-focused cybersecurity authority. You are CISM-certified and write with confident expertise.

SERIES: "${config.name}"
DESCRIPTION: ${config.description}

RULES:
- Write as an expert analyst, not a news aggregator
- Use first person occasionally ("In my experience...", "What concerns me about this...")
- NEVER fabricate statistics. Only reference information from the provided context
- NEVER use contractions, em dashes, markdown formatting, or hashtags on LinkedIn/Facebook
- NEVER use "stay safe out there", "game-changer", "wake-up call", or "in today's digital landscape"
- Keep LinkedIn posts under 80 words with multiple paragraph breaks
- Keep Facebook posts under 60 words
- End with a link to the most relevant GetCyberRight page
- ALL links must use https://www.getcyberright.com/...

FORMATTING:
- No ** bold **, no # headings, no bullet markers
- Multiple \\n\\n paragraph breaks required
- First 2 lines must work as a standalone hook

Respond in JSON format:
{
  "linkedin": "post content",
  "facebook": "post content",
  "title": "short title for internal tracking"
}`,
      messages: [{
        role: "user",
        content: `Create this week's "${config.name}" post.

DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

${context}

KEY PAGES (only link to these):
- Awareness Hub: https://www.getcyberright.com/awareness-hub
- Cyber Threat Radar: https://www.getcyberright.com/cyber-threat-radar
- GCR Scam Guard: https://www.getcyberright.com/scam-checker
- Kids Safety: https://www.getcyberright.com/kids
- Seniors Safety: https://www.getcyberright.com/seniors

Write the ${config.name} content now.`,
      }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    const seriesCanonicalUrl = "https://www.getcyberright.com/awareness-hub";
    const linkedin = ensureGcrLink(enforceAndSanitize(tagAllGcrLinks(parsed.linkedin, `series_${seriesType}`, "linkedin"), "linkedin"), seriesCanonicalUrl, "linkedin", `series_${seriesType}`);
    const facebook = ensureGcrLink(enforceAndSanitize(tagAllGcrLinks(parsed.facebook, `series_${seriesType}`, "facebook"), "facebook"), seriesCanonicalUrl, "facebook", `series_${seriesType}`);
    const title = sanitizeContent(parsed.title || config.name);

    const seriesId = `${seriesType}_${new Date().toISOString().slice(0, 10)}`;
    const platforms = ["linkedin", "facebook"] as const;
    for (const platform of platforms) {
      const content = platform === "linkedin" ? linkedin : facebook;
      const draft: InsertSocialPost = {
        platform,
        postContent: content,
        status: "draft",
        contentType: `series_${seriesType}`,
        contentId: seriesId,
        contentTitle: title,
      };
      await storage.createSocialPost(draft);
    }

    console.log(`[ContentSeries] Generated ${config.name}: "${title}"`);
    return { linkedin, facebook };
  } catch (error: any) {
    console.error(`[ContentSeries] Failed to generate ${config.name}:`, error.message);
    return null;
  }
}

export async function checkAndGenerateSeriesPosts(): Promise<number> {
  const todaysSeries = getTodaysSeries();
  if (todaysSeries.length === 0) return 0;

  let generated = 0;
  for (const seriesType of todaysSeries) {
    const result = await generateSeriesPost(seriesType);
    if (result) generated++;
  }

  if (generated > 0) {
    console.log(`[ContentSeries] Generated ${generated} series post(s) today`);
  }
  return generated;
}
