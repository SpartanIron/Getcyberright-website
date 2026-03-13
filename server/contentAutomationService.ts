import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { SEO_KEYWORDS } from "@shared/seo-keywords";
import type { InsertCyberSafetyGuide } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

interface GeneratedArticle {
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  headings: { level: number; text: string; id: string }[];
  tableOfContents: { text: string; anchor: string; level: number }[];
  faq: { question: string; answer: string }[];
  category: string;
  tags: string[];
  wordCount: number;
  readingTimeMinutes: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractHeadings(content: string): { level: number; text: string; id: string }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    headings.push({
      level: match[1].length,
      text: match[2].trim(),
      id: slugify(match[2].trim()),
    });
  }
  return headings;
}

function buildTableOfContents(headings: { level: number; text: string; id: string }[]): { text: string; anchor: string; level: number }[] {
  return headings.map((h) => ({
    text: h.text,
    anchor: `#${h.id}`,
    level: h.level,
  }));
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

async function generateArticleFromKeyword(keyword: string, cluster: string, category: string): Promise<GeneratedArticle | null> {
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `You are a cybersecurity education writer for GetCyberRight, a platform helping families, seniors, and everyday people stay safe online.

Write a comprehensive guide article about: "${keyword}"

Requirements:
- Write 1500-2000 words
- Use simple, everyday language (no jargon without explanation)
- Include practical, actionable advice
- Use markdown formatting with ## and ### headings
- Do NOT use em dashes (--) anywhere
- Make content factual and verifiable
- Include real-world examples where appropriate
- Target audience: non-technical users, families, seniors

Structure:
1. Introduction (2-3 paragraphs explaining what this is and why it matters)
2. 3-5 main sections with ## headings covering the topic thoroughly
3. Each section should have subsections with ### headings where appropriate
4. Include specific steps, tips, or checklists
5. End with a summary section

Also generate:
- SEO title (50-60 chars, include primary keyword)
- Meta description (150-160 chars)
- 5-8 FAQ questions with answers
- 5-8 relevant tags
- Category: "${category}"

Format your response as JSON:
{
  "title": "SEO optimized title",
  "metaDescription": "Meta description under 160 chars",
  "content": "Full markdown article content",
  "faq": [{"question": "...", "answer": "..."}],
  "tags": ["tag1", "tag2"]
}`,
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") return null;

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    const slug = slugify(parsed.title);
    const headings = extractHeadings(parsed.content);
    const toc = buildTableOfContents(headings);
    const wc = countWords(parsed.content);

    return {
      title: parsed.title,
      slug,
      metaDescription: parsed.metaDescription,
      content: parsed.content,
      headings,
      tableOfContents: toc,
      faq: parsed.faq || [],
      category,
      tags: parsed.tags || [],
      wordCount: wc,
      readingTimeMinutes: Math.ceil(wc / 200),
    };
  } catch (error) {
    console.error(`[ContentAutomation] Failed to generate article for "${keyword}":`, error);
    return null;
  }
}

function getRelatedGuides(cluster: string, currentSlug: string): string[] {
  const clusterKeywords = SEO_KEYWORDS.filter((k) => k.cluster === cluster);
  const relatedPages = clusterKeywords
    .map((k) => k.targetPage)
    .filter((p) => p !== `/guides/${currentSlug}`)
    .slice(0, 5);
  return [...new Set(relatedPages)];
}

function getRelatedScams(cluster: string): string[] {
  const CLUSTER_SCAM_MAP: Record<string, string[]> = {
    "identity-theft": ["identity-theft", "phishing", "data-breach"],
    "online-scams": ["paypal-scam", "amazon-scam", "shopping-scam", "romance-scam"],
    phishing: ["phishing", "facebook-scam", "instagram-scam"],
    "privacy-protection": ["data-breach", "identity-theft", "social-media-scam"],
    "password-security": ["phishing", "data-breach"],
    "device-security": ["tech-support-scam", "phishing"],
    "cyber-safety-seniors": ["grandparent-scam", "tech-support-scam", "romance-scam"],
    "cyber-safety-kids": ["social-media-scam", "instagram-scam"],
    "data-breaches": ["data-breach", "identity-theft", "phishing"],
    "social-media-security": ["social-media-scam", "facebook-scam", "instagram-scam"],
  };
  return CLUSTER_SCAM_MAP[cluster] || [];
}

function getRelatedTools(cluster: string): string[] {
  const CLUSTER_TOOL_MAP: Record<string, string[]> = {
    "identity-theft": ["/scam-checker", "/data-removal"],
    "online-scams": ["/scam-checker", "/ai-scam-analyzer"],
    phishing: ["/scam-checker", "/ai-scam-analyzer"],
    "privacy-protection": ["/data-removal", "/password-generator"],
    "password-security": ["/password-generator"],
    "device-security": ["/scam-checker"],
    "cyber-safety-seniors": ["/scam-checker", "/ai-scam-analyzer"],
    "cyber-safety-kids": ["/scam-checker"],
    "data-breaches": ["/data-removal", "/scam-checker"],
    "social-media-security": ["/scam-checker", "/data-removal"],
  };
  return CLUSTER_TOOL_MAP[cluster] || ["/scam-checker"];
}

