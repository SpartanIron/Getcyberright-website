import Anthropic from "@anthropic-ai/sdk";
import https from "https";
import http from "http";
import dns from "dns";
import { promisify } from "util";
import Tesseract from "tesseract.js";
import { logger } from "./logger";

const log = logger.child('ScamChecker');

const dnsResolve4 = promisify(dns.resolve4);
const dnsResolve6 = promisify(dns.resolve6);

// SSRF Protection: Block requests to private/internal networks
const PRIVATE_IPV4_RANGES = [
  /^127\./,                          // Loopback
  /^10\./,                           // Private Class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private Class B
  /^192\.168\./,                     // Private Class C
  /^169\.254\./,                     // Link-local
  /^0\./,                            // Current network
];

const PRIVATE_IPV6_RANGES = [
  /^::1$/,                           // IPv6 loopback
  /^fc00:/i,                         // IPv6 unique local
  /^fd[0-9a-f]{2}:/i,                // IPv6 unique local (full range)
  /^fe80:/i,                         // IPv6 link-local
  /^::$/,                            // Unspecified
  /^::ffff:127\./,                   // IPv4-mapped IPv6 loopback
  /^::ffff:10\./,                    // IPv4-mapped private
  /^::ffff:172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^::ffff:192\.168\./,
  /^::ffff:169\.254\./,
  /^::ffff:0\./,
];

function isPrivateIPv4(ip: string): boolean {
  return PRIVATE_IPV4_RANGES.some(range => range.test(ip));
}

function isPrivateIPv6(ip: string): boolean {
  return PRIVATE_IPV6_RANGES.some(range => range.test(ip));
}

async function isPrivateIP(hostname: string): Promise<boolean> {
  try {
    // Check if hostname is already an IPv4 address
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return isPrivateIPv4(hostname);
    }
    
    // Check if hostname is already an IPv6 address
    if (hostname.includes(':')) {
      return isPrivateIPv6(hostname);
    }
    
    // Resolve hostname to both A and AAAA records
    const [ipv4Results, ipv6Results] = await Promise.allSettled([
      dnsResolve4(hostname),
      dnsResolve6(hostname)
    ]);
    
    // If all DNS resolutions fail, block the request (fail closed)
    if (ipv4Results.status === 'rejected' && ipv6Results.status === 'rejected') {
      log.warn('DNS resolution failed for SSRF check, blocking request', { hostname });
      return true; // Treat as private/blocked
    }
    
    // Check IPv4 addresses
    if (ipv4Results.status === 'fulfilled') {
      if (ipv4Results.value.some(addr => isPrivateIPv4(addr))) {
        return true;
      }
    }
    
    // Check IPv6 addresses
    if (ipv6Results.status === 'fulfilled') {
      if (ipv6Results.value.some(addr => isPrivateIPv6(addr))) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    // On any error, fail closed
    log.warn('Error in SSRF IP check, blocking request', { hostname, error: String(error) });
    return true;
  }
}

function isPrivateHostname(hostname: string): boolean {
  const blockedHostnames = [
    'localhost',
    'localhost.localdomain',
    '*.local',
    'internal',
    'intranet',
    'corp',
    'private',
    '*.internal',
    '*.corp',
    '*.private',
    '*.lan',
    '*.home',
  ];
  
  const lowerHostname = hostname.toLowerCase();
  return blockedHostnames.some(blocked => {
    if (blocked.startsWith('*.')) {
      return lowerHostname.endsWith(blocked.slice(1));
    }
    return lowerHostname === blocked || lowerHostname.endsWith('.' + blocked);
  });
}

// Allowlist of known safe URL shortener and redirect service domains
// Only these domains are allowed to be followed for URL expansion
const ALLOWED_URL_SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 
  'buff.ly', 'rb.gy', 'cutt.ly', 'short.io', 'tiny.cc', 'shorturl.at', 
  'rebrand.ly', 'bl.ink', 'v.gd', 'clck.ru', 'shorte.st', 'adf.ly', 
  'bc.vc', 'j.mp', 'soo.gd', 'u.to', 's.id', 'qr.ae', 'lnkd.in', 
  'youtu.be', 'fb.me', 'amzn.to', 'trib.al', 'po.st', 'dlvr.it', 
  'snip.ly', 'cli.re', 'ppt.cc', 'url.ie', 'han.gl', 'tr.im', 
  'lnk.to', 'smarturl.it', 'linktr.ee',
  // Additional known services
  'aka.ms', 'git.io', 'x.co', 'su.pr', 'lc.cx', 'n9.cl',
  '1url.com', '2ya.com', '3.ly', '4sq.com', '7.ly',
]);

function isAllowlistedDomain(hostname: string): boolean {
  const lowerHostname = hostname.toLowerCase();
  return ALLOWED_URL_SHORTENER_DOMAINS.has(lowerHostname);
}

// Resolve IP addresses and validate ALL records are safe before connecting
async function resolveAndValidateIP(hostname: string): Promise<{ ip: string; family: 4 | 6 } | null> {
  try {
    // Resolve both A and AAAA records
    const [ipv4Results, ipv6Results] = await Promise.allSettled([
      dnsResolve4(hostname),
      dnsResolve6(hostname)
    ]);
    
    const allIpv4: string[] = ipv4Results.status === 'fulfilled' ? ipv4Results.value : [];
    const allIpv6: string[] = ipv6Results.status === 'fulfilled' ? ipv6Results.value : [];
    
    // If all DNS resolutions fail, block (fail closed)
    if (allIpv4.length === 0 && allIpv6.length === 0) {
      log.warn('DNS resolution failed for hostname, blocking', { hostname });
      return null;
    }
    
    // Check ALL IPv4 addresses - block if any are private
    for (const ip of allIpv4) {
      if (isPrivateIPv4(ip)) {
        log.warn('Resolved IPv4 contains private address, blocking all', { hostname, privateIp: ip, allIps: allIpv4 });
        return null;
      }
    }
    
    // Check ALL IPv6 addresses - block if any are private
    for (const ip of allIpv6) {
      if (isPrivateIPv6(ip)) {
        log.warn('Resolved IPv6 contains private address, blocking all', { hostname, privateIp: ip, allIps: allIpv6 });
        return null;
      }
    }
    
    // All IPs are safe, return the first available (prefer IPv4)
    if (allIpv4.length > 0) {
      return { ip: allIpv4[0], family: 4 };
    }
    if (allIpv6.length > 0) {
      return { ip: allIpv6[0], family: 6 };
    }
    
    return null;
  } catch (error) {
    log.warn('Error resolving hostname', { hostname, error: String(error) });
    return null;
  }
}

// External API configurations
const GOOGLE_SAFE_BROWSING_API_KEY = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
const PHISHTANK_API_KEY = process.env.PHISHTANK_API_KEY;
const BITCOINABUSE_API_KEY = process.env.BITCOINABUSE_API_KEY;

interface SafeBrowsingResult {
  isMalicious: boolean;
  threats: string[];
}

interface PhishTankResult {
  isPhishing: boolean;
  inDatabase: boolean;
  verified: boolean;
  phishId?: number;
}

interface BitcoinAbuseResult {
  isReported: boolean;
  reportCount: number;
  abuseTypes: string[];
}

interface URLhausResult {
  isMalware: boolean;
  threatType: string | null;
  tags: string[];
  dateAdded: string | null;
}

