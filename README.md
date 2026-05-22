# GetCyberRight

**Mission-Driven Cybersecurity Education for Families Worldwide**

GetCyberRight is a free, accessible platform providing AI-powered scam detection, age-specific educational content, and real-time threat intelligence to protect families from online threats.

## Features

- **Scam Checker Suite**: Six integrated tools for comprehensive threat detection
  - URL Analysis with Google Safe Browsing & PhishTank integration
  - QR Code Scanner for suspicious code detection
  - Image/Screenshot Analysis with OCR and AI
  - Phone Number Analysis for scam pattern detection
  - Email Header Analysis with SPF/DKIM/DMARC verification
  - AI-Powered Situation Analysis for complex scenarios

- **Educational Content**: Age-appropriate resources for youth, adults, and seniors
- **Real-Time News**: Aggregated cybersecurity news from trusted sources
- **Threat Intelligence**: Security alerts and breach monitoring
- **Newsletter System**: Weekly digest and digital safety tips

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, TypeScript, TailwindCSS, shadcn/ui |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Drizzle ORM |
| AI | Anthropic Claude API |
| Email | Brevo (primary), MailerSend, SMTP2GO (fallbacks) |
| Authentication | JWT, bcrypt, WebAuthn (Passkeys), TOTP 2FA |

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and helpers
│   └── index.html
├── server/                 # Backend Express server
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Storage interface
│   ├── database-storage.ts # Database implementation
│   ├── scam-checker.ts     # Scam analysis logic
│   ├── security/           # Authentication & security
│   └── email-service.ts    # Email functionality
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema (Drizzle)
├── public/                 # Static assets
└── attached_assets/        # Media assets (images)
```

## Running Locally

### Prerequisites
- Node.js 20+
- PostgreSQL database

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (see Environment Variables section)
4. Push database schema:
   ```bash
   npm run db:push
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## Environment Variables

### Required Secrets (set via Replit Secrets or .env)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT token signing (required) |
| `AI_INTEGRATIONS_ANTHROPIC_API_KEY` | Anthropic API key for AI features |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Google Safe Browsing API key |

### Recommended Secrets

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | Session cookie signing (recommended for production) |
| `NEWS_API_KEY` | News API key (optional, enhances news aggregation) |

### Optional Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `EMAIL_FROM_ADDRESS` | tips@getcyberright.com | Email sender address |
| `EMAIL_FROM_NAME` | GetCyberRight | Email sender name |
| `JWT_EXPIRES_IN` | 8h | JWT token expiration |
| `REFRESH_TOKEN_EXPIRES_IN` | 7d | Refresh token expiration |
| `BASE_URL` | https://getcyberright.com | Site base URL |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | - | reCAPTCHA site key |

### Email Service Configuration (at least one required for email features)

| Variable | Description |
|----------|-------------|
| `BREVO_API_KEY` | Brevo (Sendinblue) API key |
| `MAILERSEND_API_KEY` | MailerSend API key |
| `SMTP2GO_API_KEY` | SMTP2GO API key |

## Deployment

### Railway Deployment

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` and all other required env vars in Railway service Variables
2. Connect your GitHub repo to the Railway service (Settings → Source)
3. Push to main branch — Railway auto-deploys and handles:
   - Building the frontend
   - Starting the production server
   - TLS/SSL certificates
   - Health checks

### Custom Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start production server:
   ```bash
   npm start
   ```

## Security

- Enterprise-grade security headers (CSP, HSTS, XSS protection)
- Multi-tier rate limiting
- Input sanitization and validation
- CSRF protection with double-submit cookies
- Passkey (WebAuthn) support for passwordless authentication
- TOTP-based two-factor authentication for admin accounts
- Comprehensive audit logging

## API Documentation

See `docs/WEBSITE_WALKTHROUGH.md` for detailed feature documentation.

### Key Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/articles` | Published educational articles |
| `GET /api/resources` | Safety resources |
| `GET /api/breaking-news` | Real-time cybersecurity news |
| `POST /api/scam-check/*` | Scam analysis endpoints |
| `POST /api/newsletter/subscribe` | Newsletter subscription |

## Admin Access

Admin features require authentication at `/admin`. Admin accounts can:
- Manage articles and resources
- View security alerts
- Monitor platform analytics
- Configure 2FA and passkeys

## Support & Consulting

For questions, support, or consulting inquiries:

**Email**: hello@getcyberright.com  
**Website**: https://getcyberright.com

## License

Proprietary - All rights reserved.

---

Built with care to make the internet safer for families everywhere.
