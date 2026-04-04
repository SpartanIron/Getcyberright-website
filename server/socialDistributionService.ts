import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { storage } from "./storage";
import type { CyberSafetyGuide, CyberThreatAlert, ScamIntelligence, InsertSocialPost } from "@shared/schema";
import { generateBrandedImage, serveImagePath } from "./socialImageService";
import { getBufferChannelsByPlatform } from "./bufferPublisher";
import { tagAllGcrLinks, tagSingleUrl, buildCampaignId } from "./utmTracking";
import { buildPartnerContext } from "./socialEngagementService";
import { enforceAndSanitize, sanitizeContent } from "./socialPostPolicy";
import { searchStockPhoto, downloadSourceImage, applyBrandOverlay } from "./stockPhotoService";
import type { TemplateStyle } from "./stockPhotoService";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

type ContentItem = CyberSafetyGuide | CyberThreatAlert | ScamIntelligence;

const socialPostSetSchema = z.object({
  linkedin: z.string().min(100),
  facebook: z.string().min(50),
  xThread: z.array(z.string().min(10)).min(3),
  instagram: z.string().min(80),
  shortAlert: z.string().min(20).max(200),
  hashtags: z.array(z.string()).min(3),
});

interface SocialPostSet {
  linkedin: string;
  facebook: string;
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
  tags: string[],
  educationalContext: string
): Promise<SocialPostSet | null> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 3000,
      system: `You are the educational voice of GetCyberRight, a family-focused cybersecurity education platform. Your mission is to hook readers with a compelling excerpt that makes them want to read the full article on our website.

CONTENT STRATEGY:
- Your posts are EXCERPTS that tease the full article, not standalone pieces
- Share one powerful insight, stat, or story from the article to hook readers
- Always end with a clear call-to-action driving readers to the full article link
- The goal is to provide enough value to stop the scroll, but leave the reader wanting more

ABSOLUTE RULES:
- NEVER fabricate statistics, numbers, percentages, dollar amounts, or data points
- NEVER invent incidents, breaches, or events
- ONLY state facts from the provided source material or widely established public knowledge
- If you are unsure whether something is factual, do not include it
- Your credibility depends on accuracy. Never guess.

SOURCE DIVERSITY (CRITICAL):
- Do NOT default to citing the FBI for every statistic. Rotate across trusted global sources
- Preferred sources to cite (vary across posts): FTC, CISA, UK NCSC, Europol, INTERPOL, Action Fraud (UK), ACSC (Australia), ENISA (EU), Canadian Anti-Fraud Centre, APWG, Identity Theft Resource Center, AARP Fraud Watch Network, Google Threat Analysis Group, Microsoft Digital Defense Report, Verizon DBIR
- When citing a statistic, prefer the most globally relevant source, not just the US-centric one
- If the source material references a specific agency, you may cite that agency, but across a set of posts, ensure variety
- GetCyberRight serves a global audience: reference international agencies and perspectives

Formatting rules (STRICT — this determines whether posts look professional or like a wall of text):
- NEVER use markdown formatting. No ** bold **, no * italics *, no ## headings, no bullet markers
- NEVER use em dashes. Use commas, periods, colons, or semicolons instead
- Use proper sentence structure with correct grammar and punctuation throughout
- Use numbered lists (1. 2. 3.) when listing steps, but never markdown bullet points
- VISUAL STRUCTURE IS MANDATORY. Use \\n (newlines) to create clear paragraph breaks. Every post must have visual breathing room between sections. Do NOT write a continuous block of text
- Structure every LinkedIn and Facebook post exactly like this:
  [Hook: 1-2 punchy sentences]\\n\\n[Value paragraph: key insight or tip]\\n\\n[Second point or supporting detail]\\n\\n[CTA with link on its own line]
- Keep paragraphs SHORT: 2-3 sentences max per paragraph. If a paragraph runs longer, break it
- Numbered tips should each start on their own line with a blank line before and after the group
- The link MUST be on its own final line, separated by a blank line from the text above it

Your voice is:
- Professional, knowledgeable, and approachable
- Sound like a cybersecurity expert who explains complex topics simply
- No jargon. If a technical term is necessary, immediately explain what it means in plain language
- Backed by verifiable facts and concrete steps from the provided source material
- Empowering, never condescending
- Focused on everyday families, parents, seniors, and kids
- Every sentence should be clear enough that a non-technical person understands it on the first read

Writing principles:
- Lead with the most compelling insight, stat, or real-world example from the source material
- Give one or two actionable tips to demonstrate value, but make it clear the full article has more
- Use real-world examples and relatable scenarios (e.g. "Your child downloads a free game..." not "Threat actors deploy malicious payloads")
- Replace jargon with plain language: "suspicious links" not "phishing vectors", "online scams" not "social engineering attacks"
- Use emojis sparingly and purposefully (1-3 per post, only where they add clarity)
- Reference GetCyberRight naturally, not as a sales pitch
- Write like you are helping a friend, not writing corporate marketing copy`,
      messages: [
        {
          role: "user",
          content: `Create social media posts for this ${contentType}:

TITLE: ${title}
SUMMARY: ${description}
LINK: ${url}
TOPICS: ${tags.join(", ")}

EDUCATIONAL SOURCE MATERIAL (use this to write genuinely informative posts):
${educationalContext}

Create SHORT, punchy posts for each platform. Think TechCrunch/Wired style: 1-2 sentences + link. The link preview card does the visual heavy lifting. Do NOT summarize the article. Tease the reader into clicking.
${buildPartnerContext("linkedin", tags[0] || "general_awareness")}${buildPartnerContext("facebook", tags[0] || "general_awareness")}${buildPartnerContext("x", tags[0] || "general_awareness")}${buildPartnerContext("instagram", tags[0] || "general_awareness")}
1. LINKEDIN (40-80 words MAXIMUM, STRICTLY ENFORCED — posts over 80 words are rejected)
- Write 1-2 punchy hook sentences that stop the scroll
- Then the article link on its own line. That is it.
- The link preview card handles the visual storytelling
- Do NOT write paragraphs of summary. Do NOT give away the whole article
- Professional but human tone, like a knowledgeable friend sharing one key insight
- ALGORITHM TIP: LinkedIn penalizes wordy posts with links. Keep it SHORT. Put the link on its own final line

2. FACEBOOK (30-60 words MAXIMUM, STRICTLY ENFORCED)
- 1-2 sentences + link. Warmer, conversational
- The link preview card carries the visual weight
- Do NOT write paragraphs of summary

3. X/TWITTER THREAD (3-4 tweets, each under 270 chars)
- Tweet 1: A hook with the most surprising or alarming insight from the article
- Tweet 2: One specific, actionable tip as a preview of the article's value
- Tweet 3: A teaser about what else the full piece covers
- Final tweet: "Full breakdown on GetCyberRight:" followed by the link
- Each tweet should make readers want to click through

4. INSTAGRAM (60-100 words max, STRICTLY ENFORCED — posts over 100 words are rejected)
- Instagram is IMAGE-FIRST. The caption supports the branded image card, not the other way around
- Hook in the first line that creates curiosity
- Share 1-2 key points as numbered items
- End with "Link in bio" as CTA (links are not clickable in Instagram captions)
- Include 8-12 relevant hashtags at the end, separated by a blank line
- Keep it SHORT and scannable. 2-3 short paragraphs max

5. SHORT ALERT (under 150 chars)
- Urgent, specific excerpt with a teaser
- Include the key insight from the article

6. HASHTAGS: 6-10 relevant hashtags

CRITICAL: Every post MUST include the article link (${url}) naturally integrated into the CTA. The link should appear on its own line at the end of the post body (before hashtags), not buried mid-sentence.

Format as JSON:
{
  "linkedin": "Full post text",
  "facebook": "Full post text",
  "xThread": ["Tweet 1", "Tweet 2", "Tweet 3", "Tweet 4", "Tweet 5"],
  "instagram": "Full caption with hashtags",
  "shortAlert": "Alert text",
  "hashtags": ["hashtag1", "hashtag2"]
}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return null;

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[SocialDistribution] No JSON found in AI response");
      return null;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = socialPostSetSchema.safeParse(parsed);

    if (!validated.success) {
      console.warn("[SocialDistribution] AI output validation issues:", validated.error.issues.map(i => `${i.path}: ${i.message}`).join(", "));
      return {
        linkedin: enforceAndSanitize(parsed.linkedin || "", "linkedin"),
        facebook: enforceAndSanitize(parsed.facebook || parsed.linkedin || "", "facebook"),
        xThread: Array.isArray(parsed.xThread) ? parsed.xThread.map((t: string) => sanitizeContent(t)) : [],
        instagram: enforceAndSanitize(parsed.instagram || "", "instagram"),
        shortAlert: sanitizeContent(parsed.shortAlert || ""),
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      };
    }

    const data = validated.data;
    return {
      linkedin: enforceAndSanitize(data.linkedin, "linkedin"),
      facebook: enforceAndSanitize(data.facebook, "facebook"),
      xThread: data.xThread.map((t: string) => sanitizeContent(t)),
      instagram: enforceAndSanitize(data.instagram, "instagram"),
      shortAlert: sanitizeContent(data.shortAlert),
      hashtags: data.hashtags,
    };
  } catch (error) {
    console.error("[SocialDistribution] Failed to generate social posts:", error);
    return null;
  }
}

function buildGuideContext(guide: CyberSafetyGuide): string {
  const parts: string[] = [];

  if (guide.content) {
    const plainText = guide.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    parts.push(`FULL ARTICLE CONTENT (extract key insights, stats, and tips from this):\n${plainText.substring(0, 2500)}`);
  }

  if (guide.headings && Array.isArray(guide.headings) && guide.headings.length > 0) {
    parts.push(`KEY SECTIONS COVERED:\n${guide.headings.map((h: any) => `- ${h.text}`).join("\n")}`);
  }

  if (guide.faq && Array.isArray(guide.faq) && guide.faq.length > 0) {
    parts.push(`COMMON QUESTIONS ANSWERED:\n${guide.faq.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}`);
  }

  if (guide.category) {
    parts.push(`CATEGORY: ${guide.category}`);
  }

  if (guide.readingTimeMinutes) {
    parts.push(`READING TIME: ${guide.readingTimeMinutes} minutes`);
  }

  return parts.join("\n\n");
}

function buildAlertContext(alert: CyberThreatAlert): string {
  const parts: string[] = [];

  if (alert.detailedAnalysis) {
    parts.push(`DETAILED ANALYSIS:\n${alert.detailedAnalysis.substring(0, 2000)}`);
  }

  if (alert.mitigationSteps && alert.mitigationSteps.length > 0) {
    parts.push(`PROTECTION STEPS (use these to give specific advice):\n${alert.mitigationSteps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`);
  }

  if (alert.indicators && Array.isArray(alert.indicators) && alert.indicators.length > 0) {
    parts.push(`WARNING SIGNS TO WATCH FOR:\n${alert.indicators.map((ind: any) => `- ${ind.description || ind.value}`).join("\n")}`);
  }

  if (alert.riskLevel) {
    parts.push(`RISK LEVEL: ${alert.riskLevel.toUpperCase()}`);
  }

  if (alert.affectedPlatforms && alert.affectedPlatforms.length > 0) {
    parts.push(`AFFECTED PLATFORMS: ${alert.affectedPlatforms.join(", ")}`);
  }

  if (alert.regions && alert.regions.length > 0) {
    parts.push(`REGIONS AFFECTED: ${alert.regions.join(", ")}`);
  }

  if (alert.targetAudience) {
    parts.push(`WHO IS MOST AT RISK: ${alert.targetAudience}`);
  }

  return parts.join("\n\n");
}

function buildScamContext(scam: ScamIntelligence): string {
  const parts: string[] = [];

  if (scam.howItWorks && Array.isArray(scam.howItWorks) && scam.howItWorks.length > 0) {
    parts.push(`HOW THIS SCAM WORKS (step by step):\n${scam.howItWorks.map((s: any) => `Step ${s.step}: ${s.title} - ${s.description}`).join("\n")}`);
  }

  if (scam.warningSigns && scam.warningSigns.length > 0) {
    parts.push(`RED FLAGS TO WATCH FOR:\n${scam.warningSigns.map((s) => `- ${s}`).join("\n")}`);
  }

  if (scam.preventionTips && scam.preventionTips.length > 0) {
    parts.push(`SPECIFIC PROTECTION TIPS:\n${scam.preventionTips.map((t, i) => `${i + 1}. ${t}`).join("\n")}`);
  }

  if (scam.exampleMessages && Array.isArray(scam.exampleMessages) && scam.exampleMessages.length > 0) {
    parts.push(`REAL EXAMPLES OF SCAM MESSAGES (use to illustrate the scam):\n${scam.exampleMessages.map((e: any) => `[${e.context}]: "${e.message}"`).join("\n")}`);
  }

  if (scam.averageLoss) {
    parts.push(`AVERAGE FINANCIAL LOSS PER VICTIM: ${scam.averageLoss}`);
  }

  if (scam.riskLevel) {
    parts.push(`RISK LEVEL: ${scam.riskLevel.toUpperCase()}`);
  }

  if (scam.targetAudience && scam.targetAudience.length > 0) {
    parts.push(`PRIMARY TARGETS: ${scam.targetAudience.join(", ")}`);
  }

  if (scam.platformUsed && scam.platformUsed.length > 0) {
    parts.push(`PLATFORMS WHERE THIS SCAM APPEARS: ${scam.platformUsed.join(", ")}`);
  }

  if (scam.scamCategory) {
    parts.push(`SCAM CATEGORY: ${scam.scamCategory}`);
  }

  if (scam.faq && Array.isArray(scam.faq) && scam.faq.length > 0) {
    parts.push(`FREQUENTLY ASKED QUESTIONS:\n${scam.faq.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")}`);
  }

  return parts.join("\n\n");
}

async function getConnectedPlatforms(): Promise<Set<string>> {
  try {
    const channels = await getBufferChannelsByPlatform();
    const connected = new Set(Object.keys(channels));
    connected.add("alert");
    return connected;
  } catch {
    return new Set(["linkedin", "facebook", "alert"]);
  }
}

async function generateImageForPost(title: string, contentType: string, platform: string, category?: string): Promise<string | null> {
  try {
    const searchCategory = category || contentType || "default";
    const templateStyle: TemplateStyle = contentType === "threat_alert" ? "alert_card" : contentType === "scam_intel" ? "stat_card" : "insight_card";
    const headline = title.length > 50 ? title.slice(0, 47) + "..." : title;
    const subtext = "getcyberright.com";
    const dims = platform === "instagram" ? { w: 1080, h: 1080 } : { w: 1200, h: 630 };

    const stockPhoto = await searchStockPhoto(searchCategory, title);
    if (stockPhoto) {
      const imgPath = stockPhoto.localPath || await downloadSourceImage(stockPhoto.url, title);
      if (imgPath) {
        const overlaid = await applyBrandOverlay(imgPath, headline, subtext, templateStyle, dims.w, dims.h);
        if (overlaid) {
          console.log(`[SocialDistribution] Stock photo image for ${platform}: ${stockPhoto.photographer}`);
          return overlaid;
        }
      }
    }

    const imagePath = await generateBrandedImage(title, contentType, platform);
    if (imagePath) {
      console.log(`[SocialDistribution] Fallback SVG card for ${platform}`);
    }
    return imagePath;
  } catch (error: any) {
    console.error(`[SocialDistribution] Image generation failed for ${platform}:`, error.message);
    return null;
  }
}

export async function distributeGuideContent(guide: CyberSafetyGuide): Promise<string[]> {
  const url = `https://www.getcyberright.com/guides/${guide.slug}`;
  const context = buildGuideContext(guide);
  const posts = await generateSocialPosts(
    "cybersecurity guide",
    guide.title,
    guide.metaDescription,
    url,
    guide.tags || [],
    context
  );

  if (!posts) return [];

  const createdIds: string[] = [];
  const connectedPlatforms = await getConnectedPlatforms();
  const campaignId = buildCampaignId("guide", "multi");

  const allPlatforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: tagAllGcrLinks(posts.linkedin, "linkedin", "guide", guide.slug) },
    { platform: "facebook", content: tagAllGcrLinks(posts.facebook || posts.linkedin, "facebook", "guide", guide.slug) },
    { platform: "x", content: tagAllGcrLinks(posts.xThread.join("\n\n---\n\n"), "x", "guide", guide.slug) },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  const platforms = allPlatforms.filter(p => connectedPlatforms.has(p.platform));
  const skipped = allPlatforms.filter(p => !connectedPlatforms.has(p.platform)).map(p => p.platform);
  if (skipped.length > 0) {
    console.log(`[SocialDistribution] Skipping disconnected platforms: ${skipped.join(", ")}`);
  }

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const imagePath = await generateImageForPost(guide.title, "guide", platform, guide.category);
    const post: InsertSocialPost = {
      contentType: "guide",
      contentId: guide.id,
      contentTitle: guide.title,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      imageUrl: imagePath || undefined,
      status: "draft",
      utmCampaign: campaignId,
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} UTM-tagged social posts with images for guide: "${guide.title}"`);
  return createdIds;
}

export async function distributeThreatAlertContent(alert: CyberThreatAlert): Promise<string[]> {
  const url = `https://www.getcyberright.com/alerts/${alert.slug}`;
  const context = buildAlertContext(alert);
  const posts = await generateSocialPosts(
    "cyber threat alert",
    alert.threatName,
    alert.description,
    url,
    alert.affectedPlatforms || [],
    context
  );

  if (!posts) return [];

  const createdIds: string[] = [];
  const connectedPlatforms = await getConnectedPlatforms();

  const allPlatforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: tagAllGcrLinks(posts.linkedin, "linkedin", "threat_alert", alert.slug) },
    { platform: "facebook", content: tagAllGcrLinks(posts.facebook || posts.linkedin, "facebook", "threat_alert", alert.slug) },
    { platform: "x", content: tagAllGcrLinks(posts.xThread.join("\n\n---\n\n"), "x", "threat_alert", alert.slug) },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  const platforms = allPlatforms.filter(p => connectedPlatforms.has(p.platform));
  const skipped = allPlatforms.filter(p => !connectedPlatforms.has(p.platform)).map(p => p.platform);
  if (skipped.length > 0) {
    console.log(`[SocialDistribution] Skipping disconnected platforms: ${skipped.join(", ")}`);
  }

  const alertCampaignId = buildCampaignId("threat_alert", "multi");
  for (const { platform, content } of platforms) {
    if (!content) continue;
    const imagePath = await generateImageForPost(alert.threatName, "threat_alert", platform, alert.threatCategory);
    const post: InsertSocialPost = {
      contentType: "threat_alert",
      contentId: alert.id,
      contentTitle: alert.threatName,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      imageUrl: imagePath || undefined,
      status: "draft",
      utmCampaign: alertCampaignId,
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} UTM-tagged social posts with images for alert: "${alert.threatName}"`);
  return createdIds;
}

export async function distributeScamIntelContent(scam: ScamIntelligence): Promise<string[]> {
  const url = `https://www.getcyberright.com/scam-intel/${scam.slug}`;
  const context = buildScamContext(scam);
  const posts = await generateSocialPosts(
    "scam intelligence report",
    scam.scamName,
    scam.metaDescription || `New ${scam.scamCategory} scam detected targeting ${(scam.targetAudience || []).join(", ")}`,
    url,
    scam.platformUsed || [],
    context
  );

  if (!posts) return [];

  const createdIds: string[] = [];
  const connectedPlatforms = await getConnectedPlatforms();

  const allPlatforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: tagAllGcrLinks(posts.linkedin, "linkedin", "scam_intel", scam.slug) },
    { platform: "facebook", content: tagAllGcrLinks(posts.facebook || posts.linkedin, "facebook", "scam_intel", scam.slug) },
    { platform: "x", content: tagAllGcrLinks(posts.xThread.join("\n\n---\n\n"), "x", "scam_intel", scam.slug) },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  const platforms = allPlatforms.filter(p => connectedPlatforms.has(p.platform));
  const skipped = allPlatforms.filter(p => !connectedPlatforms.has(p.platform)).map(p => p.platform);
  if (skipped.length > 0) {
    console.log(`[SocialDistribution] Skipping disconnected platforms: ${skipped.join(", ")}`);
  }

  const scamCampaignId = buildCampaignId("scam_intel", "multi");
  for (const { platform, content } of platforms) {
    if (!content) continue;
    const imagePath = await generateImageForPost(scam.scamName, "scam_intel", platform, scam.category || scam.scamCategory);
    const post: InsertSocialPost = {
      contentType: "scam_intel",
      contentId: scam.id,
      contentTitle: scam.scamName,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      imageUrl: imagePath || undefined,
      status: "draft",
      utmCampaign: scamCampaignId,
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} UTM-tagged social posts with images for scam: "${scam.scamName}"`);
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
