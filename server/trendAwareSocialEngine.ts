import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { fetchRealThreats, type RawFeedItem } from "./trendingThreatService";
import { createBufferPost, getBufferChannelsByPlatform, getPublicImageUrl } from "./bufferPublisher";
import type { InsertSocialPost } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

const CONTENT_MIX = [
  "trending_threat_reaction",
  "educational_deep_dive",
  "timely_safety_tip",
  "myth_buster",
  "real_world_case_study",
] as const;

type ContentAngle = (typeof CONTENT_MIX)[number];

function getTodaysContentAngle(): ContentAngle {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return CONTENT_MIX[dayOfYear % CONTENT_MIX.length];
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

interface TrendAwarePostResult {
  linkedin: string;
  facebook: string;
  title: string;
  hashtags: string[];
  imagePrompt: string;
}

async function generateTrendAwarePost(
  trendingNews: RawFeedItem[],
  relevantGuides: { title: string; slug: string; category: string; tags: string[] }[],
  recentlyPublishedTitles: string[],
  contentAngle: ContentAngle
): Promise<TrendAwarePostResult | null> {
  const newsContext = trendingNews
    .slice(0, 8)
    .map(
      (item, i) =>
        `[${i + 1}] ${item.source}: "${item.title}"\n   ${item.summary}\n   Published: ${item.pubDate || "recent"}`
    )
    .join("\n\n");

  const guideContext = relevantGuides
    .slice(0, 10)
    .map((g) => `- "${g.title}" (${g.category}) https://www.getcyberright.com/guides/${g.slug}`)
    .join("\n");

  const recentPostsContext =
    recentlyPublishedTitles.length > 0
      ? `\nPOSTS PUBLISHED IN THE LAST 7 DAYS (do NOT repeat these topics):\n${recentlyPublishedTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const angleInstructions: Record<ContentAngle, string> = {
    trending_threat_reaction: `ANGLE: React to the most impactful news story from the feed below. Only state facts that appear in the provided news items. Explain what happened, why it matters to families, and what people should do right now.`,
    educational_deep_dive: `ANGLE: Pick a topic from the news feed below and teach the underlying concept. Use the news as the hook, then deliver educational value. Only reference facts, numbers, and details that appear in the provided news items or are widely established public knowledge.`,
    timely_safety_tip: `ANGLE: Share a specific, immediately actionable safety tip connected to one of the news stories below. Frame it as "With [specific news event from feed] in the news, here is something you should do today..." Only cite facts from the feed.`,
    myth_buster: `ANGLE: Bust a common cybersecurity myth that is relevant to one of the news stories below. Only use facts from the provided feed or widely established public knowledge. Do not invent statistics.`,
    real_world_case_study: `ANGLE: Walk through how one of the real threats from the news feed below could affect an everyday family. Stick strictly to the facts in the feed. Describe what the threat does, who it targets, and exactly what steps people should take based on the provided details.`,
  };

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 3000,
      system: `You are the editorial voice of GetCyberRight, a trusted family-focused cybersecurity education platform.

ABSOLUTE RULES:
- NEVER fabricate statistics, numbers, percentages, dollar amounts, or data points
- NEVER invent incidents, breaches, or events that are not in the provided news feed
- ONLY state facts that appear in the news feed provided to you, or that are widely established public knowledge (e.g. "use strong passwords", "enable two-factor authentication")
- If you are unsure whether something is factual, do not include it
- When referencing a news story, attribute it to the source (e.g. "according to CISA", "as reported by Krebs on Security")
- You may reference hot topics, trending events, and current affairs, but only based on what is in the news feed

Content philosophy:
- Demonstrate DEPTH OF KNOWLEDGE through intelligent analysis, not invented data
- Connect real current events to practical family safety
- Show you are monitoring threats in real-time and translating them for everyday people
- Mix urgency with empowerment (never fear-mongering)
- Write like a knowledgeable friend who happens to be a cybersecurity expert

Formatting rules (STRICT):
- NEVER use markdown formatting. No ** bold **, no * italics *, no ## headings, no bullet markers
- NEVER use em dashes. Use commas, periods, colons, or semicolons instead
- Use proper sentence structure with correct grammar and punctuation throughout
- Use BLANK LINES (\\n\\n) between paragraphs to create visual breathing room
- Keep paragraphs to 2-3 sentences MAX. Break up long blocks of text
- Put each numbered step on its OWN line with a blank line before the list
- The post should have clear visual sections: hook, context, actionable tips, closing
- NEVER write a wall of text. White space is critical for readability on social media

Your voice:
- Professional, knowledgeable, and approachable
- Sound like a cybersecurity expert who knows how to explain complex topics simply
- No jargon. If a technical term is necessary, immediately explain what it means in plain language
- Use emojis sparingly (1-3 per post, only where they add clarity)
- Speak directly to families, parents, seniors, and everyday internet users
- Every sentence should be clear enough that a non-technical person understands it on the first read

Brand integrity signals:
- Reference GetCyberRight's free tools and guides naturally (not as ads)
- Show awareness of the broader cybersecurity landscape
- Demonstrate that you care about people, not clicks
- Your credibility depends on accuracy. Never guess.`,
      messages: [
        {
          role: "user",
          content: `Create today's social media posts for GetCyberRight.

TODAY'S DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

${angleInstructions[contentAngle]}

CURRENT CYBERSECURITY NEWS (from trusted sources, published in the last 24-48 hours):
${newsContext}

GETCYBERRIGHT GUIDES YOU CAN REFERENCE (link to these when relevant):
${guideContext}
${recentPostsContext}

IMPORTANT: Every claim, fact, and reference in your posts MUST come directly from the news feed above or be widely established public knowledge. Do not invent any statistics or incidents.

Create posts for TWO platforms:

1. LINKEDIN POST (150-250 words, NOT more):
- Open with a 1-2 sentence hook tied to a specific story from the news feed
- Leave a BLANK LINE after the hook
- 1-2 short paragraphs of context/analysis (2-3 sentences each, separated by blank lines)
- Then a blank line before actionable tips
- Number each tip on its OWN line (1. tip one\\n2. tip two\\n3. tip three)
- Leave a blank line after the tips
- End with a 1-sentence question or call to action
- Reference a relevant GetCyberRight guide link when one fits
- Professional but approachable tone
- STRICT: Keep it under 250 words. Shorter posts get more engagement

2. FACEBOOK POST (80-150 words, NOT more):
- Start with a 1-sentence hook about real-world impact
- Leave blank lines between paragraphs
- 2-3 practical tips, each on its own line
- End with a question that invites engagement
- Conversational and warm
- STRICT: Keep it under 150 words

Also provide:
- A short, compelling TITLE (under 80 chars) for internal tracking
- 6-8 relevant HASHTAGS
- An IMAGE_PROMPT: A detailed visual description for AI image generation to create an eye-catching social media graphic. The image should be conceptual and relevant to the post topic. Describe a clean, professional cybersecurity-themed illustration. Include colors (dark teal #0A2A3C, orange #E8732A accents), mood, and visual elements. NO text in the image. Think abstract/conceptual visuals: shields, locks, networks, digital elements, families, devices. The image should work at 1200x630 for social sharing.

Format as JSON. Use \\n for line breaks within post text to preserve formatting:
{
  "linkedin": "Hook line here.\\n\\nContext paragraph here.\\n\\nWhat you can do right now:\\n\\n1. First tip\\n2. Second tip\\n3. Third tip\\n\\nClosing question?",
  "facebook": "Hook here.\\n\\nTips:\\n1. First tip\\n2. Second tip\\n\\nClosing question?",
  "title": "Short tracking title",
  "hashtags": ["hashtag1", "hashtag2"],
  "imagePrompt": "Detailed image generation prompt here"
}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return null;

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[TrendEngine] No JSON found in AI response");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.linkedin || !parsed.facebook || !parsed.title) {
      console.error("[TrendEngine] Missing required fields in AI response");
      return null;
    }

    return {
      linkedin: sanitizePostContent(parsed.linkedin),
      facebook: sanitizePostContent(parsed.facebook),
      title: sanitizePostContent(parsed.title),
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      imagePrompt: parsed.imagePrompt || "",
    };
  } catch (error: any) {
    console.error("[TrendEngine] AI generation failed:", error.message);
    return null;
  }
}

