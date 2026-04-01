# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform providing practical knowledge to non-technical users like families, parents, children, and seniors. It simplifies cybersecurity through interactive safety assessments, real-time threat intelligence, and educational content. The platform's vision is to become a leading, accessible cybersecurity education resource for everyone, offering AI-powered scam detection, data broker removal, a browser extension for real-time protection, and comprehensive family-oriented educational content. It addresses the market gap for accessible cybersecurity solutions often overlooked by traditional corporate offerings.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform uses a premium, clean design with a dark teal, deep teal, and orange color palette, and Sora typography. UI elements feature pill-shaped buttons, split-layout banners, and diverse human imagery. The homepage includes an emotional hero section, data statistics, content previews, and audience-specific pathways. Dedicated hubs for Kids, Seniors, Parents, Educators, and Small Businesses maintain distinct themes. All animations respect reduced motion settings.

### Technical Implementation
The frontend is built with React 19, TypeScript, and Vite, using Wouter for routing, TanStack Query for state management, and Tailwind CSS with shadcn/ui for styling. Framer Motion manages animations, while React Hook Form with Zod handles form management and validation. Vite SSR is implemented for all public pages for performance and SEO. The backend uses Express 5 on Node.js with TypeScript, providing REST endpoints and shared Zod schemas. Authentication supports email/password, TOTP MFA, Passkeys (WebAuthn), and session management. Data is managed with Drizzle ORM for PostgreSQL (via Neon). Security measures include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookies, input sanitization, Google reCAPTCHA, API anomaly detection, and a GDPR-compliant cookie consent banner.

