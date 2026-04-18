import { z } from "zod";

// ============================================================================
// SMS/SMISHING DETECTION
// ============================================================================

// Known legitimate short codes
const legitimateShortCodes = new Set([
  "72727", // SKYPE
  "89203", // Wells Fargo
  "22395", // Amazon
  "32665", // Facebook
  "40404", // Twitter
  "898211", // Apple
  "78156", // Venmo
  "729725", // PayPal
  "33669", // Netflix
  "22122", // Google
  "56278", // Chase
  "73304", // Bank of America
  "88407", // FedEx
  "28777", // UPS
  "69888", // T-Mobile
  "99999", // COVID-19 Info
]);

// High-risk short code patterns
const suspiciousShortCodePatterns = [
  /^[0-9]{4}$/, // Very short codes (often spoofed)
  /^1[0-9]{9}$/, // Long codes pretending to be short codes
];

// Smishing-specific patterns
const smishingPatterns: { pattern: RegExp; indicator: string; severity: "medium" | "high" | "critical" }[] = [
  { pattern: /\b(txt|text|sms|msg)\s*(us|back|here|now)\b/i, indicator: "SMS-specific call to action", severity: "medium" },
  { pattern: /\breply\s*(yes|y|1|stop|help)\b/i, indicator: "Reply trigger (potential premium SMS scam)", severity: "high" },
  { pattern: /\b(usps|ups|fedex|dhl).{0,20}(package|delivery|tracking)/i, indicator: "Delivery notification phishing", severity: "high" },
  { pattern: /\b(bank|account).{0,15}(locked|suspended|verify|unusual)/i, indicator: "Banking SMS phishing", severity: "critical" },
  { pattern: /\btoll.{0,10}(unpaid|due|fee|charge)/i, indicator: "Toll fee scam (common smishing)", severity: "critical" },
  { pattern: /\b(irs|tax).{0,15}(refund|owe|payment)/i, indicator: "IRS/Tax SMS scam", severity: "critical" },
  { pattern: /\bwin(ner)?!?\s*\$?\d+/i, indicator: "Prize SMS scam", severity: "high" },
  { pattern: /\b(click|tap|visit).{0,10}(link|here|below)/i, indicator: "Link click urgency in SMS", severity: "medium" },
];

export interface SmishingAnalysis {
  isSmishing: boolean;
  confidence: number;
  senderAnalysis: {
    type: "short_code" | "long_code" | "alphanumeric" | "unknown";
    isLegitimateShortCode: boolean;
    isSuspicious: boolean;
    riskIndicators: string[];
  };
  contentAnalysis: {
    patterns: { indicator: string; severity: string }[];
    urgencyScore: number;
    hasLink: boolean;
    linkCount: number;
  };
  recommendations: string[];
}

export function analyzeSmishing(content: string, sender?: string): SmishingAnalysis {
  const patterns: { indicator: string; severity: string }[] = [];
  const riskIndicators: string[] = [];
  let confidence = 0;
  
  // Analyze sender
  let senderType: "short_code" | "long_code" | "alphanumeric" | "unknown" = "unknown";
  let isLegitimateShortCode = false;
  let isSuspiciousSender = false;
  
  if (sender) {
    const cleanSender = sender.replace(/[\s\-\(\)]/g, "");
    
    if (/^[0-9]{4,6}$/.test(cleanSender)) {
      senderType = "short_code";
      isLegitimateShortCode = legitimateShortCodes.has(cleanSender);
      if (!isLegitimateShortCode) {
        riskIndicators.push("Unknown short code - verify before responding");
        confidence += 15;
      }
    } else if (/^[0-9]{10,}$/.test(cleanSender)) {
      senderType = "long_code";
      riskIndicators.push("Personal number instead of business short code");
      confidence += 10;
    } else if (/^[a-zA-Z]/i.test(cleanSender)) {
      senderType = "alphanumeric";
      // Alphanumeric sender IDs can be spoofed
      riskIndicators.push("Alphanumeric sender ID - these can be easily spoofed");
      confidence += 20;
    }
    
    // Check for suspicious patterns
    for (const pattern of suspiciousShortCodePatterns) {
      if (pattern.test(cleanSender)) {
        isSuspiciousSender = true;
        riskIndicators.push("Suspicious sender format");
        confidence += 25;
        break;
      }
    }
  }
  
  // Analyze content for smishing patterns
  for (const { pattern, indicator, severity } of smishingPatterns) {
    if (pattern.test(content)) {
      patterns.push({ indicator, severity });
      if (severity === "critical") confidence += 30;
      else if (severity === "high") confidence += 20;
      else confidence += 10;
    }
  }
  
  // Check for links
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+|[a-z0-9][-a-z0-9]*\.[a-z]{2,}\/[^\s]*/gi;
  const links = content.match(urlPattern) || [];
  const hasLink = links.length > 0;
  if (hasLink) {
    confidence += 15;
    riskIndicators.push("Contains link - verify destination before clicking");
  }
  
  // Calculate urgency score
  const urgencyWords = ["urgent", "immediately", "now", "today", "expires", "suspended", "locked", "verify"];
  const urgencyScore = urgencyWords.filter(w => content.toLowerCase().includes(w)).length;
  if (urgencyScore >= 2) confidence += 20;
  
  // Cap confidence at 100
  confidence = Math.min(confidence, 100);
  
  const isSmishing = confidence >= 40;
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (isSmishing || confidence >= 30) {
    recommendations.push("Do not click any links in this message");
    recommendations.push("Contact the company directly using their official website or phone number");
    if (hasLink) {
      recommendations.push("Report this message to 7726 (SPAM) to help block similar messages");
    }
    if (patterns.some(p => p.severity === "critical")) {
      recommendations.push("This appears to be a high-confidence scam - delete immediately");
    }
  }
  
  return {
    isSmishing,
    confidence,
    senderAnalysis: {
      type: senderType,
      isLegitimateShortCode,
      isSuspicious: isSuspiciousSender,
      riskIndicators
    },
    contentAnalysis: {
      patterns,
      urgencyScore,
      hasLink,
      linkCount: links.length
    },
    recommendations
  };
}

