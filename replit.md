# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a 100% free, family-focused cybersecurity education platform. All tools and resources are free forever with no premium tiers, no paywalls, and no hidden fees. The platform empowers families, parents, kids, seniors, and everyday people with practical cybersecurity knowledge. It simplifies complex cybersecurity information for non-technical users, offering interactive safety assessments, real-time threat intelligence, and audience-specific educational content. The mission is to cover the people that corporate cybersecurity leaves behind.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform uses an enterprise teal and orange color scheme with a flat, minimal aesthetic. UI/UX prioritizes accessibility, SEO, and print support. Audience-specific hubs (Kids, Seniors, Parents, Educators, Small Business) feature distinct color themes while maintaining brand consistency. The Kids Digital Safety Hub offers age-segmented, gamified lessons.

### Frontend
- **Framework**: React 18 with TypeScript and Vite.
- **Routing**: Wouter.
- **State Management**: TanStack Query.
- **Styling**: Tailwind CSS with shadcn/ui.
- **Animations**: Framer Motion.
- **Forms**: React Hook Form with Zod validation.
- **UI/UX**: Mobile-first design with enhanced typography, section padding, and card hover effects.
- **SEO**: Dynamic meta tags, Open Graph, and keywords managed by a custom `useSEO` hook.

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (ES modules).
- **API Design**: REST endpoints with robust input validation.
- **Validation**: Zod schemas shared across frontend and backend.
- **Authentication**: Custom system with email/password, TOTP MFA, backup codes, session management, email verification, password reset, and Passkeys (WebAuthn) for passwordless authentication. Token versioning for session invalidation on password change.
- **Build**: esbuild.

### Data Layer
- **ORM**: Drizzle ORM for PostgreSQL (serverless via Neon).
- **Schema**: `shared/schema.ts` with `drizzle-zod` for automatic Zod schema generation.
- **Key Tables**: `users`, `contact_messages`, `newsletter_subscribers`, `articles`, `resources`, `newsletters`, `cyberAssessments`, `threat_stats`, `securityAlerts`, `auditLogs`, `learning_paths`, `training_modules`, `training_lessons`, `training_quizzes`, `quiz_questions`, `quiz_attempts`, `training_certificates`, `data_brokers`, `user_vault_profiles`, `exposure_scans`, `exposure_findings`, `removal_requests`, `opt_out_content`, `monitoring_schedules`, `removal_audit_log`, `removal_verifications`.

### Security Architecture
- **Middleware**: Helmet.js for security headers, comprehensive security headers (CSP, HSTS, XSS).
- **Rate Limiting**: Multi-tier with IP-based tracking and auto-blocking (`express-rate-limit`, `express-slow-down`).
- **CSRF Protection**: Origin/Referer header validation, double-submit cookie pattern.
- **Request Security**: Payload limits, XSS/SQLi detection, secure cookie settings, input sanitization (`express-mongo-sanitize`, `hpp`, `DOMPurify`).
- **API Anomaly Detection**: Monitors `/api` routes for suspicious patterns.
- **Centralized Logging**: Winston for security logs, integrated with SIEM. Audit logging for critical admin actions and security events.
- **Compliance**: Mapped controls to OWASP ASVS, CIS Control, ISO 27001, NIST 800-53, MITRE ATT&CK. NIST 800-53 Compliance Dashboard for Enterprise.
- **Admin Dashboard**: Real-time security monitoring at `/admin/security`.
- **Security Monitoring**: Real-time threat detection tracking failed logins, rate limit exceeded events, and CSRF violations with automatic security alert generation.
- **Privacy Commitment**: No behavioral tracking, minimal data collection, no data sales, GDPR-conscious design.

### Content & Tools
- **Content Guidelines**: Educational content based on verified sources (FTC, FBI IC3, CISA), emphasizing empowering language.
- **AI Scam Analyzer**: OpenAI-powered threat analysis tool for messages, emails, headers, URLs, returning structured risk assessment.
- **Scam Checker**: Email header analysis, URL reputation, urgency scoring, multi-engine URL scanning (Google Safe Browsing, VirusTotal), domain age checks, SSL certificate analysis, phone number lookup, screenshot OCR, QR code scanner. Provides six analysis types: URL, QR Code, Image/Screenshot, Phone, Email Header, Situation Analysis (AI-powered with critical rules and authoritative sources).
- **AI & Cyber Safety Hub**: Educational content on AI-powered threats.
- **Child Safety Conversation Scanner**: Client-side grooming pattern detection.
- **Dezi AI Assistant**: Provides analysis and security assistance.
- **Data Broker Removal System**: Enterprise-grade personal data removal from 501 data broker sites. Features include encrypted personal data vault, exposure scanning across all 501+ brokers (13 core adapters + 489 universal adapters with category-specific URL patterns), automated opt-out content generation (CCPA/GDPR templates), removal request tracking, and monitoring schedules. Automated email-based removal request sending via Resend API. Tier-gated features (Free, Essential, Professional+). **Privacy Automation AI**: Unified identity risk scoring (0-100), structured JSON automation API, AI-driven smart removal queue with broker fingerprinting and performance tracking, Executive/Military/Gov Privacy Mode with specialized compliance templates (Privacy Act, OPSEC, FOIA-exempt), exposure likelihood scoring, reappearance risk assessment, verification requirements tracking, ToS/ID risk flags, monitoring alert thresholds, and re-index detection.
- **AI Content Guardrails**: Enforces truthfulness, verifiability, anti-hallucination, writing quality, audience adaptation, and source attribution for all AI-generated content.
- **Automated Weekly Newsletter System**: AI-powered content generation and scheduled sending.
- **Training Academy**: Audience-specific training paths with learning modules, lessons, quizzes, and certificates. Integrated with gamification.
- **Digital Safety Tips Automation**: AI-powered system for generating and sending personalized safety tips.
- **Unified Subscription System**: Manages all email subscriptions through a single `newsletters` table.

### Competitive Differentiator Features
- **Family Safety Codeword Generator**.
- **Audio/Voice Deepfake Detector**.
- **Gamification & Achievement System**.
- **Regional Content Personalization**.
- **Tool Usage Analytics Dashboard**.
- **Automated Threat Intelligence Feed Integration**: Ingests data from 8 trusted sources (URLhaus, PhishTank, CISA, NVD, HIBP).
- **Automated Content Governance System**: Monitors educational content for freshness and relevance.
- **Marketing & Growth Features**: Social sharing, embeddable widgets, success stories, referral tracking.

### Pricing Model
All tools and features are 100% free. No subscription tiers, no paywalls. The platform is supported by community contributions and mission-aligned partners.

## External Dependencies

- **Database**: PostgreSQL (serverless via Neon), Drizzle Kit.
- **UI Frameworks**: Radix UI, shadcn/ui, Lucide React, react-icons.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API, VirusTotal API, RDAP/WHOIS (all proxied via backend). Authoritative report sources: FBI IC3 (2024), FTC Consumer Sentinel (2024), Europol IOCTA (2025), Verizon DBIR (2025), WEF Global Cybersecurity Outlook (2025), UK NCSC Annual Review (2025), Australian ACSC Cyber Threat Report (2024-25), INTERPOL (2025), ITU Global Cybersecurity Index (2024), AARP Fraud Survey (2025), CISA.
- **AI Features**: Anthropic API (Claude), OpenAI.
- **Email Service**: Brevo (primary), MailerSend, SMTP2GO (fallbacks), Resend (for data removal automation).
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding).