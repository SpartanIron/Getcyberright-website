import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import type { NewsArticle, InsertSocialPost } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const POST_FORMATS = [
  "breaking_alert",
  "family_impact",
  "quick_stat",
  "myth_buster",
  "action_checklist",
] as const;

type PostFormat = (typeof POST_FORMATS)[number];

const FORMAT_DESCRIPTIONS: Record<PostFormat, string> = {
  breaking_alert: "Urgent news alert. Lead with the threat and immediate action. Short, punchy, creates urgency. Example: 'New iPhone hack tool leaked online. If your family uses older iPhones, here is what to do right now.'",
  family_impact: "Personal, story-driven. Paint a vivid scenario showing how this news affects a real family. Example: 'Imagine your teenager downloads what looks like a security app... but it is actually malware. That is exactly what happened this week.'",
  quick_stat: "Lead with a shocking number or statistic from the article. Make the number the hook. Example: '24.5 million dollars. That is how much one hacker stole from a crypto platform this week. Here is why it matters even if you do not own crypto.'",
  myth_buster: "Challenge a common assumption. Use 'Think you are safe because...' framing. Example: 'Think you are safe because you have antivirus? This week is FBI warning proves that is not enough. Here is the truth.'",
  action_checklist: "Practical, numbered steps. Give 3 specific things to do tonight. Example: '3 things every parent should do tonight after today is cybersecurity news: 1) Check your... 2) Update... 3) Talk to your kids about...'",
};

const AUDIENCE_TYPES = [
  "parents",
  "seniors",
  "teens",
  "families_general",
  "small_business_owners",
] as const;

type AudienceType = (typeof AUDIENCE_TYPES)[number];

const PERFORMANCE_FILE = path.join(process.cwd(), ".local", "news-social-performance.json");

interface PerformanceEntry {
  date: string;
  articleId: string;
  articleTitle: string;
  format: PostFormat;
  audience: AudienceType;
  platforms: string[];
}

function loadRecentFormats(): PostFormat[] {
  try {
    if (!fs.existsSync(PERFORMANCE_FILE)) return [];
    const data = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, "utf-8"));
    return (data.entries || [])
      .slice(-10)
      .map((e: PerformanceEntry) => e.format);
  } catch {
    return [];
  }
}

function savePerformanceEntry(entry: PerformanceEntry): void {
  try {
    const dir = path.dirname(PERFORMANCE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let data: { entries: PerformanceEntry[] } = { entries: [] };
    if (fs.existsSync(PERFORMANCE_FILE)) {
      data = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, "utf-8"));
    }
    data.entries.push(entry);
    if (data.entries.length > 100) {
      data.entries = data.entries.slice(-100);
    }
    fs.writeFileSync(PERFORMANCE_FILE, JSON.stringify(data, null, 2));
  } catch (err: any) {
    console.error("[NewsSocial] Failed to save performance:", err.message);
  }
}

function selectFormat(recentFormats: PostFormat[], articleUrgency: number): PostFormat {
  const formatCounts: Record<PostFormat, number> = {
    breaking_alert: 0,
    family_impact: 0,
    quick_stat: 0,
    myth_buster: 0,
    action_checklist: 0,
  };

  for (const f of recentFormats) {
    if (formatCounts[f] !== undefined) formatCounts[f]++;
  }

  const lastTwo = recentFormats.slice(-2);

  let candidates: PostFormat[];
  if (articleUrgency >= 4) {
    const urgencyFormats: PostFormat[] = ["breaking_alert", "action_checklist"];
    candidates = urgencyFormats.filter((f) => !lastTwo.includes(f));
    if (candidates.length === 0) candidates = urgencyFormats;
  } else {
    candidates = POST_FORMATS.filter((f) => !lastTwo.includes(f));
    if (candidates.length === 0) candidates = [...POST_FORMATS];
  }

  candidates.sort((a, b) => formatCounts[a] - formatCounts[b]);
  const leastUsedCount = formatCounts[candidates[0]];
  const leastUsed = candidates.filter((c) => formatCounts[c] === leastUsedCount);

  return leastUsed[Math.floor(Math.random() * leastUsed.length)];
}

