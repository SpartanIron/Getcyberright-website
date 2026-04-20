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

async function generateSuggestedComment(
  title: string,
  snippet: string,
  topic: string,
  source: string,
  platform: string,
): Promise<string> {
  const platformTone =
    platform === "linkedin"
      ? `Tone: professional but human, 2-3 sentences. Like a thoughtful security practitioner replying on LinkedIn. Plain prose, no hashtags, no emojis. Slightly more polished sentence structure.`
      : `Tone: warm and conversational, 2-3 sentences. Like talking to a neighbor on Facebook who's worried about staying safe online. Friendly, plain language, no hashtags, no emojis, no jargon.`;

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({
      apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Write a short comment (2-3 sentences) for ${platform} responding to this ${topic}-related article, as if you're a real person who works in cybersecurity and genuinely cares about helping everyday people stay safe online.

Article: "${title}"
Source: ${source}
Context: ${snippet?.slice(0, 200) || "N/A"}

${platformTone}

Critical rules for sounding human:
- Use contractions naturally (don't, it's, that's, we've)
- Start with a reaction a real person would have, not a corporate opener
- Share ONE specific, practical thing someone can actually do right now
- Vary your sentence lengths. Mix short punchy ones with longer ones.
- Do NOT say "Great article" or "Important read" or any generic praise
- Do NOT use corporate phrases like "It's crucial that" or "It is imperative" or "This underscores the importance"
- Do NOT use hashtags, emojis, or exclamation marks
- Do NOT mention GetCyberRight unless it flows completely naturally (skip it most of the time)
- Do NOT start with "As a cybersecurity professional" or similar self-important openers
- Never use the phrase "in today's digital landscape" or "cyber hygiene" or "threat landscape"

Write ONLY the comment text, nothing else.`,
        },
      ],
    });

    const textBlock = response.content.find((b: any) => b.type === "text");
    return textBlock?.text?.trim() || generateFallbackComment(title, topic, platform);
  } catch (error: any) {
    console.warn(`[EngagementDiscovery] AI comment generation failed: ${error.message}`);
    return generateFallbackComment(title, topic, platform);
  }
}

function generateFallbackComment(title: string, topic: string, platform: string): string {
  const linkedinTemplates: Record<string, string[]> = {
    data_breach: [
      "Breaches like this are a good reminder to rotate any passwords reused across accounts and turn on multi-factor authentication where it isn't already enabled. A quick credit freeze with the three bureaus is also worth the fifteen minutes it takes.",
      "The pattern here is familiar: one exposed credential set ends up unlocking a dozen unrelated accounts. If your team hasn't audited password reuse recently, this is a reasonable nudge to do it this week.",
    ],
    phishing: [
      "Worth flagging to non-technical colleagues and family. The reliable defense is still the same: when a message pushes urgency, slow down and verify through a channel you trust, not the one in the message.",
      "Phishing kits keep getting better, and the visual tells we used to rely on are mostly gone. Hovering links and confirming sender domains is a habit worth building into everyday email triage.",
    ],
    ransomware: [
      "Tested, offline backups remain the single biggest factor in how quickly an organization recovers from incidents like this. Worth confirming yours actually restore, not just that they exist.",
      "Most of the ransomware cases I have seen up close started with an unpatched edge device or a reused admin credential. The basics still carry most of the weight.",
    ],
    vulnerability: [
      "If your environment is affected, prioritizing the patch this week is the right call. The window between disclosure and active exploitation keeps shrinking.",
      "A good moment to confirm your inventory actually reflects what is deployed. The hard part of vulnerability response is usually knowing where the affected component is running.",
    ],
    scam: [
      "The consistent thread across these scams is manufactured urgency. Building a habit of pausing and calling back through a number you look up yourself defuses most of them.",
      "Worth sharing with family members who may be targeted by these. The advice that actually sticks is simple: never act on an unsolicited message without independently verifying it first.",
    ],
    family_safety: [
      "The conversations that work best with kids are the ongoing low-pressure ones, not the formal sit-downs. Asking what they are watching or who they are talking to opens the door naturally.",
      "Helpful framing for parents. The goal is not to restrict access entirely, but to make sure kids feel comfortable telling you when something online feels off.",
    ],
    general: [
      "Useful read. The fundamentals still cover the majority of risk: unique passwords, multi-factor authentication, and skepticism toward unsolicited messages.",
      "Worth a few minutes today to confirm multi-factor authentication is on for your important accounts. It remains the highest-leverage thing most people can do.",
    ],
  };

  const facebookTemplates: Record<string, string[]> = {
    data_breach: [
      "Saw this and wanted to share. If you reuse the same password anywhere, today is a good day to change it on the important accounts. Turning on two-step login takes a couple of minutes and helps a lot.",
      "My neighbor got hit by something like this last year. Freezing your credit at the three big bureaus is free and only takes about fifteen minutes. Worth doing.",
    ],
    phishing: [
      "The scam emails going around right now are really convincing. If a message is rushing you to do something, slow down and call the company directly using a number from their real website.",
      "My mom almost clicked one of these last week. Easiest rule that actually works: pick up the phone and call whoever supposedly sent the message before you do anything.",
    ],
    ransomware: [
      "Quick reminder for anyone running a small business or working from home. A cheap external drive and a few minutes of backups every week takes most of the power away from these attacks.",
      "Seen this hit too many small shops. Keep a backup that is not always plugged in, keep your software updated, and you are ahead of most of the danger.",
    ],
    vulnerability: [
      "If you have been ignoring those update notifications, this is your sign. Takes a few minutes and saves a real headache later.",
      "Honest tip: turn on automatic updates and forget about it. Most of the people who get hit are the ones who waited.",
    ],
    scam: [
      "Heads up, this one is making the rounds. The biggest tell is always urgency, like act now or lose your account. Real companies do not work that way.",
      "My uncle nearly fell for something like this. Best thing you can do is hang up or close the message and call back using a number you find yourself.",
    ],
    family_safety: [
      "Found that just sitting near the kids while they are online, not hovering, makes them way more comfortable telling you when something feels weird.",
      "Had a really good talk with my teenager about this kind of thing last week. Knowing they can come to me without getting in trouble matters more than any rule.",
    ],
    general: [
      "Good reminder. Take five minutes today and turn on two-step login for your email and bank. It is the single best thing most of us can do.",
      "Sharing because this matters. Strong unique passwords and being slow to click on stuff stops almost everything before it starts.",
    ],
  };

  const templates = platform === "facebook" ? facebookTemplates : linkedinTemplates;
  const options = templates[topic] || templates.general;
  return options[Math.floor(Math.random() * options.length)];
}

function extractTextFromXml(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  if (!match) return "";
  return (match[1] || match[2] || "").replace(/<[^>]+>/g, "").trim();
}

function generatePlatformSearchUrl(platform: string, title: string, articleUrl: string): string {
  const shortTitle = title.split(/[:\-–—|]/).slice(0, 2).join(" ").trim().slice(0, 80);
  const searchTerms = shortTitle || title.slice(0, 80);

  if (platform === "linkedin") {
    return `https://www.linkedin.com/search/results/content/?keywords=${encodeURIComponent(searchTerms)}&sortBy=%22date_posted%22`;
  }

  if (platform === "facebook") {
    return `https://www.facebook.com/search/posts/?q=${encodeURIComponent(searchTerms)}`;
  }

  return articleUrl || "";
}

function extractLinkFromXml(xml: string): string {
  const cdataLink = xml.match(/<link[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/link>/i);
  if (cdataLink && cdataLink[1].trim()) return cdataLink[1].trim();

  const textLink = xml.match(/<link[^>]*>(https?:\/\/[^<]+)<\/link>/i);
  if (textLink && textLink[1].trim()) return textLink[1].trim();

  const hrefLink = xml.match(/<link[^>]*\bhref="([^"]+)"/i);
  if (hrefLink && hrefLink[1].trim()) return hrefLink[1].trim();

  const guidLink = xml.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i);
  if (guidLink && guidLink[1].trim()) return guidLink[1].trim();

  return "";
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
        const link = extractLinkFromXml(itemXml);
        const description = extractTextFromXml(itemXml, "description");
        if (title) items.push({ title, link, description });
      }

      while ((match = entryRegex.exec(xml)) !== null && items.length < 5) {
        const entryXml = match[1];
        const title = extractTextFromXml(entryXml, "title");
        const link = extractLinkFromXml(entryXml);
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

        const platforms = ["linkedin", "facebook"];

        for (const platform of platforms) {
          const searchUrl = generatePlatformSearchUrl(platform, item.title, item.link);

          const suggestedComment = await generateSuggestedComment(
            item.title,
            item.description,
            topic,
            feed.source,
            platform,
          );

          const opportunity: InsertEngagementOpportunity = {
            platform,
            sourceType: "rss_article",
            sourceUrl: item.link || null,
            platformSearchUrl: searchUrl,
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

export async function createResponsePost(
  id: string,
  editedComment?: string
): Promise<{ success: boolean; error?: string; platforms?: string[]; manual?: boolean; platform?: string; content?: string }> {
  const opp = await storage.getEngagementOpportunityById(id);
  if (!opp) return { success: false, error: "Opportunity not found" };

  const comment = editedComment || opp.approvedComment || opp.suggestedComment;
  if (!comment) return { success: false, error: "No comment text available" };

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({
      apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
      baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
    });
    const { getBufferChannelsByPlatform, publishWithFirstComment } = await import("./bufferPublisher");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
      messages: [
        {
          role: "user",
          content: `Write a ${opp.platform} post about this cybersecurity topic. Write like a real person who works in security and talks about it because they genuinely care — not like a brand account.

Article: "${opp.sourceTitle}"
Source: ${opp.sourceAuthor || "Unknown"}
Context: ${opp.sourceSnippet?.slice(0, 300) || "N/A"}
Topic: ${opp.topic}

Your take on this: "${comment}"

How to write this:
- Open with a hook that feels like something you'd actually say out loud ("So this happened..." or "Been thinking about this one all morning" or "Here's the thing nobody's talking about with this breach")
- Reference the source naturally — don't make it sound like a book report
- Give ONE concrete thing people can actually do. Be specific. "Change your password" is too vague. "Go to haveibeenpwned.com and check if your email shows up" is useful.
- Write like you're explaining this to a smart friend who doesn't work in tech
- Use contractions. Use short sentences mixed with longer ones. Let some personality show.
- It's fine to express a real opinion ("honestly this was preventable" or "this worries me")

Platform rules:
- LinkedIn: 60-80 words max (STRICTLY ENFORCED), a bit more polished but still conversational, 3-4 hashtags at the end only
- Facebook: 40-60 words max (STRICTLY ENFORCED), casual and warm, no hashtags

Absolute don'ts:
- No emojis, no exclamation marks
- Don't say "in today's digital landscape" or "it's crucial" or "cyber hygiene" or "threat actors"
- Don't start with "As cybersecurity professionals" or "Here at GetCyberRight"
- Don't sound like a press release or a LinkedIn thought leader parody
- Don't include the article URL (it goes in a separate comment)
- Only mention getcyberright.com if it genuinely fits the flow — skip it most of the time
- NEVER fabricate statistics, numbers, or data points. Zero tolerance for hallucination
- NEVER reference old research, outdated studies, or past-year reports. No "studies show" or "research indicates" filler
- Only state facts from the provided article context. If unsure, leave it out
- Our credibility comes from being current and accurate, not from citing old reports

Write ONLY the post text for ${opp.platform}, nothing else.`,
        },
      ],
    });

    const textBlock = response.content.find((b: any) => b.type === "text");
    const postContent = textBlock?.text?.trim();
    if (!postContent) return { success: false, error: "AI failed to generate post content" };

    const channels = await getBufferChannelsByPlatform();
    const channel = channels[opp.platform];
    if (!channel) {
      await storage.updateEngagementOpportunity(id, {
        status: "approved",
        approvedComment: postContent,
        approvedAt: new Date(),
      });
      console.log(`[EngagementDiscovery] No Buffer channel for ${opp.platform}; saved manual draft for "${opp.sourceTitle.slice(0, 50)}..."`);
      return {
        success: true,
        manual: true,
        platform: opp.platform,
        content: postContent,
        platforms: [opp.platform],
      };
    }

    const result = await publishWithFirstComment(channel.id, postContent, {
      mode: "addToQueue",
      platform: opp.platform,
      sourceArticleUrl: opp.sourceUrl,
    });

    if (result.success) {
      await storage.updateEngagementOpportunity(id, {
        status: "posted",
        approvedComment: comment,
        postedAt: new Date(),
      });
      console.log(`[EngagementDiscovery] Response post created for ${opp.platform}: "${opp.sourceTitle.slice(0, 50)}..."`);
      return { success: true, platforms: [opp.platform] };
    } else {
      await storage.updateEngagementOpportunity(id, {
        postError: result.error || "Buffer publish failed",
      });
      return { success: false, error: result.error || "Buffer publish failed" };
    }
  } catch (error: any) {
    console.error(`[EngagementDiscovery] Response post error:`, error.message);
    await storage.updateEngagementOpportunity(id, {
      postError: error.message,
    });
    return { success: false, error: error.message };
  }
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
