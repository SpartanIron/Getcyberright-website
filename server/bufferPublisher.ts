import { storage } from "./storage";
import * as path from "path";
import * as fs from "fs";
import { enforcePostPolicy } from "./socialPostPolicy";
import { validateAndPreparePost } from "./linkValidator";

const BUFFER_GRAPHQL_URL = "https://api.buffer.com/graphql";
const BUFFER_ORG_ID = process.env.BUFFER_ORG_ID || "69b48dd8282d615a79db2ab3";
const DAILY_POSTS_PER_PLATFORM = 2;
const SOCIAL_IMAGES_DIR = path.join(process.cwd(), ".local", "social-images");

interface BufferChannel {
  id: string;
  name: string;
  service: string;
}

export interface BufferPublishResult {
  success: boolean;
  platform: string;
  bufferId?: string;
  error?: string;
  limitReached?: boolean;
}

const PLATFORM_RULES: Record<string, {
  publishMode: "addToQueue" | "shareNow";
  requiresImage: boolean;
  supportsLinkPreview: boolean;
  metadata?: Record<string, any>;
}> = {
  instagram: {
    publishMode: "addToQueue",
    requiresImage: true,
    supportsLinkPreview: false,
    metadata: { instagram: { type: "post", shouldShareToFeed: true } },
  },
  linkedin: {
    publishMode: "shareNow",
    requiresImage: false,
    supportsLinkPreview: true,
  },
  facebook: {
    publishMode: "shareNow",
    requiresImage: false,
    supportsLinkPreview: true,
    metadata: { facebook: { type: "post" } },
  },
};

function getBufferToken(): string | undefined {
  return process.env.BUFFER_API_KEY;
}

export function isBufferConfigured(): boolean {
  return !!getBufferToken();
}

let cachedChannels: BufferChannel[] | null = null;
let channelCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;
let rateLimitedUntil = 0;

async function graphql<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  if (Date.now() < rateLimitedUntil) {
    throw new Error("Buffer API rate-limited, backing off");
  }
  const token = getBufferToken();
  if (!token) throw new Error("Buffer API key not configured");

  const res = await fetch(BUFFER_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) {
      rateLimitedUntil = Date.now() + 60 * 60 * 1000;
      console.warn("[Buffer] Rate-limited (429). Backing off for 1 hour.");
    }
    throw new Error(`Buffer GraphQL HTTP error ${res.status}: ${body}`);
  }

  const json = await res.json() as any;
  if (json.errors?.length > 0) {
    throw new Error(`Buffer GraphQL error: ${json.errors[0].message}`);
  }
  return json.data as T;
}

export async function getBufferChannels(): Promise<BufferChannel[]> {
  if (cachedChannels && Date.now() - channelCacheTime < CACHE_TTL) {
    return cachedChannels;
  }

  if (Date.now() < rateLimitedUntil) {
    const waitMin = Math.ceil((rateLimitedUntil - Date.now()) / 60000);
    console.warn(`[Buffer] Rate-limited, skipping channel fetch (${waitMin}min remaining)`);
    return cachedChannels ?? [];
  }

  try {
    const data = await graphql<{ channels: BufferChannel[] }>(
      `query GetChannels($input: ChannelsInput!) {
        channels(input: $input) { id name service }
      }`,
      { input: { organizationId: BUFFER_ORG_ID } }
    );
    cachedChannels = data.channels;
    channelCacheTime = Date.now();
    rateLimitedUntil = 0;
    return data.channels;
  } catch (error: any) {
    console.error("[Buffer] Failed to fetch channels:", error.message);
    if (error.message?.includes("429") || error.message?.includes("RATE_LIMIT")) {
      rateLimitedUntil = Date.now() + 60 * 60 * 1000;
    }
    return cachedChannels ?? [];
  }
}

export async function getBufferChannelsByPlatform(): Promise<Record<string, BufferChannel>> {
  const channels = await getBufferChannels();
  const map: Record<string, BufferChannel> = {};
  for (const ch of channels) {
    const svc = ch.service?.toLowerCase();
    if (svc === "linkedin") map.linkedin = ch;
    else if (svc === "facebook") map.facebook = ch;
    else if (svc === "instagram") map.instagram = ch;
    else if (svc === "twitter" || svc === "x") map.x = ch;
  }
  return map;
}

export function getPublicImageUrl(imagePathOrFilename: string): string | null {
  if (!imagePathOrFilename) return null;

  let filename: string;
  if (imagePathOrFilename.startsWith("http")) {
    try { filename = path.basename(new URL(imagePathOrFilename).pathname); } catch { return null; }
  } else {
    filename = path.basename(imagePathOrFilename);
  }

  const baseUrl = process.env.PUBLIC_IMAGE_BASE_URL;
  if (baseUrl) {
    return `${baseUrl.replace(/\/+$/, "")}/api/social-images/${filename}`;
  }
  if (process.env.NODE_ENV === "production" || process.env.REPLIT_DEPLOYMENT === "1") {
    return `https://www.getcyberright.com/api/social-images/${filename}`;
  }
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  if (devDomain) {
    return `https://${devDomain}/api/social-images/${filename}`;
  }
  return `https://www.getcyberright.com/api/social-images/${filename}`;
}

function isValidBrandedImage(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false;
  const basename = path.basename(imageUrl.startsWith("http") ? new URL(imageUrl).pathname : imageUrl);
  if (!basename.startsWith("branded-") && !basename.startsWith("source-")) return false;
  if (imageUrl.startsWith("http")) return true;
  return fs.existsSync(imageUrl);
}

