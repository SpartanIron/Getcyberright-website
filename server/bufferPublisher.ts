import { storage } from "./storage";
import * as path from "path";
import * as fs from "fs";

const BUFFER_GRAPHQL_URL = "https://api.buffer.com/graphql";
const BUFFER_ORG_ID = process.env.BUFFER_ORG_ID || "";

function getPublicImageUrl(localImagePath: string): string | null {
  if (!localImagePath) return null;

  const filename = path.basename(localImagePath);

  const baseUrl = process.env.PUBLIC_IMAGE_BASE_URL;
  if (baseUrl) {
    return `${baseUrl}/api/social-images/${filename}`;
  }

  const replitDomains = process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN;
  if (replitDomains) {
    const domain = replitDomains.split(",")[0].trim();
    return `https://${domain}/api/social-images/${filename}`;
  }

  return null;
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
  } = {}
): Promise<BufferPublishResult> {
  try {
    const mode = options.mode || "addToQueue";

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

    if (options.imageUrl) {
      input.assets = {
        images: [{ url: options.imageUrl }],
      };
      console.log(`[Buffer] Attaching image: ${options.imageUrl}`);
    }

    const data = await graphql<{ createPost: any }>(
      `mutation CreatePost($input: CreatePostInput!) {
        createPost(input: $input) {
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
      return {
        success: false,
        platform: "buffer",
        error: result.message,
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
    if (fs.existsSync(post.imageUrl)) {
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

  const result = await createBufferPost(channel.id, post.postContent, {
    mode: "addToQueue",
    imageUrl,
  });

  if (result.success) {
    await storage.updateSocialPost(postId, {
      status: "published",
      publishedAt: new Date(),
    });
    console.log(`[Buffer] Queued ${post.platform} post: ${postId} (Buffer ID: ${result.bufferId})`);
  } else {
    await storage.updateSocialPost(postId, {
      status: "failed",
      publishError: `Buffer: ${result.error}`,
    });
    console.error(`[Buffer] Failed to queue ${post.platform} post: ${result.error}`);
  }

  return result;
}

export async function publishAllDraftsViaBuffer(): Promise<BufferPublishResult[]> {
  const drafts = await storage.getSocialPosts("draft", 50);
  const results: BufferPublishResult[] = [];
  const channels = await getBufferChannelsByPlatform();
  const connectedPlatforms = new Set(Object.keys(channels));

  for (const draft of drafts) {
    if (draft.platform === "alert") continue;
    if (!connectedPlatforms.has(draft.platform)) continue;

    const result = await publishPostViaBuffer(draft.id);
    results.push(result);

    await new Promise(resolve => setTimeout(resolve, 500));
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
