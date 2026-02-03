import { db } from "./db";
import { contentPages, contentAuditLog, threatItems, ContentPage } from "@shared/schema";
import { eq, desc, and, gte, sql, inArray } from "drizzle-orm";

// Topic categories that map threat types to content topics
const TOPIC_KEYWORDS: Record<string, string[]> = {
  phishing: ["phishing", "email scam", "fake email", "credential theft", "spear phishing"],
  malware: ["malware", "virus", "ransomware", "trojan", "spyware", "adware"],
  "identity-theft": ["identity theft", "identity fraud", "personal information", "pii", "ssn"],
  "social-engineering": ["social engineering", "manipulation", "impersonation", "pretexting"],
  "voice-cloning": ["voice clone", "deepfake", "ai voice", "synthetic voice", "voice scam"],
  "romance-scams": ["romance scam", "dating scam", "catfish", "love scam"],
  "tech-support": ["tech support scam", "remote access", "microsoft scam", "apple scam"],
  "financial-fraud": ["financial fraud", "investment scam", "cryptocurrency scam", "pig butchering"],
  "child-safety": ["grooming", "child safety", "predator", "online predator", "csam"],
  "password-security": ["password", "credential", "authentication", "mfa", "2fa"],
  "data-breach": ["data breach", "leak", "exposed data", "compromised"],
  "ai-threats": ["ai threat", "chatgpt scam", "ai-generated", "deepfake"],
};

// Content pages registry - all educational pages on the platform
const CONTENT_PAGES_REGISTRY: Array<{
  id: string;
  title: string;
  path: string;
  section: string;
  audience: string;
  topics: string[];
}> = [
  // Kids Section
  { id: "kids-main", title: "Kids Digital Safety Hub", path: "/kids", section: "kids", audience: "kids", topics: ["child-safety", "password-security", "social-engineering", "phishing"] },
  
  // Seniors Section
  { id: "seniors-main", title: "Seniors Digital Safety Hub", path: "/seniors", section: "seniors", audience: "seniors", topics: ["phishing", "romance-scams", "tech-support", "financial-fraud", "voice-cloning"] },
  
  // Parents Section
  { id: "parents-main", title: "Parents Digital Safety Hub", path: "/parents", section: "parents", audience: "parents", topics: ["child-safety", "social-engineering", "password-security"] },
  { id: "child-safety-scanner", title: "Child Safety Conversation Scanner", path: "/parents/child-safety-scanner", section: "parents", audience: "parents", topics: ["child-safety", "social-engineering"] },
  
  // Educators Section
  { id: "educators-main", title: "Educators Digital Safety Hub", path: "/educators", section: "educators", audience: "educators", topics: ["child-safety", "phishing", "password-security", "social-engineering"] },
  
  // Small Business Section
  { id: "business-main", title: "Small Business Cybersecurity Hub", path: "/small-business", section: "small-business", audience: "business", topics: ["phishing", "malware", "data-breach", "password-security", "financial-fraud"] },
  
  // AI Safety
  { id: "ai-safety", title: "AI & Cyber Safety Hub", path: "/ai-safety", section: "general", audience: "all", topics: ["ai-threats", "voice-cloning", "phishing", "social-engineering"] },
  
  // Tools Section
  { id: "scam-checker", title: "Scam Checker Tool", path: "/tools", section: "tools", audience: "all", topics: ["phishing", "malware", "identity-theft"] },
  { id: "emergency-help", title: "Emergency Help & Resources", path: "/emergency-help", section: "general", audience: "all", topics: ["identity-theft", "financial-fraud", "romance-scams"] },
  { id: "threat-trends", title: "Current Threat Trends", path: "/threat-trends", section: "general", audience: "all", topics: ["phishing", "malware", "identity-theft", "ai-threats", "voice-cloning"] },
  
  // Security Pages
  { id: "security-overview", title: "Security Best Practices", path: "/security", section: "general", audience: "all", topics: ["password-security", "phishing", "malware", "data-breach"] },
  { id: "checklists", title: "Security Checklists", path: "/checklists", section: "general", audience: "all", topics: ["password-security", "identity-theft", "phishing"] },
  
  // Resources
  { id: "resources", title: "Cybersecurity Resources", path: "/resources", section: "general", audience: "all", topics: ["phishing", "malware", "identity-theft", "password-security"] },
];

export class ContentGovernanceService {
  
  async initialize(): Promise<void> {
    console.log("[content-governance] Initializing Content Governance System...");
    await this.seedContentPages();
    console.log("[content-governance] Content Governance System initialized");
  }