### Key Features
- **AI-Powered Tools**: Includes an AI Scam Analyzer, Scam Checker for various inputs (URLs, QR codes, screenshots, SMS), deepfake/AI voice scam awareness, scan history, shareable reports, community scam reporting, and "Scam of the Week" alerts.
- **GCR Scam Guard Browser Extension**: A Chrome Manifest V3 extension offering auto-scan on page load, real-time safety badges, lookalike domain detection, form submission warnings, enhanced URL reputation analysis, notification spam blocking, search result safety annotations, redirect chain detection, and clipboard hijack protection.
- **Dezi AI Assistant**: A persistent, floating widget powered by Anthropic Claude AI for interactive support.
- **Content & Education**: Offers a Training Academy with audience-specific learning paths, AI Prompt Library, Cyber Safety Guides (including 6 Social Media Security guides for Facebook, Instagram, X/Twitter, TikTok, LinkedIn, WhatsApp covering 2FA setup, privacy settings, data download, and account deletion), Scam Intelligence Center, Cyber Threat Radar, and interactive hubs with gamified learning and scenario-based quizzes. Social media guides are defined in `server/socialMediaGuidesData.ts` and seeded via `ensureCriticalGuides()` in `server/contentSeed.ts`.
- **GCR Data Shield**: A personal data exposure scanner checking 500+ data brokers and HaveIBeenPwned databases. Features a three-tier data removal system: guided self-removal, automated opt-out request submission, and continuous protection with monthly re-scans. The Personal Data Vault uses AES-256-GCM field-level encryption for sensitive PII with a zero-knowledge vault key infrastructure.
- **Identity Shield**: Integrated within GCR Data Shield, it provides cloaked-style masked identity generation (disposable email aliases, masked phone numbers, random usernames).
- **Security & Privacy**: Provides a Data Broker Removal System, Breach Monitoring, Password Generator, and Family Safety Codeword Generator.
- **News Section**: Curates and simplifies cybersecurity news from 20 trusted RSS feeds using AI for families, with relevance scoring.
- **Automation & Governance**: Features automated weekly newsletters, AI content guardrails, automated threat intelligence, and a social distribution engine. The social engine posts 7 days a week with themed content pillars, breaking news overrides, and posts via Buffer to LinkedIn, Facebook, and Instagram with platform-specific optimizations. Link-in-first-comment strips article URLs from post body and posts them as first comment via Buffer GraphQL API (LinkedIn/Facebook only, Instagram excluded). Social post images use a multi-source pipeline: Unsplash (premium editorial quality, tried first) → Pexels (broadest coverage, unlimited) → local Picsum fallback. All sources provide unwatermarked originals up to 6000x4000+. Shutterstock API is integrated for search but only provides watermarked previews on the free tier so is not used for production images. Topic-aware keyword mapping selects contextually relevant stock photos for each article's subject matter.
- **Engagement Discovery Engine**: Monitors 15+ cybersecurity RSS feeds every 4 hours, scores opportunities by relevance, and generates AI-suggested comments via Claude. Admin dashboard at `/admin/engagement` shows discovered opportunities with three actions: (1) **Create Response Post** — AI generates a branded thought-leadership post about the trending topic, published to your own profiles via Buffer with article URL as first comment; (2) **Save** — approve the comment for manual use; (3) **Dismiss**. Each card shows platform search links (LinkedIn/Facebook search by article title) and source article links. DB table: `engagement_opportunities` with `platform_search_url` column.
- **Monthly Removal Reports**: Automated monthly HTML email reports for subscribers detailing privacy scores and removal progress.
- **Independent Subscription Products**: GCR Scam Guard and GCR Data Shield are separate subscription products with independent Stripe products, pricing, and tier tracking, including bundle plans. **Free Access Period (until Oct 2026)**: All features are unlocked for all users via `FREE_ACCESS_UNTIL` in `shared/models/auth.ts`. `hasTierAccess()` returns true, all API endpoints return professional-tier access, Stripe checkout is blocked, Pricing nav is hidden, and pricing pages show "All Features Currently Free" banners. To re-enable paid tiers, update or remove the `FREE_ACCESS_UNTIL` date.
- **Admin & SEO**: A comprehensive admin system with role-based access control, scan activity monitoring, SEO keyword database, internal linking engine, dynamic sitemap generation, and universal meta injection.
- **Social Engine UTM Tracking**: All social posts include UTM parameters for analytics, with Instagram excluded. AI prompts optimize formatting for specific platforms to avoid algorithmic suppression.
- **Navigation Architecture**: A two-hub structure: **Protection Hub** (GCR Scam Guard and GCR Data Shield tools) and **Learning Hub** (educational content). Includes desktop dropdowns and mobile menus, with a redesigned `/tools` page featuring a two-product layout and deep-link support.
- **User Dashboard**: Product-aware dashboard at `/dashboard` showing safety score, activity stats, Scam Guard status card, Data Shield status card with removal progress, quick actions, recent scan activity, regional threats, and threat intelligence. Includes post-signup onboarding checklist (localStorage-persisted) and upgrade CTAs for free users.
- **Account Settings**: Full account management at `/account` with profile editing, password change, MFA status, and subscription management for both products.
- **Dashboard Stats API**: `GET /api/user/dashboard-stats` returns authenticated user metrics (scan count, brokers found, removal progress, breach alerts, masked identities, learning progress, safety score, recent scans).
- **Auth Flow**: Registration success shows structured "what's next" steps. Login page shows verified email banner when redirected from email verification (`?verified=true`). Post-login redirects to dashboard.

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

## Security & Performance Audit (Completed)
- **CSP**: `unsafe-inline` removed from `scriptSrc` in production (kept in dev for Vite HMR). `imgSrc` whitelisted to Unsplash/Pexels/Picsum domains. `connectSrc` restricted to known API endpoints. Both `server/security.ts` and `server/security/middleware.ts` updated.
- **PII Logging**: Sensitive API routes excluded from response body logging. Registration log no longer includes email.
- **Error Format**: Global error handler returns `{ error: message }` consistently.
- **Performance**: All routes lazy-loaded in `App.tsx` (Home/NotFound eager). Static assets cached with `max-age=1y, immutable`. Vite `manualChunks` splits framer-motion, @tanstack/react-query, radix-ui. TanStack Query `staleTime` set to 5 minutes.
- **Accessibility**: `aria-live="polite"` on scam checker and data removal scan result containers. Touch targets meet 44px minimum on icon buttons. H1 responsive sizing (1.75rem mobile, 2.25rem desktop).
- **Cookie Security**: CSRF cookies use `sameSite: "strict"`, session cookies use `sameSite: "lax"` (documented in code comments).
- **SEO**: Cross-reference comment added to `use-seo.ts` for server-side meta sync with `seo-meta-resolver.ts`.
- **Content**: WhatsApp guide includes encrypted backup privacy warning. Trust-strip marquee uses 3x duplication for seamless loop.