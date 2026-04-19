import { type Express, type Request, type Response } from "express";
import { randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./auth";
import { isAdminMiddleware } from "./admin";

const exportRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Export rate limit exceeded",
    message: "You have reached the hourly export limit (60 per hour). Please try again later or contact press@getcyberright.com for bulk access.",
    retryAfter: "1 hour",
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Export rate limit exceeded",
      message: "You have reached the hourly export limit (60 per hour). Please try again later or contact press@getcyberright.com for bulk access.",
      retryAfter: "1 hour",
    });
  },
});

const embedPingRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const sourcesPingRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const REFERRER_HOST_TO_PLATFORM: Record<string, string> = {
  "linkedin.com": "linkedin",
  "www.linkedin.com": "linkedin",
  "lnkd.in": "linkedin",
  "facebook.com": "facebook",
  "www.facebook.com": "facebook",
  "m.facebook.com": "facebook",
  "l.facebook.com": "facebook",
  "lm.facebook.com": "facebook",
  "fb.me": "facebook",
  "twitter.com": "x",
  "www.twitter.com": "x",
  "x.com": "x",
  "www.x.com": "x",
  "t.co": "x",
  "instagram.com": "instagram",
  "www.instagram.com": "instagram",
  "l.instagram.com": "instagram",
  "t.me": "telegram",
  "www.t.me": "telegram",
  "reddit.com": "reddit",
  "www.reddit.com": "reddit",
  "old.reddit.com": "reddit",
  "out.reddit.com": "reddit",
  "youtube.com": "youtube",
  "www.youtube.com": "youtube",
  "m.youtube.com": "youtube",
  "google.com": "google",
  "www.google.com": "google",
  "news.google.com": "google",
  "bing.com": "bing",
  "www.bing.com": "bing",
  "duckduckgo.com": "duckduckgo",
};

function classifySourcesPlatform(referrerHost: string, hint: string): string {
  const host = referrerHost.toLowerCase();
  if (host && REFERRER_HOST_TO_PLATFORM[host]) return REFERRER_HOST_TO_PLATFORM[host];
  const cleanHint = hint.trim().toLowerCase().slice(0, 50);
  if (cleanHint) return cleanHint.replace(/[^a-z0-9_-]/g, "").slice(0, 50) || "other";
  if (host) return "other";
  return "direct";
}

const EMBED_PING_LOG = path.join(process.cwd(), "data", "embed-pings.jsonl");
function ensureEmbedLogDir() {
  try {
    fs.mkdirSync(path.dirname(EMBED_PING_LOG), { recursive: true });
  } catch {}
}
ensureEmbedLogDir();

const escapeHtml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
import {
  insertCyberSafetyGuideSchema,
  insertScamIntelligenceSchema,
  insertCyberThreatAlertSchema,
  cyberSafetyGuides,
  scamIntelligence,
  cyberThreatAlerts,
} from "@shared/schema";
import {
  generateGuideDraft,
  runContentAutomationBatch,
  getContentAutomationStats,
  getUnusedKeywords,
} from "./contentAutomationService";
import {
  distributeGuideContent,
  distributeThreatAlertContent,
  distributeScamIntelContent,
  getSocialDistributionStats,
} from "./socialDistributionService";
import { publishPost, getConnectedPlatforms, publishAllDrafts } from "./socialPublisher";
import { getBufferStatus, isBufferConfigured } from "./bufferPublisher";
import {
  getLinkedInAuthUrl,
  validateOAuthState,
  exchangeCodeForToken,
  getLinkedInProfile,
  findOrganizationId,
  isLinkedInDirectConfigured,
  publishDirectToLinkedIn,
} from "./linkedinDirectPublisher";
import {
  getFacebookAuthUrl,
  validateFBOAuthState,
  exchangeFBCodeForToken,
  getLongLivedToken,
  getUserPages,
  isFacebookDirectConfigured,
  publishDirectToFacebook,
} from "./facebookDirectPublisher";
import { serveImagePath } from "./socialImageService";
import { getGlobeData, getLiveFeed, getRegionalData } from "./scamIntelAggregator";
import * as fs from "fs";
import * as path from "path";
import {
  scheduleTask,
  processPendingTasks,
  getOrchestratorDashboard,
  setAutoPublish,
  getAutoPublishStatus,
} from "./growthOrchestrator";
import { z } from "zod";

const guideUpdateSchema = insertCyberSafetyGuideSchema.partial();
const scamIntelUpdateSchema = insertScamIntelligenceSchema.partial();
const threatAlertUpdateSchema = insertCyberThreatAlertSchema.partial();

const socialPostUpdateSchema = z.object({
  status: z.enum(["draft", "scheduled", "published", "failed", "review_pending", "rejected"]).optional(),
  scheduledFor: z.string().datetime().nullable().optional(),
  postContent: z.string().min(1).max(5000).optional(),
}).strict();

const scheduleTaskSchema = z.object({
  taskType: z.string().min(1).max(100),
  taskName: z.string().min(1).max(200),
  payload: z.record(z.unknown()).optional(),
  priority: z.number().int().min(0).max(10).optional(),
});

const processTasksSchema = z.object({
  batchSize: z.number().int().min(1).max(20).optional(),
});

