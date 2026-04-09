import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { enforceAndSanitize, sanitizeContent } from "./socialPostPolicy";
import { tagAllGcrLinks, ensureGcrLink } from "./utmTracking";
import type { InsertSocialPost } from "@shared/schema";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

type SeriesType = "weekly_threat_brief" | "scam_of_the_week" | "family_cyber_tip" | "myth_buster" | "learning_spotlight" | "ai_skills_weekly";

interface SeriesConfig {
  name: string;
  frequency: "weekly";
  dayOfWeek: number;
  description: string;
}

const SERIES_CONFIGS: Record<SeriesType, SeriesConfig> = {
  weekly_threat_brief: {
    name: "Weekly Threat Brief",
    frequency: "weekly",
    dayOfWeek: 1,
    description: "Monday roundup of the top cybersecurity stories from the past week",
  },
  scam_of_the_week: {
    name: "Scam of the Week",
    frequency: "weekly",
    dayOfWeek: 3,
    description: "Wednesday deep-dive into one specific scam pattern currently targeting families",
  },
  family_cyber_tip: {
    name: "Family Cyber Tip",
    frequency: "weekly",
    dayOfWeek: 5,
    description: "Friday practical tip families can implement over the weekend",
  },
  myth_buster: {
    name: "Myth Buster Monday",
    frequency: "weekly",
    dayOfWeek: 1,
    description: "Monday myth-busting post that corrects a common cybersecurity misconception",
  },
  learning_spotlight: {
    name: "Learning Spotlight",
    frequency: "weekly",
    dayOfWeek: 3,
    description: "Wednesday spotlight on a free or affordable cybersecurity or AI learning opportunity — real courses, certifications, workshops, and career resources",
  },
  ai_skills_weekly: {
    name: "AI Skills Weekly",
    frequency: "weekly",
    dayOfWeek: 6,
    description: "Saturday spotlight on AI literacy — free courses, practical AI skills, and understanding AI safety for families",
  },
};

interface LearningResource {
  name: string;
  provider: string;
  url: string;
  cost: string;
  audience: string;
  category: string;
  description: string;
}

