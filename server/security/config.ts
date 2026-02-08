export const SECURITY_CONFIG = {
  // JWT Configuration - JWT_SECRET is required, validated in auth.ts
  JWT_SECRET: process.env.JWT_SECRET || '',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  
  // Rate Limiting
  RATE_LIMIT: {
    GENERAL: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // requests per window
    },
    STRICT: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100, // requests per window
    },
    CYBER_HYGIENE: {
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 20, // requests per window
    },
    AUTH: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // login attempts per window
    }
  },
  
  // Request Limits
  REQUEST_LIMITS: {
    MAX_BODY_SIZE: '10mb',
    MAX_PARAMETER_LIMIT: 20,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Security Headers
  SECURITY_HEADERS: {
    CONTENT_SECURITY_POLICY: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", "https:", "wss:", "ws:"],
        frameSrc: ["'self'", "https://cybermap.kaspersky.com", "https://threatmap.fortiguard.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    HSTS_MAX_AGE: 31536000, // 1 year
  },
  
  // Account Security
  ACCOUNT_SECURITY: {
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
    PASSWORD_SALT_ROUNDS: 12,
    MAX_SESSIONS_PER_USER: 5,
  },
  
  // CORS Configuration
  CORS: {
    ALLOWED_ORIGINS: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGINS?.split(',') || []
      : ['http://localhost:3000', 'http://localhost:5000', 'https://localhost:5000'],
    ALLOWED_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'X-Requested-With'],
    CREDENTIALS: true,
    MAX_AGE: 86400, // 24 hours
  },
  
  // Input Validation
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 30,
    MAX_TITLE_LENGTH: 200,
    MAX_CONTENT_LENGTH: 50000,
  },
  
  // Security Monitoring
  MONITORING: {
    LOG_FAILED_REQUESTS: true,
    LOG_SLOW_REQUESTS: true,
    SLOW_REQUEST_THRESHOLD: 5000, // 5 seconds
    LOG_SUSPICIOUS_PATTERNS: true,
  }
};

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/gif',
  'image/webp',
  'application/pdf'
];

export const SUSPICIOUS_PATTERNS = [
  /(\bor\b|\band\b).*=.*('|")/i, // SQL injection patterns
  /<script[^>]*>.*?<\/script>/i, // XSS patterns
  /javascript:/i, // JavaScript protocol
  /data:.*base64/i, // Data URLs that could contain malicious content
  /\.\./g, // Path traversal
  /%2e%2e/i, // URL encoded path traversal
];

export const BLOCKED_USER_AGENTS = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /curl/i,
  /wget/i,
  /python-requests/i,
];

export const SENSITIVE_ENDPOINTS = [
  '/api/cyber-hygiene-check',
  '/api/admin',
  '/api/auth',
  '/api/user',
  '/api/newsletter/subscribe',
];

export const PUBLIC_ENDPOINTS = [
  '/api/articles',
  '/api/resources',
  '/api/breaking-news',
  '/api/threat-analytics',
  '/health',
  '/ping',
  '/.well-known/health',
];