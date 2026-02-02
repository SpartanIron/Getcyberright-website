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

---

## MITRE ATT&CK Framework Assessment

GetCyberRight's security controls map to MITRE ATT&CK v18 (October 2025) tactics and techniques. This assessment demonstrates defense-in-depth coverage across the attack lifecycle.

### Coverage Summary

| Tactic | Techniques Addressed | Coverage Level |
|--------|---------------------|----------------|
| Initial Access (TA0001) | T1190, T1078 | Significant |
| Execution (TA0002) | T1059 | Significant |
| Persistence (TA0003) | T1136, T1078.001 | Partial |
| Credential Access (TA0006) | T1110, T1539 | Significant |
| Defense Evasion (TA0005) | T1055, T1027 | Partial |
| Exfiltration (TA0010) | T1041 | Significant |

### Detailed Technique Mappings

#### TA0001: Initial Access

**T1190 - Exploit Public-Facing Application**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| Content Security Policy (CSP) | Protect | Significant |
| Input validation (Zod schemas) | Protect | Significant |
| XSS pattern detection | Detect | Significant |
| SQL injection pattern detection | Detect | Significant |
| Rate limiting (3 tiers) | Protect | Significant |
| Request size limiting (100KB) | Protect | Partial |

**T1078 - Valid Accounts**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| bcrypt password hashing (cost 12) | Protect | Significant |
| TOTP MFA | Protect | Significant |
| Account lockout after failed attempts | Protect | Significant |
| Session management (PostgreSQL) | Detect | Partial |
| Secure cookies (HttpOnly, Secure, SameSite=strict) | Protect | Significant |

#### TA0002: Execution

**T1059 - Command and Scripting Interpreter**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| CSP script-src whitelist | Protect | Significant |
| No eval() or inline scripts in codebase | Protect | Significant |
| XSS pattern detection | Detect | Significant |
| Event handler injection detection | Detect | Significant |

#### TA0003: Persistence

**T1136 - Create Account**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| Email verification required | Protect | Significant |
| Rate limiting on registration | Protect | Significant |
| Session expiration (24 hours) | Protect | Partial |

#### TA0006: Credential Access

**T1110 - Brute Force**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| Rate limiting (strict tier: 10 req/min) | Protect | Significant |
| IP blocking after 3 violations | Protect | Significant |
| Account lockout mechanism | Protect | Significant |
| Security logging of failed attempts | Detect | Significant |

**T1539 - Steal Web Session Cookie**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| HttpOnly cookies | Protect | Significant |
| SameSite=strict | Protect | Significant |
| Secure flag (HTTPS only) | Protect | Significant |
| Session expiration | Protect | Partial |

#### TA0005: Defense Evasion

**T1055 - Process Injection (XSS Context)**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| CSP with strict directives | Protect | Significant |
| X-XSS-Protection header | Protect | Partial |
| Input sanitization | Protect | Significant |

#### TA0010: Exfiltration

**T1041 - Exfiltration Over C2 Channel**
| Control | Function | Effectiveness |
|---------|----------|---------------|
| CSP connect-src whitelist | Protect | Significant |
| CORS restrictions | Protect | Significant |
| No sensitive data in logs | Protect | Significant |

### Security Header Compliance

| Header | ATT&CK Mitigation | Status |
|--------|-------------------|--------|
| Content-Security-Policy | M1021 (Restrict Web-Based Content) | Implemented |
| Strict-Transport-Security | M1041 (Encrypt Sensitive Information) | Implemented |
| X-Frame-Options: DENY | M1021 (Prevent Clickjacking) | Implemented |
| X-Content-Type-Options | M1021 (Prevent MIME Sniffing) | Implemented |
| Referrer-Policy | M1021 (Limit Information Disclosure) | Implemented |
| X-XSS-Protection | M1021 (Legacy XSS Protection) | Implemented |
| Cross-Origin-Opener-Policy | M1021 (Isolate Browsing Context) | Implemented |

### Logging & Detection Capabilities

| Data Source | ATT&CK Data Source | Implemented |
|-------------|-------------------|-------------|
| Web server logs | DS0029 (Network Traffic) | Yes |
| Authentication logs | DS0002 (User Account) | Yes |
| Error response logging | DS0015 (Application Log) | Yes |
| Rate limit violations | DS0029 (Network Traffic) | Yes |
| Suspicious pattern alerts | DS0015 (Application Log) | Yes |
| CSRF attempt logging | DS0015 (Application Log) | Yes |

### Recommendations for Enhanced Coverage

**Current Gaps:**

1. **T1557 - Adversary-in-the-Middle**
   - Status: Partially addressed via HSTS
   - Recommendation: Consider certificate pinning for mobile apps

2. **T1189 - Drive-by Compromise**
   - Status: Protected via CSP
   - Recommendation: Add Subresource Integrity (SRI) for external scripts

3. **T1071 - Application Layer Protocol**
   - Status: Partially monitored
   - Recommendation: Implement anomaly detection for API usage patterns

4. **Log Aggregation**
   - Status: Console logging only
   - Recommendation: Centralized SIEM integration for enterprise tier

### Overall ATT&CK Score

| Category | Score | Grade |
|----------|-------|-------|
| Prevention Controls | 85/100 | A |
| Detection Controls | 70/100 | B |
| Response Capabilities | 60/100 | C |
| **Overall Security Posture** | **78/100** | **B+** |

*Note: This assessment reflects web application security controls. Infrastructure and cloud-level controls (AWS/GCP security services) would add additional coverage layers.*

---

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
| **Advanced Security Scanner** | No | Yes | Yes | Yes |
| Dezi AI Messages | 20/day | 100/day | Unlimited | Unlimited |
| Voice Deepfake Detector | Demo | Demo | Full | Full |
| Password Generator | Basic | Advanced | Advanced | Advanced |
| Phone Number Risk Check | No | Yes | Yes | Yes |
| QR Code Scanner | Yes | Yes | Yes | Yes |
| Screenshot OCR Analysis | No | Yes | Yes | Yes |
| Family Codeword Generator | Yes | Yes | Yes | Yes |
| Regional Threat Intelligence | Basic | Full | Full | Full |
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
