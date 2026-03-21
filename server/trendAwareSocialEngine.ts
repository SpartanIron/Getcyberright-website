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

const CONTENT_MODES = [
  "breaking_insight",
  "preventative_education",
  "myth_debunking",
  "scenario_simulation",
  "tool_highlight",
] as const;

type ContentMode = (typeof CONTENT_MODES)[number];

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

const SOURCE_TIERS: Record<string, 1 | 2 | 3> = {
  "cisa": 1, "us-cert": 1, "nist": 1, "fbi": 1, "ftc": 1, "dhs": 1, "nsa": 1,
  "europol": 1, "ncsc": 1, "interpol": 1, "acsc": 1, "microsoft": 1, "google": 1,
  "apple": 1, "amazon": 1, "meta": 1, "cisco": 1, "palo alto": 1,
  "krebs on security": 2, "securityweek": 2, "the hacker news": 2,
  "dark reading": 2, "threatpost": 2, "ars technica": 2,
  "wired": 2, "zdnet": 2, "techcrunch": 2, "the record": 2, "cyberscoop": 2,
  "mandiant": 2, "crowdstrike": 2, "sophos": 2, "kaspersky": 2, "sentinelone": 2,
};

function getSourceTier(sourceName: string): 1 | 2 | 3 {
  const lower = sourceName.toLowerCase();
  for (const [key, tier] of Object.entries(SOURCE_TIERS)) {
    if (lower.includes(key)) return tier;
  }
  return 3;
}

function assessSourceCredibility(news: RawFeedItem[]): { tier1Count: number; tier2Count: number; tier3Count: number; highestTier: 1 | 2 | 3 } {
  let tier1Count = 0, tier2Count = 0, tier3Count = 0;
  let highestTier: 1 | 2 | 3 = 3;
  for (const item of news) {
    const tier = getSourceTier(item.source);
    if (tier === 1) { tier1Count++; if (highestTier > 1) highestTier = 1; }
    else if (tier === 2) { tier2Count++; if (highestTier > 2) highestTier = 2; }
    else tier3Count++;
  }
  return { tier1Count, tier2Count, tier3Count, highestTier };
}

const GCR_TOOLS: Record<string, { tool_name: string; how_it_connects: string; url: string }> = {
  phishing: {
    tool_name: "AI Scam Analyzer",
    how_it_connects: "Scans suspicious links and messages in real time to detect phishing attempts before you click",
    url: "https://www.getcyberright.com/scam-analyzer",
  },
  scam: {
    tool_name: "Scam Checker",
    how_it_connects: "Checks URLs, QR codes, and messages against multiple threat intelligence databases",
    url: "https://www.getcyberright.com/scam-checker",
  },
  password: {
    tool_name: "Password Generator",
    how_it_connects: "Creates strong, unique passwords that resist brute-force and credential stuffing attacks",
    url: "https://www.getcyberright.com/password-generator",
  },
  breach: {
    tool_name: "Breach Monitor",
    how_it_connects: "Monitors your email addresses against known data breaches so you can act fast",
    url: "https://www.getcyberright.com/breach-monitor",
  },
  data_broker: {
    tool_name: "Data Broker Removal",
    how_it_connects: "Finds and removes your personal information from data broker databases to reduce exposure",
    url: "https://www.getcyberright.com/data-broker-removal",
  },
  kids: {
    tool_name: "Kids Safety Hub",
    how_it_connects: "Age-appropriate cybersecurity education and parental controls guidance",
    url: "https://www.getcyberright.com/kids-safety",
  },
  identity: {
    tool_name: "Identity Theft Recovery Guide",
    how_it_connects: "Step-by-step recovery plan if your identity has been compromised",
    url: "https://www.getcyberright.com/guides/identity-theft-recovery",
  },
  malware: {
    tool_name: "Cyber Threat Radar",
    how_it_connects: "Real-time threat intelligence dashboard showing active malware campaigns and advisories",
    url: "https://www.getcyberright.com/cyber-threat-radar",
  },
  senior: {
    tool_name: "Senior Safety Hub",
    how_it_connects: "Tailored cybersecurity guidance for older adults, the most targeted demographic",
    url: "https://www.getcyberright.com/seniors-safety",
  },
};

