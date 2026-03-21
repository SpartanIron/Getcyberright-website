import crypto from "crypto";

const LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";
const LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LINKEDIN_API_BASE = "https://api.linkedin.com/rest";

const SCOPES = [
  "openid",
  "profile",
  "w_member_social",
  "w_organization_social",
  "r_organization_social",
];

function getRedirectUri(): string {
  const prodDomain = process.env.PRODUCTION_DOMAIN || "www.getcyberright.com";
  const replitDomain = process.env.REPLIT_DOMAINS?.split(",")[0];
  const baseUrl = process.env.NODE_ENV === "production"
    ? `https://${prodDomain}`
    : `https://${replitDomain}`;
  return `${baseUrl}/api/auth/linkedin/callback`;
}

let oauthState: string | null = null;

export function getLinkedInAuthUrl(): string {
  oauthState = crypto.randomBytes(16).toString("hex");
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINKEDIN_CLIENT_ID || "",
    redirect_uri: getRedirectUri(),
    state: oauthState,
    scope: SCOPES.join(" "),
  });
  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
}

export function validateOAuthState(state: string): boolean {
  if (!oauthState) return false;
  const valid = state === oauthState;
  oauthState = null;
  return valid;
}

export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: process.env.LINKEDIN_CLIENT_ID || "",
    client_secret: process.env.LINKEDIN_CLIENT_SECRET || "",
    redirect_uri: getRedirectUri(),
  });

  const resp = await fetch(LINKEDIN_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`LinkedIn token exchange failed: ${resp.status} ${errText}`);
  }

  return resp.json();
}

export async function getLinkedInProfile(accessToken: string): Promise<{ sub: string; name: string }> {
  const resp = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!resp.ok) throw new Error(`Profile fetch failed: ${resp.status}`);
  return resp.json();
}

export async function findOrganizationId(accessToken: string): Promise<string | null> {
  const resp = await fetch(
    `${LINKEDIN_API_BASE}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(id,localizedName)))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
      },
    }
  );

  if (!resp.ok) {
    console.error("[LinkedIn] Org lookup failed:", resp.status, await resp.text());
    return null;
  }

  const data = await resp.json();
  const elements = data.elements || [];
  if (elements.length > 0) {
    const orgUrn = elements[0].organization;
    const orgId = orgUrn?.replace("urn:li:organization:", "");
    return orgId || null;
  }
  return null;
}

export async function postToLinkedInOrganization(
  accessToken: string,
  organizationId: string,
  text: string,
  linkUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const author = `urn:li:organization:${organizationId}`;

  const postBody: any = {
    author,
    commentary: text,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (linkUrl) {
    postBody.content = {
      article: {
        source: linkUrl,
        title: "",
        description: "",
      },
    };
  }

  const resp = await fetch(`${LINKEDIN_API_BASE}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": "202401",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify(postBody),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("[LinkedIn Direct] Post failed:", resp.status, errText);
    return { success: false, error: `${resp.status}: ${errText}` };
  }

  const postId = resp.headers.get("x-restli-id") || resp.headers.get("x-linkedin-id") || "unknown";
  console.log("[LinkedIn Direct] Post published successfully, ID:", postId);
  return { success: true, postId };
}

export function isLinkedInDirectConfigured(): boolean {
  return !!(
    process.env.LINKEDIN_CLIENT_ID &&
    process.env.LINKEDIN_CLIENT_SECRET &&
    process.env.LINKEDIN_ACCESS_TOKEN &&
    process.env.LINKEDIN_ORGANIZATION_ID
  );
}

export async function publishDirectToLinkedIn(
  text: string,
  linkUrl?: string
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  if (!token || !orgId) {
    return { success: false, error: "LinkedIn direct publishing not configured. Missing access token or org ID." };
  }

  return postToLinkedInOrganization(token, orgId, text, linkUrl);
}