const SOCIAL_IMAGES_DIR = path.join(process.cwd(), ".local", "social-images");

function ensureSocialImagesDir(): void {
  if (!fs.existsSync(SOCIAL_IMAGES_DIR)) {
    fs.mkdirSync(SOCIAL_IMAGES_DIR, { recursive: true });
  }
}

async function generatePostImage(
  title: string,
  imagePrompt: string
): Promise<string | null> {
  try {
    ensureSocialImagesDir();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `trend-${slug}-${Date.now()}.png`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);

    const sharp = (await import("sharp")).default;

    const topicIcons: Record<string, string> = {
      phishing: "M12 2L2 7v10l10 5 10-5V7L12 2z",
      ransomware: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z",
      malware: "M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-2 .9-2 2v3.8h1.5c1.52 0 2.75 1.23 2.75 2.75S5.02 16.3 3.5 16.3H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.52 1.23-2.75 2.75-2.75s2.75 1.23 2.75 2.75V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z",
      privacy: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
      scam: "M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z",
      default: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z",
    };

    const promptLower = (imagePrompt + " " + title).toLowerCase();
    let iconPath = topicIcons.default;
    for (const [key, val] of Object.entries(topicIcons)) {
      if (key !== "default" && promptLower.includes(key)) {
        iconPath = val;
        break;
      }
    }

    const accentColors = ["#E8732A", "#4ECDC4", "#FF6B6B", "#45B7D1", "#96CEB4"];
    const accent = accentColors[Date.now() % accentColors.length];

    const displayTitle = title.length > 60 ? title.slice(0, 57) + "..." : title;
    const words = displayTitle.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + " " + word).trim().length > 28) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = currentLine ? currentLine + " " + word : word;
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    const titleY = 280;
    const titleSvg = lines
      .map((line, i) => `<text x="80" y="${titleY + i * 52}" font-family="Arial,Helvetica,sans-serif" font-size="42" font-weight="bold" fill="white">${escapeXml(line)}</text>`)
      .join("\n");

    const circleElements = Array.from({ length: 12 }, (_, i) => {
      const cx = 200 + Math.cos(i * 0.52) * (400 + i * 30);
      const cy = 150 + Math.sin(i * 0.73) * (200 + i * 20);
      const r = 3 + (i % 5) * 2;
      const opacity = 0.08 + (i % 4) * 0.04;
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" opacity="${opacity}"/>`;
    }).join("\n");

    const lineElements = Array.from({ length: 6 }, (_, i) => {
      const x1 = 800 + i * 60;
      const y1 = 50 + i * 80;
      const x2 = x1 + 120;
      const y2 = y1 + 60;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${accent}" stroke-width="1" opacity="0.1"/>`;
    }).join("\n");

    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A2A3C"/>
      <stop offset="50%" stop-color="#0D3347"/>
      <stop offset="100%" stop-color="#071A24"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${accent}"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0.6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${circleElements}
  ${lineElements}
  <rect x="0" y="0" width="6" height="630" fill="url(#accentGrad)"/>
  <g transform="translate(80, 80) scale(3)">
    <path d="${iconPath}" fill="${accent}" opacity="0.9"/>
  </g>
  ${titleSvg}
  <text x="80" y="${titleY + lines.length * 52 + 40}" font-family="Arial,Helvetica,sans-serif" font-size="20" fill="#8AB4C7">getcyberright.com</text>
  <rect x="80" y="${titleY + lines.length * 52 + 60}" width="120" height="3" rx="1.5" fill="${accent}"/>
  <rect x="0" y="624" width="1200" height="6" fill="${accent}" opacity="0.8"/>
