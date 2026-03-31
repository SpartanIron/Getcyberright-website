import { storage } from "./storage";
import type { InsertEngagementOpportunity, EngagementOpportunity } from "@shared/schema";

const CYBER_KEYWORDS = [
  "cybersecurity", "data breach", "phishing", "ransomware", "malware",
  "identity theft", "online safety", "privacy", "hacking", "zero day",
  "vulnerability", "scam", "fraud", "password", "two factor",
  "encryption", "firewall", "social engineering", "dark web",
  "cyber attack", "security awareness", "digital safety",
  "parental controls", "online predator", "elder fraud",
  "tech support scam", "romance scam", "credential stuffing",
  "supply chain attack", "insider threat", "cloud security",
];

const RSS_DISCOVERY_FEEDS = [
  { url: "https://feeds.feedburner.com/TheHackersNews", source: "The Hacker News", platform: "cross-platform" },
  { url: "https://www.bleepingcomputer.com/feed/", source: "BleepingComputer", platform: "cross-platform" },
  { url: "https://krebsonsecurity.com/feed/", source: "Krebs on Security", platform: "cross-platform" },
  { url: "https://www.darkreading.com/rss.xml", source: "Dark Reading", platform: "cross-platform" },
  { url: "https://therecord.media/feed", source: "The Record", platform: "cross-platform" },
  { url: "https://www.securityweek.com/feed/", source: "SecurityWeek", platform: "cross-platform" },
  { url: "https://nakedsecurity.sophos.com/feed/", source: "Naked Security", platform: "cross-platform" },
  { url: "https://blog.talosintelligence.com/feeds/posts/default", source: "Cisco Talos", platform: "cross-platform" },
  { url: "https://www.cisa.gov/news.xml", source: "CISA", platform: "cross-platform" },
  { url: "https://www.schneier.com/feed/", source: "Schneier on Security", platform: "cross-platform" },
  { url: "https://www.troyhunt.com/rss/", source: "Troy Hunt", platform: "cross-platform" },
  { url: "https://isc.sans.edu/rssfeed.xml", source: "SANS ISC", platform: "cross-platform" },
  { url: "https://www.wired.com/feed/category/security/latest/rss", source: "Wired Security", platform: "cross-platform" },
  { url: "https://techcrunch.com/category/security/feed/", source: "TechCrunch Security", platform: "cross-platform" },
  { url: "https://arstechnica.com/tag/security/feed/", source: "Ars Technica Security", platform: "cross-platform" },
];

const LINKEDIN_HASHTAGS = [
  "#cybersecurity", "#infosec", "#datasecurity", "#phishing",
  "#ransomware", "#cybercrime", "#digitalsafety", "#onlinesafety",
  "#identitytheft", "#privacymatters", "#securityawareness",
  "#cybersecuritytips", "#dataprotection", "#informationsecurity",
  "#threatintelligence", "#incidentresponse", "#cloudsecurity",
  "#zerotrust", "#cybersecurityawareness", "#familysafety",
];

const TOPIC_CATEGORIES: Record<string, string[]> = {
  data_breach: ["breach", "leaked", "exposed", "compromised", "stolen data", "records exposed"],
  phishing: ["phishing", "spear phishing", "whaling", "email scam", "credential", "fake login"],
  ransomware: ["ransomware", "ransom", "encrypt", "lockbit", "blackcat", "extortion"],
  malware: ["malware", "trojan", "worm", "botnet", "backdoor", "rootkit", "spyware"],
  vulnerability: ["vulnerability", "cve", "zero-day", "0-day", "exploit", "patch", "update"],
  privacy: ["privacy", "surveillance", "tracking", "gdpr", "data protection", "cookies"],
  scam: ["scam", "fraud", "romance scam", "tech support scam", "pig butchering", "impersonation"],
  family_safety: ["children", "kids", "parental", "family", "senior", "elder", "teen", "online predator"],
  general: ["cybersecurity", "security", "hack", "attack", "threat", "risk"],
};

