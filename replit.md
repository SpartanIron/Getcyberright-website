# GetCyberRight - Cybersecurity Education Platform

## Overview

GetCyberRight is a cybersecurity education platform designed to provide practical security guidance for families, seniors, and organizations. It aims to protect users from modern cyber threats through accessible educational content, security guides, and community resources. The project envisions empowering users with the knowledge to defend against phishing, scams, and identity theft, establishing itself as a leading resource for digital safety. The application is a full-stack TypeScript project with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Brand Identity & Design
- **Color Scheme**: Enterprise teal and orange, matching the padlock mascot logo. Specific colors for primary, accent, dark UI, and warnings.
- **Design Principles**: Flat, minimal aesthetic with subtle shadows, professional appearance, no emoji usage. Audience hub pages (Kids, Seniors, Parents, Educators, Small Business) have distinct color themes while maintaining brand consistency.
- **UI/UX**: Emphasis on accessibility (ARIA labels, screen reader support), SEO (meta tags, Open Graph, Twitter Cards), and print support for checklists.
- **Kids Digital Safety Hub**: Features age-segmented lessons (8-11, 12-16) with interactive quizzes, progress tracking, and gamified elements. Designed with larger text, kid-friendly visuals, empowering language, and colorful gradient backgrounds.
- **Audience Hub Pages**: Dedicated sections for Seniors, Parents, Educators, and Small Business, each with curated content, specific gradient themes, and consistent structural patterns (e.g., FloatingShapes component, card grids, detailed topic views).

### Frontend Architecture
- **Framework**: React 18 with TypeScript.
- **Routing**: Wouter.
- **State Management**: TanStack Query (React Query).
- **Styling**: Tailwind CSS with CSS variables, shadcn/ui component library (Radix UI primitives).
- **Animations**: Framer Motion.
- **Forms**: React Hook Form with Zod validation.
- **Build Tool**: Vite.

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript.
- **API Design**: REST endpoints for contact form and newsletter subscriptions.
- **Validation**: Zod schemas shared between frontend and backend.
- **Authentication**: Custom authentication system with email/password, TOTP MFA, backup codes, account lockout, session management (PostgreSQL), email verification, and password reset.

### Data Layer
- **ORM**: Drizzle ORM configured for PostgreSQL.
- **Schema**: `shared/schema.ts` for database table definitions, with `drizzle-zod` for automatic Zod schema generation.
- **Tables**: `users`, `contact_messages`, `newsletter_subscribers`.

### Security Architecture
- **Security Middleware**: Implemented via `server/security.ts` using Helmet.js for security headers (CSP, HSTS, X-Frame-Options, etc.).
- **Rate Limiting**: Three tiers (strict, standard, relaxed) with IP-based tracking and automatic blocking.
- **CSRF Protection**: Origin/Referer header validation for state-changing requests.
- **Request Security**: JSON/form payload limits, suspicious pattern detection (XSS, SQLi), all security events logged.
- **Cookie Security**: HttpOnly, Secure, SameSite=strict.
- **Compliance**: Mapped controls to OWASP ASVS, CIS Control, ISO 27001, and NIST 800-53.

### Content & Tools
- **Content Guidelines**: All educational content is based on verified data from sources like FTC Consumer Sentinel, FBI IC3, CISA, Medicare.gov, etc. Emphasis on empowering, non-fear-based language.
- **Scam Checker**: Features Email Header Analysis (SPF/DKIM/DMARC), URL entropy/brand similarity, urgency scoring, Reply-To mismatch detection, and real-time URL reputation checking.
- **Advanced Security Scanner** (NEW): Comprehensive threat analysis tool with:
  - **Multi-Engine URL Scanning**: Google Safe Browsing API, VirusTotal integration, PhishTank, URLhaus
  - **Domain Age Check**: RDAP/WHOIS lookup for domain registration age analysis
  - **SSL Certificate Analysis**: Certificate validation, issuer verification, expiration check, EV detection
  - **Trust Score Algorithm**: 0-100 website trustworthiness rating with A-F grades
  - **Phone Number Lookup**: Risk analysis for phone numbers with scam area code detection
  - **Screenshot OCR**: Image upload with Tesseract.js text extraction for analyzing suspicious messages
  - **QR Code Scanner**: Upload QR code images to reveal and analyze their contents before scanning
  - **Deepfake Education**: Interactive guide for identifying AI-generated video, audio, image, and text content
- **AI & Cyber Safety Hub** (`/ai-safety`): Educational content about AI-powered threats including deepfakes, voice cloning, AI-enhanced phishing, AI chatbot scams, and synthetic identity fraud. Includes audience-specific impact sections (Seniors, Business, Parents), responsible AI usage guidelines, and "What NOT to Share with AI" guidance.
- **Dezi AI Assistant**: Available to all users with free tier (20 messages/day, 10 analyses/day). Premium users get unlimited access, password generation, and advanced scam analysis.

### NEW: Competitive Differentiator Features
- **Family Safety Codeword Generator** (UNIQUE - No competitor has this):
  - Generate secure, memorable codewords for family emergency verification
  - Three styles: Simple (PurpleButterfly77), Phrase (Golden Eagle Dances), Extra Secure (multi-word)
  - Memory tips and family sharing functionality
  - Scenario-based guidance for grandparent scams, AI voice clones, fake authority figures
  - Protection against $200M+ Q1 2025 voice cloning scam losses
  
- **Audio/Voice Deepfake Detector** (Industry Gap - Major 2025-2026 threat):
  - Upload suspicious voicemails/recordings for AI analysis
  - Educational simulation showing how detection works (demo mode for all users)
  - Professional subscribers get backend-powered analysis via `/api/security/analyze-audio`
  - Checks for: unnatural pauses, missing breathing, emotion mismatch, audio artifacts
  - Confidence scoring with risk levels (low/medium/high/critical)
  - Upgrade prompts for non-Professional users with "Try Demo" fallback

- **Gamification & Achievement System** (Drives engagement):
  - Points, badges, and leaderboards for security activities
  - Real progress tracking via `/api/gamification/progress` and `/api/gamification/badges`
  - Badge tiers: Bronze, Silver, Gold, Platinum
  - Categories: Scanner, Education, Streak, Community
  - User levels with titles (Cyber Rookie → Cyber Guardian)
  - Demo mode for unauthenticated users with sign-in prompts

### Premium Subscription Tiers
- **Tier Access Control**: `hasTierAccess()` function in `server/routes.ts` handles feature gating
- **Essential ($9/mo)**: Advanced Scanner features, basic Dezi AI access
- **Professional ($29/mo)**: Voice Clone Detection, unlimited Dezi AI, enhanced scam analysis
- **Enterprise ($99/mo)**: API access, team management, priority support
- **Free Tier**: Demo mode for most features, limited Dezi AI (20 messages/day)
- **Feature Gating UI**: Components show upgrade prompts when tier access denied (403 response)

## External Dependencies

- **Database**: PostgreSQL, Drizzle Kit (for migrations).
- **UI Framework**: Radix UI, shadcn/ui, Lucide React, react-icons.
- **Form & Validation**: Zod, React Hook Form, @hookform/resolvers.
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge.
- **Authentication**: `connect-pg-simple` (for PostgreSQL sessions), `bcrypt` (password hashing), `speakeasy` (TOTP MFA), `qrcode`.
- **Threat Intelligence**: PhishTank API, URLhaus API, Google Safe Browsing API (optional), VirusTotal API (optional), RDAP/WHOIS for domain age (all proxied via backend with rate limiting).
- **Image Processing**: Tesseract.js (OCR text extraction), jsQR (QR code decoding).