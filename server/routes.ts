import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactMessageSchema, insertNewsletterSubscriberSchema, insertScamReportSchema, SUBSCRIPTION_TIERS, hasTierAccess, users, scamReports, userProgress, userBadges, badgeDefinitions, familyCodewords, audioAnalysisHistory, learningPaths, trainingModules, trainingLessons, trainingQuizzes, quizQuestions, userLearningProgress, quizAttempts, trainingCertificates, removalRequests } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import { createRateLimitMiddleware, securityLogger } from "./security";
import { registerAuthRoutes, isAuthenticated, isAdmin, seedAdminUser } from "./auth";
import { registerAdminRoutes, registerToolTrackingRoutes } from "./admin";
import { 
  checkGoogleSafeBrowsing, 
  checkVirusTotal, 
  checkDomainAge, 
  checkSSLCertificate, 
  checkPhoneNumber,
  calculateTrustScore,
  analyzeQRContent,
  getDeepfakeEducation,
  checkAlienVaultOTX,
  analyzeQRContentEnhanced,
  calculateEmailAuthScore,
  urlCheckSchema as tiUrlCheckSchema,
  phoneCheckSchema,
  domainCheckSchema
} from "./threatIntelligence";
import { 
  getRegionByCode, 
  getThreatsByRegion, 
  ALL_REGIONS, 
  COUNTRY_TO_REGION,
  DEFAULT_REGION
} from "@shared/regions";
import {
  analyzeSmishing,
  analyzeAIContent,
  analyzeRedirectChain,
  analyzeFileForSteganography,
  analyzeIPGeolocation,
  analyzeAttachment,
  calculateDomainReputation,
  simulateDarkWebMonitoring,
  categorizeBreachSeverity,
  analyzePasswordExposure
} from "./advancedThreatIntelligence";
import { threatIntelService } from "./threatIntelService";
import { contentGovernanceService } from "./contentGovernanceService";
import { newsletterService } from "./newsletterService";
import { complianceService } from "./complianceService";
import { seedCurriculum } from "./curriculumSeed";
import { seedDataBrokers } from "./dataBrokerSeed";
import {
  scanConversation,
  getEmergencyResources,
  getAllEmergencyResources,
  FREE_SAFETY_TOOLS
} from "./childSafety";
import {
  getBrokerCatalog,
  getBrokerById,
  getUserVaultProfile,
  getAllVaultProfiles,
  createFamilyProfile,
  deleteFamilyProfile,
  upsertVaultProfile,
  runExposureScan,
  getUserScanHistory,
  getExposureFindings,
  createRemovalRequest,
  generateOptOutContent,
  updateRemovalStatus,
  getUserRemovalRequests,
  getRemovalDashboardStats,
  setupMonitoring,
  getMonitoringSchedule,
  generatePrivacyReport,
  runGuestExposureScan,
  getRetryableRequests,
  getEscalatedRequests,
  getOverdueRequests,
  getAuditLog,
  runMonitoringScan,
} from "./dataBrokerService";

// URL reputation checking schemas with validation
const urlCheckSchema = z.object({
  url: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      // Block localhost, private IPs, and internal networks
      const hostname = parsed.hostname.toLowerCase();
      const blockedPatterns = [
        /^localhost$/,
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2\d|3[01])\./,
        /^192\.168\./,
        /^0\./,
        /^169\.254\./,
        /^fc00:/,
        /^fe80:/,
        /^::1$/,
      ];
      return !blockedPatterns.some(p => p.test(hostname));
    } catch {
      return false;
    }
  }, { message: "Private or local URLs are not allowed" })
});

// Rate limiting middleware instances
const strictRateLimit = createRateLimitMiddleware("strict");
const standardRateLimit = createRateLimitMiddleware("standard");

// URL normalization helper - ensures URLs have proper protocol
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  // Remove trailing punctuation
  normalized = normalized.replace(/[.,;:!?]+$/, '');
  // Add https:// if no protocol
  if (!normalized.match(/^https?:\/\//i)) {
    normalized = 'https://' + normalized;
  }
  return normalized;
}

// Fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<globalThis.Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Serve sitemap.xml
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    const sitemapPath = path.resolve(process.cwd(), 'client/public/sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile(sitemapPath);
    } else {
      res.status(404).send('Sitemap not found');
    }
  });

  // Serve robots.txt
  app.get('/robots.txt', (_req: Request, res: Response) => {
    const robotsPath = path.resolve(process.cwd(), 'client/public/robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain');
      res.sendFile(robotsPath);
    } else {
      res.status(404).send('Robots.txt not found');
    }
  });

  // SSL Health Check Endpoint for external monitoring services
  app.get('/api/health/ssl', standardRateLimit, async (_req: Request, res: Response) => {
    try {
      const domain = process.env.APP_DOMAIN || 'getcyberright.com';
      const result = await checkSSLCertificate(`https://${domain}`);
      
      const isHealthy = result.valid && !result.isExpired && (result.daysUntilExpiry ?? 0) > 7;
      
      res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'warning',
        domain,
        ssl: {
          valid: result.valid,
          expired: result.isExpired,
          daysUntilExpiry: result.daysUntilExpiry,
          issuer: result.issuer,
          riskLevel: result.riskLevel
        },
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('SSL health check error:', error);
      res.status(503).json({
        status: 'error',
        error: 'Failed to check SSL certificate',
        checkedAt: new Date().toISOString()
      });
    }
  });

  // Register custom auth routes
  registerAuthRoutes(app);
  
  // Register admin routes
  registerAdminRoutes(app);
  
  // Register tool tracking routes (public)
  registerToolTrackingRoutes(app);

  // Contact form - strict rate limiting (10 req/min)
  app.post("/api/contact", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      securityLogger.info("Contact form submission", { email: validatedData.email });
      res.json({ success: true, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Newsletter signup - strict rate limiting (10 req/min)
  app.post("/api/newsletter", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      const existing = await storage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existing) {
        res.json({ success: true, message: "Already subscribed" });
        return;
      }
      
      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      securityLogger.info("Newsletter subscription", { email: validatedData.email });
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid email address", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to subscribe" });
      }
    }
  });

  // Scam report submission - strict rate limiting
  app.post("/api/scam-reports", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertScamReportSchema.parse(req.body);
      
      const [report] = await db.insert(scamReports).values({
        scamType: validatedData.scamType,
        description: validatedData.description,
        scammerContact: validatedData.scammerContact || null,
        amountLost: validatedData.amountLost || null,
        reporterEmail: validatedData.reporterEmail || null,
        anonymous: validatedData.anonymous ? "true" : "false",
      }).returning();
      
      securityLogger.info("Scam report submitted", { 
        scamType: validatedData.scamType,
        hasContact: !!validatedData.scammerContact 
      });
      res.json({ success: true, reportId: report.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid report data", details: error.errors });
      } else {
        console.error("Scam report error:", error);
        res.status(500).json({ error: "Failed to submit report" });
      }
    }
  });

  // URL reputation check - PhishTank (free, no API key required)
  app.post("/api/security/check-phishtank", standardRateLimit, async (req, res) => {
    try {
      // Normalize URL before validation
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      
      const formData = new URLSearchParams();
      formData.append('url', url);
      formData.append('format', 'json');
      
      const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }, 10000);
      
      if (!response.ok) {
        throw new Error(`PhishTank API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      res.json({
        success: true,
        source: 'PhishTank',
        isPhishing: data.results?.in_database === true && data.results?.valid === true,
        inDatabase: data.results?.in_database || false,
        verified: data.results?.verified || false,
        verifiedAt: data.results?.verified_at || null,
        phishDetailPage: data.results?.phish_detail_page || null
      });
    } catch (error) {
      console.error('PhishTank check error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid URL provided', details: error.errors });
        return;
      }
      res.status(503).json({ 
        success: false, 
        source: 'PhishTank',
        error: 'PhishTank service temporarily unavailable',
        isPhishing: null 
      });
    }
  });

  // URL reputation check - URLhaus (abuse.ch - free, no API key required)
  app.post("/api/security/check-urlhaus", standardRateLimit, async (req, res) => {
    try {
      // Normalize URL before validation
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      
      const formData = new URLSearchParams();
      formData.append('url', url);
      
      const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }, 10000);
      
      if (!response.ok) {
        throw new Error(`URLhaus API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      res.json({
        success: true,
        source: 'URLhaus',
        isMalware: data.query_status === 'ok',
        queryStatus: data.query_status,
        threat: data.threat || null,
        tags: data.tags || [],
        urlhausReference: data.urlhaus_reference || null,
        dateAdded: data.date_added || null
      });
    } catch (error) {
      console.error('URLhaus check error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid URL provided', details: error.errors });
        return;
      }
      res.status(503).json({ 
        success: false, 
        source: 'URLhaus',
        error: 'URLhaus service temporarily unavailable',
        isMalware: null 
      });
    }
  });

  // Combined URL reputation check
  app.post("/api/security/check-url-reputation", standardRateLimit, async (req, res) => {
    try {
      // Normalize URL before validation
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      
      // Run both checks in parallel with timeouts
      const [phishTankResult, urlhausResult] = await Promise.allSettled([
        // PhishTank check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          formData.append('format', 'json');
          
          const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error('PhishTank API error');
          return response.json();
        })(),
        // URLhaus check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          
          const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error('URLhaus API error');
          return response.json();
        })()
      ]);
      
      const phishTank = phishTankResult.status === 'fulfilled' ? {
        checked: true,
        isPhishing: phishTankResult.value.results?.in_database === true && phishTankResult.value.results?.valid === true,
        verified: phishTankResult.value.results?.verified || false,
        detailPage: phishTankResult.value.results?.phish_detail_page || null
      } : { checked: false, isPhishing: null, error: 'Service unavailable' };
      
      const urlhaus = urlhausResult.status === 'fulfilled' ? {
        checked: true,
        isMalware: urlhausResult.value.query_status === 'ok',
        threat: urlhausResult.value.threat || null,
        tags: urlhausResult.value.tags || []
      } : { checked: false, isMalware: null, error: 'Service unavailable' };
      
      // Determine overall threat level
      let threatLevel: 'safe' | 'suspicious' | 'dangerous' | 'unknown' = 'unknown';
      if (phishTank.isPhishing || urlhaus.isMalware) {
        threatLevel = 'dangerous';
      } else if (phishTank.checked && urlhaus.checked && !phishTank.isPhishing && !urlhaus.isMalware) {
        threatLevel = 'safe';
      } else if (phishTank.checked || urlhaus.checked) {
        threatLevel = phishTank.isPhishing === false || urlhaus.isMalware === false ? 'safe' : 'suspicious';
      }
      
      res.json({
        success: true,
        url,
        threatLevel,
        phishTank,
        urlhaus,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: error.errors });
      } else {
        console.error('URL reputation check error:', error);
        res.status(500).json({ error: "Failed to check URL reputation" });
      }
    }
  });

  // Google Safe Browsing check
  app.post("/api/security/check-google-safe-browsing", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      const result = await checkGoogleSafeBrowsing(url);
      res.json({ success: true, url, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: error.errors });
      } else {
        console.error('Google Safe Browsing error:', error);
        res.status(500).json({ success: false, error: "Service temporarily unavailable" });
      }
    }
  });

  // VirusTotal check
  app.post("/api/security/check-virustotal", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      const result = await checkVirusTotal(url);
      res.json({ success: true, url, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: error.errors });
      } else {
        console.error('VirusTotal error:', error);
        res.status(500).json({ success: false, error: "Service temporarily unavailable" });
      }
    }
  });

  // Domain age / WHOIS check
  app.post("/api/security/check-domain-age", standardRateLimit, async (req, res) => {
    try {
      const { domain } = domainCheckSchema.parse(req.body);
      const result = await checkDomainAge(domain);
      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid domain", details: error.errors });
      } else {
        console.error('Domain age check error:', error);
        res.status(500).json({ success: false, error: "Service temporarily unavailable" });
      }
    }
  });

  // SSL Certificate check
  app.post("/api/security/check-ssl", standardRateLimit, async (req, res) => {
    try {
      // Normalize URL before validation
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      const result = await checkSSLCertificate(url);
      res.json({ success: true, url, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: error.errors });
      } else {
        console.error('SSL check error:', error);
        res.status(500).json({ success: false, error: "Service temporarily unavailable" });
      }
    }
  });

  // Phone number check
  app.post("/api/security/check-phone", standardRateLimit, async (req, res) => {
    try {
      const { phone } = phoneCheckSchema.parse(req.body);
      const result = await checkPhoneNumber(phone);
      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid phone number", details: error.errors });
      } else {
        console.error('Phone check error:', error);
        res.status(500).json({ success: false, error: "Service temporarily unavailable" });
      }
    }
  });

  // QR Code content analysis
  app.post("/api/security/analyze-qr", standardRateLimit, async (req, res) => {
    try {
      const schema = z.object({ content: z.string().min(1).max(5000) });
      const { content } = schema.parse(req.body);
      const result = analyzeQRContent(content);
      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid QR content", details: error.errors });
      } else {
        console.error('QR analysis error:', error);
        res.status(500).json({ success: false, error: "Analysis failed" });
      }
    }
  });

  // Deepfake education endpoint
  app.get("/api/security/deepfake-education/:type", standardRateLimit, async (req, res) => {
    try {
      const validTypes = ["image", "video", "audio", "text"];
      const contentType = req.params.type as "image" | "video" | "audio" | "text";
      if (!validTypes.includes(contentType)) {
        return res.status(400).json({ error: "Invalid content type. Must be: image, video, audio, or text" });
      }
      const result = getDeepfakeEducation(contentType);
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('Deepfake education error:', error);
      res.status(500).json({ success: false, error: "Failed to fetch education content" });
    }
  });

  // XposedOrNot breach check endpoint - enterprise-grade open source breach database
  app.post("/api/security/check-email-breach", standardRateLimit, async (req, res) => {
    try {
      const emailSchema = z.object({
        email: z.string().email()
      });
      
      const { email } = emailSchema.parse(req.body);
      
      // Call XposedOrNot API for breach check
      const checkResponse = await fetchWithTimeout(
        `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'GetCyberRight-SecurityPlatform/1.0'
          }
        },
        15000
      );
      
      if (checkResponse.status === 404) {
        // No breaches found
        return res.json({
          success: true,
          breached: false,
          breaches: [],
          message: "Good news! This email was not found in any known data breaches."
        });
      }
      
      if (!checkResponse.ok) {
        throw new Error(`XposedOrNot API error: ${checkResponse.status}`);
      }
      
      const checkData = await checkResponse.json();
      
      // Get detailed analytics if breaches found
      let analyticsData = null;
      if (checkData.breaches && checkData.breaches.length > 0) {
        try {
          const analyticsResponse = await fetchWithTimeout(
            `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(email)}`,
            {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'User-Agent': 'GetCyberRight-SecurityPlatform/1.0'
              }
            },
            15000
          );
          
          if (analyticsResponse.ok) {
            analyticsData = await analyticsResponse.json();
          }
        } catch (analyticsError) {
          console.log('Analytics fetch failed, continuing with basic data:', analyticsError);
        }
      }
      
      // Flatten breach names array (XposedOrNot returns nested arrays)
      const breachNames = checkData.breaches ? 
        checkData.breaches.flat().filter((b: string) => b && b.length > 0) : [];
      
      res.json({
        success: true,
        breached: breachNames.length > 0,
        breaches: breachNames,
        breachCount: breachNames.length,
        analytics: analyticsData,
        message: breachNames.length > 0 
          ? `This email was found in ${breachNames.length} data breach${breachNames.length > 1 ? 'es' : ''}.`
          : "Good news! This email was not found in any known data breaches."
      });
      
    } catch (error: any) {
      console.error('Breach check error:', error);
      
      // Handle rate limiting
      if (error.message?.includes('429') || error.message?.includes('rate')) {
        return res.status(429).json({
          success: false,
          error: "Too many requests. Please wait a moment and try again."
        });
      }
      
      res.status(500).json({
        success: false,
        error: "Unable to check breach status. Please try again later."
      });
    }
  });

  // SMS/Smishing Analysis
  app.post("/api/security/analyze-smishing", standardRateLimit, async (req, res) => {
    try {
      const { content, sender } = z.object({
        content: z.string().min(1).max(5000),
        sender: z.string().max(50).optional()
      }).parse(req.body);
      
      const result = analyzeSmishing(content, sender);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Smishing analysis error:", error);
      res.status(400).json({ success: false, error: "Invalid input" });
    }
  });

  // AI-Generated Content Detection
  app.post("/api/security/analyze-ai-content", standardRateLimit, async (req, res) => {
    try {
      const { content } = z.object({
        content: z.string().min(50).max(10000)
      }).parse(req.body);
      
      const result = analyzeAIContent(content);
      res.json({ success: true, result });
    } catch (error) {
      console.error("AI content analysis error:", error);
      res.status(400).json({ success: false, error: "Invalid input - minimum 50 characters required" });
    }
  });

  // AI-Powered Scam Analyzer (streaming)
  app.post("/api/security/ai-scam-analyze", standardRateLimit, async (req, res) => {
    try {
      const { content } = z.object({
        content: z.string().min(5, "Please provide at least 5 characters").max(50000, "Content too long"),
        contentType: z.string().optional()
      }).parse(req.body);

      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const systemPrompt = `You are a cybersecurity threat-analysis AI specializing in:
- Phishing detection
- Scam and fraud identification
- Malicious communication analysis
- Social engineering detection
- URL/domain threat assessment
- Email header forensic review

Your primary objective is to accurately identify scam risks from any submitted content while minimizing false positives.

CORE OPERATING PRINCIPLE
Users will submit content in a single input field without specifying type.
You MUST:
- Automatically detect what type of content was submitted.
- Adapt analysis accordingly.
- Produce a structured, actionable security assessment.
- Never require the user to categorize the input.

INPUT TYPE AUTO-DETECTION
Classify input into ONE of these categories:
- Email body (partial or full)
- Full email with headers
- Email headers only
- SMS / text / chat / DM message
- URL or domain
- Mixed content (message + link, email + headers, etc.)
- Unknown / ambiguous

ANALYSIS FRAMEWORK
1. Threat Intent Evaluation: Assess whether content attempts to obtain credentials or personal data, trigger urgency or panic, impersonate trusted entities, request money/payment, deliver malware links, or redirect to spoofed sites.
2. Linguistic & Behavioral Signals: Evaluate emotional manipulation, authority impersonation, grammar anomalies consistent with scams, urgency or scarcity framing, unusual requests.
3. Technical Indicators (When Applicable):
   URLs: Typosquatting, suspicious TLDs, subdomain abuse, URL shorteners, misleading HTTPS usage.
   Emails: Spoofed sender patterns, header authentication failures, reply-to mismatches, link masking.
   Headers: SPF/DKIM/DMARC inconsistencies, suspicious relay chains, forged sending infrastructure.
4. Risk Scoring: Low (likely legitimate but remain cautious), Moderate (suspicious indicators present), High (strong scam likelihood), Critical (confirmed or near-certain scam). Never exaggerate risk without evidence.

OUTPUT FORMAT (MANDATORY)
Respond ONLY in this exact JSON structure:
{
  "contentTypeDetected": "[Type + confidence %]",
  "scamRiskLevel": "Low" | "Moderate" | "High" | "Critical",
  "keyRedFlags": ["bullet list of specific indicators"],
  "technicalObservations": ["only if applicable, otherwise empty array"],
  "recommendedActions": ["clear practical steps"],
  "confidenceLevel": "explanation of certainty and any limitations",
  "summary": "2-3 sentence plain-language summary of the assessment"
}

BEHAVIORAL CONSTRAINTS
- Do NOT hallucinate threat intelligence.
- Do NOT assume legitimacy or maliciousness without indicators.
- Do NOT provide legal conclusions.
- Maintain neutral, professional cybersecurity tone.
- Prioritize user safety over reassurance.

EDGE CASE HANDLING
- If input is empty or minimal: set scamRiskLevel to "Low" and note insufficient data.
- If clearly benign: state low risk but advise standard caution.
- If ambiguous: highlight uncertainty explicitly in confidenceLevel.`;

      const userMessage = `Please analyze the following content for scam/threat indicators:\n\n${content}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 1024,
      });

      const resultText = response.choices[0]?.message?.content;
      if (!resultText) {
        throw new Error("No response from AI model");
      }

      const parsed = JSON.parse(resultText);
      res.json({ success: true, result: parsed });
    } catch (error: any) {
      console.error("AI Scam Analyzer error:", error);
      const isQuota = error?.status === 429 || error?.message?.includes("quota") || error?.message?.includes("429");
      const errorMessage = isQuota 
        ? "The AI analysis service is temporarily at capacity. Please try again in a few minutes, or use the pattern-based Scam Checker tool."
        : "Analysis could not be completed. Please try again or use the pattern-based Scam Checker tool.";
      res.status(isQuota ? 429 : 500).json({ success: false, error: errorMessage });
    }
  });

  // URL Redirect Chain Analysis
  app.post("/api/security/analyze-redirect-chain", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      const result = await analyzeRedirectChain(url, 10);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Redirect chain analysis error:", error);
      res.status(400).json({ success: false, error: "Failed to analyze redirect chain" });
    }
  });

  // IP Geolocation Risk Analysis
  app.post("/api/security/analyze-ip-geolocation", standardRateLimit, async (req, res) => {
    try {
      const { ip } = z.object({
        ip: z.string().ip()
      }).parse(req.body);
      
      const result = await analyzeIPGeolocation(ip);
      res.json({ success: true, result });
    } catch (error) {
      console.error("IP geolocation error:", error);
      res.status(400).json({ success: false, error: "Invalid IP address" });
    }
  });

  // Attachment Analysis
  app.post("/api/security/analyze-attachment", standardRateLimit, async (req, res) => {
    try {
      const { filename, mimeType } = z.object({
        filename: z.string().min(1).max(255),
        mimeType: z.string().max(100).optional()
      }).parse(req.body);
      
      const result = analyzeAttachment(filename, mimeType);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Attachment analysis error:", error);
      res.status(400).json({ success: false, error: "Invalid input" });
    }
  });

  // Domain Reputation Score
  app.post("/api/security/domain-reputation", standardRateLimit, async (req, res) => {
    try {
      const { domain } = z.object({
        domain: z.string().min(1).max(253)
      }).parse(req.body);
      
      // Run checks in parallel
      const [domainAge, sslCert, phishTankResult, urlhausResult] = await Promise.allSettled([
        checkDomainAge(domain),
        checkSSLCertificate(`https://${domain}`),
        (async () => {
          const response = await fetch("https://checkurl.phishtank.com/checkurl/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `url=${encodeURIComponent(`https://${domain}`)}&format=json`,
            signal: AbortSignal.timeout(8000)
          });
          const data = await response.json();
          return { isPhishing: data.results?.in_database && data.results?.verified };
        })().catch(() => ({ isPhishing: null })),
        (async () => {
          const response = await fetch("https://urlhaus-api.abuse.ch/v1/url/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `url=${encodeURIComponent(`https://${domain}`)}`,
            signal: AbortSignal.timeout(8000)
          });
          const data = await response.json();
          return { isMalware: data.query_status === "ok" };
        })().catch(() => ({ isMalware: null }))
      ]);
      
      const result = calculateDomainReputation(
        domain,
        undefined,
        undefined,
        domainAge.status === "fulfilled" ? domainAge.value : undefined,
        sslCert.status === "fulfilled" ? sslCert.value : undefined,
        phishTankResult.status === "fulfilled" ? phishTankResult.value : undefined,
        urlhausResult.status === "fulfilled" ? urlhausResult.value : undefined
      );
      
      res.json({ success: true, result });
    } catch (error) {
      console.error("Domain reputation error:", error);
      res.status(400).json({ success: false, error: "Failed to calculate reputation" });
    }
  });

  // AlienVault OTX Threat Intelligence
  app.post("/api/security/alienvault-check", standardRateLimit, async (req, res) => {
    try {
      const { domain } = z.object({
        domain: z.string().min(1).max(253)
      }).parse(req.body);
      
      const result = await checkAlienVaultOTX(domain);
      res.json({ success: true, result });
    } catch (error) {
      console.error("AlienVault check error:", error);
      res.status(400).json({ success: false, error: "Failed to check threat intelligence" });
    }
  });

  // Enhanced QR Code Analysis with redirect chain
  app.post("/api/security/analyze-qr-enhanced", standardRateLimit, async (req, res) => {
    try {
      const { content } = z.object({
        content: z.string().min(1).max(5000)
      }).parse(req.body);
      
      const result = await analyzeQRContentEnhanced(content);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Enhanced QR analysis error:", error);
      res.status(400).json({ success: false, error: "Failed to analyze QR content" });
    }
  });

  // Email Authentication Scoring (SPF/DKIM/DMARC/ARC/BIMI)
  app.post("/api/security/email-auth-score", standardRateLimit, async (req, res) => {
    try {
      const { headers } = z.object({
        headers: z.string().min(1).max(50000)
      }).parse(req.body);
      
      const result = calculateEmailAuthScore(headers);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Email auth score error:", error);
      res.status(400).json({ success: false, error: "Failed to calculate email authentication score" });
    }
  });

  // Dark Web Monitoring (Educational)
  app.post("/api/security/dark-web-check", standardRateLimit, async (req, res) => {
    try {
      const { email, breachCount } = z.object({
        email: z.string().email(),
        breachCount: z.number().min(0).max(1000).default(0)
      }).parse(req.body);
      
      const result = simulateDarkWebMonitoring(email, breachCount);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Dark web check error:", error);
      res.status(400).json({ success: false, error: "Invalid input" });
    }
  });

  // Password Exposure Context Analysis
  app.post("/api/security/password-exposure", strictRateLimit, async (req, res) => {
    try {
      const { password } = z.object({
        password: z.string().min(1).max(128)
      }).parse(req.body);
      
      const result = analyzePasswordExposure(password);
      res.json({ success: true, result });
    } catch (error) {
      console.error("Password exposure check error:", error);
      res.status(400).json({ success: false, error: "Invalid input" });
    }
  });

  // Comprehensive URL scan (combines all checks)
  app.post("/api/security/comprehensive-scan", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      
      // Extract domain for domain age check
      let domain = "";
      try {
        const parsedUrl = new URL(url);
        domain = parsedUrl.hostname;
      } catch {
        domain = url;
      }

      // Run all checks in parallel (including AlienVault OTX)
      const [googleSB, virusTotal, domainAge, sslCert, phishTankResult, urlhausResult, alienVault] = await Promise.allSettled([
        checkGoogleSafeBrowsing(url),
        checkVirusTotal(url),
        checkDomainAge(domain),
        checkSSLCertificate(url),
        // PhishTank check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          formData.append('format', 'json');
          
          const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error('PhishTank API error');
          const data = await response.json();
          return {
            checked: true,
            isPhishing: data.results?.in_database === true && data.results?.valid === true
          };
        })(),
        // URLhaus check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          
          const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error('URLhaus API error');
          const data = await response.json();
          return {
            checked: true,
            isMalware: data.query_status === 'ok'
          };
        })(),
        // AlienVault OTX threat intelligence
        checkAlienVaultOTX(domain)
      ]);

      // Extract results
      const googleSBResult = googleSB.status === 'fulfilled' ? googleSB.value : undefined;
      const virusTotalResult = virusTotal.status === 'fulfilled' ? virusTotal.value : undefined;
      const domainAgeResult = domainAge.status === 'fulfilled' ? domainAge.value : undefined;
      const sslResult = sslCert.status === 'fulfilled' ? sslCert.value : undefined;
      const phishTank = phishTankResult.status === 'fulfilled' ? phishTankResult.value : { checked: false, isPhishing: null };
      const urlhaus = urlhausResult.status === 'fulfilled' ? urlhausResult.value : { checked: false, isMalware: null };
      const alienVaultResult = alienVault.status === 'fulfilled' ? alienVault.value : undefined;

      // Calculate trust score
      const trustScore = calculateTrustScore(
        domainAgeResult,
        sslResult,
        googleSBResult,
        virusTotalResult,
        phishTank,
        urlhaus
      );

      // Determine overall threat level (including AlienVault OTX data)
      let overallThreatLevel: "safe" | "low" | "medium" | "high" | "critical" = "low";
      if (phishTank.isPhishing || urlhaus.isMalware || googleSBResult?.isThreat) {
        overallThreatLevel = "critical";
      } else if ((virusTotalResult?.positives ?? 0) > 3 || alienVaultResult?.riskLevel === "critical") {
        overallThreatLevel = "high";
      } else if (trustScore.score < 40 || alienVaultResult?.riskLevel === "high") {
        overallThreatLevel = "high";
      } else if (trustScore.score < 60 || alienVaultResult?.riskLevel === "medium") {
        overallThreatLevel = "medium";
      } else if (trustScore.score < 75) {
        overallThreatLevel = "low";
      } else {
        overallThreatLevel = "safe";
      }

      res.json({
        success: true,
        url,
        overallThreatLevel,
        trustScore,
        googleSafeBrowsing: googleSBResult,
        virusTotal: virusTotalResult,
        domainAge: domainAgeResult,
        sslCertificate: sslResult,
        phishTank,
        urlhaus,
        alienVaultOTX: alienVaultResult,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: error.errors });
      } else {
        console.error('Comprehensive scan error:', error);
        res.status(500).json({ success: false, error: "Scan failed" });
      }
    }
  });

  // Get user subscription status (protected route)
  app.get("/api/subscription/status", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const now = new Date();
      const isExpired = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < now;
      const effectiveTier = isExpired ? "free" : (user.subscriptionTier || "free");
      
      res.json({
        tier: effectiveTier,
        expiresAt: user.subscriptionExpiresAt,
        isExpired,
        availableTiers: Object.values(SUBSCRIPTION_TIERS)
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  // Premium content access check middleware using shared tier hierarchy
  const requireSubscription = (requiredTier: string) => {
    return async (req: any, res: Response, next: Function) => {
      try {
        const user = req.user;
        if (!user) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        
        const now = new Date();
        const isExpired = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < now;
        const effectiveTier = isExpired ? "free" : (user.subscriptionTier || "free");
        
        // Use shared tier access helper
        if (!hasTierAccess(effectiveTier, requiredTier)) {
          return res.status(403).json({ 
            error: "Subscription required",
            requiredTier,
            currentTier: effectiveTier
          });
        }
        
        next();
      } catch (error) {
        console.error("Error checking subscription:", error);
        res.status(500).json({ error: "Failed to check subscription" });
      }
    };
  };

  // Example protected premium content endpoints
  app.get("/api/premium/webinar-archive", isAuthenticated, requireSubscription("essential"), async (req, res) => {
    res.json({ 
      message: "Access granted to webinar archive",
      content: [
        { id: 1, title: "Phishing Prevention Masterclass", duration: "45 min" },
        { id: 2, title: "Secure Password Strategies", duration: "30 min" },
        { id: 3, title: "Family Digital Safety Workshop", duration: "60 min" }
      ]
    });
  });

  app.get("/api/premium/training-materials", isAuthenticated, requireSubscription("professional"), async (req, res) => {
    res.json({ 
      message: "Access granted to training materials",
      content: [
        { id: 1, title: "Employee Security Training Kit", type: "PDF" },
        { id: 2, title: "Quarterly Threat Report Q1 2026", type: "PDF" },
        { id: 3, title: "Security Policy Templates", type: "DOCX" }
      ]
    });
  });

  // =====================================================
  // GAMIFICATION ROUTES
  // =====================================================

  // Get user progress and stats
  app.get("/api/gamification/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      let progress = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
      
      // Create progress record if it doesn't exist
      if (progress.length === 0) {
        await db.insert(userProgress).values({
          userId,
          totalPoints: 0,
          level: 1,
          scansCompleted: 0,
          lessonsCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
        });
        progress = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
      }

      res.json({ success: true, progress: progress[0] });
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Get user badges
  app.get("/api/gamification/badges", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const badges = await db.select().from(userBadges).where(eq(userBadges.userId, userId));
      const definitions = await db.select().from(badgeDefinitions);

      res.json({ success: true, earnedBadges: badges, allBadges: definitions });
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  // Record an activity (scan, lesson, etc.) and award points
  app.post("/api/gamification/record-activity", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { activityType, points = 10 } = req.body;
      
      // Get current progress
      let progress = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
      
      if (progress.length === 0) {
        await db.insert(userProgress).values({ userId });
        progress = await db.select().from(userProgress).where(eq(userProgress.userId, userId)).limit(1);
      }

      const current = progress[0];
      const newPoints = (current.totalPoints || 0) + points;
      const newLevel = Math.floor(newPoints / 300) + 1;
      
      const updates: any = {
        totalPoints: newPoints,
        level: newLevel,
        lastActivityDate: new Date(),
        updatedAt: new Date(),
      };

      if (activityType === "scan") {
        updates.scansCompleted = (current.scansCompleted || 0) + 1;
      } else if (activityType === "lesson") {
        updates.lessonsCompleted = (current.lessonsCompleted || 0) + 1;
      }

      // Update streak logic
      const lastActivity = current.lastActivityDate;
      const now = new Date();
      if (lastActivity) {
        const hoursSinceLastActivity = (now.getTime() - new Date(lastActivity).getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastActivity < 48) {
          updates.currentStreak = (current.currentStreak || 0) + 1;
          if (updates.currentStreak > (current.longestStreak || 0)) {
            updates.longestStreak = updates.currentStreak;
          }
        } else {
          updates.currentStreak = 1;
        }
      } else {
        updates.currentStreak = 1;
      }

      await db.update(userProgress).set(updates).where(eq(userProgress.userId, userId));

      res.json({ 
        success: true, 
        pointsEarned: points, 
        totalPoints: newPoints,
        level: newLevel,
        newStreak: updates.currentStreak
      });
    } catch (error) {
      console.error("Error recording activity:", error);
      res.status(500).json({ error: "Failed to record activity" });
    }
  });

  // =====================================================
  // FAMILY CODEWORD ROUTES
  // =====================================================

  // Save a family codeword (requires Essential tier or higher)
  app.post("/api/codeword/save", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const userTier = req.user?.subscriptionTier || "free";
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Allow saving for all authenticated users (free feature)
      const { codeword, style, familyName } = req.body;
      
      if (!codeword || !style) {
        return res.status(400).json({ error: "Codeword and style are required" });
      }

      // Deactivate any existing active codewords
      await db.update(familyCodewords)
        .set({ isActive: false })
        .where(eq(familyCodewords.userId, userId));

      // Save the new codeword
      await db.insert(familyCodewords).values({
        userId,
        codeword,
        style,
        familyName: familyName || null,
        isActive: true,
      });

      res.json({ success: true, message: "Codeword saved successfully" });
    } catch (error) {
      console.error("Error saving codeword:", error);
      res.status(500).json({ error: "Failed to save codeword" });
    }
  });

  // Get user's active codeword
  app.get("/api/codeword/active", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const codeword = await db.select()
        .from(familyCodewords)
        .where(eq(familyCodewords.userId, userId))
        .limit(1);

      res.json({ success: true, codeword: codeword.length > 0 ? codeword[0] : null });
    } catch (error) {
      console.error("Error fetching codeword:", error);
      res.status(500).json({ error: "Failed to fetch codeword" });
    }
  });

  // =====================================================
  // AUDIO DEEPFAKE ANALYSIS ROUTES (Premium Feature)
  // =====================================================

  // Analyze audio for deepfake detection (requires Professional tier)
  app.post("/api/security/analyze-audio", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const userTier = req.user?.subscriptionTier || "free";
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Check if user has Professional tier access
      if (!hasTierAccess(userTier, SUBSCRIPTION_TIERS.PROFESSIONAL)) {
        return res.status(403).json({ 
          error: "Premium feature", 
          requiredTier: SUBSCRIPTION_TIERS.PROFESSIONAL,
          message: "Voice clone detection requires a Professional subscription"
        });
      }

      const { fileName, fileSize } = req.body;

      // Simulate analysis (in production, integrate with Resemble AI Detect or similar)
      // This is clearly labeled as educational simulation
      const isDeepfake = Math.random() > 0.6;
      const confidence = isDeepfake 
        ? Math.floor(60 + Math.random() * 35)
        : Math.floor(15 + Math.random() * 30);
      
      let riskLevel: string;
      if (confidence >= 85) riskLevel = "critical";
      else if (confidence >= 65) riskLevel = "high";
      else if (confidence >= 40) riskLevel = "medium";
      else riskLevel = "low";

      const indicators = [
        { name: "Unnatural Pauses", detected: isDeepfake && Math.random() > 0.4 },
        { name: "Breathing Patterns", detected: isDeepfake && Math.random() > 0.3 },
        { name: "Emotional Consistency", detected: isDeepfake && Math.random() > 0.5 },
        { name: "Background Noise", detected: isDeepfake && Math.random() > 0.6 },
        { name: "Pitch Variations", detected: isDeepfake && Math.random() > 0.4 },
        { name: "Audio Artifacts", detected: isDeepfake && Math.random() > 0.7 },
      ];

      // Log the analysis
      await db.insert(audioAnalysisHistory).values({
        userId,
        fileName,
        fileSize,
        isDeepfake,
        confidence,
        riskLevel,
        analysisResult: JSON.stringify(indicators),
      });

      res.json({
        success: true,
        isSimulation: true, // Clearly indicate this is a simulation
        simulationNote: "This is an educational simulation. For real-time detection, integrate with specialized APIs like Resemble AI Detect.",
        result: {
          isDeepfake,
          confidence,
          riskLevel,
          indicators,
          recommendation: isDeepfake
            ? "This audio shows patterns consistent with AI generation. Verify the caller through a separate channel."
            : "This audio appears natural. Always verify important requests through alternative means."
        }
      });
    } catch (error) {
      console.error("Error analyzing audio:", error);
      res.status(500).json({ error: "Failed to analyze audio" });
    }
  });

  // Check premium feature access
  app.get("/api/premium/check-access/:feature", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      const userTier = req.user?.subscriptionTier || "free";
      const { feature } = req.params;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const featureTiers: Record<string, string> = {
        "voice-detection": SUBSCRIPTION_TIERS.PROFESSIONAL,
        "advanced-scan": SUBSCRIPTION_TIERS.ESSENTIAL,
        "unlimited-scans": SUBSCRIPTION_TIERS.ESSENTIAL,
        "family-sharing": SUBSCRIPTION_TIERS.PROFESSIONAL,
        "api-access": SUBSCRIPTION_TIERS.ENTERPRISE,
      };

      const requiredTier = featureTiers[feature] || SUBSCRIPTION_TIERS.FREE;
      const hasAccess = hasTierAccess(userTier, requiredTier);

      res.json({
        success: true,
        feature,
        hasAccess,
        userTier,
        requiredTier,
      });
    } catch (error) {
      console.error("Error checking premium access:", error);
      res.status(500).json({ error: "Failed to check access" });
    }
  });

  // =====================
  // REGIONAL CONTENT API
  // =====================

  // Get user's detected region from IP
  app.get("/api/region/detect", async (req: Request, res: Response) => {
    try {
      // Get IP from various headers (for proxies) or connection
      const forwardedFor = req.headers['x-forwarded-for'];
      const ip = typeof forwardedFor === 'string' 
        ? forwardedFor.split(',')[0].trim() 
        : req.socket.remoteAddress || '';

      // Use ip-api.com for free geolocation (rate limited but sufficient)
      let regionCode = "GLOBAL";
      
      try {
        const geoResponse = await fetchWithTimeout(
          `http://ip-api.com/json/${ip}?fields=status,countryCode,region`,
          { method: 'GET' },
          5000
        );
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json() as { status: string; countryCode?: string; region?: string };
          
          if (geoData.status === 'success' && geoData.countryCode) {
            // Map country to region (US, UK, CA, AU, EU, AF, or GLOBAL)
            regionCode = COUNTRY_TO_REGION[geoData.countryCode] || "GLOBAL";
          }
        }
      } catch (geoError) {
        console.log("Geolocation lookup failed, using default region");
      }

      const regionInfo = getRegionByCode(regionCode);
      const threats = getThreatsByRegion(regionCode);

      res.json({
        success: true,
        detectedRegion: regionCode,
        region: regionInfo,
        threats: threats.slice(0, 5), // Top 5 threats
      });
    } catch (error) {
      console.error("Error detecting region:", error);
      res.json({
        success: true,
        detectedRegion: "GLOBAL",
        region: DEFAULT_REGION,
        threats: getThreatsByRegion("GLOBAL").slice(0, 5),
      });
    }
  });

  // Get all available regions
  app.get("/api/region/list", (_req: Request, res: Response) => {
    res.json({
      success: true,
      regions: ALL_REGIONS,
    });
  });

  // Get region info by code
  app.get("/api/region/:code", (req: Request, res: Response) => {
    const code = req.params.code as string;
    const regionInfo = getRegionByCode(code);
    const threats = getThreatsByRegion(code);

    res.json({
      success: true,
      region: regionInfo,
      threats,
    });
  });

  // Get threat trends for a region
  app.get("/api/region/:code/threats", (req: Request, res: Response) => {
    const code = req.params.code as string;
    const threats = getThreatsByRegion(code);

    res.json({
      success: true,
      regionCode: code,
      threats,
    });
  });

  // ============================================
  // CHILD SAFETY TOOLS
  // ============================================

  // Scan conversation for grooming patterns
  const conversationScanSchema = z.object({
    text: z.string().min(10, "Please provide at least 10 characters to analyze").max(50000, "Text too long"),
    region: z.string().optional().default("US")
  });

  app.post("/api/child-safety/scan", strictRateLimit, async (req: Request, res: Response) => {
    try {
      const validated = conversationScanSchema.parse(req.body);
      const result = scanConversation(validated.text, validated.region);
      
      securityLogger.info("Child safety scan performed", {
        riskLevel: result.riskLevel,
        riskScore: result.riskScore,
        flagCount: result.flags.length,
        ip: req.ip
      });

      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, error: "Invalid input", details: error.errors });
        return;
      }
      console.error("Child safety scan error:", error);
      res.status(500).json({ success: false, error: "Failed to analyze conversation" });
    }
  });

  // Get emergency resources by region
  app.get("/api/child-safety/resources", (req: Request, res: Response) => {
    const region = (req.query.region as string) || "US";
    const resources = getEmergencyResources(region);
    
    res.json({
      success: true,
      region,
      resources
    });
  });

  // Get all emergency resources (for educational display)
  app.get("/api/child-safety/resources/all", (req: Request, res: Response) => {
    const allResources = getAllEmergencyResources();
    
    res.json({
      success: true,
      resources: allResources
    });
  });

  // Get free safety tools information
  app.get("/api/child-safety/tools", (req: Request, res: Response) => {
    res.json({
      success: true,
      tools: FREE_SAFETY_TOOLS
    });
  });

  // ============================================
  // THREAT INTELLIGENCE FEED INTEGRATION API
  // ============================================

  // Initialize and start threat intelligence service
  threatIntelService.initialize().then(() => {
    threatIntelService.startScheduler();
  }).catch(err => console.error("Failed to initialize threat intel service:", err));

  // Initialize content governance service
  contentGovernanceService.initialize().then(() => {
    // Run initial threat-to-content matching
    contentGovernanceService.matchThreatsToContent()
      .then(() => console.log("[content-governance] Initial content audit complete"))
      .catch(err => console.error("[content-governance] Initial audit failed:", err));
  }).catch(err => console.error("Failed to initialize content governance service:", err));

  // Initialize newsletter service for weekly automated emails
  newsletterService.initialize().catch(err => 
    console.error("Failed to initialize newsletter service:", err)
  );

  // Seed admin user from environment variables (for production deployment)
  seedAdminUser().catch(err => 
    console.error("Failed to seed admin user:", err)
  );

  // Seed initial curriculum content
  seedCurriculum().catch(err => 
    console.error("Failed to seed curriculum:", err)
  );

  // Seed data broker catalog
  seedDataBrokers(db).catch(err =>
    console.error("Failed to seed data brokers:", err)
  );

  // Get all feeds with status
  app.get("/api/threat-intel/feeds", async (req: Request, res: Response) => {
    try {
      const feeds = await threatIntelService.getAllFeeds();
      res.json({ success: true, feeds });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get feed run history
  app.get("/api/threat-intel/feeds/:feedId/runs", async (req: Request, res: Response) => {
    try {
      const feedId = req.params.feedId as string;
      const limit = parseInt(req.query.limit as string) || 10;
      const runs = await threatIntelService.getFeedRuns(feedId, limit);
      res.json({ success: true, runs });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Manually trigger a feed run (admin only)
  app.post("/api/threat-intel/feeds/:feedId/run", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const feedId = req.params.feedId as string;
      const run = await threatIntelService.runFeed(feedId);
      if (run) {
        res.json({ success: true, run });
      } else {
        res.status(400).json({ success: false, error: "Failed to run feed" });
      }
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get recent threat items
  app.get("/api/threat-intel/items", async (req: Request, res: Response) => {
    try {
      const { limit, feedId, itemType, severity, audience } = req.query;
      const items = await threatIntelService.getRecentItems({
        limit: limit ? parseInt(limit as string) : 50,
        feedId: feedId as string,
        itemType: itemType as string,
        severity: severity as string,
        audience: audience as string,
      });
      res.json({ success: true, items });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get threat intel statistics
  app.get("/api/threat-intel/stats", async (req: Request, res: Response) => {
    try {
      const stats = await threatIntelService.getStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get health alerts
  app.get("/api/threat-intel/alerts", async (req: Request, res: Response) => {
    try {
      const includeResolved = req.query.resolved === "true";
      const alerts = await threatIntelService.getHealthAlerts(includeResolved);
      res.json({ success: true, alerts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Acknowledge an alert
  app.post("/api/threat-intel/alerts/:alertId/acknowledge", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const alertId = req.params.alertId as string;
      await threatIntelService.acknowledgeAlert(alertId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Resolve an alert
  app.post("/api/threat-intel/alerts/:alertId/resolve", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const alertId = req.params.alertId as string;
      await threatIntelService.resolveAlert(alertId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============== CONTENT GOVERNANCE API ==============

  // Get content governance stats
  app.get("/api/content-governance/stats", async (req: Request, res: Response) => {
    try {
      const stats = await contentGovernanceService.getGovernanceStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all content pages
  app.get("/api/content-governance/pages", async (req: Request, res: Response) => {
    try {
      const section = req.query.section as string | undefined;
      const needsReview = req.query.needsReview === "true";
      
      let pages;
      if (needsReview) {
        pages = await contentGovernanceService.getPagesNeedingReview();
      } else if (section) {
        pages = await contentGovernanceService.getPagesBySection(section);
      } else {
        pages = await contentGovernanceService.getAllPages();
      }
      
      res.json({ success: true, pages });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Run full content audit
  app.post("/api/content-governance/audit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const result = await contentGovernanceService.runFullAudit();
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Mark a page as reviewed
  app.post("/api/content-governance/pages/:pageId/review", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId as string;
      const userId = (req as any).session?.userId || "admin";
      const notes = req.body?.notes as string | undefined;
      
      await contentGovernanceService.markPageReviewed(pageId, userId, notes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Dismiss review flag for a page
  app.post("/api/content-governance/pages/:pageId/dismiss", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId as string;
      const userId = (req as any).session?.userId || "admin";
      const notes = req.body?.notes as string | undefined;
      
      await contentGovernanceService.dismissReviewFlag(pageId, userId, notes);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get audit log
  app.get("/api/content-governance/audit-log", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const pageId = req.query.pageId as string | undefined;
      
      const log = pageId 
        ? await contentGovernanceService.getPageAuditLog(pageId)
        : await contentGovernanceService.getAuditLog(limit);
      
      res.json({ success: true, log });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Generate AI-powered content refresh recommendations
  app.get("/api/content-governance/pages/:pageId/refresh", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId as string;
      const refreshData = await contentGovernanceService.generateContentRefresh(pageId);
      res.json({ success: true, ...refreshData });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Apply content refresh
  app.post("/api/content-governance/pages/:pageId/refresh", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId as string;
      const userId = (req as any).session?.userId || "admin";
      const notes = req.body?.notes as string | undefined;
      
      await contentGovernanceService.applyContentRefresh(pageId, userId, notes || "Content refreshed");
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // NIST 800-53 COMPLIANCE ROUTES
  // ============================================

  // Initialize compliance service
  complianceService.initialize()
    .then(() => console.log("[compliance] NIST 800-53 controls loaded"))
    .catch(err => console.error("[compliance] Initialization failed:", err));

  // Get compliance stats
  app.get("/api/compliance/stats", async (req: Request, res: Response) => {
    try {
      const stats = await complianceService.getStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get control families
  app.get("/api/compliance/families", async (req: Request, res: Response) => {
    try {
      const families = await complianceService.getFamilies();
      res.json({ success: true, families });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get controls (optionally filtered by family)
  app.get("/api/compliance/controls", async (req: Request, res: Response) => {
    try {
      const familyId = req.query.familyId as string | undefined;
      const controls = await complianceService.getControls(familyId);
      
      const parsed = controls.map(c => ({
        ...c,
        evidence: c.evidence ? JSON.parse(c.evidence) : [],
        platformFeatures: c.platformFeatures ? JSON.parse(c.platformFeatures) : [],
        gaps: c.gaps ? JSON.parse(c.gaps) : [],
      }));
      
      res.json({ success: true, controls: parsed });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get gaps and recommendations
  app.get("/api/compliance/gaps", async (req: Request, res: Response) => {
    try {
      const gaps = await complianceService.getGaps();
      res.json({ success: true, gaps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Run compliance assessment
  app.post("/api/compliance/assess", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const stats = await complianceService.runAssessment();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update control status
  app.patch("/api/compliance/controls/:controlId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const controlId = req.params.controlId as string;
      const { status, notes } = req.body;
      
      if (!["implemented", "partial", "planned", "not_implemented", "not_applicable"].includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }
      
      await complianceService.updateControlStatus(controlId, status, notes as string | undefined);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get assessment history
  app.get("/api/compliance/assessments", async (req: Request, res: Response) => {
    try {
      const assessments = await complianceService.getAssessmentHistory();
      res.json({ success: true, assessments });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // NEWSLETTER MANAGEMENT API (Admin Only)
  // ============================================

  // Get newsletter subscriber stats
  app.get("/api/newsletter/stats", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await newsletterService.getSubscriberStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all newsletter issues
  app.get("/api/newsletter/issues", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string || "20");
      const issues = await newsletterService.getNewsletterIssues(limit);
      res.json({ success: true, issues });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get single newsletter issue
  app.get("/api/newsletter/issues/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const issueId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const issue = await newsletterService.getNewsletterIssue(issueId);
      if (!issue) {
        return res.status(404).json({ success: false, error: "Newsletter issue not found" });
      }
      res.json({ success: true, issue });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Preview a new newsletter (generates content without saving)
  app.get("/api/newsletter/preview", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const content = await newsletterService.previewNewsletter();
      res.json({ success: true, content });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Generate and schedule a new newsletter
  app.post("/api/newsletter/generate", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const issueId = await newsletterService.generateAndScheduleNewsletter();
      res.json({ success: true, issueId, message: "Newsletter generated and scheduled" });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Send a newsletter
  app.post("/api/newsletter/send/:id", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const issueId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await newsletterService.sendNewsletter(issueId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ============================================
  // TRAINING API ROUTES
  // ============================================

  // Get all published learning paths (optionally filter by audience)
  app.get("/api/training/paths", async (req: Request, res: Response) => {
    try {
      const { audience } = req.query;
      let query = db.select().from(learningPaths).where(eq(learningPaths.isPublished, true));
      
      const paths = await query;
      const filteredPaths = audience 
        ? paths.filter(p => p.audience === audience)
        : paths;
      
      res.json(filteredPaths.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's training progress summary
  app.get("/api/training/user-progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      // Get completed paths count
      const completedProgress = await db.select()
        .from(userLearningProgress)
        .where(eq(userLearningProgress.userId, userId));
      
      const completedPaths = completedProgress.filter(p => p.pathId && p.status === "completed").length;
      
      // Get certificates count
      const certs = await db.select()
        .from(trainingCertificates)
        .where(eq(trainingCertificates.userId, userId));
      
      // Get total points from user progress
      const [progress] = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));
      
      res.json({
        completedPaths,
        totalPoints: progress?.totalPoints || 0,
        certificates: certs.length
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's detailed progress for all paths
  app.get("/api/training/user-progress/detailed", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      const allPaths = await db.select().from(learningPaths);
      const allProgress = await db.select()
        .from(userLearningProgress)
        .where(eq(userLearningProgress.userId, userId));
      const allQuizAttempts = await db.select()
        .from(quizAttempts)
        .where(eq(quizAttempts.userId, userId));
      const allCerts = await db.select()
        .from(trainingCertificates)
        .where(eq(trainingCertificates.userId, userId));
      
      const pathProgress = await Promise.all(allPaths.map(async (path) => {
        const modules = await db.select()
          .from(trainingModules)
          .where(eq(trainingModules.pathId, path.id));
        
        let totalLessons = 0;
        let completedLessons = 0;
        let totalQuizzes = 0;
        let passedQuizzes = 0;
        
        for (const module of modules) {
          const lessons = await db.select()
            .from(trainingLessons)
            .where(eq(trainingLessons.moduleId, module.id));
          const quizzes = await db.select()
            .from(trainingQuizzes)
            .where(eq(trainingQuizzes.moduleId, module.id));
          
          totalLessons += lessons.length;
          totalQuizzes += quizzes.length;
          
          for (const lesson of lessons) {
            if (allProgress.find(p => p.lessonId === lesson.id && p.status === "completed")) {
              completedLessons++;
            }
          }
          for (const quiz of quizzes) {
            if (allQuizAttempts.find(a => a.quizId === quiz.id && a.passed)) {
              passedQuizzes++;
            }
          }
        }
        
        const hasCertificate = allCerts.some(c => c.pathId === path.id);
        const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        return {
          pathId: path.id,
          pathTitle: path.title,
          audience: path.audience,
          totalLessons,
          completedLessons,
          totalQuizzes,
          passedQuizzes,
          progressPercent,
          hasCertificate,
          status: progressPercent === 100 && passedQuizzes === totalQuizzes ? "completed" : 
                  progressPercent > 0 ? "in_progress" : "not_started"
        };
      }));
      
      res.json({ pathProgress });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's progress for a specific path
  app.get("/api/training/user-progress/path/:pathId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const pathId = req.params.pathId as string;
      
      const modules = await db.select()
        .from(trainingModules)
        .where(eq(trainingModules.pathId, pathId));
      
      const completedLessons: string[] = [];
      for (const module of modules) {
        const lessons = await db.select()
          .from(trainingLessons)
          .where(eq(trainingLessons.moduleId, module.id));
        
        for (const lesson of lessons) {
          const progress = await db.select()
            .from(userLearningProgress)
            .where(eq(userLearningProgress.userId, userId));
          
          if (progress.find(p => p.lessonId === lesson.id && p.status === "completed")) {
            completedLessons.push(lesson.id);
          }
        }
      }
      
      res.json({ completedLessons });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get a specific learning path with modules and lessons
  app.get("/api/training/paths/:pathId", async (req: Request, res: Response) => {
    try {
      const pathId = req.params.pathId as string;
      
      const [path] = await db.select()
        .from(learningPaths)
        .where(eq(learningPaths.id, pathId));
      
      if (!path) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      
      const modules = await db.select()
        .from(trainingModules)
        .where(eq(trainingModules.pathId, pathId));
      
      // Get lessons for each module
      const modulesWithLessons = await Promise.all(
        modules.map(async (module) => {
          const lessons = await db.select()
            .from(trainingLessons)
            .where(eq(trainingLessons.moduleId, module.id));
          
          return {
            ...module,
            lessons: lessons.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
          };
        })
      );
      
      res.json({
        ...path,
        modules: modulesWithLessons.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get module with lessons
  app.get("/api/training/modules/:moduleId", async (req: Request, res: Response) => {
    try {
      const moduleId = req.params.moduleId as string;
      
      const [module] = await db.select()
        .from(trainingModules)
        .where(eq(trainingModules.id, moduleId));
      
      if (!module) {
        return res.status(404).json({ error: "Module not found" });
      }
      
      const lessons = await db.select()
        .from(trainingLessons)
        .where(eq(trainingLessons.moduleId, moduleId));
      
      const quizzes = await db.select()
        .from(trainingQuizzes)
        .where(eq(trainingQuizzes.moduleId, moduleId));
      
      res.json({
        ...module,
        lessons: lessons.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
        quizzes
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get lesson content
  app.get("/api/training/lessons/:lessonId", async (req: Request, res: Response) => {
    try {
      const lessonId = req.params.lessonId as string;
      
      const [lesson] = await db.select()
        .from(trainingLessons)
        .where(eq(trainingLessons.id, lessonId));
      
      if (!lesson) {
        return res.status(404).json({ error: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mark lesson as complete
  app.post("/api/training/lessons/:lessonId/complete", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const lessonId = req.params.lessonId as string;
      const { timeSpent } = req.body;
      
      // Check for existing progress
      const existing = await db.select()
        .from(userLearningProgress)
        .where(eq(userLearningProgress.lessonId, lessonId));
      
      const userExisting = existing.find(p => p.userId === userId);
      
      if (userExisting) {
        await db.update(userLearningProgress)
          .set({
            status: "completed",
            progressPercent: 100,
            timeSpentMinutes: (userExisting.timeSpentMinutes || 0) + (timeSpent || 0),
            completedAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(userLearningProgress.id, userExisting.id));
      } else {
        await db.insert(userLearningProgress).values({
          userId,
          lessonId,
          status: "completed",
          progressPercent: 100,
          timeSpentMinutes: timeSpent || 0,
          startedAt: new Date(),
          completedAt: new Date(),
          lastAccessedAt: new Date()
        });
      }
      
      // Award points for completing lesson
      const [progress] = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));
      
      if (progress) {
        await db.update(userProgress)
          .set({
            lessonsCompleted: (progress.lessonsCompleted || 0) + 1,
            totalPoints: (progress.totalPoints || 0) + 25,
            lastActivityDate: new Date(),
            updatedAt: new Date()
          })
          .where(eq(userProgress.userId, userId));
      }
      
      res.json({ success: true, pointsEarned: 25 });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get quiz with questions
  app.get("/api/training/quizzes/:quizId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const quizId = req.params.quizId as string;
      
      const [quiz] = await db.select()
        .from(trainingQuizzes)
        .where(eq(trainingQuizzes.id, quizId));
      
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      const questions = await db.select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId));
      
      // Don't send correct answers to client
      const safeQuestions = questions.map(q => ({
        id: q.id,
        questionType: q.questionType,
        questionText: q.questionText,
        options: q.options,
        scenarioContext: q.scenarioContext,
        difficulty: q.difficulty,
        points: q.points
      }));
      
      res.json({
        ...quiz,
        questions: quiz.shuffleQuestions 
          ? safeQuestions.sort(() => Math.random() - 0.5)
          : safeQuestions.sort((a, b) => questions.findIndex(q => q.id === a.id) - questions.findIndex(q => q.id === b.id))
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Submit quiz answers
  app.post("/api/training/quizzes/:quizId/submit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const quizId = req.params.quizId as string;
      const { answers, timeSpentSeconds } = req.body;
      
      const [quiz] = await db.select()
        .from(trainingQuizzes)
        .where(eq(trainingQuizzes.id, quizId));
      
      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }
      
      // Get all questions with correct answers
      const questions = await db.select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId));
      
      // Calculate score
      let score = 0;
      let maxScore = 0;
      const results: Record<string, { correct: boolean; correctAnswer?: string; explanation?: string }> = {};
      
      for (const question of questions) {
        maxScore += question.points || 10;
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        
        if (isCorrect) {
          score += question.points || 10;
        }
        
        results[question.id] = {
          correct: isCorrect,
          correctAnswer: quiz.showCorrectAnswers ? question.correctAnswer : undefined,
          explanation: quiz.showCorrectAnswers ? question.explanation || undefined : undefined
        };
      }
      
      const percentScore = Math.round((score / maxScore) * 100);
      const passed = percentScore >= (quiz.passingScore || 70);
      
      // Get attempt number
      const previousAttempts = await db.select()
        .from(quizAttempts)
        .where(eq(quizAttempts.quizId, quizId));
      
      const userAttempts = previousAttempts.filter(a => a.userId === userId);
      const attemptNumber = userAttempts.length + 1;
      
      // Save attempt
      await db.insert(quizAttempts).values({
        userId,
        quizId,
        score,
        maxScore,
        percentScore,
        passed,
        answers: JSON.stringify(answers),
        timeSpentSeconds,
        attemptNumber
      });
      
      // Award points if passed
      if (passed) {
        const [progress] = await db.select()
          .from(userProgress)
          .where(eq(userProgress.userId, userId));
        
        if (progress) {
          await db.update(userProgress)
            .set({
              totalPoints: (progress.totalPoints || 0) + 50,
              lastActivityDate: new Date(),
              updatedAt: new Date()
            })
            .where(eq(userProgress.userId, userId));
        }
      }
      
      res.json({
        score,
        maxScore,
        percentScore,
        passed,
        results,
        attemptNumber,
        pointsEarned: passed ? 50 : 0
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get user's certificates
  app.get("/api/training/certificates", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      
      const certs = await db.select()
        .from(trainingCertificates)
        .where(eq(trainingCertificates.userId, userId));
      
      res.json(certs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate certificate for completed path
  app.post("/api/training/paths/:pathId/certificate", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const pathId = req.params.pathId as string;
      
      // Check if path exists
      const [path] = await db.select()
        .from(learningPaths)
        .where(eq(learningPaths.id, pathId));
      
      if (!path) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      
      // Check if certificate already exists
      const existingCerts = await db.select()
        .from(trainingCertificates)
        .where(eq(trainingCertificates.pathId, pathId));
      
      const userCert = existingCerts.find(c => c.userId === userId);
      if (userCert) {
        return res.json({ certificate: userCert, message: "Certificate already issued" });
      }
      
      // Verify all modules are completed (at least 70% quiz score on each)
      const modules = await db.select()
        .from(trainingModules)
        .where(eq(trainingModules.pathId, pathId));
      
      if (modules.length === 0) {
        return res.status(400).json({ 
          error: "This learning path has no modules yet" 
        });
      }
      
      let allPassed = true;
      let totalScore = 0;
      let quizCount = 0;
      let requiredQuizzes = 0;
      
      for (const module of modules) {
        const quizzes = await db.select()
          .from(trainingQuizzes)
          .where(eq(trainingQuizzes.moduleId, module.id));
        
        requiredQuizzes += quizzes.length;
        
        for (const quiz of quizzes) {
          const attempts = await db.select()
            .from(quizAttempts)
            .where(eq(quizAttempts.quizId, quiz.id));
          
          const userAttempts = attempts.filter(a => a.userId === userId && a.passed);
          if (userAttempts.length === 0) {
            allPassed = false;
          } else {
            const bestAttempt = userAttempts.reduce((best, curr) => 
              curr.percentScore > best.percentScore ? curr : best
            );
            totalScore += bestAttempt.percentScore;
            quizCount++;
          }
        }
      }
      
      if (requiredQuizzes === 0) {
        return res.status(400).json({ 
          error: "This learning path has no quizzes configured yet" 
        });
      }
      
      if (!allPassed) {
        return res.status(400).json({ 
          error: "Complete all module quizzes with a passing score to earn your certificate" 
        });
      }
      
      const averageScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;
      
      // Generate certificate
      const certificateNumber = `GCR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const [certificate] = await db.insert(trainingCertificates).values({
        userId,
        pathId,
        certificateName: path.certificateName || "Digital Safety Aware",
        certificateNumber,
        finalScore: averageScore,
        verificationUrl: `/verify/${certificateNumber}`
      }).returning();
      
      // Award bonus points for earning certificate
      const [progress] = await db.select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId));
      
      if (progress) {
        await db.update(userProgress)
          .set({
            totalPoints: (progress.totalPoints || 0) + 200,
            lastActivityDate: new Date(),
            updatedAt: new Date()
          })
          .where(eq(userProgress.userId, userId));
      }
      
      res.json({ 
        success: true, 
        certificate,
        message: "Congratulations! Certificate issued successfully.",
        pointsEarned: 200
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Verify a certificate (public endpoint)
  app.get("/api/training/verify/:certificateNumber", async (req: Request, res: Response) => {
    try {
      const certificateNumber = req.params.certificateNumber as string;
      
      const certs = await db.select()
        .from(trainingCertificates);
      
      const certificate = certs.find(c => c.certificateNumber === certificateNumber);
      
      if (!certificate) {
        return res.status(404).json({ valid: false, error: "Certificate not found" });
      }
      
      const [path] = await db.select()
        .from(learningPaths)
        .where(eq(learningPaths.id, certificate.pathId));
      
      res.json({
        valid: true,
        certificate: {
          certificateName: certificate.certificateName,
          certificateNumber: certificate.certificateNumber,
          issueDate: certificate.issueDate,
          courseName: path?.title,
          courseLevel: path?.level
        }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================
  // DATA BROKER REMOVAL SYSTEM ROUTES
  // ============================================

  app.get("/api/data-removal/brokers", standardRateLimit, async (req: Request, res: Response) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        search: req.query.search as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      };
      const result = await getBrokerCatalog(filters);
      res.json(result);
    } catch (error: any) {
      console.error("Error fetching broker catalog:", error);
      res.status(500).json({ error: "Failed to fetch broker catalog" });
    }
  });

  app.get("/api/data-removal/brokers/:id", standardRateLimit, async (req: Request, res: Response) => {
    try {
      const brokerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const broker = await getBrokerById(brokerId);
      if (!broker) {
        return res.status(404).json({ error: "Broker not found" });
      }
      res.json(broker);
    } catch (error: any) {
      console.error("Error fetching broker:", error);
      res.status(500).json({ error: "Failed to fetch broker details" });
    }
  });

  app.post("/api/data-removal/guest-scan", strictRateLimit, async (req: Request, res: Response) => {
    try {
      const { fullName, emails, phoneNumbers, currentAddress } = req.body;
      if (!fullName) {
        return res.status(400).json({ error: "Please provide at least your name" });
      }
      const result = await runGuestExposureScan({
        fullName,
        emails: emails || [],
        phoneNumbers: phoneNumbers || [],
        currentAddress: currentAddress || "",
      });
      res.json(result);
    } catch (error: any) {
      console.error("Error running guest scan:", error);
      res.status(500).json({ error: error.message || "Failed to run scan" });
    }
  });

  app.get("/api/data-removal/vault", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const profile = await getUserVaultProfile(user.id);
      res.json(profile);
    } catch (error: any) {
      console.error("Error fetching vault profile:", error);
      res.status(500).json({ error: "Failed to fetch vault profile" });
    }
  });

  app.post("/api/data-removal/vault", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const sanitized = { ...req.body };
      const arrayFields = ["previousNames", "emails", "phoneNumbers", "previousAddresses", "relativeNames", "employerNames"];
      for (const field of arrayFields) {
        if (sanitized[field]) {
          sanitized[field] = sanitized[field].filter((v: string) => v && v.trim().length > 0);
          if (sanitized[field].length === 0) delete sanitized[field];
        }
      }
      const stringFields = ["fullName", "currentAddress", "dateOfBirth"];
      for (const field of stringFields) {
        if (sanitized[field] && typeof sanitized[field] === "string") {
          sanitized[field] = sanitized[field].trim();
          if (sanitized[field].length === 0) delete sanitized[field];
        }
      }
      const retentionDays = 365;
      const retentionExpiresAt = new Date();
      retentionExpiresAt.setDate(retentionExpiresAt.getDate() + retentionDays);
      sanitized.retentionExpiresAt = retentionExpiresAt;
      sanitized.lastAccessedAt = new Date();
      sanitized.dataMinimized = true;

      const profile = await upsertVaultProfile(user.id, sanitized);
      res.json(profile);
    } catch (error: any) {
      console.error("Error upserting vault profile:", error);
      res.status(500).json({ error: "Failed to save vault profile" });
    }
  });

  app.get("/api/data-removal/vault/profiles", isAuthenticated, requireSubscription("essential"), async (req: any, res: Response) => {
    try {
      const profiles = await getAllVaultProfiles(req.user.id);
      res.json(profiles);
    } catch (error: any) {
      console.error("Error fetching vault profiles:", error);
      res.status(500).json({ error: "Failed to fetch vault profiles" });
    }
  });

  app.post("/api/data-removal/vault/family", isAuthenticated, requireSubscription("essential"), async (req: any, res: Response) => {
    try {
      const { profileName, fullName, emails, phoneNumbers, currentAddress } = req.body;
      if (!profileName) {
        return res.status(400).json({ error: "Profile name is required" });
      }
      const profile = await createFamilyProfile(req.user.id, {
        profileName,
        fullName,
        emails,
        phoneNumbers,
        currentAddress,
      });
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating family profile:", error);
      res.status(400).json({ error: error.message || "Failed to create family profile" });
    }
  });

  app.delete("/api/data-removal/vault/family/:id", isAuthenticated, requireSubscription("essential"), async (req: any, res: Response) => {
    try {
      const profileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await deleteFamilyProfile(req.user.id, profileId);
      res.json(result);
    } catch (error: any) {
      console.error("Error deleting family profile:", error);
      res.status(400).json({ error: error.message || "Failed to delete family profile" });
    }
  });

  app.post("/api/data-removal/scan", isAuthenticated, requireSubscription("essential"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { vaultProfileId } = req.body;
      if (!vaultProfileId) {
        return res.status(400).json({ error: "vaultProfileId is required" });
      }

      const result = await runExposureScan(user.id, vaultProfileId);

      res.json(result);
    } catch (error: any) {
      console.error("Error running exposure scan:", error);
      res.status(500).json({ error: error.message || "Failed to run exposure scan" });
    }
  });

  app.get("/api/data-removal/scans", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const scans = await getUserScanHistory(user.id);
      res.json(scans);
    } catch (error: any) {
      console.error("Error fetching scan history:", error);
      res.status(500).json({ error: "Failed to fetch scan history" });
    }
  });

  app.get("/api/data-removal/findings/:scanId", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const findings = await getExposureFindings(user.id, req.params.scanId);
      res.json(findings);
    } catch (error: any) {
      console.error("Error fetching findings:", error);
      res.status(500).json({ error: "Failed to fetch exposure findings" });
    }
  });

  app.post("/api/data-removal/requests", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { brokerId, vaultProfileId, findingId } = req.body;
      if (!brokerId || !vaultProfileId) {
        return res.status(400).json({ error: "brokerId and vaultProfileId are required" });
      }
      const ipAddress = req.ip || req.connection?.remoteAddress;
      const request = await createRemovalRequest(user.id, brokerId, vaultProfileId, findingId, ipAddress);
      res.json(request);
    } catch (error: any) {
      console.error("Error creating removal request:", error);
      res.status(500).json({ error: error.message || "Failed to create removal request" });
    }
  });

  app.get("/api/data-removal/requests", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const status = req.query.status as string | undefined;
      const requests = await getUserRemovalRequests(user.id, status);
      res.json(requests);
    } catch (error: any) {
      console.error("Error fetching removal requests:", error);
      res.status(500).json({ error: "Failed to fetch removal requests" });
    }
  });

  app.patch("/api/data-removal/requests/:id/status", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { status, notes } = req.body;
      if (!status) {
        return res.status(400).json({ error: "status is required" });
      }
      const ipAddress = req.ip || req.connection?.remoteAddress;
      const updated = await updateRemovalStatus(user.id, req.params.id, status, notes, ipAddress);
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating removal status:", error);
      res.status(400).json({ error: error.message || "Failed to update removal status" });
    }
  });

  app.post("/api/data-removal/requests/:id/generate", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const requestId = req.params.id;
      const [removalReq] = await db.select().from(removalRequests).where(and(eq(removalRequests.id, requestId), eq(removalRequests.userId, user.id)));
      if (!removalReq) {
        return res.status(404).json({ error: "Removal request not found" });
      }
      const content = await generateOptOutContent(user.id, removalReq.brokerId);
      res.json(content);
    } catch (error: any) {
      console.error("Error generating opt-out content:", error);
      res.status(500).json({ error: error.message || "Failed to generate opt-out content" });
    }
  });

  app.get("/api/data-removal/dashboard", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const stats = await getRemovalDashboardStats(user.id);
      res.json(stats);
    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  app.post("/api/data-removal/monitoring", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { vaultProfileId, frequencyDays, autoReRemoval, notifyOnNewExposure, notifyOnReAppearance, notifyOnComplianceDeadline, monitoringMode, darkWebMonitoring } = req.body;
      if (!vaultProfileId || !frequencyDays) {
        return res.status(400).json({ error: "vaultProfileId and frequencyDays are required" });
      }
      const schedule = await setupMonitoring(user.id, vaultProfileId, frequencyDays, {
        autoReRemoval,
        notifyOnNewExposure,
        notifyOnReAppearance,
        notifyOnComplianceDeadline,
        monitoringMode,
        darkWebMonitoring,
      });
      res.json(schedule);
    } catch (error: any) {
      console.error("Error setting up monitoring:", error);
      res.status(500).json({ error: "Failed to setup monitoring" });
    }
  });

  app.get("/api/data-removal/monitoring", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const schedule = await getMonitoringSchedule(user.id);
      res.json(schedule);
    } catch (error: any) {
      console.error("Error fetching monitoring schedule:", error);
      res.status(500).json({ error: "Failed to fetch monitoring schedule" });
    }
  });

  app.post("/api/data-removal/monitoring/run", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const result = await runMonitoringScan(req.user.id);
      res.json(result);
    } catch (error: any) {
      console.error("Error running monitoring scan:", error);
      res.status(500).json({ error: error.message || "Failed to run monitoring scan" });
    }
  });

  app.post("/api/data-removal/report", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const report = await generatePrivacyReport(user.id);
      res.json(report);
    } catch (error: any) {
      console.error("Error generating privacy report:", error);
      res.status(500).json({ error: "Failed to generate privacy report" });
    }
  });

  app.get("/api/data-removal/requests/retryable", isAuthenticated, async (req: any, res: Response) => {
    try {
      const requests = await getRetryableRequests(req.user.id);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch retryable requests" });
    }
  });

  app.get("/api/data-removal/requests/escalated", isAuthenticated, async (req: any, res: Response) => {
    try {
      const requests = await getEscalatedRequests(req.user.id);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch escalated requests" });
    }
  });

  app.get("/api/data-removal/requests/overdue", isAuthenticated, async (req: any, res: Response) => {
    try {
      const requests = await getOverdueRequests(req.user.id);
      res.json(requests);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch overdue requests" });
    }
  });

  app.get("/api/data-removal/compliance", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { getComplianceDashboard } = await import("./dataBrokerService");
      const dashboard = await getComplianceDashboard(req.user.id);
      res.json(dashboard);
    } catch (error: any) {
      console.error("Error fetching compliance dashboard:", error);
      res.status(500).json({ error: "Failed to fetch compliance data" });
    }
  });

  app.get("/api/data-removal/audit-log", isAuthenticated, async (req: any, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const logs = await getAuditLog(req.user.id, Math.min(limit, 200));
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch audit log" });
    }
  });

  return httpServer;
}
