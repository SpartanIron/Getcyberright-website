import helmet from "helmet";
import type { Express, Request, Response, NextFunction } from "express";
import winston from "winston";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { checkRateLimitAlert, checkCSRFAlert, checkSuspiciousPatternAlert } from "./security-alerts";

// Security Alert Configuration
const SECURITY_ALERT_EMAIL = process.env.SECURITY_ALERT_EMAIL || "";
const ALERT_COOLDOWN_MS = 300000; // 5 minutes between same alert types
const alertCooldowns = new Map<string, number>();

// Security Alert Types
export type SecurityAlertType = 
  | "brute_force_attack"
  | "critical_anomaly"
  | "rate_limit_exceeded"
  | "suspicious_pattern"
  | "ip_blocked";

interface SecurityAlertPayload {
  type: SecurityAlertType;
  severity: "warning" | "critical";
  ip: string;
  details: string;
  timestamp: Date;
  mitreAttack?: string;
}

// Queue for pending security alerts (can be processed by email service)
const pendingAlerts: SecurityAlertPayload[] = [];
const MAX_PENDING_ALERTS = 100;

// Send security alert (logs and queues for email delivery)
export function sendSecurityAlert(payload: SecurityAlertPayload): void {
  const alertKey = `${payload.type}:${payload.ip}`;
  const now = Date.now();
  const lastAlert = alertCooldowns.get(alertKey);
  
  // Rate limit same alerts from same IP
  if (lastAlert && now - lastAlert < ALERT_COOLDOWN_MS) {
    return; // Skip duplicate alert within cooldown
  }
  
  alertCooldowns.set(alertKey, now);
  
  // Log the alert
  securityLogger.warn("SECURITY ALERT", {
    ...payload,
    alertEmail: SECURITY_ALERT_EMAIL ? "configured" : "not_configured",
  });
  
  // Queue alert for email delivery
  if (pendingAlerts.length < MAX_PENDING_ALERTS) {
    pendingAlerts.push(payload);
  }
  
  // Clean up old cooldowns periodically
  if (alertCooldowns.size > 1000) {
    for (const [key, time] of alertCooldowns.entries()) {
      if (now - time > ALERT_COOLDOWN_MS * 2) {
        alertCooldowns.delete(key);
      }
    }
  }
}

// Get pending alerts for email processing
export function getPendingAlerts(): SecurityAlertPayload[] {
  return [...pendingAlerts];
}

// Clear pending alerts after processing
export function clearPendingAlerts(): void {
  pendingAlerts.length = 0;
}

