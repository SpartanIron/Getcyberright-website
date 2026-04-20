import crypto from "crypto";
import { db } from "./db";
import { and, eq, gt, inArray, isNull } from "drizzle-orm";
import { socialPosts, users, adminNotificationSettings } from "@shared/schema";
import type { SocialPost } from "@shared/schema";
import {
  URGENT_REVIEW_WINDOW_MS,
  normalizeReviewQueueNotifyMode,
  type ReviewQueueNotifyMode,
} from "@shared/models/auth";
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

interface AdminRecipient {
  email: string;
  mode: ReviewQueueNotifyMode;
}

async function getAdminRecipients(): Promise<AdminRecipient[]> {
  const byEmail = new Map<string, AdminRecipient>();
  try {
    const rows = await db
      .select({
        email: users.email,
        isAdmin: users.isAdmin,
        role: users.role,
        notifyReviewQueueEmail: users.notifyReviewQueueEmail,
        reviewQueueNotifyMode: users.reviewQueueNotifyMode,
      })
      .from(users);
    for (const r of rows) {
      if (!r.email) continue;
      if (!(r.isAdmin || r.role === "admin" || r.role === "super_admin")) continue;
      // Honor legacy boolean opt-out as "mute"
      const legacyMute = r.notifyReviewQueueEmail === false;
      const mode = legacyMute ? "mute" : normalizeReviewQueueNotifyMode(r.reviewQueueNotifyMode);
      if (mode === "mute") continue;
      byEmail.set(r.email.toLowerCase(), { email: r.email.toLowerCase(), mode });
    }
  } catch (err: any) {
    log.error("Failed to load admin users", { error: err?.message });
  }
  const fallback = process.env.ADMIN_NOTIFY_EMAIL || process.env.ADMIN_EMAIL;
  if (fallback) {
    const key = fallback.toLowerCase();
    if (!byEmail.has(key)) byEmail.set(key, { email: key, mode: "all" });
  }
  return Array.from(byEmail.values());
}

function isUrgentPost(post: SocialPost, now: Date): boolean {
  if (!post.reviewExpiresAt) return false;
  const expires = new Date(post.reviewExpiresAt).getTime();
  return expires - now.getTime() <= URGENT_REVIEW_WINDOW_MS;
}

function postsForRecipient(
  posts: SocialPost[],
  mode: ReviewQueueNotifyMode,
  now: Date,
): SocialPost[] {
  if (mode === "mute") return [];
  if (mode === "urgent") return posts.filter((p) => isUrgentPost(p, now));
  return posts;
}

interface AdminWebhookDestinations {
  slackWebhookUrl?: string | null;
  webhookUrl?: string | null;
}

async function getAdminWebhookDestinations(): Promise<AdminWebhookDestinations> {
  let row: AdminWebhookDestinations | null = null;
  try {
    const rows = await db.select().from(adminNotificationSettings).limit(1);
    if (rows[0]) {
      row = { slackWebhookUrl: rows[0].slackWebhookUrl, webhookUrl: rows[0].webhookUrl };
    }
  } catch (err: any) {
    log.error("Failed to load admin notification settings", { error: err?.message });
  }
  return {
    slackWebhookUrl: row?.slackWebhookUrl || process.env.REVIEW_NOTIFY_SLACK_WEBHOOK || null,
    webhookUrl: row?.webhookUrl || process.env.REVIEW_NOTIFY_WEBHOOK || null,
  };
}

