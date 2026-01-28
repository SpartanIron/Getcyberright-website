import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Info, 
  ExternalLink,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  Shield,
  Eye,
  Zap
} from "lucide-react";

type ThreatCategory = {
  name: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  examples: string[];
};

type DetectedThreat = {
  category: string;
  indicator: string;
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
};

type UrgencyAnalysis = {
  score: number;
  level: string;
  triggers: string[];
};

type AnalysisResult = {
  overallRisk: "safe" | "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  title: string;
  summary: string;
  threats: DetectedThreat[];
  urls: URLAnalysis[];
  recommendations: string[];
  educationalTips: string[];
  urgencyAnalysis?: UrgencyAnalysis;
};

type URLAnalysis = {
  url: string;
  isSuspicious: boolean;
  reasons: string[];
};

const threatPatterns: { pattern: RegExp; category: string; indicator: string; severity: "low" | "medium" | "high" | "critical"; explanation: string }[] = [
  // Urgency & Pressure Tactics
  { pattern: /\b(urgent|immediately|right now|act fast|don't wait|hurry|expires? today|limited time|only \d+ left)\b/i, category: "Pressure Tactics", indicator: "Urgency language detected", severity: "medium", explanation: "Scammers create artificial urgency to prevent you from thinking critically. Legitimate organizations give you time to make decisions." },
  { pattern: /\b(final warning|last chance|account will be (closed|suspended|terminated)|action required immediately)\b/i, category: "Pressure Tactics", indicator: "Threatening deadline", severity: "high", explanation: "Fear-based deadlines are a classic manipulation technique. Real companies don't threaten immediate account closure via unsolicited messages." },
  
  // Prize & Lottery Scams
  { pattern: /\b(you('ve| have)? won|winner|lottery|sweepstakes|prize|reward|jackpot|million(s)? dollars?|grand prize)\b/i, category: "Lottery/Prize Scam", indicator: "Prize or lottery claim", severity: "high", explanation: "You cannot win a lottery you didn't enter. Legitimate lotteries never contact winners via email or text asking for fees." },
  { pattern: /\b(claim (your|the) (prize|reward|winnings)|collect your|redeem (your )?prize)\b/i, category: "Lottery/Prize Scam", indicator: "Prize claim language", severity: "high", explanation: "Requests to 'claim' prizes are almost always scams. Real winnings are processed directly, not through email links." },
  
  // Credential Phishing
  { pattern: /\b(verify (your )?(account|identity|email|payment)|confirm (your )?(account|identity|password|payment))\b/i, category: "Credential Phishing", indicator: "Verification request", severity: "critical", explanation: "Legitimate companies never ask you to verify credentials via email links. Always go directly to the official website." },
  { pattern: /\b(password|ssn|social security|bank account|credit card|routing number|pin code)\b/i, category: "Credential Phishing", indicator: "Sensitive data request", severity: "critical", explanation: "No legitimate organization asks for passwords or SSN via email. This is a direct attempt to steal your identity." },
  { pattern: /\b(update (your )?(billing|payment|card)|payment (method )?failed|card (on file )?(expired|declined))\b/i, category: "Credential Phishing", indicator: "Payment update request", severity: "high", explanation: "Payment update requests via email are a common phishing tactic. Log into your account directly to check payment status." },
  
  // Financial Fraud
  { pattern: /\b(wire transfer|western union|moneygram|gift card|itunes card|google play card|bitcoin|crypto(currency)?|zelle|venmo|cashapp)\b/i, category: "Financial Fraud", indicator: "Unusual payment method", severity: "critical", explanation: "Requests for gift cards, wire transfers, or crypto are major red flags. These payment methods are untraceable and preferred by scammers." },
  { pattern: /\b(investment opportunity|guaranteed returns?|double your money|risk[- ]?free|passive income|financial freedom)\b/i, category: "Investment Scam", indicator: "Investment scheme language", severity: "high", explanation: "Guaranteed returns and risk-free investments don't exist. These are hallmarks of Ponzi schemes and investment fraud." },
  { pattern: /\b(make money (fast|quick|from home)|work from home|easy money|earn \$?\d+k?\+? (per|a) (week|month|day))\b/i, category: "Employment Scam", indicator: "Get-rich-quick promises", severity: "medium", explanation: "Unrealistic income promises are used to lure victims. Legitimate jobs have clear descriptions and realistic compensation." },
  
  // Impersonation Scams
  { pattern: /\b(irs|internal revenue|tax refund|government grant|social security (administration)?|medicare|medicaid)\b/i, category: "Government Impersonation", indicator: "Government agency mention", severity: "high", explanation: "Government agencies don't initiate contact via email/text for sensitive matters. They use official mail." },
  { pattern: /\b(microsoft|apple|amazon|google|paypal|netflix|facebook|instagram|tiktok).{0,20}(support|security|team|department|help|service)/i, category: "Tech Support Scam", indicator: "Company impersonation", severity: "high", explanation: "Tech companies don't proactively contact users about problems. Always contact support through official channels." },
  { pattern: /\b(ceo|cfo|president|director).{0,30}(urgent|wire|transfer|payment|invoice)/i, category: "Business Email Compromise", indicator: "Executive impersonation", severity: "critical", explanation: "CEO fraud is extremely common. Always verify unusual requests from executives through a separate communication channel." },
  
  // Romance & Relationship Scams
  { pattern: /\b(i love you|my (dear|love|darling)|soul ?mate|meant to be|fallen in love|true love)\b/i, category: "Romance Scam", indicator: "Romantic language from stranger", severity: "medium", explanation: "Romance scammers build emotional connections quickly to extract money. Be wary of people professing love before meeting in person." },
  { pattern: /\b(military|deployed|oil rig|overseas|stuck in|need money to (come home|visit|travel))\b/i, category: "Romance Scam", indicator: "Classic romance scam story", severity: "high", explanation: "These are textbook romance scam scenarios. Military and overseas workers are commonly impersonated." },
  
  // Malicious Links
  { pattern: /\b(click (here|this|below)|follow (this )?link|open (this )?attachment|download (this )?file)\b/i, category: "Malicious Link", indicator: "Click-bait language", severity: "medium", explanation: "Urgent requests to click links are suspicious. Hover over links to see the real destination before clicking." },
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|adf\.ly|shorturl/i, category: "Malicious Link", indicator: "URL shortener detected", severity: "medium", explanation: "URL shorteners hide the true destination. Legitimate businesses use their own domains in official communications." },
  
  // Advance Fee Fraud
  { pattern: /\b(processing fee|handling fee|shipping fee|insurance fee|customs fee|release fee|tax fee)\b/i, category: "Advance Fee Fraud", indicator: "Upfront fee request", severity: "high", explanation: "Requests for fees to release prizes, inheritances, or packages are classic advance-fee fraud. You should never pay to receive money." },
  { pattern: /\b(nigerian|prince|inheritance|barrister|next of kin|beneficiary|estate|deceased)\b/i, category: "Advance Fee Fraud", indicator: "419 scam indicators", severity: "critical", explanation: "This is a classic advance-fee (419) scam pattern. No legitimate inheritance comes through unsolicited emails." },
  
  // Account Security Threats
  { pattern: /\b(account (has been |is )?(hacked|compromised|breached|suspended|locked|frozen))\b/i, category: "Account Compromise Scam", indicator: "Account threat claim", severity: "high", explanation: "Claims that your account is compromised are often lies to steal your credentials. Check directly with the company." },
  { pattern: /\b(unusual (activity|login|sign[- ]?in)|unrecognized device|security alert)\b/i, category: "Account Compromise Scam", indicator: "Security alert language", severity: "medium", explanation: "While sometimes legitimate, these alerts are often spoofed. Always navigate directly to the service to verify." },
];

const suspiciousUrlPatterns = [
  { pattern: /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, reason: "IP address instead of domain name" },
  { pattern: /@/, reason: "@ symbol in URL (credential injection)" },
  { pattern: /paypal|amazon|apple|google|microsoft|facebook|netflix|bank/i, reason: "Mentions major brand but may be fake" },
  { pattern: /\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|website|buzz|work|link|click|info|biz|pw|cc|ws)$/i, reason: "Free or suspicious TLD" },
  { pattern: /-login|-verify|-secure|-account|-update|-confirm/i, reason: "Suspicious subdomain/path pattern" },
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|adf\.ly|shorturl|v\.gd|rb\.gy|cutt\.ly|trib\.al/i, reason: "URL shortener hiding destination" },
  { pattern: /\.(exe|zip|rar|scr|bat|cmd|msi|jar|vbs|js)$/i, reason: "Potentially malicious file download" },
];

const legitDomains = [
  /^(https?:\/\/)?(www\.)?(google|microsoft|apple|amazon|facebook|twitter|linkedin|instagram|youtube|netflix|paypal|github|dropbox|zoom|slack)\.com/i,
  /^(https?:\/\/)?(www\.)?[a-z0-9-]+\.(gov|edu|mil)/i,
];

// Typosquatting detection - common brand misspellings
const typosquattingPatterns: { brand: string; variants: RegExp[] }[] = [
  { brand: "PayPal", variants: [/paypa[l1]|paypai|paypol|payp[a@]l|p[a@]ypal|paaypal/i] },
  { brand: "Amazon", variants: [/amaz[o0]n|amazom|arnazon|amzon|amazn|amaazon|amazoon/i] },
  { brand: "Apple", variants: [/app[l1]e|appie|aple|applle|aaple/i] },
  { brand: "Google", variants: [/g[o0][o0]gle|googel|gogle|googlle|g00gle/i] },
  { brand: "Microsoft", variants: [/micr[o0]s[o0]ft|mircosoft|microsft|micosoft|micros0ft/i] },
  { brand: "Netflix", variants: [/netf[l1]ix|netfiix|netfix|nettflix|netfl1x/i] },
  { brand: "Facebook", variants: [/faceb[o0][o0]k|facebok|facbook|faceboook|fac3book/i] },
  { brand: "Instagram", variants: [/[i1]nstagram|instagran|instgram|instagrem|1nstagram/i] },
  { brand: "Bank of America", variants: [/bankofamer[i1]ca|bank0famerica|bankofamerica\d/i] },
  { brand: "Chase", variants: [/chas[e3]bank|chase\d|chasecom/i] },
  { brand: "Wells Fargo", variants: [/we[l1][l1]sfargo|wellsfarg0|weilsfargo/i] },
  { brand: "Walmart", variants: [/wa[l1]mart|walmrt|walmaart|walmart\d/i] },
];

// Homograph attack detection - lookalike Unicode characters
const homoglyphMap: Record<string, string[]> = {
  'a': ['\u0430', '\u00e0', '\u00e1', '\u0101', '\u0103'], // Cyrillic а, accented variants
  'e': ['\u0435', '\u00e8', '\u00e9', '\u0113', '\u0117'], // Cyrillic е
  'o': ['\u043e', '\u00f2', '\u00f3', '\u014d', '\u014f', '\u0030'], // Cyrillic о, 0
  'i': ['\u0456', '\u00ec', '\u00ed', '\u0131', '\u0031', '\u006c'], // Cyrillic і, 1, l
  'c': ['\u0441', '\u00e7'], // Cyrillic с
  's': ['\u0455'], // Cyrillic ѕ
  'p': ['\u0440'], // Cyrillic р
  'x': ['\u0445'], // Cyrillic х
  'y': ['\u0443'], // Cyrillic у
  'l': ['\u006c', '\u0031', '\u007c'], // 1, |
  'n': ['\u0578'], // Armenian ո
};

function detectHomoglyphs(text: string): { found: boolean; examples: string[] } {
  const examples: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const [latin, homoglyphs] of Object.entries(homoglyphMap)) {
    for (const homoglyph of homoglyphs) {
      if (text.includes(homoglyph)) {
        examples.push(`"${homoglyph}" looks like "${latin}"`);
      }
    }
  }
  
  // Check for mixed scripts (Cyrillic + Latin in same word)
  const cyrillicPattern = /[\u0400-\u04FF]/;
  const latinPattern = /[a-zA-Z]/;
  const words = text.split(/\s+/);
  
  for (const word of words) {
    if (cyrillicPattern.test(word) && latinPattern.test(word) && word.length > 3) {
      examples.push(`Mixed scripts in "${word}"`);
    }
  }
  
  return { found: examples.length > 0, examples: examples.slice(0, 3) };
}

function detectTyposquatting(url: string): { brand: string; found: boolean } | null {
  const domain = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].toLowerCase();
  
  for (const { brand, variants } of typosquattingPatterns) {
    for (const variant of variants) {
      if (variant.test(domain) && !domain.includes(brand.toLowerCase().replace(/\s/g, ''))) {
        return { brand, found: true };
      }
    }
  }
  return null;
}