const TRUSTED_IMAGE_DOMAINS = [
  "krebsonsecurity.com", "bleepingcomputer.com", "thehackernews.com",
  "darkreading.com", "securityweek.com", "wired.com", "arstechnica.com",
  "techcrunch.com", "zdnet.com", "therecord.media", "cyberscoop.com",
  "cisa.gov", "us-cert.gov", "nist.gov", "schneier.com",
  "crowdstrike.com", "sophos.com", "microsoft.com", "google.com",
  "apple.com", "amazon.com", "meta.com", "paloaltonetworks.com",
  "trendmicro.com", "checkpoint.com", "sentinelone.com",
  "wp.com", "wordpress.com", "medium.com", "substack.com",
  "cloudflare-ipfs.com", "cloudflare.com", "cdn.arstechnica.net",
  "media.wired.com", "img.thedailybeast.com",
  "static01.nyt.com", "ichef.bbci.co.uk", "s.yimg.com",
  "images.unsplash.com", "cdn.theatlantic.com",
];

function isImageUrlTrusted(url: string): boolean {
  if (!url || !url.startsWith("https://")) return false;
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return TRUSTED_IMAGE_DOMAINS.some((domain) =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

function detectAudience(title: string, content: string): AudienceType {
  const text = `${title} ${content}`.toLowerCase();

  if (/\b(senior|elderly|medicare|retirement|aarp|older adult|grandparent)\b/.test(text)) return "seniors";
  if (/\b(teen|teenager|tiktok|snapchat|roblox|fortnite|school|student|young people|youth)\b/.test(text)) return "teens";
  if (/\b(parent|child|kid|family|school|homework|parental control)\b/.test(text)) return "parents";
  if (/\b(small business|startup|employee|workplace|corporate|company)\b/.test(text)) return "small_business_owners";
  return "families_general";
}

function sanitizePostContent(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, ", ")
    .replace(/—/g, ", ")
    .replace(/–/g, ", ")
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/ ,/g, ",")
    .trim();
}

interface GeneratedNewsPosts {
  linkedin: string;
  facebook: string;
  hashtags: string[];
}

