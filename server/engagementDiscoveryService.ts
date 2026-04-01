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
          content: `Write a short comment (2-3 sentences) responding to this ${topic}-related article, as if you're a real person who works in cybersecurity and genuinely cares about helping everyday people stay safe online.

Article: "${title}"
Source: ${source}
Context: ${snippet?.slice(0, 200) || "N/A"}

Critical rules for sounding human:
- Write like you're texting a friend about something important, not writing a press release
- Use contractions naturally (don't, it's, that's, we've)
- Start with a reaction a real person would have ("This one hits close to home" or "Saw this coming" or "My parents almost fell for something like this last month")
- Share ONE specific, practical thing someone can actually do right now
- Vary your sentence lengths. Mix short punchy ones with longer ones.
- It's okay to be slightly informal, slightly opinionated, or to show real concern
- Reference personal experience or "I've seen this happen" type language occasionally
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
    return textBlock?.text?.trim() || generateFallbackComment(title, topic);
  } catch (error: any) {
    console.warn(`[EngagementDiscovery] AI comment generation failed: ${error.message}`);
    return generateFallbackComment(title, topic);
  }
}

function generateFallbackComment(title: string, topic: string): string {
  const templates: Record<string, string[]> = {
    data_breach: [
      "I've been helping people deal with breaches for years and the same advice always applies — change those passwords now, turn on two-factor auth, and check your bank statements for the next few weeks. Don't wait on the company to tell you what to do.",
      "Honestly, the number of people who reuse passwords across sites is what makes breaches like this so dangerous. If that email/password combo is the same one you use for your bank, go change it right now. Seriously, right now.",
      "My neighbor got hit by a breach like this last year and didn't find out until someone opened a credit card in her name. Freezing your credit with all three bureaus takes about 15 minutes and it's free.",
    ],
    phishing: [
      "I tell everyone the same thing — if an email makes you feel like you need to act RIGHT NOW, that's exactly when you should slow down. Scammers bank on panic. Call the company directly using a number you look up yourself.",
      "The phishing emails going around lately are wild. I almost clicked one myself last week that looked exactly like a real shipping notification. The only giveaway was hovering over the link and seeing a weird domain.",
      "My mom got one of these last month and thankfully called me before clicking. The trick that works best is just picking up the phone and calling whoever supposedly sent you the message.",
    ],
    ransomware: [
      "The thing nobody talks about enough with ransomware is backups. A $50 external hard drive and 20 minutes a week backing up your files takes away most of the leverage these attackers have.",
      "Seen way too many small businesses get wiped out by this. The fix isn't complicated — keep backups offline, keep your software updated, and make sure your team knows not to open weird attachments.",
    ],
    vulnerability: [
      "If you haven't updated yet, go do it now. I know update notifications are annoying but this one actually matters. Takes a couple minutes and saves you a massive headache later.",
      "I keep telling people — turn on automatic updates and forget about it. Most of these vulnerabilities get exploited within days of being announced. The people who patch fast are the ones who don't get hit.",
    ],
    scam: [
      "This one's been making the rounds. The biggest red flag is always urgency — \"act now or lose your account\" type language. Real companies don't operate that way. When in doubt, hang up and call back using the number on their actual website.",
      "My uncle fell for something like this a few months back. The scammers are getting really good at sounding legit. Best thing you can do is just never act on an unsolicited call or message without verifying independently first.",
    ],
    family_safety: [
      "I've found the best thing you can do is just sit with your kids while they're online sometimes. Not hovering, just being around and asking what they're watching or who they're talking to. It opens up conversations naturally.",
      "Had a good talk with my teenager last week about this kind of thing. The reality is they're going to be online whether we like it or not — the goal is making sure they know what to watch out for and feel comfortable telling us when something feels off.",
    ],
    general: [
      "This is worth paying attention to. The thing most people don't realize is that basic precautions — strong unique passwords, two-factor auth, and not clicking random links — stop the vast majority of attacks.",
      "We've been seeing a lot more of this lately. If nothing else, take five minutes today to make sure your important accounts have two-factor turned on. It's the single best thing you can do.",
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

        const suggestedComment = await generateSuggestedComment(
          item.title,
          item.description,
          topic,
          feed.source
        );

        const platforms = ["linkedin", "facebook"];

        for (const platform of platforms) {
          const searchUrl = generatePlatformSearchUrl(platform, item.title, item.link);

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
): Promise<{ success: boolean; error?: string; platforms?: string[] }> {
  const opp = await storage.getEngagementOpportunityById(id);
  if (!opp) return { success: false, error: "Opportunity not found" };

  const comment = editedComment || opp.approvedComment || opp.suggestedComment;
  if (!comment) return { success: false, error: "No comment text available" };

  try {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic();
    const { getBufferChannelsByPlatform, publishWithFirstComment } = await import("./bufferPublisher");

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
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
- LinkedIn: 120-200 words, a bit more polished but still conversational, 3-4 hashtags at the end only
- Facebook: 60-120 words, casual and warm, no hashtags

Absolute don'ts:
- No emojis, no exclamation marks
- Don't say "in today's digital landscape" or "it's crucial" or "cyber hygiene" or "threat actors"
- Don't start with "As cybersecurity professionals" or "Here at GetCyberRight"
- Don't sound like a press release or a LinkedIn thought leader parody
- Don't include the article URL (it goes in a separate comment)
- Only mention getcyberright.com if it genuinely fits the flow — skip it most of the time

Write ONLY the post text for ${opp.platform}, nothing else.`,
        },
      ],
    });

    const textBlock = response.content.find((b: any) => b.type === "text");
    const postContent = textBlock?.text?.trim();
    if (!postContent) return { success: false, error: "AI failed to generate post content" };

    const channels = await getBufferChannelsByPlatform();
    const channel = channels[opp.platform];
    if (!channel) return { success: false, error: `No Buffer channel configured for ${opp.platform}` };

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
