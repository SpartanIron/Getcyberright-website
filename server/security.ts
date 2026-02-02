import helmet from "helmet";
import type { Express, Request, Response, NextFunction } from "express";
import winston from "winston";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { checkRateLimitAlert, checkCSRFAlert, checkSuspiciousPatternAlert } from "./security-alerts";

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

// Enhanced rate limiter with IP tracking and logging
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number; violations: number }> = new Map();
  private blockedIPs: Map<string, number> = new Map();
  private readonly BLOCK_DURATION = 300000; // 5 minutes

  checkLimit(ip: string, tier: keyof typeof rateLimitTiers = "standard"): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const config = rateLimitTiers[tier];
    
    // Check if IP is blocked
    const blockedUntil = this.blockedIPs.get(ip);
    if (blockedUntil && now < blockedUntil) {
      securityLogger.warn("Blocked IP attempted access", { ip, blockedUntil: new Date(blockedUntil).toISOString() });
      return { allowed: false, remaining: 0, resetIn: Math.ceil((blockedUntil - now) / 1000) };
    }

    let record = this.requests.get(ip);
    
    // Reset if window expired
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + config.windowMs, violations: record?.violations || 0 };
    }

    record.count++;
    
    if (record.count > config.maxRequests) {
      record.violations++;
      
      // Block IP after 3 violations
      if (record.violations >= 3) {
        this.blockedIPs.set(ip, now + this.BLOCK_DURATION);
        securityLogger.warn("IP blocked due to repeated rate limit violations", { ip, violations: record.violations });
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
    Array.from(this.blockedIPs.entries()).forEach(([ip, blockedUntil]) => {
      if (now > blockedUntil) {
        this.blockedIPs.delete(ip);
      }
    });
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

  const origin = req.headers.origin;
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
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
            "https://js.stripe.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "blob:", "https:"],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
          connectSrc: [
            "'self'",
            "https://ip-api.com",
            "https://checkurl.phishtank.com",
            "https://urlhaus-api.abuse.ch",
            "https://haveibeenpwned.com",
            "https://www.google-analytics.com",
            "https://analytics.google.com",
            "https://api.stripe.com",
            "https://api.openai.com",
            "ws:",
            "wss:",
          ],
          frameSrc: ["https://js.stripe.com"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          upgradeInsecureRequests: [],
        },
      },
      // Strict Transport Security (HSTS)
      strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // X-Frame-Options
      frameguard: { action: "deny" },
      // X-Content-Type-Options
      noSniff: true,
      // X-XSS-Protection (legacy, but still useful)
      xssFilter: true,
      // Referrer Policy
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      // Disable X-Powered-By
      hidePoweredBy: true,
      // Cross-Origin policies
      crossOriginEmbedderPolicy: false, // Disabled to allow external images
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
export const secureCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 86400000, // 24 hours
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

  const result = anomalyDetector.recordRequest(ip, endpoint);

  // Add anomaly headers for monitoring (only on API routes)
  res.setHeader("X-Anomaly-Score", result.score.toString());

  // If high anomaly score, add extra rate limiting
  if (result.isAnomaly) {
    // Don't block, but add warning header and log
    res.setHeader("X-Anomaly-Detected", "true");
    
    // For very high scores, consider additional protection
    if (result.score > 90) {
      securityLogger.error("Critical anomaly score - potential attack", {
        ip,
        score: result.score,
        reason: result.reason,
        endpoint,
        mitreAttack: "T1071",
      });
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
    res.json({
      timestamp: new Date().toISOString(),
      anomalyDetection: anomalyStats,
      status: "operational",
    });
  });
}