async function generateNewsPostContent(
  article: NewsArticle,
  format: PostFormat,
  audience: AudienceType
): Promise<GeneratedNewsPosts | null> {
  const articleUrl = `https://www.getcyberright.com/news/${article.slug}`;

  const audienceInstructions: Record<AudienceType, string> = {
    parents: "Write specifically for parents of children and teenagers. Reference situations like kids using devices, family WiFi, school apps, and online gaming. Use 'your child' and 'your family' language.",
    seniors: "Write specifically for older adults and their caregivers. Reference situations like phone scams, Medicare fraud, online banking, and email. Use warm, respectful language. Avoid assuming low tech literacy.",
    teens: "Write in a way that resonates with teenagers without being condescending. Reference social media, gaming, apps, and online privacy. Be direct and honest, not preachy.",
    families_general: "Write for a general family audience. Mix references that resonate across ages. Focus on household digital safety, shared devices, and everyday online activities.",
    small_business_owners: "Write for people running small businesses or side hustles. Reference customer data, payment systems, email security, and employee training. Keep it practical and cost-conscious.",
  };

  const relatedToolCta = article.relatedToolName && article.relatedToolUrl
    ? `\n\nIMPORTANT: This article has a related GetCyberRight tool called "${article.relatedToolName}" at https://www.getcyberright.com${article.relatedToolUrl}. Naturally mention this tool as a helpful resource ONCE in the post where it fits organically. Do NOT make it feel like an ad.`
    : "";

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are the social media voice for GetCyberRight, a family-focused cybersecurity education platform. You are creating a social media post about a cybersecurity news article that was curated and simplified for families.

POST FORMAT: ${format.toUpperCase()}
${FORMAT_DESCRIPTIONS[format]}

TARGET AUDIENCE: ${audience.replace(/_/g, " ")}
${audienceInstructions[audience]}

ABSOLUTE RULES:
- NEVER fabricate statistics, numbers, percentages, dollar amounts, or data points
- NEVER invent incidents, breaches, or events that are not in the provided article
- ONLY state facts from the provided source material
- Every post MUST end with the article link on its own line
- NEVER use markdown formatting (no ** bold **, no * italics *, no ## headings, no bullet markers)
- NEVER use em dashes. Use commas, periods, colons, or semicolons instead
- Use numbered lists (1. 2. 3.) when listing steps, but never markdown bullet points
- Use line breaks and short paragraphs, not markdown symbols
- Use emojis sparingly and purposefully (1-3 per post maximum)
- The link to the article MUST be ${articleUrl} exactly

VOICE:
- Sound like a cybersecurity expert who explains complex topics simply
- Professional, knowledgeable, approachable
- Empowering, never condescending
- Every sentence clear enough for a non-technical person on first read
- Write like helping a friend, not corporate marketing`,
      messages: [{
        role: "user",
        content: `Create social media posts for this cybersecurity news article:

ARTICLE TITLE: ${article.title}
ORIGINAL SOURCE: ${article.source}
ARTICLE EXCERPT: ${article.excerpt}
FULL ARTICLE CONTENT: ${article.content || article.excerpt}
CATEGORY: ${article.category}
URGENCY LEVEL: ${article.urgencyLevel || 1}/5
ARTICLE LINK: ${articleUrl}
${relatedToolCta}

Generate posts in this EXACT JSON format (output ONLY the JSON, no markdown code blocks):
{
  "linkedin": "LinkedIn post (150-250 words). ${format === "action_checklist" ? "Use numbered steps." : format === "quick_stat" ? "Lead with the most striking number." : format === "myth_buster" ? "Start with Think you are safe because..." : format === "family_impact" ? "Start with Imagine..." : "Start with the most urgent fact."} End with the article link on its own line.",
  "facebook": "Facebook post (80-150 words). Same format style but shorter, warmer, more conversational. End with the article link on its own line.",
  "hashtags": ["CyberSecurity", "FamilySafety", "3-5 more relevant hashtags"]
}`
      }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const cleaned = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      linkedin: sanitizePostContent(parsed.linkedin || ""),
      facebook: sanitizePostContent(parsed.facebook || ""),
      hashtags: parsed.hashtags || ["CyberSecurity", "OnlineSafety", "FamilySafety"],
    };
  } catch (error: any) {
    console.error(`[NewsSocial] AI generation failed for "${article.title}":`, error.message);
    return null;
  }
}

function validateAndFixLinks(content: string, expectedUrl: string): string {
  let fixed = content;

  fixed = fixed.replace(/getcyberright\.com/g, "www.getcyberright.com");
  fixed = fixed.replace(/http:\/\/www\.getcyberright\.com/g, "https://www.getcyberright.com");

  if (!fixed.includes(expectedUrl)) {
    fixed = fixed.replace(
      /https:\/\/www\.getcyberright\.com\/news\/[^\s)]+/g,
      expectedUrl
    );
  }

  if (!fixed.includes(expectedUrl)) {
    fixed += `\n\n${expectedUrl}`;
  }

  return fixed;
}

export async function generateSocialPostsForArticle(
  article: NewsArticle
): Promise<{ created: number; format: PostFormat; platforms: string[] }> {
  const result = { created: 0, format: "breaking_alert" as PostFormat, platforms: [] as string[] };

  try {
    const existingPosts = await storage.getSocialPostsByContentId("news_article", article.id);
    if (existingPosts.length > 0) {
      console.log(`[NewsSocial] Already generated posts for article: "${article.title}"`);
      return result;
    }

    const recentFormats = loadRecentFormats();
    const format = selectFormat(recentFormats, article.urgencyLevel || 1);
    result.format = format;

    const audience = detectAudience(article.title, article.content || article.excerpt);
    const articleUrl = `https://www.getcyberright.com/news/${article.slug}`;

    console.log(`[NewsSocial] Generating ${format} post for "${article.title}" (audience: ${audience})`);

    const posts = await generateNewsPostContent(article, format, audience);
    if (!posts) return result;

    const rawImageUrl = article.thumbnailUrl || article.imageUrl || null;
    const imageUrl = rawImageUrl && isImageUrlTrusted(rawImageUrl) ? rawImageUrl : null;
    if (rawImageUrl && !imageUrl) {
      console.log(`[NewsSocial] Skipping untrusted image domain for "${article.title}": ${rawImageUrl}`);
    }

    const platformPosts: { platform: string; content: string }[] = [
      { platform: "linkedin", content: validateAndFixLinks(posts.linkedin, articleUrl) },
      { platform: "facebook", content: validateAndFixLinks(posts.facebook, articleUrl) },
    ];

    for (const { platform, content } of platformPosts) {
      if (!content || content.length < 50) continue;

      const socialPost: InsertSocialPost = {
        contentType: "news_article",
        contentId: article.id,
        contentTitle: article.title,
        platform,
        postContent: content,
        hashtags: posts.hashtags,
        imageUrl: imageUrl || undefined,
        status: "draft",
      };

      await storage.createSocialPost(socialPost);
      result.created++;
      result.platforms.push(platform);
    }

    savePerformanceEntry({
      date: new Date().toISOString(),
      articleId: article.id,
      articleTitle: article.title,
      format,
      audience,
      platforms: result.platforms,
    });

    console.log(`[NewsSocial] Created ${result.created} ${format} posts for "${article.title}" (${result.platforms.join(", ")})`);
  } catch (error: any) {
    console.error(`[NewsSocial] Failed to generate posts for "${article.title}":`, error.message);
  }

  return result;
}

