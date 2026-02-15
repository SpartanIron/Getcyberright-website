# Security Policy

## Our Commitment

GetCyberRight is a cybersecurity education platform dedicated to protecting families and everyday people online. We take the security of our platform seriously and appreciate the efforts of security researchers and community members who help us maintain a safe environment for our users.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Current production release | Yes |
| Previous releases | No |

We only provide security updates for the latest production version of GetCyberRight.com.

## Reporting a Vulnerability

If you discover a security vulnerability in GetCyberRight, please report it responsibly. **Do not open a public GitHub issue for security vulnerabilities.**

### How to Report

1. **Email**: Send a detailed report to **security@getcyberright.com**
2. **GitHub Private Reporting**: Use GitHub's [private vulnerability reporting](https://github.com/YOUR_ORG/getcyberright/security/advisories/new) feature on this repository

### What to Include

- A clear description of the vulnerability
- Steps to reproduce the issue
- The potential impact of the vulnerability
- Any suggested fixes (if applicable)
- Your contact information for follow-up

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your report within **48 hours**
- **Assessment**: We will evaluate the severity and impact within **5 business days**
- **Updates**: We will keep you informed of our progress toward a fix
- **Resolution**: We aim to resolve critical vulnerabilities within **30 days**
- **Credit**: With your permission, we will publicly credit you for the discovery

## Scope

### In Scope

- GetCyberRight.com web application
- API endpoints under getcyberright.com
- Authentication and session management
- Data handling and storage
- Third-party integrations used by the platform

### Out of Scope

- Social engineering attacks against GetCyberRight team members or users
- Denial of Service (DoS/DDoS) attacks
- Physical security of infrastructure
- Third-party websites or services not operated by GetCyberRight
- Issues in dependencies that are already publicly disclosed (please check first)
- Automated scanning results without a demonstrated vulnerability

## Responsible Disclosure Guidelines

We ask that you:

- **Give us reasonable time** to investigate and address the vulnerability before making any public disclosure
- **Avoid accessing or modifying user data** beyond what is necessary to demonstrate the vulnerability
- **Do not exploit the vulnerability** beyond what is needed for proof of concept
- **Do not perform actions** that could negatively impact our users (e.g., data destruction, service disruption)
- **Act in good faith** to avoid privacy violations, data destruction, or interruption of our services

## Safe Harbor

We consider security research conducted in accordance with this policy to be:

- Authorized under applicable anti-hacking laws
- Exempt from DMCA restrictions related to security testing
- Conducted in good faith

We will not pursue legal action against researchers who follow this policy in good faith.

## Security Best Practices We Follow

- All data transmitted over HTTPS/TLS
- Input validation and sanitization on all endpoints
- Content Security Policy (CSP) and security headers via Helmet.js
- Multi-tier rate limiting with automatic IP blocking
- CSRF protection via origin validation and double-submit cookies
- Session management with secure cookie settings
- Regular dependency audits and updates
- Audit logging for critical actions

## Contact

For security concerns: **security@getcyberright.com**

For general inquiries: Use the contact form on [GetCyberRight.com](https://getcyberright.com)

---

Thank you for helping us keep GetCyberRight and our community safe.