// Google Safe Browsing API v4
async function checkGoogleSafeBrowsing(url: string): Promise<SafeBrowsingResult> {
  if (!GOOGLE_SAFE_BROWSING_API_KEY) {
    return { isMalicious: false, threats: [] };
  }

  try {
    const requestBody = JSON.stringify({
      client: {
        clientId: "getcyberright",
        clientVersion: "1.0.0"
      },
      threatInfo: {
        threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
        platformTypes: ["ANY_PLATFORM"],
        threatEntryTypes: ["URL"],
        threatEntries: [{ url }]
      }
    });

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'safebrowsing.googleapis.com',
        path: `/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSING_API_KEY}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        },
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.matches && result.matches.length > 0) {
              const threats = result.matches.map((m: { threatType: string }) => m.threatType);
              resolve({ isMalicious: true, threats: Array.from(new Set(threats)) });
            } else {
              resolve({ isMalicious: false, threats: [] });
            }
          } catch {
            resolve({ isMalicious: false, threats: [] });
          }
        });
      });

      req.on('error', () => resolve({ isMalicious: false, threats: [] }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ isMalicious: false, threats: [] });
      });
      req.write(requestBody);
      req.end();
    });
  } catch (error) {
    log.error('Google Safe Browsing error', { error: String(error) });
    return { isMalicious: false, threats: [] };
  }
}

// PhishTank API
async function checkPhishTank(url: string): Promise<PhishTankResult> {
  if (!PHISHTANK_API_KEY) {
    return { isPhishing: false, inDatabase: false, verified: false };
  }

  try {
    const postData = `format=json&url=${encodeURIComponent(url)}&app_key=${PHISHTANK_API_KEY}`;

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'checkurl.phishtank.com',
        path: '/checkurl/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.results) {
              resolve({
                isPhishing: result.results.valid === true,
                inDatabase: result.results.in_database === true,
                verified: result.results.verified === true,
                phishId: result.results.phish_id
              });
            } else {
              resolve({ isPhishing: false, inDatabase: false, verified: false });
            }
          } catch {
            resolve({ isPhishing: false, inDatabase: false, verified: false });
          }
        });
      });

      req.on('error', () => resolve({ isPhishing: false, inDatabase: false, verified: false }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ isPhishing: false, inDatabase: false, verified: false });
      });
      req.write(postData);
      req.end();
    });
  } catch (error) {
    log.error('PhishTank error', { error: String(error) });
    return { isPhishing: false, inDatabase: false, verified: false };
  }
}

// BitcoinAbuse API
async function checkBitcoinAbuse(address: string): Promise<BitcoinAbuseResult> {
  if (!BITCOINABUSE_API_KEY) {
    return { isReported: false, reportCount: 0, abuseTypes: [] };
  }

  try {
    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'www.bitcoinabuse.com',
        path: `/api/reports/check?address=${encodeURIComponent(address)}&api_token=${BITCOINABUSE_API_KEY}`,
        method: 'GET',
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.count && result.count > 0) {
              resolve({
                isReported: true,
                reportCount: result.count,
                abuseTypes: result.abuse_types || []
              });
            } else {
              resolve({ isReported: false, reportCount: 0, abuseTypes: [] });
            }
          } catch {
            resolve({ isReported: false, reportCount: 0, abuseTypes: [] });
          }
        });
      });

      req.on('error', () => resolve({ isReported: false, reportCount: 0, abuseTypes: [] }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ isReported: false, reportCount: 0, abuseTypes: [] });
      });
      req.end();
    });
  } catch (error) {
    log.error('BitcoinAbuse error', { error: String(error) });
    return { isReported: false, reportCount: 0, abuseTypes: [] };
  }
}

// URLhaus API (abuse.ch) - Free malware URL database
async function checkURLhaus(url: string): Promise<URLhausResult> {
  try {
    const postData = `url=${encodeURIComponent(url)}`;

    return new Promise((resolve) => {
      const req = https.request({
        hostname: 'urlhaus-api.abuse.ch',
        path: '/v1/url/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 5000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.query_status === 'ok' && result.url_status === 'online') {
              resolve({
                isMalware: true,
                threatType: result.threat || null,
                tags: result.tags || [],
                dateAdded: result.date_added || null
              });
            } else if (result.query_status === 'ok' && result.url_status) {
              resolve({
                isMalware: true,
                threatType: result.threat || null,
                tags: result.tags || [],
                dateAdded: result.date_added || null
              });
            } else {
              resolve({ isMalware: false, threatType: null, tags: [], dateAdded: null });
            }
          } catch {
            resolve({ isMalware: false, threatType: null, tags: [], dateAdded: null });
          }
        });
      });

      req.on('error', () => resolve({ isMalware: false, threatType: null, tags: [], dateAdded: null }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ isMalware: false, threatType: null, tags: [], dateAdded: null });
      });
      req.write(postData);
      req.end();
    });
  } catch (error) {
    log.error('URLhaus error', { error: String(error) });
    return { isMalware: false, threatType: null, tags: [], dateAdded: null };
  }
}

// Bitcoin address regex pattern
const BITCOIN_ADDRESS_REGEX = /\b(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{39,59})\b/g;

// Extract Bitcoin addresses from text
function extractBitcoinAddresses(text: string): string[] {
  const matches = text.match(BITCOIN_ADDRESS_REGEX);
  return matches ? Array.from(new Set(matches)) : [];
}

// Export for use in routes
export { checkBitcoinAbuse, extractBitcoinAddresses };

// Email Header Analysis
interface DomainReputation {
  isBlacklisted: boolean;
  blacklists: string[];
  trustScore: number;
}

interface DomainInfo {
  domain: string;
  registrationDate: string | null;
  expirationDate: string | null;
  ageInDays: number | null;
  registrar: string | null;
  registrantOrg: string | null;
  registrantCountry: string | null;
  isNewDomain: boolean;
}

interface PhishingPattern {
  patternName: string;
  description: string;
  matchedIndicators: string[];
}

interface EmailHeaderAnalysisResult {
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  confidence: number;
  sender: {
    from: string | null;
    replyTo: string | null;
    returnPath: string | null;
    mismatch: boolean;
  };
  authentication: {
    spf: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'unknown';
    dkim: 'pass' | 'fail' | 'none' | 'unknown';
    dmarc: 'pass' | 'fail' | 'none' | 'unknown';
  };
  routingAnalysis: {
    hops: number;
    suspiciousHops: string[];
    originCountry: string | null;
  };
  domainReputation: DomainReputation | null;
  domainInfo: DomainInfo | null;
  phishingPatterns: PhishingPattern[];
  aiAnalysis: string | null;
  redFlags: string[];
  recommendations: string[];
  summary: string;
}

// Known phishing patterns based on FBI IC3, CISA, and security research
const PHISHING_PATTERNS: { name: string; description: string; indicators: RegExp[] }[] = [
  {
    name: 'Business Email Compromise (BEC)',
    description: 'Impersonates executives or vendors to request wire transfers or sensitive data',
    indicators: [
      /urgent.*wire|wire.*urgent/i,
      /ceo|cfo|president|executive/i,
      /confidential.*transfer|transfer.*confidential/i,
      /reply-to.*differs.*from/i
    ]
  },
  {
    name: 'Invoice/Payment Fraud',
    description: 'Fake invoices or payment requests with modified banking details',
    indicators: [
      /invoice.*attached|attached.*invoice/i,
      /payment.*details.*changed/i,
      /new.*bank.*account/i,
      /wire.*instructions/i
    ]
  },
  {
    name: 'Credential Harvesting',
    description: 'Attempts to steal login credentials through fake login pages',
    indicators: [
      /verify.*account|account.*verify/i,
      /password.*expired|expired.*password/i,
      /click.*here.*login|login.*click.*here/i,
      /unusual.*activity|suspicious.*login/i
    ]
  },
  {
    name: 'Package Delivery Scam',
    description: 'Fake shipping notifications to steal personal information',
    indicators: [
      /package.*delivery|delivery.*failed/i,
      /tracking.*number/i,
      /customs.*fee|delivery.*fee/i,
      /reschedule.*delivery/i
    ]
  },
  {
    name: 'Tech Support Scam',
    description: 'Fake security alerts claiming device is infected',
    indicators: [
      /virus.*detected|malware.*found/i,
      /call.*immediately|urgent.*support/i,
      /microsoft.*support|apple.*support/i,
      /computer.*compromised/i
    ]
  },
  {
    name: 'Account Suspension Threat',
    description: 'Threatens account closure to create urgency',
    indicators: [
      /account.*suspended|suspended.*account/i,
      /verify.*within.*hours/i,
      /immediate.*action.*required/i,
      /account.*will.*be.*closed/i
    ]
  }
];

// Check domain against DNS-based blocklists
async function checkDomainReputation(domain: string): Promise<DomainReputation> {
  const blocklists = [
    { name: 'Spamhaus ZEN', suffix: 'zen.spamhaus.org' },
    { name: 'Barracuda', suffix: 'b.barracudacentral.org' },
    { name: 'SpamCop', suffix: 'bl.spamcop.net' }
  ];
  
  const blacklistedOn: string[] = [];
  
  // Reverse the domain for DNS lookup (for IP-based lookups)
  // For domain lookups, we check if the domain resolves through the blocklist
  const dns = await import('dns').then(m => m.promises);
  
  for (const bl of blocklists) {
    try {
      // Try to resolve the domain through the blocklist
      await dns.resolve4(`${domain}.${bl.suffix}`);
      // If it resolves, the domain is listed
      blacklistedOn.push(bl.name);
    } catch {
      // Domain not listed (NXDOMAIN)
    }
  }
  
  const trustScore = blacklistedOn.length === 0 ? 100 : Math.max(0, 100 - blacklistedOn.length * 30);
  
  return {
    isBlacklisted: blacklistedOn.length > 0,
    blacklists: blacklistedOn,
    trustScore
  };
}

// Fetch domain info via RDAP (modern WHOIS replacement)
async function fetchDomainInfo(domain: string): Promise<DomainInfo | null> {
  try {
    // Extract root domain
    const parts = domain.split('.');
    const rootDomain = parts.length > 2 ? parts.slice(-2).join('.') : domain;
    
    // RDAP bootstrap to find the right server
    const rdapServers: Record<string, string> = {
      'com': 'https://rdap.verisign.com/com/v1',
      'net': 'https://rdap.verisign.com/net/v1',
      'org': 'https://rdap.publicinterestregistry.org/rdap/org/v1',
      'io': 'https://rdap.nic.io',
      'co': 'https://rdap.nic.co',
      'app': 'https://rdap.nic.google',
      'dev': 'https://rdap.nic.google'
    };
    
    const tld = rootDomain.split('.').pop() || 'com';
    const rdapUrl = rdapServers[tld] || `https://rdap.org/domain/${rootDomain}`;
    
    return new Promise((resolve) => {
      const url = rdapServers[tld] ? `${rdapServers[tld]}/domain/${rootDomain}` : rdapUrl;
      
      https.get(url, { timeout: 5000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const rdap = JSON.parse(data);
            
            // Extract registration and expiration dates
            let registrationDate: string | null = null;
            let expirationDate: string | null = null;
            
            if (rdap.events) {
              for (const event of rdap.events) {
                if (event.eventAction === 'registration') {
                  registrationDate = event.eventDate;
                } else if (event.eventAction === 'expiration') {
                  expirationDate = event.eventDate;
                }
              }
            }
            
            // Calculate domain age
            let ageInDays: number | null = null;
            if (registrationDate) {
              const regDate = new Date(registrationDate);
              const now = new Date();
              ageInDays = Math.floor((now.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
            }
            
            // Extract registrar info
            let registrar: string | null = null;
            if (rdap.entities) {
              for (const entity of rdap.entities) {
                if (entity.roles?.includes('registrar')) {
                  registrar = entity.vcardArray?.[1]?.find((v: string[]) => v[0] === 'fn')?.[3] || entity.handle;
                }
              }
            }
            
            // Extract registrant info
            let registrantOrg: string | null = null;
            let registrantCountry: string | null = null;
            if (rdap.entities) {
              for (const entity of rdap.entities) {
                if (entity.roles?.includes('registrant')) {
                  const vcard = entity.vcardArray?.[1];
                  if (vcard) {
                    registrantOrg = vcard.find((v: string[]) => v[0] === 'org')?.[3];
                    const adr = vcard.find((v: string[]) => v[0] === 'adr');
                    if (adr && Array.isArray(adr[3])) {
                      registrantCountry = adr[3][6] || null;
                    }
                  }
                }
              }
            }
            
            resolve({
              domain: rootDomain,
              registrationDate,
              expirationDate,
              ageInDays,
              registrar,
              registrantOrg,
              registrantCountry,
              isNewDomain: ageInDays !== null && ageInDays < 30
            });
          } catch {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null))
        .on('timeout', function(this: ReturnType<typeof https.get>) { this.destroy(); resolve(null); });
    });
  } catch {
    return null;
  }
}

// Match email content against known phishing patterns
function matchPhishingPatterns(headers: string, subject: string | null): PhishingPattern[] {
  const matched: PhishingPattern[] = [];
  const textToCheck = `${headers} ${subject || ''}`.toLowerCase();
  
  for (const pattern of PHISHING_PATTERNS) {
    const matchedIndicators: string[] = [];
    for (const indicator of pattern.indicators) {
      if (indicator.test(textToCheck)) {
        matchedIndicators.push(indicator.source);
      }
    }
    
    if (matchedIndicators.length >= 2) {
      matched.push({
        patternName: pattern.name,
        description: pattern.description,
        matchedIndicators
      });
    }
  }
  
  return matched;
}

// AI-powered deep analysis of email headers
async function analyzeEmailWithAI(headers: string, basicAnalysis: Omit<EmailHeaderAnalysisResult, 'aiAnalysis'>): Promise<string> {
  try {
    const prompt = `You are an email security expert. Analyze these email headers and provide a clear, non-technical explanation of whether this email is legitimate or suspicious.

EMAIL HEADERS:
${headers.substring(0, 3000)}

AUTOMATED ANALYSIS RESULTS:
- Risk Level: ${basicAnalysis.riskLevel}
- From: ${basicAnalysis.sender.from || 'unknown'}
- Reply-To: ${basicAnalysis.sender.replyTo || 'same as from'}
- Sender Mismatch: ${basicAnalysis.sender.mismatch ? 'YES' : 'No'}
- SPF: ${basicAnalysis.authentication.spf}
- DKIM: ${basicAnalysis.authentication.dkim}
- DMARC: ${basicAnalysis.authentication.dmarc}
- Server Hops: ${basicAnalysis.routingAnalysis.hops}
${basicAnalysis.domainInfo ? `- Domain Age: ${basicAnalysis.domainInfo.ageInDays} days` : ''}
${basicAnalysis.domainReputation?.isBlacklisted ? `- BLACKLISTED on: ${basicAnalysis.domainReputation.blacklists.join(', ')}` : ''}
${basicAnalysis.phishingPatterns.length > 0 ? `- Matches phishing patterns: ${basicAnalysis.phishingPatterns.map(p => p.patternName).join(', ')}` : ''}
- Red Flags: ${basicAnalysis.redFlags.join('; ') || 'None'}

CRITICAL ANTI-HALLUCINATION RULES:
1. ONLY reference information that appears in the headers above or the automated analysis results
2. NEVER invent, assume, or speculate about details not present in the data
3. If the headers lack sufficient information, say "Based on limited information" and explain what is known
4. Quote specific header values when making claims (e.g., "The SPF check failed" or "The sender domain is only X days old")
5. Do not make claims about the email content, attachments, or sender intent that cannot be verified from headers alone

Provide a 2-3 sentence plain-language summary explaining what these findings mean for a non-technical person. Focus on the most important security indicators. Do not use dashes for punctuation. Be direct and actionable.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }]
    });

    const textContent = response.content.find(c => c.type === 'text');
    return textContent?.text || 'Unable to generate AI analysis.';
  } catch (error) {
    log.error('AI email analysis error', { error: String(error) });
    return 'AI analysis unavailable.';
  }
}

function parseEmailHeaders(rawHeaders: string): EmailHeaderAnalysisResult {
  const headers = rawHeaders.toLowerCase();
  const originalHeaders = rawHeaders;
  const redFlags: string[] = [];
  const recommendations: string[] = [];
  
  // Extract email addresses using regex
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/gi;
  
  // Parse From header
  const fromMatch = originalHeaders.match(/^from:\s*(.+?)$/mi);
  const fromValue = fromMatch ? fromMatch[1].trim() : null;
  const fromEmails = fromValue?.match(emailRegex);
  const fromEmail = fromEmails ? fromEmails[0].toLowerCase() : null;
  
  // Parse Reply-To header
  const replyToMatch = originalHeaders.match(/^reply-to:\s*(.+?)$/mi);
  const replyToValue = replyToMatch ? replyToMatch[1].trim() : null;
  const replyToEmails = replyToValue?.match(emailRegex);
  const replyToEmail = replyToEmails ? replyToEmails[0].toLowerCase() : null;
  
  // Parse Return-Path header
  const returnPathMatch = originalHeaders.match(/^return-path:\s*(.+?)$/mi);
  const returnPathValue = returnPathMatch ? returnPathMatch[1].trim() : null;
  const returnPathEmails = returnPathValue?.match(emailRegex);
  const returnPathEmail = returnPathEmails ? returnPathEmails[0].toLowerCase() : null;
  
  // Check for sender mismatches
  let senderMismatch = false;
  if (fromEmail && replyToEmail) {
    const fromDomain = fromEmail.split('@')[1];
    const replyToDomain = replyToEmail.split('@')[1];
    if (fromDomain !== replyToDomain) {
      senderMismatch = true;
      redFlags.push(`Reply-To domain (${replyToDomain}) differs from From domain (${fromDomain})`);
    }
  }
  
  if (fromEmail && returnPathEmail) {
    const fromDomain = fromEmail.split('@')[1];
    const returnPathDomain = returnPathEmail.split('@')[1];
    if (fromDomain !== returnPathDomain) {
      senderMismatch = true;
      redFlags.push(`Return-Path domain (${returnPathDomain}) differs from From domain (${fromDomain})`);
    }
  }
  
  // Parse Authentication-Results header
  const authResultsMatch = originalHeaders.match(/^authentication-results:\s*([\s\S]+?)(?=^\w+-?\w*:|$)/mi);
  const authResults = authResultsMatch ? authResultsMatch[1].toLowerCase() : '';
  
  // Parse SPF
  let spf: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none' | 'unknown' = 'unknown';
  if (authResults.includes('spf=pass')) spf = 'pass';
  else if (authResults.includes('spf=fail')) { spf = 'fail'; redFlags.push('SPF authentication failed; sender may be forged'); }
  else if (authResults.includes('spf=softfail')) { spf = 'softfail'; redFlags.push('SPF softfail; sender domain allows but discourages this server'); }
  else if (authResults.includes('spf=neutral')) spf = 'neutral';
  else if (authResults.includes('spf=none')) spf = 'none';
  
  // Also check for separate SPF header
  const spfHeaderMatch = originalHeaders.match(/^received-spf:\s*(\w+)/mi);
  if (spfHeaderMatch && spf === 'unknown') {
    const spfResult = spfHeaderMatch[1].toLowerCase();
    if (spfResult === 'pass') spf = 'pass';
    else if (spfResult === 'fail') { spf = 'fail'; redFlags.push('SPF authentication failed; sender may be forged'); }
    else if (spfResult === 'softfail') { spf = 'softfail'; }
  }
  
  // Parse DKIM
  let dkim: 'pass' | 'fail' | 'none' | 'unknown' = 'unknown';
  if (authResults.includes('dkim=pass')) dkim = 'pass';
  else if (authResults.includes('dkim=fail')) { dkim = 'fail'; redFlags.push('DKIM signature verification failed; email may have been tampered with'); }
  else if (authResults.includes('dkim=none')) dkim = 'none';
  
  // Parse DMARC
  let dmarc: 'pass' | 'fail' | 'none' | 'unknown' = 'unknown';
  if (authResults.includes('dmarc=pass')) dmarc = 'pass';
  else if (authResults.includes('dmarc=fail')) { dmarc = 'fail'; redFlags.push('DMARC policy check failed; high likelihood of spoofing'); }
  else if (authResults.includes('dmarc=none')) dmarc = 'none';
  
  // Parse Received headers for routing analysis
  const receivedHeaders = originalHeaders.match(/^received:\s*[\s\S]+?(?=^received:|^\w+-?\w*:|$)/gmi) || [];
  const hops = receivedHeaders.length;
  const suspiciousHops: string[] = [];
  
  // Known suspicious patterns in routing
  const suspiciousPatterns = [
    /from\s+localhost/i,
    /from\s+\[?\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\]?\s+\(/i, // Direct IP without hostname
    /from\s+unknown/i,
    /helo=.+?\.ru\b/i,
    /helo=.+?\.cn\b/i,
    /from\s+.+?\.onion/i,
  ];
  
  receivedHeaders.forEach((hop, index) => {
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(hop)) {
        suspiciousHops.push(`Hop ${hops - index}: Suspicious routing pattern detected`);
        break;
      }
    }
  });
  
  if (suspiciousHops.length > 0) {
    redFlags.push(`${suspiciousHops.length} suspicious routing hop(s) detected`);
  }
  
  // Try to detect origin country from first Received header
  let originCountry: string | null = null;
  if (receivedHeaders.length > 0) {
    const lastHop = receivedHeaders[receivedHeaders.length - 1];
    const countryPatterns: Record<string, RegExp> = {
      'Russia': /\.ru\b/i,
      'China': /\.cn\b/i,
      'Nigeria': /\.ng\b/i,
      'India': /\.in\b/i,
      'Brazil': /\.br\b/i,
      'United States': /\.com\b|\.us\b|\.edu\b/i,
      'Germany': /\.de\b/i,
      'United Kingdom': /\.uk\b|\.co\.uk\b/i,
    };
    
    for (const [country, pattern] of Object.entries(countryPatterns)) {
      if (pattern.test(lastHop)) {
        originCountry = country;
        break;
      }
    }
  }
  
  // Check for suspicious X-headers
  if (headers.includes('x-spam-status: yes') || headers.includes('x-spam-flag: yes')) {
    redFlags.push('Email was flagged as spam by receiving server');
  }
  
  if (headers.includes('x-originating-ip')) {
    const origIpMatch = originalHeaders.match(/x-originating-ip:\s*\[?([\d.]+)\]?/i);
    if (origIpMatch) {
      const ip = origIpMatch[1];
      // Check for private IPs being exposed (unusual)
      if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
        redFlags.push('Email exposes internal/private IP address');
      }
    }
  }
  
  // Check for bulk mail indicators
  if (headers.includes('precedence: bulk') || headers.includes('list-unsubscribe')) {
    // Not necessarily bad, but good to note
  }
  
  // Check for missing important headers
  if (!fromEmail) {
    redFlags.push('Missing or malformed From header');
  }
  
  if (hops === 0) {
    redFlags.push('No Received headers found; email routing cannot be verified');
  }
  
  if (hops > 10) {
    redFlags.push(`Unusually long routing chain (${hops} hops); may indicate relay abuse`);
  }
  
  // Calculate risk level and confidence
  let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
  let confidence = 70;
  
  const criticalFlags = redFlags.filter(f => 
    f.includes('DMARC') || 
    f.includes('forged') || 
    f.includes('SPF authentication failed')
  ).length;
  
  const warningFlags = redFlags.length - criticalFlags;
  
  if (criticalFlags > 0) {
    riskLevel = 'dangerous';
    confidence = Math.min(95, 70 + criticalFlags * 10);
  } else if (warningFlags >= 3 || senderMismatch) {
    riskLevel = 'suspicious';
    confidence = Math.min(85, 50 + warningFlags * 10);
  } else if (warningFlags > 0) {
    riskLevel = 'suspicious';
    confidence = 40 + warningFlags * 10;
  } else if (spf === 'pass' && dkim === 'pass') {
    riskLevel = 'safe';
    confidence = 85;
  }
  
  // Generate recommendations
  if (riskLevel === 'dangerous') {
    recommendations.push('Do not click any links or download attachments from this email');
    recommendations.push('Do not reply to this email or provide any personal information');
    recommendations.push('Report this email as phishing to your email provider');
  } else if (riskLevel === 'suspicious') {
    recommendations.push('Verify the sender through a separate, trusted channel before responding');
    recommendations.push('Be cautious with any links or attachments');
    recommendations.push('Check if the sender\'s email address matches who they claim to be');
  } else {
    recommendations.push('Email authentication checks passed');
    recommendations.push('Still verify unexpected requests through official channels');
  }
  
  // Generate summary
  let summary = '';
  if (riskLevel === 'dangerous') {
    summary = `This email shows strong signs of spoofing or forgery. ${criticalFlags} critical authentication failure(s) detected. Do not trust this email.`;
  } else if (riskLevel === 'suspicious') {
    summary = `This email has ${warningFlags} warning sign(s) that warrant caution. ${senderMismatch ? 'The reply address differs from the sender address.' : ''} Verify the sender before taking action.`;
  } else {
    summary = `Email authentication checks (SPF: ${spf}, DKIM: ${dkim}, DMARC: ${dmarc}) indicate this email is likely legitimate. Always verify unexpected requests.`;
  }
  
  // Extract subject for pattern matching
  const subjectMatch = originalHeaders.match(/^subject:\s*(.+?)$/mi);
  const subject = subjectMatch ? subjectMatch[1].trim() : null;
  
  // Match phishing patterns
  const phishingPatterns = matchPhishingPatterns(originalHeaders, subject);
  
  // Add phishing pattern warnings
  if (phishingPatterns.length > 0) {
    for (const pattern of phishingPatterns) {
      redFlags.push(`Matches "${pattern.patternName}" phishing pattern: ${pattern.description}`);
    }
    if (riskLevel === 'safe') {
      riskLevel = 'suspicious';
      confidence = Math.max(confidence, 60);
    }
  }
  
  return {
    riskLevel,
    confidence,
    sender: {
      from: fromEmail,
      replyTo: replyToEmail,
      returnPath: returnPathEmail,
      mismatch: senderMismatch
    },
    authentication: { spf, dkim, dmarc },
    routingAnalysis: {
      hops,
      suspiciousHops,
      originCountry
    },
    domainReputation: null,
    domainInfo: null,
    phishingPatterns,
    aiAnalysis: null,
    redFlags,
    recommendations,
    summary
  };
}

// Enhanced async version with all additional checks
async function analyzeEmailHeadersEnhanced(rawHeaders: string): Promise<EmailHeaderAnalysisResult> {
  // Start with basic analysis
  const basicResult = parseEmailHeaders(rawHeaders);
  
  // Extract sender domain for reputation and WHOIS checks
  const senderDomain = basicResult.sender.from?.split('@')[1] || null;
  
  // Run enhanced checks in parallel
  const [domainReputation, domainInfo] = await Promise.all([
    senderDomain ? checkDomainReputation(senderDomain) : Promise.resolve(null),
    senderDomain ? fetchDomainInfo(senderDomain) : Promise.resolve(null)
  ]);
  
  // Update red flags based on enhanced analysis
  const enhancedRedFlags = [...basicResult.redFlags];
  let enhancedRiskLevel = basicResult.riskLevel;
  let enhancedConfidence = basicResult.confidence;
  
  if (domainReputation?.isBlacklisted) {
    enhancedRedFlags.push(`Sender domain is blacklisted on: ${domainReputation.blacklists.join(', ')}`);
    enhancedRiskLevel = 'dangerous';
    enhancedConfidence = Math.max(enhancedConfidence, 90);
  }
  
  if (domainInfo?.isNewDomain) {
    enhancedRedFlags.push(`Sender domain is very new (${domainInfo.ageInDays} days old). New domains are often used for scams.`);
    if (enhancedRiskLevel === 'safe') {
      enhancedRiskLevel = 'suspicious';
    }
    enhancedConfidence = Math.max(enhancedConfidence, 70);
  }
  
  // Create partial result for AI analysis
  const partialResult: Omit<EmailHeaderAnalysisResult, 'aiAnalysis'> = {
    ...basicResult,
    riskLevel: enhancedRiskLevel,
    confidence: enhancedConfidence,
    domainReputation,
    domainInfo,
    redFlags: enhancedRedFlags
  };
  
  // Get AI analysis
  const aiAnalysis = await analyzeEmailWithAI(rawHeaders, partialResult);
  
  // Update recommendations based on enhanced findings
  const enhancedRecommendations = [...basicResult.recommendations];
  if (domainInfo?.isNewDomain) {
    enhancedRecommendations.unshift('Be extra cautious: sender\'s domain was registered very recently');
  }
  if (domainReputation?.isBlacklisted) {
    enhancedRecommendations.unshift('This sender\'s domain is on security blocklists. Do not trust this email.');
  }
  
  // Update summary
  let enhancedSummary = basicResult.summary;
  if (domainReputation?.isBlacklisted || domainInfo?.isNewDomain || basicResult.phishingPatterns.length > 0) {
    const issues: string[] = [];
    if (domainReputation?.isBlacklisted) issues.push('blacklisted domain');
    if (domainInfo?.isNewDomain) issues.push('newly registered domain');
    if (basicResult.phishingPatterns.length > 0) issues.push(`matches ${basicResult.phishingPatterns.length} phishing pattern(s)`);
    enhancedSummary = `Enhanced analysis found: ${issues.join(', ')}. ${enhancedSummary}`;
  }
  
  return {
    ...partialResult,
    recommendations: enhancedRecommendations,
    summary: enhancedSummary,
    aiAnalysis
  };
}

export { parseEmailHeaders, analyzeEmailHeadersEnhanced, type EmailHeaderAnalysisResult };

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL,
});

interface ImageAnalysisResult {
  extractedText: string;
  scamAnalysis: ScamAnalysisResult;
  containsLinks: string[];
  containsPhones: string[];
}

interface URLAnalysisResult {
  isSuspicious: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  recommendations: string[];
  expandedUrl?: string;
  redirectChain?: string[];
}

interface PhoneAnalysisResult {
  isSuspicious: boolean;
  riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  countryInfo?: string;
  warnings: string[];
  recommendations: string[];
}

interface ScamAnalysisResult {
  verdict: 'safe' | 'suspicious' | 'likely_scam' | 'scam';
  confidence: number;
  explanation: string;
  redFlags: string[];
  recommendations: string[];
  scamType?: string;
  sources?: { name: string; url: string; relevance: string }[];
}

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.club', '.work', '.click', '.link', '.tk', '.ml', '.ga', '.cf', '.gq'];

const URL_SHORTENERS = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'rb.gy', 'cutt.ly', 'short.io', 'tiny.cc', 'shorturl.at', 'rebrand.ly', 'bl.ink', 'v.gd', 'clck.ru', 'shorte.st', 'adf.ly', 'bc.vc', 'j.mp', 'soo.gd', 'u.to', 's.id', 'qr.ae', 'lnkd.in', 'youtu.be', 'fb.me', 'amzn.to', 'trib.al', 'po.st', 'dlvr.it', 'buff.ly', 'snip.ly', 'cli.re', 'ppt.cc', 'url.ie', 'han.gl', 'tr.im', 'lnk.to', 'smarturl.it', 'linktr.ee'];

async function expandUrl(shortUrl: string, maxRedirects = 5): Promise<{ finalUrl: string; redirectChain: string[] }> {
  const redirectChain: string[] = [];
  let currentUrl = shortUrl;
  const visitedUrls = new Set<string>();
  const overallTimeout = 8000;
  const perHopTimeout = 2000;
  const startTime = Date.now();
  
  if (!currentUrl.startsWith('http://') && !currentUrl.startsWith('https://')) {
    currentUrl = 'https://' + currentUrl;
  }
  
  try {
    const urlObj = new URL(currentUrl);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      throw new Error('Only HTTP/HTTPS protocols are supported');
    }
    
    // SSRF Protection: Only allow requests to allowlisted URL shortener domains
    if (!isAllowlistedDomain(urlObj.hostname)) {
      log.info('URL expansion skipped: domain not in allowlist', { hostname: urlObj.hostname });
      return { finalUrl: currentUrl, redirectChain: [currentUrl] };
    }
    
    // Additional check: Block private/internal network requests
    if (isPrivateHostname(urlObj.hostname)) {
      log.warn('SSRF attempt blocked: private hostname', { hostname: urlObj.hostname, url: shortUrl });
      return { finalUrl: currentUrl, redirectChain: [currentUrl] };
    }
  } catch (error) {
    return { finalUrl: currentUrl, redirectChain: [currentUrl] };
  }
  
  redirectChain.push(currentUrl);
  visitedUrls.add(currentUrl.toLowerCase());
  
  for (let i = 0; i < maxRedirects; i++) {
    if (Date.now() - startTime > overallTimeout) {
      break;
    }
    
    try {
      const urlObj = new URL(currentUrl);
      
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        break;
      }
      
      // Resolve IP address immediately before connecting to prevent DNS rebinding
      const resolved = await resolveAndValidateIP(urlObj.hostname);
      if (!resolved) {
        log.warn('SSRF protection: DNS resolution blocked', { hostname: urlObj.hostname });
        break;
      }
      
      const result = await new Promise<{ location: string | null; statusCode: number }>((resolve, reject) => {
        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.request({
          // Use resolved IP to prevent DNS rebinding
          hostname: resolved.ip,
          port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
          path: urlObj.pathname + urlObj.search,
          method: 'HEAD',
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; GetCyberRight ScamChecker/1.0)',
            'Host': urlObj.hostname // Preserve original hostname for virtual hosts
          },
          timeout: perHopTimeout,
          // For HTTPS, we need to set servername for SNI
          ...(urlObj.protocol === 'https:' ? { servername: urlObj.hostname } : {})
        }, (res) => {
          res.destroy();
          resolve({
            location: res.headers.location || null,
            statusCode: res.statusCode || 0
          });
        });
        
        req.on('error', () => reject(new Error('Request failed')));
        req.on('timeout', () => {
          req.destroy();
          reject(new Error('Request timeout'));
        });
        req.end();
      });
      
      if (result.statusCode >= 300 && result.statusCode < 400 && result.location) {
        let nextUrl: string;
        try {
          nextUrl = result.location.startsWith('http') 
            ? result.location 
            : new URL(result.location, currentUrl).href;
          
          const nextUrlObj = new URL(nextUrl);
          if (nextUrlObj.protocol !== 'http:' && nextUrlObj.protocol !== 'https:') {
            break;
          }
          
          // SSRF Protection: Block redirects to private hostnames
          if (isPrivateHostname(nextUrlObj.hostname)) {
            log.warn('SSRF redirect blocked: private hostname', { hostname: nextUrlObj.hostname, redirect: nextUrl });
            break;
          }
          
          // For non-allowlisted redirect targets, stop following but record the final destination
          // This allows us to capture where a shortener redirects WITHOUT making requests to arbitrary domains
          if (!isAllowlistedDomain(nextUrlObj.hostname)) {
            // Stop following redirects, but record this as the final expanded URL
            currentUrl = nextUrl;
            redirectChain.push(currentUrl);
            log.info('URL expansion complete: reached non-allowlisted domain', { hostname: nextUrlObj.hostname });
            break;
          }
          
          // Validate redirect target IP (will be re-validated before actual connection)
          const redirectResolved = await resolveAndValidateIP(nextUrlObj.hostname);
          if (!redirectResolved) {
            log.warn('SSRF redirect blocked: private/invalid IP', { hostname: nextUrlObj.hostname });
            break;
          }
        } catch {
          break;
        }
        
        if (visitedUrls.has(nextUrl.toLowerCase())) {
          break;
        }
        
        currentUrl = nextUrl;
        redirectChain.push(currentUrl);
        visitedUrls.add(currentUrl.toLowerCase());
      } else {
        break;
      }
    } catch (error) {
      break;
    }
  }
  
  return {
    finalUrl: currentUrl,
    redirectChain
  };
}

const COUNTRY_CODES: Record<string, string> = {
  '+1': 'USA/Canada',
  '+44': 'United Kingdom',
  '+234': 'Nigeria',
  '+233': 'Ghana',
  '+254': 'Kenya',
  '+255': 'Tanzania',
  '+256': 'Uganda',
  '+27': 'South Africa',
  '+91': 'India',
  '+92': 'Pakistan',
  '+63': 'Philippines',
  '+86': 'China',
  '+7': 'Russia',
  '+380': 'Ukraine',
  '+237': 'Cameroon',
  '+225': 'Ivory Coast',
  '+221': 'Senegal',
  '+880': 'Bangladesh',
  '+62': 'Indonesia',
  '+60': 'Malaysia',
  '+65': 'Singapore',
  '+81': 'Japan',
  '+82': 'South Korea',
  '+49': 'Germany',
  '+33': 'France',
  '+39': 'Italy',
  '+34': 'Spain',
  '+31': 'Netherlands',
  '+61': 'Australia',
  '+64': 'New Zealand',
  '+55': 'Brazil',
  '+52': 'Mexico',
  '+971': 'UAE',
  '+966': 'Saudi Arabia',
  '+90': 'Turkey',
  '+212': 'Morocco',
  '+20': 'Egypt',
  '+251': 'Ethiopia',
  '+263': 'Zimbabwe',
  '+260': 'Zambia',
  '+265': 'Malawi',
  '+258': 'Mozambique',
  '+267': 'Botswana',
  '+264': 'Namibia',
  '+230': 'Mauritius',
  '+243': 'DR Congo',
  '+229': 'Benin',
};

function sanitizeInput(input: string): string {
  return input.replace(/[<>&"']/g, (char) => {
    const escapeMap: Record<string, string> = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return escapeMap[char] || char;
  });
}

export function analyzePhone(phoneNumber: string): PhoneAnalysisResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;
  let countryInfo: string | undefined;
  
  const cleaned = phoneNumber.replace(/[\s\-\(\)\.]/g, '');
  
  if (cleaned.length < 7 || cleaned.length > 20) {
    return {
      isSuspicious: true,
      riskLevel: 'medium',
      warnings: ['Invalid phone number format'],
      recommendations: ['Please enter a valid phone number with country code']
    };
  }
  
  for (const [code, countryName] of Object.entries(COUNTRY_CODES).sort((a, b) => b[0].length - a[0].length)) {
    if (cleaned.startsWith(code)) {
      countryInfo = `${countryName} (${code})`;
      break;
    }
  }
  
  if (!countryInfo && cleaned.startsWith('+')) {
    countryInfo = 'Unknown country';
  }
  
  if (/(.)\1{5,}/.test(cleaned)) {
    warnings.push('Suspicious pattern: many repeated digits');
    riskScore += 25;
  }
  
  if (/^(123456|654321|111111|000000|999999)/.test(cleaned.replace(/^\+\d{1,3}/, ''))) {
    warnings.push('Suspicious pattern: sequential or repeated digits');
    riskScore += 20;
  }
  
  const premiumPrefixes = ['900', '976', '809', '284', '876'];
  for (const prefix of premiumPrefixes) {
    if (cleaned.includes(`+1${prefix}`) || cleaned.includes(`1${prefix}`)) {
      warnings.push(`Premium rate or high risk area code detected (${prefix}).`);
      riskScore += 40;
      break;
    }
  }
  
  if (warnings.length === 0) {
    recommendations.push('No obvious red flags detected, but always verify unknown callers');
    recommendations.push('Never share personal information, PINs, or passwords over the phone');
  } else {
    recommendations.push('Do not share any personal or financial information');
    recommendations.push('If claiming to be from a company, hang up and call the official number');
    if (riskScore >= 30) {
      recommendations.push('Report suspicious calls to your local cybercrime authority');
    }
  }
  
  let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  if (riskScore <= 0) riskLevel = 'safe';
  else if (riskScore <= 15) riskLevel = 'low';
  else if (riskScore <= 30) riskLevel = 'medium';
  else if (riskScore <= 50) riskLevel = 'high';
  else riskLevel = 'critical';
  
  return {
    isSuspicious: riskScore > 15,
    riskLevel,
    countryInfo,
    warnings,
    recommendations
  };
}
const TRUSTED_DOMAINS = ['google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com', 'facebook.com', 'instagram.com', 'twitter.com', 'whatsapp.com', 'safaricom.co.ke', 'mtn.com', 'airtel.com'];
const BRAND_TYPOS: Record<string, string[]> = {
  'paypal': ['paypa1', 'paypai', 'paypaI', 'pαypal', 'paypaI', 'paypall'],
  'amazon': ['amaz0n', 'amazom', 'arnazon', 'аmazon'],
  'google': ['g00gle', 'googIe', 'gooogle', 'goog1e'],
  'microsoft': ['micros0ft', 'rnicrosoft', 'micrоsoft'],
  'apple': ['app1e', 'appIe', 'аpple'],
  'safaricom': ['safaric0m', 'safarikom', 'safariсom'],
  'mpesa': ['m-pesa', 'mpеsa', 'm_pesa', 'mp3sa'],
  'facebook': ['faceb00k', 'facebok', 'facebook.corn'],
  'whatsapp': ['whatsаpp', 'whаtsapp', 'watsapp', 'whatsap'],
};

function analyzeURLInternal(url: string, expandedUrl?: string, redirectChain?: string[]): URLAnalysisResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  try {
    const urlToAnalyze = expandedUrl || url;
    const urlObj = new URL(urlToAnalyze.toLowerCase().startsWith('http') ? urlToAnalyze.toLowerCase() : `https://${urlToAnalyze.toLowerCase()}`);
    const domain = urlObj.hostname;
    const path = urlObj.pathname;

    if (SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld))) {
      warnings.push(`Suspicious domain extension detected (${domain.split('.').pop()})`);
      riskScore += 30;
    }

    for (const [brand, typos] of Object.entries(BRAND_TYPOS)) {
      if (typos.some(typo => domain.includes(typo))) {
        warnings.push(`Possible typosquatting detected: looks like "${brand}" but isn't`);
        riskScore += 50;
      }
    }

    if (TRUSTED_DOMAINS.some(trusted => domain === trusted || domain.endsWith(`.${trusted}`))) {
      riskScore -= 20;
    }

    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(domain)) {
      warnings.push('URL uses IP address instead of domain name, which is often used by scammers.');
      riskScore += 40;
    }

    if (urlToAnalyze.includes('@')) {
      warnings.push('URL contains @ symbol, which can be used to hide the real destination.');
      riskScore += 35;
    }

    if (domain.length > 50) {
      warnings.push('Unusually long domain name, which is often used to hide suspicious content.');
      riskScore += 15;
    }

    if ((domain.match(/-/g) || []).length > 3) {
      warnings.push('Multiple hyphens in domain, which is common in fake websites.');
      riskScore += 20;
    }

    const suspiciousKeywords = ['login', 'verify', 'account', 'secure', 'update', 'confirm', 'wallet', 'banking', 'password'];
    if (suspiciousKeywords.some(kw => path.toLowerCase().includes(kw))) {
      warnings.push('URL path contains sensitive keywords. Please verify you are on the official website.');
      riskScore += 15;
    }

    if (urlObj.protocol !== 'https:') {
      warnings.push('Website does not use HTTPS, so your data may not be secure.');
      riskScore += 25;
    }

    if (warnings.length === 0) {
      recommendations.push('No obvious red flags detected, but always verify you\'re on the official website');
    } else {
      recommendations.push('Do not enter any personal information or passwords on this website');
      recommendations.push('If you received this link unexpectedly, do not click it');
      if (riskScore >= 50) {
        recommendations.push('Contact the company directly through their official website or phone number');
      }
    }

    let riskLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
    if (riskScore <= 0) riskLevel = 'safe';
    else if (riskScore <= 20) riskLevel = 'low';
    else if (riskScore <= 40) riskLevel = 'medium';
    else if (riskScore <= 60) riskLevel = 'high';
    else riskLevel = 'critical';

    return {
      isSuspicious: riskScore > 20,
      riskLevel,
      warnings,
      recommendations,
      expandedUrl: expandedUrl !== url ? expandedUrl : undefined,
      redirectChain: redirectChain && redirectChain.length > 1 ? redirectChain : undefined
    };
  } catch (error) {
    return {
      isSuspicious: true,
      riskLevel: 'high',
      warnings: ['Invalid URL format. This could be a malicious link.'],
      recommendations: ['Do not attempt to visit this URL']
    };
  }
}