export async function generateSocialPostsForNewsBatch(
  articles: NewsArticle[]
): Promise<{ totalCreated: number; articlesProcessed: number; formats: PostFormat[] }> {
  const result = { totalCreated: 0, articlesProcessed: 0, formats: [] as PostFormat[] };

  if (articles.length === 0) return result;

  console.log(`[NewsSocial] Processing batch of ${articles.length} articles for social distribution`);

  const sortedArticles = [...articles].sort(
    (a, b) => (b.urgencyLevel || 1) - (a.urgencyLevel || 1)
  );

  const maxPostsPerBatch = 4;
  const toProcess = sortedArticles.slice(0, maxPostsPerBatch);

  for (const article of toProcess) {
    const postResult = await generateSocialPostsForArticle(article);
    result.totalCreated += postResult.created;
    if (postResult.created > 0) {
      result.articlesProcessed++;
      result.formats.push(postResult.format);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(
    `[NewsSocial] Batch complete: ${result.totalCreated} posts from ${result.articlesProcessed}/${toProcess.length} articles | Formats: ${result.formats.join(", ")}`
  );

  return result;
}

export async function getNewsSocialStats(): Promise<{
  totalNewsPostsCreated: number;
  totalPublished: number;
  formatDistribution: Record<string, number>;
  recentEntries: PerformanceEntry[];
}> {
  const allPosts = await storage.getSocialPosts(undefined, 500);
  const newsPosts = allPosts.filter((p) => p.contentType === "news_article");
  const published = newsPosts.filter((p) => p.status === "published");

  let entries: PerformanceEntry[] = [];
  try {
    if (fs.existsSync(PERFORMANCE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PERFORMANCE_FILE, "utf-8"));
      entries = data.entries || [];
    }
  } catch {}

  const formatDistribution: Record<string, number> = {};
  for (const entry of entries) {
    formatDistribution[entry.format] = (formatDistribution[entry.format] || 0) + 1;
  }

  return {
    totalNewsPostsCreated: newsPosts.length,
    totalPublished: published.length,
    formatDistribution,
    recentEntries: entries.slice(-10),
  };
}
