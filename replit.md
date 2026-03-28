# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform dedicated to providing practical knowledge to non-technical users such as families, parents, children, and seniors. It aims to simplify cybersecurity through interactive safety assessments, real-time threat intelligence, and educational content. The platform offers essential tools, with a vision to become a leading, accessible cybersecurity education resource for everyone, addressing those often overlooked by traditional corporate solutions. Key capabilities include AI-powered scam detection, data broker removal, a browser extension for real-time protection, and comprehensive family-oriented educational content.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform features a premium, clean design with a color palette of dark teal, deep teal, and orange. Typography uses Sora for all text. UI elements include pill-shaped buttons, split-layout banners, and diverse human imagery. The homepage emphasizes an emotional hero section, data statistics, content previews, and audience-specific pathways. Dedicated hubs for Kids, Seniors, Parents, Educators, and Small Businesses maintain distinct themes. All animations are designed to respect reduced motion settings.

### Technical Implementation
The frontend is built with React 19, TypeScript, and Vite, utilizing Wouter for routing, TanStack Query for state management, and Tailwind CSS with shadcn/ui for styling. Framer Motion manages animations, while React Hook Form with Zod handles form management and validation. The design is mobile-first with dynamic SEO. **Vite SSR (Server-Side Rendering)** is implemented for all public pages to ensure fully rendered HTML delivery, enhancing performance and SEO. The backend uses Express 5 on Node.js with TypeScript, providing REST endpoints and shared Zod schemas for validation. Authentication supports email/password, TOTP MFA, Passkeys (WebAuthn), and session management. Data is managed with Drizzle ORM for PostgreSQL (serverless via Neon). Security measures include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookies, input sanitization, Google reCAPTCHA, and API anomaly detection. A GDPR-compliant cookie consent banner is also integrated.

### Key Features
- **AI-Powered Tools**: Includes an AI Scam Analyzer, Scam Checker (for URLs, QR codes, screenshots, and SMS validation), deepfake/AI voice scam awareness, scan history, shareable reports, community scam reporting, and Scam of the Week alerts.
- **GCR Scam Guard Browser Extension**: A Chrome Manifest V3 extension providing auto-scan on page load, real-time safety badges, lookalike domain detection, form submission warnings, and enhanced URL reputation analysis.
- **Dezi AI Assistant**: A persistent, floating widget powered by Anthropic Claude AI for interactive support.
- **Content & Education**: Offers a Training Academy with audience-specific learning paths, AI Prompt Library, Cyber Safety Guides, Scam Intelligence Center, Cyber Threat Radar, and interactive hubs for various audiences with gamified learning and scenario-based quizzes.
- **GCR Data Shield**: A personal data exposure scanner that checks 500+ data brokers and HaveIBeenPwned databases. It features a three-tier data removal system: guided self-removal, automated opt-out request submission, and continuous protection with monthly re-scans.
- **Security & Privacy**: Provides a Data Broker Removal System, Breach Monitoring, Password Generator, and Family Safety Codeword Generator.
- **News Section**: Curates cybersecurity news from 20 trusted RSS feeds, simplified by AI for families. It includes a relevance scoring system to filter irrelevant content and prioritize actionable stories.
- **Automation & Governance**: Features automated weekly newsletters, AI content guardrails, automated threat intelligence, and a social distribution engine.
- **Monthly Removal Reports**: Automated monthly HTML email reports for subscribers detailing privacy scores, removal progress, and exposed data categories.
- **Independent Subscription Products**: GCR Scam Guard and GCR Data Shield are separate subscription products with independent Stripe products, pricing, and tier tracking. Users can subscribe to one, both, or neither independently.
  - **GCR Scam Guard** (`/gcr-guard-pricing`): Free / Pro $4.99/mo ($3.99 annual) / Family $7.99/mo ($5.99 annual). Stripe keys: `sg_essential_monthly`, `sg_essential_annual`, `sg_professional_monthly`, `sg_professional_annual`. Stored in `subscriptionTier` + `subscriptionExpiresAt` DB fields.
  - **GCR Data Shield** (`/data-shield-pricing`): Scan (Free) / Essential $8.99/mo ($6.99 annual) / Professional $14.99/mo ($11.99 annual). Stripe keys: `ds_essential_monthly`, `ds_essential_annual`, `ds_professional_monthly`, `ds_professional_annual`. Stored in `shieldSubscriptionTier` + `shieldSubscriptionExpiresAt` DB fields.
  - Stripe products use `gcr_product` and `gcr_tier` metadata to route webhook events to correct DB fields. The `/api/subscription/status` endpoint returns both `tier` (Scam Guard) and `shieldTier` (Data Shield).
- **Competitive Positioning**: The pricing page includes a "GCR vs Competitors" comparison table (against generic "Data Removal Services" and "All-in-One Security Suites" categories), stat highlight cards, and updated FAQ.
- **Annual Billing**: Both pricing pages feature a Monthly/Annual billing toggle with ~17-22% annual discount. The checkout endpoint accepts `returnPath` for source-aware cancel URLs.
- **Admin & SEO**: A comprehensive admin system with role-based access control, scan activity monitoring (data broker scans + scam checks), admin password reset for user accounts, SEO keyword database, internal linking engine, dynamic sitemap generation, and universal meta injection for enhanced search engine visibility.

## External Dependencies

- **Database**: PostgreSQL (Neon), Drizzle Kit.
- **UI & Styling**: Radix UI, shadcn/ui, Lucide React, react-icons, Tailwind CSS.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Payments**: Stripe (checkout sessions, webhooks, customer portal).
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API v4, VirusTotal API, AlienVault OTX, RDAP/WHOIS, XposedOrNot, FBI IC3, FTC Consumer Sentinel, Europol IOCTA, Verizon DBIR, WEF Global Cybersecurity Outlook, UK NCSC, Australian ACSC, INTERPOL, ITU Global Cybersecurity Index, AARP Fraud Survey, CISA.
- **AI Services**: Anthropic API (Claude), OpenAI.
- **Email Services**: Brevo, MailerSend, SMTP2GO, Resend.
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding), Sharp.
- **Social Publishing**: Buffer (Facebook, LinkedIn, Instagram).