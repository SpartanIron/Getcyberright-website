import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { storage } from "./storage";
import type { CyberSafetyGuide, CyberThreatAlert, ScamIntelligence, InsertSocialPost } from "@shared/schema";
import { generateBrandedImage, serveImagePath } from "./socialImageService";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

type ContentItem = CyberSafetyGuide | CyberThreatAlert | ScamIntelligence;

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

Formatting rules (STRICT):
- NEVER use markdown formatting. No ** bold **, no * italics *, no ## headings, no bullet markers
- NEVER use em dashes. Use commas, periods, colons, or semicolons instead
- Use proper sentence structure with correct grammar and punctuation throughout
- Use line breaks and short paragraphs to organize thoughts, not markdown symbols
- Use numbered lists (1. 2. 3.) when listing steps, but never markdown bullet points

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

Create excerpt-style posts for each platform. Each post should share a compelling taste of the article and drive readers to the full piece on our website:

1. LINKEDIN (150-250 words)
- Open with the single most compelling insight, stat, or story from the article
- Share 1-2 specific takeaways that demonstrate the article's value
- Include a "teaser" line hinting at what else the full article covers (e.g. "The full guide covers 7 more warning signs and a step-by-step action plan.")
- End with a clear CTA: "Read the full guide here:" followed by the link on its own line
- Professional but human tone

2. FACEBOOK (80-150 words)
- Start with a relatable hook or surprising fact from the article
- Share one practical tip or insight as a preview
- End with a conversational CTA that drives to the article (e.g. "We break down exactly how to protect yourself. Read more here:" followed by the link)
- Warm, conversational, like advising a neighbor

3. X/TWITTER THREAD (3-4 tweets, each under 270 chars)
- Tweet 1: A hook with the most surprising or alarming insight from the article
- Tweet 2: One specific, actionable tip as a preview of the article's value
- Tweet 3: A teaser about what else the full piece covers
- Final tweet: "Full breakdown on GetCyberRight:" followed by the link
- Each tweet should make readers want to click through

4. INSTAGRAM (120-200 words)
- Hook in the first line that creates curiosity
- Share 2-3 key points from the article as a preview
- End with a CTA driving to the article: "Full guide on our website, link in bio" or "Read the complete guide at getcyberright.com"
- Include 8-12 relevant hashtags at the end, separated by a line break

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
        linkedin: sanitizePostContent(parsed.linkedin || ""),
        facebook: sanitizePostContent(parsed.facebook || parsed.linkedin || ""),
        xThread: Array.isArray(parsed.xThread) ? parsed.xThread.map(sanitizePostContent) : [],
        instagram: sanitizePostContent(parsed.instagram || ""),
        shortAlert: sanitizePostContent(parsed.shortAlert || ""),
        hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : [],
      };
    }

    const data = validated.data;
    return {
      linkedin: sanitizePostContent(data.linkedin),
      facebook: sanitizePostContent(data.facebook),
      xThread: data.xThread.map(sanitizePostContent),
      instagram: sanitizePostContent(data.instagram),
      shortAlert: sanitizePostContent(data.shortAlert),
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

async function generateImageForPost(title: string, contentType: string, platform: string): Promise<string | null> {
  try {
    const imagePath = await generateBrandedImage(title, contentType, platform);
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

  const platforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: posts.linkedin },
    { platform: "facebook", content: posts.facebook || posts.linkedin },
    { platform: "x", content: posts.xThread.join("\n\n---\n\n") },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const imagePath = await generateImageForPost(guide.title, "guide", platform);
    const post: InsertSocialPost = {
      contentType: "guide",
      contentId: guide.id,
      contentTitle: guide.title,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      imageUrl: imagePath || undefined,
      status: "draft",
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} social posts with images for guide: "${guide.title}"`);
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

  const platforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: posts.linkedin },
    { platform: "facebook", content: posts.facebook || posts.linkedin },
    { platform: "x", content: posts.xThread.join("\n\n---\n\n") },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const imagePath = await generateImageForPost(alert.threatName, "threat_alert", platform);
    const post: InsertSocialPost = {
      contentType: "threat_alert",
      contentId: alert.id,
      contentTitle: alert.threatName,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      imageUrl: imagePath || undefined,
      status: "draft",
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} social posts with images for alert: "${alert.threatName}"`);
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

  const platforms: { platform: string; content: string }[] = [
    { platform: "linkedin", content: posts.linkedin },
    { platform: "facebook", content: posts.facebook || posts.linkedin },
    { platform: "x", content: posts.xThread.join("\n\n---\n\n") },
    { platform: "instagram", content: posts.instagram || "" },
    { platform: "alert", content: posts.shortAlert },
  ];

  for (const { platform, content } of platforms) {
    if (!content) continue;
    const imagePath = await generateImageForPost(scam.scamName, "scam_intel", platform);
    const post: InsertSocialPost = {
      contentType: "scam_intel",
      contentId: scam.id,
      contentTitle: scam.scamName,
      platform,
      postContent: content,
      hashtags: posts.hashtags,
      imageUrl: imagePath || undefined,
      status: "draft",
    };

    const created = await storage.createSocialPost(post);
    createdIds.push(created.id);
  }

  console.log(`[SocialDistribution] Generated ${createdIds.length} social posts with images for scam: "${scam.scamName}"`);
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
