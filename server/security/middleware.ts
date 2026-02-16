import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { body, query, param, validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';
import { recordSecurityEvent } from './security-monitor';

// Security Headers with enhanced CSP
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'", 
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://www.google.com",
        "https://www.gstatic.com",
        "https://www.recaptcha.net",
        "https://replit.com"
      ],
      connectSrc: [
        "'self'", 
        "https:", 
        "wss:", 
        "ws:",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://www.googletagmanager.com"
      ],
      frameSrc: [
        "'self'", 
        "https://cybermap.kaspersky.com", 
        "https://threatmap.fortiguard.com", 
        "https://www.youtube.com", 
        "https://youtube.com",
        "https://www.google.com",
        "https://recaptcha.google.com",
        "https://www.recaptcha.net"
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'", "blob:"],
      manifestSrc: ["'self'"],
      mediaSrc: ["'self'", "https:"],
      childSrc: ["'self'", "blob:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'sameorigin' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  originAgentCluster: true,
  dnsPrefetchControl: { allow: false },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' }
});

// CORS Configuration - Production-ready with allowed origins
const allowedOrigins = [
  'https://getcyberright.com',
  'https://www.getcyberright.com',
  /\.replit\.dev$/,
  /\.replit\.app$/,
  /\.repl\.co$/,
];

export const corsConfig = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check against allowed origins
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin);
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, allow all origins for testing
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400 // 24 hours
});

// Rate Limiting - General API
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: any, res: Response) => {
    recordSecurityEvent({
      type: 'rate_limit_exceeded',
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: `General rate limit exceeded on ${req.method} ${req.path}`,
      severity: 'low'
    });
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Too many requests, please slow down',
      retryAfter: Math.round(req.rateLimit?.resetTime || Date.now() / 1000)
    });
  }
});

// Rate Limiting - Strict for sensitive endpoints
export const strictRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per hour
  message: {
    error: 'Rate limit exceeded for sensitive operations',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  handler: (req: any, res: Response) => {
    recordSecurityEvent({
      type: 'rate_limit_exceeded',
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: `Strict rate limit exceeded on ${req.method} ${req.path}`,
      severity: 'medium'
    });
    res.status(429).json({
      error: 'Rate limit exceeded for sensitive operations',
      retryAfter: '1 hour'
    });
  }
});

// Rate Limiting - Very strict for cyber hygiene checks
export const cyberHygieneRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Only 20 checks per 10 minutes
  message: {
    error: 'Cyber hygiene check rate limit exceeded',
    message: 'Please wait before performing another security check',
    retryAfter: '10 minutes'
  }
});

// Rate Limiting - Strict for AI-powered scam checks (to prevent abuse and cost overruns)
export const scamCheckRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Only 30 AI-powered checks per hour per IP
  message: {
    error: 'Scam check rate limit exceeded',
    message: 'You have reached the maximum number of scam checks. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate Limiting - For URL pattern checks (less restrictive as no AI cost)
export const urlCheckRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 URL checks per 10 minutes
  message: {
    error: 'URL check rate limit exceeded',
    message: 'Too many URL checks. Please wait before checking more links.',
    retryAfter: '10 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate Limiting - Newsletter/Form submissions (prevent spam)
export const formSubmissionRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 form submissions per hour per IP
  message: {
    error: 'Too many submissions',
    message: 'Please wait before submitting again.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Honeypot middleware - Detects bots that fill hidden fields
export const honeypotProtection = (fieldName: string = 'website_url') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if honeypot field was filled (bots will fill all fields)
    const honeypotValue = req.body[fieldName] || req.body['_hp'] || req.body['hp_field'];
    
    if (honeypotValue && honeypotValue.trim() !== '') {
      console.warn(`[Honeypot] Bot detected - filled hidden field from IP: ${req.ip}`);
      // Return success to not alert the bot, but don't process
      return res.status(200).json({ 
        message: 'Thank you for your submission',
        success: true 
      });
    }
    
    // Check for suspiciously fast submissions (< 1 second - reduced from 2s for slow connections)
    const submissionTime = req.body['_timestamp'];
    if (submissionTime) {
      const elapsed = Date.now() - parseInt(submissionTime);
      if (elapsed < 1000) {
        console.warn(`[Honeypot] Fast submission blocked from IP: ${req.ip} (${elapsed}ms)`);
        return res.status(200).json({ 
          message: 'Thank you for your submission',
          success: true 
        });
      }
    }
    
    // Log successful passage through honeypot for debugging
    console.log(`[Honeypot] Request passed from IP: ${req.ip}`);
    next();
  };
};

// Slow Down Middleware - Gradually increase response time
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 500, // Allow 500 requests per 15 minutes without delay
  delayMs: () => 100, // Add 100ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  validate: { delayMs: false }
});

// Input Sanitization
export const sanitizeInput = [
  mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ key, req }: { key: string; req: Request }) => {
      console.warn(`Sanitized input - Key: ${key} from IP: ${req.ip}`);
    }
  }),
  hpp({
    whitelist: ['sort', 'category', 'type', 'difficulty', 'featured']
  })
];