</svg>`;

    await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log(`[TrendEngine] Generated post image: ${filename}`);
    return outputPath;
  } catch (error: any) {
    console.error("[TrendEngine] Image generation failed:", error.message);
    return null;
  }
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateAndPublishTrendAwarePosts(): Promise<{
  published: number;
  platforms: string[];
}> {
  const result = { published: 0, platforms: [] as string[] };

  try {
    const channels = await getBufferChannelsByPlatform();
    const connectedPlatforms = Object.keys(channels);
    if (connectedPlatforms.length === 0) {
      console.log("[TrendEngine] No Buffer channels connected, skipping");
      return result;
    }

    const contentAngle = getTodaysContentAngle();
    console.log(`[TrendEngine] Today's content angle: ${contentAngle}`);

    const [trendingNews, guides, recentPosts] = await Promise.all([
      fetchRealThreats(),
      storage.getPublishedGuides(undefined, 30),
      storage.getSocialPosts("published", 20),
    ]);

    if (trendingNews.length === 0) {
      console.warn("[TrendEngine] No trending news available, falling back to drafts");
      return result;
    }

    const recentTitles = recentPosts
      .filter((p) => {
        if (!p.publishedAt) return false;
        const daysAgo = (Date.now() - new Date(p.publishedAt).getTime()) / 86400000;
        return daysAgo <= 7;
      })
      .map((p) => p.contentTitle);

    const relevantGuides = guides.map((g) => ({
      title: g.title,
      slug: g.slug,
      category: g.category,
      tags: g.tags || [],
    }));

    console.log(
      `[TrendEngine] Generating posts from ${trendingNews.length} news items, ${relevantGuides.length} guides`
    );

    const posts = await generateTrendAwarePost(
      trendingNews,
      relevantGuides,
      recentTitles,
      contentAngle
    );

    if (!posts) {
      console.error("[TrendEngine] Failed to generate trend-aware posts");
      return result;
    }

    let imageUrl: string | null = null;
    if (posts.imagePrompt) {
      const imagePath = await generatePostImage(posts.title, posts.imagePrompt);
      if (imagePath) {
        imageUrl = getPublicImageUrl(imagePath);
        console.log(`[TrendEngine] Image URL for posts: ${imageUrl}`);
      }
    }

    const platformPosts: { platform: string; content: string }[] = [];
    if (channels.linkedin) platformPosts.push({ platform: "linkedin", content: posts.linkedin });
    if (channels.facebook) platformPosts.push({ platform: "facebook", content: posts.facebook });

    for (const { platform, content } of platformPosts) {
      try {
        const socialPost: InsertSocialPost = {
          contentType: "trend_insight",
          contentId: `trend-${Date.now()}-${platform}`,
          contentTitle: posts.title,
          platform,
          postContent: content,
          hashtags: posts.hashtags,
          status: "published",
          publishedAt: new Date(),
        };

        const created = await storage.createSocialPost(socialPost);

        const channel = channels[platform];
        const bufferResult = await createBufferPost(channel.id, content, {
          mode: "shareNow",
          platform,
          imageUrl: imageUrl || undefined,
        });

        if (bufferResult.success) {
          console.log(
            `[TrendEngine] Published ${platform}: "${posts.title}" (Buffer ID: ${bufferResult.bufferId})`
          );
          result.published++;
          result.platforms.push(platform);
        } else {
          await storage.updateSocialPost(created.id, {
            status: "failed",
            publishError: `Buffer: ${bufferResult.error}`,
          });
          console.error(`[TrendEngine] Buffer publish failed for ${platform}: ${bufferResult.error}`);
        }

        await new Promise((r) => setTimeout(r, 1500));
      } catch (err: any) {
        console.error(`[TrendEngine] Failed to publish ${platform} post:`, err.message);
      }
    }

    console.log(
      `[TrendEngine] Daily trend-aware publish complete: ${result.published}/${platformPosts.length} published`
    );
  } catch (error: any) {
    console.error("[TrendEngine] Trend-aware generation error:", error.message);
  }

  return result;
}
