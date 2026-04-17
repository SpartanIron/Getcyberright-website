import crypto from "crypto";
import { db } from "./db";
import { scamAlertSubscriptions } from "@shared/schema";
import { eq, and, or, isNull, lt, sql } from "drizzle-orm";
import { sendEmail } from "./email-service";
import { getGlobeData, getLiveFeed } from "./scamIntelAggregator";

const APP_BASE_URL = process.env.APP_BASE_URL || "https://www.getcyberright.com";
const SEVERITY_RANK: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

function makeToken(): string {
  return crypto.randomBytes(24).toString("hex");
}

export async function subscribeToScamAlerts(input: {
  email: string;
  countryCode?: string;
  scamType?: string;
  severityMin?: "critical" | "high" | "medium" | "low";
  frequency?: "instant" | "daily" | "weekly";
}): Promise<{ id: string; verifyToken: string; alreadyVerified: boolean }> {
  const email = input.email.trim().toLowerCase();
  const verifyToken = makeToken();
  const unsubscribeToken = makeToken();
  const existing = await db.select().from(scamAlertSubscriptions)
    .where(and(
      eq(scamAlertSubscriptions.email, email),
      input.countryCode ? eq(scamAlertSubscriptions.countryCode, input.countryCode) : isNull(scamAlertSubscriptions.countryCode),
      input.scamType ? eq(scamAlertSubscriptions.scamType, input.scamType) : isNull(scamAlertSubscriptions.scamType),
    )).limit(1);
  if (existing[0]) {
    if (!existing[0].verified) {
      await db.update(scamAlertSubscriptions)
        .set({ verifyToken })
        .where(eq(scamAlertSubscriptions.id, existing[0].id));
      await sendVerificationEmail(email, verifyToken, input.countryCode || null);
      return { id: existing[0].id, verifyToken, alreadyVerified: false };
    }
    return { id: existing[0].id, verifyToken: existing[0].verifyToken, alreadyVerified: true };
  }
  const [row] = await db.insert(scamAlertSubscriptions).values({
    email,
    countryCode: input.countryCode || null,
    scamType: input.scamType || null,
    severityMin: input.severityMin || "high",
    frequency: input.frequency || "daily",
    verifyToken,
    unsubscribeToken,
  }).returning();
  await sendVerificationEmail(email, verifyToken, input.countryCode || null);
  return { id: row.id, verifyToken, alreadyVerified: false };
}

async function sendVerificationEmail(email: string, token: string, countryCode: string | null) {
  const verifyUrl = `${APP_BASE_URL}/api/scam-intelligence/alerts/verify?token=${token}`;
  const region = countryCode ? ` for ${countryCode.toUpperCase()}` : "";
  await sendEmail({
    to: [email],
    subject: "Confirm your GetCyberRight scam alerts",
    textBody: `Confirm your subscription to scam alerts${region}: ${verifyUrl}`,
    htmlBody: `
<div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#0f172a">
  <h2 style="margin:0 0 12px">Confirm your scam alerts${region}</h2>
  <p style="line-height:1.55">You asked GetCyberRight to email you when new high-severity scam activity is detected${region}. Click below to confirm.</p>
  <p style="margin:24px 0"><a href="${verifyUrl}" style="background:#06b6d4;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600">Confirm subscription</a></p>
  <p style="font-size:12px;color:#64748b">If you didn't request this, you can ignore this email.</p>
</div>`.trim(),
  }).catch(e => console.warn("[scam-alerts] verify email failed:", e?.message));
}

export async function verifyScamAlertSubscription(token: string): Promise<boolean> {
  const [row] = await db.select().from(scamAlertSubscriptions).where(eq(scamAlertSubscriptions.verifyToken, token)).limit(1);
  if (!row) return false;
  await db.update(scamAlertSubscriptions).set({ verified: true }).where(eq(scamAlertSubscriptions.id, row.id));
  return true;
}

export async function unsubscribeScamAlerts(token: string): Promise<boolean> {
  const result = await db.delete(scamAlertSubscriptions).where(eq(scamAlertSubscriptions.unsubscribeToken, token)).returning();
  return result.length > 0;
}

function dueForSend(sub: { frequency: string; lastSentAt: Date | null }): boolean {
  if (!sub.lastSentAt) return true;
  const elapsed = Date.now() - new Date(sub.lastSentAt).getTime();
  if (sub.frequency === "instant") return elapsed > 30 * 60 * 1000;
  if (sub.frequency === "daily") return elapsed > 23 * 60 * 60 * 1000;
  if (sub.frequency === "weekly") return elapsed > 6.5 * 24 * 60 * 60 * 1000;
  return elapsed > 23 * 60 * 60 * 1000;
}

