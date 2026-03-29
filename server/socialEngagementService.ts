import * as fs from "fs";
import * as path from "path";

const PARTNERS_FILE = path.join(process.cwd(), "server", "data", "social-partners.json");

export interface SocialPartner {
  name: string;
  category: "government" | "nonprofit" | "industry" | "media" | "research" | "community";
  handles: {
    linkedin?: string;
    facebook?: string;
    x?: string;
    instagram?: string;
  };
  topics: string[];
  priority: "high" | "medium" | "low";
}

export interface LinkedInGroup {
  id: string;
  name: string;
  topics: string[];
}

export interface FacebookGroup {
  id: string;
  name: string;
  topics: string[];
}

export interface EngagementResult {
  success: boolean;
  platform: string;
  action: "like" | "comment" | "share_to_group" | "mention";
  targetId?: string;
  error?: string;
}

const DEFAULT_PARTNERS: SocialPartner[] = [
  {
    name: "CISA",
    category: "government",
    handles: { linkedin: "cikiSecurity", facebook: "CISA", x: "@CISAgov", instagram: "@cisagov" },
    topics: ["vulnerability", "data_breach", "malware", "general_awareness"],
    priority: "high",
  },
  {
    name: "FTC",
    category: "government",
    handles: { linkedin: "federal-trade-commission", facebook: "federaltradecommission", x: "@FTC", instagram: "@ftc" },
    topics: ["phishing_scam", "social_engineering", "privacy"],
    priority: "high",
  },
  {
    name: "UK NCSC",
    category: "government",
    handles: { linkedin: "ncaboratory", x: "@ABORATORY", instagram: "@ncsc_uk" },
    topics: ["vulnerability", "malware", "general_awareness"],
    priority: "high",
  },
  {
    name: "Europol",
    category: "government",
    handles: { linkedin: "europol", facebook: "Europol", x: "@Europol", instagram: "@europol" },
    topics: ["phishing_scam", "social_engineering", "data_breach"],
    priority: "high",
  },
  {
    name: "AARP Fraud Watch",
    category: "nonprofit",
    handles: { linkedin: "aarp", facebook: "AARP", x: "@AARP", instagram: "@aarp" },
    topics: ["phishing_scam", "social_engineering", "general_awareness"],
    priority: "high",
  },
  {
    name: "National Cybersecurity Alliance",
    category: "nonprofit",
    handles: { linkedin: "national-cybersecurity-alliance", facebook: "StaySafeOnline", x: "@NatlCyberSec", instagram: "@natlcybersec" },
    topics: ["general_awareness", "privacy", "phishing_scam"],
    priority: "high",
  },
  {
    name: "Internet Safety 101",
    category: "nonprofit",
    handles: { facebook: "InternetSafety101", x: "@EIEorg" },
    topics: ["general_awareness", "privacy"],
    priority: "medium",
  },
  {
    name: "SANS Institute",
    category: "research",
    handles: { linkedin: "sans-institute", facebook: "SANSInstitute", x: "@SANSInstitute", instagram: "@sansinstitute" },
    topics: ["vulnerability", "malware", "data_breach", "ai_threat"],
    priority: "medium",
  },
  {
    name: "EFF",
    category: "nonprofit",
    handles: { linkedin: "electronic-frontier-foundation", facebook: "eff", x: "@EFF", instagram: "@efforg" },
    topics: ["privacy", "general_awareness"],
    priority: "medium",
  },
  {
    name: "Krebs on Security",
    category: "media",
    handles: { x: "@braboratory" },
    topics: ["data_breach", "vulnerability", "malware", "phishing_scam"],
    priority: "medium",
  },
  {
    name: "BleepingComputer",
    category: "media",
    handles: { linkedin: "bleepingcomputer", facebook: "BleepingComputer", x: "@BleepinComputer" },
    topics: ["data_breach", "malware", "vulnerability"],
    priority: "medium",
  },
  {
    name: "ConnectSafely",
    category: "nonprofit",
    handles: { facebook: "ConnectSafely", x: "@ConnectSafely", instagram: "@connectsafely" },
    topics: ["general_awareness", "privacy"],
    priority: "medium",
  },
  {
    name: "Family Online Safety Institute",
    category: "nonprofit",
    handles: { linkedin: "family-online-safety-institute", facebook: "FABORATORY", x: "@FABORATORY" },
    topics: ["general_awareness", "privacy"],
    priority: "medium",
  },
  {
    name: "Identity Theft Resource Center",
    category: "nonprofit",
    handles: { linkedin: "identity-theft-resource-center", facebook: "idtheftcenter", x: "@IDTheftCenter" },
    topics: ["data_breach", "phishing_scam", "social_engineering"],
    priority: "medium",
  },
];

