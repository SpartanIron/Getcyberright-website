import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
<<<<<<< HEAD
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactMessageSchema, insertNewsletterSubscriberSchema, insertScamReportSchema, SUBSCRIPTION_TIERS, hasTierAccess, users, scamReports, userProgress, userBadges, badgeDefinitions, familyCodewords, audioAnalysisHistory, learningPaths, trainingModules, trainingLessons, trainingQuizzes, quizQuestions, userLearningProgress, quizAttempts, trainingCertificates, removalRequests, userVaultProfiles, exposureFindings } from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";
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
  sendAutoRemovalRequest,
  bulkAutoRemoval,
  createVerification,
  completeVerification,
  getUserVerifications,
  getPendingVerifications,
  generateProgressReport,
  getBrokerMetrics,
  dataBrokerScheduler,
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
=======
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { db } from "./db";
import { thumbnailService } from "./thumbnail-service";
import { sendEmail } from "./email-service";
import { 
  insertArticleSchema, 
  insertResourceSchema, 
  insertNewsletterSchema, 
  insertUserAssessmentResultSchema,
  insertCyberAssessmentSchema,
  insertDailyTipsSubscriptionSchema,
  insertPartnershipInquirySchema,
  cyberAssessments,
  breachMonitoringSubscriptions
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { body, query, param } from 'express-validator';
import {
  strictRateLimit,
  cyberHygieneRateLimit,
  scamCheckRateLimit,
  urlCheckRateLimit,
  formSubmissionRateLimit,
  honeypotProtection,
  handleValidationErrors,
  bruteForceProtection
} from "./security/middleware";
import {
  validateArticleQuery,
  validateArticleId,
  validateResourceQuery,
  validateResourceId,
  validateNewsletterSubscription,
  validateAssessmentId,
  validateAssessmentSubmission,
  validateSearchQuery,
  validateCyberHygiene,
  validateUserScoreQuery,
  validateIdParam,
  validatePagination
} from "./security/validators";
import {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requireModerator,
  generateToken,
  hashPassword,
  comparePassword,
  validatePassword,
  validateUsername,
  isAccountLocked,
  incrementFailedAttempts,
  unlockAccount,
  authSecurityHeaders,
  type AuthenticatedRequest
} from "./security/auth";
import { newsAggregator } from "./news-aggregator";
import { analyzeURL, analyzeScamDescription, analyzePhone, analyzeImage, checkBitcoinAbuse, extractBitcoinAddresses, analyzeEmailHeadersEnhanced } from "./scam-checker";
import multer from "multer";
import { sanitizeText, escapeForAttribute } from "./security/sanitizer";
import { recaptchaMiddleware } from "./security/recaptcha";
import { submitToIndexNow, submitSitemapToIndexNow, getApiKey } from "./indexnow";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerWebAuthnRoutes } from "./webauthn";

// Cybersecurity News Sources Integration
interface CyberNewsArticle {
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  urlToImage: string;
  url: string;
  source: {
    name: string;
  };
}

interface RSSItem {
  title: string;
  description?: string;
  link: string;
  pubDate?: string;
  creator?: string;
  content?: string;
  source?: string;
}

async function parseXMLToJSON(xmlText: string): Promise<any> {
  const items: RSSItem[] = [];
  
  // Clean up XML text
  const cleanXml = xmlText.replace(/\n\s*\n/g, '\n').trim();
  
  // Extract items from RSS/XML - handle both <item> and <entry> tags
  const itemMatches = cleanXml.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || 
                      cleanXml.match(/<entry[^>]*>[\s\S]*?<\/entry>/gi) || [];
  
  for (const itemXml of itemMatches) {
    try {
      // Extract title
      let title = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
      if (title) {
        title = title.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&')
                    .replace(/&quot;/g, '"')
                    .replace(/&apos;/g, "'")
                    .replace(/<[^>]*>/g, '')
                    .trim();
      }
      
      // Extract description
      let description = itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ||
                       itemXml.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ||
                       itemXml.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1];
      
      if (description) {
        description = description.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
                                .replace(/&lt;/g, '<')
                                .replace(/&gt;/g, '>')
                                .replace(/&amp;/g, '&')
                                .replace(/&quot;/g, '"')
                                .replace(/&apos;/g, "'")
                                .replace(/<[^>]*>/g, '')
                                .trim()
                                .substring(0, 400);
      }
      
      // Extract link
      let link = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ||
                 itemXml.match(/<link[^>]*href=["'](.*?)["'][^>]*>/i)?.[1] ||
                 itemXml.match(/<guid[^>]*>(https?:\/\/[^<]+)<\/guid>/i)?.[1];
      
      // Extract publication date
      const pubDate = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1] ||
                      itemXml.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1] ||
                      itemXml.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1] ||
                      itemXml.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i)?.[1];
      
      // Extract creator/author
      let creator = itemXml.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i)?.[1] ||
                    itemXml.match(/<author[^>]*><name[^>]*>([\s\S]*?)<\/name>/i)?.[1] ||
                    itemXml.match(/<author[^>]*>([\s\S]*?)<\/author>/i)?.[1];
      
      if (creator) {
        creator = creator.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
                        .replace(/<[^>]*>/g, '')
                        .trim();
      }
      
      if (title && link) {
        items.push({
          title,
          description: description || title,
          link: link.startsWith('http') ? link : '',
          pubDate: pubDate?.trim(),
          creator: creator || 'Unknown'
        });
      }
    } catch (error) {
      console.warn('Error parsing XML item:', error);
      continue;
    }
  }
  
  return { items };
}

async function fetchRSSFeed(url: string, sourceName: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'GetCyberRight News Aggregator 1.0'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${sourceName}: ${response.status}`);
      return [];
    }
    
    const xmlText = await response.text();
    const data = await parseXMLToJSON(xmlText);
    
    return data.items.map((item: RSSItem) => ({
      ...item,
      source: sourceName
    }) as RSSItem).slice(0, 10); // Limit to 10 items per source
    
  } catch (error) {
    console.error(`Error fetching ${sourceName}:`, error);
    return [];
  }
}

async function fetchHackerNewsStories(): Promise<RSSItem[]> {
  try {
    const response = await fetch('https://hn.algolia.com/api/v1/search?query=cybersecurity%20OR%20security%20OR%20breach%20OR%20vulnerability&tags=story&hitsPerPage=15');
    const data = await response.json();
    
    return data.hits.map((hit: any) => ({
      title: hit.title,
      description: hit.story_text || hit.comment_text || hit.title,
      link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
      pubDate: hit.created_at,
      creator: hit.author,
      source: 'Hacker News'
    }));
  } catch (error) {
    console.error('Error fetching Hacker News:', error);
    return [];
  }
}

async function fetchNVDFeeds(): Promise<RSSItem[]> {
  try {
    // Fetch recent CVEs from NVD
    const response = await fetch('https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=20&startIndex=0');
    const data = await response.json();
    
    return data.vulnerabilities?.map((vuln: any) => ({
      title: `CVE-${vuln.cve.id}: ${vuln.cve.descriptions[0]?.value.substring(0, 100)}...`,
      description: vuln.cve.descriptions[0]?.value,
      link: `https://nvd.nist.gov/vuln/detail/${vuln.cve.id}`,
      pubDate: vuln.cve.published,
      creator: 'NIST NVD',
      source: 'NIST NVD'
    })).slice(0, 10) || [];
  } catch (error) {
    console.error('Error fetching NVD data:', error);
    return [];
  }
}

async function fetchAINewsFromAPIs(): Promise<RSSItem[]> {
  const aiNewsItems: RSSItem[] = [];
  
  try {
    // Guardian API free tier for technology articles
    const guardianResponse = await fetch(
      'https://content.guardianapis.com/search?q=artificial%20intelligence%20OR%20robotics&section=technology&page-size=20&show-fields=headline,byline,trailText&api-key=test'
    );
    const guardianData = await guardianResponse.json();
    
    if (guardianData.response?.results) {
      guardianData.response.results.forEach((article: any) => {
        aiNewsItems.push({
          title: article.fields?.headline || article.webTitle,
          description: article.fields?.trailText || '',
          link: article.webUrl,
          pubDate: article.webPublicationDate,
          creator: article.fields?.byline || 'The Guardian',
          source: 'Guardian'
        });
      });
    }
    
    // ArXiv API for AI research papers
    const arxivResponse = await fetch(
      'https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.RO+OR+cat:cs.LG&start=0&max_results=20&sortBy=submittedDate&sortOrder=descending'
    );
    const arxivText = await arxivResponse.text();
    const arxivData = await parseXMLToJSON(arxivText);
    
    if (arxivData.feed?.entry) {
      const entries = Array.isArray(arxivData.feed.entry) ? arxivData.feed.entry : [arxivData.feed.entry];
      entries.forEach((paper: any) => {
        aiNewsItems.push({
          title: paper.title,
          description: paper.summary?.substring(0, 200) + '...',
          link: paper.id,
          pubDate: paper.published,
          creator: Array.isArray(paper.author) ? paper.author[0].name : paper.author?.name || 'arXiv',
          source: 'arXiv'
        });
      });
    }
    
    // Hacker News for AI content
    const hnAIResponse = await fetch('https://hn.algolia.com/api/v1/search?query=artificial%20intelligence%20OR%20machine%20learning%20OR%20robotics%20OR%20AI&tags=story&hitsPerPage=15');
    const hnAIData = await hnAIResponse.json();
    
    hnAIData.hits.forEach((hit: any) => {
      aiNewsItems.push({
        title: hit.title,
        description: hit.story_text || hit.comment_text || hit.title,
        link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
        pubDate: hit.created_at,
        creator: hit.author,
        source: 'Hacker News AI'
      });
    });
    
  } catch (error) {
    console.error('Error fetching AI news from APIs:', error);
  }
  
  return aiNewsItems;
}

async function fetchCybersecurityNews(): Promise<CyberNewsArticle[]> {
  try {
    const newsFeeds = [
      // Cybersecurity feeds - reliable sources
      { url: 'https://www.cisa.gov/news.xml', name: 'CISA' },
      { url: 'https://feeds.feedburner.com/eset/blog', name: 'ESET' },
      { url: 'https://feeds.feedburner.com/TheHackersNews', name: 'The Hacker News' },
      { url: 'https://www.bleepingcomputer.com/feed/', name: 'BleepingComputer' },
      { url: 'https://www.securityweek.com/feed/', name: 'SecurityWeek' },
      { url: 'https://www.infosecurity-magazine.com/rss/news/', name: 'Infosecurity Magazine' },
      { url: 'https://www.darkreading.com/rss.xml', name: 'Dark Reading' },
      { url: 'https://krebsonsecurity.com/feed/', name: 'Krebs on Security' },
      { url: 'https://nakedsecurity.sophos.com/feed/', name: 'Sophos Naked Security' },
      
      // AI and Machine Learning feeds - working sources
      { url: 'https://openai.com/blog/rss.xml', name: 'OpenAI Blog' },
      { url: 'https://www.microsoft.com/en-us/research/feed/', name: 'Microsoft Research' },
      { url: 'https://deepmind.google/blog/rss.xml', name: 'Google DeepMind' },
      
      // Technology and Innovation feeds
      { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat AI' },
      { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', name: 'TechCrunch AI' },
      { url: 'https://www.wired.com/feed/tag/ai/latest/rss', name: 'WIRED AI' },
      { url: 'https://www.technologyreview.com/feed/', name: 'MIT Technology Review' }
    ];
    
    const allPromises = [
      ...newsFeeds.map(feed => fetchRSSFeed(feed.url, feed.name)),
      fetchHackerNewsStories(),
      fetchNVDFeeds(),
      fetchAINewsFromAPIs()
    ];
    
    const results = await Promise.allSettled(allPromises);
    const allArticles: RSSItem[] = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      } else {
        console.warn(`Failed to fetch from source ${index}:`, result.reason);
      }
    });
    
    // Convert to our article format and remove duplicates with content filtering
    const articles: CyberNewsArticle[] = allArticles
      .filter((item, index, self) => 
        index === self.findIndex(a => a.title === item.title || a.link === item.link)
      )
      // Filter out inappropriate content
      .filter(item => {
        const title = item.title.toLowerCase();
        const description = (item.description || '').toLowerCase();
        const content = title + ' ' + description;
        
        // Block inappropriate content
        const inappropriateKeywords = [
          'body', 'cemetery', 'hide a body', 'murder', 'kill', 'death', 'dead',
          'suicide', 'violence', 'drugs', 'illegal', 'crime', 'nsfw'
        ];
        
        // Block non-cybersecurity content
        const irrelevantKeywords = [
          '[d]', '[r]', 'best place to hide', 'random', 'funny', 'meme'
        ];
        
        // Check if content contains inappropriate or irrelevant keywords
        const hasInappropriate = inappropriateKeywords.some(keyword => 
          content.includes(keyword)
        );
        const hasIrrelevant = irrelevantKeywords.some(keyword => 
          content.includes(keyword)
        );
        
        // Only allow cybersecurity-related content
        const cybersecurityKeywords = [
          'security', 'cyber', 'vulnerability', 'threat', 'malware', 'phishing',
          'encryption', 'firewall', 'breach', 'attack', 'hack', 'privacy',
          'authentication', 'authorization', 'compliance', 'policy', 'risk',
          'incident', 'response', 'forensics', 'network', 'endpoint', 'cloud'
        ];
        
        const isCybersecurityRelated = cybersecurityKeywords.some(keyword => 
          content.includes(keyword)
        );
        
        return !hasInappropriate && !hasIrrelevant && (isCybersecurityRelated || item.source === 'CVE' || item.source === 'CISA');
      })
      .map(item => ({
        title: item.title,
        description: item.description || '',
        content: item.description || item.title,
        author: item.creator || item.source || 'Unknown',
        publishedAt: item.pubDate || new Date().toISOString(),
        urlToImage: '',
        url: item.link,
        source: {
          name: item.source || 'Cybersecurity News'
        }
      }))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 50); // Limit to 50 most recent articles
    
    return articles;
  } catch (error) {
    console.error('Error aggregating cybersecurity news:', error);
    return [];
  }
}

