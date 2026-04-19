import { storage } from "./storage";
import { validatePostContent } from "./socialPostPolicy";

export interface QualityGateInput {
  platform: string;
  postContent: string;
  contentType?: string | null;
  contentId?: string | null;
  auditFailures?: unknown;
}

export async function runSocialQualityGate(post: QualityGateInput): Promise<string | null> {
  // Hard gate: never publish a post that was flagged at generation time for
  // naming a specific external learning resource without a real URL. The
  // admin must edit a real external link into the body before this can ship.
  const failures = Array.isArray(post.auditFailures) ? (post.auditFailures as Array<{ kind?: string }>) : [];
  if (failures.some((f) => f && f.kind === "link_mismatch")) {
    const hasExternalLink = /https?:\/\/(?!(?:www\.)?getcyberright\.com)[^\s)\]"',]+/i.test(post.postContent || "");
    if (!hasExternalLink) {
      return "Quality gate: post names a specific external learning resource but no external URL is present. Add the real resource link before publishing.";
    }
  }

  let canonicalUrl = "";
  try {
    if (post.contentType === "guide" && post.contentId) {
      const guide = await storage.getGuideById(post.contentId);
      if (!guide || guide.status !== "published") {
        return `Source guide is missing or unpublished (id=${post.contentId}). Refusing to publish a link that would 404.`;
      }
      canonicalUrl = `https://www.getcyberright.com/guides/${guide.slug}`;
    } else if (post.contentType === "threat_alert" && post.contentId) {
      const alert = await storage.getThreatAlertById(post.contentId);
      if (!alert || alert.status !== "published") {
        return `Source threat alert is missing or unpublished (id=${post.contentId}). Refusing to publish a link that would 404.`;
      }
      canonicalUrl = `https://www.getcyberright.com/alerts/${alert.slug}`;
    } else if (post.contentType === "scam_intel" && post.contentId) {
      const scam = await storage.getScamIntelById(post.contentId);
      if (!scam || scam.status !== "published") {
        return `Source scam intel record is missing or unpublished (id=${post.contentId}). Refusing to publish a link that would 404.`;
      }
      canonicalUrl = `https://www.getcyberright.com/scam-intel/${scam.slug}`;
    }
  } catch (err: any) {
    console.warn(`[QualityGate] source lookup failed: ${err.message}`);
  }

  const requireCanonical = post.platform !== "instagram" && !!canonicalUrl;
  const validation = validatePostContent(post.postContent, canonicalUrl, {
    requireCanonical,
    minChars: post.platform === "alert" ? 40 : 80,
  });
  if (!validation.ok) {
    return `Quality gate: ${validation.issues.map((i) => i.message).join(" ")}`;
  }
  return null;
}