export async function dispatchAlertDigests(): Promise<{ sent: number }> {
  const subs = await db.select().from(scamAlertSubscriptions).where(eq(scamAlertSubscriptions.verified, true));
  const data = getGlobeData();
  const feed = getLiveFeed();
  let sent = 0;
  for (const sub of subs) {
    if (!dueForSend(sub)) continue;
    const minRank = SEVERITY_RANK[sub.severityMin] || 3;
    let matchedHotspots = data.hotspots.filter(h => SEVERITY_RANK[h.riskLevel] >= minRank);
    if (sub.countryCode) matchedHotspots = matchedHotspots.filter(h => h.countryCode === sub.countryCode);
    if (sub.scamType) matchedHotspots = matchedHotspots.filter(h => h.topScamTypes.includes(sub.scamType!));
    let matchedEvents = feed.events.filter(e => SEVERITY_RANK[e.severity] >= minRank);
    if (sub.countryCode) matchedEvents = matchedEvents.filter(e => !e.country || e.country === sub.countryCode);
    if (sub.scamType) matchedEvents = matchedEvents.filter(e => e.scamCategory === sub.scamType);
    if (matchedHotspots.length === 0 && matchedEvents.length === 0) continue;
    const unsubUrl = `${APP_BASE_URL}/api/scam-intelligence/alerts/unsubscribe?token=${sub.unsubscribeToken}`;
    const filterLabel = [sub.countryCode, sub.scamType].filter(Boolean).join(" / ") || "global";
    const html = renderDigestHtml({ hotspots: matchedHotspots.slice(0, 5), events: matchedEvents.slice(0, 8), unsubUrl, filterLabel });
    try {
      await sendEmail({
        to: [sub.email],
        subject: `GetCyberRight scam alerts (${filterLabel}) - ${matchedHotspots.length} hotspots, ${matchedEvents.length} new`,
        htmlBody: html,
        textBody: `${matchedHotspots.length} hotspots and ${matchedEvents.length} new alerts. View: ${APP_BASE_URL}/scam-intelligence`,
      });
      await db.update(scamAlertSubscriptions).set({ lastSentAt: new Date() }).where(eq(scamAlertSubscriptions.id, sub.id));
      sent++;
    } catch (e: any) {
      console.warn("[scam-alerts] send failed for", sub.email, e?.message);
    }
  }
  if (sent > 0) console.log(`[scam-alerts] Digest dispatch complete: ${sent} emails sent.`);
  return { sent };
}

function renderDigestHtml(args: { hotspots: any[]; events: any[]; unsubUrl: string; filterLabel: string }): string {
  const hot = args.hotspots.map(h => `<li><strong>${h.country}</strong> (${h.riskLevel}) - ${h.recentIncidents.toLocaleString()} reports, top: ${(h.topScamTypes?.[0] || "scam").replace(/-/g, " ")}</li>`).join("");
  const ev = args.events.map(e => `<li><strong>${(e.severity || "").toUpperCase()}</strong>: ${e.title}${e.country ? ` (${e.country})` : ""}</li>`).join("");
  return `
<div style="font-family:system-ui,sans-serif;max-width:620px;margin:0 auto;padding:24px;color:#0f172a">
  <h2 style="margin:0 0 4px">GetCyberRight Scam Alert Digest</h2>
  <p style="margin:0 0 16px;color:#64748b">Filter: ${args.filterLabel}</p>
  ${args.hotspots.length ? `<h3>Top hotspots</h3><ul>${hot}</ul>` : ""}
  ${args.events.length ? `<h3>New incidents</h3><ul>${ev}</ul>` : ""}
  <p style="margin:24px 0 8px"><a href="https://www.getcyberright.com/scam-intelligence" style="background:#06b6d4;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600">View live dashboard</a></p>
  <p style="font-size:11px;color:#94a3b8;margin-top:24px">You are receiving this because you subscribed to GetCyberRight scam alerts. <a href="${args.unsubUrl}" style="color:#94a3b8">Unsubscribe</a>.</p>
</div>`.trim();
}

export function startScamAlertDispatcher(): void {
  setTimeout(() => dispatchAlertDigests().catch(e => console.error("[scam-alerts] dispatch error:", e?.message)), 5 * 60 * 1000);
  setInterval(() => dispatchAlertDigests().catch(e => console.error("[scam-alerts] dispatch error:", e?.message)), 6 * 60 * 60 * 1000);
  console.log("[scam-alerts] Digest dispatcher started (every 6h, frequency-respecting).");
}