export async function analyzeURL(url: string): Promise<URLAnalysisResult> {
  try {
    const normalizedUrl = url.toLowerCase().startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(normalizedUrl);
    const domain = urlObj.hostname;
    
    const isShortened = URL_SHORTENERS.some(s => domain.includes(s));
    let result: URLAnalysisResult;
    let urlToCheck = normalizedUrl;
    
    if (isShortened) {
      try {
        const { finalUrl, redirectChain } = await expandUrl(url);
        result = analyzeURLInternal(url, finalUrl, redirectChain);
        urlToCheck = finalUrl;
        if (redirectChain.length > 1) {
          result.warnings.unshift(`Shortened URL expanded: reveals ${new URL(finalUrl).hostname}`);
        }
      } catch (error) {
        result = analyzeURLInternal(url);
        result.warnings.push('Could not expand shortened URL. The destination remains hidden.');
        result.recommendations.unshift('Be extra cautious. We could not verify where this link leads.');
      }
    } else {
      result = analyzeURLInternal(url);
    }
    
    // Run external API checks in parallel
    const [safeBrowsingResult, phishTankResult, urlhausResult] = await Promise.all([
      checkGoogleSafeBrowsing(urlToCheck),
      checkPhishTank(urlToCheck),
      checkURLhaus(urlToCheck)
    ]);
    
    // Integrate Google Safe Browsing results
    if (safeBrowsingResult.isMalicious) {
      result.isSuspicious = true;
      result.riskLevel = 'critical';
      const threatTypes = safeBrowsingResult.threats.map(t => 
        t.replace(/_/g, ' ').toLowerCase()
      ).join(', ');
      result.warnings.unshift(`Google Safe Browsing flagged this URL for: ${threatTypes}`);
      result.recommendations.unshift('Do not visit this website. It has been reported to Google as dangerous.');
    }
    
    // Integrate PhishTank results
    if (phishTankResult.isPhishing && phishTankResult.verified) {
      result.isSuspicious = true;
      result.riskLevel = 'critical';
      result.warnings.unshift(`PhishTank confirmed phishing site (ID: ${phishTankResult.phishId})`);
      result.recommendations.unshift('This is a verified phishing website. Do not enter any information.');
    } else if (phishTankResult.inDatabase && !phishTankResult.verified) {
      if (result.riskLevel !== 'critical') {
        result.riskLevel = 'high';
      }
      result.warnings.unshift('This URL is in the PhishTank database (pending verification)');
    }
    
    // Integrate URLhaus results (abuse.ch malware database)
    if (urlhausResult.isMalware) {
      result.isSuspicious = true;
      result.riskLevel = 'critical';
      const threatInfo = urlhausResult.threatType ? ` (${urlhausResult.threatType})` : '';
      const tagInfo = urlhausResult.tags.length > 0 ? `: ${urlhausResult.tags.join(', ')}` : '';
      result.warnings.unshift(`URLhaus malware database alert${threatInfo}${tagInfo}`);
      result.recommendations.unshift('This URL is known to distribute malware. Do not visit or download anything from this site.');
    }
    
    return result;
  } catch (error) {
    return {
      isSuspicious: true,
      riskLevel: 'high',
      warnings: ['Invalid URL format. This could be a malicious link.'],
      recommendations: ['Do not attempt to visit this URL']
    };
  }
}

