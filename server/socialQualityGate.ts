import { storage } from "./storage";
import { validatePostContent } from "./socialPostPolicy";
import { stripCitationReceipt } from "./socialCitationReceipt";

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

  // Hard gate against empty posts: the citation receipt alone can push total
  // length over minChars while the actual body is blank. Strip the receipt and
  // require a real body for EVERY platform (alerts included).
  const body = stripCitationReceipt(post.postContent || "").trim();
  const minBody = post.platform === "alert" ? 20 : 40;
  if (body.length < minBody) {
    return `Quality gate: post body is empty or too short (${body.length} chars excluding the citation receipt, need at least ${minBody}). Refusing to publish a blank post.`;
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
