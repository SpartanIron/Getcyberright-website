import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { storage } from "./storage";
import type { CyberSafetyGuide, CyberThreatAlert, ScamIntelligence, InsertSocialPost } from "@shared/schema";
import { generateBrandedImage, generateStatCard, serveImagePath } from "./socialImageService";
import { getBufferChannelsByPlatform } from "./bufferPublisher";
import { tagAllGcrLinks, tagSingleUrl, buildCampaignId, ensureGcrLink } from "./utmTracking";
import { buildPartnerContext } from "./socialEngagementService";
import { enforceAndSanitize, sanitizeContent, validatePostContent } from "./socialPostPolicy";
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
      system: `You are the lead cybersecurity analyst at GetCyberRight, a family-focused cybersecurity intelligence platform. You don't just report news. You analyze it, interpret it, and tell families what it actually means for them.

AUTHORITY POSITIONING:
- You are an ANALYST, not an aggregator. You interpret threats, not just relay them
- Every post should convey: "We analyzed this so you don't have to"
- Take a clear stance or angle. What's the one thing most people get wrong about this topic? What's the insight nobody else is sharing?
- Position GetCyberRight as the trusted filter between complex cybersecurity and everyday families
- Use phrases like "Our analysis shows...", "Here's what most security advice misses...", "We broke this down for families..."

CONTENT STRATEGY:
- Lead with a CONTRARIAN or SURPRISING angle that challenges conventional thinking
- Share one powerful insight that demonstrates deep analysis, not surface-level reporting
- Make the reader feel they're getting insider knowledge they can't get elsewhere
- End with a CTA that positions the full article as essential reading
- The goal: readers should think "I need to follow this account" after every post

GETCYBERRIGHT CONTENT PHILOSOPHY:
- We provide the LATEST cybersecurity intelligence translated for real families
- All insights are based on our own deep research and expert analysis of current threats
- We NEVER pad content with recycled statistics or outdated research to appear credible
- Our authority comes from being current, accurate, and genuinely useful

ABSOLUTE RULES:
- NEVER fabricate statistics, numbers, percentages, dollar amounts, or data points. Zero tolerance for hallucination
- NEVER invent incidents, breaches, or events
- ONLY state facts from the provided source material or widely established public knowledge
- If you are unsure whether something is factual, do not include it. Credibility is everything
- NEVER reference old research, outdated studies, annual reports, or past-year data
- Do NOT cite any report, survey, or study unless it appears directly in the provided source material AND was released within the last 30 days
- Do NOT use filler phrases like "studies show", "research indicates", "experts say"
- Every claim must be traceable to the provided source material

SOURCE ATTRIBUTION:
- When citing agency actions, rotate across global sources: FTC, CISA, UK NCSC, Europol, INTERPOL, ACSC (Australia), ENISA (EU), Canadian Anti-Fraud Centre
- Do NOT default to citing the FBI for every claim
- When possible, name the specific threat, campaign, or vulnerability by name

Formatting rules (STRICT):
- NEVER use markdown formatting. No ** bold **, no * italics *, no ## headings, no bullet markers
- NEVER use em dashes. Use commas, periods, colons, or semicolons instead
- VISUAL STRUCTURE IS MANDATORY. Use \\n (newlines) to create clear paragraph breaks
- Structure every LinkedIn and Facebook post as:
  [Provocative hook: 1-2 sentences that challenge an assumption]\\n\\n[Your analysis: the key insight most people miss]\\n\\n[What this means for families: actionable takeaway]\\n\\n[CTA with link on its own line]
- Keep paragraphs SHORT: 2-3 sentences max
- The link MUST be on its own final line

Your voice is:
- Authoritative but accessible. Like a trusted security advisor who speaks plainly
- Confident in your analysis. You have a perspective and you share it directly
- No jargon. If a technical term is necessary, explain it immediately
- Empowering, never fear-mongering. You inform and equip, you don't scare
- Focused on everyday families, parents, seniors, and kids
- Sound like a real person with expertise, not a content generator or press release

Writing principles:
- START with the most surprising or counter-intuitive angle from the source material
- Frame insights as analysis: "We looked at this and here's what stands out..."
- Use real-world scenarios families can relate to (e.g. "Your child downloads a free game..." not "Threat actors deploy malicious payloads")
- Replace jargon with plain language: "suspicious links" not "phishing vectors"
- Use emojis sparingly (1-2 per post, only where they add clarity)
- Write like a knowledgeable friend who genuinely wants to help, not corporate marketing copy`,
      messages: [
        {
          role: "user",
          content: `Create social media posts for this ${contentType}:

TITLE: ${title}
SUMMARY: ${description}
LINK: ${url}
TOPICS: ${tags.join(", ")}

SOURCE MATERIAL FOR YOUR ANALYSIS:
${educationalContext}

Write as an ANALYST sharing your expert take, not as a news aggregator summarizing content. Every post should make the reader think: "This account sees things others miss."
${buildPartnerContext("linkedin", tags[0] || "general_awareness")}${buildPartnerContext("facebook", tags[0] || "general_awareness")}${buildPartnerContext("x", tags[0] || "general_awareness")}${buildPartnerContext("instagram", tags[0] || "general_awareness")}
1. LINKEDIN (40-80 words MAXIMUM, STRICTLY ENFORCED — posts over 80 words are rejected)
- Open with a provocative observation or contrarian take that challenges a common assumption
- Share YOUR analysis angle: what most people get wrong, what's actually happening, or the hidden implication
- Then the article link on its own final line
- Professional authority tone. You are the expert people trust to cut through the noise
- ALGORITHM TIP: LinkedIn penalizes wordy posts with links. Keep it SHORT

2. FACEBOOK (30-60 words MAXIMUM, STRICTLY ENFORCED)
- 1-2 sentences that feel like a knowledgeable friend giving a heads-up
- Frame it as something you noticed or analyzed, not news you're relaying
- Link on its own line

3. X/TWITTER THREAD (3-4 tweets, each under 270 chars)
- Tweet 1: A sharp observation that makes people stop scrolling. Challenge an assumption
- Tweet 2: Your analysis: what's actually going on beneath the surface
- Tweet 3: What this means practically for families
- Final tweet: "We broke this down:" followed by the link
- Each tweet should feel like expert commentary, not news summary

4. INSTAGRAM (60-100 words max, STRICTLY ENFORCED — posts over 100 words are rejected)
- Hook in the first line with a surprising insight or question
- Share 1-2 key analysis points as numbered items
- End with "Link in bio" as CTA
- Include 8-12 relevant hashtags at the end, separated by a blank line

5. SHORT ALERT (under 150 chars)
- Urgent, specific, with your analytical angle

6. HASHTAGS: 6-10 relevant hashtags

CRITICAL LINK & STAT RULES (zero tolerance, non-negotiable):
- The ONLY URL allowed in any post is: ${url}
- Do NOT include any other URL of any kind. No comptia.org, no nist.gov, no fbi.gov, no news outlets, no Wikipedia, no shorteners. If you mention an organisation by name, do NOT link to it.
- Do NOT use placeholder tokens like [link], [LINK], (link), {url}, "INSERT_LINK", "TODO", or "<link>". If you cannot include the real URL, do not write a CTA at all.
- Every post (except Instagram) MUST end with the bare URL ${url} on its own final line.
- Statistics, dollar amounts, percentages, body counts, dates, breach sizes, and named studies are ONLY allowed if the exact figure or name appears verbatim in the SOURCE MATERIAL above. If a number is not in the source material, omit it. Do not estimate. Do not generalise. Do not say "billions" or "millions" without an exact figure from source material.
- If the source material has no usable statistic, write a qualitative observation instead. Vague is acceptable. Fabricated is not.

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

async function generateImageForPost(title: string, contentType: string, platform: string, category?: string, severity?: string, contentId?: string): Promise<string | null> {
  try {
    const searchCategory = category || contentType || "default";
    const templateStyle: TemplateStyle = contentType === "threat_alert" ? "alert_card" : contentType === "scam_intel" ? "stat_card" : "insight_card";
    const headline = title.length > 50 ? title.slice(0, 47) + "..." : title;
    const subtext = "getcyberright.com";
    const dims = platform === "instagram" ? { w: 1080, h: 1080 } : { w: 1200, h: 630 };

    const stockPhoto = await searchStockPhoto(searchCategory, title, { platform, diversitySeed: contentId });
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

    const imagePath = await generateBrandedImage(title, contentType, platform, severity);
    if (imagePath) {
      console.log(`[SocialDistribution] ${platform === "instagram" ? "Branded card" : "Fallback SVG card"} for ${platform}`);
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
    { platform: "linkedin", content: ensureGcrLink(tagAllGcrLinks(posts.linkedin, "linkedin", "guide", guide.slug), url, "linkedin", "guide", guide.slug) },
    { platform: "facebook", content: ensureGcrLink(tagAllGcrLinks(posts.facebook || posts.linkedin, "facebook", "guide", guide.slug), url, "facebook", "guide", guide.slug) },
    { platform: "x", content: ensureGcrLink(tagAllGcrLinks(posts.xThread.join("\n\n---\n\n"), "x", "guide", guide.slug), url, "x", "guide", guide.slug) },
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
    const requireCanonical = platform !== "instagram";
    const validation = validatePostContent(content, url, { requireCanonical, minChars: platform === "alert" ? 40 : 80 });
    if (!validation.ok) {
      console.warn(
        `[SocialDistribution] REJECTED ${platform} draft for guide "${guide.title}": ` +
        validation.issues.map((i) => `${i.code}: ${i.message}`).join(" | ")
      );
      continue;
    }
    const imagePath = await generateImageForPost(guide.title, "guide", platform, guide.category, undefined, guide.id);
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

  console.log(`[SocialDistribution] Generated ${createdIds.length} validated social posts for guide: "${guide.title}"`);
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
    { platform: "linkedin", content: ensureGcrLink(tagAllGcrLinks(posts.linkedin, "linkedin", "threat_alert", alert.slug), url, "linkedin", "threat_alert", alert.slug) },
    { platform: "facebook", content: ensureGcrLink(tagAllGcrLinks(posts.facebook || posts.linkedin, "facebook", "threat_alert", alert.slug), url, "facebook", "threat_alert", alert.slug) },
    { platform: "x", content: ensureGcrLink(tagAllGcrLinks(posts.xThread.join("\n\n---\n\n"), "x", "threat_alert", alert.slug), url, "x", "threat_alert", alert.slug) },
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
    const requireCanonical = platform !== "instagram";
    const validation = validatePostContent(content, url, { requireCanonical, minChars: platform === "alert" ? 40 : 80 });
    if (!validation.ok) {
      console.warn(
        `[SocialDistribution] REJECTED ${platform} draft for threat alert "${alert.threatName}": ` +
        validation.issues.map((i) => `${i.code}: ${i.message}`).join(" | ")
      );
      continue;
    }
    const imagePath = await generateImageForPost(alert.threatName, "threat_alert", platform, alert.threatCategory, alert.riskLevel, alert.id);
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

  console.log(`[SocialDistribution] Generated ${createdIds.length} validated social posts for alert: "${alert.threatName}"`);
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
    { platform: "linkedin", content: ensureGcrLink(tagAllGcrLinks(posts.linkedin, "linkedin", "scam_intel", scam.slug), url, "linkedin", "scam_intel", scam.slug) },
    { platform: "facebook", content: ensureGcrLink(tagAllGcrLinks(posts.facebook || posts.linkedin, "facebook", "scam_intel", scam.slug), url, "facebook", "scam_intel", scam.slug) },
    { platform: "x", content: ensureGcrLink(tagAllGcrLinks(posts.xThread.join("\n\n---\n\n"), "x", "scam_intel", scam.slug), url, "x", "scam_intel", scam.slug) },
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
    const requireCanonical = platform !== "instagram";
    const validation = validatePostContent(content, url, { requireCanonical, minChars: platform === "alert" ? 40 : 80 });
    if (!validation.ok) {
      console.warn(
        `[SocialDistribution] REJECTED ${platform} draft for scam intel "${scam.scamName}": ` +
        validation.issues.map((i) => `${i.code}: ${i.message}`).join(" | ")
      );
      continue;
    }
    const imagePath = await generateImageForPost(scam.scamName, "scam_intel", platform, scam.category || scam.scamCategory, undefined, scam.id);
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