function mapTopicToGCRTool(title: string, content: string): { tool_name: string; how_it_connects: string; url: string } | null {
  const combined = (title + " " + content).toLowerCase();
  const keywords: Record<string, string[]> = {
    phishing: ["phishing", "phish", "spear-phishing", "smishing", "vishing", "social engineering", "fake email", "spoofed"],
    scam: ["scam", "fraud", "fake website", "impersonat", "romance scam", "pig butcher"],
    password: ["password", "credential", "brute force", "credential stuffing", "passkey", "authentication"],
    breach: ["breach", "leak", "exposed data", "compromised accounts", "data dump"],
    data_broker: ["data broker", "personal data", "privacy", "tracking", "surveillance"],
    kids: ["kids", "children", "child", "parental", "minor", "teen", "youth", "predator"],
    identity: ["identity theft", "identity fraud", "stolen identity", "synthetic identity"],
    malware: ["malware", "ransomware", "trojan", "worm", "botnet", "exploit", "zero-day", "vulnerability", "cve-"],
    senior: ["senior", "elderly", "older adult", "grandparent", "retirement", "medicare"],
  };

  for (const [category, terms] of Object.entries(keywords)) {
    if (terms.some((t) => combined.includes(t))) {
      return GCR_TOOLS[category];
    }
  }
  return null;
}

const PERFORMANCE_LOG_PATH = path.join(process.cwd(), ".local", "social-performance.json");

interface PerformanceEntry {
  date: string;
  title: string;
  category: string;
  contentMode: string;
  postStyle: string;
  urgencyScore: number;
  confidenceScore: number;
  recommendedAction: string;
  platforms: string[];
  published: boolean;
}

function loadPerformanceLog(): PerformanceEntry[] {
  try {
    if (fs.existsSync(PERFORMANCE_LOG_PATH)) {
      return JSON.parse(fs.readFileSync(PERFORMANCE_LOG_PATH, "utf-8"));
    }
  } catch {}
  return [];
}

function savePerformanceEntry(entry: PerformanceEntry): void {
  try {
    const log = loadPerformanceLog();
    log.push(entry);
    const trimmed = log.slice(-90);
    const dir = path.dirname(PERFORMANCE_LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PERFORMANCE_LOG_PATH, JSON.stringify(trimmed, null, 2));
  } catch (err: any) {
    console.error("[TrendEngine] Failed to save performance log:", err.message);
  }
}

function getRecentPerformanceSummary(): string {
  const log = loadPerformanceLog();
  if (log.length < 5) return "";
  const last30 = log.slice(-30);
  const categories: Record<string, number> = {};
  const modes: Record<string, number> = {};
  for (const entry of last30) {
    categories[entry.category] = (categories[entry.category] || 0) + 1;
    modes[entry.contentMode] = (modes[entry.contentMode] || 0) + 1;
  }
  const topCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  const topModes = Object.entries(modes).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k);
  return `\nLEARNING CONTEXT (recent 30 posts): Most covered categories: ${topCategories.join(", ")}. Most used modes: ${topModes.join(", ")}. Consider varying from these for freshness.`;
}

async function checkRateLimit(): Promise<boolean> {
  try {
    const recentPosts = await storage.getSocialPosts("published", 10);
    const today = new Date().toDateString();
    const todaysPosts = recentPosts.filter((p) => {
      if (!p.publishedAt) return false;
      return new Date(p.publishedAt).toDateString() === today;
    });
    const platformCounts: Record<string, number> = {};
    for (const post of todaysPosts) {
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    }
    const overLimit = Object.entries(platformCounts).some(([platform, count]) => {
      if (count >= 1) {
        console.log(`[TrendEngine] Rate limit: ${platform} already has ${count} post(s) today (max 1/day), skipping`);
        return true;
      }
      return false;
    });
    return !overLimit;
  } catch {
    return true;
  }
}

interface TrendAnalysis {
  summary: string;
  category: string;
  urgency_score: number;
  impact_level: "low" | "medium" | "high";
  audience: string;
}

interface Visual {
  type: "story" | "educational" | "product_ui";
  description: string;
  text_overlay: string;
}

interface TrendAwarePostResult {
  linkedin: string;
  facebook: string;
  title: string;
  hashtags: string[];
  imageHeadline: string;
  imageSubtext: string;
  trendAnalysis: TrendAnalysis;
  visuals: Visual[];
  gcrToolReference: { tool_name: string; how_it_connects: string; url: string } | null;
  contentMode: ContentMode;
  confidenceScore: number;
  recommendedAction: "auto_publish" | "review";
  sourceValidation: { tier1Count: number; tier2Count: number; tier3Count: number; highestTier: 1 | 2 | 3 };
}