function ensureDataDir(): void {
  const dir = path.dirname(PARTNERS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function loadPartners(): SocialPartner[] {
  try {
    if (fs.existsSync(PARTNERS_FILE)) {
      const data = fs.readFileSync(PARTNERS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn("[SocialEngagement] Failed to load partners file, using defaults");
  }
  return DEFAULT_PARTNERS;
}

export function savePartners(partners: SocialPartner[]): void {
  ensureDataDir();
  fs.writeFileSync(PARTNERS_FILE, JSON.stringify(partners, null, 2));
}

export function addPartner(partner: SocialPartner): SocialPartner[] {
  const partners = loadPartners();
  const existing = partners.findIndex(
    (p) => p.name.toLowerCase() === partner.name.toLowerCase()
  );
  if (existing >= 0) {
    partners[existing] = partner;
  } else {
    partners.push(partner);
  }
  savePartners(partners);
  return partners;
}

export function removePartner(name: string): SocialPartner[] {
  let partners = loadPartners();
  partners = partners.filter((p) => p.name.toLowerCase() !== name.toLowerCase());
  savePartners(partners);
  return partners;
}

export function getRelevantPartners(
  platform: string,
  category: string,
  maxPartners: number = 3
): SocialPartner[] {
  const partners = loadPartners();

  const scored = partners
    .filter((p) => p.handles[platform as keyof SocialPartner["handles"]])
    .map((p) => {
      let score = 0;
      if (p.topics.includes(category)) score += 10;
      if (p.priority === "high") score += 5;
      else if (p.priority === "medium") score += 2;
      if (p.category === "government") score += 3;
      else if (p.category === "nonprofit") score += 2;
      return { partner: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, maxPartners).map((s) => s.partner);
}

export function formatPartnerMentions(
  platform: string,
  partners: SocialPartner[]
): string {
  const mentions = partners
    .map((p) => {
      const handle = p.handles[platform as keyof SocialPartner["handles"]];
      if (!handle) return null;

      switch (platform) {
        case "linkedin":
          return handle;
        case "facebook":
          return `@${handle}`;
        case "x":
          return handle.startsWith("@") ? handle : `@${handle}`;
        case "instagram":
          return handle.startsWith("@") ? handle : `@${handle}`;
        default:
          return null;
      }
    })
    .filter(Boolean);

  return mentions.join(" ");
}

export function buildPartnerContext(
  platform: string,
  category: string
): string {
  const partners = getRelevantPartners(platform, category, 3);
  if (partners.length === 0) return "";

  const mentionList = partners
    .map((p) => {
      const handle = p.handles[platform as keyof SocialPartner["handles"]];
      return `- ${p.name}: ${handle}`;
    })
    .join("\n");

  if (platform === "linkedin") {
    return `\nPARTNER TAGGING (naturally mention 1-2 of these organizations if their work is directly relevant to the topic):
${mentionList}
Tag them naturally in context (e.g. "as CISA recently highlighted..." or "organizations like @NatlCyberSec recommend..."). Only tag if the mention adds credibility and feels organic. Never force a tag.\n`;
  }

  if (platform === "x") {
    return `\nPARTNER TAGGING (include 1-2 relevant handles if the topic directly relates to their work):
${mentionList}
Weave them naturally into the tweet (e.g. "New advisory from ${partners[0]?.handles.x || ""}..." or tag at the end of a tweet where relevant). Only tag if it adds value.\n`;
  }

  if (platform === "facebook") {
    return `\nPARTNER TAGGING (mention 1-2 relevant organizations if their work connects to the topic):
${mentionList}
Mention them naturally in the post. Only tag if the mention adds credibility.\n`;
  }

  if (platform === "instagram") {
    return `\nPARTNER TAGGING (tag 1-2 relevant accounts in the caption if their work connects to the topic):
${mentionList}
Include their handle naturally or at the end before hashtags. Only tag if relevant.\n`;
  }

  return "";
}

export function getLinkedInGroups(): LinkedInGroup[] {
  const groupsEnv = process.env.LINKEDIN_GROUPS;
  if (!groupsEnv) return [];
  try {
    return JSON.parse(groupsEnv);
  } catch {
    return [];
  }
}

export function getFacebookGroups(): FacebookGroup[] {
  const groupsEnv = process.env.FACEBOOK_GROUPS;
  if (!groupsEnv) return [];
  try {
    return JSON.parse(groupsEnv);
  } catch {
    return [];
  }
}

function getRelevantGroups<T extends { topics: string[] }>(
  groups: T[],
  category: string
): T[] {
  return groups.filter((g) => g.topics.includes(category) || g.topics.includes("general"));
}

export async function shareToLinkedInGroups(
  content: string,
  category: string
): Promise<EngagementResult[]> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) return [];

  const groups = getRelevantGroups(getLinkedInGroups(), category);
  const results: EngagementResult[] = [];

  for (const group of groups) {
    try {
      const res = await fetch(
        `https://api.linkedin.com/v2/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
          },
          body: JSON.stringify({
            author: `urn:li:organization:${process.env.LINKEDIN_ORG_ID || ""}`,
            commentary: content,
            visibility: "PUBLIC",
            distribution: {
              feedDistribution: "MAIN_FEED",
              targetEntities: [],
              thirdPartyDistributionChannels: [],
            },
            lifecycleState: "PUBLISHED",
            isReshareDisabledByAuthor: false,
          }),
        }
      );

      if (res.ok) {
        results.push({
          success: true,
          platform: "linkedin",
          action: "share_to_group",
          targetId: group.id,
        });
        console.log(`[SocialEngagement] Shared to LinkedIn group: ${group.name}`);
      } else {
        const errBody = await res.text();
        results.push({
          success: false,
          platform: "linkedin",
          action: "share_to_group",
          targetId: group.id,
          error: `API error ${res.status}: ${errBody}`,
        });
      }
    } catch (error: any) {
      results.push({
        success: false,
        platform: "linkedin",
        action: "share_to_group",
        targetId: group.id,
        error: error.message,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return results;
}

export async function shareToFacebookGroups(
  content: string,
  category: string,
  imageUrl?: string
): Promise<EngagementResult[]> {
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  if (!token) return [];

  const groups = getRelevantGroups(getFacebookGroups(), category);
  const results: EngagementResult[] = [];

  for (const group of groups) {
    try {
      let endpoint: string;
      let body: any;

      if (imageUrl && fs.existsSync(imageUrl)) {
        endpoint = `https://graph.facebook.com/v18.0/${group.id}/photos`;
        const formData = new FormData();
        const imgBuffer = fs.readFileSync(imageUrl);
        formData.append("source", new Blob([imgBuffer], { type: "image/webp" }), "social-image.webp");
        formData.append("message", content);
        formData.append("access_token", token);

        const res = await fetch(endpoint, { method: "POST", body: formData });
        if (res.ok) {
          const result = (await res.json()) as any;
          results.push({
            success: true,
            platform: "facebook",
            action: "share_to_group",
            targetId: result.id || group.id,
          });
          console.log(`[SocialEngagement] Shared to Facebook group: ${group.name}`);
        } else {
          const errBody = await res.text();
          results.push({
            success: false,
            platform: "facebook",
            action: "share_to_group",
            targetId: group.id,
            error: `API error ${res.status}: ${errBody}`,
          });
        }
      } else {
        endpoint = `https://graph.facebook.com/v18.0/${group.id}/feed`;
        const params = new URLSearchParams({ message: content, access_token: token });
        const res = await fetch(endpoint, { method: "POST", body: params });

        if (res.ok) {
          const result = (await res.json()) as any;
          results.push({
            success: true,
            platform: "facebook",
            action: "share_to_group",
            targetId: result.id || group.id,
          });
          console.log(`[SocialEngagement] Shared to Facebook group: ${group.name}`);
        } else {
          const errBody = await res.text();
          results.push({
            success: false,
            platform: "facebook",
            action: "share_to_group",
            targetId: group.id,
            error: `API error ${res.status}: ${errBody}`,
          });
        }
      }
    } catch (error: any) {
      results.push({
        success: false,
        platform: "facebook",
        action: "share_to_group",
        targetId: group.id,
        error: error.message,
      });
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return results;
}

export async function likeRecentPostsFromPartners(
  platform: string,
  category: string,
  maxLikes: number = 5
): Promise<EngagementResult[]> {
  const results: EngagementResult[] = [];

  if (platform === "facebook") {
    const token = process.env.FACEBOOK_PAGE_TOKEN;
    const pageId = process.env.FACEBOOK_PAGE_ID;
    if (!token || !pageId) return [];

    const partners = getRelevantPartners("facebook", category, 3);
    for (const partner of partners) {
      try {
        const handle = partner.handles.facebook;
        if (!handle) continue;

        const searchRes = await fetch(
          `https://graph.facebook.com/v18.0/${handle}/posts?fields=id,message,created_time&limit=3&access_token=${token}`
        );

        if (searchRes.ok) {
          const data = (await searchRes.json()) as any;
          const posts = data.data || [];

          for (const post of posts.slice(0, 2)) {
            try {
              const likeRes = await fetch(
                `https://graph.facebook.com/v18.0/${post.id}/likes`,
                {
                  method: "POST",
                  body: new URLSearchParams({ access_token: token }),
                }
              );

              results.push({
                success: likeRes.ok,
                platform: "facebook",
                action: "like",
                targetId: post.id,
                error: likeRes.ok ? undefined : `Like failed: ${likeRes.status}`,
              });

              if (likeRes.ok) {
                console.log(`[SocialEngagement] Liked Facebook post from ${partner.name}: ${post.id}`);
              }
            } catch (error: any) {
              results.push({
                success: false,
                platform: "facebook",
                action: "like",
                targetId: post.id,
                error: error.message,
              });
            }

            await new Promise((resolve) => setTimeout(resolve, 2000));
            if (results.filter((r) => r.success).length >= maxLikes) break;
          }
        }
      } catch (error: any) {
        console.warn(`[SocialEngagement] Error engaging with ${partner.name} on Facebook: ${error.message}`);
      }
    }
  }

  if (platform === "x") {
    const apiKey = process.env.X_API_KEY;
    const apiSecret = process.env.X_API_SECRET;
    const accessToken = process.env.X_ACCESS_TOKEN;
    const accessSecret = process.env.X_ACCESS_SECRET;

    if (!apiKey || !apiSecret || !accessToken || !accessSecret) return [];

    const partners = getRelevantPartners("x", category, 3);
    for (const partner of partners) {
      try {
        const handle = partner.handles.x?.replace("@", "");
        if (!handle) continue;

        const crypto = require("crypto");
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce = crypto.randomBytes(16).toString("hex");

        const lookupUrl = `https://api.twitter.com/2/users/by/username/${handle}`;
        const oauthParams: Record<string, string> = {
          oauth_consumer_key: apiKey,
          oauth_nonce: nonce,
          oauth_signature_method: "HMAC-SHA1",
          oauth_timestamp: timestamp,
          oauth_token: accessToken,
          oauth_version: "1.0",
        };

        const paramString = Object.keys(oauthParams)
          .sort()
          .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
          .join("&");
        const baseString = `GET&${encodeURIComponent(lookupUrl)}&${encodeURIComponent(paramString)}`;
        const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;
        const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
        oauthParams.oauth_signature = signature;

        const authHeader =
          "OAuth " +
          Object.keys(oauthParams)
            .sort()
            .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
            .join(", ");

        const userRes = await fetch(lookupUrl, {
          headers: { Authorization: authHeader },
        });

        if (userRes.ok) {
          const userData = (await userRes.json()) as any;
          const userId = userData.data?.id;

          if (userId) {
            const nonce2 = crypto.randomBytes(16).toString("hex");
            const timestamp2 = Math.floor(Date.now() / 1000).toString();
            const tweetsUrl = `https://api.twitter.com/2/users/${userId}/tweets`;

            const oauthParams2: Record<string, string> = {
              oauth_consumer_key: apiKey,
              oauth_nonce: nonce2,
              oauth_signature_method: "HMAC-SHA1",
              oauth_timestamp: timestamp2,
              oauth_token: accessToken,
              oauth_version: "1.0",
              max_results: "5",
            };

            const paramString2 = Object.keys(oauthParams2)
              .sort()
              .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams2[k])}`)
              .join("&");
            const baseString2 = `GET&${encodeURIComponent(tweetsUrl)}&${encodeURIComponent(paramString2)}`;
            const signature2 = crypto.createHmac("sha1", signingKey).update(baseString2).digest("base64");
            oauthParams2.oauth_signature = signature2;
            delete oauthParams2.max_results;

            const authHeader2 =
              "OAuth " +
              Object.keys(oauthParams2)
                .sort()
                .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams2[k])}"`)
                .join(", ");

            const tweetsRes = await fetch(`${tweetsUrl}?max_results=5`, {
              headers: { Authorization: authHeader2 },
            });

            if (tweetsRes.ok) {
              const tweetsData = (await tweetsRes.json()) as any;
              const tweets = tweetsData.data || [];

              for (const tweet of tweets.slice(0, 2)) {
                try {
                  const nonce3 = crypto.randomBytes(16).toString("hex");
                  const timestamp3 = Math.floor(Date.now() / 1000).toString();
                  const likeUrl = `https://api.twitter.com/2/users/${process.env.X_USER_ID || userId}/likes`;

                  const oauthParams3: Record<string, string> = {
                    oauth_consumer_key: apiKey,
                    oauth_nonce: nonce3,
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_timestamp: timestamp3,
                    oauth_token: accessToken,
                    oauth_version: "1.0",
                  };

                  const paramString3 = Object.keys(oauthParams3)
                    .sort()
                    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams3[k])}`)
                    .join("&");
                  const baseString3 = `POST&${encodeURIComponent(likeUrl)}&${encodeURIComponent(paramString3)}`;
                  const signature3 = crypto.createHmac("sha1", signingKey).update(baseString3).digest("base64");
                  oauthParams3.oauth_signature = signature3;

                  const authHeader3 =
                    "OAuth " +
                    Object.keys(oauthParams3)
                      .sort()
                      .map((k) => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams3[k])}"`)
                      .join(", ");

                  const likeRes = await fetch(likeUrl, {
                    method: "POST",
                    headers: {
                      Authorization: authHeader3,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ tweet_id: tweet.id }),
                  });

                  results.push({
                    success: likeRes.ok,
                    platform: "x",
                    action: "like",
                    targetId: tweet.id,
                    error: likeRes.ok ? undefined : `Like failed: ${likeRes.status}`,
                  });

                  if (likeRes.ok) {
                    console.log(`[SocialEngagement] Liked X post from ${partner.name}: ${tweet.id}`);
                  }
                } catch (error: any) {
                  results.push({
                    success: false,
                    platform: "x",
                    action: "like",
                    targetId: tweet.id,
                    error: error.message,
                  });
                }

                await new Promise((resolve) => setTimeout(resolve, 2000));
                if (results.filter((r) => r.success).length >= maxLikes) break;
              }
            }
          }
        }
      } catch (error: any) {
        console.warn(`[SocialEngagement] Error engaging with ${partner.name} on X: ${error.message}`);
      }
    }
  }

  return results;
}

export async function runPostPublishEngagement(
  postContent: string,
  platform: string,
  category: string,
  imageUrl?: string
): Promise<EngagementResult[]> {
  const results: EngagementResult[] = [];

  try {
    if (platform === "linkedin" || platform === "facebook") {
      const groupResults =
        platform === "linkedin"
          ? await shareToLinkedInGroups(postContent, category)
          : await shareToFacebookGroups(postContent, category, imageUrl);
      results.push(...groupResults);
    }

    const likeResults = await likeRecentPostsFromPartners(platform, category, 3);
    results.push(...likeResults);
  } catch (error: any) {
    console.error(`[SocialEngagement] Post-publish engagement error: ${error.message}`);
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  if (results.length > 0) {
    console.log(`[SocialEngagement] Post-publish engagement: ${succeeded} succeeded, ${failed} failed`);
  }

  return results;
}