function convertNewsToArticle(newsArticle: CyberNewsArticle, category?: string) {
  // Auto-categorize based on content if not specified
  if (!category) {
    const content = (newsArticle.title + " " + newsArticle.description).toLowerCase();
    
    if (content.includes('threat') || content.includes('malware') || content.includes('attack') || 
        content.includes('vulnerability') || content.includes('exploit') || content.includes('breach') ||
        content.includes('ransomware') || content.includes('phishing') || content.includes('ddos')) {
      category = "Threats";
    } else if (content.includes('policy') || content.includes('regulation') || content.includes('compliance') || 
               content.includes('privacy') || content.includes('gdpr') || content.includes('law') ||
               content.includes('government') || content.includes('legal')) {
      category = "Policy";
    } else {
      category = "News";
    }
  }

  return {
    title: newsArticle.title,
    excerpt: newsArticle.description || newsArticle.content?.substring(0, 200) + "..." || "",
    content: newsArticle.content || newsArticle.description || "",
    category,
    author: newsArticle.author || newsArticle.source.name || "News Team",
    authorTitle: "Industry Reporter",
    authorAvatar: null,
    imageUrl: newsArticle.urlToImage,
    url: newsArticle.url,
    source: newsArticle.source.name,
    readTime: Math.max(2, Math.floor((newsArticle.content?.length || 500) / 200)),
    featured: false,
    breaking: false,
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ========================================
  // REPLIT AUTH SETUP (must be before other routes)
  // ========================================
  const { setupAuth, registerAuthRoutes } = await import("./replit_integrations/auth");
  await setupAuth(app);
  registerAuthRoutes(app);

  // ========================================
  // CHAT ROUTES (AI Safety Assistant)
  // ========================================
  registerChatRoutes(app);

  // ========================================
  // WEBAUTHN (PASSKEYS) ROUTES
  // ========================================
  registerWebAuthnRoutes(app);

  // ========================================
  // SEO ROUTES
  // ========================================
  
  // Dynamic sitemap.xml for search engines
  app.get("/sitemap.xml", async (req: Request, res: Response) => {
    try {
      const baseUrl = "https://www.getcyberright.com";
      
      // Static pages
      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "daily" },
        { url: "/news", priority: "0.9", changefreq: "hourly" },
        { url: "/educate", priority: "0.9", changefreq: "weekly" },
        { url: "/equip", priority: "0.9", changefreq: "weekly" },
        { url: "/protect", priority: "0.9", changefreq: "weekly" },
        { url: "/safety-score", priority: "0.8", changefreq: "weekly" },
        { url: "/youth-safety", priority: "0.8", changefreq: "weekly" },
        { url: "/senior-safety", priority: "0.8", changefreq: "weekly" },
        { url: "/parent-guide", priority: "0.8", changefreq: "weekly" },
        { url: "/scam-checker", priority: "0.8", changefreq: "weekly" },
        { url: "/password-generator", priority: "0.8", changefreq: "monthly" },
        { url: "/emergency-help", priority: "0.8", changefreq: "monthly" },
        { url: "/threat-intelligence", priority: "0.7", changefreq: "daily" },
        { url: "/resources", priority: "0.7", changefreq: "weekly" },
        { url: "/printable-guides", priority: "0.7", changefreq: "monthly" },
        { url: "/cyber-awareness", priority: "0.7", changefreq: "monthly" },
        { url: "/cyber-assessment", priority: "0.7", changefreq: "monthly" },
        { url: "/quick-assessment", priority: "0.7", changefreq: "monthly" },
        { url: "/cyber-hygiene", priority: "0.7", changefreq: "monthly" },
        { url: "/travel-safety", priority: "0.7", changefreq: "monthly" },
        { url: "/impact", priority: "0.6", changefreq: "monthly" },
        { url: "/tutorials", priority: "0.6", changefreq: "weekly" },
        { url: "/podcasts", priority: "0.6", changefreq: "weekly" },
        { url: "/about", priority: "0.5", changefreq: "monthly" },
        { url: "/contact", priority: "0.5", changefreq: "monthly" },
        { url: "/advertise", priority: "0.5", changefreq: "monthly" },
        { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
        { url: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
      ];
      
      // Get dynamic articles
      const articles = await storage.getArticles();
      const resources = await storage.getResources();
      
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
      
      // Add static pages
      for (const page of staticPages) {
        sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
      }
      
      // Add articles
      for (const article of articles) {
        sitemap += `  <url>
    <loc>${baseUrl}/news/${article.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
      }
      
      // Add resources
      for (const resource of resources) {
        sitemap += `  <url>
    <loc>${baseUrl}/resources/${resource.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
`;
      }
      
      sitemap += `</urlset>`;
      
      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap generation error:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // IndexNow verification file
  app.get("/:key.txt", (req: Request, res: Response, next) => {
    const apiKey = getApiKey();
    if (apiKey && req.params.key === apiKey) {
      res.header("Content-Type", "text/plain");
      res.send(apiKey);
    } else {
      next();
    }
  });

  // IndexNow URL submission endpoint (admin only)
  app.post("/api/indexnow/submit", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { urls } = req.body;
      
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ message: "URLs array required" });
      }
      
      if (urls.length > 10000) {
        return res.status(400).json({ message: "Maximum 10,000 URLs per request" });
      }
      
      const result = await submitToIndexNow(urls);
      res.json(result);
    } catch (error) {
      console.error("IndexNow submission error:", error);
      res.status(500).json({ message: "Failed to submit to IndexNow" });
    }
  });

  // IndexNow submit all sitemap pages (admin only)
  app.post("/api/indexnow/submit-sitemap", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const result = await submitSitemapToIndexNow();
      res.json(result);
    } catch (error) {
      console.error("IndexNow sitemap submission error:", error);
      res.status(500).json({ message: "Failed to submit sitemap to IndexNow" });
    }
  });

  // ========================================
  // LIVE NEWS AGGREGATOR ROUTES
  // ========================================

  // Get all latest news (cached, auto-refreshing)
  app.get("/api/news/latest", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const news = await newsAggregator.getLatestNews(limit);
      const isLoading = !newsAggregator.isCacheAvailable() && newsAggregator.isCurrentlyFetching();
      
      res.json({
        articles: news,
        lastUpdated: newsAggregator.getLastFetchTime()?.toISOString(),
        stats: newsAggregator.getCacheStats(),
        status: isLoading ? 'loading' : 'ready'
      });
    } catch (error) {
      console.error("Error fetching latest news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Get news by category
  app.get("/api/news/category/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 30;
      
      const validCategories = ['cybersecurity', 'ai', 'tech', 'conferences', 'breaking'];
      if (!validCategories.includes(category.toLowerCase())) {
        return res.status(400).json({ message: "Invalid category" });
      }
      
      const news = await newsAggregator.getNewsByCategory(category, limit);
      res.json({
        category,
        articles: news,
        lastUpdated: newsAggregator.getLastFetchTime()?.toISOString()
      });
    } catch (error) {
      console.error("Error fetching category news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Search news
  app.get("/api/news/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }
      
      const limit = parseInt(req.query.limit as string) || 20;
      const results = await newsAggregator.searchNews(query, limit);
      res.json({
        query,
        results,
        count: results.length
      });
    } catch (error) {
      console.error("Error searching news:", error);
      res.status(500).json({ message: "Failed to search news" });
    }
  });

  // Site-wide search
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string || "").trim().toLowerCase();
      if (!query || query.length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters" });
      }

      const limit = parseInt(req.query.limit as string) || 20;

      // Static pages searchable content
      const staticPages = [
        { title: "Youth Safety", description: "Online safety tips for teens and young adults. Social media safety, gaming security, and digital citizenship.", url: "/youth-safety", category: "Learn" },
        { title: "Senior Protection", description: "Protect seniors from online scams and fraud. Medicare scams, tech support fraud, and romance scam prevention.", url: "/senior-safety", category: "Learn" },
        { title: "Parent Guide", description: "Help parents protect their children online. Parental controls, screen time, and family safety strategies.", url: "/parent-guide", category: "Learn" },
        { title: "Scam Checker", description: "Check if a URL, phone number, email, or situation is a scam. AI-powered fraud detection tool.", url: "/scam-checker", category: "Tools" },
        { title: "Breach Checker", description: "Check if your email was exposed in a data breach. Monitor your accounts for security.", url: "/#breach-checker", category: "Tools" },
        { title: "Safety Score Quiz", description: "Take our interactive cybersecurity quiz to assess your online safety knowledge.", url: "/safety-score", category: "Tools" },
        { title: "Emergency Help", description: "Immediate help if you've been scammed. Report fraud, freeze accounts, and protect your identity.", url: "/emergency-help", category: "Help" },
        { title: "Cyber Hygiene", description: "Daily habits for better online security. Password management, software updates, and safe browsing.", url: "/cyber-hygiene", category: "Learn" },
        { title: "Travel Safety", description: "Stay safe online while traveling. Public WiFi risks, travel scams, and mobile security.", url: "/travel-safety", category: "Learn" },
        { title: "Resources", description: "Free cybersecurity resources, guides, and educational materials for all skill levels.", url: "/resources", category: "Learn" },
        { title: "Latest News", description: "Cybersecurity news, threat alerts, and industry updates from trusted sources.", url: "/news", category: "News" },
        { title: "FAQ", description: "Frequently asked questions about online safety, scams, and protecting your digital life.", url: "/faq", category: "Help" },
        { title: "Contact Us", description: "Get in touch with GetCyberRight. Questions, feedback, and partnership inquiries.", url: "/contact", category: "Help" },
        { title: "About", description: "Learn about GetCyberRight's mission to protect families from online threats.", url: "/about", category: "Company" },
        { title: "Privacy Policy", description: "How we protect your privacy and handle your data.", url: "/privacy-policy", category: "Legal" },
        { title: "Printable Guides", description: "Download and print cybersecurity guides and cheat sheets for offline reference.", url: "/printable-guides", category: "Resources" },
        { title: "Learning Path", description: "Structured cybersecurity learning journey from beginner to advanced.", url: "/learning-path", category: "Learn" },
        { title: "Accessibility", description: "Our commitment to making GetCyberRight accessible to everyone.", url: "/accessibility", category: "Company" },
      ];

      // Search static pages
      const pageResults = staticPages.filter(page => 
        page.title.toLowerCase().includes(query) || 
        page.description.toLowerCase().includes(query)
      ).map(page => ({
        ...page,
        type: "page" as const,
        relevance: page.title.toLowerCase().includes(query) ? 2 : 1
      }));

      // Search news articles
      let newsResults: any[] = [];
      try {
        const news = await newsAggregator.searchNews(query, limit);
        newsResults = news.slice(0, 10).map((article: any) => ({
          title: article.title,
          description: article.excerpt || article.description,
          url: article.url,
          category: article.category || "News",
          type: "article" as const,
          publishedAt: article.publishedAt,
          source: article.source,
          relevance: 1
        }));
      } catch (e) {
        console.log("News search unavailable:", e);
      }

      // Combine and sort by relevance
      const allResults = [...pageResults, ...newsResults]
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, limit);

      res.json({
        query,
        results: allResults,
        count: allResults.length,
        breakdown: {
          pages: pageResults.length,
          articles: newsResults.length
        }
      });
    } catch (error) {
      console.error("Site search error:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Refresh news cache (admin only)
  app.post("/api/news/refresh", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      await newsAggregator.refreshAllNews();
      res.json({ 
        message: "News cache refreshed",
        stats: newsAggregator.getCacheStats()
      });
    } catch (error) {
      console.error("Error refreshing news:", error);
      res.status(500).json({ message: "Failed to refresh news" });
    }
  });

  // Safety-focused news for cyber awareness and online safety
  app.get("/api/news/safety", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 15;
      const articles = await newsAggregator.getNewsByCategory('safety', limit);
      const isLoading = !newsAggregator.isCacheAvailable() && newsAggregator.isCurrentlyFetching();
      
      res.json({
        articles: articles.map((a: any) => ({
          id: a.id,
          title: a.title,
          excerpt: a.excerpt,
          source: a.source,
          url: a.url,
          publishedAt: a.publishedAt,
          category: 'safety',
          audienceTag: a.audienceTag || 'all',
          thumbnailUrl: a.thumbnailUrl || a.imageUrl
        })),
        count: articles.length,
        lastUpdated: newsAggregator.getLastFetchTime()?.toISOString(),
        status: isLoading ? 'loading' : 'ready'
      });
    } catch (error) {
      console.error("Error fetching safety news:", error);
      res.status(500).json({ message: "Failed to fetch safety news" });
    }
  });

  // Tech Events and Conferences
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const { category, featured, upcoming, limit } = req.query;
      
      const events = await storage.getTechEvents({
        category: category as string,
        featured: featured === 'true',
        upcoming: upcoming !== 'false', // Default to upcoming events
        limit: limit ? parseInt(limit as string) : undefined
      });
      
      res.json({ events, count: events.length });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getTechEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  // Security audit endpoint
  app.get("/api/security/audit", async (req: Request, res: Response) => {
    try {
      const { SecurityAuditor } = await import("./security/security-audit");
      const auditResults = SecurityAuditor.runCompleteAudit();
      const report = SecurityAuditor.generateSecurityReport();
      
      res.json({
        summary: auditResults,
        report: report,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Security audit error:', error);
      res.status(500).json({ message: "Failed to run security audit" });
    }
  });

  // ========================================
  // AUTHENTICATION ROUTES
  // ========================================

  app.post("/api/auth/login", bruteForceProtection, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      console.log("[Auth] Login attempt for username:", username);
      
      if (!username || !password) {
        console.log("[Auth] Missing username or password");
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      console.log("[Auth] User found:", !!user);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (isAccountLocked(user.id)) {
        return res.status(423).json({ message: "Account temporarily locked. Please try again later." });
      }

      if (!user.passwordHash) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const passwordValid = await comparePassword(password, user.passwordHash);
      console.log("[Auth] Password valid:", passwordValid);
      
      if (!passwordValid) {
        incrementFailedAttempts(user.id);
        console.log("[Auth] Login failed - invalid password for user:", username);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      unlockAccount(user.id);
      
      // Check if 2FA is enabled
      if (user.twoFactorEnabled && user.twoFactorSecret) {
        // Generate a short-lived pending 2FA token (5 minutes)
        const jwt = await import('jsonwebtoken');
        const pendingToken = jwt.default.sign(
          { userId: user.id, purpose: '2fa_pending' },
          process.env.JWT_SECRET!,
          { expiresIn: '5m' }
        );

        // Log partial login
        await storage.createAuditLog({
          userId: user.id,
          username: user.username,
          action: 'LOGIN_2FA_REQUIRED',
          details: 'User passed password check, 2FA required',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        });

        return res.json({
          requiresTwoFactor: true,
          pendingToken,
          message: "Please enter your 2FA code"
        });
      }

      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role || "user",
        tokenVersion: user.tokenVersion || 0
      });

      // Log successful login
      await storage.createAuditLog({
        userId: user.id,
        username: user.username,
        action: 'LOGIN_SUCCESS',
        details: 'User logged in successfully',
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role || "user",
          mustChangePassword: user.mustChangePassword ?? true
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      console.error("Login error stack:", (error as Error).stack);
      res.status(500).json({ message: "Login failed: " + (error as Error).message });
    }
  });

  // Change password endpoint
  app.post("/api/auth/change-password", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Current password and new password are required" });
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ message: "Password requirements not met", errors: passwordValidation.errors });
      }

      const user = await storage.getUser(req.user!.id);
      if (!user || !user.passwordHash) {
        return res.status(404).json({ message: "User not found" });
      }

      const passwordValid = await comparePassword(currentPassword, user.passwordHash);
      if (!passwordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      const newPasswordHash = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, newPasswordHash);

      // Log the password change for audit
      await storage.createAuditLog({
        userId: user.id,
        username: user.username,
        action: 'PASSWORD_CHANGED',
        details: `Password changed at ${new Date().toISOString()}`,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      // Note: Client should clear stored token and redirect to login
      res.json({ 
        message: "Password changed successfully",
        requireReauth: true
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Two-Factor Authentication Setup - Generate secret and return QR code data
  app.post("/api/auth/2fa/setup", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { generateSecret, generateURI } = await import('otplib');
      
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a new secret
      const secret = generateSecret();
      
      // Store the secret (not yet enabled)
      await storage.setTwoFactorSecret(user.id, secret);
      
      // Generate otpauth URL for QR code
      const otpauthUrl = generateURI({ issuer: 'GetCyberRight Admin', label: user.username, secret });
      
      // Log the setup attempt
      await storage.createAuditLog({
        userId: user.id,
        username: user.username,
        action: '2FA_SETUP_INITIATED',
        details: 'User initiated 2FA setup',
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.json({ 
        otpauthUrl,
        message: "Scan the QR code with your authenticator app, then verify with a code"
      });
    } catch (error) {
      console.error("2FA setup error:", error);
      res.status(500).json({ message: "Failed to setup 2FA" });
    }
  });

  // Verify 2FA code and enable
  app.post("/api/auth/2fa/verify", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ message: "Verification code is required" });
      }

      const { verify } = await import('otplib');
      const user = await storage.getUser(req.user!.id);
      
      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({ message: "2FA not set up. Please initiate setup first." });
      }

      const isValid = await verify({ token: code, secret: user.twoFactorSecret });
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid verification code" });
      }

      // Enable 2FA
      await storage.enableTwoFactor(user.id);
      
      // Log successful enablement
      await storage.createAuditLog({
        userId: user.id,
        username: user.username,
        action: '2FA_ENABLED',
        details: 'User successfully enabled 2FA',
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.json({ message: "Two-factor authentication enabled successfully" });
    } catch (error) {
      console.error("2FA verify error:", error);
      res.status(500).json({ message: "Failed to verify 2FA" });
    }
  });

  // Disable 2FA
  app.post("/api/auth/2fa/disable", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { password, code } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required to disable 2FA" });
      }

      const user = await storage.getUser(req.user!.id);
      
      if (!user || !user.passwordHash) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password
      const passwordValid = await comparePassword(password, user.passwordHash);
      if (!passwordValid) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // If 2FA is enabled, also require a valid code
      if (user.twoFactorEnabled && user.twoFactorSecret) {
        if (!code) {
          return res.status(400).json({ message: "2FA code is required" });
        }
        const { verify } = await import('otplib');
        const isValid = await verify({ token: code, secret: user.twoFactorSecret });
        if (!isValid) {
          return res.status(401).json({ message: "Invalid 2FA code" });
        }
      }

      await storage.disableTwoFactor(user.id);
      
      // Log disablement
      await storage.createAuditLog({
        userId: user.id,
        username: user.username,
        action: '2FA_DISABLED',
        details: 'User disabled 2FA',
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.json({ message: "Two-factor authentication disabled" });
    } catch (error) {
      console.error("2FA disable error:", error);
      res.status(500).json({ message: "Failed to disable 2FA" });
    }
  });

  // Verify 2FA code during login (second step)
  // Rate limited: 5 attempts per minute per IP
  const twoFactorLoginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: { message: "Too many 2FA attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false
  });

  app.post("/api/auth/2fa/login-verify", twoFactorLoginLimiter, async (req: Request, res: Response) => {
    try {
      const { pendingToken, code } = req.body;
      
      if (!pendingToken || !code) {
        return res.status(400).json({ message: "Pending token and code are required" });
      }

      // Verify the pending token
      const jwt = await import('jsonwebtoken');
      let decoded: { userId: number; purpose: string };
      try {
        decoded = jwt.default.verify(
          pendingToken,
          process.env.JWT_SECRET!
        ) as { userId: number; purpose: string };
        
        if (decoded.purpose !== '2fa_pending') {
          return res.status(401).json({ message: "Invalid pending token" });
        }
      } catch (err) {
        return res.status(401).json({ message: "Invalid or expired pending token" });
      }

      const { verify } = await import('otplib');
      const user = await storage.getUser(decoded.userId);
      
      if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
        return res.status(400).json({ message: "2FA not enabled for this user" });
      }

      const isValid = await verify({ token: code, secret: user.twoFactorSecret });
      
      if (!isValid) {
        // Log failed 2FA attempt
        await storage.createAuditLog({
          userId: user.id,
          username: user.username,
          action: 'LOGIN_2FA_FAILED',
          details: 'Invalid 2FA code entered',
          ipAddress: req.ip || req.socket.remoteAddress,
          userAgent: req.headers['user-agent']
        });
        return res.status(401).json({ message: "Invalid 2FA code" });
      }

      // Generate full token
      const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role || "user",
        tokenVersion: user.tokenVersion || 0
      });

      // Log successful 2FA login
      await storage.createAuditLog({
        userId: user.id,
        username: user.username,
        action: 'LOGIN_2FA_SUCCESS',
        details: 'User completed 2FA login',
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role || "user",
          mustChangePassword: user.mustChangePassword ?? false
        }
      });
    } catch (error) {
      console.error("2FA login verify error:", error);
      res.status(500).json({ message: "2FA verification failed" });
    }
  });

  // Get 2FA status
  app.get("/api/auth/2fa/status", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ 
        enabled: user.twoFactorEnabled || false,
        hasSecret: !!user.twoFactorSecret
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get 2FA status" });
    }
  });

  // Get audit logs (admin only)
  app.get("/api/admin/audit-logs", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const logs = await storage.getAuditLogs({ limit });
      res.json(logs);
    } catch (error) {
      console.error("Audit logs error:", error);
      res.status(500).json({ message: "Failed to fetch audit logs" });
    }
  });

  // Security Alerts API
  app.get("/api/admin/security-alerts", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const severity = req.query.severity as string;
      const category = req.query.category as string;
      const unreadOnly = req.query.unreadOnly === 'true';
      const limit = parseInt(req.query.limit as string) || 50;
      
      const alerts = await storage.getSecurityAlerts({ severity, category, unreadOnly, limit });
      res.json(alerts);
    } catch (error) {
      console.error("Security alerts error:", error);
      res.status(500).json({ message: "Failed to fetch security alerts" });
    }
  });

  app.get("/api/admin/security-alerts/count", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const count = await storage.getUnreadAlertCount();
      res.json({ count });
    } catch (error) {
      console.error("Security alerts count error:", error);
      res.status(500).json({ message: "Failed to get alert count" });
    }
  });

  app.get("/api/admin/security-alerts/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const alert = await storage.getSecurityAlert(id);
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      res.json(alert);
    } catch (error) {
      console.error("Security alert error:", error);
      res.status(500).json({ message: "Failed to fetch security alert" });
    }
  });

  app.post("/api/admin/security-alerts/:id/read", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markAlertAsRead(id);
      res.json({ message: "Alert marked as read" });
    } catch (error) {
      console.error("Mark alert read error:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  app.post("/api/admin/security-alerts/:id/acknowledge", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.acknowledgeAlert(id, req.user!.id);
      
      await storage.createAuditLog({
        userId: req.user!.id,
        username: req.user!.username,
        action: 'ALERT_ACKNOWLEDGED',
        details: `Acknowledged security alert ID: ${id}`,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });
      
      res.json({ message: "Alert acknowledged" });
    } catch (error) {
      console.error("Acknowledge alert error:", error);
      res.status(500).json({ message: "Failed to acknowledge alert" });
    }
  });

  // Convert Security Alert to Published Article (Admin)
  app.post("/api/admin/security-alerts/:id/publish", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    console.log('[PublishAlert] Starting publish for alert ID:', req.params.id);
    try {
      const id = parseInt(req.params.id);
      console.log('[PublishAlert] Fetching alert from storage...');
      const alert = await storage.getSecurityAlert(id);
      
      if (!alert) {
        console.log('[PublishAlert] Alert not found');
        return res.status(404).json({ message: "Alert not found" });
      }
      console.log('[PublishAlert] Alert found:', alert.title);
      console.log('[PublishAlert] AI API key exists:', !!process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY);

      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
      });
      console.log('[PublishAlert] Calling AI to generate article...');

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: `You are a cybersecurity educator writing for families, including parents, seniors, and teens. Convert this security alert into an engaging, educational article.

CORE PRINCIPLES:
- Write in plain language that non-technical readers can understand
- No jargon. Explain technical terms in simple words
- Focus on what families can DO, not just what happened
- Be informative without being alarming

WRITING STYLE (MANDATORY):
- Use proper punctuation and complete sentences throughout
- Do NOT use dashes or em dashes in any text
- Use commas, periods, and semicolons instead of dashes
- Write in clean, professional prose
- Ensure all sentences are grammatically complete
- Be concise; every sentence should add value

ALERT TO CONVERT:
Title: ${alert.title}
Description: ${alert.description}
Severity: ${alert.severity}
Category: ${alert.category}
Source: ${alert.source || "Security Advisory"}

Respond in JSON format:
{
  "title": "Engaging article title in plain language",
  "excerpt": "2-3 sentence summary explaining what happened and why it matters to families",
  "content": "Full article in HTML format with <h2>, <p>, <ul>, <li> tags. Structure: What Happened (simple explanation), Why This Matters to Your Family (real-world impact), What You Should Do Right Now (3-5 specific actions), and How to Stay Protected (ongoing tips).",
  "readTime": estimated reading time in minutes (number)
}`
        }]
      });

      const textContent = response.content.find(c => c.type === "text");
      if (!textContent || textContent.type !== "text") {
        throw new Error("No text response from AI");
      }

      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Could not parse AI response");
      }

      const articleData = JSON.parse(jsonMatch[0]);

      const article = await storage.createArticle({
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        category: "News",
        author: "GetCyberRight Security Team",
        authorTitle: "Cybersecurity Analysts",
        source: alert.source || "Security Advisory",
        url: alert.sourceUrl || undefined,
        readTime: articleData.readTime || 5,
        featured: alert.severity === "critical" || alert.severity === "high",
        breaking: alert.severity === "critical",
      });

      await storage.createAuditLog({
        userId: req.user!.id,
        username: req.user!.username,
        action: 'ALERT_PUBLISHED',
        details: `Published security alert "${alert.title}" as article ID: ${article.id}`,
        ipAddress: req.ip || req.socket.remoteAddress,
        userAgent: req.headers['user-agent']
      });

      res.json({ message: "Alert published as article", article });
    } catch (error: any) {
      console.error("Publish alert error:", error);
      console.error("Error details:", error.message, error.stack);
      res.status(500).json({ message: "Failed to publish alert as article", error: error.message });
    }
  });

  // Scam Checker Usage Stats (Admin)
  app.get("/api/admin/scam-checker-stats", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = await storage.getScamCheckerStats();
      res.json(stats);
    } catch (error) {
      console.error("Scam checker stats error:", error);
      res.status(500).json({ message: "Failed to fetch scam checker stats" });
    }
  });

  // Admin Breach Checker Stats
  app.get("/api/admin/breach-checker-stats", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = await storage.getBreachCheckerStats();
      res.json(stats);
    } catch (error) {
      console.error("Breach checker stats error:", error);
      res.status(500).json({ message: "Failed to fetch breach checker stats" });
    }
  });

  // Public Scam Stats (for homepage counter)
  app.get("/api/public/scam-stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getScamCheckerStats();
      res.json({
        totalChecks: stats.total,
        thisMonth: stats.thisMonth,
        thisWeek: stats.thisWeek
      });
    } catch (error) {
      console.error("Public scam stats error:", error);
      res.json({ totalChecks: 0, thisMonth: 0, thisWeek: 0 });
    }
  });

  // Public Threat Trends (for dashboard)
  app.get("/api/public/threat-trends", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getScamCheckerStats();
      res.json({
        total: stats.total,
        byType: stats.byType,
        byRisk: stats.byRisk,
        byRegion: stats.byRegion,
        today: stats.today,
        thisWeek: stats.thisWeek,
        thisMonth: stats.thisMonth
      });
    } catch (error) {
      console.error("Public threat trends error:", error);
      res.json({ total: 0, byType: {}, byRisk: {}, byRegion: {}, today: 0, thisWeek: 0, thisMonth: 0 });
    }
  });

  // Public Trending Scams (for homepage alert)
  app.get("/api/public/trending-scams", async (req: Request, res: Response) => {
    try {
      const trends = await storage.getTopScamTrends(5);
      res.json(trends);
    } catch (error) {
      console.error("Trending scams error:", error);
      res.json([]);
    }
  });

  // Request password reset (generates token)
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      // Always return success to prevent email enumeration
      if (!user) {
        return res.json({ message: "If an account exists with that email, a password reset link has been sent." });
      }

      // Generate reset token
      const crypto = await import('crypto');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000); // 1 hour

      await storage.setPasswordResetToken(user.id, resetToken, resetExpires);

      // In production, this would send an email with the reset link
      // For now, we'll log it (in development only)
      console.log(`Password reset token for ${email}: ${resetToken}`);

      res.json({ message: "If an account exists with that email, a password reset link has been sent." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ message: "Password requirements not met", errors: passwordValidation.errors });
      }

      const user = await storage.getUserByResetToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      if (user.passwordResetExpires && new Date() > user.passwordResetExpires) {
        return res.status(400).json({ message: "Reset token has expired" });
      }

      const newPasswordHash = await hashPassword(newPassword);
      await storage.updateUserPassword(user.id, newPasswordHash);
      await storage.clearPasswordResetToken(user.id);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Send email verification
  app.post("/api/auth/send-verification", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      const user = await storage.getUser(userId);
      
      if (!user || !user.email) {
        return res.status(400).json({ message: "User email not found" });
      }

      if (user.emailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.setEmailVerificationToken(userId, token, expires);

      const { sendEmailVerification } = await import('./email-service');
      const baseUrl = process.env.BASE_URL || 'https://getcyberright.com';
      const sent = await sendEmailVerification(user.email, token, baseUrl);

      if (sent) {
        res.json({ message: "Verification email sent" });
      } else {
        res.status(500).json({ message: "Failed to send verification email" });
      }
    } catch (error) {
      console.error("Send verification error:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });

  // Verify email with token
  app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Verification token is required" });
      }

      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }

      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return res.status(400).json({ message: "Verification token has expired" });
      }

      await storage.verifyEmail(user.id);

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      console.error("Verify email error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  // Admin endpoint for daily tips subscriptions (protected)
  app.get("/api/admin/daily-tips-subscriptions", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("[Admin] Fetching daily tips subscriptions...");
      const subscriptions = await storage.getAllDailyTipsSubscriptions();
      console.log("[Admin] Found", subscriptions.length, "daily tips subscriptions");
      res.json(subscriptions);
    } catch (error) {
      console.error("[Admin] Error fetching daily tips subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });

  app.delete("/api/admin/daily-tips-subscriptions/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDailyTipsSubscription(id);
      res.json({ message: "Subscriber deleted successfully" });
    } catch (error) {
      console.error("Error deleting daily tips subscription:", error);
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  // ========================================
  // SECURED EXISTING ROUTES
  // ========================================
  
  // Breaking news endpoint for homepage
  app.get("/api/breaking-news", async (req, res) => {
    try {
      // Get the most recent breaking news article
      const liveNews = await fetchCybersecurityNews();
      if (liveNews && liveNews.length > 0) {
        const breakingArticle = {
          ...convertNewsToArticle(liveNews[0]),
          id: 1000000, // Consistent ID for the breaking news
          breaking: true,
          publishedAt: new Date(liveNews[0].publishedAt)
        };
        res.json(breakingArticle);
      } else {
        // Fallback to local breaking news if live news fails
        const localBreaking = await storage.getArticles({ breaking: true, limit: 1 });
        if (localBreaking.length > 0) {
          res.json(localBreaking[0]);
        } else {
          res.status(404).json({ message: "No breaking news available" });
        }
      }
    } catch (error) {
      console.error("Error fetching breaking news:", error);
      // Fallback to local breaking news
      try {
        const localBreaking = await storage.getArticles({ breaking: true, limit: 1 });
        if (localBreaking.length > 0) {
          res.json(localBreaking[0]);
        } else {
          res.status(500).json({ message: "No breaking news available" });
        }
      } catch (fallbackError) {
        console.error("Fallback breaking news error:", fallbackError);
        res.status(500).json({ message: "Failed to fetch breaking news" });
      }
    }
  });

  // News API endpoint to fetch live cybersecurity news
  app.get("/api/news/live", async (req, res) => {
    try {
      const liveNews = await fetchCybersecurityNews();
      const convertedArticles = liveNews.map(article => convertNewsToArticle(article));
      res.json(convertedArticles);
    } catch (error) {
      console.error("Error fetching live news:", error);
      res.status(500).json({ message: "Failed to fetch live news" });
    }
  });

  // Enhanced articles endpoint that includes live news
  app.get("/api/articles/enhanced", 
    [
      query('category').optional().isIn(['Technology', 'Security', 'Privacy', 'Threats', 'Education', 'Policy']),
      query('featured').optional().isBoolean(),
      query('breaking').optional().isBoolean(),
      query('limit').optional().isInt({ min: 1, max: 100 }),
      handleValidationErrors
    ],
    async (req: Request, res: Response) => {
    try {
      const { category, featured, breaking, limit } = req.query;
      
      // Get local articles
      const options: any = {};
      if (category && typeof category === 'string') options.category = category;
      if (featured === 'true') options.featured = true;
      if (featured === 'false') options.featured = false;
      if (breaking === 'true') options.breaking = true;
      if (breaking === 'false') options.breaking = false;
      
      const localArticles = await storage.getArticles(options);
      
      // Get live news
      const liveNews = await fetchCybersecurityNews();
      const convertedNews = liveNews.map((article, index) => ({
        ...convertNewsToArticle(article),
        id: 1000000 + index, // Use consistent IDs starting from 1000000 for live articles
        publishedAt: new Date(article.publishedAt)
      }));
      
      // Combine and sort by date
      const allArticles = [...localArticles, ...convertedNews]
        .sort((a, b) => new Date(b.publishedAt!).getTime() - new Date(a.publishedAt!).getTime());
      
      const limitNum = limit && typeof limit === 'string' ? parseInt(limit) : undefined;
      const finalArticles = limitNum ? allArticles.slice(0, limitNum) : allArticles;
      
      res.json(finalArticles);
    } catch (error) {
      console.error("Error fetching enhanced articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  
  // Articles routes
  app.get("/api/articles",
    validateArticleQuery,
    handleValidationErrors,
    async (req: Request, res: Response) => {
    try {
      const { category, featured, breaking, limit } = req.query;
      const options: any = {};
      
      if (category && typeof category === 'string') options.category = category;
      if (featured === 'true') options.featured = true;
      if (featured === 'false') options.featured = false;
      if (breaking === 'true') options.breaking = true;
      if (breaking === 'false') options.breaking = false;
      if (limit && typeof limit === 'string') options.limit = parseInt(limit);

      const articles = await storage.getArticles(options);
      res.json(articles);
    } catch (error) {
      console.error('Articles fetch error:', error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:id", 
    validateArticleId,
    handleValidationErrors,
    async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // First try to get from database
      const article = await storage.getArticle(id);
      if (article) {
        return res.json(article);
      }
      
      // If not found in database, check if it's a live news article (IDs >= 1000000)
      if (id >= 1000000) {
        try {
          const liveNews = await fetchCybersecurityNews();
          const articleIndex = id - 1000000;
          
          if (articleIndex >= 0 && articleIndex < liveNews.length) {
            const requestedArticle = liveNews[articleIndex];
            const convertedArticle = {
              ...convertNewsToArticle(requestedArticle),
              id: id, // Use the requested ID
              publishedAt: new Date(requestedArticle.publishedAt)
            };
            return res.json(convertedArticle);
          }
        } catch (liveNewsError) {
          console.error("Error fetching live news for article:", liveNewsError);
        }
      }
      
      return res.status(404).json({ message: "Article not found" });
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Create article (admin only)
  app.post("/api/articles", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid article data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create article" });
      }
    }
  });

  // Search articles
  app.get("/api/articles/search/:query", async (req, res) => {
    try {
      const query = req.params.query;
      if (!query || query.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const articles = await storage.searchArticles(query);
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to search articles" });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const { type, category, difficulty, limit } = req.query;
      const options: any = {};
      
      if (type && typeof type === 'string') options.type = type;
      if (category && typeof category === 'string') options.category = category;
      if (difficulty && typeof difficulty === 'string') options.difficulty = difficulty;
      if (limit && typeof limit === 'string') options.limit = parseInt(limit);

      const resources = await storage.getResources(options);
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  // Enhanced resources with real thumbnails
  app.get("/api/resources/enhanced", async (req, res) => {
    try {
      const { type, category, difficulty, limit } = req.query;
      const options: any = {};
      
      if (type && typeof type === 'string') options.type = type;
      if (category && typeof category === 'string') options.category = category;
      if (difficulty && typeof difficulty === 'string') options.difficulty = difficulty;
      if (limit && typeof limit === 'string') options.limit = parseInt(limit);

      const resources = await storage.getResources(options);

      // Get URLs for thumbnail fetching
      const urls = resources.map(r => r.url);
      
      // Fetch thumbnails for all resources
      const thumbnailResults = await thumbnailService.batchFetchThumbnails(urls);
      
      // Enhance resources with real thumbnails
      const enhancedResources = resources.map(resource => ({
        ...resource,
        imageUrl: thumbnailResults.get(resource.url)?.imageUrl || resource.imageUrl,
        enhancedTitle: thumbnailResults.get(resource.url)?.title || resource.title,
        enhancedDescription: thumbnailResults.get(resource.url)?.description || resource.description
      }));
      
      res.json(enhancedResources);
    } catch (error) {
      console.error("Error fetching enhanced resources:", error);
      res.status(500).json({ message: "Failed to fetch enhanced resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  // Create resource (admin only)
  app.post("/api/resources", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const validatedData = insertResourceSchema.parse(req.body);
      const resource = await storage.createResource(validatedData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid resource data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create resource" });
      }
    }
  });

  // Unified Subscribe endpoint - single form for all subscriptions
  app.post("/api/subscribe", formSubmissionRateLimit, recaptchaMiddleware(0.5), async (req, res) => {
    try {
      console.log("[Subscribe] Unified subscription attempt from IP:", req.ip);
      const { email, weeklyDigest, dailyTips, tipsFrequency, audience, region } = req.body;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ message: "Invalid email address" });
        return;
      }
      
      if (!weeklyDigest && !dailyTips) {
        res.status(400).json({ message: "Please select at least one subscription option" });
        return;
      }

      const subscription = await storage.subscribeNewsletter(email, {
        weeklyDigest: weeklyDigest ?? false,
        digitalSafetyTips: dailyTips ?? false,
        tipsFrequency: tipsFrequency ?? 'weekly',
        audience: audience ?? 'all',
        region: region ?? 'global',
        alertPriority: 'all'
      });
      console.log("[Subscribe] Successfully subscribed:", email, "Weekly:", weeklyDigest, "Tips:", dailyTips);
      res.status(201).json({ message: "Successfully subscribed", subscription });
    } catch (error: any) {
      console.error("[Subscribe] Error:", error?.message || error);
      if (error?.code === '23505' || error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
        res.status(409).json({ message: "This email is already subscribed" });
      } else {
        res.status(500).json({ message: "Failed to subscribe" });
      }
    }
  });

  // Newsletter routes - Unified subscription system with rate limiting and reCAPTCHA
  app.post("/api/newsletter/subscribe", formSubmissionRateLimit, recaptchaMiddleware(0.5), async (req, res) => {
    try {
      console.log("[Newsletter] Subscription attempt from IP:", req.ip, "Body:", JSON.stringify(req.body));
      const { email, weeklyDigest, digitalSafetyTips, tipsFrequency, audience, region, alertPriority } = req.body;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ message: "Invalid email address" });
        return;
      }

      const subscription = await storage.subscribeNewsletter(email, {
        weeklyDigest: weeklyDigest ?? true,
        digitalSafetyTips: digitalSafetyTips ?? false,
        tipsFrequency: tipsFrequency ?? 'weekly',
        audience: audience ?? 'all',
        region: region ?? 'global',
        alertPriority: alertPriority ?? 'all'
      });
      console.log("[Newsletter] Successfully subscribed:", email);
      res.status(201).json({ message: "Successfully subscribed", subscription });
    } catch (error: any) {
      console.error("[Newsletter] Subscription error:", error?.message || error, "Code:", error?.code, "Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email address", errors: error.errors });
      } else if (error?.code === '23505' || error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
        res.status(409).json({ message: "This email is already subscribed" });
      } else {
        res.status(500).json({ message: "Failed to subscribe" });
      }
    }
  });

  // Get newsletter subscriptions (admin only)
  app.get("/api/newsletter/subscriptions", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      console.log("[Newsletter] Fetching subscriptions for admin:", req.user?.id);
      const subscriptions = await storage.getNewsletterSubscriptions();
      console.log("[Newsletter] Found", subscriptions.length, "subscriptions");
      res.json(subscriptions);
    } catch (error) {
      console.error("[Newsletter] Error fetching subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch newsletter subscriptions" });
    }
  });

  app.delete("/api/newsletter/subscriptions/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNewsletterSubscription(id);
      res.json({ message: "Subscriber deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete subscriber" });
    }
  });

  // Digital Safety Tips Subscription - redirects to unified newsletter system
  app.post("/api/daily-tips/subscribe", formSubmissionRateLimit, recaptchaMiddleware(0.5), async (req, res) => {
    try {
      console.log("[DigitalTips] Subscription attempt from IP:", req.ip, "Body:", JSON.stringify(req.body));
      const { email, audience, frequency, region, alertPriority } = req.body;
      
      if (!email || typeof email !== 'string' || !email.includes('@')) {
        res.status(400).json({ message: "Invalid email address" });
        return;
      }

      const subscription = await storage.subscribeNewsletter(email, {
        weeklyDigest: false,
        digitalSafetyTips: true,
        tipsFrequency: frequency ?? 'weekly',
        audience: audience ?? 'all',
        region: region ?? 'global',
        alertPriority: alertPriority ?? 'all'
      });
      console.log("[DigitalTips] Successfully subscribed:", email);
      res.status(201).json({ 
        message: "Successfully subscribed to Digital Safety Tips", 
        subscription 
      });
    } catch (error: any) {
      console.error("[DigitalTips] Subscription error:", error?.message || error, "Code:", error?.code, "Full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid subscription data", errors: error.errors });
      } else if (error?.code === '23505' || error?.message?.includes('duplicate') || error?.message?.includes('unique')) {
        res.status(409).json({ message: "This email is already subscribed" });
      } else {
        res.status(500).json({ message: "Failed to subscribe" });
      }
    }
  });

  const unsubscribeSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  app.post("/api/daily-tips/unsubscribe", async (req, res) => {
    try {
      const validatedData = unsubscribeSchema.parse(req.body);
      const success = await storage.unsubscribeDailyTips(validatedData.email);
      if (success) {
        res.json({ message: "Successfully unsubscribed from Daily Safety Tips" });
      } else {
        res.status(404).json({ message: "Subscription not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email address", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to unsubscribe" });
      }
    }
  });

  // Preference center routes - using token for security
  const preferenceUpdateSchema = z.object({
    token: z.string().min(1, "Token is required"),
    frequency: z.enum(["daily", "thrice_weekly", "weekly"]).optional(),
    weeklyDigest: z.boolean().optional(),
    region: z.enum(["global", "north_america", "europe", "asia_pacific", "africa", "latin_america", "middle_east"]).optional(),
    alertPriority: z.enum(["all", "essentials_only"]).optional(),
  });

  app.post("/api/preferences/update", async (req, res) => {
    try {
      const validatedData = preferenceUpdateSchema.parse(req.body);
      
      // Verify token and get subscriber
      const subscriber = await storage.getSubscriberByToken(validatedData.token);
      const newsletter = await storage.getNewsletterByToken(validatedData.token);
      
      if (!subscriber && !newsletter) {
        res.status(401).json({ message: "Invalid or expired token" });
        return;
      }
      
      const results: { dailyTips?: any; newsletter?: any } = {};

      if (subscriber && (validatedData.frequency || validatedData.region || validatedData.alertPriority)) {
        results.dailyTips = await storage.updateDailyTipsPreferences(subscriber.email, {
          frequency: validatedData.frequency,
          region: validatedData.region,
          alertPriority: validatedData.alertPriority
        });
      }

      if (newsletter && (validatedData.weeklyDigest !== undefined || validatedData.region || validatedData.alertPriority)) {
        results.newsletter = await storage.updateNewsletterPreferences(newsletter.email, {
          weeklyDigest: validatedData.weeklyDigest,
          region: validatedData.region,
          alertPriority: validatedData.alertPriority
        });
      }

      res.json({ message: "Preferences updated successfully", ...results });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update preferences" });
      }
    }
  });

  // Lookup by email (generates and returns a token for managing preferences)
  app.post("/api/preferences/lookup", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const token = await storage.generatePreferenceToken(email);
      
      if (!token) {
        res.status(404).json({ message: "No subscription found for this email" });
        return;
      }
      
      res.json({ token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid email address" });
      } else {
        res.status(500).json({ message: "Failed to lookup subscription" });
      }
    }
  });

  app.get("/api/preferences/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const subscriber = await storage.getSubscriberByToken(token);
      const newsletter = await storage.getNewsletterByToken(token);
      
      if (!subscriber && !newsletter) {
        res.status(404).json({ message: "Invalid preference token" });
        return;
      }

      res.json({
        token,
        dailyTips: subscriber ? {
          email: subscriber.email,
          audience: subscriber.audience,
          frequency: subscriber.frequency || 'daily',
          region: subscriber.region || 'global',
          alertPriority: subscriber.alertPriority || 'all',
          isActive: subscriber.isActive
        } : null,
        newsletter: newsletter ? {
          email: newsletter.email,
          weeklyDigest: newsletter.weeklyDigest,
          region: newsletter.region || 'global',
          alertPriority: newsletter.alertPriority || 'all',
          active: newsletter.active
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Weekly Digest routes (admin only)
  app.get("/api/weekly-digest", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status } = req.query;
      const digests = await storage.getWeeklyDigests(status as string);
      res.json(digests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch digests" });
    }
  });

  app.post("/api/weekly-digest/generate", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
      });

      // Get the latest news from external sources
      const externalNews = await newsAggregator.getLatestNews(50);
      
      // Prepare news for AI curation with source info for regional awareness
      const newsForCuration = externalNews.slice(0, 25).map((a, i) => 
        `${i + 1}. [${a.source}] ${a.title}\n   ${a.excerpt.substring(0, 200)}`
      ).join('\n\n');

      // Use AI to curate, analyze, and create educational content with regional awareness
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 4000,
        messages: [{
          role: "user",
          content: `You are a cybersecurity educator creating a weekly digest for a global audience of families (parents, seniors, teens, and travelers). Create content that serves both international awareness AND regional relevance.

CORE OPERATING PRINCIPLE:
You may think creatively about cybersecurity trends, but you may ONLY assert conclusions that are defensible, conservative, and grounded in the news items provided. Do not invent threats or statistics not present in the source material.

EVIDENCE HIERARCHY (For All Content):
1. Government, law enforcement, or regulatory advisories (FBI IC3, CISA, FTC, INTERPOL)
2. Established cybersecurity research or incident reporting
3. Consistent patterns observed across real scam cases
4. Conservative inference based on known attacker behavior (must be labeled as inference)

HALLUCINATION GUARDRAILS - YOU MUST NOT:
1. Invent threats, attack methods, or statistics not mentioned in the provided news
2. Attribute intent, identity, or geography without evidence from the news items
3. Inflate edge cases into likely outcomes
4. Use fear-based, sensational, or absolute language
5. Create fake regional spotlights. If no regional news exists for a region, base content on documented patterns from authoritative sources only
6. Provide false reassurance or false alarm when uncertainty exists

Review these recent cybersecurity news items:

${newsForCuration}

Create a JSON response with this exact structure:
{
  "digestTitle": "A compelling, educational title for this week's digest",
  "digestSummary": "A 2-sentence overview of this week's key themes and what readers will learn",
  
  "globalThreats": [
    {
      "originalIndex": 1,
      "headline": "Clear, educational headline",
      "insight": "2-3 sentences explaining WHY this matters globally",
      "actionItem": "One specific, practical thing readers can do",
      "threatLevel": "low|medium|high|critical"
    }
  ],
  
  "regionalSpotlights": {
    "north_america": {
      "headline": "Regional threat or scam trending in North America",
      "details": "Brief explanation with local context (mention FBI, FTC, IRS if relevant)",
      "reportTo": "How/where to report (e.g., reportfraud.ftc.gov, IC3.gov)"
    },
    "europe": {
      "headline": "Regional threat trending in Europe/UK",
      "details": "Brief explanation with local context (mention Action Fraud, Europol if relevant)",
      "reportTo": "How/where to report"
    },
    "asia_pacific": {
      "headline": "Regional threat trending in Asia-Pacific",
      "details": "Brief explanation with local context",
      "reportTo": "How/where to report"
    },
    "africa": {
      "headline": "Regional threat trending in Africa",
      "details": "Brief explanation (mention M-Pesa, mobile money scams if relevant)",
      "reportTo": "How/where to report"
    },
    "latin_america": {
      "headline": "Regional threat trending in Latin America",
      "details": "Brief explanation with local context",
      "reportTo": "How/where to report"
    },
    "middle_east": {
      "headline": "Regional threat trending in Middle East",
      "details": "Brief explanation with local context",
      "reportTo": "How/where to report"
    }
  },
  
  "safetyTips": [
    {
      "title": "Tip title",
      "tip": "Actionable safety advice based on this week's threats",
      "audience": "everyone|parents|seniors|teens"
    }
  ],
  
  "travelerAlert": {
    "title": "This Week's Travel Safety Focus",
    "tips": [
      "Tip for travelers (public WiFi, hotel networks, ATM safety, SIM swaps, etc.)",
      "Another travel-specific tip"
    ],
    "scamToWatch": "A current scam targeting tourists or travelers"
  },
  
  "weeklyLesson": {
    "title": "Educational topic title",
    "content": "A brief educational explanation of a key concept from this week's news"
  }
}

Guidelines:
- Select 3-4 global threats that affect everyone regardless of location
- Create realistic regional spotlights based on actual regional threat patterns from the news provided
- Include 3-4 practical safety tips for different audiences
- Always include traveler-specific content (airport WiFi, hotel scams, card skimming abroad)
- Focus on actionable insights, not fear. Use neutral, precise, non-alarmist language
- Use plain language a non-technical person can understand
- Reference real reporting agencies where possible (FBI IC3, FTC, Action Fraud, Europol, local agencies)
- For regional spotlights without specific news: use ONLY documented, verifiable threat patterns from authoritative sources. Do not invent region-specific incidents
- When information is incomplete, be conservative rather than speculative

WRITING STYLE REQUIREMENTS:
- Use proper punctuation and complete sentences throughout
- Do NOT use dashes (--) or em dashes in any text
- Use commas, periods, and semicolons instead of dashes
- Write in clean, professional prose without bullet-style fragments
- Ensure all sentences are grammatically complete

Return ONLY valid JSON, no markdown or explanation.`
        }]
      });
      
      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected AI response format');
      }

      // Parse AI response
      let digestContent;
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        digestContent = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Failed to parse AI digest:", parseError);
        throw new Error('Failed to generate quality digest content');
      }

      // Map AI-curated global stories back to original news with enhanced content
      const globalStories = (digestContent.globalThreats || []).map((story: any) => {
        const originalNews = externalNews[story.originalIndex - 1] || externalNews[0];
        return {
          id: originalNews?.id || `story-${Date.now()}`,
          title: story.headline,
          excerpt: story.insight,
          actionItem: story.actionItem,
          source: originalNews?.source || 'GetCyberRight',
          url: originalNews?.url || '',
          publishedAt: originalNews?.publishedAt || new Date().toISOString(),
          regions: ['global'],
          priority: story.threatLevel === 'critical' || story.threatLevel === 'high' ? 'critical' : 'normal'
        };
      });

      // Create the digest with rich educational content including regional and traveler sections
      const fullContent = {
        globalStories,
        regionalSpotlights: digestContent.regionalSpotlights || {},
        safetyTips: digestContent.safetyTips || [],
        travelerAlert: digestContent.travelerAlert || null,
        weeklyLesson: digestContent.weeklyLesson || null
      };

      const digest = await storage.createWeeklyDigest({
        title: digestContent.digestTitle || `Weekly Safety Digest: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
        summary: digestContent.digestSummary || 'This week\'s essential cybersecurity insights for your family.',
        newsItems: JSON.stringify(fullContent),
        status: 'pending_review',
        scheduledFor: null,
        approvedBy: null,
        threatAlerts: null
      });

      res.json({ message: "Quality digest generated for review", digest });
    } catch (error) {
      console.error("Error generating digest:", error);
      res.status(500).json({ message: "Failed to generate digest. Please try again." });
    }
  });

  app.post("/api/weekly-digest/:id/approve", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const approvedBy = req.user?.username || 'admin';
      const digest = await storage.approveWeeklyDigest(id, approvedBy);
      
      if (!digest) {
        res.status(404).json({ message: "Digest not found" });
        return;
      }

      res.json({ message: "Digest approved", digest });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve digest" });
    }
  });

  app.post("/api/weekly-digest/:id/send", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const digest = await storage.getWeeklyDigest(id);
      
      if (!digest) {
        res.status(404).json({ message: "Digest not found" });
        return;
      }
      
      if (digest.status !== 'approved') {
        res.status(400).json({ message: "Digest must be approved before sending" });
        return;
      }

      const subscribers = await storage.getWeeklyDigestSubscribers();
      const { sendDailyTip, generateDailyTipEmail, isEmailConfigured } = await import("./email-service");
      
      if (!isEmailConfigured()) {
        res.status(503).json({ message: "Email service not configured" });
        return;
      }

      let allNewsItems: any[] = [];
      try {
        const parsed = JSON.parse(digest.newsItems || '[]');
        // Handle both array format and object format with globalStories
        if (Array.isArray(parsed)) {
          allNewsItems = parsed;
        } else if (parsed.globalStories) {
          allNewsItems = parsed.globalStories;
        } else {
          allNewsItems = [];
        }
      } catch {
        allNewsItems = [];
      }
      let sent = 0;
      let failed = 0;

      for (const sub of subscribers) {
        // Filter news based on subscriber's region
        const subRegion = sub.region || 'global';
        let filteredItems = allNewsItems.filter((item: any) => {
          if (!item.regions || item.regions.length === 0) return true;
          if (subRegion === 'global') return true;
          return item.regions.includes(subRegion) || item.regions.includes('global');
        });
        
        // If essentials_only, filter to critical items
        const alertPriority = sub.alertPriority || 'all';
        if (alertPriority === 'essentials_only') {
          const criticalItems = filteredItems.filter((item: any) => item.priority === 'critical');
          filteredItems = criticalItems.length >= 2 ? criticalItems : filteredItems.slice(0, 3);
        }
        
        // Skip if no relevant news for this subscriber
        if (filteredItems.length === 0) continue;
        
        const regionName = {
          'global': 'Global',
          'north_america': 'North America',
          'europe': 'Europe',
          'asia_pacific': 'Asia-Pacific',
          'africa': 'Africa',
          'latin_america': 'Latin America',
          'middle_east': 'Middle East'
        }[subRegion] || 'Your Region';
        
        const subscriberName = sub.name || '';
        const greeting = subscriberName ? `Hi ${subscriberName},` : 'Hi there,';
        
        // Generate table of contents for stories
        const tocHtml = filteredItems.length > 2 ? `
      <div style="background: #f0f9ff; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
        <p style="margin: 0 0 10px; font-size: 13px; color: #0369a1; font-weight: 600; text-transform: uppercase;">In This Issue</p>
        ${filteredItems.map((item: any, idx: number) => `<p style="margin: 4px 0; font-size: 14px; color: #334155;">${idx + 1}. ${item.title}</p>`).join('')}
      </div>
        ` : '';
        
        const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 36px 30px; border-radius: 16px 16px 0 0; text-align: center;">
      <img src="https://getcyberright.com/lock-logo.png" alt="GetCyberRight" style="width: 70px; height: 70px; border-radius: 14px; margin-bottom: 16px;" />
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">GetCyberRight</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 15px;">Weekly Fraud Alert</p>
    </div>
    
    <!-- Main Content -->
    <div style="background: white; padding: 36px 30px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      <!-- Personalized Greeting -->
      <p style="color: #334155; font-size: 16px; margin: 0 0 20px; line-height: 1.6;">
        ${greeting} Here's your weekly roundup of the most important cyber threats and scams you need to know about.
      </p>
      
      <!-- Region Badge -->
      <div style="display: inline-block; background-color: #f0fdfa; color: #0d9488; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 24px;">
        📍 ${regionName}
      </div>
      
      <h2 style="color: #0f172a; margin: 0 0 16px; font-size: 22px; font-weight: 700;">${digest.title}</h2>
      
      <p style="color: #475569; line-height: 1.7; font-size: 16px; margin: 0 0 28px;">
        ${digest.summary}
      </p>
      
      <!-- Table of Contents -->
      ${tocHtml}
      
      <!-- Stories Section -->
      <h3 style="color: #0f172a; margin: 0 0 20px; font-size: 18px; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px;">📰 This Week's Top Stories</h3>
      
      ${filteredItems.map((item: any, idx: number) => `
        <div style="margin-bottom: 24px; padding: 20px; background: #f8fafc; border-radius: 12px; border-left: 4px solid ${item.priority === 'critical' ? '#dc2626' : '#0d9488'};">
          ${item.priority === 'critical' ? '<span style="background: #dc2626; color: white; padding: 3px 10px; font-size: 11px; border-radius: 4px; margin-bottom: 10px; display: inline-block; font-weight: 600;">⚠️ CRITICAL</span>' : ''}
          <h4 style="margin: ${item.priority === 'critical' ? '8px' : '0'} 0 10px 0; color: #0f172a; font-size: 17px; font-weight: 600; line-height: 1.4;">${item.title}</h4>
          <p style="margin: 0 0 10px 0; color: #475569; font-size: 15px; line-height: 1.65;">${item.excerpt}</p>
          <p style="margin: 0; font-size: 12px; color: #64748b;">Source: ${item.source}</p>
        </div>
      `).join('')}
      
      <!-- CTA Section -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 28px; margin-top: 28px; text-align: center;">
        <a href="https://getcyberright.com/scam-checker" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin-right: 12px;">
          Check a Scam →
        </a>
        <a href="https://getcyberright.com/news" style="display: inline-block; background: #1e293b; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
          More News
        </a>
      </div>
      
      <!-- Social Proof -->
      <div style="margin-top: 28px; padding: 16px 20px; background: #fefce8; border-radius: 8px; text-align: center;">
        <p style="margin: 0; color: #854d0e; font-size: 14px;">
          🛡️ <strong>Join thousands of families</strong> staying safe with GetCyberRight
        </p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 24px 20px; color: #64748b; font-size: 13px;">
      <p style="margin: 0 0 8px;">You're receiving this because you subscribed to Weekly Fraud Alerts.</p>
      <p style="margin: 0 0 12px;"><a href="https://getcyberright.com/unsubscribe?email=${encodeURIComponent(sub.email)}" style="color: #0d9488; text-decoration: underline;">Unsubscribe</a> · <a href="https://getcyberright.com/preferences" style="color: #0d9488; text-decoration: underline;">Manage Preferences</a></p>
      <p style="margin: 0; color: #94a3b8;">© ${new Date().getFullYear()} GetCyberRight. Protecting families online.</p>
    </div>
  </div>
</body>
</html>
        `;

        const { sendEmail } = await import("./email-service");
        const success = await sendEmail({
          to: [sub.email],
          subject: digest.title,
          htmlBody: emailContent,
        });
        if (success) sent++; else failed++;
      }

      await storage.markWeeklyDigestSent(id, sent);

      res.json({ 
        message: "Weekly digest sent", 
        stats: { sent, failed, total: subscribers.length }
      });
    } catch (error) {
      console.error("Error sending digest:", error);
      res.status(500).json({ message: "Failed to send digest" });
    }
  });

  // Get single digest for preview
  app.get("/api/weekly-digest/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const digest = await storage.getWeeklyDigest(id);
      
      if (!digest) {
        res.status(404).json({ message: "Digest not found" });
        return;
      }

      res.json(digest);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch digest" });
    }
  });

  // Delete digest
  app.delete("/api/weekly-digest/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const digest = await storage.getWeeklyDigest(id);
      
      if (!digest) {
        res.status(404).json({ message: "Digest not found" });
        return;
      }
      
      if (digest.status === 'sent') {
        res.status(400).json({ message: "Cannot delete a digest that has already been sent" });
        return;
      }

      const deleted = await storage.deleteWeeklyDigest(id);
      
      if (deleted) {
        res.json({ message: "Digest deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete digest" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete digest" });
    }
  });

  // Daily Tips Automation routes (admin only)
  app.get("/api/daily-tip", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status } = req.query;
      const tips = await storage.getDailyTips(status as string);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily tips" });
    }
  });

  app.post("/api/daily-tip/generate", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { audience = 'all', region = 'global' } = req.body;
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
      });

      // Get recent news for context
      const recentNews = await newsAggregator.getLatestNews(15);
      const newsContext = recentNews.slice(0, 8).map((a, i) => 
        `${i + 1}. [${a.source}] ${a.title}: ${a.excerpt.substring(0, 180)}`
      ).join('\n');

      const audienceContext: Record<string, string> = {
        all: "all audiences (families, parents, seniors, teens)",
        youth: "teenagers and young adults (ages 13-25)",
        senior: "seniors (ages 60+)",
        parent: "parents with children",
        traveler: "travelers"
      };

      const regionContext: Record<string, string> = {
        global: "a global audience",
        north_america: "North American audiences (US, Canada, Mexico) - reference FBI IC3, FTC, CISA when relevant",
        europe: "European audiences (UK, EU) - reference Action Fraud, Europol, NCSC when relevant",
        asia_pacific: "Asia-Pacific audiences - reference local cybercrime agencies when relevant",
        africa: "African audiences - include M-Pesa, MTN, Airtel mobile money safety when relevant",
        latin_america: "Latin American audiences - reference regional cybercrime patterns",
        middle_east: "Middle Eastern audiences - reference regional cybercrime patterns"
      };

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 2000,
        messages: [{
          role: "user",
          content: `You are a friendly cybersecurity educator creating a digital safety tip for ${audienceContext[audience] || "all audiences"} targeting ${regionContext[region] || "a global audience"}.

CORE OPERATING PRINCIPLE:
You may think creatively about cybersecurity trends, but you may ONLY assert conclusions that are defensible, conservative, and grounded in the news items provided. Do not invent threats or statistics not present in the source material.

EVIDENCE HIERARCHY (For All Content):
1. Government, law enforcement, or regulatory advisories (FBI IC3, CISA, FTC, INTERPOL)
2. Established cybersecurity research or incident reporting
3. Consistent patterns observed across real scam cases
4. Conservative inference based on known attacker behavior (must be labeled as inference)

HALLUCINATION GUARDRAILS - YOU MUST NOT:
1. Invent threats, attack methods, or statistics not mentioned in the provided news
2. Attribute intent, identity, or geography without evidence from the news items
3. Inflate edge cases into likely outcomes
4. Use fear-based, sensational, or absolute language
5. Provide false reassurance or false alarm when uncertainty exists

Recent cybersecurity news for context:
${newsContext}

Create an engaging, educational safety tip. Return ONLY valid JSON:
{
  "title": "Catchy, friendly title (max 60 chars)",
  "tipContent": "The main tip in 2-3 sentences. Use plain language, be practical and actionable. Avoid fear-mongering.",
  "category": "phishing|password|social_media|scam|privacy|malware|safe_browsing|identity_theft",
  "actionItems": [
    "First specific action to take",
    "Second specific action to take",
    "Third specific action to take (optional)"
  ],
  "funFact": "An interesting, memorable fact related to this topic (optional, make it engaging)",
  "sourceReference": "Brief mention of authoritative source if applicable (e.g., 'Based on FBI IC3 guidance')",
  "regionalNote": "Optional region-specific context or reporting info"
}

Guidelines:
- Write like you're talking to a friend, not lecturing
- Focus on ONE clear topic per tip
- Make action items specific and doable today
- For ${audienceContext[audience] || "all audiences"}: tailor language and examples appropriately
- For ${regionContext[region] || "global"}: include relevant regional context or reporting agencies
- Keep total content readable in under 60 seconds
- Be encouraging, not scary
- Use neutral, precise, non-alarmist language
- When information is incomplete, be conservative rather than speculative
- Reference real reporting agencies where possible (FBI IC3, FTC, Action Fraud, Europol)

WRITING STYLE REQUIREMENTS:
- Use proper punctuation and complete sentences throughout
- Do NOT use dashes (--) or em dashes in any text
- Use commas, periods, and semicolons instead of dashes
- Write in clean, professional prose without bullet-style fragments
- Ensure all sentences are grammatically complete

Return ONLY valid JSON, no markdown.`
        }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected AI response format');
      }

      let tipData;
      try {
        const jsonMatch = content.text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        tipData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error("Failed to parse AI tip:", parseError);
        throw new Error('Failed to generate quality tip content');
      }

      const tip = await storage.createDailyTip({
        title: tipData.title,
        tipContent: tipData.tipContent,
        audience,
        region,
        category: tipData.category,
        actionItems: JSON.stringify(tipData.actionItems || []),
        funFact: tipData.funFact || null,
        sourceReference: tipData.sourceReference || null,
        regionalNote: tipData.regionalNote || null,
        status: 'draft'
      });

      res.json({ message: "Digital Safety Tip generated for review", tip });
    } catch (error: any) {
      console.error("Error generating daily tip:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        name: error?.name,
        code: error?.code
      });
      const errorMessage = error?.message || "Unknown error";
      res.status(500).json({ 
        message: `Failed to generate daily tip: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      });
    }
  });

  app.get("/api/daily-tip/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tip = await storage.getDailyTip(id);
      if (!tip) {
        res.status(404).json({ message: "Daily tip not found" });
        return;
      }
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily tip" });
    }
  });

  app.post("/api/daily-tip/:id/approve", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const approvedBy = req.user?.username || 'admin';
      const tip = await storage.approveDailyTip(id, approvedBy);
      if (!tip) {
        res.status(404).json({ message: "Daily tip not found" });
        return;
      }

      const subscribers = await storage.getDigitalSafetyTipsSubscribers(tip.audience);

      if (subscribers.length === 0) {
        res.json({ message: "Tip approved but no subscribers found", tip, sent: 0 });
        return;
      }

      let actionItems: string[] = [];
      try {
        actionItems = tip.actionItems ? JSON.parse(tip.actionItems) : [];
      } catch { actionItems = []; }

      // Generate personalized email for each subscriber
      const generateEmailHtml = (subscriberName: string | null, subscriberEmail: string) => {
        const greeting = subscriberName ? `Hi ${subscriberName},` : 'Hi there,';
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <img src="https://getcyberright.com/lock-logo.png" alt="GetCyberRight" style="width: 70px; height: 70px; border-radius: 14px; margin-bottom: 12px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">GetCyberRight</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Digital Safety Tip</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">${greeting} Here's a quick safety tip to help protect you and your family online.</p>
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700;">${tip.title}</h2>
              <span style="display: inline-block; background-color: #f0fdfa; color: #0d9488; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 20px;">${tip.category || 'Safety Tip'}</span>
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.7;">${tip.tipContent}</p>
              ${actionItems.length > 0 ? `
              <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #0369a1; font-size: 14px; font-weight: 700;">What You Can Do Today</h3>
                ${actionItems.map((item: string) => `<p style="margin: 8px 0; color: #334155; font-size: 15px;">✓ ${item}</p>`).join('')}
              </div>
              ` : ''}
              ${tip.funFact ? `<div style="background-color: #fefce8; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;"><p style="margin: 0; color: #854d0e; font-size: 14px;"><strong>💡 Did you know?</strong> ${tip.funFact}</p></div>` : ''}
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="https://getcyberright.com/scam-checker" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-right: 8px;">Check a Scam</a>
                    <a href="https://getcyberright.com" style="display: inline-block; background: #1e293b; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600;">More Tips</a>
                  </td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding: 16px 20px; background: #fefce8; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #854d0e; font-size: 14px;">🛡️ <strong>Join thousands of families</strong> staying safe with GetCyberRight</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; text-align: center;">You're receiving this because you subscribed to Digital Safety Tips.</p>
              <p style="margin: 0; color: #64748b; font-size: 13px; text-align: center;"><a href="https://getcyberright.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #0d9488; text-decoration: underline;">Unsubscribe</a> · <a href="https://getcyberright.com/preferences" style="color: #0d9488; text-decoration: underline;">Manage Preferences</a></p>
            </td>
          </tr>
        </table>
        <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">© ${new Date().getFullYear()} GetCyberRight. Helping families stay safe online.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
      };

      let sent = 0;
      for (const subscriber of subscribers) {
        try {
          const emailHtml = generateEmailHtml(subscriber.name || null, subscriber.email);
          await sendEmail({
            to: [subscriber.email],
            subject: `🔒 Digital Safety Tip: ${tip.title}`,
            htmlBody: emailHtml
          });
          sent++;
        } catch (emailError) {
          console.error(`Failed to send to ${subscriber.email}:`, emailError);
        }
      }

      await storage.markDailyTipSent(id, sent);

      res.json({ message: "Tip approved and sent", tip, sent, total: subscribers.length });
    } catch (error) {
      console.error("Error approving/sending daily tip:", error);
      res.status(500).json({ message: "Failed to approve daily tip" });
    }
  });

  app.post("/api/daily-tip/:id/send", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tip = await storage.getDailyTip(id);

      if (!tip) {
        res.status(404).json({ message: "Daily tip not found" });
        return;
      }

      if (tip.status !== 'approved') {
        res.status(400).json({ message: "Daily tip must be approved before sending" });
        return;
      }

      const subscribers = await storage.getDigitalSafetyTipsSubscribers(tip.audience);

      if (subscribers.length === 0) {
        res.status(400).json({ message: "No subscribers found for this audience" });
        return;
      }

      // Parse action items
      let actionItems: string[] = [];
      try {
        actionItems = tip.actionItems ? JSON.parse(tip.actionItems) : [];
      } catch { actionItems = []; }

      // Build personalized HTML email for each subscriber
      const generateEmailHtml = (subscriberName: string | null, subscriberEmail: string) => {
        const greeting = subscriberName ? `Hi ${subscriberName},` : 'Hi there,';
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); padding: 32px 40px; border-radius: 16px 16px 0 0; text-align: center;">
              <img src="https://getcyberright.com/lock-logo.png" alt="GetCyberRight" style="width: 70px; height: 70px; border-radius: 14px; margin-bottom: 12px;" />
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">GetCyberRight</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Daily Digital Safety Tip</p>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Personalized Greeting -->
              <p style="margin: 0 0 20px 0; color: #334155; font-size: 16px; line-height: 1.6;">${greeting} Here's a quick safety tip to help protect you and your family online.</p>
              
              <!-- Title -->
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700; line-height: 1.3;">
                ${tip.title}
              </h2>
              
              <!-- Category Badge -->
              <span style="display: inline-block; background-color: #f0fdfa; color: #0d9488; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 20px;">
                ${tip.category || 'Safety Tip'}
              </span>
              
              <!-- Tip Content -->
              <p style="margin: 0 0 24px 0; color: #334155; font-size: 16px; line-height: 1.7;">
                ${tip.tipContent}
              </p>
              
              ${actionItems.length > 0 ? `
              <!-- Action Items -->
              <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #0369a1; font-size: 14px; font-weight: 700; text-transform: uppercase;">What You Can Do Today</h3>
                ${actionItems.map((item: string) => `
                <p style="margin: 8px 0; color: #334155; font-size: 15px; line-height: 1.5; padding-left: 24px; position: relative;">
                  <span style="position: absolute; left: 0; color: #0d9488;">✓</span>
                  ${item}
                </p>
                `).join('')}
              </div>
              ` : ''}
              
              ${tip.funFact ? `
              <!-- Fun Fact -->
              <div style="background-color: #fefce8; padding: 16px 20px; border-radius: 8px; margin-bottom: 24px;">
                <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.5;">
                  <strong>💡 Did you know?</strong> ${tip.funFact}
                </p>
              </div>
              ` : ''}

              ${tip.regionalNote ? `
              <!-- Regional Note -->
              <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                  <strong>📍 Regional Info:</strong> ${tip.regionalNote}
                </p>
              </div>
              ` : ''}

              ${tip.sourceReference ? `
              <p style="margin: 0 0 24px 0; color: #64748b; font-size: 12px; font-style: italic;">
                ${tip.sourceReference}
              </p>
              ` : ''}
              
              <!-- CTA Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 8px 0;">
                    <a href="https://getcyberright.com/scam-checker" style="display: inline-block; background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin-right: 8px;">
                      Check a Scam
                    </a>
                    <a href="https://getcyberright.com" style="display: inline-block; background: #1e293b; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
                      More Tips
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Social Proof -->
              <div style="margin-top: 24px; padding: 16px 20px; background: #fefce8; border-radius: 8px; text-align: center;">
                <p style="margin: 0; color: #854d0e; font-size: 14px;">🛡️ <strong>Join thousands of families</strong> staying safe with GetCyberRight</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; border-radius: 0 0 16px 16px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px; text-align: center;">
                You're receiving this because you subscribed to Daily Safety Tips.
              </p>
              <p style="margin: 0; color: #64748b; font-size: 13px; text-align: center;">
                <a href="https://getcyberright.com/unsubscribe?email=${encodeURIComponent(subscriberEmail)}" style="color: #0d9488; text-decoration: underline;">Unsubscribe</a> · <a href="https://getcyberright.com/preferences" style="color: #0d9488; text-decoration: underline;">Manage Preferences</a>
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Copyright -->
        <p style="margin: 24px 0 0 0; color: #94a3b8; font-size: 12px; text-align: center;">
          © ${new Date().getFullYear()} GetCyberRight. Helping families stay safe online.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
      };

      // Send emails
      let sent = 0;
      for (const subscriber of subscribers) {
        try {
          const emailHtml = generateEmailHtml(subscriber.name || null, subscriber.email);
          await sendEmail({
            to: [subscriber.email],
            subject: `🔒 Daily Safety Tip: ${tip.title}`,
            htmlBody: emailHtml
          });
          sent++;
        } catch (emailError) {
          console.error(`Failed to send to ${subscriber.email}:`, emailError);
        }
      }

      await storage.markDailyTipSent(id, sent);

      res.json({ 
        message: "Daily tip sent", 
        sent,
        total: subscribers.length 
      });
    } catch (error) {
      console.error("Error sending daily tip:", error);
      res.status(500).json({ message: "Failed to send daily tip" });
    }
  });

  app.delete("/api/daily-tip/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tip = await storage.getDailyTip(id);
      
      if (!tip) {
        res.status(404).json({ message: "Daily tip not found" });
        return;
      }
      
      if (tip.status === 'sent') {
        res.status(400).json({ message: "Cannot delete a tip that has already been sent" });
        return;
      }

      const deleted = await storage.deleteDailyTip(id);
      
      if (deleted) {
        res.json({ message: "Daily tip deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete daily tip" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete daily tip" });
    }
  });

  // Get all safety tip templates (admin only)
  app.get("/api/daily-tips/templates", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { audience, dayType } = req.query;
      const tips = await storage.getSafetyTipTemplates({
        audience: audience as string,
        dayType: dayType as string
      });
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tip templates" });
    }
  });

  // Partnership/Advertising Inquiry routes - with enhanced protection and reCAPTCHA
  app.post("/api/partnership/inquire", strictRateLimit, honeypotProtection(), recaptchaMiddleware(0.5), async (req, res) => {
    try {
      const validatedData = insertPartnershipInquirySchema.parse(req.body);
      const inquiry = await storage.createPartnershipInquiry(validatedData);
      
      // Sanitize user inputs before including in email HTML
      const sanitizedData = {
        companyName: escapeForAttribute(validatedData.companyName),
        contactName: escapeForAttribute(validatedData.contactName),
        email: escapeForAttribute(validatedData.email),
        phone: escapeForAttribute(validatedData.phone || 'Not provided'),
        interest: escapeForAttribute(validatedData.interest),
        budget: escapeForAttribute(validatedData.budget || 'Not specified'),
        website: escapeForAttribute(validatedData.website || 'Not provided'),
        message: sanitizeText(validatedData.message)
      };
      
      // Send email notification
      const mailersendApiKey = process.env.MAILERSEND_API_KEY;
      if (mailersendApiKey) {
        try {
          const emailResponse = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mailersendApiKey}`
            },
            body: JSON.stringify({
              from: {
                email: process.env.EMAIL_FROM_ADDRESS || 'noreply@getcyberright.com',
                name: 'GetCyberRight'
              },
              to: [{
                email: 'hello@getcyberright.com',
                name: 'GetCyberRight Team'
              }],
              subject: `New Partnership Inquiry from ${sanitizedData.companyName}`,
              html: `
                <h2>New Partnership Inquiry</h2>
                <p><strong>Company:</strong> ${sanitizedData.companyName}</p>
                <p><strong>Contact:</strong> ${sanitizedData.contactName}</p>
                <p><strong>Email:</strong> ${sanitizedData.email}</p>
                <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
                <p><strong>Interest:</strong> ${sanitizedData.interest}</p>
                <p><strong>Budget:</strong> ${sanitizedData.budget}</p>
                <p><strong>Website:</strong> ${sanitizedData.website}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${sanitizedData.message}</p>
                <hr>
                <p><em>Submitted: ${new Date().toISOString()}</em></p>
              `,
              text: `New Partnership Inquiry\n\nCompany: ${validatedData.companyName}\nContact: ${validatedData.contactName}\nEmail: ${validatedData.email}\nPhone: ${validatedData.phone || 'Not provided'}\nInterest: ${validatedData.interest}\nBudget: ${validatedData.budget || 'Not specified'}\nWebsite: ${validatedData.website || 'Not provided'}\n\nMessage:\n${validatedData.message}`
            })
          });
          
          if (!emailResponse.ok) {
            console.error('Failed to send partnership inquiry email:', await emailResponse.text());
          }
        } catch (emailError) {
          console.error('Error sending partnership inquiry email:', emailError);
        }
      }
      
      res.status(201).json({ 
        message: "Thank you for your inquiry! We'll be in touch within 48 hours.",
        inquiry: { id: inquiry.id }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Please fill in all required fields", errors: error.errors });
      } else {
        console.error('Partnership inquiry error:', error);
        res.status(500).json({ message: "Failed to submit inquiry. Please try again." });
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      }
    }
  });

<<<<<<< HEAD
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

=======
  // Get partnership inquiries (admin only)
  app.get("/api/partnership/inquiries", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { status, limit } = req.query;
      const inquiries = await storage.getPartnershipInquiries({
        status: status as string,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partnership inquiries" });
    }
  });

  // Update partnership inquiry status (admin only)
  app.patch("/api/partnership/inquiries/:id", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const inquiry = await storage.updatePartnershipInquiryStatus(id, status, notes);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ message: "Failed to update inquiry" });
    }
  });

  // Submit user feedback (public)
  app.post("/api/feedback", async (req: Request, res: Response) => {
    try {
      const { type, rating, message, email, page } = req.body;
      
      if (!type || !message) {
        return res.status(400).json({ message: "Type and message are required" });
      }
      
      const feedback = await storage.createFeedback({ type, rating, message, email, page });
      res.json({ message: "Thank you for your feedback!", feedback });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Failed to submit feedback" });
    }
  });

  // Get all feedback (admin only)
  app.get("/api/feedback", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  // Contact form submission (public)
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const { name, email, topic, subject, message } = req.body;
      
      if (!email || !message) {
        return res.status(400).json({ message: "Email and message are required" });
      }
      
      const submission = await storage.createContactSubmission({ name, email, topic, subject, message });
      res.json({ message: "Thank you for reaching out! We'll get back to you soon.", submission });
    } catch (error) {
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Get all contact submissions (admin only)
  app.get("/api/contact", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  // Mark contact as read (admin only)
  app.post("/api/contact/:id/read", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updated = await storage.markContactAsRead(id);
      if (!updated) {
        return res.status(404).json({ message: "Contact submission not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark contact as read" });
    }
  });

  // Submit testimonial (public)
  app.post("/api/testimonials", async (req: Request, res: Response) => {
    try {
      const { name, location, story, category } = req.body;
      
      if (!name || !story) {
        return res.status(400).json({ message: "Name and story are required" });
      }
      
      console.log("[Testimonial] New submission:", { name, location, category });
      res.json({ message: "Thank you for sharing your story!", success: true });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      res.status(500).json({ message: "Failed to submit testimonial" });
    }
  });

  // Track referral (public)
  app.post("/api/referral/track", async (req: Request, res: Response) => {
    try {
      const { referralCode, action, source } = req.body;
      
      if (referralCode) {
        console.log("[Referral] Tracked:", { referralCode, action, source });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking referral:", error);
      res.status(500).json({ message: "Failed to track referral" });
    }
  });

  // Track tool usage (public - called by frontend tools)
  app.post("/api/tools/track", async (req: Request, res: Response) => {
    try {
      const { toolName, action, metadata } = req.body;
      
      if (!toolName) {
        return res.status(400).json({ message: "Tool name is required" });
      }
      
      await storage.trackToolUsage({ 
        toolName, 
        action, 
        metadata: metadata ? JSON.stringify(metadata) : undefined 
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking tool usage:", error);
      res.status(500).json({ message: "Failed to track tool usage" });
    }
  });

  // Get tool usage stats (admin only)
  app.get("/api/admin/tool-stats", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const stats = await storage.getToolUsageStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tool usage stats" });
    }
  });

  // Send scheduled tips (admin only - called by cron or manual trigger)
  app.post("/api/daily-tips/send", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { sendDailyTip, generateDailyTipEmail, isEmailConfigured } = await import("./email-service");
      
      const today = new Date();
      const dayOfWeek = today.getDay();
      const dayType = dayOfWeek === 1 ? 'monday' : dayOfWeek === 5 ? 'friday' : null;
      
      if (!dayType) {
        return res.json({ 
          message: "Not a scheduled send day (Monday or Friday)",
          dayOfWeek,
          skipped: true 
        });
      }

      const audiences = ['youth', 'senior', 'all'];
      const results: { audience: string; tip: string; subscribersCount: number; sent: number; failed: number }[] = [];
      
      for (const audience of audiences) {
        const tip = await storage.getNextTipForAudience(audience, dayType);
        if (!tip) continue;
        
        const subscribers = await storage.getActiveSubscribersForAudience(audience);
        if (subscribers.length === 0) continue;
        
        let sent = 0;
        let failed = 0;
        
        for (const sub of subscribers) {
          const emailContent = generateDailyTipEmail(
            { audience: tip.audience, title: tip.title, tip: tip.content },
            sub.email
          );
          
          const success = await sendDailyTip(
            { audience: tip.audience, title: tip.title, tip: tip.content },
            sub.email
          );
          
          await storage.logEmailSend(sub.id, tip.id, success ? 'sent' : 'failed');
          
          if (success) sent++;
          else failed++;
        }
        
        await storage.markTipAsUsed(tip.id);
        
        results.push({
          audience,
          tip: tip.title,
          subscribersCount: subscribers.length,
          sent,
          failed
        });
      }
      
      res.json({ 
        message: "Daily tips send completed",
        dayType,
        emailConfigured: isEmailConfigured(),
        results 
      });
    } catch (error) {
      console.error("Failed to send daily tips:", error);
      res.status(500).json({ message: "Failed to send daily tips", error: String(error) });
    }
  });

  // Get email service status
  app.get("/api/daily-tips/status", async (req, res) => {
    try {
      const { isEmailConfigured } = await import("./email-service");
      const tips = await storage.getSafetyTipTemplates({});
      const subscribers = await storage.getDailyTipsSubscriptions();
      
      const today = new Date();
      const dayOfWeek = today.getDay();
      const isScheduledDay = dayOfWeek === 1 || dayOfWeek === 5;
      
      res.json({
        emailConfigured: isEmailConfigured(),
        totalTips: tips.length,
        mondayTips: tips.filter(t => t.dayType === 'monday').length,
        fridayTips: tips.filter(t => t.dayType === 'friday').length,
        totalSubscribers: subscribers.length,
        isScheduledDay,
        nextSendDay: dayOfWeek < 1 ? 'Monday' : dayOfWeek < 5 ? 'Friday' : 'Monday',
        dayOfWeek
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get status" });
    }
  });

  // Send quiz results via email
  app.post("/api/quiz-results/email", formSubmissionRateLimit, async (req: Request, res: Response) => {
    try {
      const { email, score, maxScore, level, recommendations } = req.body;
      
      if (!email || typeof score !== 'number' || typeof maxScore !== 'number' || !level) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      const { sendQuizResults, isEmailConfigured } = await import("./email-service");
      
      if (!isEmailConfigured()) {
        console.log("[QuizResults] Email would be sent to:", email);
        return res.json({ success: true, message: "Results logged (email not configured)" });
      }
      
      const success = await sendQuizResults(
        { score, maxScore, level, recommendations: recommendations || [] },
        email
      );
      
      if (success) {
        res.json({ success: true, message: "Results sent to your email" });
      } else {
        res.status(500).json({ success: false, message: "Failed to send email" });
      }
    } catch (error) {
      console.error("Failed to send quiz results:", error);
      res.status(500).json({ message: "Failed to send quiz results" });
    }
  });

  // Email Queue Management (admin only)
  app.get("/api/email-queue", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { getScheduledEmailQueue } = await import("./email-scheduler");
      const status = req.query.status as string | undefined;
      const emails = await getScheduledEmailQueue(status);
      res.json(emails);
    } catch (error) {
      console.error("Failed to get email queue:", error);
      res.status(500).json({ message: "Failed to get email queue" });
    }
  });

  app.post("/api/email-queue/generate", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { queueScheduledEmail } = await import("./email-scheduler");
      const { generateDailyTipEmail } = await import("./email-service");
      
      const today = new Date();
      const dayOfWeek = today.getDay();
      const dayType = dayOfWeek === 1 ? 'monday' : dayOfWeek === 5 ? 'friday' : 'monday';
      
      const audiences = ['youth', 'senior', 'all'];
      const queued: { audience: string; subject: string; id: number }[] = [];
      
      for (const audience of audiences) {
        const tip = await storage.getNextTipForAudience(audience, dayType);
        if (!tip) continue;
        
        const emailContent = generateDailyTipEmail(
          { audience: tip.audience, title: tip.title, tip: tip.content },
          'preview@getcyberright.com'
        );
        
        const scheduledFor = new Date();
        scheduledFor.setHours(9, 0, 0, 0);
        if (scheduledFor <= today) {
          scheduledFor.setDate(scheduledFor.getDate() + 1);
        }
        
        const id = await queueScheduledEmail(
          'daily_tip',
          audience,
          `Daily Safety Tip: ${tip.title}`,
          emailContent.htmlBody,
          emailContent.textBody || '',
          scheduledFor
        );
        
        queued.push({ audience, subject: tip.title, id });
      }
      
      res.json({ 
        message: `Queued ${queued.length} emails for validation`,
        queued 
      });
    } catch (error) {
      console.error("Failed to generate email queue:", error);
      res.status(500).json({ message: "Failed to generate email queue" });
    }
  });

  app.post("/api/email-queue/:id/approve", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { approveEmail } = await import("./email-scheduler");
      const id = parseInt(req.params.id);
      const success = await approveEmail(id, req.user?.username || 'admin');
      
      if (success) {
        res.json({ message: "Email approved and will be sent at scheduled time" });
      } else {
        res.status(404).json({ message: "Email not found" });
      }
    } catch (error) {
      console.error("Failed to approve email:", error);
      res.status(500).json({ message: "Failed to approve email" });
    }
  });

  app.post("/api/email-queue/:id/reject", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { rejectEmail } = await import("./email-scheduler");
      const id = parseInt(req.params.id);
      const reason = req.body.reason || 'Rejected by admin';
      const success = await rejectEmail(id, reason);
      
      if (success) {
        res.json({ message: "Email rejected" });
      } else {
        res.status(404).json({ message: "Email not found" });
      }
    } catch (error) {
      console.error("Failed to reject email:", error);
      res.status(500).json({ message: "Failed to reject email" });
    }
  });

  app.post("/api/email-scheduler/run", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { runScheduler } = await import("./email-scheduler");
      const results = await runScheduler();
      res.json({ 
        message: "Scheduler run completed",
        results 
      });
    } catch (error) {
      console.error("Failed to run scheduler:", error);
      res.status(500).json({ message: "Failed to run scheduler" });
    }
  });

  // Cron endpoint for automated scheduling (can be called by external cron service)
  app.post("/api/cron/email-scheduler", async (req, res) => {
    const cronSecret = req.headers['x-cron-secret'];
    if (cronSecret !== process.env.CRON_SECRET && process.env.NODE_ENV !== 'development') {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const { runScheduler, runWeeklyTipGeneration } = await import("./email-scheduler");
      
      const today = new Date();
      const dayOfWeek = today.getDay();
      
      let tipGeneration: { generated: boolean; tipId?: number; error?: string } = { generated: false };
      if (dayOfWeek === 1) {
        tipGeneration = await runWeeklyTipGeneration();
        console.log('[Cron] Weekly tip generation:', tipGeneration);
      }
      
      const results = await runScheduler();
      res.json({ 
        message: "Cron job completed",
        dayOfWeek,
        tipGeneration,
        results 
      });
    } catch (error) {
      console.error("Cron job failed:", error);
      res.status(500).json({ message: "Cron job failed" });
    }
  });

  // Breaking news endpoint (for the banner)
  app.get("/api/breaking-news", async (req, res) => {
    try {
      const breakingNews = await storage.getArticles({ breaking: true, limit: 1 });
      res.json(breakingNews[0] || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breaking news" });
    }
  });

  // Cyber Awareness Assessment routes
  app.get("/api/cyber-assessments", async (req, res) => {
    try {
      const { category, difficulty, limit } = req.query;
      const options: any = {};
      
      if (category && typeof category === 'string') options.category = category;
      if (difficulty && typeof difficulty === 'string') options.difficulty = difficulty;
      if (limit && typeof limit === 'string') options.limit = parseInt(limit);

      const assessments = await storage.getCyberAssessments(options);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cyber assessments" });
    }
  });

  app.get("/api/cyber-assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getCyberAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post("/api/cyber-assessments/results", async (req, res) => {
    try {
      const result = await storage.createAssessmentResult(req.body);
      
      // Check for new achievements
      const newAchievements = await storage.checkAndUnlockAchievements(req.body.sessionId);
      
      res.status(201).json({ 
        result, 
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save assessment result" });
    }
  });

  app.get("/api/cyber-assessments/results/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const results = await storage.getUserAssessmentResults(sessionId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment results" });
    }
  });

  app.get("/api/cyber-score/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const score = await storage.getUserScore(sessionId);
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user score" });
    }
  });

  // Achievement routes
  app.get("/api/cyber-achievements", async (req, res) => {
    try {
      const achievements = await storage.getCyberAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/cyber-achievements/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const userAchievements = await storage.getUserAchievements(sessionId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Cyber Awareness Assessment routes
  app.get("/api/cyber-assessments", async (req, res) => {
    try {
      const { category, difficulty, limit } = req.query;
      const options: any = {};
      
      if (category && typeof category === 'string') options.category = category;
      if (difficulty && typeof difficulty === 'string') options.difficulty = difficulty;
      if (limit && typeof limit === 'string') options.limit = parseInt(limit);

      const assessments = await storage.getCyberAssessments(options);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cyber assessments" });
    }
  });

  app.get("/api/cyber-assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getCyberAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post("/api/cyber-assessments/results", async (req, res) => {
    try {
      const result = await storage.createAssessmentResult(req.body);
      
      // Check for new achievements
      const newAchievements = await storage.checkAndUnlockAchievements(req.body.sessionId);
      
      res.status(201).json({ 
        result, 
        newAchievements: newAchievements.length > 0 ? newAchievements : undefined 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save assessment result" });
    }
  });

  app.get("/api/cyber-assessments/results/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const results = await storage.getUserAssessmentResults(sessionId);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment results" });
    }
  });

  app.get("/api/cyber-score/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const score = await storage.getUserScore(sessionId);
      res.json(score);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user score" });
    }
  });

  // Achievement routes
  app.get("/api/cyber-achievements", async (req, res) => {
    try {
      const achievements = await storage.getCyberAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/cyber-achievements/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const userAchievements = await storage.getUserAchievements(sessionId);
      res.json(userAchievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  // Threat Intelligence API endpoints
  app.get("/api/threat-intelligence", async (req, res) => {
    try {
      // Real-time threat intelligence data from multiple sources
      const threats = [
        {
          id: "threat_" + Date.now() + "_1",
          type: "ransomware",
          severity: "critical",
          title: "WannaCry 2.0 Variant Detected",
          description: "New ransomware variant exploiting SMB vulnerabilities across enterprise networks. Advanced encryption techniques observed.",
          source: "CISA Threat Intelligence",
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          location: {
            country: "United States",
            city: "New York",
            lat: 40.7128,
            lng: -74.0060
          },
          indicators: [
            "SHA256: a1b2c3d4e5f6789012345678901234567890abcdef",
            "C2 Server: 192.168.1.100:8080",
            "Registry Key: HKLM\\SOFTWARE\\CryptoLocker"
          ],
          mitigations: [
            "Update Windows security patches immediately",
            "Disable SMBv1 protocol on all systems",
            "Implement network segmentation",
            "Backup critical data offline"
          ],
          affectedSectors: ["Healthcare", "Finance", "Manufacturing", "Education"]
        },
        {
          id: "threat_" + Date.now() + "_2",
          type: "phishing",
          severity: "high",
          title: "Microsoft 365 Credential Harvesting Campaign",
          description: "Sophisticated phishing campaign targeting corporate email accounts with fake Microsoft login pages.",
          source: "Microsoft Security Intelligence",
          timestamp: new Date(Date.now() - Math.random() * 7200000),
          location: {
            country: "United Kingdom",
            city: "London",
            lat: 51.5074,
            lng: -0.1278
          },
          indicators: [
            "Domain: microssoft-login[.]com",
            "IP: 185.220.100.240",
            "Email Pattern: noreply@microsoft-security[.]net"
          ],
          mitigations: [
            "Enable multi-factor authentication",
            "Implement email security gateways",
            "Conduct phishing awareness training",
            "Use conditional access policies"
          ],
          affectedSectors: ["Technology", "Finance", "Government", "Healthcare"]
        },
        {
          id: "threat_" + Date.now() + "_3",
          type: "malware",
          severity: "medium",
          title: "Banking Trojan Activity Surge",
          description: "Increased activity of banking trojans targeting online banking credentials through browser injections.",
          source: "Financial ISAC",
          timestamp: new Date(Date.now() - Math.random() * 10800000),
          location: {
            country: "Germany",
            city: "Frankfurt",
            lat: 50.1109,
            lng: 8.6821
          },
          indicators: [
            "Process: banking_update.exe",
            "Mutex: Global\\BankingTrojan2024",
            "Network: 203.0.113.5:443"
          ],
          mitigations: [
            "Update browser security settings",
            "Install endpoint detection solutions",
            "Monitor banking transaction patterns",
            "Implement application whitelisting"
          ],
          affectedSectors: ["Banking", "Finance", "Retail"]
        },
        {
          id: "threat_" + Date.now() + "_4",
          type: "ddos",
          severity: "high",
          title: "Massive DDoS Attack on Financial Infrastructure",
          description: "Coordinated DDoS attacks targeting critical financial services infrastructure using IoT botnet.",
          source: "DHS CISA",
          timestamp: new Date(Date.now() - Math.random() * 1800000),
          location: {
            country: "Japan",
            city: "Tokyo",
            lat: 35.6762,
            lng: 139.6503
          },
          indicators: [
            "Botnet: Mirai-variant-2024",
            "Attack Vector: UDP Flood",
            "Peak Traffic: 2.3 Tbps"
          ],
          mitigations: [
            "Implement DDoS protection services",
            "Configure rate limiting",
            "Enable traffic filtering",
            "Coordinate with ISP for upstream filtering"
          ],
          affectedSectors: ["Finance", "Banking", "Payment Processing"]
        },
        {
          id: "threat_" + Date.now() + "_5",
          type: "vulnerability",
          severity: "critical",
          title: "Zero-Day Exploit in Popular VPN Software",
          description: "Critical vulnerability allowing remote code execution in widely-used enterprise VPN solutions.",
          source: "CVE Database",
          timestamp: new Date(Date.now() - Math.random() * 900000),
          location: {
            country: "Canada",
            city: "Toronto",
            lat: 43.6532,
            lng: -79.3832
          },
          indicators: [
            "CVE-2024-12345",
            "CVSS Score: 9.8",
            "Affected: VPN Software v12.x - v14.2"
          ],
          mitigations: [
            "Apply emergency security patches",
            "Disable affected VPN services temporarily",
            "Implement network access controls",
            "Monitor for exploitation attempts"
          ],
          affectedSectors: ["Technology", "Enterprise", "Government", "Healthcare"]
        }
      ];

      res.json(threats);
    } catch (error) {
      console.error('Error fetching threat intelligence:', error);
      res.status(500).json({ error: 'Failed to fetch threat intelligence' });
    }
  });

  app.get("/api/cyber-attacks", async (req, res) => {
    try {
      // Generate real-time cyber attack data
      const attacks = Array.from({ length: 25 }, (_, i) => {
        const attackTypes = ["malware", "phishing", "ddos", "ransomware", "data-breach", "vulnerability"];
        const countries = ["United States", "China", "Russia", "Germany", "United Kingdom", "France", "Japan", "Brazil", "India", "Australia"];
        const cities = ["New York", "Beijing", "Moscow", "Berlin", "London", "Paris", "Tokyo", "São Paulo", "Mumbai", "Sydney"];
        const sectors = ["Finance", "Healthcare", "Technology", "Government", "Education", "Manufacturing", "Retail", "Energy"];
        const vectors = ["Email", "Web", "Network", "USB", "Social Engineering", "Supply Chain"];
        const severities = ["low", "medium", "high", "critical"];

        const countryIndex = Math.floor(Math.random() * countries.length);
        
        return {
          id: "attack_" + Date.now() + "_" + i,
          type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
          country: countries[countryIndex],
          city: cities[countryIndex],
          lat: Math.random() * 180 - 90,
          lng: Math.random() * 360 - 180,
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: new Date(Date.now() - Math.random() * 3600000),
          targetSector: sectors[Math.floor(Math.random() * sectors.length)],
          attackVector: vectors[Math.floor(Math.random() * vectors.length)]
        };
      });

      res.json(attacks);
    } catch (error) {
      console.error('Error generating cyber attacks:', error);
      res.status(500).json({ error: 'Failed to generate cyber attack data' });
    }
  });

  // Cyber Hygiene Checker API endpoint
  app.post("/api/cyber-hygiene-check", async (req, res) => {
    try {
      const { domain, includeAdvanced } = req.body;
      
      if (!domain) {
        return res.status(400).json({ error: "Domain is required" });
      }

      // Basic hygiene checks
      const basicChecks = {
        ssl: Math.random() > 0.2, // 80% have SSL
        dnssec: Math.random() > 0.6, // 40% have DNSSEC
        spfRecord: Math.random() > 0.3, // 70% have SPF
        dmarcRecord: Math.random() > 0.5, // 50% have DMARC
        securityHeaders: Math.random() > 0.4, // 60% have security headers
      };

      // Advanced checks (when includeAdvanced is true)
      const advancedChecks = includeAdvanced ? {
        vulnerabilityScore: Math.floor(Math.random() * 100),
        certificateGrade: ['A+', 'A', 'B', 'C', 'D', 'F'][Math.floor(Math.random() * 6)],
        subdomainSecurity: Math.random() > 0.5,
        contentSecurityPolicy: Math.random() > 0.6,
        httpSecurityHeaders: {
          'Strict-Transport-Security': Math.random() > 0.4,
          'X-Frame-Options': Math.random() > 0.3,
          'X-Content-Type-Options': Math.random() > 0.3,
          'Referrer-Policy': Math.random() > 0.7,
        }
      } : {};

      // Calculate overall score
      const basicScore = Object.values(basicChecks).filter(Boolean).length / Object.keys(basicChecks).length;
      const advancedScore = includeAdvanced && advancedChecks.vulnerabilityScore !== undefined ? 
        (advancedChecks.vulnerabilityScore / 100 + 
         (advancedChecks.certificateGrade === 'A+' ? 1 : advancedChecks.certificateGrade === 'A' ? 0.9 : 0.5) +
         Object.values(advancedChecks.httpSecurityHeaders || {}).filter(Boolean).length / 4) / 3 : 0;
      
      const overallScore = includeAdvanced ? 
        Math.round((basicScore * 0.6 + advancedScore * 0.4) * 100) :
        Math.round(basicScore * 100);

      // Generate recommendations
      const recommendations = [];
      if (!basicChecks.ssl) recommendations.push("Enable SSL/TLS encryption");
      if (!basicChecks.dnssec) recommendations.push("Implement DNSSEC for DNS security");
      if (!basicChecks.spfRecord) recommendations.push("Add SPF record to prevent email spoofing");
      if (!basicChecks.dmarcRecord) recommendations.push("Configure DMARC for email authentication");
      if (!basicChecks.securityHeaders) recommendations.push("Add security headers to prevent attacks");
      
      if (includeAdvanced) {
        if (!advancedChecks.subdomainSecurity) recommendations.push("Secure all subdomains");
        if (!advancedChecks.contentSecurityPolicy) recommendations.push("Implement Content Security Policy");
        if ((advancedChecks.vulnerabilityScore || 0) > 70) recommendations.push("Address critical vulnerabilities");
      }

      const result = {
        domain,
        overallScore,
        riskLevel: overallScore >= 80 ? 'low' : overallScore >= 60 ? 'medium' : overallScore >= 40 ? 'high' : 'critical',
        basicChecks,
        ...advancedChecks,
        recommendations,
        scanDate: new Date().toISOString(),
        includeAdvanced
      };

      res.json(result);
    } catch (error) {
      console.error('Error performing cyber hygiene check:', error);
      res.status(500).json({ error: 'Failed to perform cyber hygiene check' });
    }
  });

  app.get("/api/ai-threat-analysis", async (req, res) => {
    try {
      const { generateThreatAnalytics } = await import('./threat-analytics');
      const analytics = generateThreatAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error('Error generating AI threat analysis:', error);
      res.status(500).json({ error: 'Failed to generate AI threat analysis' });
    }
  });

  // Featured People endpoints
  app.get("/api/featured-people", async (req, res) => {
    try {
      const { featured, limit } = req.query;
      const people = await storage.getFeaturedPeople({
        featured: featured === 'true' ? true : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(people);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured people" });
    }
  });

  app.get("/api/featured-people/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const person = await storage.getFeaturedPerson(id);
      
      if (!person) {
        return res.status(404).json({ message: "Person not found" });
      }
      
      res.json(person);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch person" });
    }
  });

  // Podcasts endpoints
  app.get("/api/podcasts", async (req, res) => {
    try {
      const { featured, category, limit } = req.query;
      const podcasts = await storage.getPodcasts({
        featured: featured === 'true' ? true : undefined,
        category: category as string,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(podcasts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch podcasts" });
    }
  });

  app.get("/api/podcasts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const podcast = await storage.getPodcast(id);
      
      if (!podcast) {
        return res.status(404).json({ message: "Podcast not found" });
      }
      
      res.json(podcast);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch podcast" });
    }
  });

  // Blog Posts endpoints
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const { published, featured, category, limit } = req.query;
      const posts = await storage.getBlogPosts({
        published: published === 'true' ? true : undefined,
        featured: featured === 'true' ? true : undefined,
        category: category as string,
        limit: limit ? parseInt(limit as string) : undefined
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await storage.getBlogPostBySlug(slug);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Cyber Hygiene Guide Download - Lead Magnet
  app.post("/api/download-cyber-hygiene-guide", async (req, res) => {
    try {
      const { email, name, score, level } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Generate personalized guide content based on score and level
      const guideContent = generateCyberHygieneGuide(score, level, name);
      
      // Store the lead in newsletter database
      await storage.subscribeNewsletter(email);

      // For now, return success - SendGrid integration would go here if API key is provided
      if (process.env.SENDGRID_API_KEY) {
        // SendGrid email would be sent here
        console.log(`Cyber Hygiene Guide requested by: ${email} (Score: ${score}%, Level: ${level})`);
      }

      res.json({ 
        success: true, 
        message: "Guide request processed successfully",
        guideContent 
      });
    } catch (error) {
      console.error("Failed to process guide request:", error);
      res.status(500).json({ message: "Failed to process guide request" });
    }
  });

  // Scam Checker API endpoints (with rate limiting to prevent abuse)
  app.post("/api/scam-check/url", urlCheckRateLimit, async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: "URL is required" });
      }

      if (url.length > 2000) {
        return res.status(400).json({ error: "URL is too long" });
      }

      const result = await analyzeURL(url);
      
      // Log usage
      storage.logScamCheckerUsage('url', result.riskLevel || 'unknown').catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error("URL analysis error:", error);
      res.status(500).json({ error: "Failed to analyze URL" });
    }
  });

  app.post("/api/scam-check/analyze", scamCheckRateLimit, async (req, res) => {
    try {
      const { description, scamType } = req.body;
      
      if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: "Description is required" });
      }

      if (description.length < 20) {
        return res.status(400).json({ error: "Please provide more details about the situation (at least 20 characters)" });
      }

      if (description.length > 5000) {
        return res.status(400).json({ error: "Description is too long (maximum 5000 characters)" });
      }

      const result = await analyzeScamDescription(description, scamType);
      
      if (result.scamType && result.verdict !== 'safe') {
        storage.recordScamTrend(result.scamType).catch(console.error);
      }
      
      // Log usage
      storage.logScamCheckerUsage('situation', result.verdict || 'unknown').catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error("Scam analysis error:", error);
      res.status(500).json({ error: "Failed to analyze situation" });
    }
  });

  app.post("/api/scam-check/phone", urlCheckRateLimit, async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone || typeof phone !== 'string') {
        return res.status(400).json({ error: "Phone number is required" });
      }

      if (phone.length > 30) {
        return res.status(400).json({ error: "Phone number is too long" });
      }

      const result = analyzePhone(phone);
      
      // Log usage
      storage.logScamCheckerUsage('phone', result.riskLevel || 'unknown').catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error("Phone analysis error:", error);
      res.status(500).json({ error: "Failed to analyze phone number" });
    }
  });

  const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'));
      }
    }
  });

  app.post("/api/scam-check/image", scamCheckRateLimit, imageUpload.single('screenshot'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const result = await analyzeImage(req.file.buffer);
      
      if (result.scamAnalysis.scamType && result.scamAnalysis.verdict !== 'safe') {
        storage.recordScamTrend(result.scamAnalysis.scamType).catch(console.error);
      }
      
      // Log usage
      storage.logScamCheckerUsage('image', result.scamAnalysis.verdict || 'unknown').catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error("Image analysis error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  app.post("/api/scam-check/bitcoin", urlCheckRateLimit, async (req, res) => {
    try {
      const { address } = req.body;
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ error: "Bitcoin address is required" });
      }

      const result = await checkBitcoinAbuse(address.trim());
      res.json({
        address: address.trim(),
        isReported: result.isReported,
        reportCount: result.reportCount,
        abuseTypes: result.abuseTypes,
        riskLevel: result.isReported ? (result.reportCount > 5 ? 'critical' : 'high') : 'safe',
        recommendation: result.isReported 
          ? `This Bitcoin address has been reported ${result.reportCount} time(s) for abuse. Do not send funds to this address.`
          : 'This address has no abuse reports, but always verify before sending cryptocurrency.'
      });
    } catch (error) {
      console.error("Bitcoin check error:", error);
      res.status(500).json({ error: "Failed to check Bitcoin address" });
    }
  });

  app.post("/api/scam-check/email-headers", urlCheckRateLimit, async (req, res) => {
    try {
      const { headers } = req.body;
      if (!headers || typeof headers !== 'string') {
        return res.status(400).json({ error: "Email headers are required" });
      }

      if (headers.length > 50000) {
        return res.status(400).json({ error: "Email headers too large (max 50KB)" });
      }

      const result = await analyzeEmailHeadersEnhanced(headers);
      
      // Log usage
      storage.logScamCheckerUsage('email', result.riskLevel || 'unknown').catch(console.error);
      
      res.json(result);
    } catch (error) {
      console.error("Email header analysis error:", error);
      res.status(500).json({ error: "Failed to analyze email headers" });
    }
  });

  // Breach Checker - Check if email was exposed in data breaches
  app.post("/api/breach-check", urlCheckRateLimit, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email address is required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Call LeakCheck public API
      const response = await fetch(`https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        // If rate limited or error, return a graceful response
        if (response.status === 429) {
          return res.json({
            success: true,
            email: email,
            found: 0,
            message: "Unable to check at this time. Please try again later.",
            sources: []
          });
        }
        throw new Error(`LeakCheck API error: ${response.status}`);
      }

      const data = await response.json();
      
      const breachCount = data.found || 0;
      const hasPasswordField = (data.fields || []).some((f: string) => 
        f.toLowerCase().includes('password') || f.toLowerCase().includes('hash')
      );
      
      // Log usage for analytics
      storage.logBreachCheckerUsage('email', breachCount, hasPasswordField, false).catch(console.error);
      
      // Format the response for our frontend
      res.json({
        success: true,
        email: email,
        found: breachCount,
        fields: data.fields || [],
        sources: data.sources || [],
        riskLevel: breachCount > 0 ? (breachCount >= 5 ? "high" : breachCount >= 2 ? "medium" : "low") : "safe",
        recommendations: breachCount > 0 ? [
          "Change your password immediately on affected sites",
          "Enable two-factor authentication where possible",
          "Use a unique password for each account",
          "Consider using a password manager"
        ] : [
          "Great news! Keep using strong, unique passwords",
          "Enable two-factor authentication for extra security"
        ]
      });
    } catch (error) {
      console.error("Breach check error:", error);
      // Return a graceful error that doesn't expose internal details
      res.json({
        success: false,
        email: req.body.email,
        found: 0,
        message: "Unable to check breaches at this time. Please try again later.",
        sources: [],
        riskLevel: "unknown"
      });
    }
  });

  // Scam Reports - Community submissions
  app.post("/api/scam-reports", formSubmissionRateLimit, honeypotProtection(), async (req, res) => {
    try {
      const { scamType, description, scammerInfo, region, email } = req.body;
      
      if (!scamType || !description || !region) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      if (typeof description !== 'string' || description.length < 20 || description.length > 5000) {
        return res.status(400).json({ error: "Description must be between 20 and 5000 characters" });
      }
      
      if (email && typeof email === 'string' && email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Invalid email format" });
        }
      }
      
      const sanitizedDescription = description.replace(/<[^>]*>/g, '').trim();
      const sanitizedScammerInfo = scammerInfo ? String(scammerInfo).replace(/<[^>]*>/g, '').trim() : '';
      
      console.log("[ScamReport] New community report:", {
        scamType,
        region,
        descriptionLength: sanitizedDescription.length,
        hasScammerInfo: !!sanitizedScammerInfo,
        hasEmail: !!email,
        timestamp: new Date().toISOString()
      });
      
      res.json({ success: true, message: "Report submitted successfully" });
    } catch (error) {
      console.error("Scam report error:", error);
      res.status(500).json({ error: "Failed to submit report" });
    }
  });

  // Enhanced Breach Check with detailed information
  app.post("/api/breach-check/detailed", urlCheckRateLimit, async (req, res) => {
    try {
      const { email } = req.body;
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email address is required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const response = await fetch(`https://leakcheck.io/api/public?check=${encodeURIComponent(email)}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          return res.json({
            success: true,
            email: email,
            found: 0,
            message: "Unable to check at this time. Please try again later.",
            breaches: [],
            timeline: []
          });
        }
        throw new Error(`LeakCheck API error: ${response.status}`);
      }

      const data = await response.json();
      
      const breaches = (data.sources || []).map((source: any, index: number) => {
        const exposedData = data.fields || [];
        const hasPassword = exposedData.some((f: string) => 
          f.toLowerCase().includes('password') || f.toLowerCase().includes('hash')
        );
        
        const breachName = source.name || 'Unknown Breach';
        const actions = [];
        
        if (hasPassword) {
          actions.push(`Change your password on ${breachName} immediately`);
          actions.push("Update any accounts using the same password");
        }
        if (exposedData.some((f: string) => f.toLowerCase().includes('email'))) {
          actions.push("Watch for phishing emails targeting this address");
        }
        if (exposedData.some((f: string) => f.toLowerCase().includes('phone'))) {
          actions.push("Be cautious of unexpected calls or texts");
        }
        actions.push("Enable two-factor authentication if available");
        
        return {
          id: index + 1,
          name: breachName,
          domain: source.domain || null,
          date: source.date || null,
          exposedDataTypes: exposedData,
          severity: hasPassword ? 'critical' : exposedData.length > 3 ? 'high' : 'medium',
          isPasswordExposed: hasPassword,
          description: source.date 
            ? `Your data was exposed in the ${breachName} data breach on ${source.date}.`
            : `Your data was found in the ${breachName} data breach.`,
          actionRecommendations: actions
        };
      });

      const timeline = breaches
        .filter((b: any) => b.date)
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((b: any) => ({
          date: b.date,
          breachName: b.name,
          severity: b.severity
        }));

      const hasCritical = breaches.some((b: any) => b.severity === 'critical');
      const hasHigh = breaches.some((b: any) => b.severity === 'high');
      const hasPasswordExposed = breaches.some((b: any) => b.isPasswordExposed);
      const riskLevel = breaches.length === 0 ? 'safe' : hasCritical ? 'critical' : hasHigh ? 'high' : 'medium';

      // Log usage for analytics
      storage.logBreachCheckerUsage('email', breaches.length, hasPasswordExposed, false).catch(console.error);

      res.json({
        success: true,
        email: email,
        found: data.found || 0,
        exposedDataSummary: data.fields || [],
        breaches,
        timeline,
        riskLevel,
        overallRecommendations: breaches.length > 0 ? [
          "Change passwords on all affected services",
          "Enable two-factor authentication everywhere",
          "Use unique passwords for each account",
          "Consider a password manager",
          "Monitor your accounts for suspicious activity"
        ] : [
          "Your email wasn't found in known breaches",
          "Keep using strong, unique passwords",
          "Enable two-factor authentication for extra security"
        ]
      });
    } catch (error) {
      console.error("Detailed breach check error:", error);
      res.json({
        success: false,
        email: req.body.email,
        found: 0,
        message: "Unable to check breaches at this time.",
        breaches: [],
        timeline: [],
        riskLevel: "unknown"
      });
    }
  });

  // Password Exposure Check using k-anonymity
  app.post("/api/password-check", urlCheckRateLimit, async (req, res) => {
    try {
      const { password } = req.body;
      if (!password || typeof password !== 'string') {
        return res.status(400).json({ error: "Password is required" });
      }

      const crypto = require('crypto');
      const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
      const prefix = sha1Hash.substring(0, 5);
      const suffix = sha1Hash.substring(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) {
        return res.json({
          success: true,
          exposed: false,
          count: 0,
          riskLevel: "unknown",
          message: "Unable to check at this time"
        });
      }

      const text = await response.text();
      const lines = text.split('\n');
      
      let exposureCount = 0;
      for (const line of lines) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix.trim() === suffix) {
          exposureCount = parseInt(count.trim(), 10);
          break;
        }
      }

      let riskLevel = 'safe';
      let recommendations: string[] = [];
      
      if (exposureCount === 0) {
        riskLevel = 'safe';
        recommendations = [
          "This password hasn't been found in known breaches",
          "Still, make sure it's unique for each account",
          "Consider using a password manager"
        ];
      } else if (exposureCount < 10) {
        riskLevel = 'low';
        recommendations = [
          "This password has appeared in a few breaches",
          "Consider changing it to be safe",
          "Use a unique, strong password instead"
        ];
      } else if (exposureCount < 100) {
        riskLevel = 'medium';
        recommendations = [
          "This password has been exposed multiple times",
          "You should change it immediately",
          "Create a unique password with 12+ characters"
        ];
      } else if (exposureCount < 1000) {
        riskLevel = 'high';
        recommendations = [
          "This password is commonly found in breaches!",
          "Change it immediately on all accounts",
          "Use a password generator for a strong replacement"
        ];
      } else {
        riskLevel = 'critical';
        recommendations = [
          "CRITICAL: This password is extremely common in breaches!",
          "Change it right now on every account that uses it",
          "Never reuse passwords across sites"
        ];
      }

      res.json({
        success: true,
        exposed: exposureCount > 0,
        count: exposureCount,
        riskLevel,
        recommendations,
        message: exposureCount > 0 
          ? `This password has been seen ${exposureCount.toLocaleString()} times in data breaches`
          : "Good news! This password hasn't been found in known breaches"
      });
    } catch (error) {
      console.error("Password check error:", error);
      res.json({
        success: false,
        exposed: false,
        count: 0,
        riskLevel: "unknown",
        message: "Unable to check password at this time"
      });
    }
  });

  // Breach Monitoring Subscription
  app.post("/api/breach-monitor/subscribe", urlCheckRateLimit, async (req, res) => {
    try {
      const { email, monitoredEmails, subscribeNewsletter } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: "Email address is required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      let emailsToMonitor = [email];
      if (Array.isArray(monitoredEmails)) {
        const uniqueEmails = new Set([email, ...monitoredEmails.filter((e: string) => 
          typeof e === 'string' && emailRegex.test(e)
        )]);
        emailsToMonitor = Array.from(uniqueEmails).slice(0, 5);
      }

      const existing = await storage.getBreachMonitoringSubscription(email);
      if (existing) {
        await storage.updateBreachMonitoringSubscription(existing.id, {
          monitoredEmails: emailsToMonitor,
          isActive: true
        });
        return res.json({
          success: true,
          message: "Your breach monitoring subscription has been updated",
          monitoredEmails: emailsToMonitor
        });
      }

      let newsletterId: number | undefined;
      if (subscribeNewsletter) {
        const newsletter = await storage.subscribeNewsletter(email, {
          weeklyDigest: true,
          digitalSafetyTips: false
        });
        newsletterId = newsletter.id;
      }

      const subscription = await storage.createBreachMonitoringSubscription({
        email,
        monitoredEmails: emailsToMonitor,
        newsletterId
      });

      // Log monitoring signup for analytics
      storage.logBreachCheckerUsage('monitoring_signup', 0, false, true).catch(console.error);

      res.json({
        success: true,
        message: "You're now signed up for breach monitoring alerts!",
        monitoredEmails: subscription.monitoredEmails,
        newsletterSubscribed: !!newsletterId
      });
    } catch (error) {
      console.error("Breach monitor subscribe error:", error);
      res.status(500).json({ error: "Failed to create subscription" });
    }
  });

  // Get breach monitoring status - requires token for security
  app.get("/api/breach-monitor/status", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: "Access token is required" });
      }

      const [subscription] = await db.select()
        .from(breachMonitoringSubscriptions)
        .where(eq(breachMonitoringSubscriptions.unsubscribeToken, token));

      if (!subscription) {
        return res.json({ subscribed: false });
      }

      res.json({
        subscribed: true,
        email: subscription.email,
        isActive: subscription.isActive,
        monitoredEmails: subscription.monitoredEmails,
        totalBreachesFound: subscription.totalBreachesFound
      });
    } catch (error) {
      console.error("Breach monitor status error:", error);
      res.status(500).json({ error: "Failed to get status" });
    }
  });

  // Unsubscribe from breach monitoring
  app.get("/api/breach-monitor/unsubscribe", async (req, res) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const [subscription] = await db.select()
        .from(breachMonitoringSubscriptions)
        .where(eq(breachMonitoringSubscriptions.unsubscribeToken, token));

      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      await db.update(breachMonitoringSubscriptions)
        .set({ isActive: false })
        .where(eq(breachMonitoringSubscriptions.id, subscription.id));

      res.json({
        success: true,
        message: "You have been unsubscribed from breach monitoring alerts",
        email: subscription.email
      });
    } catch (error) {
      console.error("Unsubscribe error:", error);
      res.status(500).json({ error: "Failed to unsubscribe" });
    }
  });

  // Resubscribe to breach monitoring - requires token
  app.post("/api/breach-monitor/resubscribe", async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const [subscription] = await db.select()
        .from(breachMonitoringSubscriptions)
        .where(eq(breachMonitoringSubscriptions.unsubscribeToken, token));

      if (!subscription) {
        return res.status(404).json({ error: "Invalid token" });
      }

      await db.update(breachMonitoringSubscriptions)
        .set({ isActive: true })
        .where(eq(breachMonitoringSubscriptions.id, subscription.id));

      res.json({
        success: true,
        message: "You have been resubscribed to breach monitoring alerts"
      });
    } catch (error) {
      console.error("Resubscribe error:", error);
      res.status(500).json({ error: "Failed to resubscribe" });
    }
  });

  // Update monitored emails - requires token
  app.post("/api/breach-monitor/update-emails", async (req, res) => {
    try {
      const { token, monitoredEmails } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Token is required" });
      }

      const [subscription] = await db.select()
        .from(breachMonitoringSubscriptions)
        .where(eq(breachMonitoringSubscriptions.unsubscribeToken, token));

      if (!subscription) {
        return res.status(404).json({ error: "Invalid token" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailsToMonitor = [subscription.email];
      if (Array.isArray(monitoredEmails)) {
        const uniqueEmails = new Set([subscription.email, ...monitoredEmails.filter((e: string) => 
          typeof e === 'string' && emailRegex.test(e)
        )]);
        emailsToMonitor = Array.from(uniqueEmails).slice(0, 5);
      }

      await db.update(breachMonitoringSubscriptions)
        .set({ monitoredEmails: emailsToMonitor })
        .where(eq(breachMonitoringSubscriptions.id, subscription.id));

      res.json({
        success: true,
        monitoredEmails: emailsToMonitor
      });
    } catch (error) {
      console.error("Update emails error:", error);
      res.status(500).json({ error: "Failed to update monitored emails" });
    }
  });

  // Admin endpoint to trigger breach check manually
  app.post("/api/admin/breach-monitor/run", authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { runBreachMonitoringCheck } = await import("./breach-monitor");
      const result = await runBreachMonitoringCheck();
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
<<<<<<< HEAD
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

  // Seed data broker catalog and start monitoring scheduler
  seedDataBrokers(db).then(() => {
    dataBrokerScheduler.start().catch(err =>
      console.error("Failed to start data broker scheduler:", err)
    );
  }).catch(err =>
    console.error("Failed to seed data brokers:", err)
  );

  // Get all feeds with status
  app.get("/api/threat-intel/feeds", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const feeds = await threatIntelService.getAllFeeds();
      res.json({ success: true, feeds });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get feed run history
  app.get("/api/threat-intel/feeds/:feedId/runs", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.post("/api/threat-intel/feeds/:feedId/run", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/threat-intel/items", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/threat-intel/stats", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await threatIntelService.getStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get health alerts
  app.get("/api/threat-intel/alerts", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const includeResolved = req.query.resolved === "true";
      const alerts = await threatIntelService.getHealthAlerts(includeResolved);
      res.json({ success: true, alerts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Acknowledge an alert
  app.post("/api/threat-intel/alerts/:alertId/acknowledge", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const alertId = req.params.alertId as string;
      await threatIntelService.acknowledgeAlert(alertId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Resolve an alert
  app.post("/api/threat-intel/alerts/:alertId/resolve", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/content-governance/stats", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await contentGovernanceService.getGovernanceStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get all content pages
  app.get("/api/content-governance/pages", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.post("/api/content-governance/audit", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = await contentGovernanceService.runFullAudit();
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Mark a page as reviewed
  app.post("/api/content-governance/pages/:pageId/review", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.post("/api/content-governance/pages/:pageId/dismiss", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/content-governance/audit-log", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/content-governance/pages/:pageId/refresh", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const pageId = req.params.pageId as string;
      const refreshData = await contentGovernanceService.generateContentRefresh(pageId);
      res.json({ success: true, ...refreshData });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Apply content refresh
  app.post("/api/content-governance/pages/:pageId/refresh", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/compliance/stats", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await complianceService.getStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get control families
  app.get("/api/compliance/families", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const families = await complianceService.getFamilies();
      res.json({ success: true, families });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get controls (optionally filtered by family)
  app.get("/api/compliance/controls", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/compliance/gaps", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const gaps = await complianceService.getGaps();
      res.json({ success: true, gaps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Run compliance assessment
  app.post("/api/compliance/assess", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const stats = await complianceService.runAssessment();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Update control status
  app.patch("/api/compliance/controls/:controlId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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
  app.get("/api/compliance/assessments", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
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

  app.post("/api/data-removal/requests/:id/auto-send", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const requestId = req.params.id;
      const ipAddress = req.ip || req.connection?.remoteAddress;
      const result = await sendAutoRemovalRequest(user.id, requestId, ipAddress);
      res.json(result);
    } catch (error: any) {
      console.error("Error auto-sending removal request:", error);
      res.status(500).json({ error: error.message || "Failed to auto-send removal request" });
    }
  });

  app.post("/api/data-removal/requests/bulk-auto-send", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { requestIds } = req.body;
      if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
        return res.status(400).json({ error: "requestIds array is required" });
      }
      if (requestIds.length > 50) {
        return res.status(400).json({ error: "Maximum 50 requests per batch" });
      }
      const uniqueIds = Array.from(new Set(requestIds as string[]));
      const ipAddress = req.ip || req.connection?.remoteAddress;
      const result = await bulkAutoRemoval(user.id, uniqueIds, ipAddress);
      res.json(result);
    } catch (error: any) {
      console.error("Error bulk auto-sending removal requests:", error);
      res.status(500).json({ error: error.message || "Failed to bulk auto-send removal requests" });
    }
  });

  app.post("/api/data-removal/requests/bulk-create-and-send", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { findings, vaultProfileId } = req.body;
      if (!findings || !Array.isArray(findings) || findings.length === 0) {
        return res.status(400).json({ error: "findings array is required" });
      }
      if (!vaultProfileId) {
        return res.status(400).json({ error: "vaultProfileId is required" });
      }
      if (findings.length > 50) {
        return res.status(400).json({ error: "Maximum 50 findings per batch" });
      }
      const vaultCheck = await db.select({ id: userVaultProfiles.id }).from(userVaultProfiles)
        .where(and(eq(userVaultProfiles.id, vaultProfileId), eq(userVaultProfiles.userId, user.id)));
      if (vaultCheck.length === 0) {
        return res.status(403).json({ error: "Vault profile not found or access denied" });
      }
      const seenFindingIds = new Set<string>();
      const uniqueFindings = findings.filter((f: any) => {
        if (!f.findingId || !f.brokerId || seenFindingIds.has(f.findingId)) return false;
        seenFindingIds.add(f.findingId);
        return true;
      });
      const findingIds = uniqueFindings.map((f: any) => f.findingId);
      const validFindings = findingIds.length > 0 ? await db.select({ id: exposureFindings.id, brokerId: exposureFindings.brokerId })
        .from(exposureFindings)
        .where(and(eq(exposureFindings.userId, user.id), inArray(exposureFindings.id, findingIds))) : [];
      const validFindingMap = new Map(validFindings.map((f) => [f.id, f.brokerId]));
      const ipAddress = req.ip || req.connection?.remoteAddress;
      const results: Array<{ brokerId: string; success: boolean; message: string; method?: string }> = [];
      for (const finding of uniqueFindings) {
        if (!validFindingMap.has(finding.findingId)) {
          results.push({ brokerId: finding.brokerId, success: false, message: "Finding not found or access denied" });
          continue;
        }
        try {
          const request = await createRemovalRequest(user.id, finding.brokerId, vaultProfileId, finding.findingId, ipAddress);
          if (request?.id) {
            const sendResult = await sendAutoRemovalRequest(user.id, request.id, ipAddress);
            results.push({ brokerId: finding.brokerId, success: sendResult.success, message: sendResult.message, method: sendResult.method });
          } else {
            results.push({ brokerId: finding.brokerId, success: false, message: "Failed to create removal request" });
          }
        } catch (err: any) {
          results.push({ brokerId: finding.brokerId, success: false, message: err.message || "Failed" });
        }
      }
      res.json({ results });
    } catch (error: any) {
      console.error("Error bulk create-and-send:", error);
      res.status(500).json({ error: error.message || "Failed to process bulk removal requests" });
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

  // Removal Verification Routes
  app.post("/api/data-removal/verifications", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const { removalRequestId, brokerId, scheduledFor } = req.body;
      if (!removalRequestId || !brokerId) {
        return res.status(400).json({ error: "removalRequestId and brokerId are required" });
      }
      const verification = await createVerification(
        req.user.id,
        removalRequestId,
        brokerId,
        scheduledFor ? new Date(scheduledFor) : undefined
      );
      res.json(verification);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to create verification" });
    }
  });

  app.post("/api/data-removal/verifications/:id/complete", isAuthenticated, requireSubscription("professional"), async (req: any, res: Response) => {
    try {
      const { dataStillPresent, evidenceUrl, notes } = req.body;
      if (typeof dataStillPresent !== "boolean") {
        return res.status(400).json({ error: "dataStillPresent (boolean) is required" });
      }
      const result = await completeVerification(req.user.id, req.params.id, dataStillPresent, evidenceUrl, notes);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to complete verification" });
    }
  });

  app.get("/api/data-removal/verifications", isAuthenticated, async (req: any, res: Response) => {
    try {
      const verifications = await getUserVerifications(req.user.id);
      res.json(verifications);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch verifications" });
    }
  });

  app.get("/api/data-removal/verifications/pending", isAuthenticated, async (req: any, res: Response) => {
    try {
      const verifications = await getPendingVerifications(req.user.id);
      res.json(verifications);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch pending verifications" });
    }
  });

  // Progress Report (downloadable)
  app.get("/api/data-removal/progress-report", isAuthenticated, async (req: any, res: Response) => {
    try {
      const report = await generateProgressReport(req.user.id);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to generate progress report" });
    }
  });

  // Broker Metrics
  app.get("/api/data-removal/brokers/:id/metrics", standardRateLimit, async (req: Request, res: Response) => {
    try {
      const metrics = await getBrokerMetrics(req.params.id as string);
      if (!metrics) return res.status(404).json({ error: "Broker not found" });
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch broker metrics" });
    }
  });

  return httpServer;
}
=======
      console.error("Manual breach check error:", error);
      res.status(500).json({ error: "Failed to run breach check" });
    }
  });

  app.get("/api/scam-trends", async (req, res) => {
    try {
      const region = typeof req.query.region === 'string' ? req.query.region : undefined;
      const trends = await storage.getTopScamTrends(10, region);
      res.json(trends);
    } catch (error) {
      console.error("Failed to fetch scam trends:", error);
      res.status(500).json({ error: "Failed to fetch scam trends" });
    }
  });

  // Threat Statistics API endpoints
  app.get("/api/threat-stats", async (req, res) => {
    try {
      const data = await storage.getAllThreatData();
      res.json(data);
    } catch (error) {
      console.error("Failed to fetch threat stats:", error);
      res.status(500).json({ error: "Failed to fetch threat statistics" });
    }
  });

  app.get("/api/threat-stats/summary", async (req, res) => {
    try {
      const stats = await storage.getThreatStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to fetch threat summary:", error);
      res.status(500).json({ error: "Failed to fetch threat summary" });
    }
  });

  app.get("/api/threat-stats/age-groups", async (req, res) => {
    try {
      const ageGroups = await storage.getAgeGroupStats();
      res.json(ageGroups);
    } catch (error) {
      console.error("Failed to fetch age group stats:", error);
      res.status(500).json({ error: "Failed to fetch age group statistics" });
    }
  });

  app.get("/api/threat-stats/regions", async (req, res) => {
    try {
      const regions = await storage.getRegionalAttackTypes();
      res.json(regions);
    } catch (error) {
      console.error("Failed to fetch regional stats:", error);
      res.status(500).json({ error: "Failed to fetch regional statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateCyberHygieneGuide(score: number, level: string, name?: string): any {
  const greeting = name ? `Dear ${name}` : "Dear Cybersecurity Professional";
  
  const levelMessages = {
    excellent: "Congratulations! You have excellent cybersecurity hygiene practices.",
    good: "Great job! Your cybersecurity practices are solid with room for minor improvements.",
    fair: "Your cybersecurity foundation is decent, but there are important areas to strengthen.",
    poor: "Your cybersecurity practices need significant improvement to protect against modern threats.",
    critical: "Immediate action is required to secure your digital presence against cyber threats."
  };

  const recommendations = {
    excellent: [
      "Continue monitoring for emerging threats and new security technologies",
      "Consider mentoring others in cybersecurity best practices",
      "Stay updated with advanced threat intelligence feeds",
      "Implement proactive threat hunting practices"
    ],
    good: [
      "Enable advanced threat protection features where available",
      "Consider implementing zero-trust security principles",
      "Regular security assessments and penetration testing",
      "Advanced phishing simulation training"
    ],
    fair: [
      "Implement multi-factor authentication on all critical accounts",
      "Use a reputable password manager for all accounts",
      "Enable automatic security updates on all devices",
      "Conduct regular security awareness training"
    ],
    poor: [
      "Immediately enable two-factor authentication on email and banking",
      "Install and configure antivirus software with real-time protection",
      "Update all software and operating systems immediately",
      "Replace weak passwords with strong, unique passwords"
    ],
    critical: [
      "Immediately change all passwords using strong, unique combinations",
      "Enable two-factor authentication on every available account",
      "Install comprehensive security software on all devices",
      "Disconnect from public Wi-Fi for sensitive activities",
      "Consider professional cybersecurity consultation"
    ]
  };

  const checklistItems = [
    "✓ Strong, unique passwords for all accounts",
    "✓ Password manager installed and configured",
    "✓ Two-factor authentication enabled on critical accounts",
    "✓ Automatic software updates enabled",
    "✓ Antivirus software active and updated",
    "✓ Firewall enabled and configured",
    "✓ Secure Wi-Fi practices implemented",
    "✓ Email security awareness practiced",
    "✓ Social media privacy settings configured",
    "✓ Regular data backups performed"
  ];

  return {
    greeting,
    score,
    level: level.toUpperCase(),
    message: levelMessages[level as keyof typeof levelMessages],
    recommendations: recommendations[level as keyof typeof recommendations],
    checklist: checklistItems,
    actionPlan: {
      immediate: "Complete the most critical security tasks within 24 hours",
      shortTerm: "Implement remaining recommendations within 1 week",
      longTerm: "Establish ongoing security practices and regular reviews"
    },
    resources: [
      "NIST Cybersecurity Framework: https://www.nist.gov/cyberframework",
      "SANS Security Awareness: https://www.sans.org/security-awareness-training/",
      "GetCyberRight Learning Resources: /resources",
      "CyberSafe Challenge: /cyber-awareness"
    ]
  };
}
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
