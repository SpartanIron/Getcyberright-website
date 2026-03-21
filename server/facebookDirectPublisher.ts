import crypto from "crypto";

const FB_AUTH_URL = "https://www.facebook.com/v21.0/dialog/oauth";
const FB_TOKEN_URL = "https://graph.facebook.com/v21.0/oauth/access_token";
const FB_GRAPH_URL = "https://graph.facebook.com/v21.0";

const SCOPES = [
  "pages_manage_posts",
  "pages_read_engagement",
  "pages_show_list",
  "pages_read_user_content",
];

function getRedirectUri(): string {
  const prodDomain = process.env.PRODUCTION_DOMAIN || "www.getcyberright.com";
  const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0];
  const baseUrl = process.env.NODE_ENV === "production"
    ? `https://${prodDomain}`
    : `https://${replitDomain}`;
  return `${baseUrl}/api/auth/facebook/callback`;
}

let oauthState: string | null = null;

export function getFacebookAuthUrl(): string {
  oauthState = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    redirect_uri: getRedirectUri(),
    state: oauthState,
    scope: SCOPES.join(","),
    response_type: "code",
  });
  return `${FB_AUTH_URL}?${params.toString()}`;
}

export function validateFBOAuthState(state: string): boolean {
  if (!oauthState) return false;
  const valid = state === oauthState;
  oauthState = null;
  return valid;
}

export async function exchangeFBCodeForToken(code: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID || "",
    client_secret: process.env.FACEBOOK_APP_SECRET || "",
    redirect_uri: getRedirectUri(),
    code,
  });

  const resp = await fetch(`${FB_TOKEN_URL}?${params.toString()}`);
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Facebook token exchange failed: ${resp.status} ${errText}`);
  }
  return resp.json();
}

export async function getLongLivedToken(shortLivedToken: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const params = new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: process.env.FACEBOOK_APP_ID || "",
    client_secret: process.env.FACEBOOK_APP_SECRET || "",
    fb_exchange_token: shortLivedToken,
  });

  const resp = await fetch(`${FB_TOKEN_URL}?${params.toString()}`);
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Long-lived token exchange failed: ${resp.status} ${errText}`);
  }
  return resp.json();
}

export async function getUserPages(userAccessToken: string): Promise<Array<{
  id: string;
  name: string;
  access_token: string;
  category: string;
}>> {
  const resp = await fetch(
    `${FB_GRAPH_URL}/me/accounts?access_token=${userAccessToken}&fields=id,name,access_token,category`
  );
  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Failed to fetch pages: ${resp.status} ${errText}`);
  }
  const data = await resp.json();
  return data.data || [];
}

export async function postToFacebookPage(
  pageAccessToken: string,
  pageId: string,
  message: string,
  linkUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const body: any = { message, access_token: pageAccessToken };
  if (linkUrl) body.link = linkUrl;

  const resp = await fetch(`${FB_GRAPH_URL}/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("[Facebook Direct] Post failed:", resp.status, errText);
    return { success: false, error: `${resp.status}: ${errText}` };
  }

  const data = await resp.json();
  console.log("[Facebook Direct] Post published successfully, ID:", data.id);
  return { success: true, postId: data.id };
}

export function isFacebookDirectConfigured(): boolean {
  return !!(
    process.env.FACEBOOK_APP_ID &&
    process.env.FACEBOOK_APP_SECRET &&
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN &&
    process.env.FACEBOOK_PAGE_ID
  );
}

export async function publishDirectToFacebook(
  message: string,
  linkUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const pageToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!pageToken || !pageId) {
    return { success: false, error: "Facebook direct publishing not configured. Missing page access token or page ID." };
  }

  return postToFacebookPage(pageToken, pageId, message, linkUrl);
}
