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

const POST_STYLES = [
  "expert_reaction",
  "one_insight",
  "myth_vs_reality",
  "story_based",
  "hot_take",
  "quick_breakdown",
  "did_you_know",
] as const;

type PostStyle = (typeof POST_STYLES)[number];

function getTodaysPostStyle(): PostStyle {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return POST_STYLES[dayOfYear % POST_STYLES.length];
}

const TEMPLATE_STYLES = [
  "stat_card",
  "tip_card",
  "alert_card",
  "insight_card",
  "quote_card",
] as const;

type TemplateStyle = (typeof TEMPLATE_STYLES)[number];

function getTodaysTemplate(): TemplateStyle {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return TEMPLATE_STYLES[dayOfYear % TEMPLATE_STYLES.length];
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
  imageHeadline: string;
  imageSubtext: string;
}

async function generateTrendAwarePost(
  trendingNews: RawFeedItem[],
  relevantGuides: { title: string; slug: string; category: string; tags: string[] }[],
  recentlyPublishedTitles: string[],
  postStyle: PostStyle
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
      ? `\nPOSTS PUBLISHED IN THE LAST 7 DAYS (do NOT repeat these topics or use similar structures):\n${recentlyPublishedTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const styleInstructions: Record<PostStyle, string> = {
    expert_reaction: `STYLE: Expert Reaction. React to the biggest story as a CISM-certified professional would. Use first person ("As someone who works in cybersecurity..."). Share a specific professional insight that a layperson wouldn't know. Be direct and confident. Reference the specific technical details (CVE numbers, attack vectors, affected systems) but explain them in plain language. NO numbered tips list. Instead, give ONE concrete recommendation that shows deep expertise.`,

    one_insight: `STYLE: One Powerful Insight. Pick the most interesting story and share a SINGLE non-obvious insight about it. This post should be SHORT (3-5 sentences for LinkedIn, 2-3 for Facebook). The insight should be something surprising or counterintuitive. Think "Here is what everyone is missing about this story..." No tips, no lists, just one sharp observation that makes people think.`,

    myth_vs_reality: `STYLE: Myth vs Reality. Take a common misconception related to today's news and demolish it with specific facts. Structure it as: "Most people believe [myth]. The reality is [truth with evidence]." Be slightly provocative. Show expertise by citing the specific technical reason the myth is wrong. End with a strong declarative statement, NOT a question.`,

    story_based: `STYLE: Real Scenario Walkthrough. Take one of the threats from the news and walk through exactly how it would hit a real family. Use a specific scenario ("Imagine you get a text message that looks like it is from your bank..."). Make it vivid and concrete. Show the attack chain step by step. Then show how to break that chain with one specific action. Write like you are explaining this to a friend over coffee.`,

    hot_take: `STYLE: Strong Professional Opinion. Take a clear stance on something in the news. Be direct and slightly opinionated. Examples: "Stop telling people to change passwords every 90 days. Here is why that advice is outdated." or "This breach was entirely preventable. Here is the one thing they should have done." Show conviction backed by expertise. This is NOT about being controversial for clicks. It is about having a real expert opinion that goes against common wisdom.`,

    quick_breakdown: `STYLE: Quick Technical Breakdown. Take a complex threat from the news and break it down into the simplest possible explanation. Use an analogy from everyday life. Structure: "What happened (1 sentence). How it works (analogy). Why you should care (1 sentence). What to do (1 specific action)." Keep it extremely concise. LinkedIn under 150 words. Facebook under 80 words.`,

    did_you_know: `STYLE: Surprising Fact. Lead with a genuinely surprising fact from the news feed. Something that makes people stop scrolling. Then connect it to practical relevance. Keep it short and punchy. The fact MUST come directly from the news feed or be verifiable public knowledge. End with a brief actionable takeaway, not a question.`,
  };

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: `You are the voice of GetCyberRight, a cybersecurity education platform founded by a CISM-certified security professional.

WHO YOU ARE:
- A real cybersecurity expert with hands-on experience in threat analysis, incident response, and security architecture
- CISM certified, deeply familiar with NIST, MITRE ATT&CK, and enterprise security frameworks
- You translate complex technical threats into language families can act on
- You have strong opinions backed by real expertise
- You care deeply about protecting everyday people, not just enterprises

ABSOLUTE RULES:
- NEVER fabricate statistics, numbers, percentages, dollar amounts, or data points
- NEVER invent incidents, breaches, or events not in the provided news feed
- ONLY state facts from the news feed or widely established public knowledge
- When referencing news, attribute it (e.g. "CISA just flagged...", "Krebs reported...")
- If unsure whether something is factual, leave it out

VOICE AND PERSONALITY:
- Confident and direct, never wishy-washy
- Occasionally use first person ("In my experience...", "What I find concerning is...")
- Have opinions. Do not hedge everything with "might" and "could"
- Sound like a real person, not a content generator
- Vary your sentence length. Mix short punchy sentences with longer explanations
- NO formulaic structures. Each post should feel different from the last
- Reference specific technical details (CVE numbers, attack vectors, protocol names) casually, then explain them simply
- Use industry shorthand naturally ("IOCs", "TTPs", "lateral movement") but always clarify for the audience

FORMATTING (CRITICAL):
- NEVER use markdown: no ** bold **, no * italics *, no ## headings, no bullet markers (- or *)
- NEVER use em dashes (use commas, colons, semicolons, or periods instead)
- Use blank lines between paragraphs for visual breathing room
- Keep paragraphs to 1-3 sentences
- If using numbered items, put each on its OWN line
- White space is critical. Never write a wall of text

WHAT NOT TO DO:
- Do not end every post with a question. Sometimes end with a strong statement
- Do not say "Here are 3 things you can do right now" every time
- Do not use "Stay safe out there" or similar platitudes
- Do not start posts with "Breaking:" or use fake urgency
- Do not use emojis excessively (0-2 per post max, and only if they genuinely add clarity)
- Do not use the phrases "game-changer", "wake-up call", "in today's digital landscape", or "cyber hygiene"`,
      messages: [
        {
          role: "user",
          content: `Write today's social media posts for GetCyberRight.

DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

${styleInstructions[postStyle]}

CURRENT CYBERSECURITY NEWS (from trusted sources):
${newsContext}

GETCYBERRIGHT GUIDES (link when naturally relevant, not forced):
${guideContext}
${recentPostsContext}

Create posts for TWO platforms:

LINKEDIN (100-200 words max):
- Write for a professional audience that includes both technical and non-technical people
- Show expertise through specificity, not length
- Reference specific technical details but keep the overall message accessible
- One clear takeaway, not a laundry list

FACEBOOK (60-120 words max):
- Conversational, like talking to a neighbor
- One key point, made simply
- Warm but authoritative

Also provide:
- TITLE: Short tracking title (under 60 chars)
- HASHTAGS: 4-6 relevant hashtags (not generic ones like #cybersecurity every time)
- IMAGE_HEADLINE: A short punchy headline for the branded image card (under 8 words). This is the main text that appears on the image. Make it attention-grabbing and specific to this post's topic.
- IMAGE_SUBTEXT: A one-line supporting detail or stat for the image card (under 15 words). This appears smaller below the headline.

Format as JSON with \\n for line breaks:
{
  "linkedin": "Post text with \\n\\n between paragraphs",
  "facebook": "Post text with \\n\\n between paragraphs",
  "title": "Tracking title",
  "hashtags": ["tag1", "tag2"],
  "imageHeadline": "Short Punchy Headline",
  "imageSubtext": "Supporting detail or statistic"
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

    let imageHeadline = sanitizePostContent(parsed.imageHeadline || parsed.title);
    if (imageHeadline.length > 50) imageHeadline = imageHeadline.slice(0, 47) + "...";

    let imageSubtext = sanitizePostContent(parsed.imageSubtext || "getcyberright.com");
    if (imageSubtext.length > 80) imageSubtext = imageSubtext.slice(0, 77) + "...";

    const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 8) : [];

    return {
      linkedin: sanitizePostContent(parsed.linkedin),
      facebook: sanitizePostContent(parsed.facebook),
      title: sanitizePostContent(parsed.title).slice(0, 80),
      hashtags,
      imageHeadline,
      imageSubtext,
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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxCharsPerLine) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

async function generatePostImage(
  headline: string,
  subtext: string,
  templateStyle: TemplateStyle
): Promise<string | null> {
  try {
    ensureSocialImagesDir();
    const slug = headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `trend-${slug}-${Date.now()}.png`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);
    const sharp = (await import("sharp")).default;

    const logoPath = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    const templates: Record<TemplateStyle, { bg: string; accent: string; accentLight: string; layout: string }> = {
      stat_card: {
        bg: "#0A2A3C",
        accent: "#E8732A",
        accentLight: "#F5A66D",
        layout: "center",
      },
      tip_card: {
        bg: "#071A24",
        accent: "#4ECDC4",
        accentLight: "#7EDDD6",
        layout: "left",
      },
      alert_card: {
        bg: "#1A0A0A",
        accent: "#FF4444",
        accentLight: "#FF7777",
        layout: "center",
      },
      insight_card: {
        bg: "#0D1B2A",
        accent: "#E8732A",
        accentLight: "#F5A66D",
        layout: "left",
      },
      quote_card: {
        bg: "#0A2A3C",
        accent: "#45B7D1",
        accentLight: "#7DD3E8",
        layout: "center",
      },
    };

    const tmpl = templates[templateStyle];
    let headlineLines = wrapText(headline, 22);
    if (headlineLines.length > 3) {
      headlineLines = headlineLines.slice(0, 3);
      headlineLines[2] = headlineLines[2].slice(0, -3) + "...";
    }
    let subtextLines = wrapText(subtext, 40);
    if (subtextLines.length > 2) {
      subtextLines = subtextLines.slice(0, 2);
      subtextLines[1] = subtextLines[1].slice(0, -3) + "...";
    }

    const headlineFontSize = headlineLines.length > 2 ? 48 : 56;
    const headlineLineHeight = headlineFontSize + 12;

    const totalHeadlineHeight = headlineLines.length * headlineLineHeight;
    const subtextHeight = subtextLines.length * 30;
    const contentHeight = totalHeadlineHeight + subtextHeight + 60;
    const startY = Math.max(180, (630 - contentHeight) / 2 + 40);

    const headlineSvg = headlineLines
      .map((line, i) => {
        const x = tmpl.layout === "center" ? 600 : 90;
        const anchor = tmpl.layout === "center" ? "middle" : "start";
        return `<text x="${x}" y="${startY + i * headlineLineHeight}" font-family="'Segoe UI',Arial,Helvetica,sans-serif" font-size="${headlineFontSize}" font-weight="800" fill="white" text-anchor="${anchor}" letter-spacing="-1">${escapeXml(line)}</text>`;
      })
      .join("\n");

    const subtextY = startY + totalHeadlineHeight + 30;
    const subtextSvg = subtextLines
      .map((line, i) => {
        const x = tmpl.layout === "center" ? 600 : 90;
        const anchor = tmpl.layout === "center" ? "middle" : "start";
        return `<text x="${x}" y="${subtextY + i * 30}" font-family="'Segoe UI',Arial,Helvetica,sans-serif" font-size="22" fill="${tmpl.accentLight}" text-anchor="${anchor}" opacity="0.9">${escapeXml(line)}</text>`;
      })
      .join("\n");

    const gridDots = Array.from({ length: 80 }, (_, i) => {
      const col = i % 10;
      const row = Math.floor(i / 10);
      const x = 800 + col * 45;
      const y = 30 + row * 75;
      const opacity = 0.03 + Math.random() * 0.05;
      return `<circle cx="${x}" cy="${y}" r="2" fill="${tmpl.accent}" opacity="${opacity}"/>`;
    }).join("\n");

    const accentShapes = templateStyle === "alert_card"
      ? `<polygon points="600,40 620,75 580,75" fill="${tmpl.accent}" opacity="0.15"/>
         <polygon points="600,50 612,70 588,70" fill="${tmpl.accent}" opacity="0.1"/>`
      : templateStyle === "tip_card"
      ? `<circle cx="1100" cy="100" r="80" fill="none" stroke="${tmpl.accent}" stroke-width="2" opacity="0.12"/>
         <circle cx="1100" cy="100" r="50" fill="none" stroke="${tmpl.accent}" stroke-width="1.5" opacity="0.08"/>`
      : `<rect x="1050" y="80" width="100" height="100" rx="8" fill="none" stroke="${tmpl.accent}" stroke-width="2" opacity="0.1" transform="rotate(15 1100 130)"/>`;

    const logoElement = logoBase64
      ? `<image href="${logoBase64}" x="${tmpl.layout === 'center' ? 555 : 90}" y="45" width="45" height="45" opacity="0.95"/>`
      : "";

    const brandX = tmpl.layout === "center" ? 600 : 90;
    const brandAnchor = tmpl.layout === "center" ? "middle" : "start";
    const brandTextX = logoBase64 ? (tmpl.layout === "center" ? 600 : 145) : brandX;

    const dividerX = tmpl.layout === "center" ? 540 : 90;

    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${tmpl.bg}"/>
      <stop offset="100%" stop-color="${adjustColor(tmpl.bg, -15)}"/>
    </linearGradient>
    <linearGradient id="accentBar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${tmpl.accent}"/>
      <stop offset="100%" stop-color="${tmpl.accent}" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)"/>

  ${gridDots}
  ${accentShapes}

  <rect x="0" y="0" width="5" height="630" fill="url(#accentBar)"/>

  ${logoElement}
  <text x="${brandTextX}" y="${logoBase64 ? 78 : 75}" font-family="'Segoe UI',Arial,sans-serif" font-size="18" font-weight="600" fill="${tmpl.accent}" text-anchor="${brandAnchor}" letter-spacing="2">GETCYBERRIGHT</text>

  <rect x="${dividerX}" y="${startY - 50}" width="120" height="3" rx="1.5" fill="${tmpl.accent}" opacity="0.6"/>

  ${headlineSvg}
  ${subtextSvg}

  <rect x="0" y="622" width="1200" height="8" fill="${tmpl.accent}" opacity="0.85"/>

  <text x="${tmpl.layout === 'center' ? 600 : 90}" y="600" font-family="'Segoe UI',Arial,sans-serif" font-size="15" fill="#6B8FA3" text-anchor="${brandAnchor}">getcyberright.com</text>
</svg>`;

    await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(outputPath);
    console.log(`[TrendEngine] Generated branded image: ${filename} (template: ${templateStyle})`);
    return outputPath;
  } catch (error: any) {
    console.error("[TrendEngine] Image generation failed:", error.message);
    return null;
  }
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
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

    const postStyle = getTodaysPostStyle();
    const templateStyle = getTodaysTemplate();
    console.log(`[TrendEngine] Today's style: ${postStyle}, template: ${templateStyle}`);

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
      postStyle
    );

    if (!posts) {
      console.error("[TrendEngine] Failed to generate trend-aware posts");
      return result;
    }

    let imageUrl: string | null = null;
    const imagePath = await generatePostImage(posts.imageHeadline, posts.imageSubtext, templateStyle);
    if (imagePath) {
      imageUrl = getPublicImageUrl(imagePath);
      console.log(`[TrendEngine] Image URL: ${imageUrl}`);
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
      `[TrendEngine] Daily publish complete: ${result.published}/${platformPosts.length} published (style: ${postStyle})`
    );
  } catch (error: any) {
    console.error("[TrendEngine] Trend-aware generation error:", error.message);
  }

  return result;
}
