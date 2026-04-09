import { db } from "./db";
import { securityAlerts } from "@shared/schema";
import { eq } from "drizzle-orm";

interface AlertFeed {
  url: string;
  name: string;
  category: string;
}

interface ParsedAlert {
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  source: string;
  sourceUrl: string;
  affectedSystems?: string;
  recommendations?: string;
  publishedAt: Date;
}

class SecurityAlertFetcher {
  private isRunning = false;
  private refreshInterval: NodeJS.Timeout | null = null;
  private readonly REFRESH_INTERVAL = 30 * 60 * 1000;
  
  private readonly alertFeeds: AlertFeed[] = [
    { url: "https://www.cisa.gov/cybersecurity-advisories/all.xml", name: "CISA Advisories", category: "advisory" },
    { url: "https://www.cisa.gov/news.xml", name: "CISA News", category: "advisory" },
    { url: "https://www.us-cert.gov/ncas/alerts.xml", name: "US-CERT Alerts", category: "vulnerability" },
  ];

  startScheduler(): void {
    console.log("[SecurityAlertFetcher] Starting scheduler (every 30 minutes)");
    this.fetchAlerts();
    this.refreshInterval = setInterval(() => {
      this.fetchAlerts();
    }, this.REFRESH_INTERVAL);
  }

  stopScheduler(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  async fetchAlerts(): Promise<void> {
    if (this.isRunning) {
      console.log("[SecurityAlertFetcher] Already running, skipping...");
      return;
    }

    this.isRunning = true;
    console.log("[SecurityAlertFetcher] Starting security alert fetch...");

    try {
      const allAlerts: ParsedAlert[] = [];

      for (const feed of this.alertFeeds) {
        try {
          const alerts = await this.fetchFeed(feed);
          allAlerts.push(...alerts);
          await this.delay(1000);
        } catch (error) {
          console.log(`[SecurityAlertFetcher] Failed to fetch ${feed.name}:`, error);
        }
      }

      console.log(`[SecurityAlertFetcher] Fetched ${allAlerts.length} alerts from all feeds`);

      let newCount = 0;
      for (const alert of allAlerts) {
        const exists = await this.alertExists(alert.title, alert.sourceUrl);
        if (!exists) {
          await this.saveAlert(alert);
          newCount++;
        }
      }

      console.log(`[SecurityAlertFetcher] Added ${newCount} new alerts`);
    } catch (error) {
      console.error("[SecurityAlertFetcher] Error:", error);
    } finally {
      this.isRunning = false;
    }
  }

  private async fetchFeed(feed: AlertFeed): Promise<ParsedAlert[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(feed.url, {
        headers: {
          "User-Agent": "GetCyberRight Security Monitor/1.0",
          "Accept": "application/rss+xml, application/xml, text/xml, */*"
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.log(`[SecurityAlertFetcher] HTTP ${response.status} for ${feed.name}`);
        return [];
      }

      const xmlText = await response.text();
      return this.parseRSS(xmlText, feed);
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        console.log(`[SecurityAlertFetcher] Timeout fetching ${feed.name}`);
      }
      return [];
    }
  }

  private parseRSS(xmlText: string, feed: AlertFeed): ParsedAlert[] {
    const alerts: ParsedAlert[] = [];
    const cleanXml = xmlText.replace(/\n\s*\n/g, "\n").trim();

    const itemMatches = cleanXml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) ||
                        cleanXml.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) || [];

    for (const itemXml of itemMatches.slice(0, 20)) {
      try {
        let title = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
        if (title) title = this.cleanText(title);

        let description = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
                         itemXml.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ||
                         itemXml.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1];
        if (description) description = this.cleanText(description).substring(0, 1000);

        let link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ||
                   itemXml.match(/<link[^>]*href=["'](.*?)["'][^>]*>/i)?.[1] ||
                   itemXml.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i)?.[1];

        const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ||
                        itemXml.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1];

        if (title && link) {
          const severity = this.determineSeverity(title, description || "");
          const category = this.determineCategory(title, description || "", feed.category);

          alerts.push({
            title,
            description: description || title,
            severity,
            category,
            source: feed.name,
            sourceUrl: link,
            publishedAt: pubDate ? new Date(pubDate.trim()) : new Date()
          });
        }
      } catch (error) {
        continue;
      }
    }

    console.log(`[SecurityAlertFetcher] Parsed ${alerts.length} alerts from ${feed.name}`);
    return alerts;
  }

  private determineSeverity(title: string, description: string): "critical" | "high" | "medium" | "low" | "info" {
    const text = (title + " " + description).toLowerCase();
    
    if (text.includes("critical") || text.includes("emergency") || text.includes("actively exploited") || 
        text.includes("zero-day") || text.includes("0-day") || text.includes("urgent")) {
      return "critical";
    }
    if (text.includes("high") || text.includes("severe") || text.includes("important") || 
        text.includes("ransomware") || text.includes("remote code execution") || text.includes("rce")) {
      return "high";
    }
    if (text.includes("medium") || text.includes("moderate") || text.includes("vulnerability")) {
      return "medium";
    }
    if (text.includes("low") || text.includes("minor") || text.includes("informational")) {
      return "low";
    }
    return "info";
  }

  private determineCategory(title: string, description: string, defaultCategory: string): string {
    const text = (title + " " + description).toLowerCase();
    
    if (text.includes("breach") || text.includes("data leak") || text.includes("compromised")) {
      return "breach";
    }
    if (text.includes("vulnerability") || text.includes("cve-") || text.includes("exploit") || text.includes("patch")) {
      return "vulnerability";
    }
    if (text.includes("phishing") || text.includes("credential") || text.includes("social engineering")) {
      return "phishing";
    }
    if (text.includes("malware") || text.includes("ransomware") || text.includes("trojan") || text.includes("virus")) {
      return "malware";
    }
    if (text.includes("scam") || text.includes("fraud") || text.includes("impersonation")) {
      return "scam";
    }
    return defaultCategory;
  }

  private cleanText(text: string): string {
    return text
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/<[^>]*>/g, "")
      .trim();
  }

  private async alertExists(title: string, sourceUrl: string): Promise<boolean> {
    const existing = await db.select()
      .from(securityAlerts)
      .where(eq(securityAlerts.sourceUrl, sourceUrl))
      .limit(1);
    return existing.length > 0;
  }

  private async saveAlert(alert: ParsedAlert): Promise<void> {
    await db.insert(securityAlerts).values({
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      category: alert.category,
      source: alert.source,
      sourceUrl: alert.sourceUrl,
      affectedSystems: alert.affectedSystems || null,
      recommendations: alert.recommendations || null,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const securityAlertFetcher = new SecurityAlertFetcher();
