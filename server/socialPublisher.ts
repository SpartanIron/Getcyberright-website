import { storage } from "./storage";
import { getImageAsBase64 } from "./socialImageService";
import * as fs from "fs";

interface PublishResult {
  success: boolean;
  platform: string;
  externalId?: string;
  error?: string;
}

interface PlatformConfig {
  name: string;
  isConfigured: boolean;
  requiredVars: string[];
}

export function getConnectedPlatforms(): PlatformConfig[] {
  return [
    {
      name: "linkedin",
      isConfigured: !!(process.env.LINKEDIN_ACCESS_TOKEN),
      requiredVars: ["LINKEDIN_ACCESS_TOKEN"],
    },
    {
      name: "facebook",
      isConfigured: !!(process.env.FACEBOOK_PAGE_TOKEN && process.env.FACEBOOK_PAGE_ID),
      requiredVars: ["FACEBOOK_PAGE_TOKEN", "FACEBOOK_PAGE_ID"],
    },
    {
      name: "instagram",
      isConfigured: !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID && process.env.PUBLIC_IMAGE_BASE_URL),
      requiredVars: ["INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_USER_ID", "PUBLIC_IMAGE_BASE_URL"],
    },
    {
      name: "x",
      isConfigured: !!(process.env.X_API_KEY && process.env.X_API_SECRET && process.env.X_ACCESS_TOKEN && process.env.X_ACCESS_SECRET),
      requiredVars: ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET"],
    },
  ];
}

async function publishToLinkedIn(content: string, imageUrl?: string): Promise<PublishResult> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  if (!token) return { success: false, platform: "linkedin", error: "LinkedIn not configured. Set LINKEDIN_ACCESS_TOKEN." };

  try {
    const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!profileRes.ok) throw new Error(`Profile fetch failed: ${profileRes.status}`);
    const profile = await profileRes.json() as any;
    const authorUrn = `urn:li:person:${profile.sub}`;

    let imageUrn: string | undefined;
    if (imageUrl && fs.existsSync(imageUrl)) {
      const initRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: authorUrn,
            serviceRelationships: [{ identifier: "urn:li:userGeneratedContent", relationshipType: "OWNER" }],
          },
        }),
      });

      if (initRes.ok) {
        const initData = await initRes.json() as any;
        const uploadUrl = initData.value?.uploadMechanism?.["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"]?.uploadUrl;
        imageUrn = initData.value?.asset;

        if (uploadUrl && imageUrn) {
          const imgBuffer = fs.readFileSync(imageUrl);
          await fetch(uploadUrl, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "image/webp" },
            body: imgBuffer,
          });
        }
      }
    }

    const postBody: any = {
      author: authorUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: content },
          shareMediaCategory: imageUrn ? "IMAGE" : "NONE",
          ...(imageUrn ? {
            media: [{
              status: "READY",
              media: imageUrn,
            }],
          } : {}),
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };

    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(postBody),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`LinkedIn API error ${res.status}: ${errBody}`);
    }

    const externalId = res.headers.get("x-restli-id") || undefined;
    let resultId = externalId;
    try {
      const result = await res.json() as any;
      resultId = result.id || externalId;
    } catch {
      // LinkedIn may not return JSON on success - header ID is sufficient
    }
    return { success: true, platform: "linkedin", externalId: resultId };
  } catch (error: any) {
    return { success: false, platform: "linkedin", error: error.message };
  }
}

async function publishToFacebook(content: string, imageUrl?: string): Promise<PublishResult> {
  const token = process.env.FACEBOOK_PAGE_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;
  if (!token || !pageId) return { success: false, platform: "facebook", error: "Facebook not configured. Set FACEBOOK_PAGE_TOKEN and FACEBOOK_PAGE_ID." };

  try {
    let endpoint: string;
    let body: any;

    if (imageUrl && fs.existsSync(imageUrl)) {
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/photos`;
      const formData = new FormData();
      const imgBuffer = fs.readFileSync(imageUrl);
      formData.append("source", new Blob([imgBuffer], { type: "image/webp" }), "social-image.webp");
      formData.append("message", content);
      formData.append("access_token", token);

      const res = await fetch(endpoint, { method: "POST", body: formData });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Facebook API error ${res.status}: ${errBody}`);
      }
      const result = await res.json() as any;
      return { success: true, platform: "facebook", externalId: result.id || result.post_id };
    } else {
      endpoint = `https://graph.facebook.com/v18.0/${pageId}/feed`;
      const params = new URLSearchParams({ message: content, access_token: token });
      const res = await fetch(endpoint, { method: "POST", body: params });
      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Facebook API error ${res.status}: ${errBody}`);
      }
      const result = await res.json() as any;
      return { success: true, platform: "facebook", externalId: result.id };
    }
  } catch (error: any) {
    return { success: false, platform: "facebook", error: error.message };
  }
}

async function publishToInstagram(content: string, imageUrl?: string): Promise<PublishResult> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!token || !userId) return { success: false, platform: "instagram", error: "Instagram not configured. Set INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID." };

  try {
    if (!imageUrl) {
      return { success: false, platform: "instagram", error: "Instagram requires an image." };
    }

    const publicImageUrl = process.env.PUBLIC_IMAGE_BASE_URL
      ? `${process.env.PUBLIC_IMAGE_BASE_URL}/api/social-images/${require("path").basename(imageUrl)}`
      : null;

    if (!publicImageUrl) {
      return { success: false, platform: "instagram", error: "PUBLIC_IMAGE_BASE_URL not set. Instagram requires a publicly accessible image URL." };
    }

    const createRes = await fetch(
      `https://graph.facebook.com/v18.0/${userId}/media?image_url=${encodeURIComponent(publicImageUrl)}&caption=${encodeURIComponent(content)}&access_token=${token}`,
      { method: "POST" }
    );

    if (!createRes.ok) {
      const errBody = await createRes.text();
      throw new Error(`Instagram media create error ${createRes.status}: ${errBody}`);
    }

    const createData = await createRes.json() as any;
    const creationId = createData.id;

    const publishRes = await fetch(
      `https://graph.facebook.com/v18.0/${userId}/media_publish?creation_id=${creationId}&access_token=${token}`,
      { method: "POST" }
    );

    if (!publishRes.ok) {
      const errBody = await publishRes.text();
      throw new Error(`Instagram publish error ${publishRes.status}: ${errBody}`);
    }

    const publishData = await publishRes.json() as any;
    return { success: true, platform: "instagram", externalId: publishData.id };
  } catch (error: any) {
    return { success: false, platform: "instagram", error: error.message };
  }
}