function buildSlackPayload(posts: SocialPost[], baseUrl: string): Record<string, unknown> {
  const lines = posts.map((p) => {
    const approveUrl = `${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(p.id, "approve")}`;
    const rejectUrl = `${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(p.id, "reject")}`;
    return `• *[${p.platform} · ${p.contentType}]* ${p.contentTitle}\n   <${approveUrl}|Approve> | <${rejectUrl}|Reject>`;
  });
  return {
    text: `${posts.length} reactive post${posts.length === 1 ? "" : "s"} awaiting approval`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*GCR review queue:* ${posts.length} post${posts.length === 1 ? "" : "s"} need approval\n${lines.join("\n")}`,
        },
      },
    ],
  };
}

async function postJson(url: string, payload: unknown): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      log.warn("Webhook returned non-OK status", { url, status: res.status });
      return false;
    }
    return true;
  } catch (err: any) {
    log.error("Webhook delivery failed", { url, error: err?.message });
    return false;
  }
}

async function deliverWebhookNotifications(posts: SocialPost[]): Promise<{ slack: boolean; webhook: boolean }> {
  const dests = await getAdminWebhookDestinations();
  const baseUrl = getPublicBaseUrl();
  const result = { slack: false, webhook: false };

  if (dests.slackWebhookUrl) {
    result.slack = await postJson(dests.slackWebhookUrl, buildSlackPayload(posts, baseUrl));
  }
  if (dests.webhookUrl) {
    const payload = {
      type: "review_queue_digest",
      count: posts.length,
      posts: posts.map((p) => ({
        id: p.id,
        platform: p.platform,
        contentType: p.contentType,
        contentTitle: p.contentTitle,
        reviewExpiresAt: p.reviewExpiresAt,
        approveUrl: `${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(p.id, "approve")}`,
        rejectUrl: `${baseUrl}/api/social-posts/review-action?token=${signReviewActionToken(p.id, "reject")}`,
      })),
    };
    result.webhook = await postJson(dests.webhookUrl, payload);
  }
  return result;
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
  const dests = await getAdminWebhookDestinations();
  const hasWebhookDestination = Boolean(dests.slackWebhookUrl || dests.webhookUrl);

  if (recipients.length === 0 && !hasWebhookDestination) {
    log.warn("No admin recipients or webhooks configured for review notification", { pending: fresh.length });
    return { notified: 0, recipients: 0 };
  }

  // Group recipients by which posts they should see (so urgent-only admins
  // don't get the full digest).
  const groups = new Map<string, { posts: SocialPost[]; emails: string[] }>();
  for (const r of recipients) {
    const visiblePosts = postsForRecipient(fresh, r.mode, now);
    if (visiblePosts.length === 0) continue;
    const key = visiblePosts.map((p) => p.id).sort().join("|");
    const bucket = groups.get(key) || { posts: visiblePosts, emails: [] };
    bucket.emails.push(r.email);
    groups.set(key, bucket);
  }

  const deliveredPostIds = new Set<string>();
  for (const bucket of Array.from(groups.values())) {
    const { subject, htmlBody, textBody } = buildDigestEmail(bucket.posts);
    const ok = await sendEmail({ to: bucket.emails, subject, htmlBody, textBody });
    if (ok) {
      bucket.posts.forEach((p) => deliveredPostIds.add(p.id));
    } else {
      log.error("Email provider rejected review digest", {
        posts: bucket.posts.length,
        recipients: bucket.emails.length,
      });
    }
  }

  const webhookResults = hasWebhookDestination
    ? await deliverWebhookNotifications(fresh)
    : { slack: false, webhook: false };
  if (webhookResults.slack || webhookResults.webhook) {
    fresh.forEach((p) => deliveredPostIds.add(p.id));
  }

  if (deliveredPostIds.size === 0) {
    return { notified: 0, recipients: recipients.length };
  }

  const persisted = await markPostsNotified(Array.from(deliveredPostIds), now);
  log.info("Sent review digest", {
    posts: fresh.length,
    recipients: recipients.length,
    emailConfigured: isEmailConfigured(),
    slackDelivered: webhookResults.slack,
    webhookDelivered: webhookResults.webhook,
    notifiedAtPersisted: persisted,
  });
  return { notified: persisted ? deliveredPostIds.size : 0, recipients: recipients.length };
}

export async function resendReviewDigest(
  postIds?: string[],
): Promise<{ cleared: number; notified: number; recipients: number }> {
  const now = new Date();
  let cleared = 0;
  try {
    const conditions = [
      eq(socialPosts.status, "review_pending"),
      gt(socialPosts.reviewExpiresAt, now),
    ];
    if (postIds && postIds.length > 0) {
      conditions.push(inArray(socialPosts.id, postIds));
    }
    const result = await db
      .update(socialPosts)
      .set({ notifiedAt: null })
      .where(and(...conditions))
      .returning({ id: socialPosts.id });
    cleared = result.length;
  } catch (err: any) {
    log.error("Failed to clear notifiedAt for resend", { error: err?.message });
    return { cleared: 0, notified: 0, recipients: 0 };
  }

  if (cleared === 0) {
    return { cleared: 0, notified: 0, recipients: 0 };
  }

  const { notified, recipients } = await notifyPendingReviewQueue();
  return { cleared, notified, recipients };
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