  async seedContentPages(): Promise<void> {
    for (const page of CONTENT_PAGES_REGISTRY) {
      const existing = await db.select().from(contentPages).where(eq(contentPages.id, page.id));
      
      if (existing.length === 0) {
        await db.insert(contentPages).values({
          id: page.id,
          title: page.title,
          path: page.path,
          section: page.section,
          audience: page.audience,
          topics: page.topics,
          freshnessScore: 100,
          priorityLevel: "normal",
          needsReview: false,
          lastManualUpdate: new Date(),
        });
        console.log(`[content-governance] Registered content page: ${page.title}`);
      }
    }
  }

  async getAllPages(): Promise<ContentPage[]> {
    return db.select().from(contentPages).orderBy(contentPages.freshnessScore);
  }

  async getPagesNeedingReview(): Promise<ContentPage[]> {
    return db.select().from(contentPages)
      .where(eq(contentPages.needsReview, true))
      .orderBy(desc(contentPages.relatedThreatCount));
  }

  async getPagesBySection(section: string): Promise<ContentPage[]> {
    return db.select().from(contentPages)
      .where(eq(contentPages.section, section))
      .orderBy(contentPages.freshnessScore);
  }

  async getGovernanceStats(): Promise<{
    totalPages: number;
    pagesNeedingReview: number;
    averageFreshness: number;
    criticalPages: number;
    highPriorityPages: number;
    recentlyUpdated: number;
    topicCoverage: Record<string, number>;
  }> {
    const allPages = await db.select().from(contentPages);
    
    const pagesNeedingReview = allPages.filter(p => p.needsReview);
    const criticalPages = allPages.filter(p => p.priorityLevel === "critical");
    const highPriorityPages = allPages.filter(p => p.priorityLevel === "high");
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyUpdated = allPages.filter(p => 
      p.lastManualUpdate && new Date(p.lastManualUpdate) > sevenDaysAgo
    );
    
    const avgFreshness = allPages.length > 0 
      ? Math.round(allPages.reduce((sum, p) => sum + (p.freshnessScore || 100), 0) / allPages.length)
      : 100;

    // Count pages per topic
    const topicCoverage: Record<string, number> = {};
    for (const page of allPages) {
      for (const topic of page.topics || []) {
        topicCoverage[topic] = (topicCoverage[topic] || 0) + 1;
      }
    }

    return {
      totalPages: allPages.length,
      pagesNeedingReview: pagesNeedingReview.length,
      averageFreshness: avgFreshness,
      criticalPages: criticalPages.length,
      highPriorityPages: highPriorityPages.length,
      recentlyUpdated: recentlyUpdated.length,
      topicCoverage,
    };
  }

  async calculateFreshnessScore(pageId: string): Promise<number> {
    const pages = await db.select().from(contentPages).where(eq(contentPages.id, pageId));
    if (pages.length === 0) return 100;
    
    const page = pages[0];
    let score = 100;
    
    // Factor 1: Time since last manual update (max -30 points)
    if (page.lastManualUpdate) {
      const daysSinceUpdate = Math.floor(
        (Date.now() - new Date(page.lastManualUpdate).getTime()) / (1000 * 60 * 60 * 24)
      );
      // Lose 1 point per week, max 30
      score -= Math.min(30, Math.floor(daysSinceUpdate / 7));
    }
    
    // Factor 2: Related threat count (max -40 points for high threat activity)
    const threatCount = page.relatedThreatCount || 0;
    if (threatCount > 0) {
      // More recent threats = lower score
      score -= Math.min(40, threatCount * 2);
    }
    
    // Factor 3: Time since last threat match (max -30 points)
    if (page.lastThreatMatch) {
      const daysSinceMatch = Math.floor(
        (Date.now() - new Date(page.lastThreatMatch).getTime()) / (1000 * 60 * 60 * 24)
      );
      // If threats matched recently, content may be stale
      if (daysSinceMatch < 7) {
        score -= 30;
      } else if (daysSinceMatch < 30) {
        score -= 15;
      }
    }
    
    return Math.max(0, Math.min(100, score));
  }

  async updateFreshnessScores(): Promise<void> {
    const pages = await db.select().from(contentPages);
    
    for (const page of pages) {
      const newScore = await this.calculateFreshnessScore(page.id);
      const needsReview = newScore < 70 || (page.relatedThreatCount || 0) > 5;
      const priorityLevel = this.determinePriorityLevel(newScore, page.relatedThreatCount || 0);
      
      await db.update(contentPages)
        .set({ 
          freshnessScore: newScore,
          needsReview,
          priorityLevel,
          updatedAt: new Date(),
        })
        .where(eq(contentPages.id, page.id));
    }
  }

