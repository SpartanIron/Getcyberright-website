import { storage } from "./storage";
import * as path from "path";
import * as fs from "fs";
import { enforcePostPolicy } from "./socialPostPolicy";
import { validateAndPreparePost } from "./linkValidator";

const BUFFER_GRAPHQL_URL = "https://api.buffer.com/graphql";
const BUFFER_ORG_ID = process.env.BUFFER_ORG_ID || "69b48dd8282d615a79db2ab3";

export function getPublicImageUrl(localImagePath: string): string | null {
  if (!localImagePath) return null;

  const filename = path.basename(localImagePath);

  const baseUrl = process.env.PUBLIC_IMAGE_BASE_URL;
  if (baseUrl) {
    const cleanBase = baseUrl.replace(/\/+$/, "");
    return `${cleanBase}/api/social-images/${filename}`;
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

interface BufferChannel {
  id: string;
  name: string;
  service: string;
}

interface BufferPublishResult {
  success: boolean;
  platform: string;
  bufferId?: string;
  error?: string;
  limitReached?: boolean;
}

function getBufferToken(): string | undefined {
  return process.env.BUFFER_API_KEY;
}

export function isBufferConfigured(): boolean {
  return !!getBufferToken();
}

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
  if (json.errors && json.errors.length > 0) {
    throw new Error(`Buffer GraphQL error: ${json.errors[0].message}`);
  }

  return json.data as T;
}

let cachedChannels: BufferChannel[] | null = null;
let channelCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;
let rateLimitedUntil = 0;

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
      console.warn("[Buffer] Rate-limited by Buffer API. Backing off for 1 hour.");
    }
    return cachedChannels ?? [];
  }
}

export async function getBufferChannelsByPlatform(): Promise<Record<string, BufferChannel>> {
  const channels = await getBufferChannels();
  const map: Record<string, BufferChannel> = {};

  for (const channel of channels) {
    const service = channel.service?.toLowerCase();
    if (service === "linkedin") map.linkedin = channel;
    else if (service === "facebook") map.facebook = channel;
    else if (service === "instagram") map.instagram = channel;
    else if (service === "twitter" || service === "x") map.x = channel;
  }

  return map;
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
  try {
    if (options.platform === "instagram" && !options.imageUrl) {
      console.error(`[Buffer] BLOCKED: createBufferPost called for Instagram without an image`);
      return { success: false, platform: "instagram", error: "Instagram requires an image — blocked at API layer" };
    }

    const mode = options.mode || "shareNow";

    const input: Record<string, any> = {
      channelId,
      text,
      mode,
    };

    input.schedulingType = "automatic";

    if (options.dueAt) {
      input.dueAt = options.dueAt;
    }

    if (options.platform === "facebook") {
      input.metadata = { facebook: { type: "post" } };
    }

    if (options.platform === "instagram") {
      input.metadata = { instagram: { type: "post", shouldShareToFeed: true } };
    }

    if (options.imageUrl) {
      input.assets = {
        images: [{ url: options.imageUrl }],
      };
      console.log(`[Buffer] Attaching image: ${options.imageUrl}`);
    }

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
      const scheduledInfo = result.post.dueAt ? ` (scheduled: ${result.post.dueAt})` : "";
      console.log(`[Buffer] Post created on ${result.post.channelService}: ${result.post.status}${scheduledInfo}`);

      if (result.post.status === "error") {
        console.error(`[Buffer] Post returned error status on ${result.post.channelService} (Buffer ID: ${result.post.id})`);
        console.error(`[Buffer] Full error response: ${JSON.stringify(result.post)}`);
        return {
          success: false,
          platform: "buffer",
          bufferId: result.post.id,
          error: `Buffer post error on ${result.post.channelService}: unknown reason`,
        };
      }

      return {
        success: true,
        platform: "buffer",
        bufferId: result.post.id,
      };
    }

    if (result?.message) {
      const isLimitReached = result.__typename === "LimitReachedError" || result.message?.toLowerCase().includes("limit reached");
      return {
        success: false,
        platform: "buffer",
        error: result.message,
        limitReached: isLimitReached,
      };
    }

    return {
      success: false,
      platform: "buffer",
      error: "Unexpected response from Buffer API",
    };
  } catch (error: any) {
    return {
      success: false,
      platform: "buffer",
      error: error.message,
    };
  }
}