const LEARNING_RESOURCE_CATALOG: LearningResource[] = [
  {
    name: "Certified in Cybersecurity (CC)",
    provider: "ISC2",
    url: "https://www.isc2.org/landing/1mcc",
    cost: "Free (exam + training)",
    audience: "Career changers, beginners",
    category: "certification",
    description: "ISC2 is offering free self-paced training and a free exam voucher for their entry-level cybersecurity certification to 1 million people. No prior experience required. Covers security principles, business continuity, access controls, and network security.",
  },
  {
    name: "Google Cybersecurity Professional Certificate",
    provider: "Google / Coursera",
    url: "https://grow.google/certificates/cybersecurity/",
    cost: "Free trial, then $49/month (completable in under 6 months)",
    audience: "Beginners, career changers",
    category: "certification",
    description: "Google-designed program covering Linux, Python, SQL, SIEM tools, and incident response. Recognized by 150+ employers. Includes hands-on labs and a portfolio project. Financial aid available.",
  },
  {
    name: "CISA Cybersecurity Awareness Program",
    provider: "CISA (U.S. Government)",
    url: "https://www.cisa.gov/resources-tools/programs/cisa-cybersecurity-awareness-program",
    cost: "Free",
    audience: "Families, individuals, communities",
    category: "awareness",
    description: "The official U.S. government cybersecurity awareness initiative with toolkits, tip sheets, and resources for individuals, families, and organizations. Includes Cybersecurity Awareness Month materials.",
  },
  {
    name: "CISA Learning Platform",
    provider: "CISA / NICCS",
    url: "https://niccs.cisa.gov/training/cisa-learning",
    cost: "Free",
    audience: "Public, veterans, government workers",
    category: "training",
    description: "Free on-demand cybersecurity courses from the U.S. government covering cloud security, ethical hacking, risk management, malware analysis, and more. Beginner to advanced levels. Accessible via Login.gov.",
  },
  {
    name: "Elements of AI",
    provider: "University of Helsinki / MinnaLearn",
    url: "https://www.elementsofai.com",
    cost: "Free (including certificate)",
    audience: "Everyone, families, beginners",
    category: "ai_literacy",
    description: "One of the world's most popular free AI courses. No coding required. Covers what AI is, how it works, and its impact on daily life. Free certificate upon completion. Available in 25+ languages.",
  },
  {
    name: "Microsoft AI Fundamentals (AI-900)",
    provider: "Microsoft Learn",
    url: "https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/",
    cost: "Free (training + badge)",
    audience: "Beginners, professionals",
    category: "ai_literacy",
    description: "Free self-paced learning path covering AI concepts, machine learning, computer vision, and natural language processing. Earns a Microsoft badge. Great preparation for the AI-900 certification exam.",
  },
  {
    name: "Google Generative AI Learning Path",
    provider: "Google Cloud Skills Boost",
    url: "https://cloudskillsboost.google/paths/118",
    cost: "Free (with free badges)",
    audience: "Everyone",
    category: "ai_literacy",
    description: "Google's curated path to understanding generative AI, large language models, and responsible AI. Includes intro courses on Gemini, prompt design, and AI ethics. Free skill badges upon completion.",
  },
  {
    name: "CS50's Introduction to AI with Python",
    provider: "Harvard / edX",
    url: "https://cs50.harvard.edu/ai",
    cost: "Free (audit), paid certificate available",
    audience: "Intermediate learners, teens interested in CS",
    category: "ai_technical",
    description: "Harvard's famous introductory AI course covering search algorithms, machine learning, neural networks, and natural language processing. Self-paced with hands-on Python projects.",
  },
  {
    name: "AI for Everyone",
    provider: "DeepLearning.AI / Coursera",
    url: "https://www.coursera.org/learn/ai-for-everyone",
    cost: "Free (audit)",
    audience: "Non-technical, families, professionals",
    category: "ai_literacy",
    description: "Andrew Ng's highly rated course explaining AI in plain language. No coding required. Covers what AI can and cannot do, how to spot AI opportunities, and navigating ethical considerations. Approximately 6 hours.",
  },
  {
    name: "NICCS Training Catalog",
    provider: "CISA / NICCS",
    url: "https://niccs.cisa.gov/training/catalog",
    cost: "Free and paid options",
    audience: "All skill levels",
    category: "training",
    description: "Over 2,000 cybersecurity courses searchable by skill level, topic, and cost. Includes courses mapped to the NICE Framework for career development. Many free options available.",
  },
  {
    name: "National Cybersecurity Alliance Resources",
    provider: "National Cybersecurity Alliance",
    url: "https://staysafeonline.org",
    cost: "Free",
    audience: "Families, individuals, businesses",
    category: "awareness",
    description: "Stay Safe Online provides free resources, toolkits, and educational content for individuals and families. Runs Cybersecurity Awareness Month and Data Privacy Day campaigns with actionable guides.",
  },
  {
    name: "Cybersecurity & Infrastructure Security Training",
    provider: "CISA",
    url: "https://www.cisa.gov/cybersecurity-training-exercises",
    cost: "Free",
    audience: "Beginners, organizations",
    category: "training",
    description: "Free tabletop exercises, incident response training, and hands-on cybersecurity exercises from the U.S. government's cybersecurity agency. Practical, scenario-based learning.",
  },
  {
    name: "CyberStart (SANS Foundation for Young People)",
    provider: "SANS Institute",
    url: "https://www.sans.org/cyberstart/",
    cost: "Free for eligible students",
    audience: "High school and college students",
    category: "youth",
    description: "SANS-backed gamified cybersecurity challenges designed for teens and young adults. Includes real-world hacking scenarios, cryptography puzzles, and digital forensics. Scholarships and prizes available.",
  },
  {
    name: "FreeAcademy.ai",
    provider: "FreeAcademy.ai",
    url: "https://freeacademy.ai",
    cost: "Free (including certificate)",
    audience: "Complete beginners",
    category: "ai_literacy",
    description: "Weekend-friendly AI course (approximately 6 hours). Covers AI essentials with no coding or technical background required. Includes a free certificate of completion.",
  },
  {
    name: "Khan Academy: AI for Education",
    provider: "Khan Academy",
    url: "https://www.khanacademy.org/computing/intro-to-ai",
    cost: "Free",
    audience: "Students, families, educators",
    category: "ai_literacy",
    description: "Khan Academy's free AI introduction for learners of all ages. Covers how AI works, its applications in daily life, and responsible AI use. Designed for non-technical audiences.",
  },
  {
    name: "CompTIA Security+ Study Resources",
    provider: "CompTIA / Various",
    url: "https://www.comptia.org/certifications/security",
    cost: "Exam fee applies, many free study resources available",
    audience: "Career changers, IT professionals",
    category: "certification",
    description: "The most widely recognized entry-level security certification globally. While the exam has a fee, free study guides, practice tests, and community resources are widely available. Valued by employers worldwide.",
  },
];