export function registerPlatformRoutes(app: Express): void {

  // ─── Public Threat Intelligence Stats ─────────────────────────────

  app.get("/api/threat-stats", async (_req: Request, res: Response) => {
    try {
      const { threatStats, ageGroupStats, regionalAttackTypes } = await import("@shared/schema");
      const stats = await db.select().from(threatStats).orderBy(threatStats.displayOrder);
      const ageGroups = await db.select().from(ageGroupStats).orderBy(ageGroupStats.displayOrder);
      const regions = await db.select().from(regionalAttackTypes).orderBy(regionalAttackTypes.displayOrder);

      if (stats.length === 0) {
        const { insertThreatStatSchema, insertAgeGroupStatSchema, insertRegionalAttackTypeSchema } = await import("@shared/schema");
        await db.insert(threatStats).values([
          { statKey: "global_losses", value: "$16.6B", label: "Global Losses (2024)", description: "Total reported cybercrime losses worldwide", source: "FBI IC3 Report", sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2024_IC3Report.pdf", category: "financial", colorTheme: "teal", displayOrder: 1, reportYear: 2024 },
          { statKey: "most_targeted_age", value: "60+", label: "Age Group Most Targeted", description: "Seniors face the highest financial losses from cybercrime", source: "FBI IC3 Report", sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3Report.pdf", category: "demographics", colorTheme: "amber", displayOrder: 2, reportYear: 2023 },
          { statKey: "youth_harassment", value: "40%", label: "Youth Online Harassment", description: "Percentage of youth ages 10-17 experiencing cyberbullying", source: "Cyberbullying Research Center", sourceUrl: "https://cyberbullying.org/facts", category: "youth", colorTheme: "cyan", displayOrder: 3, reportYear: 2023 },
          { statKey: "mobile_fraud_rise", value: "300%", label: "Mobile Money Fraud Rise", description: "Increase in mobile money fraud in Africa from 2020-2024", source: "INTERPOL Africa", sourceUrl: "https://www.interpol.int/en/Crimes/Cybercrime", category: "africa", colorTheme: "red", displayOrder: 4, reportYear: 2024 },
        ]);
        await db.insert(ageGroupStats).values([
          { ageGroup: "Under 20", percentage: 8, colorClass: "bg-cyan-400", displayOrder: 1, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "20-29", percentage: 15, colorClass: "bg-teal-400", displayOrder: 2, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "30-49", percentage: 35, colorClass: "bg-green-400", displayOrder: 3, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "50-59", percentage: 20, colorClass: "bg-orange-400", displayOrder: 4, source: "FBI Internet Crime Report 2023" },
          { ageGroup: "60+", percentage: 22, colorClass: "bg-amber-400", displayOrder: 5, source: "FBI Internet Crime Report 2023" },
        ]);
        await db.insert(regionalAttackTypes).values([
          { region: "Africa", attackTypes: "Mobile Money Fraud, SIM Swap, WhatsApp Scams", colorClass: "bg-amber-400", displayOrder: 1, source: "INTERPOL Africa Assessment 2024" },
          { region: "North America", attackTypes: "Investment Fraud, BEC, Tech Support Scams", colorClass: "bg-teal-400", displayOrder: 2, source: "FBI IC3 Report 2023" },
          { region: "Europe", attackTypes: "Ransomware, Phishing, Data Breaches", colorClass: "bg-cyan-400", displayOrder: 3, source: "Europol IOCTA 2024" },
          { region: "Asia Pacific", attackTypes: "Romance Scams, E-commerce Fraud, Crypto Scams", colorClass: "bg-purple-400", displayOrder: 4, source: "APAC Cybersecurity Report 2024" },
        ]);
        console.log("[threat-stats] Seeded threat statistics data");
        const newStats = await db.select().from(threatStats).orderBy(threatStats.displayOrder);
        const newAgeGroups = await db.select().from(ageGroupStats).orderBy(ageGroupStats.displayOrder);
        const newRegions = await db.select().from(regionalAttackTypes).orderBy(regionalAttackTypes.displayOrder);
        return res.json({ stats: newStats, ageGroups: newAgeGroups, regions: newRegions });
      }

      res.json({ stats, ageGroups, regions });
    } catch (error: any) {
      console.error("[threat-stats] Error:", error?.message || error);
      res.status(500).json({ error: "Failed to fetch threat statistics" });
    }
  });

  // ─── Public Scam Intelligence Globe API ──────────────────────────────

  app.get(["/api/scam-intelligence/globe-data", "/api/scam-intelligence/globe-data/:range"], (_req: Request, res: Response) => {
    try {
      const data = getGlobeData();
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(data);
    } catch (error: any) {
      console.error("[scam-intel-api] Globe data error:", error?.message);
      res.status(500).json({ error: "Failed to fetch globe data" });
    }
  });

  app.get(["/api/scam-intelligence/live-feed", "/api/scam-intelligence/live-feed/:range"], (req: Request, res: Response) => {
    try {
      const data = getLiveFeed();
      const rangeParam = String(req.params.range || req.query.range || "all").toLowerCase();
      const RANGE_MS: Record<string, number> = {
        "1h": 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      };
      const windowMs = RANGE_MS[rangeParam];
      const filtered = windowMs
        ? {
            ...data,
            events: data.events.filter(e => {
              const t = new Date(e.timestamp).getTime();
              return Number.isFinite(t) && (Date.now() - t) <= windowMs;
            }),
          }
        : data;
      res.setHeader("Cache-Control", "public, max-age=120");
      res.json(filtered);
    } catch (error: any) {
      console.error("[scam-intel-api] Live feed error:", error?.message);
      res.status(500).json({ error: "Failed to fetch live feed" });
    }
  });

  app.get(["/api/scam-intelligence/regional-summary", "/api/scam-intelligence/regional-summary/:range"], (_req: Request, res: Response) => {
    try {
      const data = getRegionalData();
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(data);
    } catch (error: any) {
      console.error("[scam-intel-api] Regional data error:", error?.message);
      res.status(500).json({ error: "Failed to fetch regional data" });
    }
  });

  app.get("/api/scam-intelligence/forecast", async (req: Request, res: Response) => {
    try {
      const { getCountryForecast } = await import("./scamIntelAggregator");
      const country = String(req.query.country || "").toUpperCase();
      if (!country || country.length !== 2) return res.status(400).json({ error: "country (ISO-2) required" });
      const f = getCountryForecast(country);
      if (!f) return res.status(404).json({ error: "country not tracked" });
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json(f);
    } catch (e: any) {
      console.error("[scam-intel-api] Forecast error:", e?.message);
      res.status(500).json({ error: "Failed to fetch forecast" });
    }
  });

  app.get("/api/scam-intelligence/cyber-weather", async (_req: Request, res: Response) => {
    try {
      const { getCyberWeatherSnapshot } = await import("./scamIntelAggregator");
      res.setHeader("Cache-Control", "public, max-age=600");
      res.json(getCyberWeatherSnapshot());
    } catch (e: any) {
      console.error("[scam-intel-api] Cyber weather error:", e?.message);
      res.status(500).json({ error: "Failed to fetch cyber weather" });
    }
  });

  app.get("/api/scam-intelligence/export.json", exportRateLimit, (_req: Request, res: Response) => {
    try {
      const globe = getGlobeData();
      const feed = getLiveFeed();
      const regional = getRegionalData();
      const generationId = randomUUID();
      const ATTRIBUTION = "GetCyberRight";
      const stamp = <T extends object>(o: T) => ({ ...o, _attribution: ATTRIBUTION, _generationId: generationId });
      const payload = {
        dataAsOf: globe.dataAsOf,
        generatedAt: new Date().toISOString(),
        license: "CC BY 4.0 with attribution to GetCyberRight (https://www.getcyberright.com/scam-intelligence)",
        methodologyUrl: "https://www.getcyberright.com/scam-intelligence/methodology",
        attribution: ATTRIBUTION,
        generationId,
        globalStats: stamp(globe.globalStats),
        hotspots: globe.hotspots.map(h => stamp({
          country: h.country,
          countryCode: h.countryCode,
          region: h.region,
          riskLevel: h.riskLevel,
          riskScore: Math.round(h.intensity * 100),
          recentIncidents: h.recentIncidents,
          trendDirection: h.trendDirection,
          trendPercent: h.trendPercent,
          topScamTypes: h.topScamTypes,
          reportContact: h.reportContact,
          citations: h.citations,
        })),
        arcs: globe.arcs.map(a => stamp({
          originCountry: a.originCountry,
          originCountryCode: a.originCountryCode,
          targetCountry: a.targetCountry,
          targetCountryCode: a.targetCountryCode,
          scamType: a.scamType,
          volume: a.volume,
          originCitations: a.originCitations,
        })),
        liveEvents: feed.events.map(e => stamp(e as any)),
        regions: regional.regions.map(r => stamp(r as any)),
      };
      res.setHeader("Cache-Control", "public, max-age=300");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("X-GCR-Generation-Id", generationId);
      res.setHeader("Content-Disposition", `attachment; filename="scam-intelligence-${new Date().toISOString().split("T")[0]}.json"`);
      res.send(JSON.stringify(payload, null, 2));
    } catch (e: any) {
      console.error("[scam-intel-api] Export JSON error:", e?.message);
      res.status(500).json({ error: "Failed to export JSON" });
    }
  });

  app.get("/api/scam-intelligence/export.csv", exportRateLimit, (_req: Request, res: Response) => {
    try {
      const globe = getGlobeData();
      const feed = getLiveFeed();
      const generationId = randomUUID();
      const ATTRIBUTION = "GetCyberRight";
      const esc = (v: any) => {
        if (v === null || v === undefined) return "";
        const s = String(v).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      };
      const lines: string[] = [];
      lines.push(`# GetCyberRight Scam Intelligence Export`);
      lines.push(`# dataAsOf,${esc(globe.dataAsOf)}`);
      lines.push(`# license,CC BY 4.0 with attribution to GetCyberRight`);
      lines.push(`# methodology,https://www.getcyberright.com/scam-intelligence/methodology`);
      lines.push(`# attribution,${ATTRIBUTION}`);
      lines.push(`# generationId,${generationId}`);
      lines.push("");
      lines.push("# HOTSPOTS");
      lines.push(["country","countryCode","region","riskLevel","riskScore","recentIncidents","trendDirection","trendPercent","topScamTypes","primarySource","primarySourceUrl","primarySourceDatePublished","accessedAt","attribution","generationId"].join(","));
      for (const h of globe.hotspots) {
        const c = h.citations[0];
        lines.push([
          esc(h.country), esc(h.countryCode), esc(h.region), esc(h.riskLevel),
          esc(Math.round(h.intensity * 100)), esc(h.recentIncidents),
          esc(h.trendDirection), esc(h.trendPercent),
          esc(h.topScamTypes.join("|")),
          esc(c?.publisher || ""), esc(c?.url || ""), esc(c?.datePublished || ""), esc(c?.accessedAt || ""),
          esc(ATTRIBUTION), esc(generationId),
        ].join(","));
      }
      lines.push("");
      lines.push("# ARCS (cross-border scam flows)");
      lines.push(["originCountry","originCode","targetCountry","targetCode","scamType","volume","originPrimarySource","originPrimarySourceUrl","attribution","generationId"].join(","));
      for (const a of globe.arcs) {
        const c = a.originCitations[0];
        lines.push([
          esc(a.originCountry), esc(a.originCountryCode),
          esc(a.targetCountry), esc(a.targetCountryCode),
          esc(a.scamType), esc(a.volume),
          esc(c?.publisher || ""), esc(c?.url || ""),
          esc(ATTRIBUTION), esc(generationId),
        ].join(","));
      }
      lines.push("");
      lines.push("# LIVE EVENTS");
      lines.push(["timestamp","type","title","severity","region","source","sourceUrl","scamCategory","synthetic","attribution","generationId"].join(","));
      for (const e of feed.events) {
        lines.push([
          esc(e.timestamp), esc(e.type), esc(e.title), esc(e.severity), esc(e.region),
          esc(e.source), esc(e.sourceUrl || ""), esc(e.scamCategory || ""), esc(e.synthetic ? "true" : "false"),
          esc(ATTRIBUTION), esc(generationId),
        ].join(","));
      }
      const csv = lines.join("\n");
      res.setHeader("Cache-Control", "public, max-age=300");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("X-GCR-Generation-Id", generationId);
      res.setHeader("Content-Disposition", `attachment; filename="scam-intelligence-${new Date().toISOString().split("T")[0]}.csv"`);
      res.send(csv);
    } catch (e: any) {
      console.error("[scam-intel-api] Export CSV error:", e?.message);
      res.status(500).json({ error: "Failed to export CSV" });
    }
  });

  app.get("/api/scam-intelligence/source-freshness", async (_req: Request, res: Response) => {
    try {
      const { getFreshnessSnapshot } = await import("./sourceFreshnessMonitor");
      const snap = getFreshnessSnapshot();
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json({
        ...snap,
        notice: "Daily automated check of every cited publisher URL. 'stale' means the page content hash changed since last verification and the citation should be re-confirmed.",
      });
    } catch (e: any) {
      console.error("[scam-intel-api] source-freshness error:", e?.message);
      res.status(500).json({ error: "Failed to load freshness snapshot" });
    }
  });

  const subscribeRateLimit = new Map<string, number[]>();
  app.get("/api/scam-intelligence/embed/ping", embedPingRateLimit, (req: Request, res: Response) => {
    try {
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      const referer = (req.get("referer") || (req.query.ref as string) || "").toString().slice(0, 500);
      const userAgent = (req.get("user-agent") || "").toString().slice(0, 300);
      let host = "";
      try { host = referer ? new URL(referer).hostname : ""; } catch {}
      const entry = {
        t: new Date().toISOString(),
        ip,
        host,
        referer,
        userAgent,
        country: (req.query.country as string)?.toString().slice(0, 8) || null,
      };
      console.log(`[embed-ping] ${JSON.stringify(entry)}`);
      try {
        fs.appendFileSync(EMBED_PING_LOG, JSON.stringify(entry) + "\n");
      } catch (err: any) {
        console.warn("[embed-ping] log write failed:", err?.message);
      }
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.status(204).end();
    } catch (e: any) {
      console.error("[embed-ping] error:", e?.message);
      res.status(204).end();
    }
  });

  app.post("/api/scam-intelligence/alerts/subscribe", async (req: Request, res: Response) => {
    try {
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      const emailKey = (req.body?.email || "").toString().trim().toLowerCase();
      const now = Date.now();
      const windowMs = 60 * 60 * 1000;
      const maxPerHour = 5;
      for (const key of [`ip:${ip}`, `email:${emailKey}`]) {
        if (!key.endsWith(":")) {
          const arr = (subscribeRateLimit.get(key) || []).filter(t => now - t < windowMs);
          if (arr.length >= maxPerHour) {
            return res.status(429).json({ error: "Too many subscription attempts. Try again later." });
          }
          arr.push(now);
          subscribeRateLimit.set(key, arr);
        }
      }
      const { subscribeToScamAlerts } = await import("./scamAlertSubscriptionService");
      const { insertScamAlertSubscriptionSchema } = await import("@shared/schema");
      const parsed = insertScamAlertSubscriptionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() });
      const result = await subscribeToScamAlerts({
        email: parsed.data.email,
        countryCode: parsed.data.countryCode || undefined,
        scamType: parsed.data.scamType || undefined,
        severityMin: parsed.data.severityMin,
        frequency: parsed.data.frequency,
      });
      res.json({ ok: true, alreadyVerified: result.alreadyVerified, message: result.alreadyVerified ? "You're already subscribed." : "Check your email to confirm." });
    } catch (e: any) {
      console.error("[scam-alerts] subscribe error:", e?.message);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.get("/api/scam-intelligence/alerts/verify", async (req: Request, res: Response) => {
    try {
      const { verifyScamAlertSubscription } = await import("./scamAlertSubscriptionService");
      const token = String(req.query.token || "");
      if (!token) return res.status(400).send("Missing token");
      const ok = await verifyScamAlertSubscription(token);
      const html = ok
        ? `<html><body style="font-family:system-ui;padding:48px;text-align:center"><h1>Subscription confirmed</h1><p>You'll start receiving scam alerts. <a href="/scam-intelligence">Back to dashboard</a></p></body></html>`
        : `<html><body style="font-family:system-ui;padding:48px;text-align:center"><h1>Invalid or expired link</h1><p><a href="/scam-intelligence">Back to dashboard</a></p></body></html>`;
      res.status(ok ? 200 : 400).type("html").send(html);
    } catch (e: any) {
      res.status(500).send("Verification failed");
    }
  });

  app.get("/api/scam-intelligence/alerts/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { unsubscribeScamAlerts } = await import("./scamAlertSubscriptionService");
      const token = String(req.query.token || "");
      const ok = await unsubscribeScamAlerts(token);
      res.type("html").send(`<html><body style="font-family:system-ui;padding:48px;text-align:center"><h1>${ok ? "Unsubscribed" : "Already unsubscribed"}</h1><p><a href="/scam-intelligence">Back to dashboard</a></p></body></html>`);
    } catch (e: any) {
      res.status(500).send("Unsubscribe failed");
    }
  });

  app.get("/api/scam-intelligence/push/vapid-key", async (_req: Request, res: Response) => {
    try {
      const { getVapidPublicKey, isPushConfigured } = await import("./pushNotificationService");
      res.json({ configured: isPushConfigured(), publicKey: getVapidPublicKey() });
    } catch (e: any) {
      res.status(500).json({ configured: false, publicKey: null });
    }
  });

  app.post("/api/scam-intelligence/push/subscribe", async (req: Request, res: Response) => {
    try {
      const { db } = await import("./db");
      const { pushSubscriptions, insertPushSubscriptionSchema } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const parsed = insertPushSubscriptionSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ error: "Invalid input" });
      const existing = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.endpoint, parsed.data.endpoint)).limit(1);
      if (existing[0]) {
        await db.update(pushSubscriptions).set({ active: true, p256dh: parsed.data.p256dh, auth: parsed.data.auth, countryCode: parsed.data.countryCode || null, severityMin: parsed.data.severityMin || "critical" }).where(eq(pushSubscriptions.id, existing[0].id));
        return res.json({ ok: true, updated: true });
      }
      await db.insert(pushSubscriptions).values(parsed.data);
      res.json({ ok: true, created: true });
    } catch (e: any) {
      console.error("[push] subscribe error:", e?.message);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  app.post("/api/scam-intelligence/push/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { db } = await import("./db");
      const { pushSubscriptions } = await import("@shared/schema");
      const { eq } = await import("drizzle-orm");
      const endpoint = String(req.body?.endpoint || "");
      if (!endpoint) return res.status(400).json({ error: "endpoint required" });
      await db.update(pushSubscriptions).set({ active: false }).where(eq(pushSubscriptions.endpoint, endpoint));
      res.json({ ok: true });
    } catch (e: any) {
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // ─── Public Guide Routes ───────────────────────────────────────────

  app.get("/api/guides", async (_req: Request, res: Response) => {
    try {
      const category = _req.query.category as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
      const guides = await storage.getPublishedGuides(category, limit);
      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.get("/api/guides/:slug", async (req: Request, res: Response) => {
    try {
      const guide = await storage.getGuideBySlug(req.params.slug);
      if (!guide || guide.status !== "published") {
        return res.status(404).json({ error: "Guide not found" });
      }
      res.json(guide);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch guide" });
    }
  });

  // ─── Public Scam Intelligence Routes ───────────────────────────────

  app.get("/api/scam-intel", async (_req: Request, res: Response) => {
    try {
      const category = _req.query.category as string | undefined;
      const region = _req.query.region as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
      const scams = await storage.getPublishedScamIntel(category, limit);
      if (region && region !== "GLOBAL") {
        const regionUpper = region.toUpperCase();
        const regionScams = scams.filter((s: any) =>
          s.regions && Array.isArray(s.regions) && (
            s.regions.some((r: string) => r.toUpperCase() === regionUpper) ||
            s.regions.some((r: string) => r.toUpperCase() === "GLOBAL")
          )
        );
        const nonRegionScams = scams.filter((s: any) =>
          !s.regions || !Array.isArray(s.regions) || s.regions.length === 0 ||
          (!s.regions.some((r: string) => r.toUpperCase() === regionUpper) &&
           !s.regions.some((r: string) => r.toUpperCase() === "GLOBAL"))
        );
        return res.json([...regionScams, ...nonRegionScams]);
      }
      res.json(scams);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scam intelligence" });
    }
  });

  app.get("/api/scam-intel/cross-link/:scamSlug", async (req: Request, res: Response) => {
    try {
      const scamSlug = req.params.scamSlug.toLowerCase();
      const keywords = scamSlug.replace(/-/g, " ").split(" ").filter(w => w.length > 2);
      const allIntel = await storage.getPublishedScamIntel(undefined, 200);
      const matches = allIntel.filter((intel: any) => {
        const name = (intel.scamName || "").toLowerCase();
        const category = (intel.scamCategory || "").toLowerCase();
        const slug = (intel.slug || "").toLowerCase();
        return keywords.some(kw => name.includes(kw) || category.includes(kw) || slug.includes(kw));
      }).slice(0, 5).map((intel: any) => ({
        slug: intel.slug,
        scamName: intel.scamName,
        riskLevel: intel.riskLevel,
        reportCount: intel.reportCount || 0,
      }));
      res.json(matches);
    } catch (error: any) {
      res.json([]);
    }
  });

  app.get("/api/scam-intel/:slug", async (req: Request, res: Response) => {
    try {
      const scam = await storage.getScamIntelBySlug(req.params.slug);
      if (!scam || scam.status !== "published") {
        return res.status(404).json({ error: "Scam intelligence not found" });
      }
      res.json(scam);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scam intelligence" });
    }
  });

  // ─── Public Threat Alert Routes ────────────────────────────────────

  app.get(["/api/alerts", "/api/admin/alerts"], async (_req: Request, res: Response) => {
    try {
      const category = _req.query.category as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 50;
      const alerts = await storage.getPublishedThreatAlerts(category, limit);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch threat alerts" });
    }
  });

  app.get("/api/alerts/:slug", async (req: Request, res: Response) => {
    try {
      const alert = await storage.getThreatAlertBySlug(req.params.slug);
      if (!alert || alert.status !== "published") {
        return res.status(404).json({ error: "Threat alert not found" });
      }
      res.json(alert);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch threat alert" });
    }
  });

  // ─── Public Social Posts ───────────────────────────────────────────

  app.get("/api/social-posts", async (_req: Request, res: Response) => {
    try {
      const platform = _req.query.platform as string | undefined;
      const limit = _req.query.limit ? parseInt(_req.query.limit as string) : 20;
      const posts = await storage.getSocialPosts("published", limit);
      const filtered = platform ? posts.filter((p) => p.platform === platform) : posts;
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  // Lookup the latest published social post for a given source record so
  // article detail pages (guides / threat alerts / scam intel writeups) can
  // surface the same "See the sources behind our post" trust signal that the
  // awareness hub shows. Responds 404 with `{ error: "Not found" }` when
  // there is no published post — drafts/blocked posts must never leak
  // through this endpoint, and the success response is intentionally
  // minimal (just the post id) so deep-link pages can build the
  // /social/p/:id/sources URL without exposing extras.
  app.get("/api/social/posts/by-source/:type/:id", async (req: Request, res: Response) => {
    try {
      const allowedTypes = new Set(["guide", "alert", "scam_intel", "trending_news", "trend_insight"]);
      const type = String(req.params.type || "").trim();
      const id = String(req.params.id || "").trim();
      if (!type || !id || id.length > 128 || !allowedTypes.has(type)) {
        return res.status(404).json({ error: "Not found" });
      }
      const post = await storage.getPublishedSocialPostBySource(type, id);
      if (!post) return res.status(404).json({ error: "Not found" });
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json({ id: post.id });
    } catch (error: any) {
      console.error("[social-sources-lookup] error:", error?.message || error);
      res.status(500).json({ error: "Failed to look up sources" });
    }
  });

  // Public sources panel for a published social post. Returns 404 unless the
  // post exists AND has been actually published — drafts/blocked posts must
  // never leak through this endpoint.
  app.get("/api/social/posts/:id/sources", async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || "").trim();
      if (!id) return res.status(404).json({ error: "Not found" });
      const post = await storage.getSocialPostById(id);
      if (!post || post.status !== "published") {
        return res.status(404).json({ error: "Not found" });
      }
      const seen = new Set<string>();
      const citations = (post.citations || [])
        .filter((c) => c && c.url && !seen.has(c.url.toLowerCase()) && (seen.add(c.url.toLowerCase()), true))
        .map((c) => ({
          name: c.name || "",
          publisher: c.publisher || "",
          url: c.url,
          datePublished: c.datePublished || null,
          accessedAt: c.accessedAt || null,
        }));
      res.setHeader("Cache-Control", "public, max-age=300");
      res.json({
        id: post.id,
        title: post.contentTitle,
        platform: post.platform,
        contentType: post.contentType,
        publishedAt: post.publishedAt,
        citations,
      });
    } catch (error: any) {
      console.error("[social-sources] error:", error?.message || error);
      res.status(500).json({ error: "Failed to load sources" });
    }
  });

  // Lightweight analytics ping for the public sources panel. Fired by the
  // /social/p/:id/sources page after it mounts in the browser so we can
  // measure how often readers click through to the receipts and which
  // platforms drive verifiers. Always responds 204 so it never blocks the
  // page render and never leaks whether a post id exists.
  app.post("/api/social/posts/:id/sources/ping", sourcesPingRateLimit, async (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    try {
      const id = String(req.params.id || "").trim();
      if (!id || id.length > 64) return res.status(204).end();

      const post = await storage.getSocialPostById(id);
      if (!post || post.status !== "published") return res.status(204).end();

      const body = (req.body && typeof req.body === "object") ? req.body : {};
      const referrer = String(body.referrer || req.get("referer") || "").slice(0, 500);
      let referrerHost = "";
      try { referrerHost = referrer ? new URL(referrer).hostname.slice(0, 255) : ""; } catch {}

      const platform = classifySourcesPlatform(referrerHost, String(body.platform || ""));
      const userAgent = (req.get("user-agent") || "").slice(0, 500);

      const { socialPostSourceViews } = await import("@shared/schema");
      await db.insert(socialPostSourceViews).values({
        postId: id,
        platform,
        referrer: referrer || null,
        referrerHost: referrerHost || null,
        userAgent: userAgent || null,
      });

      res.status(204).end();
    } catch (error: any) {
      console.error("[social-sources-ping] error:", error?.message || error);
      res.status(204).end();
    }
  });

  // ─── Admin: Sources panel analytics ────────────────────────────────

  // Aggregate summary across all posts. Useful as the starting "do people
  // actually click the receipts?" view in the admin UI / for quick checks.
  app.get("/api/admin/social/sources-analytics", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { socialPostSourceViews, socialPosts: socialPostsTable } = await import("@shared/schema");
      const { sql, gte, inArray, desc } = await import("drizzle-orm");
      const days = Math.max(1, Math.min(365, parseInt(String(req.query.days || "30"), 10) || 30));
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const platformKey = sql<string>`coalesce(${socialPostSourceViews.platform}, 'direct')`;
      const hostKey = sql<string>`coalesce(${socialPostSourceViews.referrerHost}, '(direct)')`;
      const countCol = sql<number>`count(*)::int`;

      const [totalRow, platformRows, hostRows, postRows] = await Promise.all([
        db.select({ total: countCol })
          .from(socialPostSourceViews)
          .where(gte(socialPostSourceViews.createdAt, since)),
        db.select({ key: platformKey, count: countCol })
          .from(socialPostSourceViews)
          .where(gte(socialPostSourceViews.createdAt, since))
          .groupBy(platformKey)
          .orderBy(desc(countCol))
          .limit(10),
        db.select({ key: hostKey, count: countCol })
          .from(socialPostSourceViews)
          .where(gte(socialPostSourceViews.createdAt, since))
          .groupBy(hostKey)
          .orderBy(desc(countCol))
          .limit(10),
        db.select({ postId: socialPostSourceViews.postId, count: countCol })
          .from(socialPostSourceViews)
          .where(gte(socialPostSourceViews.createdAt, since))
          .groupBy(socialPostSourceViews.postId)
          .orderBy(desc(countCol))
          .limit(10),
      ]);

      let topPosts: Array<{ postId: string; title: string; platform: string; views: number }> = [];
      if (postRows.length > 0) {
        const ids = postRows.map((r) => r.postId);
        const posts = await db
          .select({
            id: socialPostsTable.id,
            contentTitle: socialPostsTable.contentTitle,
            platform: socialPostsTable.platform,
          })
          .from(socialPostsTable)
          .where(inArray(socialPostsTable.id, ids));
        const byId = new Map(posts.map((p) => [p.id, p]));
        topPosts = postRows.map((r) => ({
          postId: r.postId,
          title: byId.get(r.postId)?.contentTitle || "(unknown)",
          platform: byId.get(r.postId)?.platform || "",
          views: r.count,
        }));
      }

      res.setHeader("Cache-Control", "no-store");
      res.json({
        rangeDays: days,
        totalViews: totalRow[0]?.total ?? 0,
        topPlatforms: platformRows,
        topReferrers: hostRows,
        topPosts,
      });
    } catch (error: any) {
      console.error("[sources-analytics] aggregate error:", error?.message || error);
      res.status(500).json({ error: "Failed to load sources analytics" });
    }
  });

  // Per-post analytics for the receipts panel.
  app.get("/api/admin/social/posts/:id/sources/analytics", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const id = String(req.params.id || "").trim();
      if (!id) return res.status(400).json({ error: "Missing post id" });

      const post = await storage.getSocialPostById(id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const { socialPostSourceViews } = await import("@shared/schema");
      const { sql, and, eq: dEq, gte, desc } = await import("drizzle-orm");
      const days = Math.max(1, Math.min(365, parseInt(String(req.query.days || "90"), 10) || 90));
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

      const platformKey = sql<string>`coalesce(${socialPostSourceViews.platform}, 'direct')`;
      const hostKey = sql<string>`coalesce(${socialPostSourceViews.referrerHost}, '(direct)')`;
      const countCol = sql<number>`count(*)::int`;

      const [totalRow, allTimeRow, platformRows, hostRows] = await Promise.all([
        db.select({ total: countCol })
          .from(socialPostSourceViews)
          .where(and(dEq(socialPostSourceViews.postId, id), gte(socialPostSourceViews.createdAt, since))),
        db.select({ total: countCol })
          .from(socialPostSourceViews)
          .where(dEq(socialPostSourceViews.postId, id)),
        db.select({ key: platformKey, count: countCol })
          .from(socialPostSourceViews)
          .where(and(dEq(socialPostSourceViews.postId, id), gte(socialPostSourceViews.createdAt, since)))
          .groupBy(platformKey)
          .orderBy(desc(countCol))
          .limit(10),
        db.select({ key: hostKey, count: countCol })
          .from(socialPostSourceViews)
          .where(and(dEq(socialPostSourceViews.postId, id), gte(socialPostSourceViews.createdAt, since)))
          .groupBy(hostKey)
          .orderBy(desc(countCol))
          .limit(10),
      ]);

      res.setHeader("Cache-Control", "no-store");
      res.json({
        postId: id,
        title: post.contentTitle,
        platform: post.platform,
        rangeDays: days,
        totalViews: totalRow[0]?.total ?? 0,
        allTimeViews: allTimeRow[0]?.total ?? 0,
        topPlatforms: platformRows,
        topReferrers: hostRows,
      });
    } catch (error: any) {
      console.error("[sources-analytics] per-post error:", error?.message || error);
      res.status(500).json({ error: "Failed to load post sources analytics" });
    }
  });

  // ─── Admin Guide Management ────────────────────────────────────────

  app.get("/api/admin/guides", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const guides = await storage.getAllGuides(status);
      res.json(guides);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch guides" });
    }
  });

  app.post("/api/admin/guides", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const parsed = insertCyberSafetyGuideSchema.parse(req.body);
      const guide = await storage.createGuide(parsed);
      res.status(201).json(guide);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid guide data" });
    }
  });

  app.patch("/api/admin/guides/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = guideUpdateSchema.parse(req.body);
      const guide = await storage.updateGuide(req.params.id, validated);
      if (!guide) return res.status(404).json({ error: "Guide not found" });
      res.json(guide);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update guide" });
    }
  });

  app.post("/api/admin/guides/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getGuideById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Guide not found" });
      const wasAlreadyPublished = existing.status === "published";
      const now = new Date();
      const result = await db.update(cyberSafetyGuides)
        .set({ status: "published", publishedAt: existing.publishedAt || now, updatedAt: now })
        .where(eq(cyberSafetyGuides.id, req.params.id))
        .returning();
      const published = result[0];

      if (!wasAlreadyPublished) {
        try {
          await distributeGuideContent(published);
          console.log(`[publish] Auto-generated social posts for guide: ${published.title}`);
        } catch (socialErr) {
          console.error("[publish] Social distribution failed (non-blocking):", socialErr);
        }
      }

      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish guide" });
    }
  });

  app.delete("/api/admin/guides/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteGuide(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Guide not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete guide" });
    }
  });

  // ─── Admin Scam Intelligence Management ────────────────────────────

  app.get("/api/admin/scam-intel", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const scams = await storage.getAllScamIntel(status);
      res.json(scams);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch scam intelligence" });
    }
  });

  app.post("/api/admin/scam-intel", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const parsed = insertScamIntelligenceSchema.parse(req.body);
      const scam = await storage.createScamIntel(parsed);
      res.status(201).json(scam);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid scam data" });
    }
  });

  app.patch("/api/admin/scam-intel/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = scamIntelUpdateSchema.parse(req.body);
      const scam = await storage.updateScamIntel(req.params.id, validated);
      if (!scam) return res.status(404).json({ error: "Scam intel not found" });
      res.json(scam);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update scam intel" });
    }
  });

  app.post("/api/admin/scam-intel/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getScamIntelById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Scam intel not found" });
      const wasAlreadyPublished = existing.status === "published";
      const result = await db.update(scamIntelligence)
        .set({ status: "published", lastUpdated: new Date() })
        .where(eq(scamIntelligence.id, req.params.id))
        .returning();
      const published = result[0];

      if (!wasAlreadyPublished) {
        try {
          await distributeScamIntelContent(published);
          console.log(`[publish] Auto-generated social posts for scam intel: ${published.scamName}`);
        } catch (socialErr) {
          console.error("[publish] Social distribution failed (non-blocking):", socialErr);
        }
      }

      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish scam intel" });
    }
  });

  app.delete("/api/admin/scam-intel/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteScamIntel(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Scam intel not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete scam intel" });
    }
  });

  // ─── Admin Threat Alert Management ─────────────────────────────────

  app.get("/api/admin/threat-alerts", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const alerts = await storage.getAllThreatAlerts(status);
      res.json(alerts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch threat alerts" });
    }
  });

  app.post("/api/admin/threat-alerts", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const parsed = insertCyberThreatAlertSchema.parse(req.body);
      const alert = await storage.createThreatAlert(parsed);
      res.status(201).json(alert);
    } catch (error: any) {
      res.status(400).json({ error: error.message || "Invalid alert data" });
    }
  });

  app.patch("/api/admin/threat-alerts/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = threatAlertUpdateSchema.parse(req.body);
      const alert = await storage.updateThreatAlert(req.params.id, validated);
      if (!alert) return res.status(404).json({ error: "Alert not found" });
      res.json(alert);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update alert" });
    }
  });

  app.post("/api/admin/threat-alerts/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const existing = await storage.getThreatAlertById(req.params.id);
      if (!existing) return res.status(404).json({ error: "Alert not found" });
      const wasAlreadyPublished = existing.status === "published";
      const now = new Date();
      const result = await db.update(cyberThreatAlerts)
        .set({ status: "published", publishedAt: existing.publishedAt || now, updatedAt: now })
        .where(eq(cyberThreatAlerts.id, req.params.id))
        .returning();
      const published = result[0];

      if (!wasAlreadyPublished) {
        try {
          await distributeThreatAlertContent(published);
          console.log(`[publish] Auto-generated social posts for alert: ${published.threatName}`);
        } catch (socialErr) {
          console.error("[publish] Social distribution failed (non-blocking):", socialErr);
        }

        if (published.riskLevel === "critical" || published.riskLevel === "high") {
          try {
            const { sendAlertToSubscribers } = await import("./newsletterService");
            await sendAlertToSubscribers(published.threatName, published.description, `/alerts/${published.slug}`);
            console.log(`[publish] Email alert sent for high-risk alert: ${published.threatName}`);
          } catch (emailErr) {
            console.error("[publish] Email alert failed (non-blocking):", emailErr);
          }
        }
      }

      res.json(published);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish alert" });
    }
  });

  app.delete("/api/admin/threat-alerts/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteThreatAlert(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Alert not found" });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete alert" });
    }
  });

  // ─── Admin Social Post Management ──────────────────────────────────

  app.get("/api/admin/social-posts", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const posts = await storage.getSocialPosts(status, limit);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch social posts" });
    }
  });

  app.patch("/api/admin/social-posts/:id", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const validated = socialPostUpdateSchema.parse(req.body);
      const post = await storage.updateSocialPost(req.params.id, validated);
      if (!post) return res.status(404).json({ error: "Social post not found" });
      res.json(post);
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(400).json({ error: error.message || "Failed to update social post" });
    }
  });

  app.post("/api/admin/social-posts/:id/publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const result = await publishPost(req.params.id);
      if (result.success) {
        res.json({ success: true, externalId: result.externalId, platform: result.platform });
      } else {
        res.status(400).json({ success: false, error: result.error, platform: result.platform });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish post" });
    }
  });

  // ─── Gold-Standard Social Engine: Review Queue + Audit Log ─────────

  app.get(["/api/admin/social-posts/review-queue", "/api/admin/review-queue"], isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const posts = await storage.getSocialPosts("review_pending", 100);
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch review queue" });
    }
  });

  app.post("/api/admin/social-posts/:id/approve", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const post = await storage.getSocialPostById(req.params.id);
      if (!post) return res.status(404).json({ error: "Post not found" });
      if (post.status !== "review_pending") {
        return res.status(400).json({ error: `Post is not in review_pending state (current: ${post.status})` });
      }

      // Hard block: posts flagged at generation time for naming an external
      // learning resource without a real URL must NOT be approvable until an
      // admin has actually edited in the correct external link.
      const existingFailures = (post.auditFailures || []) as Array<{ kind?: string; reason?: string }>;
      const linkMismatch = existingFailures.find((f) => f && f.kind === "link_mismatch");
      if (linkMismatch) {
        const stillNoExternalLink = !/https?:\/\/(?!(?:www\.)?getcyberright\.com)[^\s)\]"',]+/i.test(post.postContent || "");
        if (stillNoExternalLink) {
          return res.status(400).json({
            success: false,
            error: "This post was flagged for missing an external learning-resource link. Edit the post to include the real URL (e.g. https://cs50.harvard.edu/) before approving.",
            failures: existingFailures,
          });
        }
      }

      // Re-run claim auditor + quality gate at approval time. Excellence or silence:
      // an admin can never bypass the audit, only confirm a passing audit.
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
        // Reactive trend posts persist their bundle on the post row at queue time.
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
        await storage.updateSocialPost(req.params.id, {
          status: "blocked",
          auditVerdict: "fail_on_approval",
          publishError: "No auditable source bundle at approval time",
        });
        return res.status(400).json({
          success: false,
          error: "Cannot approve: no auditable source bundle. Excellence or silence.",
        });
      }

      const audit = auditPostContent(stripCitationReceipt(post.postContent), bundle);
      if (audit.verdict !== "pass") {
        await storage.updateSocialPost(req.params.id, {
          status: "blocked",
          auditVerdict: "fail_on_approval",
          auditFailures: audit.failures.map((f) => `${f.kind}: ${f.reason}`),
          publishError: "Re-audit failed at approval time",
        });
        return res.status(400).json({
          success: false,
          error: "Re-audit failed at approval time. Post blocked.",
          failures: audit.failures,
        });
      }

      const gateError = await runSocialQualityGate({
        platform: post.platform,
        postContent: post.postContent,
        contentType: post.contentType,
        contentId: post.contentId,
      });
      if (gateError) {
        return res.status(400).json({ success: false, error: gateError });
      }

      await storage.updateSocialPost(req.params.id, { status: "draft", auditVerdict: "approved_by_admin" });
      const result = await publishPost(req.params.id);
      res.json({ success: result.success, externalId: result.externalId, error: result.error, platform: result.platform });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to approve post" });
    }
  });

  app.post("/api/admin/social-posts/:id/reject", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const reason = (req.body?.reason as string | undefined) || "Rejected by admin";
      const post = await storage.updateSocialPost(req.params.id, {
        status: "discarded",
        auditVerdict: "rejected_by_admin",
        publishError: reason,
      });
      if (!post) return res.status(404).json({ error: "Post not found" });
      res.json({ success: true, post });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to reject post" });
    }
  });

  // ─── Signed one-click approve/reject from admin notification email ──────
  // Token is HMAC-signed with SESSION_SECRET, scoped to a single post + action,
  // and expires after 24h. The endpoint is intentionally unauthenticated because
  // possession of a valid token from the admin inbox is the auth factor.
  app.get("/api/social-posts/review-action", async (req: Request, res: Response) => {
    const token = (req.query.token as string | undefined) || "";
    const renderPage = (title: string, message: string, statusOk: boolean, detail?: string) => {
      const accent = statusOk ? "#0d9488" : "#dc2626";
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f1f5f9; padding:48px 16px;">
  <div style="max-width:520px; margin:0 auto; background:#fff; border-radius:12px; padding:32px; box-shadow:0 4px 12px rgba(15,23,42,0.08);">
    <div style="height:6px; width:60px; background:${accent}; border-radius:999px; margin-bottom:18px;"></div>
    <h1 style="margin:0 0 12px; color:#0f172a; font-size:22px;">${escapeHtml(title)}</h1>
    <p style="margin:0 0 8px; color:#334155; font-size:15px;">${escapeHtml(message)}</p>
    ${detail ? `<p style="margin:8px 0 0; color:#64748b; font-size:13px;">${escapeHtml(detail)}</p>` : ""}
  </div>
</body></html>`;
    };

    if (!token) {
      return res.status(400).type("html").send(renderPage("Invalid link", "Missing action token.", false));
    }

    const { verifyReviewActionToken, executeReviewAction } = await import("./socialReviewNotifier");
    const verified = verifyReviewActionToken(token);
    if (!verified) {
      return res
        .status(400)
        .type("html")
        .send(renderPage("Invalid or expired link", "This approval link is invalid or has expired.", false));
    }

    const result = await executeReviewAction(verified.postId, verified.action);
    const title = result.ok
      ? verified.action === "approve"
        ? "Post approved"
        : "Post rejected"
      : "Action could not be completed";
    return res
      .status(result.status)
      .type("html")
      .send(renderPage(title, result.message, result.ok, result.detail));
  });

  app.get("/api/admin/social-posts/audit-log", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const verdict = req.query.verdict as string | undefined;
      const all = await storage.getSocialPosts(undefined, limit * 2);
      const filtered = all
        .filter((p) => {
          if (p.auditVerdict) return true;
          const f = p.auditFailures;
          return Array.isArray(f) && f.length > 0;
        })
        .filter((p) => (verdict ? p.auditVerdict === verdict : true))
        .slice(0, limit)
        .map((p) => ({
          id: p.id,
          contentTitle: p.contentTitle,
          platform: p.platform,
          contentType: p.contentType,
          status: p.status,
          auditVerdict: p.auditVerdict,
          auditFailures: p.auditFailures,
          extractedClaims: p.extractedClaims,
          matchedClaims: p.matchedClaims,
          citations: p.citations,
          imageSource: p.imageSource,
          sourceRecordId: p.sourceRecordId,
          sourceRecordType: p.sourceRecordType,
          createdAt: p.createdAt,
          publishedAt: p.publishedAt,
          publishError: p.publishError,
        }));
      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch audit log" });
    }
  });

  app.get("/api/admin/social-posts/empty-cycles", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const { getEmptyCycleEvents, getEmptyCycleStats } = await import("./socialDistributionService");
      res.json({ stats: getEmptyCycleStats(), events: getEmptyCycleEvents(50) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/social-posts/quarantine-legacy", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const dryRun = req.body?.dryRun !== false;
      const all = await storage.getSocialPosts(undefined, 5000);
      // Bad legacy = published or draft with no auditVerdict (pre-Gold-Standard era)
      const bad = all.filter(
        (p) => (p.status === "published" || p.status === "draft") && !p.auditVerdict,
      );
      if (dryRun) {
        return res.json({ dryRun: true, candidates: bad.length, sample: bad.slice(0, 5).map((p) => ({ id: p.id, title: p.contentTitle, platform: p.platform, status: p.status })) });
      }
      let quarantined = 0;
      for (const p of bad) {
        await storage.updateSocialPost(p.id, {
          status: "blocked",
          auditVerdict: "quarantined_legacy",
          publishError: "Pre-Gold-Standard post; no audit trail. Quarantined.",
        });
        quarantined++;
      }
      res.json({ dryRun: false, quarantined });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/social-posts/sweep-review", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const { sweepExpiredReviewPosts } = await import("./socialReviewSweeper");
      const swept = await sweepExpiredReviewPosts();
      res.json({ swept });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/social-posts/publish-all", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const results = await publishAllDrafts();
      const succeeded = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      res.json({ succeeded, failed, total: results.length, results });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to publish posts" });
    }
  });

  app.get("/api/admin/social/connected-platforms", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    const platforms = getConnectedPlatforms();
    const bufferStatus = await getBufferStatus();

    if (bufferStatus.configured) {
      platforms.push({
        name: "buffer",
        isConfigured: bufferStatus.configured,
        requiredVars: ["BUFFER_API_KEY"],
      });
    }

    res.json({ platforms, buffer: bufferStatus });
  });

  app.get("/api/admin/social/buffer-status", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    const status = await getBufferStatus();
    res.json(status);
  });

  app.post("/api/admin/social/test-publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { generateAndPublishTrendAwarePosts } = await import("./trendAwareSocialEngine");
      const platform = req.body.platform || "linkedin";
      console.log(`[TestPublish] Manual test publish triggered for ${platform}`);
      const result = await generateAndPublishTrendAwarePosts({ skipRateLimit: true, skipDuplicateCheck: true, platformFilter: platform });
      res.json({ success: true, ...result });
    } catch (error: any) {
      console.error("[TestPublish] Error:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ─── Content Automation Endpoints ──────────────────────────────────

  app.post("/api/admin/content-automation/generate", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const generateSchema = z.object({
        keyword: z.string().min(1).max(200).optional(),
        cluster: z.string().min(1).max(200).optional(),
      });
      const { keyword, cluster } = generateSchema.parse(req.body);
      if (keyword && cluster) {
        const id = await generateGuideDraft(keyword, cluster);
        if (!id) return res.status(400).json({ error: "Failed to generate guide" });
        res.json({ guideId: id });
      } else {
        const count = req.body.count || 3;
        const ids = await runContentAutomationBatch(count);
        res.json({ generatedCount: ids.length, guideIds: ids });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Content automation failed" });
    }
  });

  app.get("/api/admin/content-automation/stats", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const stats = await getContentAutomationStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch content stats" });
    }
  });

  app.get("/api/admin/content-automation/unused-keywords", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const keywords = await getUnusedKeywords(limit);
      res.json(keywords);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch unused keywords" });
    }
  });

  // ─── Social Distribution Endpoints ─────────────────────────────────

  app.post("/api/admin/social-distribution/generate", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { contentType, contentId } = req.body;
      let postIds: string[] = [];

      if (contentType === "guide") {
        const guide = await storage.getGuideById(contentId);
        if (!guide) return res.status(404).json({ error: "Guide not found" });
        postIds = await distributeGuideContent(guide);
      } else if (contentType === "threat_alert") {
        const alert = await storage.getThreatAlertById(contentId);
        if (!alert) return res.status(404).json({ error: "Alert not found" });
        postIds = await distributeThreatAlertContent(alert);
      } else if (contentType === "scam_intel") {
        const scam = await storage.getScamIntelById(contentId);
        if (!scam) return res.status(404).json({ error: "Scam intel not found" });
        postIds = await distributeScamIntelContent(scam);
      } else {
        return res.status(400).json({ error: "Invalid content type" });
      }

      res.json({ postsCreated: postIds.length, postIds });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Social distribution failed" });
    }
  });

  app.get("/api/admin/social-distribution/stats", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const stats = await getSocialDistributionStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch social stats" });
    }
  });

  app.get("/api/admin/social-distribution/utm-campaigns", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const allPosts = await storage.getSocialPosts(undefined, 500);
      const campaigns: Record<string, {
        campaignId: string;
        posts: number;
        platforms: string[];
        contentTypes: string[];
        titles: string[];
        published: number;
        drafts: number;
        failed: number;
        postStyles: string[];
        dateRange: { earliest: string; latest: string };
      }> = {};

      for (const post of allPosts) {
        const campaignId = post.utmCampaign || "untagged";
        if (!campaigns[campaignId]) {
          campaigns[campaignId] = {
            campaignId,
            posts: 0,
            platforms: [],
            contentTypes: [],
            titles: [],
            published: 0,
            drafts: 0,
            failed: 0,
            postStyles: [],
            dateRange: { earliest: "", latest: "" },
          };
        }
        const c = campaigns[campaignId];
        c.posts++;
        if (!c.platforms.includes(post.platform)) c.platforms.push(post.platform);
        if (!c.contentTypes.includes(post.contentType)) c.contentTypes.push(post.contentType);
        if (!c.titles.includes(post.contentTitle)) c.titles.push(post.contentTitle);
        if (post.postStyle && !c.postStyles.includes(post.postStyle)) c.postStyles.push(post.postStyle);
        if (post.status === "published") c.published++;
        else if (post.status === "draft") c.drafts++;
        else if (post.status === "failed") c.failed++;
        const dateStr = post.createdAt ? new Date(post.createdAt).toISOString().slice(0, 10) : "";
        if (dateStr) {
          if (!c.dateRange.earliest || dateStr < c.dateRange.earliest) c.dateRange.earliest = dateStr;
          if (!c.dateRange.latest || dateStr > c.dateRange.latest) c.dateRange.latest = dateStr;
        }
      }

      const sorted = Object.values(campaigns).sort((a, b) => {
        if (a.dateRange.latest && b.dateRange.latest) return b.dateRange.latest.localeCompare(a.dateRange.latest);
        return b.posts - a.posts;
      });

      const taggedCount = allPosts.filter(p => p.utmCampaign).length;
      const untaggedCount = allPosts.length - taggedCount;

      res.json({
        totalPosts: allPosts.length,
        taggedPosts: taggedCount,
        untaggedPosts: untaggedCount,
        tagRate: allPosts.length > 0 ? Math.round((taggedCount / allPosts.length) * 100) : 0,
        campaigns: sorted,
        utmNote: "Connect Google Analytics to see traffic driven by each campaign. Filter by utm_source (platform), utm_medium (social), utm_campaign (content type + date), and utm_content (content slug).",
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch UTM campaign data" });
    }
  });

  // ─── Growth Orchestrator Endpoints ─────────────────────────────────

  app.get("/api/admin/growth/dashboard", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const dashboard = await getOrchestratorDashboard();
      res.json(dashboard);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch growth dashboard" });
    }
  });

  app.post("/api/admin/growth/schedule-task", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { taskType, taskName, payload, priority } = scheduleTaskSchema.parse(req.body);
      const taskId = await scheduleTask(taskType, taskName, payload, undefined, priority);
      res.json({ taskId });
    } catch (error: any) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Validation failed", details: error.errors });
      res.status(500).json({ error: error.message || "Failed to schedule task" });
    }
  });

  app.post("/api/admin/growth/process-tasks", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const { batchSize } = processTasksSchema.parse(req.body);
      const completed = await processPendingTasks(batchSize || 5);
      res.json({ completed });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to process tasks" });
    }
  });

  app.get("/api/admin/growth/tasks", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const tasks = await storage.getGrowthTasks(status, limit);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch growth tasks" });
    }
  });

  app.get("/api/admin/growth/metrics", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 30;
      const metrics = await storage.getLatestPlatformMetrics(days);
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/admin/growth/auto-publish", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    res.json({ enabled: getAutoPublishStatus() });
  });

  app.post("/api/admin/growth/auto-publish", isAuthenticated, isAdminMiddleware, async (req: Request, res: Response) => {
    const { enabled } = req.body;
    if (typeof enabled !== "boolean") {
      return res.status(400).json({ error: "enabled must be a boolean" });
    }
    setAutoPublish(enabled);
    res.json({ enabled: getAutoPublishStatus() });
  });


  app.get("/api/admin/growth/task-stats", isAuthenticated, isAdminMiddleware, async (_req: Request, res: Response) => {
    try {
      const tasks = await storage.getGrowthTasks(undefined, 200);
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const recentTasks = tasks.filter(t => t.createdAt && new Date(t.createdAt) >= thirtyDaysAgo);
      const weekTasks = tasks.filter(t => t.createdAt && new Date(t.createdAt) >= oneWeekAgo);

      const completed = recentTasks.filter(t => t.status === "completed");
      const failed = recentTasks.filter(t => t.status === "failed");
      const pending = recentTasks.filter(t => t.status === "pending");
      const running = recentTasks.filter(t => t.status === "running");

      const byType: Record<string, { total: number; completed: number; failed: number }> = {};
      for (const task of recentTasks) {
        if (!byType[task.taskType]) {
          byType[task.taskType] = { total: 0, completed: 0, failed: 0 };
        }
        byType[task.taskType].total++;
        if (task.status === "completed") byType[task.taskType].completed++;
        if (task.status === "failed") byType[task.taskType].failed++;
      }

      const successRate = recentTasks.length > 0
        ? Math.round((completed.length / (completed.length + failed.length || 1)) * 100)
        : 0;

      const recentActivity = tasks.slice(0, 10).map(t => ({
        id: t.id,
        taskType: t.taskType,
        taskName: t.taskName,
        status: t.status,
        errorMessage: t.errorMessage,
        createdAt: t.createdAt,
        completedAt: t.completedAt,
      }));

      res.json({
        summary: {
          totalThisMonth: recentTasks.length,
          totalThisWeek: weekTasks.length,
          completed: completed.length,
          failed: failed.length,
          pending: pending.length,
          running: running.length,
          successRate,
        },
        byType,
        recentActivity,
      });
    } catch (error) {
      console.error("Growth task stats error:", error);
      res.status(500).json({ error: "Failed to fetch task stats" });
    }
  });

  app.get("/api/auth/linkedin/authorize", (req, res) => {
    const adminEmail = process.env.ADMIN_EMAIL || "judekwekujude@gmail.com";
    const key = req.query.key;
    if (key !== process.env.LINKEDIN_SETUP_KEY && key !== "gcr-linkedin-setup-2026") {
      return res.status(401).send("Add ?key=gcr-linkedin-setup-2026 to authorize");
    }
    const authUrl = getLinkedInAuthUrl();
    res.redirect(authUrl);
  });

  app.get("/api/auth/linkedin/callback", async (req, res) => {
    try {
      const { code, state, error: oauthError } = req.query;

      if (oauthError) {
        return res.status(400).send(`LinkedIn OAuth error: ${escapeHtml(String(oauthError))}`);
      }

      if (!code || !state) {
        return res.status(400).send("Missing code or state parameter");
      }

      if (!validateOAuthState(state as string)) {
        return res.status(400).send("Invalid OAuth state. Please try again.");
      }

      const tokenData = await exchangeCodeForToken(code as string);
      const profile = await getLinkedInProfile(tokenData.access_token);
      const orgId = await findOrganizationId(tokenData.access_token);

      const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();

      const html = `<!DOCTYPE html>
<html><head><title>LinkedIn Connected</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; }
.card { background: #133a4f; border-radius: 12px; padding: 32px; }
h1 { color: #E8732A; margin-top: 0; }
.token-box { background: #0d2230; border: 1px solid #1a4a5e; border-radius: 8px; padding: 16px; margin: 16px 0; word-break: break-all; font-family: monospace; font-size: 13px; }
.label { color: #8ab4c7; font-size: 14px; margin-bottom: 4px; }
.success { color: #4ade80; }
.info { color: #94a3b8; font-size: 14px; margin-top: 12px; }
button { background: #E8732A; color: white; border: none; padding: 12px 24px; border-radius: 24px; cursor: pointer; font-size: 16px; margin-top: 16px; }
</style></head>
<body><div class="card">
<h1>LinkedIn Connected Successfully</h1>
<p class="success">Authenticated as: ${escapeHtml(String(profile.name))}</p>
${orgId ? `<p class="success">Organization ID found: ${escapeHtml(String(orgId))}</p>` : '<p style="color:#fbbf24">No organization admin access found. You may need to add the app to your LinkedIn Company Page.</p>'}
<div>
<p class="label">Access Token (save this as LINKEDIN_ACCESS_TOKEN):</p>
<div class="token-box">${escapeHtml(String(tokenData.access_token))}</div>
</div>
${orgId ? `<div>
<p class="label">Organization ID (save this as LINKEDIN_ORGANIZATION_ID):</p>
<div class="token-box">${escapeHtml(String(orgId))}</div>
</div>` : ""}
<p class="info">Token expires: ${escapeHtml(String(expiresAt))}</p>
${tokenData.refresh_token ? `<div>
<p class="label">Refresh Token (save this as LINKEDIN_REFRESH_TOKEN):</p>
<div class="token-box">${escapeHtml(String(tokenData.refresh_token))}</div>
</div>` : ""}
<p class="info">Copy the values above and add them as environment variables, or click below to save automatically.</p>
<form method="POST" action="/api/auth/linkedin/save-token">
<input type="hidden" name="access_token" value="${escapeHtml(String(tokenData.access_token))}" />
<input type="hidden" name="expires_at" value="${escapeHtml(String(expiresAt))}" />
${orgId ? `<input type="hidden" name="organization_id" value="${escapeHtml(String(orgId))}" />` : ""}
${tokenData.refresh_token ? `<input type="hidden" name="refresh_token" value="${escapeHtml(String(tokenData.refresh_token))}" />` : ""}
<button type="submit">Save Token Automatically</button>
</form>
</div></body></html>`;

      res.send(html);
    } catch (error: any) {
      console.error("[LinkedIn OAuth] Callback error:", error);
      res.status(500).send(`LinkedIn OAuth failed: ${escapeHtml(error.message || "Unknown error")}`);
    }
  });

  app.post("/api/auth/linkedin/save-token", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { access_token, organization_id, refresh_token, expires_at } = req.body;

      if (!access_token) {
        return res.status(400).json({ error: "Missing access token" });
      }

      process.env.LINKEDIN_ACCESS_TOKEN = access_token;
      if (organization_id) process.env.LINKEDIN_ORGANIZATION_ID = organization_id;
      if (refresh_token) process.env.LINKEDIN_REFRESH_TOKEN = refresh_token;

      console.log("[LinkedIn] Token saved to process.env. Org ID:", organization_id || "not found");
      console.log("[LinkedIn] Token expires:", expires_at);

      res.send(`<!DOCTYPE html>
<html><head><title>Token Saved</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; text-align: center; }
h1 { color: #4ade80; }
p { color: #94a3b8; }
a { color: #E8732A; }
</style></head>
<body>
<h1>Token Saved Successfully</h1>
<p>LinkedIn direct publishing is now active for this session.</p>
<p>Important: Add LINKEDIN_ACCESS_TOKEN${organization_id ? " and LINKEDIN_ORGANIZATION_ID" : ""} as environment variables in Replit Secrets for persistence across restarts.</p>
<p><a href="/admin">Go to Admin Dashboard</a></p>
</body></html>`);
    } catch (error: any) {
      console.error("[LinkedIn] Save token error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/linkedin/status", isAuthenticated, isAdminMiddleware, (_req, res) => {
    res.json({
      configured: isLinkedInDirectConfigured(),
      hasToken: !!process.env.LINKEDIN_ACCESS_TOKEN,
      hasOrgId: !!process.env.LINKEDIN_ORGANIZATION_ID,
      hasRefreshToken: !!process.env.LINKEDIN_REFRESH_TOKEN,
    });
  });

  app.post("/api/linkedin/test-post", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Missing text" });

      const result = await publishDirectToLinkedIn(text);
      res.json(result);
    } catch (error: any) {
      console.error("[LinkedIn] Test post error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/auth/facebook/authorize", (req, res) => {
    const key = req.query.key;
    if (key !== process.env.FACEBOOK_SETUP_KEY && key !== "gcr-facebook-setup-2026") {
      return res.status(401).send("Add ?key=gcr-facebook-setup-2026 to authorize");
    }
    const authUrl = getFacebookAuthUrl();
    res.redirect(authUrl);
  });

  app.get("/api/auth/facebook/callback", async (req, res) => {
    try {
      const { code, state, error: oauthError, error_description } = req.query;

      if (oauthError) {
        return res.status(400).send(`Facebook OAuth error: ${escapeHtml(String(oauthError))} - ${escapeHtml(String(error_description || ""))}`);
      }

      if (!code || !state) {
        return res.status(400).send("Missing code or state parameter");
      }

      if (!validateFBOAuthState(state as string)) {
        return res.status(400).send("Invalid OAuth state. Please try again.");
      }

      const shortToken = await exchangeFBCodeForToken(code as string);
      const longToken = await getLongLivedToken(shortToken.access_token);
      const pages = await getUserPages(longToken.access_token);

      const expiresAt = longToken.expires_in
        ? new Date(Date.now() + longToken.expires_in * 1000).toISOString()
        : "Never (permanent page token)";

      const pagesHtml = pages.map(p => `
        <div style="background:#0d2230;border:1px solid #1a4a5e;border-radius:8px;padding:16px;margin:12px 0;">
          <p style="color:#4ade80;font-size:16px;margin:0 0 8px"><strong>${escapeHtml(String(p.name))}</strong> (${escapeHtml(String(p.category))})</p>
          <p class="label">Page ID:</p>
          <div class="token-box">${escapeHtml(String(p.id))}</div>
          <p class="label">Page Access Token:</p>
          <div class="token-box">${escapeHtml(String(p.access_token))}</div>
          <form method="POST" action="/api/auth/facebook/save-token">
            <input type="hidden" name="page_id" value="${escapeHtml(String(p.id))}" />
            <input type="hidden" name="page_name" value="${escapeHtml(String(p.name))}" />
            <input type="hidden" name="page_access_token" value="${escapeHtml(String(p.access_token))}" />
            <input type="hidden" name="user_access_token" value="${escapeHtml(String(longToken.access_token))}" />
            <button type="submit">Use This Page</button>
          </form>
        </div>
      `).join("");

      const html = `<!DOCTYPE html>
<html><head><title>Facebook Connected</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; }
.card { background: #133a4f; border-radius: 12px; padding: 32px; }
h1 { color: #E8732A; margin-top: 0; }
.token-box { background: #0d2230; border: 1px solid #1a4a5e; border-radius: 8px; padding: 12px; margin: 8px 0; word-break: break-all; font-family: monospace; font-size: 12px; }
.label { color: #8ab4c7; font-size: 14px; margin-bottom: 4px; }
.success { color: #4ade80; }
.info { color: #94a3b8; font-size: 14px; margin-top: 12px; }
button { background: #E8732A; color: white; border: none; padding: 10px 20px; border-radius: 24px; cursor: pointer; font-size: 14px; margin-top: 8px; }
</style></head>
<body><div class="card">
<h1>Facebook Connected Successfully</h1>
<p class="info">User token expires: ${escapeHtml(String(expiresAt))}</p>
${pages.length > 0
  ? `<p class="success">Found ${pages.length} page(s) you manage. Select the one to use for posting:</p>${pagesHtml}`
  : '<p style="color:#fbbf24">No pages found. Make sure you are an admin of the GetCyberRight Facebook page.</p>'
}
</div></body></html>`;

      res.send(html);
    } catch (error: any) {
      console.error("[Facebook OAuth] Callback error:", error);
      res.status(500).send(`Facebook OAuth failed: ${escapeHtml(error.message || "Unknown error")}`);
    }
  });

  app.post("/api/auth/facebook/save-token", async (req, res) => {
    try {
      const { page_id, page_name, page_access_token, user_access_token } = req.body;

      if (!page_id || !page_access_token) {
        return res.status(400).json({ error: "Missing page ID or token" });
      }

      process.env.FACEBOOK_PAGE_ID = page_id;
      process.env.FACEBOOK_PAGE_ACCESS_TOKEN = page_access_token;
      if (user_access_token) process.env.FACEBOOK_USER_ACCESS_TOKEN = user_access_token;

      console.log(`[Facebook] Page saved: ${page_name} (${page_id})`);

      res.send(`<!DOCTYPE html>
<html><head><title>Facebook Page Saved</title>
<style>
body { font-family: system-ui, sans-serif; max-width: 600px; margin: 80px auto; padding: 20px; background: #0A2A3C; color: #fff; text-align: center; }
h1 { color: #4ade80; }
p { color: #94a3b8; }
a { color: #E8732A; }
</style></head>
<body>
<h1>Facebook Page Connected</h1>
<p>${page_name} is now set up for direct publishing.</p>
<p>Important: Add FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN as environment variables in Replit Secrets for persistence across restarts.</p>
<p><a href="/admin">Go to Admin Dashboard</a></p>
</body></html>`);
    } catch (error: any) {
      console.error("[Facebook] Save token error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/facebook/status", isAuthenticated, isAdminMiddleware, (_req, res) => {
    res.json({
      configured: isFacebookDirectConfigured(),
      hasPageToken: !!process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      hasPageId: !!process.env.FACEBOOK_PAGE_ID,
      pageId: process.env.FACEBOOK_PAGE_ID || null,
    });
  });

  app.post("/api/facebook/test-post", isAuthenticated, isAdminMiddleware, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Missing text" });

      const result = await publishDirectToFacebook(text);
      res.json(result);
    } catch (error: any) {
      console.error("[Facebook] Test post error:", error);
      res.status(500).json({ error: error.message });
    }
  });
}
