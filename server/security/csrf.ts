import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { recordSecurityEvent } from './security-monitor';

const CSRF_TOKEN_LENGTH = 32;
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_COOKIE_OPTIONS = {
  httpOnly: false, // Must be false so client JavaScript can read and echo the token
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  path: '/'
};

export function generateCSRFToken(): string {
  return crypto.randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
}

export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const safeMethod = ['GET', 'HEAD', 'OPTIONS'].includes(req.method);
  
  if (safeMethod) {
    if (!req.cookies?.[CSRF_COOKIE_NAME]) {
      const token = generateCSRFToken();
      res.cookie(CSRF_COOKIE_NAME, token, CSRF_COOKIE_OPTIONS);
    }
    return next();
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
  const headerToken = req.headers[CSRF_HEADER_NAME] as string;

  if (!cookieToken || !headerToken) {
    recordSecurityEvent({
      type: 'csrf_violation',
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: `Missing CSRF token on ${req.method} ${req.path}`,
      severity: 'high'
    });
    return res.status(403).json({
      error: 'CSRF validation failed',
      message: 'Missing CSRF token'
    });
  }

  if (!crypto.timingSafeEqual(
    Buffer.from(cookieToken, 'utf8'),
    Buffer.from(headerToken, 'utf8')
  )) {
    recordSecurityEvent({
      type: 'csrf_violation',
      ip: req.ip || 'unknown',
      userAgent: req.get('User-Agent'),
      details: `Invalid CSRF token on ${req.method} ${req.path}`,
      severity: 'critical'
    });
    return res.status(403).json({
      error: 'CSRF validation failed',
      message: 'Invalid CSRF token'
    });
  }

  const newToken = generateCSRFToken();
  res.cookie(CSRF_COOKIE_NAME, newToken, CSRF_COOKIE_OPTIONS);
  
  next();
}

export function csrfTokenEndpoint(req: Request, res: Response) {
  let token = req.cookies?.[CSRF_COOKIE_NAME];
  
  if (!token) {
    token = generateCSRFToken();
    res.cookie(CSRF_COOKIE_NAME, token, CSRF_COOKIE_OPTIONS);
  }
  
  res.json({ csrfToken: token });
}

export function csrfMiddlewareForAuthRoutes(req: Request, res: Response, next: NextFunction) {
  // Routes that require CSRF protection (all authenticated state-changing operations)
  const csrfProtectedRoutes = [
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/auth/change-password',
    '/api/auth/passkey',
    '/api/auth/2fa',
    '/api/admin',
    '/api/articles',
    '/api/resources',
    '/api/security-alerts',
    '/api/user'
  ];
  
  // Routes exempt from CSRF (public forms protected by rate limiting and honeypot)
  const csrfExemptRoutes = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/newsletter',
    '/api/newsletter/subscribe',
    '/api/daily-tips/subscribe',
    '/api/contact',
    '/api/scam-check',
    '/api/url-check',
    '/api/report-scam',
    '/api/security/ai-scam-analyze',
    '/api/security/check-url-reputation',
    '/api/community-reports'
  ];
  
  const isExemptRoute = csrfExemptRoutes.some(route => req.path.startsWith(route));
  const isProtectedRoute = csrfProtectedRoutes.some(route => req.path.startsWith(route));
  const isStateChangingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method);
  
  // Apply CSRF to protected routes or any authenticated admin operations
  if (isStateChangingMethod && isProtectedRoute && !isExemptRoute) {
    return csrfProtection(req, res, next);
  }
  
  next();
}