// Validation Schemas
export const validateArticleInput = [
  body('title').isLength({ min: 5, max: 200 }).trim().escape(),
  body('excerpt').isLength({ min: 10, max: 500 }).trim().escape(),
  body('content').isLength({ min: 50, max: 50000 }).trim(),
  body('category').isIn(['Technology', 'Security', 'Privacy', 'Threats', 'Education', 'Policy']),
  body('author').isLength({ min: 2, max: 100 }).trim().escape(),
  body('featured').optional().isBoolean(),
  body('breaking').optional().isBoolean()
];

export const validateResourceInput = [
  body('title').isLength({ min: 3, max: 200 }).trim().escape(),
  body('description').isLength({ min: 10, max: 1000 }).trim().escape(),
  body('url').isURL({ protocols: ['http', 'https'], require_protocol: true }),
  body('type').isIn(['tool', 'guide', 'course', 'certification', 'documentation']),
  body('category').isIn(['beginner', 'intermediate', 'advanced']),
  body('difficulty').isIn(['easy', 'medium', 'hard'])
];

export const validateNewsletterInput = [
  body('email').isEmail().normalizeEmail({ gmail_remove_dots: false }).trim()
];

export const validateCyberHygieneInput = [
  body('domain').matches(/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i)
    .withMessage('Please provide a valid domain name'),
  body('includeAdvanced').optional().isBoolean()
];

export const validateIdParam = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
];

export const validateSearchQuery = [
  query('q').isLength({ min: 2, max: 100 }).trim().escape()
    .withMessage('Search query must be between 2 and 100 characters')
];

// Error Handler for Validation
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Log security event for validation failures
    console.log('Security Event: Validation failed', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      errors: errors.array(),
      endpoint: req.originalUrl,
      method: req.method
    });
    
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((err: any) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  
  next();
};

// Security Event Logger
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const originalJson = res.json;
  
  res.json = function(body) {
    const duration = Date.now() - startTime;
    
    // Log suspicious activities
    if (res.statusCode >= 400) {
      console.warn(`Security Event: ${req.method} ${req.path} - Status: ${res.statusCode} - IP: ${req.ip || 'unknown'} - Duration: ${duration}ms - User-Agent: ${req.get('User-Agent') || 'unknown'}`);
    }
    
    // Log slow requests (potential DoS)
    if (duration > 5000) {
      console.warn(`Slow Request Detected: ${req.method} ${req.path} - Duration: ${duration}ms - IP: ${req.ip || 'unknown'}`);
    }
    
    return originalJson.call(this, body);
  };
  
  next();
};

// Brute Force Protection
const loginAttempts = new Map<string, { count: number; lastAttempt: number; blocked: boolean }>();

export const bruteForceProtection = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const attempt = loginAttempts.get(ip) || { count: 0, lastAttempt: now, blocked: false };
  
  // Reset counter after 1 hour
  if (now - attempt.lastAttempt > 60 * 60 * 1000) {
    attempt.count = 0;
    attempt.blocked = false;
  }
  
  // Block if too many attempts
  if (attempt.count >= 5) {
    attempt.blocked = true;
    loginAttempts.set(ip, attempt);
    return res.status(429).json({
      error: 'Too many login attempts',
      message: 'Account temporarily locked. Please try again later.',
      retryAfter: '1 hour'
    });
  }
  
  // Track failed attempts
  res.on('finish', () => {
    if (res.statusCode === 401) {
      attempt.count++;
      attempt.lastAttempt = now;
      loginAttempts.set(ip, attempt);
      
      // Record security event for monitoring
      recordSecurityEvent({
        type: 'failed_login',
        ip,
        userAgent: req.get('User-Agent'),
        details: `Failed login attempt (${attempt.count} total)`,
        severity: attempt.count >= 3 ? 'high' : 'medium'
      });
    } else if (res.statusCode === 200) {
      // Reset on successful login
      loginAttempts.delete(ip);
    }
  });
  
  next();
};

// Request Size Limiter
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      error: 'Request too large',
      message: 'Request body exceeds maximum allowed size of 10MB'
    });
  }
  
  next();
};

// Anti-scraping middleware for API routes
export const antiScrapingHeaders = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    res.setHeader('Cache-Control', 'private, no-store');
  }
  next();
};

// Bot detection middleware - blocks known scraper user agents
const blockedBots = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /CCBot/i,
  /anthropic-ai/i,
  /Claude-Web/i,
  /Google-Extended/i,
  /Bytespider/i,
  /PetalBot/i,
  /FacebookBot/i,
];

export const botProtection = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  const isBlockedBot = blockedBots.some(pattern => pattern.test(userAgent));

  if (isBlockedBot && req.path.startsWith('/api/')) {
    recordSecurityEvent({
      type: 'suspicious_pattern',
      ip: req.ip || 'unknown',
      userAgent,
      details: `Blocked scraper bot on ${req.method} ${req.path}`,
      severity: 'low'
    });
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  next();
};

// File Upload Security (if needed later)
export const fileUploadSecurity = {
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
};