function enforcePostFormatting(text: string, platform: string): string {
  let cleaned = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^#+\s/gm, "").replace(/^[-•]\s/gm, "");
  cleaned = cleaned.replace(/\u2014/g, ",").replace(/\u2013/g, ",");

  const paragraphs = cleaned.split(/\n\n+/).filter(p => p.trim());

  if (paragraphs.length < 3) {
    const sentences = cleaned.replace(/\n/g, " ").split(/(?<=[.!?])\s+/).filter(s => s.trim());
    const reformatted: string[] = [];

    if (platform === "linkedin") {
      if (sentences.length >= 2) {
        reformatted.push(sentences.slice(0, 2).join(" "));
      } else if (sentences.length === 1) {
        reformatted.push(sentences[0]);
      }
      for (let i = 2; i < sentences.length; i += 2) {
        reformatted.push(sentences.slice(i, i + 2).join(" "));
      }
    } else {
      for (let i = 0; i < sentences.length; i += 3) {
        reformatted.push(sentences.slice(i, i + 3).join(" "));
      }
    }

    cleaned = reformatted.join("\n\n");
    console.log(`[TrendEngine] Reformatted ${platform} post: split wall of text into ${reformatted.length} paragraphs`);
  }

  if (platform === "linkedin") {
    const words = cleaned.split(/\s+/).length;
    if (words > 220) {
      const allParagraphs = cleaned.split(/\n\n+/);
      let wordCount = 0;
      const trimmed: string[] = [];
      for (const p of allParagraphs) {
        const pWords = p.split(/\s+/).length;
        if (wordCount + pWords > 200 && trimmed.length >= 3) break;
        trimmed.push(p);
        wordCount += pWords;
      }
      cleaned = trimmed.join("\n\n");
      console.log(`[TrendEngine] Trimmed ${platform} post from ${words} to ~${wordCount} words`);
    }
  }

  return cleaned.trim();
}

