import helmet from "helmet";
import type { Express, Request, Response, NextFunction } from "express";
import winston from "winston";
import { checkRateLimitAlert, checkCSRFAlert, checkSuspiciousPatternAlert } from "./security-alerts";

// Security Logger Configuration
export const securityLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: "getcyberright-security" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1 ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [SECURITY] ${level}: ${message}${metaStr}`;
        })
      ),
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
