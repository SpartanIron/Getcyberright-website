import { db } from "./db";
import { threatFeeds, feedRuns, threatItems, feedHealthAlerts, ThreatFeed, ThreatItem, FeedRun } from "@shared/schema";
import { eq, desc, and, lt, gt, sql, isNull, or } from "drizzle-orm";
import crypto from "crypto";

// Simple logger function
function log(message: string, prefix: string = "server") {
  console.log(`[${prefix}] ${message}`);
}

// ============================================
// THREAT INTELLIGENCE FEED INTEGRATION SYSTEM
// Enterprise-grade automated content governance
// ============================================

interface FeedAdapter {
  id: string;
  name: string;
  fetch: () => Promise<RawThreatItem[]>;
}

interface RawThreatItem {
  externalId?: string;
  itemType: string;
  title: string;
  summary?: string;
  content?: string;
  severity?: string;
  confidence?: number;
  regions?: string[];
  tags?: string[];
  indicators?: string[];
  affectedAudiences?: string[];
  sourceUrl?: string;
  publishedAt?: Date;
  expiresAt?: Date;
}

// Pre-configured feed sources
const FEED_REGISTRY: Omit<ThreatFeed, "lastSuccessfulRun" | "lastAttemptedRun" | "lastError" | "itemCount" | "createdAt" | "updatedAt">[] = [
  {
    id: "cisa-alerts",
    name: "CISA Cybersecurity Alerts",
    description: "Official alerts from the Cybersecurity and Infrastructure Security Agency",
    sourceUrl: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
    sourceType: "json",
    category: "government",
    priority: 10,
    scheduleInterval: 21600, // 6 hours
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: null,
  },
  {
    id: "nvd-cve",
    name: "NIST National Vulnerability Database",
    description: "CVE vulnerability data from NIST NVD",
    sourceUrl: "https://services.nvd.nist.gov/rest/json/cves/2.0",
    sourceType: "api",
    category: "standards",
    priority: 9,
    scheduleInterval: 43200, // 12 hours
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: JSON.stringify({ resultsPerPage: 50 }),
  },
  {
    id: "phishtank",
    name: "PhishTank",
    description: "Community-driven phishing URL database",
    sourceUrl: "https://data.phishtank.com/data/online-valid.json",
    sourceType: "json",
    category: "security-research",
    priority: 8,
    scheduleInterval: 14400, // 4 hours
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: JSON.stringify({ maxItems: 100 }),
  },
  {
    id: "urlhaus",
    name: "URLhaus Malware URLs",
    description: "Malware URL database from abuse.ch",
    sourceUrl: "https://urlhaus.abuse.ch/downloads/json_recent/",
    sourceType: "json",
    category: "security-research",
    priority: 8,
    scheduleInterval: 7200, // 2 hours
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: JSON.stringify({ maxItems: 100 }),
  },
  {
    id: "hibp-breaches",
    name: "Have I Been Pwned Breaches",
    description: "Data breach information from HIBP",
    sourceUrl: "https://haveibeenpwned.com/api/v3/breaches",
    sourceType: "api",
    category: "security-research",
    priority: 7,
    scheduleInterval: 86400, // 24 hours
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: null,
  },
  {
    id: "fbi-ic3",
    name: "FBI Internet Crime Complaint Center",
    description: "Internet crime statistics and trends from FBI IC3",
    sourceUrl: "https://www.ic3.gov/",
    sourceType: "html",
    category: "government",
    priority: 9,
    scheduleInterval: 604800, // Weekly
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: null,
  },
  {
    id: "ftc-sentinel",
    name: "FTC Consumer Sentinel",
    description: "Consumer fraud and identity theft data",
    sourceUrl: "https://www.ftc.gov/enforcement/consumer-sentinel-network/reports",
    sourceType: "html",
    category: "government",
    priority: 9,
    scheduleInterval: 604800, // Weekly
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: null,
  },
  {
    id: "mitre-attack",
    name: "MITRE ATT&CK Framework",
    description: "Adversary tactics and techniques",
    sourceUrl: "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json",
    sourceType: "json",
    category: "standards",
    priority: 8,
    scheduleInterval: 604800, // Weekly
    isActive: true,
    requiresAuth: false,
    authConfig: null,
    parserConfig: null,
  },
];