  determinePriorityLevel(freshnessScore: number, threatCount: number): string {
    if (freshnessScore < 30 || threatCount > 20) return "critical";
    if (freshnessScore < 50 || threatCount > 10) return "high";
    if (freshnessScore < 70 || threatCount > 5) return "normal";
    return "low";
  }

  async matchThreatsToContent(): Promise<{ pageId: string; matchedThreats: number }[]> {
    const pages = await db.select().from(contentPages);
    const results: { pageId: string; matchedThreats: number }[] = [];
    
    // Get threats from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentThreats = await db.select().from(threatItems)
      .where(gte(threatItems.publishedAt, sevenDaysAgo));
    
    for (const page of pages) {
      let matchCount = 0;
      const pageTopics = page.topics || [];
      
      for (const threat of recentThreats) {
        const threatText = `${threat.title} ${threat.summary}`.toLowerCase();
        
        for (const topic of pageTopics) {
          const keywords = TOPIC_KEYWORDS[topic] || [topic];
          const hasMatch = keywords.some(kw => threatText.includes(kw.toLowerCase()));
          
          if (hasMatch) {
            matchCount++;
            break;
          }
        }
      }
      
      if (matchCount > 0) {
        const previousCount = page.relatedThreatCount || 0;
        const needsReview = matchCount > 3 || (previousCount === 0 && matchCount > 0);
        
        await db.update(contentPages)
          .set({
            relatedThreatCount: matchCount,
            lastThreatMatch: new Date(),
            needsReview: needsReview || page.needsReview,
            reviewReason: needsReview 
              ? `${matchCount} new threats detected matching content topics`
              : page.reviewReason,
            updatedAt: new Date(),
          })
          .where(eq(contentPages.id, page.id));
        
        results.push({ pageId: page.id, matchedThreats: matchCount });
      }
    }
    
    // Update all freshness scores after threat matching
    await this.updateFreshnessScores();
    
    return results;
  }

  async markPageReviewed(pageId: string, adminId: string, notes?: string): Promise<void> {
    const pages = await db.select().from(contentPages).where(eq(contentPages.id, pageId));
    if (pages.length === 0) return;
    
    const page = pages[0];
    
    await db.update(contentPages)
      .set({
        needsReview: false,
        reviewReason: null,
        freshnessScore: 100,
        relatedThreatCount: 0,
        lastManualUpdate: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(contentPages.id, pageId));
    
    await db.insert(contentAuditLog).values({
      pageId,
      action: "reviewed",
      triggeredBy: "admin",
      notes,
      previousScore: page.freshnessScore,
      newScore: 100,
      performedBy: adminId,
    });
  }

  async dismissReviewFlag(pageId: string, adminId: string, notes?: string): Promise<void> {
    const pages = await db.select().from(contentPages).where(eq(contentPages.id, pageId));
    if (pages.length === 0) return;
    
    await db.update(contentPages)
      .set({
        needsReview: false,
        reviewReason: null,
        updatedAt: new Date(),
      })
      .where(eq(contentPages.id, pageId));
    
    await db.insert(contentAuditLog).values({
      pageId,
      action: "dismissed",
      triggeredBy: "admin",
      notes,
      performedBy: adminId,
    });
  }

  async getAuditLog(limit: number = 50): Promise<any[]> {
    return db.select().from(contentAuditLog)
      .orderBy(desc(contentAuditLog.createdAt))
      .limit(limit);
  }

  async getPageAuditLog(pageId: string): Promise<any[]> {
    return db.select().from(contentAuditLog)
      .where(eq(contentAuditLog.pageId, pageId))
      .orderBy(desc(contentAuditLog.createdAt));
  }

  async runFullAudit(): Promise<{
    pagesScanned: number;
    threatsMatched: number;
    pagesNeedingReview: number;
  }> {
    console.log("[content-governance] Running full content audit...");
    
    const matchResults = await this.matchThreatsToContent();
    const stats = await this.getGovernanceStats();
    
    console.log(`[content-governance] Audit complete: ${stats.totalPages} pages scanned, ${stats.pagesNeedingReview} need review`);
    
    return {
      pagesScanned: stats.totalPages,
      threatsMatched: matchResults.reduce((sum, r) => sum + r.matchedThreats, 0),
      pagesNeedingReview: stats.pagesNeedingReview,
    };
  }
}

export const contentGovernanceService = new ContentGovernanceService();
