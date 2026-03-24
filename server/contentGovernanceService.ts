import { db } from "./db";
import { contentPages, contentAuditLog, threatItems, ContentPage } from "@shared/schema";
import { eq, desc, and, gte, sql, inArray } from "drizzle-orm";
import Anthropic from "@anthropic-ai/sdk";
import { ContentGuardrails } from "@shared/contentGuardrails";

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

// Content integrity guardrails and validation functions
const AI_GUARDRAILS = {
  // System prompt with comprehensive guardrails for content integrity
  systemPrompt: `You are a cybersecurity education content specialist working for GetCyberRight, a platform that helps families, seniors, and businesses stay safe online.

CRITICAL CONTENT INTEGRITY REQUIREMENTS:

1. TRUTHFULNESS AND ACCURACY:
   - Only provide information that is factually accurate and verifiable
   - Base all recommendations on the provided threat intelligence data
   - Never fabricate statistics, dates, or specific incident details
   - If uncertain about a fact, use qualifying language like "reports suggest" or "evidence indicates"
   - Cite the source feed when referencing specific threats

2. VERIFIABILITY:
   - Every recommendation must be traceable to the provided threat data
   - Do not invent threat actors, campaigns, or attack techniques not mentioned in the input
   - Reference authoritative cybersecurity sources (CISA, FBI, FTC) when applicable
   - Use established cybersecurity terminology correctly

3. ANTI-HALLUCINATION MEASURES:
   - Do not create fictional examples or scenarios not grounded in the threat data
   - Do not attribute quotes or statements to individuals or organizations
   - Do not invent technical details, CVE numbers, or vulnerability specifics
   - Stay within the scope of the provided information

4. WRITING QUALITY STANDARDS:
   - Use proper sentence structure with complete sentences
   - Apply correct punctuation including periods, commas, and quotation marks
   - Never use dashes or hyphens to separate clauses; use commas, semicolons, or separate sentences instead
   - Write in clear, accessible language appropriate for the target audience
   - Avoid jargon unless necessary, and explain technical terms when used
   - Use active voice and direct language
   - Keep sentences concise and focused

5. AUDIENCE APPROPRIATENESS:
   - Adapt complexity based on the target audience (kids, seniors, parents, educators, businesses)
   - For kids: Use simple language and relatable examples
   - For seniors: Avoid technical jargon and provide step by step guidance
   - For businesses: Include compliance and risk management considerations

6. INNOVATION AND VALUE:
   - Provide actionable, practical recommendations
   - Focus on protective measures users can implement immediately
   - Suggest educational content improvements that address emerging threats
   - Prioritize high impact changes based on threat severity`,

  // Validation and sanitization functions
  validateRecommendations(recommendations: string[]): string[] {
    return recommendations
      .filter(rec => rec && rec.trim().length > 10) // Remove empty or too short
      .map(rec => this.sanitizeText(rec))
      .slice(0, 10); // Limit to 10 recommendations
  },

  sanitizeText(text: string): string {
    if (!text) return "";
    
    return text
      // Remove dashes used as separators (but keep hyphens in compound words like "well-known")
      .replace(/\s+[-–—]\s+/g, "; ")
      .replace(/^[-–—]\s+/gm, "")
      // Fix sentence structure
      .replace(/\s{2,}/g, " ")
      // Ensure proper punctuation
      .replace(/([a-z])([A-Z])/g, "$1. $2")
      // Remove any markdown formatting
      .replace(/[*_`#]/g, "")
      // Clean up any remaining issues
      .trim();
  },

  validateSuggestedUpdates(text: string): string {
    if (!text) return "";
    
    let sanitized = this.sanitizeText(text);
    
    // Ensure it ends with proper punctuation
    if (!/[.!?]$/.test(sanitized)) {
      sanitized += ".";
    }
    
    // Limit length for UI display
    if (sanitized.length > 1000) {
      sanitized = sanitized.substring(0, 997) + "...";
    }
    
    return sanitized;
  },

  // Check for potential hallucination indicators
  detectPotentialHallucination(text: string, providedThreats: string[]): boolean {
    const hallucginationIndicators = [
      /according to.*\d{4}\s+report/i,
      /studies show that \d+%/i,
      /\b(CVE-\d{4}-\d+)\b/i, // Specific CVE numbers not in input
      /\b(APT-?\d+)\b/i, // Specific APT groups
      /said\s+["'][^"']+["']/i, // Direct quotes
      /on\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d+,\s+\d{4}/i,
    ];
    
    for (const pattern of hallucginationIndicators) {
      if (pattern.test(text)) {
        // Check if the matched content exists in provided threats
        const match = text.match(pattern);
        if (match && !providedThreats.some(t => t.toLowerCase().includes(match[0].toLowerCase()))) {
          return true; // Potential hallucination detected
        }
      }
    }
    
    return false;
  },
};

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
  { id: "scam-checker", title: "GCR Scam Guard", path: "/tools", section: "tools", audience: "all", topics: ["phishing", "malware", "identity-theft"] },
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
    generatedContent: {
      sections: Array<{
        title: string;
        content: string;
        type: "new" | "update";
      }>;
      summary: string;
    } | null;
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
    let generatedContent: {
      sections: Array<{ title: string; content: string; type: "new" | "update" }>;
      summary: string;
    } | null = null;
    
    if (relatedThreats.length > 0) {
      try {
        const threatSummary = relatedThreats.slice(0, 5).map(t => 
          `Source: ${t.source} | Severity: ${t.severity} | ${t.title}: ${t.description.substring(0, 150)}`
        ).join("\n");
        
        const userPrompt = `Analyze the following verified threat intelligence data and generate ACTUAL CONTENT to add or update on the page titled "${page.title}" that covers these topics: ${pageTopics.join(", ")}.

VERIFIED THREAT INTELLIGENCE DATA (from our threat feeds):
${threatSummary}

TARGET AUDIENCE: ${page.audience}

TASK: Based ONLY on the threat data provided above, generate:
1. Brief recommendations for content updates
2. ACTUAL CONTENT SECTIONS that can be added directly to the page

Provide your response as JSON with this exact format:
{
  "recommendations": ["Brief recommendation 1.", "Brief recommendation 2."],
  "suggestedUpdates": "Brief summary of what is being updated.",
  "contentSections": [
    {
      "title": "Section heading (e.g., 'New Phishing Patterns to Watch For')",
      "content": "Full paragraph of educational content ready to be published. Write 2-4 sentences that are informative and actionable. Use complete sentences with proper punctuation. Never use dashes to separate ideas.",
      "type": "new"
    },
    {
      "title": "Updated Warning Signs",
      "content": "Another paragraph of content. Make it specific and based on the threat data. Include actionable advice.",
      "type": "update"
    }
  ]
}

WRITING RULES:
- Use complete, professional sentences
- Never use dashes to separate clauses; use periods, commas, or semicolons
- Be specific and reference actual threat patterns from the data
- Write content appropriate for the target audience
- Each content section should be 50-150 words
- Generate 2-4 content sections`;

        const message = await anthropic.messages.create({
          model: "claude-haiku-4-5",
          max_tokens: 8192,
          system: AI_GUARDRAILS.systemPrompt,
          messages: [{ role: "user", content: userPrompt }],
        });

        const block = message.content[0];
        const rawText = block && block.type === "text" ? block.text : "{}";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const result = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
        
        // Apply guardrails validation and sanitization
        const rawRecommendations = result.recommendations || [];
        const rawUpdates = result.suggestedUpdates || "";
        const rawContentSections = result.contentSections || [];
        
        // Validate recommendations
        recommendations = AI_GUARDRAILS.validateRecommendations(rawRecommendations);
        
        // Validate and sanitize suggested updates
        suggestedUpdates = AI_GUARDRAILS.validateSuggestedUpdates(rawUpdates);
        
        // Validate and sanitize content sections
        generatedContent = {
          sections: rawContentSections
            .filter((s: any) => s.title && s.content)
            .map((s: any) => ({
              title: AI_GUARDRAILS.sanitizeText(s.title),
              content: AI_GUARDRAILS.validateSuggestedUpdates(s.content),
              type: s.type === "update" ? "update" as const : "new" as const,
            }))
            .slice(0, 5),
          summary: suggestedUpdates,
        };
        
        // Check for potential hallucinations
        const threatTexts = relatedThreats.map(t => `${t.title} ${t.description}`);
        const combinedOutput = [...recommendations, suggestedUpdates, 
          ...generatedContent.sections.map(s => s.content)].join(" ");
        
        if (AI_GUARDRAILS.detectPotentialHallucination(combinedOutput, threatTexts)) {
          console.warn("[content-governance] Potential hallucination detected in AI output, adding disclaimer");
          recommendations.unshift("Note: Review all recommendations against source threat data before implementation.");
        }
        
        // Ensure we have at least some recommendations
        if (recommendations.length === 0) {
          recommendations = [
            `Review content to address ${relatedThreats.length} new threats matching your topics.`,
            "Update examples to reflect current attack patterns identified in threat intelligence.",
            "Verify protective measures align with latest security guidance.",
          ];
        }
        
      } catch (error: any) {
        console.error("[content-governance] AI recommendation error:", error.message);
        recommendations = [
          `Review and update content based on ${relatedThreats.length} new related threats.`,
          "Ensure examples reflect current attack patterns.",
          "Update protective measures section with latest guidance.",
        ];
        suggestedUpdates = `This page has ${page.relatedThreatCount} new threats matching its topics. Review the threat intelligence feed and update the educational content to address these new attack vectors.`;
        generatedContent = null;
      }
    } else {
      recommendations = [
        `Review and update content based on ${relatedThreats.length} new related threats.`,
        "Ensure examples reflect current attack patterns.",
        "Update protective measures section with latest guidance.",
      ];
      suggestedUpdates = `This page has ${page.relatedThreatCount} new threats matching its topics. Review the threat intelligence feed and update the educational content to address these new attack vectors.`;
      generatedContent = null;
    }
    
    return {
      pageTitle: page.title,
      currentTopics: pageTopics,
      relatedThreats,
      recommendations,
      suggestedUpdates,
      urgency,
      generatedContent,
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
