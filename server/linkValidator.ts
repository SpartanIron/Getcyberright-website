import { storage } from "./storage";

const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://www.getcyberright.com"
  : (process.env.PUBLIC_URL || "https://www.getcyberright.com");

const LINK_PATTERN = /https?:\/\/(?:www\.)?getcyberright\.com(\/[^\s?#)"\]]*)/g;

const SECTION_FALLBACKS: Record<string, string> = {
  "/guides": "/guides",
  "/alerts": "/alerts",
  "/news": "/news",
  "/scam-intel": "/scam-intel",
  "/scams": "/scams",
  "/training": "/training",
};

const urlCache = new Map<string, { status: number; checkedAt: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

function getCachedStatus(url: string): number | null {
  const entry = urlCache.get(url);
  if (entry && Date.now() - entry.checkedAt < CACHE_TTL_MS) {
    return entry.status;
  }
  return null;
}

function setCachedStatus(url: string, status: number): void {
  urlCache.set(url, { status, checkedAt: Date.now() });
  if (urlCache.size > 500) {
    const oldest = [...urlCache.entries()]
      .sort((a, b) => a[1].checkedAt - b[1].checkedAt)
      .slice(0, 100);
    for (const [key] of oldest) {
      urlCache.delete(key);
    }
  }
}

async function checkUrlStatus(url: string): Promise<number> {
  const cached = getCachedStatus(url);
  if (cached !== null) return cached;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "GetCyberRight-LinkValidator/1.0",
      },
    });
    clearTimeout(timeout);

    setCachedStatus(url, res.status);
    return res.status;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn(`[LinkValidator] Timeout checking ${url}`);
      return 0;
    }
    console.warn(`[LinkValidator] Error checking ${url}: ${err.message}`);
    return 0;
  }
}

function getSectionFallback(pathname: string): string | null {
  for (const [prefix, fallback] of Object.entries(SECTION_FALLBACKS)) {
    if (pathname.startsWith(prefix + "/")) {
      return fallback;
    }
  }
  return null;
}

export interface LinkValidationResult {
  valid: boolean;
  originalUrl: string;
  resolvedUrl: string;
  statusCode: number;
  action: "pass" | "rewritten" | "blocked";
  details?: string;
}

export async function validatePostLinks(
  postContent: string
): Promise<{
  allValid: boolean;
  results: LinkValidationResult[];
  rewrittenContent: string;
}> {
  const matches: { fullUrl: string; path: string }[] = [];
  let match: RegExpExecArray | null;
  const re = new RegExp(LINK_PATTERN.source, "g");
  while ((match = re.exec(postContent)) !== null) {
    matches.push({ fullUrl: match[0], path: match[1] });
  }

  if (matches.length === 0) {
    return { allValid: true, results: [], rewrittenContent: postContent };
  }

  const results: LinkValidationResult[] = [];
  let rewrittenContent = postContent;

  for (const { fullUrl, path: urlPath } of matches) {
    const cleanPath = urlPath.split("?")[0];

    if (cleanPath === "/" || cleanPath === "") {
      results.push({
        valid: true,
        originalUrl: fullUrl,
        resolvedUrl: fullUrl,
        statusCode: 200,
        action: "pass",
      });
      continue;
    }

    const status = await checkUrlStatus(fullUrl);

    if (status >= 200 && status < 400) {
      results.push({
        valid: true,
        originalUrl: fullUrl,
        resolvedUrl: fullUrl,
        statusCode: status,
        action: "pass",
      });
      continue;
    }

    const fallbackPath = getSectionFallback(cleanPath);
    if (fallbackPath) {
      const fallbackUrl = fullUrl.replace(
        /https?:\/\/(?:www\.)?getcyberright\.com\/[^\s?#)"\]]*/,
        `https://www.getcyberright.com${fallbackPath}`
      );

      const fallbackStatus = await checkUrlStatus(`https://www.getcyberright.com${fallbackPath}`);
      if (fallbackStatus >= 200 && fallbackStatus < 400) {
        rewrittenContent = rewrittenContent.replace(fullUrl, fallbackUrl);
        results.push({
          valid: false,
          originalUrl: fullUrl,
          resolvedUrl: fallbackUrl,
          statusCode: status,
          action: "rewritten",
          details: `404 at ${cleanPath} → rewritten to ${fallbackPath}`,
        });
        console.warn(
          `[LinkValidator] REWRITTEN: ${fullUrl} (${status}) → ${fallbackUrl}`
        );
        continue;
      }
    }

    results.push({
      valid: false,
      originalUrl: fullUrl,
      resolvedUrl: fullUrl,
      statusCode: status,
      action: "blocked",
      details: `URL returned ${status}, no fallback available`,
    });
    console.error(
      `[LinkValidator] BLOCKED: ${fullUrl} returned ${status} with no viable fallback`
    );
  }

  const allValid = results.every((r) => r.action === "pass");
  return { allValid, results, rewrittenContent };
}

export async function validateAndPreparePost(
  postContent: string,
  postId: string,
  platform: string,
  contentTitle: string
): Promise<{
  shouldPublish: boolean;
  content: string;
  validationLog: string;
}> {
  const { allValid, results, rewrittenContent } = await validatePostLinks(postContent);

  const rewritten = results.filter((r) => r.action === "rewritten");
  const blocked = results.filter((r) => r.action === "blocked");

  let validationLog = `[LinkValidator] Post "${contentTitle}" (${platform}): `;

  if (allValid && results.length > 0) {
    validationLog += `${results.length} link(s) verified OK`;
    return { shouldPublish: true, content: postContent, validationLog };
  }

  if (results.length === 0) {
    validationLog += "no GCR links found, passing through";
    return { shouldPublish: true, content: postContent, validationLog };
  }

  if (rewritten.length > 0 && blocked.length === 0) {
    validationLog += `${rewritten.length} link(s) rewritten: ${rewritten.map((r) => r.details).join("; ")}`;
    return { shouldPublish: true, content: rewrittenContent, validationLog };
  }

  if (blocked.length > 0) {
    validationLog += `BLOCKED — ${blocked.length} broken link(s): ${blocked.map((r) => `${r.originalUrl} (${r.statusCode})`).join(", ")}`;

    await storage.updateSocialPost(postId, {
      status: "failed",
      publishError: `Link validation failed: ${blocked.map((r) => r.details).join("; ")}`,
    });

    return { shouldPublish: false, content: postContent, validationLog };
  }

  validationLog += "unknown state, allowing publish";
  return { shouldPublish: true, content: postContent, validationLog };
}

export function clearValidationCache(): void {
  urlCache.clear();
}
