# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform designed to simplify cybersecurity for non-technical users. It aims to be a leading, accessible resource by offering interactive safety assessments, real-time threat intelligence, AI-powered scam detection, data broker removal services, a browser extension for real-time protection, and comprehensive family-oriented educational content. The platform addresses a critical market need for accessible cybersecurity solutions beyond traditional corporate offerings.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform features a premium, clean design utilizing a dark teal, deep teal, and orange color palette with Sora typography. UI elements include pill-shaped buttons, split-layout banners, and diverse human imagery. Dedicated hubs maintain distinct thematic designs. Animations respect reduced motion settings.

### Technical Implementation
The frontend uses React 19, TypeScript, and Next.js App Router, with TanStack Query for state management and Tailwind CSS with shadcn/ui for styling. Form validation is handled by React Hook Form with Zod. Next.js manages server-side rendering, routing, and SEO metadata. Server Components are prioritized for crawlability, with client islands for interactivity. ISR/Static generation is configured for content pages.

The backend runs on Express 5 with Node.js and TypeScript, providing REST endpoints and utilizing shared Zod schemas. Authentication supports email/password, TOTP MFA, Passkeys (WebAuthn), and session management. Data persistence uses Drizzle ORM for PostgreSQL. Security measures include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookies, input sanitization, Google reCAPTCHA, and API anomaly detection.

### Data Layer Architecture
Server Components fetch initial data through the Express API via `fetch()` with ISR revalidation. This decouples the Next.js build from the database.

### Key Features
- **AI-Powered Tools**: AI Scam Analyzer for various inputs, identifying multi-step attack patterns with context-aware analysis. Dezi AI Assistant for interactive user support.
- **GCR Scam Guard Browser Extension**: Chrome Manifest V3 extension for real-time protection, auto-scanning, safety badges, and lookalike domain detection.
- **Content & Education**: Training Academy with audience-specific learning paths, Cyber Safety Guides, Scam Intelligence Center, Cyber Threat Radar, interactive hubs with gamified learning, and AI-generated explainer videos.
- **GCR Data Shield**: Personal data exposure scanner checking data brokers and HaveIBeenPwned databases, offering multi-tier data removal and a Personal Data Vault with AES-256-GCM encryption.
- **Identity Shield**: Generates cloaked-style masked identities.
- **Security & Privacy Tools**: Breach Monitoring, Password Generator, and Family Safety Codeword Generator.
- **News & Insights Section**: Features categorised articles with author attribution, bylines, bio cards, and rich meta tags for social sharing.
- **Automation & Governance**: Automated newsletters, AI content guardrails, automated threat intelligence, a social distribution engine, and a link validator. A Content Series Engine generates recurring content.
- **Social Publishing Pipeline**: Professional-grade publisher (`server/bufferPublisher.ts`) with platform-specific rules, image resolution logic, and automated batch publishing with daily limits and deduping. Supports three content depth models: `wire`, `insight`, `deep_value`, each with specific word limits, image strategies, and hashtag strategies to broaden audience reach.
- **Persistent Image Storage**: Social images are stored in Replit Object Storage, served via a dedicated API endpoint with fallback mechanisms.
- **Content Security Policy**: Nonce-based CSP with `strict-dynamic` for enhanced security.
- **SVG Image Generation**: `generatePostImage()` and `generateInstagramImage()` create branded social cards using SVG templates with Sharp, supporting various template styles.
- **Dynamic OG Images**: An `/api/og` endpoint generates branded Open Graph images on-the-fly for alerts and guides.
- **Content Freshness Signals**: Alert detail pages display publication date, last update, verified source count, and a live freshness indicator.
- **Engagement Discovery Engine**: Monitors RSS feeds and generates AI-suggested comments for thought leadership.
- **Monthly Removal Reports**: Automated monthly HTML email reports detailing privacy scores and removal progress.
- **Free Platform Model**: The platform is entirely free.
- **Admin & SEO**: Comprehensive admin system with role-based access, scan activity monitoring, SEO keyword database, internal linking, dynamic sitemap, and universal meta injection. Public pages are fully SSR for SEO. Supports FAQPage, NewsArticle, and Organization JSON-LD schemas. AI bots are allowed for AEO.
- **Global Scam Intelligence Dashboard**: Real-time 3D globe visualization (`react-globe.gl`) showing scam activity across 40+ countries with data from FBI IC3, INTERPOL, CISA, and 20+ national CERTs. Features animated cross-border scam flow arcs, risk-colored hotspots, live threat feed, regional breakdowns, and scam type analysis. Server-side aggregator refreshes every 30 minutes. Globe uses `React.lazy` + `Suspense` with a 15-second timeout and `GlobeBoundary` error boundary for graceful fallback. CSP middleware (`middleware.ts`) includes `worker-src 'self' blob:` for Three.js workers, `https://unpkg.com` for globe textures, and `https://ipapi.co` for visitor geolocation. WebGL detection with retry support.
- **Homepage Architecture**: Consolidated 9-section homepage with Hero, Live Activity Bar, How It Works, Threat Awareness, Scam Globe Teaser, Product Showcase, Audience Paths, Content Preview, and Newsletter CTA.
- **Business Pages**: Dedicated pages for organizations, advertising, and a downloadable partner deck.
- **Navigation Architecture**: A two-hub structure: Protection Hub (tools) and Learning Hub (educational content).
- **User Dashboard**: Displays safety score, activity statistics, product status, quick actions, recent scans, regional threats, and threat intelligence.
- **Account Settings**: Comprehensive account management including profile editing, password changes, and MFA status.

### Platform Security Posture Engine
A proactive self-assessment system (`server/security/platformPostureEngine.ts`) that scans the platform's security configuration across 10 categories and 35+ checks (e.g., Headers & Transport, Authentication, Input Validation, Data Protection, Extension Security). It provides a weighted composite score (0-100) with a letter grade, tracks historical scores, and offers auto-remediation for certain issues via the admin UI.

## External Dependencies

- **Database**: PostgreSQL (Neon), Drizzle Kit.
- **UI & Styling**: Radix UI, shadcn/ui, Lucide React, react-icons, Tailwind CSS.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Payments**: Stripe.
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API v4, VirusTotal API, AlienVault OTX, RDAP/WHOIS, XposedOrNot, FBI IC3, FTC Consumer Sentinel, Europol IOCTA, Verizon DBIR, WEF Global Cybersecurity Outlook, UK NCSC, Australian ACSC, INTERPOL, ITU Global Cybersecurity Index, AARP Fraud Survey, CISA.
- **AI Services**: Anthropic API (Claude), OpenAI.
- **Email Services**: Brevo, MailerSend, SMTP2GO, Resend.
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding), Sharp.
- **Social Publishing**: Buffer.