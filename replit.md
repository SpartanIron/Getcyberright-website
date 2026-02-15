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
- **Custom Hooks**: `use-analytics`, `use-animated-counter`, `use-auth`, `use-crypto-worker`, `use-mobile`, `use-recaptcha`, `use-referral`, `use-seo`, `use-toast`.

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (ES modules).
- **API Design**: REST endpoints with robust input validation.
- **Validation**: Zod schemas shared across frontend and backend.
- **Authentication**: Custom system with email/password, TOTP MFA, backup codes, session management, email verification, password reset, and Passkeys (WebAuthn) for passwordless authentication. Token versioning for session invalidation on password change.
- **Build**: esbuild.

### Data Layer
- **ORM**: Drizzle ORM for PostgreSQL (serverless via Neon).
- **Schema**: `shared/schema.ts` with `drizzle-zod` for automatic Zod schema generation.
- **Key Tables** (47 total): `aiPrompts`, `audioAnalysisHistory`, `badgeDefinitions`, `breachCheckResults`, `breachMonitoringSubscriptions`, `brokerPerformance`, `brokerWalkthroughs`, `complianceAssessments`, `complianceControlFamilies`, `complianceControls`, `contactMessages`, `contentAuditLog`, `contentPages`, `contentRefreshMappings`, `dataBrokers`, `exposureFindings`, `exposureScans`, `familyCodewords`, `feedHealthAlerts`, `feedRuns`, `learningPaths`, `monitoringSchedules`, `newsletterIssues`, `newsletterSubscribers`, `optOutContent`, `privacyReports`, `profileDiscoveries`, `promptReviewRuns`, `promptReviews`, `quizAttempts`, `quizQuestions`, `removalAuditLog`, `removalRequests`, `removalVerifications`, `scamReports`, `securityAlerts`, `threatFeeds`, `threatItems`, `toolUsage`, `trainingCertificates`, `trainingLessons`, `trainingModules`, `trainingQuizzes`, `userBadges`, `userLearningProgress`, `userProgress`, `userVaultProfiles`.

### Security Architecture
- **Middleware**: Helmet.js for security headers, comprehensive security headers (CSP, HSTS, XSS).
- **Rate Limiting**: Multi-tier with IP-based tracking and auto-blocking (`express-rate-limit`, `express-slow-down`).
- **CSRF Protection**: Origin/Referer header validation, double-submit cookie pattern.
- **Request Security**: Payload limits, XSS/SQLi detection, secure cookie settings, input sanitization (`express-mongo-sanitize`, `hpp`, `DOMPurify`).
- **reCAPTCHA**: Google reCAPTCHA integration for form protection (`use-recaptcha` hook, server-side validation via `server/security/recaptcha.ts`). Badge repositioned via CSS to avoid overlap with Dezi chat widget.
- **API Anomaly Detection**: Monitors `/api` routes for suspicious patterns.
- **Centralized Logging**: Winston for security logs, integrated with SIEM. Audit logging for critical admin actions and security events.
- **Compliance**: Mapped controls to OWASP ASVS, CIS Control, ISO 27001, NIST 800-53, MITRE ATT&CK. NIST 800-53 Compliance Dashboard for Enterprise.
- **Admin Dashboard**: Real-time security monitoring at `/admin/security`.
- **Security Monitoring**: Real-time threat detection tracking failed logins, rate limit exceeded events, and CSRF violations with automatic security alert generation.
- **Security Policy**: `SECURITY.md` at project root with vulnerability reporting guidelines, responsible disclosure policy, safe harbor statement, and scope definitions.
- **Privacy Commitment**: Analytics used only to improve user experience, minimal data collection, no data sales, GDPR-conscious design.
- **Security Modules** (`server/security/`): `auth.ts`, `config.ts`, `csrf.ts`, `middleware.ts`, `recaptcha.ts`, `sanitizer.ts`, `security-audit.ts`, `security-monitor.ts`, `validators.ts`.

