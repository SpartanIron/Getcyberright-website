# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform designed to simplify cybersecurity for non-technical users. It aims to be a leading, accessible resource by offering interactive safety assessments, real-time threat intelligence, AI-powered scam detection, data broker removal services, a browser extension for real-time protection, and comprehensive family-oriented educational content. The platform addresses a critical market need for accessible cybersecurity solutions beyond traditional corporate offerings.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform features a premium, clean design utilizing a dark teal, deep teal, and orange color palette with Sora typography. UI elements include pill-shaped buttons, split-layout banners, and diverse human imagery. Dedicated hubs for Kids, Seniors, Parents, Educators, and Small Businesses maintain distinct thematic designs. Animations respect reduced motion settings.

### Technical Implementation
The frontend is built with React 19, TypeScript, and Next.js App Router, using TanStack Query for state management and Tailwind CSS with shadcn/ui for styling. Form validation is handled by React Hook Form with Zod. Next.js handles server-side rendering and routing with dedicated App Router files for each route, providing proper `generateMetadata` with OG tags, canonical URLs, JSON-LD, and robots directives. Server Components are prioritized for crawlability, with client islands for interactive elements. ISR/Static generation is configured for content pages. The backend runs on Express 5 with Node.js and TypeScript, providing REST endpoints and utilizing shared Zod schemas. Authentication supports email/password, TOTP MFA, Passkeys (WebAuthn), and session management. Data persistence uses Drizzle ORM for PostgreSQL. Security measures include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookies, input sanitization, Google reCAPTCHA, and API anomaly detection.

### Key Features
- **AI-Powered Tools**: Includes an AI Scam Analyzer with an Advanced Scam Intelligence Engine for URLs, QR codes, screenshots, and SMS, identifying multi-step attack patterns and leveraging context-aware analysis.
- **GCR Scam Guard Browser Extension**: A Chrome Manifest V3 extension providing real-time protection with auto-scanning, safety badges, lookalike domain detection, and other protective features.
- **Dezi AI Assistant**: A persistent, floating widget powered by Anthropic Claude AI for interactive user support.
- **Content & Education**: Offers a Training Academy with audience-specific learning paths, Cyber Safety Guides, a Scam Intelligence Center, Cyber Threat Radar, interactive hubs with gamified learning, and AI-generated explainer videos.
- **GCR Data Shield**: A personal data exposure scanner checking over 500 data brokers and HaveIBeenPwned databases, offering a three-tier data removal system and a Personal Data Vault with AES-256-GCM encryption.
- **Identity Shield**: Generates cloaked-style masked identities (disposable emails, masked phone numbers).
- **Security & Privacy Tools**: Includes Breach Monitoring, a Password Generator, and a Family Safety Codeword Generator.
- **News & Insights Section**: Rebranded from "News" to "News & Insights" sitewide (nav, hero, breadcrumbs, JSON-LD, i18n). Category filter tags: All, Action Needed, Threat Intel, AI Safety, Tech & Privacy, Learning, Events. Author attribution via two personas: "Jude Annan, CISM" (threat/insight articles) and "GCR Editorial Team" (learning content). Author bylines and bio cards on article detail pages. Twitter Card meta tags (`summary_large_image`) on all article and listing pages. Learning content pipeline preserves external resource URLs.
- **Automation & Governance**: Features automated weekly newsletters, AI content guardrails, automated threat intelligence, a social distribution engine integrated with Buffer, and a link validator. A Content Series Engine generates recurring content like "Weekly Threat Brief" and "Learning Spotlight."
- **Dynamic OG Images**: An `/api/og` endpoint generates branded Open Graph images on-the-fly for alerts and guides, with severity-coded accents.
- **Content Freshness Signals**: Alert detail pages display publication date, last update, verified source count, and a live freshness indicator.
- **Engagement Discovery Engine**: Monitors RSS feeds and generates AI-suggested comments for thought leadership.
- **Monthly Removal Reports**: Automated monthly HTML email reports detailing privacy scores and removal progress.
- **Free Platform Model**: The platform is entirely free, with all pricing pages redirecting to the homepage and user-facing text reflecting "everything is free."
- **Admin & SEO**: A comprehensive admin system with role-based access control, scan activity monitoring, SEO keyword database, internal linking engine, dynamic sitemap generation, and universal meta injection. Public pages are fully SSR for SEO.
- **SEO & AEO Architecture**: Implements FAQPage, NewsArticle, and Organization JSON-LD schemas. AI bots (GPTBot, ClaudeBot, PerplexityBot) are allowed via robots.txt for AEO.
- **Navigation Architecture**: A two-hub structure: Protection Hub (tools) and Learning Hub (educational content).
- **User Dashboard**: Displays safety score, activity statistics, product status cards, quick actions, recent scans, regional threats, and threat intelligence.
- **Account Settings**: Comprehensive account management including profile editing, password changes, and MFA status.

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