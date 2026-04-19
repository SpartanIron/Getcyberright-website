const BASE_DOMAIN = "getcyberright.com";

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export function buildUtmParams(params: UtmParams): string {
  const parts: string[] = [
    `utm_source=${encodeURIComponent(params.source)}`,
    `utm_medium=${encodeURIComponent(params.medium)}`,
    `utm_campaign=${encodeURIComponent(params.campaign)}`,
  ];
  if (params.content) {
    parts.push(`utm_content=${encodeURIComponent(params.content)}`);
  }
  if (params.term) {
    parts.push(`utm_term=${encodeURIComponent(params.term)}`);
  }
  return parts.join("&");
}

export function addUtmToUrl(url: string, params: UtmParams): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (host !== BASE_DOMAIN && host !== `www.${BASE_DOMAIN}` && !host.endsWith(`.${BASE_DOMAIN}`)) {
      return url;
    }
    parsed.searchParams.set("utm_source", params.source);
    parsed.searchParams.set("utm_medium", params.medium);
    parsed.searchParams.set("utm_campaign", params.campaign);
    if (params.content) {
      parsed.searchParams.set("utm_content", params.content);
    }
    if (params.term) {
      parsed.searchParams.set("utm_term", params.term);
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export function buildCampaignId(contentType: string, platform: string, postStyle?: string): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const parts = [contentType, date];
  if (postStyle) {
    parts.push(postStyle);
  }
  return parts.join("_");
}

export function createUtmForPost(
  platform: string,
  contentType: string,
  contentSlug?: string,
  postStyle?: string
): UtmParams {
  return {
    source: platform,
    medium: "social",
    campaign: buildCampaignId(contentType, platform, postStyle),
    content: contentSlug || undefined,
  };
}

export function tagAllGcrLinks(
  text: string,
  platform: string,
  contentType: string,
  contentSlug?: string,
  postStyle?: string
): string {
  const utmParams = createUtmForPost(platform, contentType, contentSlug, postStyle);
  const linkPattern = /https?:\/\/(?:www\.)?getcyberright\.com(\/[^\s)\]"',]*)?/gi;

  return text.replace(linkPattern, (match) => {
    const cleanUrl = match.replace(/[.,;:!?)]+$/, "");
    const trailing = match.slice(cleanUrl.length);
    if (cleanUrl.includes("utm_source=")) {
      return match;
    }
    return addUtmToUrl(cleanUrl, utmParams) + trailing;
  });
}

function canonicalPathOf(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/+$/, "");
  } catch {
    return "";
  }
}

export function ensureGcrLink(
  text: string,
  canonicalUrl: string,
  platform: string,
  contentType: string,
  contentSlug?: string,
  postStyle?: string
): string {
  // Instagram strips URLs from captions in feed (only "link in bio" works),
  // so appending a canonical URL there is wasted text. Every other platform
  // (including our internal "alert" template) MUST end with the canonical link
  // so readers always have somewhere to go.
  if (platform === "instagram") return text;

  const canonicalPath = canonicalPathOf(canonicalUrl);
  const linkPattern = /https?:\/\/(?:www\.)?getcyberright\.com(\/[^\s)\]"',]*)?/gi;

  let canonicalSeen = false;
  const stripped = text.replace(linkPattern, (match) => {
    const cleanUrl = match.replace(/[.,;:!?)]+$/, "");
    const trailing = match.slice(cleanUrl.length);
    const matchPath = canonicalPathOf(cleanUrl);
    if (canonicalPath && matchPath === canonicalPath) {
      canonicalSeen = true;
      return match;
    }
    return trailing;
  });

  const cleaned = stripped
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (canonicalSeen) return cleaned;

  const taggedUrl = tagSingleUrl(canonicalUrl, platform, contentType, contentSlug, postStyle);
  return cleaned + "\n\n" + taggedUrl;
}

export function tagSingleUrl(
  url: string,
  platform: string,
  contentType: string,
  contentSlug?: string,
  postStyle?: string
): string {
  const utmParams = createUtmForPost(platform, contentType, contentSlug, postStyle);
  return addUtmToUrl(url, utmParams);
}