async function generateTrendAwarePost(
  trendingNews: RawFeedItem[],
  relevantGuides: { title: string; slug: string; category: string; tags: string[] }[],
  recentlyPublishedTitles: string[],
  postStyle: PostStyle,
  sourceCredibility: { tier1Count: number; tier2Count: number; tier3Count: number; highestTier: 1 | 2 | 3 }
): Promise<TrendAwarePostResult | null> {
  const newsContext = trendingNews
    .slice(0, 8)
    .map((item, i) => {
      const tier = getSourceTier(item.source);
      const tierLabel = tier === 1 ? "Tier 1 (gov/official)" : tier === 2 ? "Tier 2 (established pub)" : "Tier 3 (unverified)";
      return `[${i + 1}] ${item.source} [${tierLabel}]: "${item.title}"\n   ${item.summary}\n   Published: ${item.pubDate || "recent"}`;
    })
    .join("\n\n");

  const guideContext = relevantGuides
    .slice(0, 10)
    .map((g) => `- "${g.title}" (${g.category}) https://www.getcyberright.com/guides/${g.slug}`)
    .join("\n");

  const recentPostsContext =
    recentlyPublishedTitles.length > 0
      ? `\nPOSTS PUBLISHED IN THE LAST 7 DAYS (do NOT repeat these topics or use similar structures):\n${recentlyPublishedTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const performanceContext = getRecentPerformanceSummary();

  const sourceValidationContext = `\nSOURCE CREDIBILITY SUMMARY: ${sourceCredibility.tier1Count} Tier 1 (government/official), ${sourceCredibility.tier2Count} Tier 2 (established publications), ${sourceCredibility.tier3Count} Tier 3 (unverified). ${sourceCredibility.highestTier === 3 ? "WARNING: No high-credibility sources available. Downgrade urgency and frame claims as emerging/unverified." : ""}`;

  const styleInstructions: Record<PostStyle, string> = {
    expert_reaction: `WRITING STYLE: Expert Reaction. React to the biggest story as a CISM-certified professional would. Use first person ("As someone who works in cybersecurity..."). Share a specific professional insight that a layperson wouldn't know. Be direct and confident. Reference the specific technical details (CVE numbers, attack vectors, affected systems) but explain them in plain language. NO numbered tips list. Instead, give ONE concrete recommendation that shows deep expertise.`,

    one_insight: `WRITING STYLE: One Powerful Insight. Pick the most interesting story and share a SINGLE non-obvious insight about it. This post should be SHORT (3-5 sentences for LinkedIn, 2-3 for Facebook). The insight should be something surprising or counterintuitive. Think "Here is what everyone is missing about this story..." No tips, no lists, just one sharp observation that makes people think.`,

    myth_vs_reality: `WRITING STYLE: Myth vs Reality. Take a common misconception related to today's news and demolish it with specific facts. Structure it as: "Most people believe [myth]. The reality is [truth with evidence]." Be slightly provocative. Show expertise by citing the specific technical reason the myth is wrong. End with a strong declarative statement, NOT a question.`,

    story_based: `WRITING STYLE: Real Scenario Walkthrough. Take one of the threats from the news and walk through exactly how it would hit a real family. Use a specific scenario ("Imagine you get a text message that looks like it is from your bank..."). Make it vivid and concrete. Show the attack chain step by step. Then show how to break that chain with one specific action. Write like you are explaining this to a friend over coffee.`,

    hot_take: `WRITING STYLE: Strong Professional Opinion. Take a clear stance on something in the news. Be direct and slightly opinionated. Examples: "Stop telling people to change passwords every 90 days. Here is why that advice is outdated." or "This breach was entirely preventable. Here is the one thing they should have done." Show conviction backed by expertise. This is NOT about being controversial for clicks. It is about having a real expert opinion that goes against common wisdom.`,

    quick_breakdown: `WRITING STYLE: Quick Technical Breakdown. Take a complex threat from the news and break it down into the simplest possible explanation. Use an analogy from everyday life. Structure: "What happened (1 sentence). How it works (analogy). Why you should care (1 sentence). What to do (1 specific action)." Keep it extremely concise. LinkedIn under 150 words. Facebook under 80 words.`,

    did_you_know: `WRITING STYLE: Surprising Fact. Lead with a genuinely surprising fact from the news feed. Something that makes people stop scrolling. Then connect it to practical relevance. Keep it short and punchy. The fact MUST come directly from the news feed or be verifiable public knowledge. End with a brief actionable takeaway, not a question.`,
  };

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 3500,
      system: `You are an autonomous Cyber Intelligence Content Engine for GetCyberRight, a trusted family-focused cybersecurity education platform founded by a CISM-certified security professional.

Your role is to monitor, interpret, validate, and transform cybersecurity trends into high-quality, trustworthy, and actionable social media content. You must prioritize accuracy, clarity, and trust over speed.

FULL INTELLIGENCE PIPELINE (execute every step internally before writing):

STEP 1 - SIGNAL INTERPRETATION:
- Summarize what is happening in simple terms
- Classify into: phishing_scam, data_breach, malware, ai_threat, social_engineering, privacy, vulnerability, or general_awareness

STEP 2 - SOURCE VALIDATION (CRITICAL):
- Each news item is labeled with its source credibility tier
- Tier 1 (highest trust): Government agencies (CISA, FBI, NIST), official company statements
- Tier 2: Established cybersecurity publications (Krebs, BleepingComputer, Dark Reading)
- Tier 3: Social media, unverified reports, unknown sources
- RULES: Require at least 2 independent sources for high-risk claims. If only Tier 3 sources exist, frame as emerging/unverified, not confirmed fact. If confidence is low, downgrade urgency_score

STEP 3 - RELEVANCE FILTER:
- Is this relevant to families, seniors, kids, everyday users, or small businesses?
- If NOT relevant to these audiences, select a different story from the feed

STEP 4 - RISK SCORING:
- Assign urgency_score (1-5) and impact_level (low/medium/high)
- Identify ONE primary affected_audience: families, kids, seniors, professionals, or small_businesses
- Only proceed if urgency_score >= 3 OR strong relevance to target audience

STEP 5 - INSIGHT GENERATION:
- What actually matters here for real people?
- What will people misunderstand?
- Where is the real behavioral risk?
- Focus on human consequences, not technical details
- Prioritize clarity over completeness

STEP 6 - CONTENT MODE SELECTION:
- Select the most appropriate mode: breaking_insight, preventative_education, myth_debunking, scenario_simulation, or tool_highlight
- If urgency_score >= 4, force breaking_insight mode
- The WRITING STYLE instruction determines HOW to write. The content mode determines WHAT angle to take

STEP 7 - CONTENT CREATION:
- Follow the specific WRITING STYLE instruction provided below
- Post structure should flow naturally: hook (urgent but credible, no clickbait) > what happened (clear explanation) > why it matters (real-world impact) > what to do (2-4 specific, executable actions, no vague advice) > GetCyberRight connection (natural, only if relevant) > calm closing (reassuring, confident)
- Not every post needs all elements. The WRITING STYLE takes priority
- EVERY post must include at least 2 specific, practical, immediately actionable steps. No vague advice like "be careful" or "stay vigilant"

STEP 8 - VISUAL PLANNING:
- Suggest 1-2 visuals: story (real-life situation), educational (simple breakdown), or product_ui (GetCyberRight feature)
- Keep visuals simple, realistic, not cluttered

STEP 9 - PRODUCT MAPPING:
- Map to a relevant GetCyberRight feature ONLY if genuinely justified
- Available: AI Scam Analyzer, Scam Checker, Password Generator, Breach Monitor, Data Broker Removal, Kids Safety Hub, Senior Safety Hub, Cyber Threat Radar, Identity Theft Recovery Guide
- Do NOT force product mentions

STEP 10 - VALIDATION LAYER:
- Is the information credible and supported by reliable sources?
- Does the post avoid panic and fear tactics?
- Does it provide clear, actionable guidance?
- Is it understandable by a non-technical audience?
- If ANY check fails, revise before output

STEP 11 - CONFIDENCE SCORING:
- Score 0-100 based on: source reliability, completeness of information, clarity of risk
- If confidence_score < 70: set recommended_action to "review" (do NOT auto-publish)
- If confidence_score >= 70: set recommended_action to "auto_publish"

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
- When referencing news, attribute it naturally (e.g. "CISA just flagged...", "Krebs reported...")
- If unsure whether something is factual, leave it out
- No em dashes. No speculation presented as fact. No hype or exaggeration

VOICE AND PERSONALITY:
- Confident and direct, never wishy-washy
- Occasionally use first person ("In my experience...", "What I find concerning is...")
- Have opinions. Do not hedge everything with "might" and "could"
- Sound like a real person, not a content generator
- Vary your sentence length. Mix short punchy sentences with longer explanations
- NO formulaic structures. Each post should feel different from the last
- Reference specific technical details casually, then explain them simply
- Write like a trusted human, not a marketer
- Emphasize behavior over technology. Build trust, not fear

FORMATTING (CRITICAL, STRICTLY ENFORCED):
- NEVER use markdown: no ** bold **, no * italics *, no ## headings, no bullet markers (- or *)
- NEVER use em dashes (use commas, colons, semicolons, or periods instead)
- Every post MUST have multiple \\n\\n paragraph breaks in the JSON output
- LinkedIn: Maximum 5-7 short paragraphs, each 1-2 sentences. NEVER a single block of text
- The first 2 lines MUST stand alone as a hook (before LinkedIn's "see more" cutoff)
- After the hook, insert a \\n\\n break
- Keep paragraphs to 1-2 sentences maximum. One sentence per paragraph is preferred
- If using numbered items, put each on its OWN line with a \\n\\n between them
- White space is critical. A wall of text = automatic failure. If you produce a single unbroken paragraph, you have failed
- LinkedIn posts that exceed 200 words = failure. Be concise. Cut ruthlessly

WHAT NOT TO DO:
- Do not end every post with a question. Sometimes end with a strong statement
- Do not say "Here are 3 things you can do right now" every time
- Do not use "Stay safe out there" or similar platitudes
- Do not start posts with "Breaking:" or use fake urgency or clickbait
- Do not use emojis excessively (0-2 per post max)
- Do not use: "game-changer", "wake-up call", "in today's digital landscape", "cyber hygiene"

PLATFORM OPTIMIZATION:
- LinkedIn: concise, sharp, insight-driven. Strong opening lines. Tighter structure
- Facebook: more conversational, slightly longer storytelling, warmer tone

GOAL: Position GetCyberRight as the most trusted, human-centered cybersecurity authority for everyday users navigating modern digital risks. Content must be immediately publishable to Buffer without edits.`,
      messages: [
        {
          role: "user",
          content: `Run the full 11-step intelligence pipeline and create today's social media content for GetCyberRight.

DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

${styleInstructions[postStyle]}

CURRENT CYBERSECURITY NEWS FEED (with source credibility tiers):
${newsContext}
${sourceValidationContext}

GETCYBERRIGHT GUIDES (reference when naturally relevant):
${guideContext}
${recentPostsContext}
${performanceContext}

Execute ALL steps of your intelligence pipeline (Signal Interpretation, Source Validation, Relevance Filter, Risk Scoring, Insight Generation, Content Mode Selection, Content Creation, Visual Planning, Product Mapping, Validation, Confidence Scoring), then output:

LINKEDIN POST (120-180 words max, STRICTLY ENFORCED):
- Professional audience, both technical and non-technical
- Structure MUST be: Hook (1-2 punchy lines) \\n\\n Body (3-4 short paragraphs) \\n\\n CTA or closing thought
- First 2 lines are everything. They appear before "see more". Make them count
- Each paragraph: 1-2 sentences MAX. Break after every thought
- Include 2-3 actionable steps, each on its own line
- End with either a question OR a strong statement (vary this)
- The post MUST contain at least 4 paragraph breaks (\\n\\n)

FACEBOOK POST (60-120 words max):
- Conversational, like talking to a neighbor
- Warmer tone, slightly longer storytelling
- 2-3 specific actionable steps
- Use paragraph breaks between thoughts

Format your complete output as this strict JSON with \\n for line breaks within post text:
{
  "linkedin": "Post text with \\n\\n between paragraphs",
  "facebook": "Post text with \\n\\n between paragraphs",
  "title": "Short tracking title under 60 chars",
  "hashtags": ["tag1", "tag2", "tag3", "tag4"],
  "imageHeadline": "Under 8 words for branded image card",
  "imageSubtext": "Supporting detail under 15 words",
  "content_mode": "breaking_insight | preventative_education | myth_debunking | scenario_simulation | tool_highlight",
  "trend_analysis": {
    "summary": "One-sentence summary of the signal",
    "category": "phishing_scam | data_breach | malware | ai_threat | social_engineering | privacy | vulnerability | general_awareness",
    "urgency_score": 3,
    "impact_level": "low | medium | high",
    "audience": "families | kids | seniors | professionals | small_businesses"
  },
  "visuals": [
    {
      "type": "story | educational | product_ui",
      "description": "What the visual shows",
      "text_overlay": "Optional short text for the visual"
    }
  ],
  "gcr_tool_reference": {
    "tool_name": "Name of relevant GetCyberRight tool",
    "how_it_connects": "One sentence on why this tool helps"
  },
  "confidence_score": 85,
  "recommended_action": "auto_publish | review"
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

    parsed.linkedin = enforcePostFormatting(parsed.linkedin, "linkedin");
    parsed.facebook = enforcePostFormatting(parsed.facebook, "facebook");

    const trendAnalysis: TrendAnalysis = parsed.trend_analysis
      ? {
          summary: String(parsed.trend_analysis.summary || ""),
          category: String(parsed.trend_analysis.category || "general_awareness"),
          urgency_score: Math.min(5, Math.max(1, Number(parsed.trend_analysis.urgency_score) || 3)),
          impact_level: (["low", "medium", "high"].includes(parsed.trend_analysis.impact_level)
            ? parsed.trend_analysis.impact_level
            : "medium") as "low" | "medium" | "high",
          audience: String(parsed.trend_analysis.audience || "families"),
        }
      : { summary: parsed.title, category: "general_awareness", urgency_score: 3, impact_level: "medium" as const, audience: "families" };

    if (trendAnalysis.urgency_score < 3 && trendAnalysis.impact_level === "low") {
      console.log(`[TrendEngine] Signal below threshold: urgency=${trendAnalysis.urgency_score}, impact=${trendAnalysis.impact_level}. Skipping.`);
      return null;
    }

    let confidenceScore = Math.min(100, Math.max(0, Number(parsed.confidence_score) || 75));
    if (sourceCredibility.highestTier === 3) {
      confidenceScore = Math.min(confidenceScore, 60);
    }
    if (sourceCredibility.tier1Count === 0 && sourceCredibility.tier2Count <= 1) {
      confidenceScore = Math.min(confidenceScore, 65);
    }

    const recommendedAction: "auto_publish" | "review" =
      confidenceScore >= 70 ? "auto_publish" : "review";

    const contentMode: ContentMode =
      trendAnalysis.urgency_score >= 4
        ? "breaking_insight"
        : (CONTENT_MODES.includes(parsed.content_mode as ContentMode)
            ? (parsed.content_mode as ContentMode)
            : "preventative_education");

    const visuals: Visual[] = Array.isArray(parsed.visuals)
      ? parsed.visuals.slice(0, 2).map((v: any) => ({
          type: (["story", "educational", "product_ui"].includes(v.type) ? v.type : "educational") as Visual["type"],
          description: String(v.description || ""),
          text_overlay: String(v.text_overlay || ""),
        }))
      : [];

    let imageHeadline = sanitizePostContent(parsed.imageHeadline || parsed.title);
    if (imageHeadline.length > 50) imageHeadline = imageHeadline.slice(0, 47) + "...";

    let imageSubtext = sanitizePostContent(parsed.imageSubtext || "getcyberright.com");
    if (imageSubtext.length > 80) imageSubtext = imageSubtext.slice(0, 77) + "...";

    const hashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags.slice(0, 8) : [];

    const linkedinContent = sanitizePostContent(parsed.linkedin);
    const facebookContent = sanitizePostContent(parsed.facebook);

    let gcrToolReference = parsed.gcr_tool_reference
      ? {
          tool_name: String(parsed.gcr_tool_reference.tool_name || ""),
          how_it_connects: String(parsed.gcr_tool_reference.how_it_connects || ""),
          url: "",
        }
      : null;

    if (!gcrToolReference) {
      gcrToolReference = mapTopicToGCRTool(parsed.title, linkedinContent);
    }
    if (gcrToolReference && !gcrToolReference.url) {
      const matched = Object.values(GCR_TOOLS).find(
        (t) => t.tool_name.toLowerCase() === gcrToolReference!.tool_name.toLowerCase()
      );
      if (matched) gcrToolReference.url = matched.url;
    }

    console.log(
      `[TrendEngine] Pipeline complete: mode=${contentMode}, category=${trendAnalysis.category}, urgency=${trendAnalysis.urgency_score}, impact=${trendAnalysis.impact_level}, confidence=${confidenceScore}, action=${recommendedAction}${gcrToolReference ? `, tool=${gcrToolReference.tool_name}` : ""}`
    );

    return {
      linkedin: linkedinContent,
      facebook: facebookContent,
      title: sanitizePostContent(parsed.title).slice(0, 80),
      hashtags,
      imageHeadline,
      imageSubtext,
      trendAnalysis,
      visuals,
      gcrToolReference,
      contentMode,
      confidenceScore,
      recommendedAction,
      sourceValidation: sourceCredibility,
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

function selectTemplateForTrend(trendAnalysis: TrendAnalysis, contentMode: ContentMode, fallback: TemplateStyle): TemplateStyle {
  if (trendAnalysis.urgency_score >= 4 || trendAnalysis.impact_level === "high") {
    return "alert_card";
  }
  if (contentMode === "myth_debunking" || contentMode === "tool_highlight") {
    return "quote_card";
  }
  if (trendAnalysis.category === "data_breach" || trendAnalysis.category === "vulnerability") {
    return "stat_card";
  }
  if (contentMode === "preventative_education" || contentMode === "scenario_simulation") {
    return "tip_card";
  }
  if (trendAnalysis.category === "general_awareness" || trendAnalysis.category === "privacy") {
    return "insight_card";
  }
  return fallback;
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
      const opacity = 0.03 + (i % 7) * 0.01;
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

export async function generateAndPublishTrendAwarePosts(options?: { skipRateLimit?: boolean; platformFilter?: string }): Promise<{
  published: number;
  platforms: string[];
}> {
  const result = { published: 0, platforms: [] as string[] };

  try {
    if (!options?.skipRateLimit) {
      const withinRateLimit = await checkRateLimit();
      if (!withinRateLimit) {
        console.log("[TrendEngine] Rate limit reached (max 1 post per platform per day), skipping");
        return result;
      }
    } else {
      console.log("[TrendEngine] Rate limit bypassed (manual trigger)");
    }

    const channels = await getBufferChannelsByPlatform();
    const connectedPlatforms = Object.keys(channels);
    if (connectedPlatforms.length === 0) {
      console.log("[TrendEngine] No Buffer channels connected, skipping");
      return result;
    }

    const postStyle = getTodaysPostStyle();
    const defaultTemplate = getTodaysTemplate();
    console.log(`[TrendEngine] Today's style: ${postStyle}, default template: ${defaultTemplate}`);

    const [trendingNews, guides, recentPosts] = await Promise.all([
      fetchRealThreats(),
      storage.getPublishedGuides(undefined, 30),
      storage.getSocialPosts("published", 20),
    ]);

    if (trendingNews.length === 0) {
      console.warn("[TrendEngine] No trending news available");
      return result;
    }

    const sourceCredibility = assessSourceCredibility(trendingNews);
    console.log(
      `[TrendEngine] Source credibility: Tier 1=${sourceCredibility.tier1Count}, Tier 2=${sourceCredibility.tier2Count}, Tier 3=${sourceCredibility.tier3Count}`
    );

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
      `[TrendEngine] Running 11-step pipeline: ${trendingNews.length} signals, ${relevantGuides.length} guides`
    );

    const posts = await generateTrendAwarePost(
      trendingNews,
      relevantGuides,
      recentTitles,
      postStyle,
      sourceCredibility
    );

    if (!posts) {
      console.error("[TrendEngine] Pipeline produced no publishable content");
      return result;
    }

    if (posts.recommendedAction === "review") {
      console.warn(
        `[TrendEngine] Content flagged for review (confidence: ${posts.confidenceScore}). Saving as draft instead of publishing.`
      );
      for (const platform of ["linkedin", "facebook"] as const) {
        if (!channels[platform]) continue;
        const content = platform === "linkedin" ? posts.linkedin : posts.facebook;
        await storage.createSocialPost({
          contentType: "trend_insight",
          contentId: `trend-${Date.now()}-${platform}-review`,
          contentTitle: `[REVIEW] ${posts.title}`,
          platform,
          postContent: content,
          hashtags: posts.hashtags,
          status: "draft",
        });
      }

      savePerformanceEntry({
        date: new Date().toISOString(),
        title: posts.title,
        category: posts.trendAnalysis.category,
        contentMode: posts.contentMode,
        postStyle,
        urgencyScore: posts.trendAnalysis.urgency_score,
        confidenceScore: posts.confidenceScore,
        recommendedAction: "review",
        platforms: [],
        published: false,
      });

      console.log(`[TrendEngine] Draft saved for review: "${posts.title}" (confidence: ${posts.confidenceScore})`);
      return result;
    }

    const templateStyle = selectTemplateForTrend(posts.trendAnalysis, posts.contentMode, defaultTemplate);
    console.log(`[TrendEngine] Template: ${templateStyle} (mode: ${posts.contentMode}, urgency: ${posts.trendAnalysis.urgency_score})`);

    let imageUrl: string | null = null;
    const imagePath = await generatePostImage(posts.imageHeadline, posts.imageSubtext, templateStyle);
    if (imagePath) {
      imageUrl = getPublicImageUrl(imagePath);
      console.log(`[TrendEngine] Image URL: ${imageUrl}`);
    }

    const platformFilter = options?.platformFilter;
    const platformPosts: { platform: string; content: string }[] = [];
    if (channels.linkedin && (!platformFilter || platformFilter === "linkedin")) platformPosts.push({ platform: "linkedin", content: posts.linkedin });
    if (channels.facebook && (!platformFilter || platformFilter === "facebook")) platformPosts.push({ platform: "facebook", content: posts.facebook });

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
            `[TrendEngine] Published ${platform}: "${posts.title}" [${posts.contentMode}|${posts.trendAnalysis.category}|urgency:${posts.trendAnalysis.urgency_score}|confidence:${posts.confidenceScore}] (Buffer ID: ${bufferResult.bufferId})`
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

    savePerformanceEntry({
      date: new Date().toISOString(),
      title: posts.title,
      category: posts.trendAnalysis.category,
      contentMode: posts.contentMode,
      postStyle,
      urgencyScore: posts.trendAnalysis.urgency_score,
      confidenceScore: posts.confidenceScore,
      recommendedAction: "auto_publish",
      platforms: result.platforms,
      published: result.published > 0,
    });

    console.log(
      `[TrendEngine] Pipeline complete: ${result.published}/${platformPosts.length} published | mode: ${posts.contentMode} | confidence: ${posts.confidenceScore} | signal: ${posts.trendAnalysis.summary.slice(0, 60)}...`
    );
  } catch (error: any) {
    console.error("[TrendEngine] Generation error:", error.message);
  }

  return result;
}