// ============================================================================
// AI-GENERATED CONTENT DETECTION
// ============================================================================

export interface AIContentAnalysis {
  isLikelyAI: boolean;
  confidence: number;
  indicators: {
    category: string;
    finding: string;
    weight: number;
  }[];
  perplexityEstimate: "low" | "medium" | "high";
  styleAnalysis: {
    sentenceVariation: number;
    vocabularyDiversity: number;
    repetitivePatterns: string[];
  };
  recommendations: string[];
}

// AI writing patterns (common in GPT-generated text)
const aiPatterns: { pattern: RegExp; category: string; finding: string; weight: number }[] = [
  // Hedging language common in AI
  { pattern: /\bIt's worth noting that\b/gi, category: "AI Hedge Phrase", finding: "Uses 'It's worth noting that' - common AI phrase", weight: 15 },
  { pattern: /\bIt's important to (note|remember|understand)\b/gi, category: "AI Hedge Phrase", finding: "Uses 'It's important to...' - AI safety language", weight: 12 },
  { pattern: /\bIn (today's|the modern|this) (world|age|era)\b/gi, category: "AI Filler", finding: "Generic time reference filler", weight: 10 },
  { pattern: /\bAs (an AI|a language model)\b/gi, category: "AI Self-Reference", finding: "Direct AI self-reference detected", weight: 50 },
  { pattern: /\bI (cannot|can't) (help|assist) with\b/gi, category: "AI Refusal", finding: "AI refusal pattern detected", weight: 40 },
  { pattern: /\bdelve into\b/gi, category: "AI Vocabulary", finding: "Uses 'delve into' - overused in AI text", weight: 8 },
  { pattern: /\bleverage\b/gi, category: "AI Vocabulary", finding: "Uses 'leverage' - common AI business speak", weight: 5 },
  { pattern: /\bfostering?\b/gi, category: "AI Vocabulary", finding: "Uses 'foster(ing)' - AI-preferred verb", weight: 5 },
  { pattern: /\bholistic(ally)?\b/gi, category: "AI Vocabulary", finding: "Uses 'holistic' - AI buzzword", weight: 5 },
  { pattern: /\bseamless(ly)?\b/gi, category: "AI Vocabulary", finding: "Uses 'seamless' - AI-preferred adjective", weight: 5 },
  { pattern: /\bHowever,\s/g, category: "AI Transition", finding: "Sentence starting with 'However,' (common AI structure)", weight: 3 },
  { pattern: /\bFurthermore,\s/g, category: "AI Transition", finding: "Sentence starting with 'Furthermore,' (formal AI style)", weight: 5 },
  { pattern: /\bIn conclusion,?\s/gi, category: "AI Structure", finding: "Uses 'In conclusion' - AI essay structure", weight: 8 },
  { pattern: /\bLet me (explain|break down|clarify)\b/gi, category: "AI Explanation", finding: "AI explanation pattern", weight: 10 },
  { pattern: /\bThere are several (key )?(factors|reasons|aspects)\b/gi, category: "AI List Introduction", finding: "AI list introduction pattern", weight: 8 },
  { pattern: /\bFirst(ly)?,.*Second(ly)?,.*Third(ly)?,/gi, category: "AI Enumeration", finding: "AI enumeration pattern", weight: 12 },
];

// Calculate vocabulary diversity (Type-Token Ratio)
function calculateTTR(text: string): number {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  if (words.length === 0) return 0;
  const uniqueWords = new Set(words);
  return uniqueWords.size / words.length;
}

// Calculate sentence length variation
function calculateSentenceVariation(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return 0;
  
  const lengths = sentences.map(s => s.trim().split(/\s+/).length);
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / lengths.length;
  return Math.sqrt(variance);
}

// Detect repetitive phrases
function findRepetitivePatterns(text: string): string[] {
  const phrases: Record<string, number> = {};
  const words = text.toLowerCase().split(/\s+/);
  
  // Find repeated 3-word phrases
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (phrase.length > 10) {
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  }
  
  return Object.entries(phrases)
    .filter(([_, count]) => count >= 2)
    .map(([phrase, count]) => `"${phrase}" (${count}x)`);
}

export function analyzeAIContent(content: string): AIContentAnalysis {
  const indicators: { category: string; finding: string; weight: number }[] = [];
  let totalWeight = 0;
  
  // Check for AI patterns
  for (const { pattern, category, finding, weight } of aiPatterns) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      indicators.push({ category, finding, weight: weight * matches.length });
      totalWeight += weight * matches.length;
    }
  }
  
  // Style analysis
  const ttr = calculateTTR(content);
  const sentenceVariation = calculateSentenceVariation(content);
  const repetitivePatterns = findRepetitivePatterns(content);
  
  // AI text often has very consistent sentence lengths (low variation)
  if (sentenceVariation < 4 && content.length > 200) {
    indicators.push({ 
      category: "Style Analysis", 
      finding: "Very uniform sentence lengths (AI-like consistency)", 
      weight: 15 
    });
    totalWeight += 15;
  }
  
  // AI text often has lower vocabulary diversity
  if (ttr < 0.35 && content.length > 200) {
    indicators.push({ 
      category: "Style Analysis", 
      finding: "Low vocabulary diversity (TTR < 0.35)", 
      weight: 10 
    });
    totalWeight += 10;
  }
  
  // Repetitive patterns suggest AI
  if (repetitivePatterns.length > 2) {
    indicators.push({ 
      category: "Style Analysis", 
      finding: `Multiple repetitive phrases: ${repetitivePatterns.slice(0, 3).join(", ")}`, 
      weight: 12 
    });
    totalWeight += 12;
  }
  
  // Calculate confidence (cap at 95 - never 100% certain)
  const confidence = Math.min(totalWeight, 95);
  const isLikelyAI = confidence >= 40;
  
  // Estimate perplexity (simple heuristic)
  let perplexityEstimate: "low" | "medium" | "high" = "medium";
  if (ttr > 0.5 && sentenceVariation > 8) {
    perplexityEstimate = "high"; // More human-like
  } else if (ttr < 0.35 && sentenceVariation < 4) {
    perplexityEstimate = "low"; // More AI-like
  }
  
  // Recommendations
  const recommendations: string[] = [];
  if (isLikelyAI) {
    recommendations.push("This content shows patterns consistent with AI generation");
    recommendations.push("Verify any claims or statistics independently");
    recommendations.push("AI-generated phishing emails are increasingly common - be cautious of links");
    if (confidence >= 70) {
      recommendations.push("High confidence AI detection - treat with extra skepticism");
    }
  }
  
  return {
    isLikelyAI,
    confidence,
    indicators,
    perplexityEstimate,
    styleAnalysis: {
      sentenceVariation,
      vocabularyDiversity: ttr,
      repetitivePatterns
    },
    recommendations
  };
}

// ============================================================================
// URL REDIRECT CHAIN ANALYSIS
// ============================================================================

export interface RedirectChainResult {
  originalUrl: string;
  finalUrl: string;
  hops: {
    url: string;
    statusCode: number;
    redirectType?: string;
  }[];
  totalRedirects: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskIndicators: string[];
  isSuspicious: boolean;
}

export async function analyzeRedirectChain(url: string, maxHops: number = 10): Promise<RedirectChainResult> {
  const hops: { url: string; statusCode: number; redirectType?: string }[] = [];
  const riskIndicators: string[] = [];
  let currentUrl = url;
  let finalUrl = url;
  
  try {
    for (let i = 0; i < maxHops; i++) {
      const response = await fetch(currentUrl, {
        method: "HEAD",
        redirect: "manual",
        headers: { "User-Agent": "GetCyberRight-SecurityScanner/1.0" },
        signal: AbortSignal.timeout(5000)
      });
      
      hops.push({
        url: currentUrl,
        statusCode: response.status,
        redirectType: response.status >= 300 && response.status < 400 ? 
          (response.status === 301 ? "permanent" : "temporary") : undefined
      });
      
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (location) {
          // Handle relative URLs
          if (location.startsWith("/")) {
            const baseUrl = new URL(currentUrl);
            currentUrl = `${baseUrl.protocol}//${baseUrl.host}${location}`;
          } else if (!location.startsWith("http")) {
            const baseUrl = new URL(currentUrl);
            currentUrl = `${baseUrl.protocol}//${baseUrl.host}/${location}`;
          } else {
            currentUrl = location;
          }
        } else {
          break;
        }
      } else {
        finalUrl = currentUrl;
        break;
      }
    }
  } catch (error) {
    riskIndicators.push("Failed to complete redirect chain analysis");
  }
  
  // Analyze the chain for risks
  const totalRedirects = hops.filter(h => h.statusCode >= 300 && h.statusCode < 400).length;
  
  if (totalRedirects >= 5) {
    riskIndicators.push(`Excessive redirects (${totalRedirects}) - often used to hide malicious destinations`);
  } else if (totalRedirects >= 3) {
    riskIndicators.push(`Multiple redirects (${totalRedirects}) - verify final destination`);
  }
  
  // Check for domain hopping
  const domains = new Set(hops.map(h => {
    try { return new URL(h.url).hostname; } catch { return h.url; }
  }));
  
  if (domains.size >= 3) {
    riskIndicators.push(`Crosses ${domains.size} different domains - common in phishing`);
  }
  
  // Check if final URL is different from original domain
  try {
    const originalDomain = new URL(url).hostname;
    const finalDomain = new URL(finalUrl).hostname;
    if (originalDomain !== finalDomain) {
      riskIndicators.push(`Final destination (${finalDomain}) differs from original (${originalDomain})`);
    }
  } catch {}
  
  // Determine risk level
  let riskLevel: "low" | "medium" | "high" | "critical" = "low";
  if (riskIndicators.length >= 3 || totalRedirects >= 5) {
    riskLevel = "critical";
  } else if (riskIndicators.length >= 2 || totalRedirects >= 3) {
    riskLevel = "high";
  } else if (riskIndicators.length >= 1) {
    riskLevel = "medium";
  }
  
  return {
    originalUrl: url,
    finalUrl,
    hops,
    totalRedirects,
    riskLevel,
    riskIndicators,
    isSuspicious: riskIndicators.length > 0
  };
}

// ============================================================================
// STEGANOGRAPHY DETECTION (Simple heuristics)
// ============================================================================

export interface SteganographyAnalysis {
  analyzed: boolean;
  suspiciousIndicators: string[];
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
}

// Common magic bytes for file types
const FILE_SIGNATURES: Record<string, { signature: number[]; name: string }> = {
  png: { signature: [0x89, 0x50, 0x4E, 0x47], name: "PNG Image" },
  jpg: { signature: [0xFF, 0xD8, 0xFF], name: "JPEG Image" },
  gif: { signature: [0x47, 0x49, 0x46, 0x38], name: "GIF Image" },
  pdf: { signature: [0x25, 0x50, 0x44, 0x46], name: "PDF Document" },
  zip: { signature: [0x50, 0x4B, 0x03, 0x04], name: "ZIP Archive" },
  exe: { signature: [0x4D, 0x5A], name: "Windows Executable" },
};

export function analyzeFileForSteganography(buffer: Buffer, filename?: string): SteganographyAnalysis {
  const suspiciousIndicators: string[] = [];
  
  // Check for file signature mismatches
  const extension = filename?.split('.').pop()?.toLowerCase();
  
  // Check actual file signature
  let detectedType: string | null = null;
  for (const [type, { signature, name }] of Object.entries(FILE_SIGNATURES)) {
    let matches = true;
    for (let i = 0; i < signature.length; i++) {
      if (buffer[i] !== signature[i]) {
        matches = false;
        break;
      }
    }
    if (matches) {
      detectedType = type;
      break;
    }
  }
  
  // Check for extension mismatch
  if (extension && detectedType && extension !== detectedType) {
    suspiciousIndicators.push(`File extension (.${extension}) doesn't match content (${detectedType})`);
  }
  
  // Check for embedded executables in images
  if (detectedType === "png" || detectedType === "jpg" || detectedType === "gif") {
    // Look for MZ header (executable) embedded in image
    const bufferStr = buffer.toString('binary');
    if (bufferStr.includes('MZ') && buffer.indexOf(Buffer.from([0x4D, 0x5A])) > 100) {
      suspiciousIndicators.push("Possible executable embedded in image file");
    }
    
    // Check for excessive data after image end marker
    if (detectedType === "jpg") {
      const eoi = buffer.indexOf(Buffer.from([0xFF, 0xD9])); // JPEG End of Image
      if (eoi > 0 && eoi < buffer.length - 1000) {
        suspiciousIndicators.push("Significant data found after image end marker (potential payload)");
      }
    }
    
    // Check for unusual metadata size
    if (detectedType === "png") {
      // Look for unusually large text chunks
      const textChunkPattern = Buffer.from('tEXt');
      const idx = buffer.indexOf(textChunkPattern);
      if (idx > 0 && idx + 8 < buffer.length) {
        const chunkSize = buffer.readUInt32BE(idx - 4);
        if (chunkSize > 10000) {
          suspiciousIndicators.push("Unusually large metadata chunk in PNG (potential hidden data)");
        }
      }
    }
  }
  
  // Check for polyglot files (files that are valid as multiple types)
  if (detectedType === "zip" && (extension === "jpg" || extension === "png")) {
    suspiciousIndicators.push("File appears to be both an image and a ZIP archive (polyglot)");
  }
  
  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (suspiciousIndicators.length >= 2) {
    riskLevel = "high";
  } else if (suspiciousIndicators.length === 1) {
    riskLevel = "medium";
  }
  
  const recommendations: string[] = [];
  if (suspiciousIndicators.length > 0) {
    recommendations.push("Do not open this file directly");
    recommendations.push("Scan with antivirus software before viewing");
    recommendations.push("If received unexpectedly, delete immediately");
  }
  
  return {
    analyzed: true,
    suspiciousIndicators,
    riskLevel,
    recommendations
  };
}

// ============================================================================
// GEOLOCATION RISK ANALYSIS
// ============================================================================

// High-risk countries for scam origin (based on FTC/FBI data)
const HIGH_RISK_COUNTRIES = new Set([
  "NG", "GH", "CI", "SN", "CM", "BF", // West Africa
  "RU", "UA", "BY", "MD", "RO", // Eastern Europe
  "PH", "MY", "ID", "IN", // Southeast Asia
  "CN", "KP", // East Asia
]);

const MEDIUM_RISK_COUNTRIES = new Set([
  "BR", "MX", "CO", "VE", // Latin America
  "TR", "EG", "MA", "TN", // North Africa/Middle East
  "PK", "BD", "VN", "TH", // South/Southeast Asia
]);

export interface GeolocationRiskResult {
  ip?: string;
  country?: string;
  countryCode?: string;
  city?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  riskIndicators: string[];
  isProxy: boolean;
  isVPN: boolean;
  isTor: boolean;
  recommendations: string[];
}

export async function analyzeIPGeolocation(ip: string): Promise<GeolocationRiskResult> {
  const riskIndicators: string[] = [];
  
  try {
    // Use ip-api.com for free geolocation (no API key needed)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,city,proxy,hosting`, {
      signal: AbortSignal.timeout(5000)
    });
    
    if (!response.ok) {
      throw new Error("Geolocation lookup failed");
    }
    
    const data = await response.json();
    
    if (data.status === "fail") {
      throw new Error(data.message || "Invalid IP");
    }
    
    let riskLevel: "low" | "medium" | "high" | "critical" = "low";
    
    // Check country risk
    if (HIGH_RISK_COUNTRIES.has(data.countryCode)) {
      riskIndicators.push(`High-risk origin country: ${data.country}`);
      riskLevel = "high";
    } else if (MEDIUM_RISK_COUNTRIES.has(data.countryCode)) {
      riskIndicators.push(`Moderate-risk origin country: ${data.country}`);
      riskLevel = "medium";
    }
    
    // Check for proxy/VPN
    const isProxy = data.proxy || false;
    const isHosting = data.hosting || false;
    
    if (isProxy) {
      riskIndicators.push("IP address is a known proxy server");
      riskLevel = riskLevel === "high" ? "critical" : "high";
    }
    
    if (isHosting) {
      riskIndicators.push("IP belongs to hosting/cloud provider (potential bot/VPN)");
      if (riskLevel !== "critical") riskLevel = "medium";
    }
    
    const recommendations: string[] = [];
    if (riskIndicators.length > 0) {
      recommendations.push("Exercise extra caution with this sender");
      if (isProxy) {
        recommendations.push("Sender is hiding their true location using a proxy");
      }
    }
    
    return {
      ip,
      country: data.country,
      countryCode: data.countryCode,
      city: data.city,
      riskLevel,
      riskIndicators,
      isProxy,
      isVPN: isHosting && isProxy,
      isTor: false, // Would need separate check
      recommendations
    };
  } catch (error) {
    return {
      ip,
      riskLevel: "medium",
      riskIndicators: ["Unable to determine IP origin"],
      isProxy: false,
      isVPN: false,
      isTor: false,
      recommendations: ["Could not verify sender location"]
    };
  }
}

// ============================================================================
// ATTACHMENT ANALYSIS
// ============================================================================

// Dangerous file extensions
const DANGEROUS_EXTENSIONS = new Set([
  "exe", "scr", "bat", "cmd", "com", "pif", "msi", "msp", "msc",
  "vbs", "vbe", "js", "jse", "ws", "wsf", "wsc", "wsh",
  "ps1", "ps1xml", "ps2", "ps2xml", "psc1", "psc2",
  "hta", "cpl", "dll", "reg", "inf", "jar",
  "iso", "img", "dmg",
]);

// Extensions that can contain macros
const MACRO_EXTENSIONS = new Set([
  "doc", "docm", "xls", "xlsm", "xlsb", "ppt", "pptm",
  "dotm", "xlam", "xltm", "potm", "ppam", "sldm",
]);

// Archive extensions (can hide malware)
const ARCHIVE_EXTENSIONS = new Set([
  "zip", "rar", "7z", "tar", "gz", "bz2", "xz",
  "cab", "arj", "lzh", "ace", "uue", "arc",
]);

export interface AttachmentAnalysisResult {
  filename: string;
  extension: string;
  mimeType?: string;
  riskLevel: "safe" | "low" | "medium" | "high" | "critical";
  riskIndicators: string[];
  hasMacros: boolean;
  isExecutable: boolean;
  isArchive: boolean;
  actualFileType?: string;
  recommendations: string[];
}

export function analyzeAttachment(
  filename: string, 
  mimeType?: string, 
  buffer?: Buffer
): AttachmentAnalysisResult {
  const riskIndicators: string[] = [];
  const extension = filename.split('.').pop()?.toLowerCase() || "";
  
  let riskLevel: "safe" | "low" | "medium" | "high" | "critical" = "safe";
  let hasMacros = false;
  let isExecutable = false;
  let isArchive = false;
  let actualFileType: string | undefined;
  
  // Check extension
  if (DANGEROUS_EXTENSIONS.has(extension)) {
    isExecutable = true;
    riskLevel = "critical";
    riskIndicators.push(`Dangerous file type: .${extension} can execute code`);
  } else if (MACRO_EXTENSIONS.has(extension)) {
    hasMacros = true;
    riskLevel = "high";
    riskIndicators.push(`Office document may contain macros: .${extension}`);
  } else if (ARCHIVE_EXTENSIONS.has(extension)) {
    isArchive = true;
    riskLevel = "medium";
    riskIndicators.push(`Archive file may contain hidden malware: .${extension}`);
  }
  
  // Check for double extensions (e.g., report.pdf.exe)
  const parts = filename.split('.');
  if (parts.length > 2) {
    const secondExt = parts[parts.length - 2].toLowerCase();
    if (["pdf", "doc", "xls", "jpg", "png"].includes(secondExt)) {
      riskIndicators.push(`Double extension detected: appears as .${secondExt} but is actually .${extension}`);
      riskLevel = "critical";
    }
  }
  
  // Check for unicode tricks in filename
  if (/[\u202E\u200F\u200E]/.test(filename)) {
    riskIndicators.push("Filename contains unicode direction override characters (name may appear reversed)");
    riskLevel = "critical";
  }
  
  // Check MIME type mismatch
  if (mimeType) {
    const expectedMime: Record<string, string[]> = {
      pdf: ["application/pdf"],
      doc: ["application/msword"],
      docx: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      xls: ["application/vnd.ms-excel"],
      xlsx: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
      jpg: ["image/jpeg"],
      png: ["image/png"],
      exe: ["application/x-msdownload", "application/octet-stream"],
    };
    
    const expected = expectedMime[extension];
    if (expected && !expected.includes(mimeType)) {
      riskIndicators.push(`MIME type (${mimeType}) doesn't match extension (.${extension})`);
      if (riskLevel !== "critical") riskLevel = "high";
    }
  }
  
  // Check file signature if buffer provided
  if (buffer && buffer.length > 4) {
    for (const [type, { signature, name }] of Object.entries(FILE_SIGNATURES)) {
      let matches = true;
      for (let i = 0; i < signature.length; i++) {
        if (buffer[i] !== signature[i]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        actualFileType = type;
        if (type !== extension) {
          riskIndicators.push(`Actual file type (${name}) differs from extension (.${extension})`);
          if (type === "exe" && extension !== "exe") {
            riskLevel = "critical";
            riskIndicators.push("Hidden executable file!");
          } else if (riskLevel !== "critical") {
            riskLevel = "high";
          }
        }
        break;
      }
    }
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (riskLevel === "critical") {
    recommendations.push("Do NOT open this file - high probability of malware");
    recommendations.push("Delete the email/message containing this attachment");
    recommendations.push("If you expected this file, contact the sender through a different channel to verify");
  } else if (riskLevel === "high") {
    recommendations.push("Scan with antivirus before opening");
    recommendations.push("If Office document, disable macros unless you trust the source");
    recommendations.push("Verify sender identity before opening");
  } else if (riskLevel === "medium") {
    recommendations.push("Scan with antivirus before extracting");
    recommendations.push("Check archive contents before extracting all files");
  }
  
  return {
    filename,
    extension,
    mimeType,
    riskLevel,
    riskIndicators,
    hasMacros,
    isExecutable,
    isArchive,
    actualFileType,
    recommendations
  };
}

// ============================================================================
// ENHANCED BREACH ANALYTICS
// ============================================================================

export interface EnhancedBreachInfo {
  name: string;
  domain?: string;
  breachDate?: string;
  addedDate?: string;
  modifiedDate?: string;
  pwnCount?: number;
  description?: string;
  dataClasses?: string[];
  isVerified?: boolean;
  isFabricated?: boolean;
  isSensitive?: boolean;
  isRetired?: boolean;
  isSpamList?: boolean;
  logoPath?: string;
  severity: "low" | "medium" | "high" | "critical";
}

export function categorizeBreachSeverity(breach: Partial<EnhancedBreachInfo>): "low" | "medium" | "high" | "critical" {
  const dataClasses = breach.dataClasses || [];
  
  // Critical if contains financial or identity data
  const criticalData = ["Credit cards", "Bank accounts", "SSN", "Social security numbers", "Government issued IDs"];
  if (dataClasses.some(d => criticalData.some(c => d.toLowerCase().includes(c.toLowerCase())))) {
    return "critical";
  }
  
  // High if contains passwords or personal info
  const highData = ["Passwords", "Password hints", "Security questions", "Phone numbers", "Physical addresses"];
  if (dataClasses.some(d => highData.some(c => d.toLowerCase().includes(c.toLowerCase())))) {
    return "high";
  }
  
  // Medium if contains email addresses or usernames
  const mediumData = ["Email addresses", "Usernames", "IP addresses", "Names"];
  if (dataClasses.some(d => mediumData.some(c => d.toLowerCase().includes(c.toLowerCase())))) {
    return "medium";
  }
  
  return "low";
}

// ============================================================================
// DOMAIN REPUTATION AGGREGATION
// ============================================================================

export interface DomainReputationScore {
  domain: string;
  overallScore: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  factors: {
    source: string;
    score: number;
    weight: number;
    details: string;
  }[];
  riskLevel: "safe" | "low" | "medium" | "high" | "critical";
  recommendations: string[];
}

export function calculateDomainReputation(
  domain: string,
  googleSB?: { isThreat: boolean },
  virusTotal?: { positives: number; total: number },
  domainAge?: { ageInDays?: number; isNew: boolean },
  ssl?: { valid: boolean; isExpired: boolean; isSelfSigned: boolean },
  phishTank?: { isPhishing: boolean | null },
  urlhaus?: { isMalware: boolean | null }
): DomainReputationScore {
  const factors: DomainReputationScore["factors"] = [];
  let totalWeightedScore = 0;
  let totalWeight = 0;
  
  // Factor 1: Google Safe Browsing (weight: 30)
  if (googleSB !== undefined) {
    const score = googleSB.isThreat ? 0 : 100;
    factors.push({
      source: "Google Safe Browsing",
      score,
      weight: 30,
      details: googleSB.isThreat ? "Flagged as dangerous" : "No threats detected"
    });
    totalWeightedScore += score * 30;
    totalWeight += 30;
  }
  
  // Factor 2: VirusTotal (weight: 25)
  if (virusTotal !== undefined && virusTotal.total > 0) {
    const detectionRate = virusTotal.positives / virusTotal.total;
    const score = Math.max(0, 100 - (detectionRate * 200));
    factors.push({
      source: "VirusTotal",
      score: Math.round(score),
      weight: 25,
      details: `${virusTotal.positives}/${virusTotal.total} scanners flagged`
    });
    totalWeightedScore += score * 25;
    totalWeight += 25;
  }
  
  // Factor 3: Domain Age (weight: 15)
  if (domainAge !== undefined) {
    let score = 100;
    let details = "Established domain";
    
    if (domainAge.ageInDays !== undefined) {
      if (domainAge.ageInDays < 30) {
        score = 20;
        details = `Very new domain (${domainAge.ageInDays} days)`;
      } else if (domainAge.ageInDays < 180) {
        score = 50;
        details = `New domain (${domainAge.ageInDays} days)`;
      } else if (domainAge.ageInDays < 365) {
        score = 70;
        details = `Less than 1 year old`;
      }
    } else if (domainAge.isNew) {
      score = 40;
      details = "Recently registered";
    }
    
    factors.push({ source: "Domain Age", score, weight: 15, details });
    totalWeightedScore += score * 15;
    totalWeight += 15;
  }
  
  // Factor 4: SSL Certificate (weight: 15)
  if (ssl !== undefined) {
    let score = 100;
    let details = "Valid SSL certificate";
    
    if (!ssl.valid) {
      score = 30;
      details = "Invalid SSL certificate";
    } else if (ssl.isExpired) {
      score = 10;
      details = "Expired SSL certificate";
    } else if (ssl.isSelfSigned) {
      score = 40;
      details = "Self-signed certificate";
    }
    
    factors.push({ source: "SSL Certificate", score, weight: 15, details });
    totalWeightedScore += score * 15;
    totalWeight += 15;
  }
  
  // Factor 5: PhishTank (weight: 10)
  if (phishTank?.isPhishing !== null && phishTank?.isPhishing !== undefined) {
    const score = phishTank.isPhishing ? 0 : 100;
    factors.push({
      source: "PhishTank",
      score,
      weight: 10,
      details: phishTank.isPhishing ? "Confirmed phishing site" : "Not in phishing database"
    });
    totalWeightedScore += score * 10;
    totalWeight += 10;
  }
  
  // Factor 6: URLhaus (weight: 5)
  if (urlhaus?.isMalware !== null && urlhaus?.isMalware !== undefined) {
    const score = urlhaus.isMalware ? 0 : 100;
    factors.push({
      source: "URLhaus",
      score,
      weight: 5,
      details: urlhaus.isMalware ? "Known malware distribution" : "No malware found"
    });
    totalWeightedScore += score * 5;
    totalWeight += 5;
  }
  
  // Calculate overall score
  const overallScore = totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 50;
  
  // Determine grade
  let grade: "A" | "B" | "C" | "D" | "F" = "A";
  if (overallScore < 40) grade = "F";
  else if (overallScore < 55) grade = "D";
  else if (overallScore < 70) grade = "C";
  else if (overallScore < 85) grade = "B";
  
  // Determine risk level
  let riskLevel: "safe" | "low" | "medium" | "high" | "critical" = "safe";
  if (overallScore < 25) riskLevel = "critical";
  else if (overallScore < 45) riskLevel = "high";
  else if (overallScore < 65) riskLevel = "medium";
  else if (overallScore < 80) riskLevel = "low";
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (riskLevel === "critical" || riskLevel === "high") {
    recommendations.push("Do not visit this website");
    recommendations.push("Do not enter any personal information");
  } else if (riskLevel === "medium") {
    recommendations.push("Proceed with caution");
    recommendations.push("Verify the website's legitimacy before entering data");
  }
  
  return {
    domain,
    overallScore,
    grade,
    factors,
    riskLevel,
    recommendations
  };
}

// ============================================================================
// BREACH EXPOSURE RISK ASSESSMENT
// (Inferred from HIBP breach count. We do NOT scan the dark web ourselves —
// claims are framed as inferred risk, not direct observation.)
// ============================================================================

export interface BreachExposureRiskResult {
  email: string;
  exposureLevel: "none" | "low" | "medium" | "high" | "critical";
  inferredRisks: {
    type: string;
    description: string;
    risk: string;
  }[];
  recommendations: string[];
  source: string;
  disclaimer: string;
}

/** @deprecated Use BreachExposureRiskResult. Kept for compatibility. */
export type DarkWebMonitoringResult = BreachExposureRiskResult & {
  /** @deprecated alias for inferredRisks */
  potentialExposures: BreachExposureRiskResult["inferredRisks"];
};

export function assessBreachExposureRisk(email: string, breachCount: number): BreachExposureRiskResult {
  const inferredRisks: { type: string; description: string; risk: string }[] = [];
  let exposureLevel: "none" | "low" | "medium" | "high" | "critical" = "none";

  if (breachCount >= 10) {
    exposureLevel = "critical";
    inferredRisks.push(
      { type: "High breach volume", description: `Email appears in ${breachCount} known public breaches indexed by HIBP. Emails in 10+ breaches are statistically likely to appear in credential-stuffing lists.`, risk: "Very High" },
      { type: "Credential reuse risk", description: "If the same password was reused across breached accounts, attackers can attempt automated logins on other services.", risk: "High" },
      { type: "Targeted phishing risk", description: "Heavily breached emails are common targets for personalised phishing using leaked context.", risk: "High" }
    );
  } else if (breachCount >= 5) {
    exposureLevel = "high";
    inferredRisks.push(
      { type: "Multiple known breaches", description: `Email appears in ${breachCount} known public breaches indexed by HIBP.`, risk: "High" },
      { type: "Phishing target risk", description: "Emails with multiple breach hits are frequently targeted for phishing.", risk: "Medium" }
    );
  } else if (breachCount >= 2) {
    exposureLevel = "medium";
    inferredRisks.push(
      { type: "Repeat exposure", description: `Email appears in ${breachCount} known public breaches indexed by HIBP.`, risk: "Medium" }
    );
  } else if (breachCount >= 1) {
    exposureLevel = "low";
    inferredRisks.push(
      { type: "Single known breach", description: "Email appears in 1 known public breach indexed by HIBP.", risk: "Low" }
    );
  }

  const recommendations: string[] = [];
  if (exposureLevel !== "none") {
    recommendations.push("Enable two-factor authentication on all important accounts");
    recommendations.push("Use a unique password for every account (a password manager makes this practical)");
    if (exposureLevel === "high" || exposureLevel === "critical") {
      recommendations.push("Monitor your credit report for unauthorised activity");
      recommendations.push("Consider a credit freeze if concerned about identity theft");
      recommendations.push("Set up fraud alerts with credit bureaus");
    }
  }

  return {
    email,
    exposureLevel,
    inferredRisks,
    recommendations,
    source: "Have I Been Pwned (HIBP) breach count — https://haveibeenpwned.com",
    disclaimer: "This is a risk score inferred from your public-breach count. GetCyberRight does not crawl dark-web marketplaces. For active dark-web monitoring, use a specialist service such as SpyCloud, Hudson Rock, or Identity Guard."
  };
}

/** @deprecated Use assessBreachExposureRisk. Kept for backward compatibility. */
export function simulateDarkWebMonitoring(email: string, breachCount: number): DarkWebMonitoringResult {
  const r = assessBreachExposureRisk(email, breachCount);
  return { ...r, potentialExposures: r.inferredRisks };
}

// ============================================================================
// PASSWORD EXPOSURE CONTEXT
// ============================================================================

export interface PasswordExposureContext {
  passwordAnalysis: {
    strength: "weak" | "moderate" | "strong" | "very_strong";
    score: number;
    issues: string[];
  };
  commonBreachPatterns: {
    patternType: string;
    description: string;
    prevalence: "extremely_common" | "very_common" | "common" | "less_common";
  }[];
  potentialExposureTypes: {
    source: string;
    dataTypes: string[];
    estimatedRisk: "low" | "medium" | "high" | "critical";
  }[];
  recommendations: string[];
  educationalInfo: string[];
}

// Common breach database patterns
const commonBreachPatterns = [
  { pattern: /^123456/, patternType: "Sequential Numbers", description: "Used in 95% of all breached databases", prevalence: "extremely_common" as const },
  { pattern: /^password/i, patternType: "Password Word", description: "Found in 90% of credential dumps", prevalence: "extremely_common" as const },
  { pattern: /^qwerty/i, patternType: "Keyboard Pattern", description: "Present in 85% of breach compilations", prevalence: "extremely_common" as const },
  { pattern: /^admin/i, patternType: "Admin/Default", description: "Found in 80% of enterprise breaches", prevalence: "very_common" as const },
  { pattern: /^letmein/i, patternType: "Common Phrase", description: "Appears in 70% of older breach databases", prevalence: "very_common" as const },
  { pattern: /^welcome/i, patternType: "Common Phrase", description: "Default password in many corporate breaches", prevalence: "very_common" as const },
  { pattern: /^iloveyou/i, patternType: "Common Phrase", description: "Present in 60% of personal account breaches", prevalence: "common" as const },
  { pattern: /^dragon/i, patternType: "Common Word", description: "Found in 55% of gaming-related breaches", prevalence: "common" as const },
  { pattern: /^monkey/i, patternType: "Common Word", description: "Appears in 50% of social media breaches", prevalence: "common" as const },
  { pattern: /^master/i, patternType: "Common Word", description: "Found in 45% of breach compilations", prevalence: "common" as const },
];

// Major breach types that exposed passwords
const majorBreachTypes = [
  { source: "Social Media Breaches", examples: ["LinkedIn 2012", "MySpace 2016", "Facebook 2019"], dataTypes: ["emails", "passwords", "usernames"], years: [2012, 2016, 2019] },
  { source: "Gaming Platform Breaches", examples: ["Zynga 2019", "Epic Games 2016", "PlayStation 2011"], dataTypes: ["emails", "passwords", "payment_info"], years: [2011, 2016, 2019] },
  { source: "E-commerce Breaches", examples: ["Adobe 2013", "eBay 2014", "Shopify 2020"], dataTypes: ["emails", "passwords", "addresses", "credit_cards"], years: [2013, 2014, 2020] },
  { source: "Healthcare Breaches", examples: ["Anthem 2015", "Premera 2015"], dataTypes: ["SSN", "medical_records", "insurance_info"], years: [2015] },
  { source: "Financial Breaches", examples: ["Equifax 2017", "Capital One 2019"], dataTypes: ["SSN", "credit_scores", "bank_accounts"], years: [2017, 2019] },
];

export function analyzePasswordExposure(password: string): PasswordExposureContext {
  const issues: string[] = [];
  let score = 100;
  
  // Analyze password strength
  if (password.length < 8) {
    issues.push("Password is too short (< 8 characters)");
    score -= 30;
  } else if (password.length < 12) {
    issues.push("Password could be longer (< 12 characters)");
    score -= 15;
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push("Missing uppercase letters");
    score -= 15;
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push("Missing lowercase letters");
    score -= 15;
  }
  
  if (!/[0-9]/.test(password)) {
    issues.push("Missing numbers");
    score -= 15;
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    issues.push("Missing special characters");
    score -= 15;
  }
  
  // Check for common patterns
  const matchedPatterns: PasswordExposureContext["commonBreachPatterns"] = [];
  for (const bp of commonBreachPatterns) {
    if (bp.pattern.test(password)) {
      matchedPatterns.push({
        patternType: bp.patternType,
        description: bp.description,
        prevalence: bp.prevalence
      });
      score -= 25;
    }
  }
  
  // Determine strength level
  let strength: "weak" | "moderate" | "strong" | "very_strong" = "very_strong";
  if (score < 30) strength = "weak";
  else if (score < 50) strength = "moderate";
  else if (score < 75) strength = "strong";
  
  // Determine potential exposure types based on password characteristics
  const potentialExposureTypes: PasswordExposureContext["potentialExposureTypes"] = [];
  
  if (strength === "weak" || matchedPatterns.length > 0) {
    potentialExposureTypes.push({
      source: "Compiled Breach Lists",
      dataTypes: ["This password appears in common password dictionaries"],
      estimatedRisk: "critical"
    });
  }
  
  // Educational recommendations
  const recommendations: string[] = [];
  if (strength === "weak") {
    recommendations.push("This password is extremely vulnerable - change it immediately on all accounts");
    recommendations.push("Use a password manager to generate and store unique, strong passwords");
  } else if (strength === "moderate") {
    recommendations.push("Consider strengthening this password with more characters and symbols");
    recommendations.push("Enable two-factor authentication where available");
  } else if (strength === "strong") {
    recommendations.push("Good password! Ensure you're using unique passwords for each account");
  } else {
    recommendations.push("Excellent password strength! Keep using unique passwords per account");
  }
  
  // Educational information
  const educationalInfo = [
    "Passwords from data breaches are compiled into searchable databases used by attackers",
    "The Have I Been Pwned service contains over 12 billion breached passwords",
    "Password reuse across sites means one breach can compromise multiple accounts",
    "Rainbow tables and hash lookups can crack weak passwords in seconds",
    "Modern password managers can generate and store unique 20+ character passwords"
  ];
  
  return {
    passwordAnalysis: {
      strength,
      score: Math.max(0, Math.min(100, score)),
      issues
    },
    commonBreachPatterns: matchedPatterns,
    potentialExposureTypes,
    recommendations,
    educationalInfo
  };
}