// Cryptocurrency address patterns
const cryptoPatterns = [
  { name: "Bitcoin", pattern: /\b[13][a-km-zA-HJ-NP-Z1-9]{25,34}\b/, severity: "high" as const },
  { name: "Bitcoin (Bech32)", pattern: /\bbc1[a-z0-9]{39,59}\b/, severity: "high" as const },
  { name: "Ethereum", pattern: /\b0x[a-fA-F0-9]{40}\b/, severity: "high" as const },
  { name: "Monero", pattern: /\b4[0-9AB][1-9A-HJ-NP-Za-km-z]{93}\b/, severity: "high" as const },
];

function detectCryptoAddresses(text: string): { type: string; address: string }[] {
  const found: { type: string; address: string }[] = [];
  
  for (const { name, pattern } of cryptoPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        found.push({ type: name, address: match.slice(0, 20) + '...' });
      }
    }
  }
  
  return found;
}

// Phone number extraction
const phonePatterns = [
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // US format
  /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g, // (123) 456-7890
  /\b\+1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // +1 format
  /\b1[-.\s]?800[-.\s]?\d{3}[-.\s]?\d{4}\b/gi, // Toll-free
  /\b1[-.\s]?888[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
  /\b1[-.\s]?877[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
  /\b1[-.\s]?866[-.\s]?\d{3}[-.\s]?\d{4}\b/gi,
];

function extractPhoneNumbers(text: string): string[] {
  const phones: Set<string> = new Set();
  
  for (const pattern of phonePatterns) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(m => phones.add(m.replace(/\s+/g, '')));
    }
  }
  
  return Array.from(phones);
}