async function resolveImageUrl(
  currentImageUrl: string | null | undefined,
  contentTitle: string,
  contentType: string,
  platform: string,
  postId?: string,
): Promise<string | undefined> {
  if (isValidBrandedImage(currentImageUrl)) {
    const publicUrl = getPublicImageUrl(currentImageUrl!);
    if (publicUrl) {
      console.log(`[Buffer] Image resolved: ${publicUrl}`);
      return publicUrl;
    }
  }

  console.log(`[Buffer] Generating image for "${contentTitle}" (${platform})`);

  try {
    const { searchStockPhoto, downloadSourceImage, applyBrandOverlay } = await import("./stockPhotoService");
    const templateStyle = contentType === "threat_alert" ? "alert_card" as const
      : contentType === "scam_intel" ? "stat_card" as const
      : "insight_card" as const;
    const headline = contentTitle.length > 50 ? contentTitle.slice(0, 47) + "..." : contentTitle;
    const dims = platform === "instagram" ? { w: 1080, h: 1080 } : { w: 1200, h: 630 };

    const stockPhoto = await searchStockPhoto(contentType || "default", contentTitle, { platform });
    if (stockPhoto) {
      const imgPath = stockPhoto.localPath || await downloadSourceImage(stockPhoto.url, contentTitle);
      if (imgPath) {
        const overlaid = await applyBrandOverlay(imgPath, headline, "getcyberright.com", templateStyle, dims.w, dims.h);
        if (overlaid) {
          if (postId) await storage.updateSocialPost(postId, { imageUrl: overlaid });
          const url = getPublicImageUrl(overlaid);
          if (url) {
            console.log(`[Buffer] Stock photo + overlay: ${stockPhoto.photographer} → ${url}`);
            return url;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn(`[Buffer] Stock photo failed: ${err.message}`);
  }

  try {
    const { generateBrandedImage } = await import("./socialImageService");
    const newImagePath = await generateBrandedImage(contentTitle, contentType, platform);
    if (newImagePath) {
      if (postId) await storage.updateSocialPost(postId, { imageUrl: newImagePath });
      const url = getPublicImageUrl(newImagePath);
      if (url) {
        console.log(`[Buffer] Fallback branded card: ${url}`);
        return url;
      }
    }
  } catch (err: any) {
    console.warn(`[Buffer] Branded card fallback failed: ${err.message}`);
  }

  return undefined;
}

function prepareContent(
  text: string,
  platform: string,
): string {
  const { content } = enforcePostPolicy(text, platform);
  return content;
}

function shouldAttachImage(platform: string, content: string): boolean {
  const rules = PLATFORM_RULES[platform];
  if (!rules) return true;
  if (!rules.supportsLinkPreview) return true;
  const hasGcrLink = /https?:\/\/(?:www\.)?getcyberright\.com\//i.test(content);
  if (hasGcrLink) {
    console.log(`[Buffer] ${platform}: Link preview mode — OG card will render from article URL`);
    return false;
  }
  return true;
}

async function sendToBuffer(
  channelId: string,
  text: string,
  platform: string,
  imageUrl?: string,
): Promise<BufferPublishResult> {
  const rules = PLATFORM_RULES[platform] || { publishMode: "shareNow" as const };

  if (platform === "instagram" && !imageUrl) {
    return { success: false, platform, error: "Instagram requires an image" };
  }

  const input: Record<string, any> = {
    channelId,
    text,
    mode: rules.publishMode,
    schedulingType: "automatic",
  };

  if (rules.metadata) {
    input.metadata = rules.metadata;
  }

  if (imageUrl) {
    input.assets = { images: [{ url: imageUrl }] };
    console.log(`[Buffer] Attaching image: ${imageUrl}`);
  }

  try {
    const data = await graphql<{ createPost: any }>(
      `mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
          __typename
          ... on PostActionSuccess {
            post { id status text dueAt channelService }
          }
          ... on InvalidInputError { message }
          ... on UnexpectedError { message }
          ... on UnauthorizedError { message }
          ... on LimitReachedError { message }
          ... on NotFoundError { message }
          ... on RestProxyError { message }
        }
      }`,
      { input }
    );

    const result = data.createPost;

    if (result?.post) {
      if (result.post.status === "error") {
        console.error(`[Buffer] Post error on ${result.post.channelService} (ID: ${result.post.id})`);
        return { success: false, platform, bufferId: result.post.id, error: `Post error: ${result.post.channelService}` };
      }
      const info = result.post.dueAt ? ` (scheduled: ${result.post.dueAt})` : "";
      console.log(`[Buffer] Post created on ${result.post.channelService}: ${result.post.status}${info}`);
      return { success: true, platform, bufferId: result.post.id };
    }

    if (result?.message) {
      const isLimit = result.__typename === "LimitReachedError" || result.message?.toLowerCase().includes("limit reached");
      return { success: false, platform, error: result.message, limitReached: isLimit };
    }

    return { success: false, platform, error: "Unexpected Buffer API response" };
  } catch (error: any) {
    return { success: false, platform, error: error.message };
  }
}

export async function publishPostViaBuffer(postId: string): Promise<BufferPublishResult> {
  const post = await storage.getSocialPostById(postId);
  if (!post) return { success: false, platform: "unknown", error: "Post not found" };
  if (post.platform === "alert") return { success: false, platform: "alert", error: "Alert posts are not published via Buffer" };

  const channels = await getBufferChannelsByPlatform();
  const channel = channels[post.platform];
  if (!channel) {
    return { success: false, platform: post.platform, error: `No Buffer channel for ${post.platform}` };
  }

  const imageUrl = await resolveImageUrl(post.imageUrl, post.contentTitle, post.contentType || "", post.platform, postId);

  if (PLATFORM_RULES[post.platform]?.requiresImage && !imageUrl) {
    console.warn(`[Buffer] ${post.platform} requires image — keeping "${post.contentTitle}" as draft for retry`);
    return { success: false, platform: post.platform, error: `${post.platform} requires an image` };
  }

  const validation = await validateAndPreparePost(post.postContent, postId, post.platform, post.contentTitle);
  console.log(validation.validationLog);
  if (!validation.shouldPublish) {
    return { success: false, platform: post.platform, error: "Link validation failed" };
  }

  const content = prepareContent(validation.content, post.platform);
  const attachImage = shouldAttachImage(post.platform, content);

  let result = await sendToBuffer(channel.id, content, post.platform, attachImage ? imageUrl : undefined);

  if (!result.success && imageUrl && attachImage && result.error?.toLowerCase().includes("image")) {
    if (post.platform !== "instagram") {
      console.warn(`[Buffer] Image rejected for ${post.platform}, retrying without image`);
      result = await sendToBuffer(channel.id, content, post.platform);
    }
  }

  if (result.success) {
    await storage.updateSocialPost(postId, { status: "published", publishedAt: new Date() });
    console.log(`[Buffer] Published ${post.platform}: "${post.contentTitle}" (${result.bufferId})`);
  } else if (result.limitReached) {
    console.warn(`[Buffer] Limit reached, keeping ${post.platform} post as draft`);
  } else {
    await storage.updateSocialPost(postId, { status: "failed", publishError: `Buffer: ${result.error}` });
    console.error(`[Buffer] Failed ${post.platform}: ${result.error}`);
  }

  return result;
}

export async function publishDirect(
  channelId: string,
  content: string,
  platform: string,
  imageUrl?: string,
): Promise<BufferPublishResult> {
  const safeContent = prepareContent(content, platform);
  const attachImage = shouldAttachImage(platform, safeContent);

  let resolvedImage = imageUrl;
  if (imageUrl) {
    const publicUrl = getPublicImageUrl(imageUrl);
    if (publicUrl) resolvedImage = publicUrl;
  }

  let result = await sendToBuffer(channelId, safeContent, platform, attachImage ? resolvedImage : undefined);

  if (!result.success && resolvedImage && attachImage && result.error?.toLowerCase().includes("image")) {
    if (platform !== "instagram") {
      console.warn(`[Buffer] Image rejected for ${platform}, retrying without image`);
      result = await sendToBuffer(channelId, safeContent, platform);
    }
  }

  return result;
}

export const publishWithFirstComment = publishDirect;

function normalizeTitleForDedup(title: string): string {
  return title.replace(/\[.*?\]\s*/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function isDuplicate(draftTitle: string, publishedTitles: string[]): boolean {
  const norm = normalizeTitleForDedup(draftTitle);
  if (!norm) return false;
  for (const pub of publishedTitles) {
    const pubNorm = normalizeTitleForDedup(pub);
    if (!pubNorm) continue;
    if (norm === pubNorm) return true;
    const normWords = new Set(norm.split(" ").filter(w => w.length > 3));
    const pubWords = new Set(pubNorm.split(" ").filter(w => w.length > 3));
    if (normWords.size === 0 || pubWords.size === 0) continue;
    let overlap = 0;
    for (const w of normWords) { if (pubWords.has(w)) overlap++; }
    if (overlap / Math.min(normWords.size, pubWords.size) >= 0.75) return true;
  }
  return false;
}

function toETDateString(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

async function getTodaysPublishedCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  try {
    const recent = await storage.getSocialPosts("published", 100);
    const todayET = toETDateString(new Date());
    for (const p of recent) {
      if (p.publishedAt && toETDateString(new Date(p.publishedAt)) === todayET) {
        counts[p.platform] = (counts[p.platform] || 0) + 1;
      }
    }
  } catch (err: any) {
    console.error("[Buffer] Failed to check today's counts:", err.message);
  }
  return counts;
}

export async function publishAllDraftsViaBuffer(options?: { tier?: "guide" | "news_editorial" }): Promise<BufferPublishResult[]> {
  const allDrafts = await storage.getSocialPosts("draft", 50);
  let drafts = allDrafts;
  if (options?.tier === "guide") {
    drafts = allDrafts.filter(d => d.contentType !== "trend_insight" && d.contentType !== "news_article");
  } else if (options?.tier === "news_editorial") {
    drafts = allDrafts.filter(d => d.contentType === "news_article");
  }

  const channels = await getBufferChannelsByPlatform();
  const connected = new Set(Object.keys(channels));
  const publishable = drafts.filter(d => d.platform !== "alert" && connected.has(d.platform));

  if (connected.size === 0) {
    console.warn(`[Buffer] No connected channels. ${publishable.length} drafts waiting.`);
    return [];
  }

  const recentPublished = await storage.getSocialPosts("published", 100);
  const recentTitles = recentPublished
    .filter(p => p.publishedAt && Date.now() - new Date(p.publishedAt).getTime() < 7 * 86400000)
    .map(p => p.contentTitle);

  const counts = await getTodaysPublishedCounts();
  const logCounts = Object.entries(counts).filter(([, c]) => c > 0).map(([p, c]) => `${p}(${c})`).join(", ");
  if (logCounts) console.log(`[Buffer] Published today: ${logCounts}`);

  const guides = publishable.filter(d => d.contentType !== "trend_insight" && d.contentType !== "news_article");
  const news = publishable.filter(d => d.contentType === "news_article");
  const sorted = [...guides, ...news];

  const results: BufferPublishResult[] = [];

  for (const draft of sorted) {
    if ((counts[draft.platform] || 0) >= DAILY_POSTS_PER_PLATFORM) continue;

    if (draft.contentType === "news_article" && draft.createdAt) {
      const ageHours = (Date.now() - new Date(draft.createdAt).getTime()) / 3600000;
      if (ageHours > 48) {
        console.warn(`[Buffer] EXPIRED: "${draft.contentTitle}" on ${draft.platform} (${Math.round(ageHours)}h old)`);
        await storage.updateSocialPost(draft.id, { status: "failed", publishError: "Auto-expired: older than 48 hours" });
        continue;
      }
    }

    if (isDuplicate(draft.contentTitle, recentTitles)) {
      console.warn(`[Buffer] DUPLICATE: "${draft.contentTitle}" on ${draft.platform}`);
      await storage.updateSocialPost(draft.id, { status: "failed", publishError: "Duplicate topic" });
      continue;
    }

    const result = await publishPostViaBuffer(draft.id);
    results.push(result);

    if (result.success) {
      counts[draft.platform] = (counts[draft.platform] || 0) + 1;
    }
    if (!result.success && (result.limitReached || result.error?.toLowerCase().includes("limit reached"))) {
      console.log("[Buffer] API limit reached, stopping batch");
      break;
    }

    await new Promise(r => setTimeout(r, 1000));
  }

  const remaining = sorted.length - results.filter(r => r.success).length;
  if (remaining > 0) {
    console.log(`[Buffer] ${remaining} drafts remaining (${DAILY_POSTS_PER_PLATFORM}/platform/day limit)`);
  }

  return results;
}

export async function createBufferPost(
  channelId: string,
  text: string,
  options: {
    mode?: "addToQueue" | "shareNow" | "shareNext" | "customScheduled" | "recommendedTime";
    dueAt?: string;
    imageUrl?: string;
    platform?: string;
  } = {}
): Promise<BufferPublishResult> {
  return sendToBuffer(channelId, text, options.platform || "", options.imageUrl);
}

export async function getBufferStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  organizationId: string;
  channels: { service: string; name: string; id: string }[];
  error?: string;
}> {
  if (!isBufferConfigured()) {
    return { configured: false, connected: false, organizationId: "", channels: [] };
  }

  try {
    const channels = await getBufferChannels();
    return {
      configured: true,
      connected: channels.length > 0,
      organizationId: BUFFER_ORG_ID,
      channels: channels.map(c => ({ service: c.service, name: c.name, id: c.id })),
    };
  } catch (error: any) {
    return { configured: true, connected: false, organizationId: BUFFER_ORG_ID, channels: [], error: error.message };
  }
}
