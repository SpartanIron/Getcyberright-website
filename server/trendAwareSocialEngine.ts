import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { fetchRealThreats, type RawFeedItem } from "./trendingThreatService";
import { generateBrandedImage } from "./socialImageService";
import { createBufferPost, getBufferChannelsByPlatform, getPublicImageUrl } from "./bufferPublisher";
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
    trending_threat_reaction: `ANGLE: React to the most impactful trending news story. Explain what happened, why it matters to families, and what people should do right now. Position GetCyberRight as the trusted source that breaks down complex threats into clear action steps.`,
    educational_deep_dive: `ANGLE: Pick a topic from the trending news and go deep on the underlying concept. For example, if there's a phishing attack in the news, teach people the fundamentals of recognizing phishing. Reference the news as the hook, then deliver real educational value. Link to a relevant GetCyberRight guide.`,
    timely_safety_tip: `ANGLE: Share a specific, immediately actionable safety tip inspired by what's trending in cybersecurity news. Make it something people can do in under 5 minutes to be safer. Frame it as "With [trending topic] in the news, here's something you should do today..."`,
    myth_buster: `ANGLE: Bust a common cybersecurity myth that's relevant to current events. Start with what most people believe, then reveal the truth with evidence from current news. Make people feel smarter for following GetCyberRight.`,
    real_world_case_study: `ANGLE: Tell a story inspired by current threats. Create a realistic (but anonymized) scenario showing how a family member, parent, senior, or child could be affected by threats currently in the news. Walk through what happened and what they should have done differently.`,
  };

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 3000,
      system: `You are the editorial voice of GetCyberRight, a trusted family-focused cybersecurity education platform. You write social media content that positions GetCyberRight as the go-to authority on protecting families online.

Your content philosophy:
- Every post must demonstrate DEPTH OF KNOWLEDGE, not surface-level tips
- Connect current events to practical family safety
- Show you are monitoring threats in real-time and translating them for everyday people
- Mix urgency with empowerment (never fear-mongering)
- Reference specific data, real incidents, and concrete actions
- Write like a knowledgeable friend who happens to be a cybersecurity expert

Your voice:
- Warm, authoritative, and accessible
- No jargon (translate technical terms to plain language)
- Never use em dashes
- Use emojis sparingly (1-3 per post)
- Speak directly to families, parents, seniors, and everyday internet users

Brand integrity signals:
- Reference GetCyberRight's free tools and guides naturally (not as ads)
- Show awareness of the broader cybersecurity landscape
- Demonstrate that you care about people, not clicks
- Include specific, verifiable facts and actionable steps`,
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

Create posts for TWO platforms:

1. LINKEDIN POST (250-400 words):
- Open with a hook tied to something happening RIGHT NOW in cybersecurity
- Demonstrate expert-level understanding while keeping language accessible
- Include 2-3 specific, actionable takeaways
- Reference a GetCyberRight guide or tool naturally
- End with a thought-provoking question or clear call to action
- Professional but approachable tone

2. FACEBOOK POST (120-200 words):
- Start with a relatable scenario or attention-grabbing fact from current news
- Share 2-3 practical tips someone can act on immediately
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
      linkedin: parsed.linkedin,
      facebook: parsed.facebook,
      title: parsed.title,
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
        const imagePath = await generateBrandedImage(posts.title, "trend_insight", platform);
        let imageUrl: string | undefined;
        if (imagePath) {
          const publicUrl = getPublicImageUrl(imagePath);
          if (publicUrl) imageUrl = publicUrl;
        }

        const socialPost: InsertSocialPost = {
          contentType: "trend_insight",
          contentId: `trend-${Date.now()}-${platform}`,
          contentTitle: posts.title,
          platform,
          postContent: content,
          hashtags: posts.hashtags,
          imageUrl: imagePath || undefined,
          status: "published",
          publishedAt: new Date(),
        };

        const created = await storage.createSocialPost(socialPost);

        const channel = channels[platform];
        let bufferResult = await createBufferPost(channel.id, content, {
          mode: "shareNow",
          imageUrl,
          platform,
        });

        if (!bufferResult.success && imageUrl && bufferResult.error?.includes("image")) {
          console.log(`[TrendEngine] Retrying ${platform} without image...`);
          bufferResult = await createBufferPost(channel.id, content, {
            mode: "shareNow",
            platform,
          });
        }

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
