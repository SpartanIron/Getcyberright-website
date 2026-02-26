# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a 100% free, family-focused cybersecurity education platform providing practical knowledge to non-technical users, including families, parents, kids, seniors, and everyday people. Its purpose is to simplify complex cybersecurity information through interactive safety assessments, real-time threat intelligence, and audience-specific educational content. The project's vision is to cover those underserved by corporate cybersecurity, offering all tools and resources freely without paywalls or premium tiers.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform uses an enterprise teal and orange color scheme with a flat, minimal aesthetic, prioritizing accessibility, SEO, and print support. Audience-specific hubs (Kids, Seniors, Parents, Educators, Small Business) feature distinct color themes while maintaining brand consistency. The Kids Digital Safety Hub offers age-segmented, gamified lessons. The homepage features animated hero entrance (Framer Motion staggered animations), gradient-animated "Get CyberRight." headline text (teal-to-orange shimmer), animated trust stats bar with count-up numbers (500+ brokers, 406+ prompts, 5 feeds, 100% free), and a subtle hero background glow effect. All animations respect prefers-reduced-motion. Em dashes are prohibited in all user-facing content.

### Technical Implementation
- **Frontend**: React 19 with TypeScript and Vite, Wouter for routing, TanStack Query for state management, Tailwind CSS with shadcn/ui for styling, Framer Motion for animations, and React Hook Form with Zod for forms. It features a mobile-first design with dynamic SEO management.
- **Backend**: Express 5 on Node.js with TypeScript (ES modules), employing REST endpoints with robust input validation using shared Zod schemas.
- **Authentication**: A custom system supporting email/password, TOTP MFA, backup codes, session management, email verification, password reset, and Passkeys (WebAuthn).
- **Data Layer**: Drizzle ORM for PostgreSQL (serverless via Neon), using `drizzle-zod` for automatic Zod schema generation across 47 key tables.
- **Security**: Helmet.js for security headers, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookie settings, input sanitization, and Google reCAPTCHA. It includes API anomaly detection, centralized Winston logging, and compliance mapped to OWASP ASVS, CIS Controls, ISO 27001, NIST 800-53, and MITRE ATT&CK. An admin dashboard provides real-time security monitoring and audit logging.

### Key Features
- **AI Scam Analyzer**: OpenAI-powered tool for threat analysis of messages, emails, headers, and URLs.
- **Scam Checker**: Comprehensive analysis of URLs, QR codes, images, phone numbers, and email headers using multiple engines and AI.
- **AI Prompt Library & Management System**: 406+ expert-crafted AI prompts across 8 categories (safety, productivity, finance, communication, learning, health, work, tech) with automated weekly review and improvement suggestions via Claude, and admin approval workflows. Prompts use advanced prompt engineering: role assignment, chain-of-thought reasoning, structured output formatting, and safety guardrails.
- **Dezi AI Assistant**: A floating chat widget offering real-time scam analysis, password generation, phishing education, and region-aware security resources.
- **Data Broker Removal System**: Enterprise-grade system for automated personal data removal from 501+ data broker sites, featuring an encrypted data vault, exposure scanning, automated opt-out content generation, and AI-driven privacy automation for identity risk scoring and removal queue management. Refactored from a single 3939-line file into 13 focused components in `client/src/components/data-removal/`. The page uses a guided scan-first journey flow (Vault → Scan → Remove → Monitor) instead of tabs, with progress celebration after removals. All features are completely free with no subscription gates.
- **AI Content Guardrails**: Ensures truthfulness, verifiability, and quality for AI-generated content.
- **Automated Weekly Newsletter System**: AI-powered content generation and scheduled sending.
- **Training Academy**: Audience-specific learning paths with modules, lessons, quizzes, and certificates.
- **Breach Monitoring**: Automated breach checking and subscription-based monitoring.
- **Password Generator**: Interactive tool for secure password creation.
- **Audio/Voice Deepfake Detector**: Analyzes audio for deepfake indicators.
- **Family Safety Codeword Generator**: Generates secure codewords for emergency verification.
- **Gamification & Achievement System**: Includes badge definitions, user badges, and progress tracking.
- **Dynamic Trending Threats**: AI-powered, geo-tagged threat alerts on the homepage that auto-refresh every 6 hours using Claude Haiku. Threats are region-specific (13 regions including US, EU, West/East/Southern Africa, South/Southeast Asia) and audience-targeted (seniors, families, children, general). Uses timezone-based geo-detection on the frontend. Admin can manually trigger AI refresh or add threats manually. Em dashes are sanitized from all content. Schema: `trending_threats` table with regions array, audience, severity, auto-expiration.
- **Automated Threat Intelligence**: Ingests data from 8 trusted sources (URLhaus, PhishTank, CISA, NVD, HIBP).
- **Automated Content Governance System**: Monitors educational content for freshness and relevance.
- **Admin System**: Comprehensive admin dashboard for user management, security monitoring, threat intelligence, content governance, AI prompt management, and trending threat management.

## External Dependencies

- **Database**: PostgreSQL (Neon), Drizzle Kit.
- **UI Libraries**: Radix UI, shadcn/ui, Lucide React, react-icons.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API, VirusTotal API, RDAP/WHOIS. Authoritative report sources include FBI IC3, FTC Consumer Sentinel, Europol IOCTA, Verizon DBIR, WEF Global Cybersecurity Outlook, UK NCSC, Australian ACSC, INTERPOL, ITU Global Cybersecurity Index, AARP Fraud Survey, CISA.
- **AI Features**: Anthropic API (Claude claude-sonnet-4-20250514), OpenAI.
- **Email Service**: Brevo (primary), MailerSend, SMTP2GO (fallbacks), Resend (for data removal automation).
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding).