import { storage } from "./storage";
import * as path from "path";
import * as fs from "fs";

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

  if (process.env.REPLIT_DOMAINS) {
    const domain = process.env.REPLIT_DOMAINS.split(",")[0];
    return `https://${domain}/api/social-images/${filename}`;
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

export async function getBufferChannels(): Promise<BufferChannel[]> {
  if (cachedChannels && Date.now() - channelCacheTime < CACHE_TTL) {
    return cachedChannels;
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
    return data.channels;
  } catch (error: any) {
    console.error("[Buffer] Failed to fetch channels:", error.message);
    return [];
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
    const mode = options.mode || "shareNow";

    const input: Record<string, any> = {
      channelId,
      text,
      mode,
      schedulingType: "automatic",
      source: "getcyberright",
    };

    if (options.dueAt) {
      input.dueAt = options.dueAt;
    }

    if (options.platform === "facebook") {
      input.metadata = { facebook: { type: "post" } };
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
  if (post.imageUrl) {
    if (post.imageUrl.startsWith("https://")) {
      imageUrl = post.imageUrl;
      console.log(`[Buffer] Using external image URL: ${imageUrl}`);
    } else if (fs.existsSync(post.imageUrl)) {
      const publicUrl = getPublicImageUrl(post.imageUrl);
      if (publicUrl) {
        imageUrl = publicUrl;
      } else {
        console.warn(`[Buffer] Could not resolve public URL for image: ${post.imageUrl}`);
      }
    } else {
      console.warn(`[Buffer] Image file not found: ${post.imageUrl}, generating new one`);
      const { generateBrandedImage } = await import("./socialImageService");
      const newImagePath = await generateBrandedImage(post.contentTitle, post.contentType, post.platform);
      if (newImagePath) {
        await storage.updateSocialPost(postId, { imageUrl: newImagePath });
        const publicUrl = getPublicImageUrl(newImagePath);
        if (publicUrl) {
          imageUrl = publicUrl;
        }
      }
    }
  } else {
    const { generateBrandedImage } = await import("./socialImageService");
    const newImagePath = await generateBrandedImage(post.contentTitle, post.contentType, post.platform);
    if (newImagePath) {
      await storage.updateSocialPost(postId, { imageUrl: newImagePath });
      const publicUrl = getPublicImageUrl(newImagePath);
      if (publicUrl) {
        imageUrl = publicUrl;
        console.log(`[Buffer] Generated new image for ${post.platform}: ${imageUrl}`);
      }
    }
  }

  let result = await createBufferPost(channel.id, post.postContent, {
    mode: "shareNow",
    imageUrl,
    platform: post.platform,
  });

  if (!result.success && imageUrl && result.error?.toLowerCase().includes("image")) {
    console.warn(`[Buffer] Image rejected for ${post.platform} post ${postId}: ${result.error}. Retrying without image...`);
    result = await createBufferPost(channel.id, post.postContent, {
      mode: "shareNow",
      platform: post.platform,
    });
    if (result.success) {
      console.log(`[Buffer] Retry without image succeeded for ${post.platform} post ${postId}`);
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

const DAILY_POSTS_PER_PLATFORM = 1;

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

export async function publishAllDraftsViaBuffer(): Promise<BufferPublishResult[]> {
  const drafts = await storage.getSocialPosts("draft", 50);
  const results: BufferPublishResult[] = [];
  const channels = await getBufferChannelsByPlatform();
  const connectedPlatforms = new Set(Object.keys(channels));

  const nonAlertDrafts = drafts.filter(d => d.platform !== "alert");
  if (connectedPlatforms.size === 0) {
    console.warn(`[Buffer] No connected channels found. Cannot publish ${nonAlertDrafts.length} draft posts. Run channel check.`);
    return results;
  }

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

  for (const draft of drafts) {
    if (draft.platform === "alert") continue;
    if (!connectedPlatforms.has(draft.platform)) continue;

    const alreadyPublished = publishedPerPlatform[draft.platform] || 0;
    if (alreadyPublished >= DAILY_POSTS_PER_PLATFORM) continue;

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