// Grammar and spelling red flags common in scam messages
const grammarRedFlags = [
  { pattern: /\bdear\s+(customer|user|member|valued|sir\/madam|friend)\b/i, issue: "Generic greeting often used in mass phishing" },
  { pattern: /\b(kindly|please to|do the needful|revert back)\b/i, issue: "Unusual phrasing common in scam emails" },
  { pattern: /\b(your account have been|your account has been compromise|you has won|you has been selected)\b/i, issue: "Grammar errors suggesting non-native scammer" },
  { pattern: /\b(click bellow|click belllow|clik here|clck here)\b/i, issue: "Misspelled call-to-action" },
  { pattern: /!!!+|\?\?\?+|\.\.\.\.+/g, issue: "Excessive punctuation" },
  { pattern: /[A-Z]{5,}/g, issue: "Excessive capitalization" },
  { pattern: /\$\s*\d{1,3}(,\d{3})*(\.\d{2})?\s*(million|billion|thousand)/i, issue: "Large money amount mentioned" },
];

function extractUrls(content: string): string[] {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+/gi;
  return content.match(urlPattern) || [];
}

// Calculate Shannon entropy for randomness detection
function calculateEntropy(text: string): number {
  if (!text || text.length === 0) return 0;
  
  const freq: Record<string, number> = {};
  for (const char of text.toLowerCase()) {
    freq[char] = (freq[char] || 0) + 1;
  }
  
  let entropy = 0;
  const len = text.length;
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }
  
  return entropy;
}

