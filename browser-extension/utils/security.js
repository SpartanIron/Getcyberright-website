import { logWarn } from "./logger.js";

const SKIP_SCAN_PATTERNS = [
  /^chrome/,
  /^about:/,
  /^chrome-extension:/,
  /^moz-extension:/,
  /^edge:/,
  /^brave:/,
  /^opera:/,
  /^vivaldi:/,
  /^file:/,
  /^data:/,
  /^blob:/,
  /^javascript:/
];

const TRUSTED_DOMAINS = new Set([
  "google.com", "www.google.com", "google.co.uk", "google.ca",
  "youtube.com", "www.youtube.com",
  "github.com", "www.github.com",
  "stackoverflow.com", "www.stackoverflow.com",
  "wikipedia.org", "en.wikipedia.org",
  "reddit.com", "www.reddit.com",
  "amazon.com", "www.amazon.com",
  "microsoft.com", "www.microsoft.com",
  "apple.com", "www.apple.com",
  "facebook.com", "www.facebook.com",
  "twitter.com", "www.twitter.com", "x.com",
  "linkedin.com", "www.linkedin.com",
  "instagram.com", "www.instagram.com",
  "netflix.com", "www.netflix.com",
  "getcyberright.com", "www.getcyberright.com",
  "replit.com", "www.replit.com"
]);

const SUSPICIOUS_KEYWORDS = [
  "login", "verify", "secure", "account", "update", "confirm",
  "signin", "sign-in", "banking", "password", "credential",
  "wallet", "suspend", "unlock", "restore", "validate"
];

export function shouldSkipUrl(url) {
  if (!url) return true;
  return SKIP_SCAN_PATTERNS.some(p => p.test(url));
}

export function isTrustedDomain(url) {
  try {
    const hostname = new URL(url).hostname;
    if (TRUSTED_DOMAINS.has(hostname)) return true;
    const parts = hostname.split(".");
    if (parts.length > 2) {
      const rootDomain = parts.slice(-2).join(".");
      if (TRUSTED_DOMAINS.has(rootDomain)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function isSuspiciousURL(url) {
  if (!url) return { suspicious: false, score: 0, reasons: [] };
  try {
    const parsed = new URL(url);
    const reasons = [];
    let score = 0;

    if (parsed.protocol !== "https:") {
      reasons.push("Non-HTTPS connection");
      score += 30;
    }

    const fullUrl = parsed.hostname + parsed.pathname;
    for (const keyword of SUSPICIOUS_KEYWORDS) {
      if (fullUrl.toLowerCase().includes(keyword) && !isTrustedDomain(url)) {
        reasons.push(`Contains suspicious keyword: "${keyword}"`);
        score += 15;
        break;
      }
    }

    const hostname = parsed.hostname;
    if (hostname.split(".").length > 4) {
      reasons.push("Excessive subdomains");
      score += 20;
    }

    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(hostname)) {
      reasons.push("IP address used instead of domain");
      score += 25;
    }

    if (hostname.length > 50) {
      reasons.push("Unusually long domain name");
      score += 10;
    }

    const dashCount = hostname.split("-").length - 1;
    if (dashCount > 3) {
      reasons.push("Excessive hyphens in domain");
      score += 15;
    }

    return {
      suspicious: score > 0,
      score: Math.min(score, 100),
      reasons,
      riskLevel: calculateRiskLevel(score)
    };
  } catch {
    return { suspicious: false, score: 0, reasons: ["Invalid URL"] };
  }
}

export function calculateRiskLevel(score) {
  if (score >= 70) return "critical";
  if (score >= 50) return "high";
  if (score >= 30) return "medium";
  if (score >= 10) return "low";
  return "safe";
}

export async function hashDomain(domain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(domain.toLowerCase().replace(/^www\./, ""));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}
