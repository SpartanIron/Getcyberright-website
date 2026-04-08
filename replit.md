# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform designed to simplify cybersecurity for non-technical users such as families, parents, children, and seniors. It aims to be a leading, accessible resource by offering interactive safety assessments, real-time threat intelligence, AI-powered scam detection, data broker removal services, a browser extension for real-time protection, and comprehensive family-oriented educational content. The platform addresses a critical market need for accessible cybersecurity solutions beyond traditional corporate offerings.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform features a premium, clean design utilizing a dark teal, deep teal, and orange color palette with Sora typography. UI elements include pill-shaped buttons, split-layout banners, and diverse human imagery. The homepage emphasizes an emotional hero section, data statistics, content previews, and audience-specific pathways. Dedicated hubs for Kids, Seniors, Parents, Educators, and Small Businesses maintain distinct thematic designs. Animations are designed to respect reduced motion settings.

### Technical Implementation
The frontend is built with React 19, TypeScript, and Next.js App Router, incorporating Wouter for client-side routing, TanStack Query for state management, and Tailwind CSS with shadcn/ui for styling. Framer Motion is used for animations, while React Hook Form with Zod manages form validation. Next.js handles server-side rendering and routing with a comprehensive approach: **every route now has a dedicated App Router file** (~90 route files in the `app/` directory) providing proper `generateMetadata` with OG tags, canonical URLs, JSON-LD structured data, and appropriate robots directives. The catch-all `app/[...slug]/page.tsx` now only serves as a 404 handler. Dynamic detail pages (e.g., `app/guides/[slug]/page.tsx`) fetch data server-side from Express API for metadata generation and return 404 for non-existent slugs. Auth/admin/protected pages use `robots: { index: false, follow: false }` to prevent search engine indexing. The legacy React app is loaded client-side via `next/dynamic` with SSR disabled through a shared `app/client-app.tsx` component. The backend runs on Express 5 with Node.js and TypeScript as a custom server, providing REST endpoints and utilizing shared Zod schemas. Express handles `/api/*` routes, Next.js handles all page rendering. Authentication supports email/password, TOTP MFA, Passkeys (WebAuthn), and session management. Data persistence is handled by Drizzle ORM for PostgreSQL (Neon). Security measures include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookies, input sanitization, Google reCAPTCHA, API anomaly detection, and GDPR-compliant cookie consent.

### Key Features
- **AI-Powered Tools**: Includes an AI Scam Analyzer capable of checking URLs, QR codes, screenshots, and SMS. It features a sophisticated Advanced Scam Intelligence Engine with capabilities like Campaign Playbook Engine (identifying multi-step attack patterns), Brand Sending Infrastructure Database, Context-Aware Analysis, Multi-Scan Campaign Correlation, Visual Template Analysis, Phantom Account Detection, and Context-Enhanced AI Prompts.
- **GCR Scam Guard Browser Extension**: A Chrome Manifest V3 extension providing real-time protection through auto-scanning, safety badges, lookalike domain detection, form submission warnings, URL reputation analysis, notification spam blocking, search result annotations, redirect chain detection, and clipboard hijack protection.
- **Dezi AI Assistant**: A persistent, floating widget powered by Anthropic Claude AI for interactive user support.
- **Content & Education**: Offers a Training Academy with audience-specific learning paths, an AI Prompt Library, comprehensive Cyber Safety Guides (including social media security), a Scam Intelligence Center, Cyber Threat Radar, and interactive hubs with gamified learning and scenario-based quizzes. All social media guides include AI-generated overview videos.
- **Explainer Videos**: AI-generated 1080p MP4 explainer videos are integrated across key pages for promotional and instructional purposes.
- **GCR Data Shield**: A personal data exposure scanner checking over 500 data brokers and HaveIBeenPwned databases. It provides a three-tier data removal system (guided, automated, continuous protection) and a Personal Data Vault with AES-256-GCM field-level encryption.
- **Identity Shield**: Generates cloaked-style masked identities (disposable emails, masked phone numbers, random usernames).
- **Security & Privacy Tools**: Includes a Data Broker Removal System, Breach Monitoring, Password Generator, and Family Safety Codeword Generator.
- **News Section**: Curates and simplifies cybersecurity news from 20 trusted RSS feeds using AI, with relevance scoring for families.
- **Automation & Governance**: Features automated weekly newsletters, AI content guardrails, automated threat intelligence, and a social distribution engine. The social engine utilizes a 3-tier content model (Guide-based evergreen, Reactive/breaking news, News Editorial) and integrates with Buffer for multi-platform publishing.
- **Engagement Discovery Engine**: Monitors cybersecurity RSS feeds, scores engagement opportunities, and generates AI-suggested comments for thought leadership.
- **Monthly Removal Reports**: Automated monthly HTML email reports detailing privacy scores and removal progress for subscribers.
- **Independent Subscription Products**: GCR Scam Guard and GCR Data Shield are offered as separate subscription products with independent Stripe integration and pricing tiers, including bundle options. A free access period is active until October 2026, unlocking all features for all users.
- **Admin & SEO**: A comprehensive admin system with role-based access control, scan activity monitoring, an SEO keyword database, an internal linking engine, dynamic sitemap generation, and universal meta injection. All public pages are fully SSR for SEO and performance.
- **Navigation Architecture**: A two-hub structure: Protection Hub (tools) and Learning Hub (educational content), with desktop dropdowns and mobile menus.
- **User Dashboard**: A product-aware dashboard displaying a safety score, activity statistics, product status cards, quick actions, recent scans, regional threats, and threat intelligence. Includes a post-signup onboarding checklist.
- **Account Settings**: Comprehensive account management including profile editing, password changes, MFA status, and subscription management for both products.
- **Auth Flow**: Structured post-registration steps and clear login/email verification redirects.

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