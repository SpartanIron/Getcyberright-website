# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform providing practical knowledge to non-technical users like families, parents, kids, and seniors. It aims to demystify cybersecurity through interactive safety assessments, real-time threat intelligence, and educational content. The project offers essential tools, starting free of charge, with the vision to become a leading resource for accessible cybersecurity education for all, addressing those overlooked by traditional corporate solutions.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform features a KnowBe4-inspired premium design with dark teal, deep teal, and orange accents. Typography uses Sora (Google Font) for headings and body. UI elements include pill-shaped buttons with CTA arrow icons, clean split-layout page banners, and diverse human imagery. The homepage incorporates an emotional hero section, FBI data stats, pillar tiles, card-based content previews, audience-specific paths, and an image CTA footer. Audience hubs (Kids, Seniors, Parents, Educators, Small Businesses) have distinct themes. All animations respect reduced motion.

### Technical Implementation
The frontend uses React 19, TypeScript, and Vite, with Wouter for routing, TanStack Query for state management, and Tailwind CSS with shadcn/ui for styling. Framer Motion handles animations, and React Hook Form with Zod manages forms. The design is mobile-first with dynamic SEO. The backend is built with Express 5 on Node.js with TypeScript and REST endpoints, employing shared Zod schemas for input validation. A custom authentication system supports email/password, TOTP MFA, Passkeys (WebAuthn), and session management. Data is managed with Drizzle ORM for PostgreSQL (serverless via Neon). Security features include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookie settings, input sanitization, Google reCAPTCHA, and API anomaly detection. A GDPR-compliant cookie consent banner is implemented.

### Key Features
- **AI-Powered Tools**: AI Scam Analyzer, Scam Checker (for URLs, QR codes, screenshots using multi-source threat intelligence), QR code scanning, screenshot/image text extraction (Claude AI vision), SMS validation, deepfake/AI voice scam awareness, scan history, shareable reports, community scam reporting, Scam of the Week alerts, live community scam feed.
- **GCR Scam Guard Browser Extension**: Chrome Manifest V3 extension with modular architecture. Features auto-scan on page load, real-time safety badges, lookalike domain detection, form submission interception with warnings, tab-level result caching, enhanced URL reputation merging multiple sources, right-click context menu scanning, link hover tooltips, popup scanner, page-wide link scanning, configurable settings. Upcoming features include webmail scanning and community trust scores.
- **Dezi AI Assistant**: Persistent floating widget connected to Anthropic Claude AI via SSE streaming with conversation persistence.
- **Content & Education**: Training Academy with audience-specific learning paths, AI Prompt Library, Cyber Safety Guides, Scam Intelligence Center, Cyber Threat Radar, Cyber Awareness Hub, Programmatic Scam Pages. Dedicated interactive hubs for Kids, Parents, Seniors, Educators, and Small Businesses offering gamified learning, interactive checklists, scenario-based quizzes, lesson plan generators, assessment builders, policy templates, and phishing simulations tailored to each audience.
- **GCR Data Shield**: Personal data exposure scanner with freemium gating. Scans 500+ data broker sites using real universal broker adapters (via `searchAllBrokersForProfile()` in `server/brokerAdapters.ts`) and HaveIBeenPwned breach databases. Provides severity levels to free users, with detailed findings (broker names, breach data, removal steps) unlocked for trial users and Essential+ subscribers. Includes re-scan alerts and a 90-day auto-purge for anonymous scans. PII-free logging enforced throughout scan pipeline.
- **Security & Privacy**: Data Broker Removal System, Breach Monitoring, Password Generator, and Family Safety Codeword Generator.
- **Automation & Governance**: Automated Weekly Newsletter, AI Content Guardrails, Automated Threat Intelligence, Automated Content Governance, Content Automation Engine, Social Distribution Engine, Email Alert System, and Growth Orchestrator with auto-publish scheduling.
- **User Engagement**: Gamification & Achievement System, Dynamic Trending Threats, Regional Scam Profiles, User Feedback System.
- **Admin & SEO**: Comprehensive Admin System, SEO Keyword Database, Internal Linking Engine, Dynamic Sitemap generation, SSR middleware for search engines, and JSON-LD structured data.

## External Dependencies

- **Database**: PostgreSQL (Neon), Drizzle Kit.
- **UI & Styling**: Radix UI, shadcn/ui, Lucide React, react-icons, Tailwind CSS.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API v4, VirusTotal API, AlienVault OTX, RDAP/WHOIS, XposedOrNot, FBI IC3, FTC Consumer Sentinel, Europol IOCTA, Verizon DBIR, WEF Global Cybersecurity Outlook, UK NCSC, Australian ACSC, INTERPOL, ITU Global Cybersecurity Index, AARP Fraud Survey, CISA.
- **AI Services**: Anthropic API (Claude), OpenAI.
- **Email Services**: Brevo, MailerSend, SMTP2GO, Resend.
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding), Sharp.
- **Social Publishing**: Buffer (Facebook, LinkedIn).