function getETDayOfWeek(): number {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
  });
  const weekday = formatter.format(new Date());
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return map[weekday] ?? new Date().getDay();
}

async function hasSeriesPostThisWeek(seriesType: SeriesType): Promise<boolean> {
  try {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const contentTypeKey = `series_${seriesType}`;

    const [published, drafts] = await Promise.all([
      storage.getSocialPosts("published", 50),
      storage.getSocialPosts("draft", 50),
    ]);
    const allPosts = [...published, ...drafts];

    return allPosts.some(p => {
      if (p.contentType !== contentTypeKey) return false;
      const postTime = new Date(p.publishedAt || p.createdAt || 0).getTime();
      return postTime > oneWeekAgo;
    });
  } catch {
    return false;
  }
}

export function getTodaysSeries(): SeriesType[] {
  const dayOfWeek = getETDayOfWeek();
  return (Object.entries(SERIES_CONFIGS) as [SeriesType, SeriesConfig][])
    .filter(([, config]) => config.dayOfWeek === dayOfWeek)
    .map(([type]) => type);
}

async function gatherSeriesContext(seriesType: SeriesType): Promise<string> {
  const parts: string[] = [];

  if (seriesType === "weekly_threat_brief") {
    const alerts = await storage.getPublishedThreatAlerts(undefined, 10);
    if (alerts.length > 0) {
      parts.push("RECENT THREAT ALERTS (past week):");
      for (const a of alerts.slice(0, 7)) {
        parts.push(`- ${a.threatName} (${a.threatCategory}, ${a.riskLevel}) https://www.getcyberright.com/alerts/${a.slug}`);
      }
    }
    const posts = await storage.getSocialPosts("published", 20);
    const weekPosts = posts.filter(p => {
      if (!p.publishedAt) return false;
      return Date.now() - new Date(p.publishedAt).getTime() < 7 * 24 * 60 * 60 * 1000;
    });
    if (weekPosts.length > 0) {
      parts.push("\nTOPICS COVERED THIS WEEK:");
      for (const p of weekPosts.slice(0, 10)) {
        parts.push(`- ${p.title || p.postContent.slice(0, 60)}`);
      }
    }
  }

  if (seriesType === "scam_of_the_week") {
    const scams = await storage.getPublishedScamIntel(undefined, 5);
    if (scams.length > 0) {
      parts.push("LATEST SCAM INTELLIGENCE:");
      for (const s of scams.slice(0, 5)) {
        parts.push(`- ${s.scamName} (${s.scamCategory}) https://www.getcyberright.com/scam-intel/${s.slug}`);
      }
    }
  }

  if (seriesType === "family_cyber_tip") {
    const guides = await storage.getPublishedGuides(undefined, 10);
    if (guides.length > 0) {
      parts.push("AVAILABLE GUIDES (link to the most relevant):");
      for (const g of guides.slice(0, 8)) {
        parts.push(`- "${g.title}" (${g.category}) https://www.getcyberright.com/guides/${g.slug}`);
      }
    }
  }

  if (seriesType === "learning_spotlight") {
    const cyberResources = LEARNING_RESOURCE_CATALOG.filter(r =>
      ["certification", "training", "awareness", "youth"].includes(r.category)
    );
    const shuffled = cyberResources.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    parts.push("CURATED LEARNING OPPORTUNITIES (pick ONE to spotlight this week):");
    for (const r of selected) {
      parts.push(`- ${r.name} by ${r.provider} | Cost: ${r.cost} | Audience: ${r.audience}`);
      parts.push(`  ${r.description}`);
      parts.push(`  Link: ${r.url}`);
    }
    parts.push("\nGetCyberRight Training Academy: https://www.getcyberright.com/training");
  }

  if (seriesType === "ai_skills_weekly") {
    const aiResources = LEARNING_RESOURCE_CATALOG.filter(r =>
      ["ai_literacy", "ai_technical"].includes(r.category)
    );
    const shuffled = aiResources.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    parts.push("AI LEARNING RESOURCES (pick ONE to spotlight this week):");
    for (const r of selected) {
      parts.push(`- ${r.name} by ${r.provider} | Cost: ${r.cost} | Audience: ${r.audience}`);
      parts.push(`  ${r.description}`);
      parts.push(`  Link: ${r.url}`);
    }
    parts.push("\nGetCyberRight AI Safety Training: https://www.getcyberright.com/training");
  }

  return parts.join("\n");
}

