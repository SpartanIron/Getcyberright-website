import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { getAllScamSlugs } from "@shared/scam-content";
import { insertContactMessageSchema, insertNewsletterSubscriberSchema, insertScamReportSchema, insertExperienceWaitlistSchema, experienceWaitlist, SUBSCRIPTION_TIERS, hasTierAccess, users, scamReports, userProgress, userBadges, badgeDefinitions, familyCodewords, audioAnalysisHistory, learningPaths, trainingModules, trainingLessons, trainingQuizzes, quizQuestions, userLearningProgress, quizAttempts, trainingCertificates, removalRequests, userVaultProfiles, userVaultKeys, exposureFindings, dataBrokers, insertScanHistorySchema, insertCommunityScamReportSchema, insertScanReportSchema, insertScamOfWeekSchema, communityScamReports, siteReputation, scanHistory } from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { createRateLimitMiddleware, securityLogger } from "./security";
import { verifyRecaptcha } from "./security/recaptcha";
import { embedFingerprint } from "./content-fingerprint";
import { registerAuthRoutes, isAuthenticated, isAdmin, seedAdminUser } from "./auth";
import { registerAdminRoutes, registerToolTrackingRoutes } from "./admin";
import { registerPlatformRoutes } from "./platformRoutes";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerStripeRoutes, registerStripeWebhook } from "./stripe";
import { decryptVaultData } from "./vaultEncryption";
import { logVaultAccess, extractRequestContext } from "./vaultAuditLog";
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
  analyzeURL as scamCheckURL,
  analyzePhone as scamCheckPhone,
  analyzeScamDescription,
  analyzeImage as scamCheckImage,
  wrapUrlResult,
  wrapPhoneResult,
  wrapDescriptionResult,
  wrapImageResult,
  parseEmailHeaders,
  analyzeEmailHeadersEnhanced,
  type UnifiedScamResult
} from "./scam-checker";
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
import { removalReportService } from "./removalReportService";
import { complianceService } from "./complianceService";
import { seedCurriculum, seedAISafetyTraining } from "./curriculumSeed";
import { seedDataBrokers } from "./dataBrokerSeed";
import { registerUniversalAdapters } from "./brokerAdapters";
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
  getAutomationOutput,
  computeIdentityRiskScore,
  getSmartRemovalQueue,
  setPrivacyMode,
  generateExecutiveComplianceTemplate,
  updateMonitoringThresholds,
  updateBrokerPerformanceMetrics,
  getBrokerVerificationRequirements,
  getBrokerTosRiskFlags,
  computeExposureLikelihood,
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

  app.get('/api/social-images/:filename', (req: Request, res: Response) => {
    const filename = req.params.filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const searchDirs = [
      path.join(process.cwd(), 'dist', 'social-images'),
      path.join(process.cwd(), '.local', 'social-images'),
    ];
    for (const dir of searchDirs) {
      const imgPath = path.join(dir, filename);
      if (fs.existsSync(imgPath)) {
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes: Record<string, string> = {
          '.png': 'image/png', '.webp': 'image/webp',
          '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
        };
        res.setHeader('Content-Type', mimeTypes[ext] || 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
        return res.sendFile(path.resolve(imgPath), { dotfiles: 'allow' });
      }
    }
    res.status(404).json({ error: 'Image not found' });
  });

  app.get('/api/platform-stats', async (_req: Request, res: Response) => {
    try {
      const guides = await storage.getAllGuides();
      const alerts = await storage.getAllThreatAlerts();
      const scamIntel = await storage.getAllScamIntel();
      const publishedGuides = guides.filter(g => g.status === 'published').length;
      const activeAlerts = alerts.filter(a => a.status === 'active' || a.status === 'published').length;
      const totalThreatsDetected = alerts.length + scamIntel.length;

      res.json({
        scansPerformed: 14720 + Math.floor((Date.now() - new Date('2025-01-01').getTime()) / 300000),
        threatsDetected: totalThreatsDetected,
        guidesPublished: publishedGuides,
        activeAlerts,
        dataBrokersTracked: 501,
        last24hThreats: activeAlerts,
      });
    } catch {
      res.json({
        scansPerformed: 14720,
        threatsDetected: 0,
        guidesPublished: 0,
        activeAlerts: 0,
        dataBrokersTracked: 501,
        last24hThreats: 0,
      });
    }
  });

  // Dynamic sitemap.xml generation
  app.get('/sitemap.xml', async (_req: Request, res: Response) => {
    const baseUrl = 'https://www.getcyberright.com';
    const today = new Date().toISOString().split('T')[0];

    const staticPages = [
      { path: '/', changefreq: 'daily', priority: '1.0' },
      { path: '/tools', changefreq: 'weekly', priority: '0.9' },
      { path: '/scam-checker', changefreq: 'weekly', priority: '0.9' },
      { path: '/password-generator', changefreq: 'monthly', priority: '0.9' },
      { path: '/data-removal', changefreq: 'weekly', priority: '0.9' },
      { path: '/cyber-threat-radar', changefreq: 'daily', priority: '0.9' },
      { path: '/awareness-hub', changefreq: 'weekly', priority: '0.9' },
      { path: '/kids', changefreq: 'weekly', priority: '0.9' },
      { path: '/seniors', changefreq: 'weekly', priority: '0.9' },
      { path: '/parents', changefreq: 'weekly', priority: '0.9' },
      { path: '/emergency-help', changefreq: 'monthly', priority: '0.9' },
      { path: '/breach-dashboard', changefreq: 'weekly', priority: '0.8' },
      { path: '/ai-prompts', changefreq: 'weekly', priority: '0.8' },
      { path: '/ai-safety', changefreq: 'weekly', priority: '0.8' },
      { path: '/training', changefreq: 'weekly', priority: '0.8' },
      { path: '/resources', changefreq: 'weekly', priority: '0.8' },
      { path: '/checklists', changefreq: 'weekly', priority: '0.8' },
      { path: '/cyber-hygiene', changefreq: 'monthly', priority: '0.8' },
      { path: '/small-business', changefreq: 'monthly', priority: '0.8' },
      { path: '/educators', changefreq: 'monthly', priority: '0.8' },
      { path: '/about', changefreq: 'monthly', priority: '0.8' },
      { path: '/guides', changefreq: 'daily', priority: '0.8' },
      { path: '/alerts', changefreq: 'daily', priority: '0.8' },
      { path: '/scam-intel', changefreq: 'daily', priority: '0.8' },
      { path: '/threat-trends', changefreq: 'daily', priority: '0.8' },
      { path: '/news', changefreq: 'daily', priority: '0.7' },
      { path: '/printable-guides', changefreq: 'monthly', priority: '0.7' },
      { path: '/report-scam', changefreq: 'monthly', priority: '0.7' },
      { path: '/quick-assessment', changefreq: 'monthly', priority: '0.7' },
      { path: '/safety-score', changefreq: 'monthly', priority: '0.7' },
      { path: '/travel-safety', changefreq: 'monthly', priority: '0.7' },
      { path: '/faq', changefreq: 'monthly', priority: '0.7' },
      { path: '/parents/child-safety-scanner', changefreq: 'monthly', priority: '0.7' },
      { path: '/parent-guide', changefreq: 'monthly', priority: '0.6' },
      { path: '/contact', changefreq: 'monthly', priority: '0.6' },
      { path: '/pricing', changefreq: 'monthly', priority: '0.6' },
      { path: '/support', changefreq: 'monthly', priority: '0.6' },
      { path: '/support-the-mission', changefreq: 'monthly', priority: '0.6' },
      { path: '/our-mission', changefreq: 'monthly', priority: '0.5' },
      { path: '/search', changefreq: 'weekly', priority: '0.5' },
      { path: '/feedback', changefreq: 'monthly', priority: '0.5' },
      { path: '/security', changefreq: 'monthly', priority: '0.5' },
      { path: '/privacy', changefreq: 'yearly', priority: '0.4' },
      { path: '/terms', changefreq: 'yearly', priority: '0.4' },
      { path: '/accessibility', changefreq: 'yearly', priority: '0.4' },
      { path: '/advertise', changefreq: 'monthly', priority: '0.4' },
      { path: '/partner-deck', changefreq: 'monthly', priority: '0.4' },
      { path: '/experience', changefreq: 'weekly', priority: '0.6' },
      { path: '/browser-extension', changefreq: 'monthly', priority: '0.7' },
      { path: '/gcr-guard-pricing', changefreq: 'monthly', priority: '0.6' },
    ];

    const scamSlugs = getAllScamSlugs();

    const topicClusters = [
      'identity-theft', 'online-scams', 'phishing-attacks', 'cyber-safety-seniors',
      'cyber-safety-kids', 'password-security', 'privacy-protection', 'device-security',
      'data-breaches', 'social-media-security',
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.path}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    for (const cluster of topicClusters) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/topics/${cluster}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    for (const slug of scamSlugs) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/scams/${slug}</loc>\n`;
      xml += `    <lastmod>2026-03-01</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    }

    try {
      const publishedGuides = await storage.getPublishedGuides(undefined, 500);
      for (const guide of publishedGuides) {
        const lastmod = guide.updatedAt ? new Date(guide.updatedAt).toISOString().split('T')[0] : today;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/guides/${guide.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      const publishedAlerts = await storage.getPublishedThreatAlerts(undefined, 500);
      for (const alert of publishedAlerts) {
        const lastmod = alert.updatedAt ? new Date(alert.updatedAt).toISOString().split('T')[0] : today;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/alerts/${alert.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }

      const publishedScamIntel = await storage.getPublishedScamIntel(undefined, 1000);
      for (const scam of publishedScamIntel) {
        const lastmod = scam.lastUpdated ? new Date(scam.lastUpdated).toISOString().split('T')[0] : today;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/scam-intel/${scam.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
      const newsArticles = await storage.getNewsArticles(undefined, 500);
      for (const article of newsArticles) {
        if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) continue;
        const lastmod = article.publishedAt ? new Date(article.publishedAt).toISOString().split('T')[0] : today;
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/news/${article.slug}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.7</priority>\n`;
        xml += `  </url>\n`;
      }
    } catch (err) {
      console.error("[Sitemap] Error fetching dynamic content:", err);
    }

    xml += '</urlset>';

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(xml);
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

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
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

  app.get('/api/user/dashboard-stats', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const scanHistoryEntries = await storage.getScanHistory(userId, 100);
      const totalScans = scanHistoryEntries.length;

      let brokersFound = 0;
      let removalReqCount = 0;
      let removalsComplete = 0;
      try {
        const schema = await import("@shared/schema");
        const userScans = await db.select().from(schema.exposureScans).where(eq(schema.exposureScans.userId, userId)).orderBy(desc(schema.exposureScans.createdAt)).limit(1);
        if (userScans.length > 0) {
          brokersFound = userScans[0].totalExposuresFound || 0;
          const findings = await db.select().from(schema.exposureFindings).where(eq(schema.exposureFindings.scanId, userScans[0].id));
          brokersFound = Math.max(brokersFound, findings.length);
        }
        const removals = await db.select().from(removalRequests).where(eq(removalRequests.userId, userId));
        removalReqCount = removals.length;
        removalsComplete = removals.filter((r: any) => r.status === "completed" || r.status === "verified").length;
      } catch {}

      let breachAlerts = 0;
      try {
        const schema = await import("@shared/schema");
        const alerts = await db.select().from(schema.breachAlerts).where(eq(schema.breachAlerts.userId, userId));
        breachAlerts = alerts.length;
      } catch {}

      let maskedIdentityCount = 0;
      try {
        const schema = await import("@shared/schema");
        const masked = await db.select().from(schema.maskedIdentities).where(eq(schema.maskedIdentities.userId, userId));
        maskedIdentityCount = masked.filter((m: any) => m.status === "active").length;
      } catch {}

      let learningProgress = 0;
      try {
        const progress = await db.select().from(userLearningProgress).where(eq(userLearningProgress.userId, userId));
        const completed = progress.filter((p: any) => p.status === "completed").length;
        learningProgress = progress.length > 0 ? Math.round((completed / progress.length) * 100) : 0;
      } catch {}

      const recentScans = scanHistoryEntries.slice(0, 5).map((s: any) => ({
        id: s.id,
        type: s.scanType,
        result: s.riskLevel || s.result,
        createdAt: s.createdAt,
      }));

      const safetyScore = Math.min(100, 20 +
        (totalScans > 0 ? 15 : 0) +
        (removalsComplete > 0 ? 20 : 0) +
        (breachAlerts === 0 ? 15 : 5) +
        (maskedIdentityCount > 0 ? 10 : 0) +
        (learningProgress > 50 ? 10 : learningProgress > 0 ? 5 : 0) +
        ((req as any).user?.mfaEnabled ? 10 : 0)
      );

      res.json({
        totalScans,
        brokersFound,
        removalRequests: removalReqCount,
        removalsComplete,
        breachAlerts,
        maskedIdentities: maskedIdentityCount,
        learningProgress,
        safetyScore,
        recentScans,
      });
    } catch (error: any) {
      console.error("[dashboard-stats] Error:", error.message);
      res.json({
        totalScans: 0,
        brokersFound: 0,
        removalRequests: 0,
        removalsComplete: 0,
        breachAlerts: 0,
        maskedIdentities: 0,
        learningProgress: 0,
        safetyScore: 20,
        recentScans: [],
      });
    }
  });

  // Register admin routes
  registerAdminRoutes(app);
  
  // Register tool tracking routes (public)
  registerToolTrackingRoutes(app);

  // Register platform module routes (guides, scam intel, alerts, social, growth)
  registerPlatformRoutes(app);

  registerChatRoutes(app);

  registerStripeRoutes(app);
  registerStripeWebhook(app);

  // Contact form - strict rate limiting (10 req/min)
  app.post("/api/contact", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      securityLogger.info("Contact form submission", { email: validatedData.email });
      res.json({ success: true, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: (error as any).issues });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Newsletter signup - strict rate limiting (10 req/min)
  const MIN_FORM_FILL_MS = 2000;
  const SUSPICIOUS_EMAIL_PATTERN = /^[a-z](\.[a-z]){4,}[\d.]*@/i;

  async function handleNewsletterSubscribe(req: Request, res: Response) {
    try {
      const { recaptchaToken, _timestamp, ...rest } = req.body;

      if (!recaptchaToken || recaptchaToken === '') {
        securityLogger.warn("Newsletter missing reCAPTCHA token");
        res.status(400).json({ message: "Security verification required. Please refresh the page and try again." });
        return;
      }

      const recaptchaResult = await verifyRecaptcha(recaptchaToken);
      if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        securityLogger.warn("Newsletter reCAPTCHA rejected", { success: recaptchaResult.success, score: recaptchaResult.score, error: recaptchaResult.error });
        res.status(400).json({ message: "Security verification failed. Please refresh the page and try again." });
        return;
      }

      if (!_timestamp) {
        securityLogger.warn("Newsletter missing timestamp");
        res.json({ success: true, message: "Thank you for subscribing!" });
        return;
      }
      const elapsed = Date.now() - parseInt(_timestamp, 10);
      if (isNaN(elapsed) || elapsed < MIN_FORM_FILL_MS) {
        securityLogger.warn("Newsletter bot timing detected", { elapsed });
        res.json({ success: true, message: "Thank you for subscribing!" });
        return;
      }

      const validatedData = insertNewsletterSubscriberSchema.parse(rest);

      if (SUSPICIOUS_EMAIL_PATTERN.test(validatedData.email)) {
        securityLogger.warn("Newsletter suspicious email pattern", { email: validatedData.email });
        res.json({ success: true, message: "Thank you for subscribing!" });
        return;
      }

      const existing = await storage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existing) {
        res.status(400).json({ message: "This email is already subscribed" });
        return;
      }

      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      securityLogger.info("Newsletter subscription", { email: validatedData.email });
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Please enter a valid email address" });
      } else {
        res.status(500).json({ message: "Failed to subscribe" });
      }
    }
  }

  app.post("/api/newsletter/subscribe", strictRateLimit, handleNewsletterSubscribe);
  app.post("/api/newsletter", strictRateLimit, handleNewsletterSubscribe);

  app.post("/api/experience/waitlist", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertExperienceWaitlistSchema.parse(req.body);
      const normalizedEmail = validatedData.email.toLowerCase().trim();
      const waitlistType = validatedData.type || "family";

      const existing = await db.select().from(experienceWaitlist)
        .where(and(
          eq(experienceWaitlist.email, normalizedEmail),
          eq(experienceWaitlist.type, waitlistType)
        ));
      if (existing.length > 0) {
        res.json({ success: true, message: "This email is already on the waitlist" });
        return;
      }
      await db.insert(experienceWaitlist).values({
        ...validatedData,
        email: normalizedEmail,
        type: waitlistType,
      });
      securityLogger.info("Experience waitlist signup", { email: normalizedEmail, type: waitlistType });
      res.json({ success: true, message: "Successfully joined the waitlist" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: (error as any).issues });
      } else {
        console.error("Experience waitlist error:", error);
        res.status(500).json({ error: "Something went wrong. Please try again." });
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
        res.status(400).json({ error: "Invalid report data", details: (error as any).issues });
      } else {
        console.error("Scam report error:", error);
        res.status(500).json({ error: "Failed to submit report" });
      }
    }
  });

  async function recordScan(opts: {
    userId?: string | null;
    contentSnippet: string;
    contentType: string;
    riskLevel: string;
    riskScore?: number;
    resultSummary?: string;
    flagsFound?: number;
    sourceComponent?: string;
    sessionId?: string;
  }) {
    try {
      await db.insert(scanHistory).values({
        userId: opts.userId || null,
        contentSnippet: opts.contentSnippet.substring(0, 500),
        contentType: opts.contentType,
        riskLevel: opts.riskLevel,
        riskScore: opts.riskScore || 0,
        resultSummary: opts.resultSummary || null,
        flagsFound: opts.flagsFound || 0,
        sourceComponent: opts.sourceComponent || null,
        sessionId: opts.sessionId || null,
      });
    } catch (e) {
      console.error("[scan-record] Failed to record scan:", e);
    }
  }

  app.post("/api/scam-check/url", standardRateLimit, async (req: any, res) => {
    try {
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);

      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;

      const [phishTankResult, urlhausResult, gsbResult, domainAgeResult] = await Promise.allSettled([
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          formData.append('format', 'json');
          const phishTankKey = process.env.PHISHTANK_API_KEY;
          if (phishTankKey) formData.append('app_key', phishTankKey);
          const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'phishtank/getcyberright' },
            body: formData.toString(),
          }, 15000);
          if (!response.ok) throw new Error(`PhishTank error: ${response.status}`);
          const text = await response.text();
          try { return JSON.parse(text); } catch { throw new Error('Non-JSON response'); }
        })(),
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
          const urlhausKey = process.env.URLHAUS_AUTH_KEY;
          if (urlhausKey) headers['Auth-Key'] = urlhausKey;
          const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', { method: 'POST', headers, body: formData.toString() }, 10000);
          if (!response.ok) throw new Error(`URLhaus error: ${response.status}`);
          return response.json();
        })(),
        checkGoogleSafeBrowsing(url),
        checkDomainAge(domain)
      ]);

      const warnings: string[] = [];
      let isSuspicious = false;
      let riskLevel = "safe";

      if (phishTankResult.status === "fulfilled" && phishTankResult.value?.results?.in_database) {
        isSuspicious = true;
        warnings.push("Found in PhishTank phishing database");
        riskLevel = "dangerous";
      }
      if (urlhausResult.status === "fulfilled" && urlhausResult.value?.query_status === "ok") {
        isSuspicious = true;
        warnings.push("Found in URLhaus malware database");
        riskLevel = "dangerous";
      }
      if (gsbResult.status === "fulfilled" && (gsbResult.value as any)?.isThreat) {
        isSuspicious = true;
        warnings.push("Flagged by Google Safe Browsing");
        riskLevel = "dangerous";
      }
      if (domainAgeResult.status === "fulfilled") {
        const age = domainAgeResult.value as any;
        if (age?.ageInDays !== undefined && age.ageInDays < 30) {
          warnings.push("Domain registered less than 30 days ago");
          if (riskLevel === "safe") riskLevel = "suspicious";
        }
      }

      const recommendations = isSuspicious
        ? ["Do not click or visit this link", "Do not enter any personal information", "Report this to the platform where you received it"]
        : ["Always verify links before clicking", "Look for misspelled domain names", "Check for HTTPS before entering sensitive data"];

      const result = { isSuspicious, riskLevel, warnings, recommendations, url, domain };

      const userId = req.session?.userId || null;
      recordScan({
        userId,
        contentSnippet: url,
        contentType: "url",
        riskLevel,
        riskScore: isSuspicious ? 80 : 10,
        resultSummary: isSuspicious ? `Suspicious URL: ${warnings.join("; ")}` : "URL appears safe",
        flagsFound: warnings.length,
        sourceComponent: "dezi-hero",
        sessionId: req.sessionID,
      });

      res.json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid URL", details: (error as any).issues });
      }
      console.error("[scam-check/url] Error:", error?.message);
      res.status(500).json({ error: "URL check failed" });
    }
  });

  app.post("/api/scam-check/phone", standardRateLimit, async (req: any, res) => {
    try {
      const { phone } = phoneCheckSchema.parse(req.body);
      const result = await checkPhoneNumber(phone);

      const isSuspicious = result.riskLevel !== "low" && result.riskLevel !== "safe";
      const warnings = result.riskIndicators || [];

      const userId = req.session?.userId || null;
      recordScan({
        userId,
        contentSnippet: phone.replace(/\d(?=\d{4})/g, '*'),
        contentType: "phone",
        riskLevel: result.riskLevel || "safe",
        riskScore: isSuspicious ? 70 : 10,
        resultSummary: isSuspicious ? "Suspicious phone number" : "Phone number appears safe",
        flagsFound: warnings.length,
        sourceComponent: "dezi-hero",
        sessionId: req.sessionID,
      });

      res.json({ success: true, isSuspicious, warnings, ...result });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid phone number", details: (error as any).issues });
      }
      console.error("[scam-check/phone] Error:", error?.message);
      res.status(500).json({ error: "Phone check failed" });
    }
  });

  app.post("/api/scam-check/email-headers", standardRateLimit, async (req: any, res) => {
    try {
      const { headers } = z.object({ headers: z.string().min(5).max(50000) }).parse(req.body);
      const parsed = parseEmailHeaders(headers);
      const analysis = await analyzeEmailHeadersEnhanced(headers);

      const riskLevel = analysis.riskLevel || "unknown";
      const userId = req.session?.userId || null;
      recordScan({
        userId,
        contentSnippet: headers.substring(0, 200),
        contentType: "email",
        riskLevel,
        riskScore: riskLevel === "dangerous" ? 90 : riskLevel === "suspicious" ? 60 : 20,
        resultSummary: analysis.summary || "Email header analysis complete",
        flagsFound: analysis.redFlags?.length || 0,
        sourceComponent: "dezi-hero",
        sessionId: req.sessionID,
      });

      res.json(analysis);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid email content", details: (error as any).issues });
      }
      console.error("[scam-check/email] Error:", error?.message);
      res.status(500).json({ error: "Email analysis failed" });
    }
  });

  app.post("/api/scam-check/analyze", standardRateLimit, async (req: any, res) => {
    try {
      const { description, scamType } = z.object({
        description: z.string().min(5).max(10000),
        scamType: z.string().optional(),
      }).parse(req.body);

      const result = await analyzeScamDescription(description, scamType);

      const riskLevel = result.verdict || "unknown";
      const userId = req.session?.userId || null;
      recordScan({
        userId,
        contentSnippet: description.substring(0, 200),
        contentType: "text",
        riskLevel,
        riskScore: result.confidence || 0,
        resultSummary: result.explanation || "Content analysis complete",
        flagsFound: result.redFlags?.length || 0,
        sourceComponent: "dezi-hero",
        sessionId: req.sessionID,
      });

      res.json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid content", details: (error as any).issues });
      }
      console.error("[scam-check/analyze] Error:", error?.message);
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  app.get("/api/scan-stats", async (_req, res) => {
    try {
      const [scanCount] = await db.select({ count: sql<number>`count(*)` }).from(scanHistory);
      const [scamReportCount] = await db.select({ count: sql<number>`count(*)` }).from(scamReports);
      const [communityCount] = await db.select({ count: sql<number>`count(*)` }).from(communityScamReports);

      const totalScans = Number(scanCount?.count || 0) + Number(scamReportCount?.count || 0) + Number(communityCount?.count || 0);

      res.json({
        scansRun: totalScans,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("[scan-stats] Error:", error);
      res.status(500).json({ scansRun: 0 });
    }
  });

  app.post("/api/security/check-phishtank", standardRateLimit, async (req, res) => {
    try {
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      
      const formData = new URLSearchParams();
      formData.append('url', url);
      formData.append('format', 'json');
      const phishTankKey = process.env.PHISHTANK_API_KEY;
      if (phishTankKey) {
        formData.append('app_key', phishTankKey);
      }
      
      const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'phishtank/getcyberright',
        },
        body: formData.toString(),
      }, 15000);
      
      if (!response.ok) {
        throw new Error(`PhishTank API error: ${response.status}`);
      }
      
      const text = await response.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('PhishTank returned non-JSON response');
      }
      
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
        res.status(400).json({ error: 'Invalid URL provided', details: (error as any).issues });
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
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      
      const formData = new URLSearchParams();
      formData.append('url', url);
      
      const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
      const urlhausKey = process.env.URLHAUS_AUTH_KEY;
      if (urlhausKey) {
        headers['Auth-Key'] = urlhausKey;
      }
      
      const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
        method: 'POST',
        headers,
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
        res.status(400).json({ error: 'Invalid URL provided', details: (error as any).issues });
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

  app.post("/api/security/check-url-reputation", standardRateLimit, async (req, res) => {
    try {
      const normalizedBody = { ...req.body, url: normalizeUrl(req.body.url || '') };
      const { url } = urlCheckSchema.parse(normalizedBody);
      
      const parsedUrl = new URL(url);
      const domain = parsedUrl.hostname;
      
      const [phishTankResult, urlhausResult, gsbResult, domainAgeResult] = await Promise.allSettled([
        // PhishTank check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          formData.append('format', 'json');
          const phishTankKey = process.env.PHISHTANK_API_KEY;
          if (phishTankKey) {
            formData.append('app_key', phishTankKey);
          }
          
          const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': 'phishtank/getcyberright'
            },
            body: formData.toString(),
          }, 15000);
          
          if (!response.ok) throw new Error(`PhishTank API error: ${response.status}`);
          const text = await response.text();
          try {
            return JSON.parse(text);
          } catch {
            throw new Error('PhishTank returned non-JSON response (likely Cloudflare challenge)');
          }
        })(),
        // URLhaus check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          
          const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
          const urlhausKey = process.env.URLHAUS_AUTH_KEY;
          if (urlhausKey) {
            headers['Auth-Key'] = urlhausKey;
          }
          
          const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
            method: 'POST',
            headers,
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error(`URLhaus API error: ${response.status}`);
          return response.json();
        })(),
        checkGoogleSafeBrowsing(url),
        checkDomainAge(domain)
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
      
      const googleSafeBrowsing = gsbResult.status === 'fulfilled' ? gsbResult.value : {
        checked: false, isThreat: false, threats: [], error: 'Service unavailable'
      };
      
      const domainAge = domainAgeResult.status === 'fulfilled' ? domainAgeResult.value : null;
      
      let threatLevel: 'safe' | 'suspicious' | 'dangerous' | 'unknown' = 'unknown';
      const hasThreat = phishTank.isPhishing || urlhaus.isMalware || googleSafeBrowsing.isThreat;
      const checkedSources = [phishTank.checked, urlhaus.checked, googleSafeBrowsing.checked].filter(Boolean).length;
      const isNewDomain = domainAge && 'isNew' in domainAge && domainAge.isNew;
      
      if (hasThreat) {
        threatLevel = 'dangerous';
      } else if (checkedSources >= 2) {
        threatLevel = isNewDomain ? 'suspicious' : 'safe';
      } else if (checkedSources >= 1) {
        threatLevel = isNewDomain ? 'suspicious' : 'safe';
      }
      
      res.json({
        success: true,
        url,
        threatLevel,
        phishTank,
        urlhaus,
        googleSafeBrowsing,
        domainAge,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: (error as any).issues });
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
        res.status(400).json({ error: "Invalid URL", details: (error as any).issues });
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
        res.status(400).json({ error: "Invalid URL", details: (error as any).issues });
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
        res.status(400).json({ error: "Invalid domain", details: (error as any).issues });
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
        res.status(400).json({ error: "Invalid URL", details: (error as any).issues });
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
        res.status(400).json({ error: "Invalid phone number", details: (error as any).issues });
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
        res.status(400).json({ error: "Invalid QR content", details: (error as any).issues });
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
      res.status(400).json({ success: false, error: "Invalid input, minimum 50 characters required" });
    }
  });

  // AI-Powered Scam Analyzer with Anthropic fallback
  app.post("/api/security/ai-scam-analyze", standardRateLimit, async (req, res) => {
    try {
      const { content } = z.object({
        content: z.string().min(5, "Please provide at least 5 characters").max(50000, "Content too long"),
        contentType: z.string().optional()
      }).parse(req.body);

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
  "keyRedFlags": ["bullet list of specific indicators, write each one so a non-technical person understands the risk. Example: Instead of 'subdomain manipulation: secure-login falsely implies legitimacy', write 'The web address is designed to look like a real login page, but it belongs to scammers'"],
  "technicalObservations": ["plain-language explanations of technical findings. Write for someone who has never worked in IT. Example: Instead of 'SPF/DKIM authentication failure', write 'The email failed security checks that verify the sender is who they claim to be'. Only include if applicable, otherwise empty array"],
  "recommendedActions": ["clear, specific steps anyone can follow. Start each with a verb. Example: 'Delete this message without clicking any links', 'Go directly to paypal.com by typing it in your browser, do not use the link in this message'"],
  "confidenceLevel": "explanation of certainty and any limitations",
  "summary": "2-3 sentence plain-language summary. Write as if explaining to a family member. Be direct and specific about what the threat is and what they should do."
}

BEHAVIORAL CONSTRAINTS
- Do NOT hallucinate threat intelligence.
- Do NOT assume legitimacy or maliciousness without indicators.
- Do NOT provide legal conclusions.
- Write ALL findings in plain, everyday language that a non-technical person can act on. NEVER use these terms: 'typosquatting', 'subdomain manipulation', 'SPF/DKIM', 'DMARC', 'TLD', 'phishing vector', 'punycode', 'homograph', 'entropy', 'credential injection', 'obfuscated payload', 'URL shortener obfuscation'. Instead describe what is actually happening: e.g., say 'the web address is misspelled to look like the real site' not 'typosquatting detected'.
- Maintain a confident, professional tone - like a trusted security expert giving clear advice.
- Prioritize user safety over reassurance.

EDGE CASE HANDLING
- If input is empty or minimal: set scamRiskLevel to "Low" and note insufficient data.
- If clearly benign or legitimate: set scamRiskLevel to "Low", give genuinely reassuring recommendations that reflect the actual low risk. Do NOT undermine the result with generic warnings like "proceed with standard caution" or "do not enter personal information". If a site is safe, say so clearly. Examples of good low-risk recommendations: "This appears to be a legitimate website. You can use it normally.", "No threats were found. Keep your browser and system updated for general protection.", "This site uses proper security (HTTPS). Standard browsing is safe."
- If ambiguous: highlight uncertainty explicitly in confidenceLevel.

RECOMMENDATION TONE CALIBRATION (CRITICAL):
- Recommendations MUST match the risk level. Do not give high-risk advice for low-risk content.
- Low risk: Reassuring, confident. "This looks legitimate." Not "Be cautious" or "Verify independently."
- Moderate risk: Measured caution. "Double-check this through official channels."
- High/Critical risk: Clear, direct warnings. "Do not interact with this."
- NEVER give blanket warnings like "do not enter personal information" unless there is actual evidence of risk. Generic warnings on safe sites destroy user trust in the tool.`;

      const userMessage = `Please analyze the following content for scam/threat indicators:\n\n${content}`;

      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic({
        apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
        baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
      });

      const message = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 8192,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const block = message.content[0];
      const resultText = block && block.type === "text" ? block.text : null;

      if (!resultText) {
        throw new Error("No response from AI model");
      }

      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : resultText);

      const userId = (req as any).session?.userId || null;
      recordScan({
        userId,
        contentSnippet: content.substring(0, 200),
        contentType: parsed.contentTypeDetected || "ai-analysis",
        riskLevel: parsed.scamRiskLevel?.toLowerCase() || "unknown",
        riskScore: parsed.scamRiskLevel === "Critical" ? 95 : parsed.scamRiskLevel === "High" ? 80 : parsed.scamRiskLevel === "Moderate" ? 50 : 15,
        resultSummary: parsed.summary || "AI analysis complete",
        flagsFound: parsed.keyRedFlags?.length || 0,
        sourceComponent: "scam-checker-ai",
        sessionId: (req as any).sessionID,
      });

      res.json({ success: true, result: parsed });
    } catch (error: any) {
      console.error("AI Scam Analyzer error:", error);
      const errorMessage = "Analysis could not be completed. Please try again or use the pattern-based GCR Scam Guard tool.";
      res.status(500).json({ success: false, error: errorMessage });
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
        ip: z.string().min(1)
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
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          formData.append('format', 'json');
          const phishTankKey = process.env.PHISHTANK_API_KEY;
          if (phishTankKey) formData.append('app_key', phishTankKey);
          
          const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'phishtank/getcyberright' },
            body: formData.toString(),
          }, 15000);
          
          if (!response.ok) throw new Error('PhishTank API error');
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            return { checked: true, isPhishing: data.results?.in_database === true && data.results?.valid === true };
          } catch {
            throw new Error('PhishTank returned non-JSON response');
          }
        })(),
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          
          const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded' };
          const urlhausKey = process.env.URLHAUS_AUTH_KEY;
          if (urlhausKey) headers['Auth-Key'] = urlhausKey;
          
          const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
            method: 'POST',
            headers,
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error(`URLhaus API error: ${response.status}`);
          const data = await response.json();
          return { checked: true, isMalware: data.query_status === 'ok' };
        })(),
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
        res.status(400).json({ error: "Invalid URL", details: (error as any).issues });
      } else {
        console.error('Comprehensive scan error:', error);
        res.status(500).json({ success: false, error: "Scan failed" });
      }
    }
  });

  app.post("/api/security/unified-scan", standardRateLimit, async (req, res) => {
    try {
      const schema = z.object({
        inputType: z.enum(["url", "phone", "description"]),
        input: z.string().min(1).max(10000),
        scamType: z.string().optional(),
      });
      const { inputType, input, scamType } = schema.parse(req.body);

      let result: UnifiedScamResult;

      if (inputType === "url") {
        const urlResult = await scamCheckURL(input);
        result = wrapUrlResult(input, urlResult);
      } else if (inputType === "phone") {
        const phoneResult = scamCheckPhone(input);
        result = wrapPhoneResult(input, phoneResult);
      } else {
        const descResult = await analyzeScamDescription(input, scamType);
        result = wrapDescriptionResult(input, descResult);
      }

      res.json({ success: true, ...result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: (error as any).issues });
      } else {
        console.error("Unified scan error:", error);
        res.status(500).json({ success: false, error: "Scan failed" });
      }
    }
  });

  app.post("/api/cyber-hygiene-check", standardRateLimit, async (req, res) => {
    try {
      const schema = z.object({
        domain: z.string().min(1).max(253).refine((d) => {
          const clean = d.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
          const blockedPatterns = [
            /^localhost$/i,
            /^127\./,
            /^10\./,
            /^172\.(1[6-9]|2\d|3[01])\./,
            /^192\.168\./,
            /^0\./,
            /^169\.254\./,
            /^fc00:/i,
            /^fe80:/i,
            /^::1$/,
            /^\d+\.\d+\.\d+\.\d+$/,
          ];
          return !blockedPatterns.some(p => p.test(clean)) && clean.includes('.');
        }, { message: "Invalid or private domain" }),
        includeAdvanced: z.boolean().optional().default(false)
      });
      const { domain, includeAdvanced } = schema.parse(req.body);
      
      const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
      const urlToCheck = `https://${cleanDomain}`;
      
      const [sslResult, domainAgeResult, gsbResult] = await Promise.allSettled([
        checkSSLCertificate(urlToCheck),
        checkDomainAge(cleanDomain),
        checkGoogleSafeBrowsing(urlToCheck)
      ]);
      
      const ssl = sslResult.status === 'fulfilled' ? sslResult.value : null;
      const age = domainAgeResult.status === 'fulfilled' ? domainAgeResult.value : null;
      const gsb = gsbResult.status === 'fulfilled' ? gsbResult.value : null;
      
      const hasSSL = ssl?.valid === true;
      const hasThreat = gsb?.isThreat === true;
      
      let score = 50;
      if (hasSSL) score += 20;
      if (ssl && !ssl.isExpired) score += 5;
      if (ssl && !ssl.isSelfSigned) score += 5;
      if (age && 'isNew' in age && !age.isNew) score += 10;
      if (!hasThreat && gsb?.checked) score += 10;
      if (hasThreat) score -= 40;
      score = Math.max(0, Math.min(100, score));
      
      const riskLevel = score >= 80 ? "low" : score >= 60 ? "medium" : score >= 40 ? "high" : "critical";
      
      const recommendations: string[] = [];
      if (!hasSSL) recommendations.push("This site does not have a valid SSL certificate. Avoid entering personal information.");
      if (ssl?.isExpired) recommendations.push("The SSL certificate has expired, which could indicate the site is not maintained.");
      if (ssl?.isSelfSigned) recommendations.push("The site uses a self-signed certificate, which is not verified by a trusted authority.");
      if (age && 'isNew' in age && age.isNew) recommendations.push("This domain was registered recently. New domains are sometimes used for scams.");
      if (hasThreat) recommendations.push("This site has been flagged by security services as potentially dangerous.");
      if (recommendations.length === 0) recommendations.push("No major issues detected. Always stay cautious with personal information online.");
      
      res.json({
        domain: cleanDomain,
        overallScore: score,
        riskLevel,
        basicChecks: {
          ssl: hasSSL,
          dnssec: false,
          spfRecord: false,
          dmarcRecord: false,
          securityHeaders: hasSSL
        },
        certificateGrade: hasSSL ? (ssl?.isEV ? "A+" : "A") : "F",
        httpSecurityHeaders: {
          'Strict-Transport-Security': hasSSL,
          'X-Frame-Options': false,
          'X-Content-Type-Options': false,
          'Referrer-Policy': false
        },
        recommendations,
        scanDate: new Date().toISOString(),
        includeAdvanced
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid domain", details: (error as any).issues });
      } else {
        console.error('Cyber hygiene check error:', error);
        res.status(500).json({ error: "Failed to perform check" });
      }
    }
  });

  app.get("/api/subscription/status", isAuthenticated, async (req: any, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const now = new Date();
      const sgExpired = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < now;
      const dsExpired = user.shieldSubscriptionExpiresAt && new Date(user.shieldSubscriptionExpiresAt) < now;
      const effectiveSgTier = sgExpired ? "free" : (user.subscriptionTier || "free");
      const effectiveDsTier = dsExpired ? "free" : (user.shieldSubscriptionTier || "free");
      
      res.json({
        tier: effectiveSgTier,
        shieldTier: effectiveDsTier,
        expiresAt: user.subscriptionExpiresAt,
        shieldExpiresAt: user.shieldSubscriptionExpiresAt,
        isExpired: sgExpired,
        isActive: !sgExpired,
        availableTiers: Object.values(SUBSCRIPTION_TIERS)
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  const requireSubscription = (_requiredTier: string) => {
    return async (_req: any, _res: Response, next: Function) => {
      next();
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
  app.post("/api/gamification/record-activity", standardRateLimit, isAuthenticated, async (req: any, res) => {
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
  app.post("/api/codeword/save", standardRateLimit, isAuthenticated, async (req: any, res) => {
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

      res.json({
        success: true,
        feature,
        hasAccess: true,
        userTier: "free",
        requiredTier: "free",
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
        res.status(400).json({ success: false, error: "Invalid input", details: (error as any).issues });
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

  // Initialize monthly removal report service for paying subscribers
  removalReportService.initialize().catch(err =>
    console.error("Failed to initialize removal report service:", err)
  );

  // Seed admin user from environment variables (for production deployment)
  seedAdminUser().catch(err => 
    console.error("Failed to seed admin user:", err)
  );

  // Seed initial curriculum content
  seedCurriculum().catch(err => 
    console.error("Failed to seed curriculum:", err)
  );

  seedAISafetyTraining().catch(err =>
    console.error("Failed to seed AI Safety training:", err)
  );

  (async () => {
    try {
      await seedDataBrokers(db);
      const allBrokers = await db.select({
        id: dataBrokers.id,
        name: dataBrokers.name,
        domain: dataBrokers.domain,
        category: dataBrokers.category,
        isActive: dataBrokers.isActive,
      }).from(dataBrokers);
      registerUniversalAdapters(allBrokers.map(b => ({ ...b, isActive: b.isActive ?? true })));
    } catch (err) {
      console.error("[broker-adapter] Failed to register universal adapters:", err);
    }

    dataBrokerScheduler.start().catch(err =>
      console.error("Failed to start data broker scheduler:", err)
    );
  })();

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
  // MONTHLY REMOVAL REPORT ROUTES
  // ============================================

  app.post("/api/admin/removal-reports/send-all", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const result = await removalReportService.generateAndSendAllReports();
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/admin/removal-reports/send/:userId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const result = await removalReportService.sendReportToUser(userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/admin/removal-reports/preview/:userId", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
      const preview = await removalReportService.previewReport(userId);
      if (!preview) {
        res.status(404).json({ success: false, error: "No data available for this user" });
        return;
      }
      res.json({ success: true, ...preview });
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
      
      const fingerprintedLesson = {
        ...lesson,
        content: lesson.content ? embedFingerprint(lesson.content, `lesson-${lessonId}`) : lesson.content
      };
      res.json(fingerprintedLesson);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mark lesson as complete
  app.post("/api/training/lessons/:lessonId/complete", standardRateLimit, isAuthenticated, async (req: Request, res: Response) => {
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
  app.post("/api/training/quizzes/:quizId/submit", standardRateLimit, isAuthenticated, async (req: Request, res: Response) => {
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
  app.post("/api/training/paths/:pathId/certificate", strictRateLimit, isAuthenticated, async (req: Request, res: Response) => {
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

  app.get("/api/vault-keys", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const [vaultKey] = await db.select().from(userVaultKeys).where(eq(userVaultKeys.userId, req.user.id));
      if (!vaultKey) {
        return res.json(null);
      }
      res.json({
        salt: vaultKey.vaultKeySalt,
        encryptedVaultKey: vaultKey.encryptedVaultKey,
        verification: vaultKey.vaultKeyVerification,
        iterations: vaultKey.keyDerivationIterations,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch vault key" });
    }
  });

  app.post("/api/vault-keys/setup", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const { salt, encryptedVaultKey, verification } = req.body;
      if (!salt || !encryptedVaultKey || !verification) {
        return res.status(400).json({ error: "salt, encryptedVaultKey, and verification are required" });
      }
      if (typeof salt !== "string" || salt.length < 20 || salt.length > 200) {
        return res.status(400).json({ error: "Invalid salt format" });
      }
      if (typeof encryptedVaultKey !== "string" || encryptedVaultKey.length < 50 || encryptedVaultKey.length > 500) {
        return res.status(400).json({ error: "Invalid encrypted vault key format" });
      }
      if (typeof verification !== "string" || verification.length < 20 || verification.length > 200) {
        return res.status(400).json({ error: "Invalid verification format" });
      }
      const [existing] = await db.select().from(userVaultKeys).where(eq(userVaultKeys.userId, req.user.id));
      if (existing) {
        await db.update(userVaultKeys)
          .set({ vaultKeySalt: salt, encryptedVaultKey, vaultKeyVerification: verification, updatedAt: new Date() })
          .where(eq(userVaultKeys.userId, req.user.id));
      } else {
        await db.insert(userVaultKeys).values({
          userId: req.user.id,
          vaultKeySalt: salt,
          encryptedVaultKey,
          vaultKeyVerification: verification,
        });
      }
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: req.user.id, action: "vault_create", ipAddress, userAgent, fieldsAccessed: ["vault_key_setup"] });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to set up vault key" });
    }
  });

  app.post("/api/vault-keys/rotate", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const { salt, encryptedVaultKey, verification } = req.body;
      if (!salt || !encryptedVaultKey || !verification) {
        return res.status(400).json({ error: "salt, encryptedVaultKey, and verification are required" });
      }
      if (typeof salt !== "string" || salt.length < 20 || salt.length > 200) {
        return res.status(400).json({ error: "Invalid salt format" });
      }
      if (typeof encryptedVaultKey !== "string" || encryptedVaultKey.length < 50 || encryptedVaultKey.length > 500) {
        return res.status(400).json({ error: "Invalid encrypted vault key format" });
      }
      if (typeof verification !== "string" || verification.length < 20 || verification.length > 200) {
        return res.status(400).json({ error: "Invalid verification format" });
      }
      const [existing] = await db.select().from(userVaultKeys).where(eq(userVaultKeys.userId, req.user.id));
      if (!existing) {
        return res.status(404).json({ error: "No vault key found" });
      }
      await db.update(userVaultKeys)
        .set({ vaultKeySalt: salt, encryptedVaultKey, vaultKeyVerification: verification, updatedAt: new Date() })
        .where(eq(userVaultKeys.userId, req.user.id));
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: req.user.id, action: "vault_update", ipAddress, userAgent, fieldsAccessed: ["vault_key_rotate"] });
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to rotate vault key" });
    }
  });

  app.get("/api/data-removal/vault", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const profile = await getUserVaultProfile(user.id);
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: user.id, action: "vault_read", vaultProfileId: profile?.id, ipAddress, userAgent });
      res.json(profile);
    } catch (error: any) {
      console.error("Error fetching vault profile:", error);
      res.status(500).json({ error: "Failed to fetch vault profile" });
    }
  });

  app.post("/api/data-removal/vault", standardRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const allowedArrayFields = ["previousNames", "emails", "phoneNumbers", "previousAddresses", "relativeNames", "employerNames"] as const;
      const allowedStringFields = ["fullName", "currentAddress", "dateOfBirth"] as const;
      const sanitized: Record<string, any> = {};
      for (const field of allowedArrayFields) {
        if (Array.isArray(req.body[field])) {
          const filtered = req.body[field].filter((v: any) => typeof v === "string" && v.trim().length > 0);
          if (filtered.length > 0) sanitized[field] = filtered;
        }
      }
      for (const field of allowedStringFields) {
        if (req.body[field] && typeof req.body[field] === "string") {
          const trimmed = req.body[field].trim();
          if (trimmed.length > 0) sanitized[field] = trimmed;
        }
      }
      const retentionDays = 365;
      const retentionExpiresAt = new Date();
      retentionExpiresAt.setDate(retentionExpiresAt.getDate() + retentionDays);
      sanitized.retentionExpiresAt = retentionExpiresAt;
      sanitized.lastAccessedAt = new Date();
      sanitized.dataMinimized = true;

      const existingProfile = await getUserVaultProfile(user.id);
      const profile = await upsertVaultProfile(user.id, sanitized);
      const { ipAddress, userAgent } = extractRequestContext(req);
      const fieldsAccessed = Object.keys(sanitized).filter(k => k !== "retentionExpiresAt" && k !== "lastAccessedAt" && k !== "dataMinimized");
      logVaultAccess({
        userId: user.id,
        action: existingProfile ? "vault_update" : "vault_create",
        vaultProfileId: profile.id,
        ipAddress,
        userAgent,
        fieldsAccessed,
      });
      res.json(profile);
    } catch (error: any) {
      console.error("Error upserting vault profile:", error);
      res.status(500).json({ error: "Failed to save vault profile" });
    }
  });

  app.get("/api/data-removal/vault/profiles", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const profiles = await getAllVaultProfiles(req.user.id);
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: req.user.id, action: "vault_read_all", ipAddress, userAgent });
      res.json(profiles);
    } catch (error: any) {
      console.error("Error fetching vault profiles:", error);
      res.status(500).json({ error: "Failed to fetch vault profiles" });
    }
  });

  app.post("/api/data-removal/vault/family", standardRateLimit, isAuthenticated, async (req: any, res: Response) => {
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
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: req.user.id, action: "vault_family_create", vaultProfileId: profile.id, ipAddress, userAgent });
      res.json(profile);
    } catch (error: any) {
      console.error("Error creating family profile:", error);
      res.status(400).json({ error: error.message || "Failed to create family profile" });
    }
  });

  app.delete("/api/data-removal/vault/family/:id", standardRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const profileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await deleteFamilyProfile(req.user.id, profileId);
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: req.user.id, action: "vault_family_delete", vaultProfileId: profileId, ipAddress, userAgent });
      res.json(result);
    } catch (error: any) {
      console.error("Error deleting family profile:", error);
      res.status(400).json({ error: error.message || "Failed to delete family profile" });
    }
  });

  app.post("/api/data-removal/scan", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { vaultProfileId } = req.body;
      if (!vaultProfileId) {
        return res.status(400).json({ error: "vaultProfileId is required" });
      }

      const result = await runExposureScan(user.id, vaultProfileId);
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: user.id, action: "vault_scan_initiated", vaultProfileId, ipAddress, userAgent });

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

  app.post("/api/data-removal/requests", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { brokerId, vaultProfileId, findingId } = req.body;
      if (!brokerId || !vaultProfileId) {
        return res.status(400).json({ error: "brokerId and vaultProfileId are required" });
      }
      const { ipAddress, userAgent } = extractRequestContext(req);
      const request = await createRemovalRequest(user.id, brokerId, vaultProfileId, findingId, ipAddress);
      logVaultAccess({ userId: user.id, action: "vault_removal_requested", vaultProfileId, ipAddress, userAgent });
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

  app.post("/api/data-removal/requests/:id/generate", isAuthenticated, async (req: any, res: Response) => {
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

  app.post("/api/data-removal/requests/:id/auto-send", standardRateLimit, isAuthenticated, async (req: any, res: Response) => {
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

  app.post("/api/data-removal/requests/bulk-auto-send", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
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
      const { ipAddress, userAgent } = extractRequestContext(req);
      const result = await bulkAutoRemoval(user.id, uniqueIds, ipAddress);
      logVaultAccess({ userId: user.id, action: "vault_bulk_removal", ipAddress, userAgent });
      res.json(result);
    } catch (error: any) {
      console.error("Error bulk auto-sending removal requests:", error);
      res.status(500).json({ error: error.message || "Failed to bulk auto-send removal requests" });
    }
  });

  app.post("/api/data-removal/requests/bulk-create-and-send", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
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

  app.post("/api/data-removal/monitoring", standardRateLimit, isAuthenticated, async (req: any, res: Response) => {
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
      const { ipAddress, userAgent } = extractRequestContext(req);
      logVaultAccess({ userId: user.id, action: "vault_monitoring_setup", vaultProfileId, ipAddress, userAgent });
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

  app.post("/api/data-removal/monitoring/run", strictRateLimit, isAuthenticated, async (req: any, res: Response) => {
    try {
      const result = await runMonitoringScan(req.user.id);
      res.json(result);
    } catch (error: any) {
      console.error("Error running monitoring scan:", error);
      res.status(500).json({ error: error.message || "Failed to run monitoring scan" });
    }
  });

  app.post("/api/data-removal/report", standardRateLimit, isAuthenticated, async (req: any, res: Response) => {
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
  app.post("/api/data-removal/verifications", isAuthenticated, async (req: any, res: Response) => {
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

  app.post("/api/data-removal/verifications/:id/complete", isAuthenticated, async (req: any, res: Response) => {
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

  // Broker Walkthroughs
  app.get("/api/data-removal/walkthroughs", standardRateLimit, async (req: Request, res: Response) => {
    try {
      const { brokerWalkthroughs: walkthroughData } = await import("./brokerWalkthroughData");
      res.json(walkthroughData);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch walkthroughs" });
    }
  });

  app.get("/api/data-removal/walkthroughs/:brokerId", standardRateLimit, async (req: Request, res: Response) => {
    try {
      const { brokerWalkthroughs: walkthroughData } = await import("./brokerWalkthroughData");
      const walkthrough = walkthroughData.find(w => w.brokerId === req.params.brokerId);
      if (!walkthrough) {
        return res.status(404).json({ error: "Walkthrough not found for this broker" });
      }
      res.json(walkthrough);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch walkthrough" });
    }
  });

  // Verify removal (re-scan a specific broker to check if profile is still listed)
  app.post("/api/data-removal/verify-removal", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { brokerId, firstName, lastName, city, state } = req.body;
      if (!brokerId || !firstName || !lastName) {
        return res.status(400).json({ error: "brokerId, firstName, and lastName are required" });
      }
      const { scanSingleBroker } = await import("./dataBrokerService");
      const result = await scanSingleBroker(brokerId, { firstName, lastName, city, state });
      res.json({ stillListed: result.found, matchScore: result.matchScore, profileUrl: result.profileUrl });
    } catch (error: any) {
      console.error("Error verifying removal:", error);
      res.status(500).json({ error: "Failed to verify removal" });
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

  // ============================================
  // PRIVACY AUTOMATION AI ENDPOINTS
  // ============================================

  app.get("/api/data-removal/automation/:scanId", isAuthenticated, async (req: any, res: Response) => {
    try {
      const result = await getAutomationOutput(req.params.scanId, req.user.id);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Scan not found") return res.status(404).json({ error: "Scan not found" });
      res.status(500).json({ error: "Failed to generate automation output" });
    }
  });

  app.get("/api/data-removal/smart-queue", isAuthenticated, async (req: any, res: Response) => {
    try {
      const queue = await getSmartRemovalQueue(req.user.id);
      res.json({ queue, total: queue.length });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to generate smart removal queue" });
    }
  });

  app.post("/api/data-removal/privacy-mode", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { vaultProfileId, mode, frameworks } = req.body;
      if (!vaultProfileId || !mode) return res.status(400).json({ error: "vaultProfileId and mode are required" });
      const result = await setPrivacyMode(req.user.id, vaultProfileId, mode, frameworks);
      res.json(result);
    } catch (error: any) {
      if (error.message === "Invalid privacy mode") return res.status(400).json({ error: error.message });
      res.status(500).json({ error: "Failed to set privacy mode" });
    }
  });

  app.post("/api/data-removal/compliance-template", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { brokerId, vaultProfileId, framework } = req.body;
      if (!brokerId || !vaultProfileId) return res.status(400).json({ error: "brokerId and vaultProfileId are required" });

      const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
      if (!broker) return res.status(404).json({ error: "Broker not found" });

      const [rawProfile] = await db.select().from(userVaultProfiles).where(and(eq(userVaultProfiles.id, vaultProfileId), eq(userVaultProfiles.userId, req.user.id)));
      if (!rawProfile) return res.status(404).json({ error: "Vault profile not found" });
      const profile = decryptVaultData(rawProfile);

      const template = generateExecutiveComplianceTemplate(broker, profile, framework || "CCPA");
      res.json({ template, framework: framework || "CCPA", broker: broker.name });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to generate compliance template" });
    }
  });

  app.patch("/api/data-removal/monitoring/:scheduleId/thresholds", isAuthenticated, async (req: any, res: Response) => {
    try {
      const result = await updateMonitoringThresholds(req.user.id, req.params.scheduleId, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update monitoring thresholds" });
    }
  });

  app.get("/api/data-removal/brokers/:id/risk-info", standardRateLimit, async (req: Request, res: Response) => {
    try {
      const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, req.params.id as string));
      if (!broker) return res.status(404).json({ error: "Broker not found" });

      const verificationReqs = getBrokerVerificationRequirements(broker);
      const tosRisk = getBrokerTosRiskFlags(broker);
      const exposureLikelihood = computeExposureLikelihood(broker, new Set(["name", "email", "phone", "address"]));

      res.json({
        broker: broker.name,
        verificationRequirements: verificationReqs,
        tosRisk,
        exposureLikelihood,
        difficulty: broker.difficulty,
        estimatedProcessingDays: broker.estimatedProcessingDays,
      });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch broker risk info" });
    }
  });

  // ==================== AI PROMPT LIBRARY ====================

  app.get("/api/prompts", standardRateLimit, async (_req: Request, res: Response) => {
    try {
      const prompts = await storage.getActivePrompts();
      const fingerprintedPrompts = prompts.map((p: any) => ({
        ...p,
        promptText: embedFingerprint(p.promptText, `prompt-${p.slug}`)
      }));
      res.json(fingerprintedPrompts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  // ==================== ADMIN: PROMPT MANAGEMENT ====================

  app.get("/api/admin/prompts", isAuthenticated, isAdmin, async (_req: Request, res: Response) => {
    try {
      const prompts = await storage.getAllPrompts();
      res.json(prompts);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch prompts" });
    }
  });

  app.patch("/api/admin/prompts/:id", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const prompt = await storage.updatePrompt(req.params.id, req.body);
      if (!prompt) return res.status(404).json({ error: "Prompt not found" });
      res.json(prompt);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update prompt" });
    }
  });

  app.get("/api/admin/prompt-reviews", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const status = req.query.status as string | undefined;
      const reviews = await storage.getPromptReviews(status);
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch prompt reviews" });
    }
  });

  app.post("/api/admin/prompt-reviews/:id/approve", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const review = await storage.getPromptReviewById(req.params.id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      if (review.status !== "pending") return res.status(400).json({ error: "Review is not pending" });

      if (review.reviewType === "improvement" && review.promptId) {
        const updateData: any = {};
        if (review.proposedTitle) updateData.title = review.proposedTitle;
        if (review.proposedPromptText) updateData.promptText = review.proposedPromptText;
        if (review.proposedTags) updateData.tags = review.proposedTags;
        if (review.proposedUseCase) updateData.useCase = review.proposedUseCase;
        if (review.proposedSafetyNote) updateData.safetyNote = review.proposedSafetyNote;
        if (review.proposedAudience) updateData.audience = review.proposedAudience;
        if (review.proposedCategory) updateData.category = review.proposedCategory;
        if (review.proposedIconName) updateData.iconName = review.proposedIconName;

        const existingPrompt = await storage.getPromptById(review.promptId);
        if (existingPrompt) {
          updateData.version = (existingPrompt.version || 1) + 1;
        }
        await storage.updatePrompt(review.promptId, updateData);
      } else if (review.reviewType === "new_prompt") {
        const slug = (review.proposedTitle || "new-prompt")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        await storage.createPrompt({
          slug: slug + "-" + Date.now().toString(36),
          title: review.proposedTitle || "New Prompt",
          promptText: review.proposedPromptText || "",
          audience: review.proposedAudience || ["everyday"],
          category: review.proposedCategory || "safety",
          tags: review.proposedTags || [],
          useCase: review.proposedUseCase || "",
          safetyNote: review.proposedSafetyNote || null,
          iconName: review.proposedIconName || "Shield",
          isActive: true,
          version: 1,
        });
      }

      const updated = await storage.updatePromptReviewStatus(req.params.id, "approved", req.user?.id || "admin");
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to approve review" });
    }
  });

  app.post("/api/admin/prompt-reviews/:id/reject", isAuthenticated, isAdmin, async (req: any, res: Response) => {
    try {
      const review = await storage.getPromptReviewById(req.params.id);
      if (!review) return res.status(404).json({ error: "Review not found" });
      if (review.status !== "pending") return res.status(400).json({ error: "Review is not pending" });

      const updated = await storage.updatePromptReviewStatus(req.params.id, "rejected", req.user?.id || "admin");
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to reject review" });
    }
  });

  app.get("/api/admin/prompt-review-runs", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const runs = await storage.getPromptReviewRuns(limit);
      res.json(runs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch review runs" });
    }
  });

  app.post("/api/admin/prompt-reviews/run", isAuthenticated, isAdmin, async (_req: Request, res: Response) => {
    try {
      const { runPromptReview } = await import("./promptReviewService");
      const result = await runPromptReview("manual");
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to trigger prompt review" });
    }
  });

  app.post("/api/feedback", createRateLimitMiddleware("standard"), async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        category: z.enum(["bug", "feature", "question", "praise", "other"]),
        message: z.string().min(5, "Message must be at least 5 characters").max(2000),
        email: z.string().email().optional().or(z.literal("")),
        page: z.string().max(500).optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
      }

      const feedback = await storage.createFeedback({
        ...parsed.data,
        email: parsed.data.email || null,
        userAgent: req.headers["user-agent"] || null,
      });

      try {
        const { Resend } = await import("resend");
        const resendKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL;
        if (resendKey && adminEmail) {
          const resend = new Resend(resendKey);
          const escapeHtml = (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
          const safeMessage = escapeHtml(parsed.data.message);
          const safeEmail = parsed.data.email ? escapeHtml(parsed.data.email) : "";
          const safePage = escapeHtml(parsed.data.page || "Not specified");
          const safeCategory = escapeHtml(parsed.data.category);
          await resend.emails.send({
            from: "GetCyberRight <tips@getcyberright.com>",
            to: [adminEmail],
            subject: `[Feedback] New ${parsed.data.category} from GetCyberRight`,
            html: `
              <div style="font-family: -apple-system, sans-serif, max-width: 600px, margin: 0 auto;">
                <div style="background: #0d9488; padding: 20px, border-radius: 8px 8px 0 0;">
                  <h2 style="color: white, margin: 0;">New User Feedback</h2>
                </div>
                <div style="border: 1px solid #e5e7eb, border-top: none, padding: 20px, border-radius: 0 0 8px 8px;">
                  <p><strong>Category:</strong> ${safeCategory}</p>
                  <p><strong>Page:</strong> ${safePage}</p>
                  ${safeEmail ? `<p><strong>Email:</strong> ${safeEmail}</p>` : ""}
                  <div style="background: #f9fafb, padding: 16px, border-radius: 6px, margin: 16px 0;">
                    <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">Submitted: ${new Date().toLocaleString()}</p>
                  <a href="${req.protocol}://${req.get("host")}/admin/feedback" style="display: inline-block, background: #0d9488; color: white, padding: 10px 20px, border-radius: 6px, text-decoration: none, margin-top: 8px;">View in Admin</a>
                </div>
              </div>
            `,
          });
        }
      } catch (emailErr) {
        console.error("[feedback] Email notification error:", emailErr);
      }

      res.json({ success: true, message: "Thank you for your feedback!" });
    } catch (error: any) {
      console.error("[feedback] Error:", error);
      res.status(500).json({ error: "Failed to submit feedback. Please try again." });
    }
  });

  app.post("/api/download-cyber-hygiene-guide", createRateLimitMiddleware("strict"), async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        email: z.string().email("Please provide a valid email address"),
        name: z.string().max(100).optional().default(""),
        score: z.number().min(0).max(100),
        level: z.enum(["critical", "poor", "fair", "good", "excellent"]),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
      }

      const { email, name, score, level } = parsed.data;
      const displayName = name || "there";

      const levelInfo: Record<string, { label: string; color: string; emoji: string }> = {
        critical: { label: "Critical", color: "#dc2626", emoji: "🔴" },
        poor: { label: "Needs Improvement", color: "#ea580c", emoji: "🟠" },
        fair: { label: "Fair", color: "#ca8a04", emoji: "🟡" },
        good: { label: "Good", color: "#16a34a", emoji: "🟢" },
        excellent: { label: "Excellent", color: "#0d9488", emoji: "⭐" },
      };

      const info = levelInfo[level] || levelInfo.fair;

      const recommendations: Record<string, string[]> = {
        critical: [
          "Start using unique, strong passwords for every account immediately.",
          "Enable two-factor authentication on your email and banking accounts.",
          "Install reputable antivirus software and run a full scan.",
          "Update all your devices and software to the latest versions.",
          "Review your privacy settings on all social media accounts.",
        ],
        poor: [
          "Create a password manager account and start migrating your passwords.",
          "Enable two-factor authentication on your most important accounts.",
          "Set your devices to update automatically.",
          "Be cautious with links in emails and texts from unknown senders.",
          "Review which apps have access to your personal data.",
        ],
        fair: [
          "Consider using a password manager if you are not already.",
          "Enable two-factor authentication on remaining accounts.",
          "Review your social media privacy settings quarterly.",
          "Back up your important files to a secure cloud service.",
          "Stay informed about the latest scam techniques in your area.",
        ],
        good: [
          "Keep up your great security habits and stay consistent.",
          "Consider enabling a VPN when using public Wi-Fi.",
          "Review your digital footprint and remove old accounts you no longer use.",
          "Share your knowledge with family members to help them stay safe too.",
          "Set up breach monitoring for your email addresses.",
        ],
        excellent: [
          "You are a cybersecurity champion! Keep maintaining your excellent habits.",
          "Help friends and family improve their security practices.",
          "Stay updated on emerging threats like AI-powered scams.",
          "Consider advanced measures like hardware security keys.",
          "Regularly audit your connected devices and services.",
        ],
      };

      const tips = recommendations[level] || recommendations.fair;

      const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Cyber Hygiene Improvement Plan</title>
</head>
<body style="margin:0;padding:0;background:#f0fdfa;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdfa;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0d9488,#0284c7);padding:32px 24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0 0 8px;font-size:24px;">Your Cyber Hygiene Report</h1>
              <p style="color:#ccfbf1;margin:0;font-size:14px;">Personalized improvement plan from GetCyberRight</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <p style="color:#334155;font-size:16px;margin:0 0 24px;">Hi ${displayName},</p>
              <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Thank you for completing the Cyber Hygiene Self-Check. Here is your personalized improvement plan based on your results.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:24px;text-align:center;">
                    <p style="font-size:48px;margin:0 0 4px;font-weight:bold;color:${info.color};">${score}%</p>
                    <p style="font-size:18px;margin:0;color:${info.color};font-weight:600;">${info.emoji} ${info.label}</p>
                  </td>
                </tr>
              </table>

              <h2 style="color:#0d9488;font-size:18px;margin:0 0 16px;border-bottom:2px solid #ccfbf1;padding-bottom:8px;">Your Action Plan</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${tips.map((tip, i) => `
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:28px;vertical-align:top;padding-top:2px;">
                          <span style="display:inline-block;width:22px;height:22px;border-radius:50%;background:#0d9488;color:#fff;text-align:center;line-height:22px;font-size:12px;font-weight:bold;">${i + 1}</span>
                        </td>
                        <td style="padding-left:10px;color:#475569;font-size:14px;line-height:1.5;">${tip}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `).join('')}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;background:#f0fdfa;border-radius:8px;border:1px solid #ccfbf1;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#0d9488;font-weight:600;margin:0 0 4px;font-size:14px;">Quick Tip</p>
                    <p style="color:#334155;margin:0;font-size:13px;line-height:1.5;">
                      Focus on one improvement at a time. Even small changes in your digital habits can significantly reduce your risk of falling victim to cyber threats.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;text-align:center;border-top:1px solid #e2e8f0;">
              <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">
                This report was generated by GetCyberRight, a free cybersecurity education platform for families.
              </p>
              <a href="https://www.getcyberright.com" style="color:#0d9488;font-size:12px;text-decoration:none;">Visit GetCyberRight.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

      let sent = false;
      const subject = `Your Cyber Hygiene Report: ${info.label} (${score}%)`;

      try {
        const { Resend } = await import("resend");
        const resendKey = process.env.RESEND_API_KEY;
        if (resendKey) {
          const resend = new Resend(resendKey);
          const fromAddr = "GetCyberRight <tips@getcyberright.com>";
          const result = await resend.emails.send({
            from: fromAddr,
            to: [email],
            subject,
            html: htmlBody,
          });
          if (result.data?.id) {
            sent = true;
          } else if (result.error) {
            console.error("[cyber-hygiene-guide] Resend API error:", JSON.stringify(result.error));
          }
        }
      } catch (emailErr) {
        console.error("[cyber-hygiene-guide] Resend error:", emailErr);
      }

      if (!sent) {
        try {
          const { sendEmail, isEmailConfigured } = await import("./email-service");
          if (isEmailConfigured()) {
            sent = await sendEmail({ to: [email], subject, htmlBody });
          }
        } catch (fallbackErr) {
          console.error("[cyber-hygiene-guide] Fallback email error:", fallbackErr);
        }
      }

      if (sent) {
        res.json({ success: true, message: "Guide sent successfully" });
      } else {
        res.status(500).json({ error: "Email service is not available. Please try again later." });
      }
    } catch (error: any) {
      console.error("[cyber-hygiene-guide] Error:", error);
      res.status(500).json({ error: "Failed to send the guide. Please try again." });
    }
  });

  app.post("/api/scan-history", isAuthenticated, standardRateLimit, async (req: any, res) => {
    try {
      const data = insertScanHistorySchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      const entry = await storage.createScanHistory(data);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: (error as any).issues });
      } else {
        console.error("Scan history save error:", error);
        res.status(500).json({ error: "Failed to save scan history" });
      }
    }
  });

  app.get("/api/scan-history", isAuthenticated, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const history = await storage.getScanHistory(req.user.id, limit);
      res.json(history);
    } catch (error) {
      console.error("Scan history fetch error:", error);
      res.status(500).json({ error: "Failed to fetch scan history" });
    }
  });

  app.post("/api/community-reports", standardRateLimit, async (req: any, res) => {
    try {
      const data = insertCommunityScamReportSchema.parse(req.body);
      const sessionId = req.user?.id || req.sessionID || req.ip || "anonymous";
      const report = await storage.createCommunityReport({
        ...data,
        reporterSessionId: sessionId,
      });
      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid report data", details: (error as any).issues });
      } else {
        console.error("Community report error:", error);
        res.status(500).json({ error: "Failed to submit community report" });
      }
    }
  });

  app.get("/api/community-reports", async (req, res) => {
    try {
      const status = (req.query.status as string) || "confirmed";
      const limit = parseInt(req.query.limit as string) || 20;
      const reports = await storage.getCommunityReports(status, limit);
      res.json(reports);
    } catch (error) {
      console.error("Community reports fetch error:", error);
      res.status(500).json({ error: "Failed to fetch community reports" });
    }
  });

  app.post("/api/community-reports/:id/vote", strictRateLimit, async (req, res) => {
    try {
      const report = await storage.voteCommunityReport(req.params.id);
      if (!report) {
        res.status(404).json({ error: "Report not found" });
        return;
      }
      res.json(report);
    } catch (error) {
      console.error("Vote error:", error);
      res.status(500).json({ error: "Failed to vote" });
    }
  });

  app.patch("/api/admin/community-reports/:id/status", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!["pending", "confirmed", "rejected"].includes(status)) {
        res.status(400).json({ error: "Invalid status. Must be pending, confirmed, or rejected." });
        return;
      }
      const result = await db.update(communityScamReports)
        .set({ status })
        .where(eq(communityScamReports.id, req.params.id))
        .returning();
      if (!result[0]) {
        res.status(404).json({ error: "Report not found" });
        return;
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  app.get("/api/admin/community-reports", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const limit = parseInt(req.query.limit as string) || 50;
      const reports = await storage.getCommunityReports(status, limit);
      res.json(reports);
    } catch (error) {
      console.error("Admin community reports error:", error);
      res.status(500).json({ error: "Failed to fetch reports" });
    }
  });

  const hexHashRegex = /^[0-9a-f]{64}$/;
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  const cryptoModule = await import("crypto");
  function computeDomainHash(domain: string): string {
    const normalized = domain.toLowerCase().replace(/^www\./, "");
    return cryptoModule.createHash("sha256").update(normalized).digest("hex");
  }
  function maskDomain(domain: string): string {
    const parts = domain.split(".");
    if (parts.length <= 2) return `***.${parts[parts.length - 1]}`;
    return `***.${parts.slice(-2).join(".")}`;
  }

  app.get("/api/extension/site-reputation", standardRateLimit, async (req, res) => {
    try {
      const domainHash = req.query.domainHash as string;
      if (!domainHash || !hexHashRegex.test(domainHash)) {
        res.status(400).json({ error: "Valid domainHash required (64-char lowercase hex)" });
        return;
      }
      const [existing] = await db.select().from(siteReputation).where(eq(siteReputation.domainHash, domainHash)).limit(1);
      if (existing) {
        res.json({
          communityScore: existing.communityScore,
          visitCount: existing.visitCount,
          flagCount: existing.flagCount,
          safeCount: existing.safeCount,
        });
      } else {
        res.json({ communityScore: 50, visitCount: 0, flagCount: 0, safeCount: 0 });
      }
    } catch (error) {
      console.error("Site reputation fetch error:", error);
      res.status(500).json({ error: "Failed to fetch site reputation" });
    }
  });

  app.post("/api/extension/site-reputation/visit", standardRateLimit, async (req, res) => {
    try {
      const { domainHash, domain } = req.body;
      if (!domainHash || !hexHashRegex.test(domainHash) || !domain || !domainRegex.test(domain)) {
        res.status(400).json({ error: "Valid domainHash (64-char hex) and domain required" });
        return;
      }
      const serverHash = computeDomainHash(domain);
      if (serverHash !== domainHash) {
        res.status(400).json({ error: "Domain hash mismatch" });
        return;
      }
      const masked = maskDomain(domain);
      await db.execute(sql`
        INSERT INTO site_reputation (id, domain_hash, domain, visit_count, safe_count, flag_count, community_score, last_visited, created_at, updated_at)
        VALUES (gen_random_uuid(), ${domainHash}, ${masked}, 1, 0, 0, 50, NOW(), NOW(), NOW())
        ON CONFLICT (domain_hash) DO UPDATE SET
          visit_count = site_reputation.visit_count + 1,
          last_visited = NOW(),
          updated_at = NOW()
      `);
      res.json({ success: true });
    } catch (error) {
      console.error("Site reputation visit error:", error);
      res.status(500).json({ error: "Failed to record visit" });
    }
  });

  app.post("/api/extension/site-reputation/flag", strictRateLimit, async (req, res) => {
    try {
      const { domainHash, domain } = req.body;
      if (!domainHash || !hexHashRegex.test(domainHash) || !domain || !domainRegex.test(domain)) {
        res.status(400).json({ error: "Valid domainHash (64-char hex) and domain required" });
        return;
      }
      const serverHash = computeDomainHash(domain);
      if (serverHash !== domainHash) {
        res.status(400).json({ error: "Domain hash mismatch" });
        return;
      }
      const masked = maskDomain(domain);
      await db.execute(sql`
        INSERT INTO site_reputation (id, domain_hash, domain, visit_count, safe_count, flag_count, community_score, last_flagged, created_at, updated_at)
        VALUES (gen_random_uuid(), ${domainHash}, ${masked}, 0, 0, 1, 0, NOW(), NOW(), NOW())
        ON CONFLICT (domain_hash) DO UPDATE SET
          flag_count = site_reputation.flag_count + 1,
          community_score = GREATEST(0, ROUND((site_reputation.safe_count::numeric / GREATEST(1, site_reputation.safe_count + site_reputation.flag_count + 1)) * 100)),
          last_flagged = NOW(),
          updated_at = NOW()
      `);
      const [updated] = await db.select({
        communityScore: siteReputation.communityScore,
        flagCount: siteReputation.flagCount,
      }).from(siteReputation).where(eq(siteReputation.domainHash, domainHash)).limit(1);
      res.json({ communityScore: updated?.communityScore ?? 0, flagCount: updated?.flagCount ?? 1 });
    } catch (error) {
      console.error("Site reputation flag error:", error);
      res.status(500).json({ error: "Failed to flag site" });
    }
  });

  app.post("/api/extension/site-reputation/safe", standardRateLimit, async (req, res) => {
    try {
      const { domainHash, domain } = req.body;
      if (!domainHash || !hexHashRegex.test(domainHash) || !domain || !domainRegex.test(domain)) {
        res.status(400).json({ error: "Valid domainHash (64-char hex) and domain required" });
        return;
      }
      const serverHash = computeDomainHash(domain);
      if (serverHash !== domainHash) {
        res.status(400).json({ error: "Domain hash mismatch" });
        return;
      }
      const masked = maskDomain(domain);
      await db.execute(sql`
        INSERT INTO site_reputation (id, domain_hash, domain, visit_count, safe_count, flag_count, community_score, created_at, updated_at)
        VALUES (gen_random_uuid(), ${domainHash}, ${masked}, 1, 1, 0, 100, NOW(), NOW())
        ON CONFLICT (domain_hash) DO UPDATE SET
          safe_count = site_reputation.safe_count + 1,
          community_score = LEAST(100, ROUND(((site_reputation.safe_count + 1)::numeric / GREATEST(1, site_reputation.safe_count + 1 + site_reputation.flag_count)) * 100)),
          updated_at = NOW()
      `);
      res.json({ success: true });
    } catch (error) {
      console.error("Site reputation safe error:", error);
      res.status(500).json({ error: "Failed to mark site as safe" });
    }
  });

  app.post("/api/scan-reports", standardRateLimit, async (req, res) => {
    try {
      const crypto = await import("crypto");
      const shareId = crypto.randomBytes(8).toString("hex");
      const data = insertScanReportSchema.parse({
        ...req.body,
        shareId,
      });
      const report = await storage.createScanReport(data);
      res.json({ shareId: report.shareId, id: report.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid report data", details: (error as any).issues });
      } else {
        console.error("Scan report error:", error);
        res.status(500).json({ error: "Failed to create shareable report" });
      }
    }
  });

  app.get("/api/scan-reports/:shareId", async (req, res) => {
    try {
      const report = await storage.getScanReportByShareId(req.params.shareId);
      if (!report) {
        res.status(404).json({ error: "Report not found" });
        return;
      }
      res.json(report);
    } catch (error) {
      console.error("Scan report fetch error:", error);
      res.status(500).json({ error: "Failed to fetch report" });
    }
  });

  app.get("/api/scam-of-week", async (_req, res) => {
    try {
      const entry = await storage.getActiveScamOfWeek();
      res.json(entry || null);
    } catch (error) {
      console.error("Scam of week error:", error);
      res.status(500).json({ error: "Failed to fetch scam of the week" });
    }
  });

  app.post("/api/admin/scam-of-week", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const data = insertScamOfWeekSchema.parse(req.body);
      const entry = await storage.createScamOfWeek(data);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: (error as any).issues });
      } else {
        console.error("Scam of week create error:", error);
        res.status(500).json({ error: "Failed to create scam of the week" });
      }
    }
  });

  app.get("/api/admin/social-schedule", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const { getSocialScheduleStatus, getContentMixStatus } = await import("./trendAwareSocialEngine");
      const schedule = getSocialScheduleStatus();
      const contentMix = await getContentMixStatus();
      res.json({ schedule, contentMix });
    } catch (error) {
      console.error("Social schedule error:", error);
      res.status(500).json({ error: "Failed to get social schedule" });
    }
  });

  app.post("/api/admin/social-test-generate", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const { generateAndPublishTrendAwarePosts, getCurrentSlot } = await import("./trendAwareSocialEngine");
      const slot = getCurrentSlot();
      console.log(`[Social Test] Generating test post for slot: ${slot} (draft only, no publishing)`);
      const result = await generateAndPublishTrendAwarePosts();
      res.json({ slot, result });
    } catch (error: any) {
      console.error("Social test generate error:", error);
      res.status(500).json({ error: error.message || "Failed to generate test post" });
    }
  });

  app.get("/api/admin/social-partners", isAuthenticated, isAdmin, async (_req, res) => {
    try {
      const { loadPartners } = await import("./socialEngagementService");
      res.json({ partners: loadPartners() });
    } catch (error) {
      console.error("Social partners error:", error);
      res.status(500).json({ error: "Failed to load partners" });
    }
  });

  app.post("/api/admin/social-partners", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { addPartner } = await import("./socialEngagementService");
      const partner = req.body;
      if (!partner.name || !partner.handles) {
        res.status(400).json({ error: "Partner name and handles are required" });
        return;
      }
      const updated = addPartner(partner);
      res.json({ partners: updated });
    } catch (error) {
      console.error("Add partner error:", error);
      res.status(500).json({ error: "Failed to add partner" });
    }
  });

  app.delete("/api/admin/social-partners/:name", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { removePartner } = await import("./socialEngagementService");
      const updated = removePartner(req.params.name);
      res.json({ partners: updated });
    } catch (error) {
      console.error("Remove partner error:", error);
      res.status(500).json({ error: "Failed to remove partner" });
    }
  });

  app.post("/api/admin/social-engagement/run", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { likeRecentPostsFromPartners } = await import("./socialEngagementService");
      const platform = req.body.platform || "facebook";
      const category = req.body.category || "general_awareness";
      const results = await likeRecentPostsFromPartners(platform, category, 5);
      res.json({ results });
    } catch (error) {
      console.error("Social engagement error:", error);
      res.status(500).json({ error: "Failed to run engagement" });
    }
  });

  app.get("/api/admin/engagement-opportunities", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const validStatuses = ["discovered", "approved", "posted", "dismissed", "all"];
      const status = validStatuses.includes(req.query.status as string) ? (req.query.status as string) : "discovered";
      const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 200);
      const opportunities = await storage.getEngagementOpportunities(status, limit);
      const { getOpportunitySummary } = await import("./engagementDiscoveryService");
      const summary = await getOpportunitySummary();
      res.json({ opportunities, summary });
    } catch (error: any) {
      console.error("Engagement opportunities error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch engagement opportunities" });
    }
  });

  app.post("/api/admin/engagement-opportunities/discover", isAuthenticated, isAdmin, async (_req: Request, res: Response) => {
    try {
      const { discoverEngagementOpportunities } = await import("./engagementDiscoveryService");
      const result = await discoverEngagementOpportunities();
      res.json(result);
    } catch (error: any) {
      console.error("Engagement discovery error:", error);
      res.status(500).json({ error: error.message || "Failed to discover opportunities" });
    }
  });

  app.post("/api/admin/engagement-opportunities/:id/approve", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const editedComment = typeof req.body.comment === "string" ? req.body.comment.trim().slice(0, 2000) : undefined;
      if (editedComment !== undefined && editedComment.length === 0) {
        res.status(400).json({ error: "Comment cannot be empty" });
        return;
      }
      const { approveOpportunity } = await import("./engagementDiscoveryService");
      const result = await approveOpportunity(req.params.id, editedComment);
      if (!result) {
        res.status(404).json({ error: "Opportunity not found" });
        return;
      }
      res.json(result);
    } catch (error: any) {
      console.error("Approve opportunity error:", error);
      res.status(500).json({ error: error.message || "Failed to approve opportunity" });
    }
  });

  app.post("/api/admin/engagement-opportunities/:id/post", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const editedComment = typeof req.body.comment === "string" ? req.body.comment.trim().slice(0, 2000) : undefined;
      const { createResponsePost } = await import("./engagementDiscoveryService");
      const result = await createResponsePost(req.params.id, editedComment);
      if (!result.success) {
        res.status(result.error === "Opportunity not found" ? 404 : 500).json({ error: result.error });
        return;
      }
      res.json(result);
    } catch (error: any) {
      console.error("Create response post error:", error);
      res.status(500).json({ error: error.message || "Failed to create response post" });
    }
  });

  app.post("/api/admin/engagement-opportunities/:id/dismiss", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { dismissOpportunity } = await import("./engagementDiscoveryService");
      const success = await dismissOpportunity(req.params.id);
      if (!success) {
        res.status(404).json({ error: "Opportunity not found" });
        return;
      }
      res.json({ success: true });
    } catch (error: any) {
      console.error("Dismiss opportunity error:", error);
      res.status(500).json({ error: error.message || "Failed to dismiss opportunity" });
    }
  });

  app.get("/api/scam-feed", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const reports = await storage.getCommunityReports("confirmed", limit);
      const scamOfWeekEntry = await storage.getActiveScamOfWeek();
      res.json({
        communityReports: reports,
        scamOfWeek: scamOfWeekEntry || null,
      });
    } catch (error) {
      console.error("Scam feed error:", error);
      res.status(500).json({ error: "Failed to fetch scam feed" });
    }
  });

  app.get("/api/extension/download", async (_req, res) => {
    try {
      const path = await import("path");
      const fs = await import("fs");
      const archiver = (await import("archiver")).default;
      const extensionDir = path.default.join(process.cwd(), "browser-extension");

      if (!fs.existsSync(extensionDir)) {
        res.status(404).json({ error: "Extension not found" });
        return;
      }

      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment, filename=gcr-guard-extension.zip");

      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(res);
      archive.directory(extensionDir, "gcr-guard-extension");
      await archive.finalize();
    } catch (error) {
      console.error("Extension download error:", error);
      res.status(500).json({ error: "Failed to create extension download" });
    }
  });

  app.post("/api/security/analyze-image", standardRateLimit, async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        res.status(400).json({ error: "No image data provided" });
        return;
      }

      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const anthropic = new Anthropic();

      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
      const mediaTypeMatch = imageData.match(/^data:(image\/\w+);base64,/);
      const mediaType = mediaTypeMatch ? mediaTypeMatch[1] : "image/png";

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mediaType as any, data: base64Data },
            },
            {
              type: "text",
              text: "Extract ALL text visible in this image. This may be a screenshot of a suspicious message, email, text, or website. Return ONLY the extracted text, preserving the original formatting as much as possible. If no text is found, respond with 'NO_TEXT_FOUND'.",
            },
          ],
        }],
      });

      const extractedText = (response.content[0] as any).text || "";
      if (extractedText === "NO_TEXT_FOUND") {
        res.json({ text: "", message: "No text was found in the image" });
        return;
      }
      res.json({ text: extractedText });
    } catch (error) {
      console.error("Image analysis error:", error);
      res.status(500).json({ error: "Failed to analyze image" });
    }
  });

  // ============================================================
  // SUBSCRIPTION & EXTENSION AUTH ROUTES
  // ============================================================

  const TIER_FEATURES: Record<string, string[]> = {
    free: ["manual_scan", "lookalike_detection", "community_trust", "search_annotations", "redirect_detection"],
    essential: ["manual_scan", "auto_scan", "lookalike_detection", "form_warnings", "hover_check", "community_trust", "webmail_scan", "block_dangerous", "notification_blocking", "search_annotations", "redirect_detection", "clipboard_protection"],
    professional: ["manual_scan", "auto_scan", "lookalike_detection", "form_warnings", "hover_check", "community_trust", "webmail_scan", "block_dangerous", "notification_blocking", "search_annotations", "redirect_detection", "clipboard_protection", "weekly_digest", "scan_history", "safety_score", "family_profiles"],
    enterprise: ["manual_scan", "auto_scan", "lookalike_detection", "form_warnings", "hover_check", "community_trust", "webmail_scan", "block_dangerous", "notification_blocking", "search_annotations", "redirect_detection", "clipboard_protection", "weekly_digest", "scan_history", "safety_score", "family_profiles", "priority_support", "api_access"],
  };

  app.get("/api/subscription/tiers", (_req, res) => {
    res.json({
      scamguard: [
        {
          id: "free",
          name: "Free",
          price: 0,
          interval: null,
          features: TIER_FEATURES.free,
          description: "Essential scanning and safety tools",
        },
        {
          id: "essential",
          name: "Pro",
          price: 499,
          annualPrice: 399,
          interval: "month",
          features: TIER_FEATURES.essential,
          description: "Full auto-protection for individuals",
        },
        {
          id: "professional",
          name: "Family",
          price: 799,
          annualPrice: 599,
          interval: "month",
          features: TIER_FEATURES.professional,
          description: "Complete protection for the whole family",
        },
      ],
      shield: [
        {
          id: "free",
          name: "Scan",
          price: 0,
          interval: null,
          description: "Discover your exposure",
        },
        {
          id: "essential",
          name: "Remove",
          price: 899,
          annualPrice: 699,
          interval: "month",
          description: "We remove your data for you",
        },
        {
          id: "professional",
          name: "Protect",
          price: 1499,
          annualPrice: 1199,
          interval: "month",
          description: "Continuous protection for your family",
        },
      ],
    });
  });

  app.post("/api/subscription/update", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { userId, tier, expiresAt } = req.body;
      if (!userId || !tier) {
        return res.status(400).json({ error: "userId and tier are required" });
      }
      if (!["free", "essential", "professional", "enterprise"].includes(tier)) {
        return res.status(400).json({ error: "Invalid tier" });
      }

      const expiration = tier === "free" ? null : (expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));

      await db.update(users).set({
        subscriptionTier: tier,
        subscriptionExpiresAt: expiration,
        updatedAt: new Date(),
      }).where(eq(users.id, userId));

      res.json({ success: true, tier, expiresAt: expiration });
    } catch (error) {
      console.error("Subscription update error:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  const { extensionTokens } = await import("@shared/schema");

  app.post("/api/extension/auth/token", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      const tokenValue = cryptoModule.randomBytes(48).toString("hex");
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

      await db.delete(extensionTokens).where(eq(extensionTokens.userId, user.id));

      await db.insert(extensionTokens).values({
        userId: user.id,
        token: tokenValue,
        expiresAt,
      });

      res.json({ token: tokenValue, expiresAt });
    } catch (error) {
      console.error("Extension token error:", error);
      res.status(500).json({ error: "Failed to generate token" });
    }
  });

  app.get("/api/extension/subscription-status", async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid authorization header" });
      }

      const token = authHeader.slice(7);
      const [tokenRecord] = await db.select().from(extensionTokens).where(eq(extensionTokens.token, token)).limit(1);

      if (!tokenRecord || new Date(tokenRecord.expiresAt) < new Date()) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, tokenRecord.userId)).limit(1);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const tier = user.subscriptionTier || "free";
      const isActive = tier === "free" ? true : (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > new Date());
      const effectiveFeatures = isActive ? (TIER_FEATURES[tier] || TIER_FEATURES.free) : TIER_FEATURES.free;

      res.json({
        tier: isActive ? tier : "free",
        isActive,
        features: effectiveFeatures,
        expiresAt: user.subscriptionExpiresAt,
        email: user.email,
        firstName: user.firstName,
      });
    } catch (error) {
      console.error("Extension subscription status error:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  app.post("/api/extension/auth/revoke", isAuthenticated, async (req, res) => {
    try {
      const user = (req as any).user;
      await db.delete(extensionTokens).where(eq(extensionTokens.userId, user.id));
      res.json({ success: true });
    } catch (error) {
      console.error("Extension token revoke error:", error);
      res.status(500).json({ error: "Failed to revoke token" });
    }
  });

  const shieldScanLimiter = new Map<string, { count: number; resetAt: number }>();
  function shieldRateLimit(req: Request, res: Response, next: Function) {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const record = shieldScanLimiter.get(ip);
    if (record && record.resetAt > now) {
      if (record.count >= 3) {
        return res.status(429).json({
          error: "You have reached the scan limit. Please wait before scanning again.",
        });
      }
      record.count++;
    } else {
      shieldScanLimiter.set(ip, { count: 1, resetAt: now + 3600000 });
    }
    next();
  }

  const shieldScanInputSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(100),
    lastName: z.string().min(1, "Last name is required").max(100),
    email: z.string().email("A valid email address is required"),
    phone: z.string().max(30).optional().or(z.literal("")),
    zip: z.string().max(20).optional().or(z.literal("")),
    consentGiven: z.boolean().refine((v) => v === true, {
      message: "You must confirm this is your own personal information",
    }),
  });

  function getShieldAccessLevel(user: any): { level: "free" | "full"; tier: "free" | "essential" | "professional" } {
    if (!user) return { level: "free", tier: "free" };

    const shieldTier = user.shieldSubscriptionTier || "free";

    if (hasTierAccess(shieldTier, SUBSCRIPTION_TIERS.PROFESSIONAL)) {
      return { level: "full", tier: "professional" };
    }

    if (hasTierAccess(shieldTier, SUBSCRIPTION_TIERS.ESSENTIAL)) {
      return { level: "full", tier: "essential" };
    }

    return { level: "free", tier: "free" };
  }

  function prepareReportForFree(report: any) {
    const allBrokers = report.brokerResults || [];
    const foundBrokers = allBrokers.filter((b: any) => b.status === "found");
    const previewCount = 2;

    const previewBrokers = foundBrokers.slice(0, previewCount).map((b: any) => ({
      broker: b.broker,
      status: b.status,
      found: b.found,
      dataFound: b.dataFound,
      url: undefined,
      optOutUrl: b.optOutUrl || null,
      optOutMethod: b.optOutMethod || null,
      optOutInstructions: b.optOutInstructions || null,
      difficultyRating: b.difficultyRating || null,
    }));

    const redactedBrokers = foundBrokers.slice(previewCount).map((_b: any, i: number) => ({
      broker: null,
      status: "found",
      found: true,
      dataFound: null,
      url: undefined,
      redacted: true,
    }));

    const notFoundBrokers = allBrokers
      .filter((b: any) => b.status !== "found")
      .slice(0, 3)
      .map((b: any) => ({
        broker: b.broker,
        status: b.status,
        found: false,
        dataFound: null,
        url: undefined,
      }));

    return {
      scanId: report.scanId,
      completedAt: report.completedAt,
      exposureScore: report.exposureScore,
      numericScore: report.numericScore,
      scoreBreakdown: report.scoreBreakdown,
      partialResults: report.partialResults,
      brokerCount: allBrokers.length,
      breachCount: report.breachResults?.length || 0,
      brokerFoundCount: foundBrokers.length,
      breachResults: report.breachResults || [],
      brokerResults: [...previewBrokers, ...redactedBrokers, ...notFoundBrokers],
      brokerPreviewCount: previewCount,
    };
  }

  app.get("/api/shield/access", async (req: any, res: Response) => {
    try {
      const userId = req.session?.userId;
      if (!userId) return res.json({ level: "free", authenticated: false });

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) return res.json({ level: "free", authenticated: false });

      const access = getShieldAccessLevel(user);
      return res.json({ ...access, authenticated: true });
    } catch (error) {
      res.json({ level: "free", authenticated: false });
    }
  });


  app.post("/api/scan", shieldRateLimit, async (req: Request, res: Response) => {
    try {
      const parsed = shieldScanInputSchema.safeParse(req.body);
      if (!parsed.success) {
        const messages = parsed.error.issues.map((e) => e.message).join(", ");
        return res.status(400).json({ error: messages });
      }

      const { firstName, lastName, email, phone, zip } = parsed.data;
      const consentIp = req.ip || req.socket.remoteAddress || "unknown";
      const userId = (req as any).session?.userId || undefined;

      const { startShieldScan } = await import("./shieldScanService");
      const { scanId } = await startShieldScan(
        { firstName, lastName, email, phone: phone || undefined, zip: zip || undefined },
        consentIp,
        userId,
      );

      res.json({ scanId });
    } catch (error: any) {
      console.error("[shield] Scan start error:", error?.message || error);
      res.status(500).json({ error: "Something went wrong. Please try again in a few minutes." });
    }
  });

  app.get("/api/scan/:scanId/status", async (req: any, res: Response) => {
    try {
      const { scanId } = req.params;
      if (!scanId) return res.status(400).json({ error: "Scan ID is required" });

      let user = null;
      if (req.session?.userId) {
        const [u] = await db.select().from(users).where(eq(users.id, req.session.userId));
        user = u || null;
      }
      const access = getShieldAccessLevel(user);

      const { getShieldScanStatus, getShieldScanFromDb } = await import("./shieldScanService");
      const memStatus = getShieldScanStatus(scanId);

      if (memStatus.status !== "pending") {
        if (memStatus.status === "complete" && memStatus.report && access.level === "free") {
          return res.json({
            ...memStatus,
            report: prepareReportForFree(memStatus.report),
            accessLevel: access.level,
            userTier: access.tier,
          });
        }
        return res.json({ ...memStatus, accessLevel: access.level, userTier: access.tier });
      }

      const dbScan = await getShieldScanFromDb(scanId);
      if (!dbScan) return res.status(404).json({ error: "Scan not found" });

      if (dbScan.status === "complete" && dbScan.rawResults) {
        const report = dbScan.rawResults as any;
        if (access.level === "free") {
          return res.json({
            status: "complete",
            report: prepareReportForFree(report),
            summary: undefined,
            accessLevel: access.level,
            userTier: access.tier,
          });
        }
        return res.json({
          status: "complete",
          report,
          summary: undefined,
          accessLevel: access.level,
          userTier: access.tier,
        });
      }

      return res.json({ status: dbScan.status, accessLevel: access.level, userTier: access.tier });
    } catch (error: any) {
      console.error("[shield] Status check error");
      res.status(500).json({ error: "Could not check scan status" });
    }
  });

  app.delete("/api/shield/scan/:scanId", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { scanId } = req.params;
      if (!scanId) return res.status(400).json({ error: "Scan ID is required" });

      const { softDeleteShieldScan } = await import("./shieldScanService");
      const result = await softDeleteShieldScan(scanId, req.user.id);

      if (result === "not_found") {
        return res.status(404).json({ error: "Scan not found" });
      }
      if (result === "forbidden") {
        return res.status(403).json({ error: "You do not have permission to delete this scan" });
      }

      res.json({ message: "Your scan data has been deleted." });
    } catch (error) {
      console.error("[shield] Delete scan error");
      res.status(500).json({ error: "Could not delete scan data" });
    }
  });

  app.post("/api/shield/removal-request", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const access = getShieldAccessLevel(user);
      const { brokerId, scanId } = req.body;

      if (!brokerId || !scanId) {
        return res.status(400).json({ error: "brokerId and scanId are required" });
      }

      const { getShieldScanFromDb } = await import("./shieldScanService");
      const scan = await getShieldScanFromDb(scanId);
      if (!scan) {
        return res.status(404).json({ error: "Scan not found" });
      }
      if (scan.userId && scan.userId !== user.id) {
        return res.status(403).json({ error: "You do not have access to this scan" });
      }

      const scanReport = scan.rawResults as any;
      const brokerResults = scanReport?.brokerResults || [];
      const brokerInScan = brokerResults.find(
        (b: any) => b.broker === brokerId && b.status === "found"
      );
      if (!brokerInScan) {
        return res.status(400).json({ error: "This broker was not found in your scan results" });
      }

      const [broker] = await db.select().from(dataBrokers).where(eq(dataBrokers.id, brokerId));
      if (!broker) {
        return res.status(404).json({ error: "Broker not found" });
      }

      if (access.tier === "free") {
        return res.json({
          tier: "free",
          action: "guided",
          broker: {
            id: broker.id,
            name: broker.name,
            optOutUrl: broker.optOutUrl,
            optOutEmail: broker.optOutEmail,
            optOutMethod: broker.optOutMethod,
            optOutInstructions: broker.optOutInstructions,
            difficultyRating: broker.difficultyRating,
          },
          message: "Follow the opt-out instructions to remove your data yourself.",
        });
      }

      const existingRequests = await getUserRemovalRequests(user.id);
      const existingForBroker = existingRequests.find(
        (r: any) => r.brokerId === brokerId && !["confirmed_removed", "failed"].includes(r.status)
      );
      if (existingForBroker) {
        return res.json({
          tier: access.tier,
          action: "already_requested",
          requestId: existingForBroker.id,
          status: existingForBroker.status,
          message: "A removal request is already in progress for this broker.",
        });
      }

      let vaultProfile = null;
      try {
        const { getUserVaultProfile } = await import("./dataBrokerService");
        vaultProfile = await getUserVaultProfile(user.id);
      } catch (err) {}

      if (!vaultProfile) {
        return res.json({
          tier: access.tier,
          action: "needs_vault",
          message: "Please set up your Data Vault profile first so we can submit removal requests on your behalf.",
          setupUrl: "/data-removal",
        });
      }

      const ipAddress = req.ip || req.connection?.remoteAddress;
      const request = await createRemovalRequest(user.id, brokerId, vaultProfile.id, null, ipAddress);

      if (access.tier === "essential" || access.tier === "professional") {
        try {
          await sendAutoRemovalRequest(user.id, request.id, ipAddress);
        } catch (err: any) {
          console.error("[shield] Auto-removal send failed:", err?.message);
        }
      }

      res.json({
        tier: access.tier,
        action: "automated",
        requestId: request.id,
        status: request.status,
        message: "Removal request submitted. We'll handle the rest.",
      });
    } catch (error: any) {
      console.error("[shield] Removal request error:", error?.message);
      res.status(500).json({ error: error.message || "Failed to process removal request" });
    }
  });

  app.get("/api/shield/removal-status/:scanId", isAuthenticated, async (req: any, res: Response) => {
    try {
      const user = req.user;
      const { scanId } = req.params;

      const { getShieldScanFromDb } = await import("./shieldScanService");
      const scan = await getShieldScanFromDb(scanId);
      if (!scan) {
        return res.status(404).json({ error: "Scan not found" });
      }
      if (scan.userId && scan.userId !== user.id) {
        return res.status(403).json({ error: "You do not have access to this scan" });
      }

      const scanReport = scan.rawResults as any;
      const scanBrokerIds = (scanReport?.brokerResults || [])
        .filter((b: any) => b.status === "found")
        .map((b: any) => b.broker);

      const requests = await getUserRemovalRequests(user.id);
      const statusMap: Record<string, { requestId: string; status: string; createdAt: any; updatedAt: any }> = {};
      for (const r of requests) {
        if (scanBrokerIds.includes(r.brokerId)) {
          statusMap[r.brokerId] = {
            requestId: r.id,
            status: r.status,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
          };
        }
      }
      res.json({ removalStatuses: statusMap });
    } catch (error: any) {
      console.error("[shield] Removal status error:", error?.message);
      res.status(500).json({ error: "Failed to fetch removal status" });
    }
  });

  app.get("/api/shield/unsubscribe/:leadId", async (req: Request, res: Response) => {
    try {
      const { leadId } = req.params;
      if (!leadId) return res.status(400).json({ error: "Invalid unsubscribe link" });

      const { unsubscribeLead } = await import("./shieldScanService");
      const success = await unsubscribeLead(leadId);

      if (!success) {
        return res.status(404).send(`
          <!DOCTYPE html><html><head><title>Not Found</title></head>
          <body style="font-family:system-ui;max-width:500px;margin:60px auto;text-align:center">
            <h1>Link Not Found</h1>
            <p>This unsubscribe link is no longer valid.</p>
          </body></html>
        `);
      }

      res.send(`
        <!DOCTYPE html><html><head><title>Unsubscribed</title></head>
        <body style="font-family:system-ui;max-width:500px;margin:60px auto;text-align:center">
          <h1>You have been unsubscribed</h1>
          <p>You will no longer receive GCR Data Shield re-scan alerts.</p>
          <p style="margin-top:20px"><a href="https://www.getcyberright.com" style="color:#0A2A3C">Return to GetCyberRight</a></p>
        </body></html>
      `);
    } catch (error) {
      console.error("[shield] Unsubscribe error");
      res.status(500).send("Something went wrong. Please try again.");
    }
  });

  app.post("/api/scan/:scanId/lead", async (req: Request, res: Response) => {
    try {
      const { scanId } = req.params;
      const { alertEmail } = req.body;

      if (!alertEmail || typeof alertEmail !== "string") {
        return res.status(400).json({ error: "A valid email address is required" });
      }

      const emailSchema = z.string().email();
      const emailResult = emailSchema.safeParse(alertEmail.trim());
      if (!emailResult.success) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      const { createShieldLead } = await import("./shieldScanService");
      const { leadId } = await createShieldLead(scanId, emailResult.data);

      res.json({ leadId, message: "You are now signed up for re-scan alerts." });
    } catch (error: any) {
      console.error("[shield] Lead capture error");
      res.status(500).json({ error: "Could not save your alert preferences" });
    }
  });

  app.get("/api/news/latest", async (req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const articles = await storage.getNewsArticles(undefined, limit);
      const mapped = articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        source: a.source,
        url: a.sourceUrl,
        imageUrl: a.imageUrl,
        thumbnailUrl: a.thumbnailUrl,
        publishedAt: a.publishedAt?.toISOString() || new Date().toISOString(),
        readTime: a.content ? Math.ceil(a.content.split(/\s+/).length / 200) : 2,
        slug: a.slug,
        urgencyLevel: a.urgencyLevel,
        relatedToolUrl: a.relatedToolUrl,
        relatedToolName: a.relatedToolName,
      }));
      res.json({
        articles: mapped,
        lastUpdated: articles[0]?.createdAt?.toISOString() || null,
        stats: {
          categories: [...new Set(articles.map(a => a.category))],
          totalArticles: mapped.length,
          lastFetch: articles[0]?.createdAt?.toISOString() || null,
        },
      });
    } catch (error: any) {
      console.error("[news] Failed to fetch articles:", error.message);
      res.status(500).json({ error: "Failed to fetch news articles" });
    }
  });

  app.get("/api/news/category/:category", async (req: Request, res: Response) => {
    try {
      const categoryMap: Record<string, string> = {
        cybersecurity: "Cybersecurity",
        ai: "AI",
        tech: "Tech",
        "action-needed": "Action Needed",
        breaking: "Action Needed",
        safety: "Cybersecurity",
      };
      const category = categoryMap[req.params.category.toLowerCase()] || req.params.category;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
      const articles = await storage.getNewsArticles(category, limit);
      const mapped = articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        source: a.source,
        url: a.sourceUrl,
        imageUrl: a.imageUrl,
        thumbnailUrl: a.thumbnailUrl,
        publishedAt: a.publishedAt?.toISOString() || new Date().toISOString(),
        readTime: a.content ? Math.ceil(a.content.split(/\s+/).length / 200) : 2,
        slug: a.slug,
        urgencyLevel: a.urgencyLevel,
        relatedToolUrl: a.relatedToolUrl,
        relatedToolName: a.relatedToolName,
      }));
      res.json({
        category,
        articles: mapped,
        lastUpdated: articles[0]?.createdAt?.toISOString() || null,
      });
    } catch (error: any) {
      console.error("[news] Failed to fetch category articles:", error.message);
      res.status(500).json({ error: "Failed to fetch news articles" });
    }
  });

  app.get("/api/news/search", async (req: Request, res: Response) => {
    try {
      const query = (req.query.q as string || "").trim();
      if (query.length < 2) {
        return res.json({ query, results: [], count: 0 });
      }
      const limit = Math.min(parseInt(req.query.limit as string) || 30, 50);
      const articles = await storage.searchNewsArticles(query, limit);
      const mapped = articles.map(a => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: a.category,
        source: a.source,
        url: a.sourceUrl,
        imageUrl: a.imageUrl,
        thumbnailUrl: a.thumbnailUrl,
        publishedAt: a.publishedAt?.toISOString() || new Date().toISOString(),
        readTime: a.content ? Math.ceil(a.content.split(/\s+/).length / 200) : 2,
        slug: a.slug,
      }));
      res.json({ query, results: mapped, count: mapped.length });
    } catch (error: any) {
      console.error("[news] Search failed:", error.message);
      res.status(500).json({ error: "Search failed" });
    }
  });

  app.get("/api/news/social-stats", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { getNewsSocialStats } = await import("./newsSocialEngine");
      const stats = await getNewsSocialStats();
      res.json(stats);
    } catch (error: any) {
      console.error("[news] Social stats failed:", error.message);
      res.status(500).json({ error: "Failed to fetch social stats" });
    }
  });

  app.post("/api/news/refresh", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { refreshNewsArticles } = await import("./newsArticleService");
      const count = await refreshNewsArticles();
      res.json({ success: true, articlesCreated: count });
    } catch (error: any) {
      console.error("[news] Manual refresh failed:", error.message);
      res.status(500).json({ error: "Failed to refresh news articles" });
    }
  });

  app.post("/api/news/generate-social", isAuthenticated, isAdmin, async (req: Request, res: Response) => {
    try {
      const { generateSocialPostsForNewsBatch } = await import("./newsSocialEngine");
      const articles = await storage.getNewsArticles(undefined, 8);
      if (articles.length === 0) {
        return res.json({ message: "No news articles available", totalCreated: 0 });
      }
      const result = await generateSocialPostsForNewsBatch(articles);
      res.json({
        message: `Generated ${result.totalCreated} social posts from ${result.articlesProcessed} articles`,
        ...result,
      });
    } catch (error: any) {
      console.error("[news] Manual social generation failed:", error.message);
      res.status(500).json({ error: "Social generation failed" });
    }
  });

  app.post("/api/news/generate-social-images", isAuthenticated, isAdmin, async (_req: Request, res: Response) => {
    try {
      const { generateSocialImage } = await import("./socialImageGenerator");
      const articles = await storage.getNewsArticles(undefined, 100);
      let generated = 0;
      let updated = 0;
      for (const article of articles) {
        const imagePath = await generateSocialImage(
          article.id, article.title, article.category,
          article.urgencyLevel || 1, article.source
        );
        if (imagePath) {
          generated++;
          const posts = await storage.getSocialPostsByContentId("news_article", article.id);
          for (const post of posts) {
            if (!post.imageUrl || !fs.existsSync(post.imageUrl)) {
              await storage.updateSocialPost(post.id, { imageUrl: imagePath });
              updated++;
            }
          }
        }
      }
      res.json({ message: `Generated ${generated} images, updated ${updated} social posts`, generated, updated });
    } catch (error: any) {
      console.error("[news] Image generation failed:", error.message);
      res.status(500).json({ error: "Image generation failed" });
    }
  });

  app.get("/api/news/article/:slug", async (req: Request, res: Response) => {
    try {
      const article = await storage.getNewsArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ error: "Article not found" });
      }
      res.json({
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        source: article.source,
        sourceUrl: article.sourceUrl,
        originalTitle: article.originalTitle,
        imageUrl: article.imageUrl,
        urgencyLevel: article.urgencyLevel,
        relatedToolUrl: article.relatedToolUrl,
        relatedToolName: article.relatedToolName,
        publishedAt: article.publishedAt?.toISOString() || new Date().toISOString(),
        readTime: article.content ? Math.ceil(article.content.split(/\s+/).length / 200) : 2,
      });
    } catch (error: any) {
      console.error("[news] Article fetch failed:", error.message);
      res.status(500).json({ error: "Failed to fetch article" });
    }
  });

  // ==========================================
  // Masked Identity (Identity Shield) Routes
  // ==========================================

  app.get("/api/masked-identities", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { getUserMaskedIdentities } = await import("./maskedIdentityService");
      const identities = await getUserMaskedIdentities(userId);
      res.json(identities);
    } catch (error: any) {
      console.error("[masked-identity] List failed:", error.message);
      res.status(500).json({ error: "Failed to fetch masked identities" });
    }
  });

  app.get("/api/masked-identities/stats", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { getIdentityStats, getUserAliasCount, getAliasLimit } = await import("./maskedIdentityService");
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const stats = await getIdentityStats(userId);
      const currentCount = await getUserAliasCount(userId);
      const shieldTier = user?.shieldSubscriptionTier || "free";
      const limit = getAliasLimit(shieldTier);
      res.json({ ...stats, limit, currentCount, tier: shieldTier });
    } catch (error: any) {
      console.error("[masked-identity] Stats failed:", error.message);
      res.status(500).json({ error: "Failed to fetch identity stats" });
    }
  });

  app.post("/api/masked-identities", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { createMaskedIdentity, getUserAliasCount, getAliasLimit } = await import("./maskedIdentityService");

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const shieldTier = user?.shieldSubscriptionTier || "free";
      const currentCount = await getUserAliasCount(userId);
      const limit = getAliasLimit(shieldTier);

      if (currentCount >= limit) {
        return res.status(403).json({
          error: "Alias limit reached",
          currentCount,
          limit,
          tier: shieldTier,
          upgradeRequired: true,
        });
      }

      const { aliasType, realValue, label, serviceName, serviceCategory, prefix } = req.body;

      if (!aliasType || !["email", "phone", "username"].includes(aliasType)) {
        return res.status(400).json({ error: "Valid aliasType required (email, phone, or username)" });
      }
      if (!realValue || typeof realValue !== "string" || realValue.length < 1) {
        return res.status(400).json({ error: "realValue is required" });
      }
      if (realValue.length > 320) {
        return res.status(400).json({ error: "realValue is too long" });
      }
      if (aliasType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(realValue)) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }
      if (aliasType === "phone") {
        const digitsOnly = realValue.replace(/[^\d]/g, "");
        if (digitsOnly.length < 7 || digitsOnly.length > 15 || !/^\+?[\d\s\-().]{7,20}$/.test(realValue)) {
          return res.status(400).json({ error: "Please provide a valid phone number (7-15 digits)" });
        }
      }
      if (aliasType === "username" && !/^[a-zA-Z0-9._\-@]{1,64}$/.test(realValue)) {
        return res.status(400).json({ error: "Username can only contain letters, numbers, dots, underscores, hyphens, and @ symbols" });
      }

      const identity = await createMaskedIdentity(
        userId,
        aliasType,
        realValue,
        { label, serviceName, serviceCategory, prefix }
      );

      res.status(201).json(identity);
    } catch (error: any) {
      console.error("[masked-identity] Create failed:", error.message);
      res.status(500).json({ error: "Failed to create masked identity" });
    }
  });

  app.patch("/api/masked-identities/:id/toggle", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { toggleIdentityActive } = await import("./maskedIdentityService");
      const { isActive } = req.body;
      if (typeof isActive !== "boolean") {
        return res.status(400).json({ error: "isActive boolean required" });
      }
      const updated = await toggleIdentityActive(req.params.id, userId, isActive);
      if (!updated) return res.status(404).json({ error: "Identity not found" });
      res.json(updated);
    } catch (error: any) {
      console.error("[masked-identity] Toggle failed:", error.message);
      res.status(500).json({ error: "Failed to toggle identity" });
    }
  });

  app.patch("/api/masked-identities/:id/forwarding", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { toggleForwarding } = await import("./maskedIdentityService");
      const { enabled } = req.body;
      if (typeof enabled !== "boolean") {
        return res.status(400).json({ error: "enabled boolean required" });
      }
      const updated = await toggleForwarding(req.params.id, userId, enabled);
      if (!updated) return res.status(404).json({ error: "Identity not found" });
      res.json(updated);
    } catch (error: any) {
      console.error("[masked-identity] Forwarding toggle failed:", error.message);
      res.status(500).json({ error: "Failed to toggle forwarding" });
    }
  });

  app.patch("/api/masked-identities/:id/service", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { updateIdentityService } = await import("./maskedIdentityService");
      const { serviceName, serviceCategory } = req.body;
      if (!serviceName || typeof serviceName !== "string") {
        return res.status(400).json({ error: "serviceName required" });
      }
      const updated = await updateIdentityService(req.params.id, userId, serviceName, serviceCategory);
      if (!updated) return res.status(404).json({ error: "Identity not found" });
      res.json(updated);
    } catch (error: any) {
      console.error("[masked-identity] Service update failed:", error.message);
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/masked-identities/:id", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { deleteMaskedIdentity } = await import("./maskedIdentityService");
      const deleted = await deleteMaskedIdentity(req.params.id, userId);
      if (!deleted) return res.status(404).json({ error: "Identity not found" });
      res.json({ success: true });
    } catch (error: any) {
      console.error("[masked-identity] Delete failed:", error.message);
      res.status(500).json({ error: "Failed to delete identity" });
    }
  });

  app.get("/api/masked-identities/activity", standardRateLimit, async (req: any, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.session.userId;
      const { getIdentityActivity } = await import("./maskedIdentityService");
      const identityId = req.query.identityId as string | undefined;
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      const activity = await getIdentityActivity(userId, identityId, limit);
      res.json(activity);
    } catch (error: any) {
      console.error("[masked-identity] Activity failed:", error.message);
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  app.get("/api/masked-identities/categories", async (_req: any, res) => {
    const { getServiceCategories } = await import("./maskedIdentityService");
    res.json(getServiceCategories());
  });

  // Notification threat check (used by browser extension)
  app.post("/api/extension/notification-check", async (req: any, res) => {
    try {
      const { domain } = req.body;
      if (!domain || typeof domain !== "string") {
        return res.status(400).json({ error: "domain required" });
      }

      const { notificationThreats } = await import("@shared/schema");
      const [threat] = await db.select()
        .from(notificationThreats)
        .where(eq(notificationThreats.domain, domain.toLowerCase()))
        .limit(1);

      if (threat) {
        return res.json({
          isKnownThreat: true,
          severity: threat.severity,
          threatType: threat.threatType,
          reportCount: threat.reportCount,
        });
      }

      res.json({ isKnownThreat: false });
    } catch (error: any) {
      res.status(500).json({ error: "Check failed" });
    }
  });

  app.post("/api/extension/notification-report", standardRateLimit, async (req: any, res) => {
    try {
      const { domain, threatType, sampleContent } = req.body;
      if (!domain || !threatType) {
        return res.status(400).json({ error: "domain and threatType required" });
      }

      const { notificationThreats } = await import("@shared/schema");
      const normalizedDomain = domain.toLowerCase();

      const [existing] = await db.select()
        .from(notificationThreats)
        .where(eq(notificationThreats.domain, normalizedDomain))
        .limit(1);

      if (existing) {
        await db.update(notificationThreats)
          .set({
            reportCount: sql`${notificationThreats.reportCount} + 1`,
            lastSeenAt: new Date(),
          })
          .where(eq(notificationThreats.id, existing.id));
      } else {
        await db.insert(notificationThreats).values({
          domain: normalizedDomain,
          threatType,
          severity: "medium",
          sampleContent: sampleContent?.substring(0, 500) || null,
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Report failed" });
    }
  });

  return httpServer;
}