// Analyze URL entropy - high entropy indicates random/malicious URLs
function analyzeUrlEntropy(url: string): { isHigh: boolean; entropy: number; reason: string } {
  // Extract the path and query parts for entropy analysis
  const urlParts = url.replace(/^https?:\/\//, '').split('/');
  const pathAndQuery = urlParts.slice(1).join('/');
  
  if (!pathAndQuery || pathAndQuery.length < 10) {
    return { isHigh: false, entropy: 0, reason: "" };
  }
  
  const entropy = calculateEntropy(pathAndQuery);
  
  // High entropy (> 4.5) suggests random strings often used in malicious URLs
  if (entropy > 4.5 && pathAndQuery.length > 20) {
    return { 
      isHigh: true, 
      entropy, 
      reason: `High URL randomness detected (entropy: ${entropy.toFixed(2)}) - often indicates malicious links` 
    };
  }
  
  return { isHigh: false, entropy, reason: "" };
}

// Detect excessive subdomain depth
function analyzeSubdomainDepth(url: string): { isDeep: boolean; depth: number; reason: string } {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  const subdomains = domain.split('.');
  
  // Remove TLD and main domain, count subdomains
  const depth = Math.max(0, subdomains.length - 2);
  
  if (depth >= 3) {
    return {
      isDeep: true,
      depth,
      reason: `Excessive subdomain depth (${depth} levels) - often used to hide malicious domains`
    };
  }
  
  return { isDeep: false, depth, reason: "" };
}

// Detect Base64 encoded content in URLs
function detectBase64Payload(url: string): { found: boolean; reason: string } {
  // Look for Base64-like patterns in URL (long strings of alphanumeric + /+=)
  const base64Pattern = /[A-Za-z0-9+/=]{40,}/;
  const match = url.match(base64Pattern);
  
  if (match && match[0].length >= 40) {
    // Verify it looks like valid Base64
    const candidate = match[0];
    if (candidate.length % 4 === 0 || candidate.endsWith('=')) {
      return {
        found: true,
        reason: "Possible encoded/obfuscated payload detected in URL"
      };
    }
  }
  
  return { found: false, reason: "" };
}

// Detect Punycode (internationalized domain) spoofing
function detectPunycode(url: string): { found: boolean; domain: string; reason: string } {
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  
  // Punycode domains start with "xn--"
  if (domain.includes('xn--')) {
    return {
      found: true,
      domain,
      reason: "Internationalized domain (Punycode) detected - may be impersonating a legitimate site"
    };
  }
  
  return { found: false, domain: "", reason: "" };
}

// Levenshtein distance for brand similarity
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Known brands for similarity checking
const knownBrands = [
  "paypal", "amazon", "apple", "google", "microsoft", "facebook", 
  "instagram", "netflix", "twitter", "linkedin", "youtube", "ebay",
  "walmart", "target", "costco", "chase", "wellsfargo", "bankofamerica",
  "citibank", "usbank", "capitalone", "americanexpress", "discover",
  "venmo", "cashapp", "zelle", "coinbase", "binance", "robinhood"
];

// Check for brand similarity (catch subtle misspellings)
function detectBrandSimilarity(domain: string): { found: boolean; brand: string; distance: number; reason: string } {
  // Clean domain - remove TLD and subdomains
  const cleanDomain = domain.replace(/^https?:\/\//, '').split('/')[0];
  const domainParts = cleanDomain.split('.');
  const mainDomain = domainParts.length >= 2 ? domainParts[domainParts.length - 2] : domainParts[0];
  
  for (const brand of knownBrands) {
    // Skip exact matches (those are legit)
    if (mainDomain === brand) continue;
    
    const distance = levenshteinDistance(mainDomain.toLowerCase(), brand);
    const similarity = 1 - (distance / Math.max(mainDomain.length, brand.length));
    
    // If 80%+ similar but not exact, it's suspicious
    if (similarity >= 0.75 && similarity < 1 && distance <= 3) {
      return {
        found: true,
        brand,
        distance,
        reason: `Domain "${mainDomain}" is suspiciously similar to "${brand}" (${Math.round(similarity * 100)}% match)`
      };
    }
  }
  
  return { found: false, brand: "", distance: 0, reason: "" };
}

// Calculate urgency/pressure score
function calculateUrgencyScore(content: string): { score: number; level: string; triggers: string[] } {
  const triggers: string[] = [];
  let score = 0;
  
  const urgencyPatterns = [
    { pattern: /\b(urgent|urgently|emergency|immediately|right now|asap)\b/gi, weight: 3, label: "Urgent language" },
    { pattern: /\b(act (fast|now)|don't (wait|delay)|hurry|quick|fast)\b/gi, weight: 2, label: "Pressure to act quickly" },
    { pattern: /\b(expires?|expiring|deadline|final|last chance|limited time)\b/gi, weight: 2, label: "Time pressure" },
    { pattern: /\b(warning|alert|notice|attention|important)\b/gi, weight: 1, label: "Warning language" },
    { pattern: /\b(suspended|terminated|closed|frozen|locked|disabled)\b/gi, weight: 3, label: "Account threat" },
    { pattern: /\b(verify|confirm|validate|update).{0,20}(now|immediately|today)/gi, weight: 3, label: "Immediate action request" },
    { pattern: /\b(only \d+ (left|remaining|available)|while supplies last)\b/gi, weight: 2, label: "Scarcity tactics" },
    { pattern: /!!+|\?\?+/g, weight: 1, label: "Excessive punctuation" },
    { pattern: /[A-Z]{4,}/g, weight: 1, label: "Shouting (all caps)" },
    { pattern: /\b(risk|danger|threat|compromise|breach)\b/gi, weight: 2, label: "Fear language" },
  ];
  
  for (const { pattern, weight, label } of urgencyPatterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      score += weight * Math.min(matches.length, 3); // Cap at 3 matches per pattern
      if (!triggers.includes(label)) {
        triggers.push(label);
      }
    }
  }
  
  // Normalize score to 0-100
  const normalizedScore = Math.min(100, Math.round((score / 30) * 100));
  
  let level = "Low";
  if (normalizedScore >= 70) level = "Critical";
  else if (normalizedScore >= 50) level = "High";
  else if (normalizedScore >= 30) level = "Moderate";
  
  return { score: normalizedScore, level, triggers };
}

function analyzeUrl(url: string): URLAnalysis {
  const reasons: string[] = [];
  let isSuspicious = false;
  
  // Check if it's a known legitimate domain first
  let isLegit = false;
  for (const legit of legitDomains) {
    if (legit.test(url)) {
      isLegit = true;
      break;
    }
  }
  
  // Check for suspicious patterns
  for (const { pattern, reason } of suspiciousUrlPatterns) {
    if (pattern.test(url)) {
      reasons.push(reason);
      isSuspicious = true;
    }
  }
  
  // Check for typosquatting
  const typosquat = detectTyposquatting(url);
  if (typosquat) {
    reasons.push(`Possible ${typosquat.brand} typosquatting`);
    isSuspicious = true;
  }
  
  // Check for homograph attacks
  const homoglyphs = detectHomoglyphs(url);
  if (homoglyphs.found) {
    reasons.push(`Lookalike characters detected: ${homoglyphs.examples.join(', ')}`);
    isSuspicious = true;
  }
  
  // Check URL entropy (randomness)
  const entropyResult = analyzeUrlEntropy(url);
  if (entropyResult.isHigh) {
    reasons.push(entropyResult.reason);
    isSuspicious = true;
  }
  
  // Check subdomain depth
  const subdomainResult = analyzeSubdomainDepth(url);
  if (subdomainResult.isDeep) {
    reasons.push(subdomainResult.reason);
    isSuspicious = true;
  }
  
  // Check for Base64 encoded payloads
  const base64Result = detectBase64Payload(url);
  if (base64Result.found) {
    reasons.push(base64Result.reason);
    isSuspicious = true;
  }
  
  // Check for Punycode domains
  const punycodeResult = detectPunycode(url);
  if (punycodeResult.found) {
    reasons.push(punycodeResult.reason);
    isSuspicious = true;
  }
  
  // Check brand similarity (Levenshtein distance)
  const brandSimilarity = detectBrandSimilarity(url);
  if (brandSimilarity.found) {
    reasons.push(brandSimilarity.reason);
    isSuspicious = true;
  }
  
  // Override suspicious flag if it's a known legitimate domain
  if (isLegit && reasons.length === 0) {
    isSuspicious = false;
  }
  
  return { url, isSuspicious, reasons };
}

function analyzeContent(content: string): AnalysisResult {
  if (!content.trim()) {
    return {
      overallRisk: "safe",
      confidenceScore: 0,
      title: "",
      summary: "",
      threats: [],
      urls: [],
      recommendations: [],
      educationalTips: []
    };
  }

  const threats: DetectedThreat[] = [];
  const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
  
  for (const pattern of threatPatterns) {
    if (pattern.pattern.test(content)) {
      threats.push({
        category: pattern.category,
        indicator: pattern.indicator,
        severity: pattern.severity,
        explanation: pattern.explanation
      });
    }
  }
  
  const urls = extractUrls(content);
  const urlAnalyses = urls.map(analyzeUrl);
  const suspiciousUrls = urlAnalyses.filter(u => u.isSuspicious);
  
  if (suspiciousUrls.length > 0) {
    threats.push({
      category: "Suspicious URLs",
      indicator: `${suspiciousUrls.length} suspicious URL(s) detected`,
      severity: "high",
      explanation: "The message contains links that may lead to malicious websites. Never click links in suspicious messages."
    });
  }
  
  // Check for cryptocurrency addresses
  const cryptoAddresses = detectCryptoAddresses(content);
  if (cryptoAddresses.length > 0) {
    threats.push({
      category: "Cryptocurrency Request",
      indicator: `${cryptoAddresses.length} cryptocurrency address(es) found: ${cryptoAddresses.map(c => c.type).join(', ')}`,
      severity: "critical",
      explanation: "Cryptocurrency addresses in unsolicited messages are a major red flag. Legitimate businesses rarely request crypto payments, and these transactions cannot be reversed."
    });
  }
  
  // Check for phone numbers
  const phoneNumbers = extractPhoneNumbers(content);
  if (phoneNumbers.length > 0) {
    threats.push({
      category: "Phone Number Detected",
      indicator: `${phoneNumbers.length} phone number(s) found`,
      severity: "medium",
      explanation: "Phone numbers in suspicious messages may connect you to scam call centers. Never call numbers provided in unsolicited messages. Verify numbers through official websites."
    });
  }
  
  // Check for grammar red flags
  for (const { pattern, issue } of grammarRedFlags) {
    if (pattern.test(content)) {
      threats.push({
        category: "Writing Style Red Flag",
        indicator: issue,
        severity: "low",
        explanation: "This writing pattern is commonly seen in scam messages. Professional organizations typically use proper grammar and personalized greetings."
      });
      break; // Only add one grammar warning
    }
  }
  
  // Check for homograph attacks in the full content
  const contentHomoglyphs = detectHomoglyphs(content);
  if (contentHomoglyphs.found) {
    threats.push({
      category: "Homograph Attack",
      indicator: `Deceptive characters detected: ${contentHomoglyphs.examples.join(', ')}`,
      severity: "high",
      explanation: "This message contains characters designed to look like normal letters but are actually different. Scammers use this trick to create fake website addresses."
    });
  }
  
  // Calculate risk score
  let totalScore = threats.reduce((sum, t) => sum + severityScores[t.severity], 0);
  totalScore += suspiciousUrls.length * 2;
  totalScore += cryptoAddresses.length * 3;
  
  // Determine overall risk
  let overallRisk: AnalysisResult["overallRisk"];
  let confidenceScore: number;
  let title: string;
  let summary: string;
  
  if (totalScore === 0) {
    overallRisk = "safe";
    confidenceScore = 75;
    title = "No Obvious Threats Detected";
    summary = "We did not detect common scam patterns. This does not guarantee safety so always verify unexpected messages through official channels.";
  } else if (totalScore <= 2) {
    overallRisk = "low";
    confidenceScore = 60;
    title = "Low Risk with Minor Concerns";
    summary = "A few elements warrant attention, but this may be legitimate. Verify through official channels if unsure.";
  } else if (totalScore <= 5) {
    overallRisk = "medium";
    confidenceScore = 70;
    title = "Medium Risk. Proceed with Caution";
    summary = "This content contains multiple warning signs. We recommend verifying through official channels before taking any action.";
  } else if (totalScore <= 10) {
    overallRisk = "high";
    confidenceScore = 85;
    title = "High Risk. Likely a Scam";
    summary = "This content contains several major red flags commonly found in scams. Do not engage with this message.";
  } else {
    overallRisk = "critical";
    confidenceScore = 95;
    title = "Critical Risk. Almost Certainly a Scam";
    summary = "This content matches multiple known scam patterns. Delete immediately and do not respond, click links, or provide any information.";
  }
  
  // Generate recommendations based on threats
  const recommendations: string[] = [];
  const categories = new Set(threats.map(t => t.category));
  
  if (categories.has("Credential Phishing") || categories.has("Account Compromise Scam")) {
    recommendations.push("Never enter login credentials through email links. Navigate directly to the official website.");
  }
  if (categories.has("Financial Fraud") || categories.has("Advance Fee Fraud")) {
    recommendations.push("Never send money via wire transfer, gift cards, or cryptocurrency to someone you haven't met in person.");
  }
  if (categories.has("Tech Support Scam") || categories.has("Government Impersonation")) {
    recommendations.push("Contact the organization directly using the phone number on their official website, not numbers provided in the message.");
  }
  if (suspiciousUrls.length > 0) {
    recommendations.push("Do not click any links in this message. If you need to visit a website, type the address directly in your browser.");
  }
  if (recommendations.length === 0) {
    recommendations.push("When in doubt, verify through official channels before taking any action.");
  }
  recommendations.push("Report this to the FTC at reportfraud.ftc.gov if you believe it's a scam.");
  
  // Educational tips
  const educationalTips = [
    "Legitimate organizations never ask for passwords or SSN via email or text",
    "If an offer seems too good to be true, it almost certainly is",
    "Scammers create urgency to prevent you from thinking critically",
    "Always verify requests for money or information through a separate, trusted channel"
  ];

  // Calculate urgency/manipulation score
  const urgencyAnalysis = calculateUrgencyScore(content);
  
  // Add urgency as a threat if significant
  if (urgencyAnalysis.score >= 30) {
    threats.push({
      category: "Manipulation Tactics",
      indicator: `${urgencyAnalysis.level} pressure level detected (Score: ${urgencyAnalysis.score}/100)`,
      severity: urgencyAnalysis.score >= 70 ? "critical" : urgencyAnalysis.score >= 50 ? "high" : "medium",
      explanation: `This message uses ${urgencyAnalysis.triggers.slice(0, 3).join(', ').toLowerCase()} to pressure you into quick action. Take your time to verify independently.`
    });
  }

  return {
    overallRisk,
    confidenceScore,
    title,
    summary,
    threats,
    urls: urlAnalyses,
    recommendations,
    educationalTips,
    urgencyAnalysis
  };
}

export function ScamChecker() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [activeTab, setActiveTab] = useState("text");

  const handleCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setResult(analyzeContent(content));
      setIsChecking(false);
    }, 1200);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe": return "text-green-600 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
      case "low": return "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800";
      case "medium": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800";
      case "high": return "text-orange-600 bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
      default: return "";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "safe": return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case "low": return <Shield className="w-8 h-8 text-blue-500" />;
      case "medium": return <Eye className="w-8 h-8 text-yellow-500" />;
      case "high": return <AlertTriangle className="w-8 h-8 text-orange-500" />;
      case "critical": return <XCircle className="w-8 h-8 text-red-500" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low": return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300";
      case "high": return "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300";
      case "critical": return "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="w-full" data-testid="card-scam-checker">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Search className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Advanced Scam Analyzer</CardTitle>
            <p className="text-sm text-muted-foreground">AI-powered analysis of suspicious messages, emails, and links</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="text" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Message</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2">
              <LinkIcon className="w-4 h-4" />
              <span className="hidden sm:inline">URL</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="space-y-4">
            <Textarea
              placeholder="Paste the suspicious text message here...

Example: 'URGENT: Your bank account has been compromised! Click here immediately to secure your account: bit.ly/secure-now'"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] resize-none"
              aria-label="Enter suspicious text message to analyze"
              data-testid="input-scam-content"
            />
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <Textarea
              placeholder="Paste the full email content here, including subject line if possible...

Example:
Subject: Your Amazon order #12345 has been delayed
From: amazon-support@mail-amazonn.com

Dear Customer, Your recent order cannot be delivered. Please verify your payment information immediately..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] resize-none"
              aria-label="Enter suspicious email content to analyze"
              data-testid="input-scam-email"
            />
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <Textarea
              placeholder="Paste suspicious URLs or links here (one per line)...

