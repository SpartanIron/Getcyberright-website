import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { fetchRealThreats, type RawFeedItem } from "./trendingThreatService";
import { createBufferPost, getBufferChannelsByPlatform } from "./bufferPublisher";
import type { InsertSocialPost } from "@shared/schema";

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
    .replace(/\s{2,}/g, " ")
    .replace(/ ,/g, ",")
    .trim();
}

interface TrendAwarePostResult {
  linkedin: string;
  facebook: string;
  title: string;
  hashtags: string[];
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
- Use line breaks and short paragraphs to organize thoughts, not markdown symbols
- Use numbered lists (1. 2. 3.) when listing steps, but never markdown bullet points

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

1. LINKEDIN POST (250-400 words):
- Open with a hook tied to a specific story from the news feed above
- Attribute the news to its source (e.g. "CISA just issued an advisory about..." or "According to Krebs on Security...")
- Demonstrate expert-level analysis while keeping language accessible
- Include 2-3 specific, actionable takeaways grounded in the actual threat details
- Reference a relevant GetCyberRight guide naturally when one fits
- End with a thought-provoking question or clear call to action
- Professional but approachable tone
- You may connect the news to broader hot topics and current affairs when relevant

2. FACEBOOK POST (120-200 words):
- Start with the real-world impact of a story from the news feed
- Share 2-3 practical tips someone can act on immediately, grounded in the actual threat
- Conversational and warm, like helping a neighbor
- End with a question that invites engagement

Also provide:
- A short, compelling TITLE (under 80 chars) for internal tracking
- 6-8 relevant HASHTAGS

Format as JSON:
{
  "linkedin": "Full LinkedIn post text",
  "facebook": "Full Facebook post text",
  "title": "Short tracking title",
  "hashtags": ["hashtag1", "hashtag2"]
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
    };
  } catch (error: any) {
    console.error("[TrendEngine] AI generation failed:", error.message);
    return null;
  }
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
