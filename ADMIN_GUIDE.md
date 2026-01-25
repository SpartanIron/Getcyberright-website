# GetCyberRight Admin Guide

## Email Newsletter System

### Overview
GetCyberRight has two email newsletter types:
1. **Weekly Fraud Alerts (Digests)** - Curated weekly cybersecurity news
2. **Digital Safety Tips** - AI-generated safety tips for specific audiences

Both use Brevo as the email service provider (9,000 free emails/month).

---

## Weekly Fraud Alerts (Digests)

### How to Send a Weekly Digest

1. **Generate**: Go to Admin → Digests tab → Click "Generate New Digest"
   - AI analyzes recent cybersecurity news
   - Creates curated content with global threats, regional spotlights, and safety tips
   - Generation takes 30-60 seconds

2. **Review**: Click the generated digest to preview
   - Check title, summary, and news stories
   - Verify content is accurate and well-written
   - Look for proper punctuation and complete sentences

3. **Approve**: Click "Approve" if content looks good
   - Status changes from "Draft" to "Approved"

4. **Send**: Click "Send" to deliver to all Weekly Digest subscribers
   - Emails are personalized by subscriber region
   - Shows count of successful/failed sends

### Workflow: Generate → Review → Approve → Send

---

## Digital Safety Tips

### How to Send a Safety Tip

1. **Select Audience**: Choose target audience
   - All Audiences
   - Youth (teens 13-25)
   - Seniors (60+)
   - Parents
   - Travelers

2. **Select Region**: Choose geographic focus
   - Global
   - North America, Europe, Asia-Pacific, Africa, Latin America, Middle East

3. **Generate**: Click "Generate Tip"
   - AI creates educational safety tip based on recent news
   - Includes action items and fun facts
   - Takes 10-20 seconds

4. **Review**: Preview the generated tip
   - Check title, content, and action items
   - Verify appropriate for selected audience

5. **Approve & Send**: Click "Approve" to send immediately
   - Emails sent to matching subscribers (by audience and region)

---

## Subscriber Management

### Viewing Subscribers
- Admin → Subscribers tab shows all email subscribers
- Displays: Email, subscription types, region, audience, frequency

### Deleting Subscribers
- Click the trash icon next to any subscriber
- Confirm deletion in the popup dialog

---

## Troubleshooting

### Emails Not Being Received

**Check 1: Verify Brevo API Key**
- Go to Replit Secrets
- Ensure `BREVO_API_KEY` is set correctly (starts with `xkeysib-`)

**Check 2: Verify Domain in Brevo**
1. Log into Brevo dashboard
2. Go to Senders & IP → Domains
3. Ensure getcyberright.com is verified
4. Add required DNS records (DKIM, SPF) if not verified

**Check 3: Check Spam Folder**
- Emails may land in spam initially
- Mark as "Not Spam" to improve deliverability

**Check 4: Subscriber Has Correct Subscription**
- Weekly Digests require "Weekly Digest" subscription enabled
- Safety Tips require "Digital Safety Tips" subscription enabled
- Check Subscribers tab to verify

### Digest Shows "0 Sent"

**Cause**: No subscribers match the digest criteria

**Solution**:
1. Check Subscribers tab for Weekly Digest subscribers
2. Ensure at least one subscriber has "Weekly Digest" badge
3. Verify subscriber regions match the content

### Tips Not Generating

**Cause**: AI service error

**Solutions**:
1. Wait a moment and try again
2. Check that AI integration is configured
3. Verify `AI_INTEGRATIONS_ANTHROPIC_API_KEY` secret exists

### Email Content Has Formatting Issues

**Recent Fix**: AI prompts now enforce:
- Proper punctuation and complete sentences
- No dashes (uses commas, periods, semicolons instead)
- Clean, professional prose

If old content has dashes, generate new content.

---

## Email Service Configuration

### Environment Variables

| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Brevo API key (required) |
| `EMAIL_FROM_ADDRESS` | Sender email (default: tips@getcyberright.com) |
| `EMAIL_FROM_NAME` | Sender name (default: GetCyberRight) |

### Brevo Setup

1. Create account at brevo.com
2. Go to SMTP & API → API Keys
3. Create new API key
4. Add to Replit Secrets as `BREVO_API_KEY`
5. Verify your sending domain in Brevo

### DNS Records for Domain Verification

Add these DNS records for getcyberright.com:
- **DKIM**: TXT record provided by Brevo
- **SPF**: TXT record including Brevo servers
- **DMARC**: Optional but recommended

---

## Content Quality Guidelines

### AI-Generated Content Rules

All generated content follows these rules:
1. Evidence-based only (no invented statistics)
2. References authoritative sources (FBI IC3, CISA, Europol)
3. Plain language for non-technical readers
4. Actionable advice, not fear-mongering
5. Proper grammar with no dashes

### Review Checklist

Before approving any content:
- [ ] Title is clear and engaging
- [ ] Content is factually accurate
- [ ] No sensational or scary language
- [ ] Action items are practical
- [ ] Appropriate for target audience
- [ ] No typos or grammatical errors

---

## Quick Reference

### Admin Tab Navigation
- **Articles**: Manage blog articles
- **Resources**: Manage resource library
- **Subscribers**: View/delete email subscribers
- **Digests**: Generate and send Weekly Fraud Alerts
- **Tips**: Generate and send Digital Safety Tips
- **Security Alerts**: View security notifications

### Status Badges
- **Draft**: Content created, not yet reviewed
- **Approved**: Ready to send
- **Sent**: Already delivered to subscribers