function categorizeContent(title: string, snippet: string): string {
  const text = `${title} ${snippet}`.toLowerCase();
  let bestCategory = "general";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(TOPIC_CATEGORIES)) {
    let score = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

function scoreRelevance(title: string, snippet: string, source: string): number {
  const text = `${title} ${snippet}`.toLowerCase();
  let score = 50;

  const highValueTerms = ["breach", "attack", "vulnerability", "zero-day", "ransomware", "million", "billion", "exposed"];
  for (const term of highValueTerms) {
    if (text.includes(term)) score += 8;
  }

  const familyTerms = ["family", "children", "kids", "senior", "elder", "school", "parent", "teen"];
  for (const term of familyTerms) {
    if (text.includes(term)) score += 12;
  }

  const actionTerms = ["how to", "protect", "prevent", "tips", "guide", "steps", "warning"];
  for (const term of actionTerms) {
    if (text.includes(term)) score += 5;
  }

  const premiumSources = ["cisa", "krebs", "schneier", "troy hunt", "bleepingcomputer", "the hacker news"];
  for (const s of premiumSources) {
    if (source.toLowerCase().includes(s)) score += 10;
  }

  return Math.min(100, score);
}

async function generateSuggestedComment(title: string, snippet: string, topic: string, source: string): Promise<string> {
  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic();

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are the social media voice for GetCyberRight, a cybersecurity education platform for families. Write a brief, thoughtful comment (2-3 sentences max) to post on a ${topic}-related article/post.

Article: "${title}"
Source: ${source}
Context: ${snippet?.slice(0, 200) || "N/A"}

Rules:
- Sound like a knowledgeable cybersecurity educator, not a sales pitch
- Add genuine value: share a tip, insight, or perspective the reader benefits from
- Naturally mention GetCyberRight ONLY if it fits organically (e.g. "We cover this topic in depth at GetCyberRight" or "Our team at GetCyberRight has been tracking this")
- Do NOT use hashtags, emojis, or exclamation marks
- Keep it conversational and professional
- Focus on helping the reader understand why this matters to them personally

Write ONLY the comment text, nothing else.`,
        },
      ],
    });

    const textBlock = response.content.find((b: any) => b.type === "text");
    return textBlock?.text?.trim() || generateFallbackComment(title, topic);
  } catch (error: any) {
    console.warn(`[EngagementDiscovery] AI comment generation failed: ${error.message}`);
    return generateFallbackComment(title, topic);
  }
}

function generateFallbackComment(title: string, topic: string): string {
  const templates: Record<string, string[]> = {
    data_breach: [
      "This is a critical reminder for everyone to review their accounts and enable two-factor authentication. At GetCyberRight, we help families understand exactly what to do after a breach like this.",
      "The scale of this breach is concerning. If you or your family may be affected, the most important first step is changing passwords on any related accounts and monitoring your credit reports.",
    ],
    phishing: [
      "Phishing continues to be the number one entry point for cyber attacks. The best defense is awareness — knowing what to look for before you click. We break this down in simple terms at GetCyberRight.",
      "These tactics are getting more sophisticated every day. Teaching families to pause and verify before clicking any unexpected link or message can prevent most of these attacks.",
    ],
    ransomware: [
      "Ransomware attacks are affecting organizations of all sizes. The best protection is a combination of regular backups, software updates, and security awareness training for everyone in the organization.",
      "This underscores why backup strategies and security awareness matter for businesses of every size. Prevention is far less costly than recovery.",
    ],
    vulnerability: [
      "If you haven't patched yet, now is the time. We recommend enabling automatic updates wherever possible — it's one of the simplest and most effective security measures available.",
      "Timely patching remains one of the most effective defenses. At GetCyberRight, we help families and individuals understand which updates matter most and why.",
    ],
    scam: [
      "Scams like these are designed to create urgency and bypass your critical thinking. The best defense is slowing down and verifying through official channels before taking any action.",
      "These scams are becoming increasingly convincing. We cover how to spot and avoid them at GetCyberRight — because awareness is the first line of defense.",
    ],
    family_safety: [
      "This is exactly why digital literacy conversations need to start at home. At GetCyberRight, we provide free resources to help families navigate online safety together.",
      "Protecting families online requires ongoing conversation, not just one-time settings. We help parents and caregivers stay informed about the latest risks at GetCyberRight.",
    ],
    general: [
      "Great coverage of an important topic. Cybersecurity affects everyone, and staying informed is the first step toward better protection. We cover topics like this at GetCyberRight.",
      "Important topic that deserves more attention. Understanding these risks is key to protecting yourself and your family online.",
    ],
  };

  const options = templates[topic] || templates.general;
  return options[Math.floor(Math.random() * options.length)];
}

function extractTextFromXml(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  if (!match) return "";
  return (match[1] || match[2] || "").replace(/<[^>]+>/g, "").trim();
}

export async function discoverEngagementOpportunities(): Promise<{
  discovered: number;
  sources: string[];
}> {
  const result = { discovered: 0, sources: [] as string[] };

  console.log(`[EngagementDiscovery] Starting discovery scan across ${RSS_DISCOVERY_FEEDS.length} feeds...`);

  const existingOpps = await storage.getEngagementOpportunities("all", 200);
  const existingUrls = new Set(existingOpps.map(o => o.sourceUrl).filter(Boolean));
  const existingTitles = new Set(existingOpps.map(o => o.sourceTitle.toLowerCase().trim()));

  for (const feed of RSS_DISCOVERY_FEEDS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(feed.url, {
        signal: controller.signal,
        headers: { "User-Agent": "GetCyberRight/1.0 EngagementBot" },
      });
      clearTimeout(timeout);

      if (!response.ok) continue;

      const xml = await response.text();

      const items: { title: string; link: string; description: string }[] = [];
      const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
      const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/gi;

      let match;
      while ((match = itemRegex.exec(xml)) !== null && items.length < 5) {
        const itemXml = match[1];
        const title = extractTextFromXml(itemXml, "title");
        let link = extractTextFromXml(itemXml, "link");
        if (!link) {
          const linkMatch = itemXml.match(/<link[^>]*href="([^"]+)"/i);
          if (linkMatch) link = linkMatch[1];
        }
        const description = extractTextFromXml(itemXml, "description");
        if (title) items.push({ title, link, description });
      }

      while ((match = entryRegex.exec(xml)) !== null && items.length < 5) {
        const entryXml = match[1];
        const title = extractTextFromXml(entryXml, "title");
        let link = "";
        const linkMatch = entryXml.match(/<link[^>]*href="([^"]+)"/i);
        if (linkMatch) link = linkMatch[1];
        if (!link) link = extractTextFromXml(entryXml, "link");
        const description = extractTextFromXml(entryXml, "content") || extractTextFromXml(entryXml, "summary");
        if (title) items.push({ title, link, description });
      }

      const recentItems = items.slice(0, 3);

      for (const item of recentItems) {
        if (existingUrls.has(item.link)) continue;
        if (existingTitles.has(item.title.toLowerCase().trim())) continue;

        const topic = categorizeContent(item.title, item.description);
        const relevance = scoreRelevance(item.title, item.description, feed.source);

        if (relevance < 45) continue;

        const suggestedComment = await generateSuggestedComment(
          item.title,
          item.description,
          topic,
          feed.source
        );

        const platforms = ["linkedin", "facebook"];

        for (const platform of platforms) {
          const opportunity: InsertEngagementOpportunity = {
            platform,
            sourceType: "rss_article",
            sourceUrl: item.link || null,
            sourceAuthor: feed.source,
            sourceTitle: item.title,
            sourceSnippet: item.description?.slice(0, 500) || null,
            topic,
            relevanceScore: relevance,
            suggestedComment,
            status: "discovered",
          };

          await storage.createEngagementOpportunity(opportunity);
          existingUrls.add(item.link);
          existingTitles.add(item.title.toLowerCase().trim());
          result.discovered++;
        }
      }

      result.sources.push(feed.source);

      await new Promise(r => setTimeout(r, 500));
    } catch (error: any) {
      console.warn(`[EngagementDiscovery] Feed ${feed.source} failed: ${error.message}`);
    }
  }

  console.log(`[EngagementDiscovery] Scan complete: ${result.discovered} opportunities from ${result.sources.length} sources`);
  return result;
}

export async function approveOpportunity(
  id: string,
  editedComment?: string
): Promise<EngagementOpportunity | null> {
  const opp = await storage.getEngagementOpportunityById(id);
  if (!opp) return null;

  const comment = editedComment || opp.suggestedComment;
  await storage.updateEngagementOpportunity(id, {
    status: "approved",
    approvedComment: comment,
    approvedAt: new Date(),
  });

  return storage.getEngagementOpportunityById(id);
}

export async function dismissOpportunity(id: string): Promise<boolean> {
  const opp = await storage.getEngagementOpportunityById(id);
  if (!opp) return false;

  await storage.updateEngagementOpportunity(id, {
    status: "dismissed",
    dismissedAt: new Date(),
  });

  return true;
}

export async function getOpportunitySummary(): Promise<{
  total: number;
  discovered: number;
  approved: number;
  posted: number;
  dismissed: number;
  topTopics: { topic: string; count: number }[];
  hashtags: string[];
}> {
  const all = await storage.getEngagementOpportunities("all", 500);

  const topicCounts: Record<string, number> = {};
  let discovered = 0, approved = 0, posted = 0, dismissed = 0;

  for (const opp of all) {
    if (opp.status === "discovered") discovered++;
    else if (opp.status === "approved") approved++;
    else if (opp.status === "posted") posted++;
    else if (opp.status === "dismissed") dismissed++;

    topicCounts[opp.topic] = (topicCounts[opp.topic] || 0) + 1;
  }

  const topTopics = Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: all.length,
    discovered,
    approved,
    posted,
    dismissed,
    topTopics,
    hashtags: LINKEDIN_HASHTAGS.slice(0, 10),
  };
}

export async function cleanupOldOpportunities(daysOld: number = 7): Promise<number> {
  const all = await storage.getEngagementOpportunities("all", 1000);
  const cutoff = Date.now() - daysOld * 86400000;
  let cleaned = 0;

  for (const opp of all) {
    if (!opp.discoveredAt) continue;
    if (new Date(opp.discoveredAt).getTime() < cutoff && (opp.status === "discovered" || opp.status === "dismissed")) {
      await storage.deleteEngagementOpportunity(opp.id);
      cleaned++;
    }
  }

  if (cleaned > 0) {
    console.log(`[EngagementDiscovery] Cleaned up ${cleaned} old opportunities`);
  }

  return cleaned;
}

let discoveryInterval: NodeJS.Timeout | null = null;

export function startEngagementDiscoveryScheduler(): void {
  console.log("[EngagementDiscovery] Starting engagement discovery scheduler (every 4 hours)");

  setTimeout(async () => {
    try {
      await discoverEngagementOpportunities();
      await cleanupOldOpportunities(7);
    } catch (error: any) {
      console.error("[EngagementDiscovery] Initial scan failed:", error.message);
    }
  }, 60000);

  discoveryInterval = setInterval(async () => {
    try {
      await discoverEngagementOpportunities();
      await cleanupOldOpportunities(7);
    } catch (error: any) {
      console.error("[EngagementDiscovery] Scheduled scan failed:", error.message);
    }
  }, 4 * 60 * 60 * 1000);
}

export function stopEngagementDiscoveryScheduler(): void {
  if (discoveryInterval) {
    clearInterval(discoveryInterval);
    discoveryInterval = null;
  }
}