async function publishToX(content: string, _imageUrl?: string): Promise<PublishResult> {
  const apiKey = process.env.X_API_KEY;
  const apiSecret = process.env.X_API_SECRET;
  const accessToken = process.env.X_ACCESS_TOKEN;
  const accessSecret = process.env.X_ACCESS_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return { success: false, platform: "x", error: "X/Twitter not configured. Set X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET." };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = require("crypto").randomBytes(16).toString("hex");

    const oauthParams: Record<string, string> = {
      oauth_consumer_key: apiKey,
      oauth_nonce: nonce,
      oauth_signature_method: "HMAC-SHA1",
      oauth_timestamp: timestamp,
      oauth_token: accessToken,
      oauth_version: "1.0",
    };

    const baseUrl = "https://api.twitter.com/2/tweets";
    const paramString = Object.keys(oauthParams).sort()
      .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(oauthParams[k])}`)
      .join("&");
    const baseString = `POST&${encodeURIComponent(baseUrl)}&${encodeURIComponent(paramString)}`;
    const signingKey = `${encodeURIComponent(apiSecret)}&${encodeURIComponent(accessSecret)}`;

    const crypto = require("crypto");
    const signature = crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
    oauthParams.oauth_signature = signature;

    const authHeader = "OAuth " + Object.keys(oauthParams).sort()
      .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
      .join(", ");

    const tweetText = content.length > 280 ? content.substring(0, 277) + "..." : content;

    const res = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: tweetText }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`X API error ${res.status}: ${errBody}`);
    }

    const result = await res.json() as any;
    return { success: true, platform: "x", externalId: result.data?.id };
  } catch (error: any) {
    return { success: false, platform: "x", error: error.message };
  }
}

export async function publishPost(postId: string): Promise<PublishResult> {
  const post = await storage.getSocialPostById(postId);
  if (!post) return { success: false, platform: "unknown", error: "Post not found" };

  let result: PublishResult;

  switch (post.platform) {
    case "linkedin":
      result = await publishToLinkedIn(post.postContent, post.imageUrl || undefined);
      break;
    case "facebook":
      result = await publishToFacebook(post.postContent, post.imageUrl || undefined);
      break;
    case "instagram":
      result = await publishToInstagram(post.postContent, post.imageUrl || undefined);
      break;
    case "x":
      result = await publishToX(post.postContent, post.imageUrl || undefined);
      break;
    default:
      result = { success: false, platform: post.platform, error: `Unsupported platform: ${post.platform}` };
  }

  if (result.success) {
    await storage.updateSocialPost(postId, {
      status: "published",
      publishedAt: new Date(),
    });
    console.log(`[SocialPublisher] Published ${post.platform} post: ${postId}`);
  } else {
    await storage.updateSocialPost(postId, {
      status: "failed",
      publishError: result.error || "Unknown error",
    });
    console.error(`[SocialPublisher] Failed to publish ${post.platform} post: ${result.error}`);
  }

  return result;
}

export async function publishAllDrafts(): Promise<PublishResult[]> {
  const drafts = await storage.getSocialPosts("draft", 50);
  const results: PublishResult[] = [];

  const platforms = getConnectedPlatforms();
  const configuredPlatforms = new Set(platforms.filter(p => p.isConfigured).map(p => p.name));

  for (const draft of drafts) {
    if (!configuredPlatforms.has(draft.platform)) continue;
    const result = await publishPost(draft.id);
    results.push(result);

    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}