export async function generateSeriesPost(seriesType: SeriesType): Promise<{ linkedin: string; facebook: string } | null> {
  const config = SERIES_CONFIGS[seriesType];
  if (!config) return null;

  const alreadyPosted = await hasSeriesPostThisWeek(seriesType);
  if (alreadyPosted) {
    console.log(`[ContentSeries] ${config.name} already posted this week, skipping`);
    return null;
  }

  const context = await gatherSeriesContext(seriesType);
  const isLearningSeriesType = seriesType === "learning_spotlight" || seriesType === "ai_skills_weekly";

  const learningSystemPrompt = `You are the editorial voice of GetCyberRight, a trusted family-focused cybersecurity education platform. You are CISM-certified and passionate about helping everyday people build cybersecurity and AI skills.

SERIES: "${config.name}"
DESCRIPTION: ${config.description}

YOUR MISSION: Help people discover real learning opportunities. Be the friend who says "Hey, did you know this exists? And it is totally free."

RULES:
- Write as someone who genuinely wants to help people grow, not as a marketer
- Use first person occasionally ("I just completed this myself...", "One of the best free resources I have found...")
- NEVER fabricate course details, pricing, or availability. Only reference resources from the provided context
- NEVER use contractions, em dashes, markdown formatting, or hashtags on LinkedIn/Facebook
- NEVER use "stay safe out there", "game-changer", "in today's digital landscape"
- Keep LinkedIn posts under 80 words with multiple paragraph breaks
- Keep Facebook posts under 60 words
- MUST include the direct link to the learning resource (external links are encouraged and expected)
- Focus on ONE resource per post. Go deep, not wide
- Lead with the opportunity, not the threat. "You can earn a cybersecurity certification for free" not "Cyber threats are increasing so you need to learn"
- Mention specific details: cost (or that it is free), time commitment, who it is for, what you will learn
- End with the direct link to the resource on its own line

FORMATTING:
- No ** bold **, no # headings, no bullet markers
- Multiple \\n\\n paragraph breaks required
- First 2 lines must work as a standalone hook
- The resource link MUST appear on its own line

Respond in JSON format:
{
  "linkedin": "post content",
  "facebook": "post content",
  "title": "short title for internal tracking"
}`;

  const defaultSystemPrompt = `You are the editorial voice of GetCyberRight, a trusted family-focused cybersecurity authority. You are CISM-certified and write with confident expertise.

SERIES: "${config.name}"
DESCRIPTION: ${config.description}

RULES:
- Write as an expert analyst, not a news aggregator
- Use first person occasionally ("In my experience...", "What concerns me about this...")
- NEVER fabricate statistics. Only reference information from the provided context
- NEVER use contractions, em dashes, markdown formatting, or hashtags on LinkedIn/Facebook
- NEVER use "stay safe out there", "game-changer", "wake-up call", or "in today's digital landscape"
- Keep LinkedIn posts under 80 words with multiple paragraph breaks
- Keep Facebook posts under 60 words
- End with a link to the most relevant GetCyberRight page
- ALL links must use https://www.getcyberright.com/...

FORMATTING:
- No ** bold **, no # headings, no bullet markers
- Multiple \\n\\n paragraph breaks required
- First 2 lines must work as a standalone hook

Respond in JSON format:
{
  "linkedin": "post content",
  "facebook": "post content",
  "title": "short title for internal tracking"
}`;

  const learningPages = `
EXTERNAL RESOURCES (you may link directly to these):
- ISC2 Free Certification: https://www.isc2.org/landing/1mcc
- Google Cybersecurity Cert: https://grow.google/certificates/cybersecurity/
- Microsoft Learn: https://learn.microsoft.com/en-us/training/
- CISA Learning: https://niccs.cisa.gov/training/cisa-learning
- Elements of AI: https://www.elementsofai.com
- Google AI Learning Path: https://cloudskillsboost.google/paths/118
- AI for Everyone: https://www.coursera.org/learn/ai-for-everyone
- Harvard CS50 AI: https://cs50.harvard.edu/ai
- Khan Academy AI: https://www.khanacademy.org/computing/intro-to-ai
- FreeAcademy.ai: https://freeacademy.ai
- StaySafeOnline: https://staysafeonline.org

GETCYBERRIGHT PAGES:
- Training Academy: https://www.getcyberright.com/training
- News: https://www.getcyberright.com/news
- AI Safety Guide: https://www.getcyberright.com/ai-safety`;

  const defaultPages = `
KEY PAGES (only link to these):
- News: https://www.getcyberright.com/news
- Awareness Hub: https://www.getcyberright.com/awareness-hub
- Cyber Threat Radar: https://www.getcyberright.com/cyber-threat-radar
- GCR Scam Guard: https://www.getcyberright.com/scam-checker
- Kids Safety: https://www.getcyberright.com/kids
- Seniors Safety: https://www.getcyberright.com/seniors`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2000,
      system: isLearningSeriesType ? learningSystemPrompt : defaultSystemPrompt,
      messages: [{
        role: "user",
        content: `Create this week's "${config.name}" post.

DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

${context}
${isLearningSeriesType ? learningPages : defaultPages}

Write the ${config.name} content now.`,
      }],
    });

    const text = response.content[0]?.type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);

    let linkedin: string;
    let facebook: string;

    if (isLearningSeriesType) {
      linkedin = enforceAndSanitize(parsed.linkedin, "linkedin");
      facebook = enforceAndSanitize(parsed.facebook, "facebook");

      const hasExternalLink = /https?:\/\/(?!(?:www\.)?getcyberright\.com)[^\s]+/i;
      if (!hasExternalLink.test(linkedin)) {
        const fallbackResource = LEARNING_RESOURCE_CATALOG[Math.floor(Math.random() * LEARNING_RESOURCE_CATALOG.length)];
        linkedin += `\n\n${fallbackResource.url}`;
      }
      if (!hasExternalLink.test(facebook)) {
        const fallbackResource = LEARNING_RESOURCE_CATALOG[Math.floor(Math.random() * LEARNING_RESOURCE_CATALOG.length)];
        facebook += `\n\n${fallbackResource.url}`;
      }
    } else {
      const seriesCanonicalUrl = "https://www.getcyberright.com/news";
      linkedin = ensureGcrLink(enforceAndSanitize(tagAllGcrLinks(parsed.linkedin, `series_${seriesType}`, "linkedin"), "linkedin"), seriesCanonicalUrl, "linkedin", `series_${seriesType}`);
      facebook = ensureGcrLink(enforceAndSanitize(tagAllGcrLinks(parsed.facebook, `series_${seriesType}`, "facebook"), "facebook"), seriesCanonicalUrl, "facebook", `series_${seriesType}`);
    }

    const title = sanitizeContent(parsed.title || config.name);

    const seriesId = `${seriesType}_${new Date().toISOString().slice(0, 10)}`;
    const platforms = ["linkedin", "facebook"] as const;
    for (const platform of platforms) {
      const content = platform === "linkedin" ? linkedin : facebook;
      const draft: InsertSocialPost = {
        platform,
        postContent: content,
        status: "draft",
        contentType: `series_${seriesType}`,
        contentId: seriesId,
        contentTitle: title,
      };
      await storage.createSocialPost(draft);
    }

    console.log(`[ContentSeries] Generated ${config.name}: "${title}"`);
    return { linkedin, facebook };
  } catch (error: any) {
    console.error(`[ContentSeries] Failed to generate ${config.name}:`, error.message);
    return null;
  }
}

export async function checkAndGenerateSeriesPosts(): Promise<number> {
  const todaysSeries = getTodaysSeries();
  if (todaysSeries.length === 0) return 0;

  let generated = 0;
  for (const seriesType of todaysSeries) {
    const result = await generateSeriesPost(seriesType);
    if (result) generated++;
  }

  if (generated > 0) {
    console.log(`[ContentSeries] Generated ${generated} series post(s) today`);
  }
  return generated;
}
