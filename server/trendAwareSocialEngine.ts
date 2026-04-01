import Anthropic from "@anthropic-ai/sdk";
import { storage } from "./storage";
import { fetchRealThreats, type RawFeedItem } from "./trendingThreatService";
import { createBufferPost, getBufferChannelsByPlatform, getPublicImageUrl } from "./bufferPublisher";
import type { InsertSocialPost } from "@shared/schema";
import { tagAllGcrLinks } from "./utmTracking";
import { buildPartnerContext, runPostPublishEngagement } from "./socialEngagementService";
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
  "industry_analysis",
  "ai_landscape",
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
    .replace(/-/g, ", ")
    .replace(/–/g, ", ")
    .replace(/[^\S\n]{2,}/g, " ")
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/ ,/g, ",")
    .trim();
}

const SOURCE_TIERS: Record<string, 1 | 2 | 3> = {
  "cisa": 1, "us-cert": 1, "nist": 1, "fbi": 1, "ftc": 1, "dhs": 1, "nsa": 1,
  "europol": 1, "ncsc": 1, "interpol": 1, "acsc": 1, "enisa": 1,
  "microsoft": 1, "google": 1, "apple": 1, "amazon": 1, "meta": 1,
  "cisco": 1, "palo alto": 1,
  "krebs on security": 2, "securityweek": 2, "the hacker news": 2,
  "dark reading": 2, "threatpost": 2, "ars technica": 2,
  "wired": 2, "zdnet": 2, "techcrunch": 2, "the record": 2, "cyberscoop": 2,
  "bleepingcomputer": 2, "schneier": 2,
  "mandiant": 2, "crowdstrike": 2, "sophos": 2, "kaspersky": 2, "sentinelone": 2,
  "recorded future": 2, "checkpoint": 2, "trendmicro": 2, "trend micro": 2,
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
    tool_name: "GCR Scam Guard",
    how_it_connects: "Scans suspicious links and messages in real time to detect phishing attempts before you click",
    url: "https://www.getcyberright.com/scam-checker",
  },
  scam: {
    tool_name: "GCR Scam Guard",
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
    url: "https://www.getcyberright.com/breach-dashboard",
  },
  data_broker: {
    tool_name: "GCR Data Shield",
    how_it_connects: "Scans 500+ data broker sites and breach databases to find your exposed personal information",
    url: "https://www.getcyberright.com/shield",
  },
  kids: {
    tool_name: "Kids Safety Hub",
    how_it_connects: "Age-appropriate cybersecurity education and parental controls guidance",
    url: "https://www.getcyberright.com/kids",
  },
  identity: {
    tool_name: "Awareness Hub",
    how_it_connects: "Comprehensive cybersecurity awareness resources and learning paths",
    url: "https://www.getcyberright.com/awareness-hub",
  },
  malware: {
    tool_name: "Cyber Threat Radar",
    how_it_connects: "Real-time threat intelligence dashboard showing active malware campaigns and advisories",
    url: "https://www.getcyberright.com/cyber-threat-radar",
  },
  senior: {
    tool_name: "Senior Safety Hub",
    how_it_connects: "Tailored cybersecurity guidance for older adults, the most targeted demographic",
    url: "https://www.getcyberright.com/seniors",
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
    scam: [...([] as string[]), "deepfake", "ai fraud", "ai-generated", "voice clone", "ai safety", "artificial intelligence", "generative ai", "llm", "regulation", "eu ai act", "gdpr", "privacy law"],
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

const POSTING_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

type ContentPillar = "threat_alert" | "practical_protection" | "myth_buster" | "family_focus" | "weekly_kickoff" | "friday_tips" | "weekend_roundup";

const CONTENT_PILLARS: Record<number, ContentPillar> = {
  0: "family_focus",
  1: "weekly_kickoff",
  2: "threat_alert",
  3: "practical_protection",
  4: "myth_buster",
  5: "friday_tips",
  6: "weekend_roundup",
};

const PILLAR_LABELS: Record<ContentPillar, string> = {
  threat_alert: "Threat Alert Tuesday",
  practical_protection: "Practical Protection Wednesday",
  myth_buster: "Myth Buster Thursday",
  family_focus: "Family Focus Sunday",
  weekly_kickoff: "Start Your Week Safe Monday",
  friday_tips: "Friday Quick Tips",
  weekend_roundup: "Weekend Safety Roundup",
};

interface PlatformPostingWindow {
  hour: number;
  minute: number;
  windowMinutes: number;
}

type PostingSlot = "morning" | "evening";

interface PlatformSlotWindows {
  morning: PlatformPostingWindow | null;
  evening: PlatformPostingWindow | null;
}

const DAILY_POST_LIMIT = 2;

const PLATFORM_POSTING_WINDOWS: Record<string, Record<number, PlatformSlotWindows>> = {
  linkedin: {
    0: { morning: null, evening: { hour: 17, minute: 30, windowMinutes: 90 } },
    1: { morning: { hour: 8, minute: 30, windowMinutes: 90 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    2: { morning: { hour: 9, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    3: { morning: { hour: 9, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    4: { morning: { hour: 9, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    5: { morning: { hour: 10, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    6: { morning: null, evening: { hour: 17, minute: 30, windowMinutes: 90 } },
  },
  facebook: {
    0: { morning: { hour: 10, minute: 0, windowMinutes: 120 }, evening: { hour: 17, minute: 30, windowMinutes: 120 } },
    1: { morning: { hour: 11, minute: 0, windowMinutes: 90 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    2: { morning: { hour: 11, minute: 30, windowMinutes: 90 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    3: { morning: { hour: 11, minute: 30, windowMinutes: 90 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    4: { morning: { hour: 11, minute: 30, windowMinutes: 90 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    5: { morning: { hour: 12, minute: 0, windowMinutes: 90 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    6: { morning: { hour: 10, minute: 0, windowMinutes: 120 }, evening: { hour: 17, minute: 30, windowMinutes: 120 } },
  },
  instagram: {
    0: { morning: { hour: 10, minute: 30, windowMinutes: 90 }, evening: { hour: 17, minute: 30, windowMinutes: 120 } },
    1: { morning: { hour: 11, minute: 30, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    2: { morning: { hour: 12, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    3: { morning: { hour: 12, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    4: { morning: { hour: 12, minute: 0, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    5: { morning: { hour: 12, minute: 30, windowMinutes: 60 }, evening: { hour: 17, minute: 0, windowMinutes: 120 } },
    6: { morning: { hour: 10, minute: 30, windowMinutes: 90 }, evening: { hour: 17, minute: 30, windowMinutes: 120 } },
  },
};

function getCurrentSlot(): PostingSlot {
  const et = getETComponents();
  return et.hour >= 15 ? "evening" : "morning";
}

function getETComponents(): { year: number; month: number; day: number; hour: number; minute: number; dayOfWeek: number; dateStr: string } {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
    weekday: "short",
  });
  const parts = formatter.formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value || "";

  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const year = parseInt(get("year"));
  const month = parseInt(get("month"));
  const day = parseInt(get("day"));
  const hour = parseInt(get("hour"));
  const minute = parseInt(get("minute"));
  const dayOfWeek = weekdayMap[get("weekday")] ?? new Date().getDay();

  return { year, month, day, hour, minute, dayOfWeek, dateStr: `${year}-${get("month")}-${get("day")}` };
}

function isPostingDay(): boolean {
  const et = getETComponents();
  return et.dayOfWeek in CONTENT_PILLARS;
}

function getTodaysPillar(): ContentPillar | null {
  const et = getETComponents();
  return CONTENT_PILLARS[et.dayOfWeek] || null;
}

function getPillarPromptInstructions(pillar: ContentPillar): string {
  switch (pillar) {
    case "weekly_kickoff":
      return `TODAY'S CONTENT PILLAR: START YOUR WEEK SAFE MONDAY
Kick off the week with a quick security briefing. Lead with "This week in cyber:" and highlight the 1-2 biggest threats or stories breaking right now. Frame it as "here's what you need to know before your week starts." If there's a major breach, scam wave, or new threat trending, lead with that. If it's a quieter week, pick a practical "do this one thing today" tip. The tone is energetic, forward-looking, and sets GCR up as the trusted weekly briefing. Prioritize breaking_insight content mode.`;

    case "threat_alert":
      return `TODAY'S CONTENT PILLAR: THREAT ALERT TUESDAY
Focus on the most urgent active threat, scam, or vulnerability from the news feed. This is GCR's "we're watching so you don't have to" authority play. Prioritize breaking_insight or quick_breakdown content modes. The audience expects timely, actionable threat intelligence today.`;

    case "practical_protection":
      return `TODAY'S CONTENT PILLAR: PRACTICAL PROTECTION WEDNESDAY
Focus on ONE specific, actionable protection tip. "Change this setting." "Check this site." "Do this tonight." This is the most saveable and shareable content type. Prioritize preventative_education content mode. Keep it concrete and immediately doable. The audience expects a single clear action they can take today.`;

    case "myth_buster":
      return `TODAY'S CONTENT PILLAR: MYTH BUSTER THURSDAY
Challenge conventional cybersecurity wisdom. Pick a common misconception related to today's news and demolish it with specific facts. Be slightly provocative. Strong opinions drive engagement because people argue. Prioritize myth_debunking content mode. The audience expects a hot take backed by real expertise today.`;

    case "friday_tips":
      return `TODAY'S CONTENT PILLAR: FRIDAY QUICK TIPS
End the work week with a quick, easy-to-digest safety tip people can act on over the weekend. "Before you close your laptop for the weekend..." or "Weekend project: 5 minutes to check your..." Keep it light, practical, and completable. People are wrapping up their week and want something they can knock out quickly. Prioritize preventative_education content mode.`;

    case "weekend_roundup":
      return `TODAY'S CONTENT PILLAR: WEEKEND SAFETY ROUNDUP
Saturday content should feel timely and accessible. Highlight what happened this week in plain language: the biggest breach, the trending scam, the new tactic to watch for. Frame it as "what you might have missed this week." People are scrolling casually on Saturday mornings. Make it scannable and shareable. Prioritize breaking_insight or preventative_education content mode.`;

    case "family_focus":
      return `TODAY'S CONTENT PILLAR: FAMILY FOCUS SUNDAY
Use relatable family scenarios. "Your kid got a message that says..." or "Your parent called about a 'Microsoft' call..." These are the most shareable posts because they hit home. Prioritize scenario_simulation content mode. The audience is relaxed, scrolling on a Sunday evening, thinking about the week ahead. Make it personal and protective.`;

    default:
      return "";
  }
}

type ContentMixCategory = "value" | "soft_product" | "direct_cta";

function classifyPostMix(postContent: string): ContentMixCategory {
  const lowerContent = postContent.toLowerCase();

  const directCtaSignals = [
    "install the extension", "run a free scan", "download now", "sign up",
    "try it free", "get started today", "start your scan", "install gcr",
    "get gcr scam guard", "subscribe", "upgrade",
  ];
  if (directCtaSignals.some(s => lowerContent.includes(s))) return "direct_cta";

  const softProductSignals = [
    "we built", "our tool", "gcr scam guard", "gcr data shield",
    "getcyberright.com/scam-checker", "getcyberright.com/shield",
    "getcyberright.com/browser-extension", "we created", "our team",
    "check out our", "we put together",
  ];
  if (softProductSignals.some(s => lowerContent.includes(s))) return "soft_product";

  return "value";
}

async function getContentMixRatio(): Promise<{ value: number; softProduct: number; directCta: number; total: number; recommendation: string }> {
  try {
    const recentPosts = await storage.getSocialPosts("published", 60);
    const last30Posts = recentPosts
      .filter(p => {
        if (!p.publishedAt) return false;
        const daysAgo = (Date.now() - new Date(p.publishedAt).getTime()) / 86400000;
        return daysAgo <= 30;
      })
      .filter(p => p.platform === "linkedin")
      .slice(0, 30);

    if (last30Posts.length < 5) {
      return { value: 70, softProduct: 20, directCta: 10, total: last30Posts.length, recommendation: "Not enough data yet. Default to value-first content." };
    }

    let value = 0, softProduct = 0, directCta = 0;
    for (const post of last30Posts) {
      const category = classifyPostMix(post.postContent);
      if (category === "value") value++;
      else if (category === "soft_product") softProduct++;
      else directCta++;
    }

    const total = last30Posts.length;
    const valuePct = Math.round((value / total) * 100);
    const softPct = Math.round((softProduct / total) * 100);
    const ctaPct = Math.round((directCta / total) * 100);

    let recommendation = "";
    if (valuePct < 60) {
      recommendation = "WARNING: Too many product-focused posts. Today's post MUST be pure value (educational, tip-based, or news analysis) with NO product mentions. The 70/20/10 rule means 7 out of 10 posts should be pure education.";
    } else if (softPct > 30) {
      recommendation = "Soft product mentions are over target. Today's post should be pure value content with no product references.";
    } else if (ctaPct > 15) {
      recommendation = "Direct CTAs are over target. Avoid any direct promotional language today. Focus on insight and education.";
    } else if (valuePct > 80 && softPct < 10) {
      recommendation = "Value content is strong. Consider a natural product mention today if it genuinely fits the topic.";
    } else {
      recommendation = "Content mix is healthy. Continue with value-first approach.";
    }

    return { value: valuePct, softProduct: softPct, directCta: ctaPct, total, recommendation };
  } catch {
    return { value: 70, softProduct: 20, directCta: 10, total: 0, recommendation: "Could not analyze mix. Default to value-first." };
  }
}

function isPlatformInWindow(platform: string, slot?: PostingSlot): boolean {
  const et = getETComponents();
  const windows = PLATFORM_POSTING_WINDOWS[platform];
  if (!windows) return true;

  const dayWindows = windows[et.dayOfWeek];
  if (!dayWindows) return false;

  const targetSlot = slot || getCurrentSlot();
  const window = dayWindows[targetSlot];
  if (!window) return false;

  const currentMinutes = et.hour * 60 + et.minute;
  const windowStart = window.hour * 60 + window.minute;
  const windowEnd = windowStart + window.windowMinutes;

  return currentMinutes >= windowStart && currentMinutes < windowEnd;
}

function getETDateString(): string {
  return getETComponents().dateStr;
}

function getSlotPostCount(todaysPosts: any[], platform: string, slot: PostingSlot): number {
  return todaysPosts.filter(p => {
    if (p.platform !== platform || !p.publishedAt) return false;
    const postHour = parseInt(
      new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "2-digit", hour12: false })
        .formatToParts(new Date(p.publishedAt))
        .find(x => x.type === "hour")?.value || "0"
    );
    return slot === "evening" ? postHour >= 15 : postHour < 15;
  }).length;
}

async function checkRateLimit(): Promise<{ allowed: boolean; availablePlatforms: string[]; currentSlot: PostingSlot }> {
  const slot = getCurrentSlot();
  try {
    const et = getETComponents();

    if (!isPostingDay()) {
      const dayName = POSTING_DAY_NAMES[et.dayOfWeek];
      console.log(`[TrendEngine] ${dayName} is not a posting day. Skipping.`);
      return { allowed: false, availablePlatforms: [], currentSlot: slot };
    }

    const todayET = getETDateString();
    const recentPosts = await storage.getSocialPosts("published", 200);
    const todaysPosts = recentPosts.filter((p) => {
      if (!p.publishedAt) return false;
      const postET = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric", month: "2-digit", day: "2-digit",
      }).formatToParts(new Date(p.publishedAt));
      const postDateStr = `${postET.find(x => x.type === "year")?.value}-${postET.find(x => x.type === "month")?.value}-${postET.find(x => x.type === "day")?.value}`;
      return postDateStr === todayET;
    });
    const platformCounts: Record<string, number> = {};
    for (const post of todaysPosts) {
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    }
    const channels = await getBufferChannelsByPlatform();
    const connectedPlatforms = Object.keys(channels);

    const available = connectedPlatforms.filter(p => {
      if ((platformCounts[p] || 0) >= DAILY_POST_LIMIT) return false;
      if (getSlotPostCount(todaysPosts, p, slot) >= 1) return false;
      if (!isPlatformInWindow(p, slot)) return false;
      return true;
    });

    const atDailyLimit = connectedPlatforms.filter(p => (platformCounts[p] || 0) >= DAILY_POST_LIMIT);
    const slotFilled = connectedPlatforms.filter(p =>
      (platformCounts[p] || 0) < DAILY_POST_LIMIT && getSlotPostCount(todaysPosts, p, slot) >= 1
    );
    const outsideWindow = connectedPlatforms.filter(p =>
      (platformCounts[p] || 0) < DAILY_POST_LIMIT &&
      getSlotPostCount(todaysPosts, p, slot) < 1 &&
      !isPlatformInWindow(p, slot)
    );

    const etTimeStr = `${et.hour}:${String(et.minute).padStart(2, "0")} ET`;

    if (atDailyLimit.length > 0) {
      console.log(`[TrendEngine] Rate limit: ${atDailyLimit.join(", ")} at daily max (${DAILY_POST_LIMIT}/day)`);
    }
    if (slotFilled.length > 0) {
      console.log(`[TrendEngine] ${slot} slot filled: ${slotFilled.join(", ")} already posted this ${slot}`);
    }
    if (outsideWindow.length > 0) {
      console.log(`[TrendEngine] Outside ${slot} posting window (${etTimeStr}): ${outsideWindow.join(", ")}`);
    }

    if (available.length === 0) {
      if (outsideWindow.length > 0 && atDailyLimit.length === 0 && slotFilled.length === 0) {
        console.log(`[TrendEngine] All platforms outside their ${slot} posting windows. Will retry later.`);
      } else {
        console.log(`[TrendEngine] All platforms at limit or outside ${slot} window, skipping`);
      }
      return { allowed: false, availablePlatforms: [], currentSlot: slot };
    }
    console.log(`[TrendEngine] [${slot}] Platforms ready for posting: ${available.join(", ")}`);
    return { allowed: true, availablePlatforms: available, currentSlot: slot };
  } catch {
    return { allowed: true, availablePlatforms: ["linkedin", "facebook", "instagram"], currentSlot: slot };
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
  instagram: string;
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
  sourceImageUrl: string | null;
  aiImagePrompt: string | null;
}

function enforcePostFormatting(text: string, platform: string): string {
  let cleaned = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/^#+\s/gm, "").replace(/^[-•]\s/gm, "");
  cleaned = cleaned.replace(/\u2014/g, ",").replace(/\u2013/g, ",");

  if (platform === "linkedin" || platform === "facebook") {
    cleaned = cleaned.replace(/\n#\w[\w]*/g, "").replace(/#\w[\w]*/g, "").trim();
  }

  cleaned = cleaned.replace(/^[A-Z][A-Z ]{4,}:\s*/gm, (match) => {
    const words = match.trim().replace(/:$/, "");
    return words.charAt(0) + words.slice(1).toLowerCase() + ": ";
  });

  cleaned = cleaned.replace(/\byou're\b/gi, "you are");
  cleaned = cleaned.replace(/\bdon't\b/gi, "do not");
  cleaned = cleaned.replace(/\bdon't\b/gi, "do not");
  cleaned = cleaned.replace(/\bcan't\b/gi, "cannot");
  cleaned = cleaned.replace(/\bcan't\b/gi, "cannot");
  cleaned = cleaned.replace(/\bwon't\b/gi, "will not");
  cleaned = cleaned.replace(/\bwon't\b/gi, "will not");
  cleaned = cleaned.replace(/\bisn't\b/gi, "is not");
  cleaned = cleaned.replace(/\bisn't\b/gi, "is not");
  cleaned = cleaned.replace(/\baren't\b/gi, "are not");
  cleaned = cleaned.replace(/\baren't\b/gi, "are not");
  cleaned = cleaned.replace(/\bdoesn't\b/gi, "does not");
  cleaned = cleaned.replace(/\bdoesn't\b/gi, "does not");
  cleaned = cleaned.replace(/\bdidn't\b/gi, "did not");
  cleaned = cleaned.replace(/\bdidn't\b/gi, "did not");
  cleaned = cleaned.replace(/\bwasn't\b/gi, "was not");
  cleaned = cleaned.replace(/\bwasn't\b/gi, "was not");
  cleaned = cleaned.replace(/\bhaven't\b/gi, "have not");
  cleaned = cleaned.replace(/\bhaven't\b/gi, "have not");
  cleaned = cleaned.replace(/\bhasn't\b/gi, "has not");
  cleaned = cleaned.replace(/\bhasn't\b/gi, "has not");
  cleaned = cleaned.replace(/\bcouldn't\b/gi, "could not");
  cleaned = cleaned.replace(/\bcouldn't\b/gi, "could not");
  cleaned = cleaned.replace(/\bwouldn't\b/gi, "would not");
  cleaned = cleaned.replace(/\bwouldn't\b/gi, "would not");
  cleaned = cleaned.replace(/\bshouldn't\b/gi, "should not");
  cleaned = cleaned.replace(/\bshouldn't\b/gi, "should not");
  cleaned = cleaned.replace(/\bthey're\b/gi, "they are");
  cleaned = cleaned.replace(/\bthey're\b/gi, "they are");
  cleaned = cleaned.replace(/\bwe're\b/gi, "we are");
  cleaned = cleaned.replace(/\bwe're\b/gi, "we are");
  cleaned = cleaned.replace(/\bthere's\b/gi, "there is");
  cleaned = cleaned.replace(/\bthere's\b/gi, "there is");
  cleaned = cleaned.replace(/\bhere's\b/gi, "here is");
  cleaned = cleaned.replace(/\bhere's\b/gi, "here is");
  cleaned = cleaned.replace(/\bwhat's\b/gi, "what is");
  cleaned = cleaned.replace(/\bwhat's\b/gi, "what is");
  cleaned = cleaned.replace(/\bthat's\b/gi, "that is");
  cleaned = cleaned.replace(/\bthat's\b/gi, "that is");
  cleaned = cleaned.replace(/\bit's\b/gi, "it is");
  cleaned = cleaned.replace(/\bit's\b/gi, "it is");
  cleaned = cleaned.replace(/\bI'm\b/g, "I am");
  cleaned = cleaned.replace(/\bI'm\b/g, "I am");
  cleaned = cleaned.replace(/\bI've\b/g, "I have");
  cleaned = cleaned.replace(/\bI've\b/g, "I have");
  cleaned = cleaned.replace(/\bI'll\b/g, "I will");
  cleaned = cleaned.replace(/\bI'll\b/g, "I will");
  cleaned = cleaned.replace(/\bI'd\b/g, "I would");
  cleaned = cleaned.replace(/\bI'd\b/g, "I would");
  cleaned = cleaned.replace(/\blet's make sure\b/gi, "Make sure");
  cleaned = cleaned.replace(/\blet's\b/gi, "We should");
  cleaned = cleaned.replace(/\blet's make sure\b/gi, "Make sure");
  cleaned = cleaned.replace(/\blet's\b/gi, "We should");
  cleaned = cleaned.replace(/\bwho's\b/gi, "who is");
  cleaned = cleaned.replace(/\bwho's\b/gi, "who is");

  cleaned = cleaned.replace(/(\S)\s+(\d+)\.\s/g, (match, before, num) => {
    if (parseInt(num) <= 10) {
      return `${before}\n\n${num}. `;
    }
    return match;
  });

  cleaned = cleaned.replace(/\. ([A-Z])/g, (match, letter, offset) => {
    const beforeText = cleaned.substring(Math.max(0, offset - 40), offset);
    if (/\d+\.\s/.test(beforeText.split('\n').pop() || "")) {
      return `. ${letter}`;
    }
    return match;
  });

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
        const chunk = sentences.slice(i, i + 2);
        const numberedItem = chunk[0]?.match(/^\d+\.\s/);
        if (numberedItem) {
          reformatted.push(chunk.join(" "));
        } else {
          reformatted.push(chunk.join(" "));
        }
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
  const newsSlice = trendingNews.slice(0, 8);
  const newsContext = newsSlice
    .map((item, i) => {
      const tier = getSourceTier(item.source);
      const tierLabel = tier === 1 ? "Tier 1 (gov/official)" : tier === 2 ? "Tier 2 (established pub)" : "Tier 3 (unverified)";
      const imgNote = item.imageUrl ? `   Image: ${item.imageUrl}` : "   Image: none";
      return `[${i + 1}] ${item.source} [${tierLabel}]: "${item.title}"\n   ${item.summary}\n   Published: ${item.pubDate || "recent"}\n${imgNote}`;
    })
    .join("\n\n");

  const guideContext = relevantGuides
    .slice(0, 10)
    .map((g) => `- "${g.title}" (${g.category}) https://www.getcyberright.com/guides/${g.slug}`)
    .join("\n");

  let alertsContext = "";
  let scamIntelContext = "";
  try {
    const recentAlerts = await storage.getPublishedThreatAlerts(undefined, 5);
    if (recentAlerts.length > 0) {
      alertsContext = `\nGETCYBERRIGHT ALERTS (link to these when covering related threats):\n${recentAlerts.map(a => `- "${a.threatName}" (${a.threatCategory}) https://www.getcyberright.com/alerts/${a.slug}`).join("\n")}`;
    }
    const recentScams = await storage.getPublishedScamIntel(undefined, 5);
    if (recentScams.length > 0) {
      scamIntelContext = `\nGETCYBERRIGHT SCAM INTEL (link to these when covering related scam types):\n${recentScams.map(s => `- "${s.scamName}" (${s.scamCategory}) https://www.getcyberright.com/scam-intel/${s.slug}`).join("\n")}`;
    }
  } catch (e) {}

  const recentPostsContext =
    recentlyPublishedTitles.length > 0
      ? `\nPOSTS PUBLISHED IN THE LAST 7 DAYS (do NOT repeat these topics or use similar structures):\n${recentlyPublishedTitles.map((t) => `- ${t}`).join("\n")}`
      : "";

  const performanceContext = getRecentPerformanceSummary();

  const pillar = getTodaysPillar();
  const slot = getCurrentSlot();
  const slotContext = slot === "evening"
    ? `\nPOSTING SLOT: EVENING (breaking news / alert focus)
This is the evening post. Focus on the most urgent, breaking, or alarming story from today's feed. Use breaking_insight or quick_breakdown content mode. The tone should be urgent and direct — this is our "alert" post. Lead with the threat, explain the risk, give one clear action. If no truly breaking story exists, pick the most actionable security tip from today's feed.\n`
    : `\nPOSTING SLOT: MORNING (educational / trend analysis)
This is the morning post. Focus on education, trend analysis, and building trust. Use the content pillar theme for today.\n`;

  const pillarContext = pillar
    ? `\n${getPillarPromptInstructions(pillar)}\n`
    : "";

  const contentMix = await getContentMixRatio();
  const mixContext = `\nCONTENT MIX RATIO (70/20/10 RULE):
Current mix (last ${contentMix.total} posts): ${contentMix.value}% value-first, ${contentMix.softProduct}% soft product, ${contentMix.directCta}% direct CTA.
Target: 70% pure education, 20% natural product integration, 10% direct CTA.
${contentMix.recommendation}\n`;

  const sourceValidationContext = `\nSOURCE CREDIBILITY SUMMARY: ${sourceCredibility.tier1Count} Tier 1 (government/official), ${sourceCredibility.tier2Count} Tier 2 (established publications), ${sourceCredibility.tier3Count} Tier 3 (unverified). ${sourceCredibility.highestTier === 3 ? "WARNING: No high-credibility sources available. Downgrade urgency and frame claims as emerging/unverified." : ""}`;

  const partnerContextLinkedIn = buildPartnerContext("linkedin", "general_awareness");
  const partnerContextFacebook = buildPartnerContext("facebook", "general_awareness");
  const partnerContextX = buildPartnerContext("x", "general_awareness");
  const partnerContextInstagram = buildPartnerContext("instagram", "general_awareness");

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
- Classify into: phishing_scam, data_breach, malware, ai_threat, social_engineering, privacy, vulnerability, industry_development, ai_innovation, regulatory_update, or general_awareness
- Consider the FULL landscape: not just active attacks, but also industry trends, AI developments affecting security, regulatory changes, new research findings, and notable corporate security events

STEP 2 - SOURCE VALIDATION (CRITICAL):
- Each news item is labeled with its source credibility tier
- Tier 1 (highest trust): Government agencies (CISA, NIST, FBI, FTC, UK NCSC, Europol, INTERPOL, ACSC, ENISA, Canadian Anti-Fraud Centre), official company statements (Google, Microsoft, Apple)
- Tier 2: Established cybersecurity publications (Krebs, BleepingComputer, Dark Reading, The Record, CyberScoop), research organizations (APWG, Ponemon Institute, ITRC, Verizon DBIR)
- Tier 3: Social media, unverified reports, unknown sources
- RULES: Require at least 2 independent sources for high-risk claims. If only Tier 3 sources exist, frame as emerging/unverified, not confirmed fact. If confidence is low, downgrade urgency_score

SOURCE DIVERSITY RULE:
- Do NOT default to citing the FBI as the authority for every claim. Rotate across global agencies
- When a statistic can be attributed to multiple agencies, prefer variety: cite Europol for EU-relevant threats, UK NCSC for UK-focused attacks, ACSC for APAC incidents, CISA for infrastructure threats, FTC for consumer fraud data
- GetCyberRight has a global audience. Posts should reflect international perspectives and agencies, not just US-centric ones
- Track which sources you have cited recently and prefer different ones for the next post

STEP 3 - RELEVANCE FILTER:
- Is this relevant to families, seniors, kids, everyday users, or small businesses?
- ALSO consider: Does this represent a major industry shift, AI development, or regulatory change that will affect how everyday people use technology?
- Breaking news about major breaches, AI safety developments, new regulations (EU AI Act, privacy laws), and industry-shaping events ARE relevant even if not a direct consumer threat
- If NOT relevant to any of these criteria, select a different story from the feed

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
- For AI developments, regulatory changes, and industry news: breaking_insight or myth_debunking work well
- The WRITING STYLE instruction determines HOW to write. The content mode determines WHAT angle to take
- Aim for VARIETY: if recent posts have been threat-focused, lean toward AI developments, privacy news, or regulatory updates if available in the feed

STEP 7 - CONTENT CREATION:
- Follow the specific WRITING STYLE instruction provided below
- EXCERPT STRATEGY: Posts are teasers, NOT full articles. Share the most compelling insight to hook readers, then drive them to the relevant GetCyberRight page for the full breakdown
- Post structure: hook (the most compelling insight) > brief context (1-2 sentences on why it matters) > 1-2 actionable tips as a preview > CTA linking to the most relevant GetCyberRight page (guide, alert, scam intel, or tool)
- ALWAYS end with a link to a relevant GetCyberRight page
- CRITICAL: You may ONLY link to URLs that appear in the KEY TOOL PAGES list, or to specific guide/alert/scam-intel slugs listed in the context above. NEVER invent or guess a URL slug. If no specific guide/alert/scam-intel page matches, use the most relevant KEY TOOL PAGE instead
- ALL links MUST use the www subdomain (https://www.getcyberright.com/...). Never use https://getcyberright.com without www
- If no specific page matches, link to https://www.getcyberright.com/awareness-hub as the default fallback
- The link MUST appear on its own line before any hashtags

STEP 8 - VISUAL PLANNING:
- Suggest 1-2 visuals: story (real-life situation), educational (simple breakdown), or product_ui (GetCyberRight feature)
- Keep visuals simple, realistic, not cluttered

STEP 9 - PRODUCT MAPPING:
- Map to a relevant GetCyberRight feature ONLY if genuinely justified
- Available: AI Scam Analyzer, GCR Scam Guard, Password Generator, Breach Monitor, Data Broker Removal, Kids Safety Hub, Senior Safety Hub, Cyber Threat Radar, Identity Theft Recovery Guide
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
- NEVER use contractions. Write "you are" not "you're", "do not" not "don't", "it is" not "it's", "cannot" not "can't", "will not" not "won't", "here is" not "here's", "that is" not "that's", "what is" not "what's", "we are" not "we're", "they are" not "they're", "there is" not "there's", "is not" not "isn't", "are not" not "aren't", "does not" not "doesn't", "did not" not "didn't", "have not" not "haven't", "has not" not "hasn't", "I am" not "I'm", "I have" not "I've"
- When avoiding contractions creates awkward phrasing, restructure the sentence instead. For example: Instead of "let us make sure" (from "let's make sure"), write "Make sure your family..." Instead of "what is one thing" (from "what's one thing"), write "What one thing do you wish..."
- NEVER use hashtags on LinkedIn or Facebook posts. No #CyberSecurity, no #ScamAlert, nothing with #
- NEVER use ALL CAPS for headers or emphasis. Write "How to protect yourself:" not "HOW TO PROTECT YOURSELF:"
- Every post MUST have multiple \\n\\n paragraph breaks in the JSON output
- LinkedIn: Maximum 5-7 short paragraphs, each 1-2 sentences. NEVER a single block of text
- The first 2 lines MUST stand alone as a hook (before LinkedIn's "see more" cutoff)
- After the hook, insert a \\n\\n break
- Keep paragraphs to 1-2 sentences maximum. One sentence per paragraph is preferred
- If using numbered items, put each on its OWN line with a \\n\\n between them
- White space is critical. A wall of text = automatic failure. If you produce a single unbroken paragraph, you have failed
- LinkedIn posts that exceed 200 words = failure. Be concise. Cut ruthlessly
- Keep sentences under 35 words. If a sentence exceeds 35 words, split it into two

WHAT NOT TO DO:
- Do not end every post with a question. Sometimes end with a strong statement
- Do not say "Here are 3 things you can do right now" every time
- Do not use "Stay safe out there" or similar platitudes
- Do not start posts with "Breaking:" or use fake urgency or clickbait
- Do not use emojis excessively (0-2 per post max)
- Do not use: "game-changer", "wake-up call", "in today's digital landscape", "cyber hygiene"

PLATFORM OPTIMIZATION (ALGORITHM-AWARE):
- LinkedIn: The algorithm penalizes external links in the main body. Write the post as pure value content (insight, analysis, tip). Put the CTA link on its own final line, separated by TWO line breaks from the content. This way the valuable content appears above the "see more" fold and the link is below. The algorithm rewards posts that keep people on LinkedIn longer, so front-load the insight
- Facebook: Similar to LinkedIn, the algorithm deprioritizes posts with external links. Write the post body as native content that provides value on its own. Place the link on a separate final line after a clear paragraph break. Do NOT embed the link mid-sentence. The more the post reads like organic content (not a link share), the more Facebook will distribute it
- Instagram: punchy, visual-first. The image card carries the headline. Caption is the supporting context. Short, direct, with hashtags at the end. No clickable links. "Link in bio" is the only CTA. Instagram rewards saves and shares, so write captions that people want to save for later

GOAL: Position GetCyberRight as the most trusted, human-centered cybersecurity authority for everyday users navigating modern digital risks. Content must be immediately publishable to Buffer without edits.`,
      messages: [
        {
          role: "user",
          content: `Run the full 11-step intelligence pipeline and create today's social media content for GetCyberRight.

DATE: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
${slotContext}
${pillarContext}
${mixContext}
${styleInstructions[postStyle]}

CURRENT CYBERSECURITY NEWS FEED (with source credibility tiers):
${newsContext}
${sourceValidationContext}

GETCYBERRIGHT CONTENT (link to the most relevant page in your CTA):

GUIDES:
${guideContext}
${alertsContext}
${scamIntelContext}

KEY TOOL PAGES (ONLY use these exact URLs):
- GCR Scam Guard: https://www.getcyberright.com/scam-checker
- Cyber Threat Radar: https://www.getcyberright.com/cyber-threat-radar
- Awareness Hub: https://www.getcyberright.com/awareness-hub
- GCR Data Shield: https://www.getcyberright.com/shield
- Breach Monitor: https://www.getcyberright.com/breach-dashboard
- Password Generator: https://www.getcyberright.com/password-generator
- GCR Scam Guard Extension: https://www.getcyberright.com/browser-extension
- Kids Safety Hub: https://www.getcyberright.com/kids
- Senior Safety Hub: https://www.getcyberright.com/seniors
- Training Academy: https://www.getcyberright.com/training
${recentPostsContext}
${performanceContext}

Execute ALL steps of your intelligence pipeline (Signal Interpretation, Source Validation, Relevance Filter, Risk Scoring, Insight Generation, Content Mode Selection, Content Creation, Visual Planning, Product Mapping, Validation, Confidence Scoring), then output:

CRITICAL VOICE RULES FOR ALL PLATFORMS:
- Write like a real human who works in cybersecurity and genuinely cares, NOT like a brand account or AI
- Use contractions (don't, it's, we've, that's). Always.
- Mix short sentences with longer ones. Vary your rhythm.
- It's okay to express opinions ("this one worries me" or "honestly, this was preventable")
- Be specific with advice. "Go to haveibeenpwned.com and check your email" beats "monitor your accounts"
- Reference relatable situations (your parents, your kids, your coworker who clicks everything)
- NEVER say: "in today's digital landscape", "it's crucial", "cyber hygiene", "threat landscape", "threat actors", "it is imperative", "this underscores", "as cybersecurity professionals"
- NEVER open with generic corporate lines. Open with something a real person would actually say.
- NEVER sound like a press release or marketing copy.

LINKEDIN POST (120-180 words max, STRICTLY ENFORCED):
- Professional but still sounds like a real person, not a thought-leader parody
- Structure: Hook that stops the scroll (something you'd actually say out loud) \\n\\n Your take on why this matters \\n\\n 1-2 specific things people can do right now \\n\\n CTA with link
- First 2 lines appear before "see more". Make them feel real, not salesy.
- Each paragraph: 1-2 sentences MAX. Break after every thought.
- End with a natural CTA driving to the relevant GetCyberRight page
- The post MUST contain at least 4 paragraph breaks (\\n\\n)
${partnerContextLinkedIn}
FACEBOOK POST (60-120 words max):
- Casual and warm, like texting a group chat about something important
- Share the thing that would make someone actually stop scrolling
- Give 1 quick specific tip
- End with a natural CTA and link (not "Click here to learn more" but something like "We broke this down step by step here:")
- Use paragraph breaks between thoughts
${partnerContextFacebook}
INSTAGRAM POST (40-80 words max, CRITICAL DIFFERENCES):
- Instagram is IMAGE-FIRST. The caption supports the branded image card, not the other way around
- Lead with a punchy hook or question that stops the scroll
- Keep it short and scannable. 2-3 short paragraphs max
- Do NOT put links in the caption (they are not clickable on Instagram). Instead end with "Link in bio" as CTA
- Add 8-12 relevant hashtags at the END, separated from the caption by two line breaks
- Most casual of all platforms. Write like you're talking to a friend.
- Focus on ONE key takeaway, not multiple tips
${partnerContextInstagram}

IMAGE HANDLING:
Each news item includes an "Image:" field. If the article you base your post on has an image URL, return its index in "source_article_index" so we can use the real thumbnail.
If the chosen article has NO image (Image: none), write an "ai_image_prompt" describing a photorealistic image that would complement the post. The prompt should describe a specific, realistic scene (not abstract graphics or text overlays). Think editorial photography: real people using devices, cybersecurity scenarios, office settings, family tech moments. Keep it under 100 words. Do NOT include any text, logos, watermarks, or brand names in the image description.

Format your complete output as this strict JSON with \\n for line breaks within post text:
{
  "linkedin": "Post text with \\n\\n between paragraphs",
  "facebook": "Post text with \\n\\n between paragraphs",
  "instagram": "Caption text with \\n\\n between paragraphs, ending with \\n\\n hashtags",
  "title": "Short tracking title under 60 chars",
  "hashtags": ["tag1", "tag2", "tag3", "tag4"],
  "imageHeadline": "Under 8 words for branded image card",
  "imageSubtext": "Supporting detail under 15 words",
  "source_article_index": 1,
  "ai_image_prompt": "Only if source article has no image. Photorealistic scene description.",
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
  "gcr_link": "https://www.getcyberright.com/relevant-page-slug (the link used in the CTA)",
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
    if (parsed.instagram) {
      parsed.instagram = enforcePostFormatting(parsed.instagram, "instagram");
    } else {
      parsed.instagram = parsed.facebook.replace(/https?:\/\/[^\s]+/g, "").trim() + "\n\nLink in bio for the full breakdown.";
    }

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
    const instagramContent = sanitizePostContent(parsed.instagram);

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

    let sourceImageUrl: string | null = null;
    let sourceArticleUrl: string | null = null;
    const articleIndex = typeof parsed.source_article_index === "number" ? parsed.source_article_index - 1 : null;
    if (articleIndex !== null && articleIndex >= 0 && articleIndex < newsSlice.length) {
      sourceImageUrl = newsSlice[articleIndex].imageUrl || null;
      sourceArticleUrl = newsSlice[articleIndex].link || null;
    }

    const aiImagePrompt: string | null = parsed.ai_image_prompt && typeof parsed.ai_image_prompt === "string"
      ? parsed.ai_image_prompt
      : null;

    console.log(
      `[TrendEngine] Pipeline complete: mode=${contentMode}, category=${trendAnalysis.category}, urgency=${trendAnalysis.urgency_score}, impact=${trendAnalysis.impact_level}, confidence=${confidenceScore}, action=${recommendedAction}${gcrToolReference ? `, tool=${gcrToolReference.tool_name}` : ""}${sourceImageUrl ? ", has source image" : aiImagePrompt ? ", will generate AI image" : ", no image source"}`
    );

    return {
      linkedin: linkedinContent,
      facebook: facebookContent,
      instagram: instagramContent,
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
      sourceImageUrl,
      sourceArticleUrl,
      aiImagePrompt,
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

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function isUrlSafeForFetch(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    if (parsed.username || parsed.password) return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1") return false;
    if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("172.")) return false;
    if (host.endsWith(".local") || host.endsWith(".internal") || host === "metadata.google.internal") return false;
    if (host.startsWith("169.254.")) return false;
    return true;
  } catch {
    return false;
  }
}

async function fetchOgImageFromArticle(articleUrl: string): Promise<string | null> {
  try {
    if (!isUrlSafeForFetch(articleUrl)) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(articleUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "GetCyberRight/1.0 (Cybersecurity Education Platform)",
        "Accept": "text/html",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);

    if (ogMatch?.[1]) {
      let ogUrl = ogMatch[1].replace(/&amp;/g, "&");
      if (ogUrl.startsWith("//")) ogUrl = "https:" + ogUrl;
      if (!ogUrl.startsWith("http")) return null;
      console.log(`[TrendEngine] Extracted og:image from article page: ${ogUrl}`);
      return ogUrl;
    }

    const twitterMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);

    if (twitterMatch?.[1]) {
      let twUrl = twitterMatch[1].replace(/&amp;/g, "&");
      if (twUrl.startsWith("//")) twUrl = "https:" + twUrl;
      if (!twUrl.startsWith("http")) return null;
      console.log(`[TrendEngine] Extracted twitter:image from article page: ${twUrl}`);
      return twUrl;
    }

    return null;
  } catch (error: any) {
    console.warn(`[TrendEngine] Failed to fetch og:image from ${articleUrl}: ${error.message}`);
    return null;
  }
}

async function downloadSourceImage(url: string, title: string): Promise<string | null> {
  try {
    if (!isUrlSafeForFetch(url)) {
      console.warn(`[TrendEngine] Source image URL blocked (safety check): ${url}`);
      return null;
    }

    ensureSocialImagesDir();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `source-${slug}-${Date.now()}.png`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "GetCyberRight/1.0 (Cybersecurity Education Platform)",
        "Accept": "image/*",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[TrendEngine] Source image HTTP ${response.status} for: ${url}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.warn(`[TrendEngine] Source image not an image (${contentType}): ${url}`);
      return null;
    }

    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_IMAGE_BYTES) {
      console.warn(`[TrendEngine] Source image too large (${contentLength} bytes): ${url}`);
      return null;
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const reader = response.body?.getReader();
    if (!reader) return null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.length;
      if (totalBytes > MAX_IMAGE_BYTES) {
        reader.cancel();
        console.warn(`[TrendEngine] Source image download exceeded ${MAX_IMAGE_BYTES} bytes, aborting: ${url}`);
        return null;
      }
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    if (buffer.length < 5000) {
      console.warn(`[TrendEngine] Source image too small (${buffer.length} bytes), likely a tracking pixel: ${url}`);
      return null;
    }

    const sharp = (await import("sharp")).default;
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 200 || metadata.height < 200) {
      console.warn(`[TrendEngine] Source image too small dimensions (${metadata.width}x${metadata.height}): ${url}`);
      return null;
    }

    await sharp(buffer)
      .png({ quality: 95 })
      .toFile(outputPath);

    console.log(`[TrendEngine] Downloaded source image: ${filename} (${metadata.width}x${metadata.height}, ${(buffer.length / 1024).toFixed(0)}KB)`);
    return outputPath;
  } catch (error: any) {
    console.warn(`[TrendEngine] Failed to download source image: ${error.message}`);
    return null;
  }
}

async function generateAIImage(prompt: string, title: string): Promise<string | null> {
  try {
    ensureSocialImagesDir();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `ai-${slug}-${Date.now()}.png`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);

    const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
    const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL || "";

    const isModelfarm = baseURL.includes("modelfarm") || baseURL.includes("replit");

    if (isModelfarm) {
      const imageGenUrl = baseURL.replace(/\/v1\/?$/, "").replace(/\/anthropic\/?$/, "") + "/image/generations";

      const aiController = new AbortController();
      const aiTimeout = setTimeout(() => aiController.abort(), 30000);

      const response = await fetch(imageGenUrl, {
        method: "POST",
        signal: aiController.signal,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          prompt: `Ultra realistic editorial photograph: ${prompt}. Professional quality, sharp focus, natural lighting, photojournalistic style.`,
          n: 1,
          size: "1024x1024",
          response_format: "b64_json",
        }),
      });
      clearTimeout(aiTimeout);

      if (response.ok) {
        const data: any = await response.json();
        if (data.data?.[0]?.b64_json) {
          const imgBuffer = Buffer.from(data.data[0].b64_json, "base64");
          const sharp = (await import("sharp")).default;
          await sharp(imgBuffer)
            .png({ quality: 90 })
            .toFile(outputPath);

          console.log(`[TrendEngine] Generated AI image: ${filename}`);
          return outputPath;
        }
      }
      console.warn(`[TrendEngine] AI image generation API returned ${response.status}`);
    }

    return null;
  } catch (error: any) {
    console.warn(`[TrendEngine] AI image generation failed: ${error.message}`);
    return null;
  }
}

async function resolvePostImage(
  sourceImageUrl: string | null,
  aiImagePrompt: string | null,
  imageHeadline: string,
  imageSubtext: string,
  templateStyle: TemplateStyle,
  title: string,
  articleUrl?: string | null,
  category?: string | null
): Promise<{ mainImage: string | null; igImage: string | null; imageSource: "source" | "og" | "stock" | "ai" | "branded" }> {

  const tryBrandOverlay = async (imgPath: string, source: "source" | "og" | "stock" | "ai"): Promise<{ mainImage: string | null; igImage: string | null; imageSource: typeof source } | null> => {
    const mainPath = await applyBrandOverlay(imgPath, imageHeadline, imageSubtext, templateStyle, 1200, 630);
    const igPath = await applyBrandOverlay(imgPath, imageHeadline, imageSubtext, templateStyle, 1080, 1080);
    const mainUrl = mainPath ? getPublicImageUrl(mainPath) : null;
    const igUrl = igPath ? getPublicImageUrl(igPath) : mainUrl;
    if (mainUrl) return { mainImage: mainUrl, igImage: igUrl, imageSource: source };
    return null;
  };

  if (sourceImageUrl) {
    const downloaded = await downloadSourceImage(sourceImageUrl, title);
    if (downloaded) {
      const result = await tryBrandOverlay(downloaded, "source");
      if (result) {
        console.log(`[TrendEngine] Using source article image with brand overlay`);
        return result;
      }
    }
    console.warn(`[TrendEngine] Source image processing failed`);
  }

  if (articleUrl) {
    const ogImageUrl = await fetchOgImageFromArticle(articleUrl);
    if (ogImageUrl) {
      const downloaded = await downloadSourceImage(ogImageUrl, title);
      if (downloaded) {
        const result = await tryBrandOverlay(downloaded, "og");
        if (result) {
          console.log(`[TrendEngine] Using og:image from article page with brand overlay`);
          return result;
        }
      }
    }
    console.warn(`[TrendEngine] og:image not available`);
  }

  const stockPhoto = await searchStockPhoto(category || "default", title);
  if (stockPhoto) {
    const imgPath = stockPhoto.localPath || await downloadSourceImage(stockPhoto.url, title);
    if (imgPath) {
      const result = await tryBrandOverlay(imgPath, "stock");
      if (result) {
        console.log(`[TrendEngine] Using stock photo by ${stockPhoto.photographer} with brand overlay`);
        return result;
      }
    }
    console.warn(`[TrendEngine] Stock photo processing failed`);
  }

  if (aiImagePrompt) {
    const aiImage = await generateAIImage(aiImagePrompt, title);
    if (aiImage) {
      const result = await tryBrandOverlay(aiImage, "ai");
      if (result) {
        console.log(`[TrendEngine] Using AI-generated image with brand overlay`);
        return result;
      }
    }
    console.warn(`[TrendEngine] AI image generation failed, falling back to branded card...`);
  }

  const mainPath = await generatePostImage(imageHeadline, imageSubtext, templateStyle);
  const mainImage = mainPath ? getPublicImageUrl(mainPath) : null;
  const igPath = await generateInstagramImage(imageHeadline, imageSubtext, templateStyle);
  const igImage = igPath ? getPublicImageUrl(igPath) : (mainImage ?? null);

  return { mainImage, igImage, imageSource: "branded" };
}

const TOPIC_SEARCH_TERMS: Record<string, string[]> = {
  "Data Breaches": ["data security", "cybersecurity lock", "digital security"],
  "Phishing": ["email security", "phishing scam", "cyber attack warning"],
  "Malware": ["computer virus", "malware code", "cybersecurity threat"],
  "Ransomware": ["ransomware lock", "encrypted files", "cyber extortion"],
  "Privacy": ["digital privacy", "data protection", "online privacy"],
  "Scams": ["online fraud", "scam alert", "internet safety"],
  "Family Safety": ["family technology", "children internet safety", "parental control"],
  "Government": ["government cybersecurity", "national security digital", "federal cyber"],
  "Business": ["corporate security", "business cybersecurity", "enterprise security"],
  "Mobile Security": ["smartphone security", "mobile device protection", "phone security"],
  "IoT": ["smart home security", "iot devices", "connected devices security"],
  "AI & Security": ["artificial intelligence security", "AI technology", "machine learning security"],
  "default": ["cybersecurity", "digital security", "internet protection"],
};

const LOCAL_STOCK_PHOTOS_DIR = path.join(process.cwd(), ".local", "stock-photos");
const PICSUM_TECH_IDS = [0, 1, 2, 60, 119, 160, 180, 201, 366, 367, 403, 453, 537, 593, 756];

async function ensureLocalStockPhotos(): Promise<void> {
  if (!fs.existsSync(LOCAL_STOCK_PHOTOS_DIR)) {
    fs.mkdirSync(LOCAL_STOCK_PHOTOS_DIR, { recursive: true });
  }
  const existing = fs.readdirSync(LOCAL_STOCK_PHOTOS_DIR).filter(f => f.endsWith(".jpg"));
  if (existing.length >= 5) return;

  console.log(`[TrendEngine] Downloading local stock photo set...`);
  const ids = PICSUM_TECH_IDS.sort(() => Math.random() - 0.5).slice(0, 8);
  for (const id of ids) {
    const filePath = path.join(LOCAL_STOCK_PHOTOS_DIR, `stock-${id}.jpg`);
    if (fs.existsSync(filePath)) continue;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const resp = await fetch(`https://picsum.photos/id/${id}/1920/1080`, {
        signal: controller.signal,
        headers: { "User-Agent": "curl/8.0" },
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const buffer = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`[TrendEngine] Downloaded stock photo: stock-${id}.jpg (${buffer.length} bytes)`);
      }
    } catch {
    }
  }
}

function getLocalStockPhoto(): string | null {
  if (!fs.existsSync(LOCAL_STOCK_PHOTOS_DIR)) return null;
  const photos = fs.readdirSync(LOCAL_STOCK_PHOTOS_DIR).filter(f => f.endsWith(".jpg"));
  if (photos.length === 0) return null;
  const chosen = photos[Math.floor(Math.random() * photos.length)];
  return path.join(LOCAL_STOCK_PHOTOS_DIR, chosen);
}

function extractSearchQuery(title: string, category: string): string[] {
  const STOP_WORDS = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "has", "have", "been", "will", "from",
    "they", "been", "said", "each", "she", "which", "their", "what", "about",
    "would", "make", "like", "just", "over", "such", "take", "than", "them",
    "very", "some", "could", "into", "year", "plan", "know", "time", "that",
    "with", "this", "your", "how", "why", "new", "most", "more", "after",
    "also", "made", "many", "before", "must", "through", "back", "should",
    "where", "much", "every", "same", "being", "here", "does", "puts",
    "keep", "gets", "says", "come", "look", "find", "ways", "next",
  ]);

  const CYBER_VISUAL_MAP: Record<string, string> = {
    "hack": "hacker computer dark room",
    "breach": "data breach cybersecurity",
    "ransomware": "ransomware attack locked computer",
    "phishing": "phishing email suspicious message",
    "malware": "malware virus computer code",
    "scam": "online scam fraud warning",
    "password": "password security login screen",
    "vpn": "vpn secure connection network",
    "encryption": "encryption padlock digital security",
    "privacy": "digital privacy surveillance camera",
    "identity": "identity theft stolen data",
    "android": "android smartphone mobile security",
    "iphone": "iphone smartphone mobile device",
    "apple": "apple device technology",
    "google": "google technology company office",
    "microsoft": "microsoft windows computer",
    "facebook": "social media privacy data",
    "ai": "artificial intelligence technology robot",
    "deepfake": "deepfake artificial intelligence face",
    "spyware": "spyware surveillance monitoring",
    "trojan": "trojan virus cybersecurity",
    "zero-day": "zero day exploit vulnerability code",
    "supply chain": "supply chain software development",
    "cloud": "cloud computing server data center",
    "router": "wifi router network security",
    "smart home": "smart home iot devices",
    "children": "children internet safety family",
    "family": "family using technology together",
    "bank": "online banking financial security",
    "crypto": "cryptocurrency bitcoin digital finance",
    "telegram": "messaging app encrypted communication",
    "chrome": "google chrome web browser",
    "firefox": "web browser internet security",
    "windows": "windows computer desktop security",
    "linux": "linux server technology",
    "quantum": "quantum computing technology",
    "surveillance": "surveillance camera security monitoring",
    "data": "data center server technology",
    "exploit": "cybersecurity exploit code terminal",
    "vulnerability": "software vulnerability bug code",
    "patch": "software update security patch",
  };

  const lowerTitle = title.toLowerCase();

  for (const [keyword, visualQuery] of Object.entries(CYBER_VISUAL_MAP)) {
    if (lowerTitle.includes(keyword)) {
      return [visualQuery];
    }
  }

  const words = lowerTitle
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  if (words.length >= 2) {
    return [words.slice(0, 3).join(" ") + " technology"];
  }

  const searchTerms = TOPIC_SEARCH_TERMS[category] || TOPIC_SEARCH_TERMS["default"];
  return [searchTerms[Math.floor(Math.random() * searchTerms.length)]];
}

async function searchUnsplashPhoto(query: string): Promise<{ url: string; photographer: string } | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`,
      { signal: controller.signal, headers: { "Authorization": `Client-ID ${accessKey}` } }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[TrendEngine] Unsplash returned ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.results?.length) return null;

    const validPhotos = data.results.filter((p: any) => (p.width || 0) >= 1200 && (p.height || 0) >= 630);
    const pool = validPhotos.length > 0 ? validPhotos : data.results;
    const photo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];
    const photoUrl = photo.urls?.raw ? `${photo.urls.raw}&w=2400&q=85&fm=jpg` : photo.urls?.full || photo.urls?.regular;
    const photographer = photo.user?.name || "Unsplash";

    if (!photoUrl) return null;

    console.log(`[TrendEngine] Unsplash photo: "${(photo.alt_description || '').substring(0, 50)}" by ${photographer} (query: "${query}", ${photo.width}x${photo.height})`);
    return { url: photoUrl, photographer };
  } catch (error: any) {
    console.warn(`[TrendEngine] Unsplash search failed: ${error.message}`);
    return null;
  }
}

async function searchShutterstockPhoto(query: string): Promise<{ url: string; photographer: string } | null> {
  const consumerKey = process.env.SHUTTERSTOCK_CONSUMER_KEY;
  const consumerSecret = process.env.SHUTTERSTOCK_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) return null;

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.shutterstock.com/v2/images/search?query=${encodeURIComponent(query)}&per_page=10&orientation=horizontal&image_type=photo&sort=relevance&view=full`,
      { signal: controller.signal, headers: { "Authorization": `Basic ${auth}` } }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[TrendEngine] Shutterstock returned ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.data?.length) return null;

    const photos = data.data.filter((img: any) => {
      const a = img.assets?.huge || img.assets?.preview_1500 || {};
      return (a.width || 0) >= 1000;
    });

    const pool = photos.length > 0 ? photos : data.data;
    const photo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];
    const asset = photo.assets?.huge || photo.assets?.preview_1500 || photo.assets?.preview || {};
    const photoUrl = asset.url;
    const photographer = photo.contributor?.id ? `Shutterstock #${photo.id}` : "Shutterstock";

    if (!photoUrl) return null;

    console.log(`[TrendEngine] Shutterstock photo: "${(photo.description || '').substring(0, 50)}" (query: "${query}", ${asset.width || '?'}x${asset.height || '?'})`);
    return { url: photoUrl, photographer };
  } catch (error: any) {
    console.warn(`[TrendEngine] Shutterstock search failed: ${error.message}`);
    return null;
  }
}

async function searchPexelsPhoto(query: string, category: string): Promise<{ url: string; photographer: string } | null> {
  const pexelsApiKey = process.env.PEXELS_API_KEY;
  const pexelsHeaders: Record<string, string> = { "Accept": "*/*" };
  if (pexelsApiKey) {
    pexelsHeaders["Authorization"] = pexelsApiKey;
  }
  pexelsHeaders["User-Agent"] = "curl/8.0";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape&size=large`,
      { signal: controller.signal, headers: pexelsHeaders }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data: any = await response.json();
      if (data.photos?.length) {
        const validPhotos = data.photos.filter((p: any) => {
          const w = p.width || 0;
          const h = p.height || 0;
          return w >= 1200 && h >= 630;
        });

        const pool = validPhotos.length > 0 ? validPhotos : data.photos;
        const photo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];
        const photoUrl = photo.src.original || photo.src.large2x || photo.src.large;
        console.log(`[TrendEngine] Pexels stock photo: "${photo.alt}" by ${photo.photographer} (query: "${query}", ${photo.width}x${photo.height})`);
        return { url: photoUrl, photographer: photo.photographer };
      }
    }

    const fallbackQuery = (TOPIC_SEARCH_TERMS[category] || TOPIC_SEARCH_TERMS["default"])[0];
    if (fallbackQuery !== query) {
      console.log(`[TrendEngine] Pexels no results for "${query}", trying fallback "${fallbackQuery}"...`);
      const fbController = new AbortController();
      const fbTimeout = setTimeout(() => fbController.abort(), 8000);
      const fbResponse = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(fallbackQuery)}&per_page=10&orientation=landscape&size=large`,
        { signal: fbController.signal, headers: pexelsHeaders }
      );
      clearTimeout(fbTimeout);

      if (fbResponse.ok) {
        const fbData: any = await fbResponse.json();
        if (fbData.photos?.length) {
          const photo = fbData.photos[Math.floor(Math.random() * Math.min(fbData.photos.length, 5))];
          const photoUrl = photo.src.original || photo.src.large2x || photo.src.large;
          console.log(`[TrendEngine] Pexels fallback: "${photo.alt}" by ${photo.photographer} (query: "${fallbackQuery}")`);
          return { url: photoUrl, photographer: photo.photographer };
        }
      }
    }

    return null;
  } catch (error: any) {
    console.warn(`[TrendEngine] Pexels search failed: ${error.message}`);
    return null;
  }
}

async function searchStockPhoto(category: string, title: string): Promise<{ url: string; photographer: string; localPath?: string } | null> {
  const queries = extractSearchQuery(title, category);
  const query = queries[0];

  const unsplashResult = await searchUnsplashPhoto(query);
  if (unsplashResult) return unsplashResult;

  const pexelsResult = await searchPexelsPhoto(query, category);
  if (pexelsResult) return pexelsResult;

  console.log(`[TrendEngine] No stock photos found from Unsplash or Pexels, trying local...`);
  await ensureLocalStockPhotos();
  const localPath = getLocalStockPhoto();
  if (localPath) {
    console.log(`[TrendEngine] Using local stock photo: ${path.basename(localPath)}`);
    return { url: "", photographer: "Picsum Photos (CC0)", localPath };
  }

  return null;
}

async function applyBrandOverlay(
  sourcePath: string,
  headline: string,
  subtext: string,
  templateStyle: TemplateStyle,
  width: number,
  height: number
): Promise<string | null> {
  try {
    ensureSocialImagesDir();
    const isSquare = width === height;
    const cleanHeadline = headline.replace(/\[.*?\]\s*/g, "").trim();
    const slug = cleanHeadline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 35);
    const prefix = isSquare ? "branded-ig" : "branded";
    const filename = `${prefix}-${slug}-${Date.now()}.jpeg`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);

    const sharp = (await import("sharp")).default;
    const fontFamily = "'Inter','DejaVu Sans',Arial,sans-serif";

    const logoPath = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");
    let logoBuffer: Buffer | null = null;
    const logoSize = isSquare ? 36 : 30;
    if (fs.existsSync(logoPath)) {
      logoBuffer = await sharp(logoPath)
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    }

    const templates: Record<TemplateStyle, { accent: string; accentRgb: string; categoryLabel: string; gradientOpacity: number }> = {
      alert_card:   { accent: "#EF4444", accentRgb: "239,68,68",  categoryLabel: "SECURITY ALERT",  gradientOpacity: 0.85 },
      stat_card:    { accent: "#F97316", accentRgb: "249,115,22", categoryLabel: "CYBER NEWS",      gradientOpacity: 0.82 },
      tip_card:     { accent: "#10B981", accentRgb: "16,185,129", categoryLabel: "CYBER TIP",       gradientOpacity: 0.82 },
      insight_card: { accent: "#3B82F6", accentRgb: "59,130,246", categoryLabel: "INSIGHT",         gradientOpacity: 0.82 },
      quote_card:   { accent: "#8B5CF6", accentRgb: "139,92,246", categoryLabel: "ANALYSIS",        gradientOpacity: 0.82 },
    };
    const tmpl = templates[templateStyle];

    const baseImage = await sharp(sourcePath)
      .resize(width, height, { fit: "cover", position: "center" })
      .toBuffer();

    const uppercaseHeadline = cleanHeadline.toUpperCase();
    const maxChars = isSquare ? 18 : 32;
    let headlineLines = wrapText(uppercaseHeadline, maxChars);
    const maxLines = isSquare ? 5 : 3;
    if (headlineLines.length > maxLines) {
      headlineLines = headlineLines.slice(0, maxLines);
      headlineLines[maxLines - 1] = headlineLines[maxLines - 1].slice(0, -3) + "...";
    }

    const padX = isSquare ? 48 : 56;
    const padBottom = isSquare ? 48 : 40;

    const fontSize = isSquare
      ? (headlineLines.length > 3 ? 40 : headlineLines.length > 2 ? 46 : 52)
      : (headlineLines.length > 2 ? 36 : 42);
    const lineHeight = fontSize * 1.2;
    const categoryFontSize = isSquare ? 13 : 12;
    const subtextFontSize = isSquare ? 15 : 14;
    const brandFontSize = isSquare ? 14 : 13;

    const totalHeadlineH = headlineLines.length * lineHeight;
    const categoryH = categoryFontSize + 16;
    const subtextH = subtext ? subtextFontSize + 20 : 0;
    const brandH = brandFontSize + 8;
    const spacingBetween = 16;
    const contentH = categoryH + spacingBetween + totalHeadlineH + spacingBetween + subtextH + spacingBetween + brandH;
    const gradientH = Math.max(contentH + padBottom + 40, Math.round(height * 0.55));

    const gradientStartY = height - gradientH;
    const categoryY = height - padBottom - contentH + categoryFontSize;
    const headlineStartY = categoryY + categoryH + spacingBetween;

    const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT", "THREAT", "RISK", "FLAW", "PATCH", "UPDATE", "BLOCKS", "BANS", "DANGEROUS", "INFECTED", "SPYWARE", "TROJAN", "BACKDOOR", "SUPPLY-CHAIN", "DATA", "PRIVACY", "SURVEILLANCE", "DEEPFAKE"];

    let headlineSvg = "";
    for (let i = 0; i < headlineLines.length; i++) {
      const y = headlineStartY + i * lineHeight + fontSize * 0.85;
      const words = headlineLines[i].split(" ");
      const tspans = words.map(w => {
        const isAccent = importantTerms.some(t => w.includes(t));
        return isAccent
          ? `<tspan fill="${tmpl.accent}" font-weight="800">${escapeXml(w)}</tspan>`
          : `<tspan>${escapeXml(w)}</tspan>`;
      }).join(" ");
      headlineSvg += `<text x="${padX}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="700" fill="white" letter-spacing="0.5">${tspans}</text>`;
    }

    const subtextY = headlineStartY + totalHeadlineH + spacingBetween + subtextFontSize;
    const subtextClean = subtext ? escapeXml(subtext.slice(0, 70)) : "";

    const brandY = height - padBottom;
    const accentLineY = brandY - brandFontSize - 16;

    const categoryBadgeW = tmpl.categoryLabel.length * (categoryFontSize * 0.65) + 24;

    const overlaySvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)" />
      <stop offset="${Math.round((gradientStartY / height) * 100)}%" stop-color="rgba(0,0,0,0)" />
      <stop offset="${Math.round(((gradientStartY + gradientH * 0.3) / height) * 100)}%" stop-color="rgba(10,15,28,${tmpl.gradientOpacity * 0.6})" />
      <stop offset="100%" stop-color="rgba(10,15,28,${tmpl.gradientOpacity})" />
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#grad)" />

  <rect x="${padX}" y="${categoryY - categoryFontSize}" width="${categoryBadgeW}" height="${categoryFontSize + 10}" rx="3" fill="${tmpl.accent}" />
  <text x="${padX + categoryBadgeW / 2}" y="${categoryY}" text-anchor="middle" font-family="${fontFamily}" font-size="${categoryFontSize}" font-weight="700" fill="white" letter-spacing="2">${tmpl.categoryLabel}</text>

  ${headlineSvg}

  ${subtextClean ? `<text x="${padX}" y="${subtextY}" font-family="${fontFamily}" font-size="${subtextFontSize}" fill="rgba(255,255,255,0.7)" letter-spacing="0.3">${subtextClean}</text>` : ""}

  <rect x="${padX}" y="${accentLineY}" width="${width - padX * 2}" height="1" fill="rgba(255,255,255,0.15)" />

  <text x="${padX + (logoBuffer ? logoSize + 10 : 0)}" y="${brandY}" font-family="${fontFamily}" font-size="${brandFontSize}" font-weight="600" fill="rgba(255,255,255,0.9)" letter-spacing="1.5">GETCYBERRIGHT</text>
  <text x="${width - padX}" y="${brandY}" text-anchor="end" font-family="${fontFamily}" font-size="${Math.round(brandFontSize * 0.85)}" fill="rgba(255,255,255,0.5)">getcyberright.com</text>
</svg>`;

    const overlayBuffer = await sharp(Buffer.from(overlaySvg))
      .png()
      .toBuffer();

    const composites: sharp.OverlayOptions[] = [
      { input: overlayBuffer, top: 0, left: 0 },
    ];
    if (logoBuffer) {
      composites.push({
        input: logoBuffer,
        top: Math.round(brandY - logoSize + 4),
        left: padX,
      });
    }

    await sharp(baseImage)
      .composite(composites)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(outputPath);

    console.log(`[TrendEngine] Applied brand overlay: ${filename} (${width}x${height}, template: ${templateStyle})`);
    return outputPath;
  } catch (error: any) {
    console.error(`[TrendEngine] Brand overlay failed: ${error.message}`);
    return null;
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
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const w = word.length > maxCharsPerLine ? word.slice(0, maxCharsPerLine - 1) + "." : word;
    if (current && (current + " " + w).length > maxCharsPerLine) {
      lines.push(current);
      current = w;
    } else {
      current = current ? current + " " + w : w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function normalizeTitle(title: string): string {
  return title
    .replace(/\[.*?\]\s*/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isTitleDuplicate(title: string, existingTitles: string[]): boolean {
  const norm = normalizeTitle(title);
  if (!norm) return false;
  for (const existing of existingTitles) {
    const existingNorm = normalizeTitle(existing);
    if (!existingNorm) continue;
    if (norm === existingNorm) return true;
    const normWords = new Set(norm.split(" ").filter(w => w.length > 3));
    const existingWords = new Set(existingNorm.split(" ").filter(w => w.length > 3));
    if (normWords.size === 0 || existingWords.size === 0) continue;
    let overlap = 0;
    for (const w of normWords) {
      if (existingWords.has(w)) overlap++;
    }
    const similarity = overlap / Math.min(normWords.size, existingWords.size);
    if (similarity >= 0.75) return true;
  }
  return false;
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
    const cleanHeadline = headline.replace(/\[.*?\]\s*/g, "").trim();
    const slug = cleanHeadline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `trend-${slug}-${Date.now()}.png`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);
    const sharp = (await import("sharp")).default;

    const logoPath = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    const templates: Record<TemplateStyle, { bgFrom: string; bgTo: string; accent: string }> = {
      stat_card: { bgFrom: "#1B1B2F", bgTo: "#0A0A1A", accent: "#E8612D" },
      tip_card: { bgFrom: "#0B2027", bgTo: "#071419", accent: "#4ECDC4" },
      alert_card: { bgFrom: "#2A0A0A", bgTo: "#140505", accent: "#FF4444" },
      insight_card: { bgFrom: "#1A1230", bgTo: "#0D0920", accent: "#E8612D" },
      quote_card: { bgFrom: "#0B2035", bgTo: "#061020", accent: "#45B7D1" },
    };

    const tmpl = templates[templateStyle];
    const uppercaseHeadline = cleanHeadline.toUpperCase();
    let headlineLines = wrapText(uppercaseHeadline, 28);
    if (headlineLines.length > 4) {
      headlineLines = headlineLines.slice(0, 4);
      headlineLines[3] = headlineLines[3].slice(0, -3) + "...";
    }

    const fontSize = headlineLines.length > 3 ? 38 : headlineLines.length > 2 ? 44 : 50;
    const lineHeight = fontSize * 1.2;
    const totalTextHeight = headlineLines.length * lineHeight;
    const padX = 70;

    const headlineStartY = 630 - 90 - totalTextHeight;

    const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "SUSPENDS", "BLOCKS", "BANS", "LAUNCHES", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT"];

    let headlineSvg = "";
    for (let lineIdx = 0; lineIdx < headlineLines.length; lineIdx++) {
      const y = headlineStartY + lineIdx * lineHeight;
      const words = headlineLines[lineIdx].split(" ");
      const tspans = words.map(word => {
        const isImportant = importantTerms.some(t => word.includes(t));
        return isImportant
          ? `<tspan fill="${tmpl.accent}">${escapeXml(word)}</tspan>`
          : `<tspan>${escapeXml(word)}</tspan>`;
      }).join(" ");
      headlineSvg += `<text x="${padX}" y="${y}" font-family="'DejaVu Sans','Arial',Helvetica,sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" letter-spacing="0.5">${tspans}</text>`;
    }

    const gridLines: string[] = [];
    for (let i = 0; i < 12; i++) {
      const x = 100 + i * 100;
      gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="${tmpl.accent}" stroke-width="0.5" opacity="0.05"/>`);
    }
    for (let i = 0; i < 7; i++) {
      const y = i * 100;
      gridLines.push(`<line x1="0" y1="${y}" x2="1200" y2="${y}" stroke="${tmpl.accent}" stroke-width="0.5" opacity="0.05"/>`);
    }

    const logoSize = 30;
    const logoX = padX;
    const logoY = 30;
    const logoElement = logoBase64
      ? `<image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" opacity="0.95"/>`
      : "";
    const brandTextX = logoBase64 ? (logoX + logoSize + 10) : logoX;

    const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${tmpl.bgFrom}"/>
      <stop offset="100%" stop-color="${tmpl.bgTo}"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="80%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${tmpl.accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${tmpl.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#glowGrad)"/>

  ${gridLines.join("\n  ")}

  <circle cx="950" cy="200" r="180" fill="none" stroke="${tmpl.accent}" stroke-width="1" opacity="0.06"/>
  <circle cx="950" cy="200" r="120" fill="none" stroke="${tmpl.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="950" cy="200" r="60" fill="${tmpl.accent}" opacity="0.03"/>

  ${logoElement}
  <text x="${brandTextX}" y="${logoY + logoSize - 6}" font-family="'DejaVu Sans',Arial,sans-serif" font-size="16" font-weight="700" fill="white" letter-spacing="2" opacity="0.9">GETCYBERRIGHT</text>

  ${headlineSvg}

  <text x="${padX}" y="605" font-family="'DejaVu Sans',Arial,sans-serif" font-size="14" fill="#6B8FA3" opacity="0.8">getcyberright.com  |  Protecting Families in the Digital World</text>
</svg>`;

    await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(outputPath);
    console.log(`[TrendEngine] Generated branded image: ${filename} (template: ${templateStyle})`);
    return outputPath;
  } catch (error: any) {
    console.error("[TrendEngine] Image generation failed:", error.message);
    return null;
  }
}

async function generateInstagramImage(
  headline: string,
  subtext: string,
  templateStyle: TemplateStyle
): Promise<string | null> {
  try {
    ensureSocialImagesDir();
    const cleanHeadline = headline.replace(/\[.*?\]\s*/g, "").trim();
    const slug = cleanHeadline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `ig-${slug}-${Date.now()}.jpeg`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);
    const sharp = (await import("sharp")).default;

    const logoPath = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");
    let logoBase64 = "";
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    }

    const templates: Record<TemplateStyle, { bgFrom: string; bgTo: string; accent: string }> = {
      stat_card: { bgFrom: "#1B1B2F", bgTo: "#0A0A1A", accent: "#E8612D" },
      tip_card: { bgFrom: "#0B2027", bgTo: "#071419", accent: "#4ECDC4" },
      alert_card: { bgFrom: "#2A0A0A", bgTo: "#140505", accent: "#FF4444" },
      insight_card: { bgFrom: "#1A1230", bgTo: "#0D0920", accent: "#E8612D" },
      quote_card: { bgFrom: "#0B2035", bgTo: "#061020", accent: "#45B7D1" },
    };

    const tmpl = templates[templateStyle];
    const uppercaseHeadline = cleanHeadline.toUpperCase();
    let headlineLines = wrapText(uppercaseHeadline, 18);
    if (headlineLines.length > 5) {
      headlineLines = headlineLines.slice(0, 5);
      headlineLines[4] = headlineLines[4].slice(0, -3) + "...";
    }

    const fontSize = headlineLines.length > 4 ? 48 : headlineLines.length > 3 ? 54 : 62;
    const lineHeight = fontSize * 1.2;
    const totalTextHeight = headlineLines.length * lineHeight;
    const padX = 50;
    const headlineStartY = 1080 - 120 - totalTextHeight;

    const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "SUSPENDS", "BLOCKS", "BANS", "LAUNCHES", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT"];

    let headlineSvg = "";
    for (let lineIdx = 0; lineIdx < headlineLines.length; lineIdx++) {
      const y = headlineStartY + lineIdx * lineHeight;
      const words = headlineLines[lineIdx].split(" ");
      const tspans = words.map(word => {
        const isImportant = importantTerms.some(t => word.includes(t));
        return isImportant
          ? `<tspan fill="${tmpl.accent}">${escapeXml(word)}</tspan>`
          : `<tspan>${escapeXml(word)}</tspan>`;
      }).join(" ");
      headlineSvg += `<text x="${padX}" y="${y}" font-family="'DejaVu Sans','Arial',Helvetica,sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" letter-spacing="0.5">${tspans}</text>`;
    }

    const gridLines: string[] = [];
    for (let i = 0; i < 11; i++) {
      const x = 100 + i * 100;
      gridLines.push(`<line x1="${x}" y1="0" x2="${x}" y2="1080" stroke="${tmpl.accent}" stroke-width="0.5" opacity="0.04"/>`);
    }
    for (let i = 0; i < 11; i++) {
      const y = 100 + i * 100;
      gridLines.push(`<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="${tmpl.accent}" stroke-width="0.5" opacity="0.04"/>`);
    }

    const logoSize = 36;
    const logoX = padX;
    const logoY = 40;
    const logoElement = logoBase64
      ? `<image href="${logoBase64}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" opacity="0.95"/>`
      : "";
    const brandTextX = logoBase64 ? (logoX + logoSize + 10) : logoX;

    const svg = `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${tmpl.bgFrom}"/>
      <stop offset="100%" stop-color="${tmpl.bgTo}"/>
    </linearGradient>
    <radialGradient id="glowGrad" cx="70%" cy="25%" r="55%">
      <stop offset="0%" stop-color="${tmpl.accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${tmpl.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1080" height="1080" fill="url(#bgGrad)"/>
  <rect width="1080" height="1080" fill="url(#glowGrad)"/>

  ${gridLines.join("\n  ")}

  <circle cx="750" cy="300" r="200" fill="none" stroke="${tmpl.accent}" stroke-width="1" opacity="0.06"/>
  <circle cx="750" cy="300" r="130" fill="none" stroke="${tmpl.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="750" cy="300" r="60" fill="${tmpl.accent}" opacity="0.03"/>

  ${logoElement}
  <text x="${brandTextX}" y="${logoY + logoSize - 8}" font-family="'DejaVu Sans',Arial,sans-serif" font-size="18" font-weight="700" fill="white" letter-spacing="2" opacity="0.9">GETCYBERRIGHT</text>

  ${headlineSvg}

  <text x="${padX}" y="1050" font-family="'DejaVu Sans',Arial,sans-serif" font-size="15" fill="#6B8FA3" opacity="0.8">getcyberright.com</text>
</svg>`;

    await sharp(Buffer.from(svg)).flatten({ background: '#0A0A1A' }).jpeg({ quality: 92 }).toFile(outputPath);
    console.log(`[TrendEngine] Generated Instagram image: ${filename} (1080x1080, template: ${templateStyle})`);
    return outputPath;
  } catch (error: any) {
    console.error("[TrendEngine] Instagram image generation failed:", error.message);
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

const VALID_STATIC_PATHS = new Set([
  "/", "/tools", "/scam-checker", "/cyber-threat-radar", "/awareness-hub",
  "/shield", "/breach-dashboard", "/password-generator", "/browser-extension",
  "/kids", "/seniors", "/parents", "/training", "/ai-prompts", "/data-removal",
  "/resources", "/about", "/contact", "/pricing", "/report-scam",
  "/printable-guides", "/news", "/ai-safety", "/faq", "/search",
  "/small-business", "/educators", "/travel-safety",
  "/guides", "/alerts", "/scam-intel",
]);

function normalizePath(raw: string): string {
  let p = raw.replace(/[.,;:!?)]+$/, "");
  p = p.split("?")[0].split("#")[0];
  p = p.replace(/\/+$/, "") || "/";
  return p;
}

async function validateAndFixPostLinks(postContent: string): Promise<string> {
  const linkPattern = /https?:\/\/(?:www\.)?getcyberright\.com(\/[^\s)\]"',]*)/gi;
  let result = postContent;
  const matches = [...postContent.matchAll(linkPattern)];

  for (const match of matches) {
    const path = normalizePath(match[1]);
    if (VALID_STATIC_PATHS.has(path)) continue;

    const slugMatch = path.match(/^\/(guides|alerts|scam-intel|news)\/(.+)$/);
    if (slugMatch) {
      const [, section, slug] = slugMatch;
      let exists = false;
      try {
        if (section === "guides") {
          exists = !!(await storage.getGuideBySlug(slug));
        } else if (section === "alerts") {
          exists = !!(await storage.getThreatAlertBySlug(slug));
        } else if (section === "scam-intel") {
          exists = !!(await storage.getScamIntelBySlug(slug));
        } else if (section === "news") {
          exists = !!(await storage.getNewsArticleBySlug(slug));
        }
      } catch {}

      if (exists) continue;

      const fallback = `https://www.getcyberright.com/${section}`;
      const fullUrl = match[0].replace(/[.,;:!?)]+$/, "");
      result = result.replace(fullUrl, fallback);
      console.log(`[TrendEngine] Fixed dead link: ${fullUrl} → ${fallback}`);
      continue;
    }

    const fallback = "https://www.getcyberright.com/awareness-hub";
    const fullUrl = match[0].replace(/[.,;:!?)]+$/, "");
    result = result.replace(fullUrl, fallback);
    console.log(`[TrendEngine] Fixed dead link: ${fullUrl} → ${fallback}`);
  }

  return result;
}

export function getSocialScheduleStatus(): {
  isPostingDay: boolean;
  currentDay: string;
  currentPillar: string | null;
  currentTimeET: string;
  currentSlot: PostingSlot;
  postsPerDay: number;
  platformWindows: Record<string, { morning: string | null; evening: string | null; inMorningWindow: boolean; inEveningWindow: boolean }>;
} {
  const et = getETComponents();
  const pillar = getTodaysPillar();
  const etTimeStr = `${et.hour}:${String(et.minute).padStart(2, "0")} ET`;
  const slot = getCurrentSlot();

  const platformWindows: Record<string, { morning: string | null; evening: string | null; inMorningWindow: boolean; inEveningWindow: boolean }> = {};
  for (const platform of ["linkedin", "facebook", "instagram"]) {
    const windows = PLATFORM_POSTING_WINDOWS[platform];
    if (!windows) continue;
    const dayWindows = windows[et.dayOfWeek];
    if (!dayWindows) continue;

    const morningW = dayWindows.morning;
    const eveningW = dayWindows.evening;

    platformWindows[platform] = {
      morning: morningW ? `${morningW.hour}:${String(morningW.minute).padStart(2, "0")} ET` : null,
      evening: eveningW ? `${eveningW.hour}:${String(eveningW.minute).padStart(2, "0")} ET` : null,
      inMorningWindow: isPlatformInWindow(platform, "morning"),
      inEveningWindow: isPlatformInWindow(platform, "evening"),
    };
  }

  return {
    isPostingDay: isPostingDay(),
    currentDay: POSTING_DAY_NAMES[et.dayOfWeek],
    currentPillar: pillar ? PILLAR_LABELS[pillar] : null,
    currentTimeET: etTimeStr,
    currentSlot: slot,
    postsPerDay: DAILY_POST_LIMIT,
    platformWindows,
  };
}

export async function getContentMixStatus(): Promise<{ value: number; softProduct: number; directCta: number; total: number; recommendation: string }> {
  return getContentMixRatio();
}

export function isWithinAnyPostingWindow(): boolean {
  if (!isPostingDay()) return false;
  const slot = getCurrentSlot();
  return ["linkedin", "facebook", "instagram"].some(p => isPlatformInWindow(p, slot));
}

const BREAKING_NEWS_URGENCY_THRESHOLD = 3;

async function getAvailablePlatformsForBreaking(): Promise<string[]> {
  try {
    const todayET = getETDateString();
    const recentPosts = await storage.getSocialPosts("published", 200);
    const todaysPosts = recentPosts.filter((p) => {
      if (!p.publishedAt) return false;
      const postET = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric", month: "2-digit", day: "2-digit",
      }).formatToParts(new Date(p.publishedAt));
      const postDateStr = `${postET.find(x => x.type === "year")?.value}-${postET.find(x => x.type === "month")?.value}-${postET.find(x => x.type === "day")?.value}`;
      return postDateStr === todayET;
    });
    const platformCounts: Record<string, number> = {};
    for (const post of todaysPosts) {
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    }
    const channels = await getBufferChannelsByPlatform();
    return Object.keys(channels).filter(p => (platformCounts[p] || 0) < DAILY_POST_LIMIT);
  } catch {
    return ["linkedin", "facebook", "instagram"];
  }
}

export async function generateAndPublishTrendAwarePosts(options?: { skipRateLimit?: boolean; platformFilter?: string }): Promise<{
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

    let allowedPlatforms = connectedPlatforms;
    let scheduleBlocked = false;
    if (!options?.skipRateLimit) {
      const rateCheck = await checkRateLimit();
      if (!rateCheck.allowed) {
        scheduleBlocked = true;
        console.log("[TrendEngine] Outside normal schedule. Checking for breaking news override...");
      } else {
        allowedPlatforms = rateCheck.availablePlatforms;
      }
    } else {
      console.log("[TrendEngine] Rate limit bypassed (manual trigger)");
    }

    const postStyle = getTodaysPostStyle();
    const defaultTemplate = getTodaysTemplate();
    const pillar = getTodaysPillar();
    const pillarLabel = pillar ? PILLAR_LABELS[pillar] : "none";
    const et = getETComponents();
    const etTimeStr = `${et.hour}:${String(et.minute).padStart(2, "0")} ET`;
    const currentSlot = getCurrentSlot();
    console.log(`[TrendEngine] ${pillarLabel} | style: ${postStyle} | template: ${defaultTemplate} | slot: ${currentSlot} | time: ${etTimeStr}`);

    const [trendingNewsResult, guidesResult, recentPostsResult] = await Promise.allSettled([
      fetchRealThreats(),
      storage.getPublishedGuides(undefined, 30),
      storage.getSocialPosts("published", 20),
    ]);

    const trendingNews = trendingNewsResult.status === "fulfilled" ? trendingNewsResult.value : [];
    const guides = guidesResult.status === "fulfilled" ? guidesResult.value : [];
    const recentPosts = recentPostsResult.status === "fulfilled" ? recentPostsResult.value : [];

    if (trendingNewsResult.status === "rejected") {
      console.error("[TrendEngine] Failed to fetch trending news:", trendingNewsResult.reason?.message || trendingNewsResult.reason);
    }
    if (guidesResult.status === "rejected") {
      console.error("[TrendEngine] Failed to fetch guides:", guidesResult.reason?.message || guidesResult.reason);
    }
    if (recentPostsResult.status === "rejected") {
      console.error("[TrendEngine] Failed to fetch recent posts:", recentPostsResult.reason?.message || recentPostsResult.reason);
    }

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

    if (isTitleDuplicate(posts.title, recentTitles)) {
      console.warn(`[TrendEngine] DUPLICATE DETECTED: "${posts.title}" is too similar to a recently published post. Skipping.`);
      return result;
    }

    if (scheduleBlocked) {
      const isBreaking = posts.trendAnalysis.urgency_score >= BREAKING_NEWS_URGENCY_THRESHOLD
        && (posts.trendAnalysis.impact_level === "high" || posts.trendAnalysis.impact_level === "medium");

      if (isBreaking) {
        const breakingPlatforms = await getAvailablePlatformsForBreaking();
        if (breakingPlatforms.length === 0) {
          console.log("[TrendEngine] BREAKING NEWS detected but all platforms already posted today. Saving as draft.");
          for (const platform of ["linkedin", "facebook", "instagram"] as const) {
            if (!channels[platform]) continue;
            const content = platform === "linkedin" ? posts.linkedin : platform === "instagram" ? posts.instagram : posts.facebook;
            await storage.createSocialPost({
              contentType: "trend_insight",
              contentId: `trend-${Date.now()}-${platform}-breaking-queued`,
              contentTitle: posts.title,
              platform,
              postContent: content,
              hashtags: posts.hashtags,
              status: "draft",
            });
          }
          console.log(`[TrendEngine] Breaking news queued as drafts: "${posts.title}" (urgency: ${posts.trendAnalysis.urgency_score}, impact: ${posts.trendAnalysis.impact_level})`);
          return result;
        }

        allowedPlatforms = breakingPlatforms;
        console.log(
          `[TrendEngine] BREAKING NEWS OVERRIDE: urgency=${posts.trendAnalysis.urgency_score}, impact=${posts.trendAnalysis.impact_level}. Publishing outside normal schedule to: ${allowedPlatforms.join(", ")}`
        );
      } else {
        console.log(
          `[TrendEngine] Story not urgent enough for breaking override (urgency: ${posts.trendAnalysis.urgency_score}, impact: ${posts.trendAnalysis.impact_level}). Requires urgency >= ${BREAKING_NEWS_URGENCY_THRESHOLD} AND medium or high impact. Skipping.`
        );
        return result;
      }
    }

    if (posts.recommendedAction === "review") {
      console.warn(
        `[TrendEngine] Content flagged for review (confidence: ${posts.confidenceScore}). Saving as draft instead of publishing.`
      );
      for (const platform of ["linkedin", "facebook", "instagram"] as const) {
        if (!channels[platform] || !allowedPlatforms.includes(platform)) continue;
        const content = platform === "linkedin" ? posts.linkedin : platform === "instagram" ? posts.instagram : posts.facebook;
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

    const { mainImage: imageUrl, igImage: igImageUrl, imageSource } = await resolvePostImage(
      posts.sourceImageUrl,
      posts.aiImagePrompt,
      posts.imageHeadline,
      posts.imageSubtext,
      templateStyle,
      posts.title,
      posts.sourceArticleUrl,
      posts.trendAnalysis.category
    );
    console.log(`[TrendEngine] Image resolved: source=${imageSource}, url=${imageUrl ? "yes" : "none"}`);

    const fixedLinkedin = await validateAndFixPostLinks(posts.linkedin);
    const fixedFacebook = await validateAndFixPostLinks(posts.facebook);
    const fixedInstagram = posts.instagram;

    const contentSlug = posts.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
    const validatedLinkedin = tagAllGcrLinks(fixedLinkedin, "linkedin", "trend_insight", contentSlug, postStyle);
    const validatedFacebook = tagAllGcrLinks(fixedFacebook, "facebook", "trend_insight", contentSlug, postStyle);
    const validatedInstagram = fixedInstagram;

    const platformFilter = options?.platformFilter;
    const platformPosts: { platform: string; content: string; image: string | null }[] = [];
    if (channels.linkedin && allowedPlatforms.includes("linkedin") && (!platformFilter || platformFilter === "linkedin")) platformPosts.push({ platform: "linkedin", content: validatedLinkedin, image: imageUrl });
    if (channels.facebook && allowedPlatforms.includes("facebook") && (!platformFilter || platformFilter === "facebook")) platformPosts.push({ platform: "facebook", content: validatedFacebook, image: imageUrl });
    if (channels.instagram && allowedPlatforms.includes("instagram") && (!platformFilter || platformFilter === "instagram")) platformPosts.push({ platform: "instagram", content: validatedInstagram, image: igImageUrl || imageUrl });

    for (const { platform, content, image } of platformPosts) {
      try {
        const { buildCampaignId } = await import("./utmTracking");
        const socialPost: InsertSocialPost = {
          contentType: "trend_insight",
          contentId: `trend-${Date.now()}-${platform}`,
          contentTitle: posts.title,
          platform,
          postContent: content,
          hashtags: posts.hashtags,
          status: "published",
          utmCampaign: buildCampaignId("trend_insight", platform, postStyle),
          postStyle,
          imageUrl: image || undefined,
        };

        const created = await storage.createSocialPost(socialPost);
        await storage.updateSocialPost(created.id, { publishedAt: new Date() });

        const channel = channels[platform];
        const { publishWithFirstComment } = await import("./bufferPublisher");
        let bufferResult = await publishWithFirstComment(channel.id, content, {
          mode: "shareNow",
          platform,
          imageUrl: image || undefined,
          sourceArticleUrl: posts.sourceArticleUrl,
        });

        if (!bufferResult.success && platform === "instagram" && image) {
          console.warn(`[TrendEngine] Instagram shareNow failed: ${bufferResult.error}. Retrying with addToQueue...`);
          bufferResult = await publishWithFirstComment(channel.id, content, {
            mode: "addToQueue",
            platform,
            imageUrl: image,
            sourceArticleUrl: posts.sourceArticleUrl,
          });
          if (bufferResult.success) {
            console.log(`[TrendEngine] Instagram retry with addToQueue succeeded`);
          }
        }

        if (!bufferResult.success && image && bufferResult.error?.toLowerCase().includes("image")) {
          console.warn(`[TrendEngine] Image rejected for ${platform}: ${bufferResult.error}. Retrying without image...`);
          bufferResult = await publishWithFirstComment(channel.id, content, {
            mode: "shareNow",
            platform,
            sourceArticleUrl: posts.sourceArticleUrl,
          });
          if (bufferResult.success) {
            console.log(`[TrendEngine] Retry without image succeeded for ${platform}`);
            await storage.updateSocialPost(created.id, { imageUrl: null });
          }
        }

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

    const isBreakingOverride = scheduleBlocked && posts.trendAnalysis.urgency_score >= BREAKING_NEWS_URGENCY_THRESHOLD;

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
      ...(pillar ? { contentPillar: pillar } : {}),
      ...(isBreakingOverride ? { breakingNewsOverride: true } : {}),
    });

    const publishLabel = isBreakingOverride ? "BREAKING" : "Pipeline";
    console.log(
      `[TrendEngine] ${publishLabel} complete: ${result.published}/${platformPosts.length} published | mode: ${posts.contentMode} | confidence: ${posts.confidenceScore} | signal: ${posts.trendAnalysis.summary.slice(0, 60)}...`
    );
  } catch (error: any) {
    console.error("[TrendEngine] Generation error:", error.message);
  }

  return result;
}