### Content & Tools
- **Content Guidelines**: Educational content based on verified sources (FTC, FBI IC3, CISA), emphasizing empowering language.
- **AI Scam Analyzer**: OpenAI-powered threat analysis tool for messages, emails, headers, URLs, returning structured risk assessment.
- **Scam Checker**: Email header analysis, URL reputation, urgency scoring, multi-engine URL scanning (Google Safe Browsing, VirusTotal), domain age checks, SSL certificate analysis, phone number lookup, screenshot OCR, QR code scanner. Provides six analysis types: URL, QR Code, Image/Screenshot, Phone, Email Header, Situation Analysis (AI-powered with critical rules and authoritative sources).
- **AI Prompt Library**: 116 curated AI prompts across 8 categories (productivity, communication, safety, health, finance, learning, work, tech) and 5 audiences (everyday, seniors, families, students, business). Database-driven with slug-based deduplication for incremental seeding (`server/promptSeed.ts`). Frontend at `/ai-prompts` with audience tabs, category filtering, search, and copy-to-clipboard.
- **AI Prompt Management System**: Automated weekly AI review runs using Claude (claude-sonnet-4-20250514) to analyze prompts, suggest improvements for those scoring below 85/100, and generate new prompt ideas. Admin approval workflow at `/admin/prompt-management`. Tables: `promptReviewRuns`, `promptReviews`.
- **AI & Cyber Safety Hub**: Educational content on AI-powered threats.
- **Child Safety Conversation Scanner**: Client-side grooming pattern detection.
- **Dezi AI Assistant**: Floating chat widget (`client/src/components/dezi-assistant.tsx`) providing real-time scam analysis, password generation, phishing education, and region-aware security resources (supports US, UK, CA, AU, NZ, IE, DE, FR, IN, and 8 African countries). Includes pattern-based scam detection and contextual safety guidance.
- **Data Broker Removal System**: Enterprise-grade personal data removal from 501 data broker sites. Features include encrypted personal data vault, exposure scanning across all 501+ brokers (13 core adapters + 489 universal adapters with category-specific URL patterns), automated opt-out content generation (CCPA/GDPR templates), removal request tracking, and monitoring schedules. Automated email-based removal request sending via Resend API. **Privacy Automation AI**: Unified identity risk scoring (0-100), structured JSON automation API, AI-driven smart removal queue with broker fingerprinting and performance tracking, Executive/Military/Gov Privacy Mode with specialized compliance templates (Privacy Act, OPSEC, FOIA-exempt), exposure likelihood scoring, reappearance risk assessment, verification requirements tracking, ToS/ID risk flags, monitoring alert thresholds, and re-index detection.
- **AI Content Guardrails**: Enforces truthfulness, verifiability, anti-hallucination, writing quality, audience adaptation, and source attribution for all AI-generated content.
- **Automated Weekly Newsletter System**: AI-powered content generation and scheduled sending.
- **Training Academy**: Audience-specific training paths with learning modules, lessons, quizzes, and certificates. Integrated with gamification.
- **Digital Safety Tips Automation**: AI-powered system for generating and sending personalized safety tips.
- **Unified Subscription System**: Manages all email subscriptions through a single `newsletters` table.
- **Breach Monitoring**: Automated breach checking with subscription-based monitoring and dashboard at `/breach-dashboard`.
- **Password Generator**: Interactive tool at `/password-generator` for creating secure passwords with customizable options.
- **Audio/Voice Deepfake Detector**: Analyzes audio for deepfake indicators (`client/src/components/audio-deepfake-detector.tsx`).
- **Family Safety Codeword Generator**: Generates secure family codewords for emergency verification (`client/src/components/family-codeword.tsx`).
- **Scam Reporting**: Community scam report submission and tracking at `/report-scam`.

### Competitive Differentiator Features
- **Family Safety Codeword Generator**.
- **Audio/Voice Deepfake Detector**.
- **Gamification & Achievement System**: Badge definitions, user badges, user progress tracking.
- **Regional Content Personalization**: Region-aware Dezi assistant and content.
- **Tool Usage Analytics Dashboard**: Admin analytics at `/admin` with tool usage tracking.
- **Automated Threat Intelligence Feed Integration**: Ingests data from 8 trusted sources (URLhaus, PhishTank, CISA, NVD, HIBP). Advanced analytics via `server/threat-analytics.ts` and `server/advancedThreatIntelligence.ts`.
- **Automated Content Governance System**: Monitors educational content for freshness and relevance (`server/contentGovernanceService.ts`).
- **Marketing & Growth Features**: Social sharing, embeddable widgets (`/embed-widget`), success stories, referral tracking.
- **News Aggregation**: Real-time cybersecurity news feed and live news ticker.
- **Printable Safety Guides**: Downloadable checklists and guides at `/printable-guides`.

