# GetCyberRight - Cybersecurity Education Platform

## Overview

GetCyberRight is a full-stack TypeScript project with a React frontend and Express backend, designed to empower families, seniors, and organizations with practical cybersecurity knowledge. It aims to be a leading resource for digital safety by providing accessible educational content, security guides, and community resources to protect users from modern cyber threats like phishing, scams, and identity theft. The platform focuses on practical guidance, business vision, and market potential, with ambitious plans for user empowerment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform uses an enterprise teal and orange color scheme, maintaining a flat, minimal aesthetic with subtle shadows and a professional appearance. UI/UX emphasizes accessibility (ARIA, screen reader support), SEO (meta tags, Open Graph), and print support. Audience-specific hubs (Kids, Seniors, Parents, Educators, Small Business) feature distinct color themes while ensuring brand consistency. The Kids Digital Safety Hub offers age-segmented, gamified lessons with interactive quizzes.

### Frontend
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack Query.
- **Styling**: Tailwind CSS with shadcn/ui.
- **Animations**: Framer Motion.
- **Forms**: React Hook Form with Zod validation.
- **Build Tool**: Vite.

### Backend
- **Framework**: Express 5 on Node.js with TypeScript.
- **API Design**: REST endpoints.
- **Validation**: Zod schemas shared across frontend and backend.
- **Authentication**: Custom system with email/password, TOTP MFA, backup codes, session management (PostgreSQL), email verification, and password reset.

### Data Layer
- **ORM**: Drizzle ORM for PostgreSQL.
- **Schema**: `shared/schema.ts` with `drizzle-zod` for automatic Zod schema generation.
- **Key Tables**: `users`, `contact_messages`, `newsletter_subscribers`.

### Security Architecture
- **Middleware**: Helmet.js for security headers.
- **Rate Limiting**: Three tiers with IP-based tracking and auto-blocking.
- **CSRF Protection**: Origin/Referer header validation.
- **Request Security**: Payload limits, XSS/SQLi detection, secure cookie settings.
- **API Anomaly Detection**: Monitors `/api` routes for suspicious patterns, triggering alerts and critical incident flags.
- **Centralized Logging**: Winston for security logs, integrated with SIEM.
- **Compliance**: Mapped controls to OWASP ASVS, CIS Control, ISO 27001, NIST 800-53, MITRE ATT&CK, achieving an 87/100 MITRE ATT&CK score.
- **Admin Dashboard**: Real-time security monitoring at `/admin/security`.

### Content & Tools
- **Content Guidelines**: Educational content based on verified sources (FTC, FBI IC3, CISA), emphasizing empowering language.
- **Scam Checker**: Email header analysis, URL reputation, urgency scoring.
- **Advanced Security Scanner**: Multi-engine URL scanning (Google Safe Browsing, VirusTotal), domain age checks, SSL certificate analysis, phone number lookup, screenshot OCR, QR code scanner, and deepfake education.
- **AI & Cyber Safety Hub**: Educational content on AI-powered threats like deepfakes and AI chatbot scams.
- **Child Safety Conversation Scanner**: Client-side grooming pattern detection with risk scoring and regional emergency resources.
- **Dezi AI Assistant**: Provides analysis and security assistance, with free and premium tiers.
- **AI Content Refresh**: Automated content update recommendations based on threat intelligence with one click application.

### AI Content Guardrails (shared/contentGuardrails.ts)
The platform enforces strict content integrity standards for all AI-generated content:
- **Truthfulness**: All recommendations must be factually accurate and traceable to provided threat data.
- **Verifiability**: No fabrication of statistics, dates, CVE numbers, or incident details.
- **Anti-Hallucination**: Automated detection of potential hallucination patterns with disclaimers.
- **Writing Quality**: Proper sentence structure, punctuation, and no dashes as clause separators.
- **Audience Adaptation**: Content complexity adjusted for kids, seniors, parents, educators, and businesses.
- **Source Attribution**: All threat-based recommendations cite the original intelligence feed source.

### Competitive Differentiator Features
- **Family Safety Codeword Generator**: Unique tool for generating secure codewords for emergency verification, protecting against voice cloning scams.
- **Audio/Voice Deepfake Detector**: Upload analysis for suspicious voicemails, checking for unnatural audio patterns.
- **Gamification & Achievement System**: Points, badges, and leaderboards to drive engagement in security activities.
- **Regional Content Personalization**: Auto-detection and manual selection of user region for tailored threat trends and local resources.
- **Tool Usage Analytics Dashboard**: Admin feature to track usage of security tools across the platform.
- **Automated Threat Intelligence Feed Integration**: Ingests data from 8 trusted sources (URLhaus, PhishTank, CISA, NVD, HIBP) for real-time threat updates.
- **Automated Content Governance System**: Monitors educational content for freshness and relevance, linking topics to threat intelligence for automated flagging and review.

- **NIST 800-53 Compliance Dashboard** (Enterprise Feature):
  - Maps platform security features to 20 NIST 800-53 control families (AC, AU, IA, SC, SI, etc.)
  - 50+ security controls with implementation status, evidence, gaps, and recommendations
  - Scoring algorithm: 0-100 compliance score per family and overall (current: 82%)
  - Gap analysis with remediation recommendations
  - Admin dashboard at `/admin/compliance` with Overview, Control Families, Gaps, and Assessment History tabs
  - API endpoints: `/api/compliance/stats`, `/families`, `/controls`, `/gaps`, `/assess`, `/assessments`

### Premium Subscription Tiers
The platform offers Free, Essential ($9/mo), Professional ($29/mo), and Enterprise ($99/mo) tiers, with feature gating implemented via `hasTierAccess()` and UI upgrade prompts.

## External Dependencies

- **Database**: PostgreSQL, Drizzle Kit.
- **UI Framework**: Radix UI, shadcn/ui, Lucide React, react-icons.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`.
- **Threat Intelligence**: PhishTank API, URLhaus API, Google Safe Browsing API, VirusTotal API, RDAP/WHOIS (all proxied via backend).
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding).