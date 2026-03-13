import { storage } from "./storage";
import * as fs from "fs";

interface BufferProfile {
  id: string;
  service: string;
  formatted_service: string;
  formatted_username: string;
  avatar: string;
  default: boolean;
}

interface BufferPublishResult {
  success: boolean;
  platform: string;
  bufferId?: string;
  error?: string;
}

const BUFFER_API_BASE = "https://api.bufferapp.com/1";

function getBufferToken(): string | undefined {
  return process.env.BUFFER_API_KEY;
}

export function isBufferConfigured(): boolean {
  return !!getBufferToken();
}

async function bufferRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
  const token = getBufferToken();
  if (!token) throw new Error("Buffer API key not configured");

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BUFFER_API_BASE}${endpoint}${separator}access_token=${token}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Buffer API error ${res.status}: ${body}`);
  }

  return res.json();
}

let cachedProfiles: BufferProfile[] | null = null;
let profileCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export async function getBufferProfiles(): Promise<BufferProfile[]> {
  if (cachedProfiles && Date.now() - profileCacheTime < CACHE_TTL) {
    return cachedProfiles;
  }

  try {
    const profiles = await bufferRequest("/profiles.json");
    cachedProfiles = profiles;
    profileCacheTime = Date.now();
    return profiles;
  } catch (error: any) {
    console.error("[Buffer] Failed to fetch profiles:", error.message);
    return [];
  }
}

export async function getBufferProfilesByPlatform(): Promise<Record<string, BufferProfile>> {
  const profiles = await getBufferProfiles();
  const map: Record<string, BufferProfile> = {};

  for (const profile of profiles) {
    const service = profile.service?.toLowerCase();
    if (service === "linkedin") map.linkedin = profile;
    else if (service === "facebook") map.facebook = profile;
    else if (service === "instagram") map.instagram = profile;
    else if (service === "twitter" || service === "x") map.x = profile;
  }

  return map;
}

function platformToBufferService(platform: string): string {
  switch (platform) {
    case "linkedin": return "linkedin";
    case "facebook": return "facebook";
    case "instagram": return "instagram";
    case "x": return "twitter";
    default: return platform;
  }
}

export async function publishToBuffer(
  profileId: string,
  text: string,
  options: {
    mediaUrl?: string;
    mediaPath?: string;
    scheduled_at?: string;
    shorten?: boolean;
  } = {}
): Promise<BufferPublishResult> {
  try {
    const params = new URLSearchParams();
    params.append("profile_ids[]", profileId);
    params.append("text", text);

    if (options.shorten !== undefined) {
      params.append("shorten", options.shorten ? "true" : "false");
    }

    if (options.mediaUrl) {
      params.append("media[link]", options.mediaUrl);
    }

    if (options.mediaPath && fs.existsSync(options.mediaPath)) {
      params.append("media[photo]", options.mediaPath);
    }

    if (options.scheduled_at) {
      params.append("scheduled_at", options.scheduled_at);
    }

    const result = await bufferRequest("/updates/create.json", {
      method: "POST",
      body: params.toString(),
    });

    if (result.success) {
      const updateId = result.updates?.[0]?.id || result.update?.id;
      return {
        success: true,
        platform: "buffer",
        bufferId: updateId,
      };
    } else {
      return {
        success: false,
        platform: "buffer",
        error: result.message || "Buffer API returned unsuccessful response",
      };
    }
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

  const profiles = await getBufferProfilesByPlatform();
  const profile = profiles[post.platform];

  if (!profile) {
    return {
      success: false,
      platform: post.platform,
      error: `No Buffer profile connected for ${post.platform}. Connect it in your Buffer dashboard.`,
    };
  }

  const result = await publishToBuffer(profile.id, post.postContent, {
    mediaPath: post.imageUrl || undefined,
    shorten: true,
  });

  if (result.success) {
    await storage.updateSocialPost(postId, {
      status: "published",
      publishedAt: new Date(),
    });
    console.log(`[Buffer] Published ${post.platform} post: ${postId} (Buffer ID: ${result.bufferId})`);
  } else {
    await storage.updateSocialPost(postId, {
      status: "failed",
      publishError: `Buffer: ${result.error}`,
    });
    console.error(`[Buffer] Failed to publish ${post.platform} post: ${result.error}`);
  }

  return result;
}

export async function publishAllDraftsViaBuffer(): Promise<BufferPublishResult[]> {
  const drafts = await storage.getSocialPosts("draft", 50);
  const results: BufferPublishResult[] = [];
  const profiles = await getBufferProfilesByPlatform();
  const connectedPlatforms = new Set(Object.keys(profiles));

  for (const draft of drafts) {
    if (draft.platform === "alert") continue;
    if (!connectedPlatforms.has(draft.platform)) continue;

    const result = await publishPostViaBuffer(draft.id);
    results.push(result);

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

export async function getBufferStatus(): Promise<{
  configured: boolean;
  connected: boolean;
  profiles: { service: string; username: string; id: string }[];
  error?: string;
}> {
  if (!isBufferConfigured()) {
    return { configured: false, connected: false, profiles: [] };
  }

  try {
    const profiles = await getBufferProfiles();
    return {
      configured: true,
      connected: profiles.length > 0,
      profiles: profiles.map(p => ({
        service: p.service,
        username: p.formatted_username,
        id: p.id,
      })),
    };
  } catch (error: any) {
    return {
      configured: true,
      connected: false,
      profiles: [],
      error: error.message,
    };
  }
}