### Common Tasks

| Task | Steps |
|------|-------|
| Send weekly newsletter | Digests → Generate → Review → Approve → Send |
| Send safety tip | Tips → Select audience/region → Generate → Approve |
| Remove subscriber | Subscribers → Find email → Click trash icon → Confirm |
| Check email stats | Look at "sent" count after sending |

---

## Scam Checker Tool

### Overview

The Scam Checker is a free public tool that helps users identify potential scams through 6 different analysis types. It combines rule-based detection, AI analysis, and external API integrations to provide comprehensive threat assessment.

### Analysis Types

#### 1. Link Analysis (URL Check)

**What it checks:**
- Shortened URL expansion (reveals true destination)
- Suspicious TLDs (.xyz, .tk, .top, .work, etc.)
- Typosquatting detection (g00gle.com, paypa1.com, etc.)
- IP-based URLs (http://192.168.1.1/...)
- Missing HTTPS on sensitive sites
- Suspicious keywords in paths (/login, /verify, /account)
- Redirect chain analysis

**External API integrations (requires API keys):**
- **Google Safe Browsing**: Checks against Google's malware/phishing database
- **PhishTank**: Cross-references verified phishing sites

**Risk levels:** Safe, Low, Medium, High, Critical

---

#### 2. QR Code Scanner

**What it does:**
- Scans QR codes from uploaded images
- Extracts embedded URLs
- Runs full URL analysis on extracted links
- Detects malicious redirect patterns

**Use case:** Scanning QR codes from suspicious flyers, emails, or messages before visiting the link.

---

#### 3. Image/Screenshot Analysis

**What it does:**
- Extracts text from images using OCR (Tesseract.js)
- Identifies embedded URLs and phone numbers
- Runs AI analysis on extracted content
- Detects scam language patterns

**Use case:** Analyzing screenshots of suspicious text messages, emails, or social media posts.

---

#### 4. Phone Number Check

**What it checks:**
- Country code identification (40+ countries)
- Premium rate number detection (900, 976, etc.)
- Suspicious patterns (repeated digits, sequential numbers)
- Known scam number patterns by region

**Risk assessment based on:**
- Premium rate prefixes
- Geographic origin
- Pattern anomalies

---

#### 5. Email Header Analysis (Enhanced)

**Basic checks:**
- Sender spoofing (From/Reply-To/Return-Path mismatches)
- SPF, DKIM, DMARC authentication parsing
- Email routing analysis (server hops)
- Spam flag detection
- Unusual X-headers identification

**Enhanced features (run in parallel for speed):**

| Feature | Description |
|---------|-------------|
| **AI Deep Analysis** | Claude AI analyzes header patterns for sophisticated attacks. Uses anti-hallucination rules to only cite actual header data. |
| **Domain Reputation** | Checks sender domain against DNS blocklists: Spamhaus ZEN, Barracuda, SpamCop |
| **RDAP/WHOIS Lookup** | Gets domain age, registrar, registrant country. Flags domains < 30 days old as suspicious |
| **Phishing Pattern Matching** | Detects 6 known attack patterns (see below) |

**Phishing Patterns Detected:**
1. **Business Email Compromise (BEC)** - CEO fraud, wire transfer requests
2. **Invoice/Payment Fraud** - Fake invoices, payment redirect scams
3. **Credential Harvesting** - Password reset, account verification phishing
4. **Package/Delivery Scams** - Fake shipping notifications
5. **Tech Support Scams** - Microsoft/Apple impersonation
6. **Account Suspension Threats** - Urgent account deactivation warnings

**Risk levels:** Safe, Suspicious, Dangerous

---

#### 6. Describe Situation (AI Analysis)

**What it does:**
- AI analyzes user-described situations using Claude
- Identifies scam patterns from real reports (FBI IC3, CISA, INTERPOL)
- Provides confidence score and evidence-based assessment

**Scam types detected:**
- Advance fee fraud (Nigerian prince, lottery)
- Authority impersonation (IRS, police, banks)
- Romance scams
- SIM swap attacks
- Investment/crypto fraud
- Fake job offers
- Mobile money fraud (M-Pesa, MTN, Airtel)

**Anti-hallucination safeguards:**
- Only cites information explicitly stated by user
- Quotes specific phrases as evidence
- Lowers confidence and requests more details when input is vague
- Never assumes or invents details

---

### API Keys Required

| API | Secret Name | Purpose | Free Tier |
|-----|-------------|---------|-----------|
| Google Safe Browsing | `GOOGLE_SAFE_BROWSING_API_KEY` | URL reputation | 10,000 calls/day |
| PhishTank | `PHISHTANK_API_KEY` | Verified phishing sites | Free with registration |

**Note:** All external API checks gracefully degrade if keys are missing. The tool still functions with rule-based analysis.

---

### Premium Tier (Planned February 2026)

Future paid API integrations for enhanced detection:

| API | Cost | Capability |
|-----|------|------------|
| VirusTotal | $5,000/year | 70+ antivirus engines for malware detection |
| Google Web Risk | $0.50/1k calls | Commercial URL reputation |
| NumVerify/Truecaller | TBD | Phone number reputation database |

---

### Technical Notes

- **Performance**: Email header analysis runs 5 checks in parallel for fast response
- **Rate limiting**: Scam checker endpoints are rate-limited to prevent abuse
- **Input validation**: All user input is sanitized before processing
- **Error handling**: API failures return graceful fallbacks, not errors
