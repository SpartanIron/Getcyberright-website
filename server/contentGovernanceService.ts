import { db } from "./db";
import { contentPages, contentAuditLog, threatItems, ContentPage } from "@shared/schema";
import { eq, desc, and, gte, sql, inArray } from "drizzle-orm";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

  async generateContentRefresh(pageId: string): Promise<{
    pageTitle: string;
    currentTopics: string[];
    relatedThreats: Array<{ title: string; description: string; source: string; severity: string }>;
    recommendations: string[];
    suggestedUpdates: string;
    urgency: "low" | "medium" | "high" | "critical";
  }> {
    const pages = await db.select().from(contentPages).where(eq(contentPages.id, pageId));
    if (pages.length === 0) {
      throw new Error("Page not found");
    }
    
    const page = pages[0];
    
    // Get related threats for this page's topics
    const allThreats = await db.select().from(threatItems)
      .orderBy(desc(threatItems.ingestedAt))
      .limit(500);
    
    const pageTopics = page.topics || [];
    const relatedThreats: Array<{ title: string; description: string; source: string; severity: string }> = [];
    
    for (const threat of allThreats) {
      const threatText = `${threat.title} ${threat.summary || ""}`.toLowerCase();
      
      for (const topic of pageTopics) {
        const keywords = TOPIC_KEYWORDS[topic] || [topic];
        const matches = keywords.some(kw => threatText.includes(kw.toLowerCase()));
        
        if (matches) {
          relatedThreats.push({
            title: threat.title,
            description: threat.summary || "",
            source: threat.feedId,
            severity: threat.severity || "medium",
          });
          break;
        }
      }
      
      if (relatedThreats.length >= 10) break;
    }
    
    // Determine urgency based on threat count and severity
    let urgency: "low" | "medium" | "high" | "critical" = "low";
    const criticalCount = relatedThreats.filter(t => t.severity === "critical").length;
    const highCount = relatedThreats.filter(t => t.severity === "high").length;
    
    if (criticalCount >= 3 || page.relatedThreatCount! >= 200) urgency = "critical";
    else if (criticalCount >= 1 || highCount >= 3 || page.relatedThreatCount! >= 100) urgency = "high";
    else if (highCount >= 1 || page.relatedThreatCount! >= 20) urgency = "medium";
    
    // Generate AI recommendations if OpenAI key is available
    let recommendations: string[] = [];
    let suggestedUpdates = "";
    
    if (process.env.OPENAI_API_KEY && relatedThreats.length > 0) {
      try {
        const threatSummary = relatedThreats.slice(0, 5).map(t => 
          `- ${t.title}: ${t.description.substring(0, 150)}...`
        ).join("\n");
        
        const prompt = `You are a cybersecurity education content specialist. Analyze these recent threats and provide content update recommendations for a page titled "${page.title}" that covers topics: ${pageTopics.join(", ")}.

Recent threats affecting this page's topics:
${threatSummary}

Target audience: ${page.audience}

Provide your response as JSON with this format:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "suggestedUpdates": "A brief paragraph describing what content sections should be updated and what new information to add"
}

Focus on practical, actionable updates that help the ${page.audience} audience protect themselves.`;

        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          max_completion_tokens: 1024,
        });
        
        const result = JSON.parse(response.choices[0].message.content || "{}");
        recommendations = result.recommendations || [];
        suggestedUpdates = result.suggestedUpdates || "";
      } catch (error: any) {
        console.error("[content-governance] AI recommendation error:", error.message);
        recommendations = [
          `Review and update content based on ${relatedThreats.length} new related threats`,
          `Ensure examples reflect current attack patterns`,
          `Update protective measures section with latest guidance`,
        ];
        suggestedUpdates = `This page has ${page.relatedThreatCount} new threats matching its topics. Review the threat intelligence feed and update the educational content to address these new attack vectors.`;
      }
    } else {
      recommendations = [
        `Review and update content based on ${relatedThreats.length} new related threats`,
        `Ensure examples reflect current attack patterns`,
        `Update protective measures section with latest guidance`,
      ];
      suggestedUpdates = `This page has ${page.relatedThreatCount} new threats matching its topics. Review the threat intelligence feed and update the educational content to address these new attack vectors.`;
    }
    
    return {
      pageTitle: page.title,
      currentTopics: pageTopics,
      relatedThreats,
      recommendations,
      suggestedUpdates,
      urgency,
    };
  }

  async applyContentRefresh(pageId: string, adminId: string, notes: string): Promise<void> {
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
      action: "refreshed",
      triggeredBy: "admin",
      notes: notes || "Content refreshed with AI-generated recommendations",
      previousScore: page.freshnessScore,
      newScore: 100,
      performedBy: adminId,
    });
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
