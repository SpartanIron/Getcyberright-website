# GetCyberRight Platform Capabilities
## A Comprehensive Security & Safety Overview

*Last Updated: February 2026*

---

## Executive Summary

GetCyberRight is a cybersecurity education and protection platform designed for everyday people - families, seniors, parents, educators, and small businesses. The platform combines real-time threat detection, AI-powered assistance, and educational content to protect users from modern cyber threats including phishing, scams, identity theft, and emerging AI-powered attacks.

---

## Platform Capabilities

### 1. Advanced Security Scanner

**What It Does (Non-Technical):**
Checks if a website is safe before you visit it. Gives you a simple trust score (A-F grade) and clear advice: "Safe to Visit," "Proceed with Caution," or "Dangerous - Avoid."

**Technical Implementation:**
- **Multi-Engine Threat Detection**: Queries multiple security databases simultaneously
  - Google Safe Browsing API (malware, social engineering, unwanted software)
  - VirusTotal API (70+ antivirus engines)
  - PhishTank (community-reported phishing sites)
  - URLhaus (malware distribution URLs)
  - AlienVault OTX (threat intelligence pulses)
- **Domain Intelligence**:
  - RDAP/WHOIS lookup for domain registration age
  - New domain detection (< 30 days = high risk flag)
- **SSL/TLS Analysis**:
  - Certificate validation and chain verification
  - Issuer verification (Let's Encrypt, DigiCert, etc.)
  - Expiration monitoring
  - Extended Validation (EV) certificate detection
- **Trust Score Algorithm**: Weighted scoring (0-100) based on:
  - Threat database results (40%)
  - Domain age (20%)
  - SSL certificate validity (20%)
  - URL pattern analysis (20%)
- **SSRF Protection**: All external API calls are proxied through backend with strict URL validation, private IP blocking, and rate limiting

**Security Controls:**
- Backend-only API calls (credentials never exposed to frontend)
- Rate limiting per IP (prevents abuse)
- Input sanitization (prevents injection attacks)
- Response caching (reduces API costs, improves speed)

---

### 2. Scam Checker (Email & Message Analysis)

**What It Does (Non-Technical):**
Paste a suspicious email or message and get instant analysis. Identifies phishing attempts, urgency manipulation, and fake sender addresses.

**Technical Implementation:**
- **Email Header Analysis**:
  - SPF (Sender Policy Framework) validation
  - DKIM (DomainKeys Identified Mail) signature verification
  - DMARC (Domain-based Message Authentication) policy check
  - Reply-To mismatch detection
- **Content Analysis**:
  - Urgency scoring (identifies pressure tactics)
  - Brand impersonation detection (1,151 brands in database including global banks, tech companies, African financial institutions)
  - Suspicious URL extraction and analysis
  - Grammar/spelling anomaly detection
- **URL Reputation Check**:
  - Real-time PhishTank query
  - URLhaus malware check
  - SSL certificate validation
  - Domain age verification

**Brand Database Coverage:**
- Global tech: Google, Microsoft, Apple, Amazon, Meta, etc.
- Banking: Chase, Bank of America, Wells Fargo, Barclays, HSBC
- African banks: Standard Bank, FNB, Absa, Nedbank, Capitec, Access Bank, GTBank, Zenith Bank, Ecobank, M-Pesa, and 50+ more
- E-commerce, streaming, telecom, government agencies

---

### 3. Phone Number Risk Analysis

**What It Does (Non-Technical):**
Enter a phone number to check if it's associated with known scam patterns or high-risk area codes.

**Technical Implementation:**
- Area code risk database (known scam origination codes)
- Pattern matching for spoofed numbers
- International number format validation
- Known scam number blacklist checking

---

### 4. QR Code Scanner

**What It Does (Non-Technical):**
Upload a photo of a QR code to see what it links to BEFORE you scan it with your phone. Protects against malicious QR codes that redirect to phishing sites.

**Technical Implementation:**
- jsQR library for client-side QR decoding
- Extracted URLs passed through full security scanner
- Image processing via HTML5 Canvas API
- No server upload required (privacy-preserving)

---

### 5. Screenshot OCR Analysis

**What It Does (Non-Technical):**
Upload a screenshot of a suspicious message and the platform extracts the text for analysis - useful for analyzing images of texts or social media messages.

**Technical Implementation:**
- Tesseract.js for client-side OCR
- Text extraction with confidence scoring
- Extracted content passed to scam analysis engine
- Supports multiple languages

---

### 6. Dezi AI Assistant

**What It Does (Non-Technical):**
An AI chatbot that answers cybersecurity questions in plain language. Can analyze suspicious messages, generate secure passwords, and provide personalized security advice.

**Technical Implementation:**
- OpenAI GPT integration via backend proxy
- Context-aware conversation management
- Specialized prompts for security analysis
- Rate limiting: Free tier (20 messages/day), Premium (unlimited)
- Password generation with cryptographically secure randomness
- Session-based conversation history

**Security Controls:**
- API key stored as environment secret (never exposed)
- Input sanitization before AI processing
- Output filtering for sensitive content
- Usage tracking per user/session

---

### 7. Family Safety Codeword Generator

**What It Does (Non-Technical):**
Creates memorable codewords that families can use to verify identity during phone calls - protection against voice cloning scams and grandparent scams.

**Technical Implementation:**
- Cryptographically secure random word selection
- Three generation styles:
  - Simple: `[Adjective][Noun][Number]` (e.g., "PurpleButterfly77")
  - Phrase: `[Adjective] [Noun] [Verb]` (e.g., "Golden Eagle Dances")
  - Extra Secure: Multi-word with special characters
- Memory tip generation for each codeword
- No server storage (generated client-side)
- Sharable via native share API

---

### 8. Audio/Voice Deepfake Detector

**What It Does (Non-Technical):**
Upload a suspicious voicemail or audio recording to check if it might be AI-generated. Helps identify voice cloning scams.

**Technical Implementation:**
- Audio file upload and processing
- Backend analysis via `/api/security/analyze-audio`
- Detection indicators:
  - Unnatural pause patterns
  - Missing breath sounds
  - Emotion-speech mismatch
  - Audio artifact detection
  - Frequency analysis anomalies
- Confidence scoring with risk levels
- Demo mode for free users (educational simulation)
- Full analysis for Professional tier subscribers

---

### 9. Deepfake Education Hub

**What It Does (Non-Technical):**
Interactive guides teaching users how to identify AI-generated fake videos, audio, images, and text content.

**Content Categories:**
- Video deepfakes: facial inconsistencies, lighting, blinking patterns
- Audio deepfakes: voice cloning, synthetic speech markers
- Image manipulation: AI-generated faces, edited photos
- Text generation: AI-written phishing, fake reviews

---

### 10. Regional Threat Intelligence

**What It Does (Non-Technical):**
Shows security threats and scam trends specific to your region, with local emergency contacts and reporting agencies.

**Technical Implementation:**
- IP geolocation via ip-api.com
- 7 supported regions: US, UK, Canada, Australia, EU, Africa, Global
- Region-specific data:
  - Current threat trends with severity levels
  - Case counts and statistics
  - Local reporting agencies (FTC, Action Fraud, ACCC, etc.)
  - Emergency contact numbers
- API endpoints:
  - `GET /api/region/detect` - Auto-detect user region
  - `GET /api/region/list` - Available regions
  - `GET /api/region/:code` - Region details
  - `GET /api/region/:code/threats` - Region-specific threats
- LocalStorage persistence for manual selection

---

### 11. Gamification & Achievement System

**What It Does (Non-Technical):**
Earn points and badges for completing security activities - makes learning about cybersecurity engaging and trackable.

**Technical Implementation:**
- Points system for tool usage and education completion
- Badge categories: Scanner, Education, Streak, Community
- Badge tiers: Bronze, Silver, Gold, Platinum
- User levels with titles (Cyber Rookie → Cyber Guardian)
- PostgreSQL-backed progress tracking
- API endpoints:
  - `GET /api/gamification/progress` - User progress
  - `GET /api/gamification/badges` - Available/earned badges
- Demo mode for unauthenticated users

---

## Platform Security Architecture

### Authentication & Session Management

**User-Facing:**
- Secure login with email/password
- Optional two-factor authentication (TOTP)
- Backup codes for account recovery
- Account lockout after failed attempts

**Technical:**
- bcrypt password hashing (cost factor 12)
- TOTP via speakeasy library
- PostgreSQL-backed sessions via connect-pg-simple
- Session cookies: HttpOnly, Secure, SameSite=strict
- Automatic session expiration

### Application Security

**Headers & Protection:**
- Helmet.js security headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- X-Frame-Options (clickjacking prevention)
- X-Content-Type-Options (MIME sniffing prevention)

**Request Security:**
- CSRF protection via Origin/Referer validation
- JSON payload size limits
- Suspicious pattern detection (XSS, SQLi)
- Rate limiting (3 tiers: strict, standard, relaxed)

**Compliance Alignment:**
- OWASP ASVS (Application Security Verification Standard)
- CIS Controls
- ISO 27001
- NIST 800-53

### Data Protection

- All API credentials stored as environment secrets
- Database credentials via environment variables
- No sensitive data logged
- User data encrypted at rest (PostgreSQL)
- HTTPS-only in production

---

## Premium Subscription Tiers

| Feature | Free | Essential ($9/mo) | Professional ($29/mo) | Enterprise ($99/mo) |
|---------|------|-------------------|----------------------|---------------------|
| Basic Scam Checker | Yes | Yes | Yes | Yes |
| URL Security Scan | Limited | Full | Full | Full |
| Dezi AI Messages | 20/day | 100/day | Unlimited | Unlimited |
| Voice Deepfake Detector | Demo | Demo | Full | Full |
| Advanced Scanner Features | Limited | Full | Full | Full |
| Password Generator | Basic | Advanced | Advanced | Advanced |
| API Access | No | No | No | Yes |
| Team Management | No | No | No | Yes |
| Priority Support | No | No | Yes | Yes |

---

## Audience-Specific Content Hubs

### Kids Digital Safety (ages 8-16)
- Age-segmented lessons (8-11, 12-16)
- Interactive quizzes with progress tracking
- Gamified learning elements
- Kid-friendly language and visuals

### Seniors Hub
- Larger text and accessible design
- Focus on phone scams, Medicare fraud, grandparent scams
- Print-friendly checklists
- Emergency contact resources

### Parents Hub
- Family safety planning guides
- Child online safety resources
- Social media monitoring guidance
- Family codeword implementation

### Educators Hub
- Classroom-ready materials
- Curriculum integration guides
- Student safety resources
- Digital citizenship content

### Small Business Hub
- Business email compromise prevention
- Employee training resources
- Vendor security assessment tools
- Incident response planning

---

## Technical Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| UI Components | shadcn/ui, Radix UI, Lucide icons |
| State Management | TanStack Query (React Query) |
| Routing | Wouter |
| Backend | Express 5, Node.js, TypeScript |
| Database | PostgreSQL with Drizzle ORM |
| Authentication | bcrypt, speakeasy (TOTP), connect-pg-simple |
| AI Integration | OpenAI GPT via backend proxy |
| Image Processing | Tesseract.js (OCR), jsQR (QR decoding) |
| Security | Helmet.js, Zod validation, rate limiting |

---

## Threat Intelligence Sources

| Source | Type | Update Frequency |
|--------|------|-----------------|
| Google Safe Browsing | Malware, phishing, unwanted software | Real-time |
| VirusTotal | 70+ antivirus engines | Real-time |
| PhishTank | Community-reported phishing | Hourly updates |
| URLhaus | Malware distribution URLs | Continuous |
| AlienVault OTX | Threat intelligence pulses | Continuous |
| RDAP/WHOIS | Domain registration data | Real-time |

---

## Contact & Support

- **Platform**: GetCyberRight.com
- **Operated By**: ColorCode Solutions LLC
- **Support**: Contact form on website
- **Newsletter**: Subscribe for threat alerts

---

*This document is intended for internal briefing purposes. All technical implementations follow security best practices and are regularly updated to address emerging threats.*
