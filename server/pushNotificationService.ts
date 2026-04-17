import webpush from "web-push";
import { db } from "./db";
import { pushSubscriptions } from "@shared/schema";
import { eq, and, isNull, or, lt, sql } from "drizzle-orm";
import { getGlobeData } from "./scamIntelAggregator";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:alerts@getcyberright.com";

let configured = false;
export function isPushConfigured(): boolean {
  return configured;
}

export function getVapidPublicKey(): string | null {
  return configured ? VAPID_PUBLIC_KEY : null;
}

export function initPushNotifications(): void {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log("[push] VAPID keys not configured. Push notifications disabled. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to enable.");
    return;
  }
  try {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
    configured = true;
    console.log("[push] Push notifications initialized.");
  } catch (e: any) {
    console.error("[push] Failed to init VAPID:", e?.message);
  }
}

const SEVERITY_RANK: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  countryCode?: string;
  severity: "critical" | "high" | "medium" | "low";
  tag?: string;
}

export async function broadcastPush(payload: PushPayload): Promise<{ sent: number; removed: number }> {
  if (!configured) return { sent: 0, removed: 0 };
  const minRank = SEVERITY_RANK[payload.severity] || 0;
  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.active, true));
  let sent = 0, removed = 0;
  await Promise.all(subs.map(async (sub) => {
    const subRank = SEVERITY_RANK[sub.severityMin] || 0;
    if (subRank > minRank) return;
    if (sub.countryCode && payload.countryCode && sub.countryCode !== payload.countryCode) return;
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload),
      );
      sent++;
      await db.update(pushSubscriptions).set({ lastNotifiedAt: new Date() }).where(eq(pushSubscriptions.id, sub.id));
    } catch (err: any) {
      const code = err?.statusCode;
      if (code === 410 || code === 404) {
        await db.update(pushSubscriptions).set({ active: false }).where(eq(pushSubscriptions.id, sub.id));
        removed++;
      } else {
        console.warn("[push] Send failed:", code, err?.message);
      }
    }
  }));
  return { sent, removed };
}

const lastBroadcastByCountry: Map<string, number> = new Map();
const BROADCAST_COOLDOWN_MS = 6 * 60 * 60 * 1000;

export async function checkAndBroadcastCriticalAlerts(): Promise<void> {
  if (!configured) return;
  const data = getGlobeData();
  const now = Date.now();
  for (const h of data.hotspots) {
    if (h.riskLevel !== "critical") continue;
    if (h.trendDirection !== "up" || h.trendPercent < 25) continue;
    const last = lastBroadcastByCountry.get(h.countryCode) || 0;
    if (now - last < BROADCAST_COOLDOWN_MS) continue;
    const top = (h.topScamTypes[0] || "scam").replace(/-/g, " ");
    const result = await broadcastPush({
      title: `Critical alert: ${h.country}`,
      body: `${h.recentIncidents.toLocaleString()} reports this week, up ${h.trendPercent}%. Top: ${top}.`,
      url: `/scam-intelligence?country=${h.countryCode}`,
      countryCode: h.countryCode,
      severity: "critical",
      tag: `gcr-${h.countryCode}`,
    });
    if (result.sent > 0) {
      lastBroadcastByCountry.set(h.countryCode, now);
      console.log(`[push] Broadcast critical alert for ${h.country}: ${result.sent} sent, ${result.removed} pruned.`);
    }
  }
}

export function startPushScheduler(): void {
  initPushNotifications();
  if (!configured) return;
  setInterval(() => {
    checkAndBroadcastCriticalAlerts().catch(e => console.error("[push] Scheduler error:", e?.message));
  }, 60 * 60 * 1000);
  console.log("[push] Push broadcast scheduler started (hourly).");
}
