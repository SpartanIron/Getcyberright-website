import crypto from "crypto";
import { db } from "./db";
import { and, eq, gt, inArray, isNull } from "drizzle-orm";
import { socialPosts, users } from "@shared/schema";
import type { SocialPost } from "@shared/schema";
import { storage } from "./storage";
import { sendEmail, isEmailConfigured } from "./email-service";
import { logger } from "./logger";

const log = logger.child("SocialReviewNotifier");

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getSigningSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is required to sign social review action tokens");
  }
  return secret;
}

function base64UrlEncode(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(str: string): Buffer {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export type ReviewAction = "approve" | "reject";

export function signReviewActionToken(postId: string, action: ReviewAction, ttlMs = TOKEN_TTL_MS): string {
  const exp = Date.now() + ttlMs;
  const payload = { postId, action, exp };
  const payloadB64 = base64UrlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = crypto.createHmac("sha256", getSigningSecret()).update(payloadB64).digest();
  return `${payloadB64}.${base64UrlEncode(sig)}`;
}

export interface VerifiedReviewAction {
  postId: string;
  action: ReviewAction;
  exp: number;
}

export function verifyReviewActionToken(token: string): VerifiedReviewAction | null {
  try {
    const [payloadB64, sigB64] = token.split(".");
    if (!payloadB64 || !sigB64) return null;
    const expectedSig = crypto.createHmac("sha256", getSigningSecret()).update(payloadB64).digest();
    const providedSig = base64UrlDecode(sigB64);
    if (expectedSig.length !== providedSig.length) return null;
    if (!crypto.timingSafeEqual(expectedSig, providedSig)) return null;
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString("utf8"));
    if (typeof payload?.postId !== "string") return null;
    if (payload.action !== "approve" && payload.action !== "reject") return null;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return { postId: payload.postId, action: payload.action, exp: payload.exp };
  } catch {
    return null;
  }
}

async function getAdminRecipients(): Promise<string[]> {
  const recipients = new Set<string>();
  try {
    const rows = await db
      .select({ email: users.email, isAdmin: users.isAdmin, role: users.role })
      .from(users);
    for (const r of rows) {
      if (!r.email) continue;
      if (r.isAdmin || r.role === "admin" || r.role === "super_admin") {
        recipients.add(r.email.toLowerCase());
      }
    }
  } catch (err: any) {
    log.error("Failed to load admin users", { error: err?.message });
  }
  const fallback = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  if (fallback) recipients.add(fallback.toLowerCase());
  return Array.from(recipients);
}

function getPublicBaseUrl(): string {
  return (
    process.env.PUBLIC_BASE_URL ||
    process.env.APP_BASE_URL ||
    "https://www.getcyberright.com"
  ).replace(/\/+$/, "");
}

function escapeHtml(str: string): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPostBlockHtml(post: SocialPost, baseUrl: string): string {
  const approveUrl = `${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(post.id, "approve")}`;
  const rejectUrl = `${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(post.id, "reject")}`;
  const citations = Array.isArray(post.citations) ? (post.citations as Array<{ name?: string; publisher?: string; url?: string }>) : [];
  const citationsHtml = citations.length
    ? `<ul style="padding-left: 18px; margin: 8px 0; color: #475569; font-size: 13px;">${citations
        .map((c) => {
          const label = escapeHtml(c?.name || c?.publisher || c?.url || "source");
          const url = c?.url ? escapeHtml(c.url) : "";
          return url
            ? `<li><a href="${url}" style="color:#0d9488;">${label}</a>${c?.publisher ? ` <span style="color:#64748b;">(${escapeHtml(c.publisher)})</span>` : ""}</li>`
            : `<li>${label}</li>`;
        })
        .join("")}</ul>`
    : `<p style="margin:8px 0; color:#64748b; font-size:13px;"><em>No citations attached</em></p>`;

  const expiresLine = post.reviewExpiresAt
    ? `<p style="margin:4px 0; color:#b45309; font-size:13px;">⏱ Review window expires ${escapeHtml(new Date(post.reviewExpiresAt).toUTCString())}</p>`
    : "";

  return `
    <div style="border:1px solid #e2e8f0; border-radius:10px; padding:18px; margin-bottom:16px; background:#ffffff;">
      <div style="font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:6px;">
        ${escapeHtml(post.platform)} · ${escapeHtml(post.contentType)}
      </div>
      <h3 style="margin:0 0 10px; color:#0f172a; font-size:17px;">${escapeHtml(post.contentTitle)}</h3>
      ${expiresLine}
      <pre style="white-space:pre-wrap; font-family:inherit; background:#f8fafc; border-radius:6px; padding:12px; color:#0f172a; font-size:14px; line-height:1.55; margin:10px 0;">${escapeHtml(post.postContent)}</pre>
      <div>
        <strong style="font-size:13px; color:#334155;">Citations</strong>
        ${citationsHtml}
      </div>
      <div style="margin-top:14px;">
        <a href="${approveUrl}" style="display:inline-block; background:#0d9488; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:6px; font-weight:600; font-size:14px; margin-right:8px;">Approve &amp; publish</a>
        <a href="${rejectUrl}" style="display:inline-block; background:#dc2626; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:6px; font-weight:600; font-size:14px;">Reject</a>
      </div>
    </div>
  `;
}

function buildDigestEmail(posts: SocialPost[]): { subject: string; htmlBody: string; textBody: string } {
  const baseUrl = getPublicBaseUrl();
  const postBlocks = posts.map((p) => buildPostBlockHtml(p, baseUrl)).join("");
  const subject = `[GCR] ${posts.length} reactive post${posts.length === 1 ? "" : "s"} awaiting approval`;
  const htmlBody = `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f1f5f9; margin:0; padding:24px;">
      <div style="max-width:680px; margin:0 auto;">
        <h1 style="color:#0f172a; font-size:22px; margin:0 0 6px;">Reactive posts need your review</h1>
        <p style="color:#475569; margin:0 0 18px; font-size:14px;">${posts.length} post${posts.length === 1 ? "" : "s"} entered the 60-minute review window. Approve or reject below — the buttons are signed and tied to each post.</p>
        ${postBlocks}
        <p style="color:#94a3b8; font-size:12px; margin-top:18px;">Links expire in 24 hours. Posts auto-discard if the review window lapses.</p>
      </div>
    </body></html>
  `;
  const textBody = posts
    .map(
      (p) =>
        `[${p.platform} · ${p.contentType}] ${p.contentTitle}\n${p.postContent}\nApprove: ${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(
          p.id,
          "approve",
        )}\nReject: ${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(p.id, "reject")}`,
    )
    .join("\n\n---\n\n");
  return { subject, htmlBody, textBody };
}

async function markPostsNotified(ids: string[], at: Date): Promise<boolean> {
  if (ids.length === 0) return true;
  try {
    await db.update(socialPosts).set({ notifiedAt: at }).where(inArray(socialPosts.id, ids));
    return true;
  } catch (err: any) {
    log.error("Failed to persist notifiedAt", { error: err?.message, count: ids.length });
    return false;
  }
}

export async function notifyPendingReviewQueue(): Promise<{ notified: number; recipients: number }> {
  const now = new Date();
  let fresh: SocialPost[] = [];
  try {
    fresh = await db
      .select()
      .from(socialPosts)
      .where(
        and(
          eq(socialPosts.status, "review_pending"),
          gt(socialPosts.reviewExpiresAt, now),
          isNull(socialPosts.notifiedAt),
        ),
      );
  } catch (err: any) {
    log.error("Failed to query review_pending posts", { error: err?.message });
    return { notified: 0, recipients: 0 };
  }

  if (fresh.length === 0) {
    return { notified: 0, recipients: 0 };
  }

  const recipients = await getAdminRecipients();
  if (recipients.length === 0) {
    log.warn("No admin recipients configured for review notification", { pending: fresh.length });
    return { notified: 0, recipients: 0 };
  }

  const { subject, htmlBody, textBody } = buildDigestEmail(fresh);
  const ok = await sendEmail({ to: recipients, subject, htmlBody, textBody });
  if (!ok) {
    log.error("Email provider rejected review digest", { posts: fresh.length });
    return { notified: 0, recipients: recipients.length };
  }

  const persisted = await markPostsNotified(fresh.map((p) => p.id), now);
  log.info("Sent review digest", {
    posts: fresh.length,
    recipients: recipients.length,
    emailConfigured: isEmailConfigured(),
    notifiedAtPersisted: persisted,
  });
  return { notified: persisted ? fresh.length : 0, recipients: recipients.length };
}

export interface ReviewActionResult {
  ok: boolean;
  status: number;
  message: string;
  detail?: string;
}

export async function executeReviewAction(postId: string, action: ReviewAction): Promise<ReviewActionResult> {
  const post = await storage.getSocialPostById(postId);
  if (!post) return { ok: false, status: 404, message: "Post not found" };

  if (action === "reject") {
    if (post.status !== "review_pending") {
      return { ok: false, status: 400, message: `Post is ${post.status}, no longer awaiting review` };
    }
    await storage.updateSocialPost(postId, {
      status: "discarded",
      auditVerdict: "rejected_by_admin",
      publishError: "Rejected via signed email link",
    });
    return { ok: true, status: 200, message: "Post rejected" };
  }

  if (post.status !== "review_pending") {
    return { ok: false, status: 400, message: `Post is ${post.status}, no longer awaiting review` };
  }

  try {
    const { runSocialQualityGate } = await import("./socialQualityGate");
    const { auditPostContent } = await import("./socialClaimAuditor");
    const { stripCitationReceipt } = await import("./socialCitationReceipt");
    const { buildGuideBundle, buildAlertBundle, buildScamBundle } = await import("./socialSourceBundle");
    type SourceBundleT = import("./socialSourceBundle").SourceBundle;
    type CitationT = import("./scamIntelAggregator").Citation;

    let bundle: SourceBundleT | null = null;
    if (post.contentType === "guide" && post.contentId) {
      const g = await storage.getGuideById(post.contentId);
      if (g) bundle = buildGuideBundle(g);
    } else if (post.contentType === "threat_alert" && post.contentId) {
      const a = await storage.getThreatAlertById(post.contentId);
      if (a) bundle = buildAlertBundle(a);
    } else if (post.contentType === "scam_intel" && post.contentId) {
      const s = await storage.getScamIntelById(post.contentId);
      if (s) bundle = buildScamBundle(s);
    } else if (post.contentType === "trend_insight") {
      const storedCitations = (post.citations || []) as CitationT[];
      const storedClaims = (post.extractedClaims || []) as { text?: string; context?: string }[];
      const allowedClaims = storedClaims.map((c) => String(c?.text ?? "").trim()).filter(Boolean);
      const contextForLLM = storedClaims
        .map((c) => String(c?.context ?? "").trim())
        .filter(Boolean)
        .join(" ");
      if (storedCitations.length > 0) {
        bundle = {
          recordId: post.contentId || post.id,
          recordType: "trend_insight",
          title: post.contentTitle,
          canonicalUrl: storedCitations[0]?.url || "",
          category: "trend",
          citations: storedCitations,
          allowedClaims,
          contextForLLM,
        };
      }
    }

    if (!bundle) {
      await storage.updateSocialPost(postId, {
        status: "blocked",
        auditVerdict: "fail_on_approval",
        publishError: "No auditable source bundle at approval time",
      });
      return { ok: false, status: 400, message: "Cannot approve: no auditable source bundle" };
    }

    const audit = auditPostContent(stripCitationReceipt(post.postContent), bundle);
    if (audit.verdict !== "pass") {
      await storage.updateSocialPost(postId, {
        status: "blocked",
        auditVerdict: "fail_on_approval",
        auditFailures: audit.failures.map((f) => `${f.kind}: ${f.reason}`),
        publishError: "Re-audit failed at approval time",
      });
      return { ok: false, status: 400, message: "Re-audit failed at approval time. Post blocked." };
    }

    const gateError = await runSocialQualityGate({
      platform: post.platform,
      postContent: post.postContent,
      contentType: post.contentType,
      contentId: post.contentId,
    });
    if (gateError) {
      return { ok: false, status: 400, message: gateError };
    }

    await storage.updateSocialPost(postId, { status: "draft", auditVerdict: "approved_by_admin" });
    const { publishPost } = await import("./socialPublisher");
    const result = await publishPost(postId);
    if (result.success) {
      return { ok: true, status: 200, message: `Approved and published to ${result.platform || post.platform}` };
    }
    return { ok: false, status: 400, message: `Approved but publish failed: ${result.error || "unknown"}` };
  } catch (err: any) {
    log.error("executeReviewAction failed", { error: err?.message, postId });
    return { ok: false, status: 500, message: err?.message || "Failed to process action" };
  }
}