export async function publishPostViaBuffer(postId: string): Promise<BufferPublishResult> {
  const post = await storage.getSocialPostById(postId);
  if (!post) return { success: false, platform: "buffer", error: "Post not found" };

  if (post.platform === "alert") {
    return { success: false, platform: "buffer", error: "Alert posts are not published via Buffer" };
  }

  const channels = await getBufferChannelsByPlatform();
  const channel = channels[post.platform];

  if (!channel) {
    return {
      success: false,
      platform: post.platform,
      error: `No Buffer channel connected for ${post.platform}. Connect it in your Buffer dashboard.`,
    };
  }

  let imageUrl: string | undefined;
  const isOldSvgCard = (imgPath: string) => {
    const basename = path.basename(imgPath);
    return basename.startsWith("social-") && !basename.startsWith("branded-") && !basename.startsWith("source-");
  };

  const isRemoteUrl = (url: string) => url.startsWith("https://") || url.startsWith("http://");
  const isOldSvgRemote = (url: string) => {
    try { return isOldSvgCard(new URL(url).pathname); } catch { return false; }
  };

  const isNonServablePath = (imgPath: string) => {
    if (isRemoteUrl(imgPath)) return false;
    const normalized = path.resolve(imgPath);
    const socialImagesDir = path.resolve(process.cwd(), ".local", "social-images");
    const distSocialImagesDir = path.resolve(process.cwd(), "dist", "social-images");
    return !normalized.startsWith(socialImagesDir) && !normalized.startsWith(distSocialImagesDir);
  };

  const needsStockPhotoUpgrade =
    !post.imageUrl ||
    (isRemoteUrl(post.imageUrl) && isOldSvgRemote(post.imageUrl)) ||
    (!isRemoteUrl(post.imageUrl) && isOldSvgCard(post.imageUrl)) ||
    (!isRemoteUrl(post.imageUrl) && !fs.existsSync(post.imageUrl)) ||
    (!isRemoteUrl(post.imageUrl) && isNonServablePath(post.imageUrl));

  if (post.imageUrl && !needsStockPhotoUpgrade) {
    if (isRemoteUrl(post.imageUrl)) {
      imageUrl = post.imageUrl;
      console.log(`[Buffer] Using external image URL: ${imageUrl}`);
    } else if (fs.existsSync(post.imageUrl)) {
      const publicUrl = getPublicImageUrl(post.imageUrl);
      if (publicUrl) {
        imageUrl = publicUrl;
      } else {
        console.warn(`[Buffer] Could not resolve public URL for image: ${post.imageUrl}`);
      }
    }
  }

  if (!imageUrl && needsStockPhotoUpgrade) {
    if (post.imageUrl) {
      console.log(`[Buffer] Upgrading old SVG card image to stock photo for "${post.contentTitle}"`);
    } else {
      console.log(`[Buffer] No image set, generating stock photo for "${post.contentTitle}"`);
    }

    const { searchStockPhoto, downloadSourceImage, applyBrandOverlay } = await import("./stockPhotoService");
    const templateStyle = post.contentType === "threat_alert" ? "alert_card" as const : post.contentType === "scam_intel" ? "stat_card" as const : "insight_card" as const;
    const headline = post.contentTitle.length > 50 ? post.contentTitle.slice(0, 47) + "..." : post.contentTitle;
    const dims = post.platform === "instagram" ? { w: 1080, h: 1080 } : { w: 1200, h: 630 };

    const stockPhoto = await searchStockPhoto(post.contentType || "default", post.contentTitle, { platform: post.platform });
    if (stockPhoto) {
      const imgPath = stockPhoto.localPath || await downloadSourceImage(stockPhoto.url, post.contentTitle);
      if (imgPath) {
        const overlaid = await applyBrandOverlay(imgPath, headline, "getcyberright.com", templateStyle, dims.w, dims.h);
        if (overlaid) {
          await storage.updateSocialPost(postId, { imageUrl: overlaid });
          imageUrl = getPublicImageUrl(overlaid);
          console.log(`[Buffer] Stock photo image for ${post.platform}: ${stockPhoto.photographer} → ${imageUrl}`);
        }
      }
    }

    if (!imageUrl) {
      const { generateBrandedImage } = await import("./socialImageService");
      const newImagePath = await generateBrandedImage(post.contentTitle, post.contentType, post.platform);
      if (newImagePath) {
        await storage.updateSocialPost(postId, { imageUrl: newImagePath });
        const publicUrl = getPublicImageUrl(newImagePath);
        if (publicUrl) {
          imageUrl = publicUrl;
          console.log(`[Buffer] Fallback SVG card for ${post.platform}: ${imageUrl}`);
        }
      }
    }
  }

  if (post.platform === "instagram" && !imageUrl) {
    console.warn(`[Buffer] Instagram requires an image — skipping post "${post.contentTitle}" (${postId}), keeping as draft for retry`);
    return { success: false, platform: post.platform, error: "Instagram requires an image. Post kept as draft for retry." };
  }

  const validation = await validateAndPreparePost(
    post.postContent,
    postId,
    post.platform,
    post.contentTitle
  );
  console.log(validation.validationLog);

  if (!validation.shouldPublish) {
    return {
      success: false,
      platform: post.platform,
      error: `Link validation failed: broken links detected. Post marked as failed.`,
    };
  }

  const policyResult = enforcePostPolicy(validation.content, post.platform);
  const safeContent = policyResult.content;

  const publishMode = post.platform === "instagram" ? "addToQueue" : "shareNow";
  let result = await createBufferPost(channel.id, safeContent, {
    mode: publishMode,
    imageUrl,
    platform: post.platform,
  });

  if (!result.success && imageUrl && result.error?.toLowerCase().includes("image")) {
    if (post.platform === "instagram") {
      console.error(`[Buffer] Image rejected by Instagram for post ${postId}: ${result.error}. Cannot retry without image.`);
    } else {
      console.warn(`[Buffer] Image rejected for ${post.platform} post ${postId}: ${result.error}. Retrying without image...`);
      result = await createBufferPost(channel.id, safeContent, {
        mode: publishMode,
        platform: post.platform,
      });
      if (result.success) {
        console.log(`[Buffer] Retry without image succeeded for ${post.platform} post ${postId}`);
      }
    }
  }

  if (result.success) {
    await storage.updateSocialPost(postId, {
      status: "published",
      publishedAt: new Date(),
    });
    console.log(`[Buffer] Queued ${post.platform} post: ${postId} (Buffer ID: ${result.bufferId})`);
  } else if (result.limitReached) {
    console.warn(`[Buffer] Limit reached, keeping ${post.platform} post ${postId} as draft for retry`);
  } else {
    await storage.updateSocialPost(postId, {
      status: "failed",
      publishError: `Buffer: ${result.error}`,
    });
    console.error(`[Buffer] Failed to queue ${post.platform} post: ${result.error}`);
  }

  return result;
}