// Generate content hash for deduplication
function generateContentHash(item: RawThreatItem): string {
  const content = JSON.stringify({
    title: item.title,
    summary: item.summary,
    externalId: item.externalId,
  });
  return crypto.createHash("sha256").update(content).digest("hex").substring(0, 32);
}

// Feed Adapters
const adapters: Record<string, () => Promise<RawThreatItem[]>> = {
  "cisa-alerts": async () => {
    try {
      const response = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json", {
        headers: { "User-Agent": "GetCyberRight/1.0 ThreatIntelligence" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      return (data.vulnerabilities || []).slice(0, 50).map((vuln: any) => ({
        externalId: vuln.cveID,
        itemType: "vulnerability",
        title: `${vuln.cveID}: ${vuln.vendorProject} ${vuln.product}`,
        summary: vuln.shortDescription,
        content: JSON.stringify(vuln),
        severity: "high",
        confidence: 95,
        regions: ["US", "GLOBAL"],
        tags: ["cisa", "kev", "vulnerability", vuln.vendorProject?.toLowerCase()].filter(Boolean),
        affectedAudiences: ["business", "educators"],
        sourceUrl: `https://nvd.nist.gov/vuln/detail/${vuln.cveID}`,
        publishedAt: vuln.dateAdded ? new Date(vuln.dateAdded) : new Date(),
      }));
    } catch (error) {
      log(`CISA adapter error: ${error}`, "threat-intel");
      return [];
    }
  },

  "phishtank": async () => {
    try {
      const response = await fetch("https://data.phishtank.com/data/online-valid.json", {
        headers: { 
          "User-Agent": "GetCyberRight/1.0 ThreatIntelligence",
          "Accept": "application/json",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      return (data || []).slice(0, 100).map((phish: any) => ({
        externalId: phish.phish_id?.toString(),
        itemType: "indicator",
        title: `Phishing: ${new URL(phish.url).hostname}`,
        summary: `Verified phishing URL targeting ${phish.target || "unknown"}`,
        content: JSON.stringify({ url: phish.url, target: phish.target }),
        severity: "high",
        confidence: phish.verified === "yes" ? 95 : 70,
        regions: ["GLOBAL"],
        tags: ["phishing", phish.target?.toLowerCase()].filter(Boolean),
        indicators: [phish.url],
        affectedAudiences: ["seniors", "parents", "business"],
        sourceUrl: phish.phish_detail_url,
        publishedAt: phish.submission_time ? new Date(phish.submission_time) : new Date(),
      }));
    } catch (error) {
      log(`PhishTank adapter error: ${error}`, "threat-intel");
      return [];
    }
  },

  "urlhaus": async () => {
    try {
      const response = await fetch("https://urlhaus.abuse.ch/downloads/json_recent/", {
        headers: { "User-Agent": "GetCyberRight/1.0 ThreatIntelligence" },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      const urls = Object.values(data || {}).flat().slice(0, 100);
      return urls.map((url: any) => ({
        externalId: url.id?.toString(),
        itemType: "indicator",
        title: `Malware URL: ${new URL(url.url).hostname}`,
        summary: `${url.threat} malware distribution URL`,
        content: JSON.stringify(url),
        severity: "critical",
        confidence: 90,
        regions: ["GLOBAL"],
        tags: ["malware", url.threat?.toLowerCase(), url.tags?.join(",")].filter(Boolean),
        indicators: [url.url],
        affectedAudiences: ["business", "parents"],
        sourceUrl: url.urlhaus_reference,
        publishedAt: url.dateadded ? new Date(url.dateadded) : new Date(),
      }));
    } catch (error) {
      log(`URLhaus adapter error: ${error}`, "threat-intel");
      return [];
    }
  },

  "hibp-breaches": async () => {
    try {
      const response = await fetch("https://haveibeenpwned.com/api/v3/breaches", {
        headers: { 
          "User-Agent": "GetCyberRight/1.0 ThreatIntelligence",
          "Accept": "application/json",
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      // Get recent breaches (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      return (data || [])
        .filter((breach: any) => new Date(breach.AddedDate) > sixMonthsAgo)
        .slice(0, 50)
        .map((breach: any) => ({
          externalId: breach.Name,
          itemType: "report",
          title: `Data Breach: ${breach.Title}`,
          summary: breach.Description?.replace(/<[^>]*>/g, "").substring(0, 500),
          content: JSON.stringify({
            pwnCount: breach.PwnCount,
            dataClasses: breach.DataClasses,
            domain: breach.Domain,
          }),
          severity: breach.PwnCount > 1000000 ? "critical" : breach.PwnCount > 100000 ? "high" : "medium",
          confidence: breach.IsVerified ? 95 : 70,
          regions: ["GLOBAL"],
          tags: ["breach", "data-leak", ...(breach.DataClasses || []).slice(0, 5)],
          affectedAudiences: ["seniors", "parents", "business", "educators"],
          sourceUrl: `https://haveibeenpwned.com/PwnedWebsites#${breach.Name}`,
          publishedAt: new Date(breach.BreachDate),
        }));
    } catch (error) {
      log(`HIBP adapter error: ${error}`, "threat-intel");
      return [];
    }
  },

  "nvd-cve": async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const pubStartDate = thirtyDaysAgo.toISOString().split("T")[0] + "T00:00:00.000";
      
      const response = await fetch(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?pubStartDate=${pubStartDate}&resultsPerPage=50`,
        { headers: { "User-Agent": "GetCyberRight/1.0 ThreatIntelligence" } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      return (data.vulnerabilities || []).map((item: any) => {
        const cve = item.cve;
        const cvss = cve.metrics?.cvssMetricV31?.[0]?.cvssData || cve.metrics?.cvssMetricV2?.[0]?.cvssData;
        const baseScore = cvss?.baseScore || 0;
        
        let severity = "informational";
        if (baseScore >= 9) severity = "critical";
        else if (baseScore >= 7) severity = "high";
        else if (baseScore >= 4) severity = "medium";
        else if (baseScore > 0) severity = "low";
        
        return {
          externalId: cve.id,
          itemType: "vulnerability",
          title: cve.id,
          summary: cve.descriptions?.find((d: any) => d.lang === "en")?.value?.substring(0, 500),
          content: JSON.stringify({ cvss: cvss, references: cve.references }),
          severity,
          confidence: 95,
          regions: ["GLOBAL"],
          tags: ["cve", "vulnerability", severity],
          affectedAudiences: ["business", "educators"],
          sourceUrl: `https://nvd.nist.gov/vuln/detail/${cve.id}`,
          publishedAt: cve.published ? new Date(cve.published) : new Date(),
        };
      });
    } catch (error) {
      log(`NVD adapter error: ${error}`, "threat-intel");
      return [];
    }
  },

  "mitre-attack": async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json",
        { headers: { "User-Agent": "GetCyberRight/1.0 ThreatIntelligence" } }
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      
      // Extract recent techniques
      const techniques = (data.objects || [])
        .filter((obj: any) => obj.type === "attack-pattern" && !obj.revoked)
        .slice(0, 50);
      
      return techniques.map((tech: any) => ({
        externalId: tech.external_references?.find((r: any) => r.source_name === "mitre-attack")?.external_id,
        itemType: "advisory",
        title: `${tech.external_references?.find((r: any) => r.source_name === "mitre-attack")?.external_id || ""}: ${tech.name}`,
        summary: tech.description?.substring(0, 500),
        content: JSON.stringify({ 
          killChainPhases: tech.kill_chain_phases,
          platforms: tech.x_mitre_platforms,
        }),
        severity: "informational",
        confidence: 100,
        regions: ["GLOBAL"],
        tags: ["mitre", "attack", "technique", ...(tech.x_mitre_platforms || []).slice(0, 3)],
        affectedAudiences: ["business", "educators"],
        sourceUrl: tech.external_references?.find((r: any) => r.source_name === "mitre-attack")?.url,
        publishedAt: tech.modified ? new Date(tech.modified) : new Date(),
      }));
    } catch (error) {
      log(`MITRE ATT&CK adapter error: ${error}`, "threat-intel");
      return [];
    }
  },

  // Placeholder adapters for sources requiring scraping
  "fbi-ic3": async () => {
    // FBI IC3 requires HTML scraping - return curated statistics
    return [{
      externalId: "ic3-2024-stats",
      itemType: "statistic",
      title: "FBI IC3 2024 Internet Crime Report Highlights",
      summary: "Investment fraud led cybercrime losses at $4.57B in 2023, with romance scams and tech support fraud targeting seniors.",
      content: JSON.stringify({
        totalLosses: "$12.5 billion",
        topCrimes: ["Investment Fraud", "Business Email Compromise", "Tech Support Fraud"],
        seniorLosses: "$3.4 billion",
        complaints: 880000,
        year: 2023,
      }),
      severity: "informational",
      confidence: 100,
      regions: ["US"],
      tags: ["ic3", "fbi", "statistics", "annual-report"],
      affectedAudiences: ["seniors", "business", "parents"],
      sourceUrl: "https://www.ic3.gov/Media/PDF/AnnualReport/2023_IC3Report.pdf",
      publishedAt: new Date("2024-03-01"),
    }];
  },

  "ftc-sentinel": async () => {
    // FTC Consumer Sentinel requires HTML scraping - return curated statistics
    return [{
      externalId: "ftc-2024-stats",
      itemType: "statistic",
      title: "FTC Consumer Fraud Report 2024",
      summary: "Consumers reported losing more than $10 billion to fraud in 2023, with imposter scams the #1 fraud type.",
      content: JSON.stringify({
        totalLosses: "$10 billion",
        topFraudTypes: ["Imposter Scams", "Online Shopping", "Prizes/Sweepstakes"],
        contactMethods: ["Phone", "Social Media", "Email"],
        medianLoss: "$500",
        year: 2023,
      }),
      severity: "informational",
      confidence: 100,
      regions: ["US"],
      tags: ["ftc", "consumer", "fraud", "statistics"],
      affectedAudiences: ["seniors", "parents", "business"],
      sourceUrl: "https://www.ftc.gov/reports/consumer-sentinel-network-data-book-2023",
      publishedAt: new Date("2024-02-01"),
    }];
  },
};

// Main Threat Intelligence Service
export class ThreatIntelligenceService {
  private isRunning = false;
  private schedulerInterval: NodeJS.Timeout | null = null;

  async initialize() {
    log("Initializing Threat Intelligence Feed System...", "threat-intel");
    
    // Seed feed registry
    for (const feed of FEED_REGISTRY) {
      const existing = await db.select().from(threatFeeds).where(eq(threatFeeds.id, feed.id)).limit(1);
      if (existing.length === 0) {
        await db.insert(threatFeeds).values(feed);
        log(`Registered feed: ${feed.name}`, "threat-intel");
      }
    }
    
    log("Threat Intelligence Feed System initialized", "threat-intel");
  }

  async startScheduler() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    log("Starting threat intelligence scheduler...", "threat-intel");
    
    // Run immediately on start
    await this.runDueFeeds();
    
    // Schedule checks every 5 minutes
    this.schedulerInterval = setInterval(() => {
      this.runDueFeeds().catch(err => log(`Scheduler error: ${err}`, "threat-intel"));
    }, 5 * 60 * 1000);
  }

  stopScheduler() {
    if (this.schedulerInterval) {
      clearInterval(this.schedulerInterval);
      this.schedulerInterval = null;
    }
    this.isRunning = false;
    log("Threat intelligence scheduler stopped", "threat-intel");
  }

  async runDueFeeds() {
    const now = new Date();
    
    // Get feeds that are due for refresh
    const dueFeeds = await db.select()
      .from(threatFeeds)
      .where(
        and(
          eq(threatFeeds.isActive, true),
          or(
            isNull(threatFeeds.lastSuccessfulRun),
            lt(
              threatFeeds.lastSuccessfulRun,
              sql`NOW() - (${threatFeeds.scheduleInterval} || ' seconds')::interval`
            )
          )
        )
      );
    
    for (const feed of dueFeeds) {
      await this.runFeed(feed.id);
    }
  }

  async runFeed(feedId: string): Promise<FeedRun | null> {
    const feed = await db.select().from(threatFeeds).where(eq(threatFeeds.id, feedId)).limit(1);
    if (feed.length === 0) {
      log(`Feed not found: ${feedId}`, "threat-intel");
      return null;
    }
    
    const feedConfig = feed[0];
    const adapter = adapters[feedId];
    
    if (!adapter) {
      log(`No adapter for feed: ${feedId}`, "threat-intel");
      return null;
    }
    
    // Create run record
    const [run] = await db.insert(feedRuns).values({
      feedId,
      status: "running",
      triggeredBy: "scheduler",
    }).returning();
    
    const startTime = Date.now();
    
    try {
      log(`Running feed: ${feedConfig.name}`, "threat-intel");
      
      // Fetch items
      const rawItems = await adapter();
      
      let ingested = 0;
      let updated = 0;
      let skipped = 0;
      
      for (const rawItem of rawItems) {
        const contentHash = generateContentHash(rawItem);
        
        // Check for existing item
        const existing = await db.select()
          .from(threatItems)
          .where(
            and(
              eq(threatItems.feedId, feedId),
              or(
                eq(threatItems.contentHash, contentHash),
                rawItem.externalId ? eq(threatItems.externalId, rawItem.externalId) : sql`false`
              )
            )
          )
          .limit(1);
        
        if (existing.length > 0) {
          // Update if content changed
          if (existing[0].contentHash !== contentHash) {
            await db.update(threatItems)
              .set({
                ...rawItem,
                contentHash,
                regions: rawItem.regions ? JSON.stringify(rawItem.regions) : null,
                tags: rawItem.tags ? JSON.stringify(rawItem.tags) : null,
                indicators: rawItem.indicators ? JSON.stringify(rawItem.indicators) : null,
                affectedAudiences: rawItem.affectedAudiences ? JSON.stringify(rawItem.affectedAudiences) : null,
                updatedAt: new Date(),
              })
              .where(eq(threatItems.id, existing[0].id));
            updated++;
          } else {
            skipped++;
          }
        } else {
          // Insert new item
          await db.insert(threatItems).values({
            feedId,
            externalId: rawItem.externalId,
            contentHash,
            itemType: rawItem.itemType,
            title: rawItem.title,
            summary: rawItem.summary,
            content: rawItem.content,
            severity: rawItem.severity,
            confidence: rawItem.confidence,
            regions: rawItem.regions ? JSON.stringify(rawItem.regions) : null,
            tags: rawItem.tags ? JSON.stringify(rawItem.tags) : null,
            indicators: rawItem.indicators ? JSON.stringify(rawItem.indicators) : null,
            affectedAudiences: rawItem.affectedAudiences ? JSON.stringify(rawItem.affectedAudiences) : null,
            sourceUrl: rawItem.sourceUrl,
            publishedAt: rawItem.publishedAt,
            expiresAt: rawItem.expiresAt,
          });
          ingested++;
        }
      }
      
      const durationMs = Date.now() - startTime;
      
      // Update run record
      await db.update(feedRuns)
        .set({
          status: "success",
          completedAt: new Date(),
          itemsIngested: ingested,
          itemsUpdated: updated,
          itemsSkipped: skipped,
          durationMs,
        })
        .where(eq(feedRuns.id, run.id));
      
      // Update feed metadata
      const totalItems = await db.select({ count: sql<number>`count(*)` })
        .from(threatItems)
        .where(eq(threatItems.feedId, feedId));
      
      await db.update(threatFeeds)
        .set({
          lastSuccessfulRun: new Date(),
          lastAttemptedRun: new Date(),
          lastError: null,
          itemCount: totalItems[0]?.count || 0,
          updatedAt: new Date(),
        })
        .where(eq(threatFeeds.id, feedId));
      
      log(`Feed ${feedConfig.name} completed: ${ingested} new, ${updated} updated, ${skipped} skipped in ${durationMs}ms`, "threat-intel");
      
      return { ...run, status: "success", itemsIngested: ingested, itemsUpdated: updated, itemsSkipped: skipped };
      
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      
      // Update run record with error
      await db.update(feedRuns)
        .set({
          status: "failed",
          completedAt: new Date(),
          errorMessage: error.message,
          durationMs,
        })
        .where(eq(feedRuns.id, run.id));
      
      // Update feed with error
      await db.update(threatFeeds)
        .set({
          lastAttemptedRun: new Date(),
          lastError: error.message,
          updatedAt: new Date(),
        })
        .where(eq(threatFeeds.id, feedId));
      
      // Create health alert
      await db.insert(feedHealthAlerts).values({
        feedId,
        alertType: "error",
        severity: "warning",
        message: `Feed ingestion failed: ${error.message}`,
      });
      
      log(`Feed ${feedConfig.name} failed: ${error.message}`, "threat-intel");
      return null;
    }
  }

  // Query methods for API
  async getAllFeeds(): Promise<ThreatFeed[]> {
    return db.select().from(threatFeeds).orderBy(desc(threatFeeds.priority));
  }

  async getFeedRuns(feedId: string, limit = 10): Promise<FeedRun[]> {
    return db.select()
      .from(feedRuns)
      .where(eq(feedRuns.feedId, feedId))
      .orderBy(desc(feedRuns.startedAt))
      .limit(limit);
  }

  async getRecentItems(options: {
    limit?: number;
    feedId?: string;
    itemType?: string;
    severity?: string;
    audience?: string;
  } = {}): Promise<ThreatItem[]> {
    const { limit = 50, feedId, itemType, severity } = options;
    
    const conditions = [eq(threatItems.isActive, true)];
    
    if (feedId) {
      conditions.push(eq(threatItems.feedId, feedId));
    }
    if (itemType) {
      conditions.push(eq(threatItems.itemType, itemType));
    }
    if (severity) {
      conditions.push(eq(threatItems.severity, severity));
    }
    
    return db.select()
      .from(threatItems)
      .where(and(...conditions))
      .orderBy(desc(threatItems.publishedAt))
      .limit(limit);
  }

  async getStats(): Promise<{
    totalFeeds: number;
    activeFeeds: number;
    totalItems: number;
    recentItems24h: number;
    healthyFeeds: number;
    staleFeeds: number;
    criticalItems: number;
  }> {
    const [feedStats] = await db.select({
      totalFeeds: sql<number>`count(*)`,
      activeFeeds: sql<number>`sum(case when ${threatFeeds.isActive} then 1 else 0 end)`,
    }).from(threatFeeds);
    
    const [itemStats] = await db.select({
      totalItems: sql<number>`count(*)`,
      recentItems24h: sql<number>`sum(case when ${threatItems.ingestedAt} > NOW() - interval '24 hours' then 1 else 0 end)`,
      criticalItems: sql<number>`sum(case when ${threatItems.severity} = 'critical' then 1 else 0 end)`,
    }).from(threatItems);
    
    // Count healthy vs stale feeds (stale = no successful run in 2x schedule interval)
    const [healthStats] = await db.select({
      healthyFeeds: sql<number>`sum(case when ${threatFeeds.lastSuccessfulRun} > NOW() - (${threatFeeds.scheduleInterval} * 2 || ' seconds')::interval then 1 else 0 end)`,
      staleFeeds: sql<number>`sum(case when ${threatFeeds.lastSuccessfulRun} <= NOW() - (${threatFeeds.scheduleInterval} * 2 || ' seconds')::interval or ${threatFeeds.lastSuccessfulRun} is null then 1 else 0 end)`,
    }).from(threatFeeds).where(eq(threatFeeds.isActive, true));
    
    return {
      totalFeeds: feedStats?.totalFeeds || 0,
      activeFeeds: feedStats?.activeFeeds || 0,
      totalItems: itemStats?.totalItems || 0,
      recentItems24h: itemStats?.recentItems24h || 0,
      criticalItems: itemStats?.criticalItems || 0,
      healthyFeeds: healthStats?.healthyFeeds || 0,
      staleFeeds: healthStats?.staleFeeds || 0,
    };
  }

  async getHealthAlerts(resolved = false): Promise<any[]> {
    if (resolved) {
      return db.select().from(feedHealthAlerts).orderBy(desc(feedHealthAlerts.createdAt)).limit(50);
    }
    return db.select()
      .from(feedHealthAlerts)
      .where(isNull(feedHealthAlerts.resolvedAt))
      .orderBy(desc(feedHealthAlerts.createdAt));
  }

  async acknowledgeAlert(alertId: string) {
    return db.update(feedHealthAlerts)
      .set({ acknowledgedAt: new Date() })
      .where(eq(feedHealthAlerts.id, alertId));
  }

  async resolveAlert(alertId: string) {
    return db.update(feedHealthAlerts)
      .set({ resolvedAt: new Date() })
      .where(eq(feedHealthAlerts.id, alertId));
  }
}

// Singleton instance
export const threatIntelService = new ThreatIntelligenceService();