function calculateSeoScore(article: GeneratedArticle, targetKeyword: string): number {
  let score = 0;
  const titleLower = article.title.toLowerCase();
  const contentLower = article.content.toLowerCase();
  const keywordLower = targetKeyword.toLowerCase();

  if (titleLower.includes(keywordLower)) score += 20;
  if (article.metaDescription.toLowerCase().includes(keywordLower)) score += 15;
  if (article.headings.some((h) => h.text.toLowerCase().includes(keywordLower))) score += 15;
  if (article.wordCount >= 1500 && article.wordCount <= 2500) score += 15;
  if (article.faq.length >= 4) score += 10;
  if (article.headings.length >= 5) score += 10;
  if (article.tags.length >= 5) score += 5;
  if (article.metaDescription.length >= 120 && article.metaDescription.length <= 160) score += 5;
  if (article.title.length >= 40 && article.title.length <= 65) score += 5;

  return Math.min(score, 100);
}

export async function generateGuideDraft(keyword: string, cluster: string): Promise<string | null> {
  const CLUSTER_CATEGORY_MAP: Record<string, string> = {
    "identity-theft": "Identity Protection",
    "online-scams": "Scam Prevention",
    phishing: "Phishing Prevention",
    "privacy-protection": "Privacy",
    "password-security": "Password Security",
    "device-security": "Device Security",
    "cyber-safety-seniors": "Senior Safety",
    "cyber-safety-kids": "Child Safety",
    "data-breaches": "Data Breaches",
    "social-media-security": "Social Media Safety",
  };

  const category = CLUSTER_CATEGORY_MAP[cluster] || "Cybersecurity";
  const article = await generateArticleFromKeyword(keyword, cluster, category);
  if (!article) return null;

  const existing = await storage.getGuideBySlug(article.slug);
  if (existing) {
    console.log(`[ContentAutomation] Guide with slug "${article.slug}" already exists, skipping.`);
    return null;
  }

  const seoScore = calculateSeoScore(article, keyword);

  const guideData: InsertCyberSafetyGuide = {
    slug: article.slug,
    title: article.title,
    metaDescription: article.metaDescription,
    content: article.content,
    headings: article.headings,
    tableOfContents: article.tableOfContents,
    faq: article.faq,
    category: article.category,
    tags: article.tags,
    targetKeywords: [keyword],
    cluster,
    wordCount: article.wordCount,
    readingTimeMinutes: article.readingTimeMinutes,
    status: "draft",
    authorName: "GetCyberRight Team",
    relatedGuideIds: [],
    relatedScamSlugs: getRelatedScams(cluster),
    relatedToolPaths: getRelatedTools(cluster),
    generatedByAi: true,
    aiModel: "claude-sonnet-4-20250514",
  };

  const guide = await storage.createGuide(guideData);
  await storage.updateGuide(guide.id, { seoScore } as any);

  console.log(`[ContentAutomation] Generated guide: "${article.title}" (SEO: ${seoScore}/100, ${article.wordCount} words)`);
  return guide.id;
}

export async function getUnusedKeywords(limit = 10): Promise<{ keyword: string; cluster: string }[]> {
  const allGuides = await storage.getAllGuides();
  const usedKeywords = new Set(
    allGuides.flatMap((g) => g.targetKeywords || []).map((k) => k.toLowerCase())
  );

  const unused = SEO_KEYWORDS.filter(
    (k) =>
      !usedKeywords.has(k.keyword.toLowerCase()) &&
      k.priority === "high" &&
      k.searchIntent === "informational"
  ).map((k) => ({ keyword: k.keyword, cluster: k.cluster }));

  return unused.slice(0, limit);
}

export async function runContentAutomationBatch(count = 3): Promise<string[]> {
  const keywords = await getUnusedKeywords(count);
  const generatedIds: string[] = [];

  for (const { keyword, cluster } of keywords) {
    try {
      const id = await generateGuideDraft(keyword, cluster);
      if (id) generatedIds.push(id);
      await new Promise((r) => setTimeout(r, 2000));
    } catch (error) {
      console.error(`[ContentAutomation] Batch error for "${keyword}":`, error);
    }
  }

  console.log(`[ContentAutomation] Batch complete: ${generatedIds.length}/${keywords.length} articles generated`);
  return generatedIds;
}

export async function optimizeGuideInternalLinks(guideId: string): Promise<void> {
  const guide = await storage.getGuideById(guideId);
  if (!guide || !guide.cluster) return;

  const allGuides = await storage.getPublishedGuides();
  const relatedGuides = allGuides
    .filter((g) => g.id !== guideId && g.cluster === guide.cluster)
    .slice(0, 5)
    .map((g) => g.id);

  await storage.updateGuide(guideId, {
    relatedGuideIds: relatedGuides,
  } as any);
}

export async function getContentAutomationStats() {
  const totalGuides = await storage.getGuideCount();
  const publishedGuides = await storage.getGuideCount("published");
  const draftGuides = await storage.getGuideCount("draft");
  const unusedKeywords = await getUnusedKeywords(1000);

  const categoryCounts: Record<string, number> = {};
  const allGuides = await storage.getAllGuides();
  for (const guide of allGuides) {
    categoryCounts[guide.category] = (categoryCounts[guide.category] || 0) + 1;
  }

  return {
    totalGuides,
    publishedGuides,
    draftGuides,
    totalKeywords: SEO_KEYWORDS.length,
    unusedHighPriorityKeywords: unusedKeywords.length,
    keywordCoverage: Math.round(((SEO_KEYWORDS.length - unusedKeywords.length) / SEO_KEYWORDS.length) * 100),
    categoryCounts,
  };
}