export async function analyzeScamDescription(description: string, scamType?: string): Promise<ScamAnalysisResult> {
  const scamTypeContext = scamType ? `The user suspects this might be a ${scamType} scam.` : '';
  
  const systemPrompt = `You are a senior cybersecurity analyst with 15+ years of experience in fraud investigation. Your expertise includes:
- African mobile money fraud: M-Pesa (Kenya, Tanzania, DRC), MTN Mobile Money (Ghana, Nigeria, Uganda, Cameroon), Airtel Money, Orange Money (Senegal, Mali, Ivory Coast, Cameroon), Vodacom M-Pesa (Tanzania, Mozambique), Tigo/Millicom (Ghana, Tanzania, Rwanda), EcoCash (Zimbabwe), Wave (Senegal, Ivory Coast), Chipper Cash (Pan-African)
- Asian digital payments fraud: GCash (Philippines), GoPay (Indonesia), Touch n Go (Malaysia), bKash (Bangladesh), JazzCash/Easypaisa (Pakistan), Paytm/PhonePe/Google Pay (India)
- Latin American payment fraud: Mercado Pago, Nequi (Colombia), Yape (Peru), Pix (Brazil)
- Global platforms: WhatsApp scams, SIM swap attacks, phishing, romance scams, cryptocurrency fraud, and investment fraud.

CORE OPERATING PRINCIPLE:
You may think creatively and identify non-obvious scam indicators, but you may ONLY assert conclusions that are defensible, conservative, and grounded in evidence or clearly labeled reasoning.

EVIDENCE HIERARCHY (Use Highest Available):
1. Government, law enforcement, or regulatory advisories (FBI IC3, CISA, INTERPOL, FTC)
2. Established cybersecurity research or incident reporting
3. Consistent patterns observed across real scam cases
4. Conservative inference based on known attacker behavior (must be labeled as inference)

CRITICAL RULES - WHAT YOU MUST DO:
1. ONLY base your analysis on information explicitly stated in the user's description
2. Quote specific phrases from their description when identifying red flags
3. Distinguish between "confirmed red flag" vs "would need more info to assess"
4. If information is incomplete, explicitly state what is unknown and lower confidence
5. Use neutral, precise, non-alarmist language

HALLUCINATION GUARDRAILS - WHAT YOU MUST NOT DO:
1. DO NOT invent threats, tools, or attack methods not described
2. DO NOT attribute intent, identity, or geography without evidence
3. DO NOT inflate edge cases into likely outcomes
4. DO NOT use fear-based, sensational, or absolute language
5. DO NOT claim certainty when evidence is insufficient

EVIDENCE-BASED ANALYSIS PROCESS:
Step 1: Extract exactly what happened (who contacted them, what was said, what was requested)
Step 2: Identify specific red flags present in their description
Step 3: Compare against documented scam patterns from FBI IC3, CISA, and INTERPOL reports
Step 4: Assess confidence based on how much evidence is available
Step 5: Internal validation: "Could this statement withstand review by a cybersecurity professional?"

DOCUMENTED SCAM PATTERNS (from law enforcement reports):
- Advance fee fraud: "Pay small amount to receive larger sum"
- Authority impersonation: "Bank/government" contacts via unofficial channels (WhatsApp, SMS)
- Urgency manipulation: "Act now or lose money/face arrest"
- Credential harvesting: Requests for PINs, OTPs, passwords
- Too-good-to-be-true: Unexpected winnings, inheritances, job offers
- Romance scams: Online relationship + eventual money requests
- SIM swap prep: Requests for personal details (DOB, mother's maiden name, ID numbers)
- Investment scams: Guaranteed high returns, pressure to invest quickly
- Fake job offers: Upfront fees, work-from-home promises, check cashing

CONFIDENCE CALIBRATION:
- 80-100%: Multiple clear red flags explicitly described by user
- 60-79%: Some red flags present but missing context
- 40-59%: Limited information, pattern partially matches
- 20-39%: Very little information, uncertain
- 0-19%: Insufficient evidence to assess

OUTPUT FORMAT:
Be clear and informative without being verbose. No disclaimers or hedging. Get to the point while giving enough context to be helpful.

Respond in JSON format:
{
  "verdict": "safe" | "suspicious" | "likely_scam" | "scam",
  "confidence": 0-100,
  "explanation": "Two to three sentences. State what this is, why it matches known scam patterns, and the key risk.",
  "redFlags": ["Specific warning signs with brief context"],
  "recommendations": ["Clear, actionable steps with brief reasoning"],
  "scamType": "Scam category or 'Unknown'",
  "sources": [{"name": "Agency name", "url": "Official URL", "relevance": "Brief note on relevance"}]
}

SOURCE CITATION RULES:
- Always include 1-3 relevant sources from trusted agencies
- Match sources to the scam type (e.g., FBI IC3 for US fraud, INTERPOL for cross-border scams, ENISA for EU threats)
- Use these official URLs:
  * FBI IC3: https://www.ic3.gov
  * FTC Consumer Alerts: https://consumer.ftc.gov/scams
  * CISA: https://www.cisa.gov/topics/cybersecurity-best-practices
  * INTERPOL Cybercrime: https://www.interpol.int/Crimes/Cybercrime
  * ENISA: https://www.enisa.europa.eu
  * Action Fraud UK: https://www.actionfraud.police.uk
  * Scamwatch AU: https://www.scamwatch.gov.au
  * ACSC: https://www.cyber.gov.au

FAILURE MODE: If too vague, set verdict to "suspicious", confidence to 25, and ask what specific detail would help.

WRITING STYLE (MANDATORY):
- No dashes. Use periods, commas, or semicolons.
- Complete sentences. Plain English. Brief.`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `${scamTypeContext}\n\nHere's what happened:\n${description}`
        }
      ],
      system: systemPrompt
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      verdict: 'suspicious',
      confidence: 50,
      explanation: 'Unable to fully analyze. Please be cautious.',
      redFlags: [],
      recommendations: ['Be careful and don\'t share personal information', 'Verify through official channels']
    };
  } catch (error) {
    log.error('Scam analysis error', { error: String(error) });
    return {
      verdict: 'suspicious',
      confidence: 0,
      explanation: 'Analysis service temporarily unavailable.',
      redFlags: [],
      recommendations: ['When in doubt, don\'t share personal information', 'Contact official support channels directly']
    };
  }
}

