import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import type { CyberSafetyGuide, CyberThreatAlert, ScamIntelligence, InsertSocialPost } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

type ContentItem = CyberSafetyGuide | CyberThreatAlert | ScamIntelligence;

interface SocialPostSet {
  linkedin: string;
  xThread: string[];
  instagram: string;
  shortAlert: string;
  hashtags: string[];
}

async function generateSocialPosts(
  contentType: string,
  title: string,
  description: string,
  url: string,
  tags: string[]
): Promise<SocialPostSet | null> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a social media manager for GetCyberRight, a cybersecurity education platform protecting families and everyday people online.

Generate social media posts for this new ${contentType}:

Title: ${title}
Description: ${description}
URL: ${url}
Tags: ${tags.join(", ")}

Create:
1. LinkedIn post (200-300 words, professional tone, actionable insights, end with CTA)
2. X/Twitter thread (3-5 tweets, each under 280 chars, first tweet hooks attention, last has CTA)
3. Instagram caption (150-250 words, engaging visual storytelling tone, include line breaks for readability, end with CTA and hashtags section)
4. Short alert message (under 160 chars, urgent/informative, for email/SMS)
5. 5-8 relevant hashtags

Rules:
- Do NOT use em dashes
- Use clear, simple language
- Include relevant emojis sparingly
- Make content shareable and educational
- Always reference GetCyberRight as the source
- Instagram caption should be visual and educational with a hook in the first line

Format as JSON:
{
  "linkedin": "Full LinkedIn post text",
  "xThread": ["Tweet 1", "Tweet 2", "Tweet 3"],
  "instagram": "Full Instagram caption text",
  "shortAlert": "Short alert message",
  "hashtags": ["hashtag1", "hashtag2"]
}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return null;

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("[SocialDistribution] Failed to generate social posts:", error);
    return null;
  }
}

export async function distributeGuideContent(guide: CyberSafetyGuide): Promise<string[]> {
  const url = `https://getcyberright.com/guides/${guide.slug}`;
  const posts = await generateSocialPosts(
    "cybersecurity guide",
    guide.title,
    guide.metaDescription,
    url,
    guide.tags || []
  );

  if (!posts) return [];

  const createdIds: string[] = [];

  const platforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: posts.linkedin },
    { platform: "x", content: posts.xThread.join("\n\n---\n\n") },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const post: InsertSocialPost = {
      contentType: "guide",
      contentId: guide.id,
      contentTitle: guide.title,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      status: "draft",
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} social posts for guide: "${guide.title}"`);
  return createdIds;
}

export async function distributeThreatAlertContent(alert: CyberThreatAlert): Promise<string[]> {
  const url = `https://getcyberright.com/alerts/${alert.slug}`;
  const posts = await generateSocialPosts(
    "cyber threat alert",
    alert.threatName,
    alert.description,
    url,
    alert.affectedPlatforms || []
  );

  if (!posts) return [];

  const createdIds: string[] = [];

  const platforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: posts.linkedin },
    { platform: "x", content: posts.xThread.join("\n\n---\n\n") },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const post: InsertSocialPost = {
      contentType: "threat_alert",
      contentId: alert.id,
      contentTitle: alert.threatName,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      status: "draft",
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} social posts for alert: "${alert.threatName}"`);
  return createdIds;
}

export async function distributeScamIntelContent(scam: ScamIntelligence): Promise<string[]> {
  const url = `https://getcyberright.com/scam-intel/${scam.slug}`;
  const posts = await generateSocialPosts(
    "scam intelligence report",
    scam.scamName,
    scam.metaDescription || `New ${scam.scamCategory} scam detected targeting ${(scam.targetAudience || []).join(", ")}`,
    url,
    scam.platformUsed || []
  );

  if (!posts) return [];

  const createdIds: string[] = [];

  const platforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: posts.linkedin },
    { platform: "x", content: posts.xThread.join("\n\n---\n\n") },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const post: InsertSocialPost = {
      contentType: "scam_intel",
      contentId: scam.id,
      contentTitle: scam.scamName,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      status: "draft",
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} social posts for scam: "${scam.scamName}"`);
  return createdIds;
}

export async function getSocialDistributionStats() {
  const totalPosts = await storage.getSocialPostCount();
  const draftPosts = await storage.getSocialPostCount("draft");
  const publishedPosts = await storage.getSocialPostCount("published");

  const allPosts = await storage.getSocialPosts(undefined, 1000);
  const platformCounts: Record<string, number> = {};
  const contentTypeCounts: Record<string, number> = {};

  for (const post of allPosts) {
    platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    contentTypeCounts[post.contentType] = (contentTypeCounts[post.contentType] || 0) + 1;
  }

  return {
    totalPosts,
    draftPosts,
    publishedPosts,
    platformCounts,
    contentTypeCounts,
  };
}
