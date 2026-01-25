# GetCyberRight.com

## Overview

GetCyberRight is a mission-driven service platform providing free global resources for family cyber safety. It aims to simplify complex cybersecurity information for everyday users, from children to seniors, offering interactive safety assessments, real-time threat intelligence, and audience-specific educational content. The platform's long-term vision includes mobile applications with tiered features to ensure "always-on protection" and expand its reach across six continents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

GetCyberRight utilizes a modern web stack designed for performance, security, and scalability.

### Frontend
- **Framework**: React with TypeScript and Vite
- **Routing**: Wouter
- **State Management**: TanStack React Query
- **UI Components**: shadcn/ui (built on Radix UI)
- **Styling**: Tailwind CSS with custom CSS variables (light/dark mode)
- **SEO**: Dynamic meta tags, Open Graph, and keywords managed by a custom `useSEO` hook.
- **UI/UX**: Mobile-first design with enhanced typography scaling, section padding, and card hover effects for desktop.

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ES modules)
- **API Design**: RESTful with robust input validation
- **Build**: esbuild

### Database
- **Type**: PostgreSQL (serverless via Neon)
- **ORM**: Drizzle ORM (with push-based migrations)
- **Key Tables**: `users`, `articles`, `resources`, `newsletters`, `cyberAssessments`, `threat_stats`, `securityAlerts`, `auditLogs`.

### Security Stack
- Comprehensive security headers (`helmet`, CSP, HSTS, XSS)
- Multi-tier rate limiting (`express-rate-limit`, `express-slow-down`)
- Input sanitization (`express-mongo-sanitize`, `hpp`, `DOMPurify`)
- Authentication: `bcryptjs` for hashing, `jsonwebtoken` for JWT, `otplib` for TOTP 2FA.
- Passkeys (WebAuthn) for passwordless authentication using `@simplewebauthn/server` and `@simplewebauthn/browser`.
- Custom honeypot middleware and audit logging for administrative actions and security events.
- **Token Versioning**: Session invalidation on password change via `tokenVersion` in JWT access and refresh tokens, checked in `authenticateToken` and `optionalAuth` middleware.
- **CSRF Protection**: Double-submit cookie pattern protecting admin, passkey, 2FA, articles, resources, security alerts, and user endpoints.
- **Security Monitoring**: Real-time threat detection tracking failed logins, rate limit exceeded events, and CSRF violations with automatic security alert generation.

### Key Features and Implementations
- **Two-Factor Authentication (2FA)**: TOTP for admin accounts with secure setup and login flows, including rate limiting and audit trails.
- **Passkeys (WebAuthn)**: Admin accounts can use hardware-backed, phishing-resistant passkeys for authentication, with server-side challenge verification and counter validation.
- **Audit Logging**: Tracks critical admin actions, security events, and 2FA activities with detailed records.
- **Scam Checker Usage Tracking**: Logs all scam checker analyses for metrics, categorizing by type and risk.
- **Security Alerts System**: Manages breach/vulnerability notifications for admins, with severity categorization and acknowledgment features.
- **SEO Implementation**: Dynamic sitemap, `robots.txt`, JSON-LD structured data, Open Graph, and Twitter Card meta tags.
- **Digital Safety Tips Automation**: AI-powered (Claude) system for generating and sending personalized safety tips to subscribers, based on audience and region, with evidence-based prompting and anti-hallucination guardrails.
- **Unified Subscription System**: Manages all email subscriptions (`weeklyDigest`, `digitalSafetyTips`) through a single `newsletters` table with configurable frequency, audience, region, and alert priority.
- **Scam Checker Feature**: Provides six analysis types:
    - **URL Analysis**: Rule-based detection (typosquatting, TLDs, IP-based, keywords) integrated with Google Safe Browsing and PhishTank APIs.
    - **QR Code Scanner**: Extracts and analyzes URLs from QR codes in images.
    - **Image/Screenshot Analysis**: OCR for text extraction, AI analysis, and URL/phone number identification.
    - **Phone Analysis**: Rule-based country code, premium number, and suspicious pattern detection.
    - **Email Header Analysis**: Enhanced with AI and external lookups (SPF, DKIM, DMARC, domain reputation via DNS blocklists, RDAP/WHOIS for domain age, phishing pattern matching) for comprehensive risk assessment.
    - **Situation Analysis**: AI-powered (Claude) with critical rules for evidence-based responses, confidence calibration, and referencing authoritative sources (FBI IC3, CISA, INTERPOL).
- **Core Content Pillars**: Youth Protection Hub, Senior Safety Center, Real-Time News Aggregation, Interactive Tools, Threat Intelligence Dashboard.
- **Platform Security**: Enterprise-grade headers, rate limiting, bot protection, input sanitization, `security.txt`.
- **Privacy Commitment**: No behavioral tracking, minimal data collection, no data sales, GDPR-conscious design.
- **Marketing & Growth Features**:
    - **Share Your Result**: Social sharing buttons (Twitter, Facebook, WhatsApp) after scam checks with risk-based messaging.
    - **Embeddable Widget**: `/embed/url-checker` route for partner websites to embed the URL checker via iframe.
    - **Success Stories**: `/success-stories` page showcasing user testimonials with submission form.
    - **Referral Tracking**: URL parameter capture (`?ref=`), localStorage storage (30-day expiry), conversion tracking, and InviteFriends component.

## External Dependencies

- **Database**: Neon (PostgreSQL serverless driver)
- **Email Service**: Brevo (primary), MailerSend, SMTP2GO (fallbacks)
- **AI Features**: Anthropic API (Claude)
- **News Sources**: FBI IC3, INTERPOL, CISA, The Hacker News, Krebs on Security, regional cybercrime agencies.
- **UI Libraries**: Radix UI
- **Scam Checker APIs**: Google Safe Browsing API, PhishTank API.

## Project Structure

```
├── client/src/          # React frontend
├── server/              # Express backend
├── shared/              # Shared types and schemas
├── public/              # Static assets
├── attached_assets/     # Media assets (hero images, etc.)
├── docs/                # Documentation
└── scripts/             # Utility scripts
```

## Required Environment Variables

Critical secrets that must be set (no fallback values):
- `JWT_SECRET` - Required for authentication (app will not start without it)
- `DATABASE_URL` - PostgreSQL connection string
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` - For AI-powered features

See `README.md` for complete environment variable documentation.

## Recent Updates

- **Rotating Testimonials**: Homepage displays 6 rotating testimonials with 8-second intervals
- **CSRF Protection**: All admin endpoints protected with double-submit cookie pattern
- **Security Hardening**: Removed all hardcoded fallback values for sensitive secrets