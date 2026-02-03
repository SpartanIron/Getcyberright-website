import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactMessageSchema, insertNewsletterSubscriberSchema, insertScamReportSchema, SUBSCRIPTION_TIERS, hasTierAccess, users, scamReports, userProgress, userBadges, badgeDefinitions, familyCodewords, audioAnalysisHistory } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createRateLimitMiddleware, securityLogger } from "./security";
import { registerAuthRoutes, isAuthenticated } from "./auth";
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
import {
  scanConversation,
  getEmergencyResources,
  getAllEmergencyResources,
  FREE_SAFETY_TOOLS
} from "./childSafety";

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

  return httpServer;
}