### Audience-Specific Hubs
- **Kids Hub** (`/kids`): Age-segmented digital safety lessons with gamification.
- **Seniors Hub** (`/seniors`, `/senior-safety`): Targeted safety content for older adults.
- **Parents Hub** (`/parents`, `/parent-guide`): Parenting-focused digital safety resources.
- **Educators Hub** (`/educators`): Teaching resources and curriculum materials.
- **Small Business Hub** (`/small-business`): Business-focused cybersecurity guidance.
- **Youth Safety** (`/youth-safety`): Teen-specific online safety content.

### Admin System
- **Admin Dashboard** (`/admin`): Central admin panel with sub-pages.
- **Admin Pages**: User management (`/admin/users`), Messages (`/admin/messages`), Subscribers (`/admin/subscribers`), Scam Reports (`/admin/scam-reports`), Tool Analytics (`/admin/tool-analytics`), Password Change (`/admin/change-password`).
- **Specialized Admin**: Security monitoring (`/admin/security`), Threat Intelligence (`/admin/threat-intelligence`), Newsletter management (`/admin/newsletter`), Content Governance (`/admin/content-governance`), NIST Compliance (`/admin/compliance`), AI Prompt Management (`/admin/prompt-management`).

### Pricing Model
All tools and features are 100% free. No subscription tiers, no paywalls. The platform is supported by community contributions and mission-aligned partners.

## Key Server Services
- `server/auth.ts` - Authentication with WebAuthn support (`server/webauthn.ts`)
- `server/routes.ts` - All API route definitions
- `server/database-storage.ts` - Database storage implementation
- `server/storage.ts` - Storage interface
- `server/promptSeed.ts` - AI prompt seeding (116 prompts, slug-based deduplication)
- `server/promptReviewService.ts` - Automated AI prompt review system
- `server/scam-checker.ts` - Multi-engine scam analysis
- `server/dataBrokerService.ts` - Data broker removal orchestration
- `server/threatIntelService.ts` - Threat intelligence feed management
- `server/newsletterService.ts` - Automated newsletter generation and sending
- `server/breach-monitor.ts` - Breach monitoring scheduler
- `server/email-service.ts` - Multi-provider email service (Brevo, MailerSend, SMTP2GO)
- `server/email-scheduler.ts` - Scheduled email automation
- `server/complianceService.ts` - NIST 800-53 compliance management
- `server/contentGovernanceService.ts` - Content freshness monitoring
- `server/security-alert-fetcher.ts` - CISA/US-CERT alert ingestion
- `server/news-aggregator.ts` - Cybersecurity news aggregation
- `server/logger.ts` - Winston-based centralized logging

## External Dependencies

- **Database**: PostgreSQL (serverless via Neon), Drizzle Kit.
- **UI Frameworks**: Radix UI, shadcn/ui, Lucide React, react-icons.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API, VirusTotal API, RDAP/WHOIS (all proxied via backend). Authoritative report sources: FBI IC3 (2024), FTC Consumer Sentinel (2024), Europol IOCTA (2025), Verizon DBIR (2025), WEF Global Cybersecurity Outlook (2025), UK NCSC Annual Review (2025), Australian ACSC Cyber Threat Report (2024-25), INTERPOL (2025), ITU Global Cybersecurity Index (2024), AARP Fraud Survey (2025), CISA.
- **AI Features**: Anthropic API (Claude claude-sonnet-4-20250514), OpenAI.
- **Email Service**: Brevo (primary), MailerSend, SMTP2GO (fallbacks), Resend (for data removal automation).
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding).

## Recent Changes
- Expanded AI Prompt Library from 52 to 116 prompts with comprehensive coverage across all audiences and categories.
- Added automated AI Prompt Management System with weekly review runs and admin approval workflow.
- Added SECURITY.md with vulnerability reporting, responsible disclosure, and safe harbor policies.
- Fixed reCAPTCHA badge overlap with Dezi chat widget via CSS repositioning.