const DAILY_POSTS_PER_PLATFORM = 2;

async function getTodaysPublishedCountByPlatform(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  try {
    const recentPosts = await storage.getSocialPosts("published", 100);
    const today = new Date().toDateString();
    for (const post of recentPosts) {
      if (!post.publishedAt) continue;
      if (new Date(post.publishedAt).toDateString() !== today) continue;
      counts[post.platform] = (counts[post.platform] || 0) + 1;
    }
  } catch (err: any) {
    console.error("[Buffer] Failed to check today's published counts:", err.message);
  }
  return counts;
}

function normalizeTitleForDedup(title: string): string {
  return title
    .replace(/\[.*?\]\s*/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isDraftTitleDuplicate(draftTitle: string, publishedTitles: string[]): boolean {
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
    for (const w of normWords) {
      if (pubWords.has(w)) overlap++;
    }
    const similarity = overlap / Math.min(normWords.size, pubWords.size);
    if (similarity >= 0.75) return true;
  }
  return false;
}

export async function publishAllDraftsViaBuffer(options?: { tier?: "guide" | "news_editorial" }): Promise<BufferPublishResult[]> {
  const allDrafts = await storage.getSocialPosts("draft", 50);
  let drafts = allDrafts;
  if (options?.tier === "guide") {
    drafts = allDrafts.filter(d => d.contentType !== "trend_insight" && d.contentType !== "news_article");
  } else if (options?.tier === "news_editorial") {
    drafts = allDrafts.filter(d => d.contentType === "news_article");
  }
  const results: BufferPublishResult[] = [];
  const channels = await getBufferChannelsByPlatform();
  const connectedPlatforms = new Set(Object.keys(channels));

  const nonAlertDrafts = drafts.filter(d => d.platform !== "alert");
  if (connectedPlatforms.size === 0) {
    console.warn(`[Buffer] No connected channels found. Cannot publish ${nonAlertDrafts.length} draft posts. Run channel check.`);
    return results;
  }

  const recentPublished = await storage.getSocialPosts("published", 100);
  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentPublishedTitles = recentPublished
    .filter(p => p.publishedAt && new Date(p.publishedAt).getTime() > sevenDaysAgo)
    .map(p => p.contentTitle);

  const platformCounts: Record<string, number> = {};
  let skippedCount = 0;
  for (const d of nonAlertDrafts) {
    platformCounts[d.platform] = (platformCounts[d.platform] || 0) + 1;
    if (!connectedPlatforms.has(d.platform)) skippedCount++;
  }
  console.log(`[Buffer] Connected platforms: ${[...connectedPlatforms].join(", ")}. Draft platforms: ${Object.entries(platformCounts).map(([p, c]) => `${p}(${c})`).join(", ")}. Skipping ${skippedCount} posts with no matching channel.`);

  const publishedPerPlatform = await getTodaysPublishedCountByPlatform();
  const alreadyPublishedLog = Object.entries(publishedPerPlatform)
    .filter(([, c]) => c > 0)
    .map(([p, c]) => `${p}(${c})`)
    .join(", ");
  if (alreadyPublishedLog) {
    console.log(`[Buffer] Already published today (DB check): ${alreadyPublishedLog}`);
  }

  const guideDrafts = drafts.filter(d => d.contentType !== "trend_insight" && d.contentType !== "news_article");
  const newsDrafts = drafts.filter(d => d.contentType === "news_article");
  const sortedDrafts = [...guideDrafts, ...newsDrafts];

  for (const draft of sortedDrafts) {
    if (draft.platform === "alert") continue;
    if (!connectedPlatforms.has(draft.platform)) continue;

    const alreadyPublished = publishedPerPlatform[draft.platform] || 0;
    if (alreadyPublished >= DAILY_POSTS_PER_PLATFORM) continue;

    if (draft.contentType === "news_article" && draft.createdAt) {
      const ageHours = (Date.now() - new Date(draft.createdAt).getTime()) / 3600000;
      if (ageHours > 48) {
        console.warn(`[Buffer] EXPIRED: News editorial "${draft.contentTitle}" on ${draft.platform} is ${Math.round(ageHours)}h old (>48h limit). Expiring.`);
        await storage.updateSocialPost(draft.id, { status: "failed", publishError: "Auto-expired: news editorial older than 48 hours" });
        continue;
      }
    }

    if (isDraftTitleDuplicate(draft.contentTitle, recentPublishedTitles)) {
      console.warn(`[Buffer] DUPLICATE SKIPPED: "${draft.contentTitle}" on ${draft.platform} matches a recently published post. Deleting draft.`);
      await storage.updateSocialPost(draft.id, { status: "failed", publishError: "Duplicate topic already published" });
      continue;
    }

    const result = await publishPostViaBuffer(draft.id);
    results.push(result);

    if (result.success) {
      publishedPerPlatform[draft.platform] = alreadyPublished + 1;
    }

    if (!result.success && (result.limitReached || result.error?.toLowerCase().includes("limit reached"))) {
      console.log("[Buffer] API limit reached, stopping batch");
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const remaining = nonAlertDrafts.length - results.filter(r => r.success).length;
  if (remaining > 0) {
    console.log(`[Buffer] Daily limit applied (${DAILY_POSTS_PER_PLATFORM}/platform). ${remaining} drafts remaining for future runs.`);
  }

  return results;
}

export async function publishWithFirstComment(
  channelId: string,
  content: string,
  options: {
    mode?: "addToQueue" | "shareNow" | "shareNext";
    imageUrl?: string;
    platform?: string;
    sourceArticleUrl?: string | null;
  } = {}
): Promise<BufferPublishResult> {
  const platform = options.platform || "";

  if (platform === "instagram" && !options.imageUrl) {
    console.error(`[Buffer] publishWithFirstComment: Instagram requires an image — rejecting post`);
    return { success: false, platform, error: "Instagram requires an image" };
  }

  const policyResult = enforcePostPolicy(content, platform);
  const safeContent = policyResult.content;

  const result = await createBufferPost(channelId, safeContent, {
    mode: options.mode || "shareNow",
    imageUrl: options.imageUrl,
    platform: options.platform,
  });

  return result;
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
      channels: channels.map(c => ({
        service: c.service,
        name: c.name,
        id: c.id,
      })),
    };
  } catch (error: any) {
    return {
      configured: true,
      connected: false,
      organizationId: BUFFER_ORG_ID,
      channels: [],
      error: error.message,
    };
  }
}
