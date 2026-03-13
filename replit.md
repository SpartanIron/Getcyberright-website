# GetCyberRight - Cybersecurity Education Platform

## Overview
GetCyberRight is a family-focused cybersecurity education platform designed to provide practical knowledge to non-technical users such as families, parents, kids, seniors, and everyday individuals. Its core purpose is to demystify complex cybersecurity information through interactive safety assessments, real-time threat intelligence, and educational content tailored to specific audiences. The project aims to serve those overlooked by traditional corporate cybersecurity solutions, offering essential tools free of charge to start. The business vision is to become a leading resource for accessible cybersecurity education for all.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
The platform utilizes an enterprise teal and orange color scheme with a flat, minimal design, prioritizing accessibility, SEO, and print readiness. Audience-specific hubs (Kids, Seniors, Parents, Educators, Small Business) feature distinct color themes while maintaining overall brand consistency. The Kids Digital Safety Hub incorporates age-segmented, gamified lessons with colorful cartoon illustrations. The homepage includes an enhanced cinematic hero section with dynamic visuals, rotating calls to action, and animated trust statistics. It also features a 7-pillar navigation (including AI Cyber Threats), content previews, an authority/trust section, and a newsletter signup. All card elements across the site use image backgrounds with dark gradient overlays. The footer is a comprehensive 5-column layout. All animations respect user preferences for reduced motion, and all human images depict diverse, multiracial individuals. Em dashes are prohibited in all user-facing content.

### Technical Implementation
The frontend is built with React 19, TypeScript, and Vite, using Wouter for routing, TanStack Query for state management, and Tailwind CSS with shadcn/ui for styling. Framer Motion handles animations, and React Hook Form with Zod manages forms. The design is mobile-first with dynamic SEO. The backend uses Express 5 on Node.js with TypeScript (ES modules) and REST endpoints, employing shared Zod schemas for input validation. Authentication is a custom system supporting email/password, TOTP MFA, Passkeys (WebAuthn), and session management. The data layer uses Drizzle ORM for PostgreSQL (serverless via Neon) with `drizzle-zod` for schema generation. Security measures include Helmet.js, multi-tier rate limiting, CSRF protection, payload limits, XSS/SQLi detection, secure cookie settings, input sanitization, Google reCAPTCHA, and API anomaly detection. Compliance is mapped to OWASP ASVS, CIS Controls, ISO 27001, NIST 800-53, and MITRE ATT&CK.

### Key Features
- **AI-Powered Tools**: AI Scam Analyzer, Scam Checker (for URLs, QR codes, etc.), Dezi AI Assistant (real-time chat for scam analysis), and an Audio/Voice Deepfake Detector.
- **Content & Education**: Training Academy with audience-specific learning paths, a comprehensive AI Prompt Library, Cyber Safety Guides System, Scam Intelligence Center (region-aware scam database), Cyber Threat Radar (emerging threat monitoring), and Programmatic Scam Pages (SEO-optimized guides).
- **Security & Privacy**: Data Broker Removal System (automated personal data removal), Breach Monitoring, Password Generator, and Family Safety Codeword Generator.
- **Automation & Governance**: Automated Weekly Newsletter System, AI Content Guardrails, Automated Threat Intelligence (from 8 sources), Automated Content Governance System, Content Automation Engine (AI-powered article generation), Social Distribution Engine (auto-triggered on publish with idempotency guards), Email Alert System (sends subscriber notifications for high/critical threat alerts on publish), and a Growth Orchestrator (coordinates platform modules). Initial content seeded on startup: 6 guides, 5 scam intel entries, 5 threat alerts.
- **User Engagement**: Gamification & Achievement System, Dynamic Trending Threats (geo-tagged, AI-powered alerts), Regional Scam Profiles (visual, region-specific scam information), and a User Feedback System.
- **Admin & SEO**: Comprehensive Admin System for platform management, SEO Keyword Database, Internal Linking Engine, and Dynamic Sitemap generation.

## External Dependencies

- **Database**: PostgreSQL (Neon), Drizzle Kit.
- **UI & Styling**: Radix UI, shadcn/ui, Lucide React, react-icons, Tailwind CSS.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Authentication**: `connect-pg-simple`, `bcrypt`, `speakeasy`, `qrcode`, `jsonwebtoken`, `otplib`, `@simplewebauthn/server`, `@simplewebauthn/browser`.
- **Threat Intelligence & Data Sources**: PhishTank API, URLhaus API, Google Safe Browsing API, VirusTotal API, RDAP/WHOIS. Authoritative sources include FBI IC3, FTC Consumer Sentinel, Europol IOCTA, Verizon DBIR, WEF Global Cybersecurity Outlook, UK NCSC, Australian ACSC, INTERPOL, ITU Global Cybersecurity Index, AARP Fraud Survey, CISA.
- **AI Services**: Anthropic API (Claude), OpenAI.
- **Email Services**: Brevo, MailerSend, SMTP2GO, Resend.
- **Image Processing**: Tesseract.js (OCR), jsQR (QR code decoding).