Example:
https://amaz0n-secure.xyz/verify-account
http://192.168.1.1/login/paypal"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[140px] resize-none"
              aria-label="Enter suspicious URLs to analyze"
              data-testid="input-scam-url"
            />
          </TabsContent>
        </Tabs>

        <Button 
          className="w-full" 
          onClick={handleCheck}
          disabled={!content.trim() || isChecking}
          size="lg"
          aria-label={isChecking ? "Analyzing content for threats" : "Analyze content for threats"}
          aria-busy={isChecking}
          data-testid="button-check-scam"
        >
          {isChecking ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" role="status" aria-label="Analyzing" />
              Analyzing Content...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
              Analyze for Threats
            </>
          )}
        </Button>

        {result && result.overallRisk && (
          <div className="space-y-4" role="region" aria-label="Scam analysis results" aria-live="polite" data-testid="result-scam-check">
            <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.overallRisk)}`} role="alert">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getRiskIcon(result.overallRisk)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg">{result.title}</h3>
                    <Badge variant="secondary" className="font-mono">
                      {result.confidenceScore}% confidence
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{result.summary}</p>
                </div>
              </div>
            </div>

            {/* Urgency/Manipulation Score Meter */}
            {result.urgencyAnalysis && result.urgencyAnalysis.score > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    Pressure/Urgency Analysis
                  </h4>
                  <Badge className={
                    result.urgencyAnalysis.score >= 70 ? "bg-red-500 text-white" :
                    result.urgencyAnalysis.score >= 50 ? "bg-orange-500 text-white" :
                    result.urgencyAnalysis.score >= 30 ? "bg-yellow-500 text-black" :
                    "bg-blue-500 text-white"
                  }>
                    {result.urgencyAnalysis.level}
                  </Badge>
                </div>
                
                {/* Pressure Meter */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Manipulation Level</span>
                    <span className="font-medium">{result.urgencyAnalysis.score}/100</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        result.urgencyAnalysis.score >= 70 ? "bg-red-500" :
                        result.urgencyAnalysis.score >= 50 ? "bg-orange-500" :
                        result.urgencyAnalysis.score >= 30 ? "bg-yellow-500" :
                        "bg-blue-500"
                      }`}
                      style={{ width: `${result.urgencyAnalysis.score}%` }}
                    />
                  </div>
                </div>
                
                {result.urgencyAnalysis.triggers.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Detected manipulation tactics:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.urgencyAnalysis.triggers.map((trigger, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.threats.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Detected Threats ({result.threats.length})
                </h4>
                <div className="space-y-2">
                  {result.threats.map((threat, idx) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(threat.severity)}>
                          {threat.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium text-sm">{threat.category}</span>
                      </div>
                      <p className="text-sm font-medium mb-1">{threat.indicator}</p>
                      <p className="text-sm text-muted-foreground">{threat.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.urls.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-500" />
                  URL Analysis ({result.urls.length})
                </h4>
                <div className="space-y-2">
                  {result.urls.map((urlAnalysis, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${urlAnalysis.isSuspicious ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'}`}>
                      <div className="flex items-start gap-2">
                        {urlAnalysis.isSuspicious ? (
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-mono break-all">{urlAnalysis.url}</p>
                          {urlAnalysis.reasons.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {urlAnalysis.reasons.map((reason, ridx) => (
                                <Badge key={ridx} variant="secondary" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                What You Should Do
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              This tool uses advanced pattern matching to detect scam indicators. While highly accurate, 
              no automated tool is 100% reliable. When in doubt, don't engage and verify through official channels.
            </p>
            <div className="flex flex-wrap gap-3">
              <a 
                href="https://reportfraud.ftc.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Report to FTC <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.ic3.gov/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 hover:underline"
              >
                Report to FBI IC3 <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