// Get alert count for metrics
export function getAlertStats(): { pending: number; cooldownEntries: number } {
  return {
    pending: pendingAlerts.length,
    cooldownEntries: alertCooldowns.size,
  };
}

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security Logger Configuration with file output for centralized logging
export const securityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "getcyberright-security" },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [SECURITY] ${level}: ${message}${metaStr}`;
        })
      ),
    }),
    // File transport for centralized logging / SIEM integration
    new winston.transports.File({
      filename: path.join(logsDir, "security.log"),
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5, // Keep last 5 files
    }),
    // Separate file for security incidents only
    new winston.transports.File({
      filename: path.join(logsDir, "security-incidents.log"),
      level: "warn",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
  ],
});

// Rate limiter with different tiers
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitTiers: Record<string, RateLimitConfig> = {
  // Strict: Forms, authentication endpoints
  strict: { windowMs: 60000, maxRequests: 10 },
  // Standard: General API endpoints
  standard: { windowMs: 60000, maxRequests: 30 },
  // Relaxed: Static resources, health checks
  relaxed: { windowMs: 60000, maxRequests: 100 },
};

// Centralized IP blocklist for security violations
class IPBlocklist {
  private blockedIPs: Map<string, { until: number; reason: string; severity: string }> = new Map();
  
  block(ip: string, durationMs: number, reason: string, severity: "warning" | "critical" = "warning") {
    const until = Date.now() + durationMs;
    this.blockedIPs.set(ip, { until, reason, severity });
    securityLogger.warn("IP blocked", { ip, reason, severity, blockedUntil: new Date(until).toISOString() });
  }
  
  isBlocked(ip: string): { blocked: boolean; reason?: string; remainingMs?: number } {
    const entry = this.blockedIPs.get(ip);
    if (!entry) return { blocked: false };
    
    const now = Date.now();
    if (now >= entry.until) {
      this.blockedIPs.delete(ip);
      return { blocked: false };
    }
    
    return { blocked: true, reason: entry.reason, remainingMs: entry.until - now };
  }
  
  getBlockedCount(): number {
    this.cleanup();
    return this.blockedIPs.size;
  }
  
  getBlockedIPs(): Array<{ ip: string; reason: string; until: string; severity: string }> {
    this.cleanup();
    return Array.from(this.blockedIPs.entries()).map(([ip, data]) => ({
      ip,
      reason: data.reason,
      until: new Date(data.until).toISOString(),
      severity: data.severity,
    }));
  }
  
  unblock(ip: string): boolean {
    return this.blockedIPs.delete(ip);
  }
  
  cleanup() {
    const now = Date.now();
    for (const [ip, data] of this.blockedIPs.entries()) {
      if (now >= data.until) this.blockedIPs.delete(ip);
    }
  }
}

export const ipBlocklist = new IPBlocklist();

// Failed login tracker for brute force detection (MITRE: T1110)
class FailedLoginTracker {
  private attempts: Map<string, { count: number; firstAttempt: number; lastAttempt: number }> = new Map();
  private readonly WINDOW_MS = 900000; // 15 minute window
  private readonly MAX_ATTEMPTS = 5; // Block after 5 failed attempts
  private readonly BLOCK_DURATION = 900000; // 15 minute block
  
  recordFailedAttempt(ip: string, username?: string): { shouldBlock: boolean; attempts: number } {
    const now = Date.now();
    const key = ip; // Track by IP primarily
    
    let record = this.attempts.get(key);
    
    if (!record || now - record.firstAttempt > this.WINDOW_MS) {
      record = { count: 1, firstAttempt: now, lastAttempt: now };
    } else {
      record.count++;
      record.lastAttempt = now;
    }
    
    this.attempts.set(key, record);
    
    const shouldBlock = record.count >= this.MAX_ATTEMPTS;
    
    if (shouldBlock) {
      ipBlocklist.block(ip, this.BLOCK_DURATION, "brute_force_login", "critical");
      securityLogger.error("Brute force login attempt detected", {
        ip,
        username: username || "unknown",
        attempts: record.count,
        mitreAttack: "T1110",
        action: "blocked",
      });
      
      // Send security alert for brute force attack
      sendSecurityAlert({
        type: "brute_force_attack",
        severity: "critical",
        ip,
        details: `Brute force login attack detected. ${record.count} failed attempts for user "${username || "unknown"}". IP has been blocked for 15 minutes.`,
        timestamp: new Date(),
        mitreAttack: "T1110",
      });
      
      this.attempts.delete(key); // Reset after blocking
    } else if (record.count >= 3) {
      securityLogger.warn("Multiple failed login attempts", {
        ip,
        username: username || "unknown",
        attempts: record.count,
        mitreAttack: "T1110",
      });
    }
    
    return { shouldBlock, attempts: record.count };
  }
  
  recordSuccessfulLogin(ip: string) {
    this.attempts.delete(ip);
  }
  
  getStats(): { trackedIPs: number; highRiskIPs: number } {
    const now = Date.now();
    let highRisk = 0;
    for (const [key, record] of this.attempts.entries()) {
      if (now - record.firstAttempt > this.WINDOW_MS) {
        this.attempts.delete(key);
      } else if (record.count >= 3) {
        highRisk++;
      }
    }
    return { trackedIPs: this.attempts.size, highRiskIPs: highRisk };
  }
}

export const failedLoginTracker = new FailedLoginTracker();

// Enhanced rate limiter with IP tracking and logging
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number; violations: number }> = new Map();
  private readonly BLOCK_DURATION = 300000; // 5 minutes

  checkLimit(ip: string, tier: keyof typeof rateLimitTiers = "standard"): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const config = rateLimitTiers[tier];
    
    // Check if IP is blocked using centralized blocklist
    const blockStatus = ipBlocklist.isBlocked(ip);
    if (blockStatus.blocked) {
      securityLogger.warn("Blocked IP attempted access", { ip, reason: blockStatus.reason });
      return { allowed: false, remaining: 0, resetIn: Math.ceil((blockStatus.remainingMs || 0) / 1000) };
    }

    let record = this.requests.get(ip);
    
    // Reset if window expired
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + config.windowMs, violations: record?.violations || 0 };
    }

    record.count++;
    
    if (record.count > config.maxRequests) {
      record.violations++;
      
      // Block IP after 3 violations using centralized blocklist
      if (record.violations >= 3) {
        ipBlocklist.block(ip, this.BLOCK_DURATION, "rate_limit_violations", "warning");
      }
      
      // Trigger security alert for rate limit violations
      checkRateLimitAlert(ip, record.violations);
      
      this.requests.set(ip, record);
      securityLogger.info("Rate limit exceeded", { ip, tier, count: record.count, limit: config.maxRequests });
      return { allowed: false, remaining: 0, resetIn: Math.ceil((record.resetTime - now) / 1000) };
    }

    this.requests.set(ip, record);
    return { 
      allowed: true, 
      remaining: config.maxRequests - record.count, 
      resetIn: Math.ceil((record.resetTime - now) / 1000) 
    };
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    Array.from(this.requests.entries()).forEach(([ip, record]) => {
      if (now > record.resetTime + 60000) {
        this.requests.delete(ip);
      }
    });
    // Note: IP blocking is now handled by centralized ipBlocklist.cleanup()
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 300000);

// Get client IP, accounting for proxies
function getClientIP(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string") {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

// Rate limiting middleware factory
export function createRateLimitMiddleware(tier: keyof typeof rateLimitTiers = "standard") {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = getClientIP(req);
    const result = rateLimiter.checkLimit(ip, tier);

    res.setHeader("X-RateLimit-Limit", rateLimitTiers[tier].maxRequests.toString());
    res.setHeader("X-RateLimit-Remaining", result.remaining.toString());
    res.setHeader("X-RateLimit-Reset", result.resetIn.toString());

    if (!result.allowed) {
      res.status(429).json({
        error: "Too many requests",
        message: "Please wait before trying again",
        retryAfter: result.resetIn,
      });
      return;
    }

    next();
  };
}

// Security event logging middleware
export function securityLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = getClientIP(req);
  const startTime = Date.now();

  // Log suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//,  // Path traversal
    /<script/i,  // XSS attempts
    /union\s+select/i,  // SQL injection
    /eval\s*\(/i,  // Code injection
    /javascript:/i,  // XSS
    /on\w+\s*=/i,  // Event handler injection
  ];

  const url = req.url;
  const body = JSON.stringify(req.body || {});
  const combined = url + body;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combined)) {
      securityLogger.warn("Suspicious request pattern detected", {
        ip,
        method: req.method,
        path: req.path,
        pattern: pattern.source,
        userAgent: req.headers["user-agent"],
      });
      checkSuspiciousPatternAlert(ip, pattern.source, req.path);
      break;
    }
  }

  // Log on response finish
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    
    // Log 4xx/5xx errors
    if (res.statusCode >= 400) {
      securityLogger.info("Error response", {
        ip,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
        userAgent: req.headers["user-agent"],
      });
    }
    
    // Log all POST/PUT/DELETE requests
    if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
      securityLogger.info("Mutation request", {
        ip,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration,
      });
    }
  });

  next();
}

// CSRF token generation and validation
const csrfTokens: Map<string, { token: string; expires: number }> = new Map();
const CSRF_TOKEN_EXPIRY = 3600000; // 1 hour

export function generateCSRFToken(sessionId: string): string {
  const token = crypto.randomUUID();
  csrfTokens.set(sessionId, { token, expires: Date.now() + CSRF_TOKEN_EXPIRY });
  return token;
}

export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  if (!stored) return false;
  if (Date.now() > stored.expires) {
    csrfTokens.delete(sessionId);
    return false;
  }
  return stored.token === token;
}

// CSRF middleware for forms
// For this application without user authentication, we use origin/referer validation
// which is sufficient protection against cross-site form submissions
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  // Skip for GET, HEAD, OPTIONS (safe methods)
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  if (req.path === '/api/stripe/webhook') {
    return next();
  }

  const extensionSafeRoutes = [
    '/api/security/ai-scam-analyze',
    '/api/security/check-url-reputation',
    '/api/security/context-scan',
    '/api/security/visual-analyze',
    '/api/community-reports'
  ];
  const origin = req.headers.origin;
  if (origin && origin.startsWith('chrome-extension://') && extensionSafeRoutes.some(r => req.path.startsWith(r))) {
    return next();
  }

  const referer = req.headers.referer;
  const host = req.headers.host;
  const ip = getClientIP(req);

  // Always check origin/referer for all mutating requests
  // This prevents cross-site form submissions
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        securityLogger.warn("CSRF: Origin mismatch", { origin, host, ip });
        checkCSRFAlert(ip, req.path);
        res.status(403).json({ error: "Invalid request origin" });
        return;
      }
    } catch {
      securityLogger.warn("CSRF: Invalid origin header", { origin, ip });
      checkCSRFAlert(ip, req.path);
      res.status(403).json({ error: "Invalid request origin" });
      return;
    }
  } else if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost !== host) {
        securityLogger.warn("CSRF: Referer mismatch", { referer, host, ip });
        checkCSRFAlert(ip, req.path);
        res.status(403).json({ error: "Invalid request origin" });
        return;
      }
    } catch {
      securityLogger.warn("CSRF: Invalid referer header", { referer, ip });
      checkCSRFAlert(ip, req.path);
      res.status(403).json({ error: "Invalid request origin" });
      return;
    }
  }
  // If neither origin nor referer is present, allow request
  // This handles same-origin requests from older browsers
  // and non-browser API clients (which are not subject to CSRF)

  next();
}

// Configure Helmet with strict CSP
export function configureHelmet(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            ...(process.env.NODE_ENV !== "production" ? ["'unsafe-inline'"] : []),
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://www.google.com",
            "https://www.gstatic.com",
            "https://www.recaptcha.net",
            "https://js.stripe.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https://images.unsplash.com",
            "https://source.unsplash.com",
            "https://images.pexels.com",
            "https://www.getcyberright.com",
            "https://*.googleusercontent.com",
            "https://www.google-analytics.com",
            "https://www.googletagmanager.com",
            "https://lh3.googleusercontent.com",
            "https://picsum.photos",
            "https://fastly.picsum.photos",
            "https://*.stripe.com",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
          connectSrc: [
            "'self'",
            "https://ip-api.com",
            "https://checkurl.phishtank.com",
            "https://urlhaus-api.abuse.ch",
            "https://haveibeenpwned.com",
            "https://www.google-analytics.com",
            "https://analytics.google.com",
            "https://www.google.com",
            "https://www.recaptcha.net",
            "https://api.stripe.com",
            "https://api.openai.com",
            "https://api.anthropic.com",
            "https://api.unsplash.com",
            "https://api.pexels.com",
            "wss://*.replit.dev",
            "wss://*.replit.app",
            "wss://*.repl.co",
            "wss://www.getcyberright.com",
          ],
          mediaSrc: ["'self'"],
          frameSrc: [
            "https://js.stripe.com",
            "https://www.google.com",
            "https://recaptcha.google.com",
            "https://www.recaptcha.net",
          ],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: null,
        },
      },
      strictTransportSecurity: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: { action: "deny" },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hidePoweredBy: true,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin" },
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
}

// Request size limiting middleware
export function requestSizeLimiter(maxSizeBytes: number = 102400) { // 100KB default
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers["content-length"] || "0", 10);
    
    if (contentLength > maxSizeBytes) {
      securityLogger.warn("Request size exceeded", {
        ip: getClientIP(req),
        size: contentLength,
        maxSize: maxSizeBytes,
        path: req.path,
      });
      res.status(413).json({ error: "Request too large" });
      return;
    }
    
    next();
  };
}

// Cookie security configuration
// sameSite: "strict" for CSRF-sensitive operations (token cookies, security endpoints).
// Session cookies in auth.ts use "lax" instead, because "strict" would break
// top-level navigations (e.g., clicking a link from an email or external site
// wouldn't carry the session cookie on the first request).
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 86400000,
  path: "/",
};

// Security headers check endpoint (for testing)
export function registerSecurityEndpoints(app: Express) {
  app.get("/api/security/headers-check", (req: Request, res: Response) => {
    res.json({
      message: "Security headers are configured",
      timestamp: new Date().toISOString(),
    });
  });

  // CSRF token endpoint
  app.get("/api/security/csrf-token", (req: Request, res: Response) => {
    const sessionId = crypto.randomUUID();
    const token = generateCSRFToken(sessionId);
    
    res.cookie("sessionId", sessionId, secureCookieOptions);
    res.json({ csrfToken: token });
  });
}

// Cleanup CSRF tokens periodically
setInterval(() => {
  const now = Date.now();
  Array.from(csrfTokens.entries()).forEach(([sessionId, data]) => {
    if (now > data.expires) {
      csrfTokens.delete(sessionId);
    }
  });
}, 600000); // Every 10 minutes

// ============================================
// API ANOMALY DETECTION SYSTEM
// MITRE ATT&CK: T1071 (Application Layer Protocol)
// ============================================

interface APIUsageRecord {
  count: number;
  endpoints: Map<string, number>;
  lastRequest: number;
  anomalyScore: number;
  flagged: boolean;
}

class AnomalyDetector {
  private usagePatterns: Map<string, APIUsageRecord> = new Map();
  private readonly WINDOW_MS = 300000; // 5 minute window
  private readonly MAX_ENDPOINTS_PER_WINDOW = 50; // Unusual if hitting many different endpoints
  private readonly MAX_REQUESTS_PER_WINDOW = 200; // Unusual request volume
  private readonly ANOMALY_THRESHOLD = 75; // Score threshold for flagging

  recordRequest(ip: string, endpoint: string): { isAnomaly: boolean; score: number; reason?: string } {
    const now = Date.now();
    let record = this.usagePatterns.get(ip);

    // Capture previous lastRequest time before updating (for rapid request detection)
    const previousLastRequest = record?.lastRequest || now;

    // Reset if window expired
    if (!record || now - record.lastRequest > this.WINDOW_MS) {
      record = {
        count: 0,
        endpoints: new Map(),
        lastRequest: now,
        anomalyScore: 0,
        flagged: false,
      };
    }

    record.count++;
    record.endpoints.set(endpoint, (record.endpoints.get(endpoint) || 0) + 1);

    // Calculate time since last request BEFORE updating lastRequest
    const timeSinceLast = now - previousLastRequest;
    
    // Now update lastRequest for next call
    record.lastRequest = now;

    // Calculate anomaly score
    let score = 0;
    let reasons: string[] = [];

    // Factor 1: High request volume (30 points max)
    const volumeRatio = record.count / this.MAX_REQUESTS_PER_WINDOW;
    if (volumeRatio > 0.5) {
      score += Math.min(30, Math.round(volumeRatio * 30));
      if (volumeRatio > 0.8) reasons.push("high_volume");
    }

    // Factor 2: Many different endpoints (30 points max)
    const endpointRatio = record.endpoints.size / this.MAX_ENDPOINTS_PER_WINDOW;
    if (endpointRatio > 0.3) {
      score += Math.min(30, Math.round(endpointRatio * 30));
      if (endpointRatio > 0.6) reasons.push("endpoint_scanning");
    }

    // Factor 3: Rapid sequential requests (20 points max)
    // Only triggers if many requests with very short intervals
    if (timeSinceLast < 100 && record.count > 10) {
      score += 20;
      reasons.push("rapid_requests");
    }

    // Factor 4: Unusual endpoint patterns (20 points max)
    const suspiciousEndpoints = ["/api/admin", "/api/users", "/api/config", "/.env", "/wp-admin"];
    for (const sus of suspiciousEndpoints) {
      if (endpoint.includes(sus)) {
        score += 20;
        reasons.push("suspicious_endpoint");
        break;
      }
    }

    record.anomalyScore = score;
    this.usagePatterns.set(ip, record);

    const isAnomaly = score >= this.ANOMALY_THRESHOLD;
    
    if (isAnomaly && !record.flagged) {
      record.flagged = true;
      securityLogger.warn("API anomaly detected", {
        ip,
        score,
        reasons,
        requestCount: record.count,
        uniqueEndpoints: record.endpoints.size,
        mitreAttack: "T1071",
      });
    }

    return { 
      isAnomaly, 
      score, 
      reason: reasons.length > 0 ? reasons.join(", ") : undefined 
    };
  }

  cleanup(): void {
    const now = Date.now();
    Array.from(this.usagePatterns.entries()).forEach(([ip, record]) => {
      if (now - record.lastRequest > this.WINDOW_MS * 2) {
        this.usagePatterns.delete(ip);
      }
    });
  }

  getStats(): { totalTracked: number; flaggedCount: number } {
    let flaggedCount = 0;
    this.usagePatterns.forEach(record => {
      if (record.flagged) flaggedCount++;
    });
    return { totalTracked: this.usagePatterns.size, flaggedCount };
  }
}

export const anomalyDetector = new AnomalyDetector();

// Cleanup anomaly data every 10 minutes
setInterval(() => anomalyDetector.cleanup(), 600000);

// Anomaly detection middleware - only tracks /api routes to avoid noise from static assets
export function apiAnomalyDetection(req: Request, res: Response, next: NextFunction) {
  const endpoint = req.path;
  
  // Only track API endpoints, skip static assets and other routes
  if (!endpoint.startsWith("/api")) {
    return next();
  }
  
  const ip = getClientIP(req);
  
  // Check if IP is already blocked
  const blockStatus = ipBlocklist.isBlocked(ip);
  if (blockStatus.blocked) {
    res.status(403).json({ 
      error: "Access denied", 
      reason: "Your IP has been temporarily blocked due to suspicious activity",
      retryAfter: Math.ceil((blockStatus.remainingMs || 0) / 1000)
    });
    return;
  }

  const result = anomalyDetector.recordRequest(ip, endpoint);

  // Add anomaly headers for monitoring (only on API routes)
  res.setHeader("X-Anomaly-Score", result.score.toString());

  // If high anomaly score, add extra rate limiting
  if (result.isAnomaly) {
    // Don't block, but add warning header and log
    res.setHeader("X-Anomaly-Detected", "true");
    
    // For critical scores (>=90), auto-block the IP
    if (result.score >= 90) {
      const BLOCK_DURATION = 600000; // 10 minutes for anomaly-based blocks
      ipBlocklist.block(ip, BLOCK_DURATION, "critical_anomaly_score", "critical");
      
      securityLogger.error("Critical anomaly score - IP auto-blocked", {
        ip,
        score: result.score,
        reason: result.reason,
        endpoint,
        mitreAttack: "T1071",
        action: "blocked",
        blockDuration: "10m",
      });
      
      // Send security alert for critical anomaly
      sendSecurityAlert({
        type: "critical_anomaly",
        severity: "critical",
        ip,
        details: `Critical anomaly detected (score: ${result.score}). Reason: ${result.reason || "multiple factors"}. Endpoint: ${endpoint}. IP has been blocked for 10 minutes.`,
        timestamp: new Date(),
        mitreAttack: "T1071",
      });
      
      res.status(403).json({ 
        error: "Access denied", 
        reason: "Suspicious activity detected. Your IP has been temporarily blocked.",
        retryAfter: Math.ceil(BLOCK_DURATION / 1000)
      });
      return;
    }
  }

  next();
}

// Generate CSP nonce for script tags (MITRE: M1021)
export function generateCSPNonce(): string {
  return crypto.randomBytes(16).toString("base64");
}

// Subresource Integrity helper for known external resources
export const sriHashes = {
  // Google Fonts Inter (example - these change with font versions)
  googleFontsInter: "sha384-placeholder",
  // Note: Google Analytics and Stripe scripts change frequently
  // so SRI is not practical for them. Use CSP nonce instead.
};

// Security metrics endpoint for monitoring
export function registerSecurityMetricsEndpoint(app: Express) {
  app.get("/api/security/metrics", (req: Request, res: Response) => {
    const anomalyStats = anomalyDetector.getStats();
    const loginStats = failedLoginTracker.getStats();
    const alertStats = getAlertStats();
    res.json({
      timestamp: new Date().toISOString(),
      anomalyDetection: anomalyStats,
      failedLogins: loginStats,
      blockedIPs: {
        count: ipBlocklist.getBlockedCount(),
      },
      alerts: alertStats,
      status: "operational",
    });
  });
  
  // Admin endpoint to view blocked IPs (requires auth in production)
  app.get("/api/admin/security/blocked-ips", (req: Request, res: Response) => {
    // In production, this should require admin authentication
    res.json({
      timestamp: new Date().toISOString(),
      blockedIPs: ipBlocklist.getBlockedIPs(),
    });
  });
  
  // Admin endpoint to unblock an IP
  app.delete("/api/admin/security/blocked-ips/:ip", (req: Request, res: Response) => {
    const ip = req.params.ip;
    const unblocked = ipBlocklist.unblock(ip);
    if (unblocked) {
      securityLogger.info("IP manually unblocked by admin", { ip });
      res.json({ success: true, message: `IP ${ip} has been unblocked` });
    } else {
      res.status(404).json({ success: false, message: `IP ${ip} was not in the blocklist` });
    }
  });
}