export async function analyzeImage(imageBuffer: Buffer): Promise<ImageAnalysisResult> {
  try {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: () => {}
    });

    const extractedText = text.trim();
    
    if (!extractedText || extractedText.length < 10) {
      return {
        extractedText: extractedText || '',
        scamAnalysis: {
          verdict: 'suspicious',
          confidence: 20,
          explanation: 'Could not extract enough text from this image. Try uploading a clearer screenshot.',
          redFlags: [],
          recommendations: ['Upload a clearer image with visible text', 'Try describing the situation in the Describe tab instead']
        },
        containsLinks: [],
        containsPhones: []
      };
    }

    const urlPattern = /https?:\/\/[^\s<>"{}|\\^`[\]]+|www\.[^\s<>"{}|\\^`[\]]+/gi;
    const phonePattern = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{2,6}/g;
    
    const containsLinks = (extractedText.match(urlPattern) || []).map(url => 
      url.startsWith('www.') ? 'https://' + url : url
    );
    const containsPhones = extractedText.match(phonePattern) || [];

    const scamAnalysis = await analyzeScamDescription(
      `Text extracted from a screenshot the user submitted:\n\n"${extractedText}"`,
      'screenshot_analysis'
    );

    return {
      extractedText,
      scamAnalysis,
      containsLinks,
      containsPhones: containsPhones.filter(p => p.replace(/\D/g, '').length >= 7)
    };
  } catch (error) {
    log.error('Image analysis error', { error: String(error) });
    return {
      extractedText: '',
      scamAnalysis: {
        verdict: 'suspicious',
        confidence: 0,
        explanation: 'Failed to analyze image. Please try again or describe the situation manually.',
        redFlags: [],
        recommendations: ['Try uploading a different image', 'Describe the situation in the Describe tab']
      },
      containsLinks: [],
      containsPhones: []
    };
  }
}
