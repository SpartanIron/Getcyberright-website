import { z } from "zod";
import * as tls from "tls";
import * as https from "https";
import { URL } from "url";

// Validation schemas
export const urlCheckSchema = z.object({
  url: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      const blockedPatterns = [
        /^localhost$/,
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2\d|3[01])\./,
        /^192\.168\./,
        /^0\./,
        /^169\.254\./,
        /^fc00:/,
        /^fe80:/,
        /^::1$/,
      ];
      return !blockedPatterns.some(p => p.test(hostname));
    } catch {
      return false;
    }
  }, { message: "Private or local URLs are not allowed" })
});

export const phoneCheckSchema = z.object({
  phone: z.string().min(7).max(20).regex(/^[\d\s\-\+\(\)]+$/, "Invalid phone number format")
});

export const domainCheckSchema = z.object({
  domain: z.string().min(1).max(253).regex(/^[a-zA-Z0-9][a-zA-Z0-9\-\.]*[a-zA-Z0-9]$/, "Invalid domain format")
});

// Fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<globalThis.Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Types for threat intelligence results
export interface GoogleSafeBrowsingResult {
  checked: boolean;
  isThreat: boolean;
  threats: string[];
  error?: string;
}

export interface VirusTotalResult {
  checked: boolean;
  positives: number;
  total: number;
  scanners: { name: string; detected: boolean; result?: string }[];
  permalink?: string;
  error?: string;
}

export interface DomainAgeResult {
  checked: boolean;
  domain: string;
  createdDate?: string;
  updatedDate?: string;
  expiresDate?: string;
  ageInDays?: number;
  registrar?: string;
  isNew: boolean;
  riskLevel: "low" | "medium" | "high";
  error?: string;
}

export interface SSLCertificateResult {
  checked: boolean;
  valid: boolean;
  issuer?: string;
  subject?: string;
  validFrom?: string;
  validTo?: string;
  daysUntilExpiry?: number;
  isExpired: boolean;
  isEV: boolean;
  isSelfSigned: boolean;
  protocol?: string;
  cipher?: string;
  riskLevel: "low" | "medium" | "high" | "critical";
  error?: string;
}

export interface PhoneNumberResult {
  checked: boolean;
  number: string;
  formatted?: string;
  countryCode?: string;
  countryName?: string;
  carrier?: string;
  lineType?: string;
  isValid: boolean;
  riskIndicators: string[];
  riskLevel: "low" | "medium" | "high";
  error?: string;
}

export interface TrustScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  factors: {
    name: string;
    score: number;
    maxScore: number;
    status: "good" | "warning" | "danger";
    details: string;
  }[];
  summary: string;
}

export interface ComprehensiveScanResult {
  url: string;
  overallThreatLevel: "safe" | "low" | "medium" | "high" | "critical";
  trustScore: TrustScoreResult;
  googleSafeBrowsing?: GoogleSafeBrowsingResult;
  virusTotal?: VirusTotalResult;
  domainAge?: DomainAgeResult;
  sslCertificate?: SSLCertificateResult;
  phishTank?: { checked: boolean; isPhishing: boolean | null; error?: string };
  urlhaus?: { checked: boolean; isMalware: boolean | null; error?: string };
  checkedAt: string;
}

// Google Safe Browsing API check
export async function checkGoogleSafeBrowsing(url: string): Promise<GoogleSafeBrowsingResult> {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  
  if (!apiKey) {
    return {
      checked: false,
      isThreat: false,
      threats: [],
      error: "Google Safe Browsing API key not configured"
    };
  }

  try {
    const response = await fetchWithTimeout(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
        })
      },
      10000
    );

    if (!response.ok) {
      throw new Error(`Google Safe Browsing API error: ${response.status}`);
    }

    const data = await response.json();
    const threats = data.matches?.map((m: any) => m.threatType) || [];

    return {
      checked: true,
      isThreat: threats.length > 0,
      threats
    };
  } catch (error) {
    console.error("Google Safe Browsing error:", error);
    return {
      checked: false,
      isThreat: false,
      threats: [],
      error: "Service temporarily unavailable"
    };
  }
}

// VirusTotal API check
export async function checkVirusTotal(url: string): Promise<VirusTotalResult> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  
  if (!apiKey) {
    return {
      checked: false,
      positives: 0,
      total: 0,
      scanners: [],
      error: "VirusTotal API key not configured"
    };
  }

  try {
    // First, submit URL for scanning
    const urlId = Buffer.from(url).toString("base64").replace(/=/g, "");
    
    const response = await fetchWithTimeout(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      {
        method: "GET",
        headers: { 
          "x-apikey": apiKey,
          "Accept": "application/json"
        }
      },
      15000
    );

    if (response.status === 404) {
      // URL not in database, submit for scanning
      const scanResponse = await fetchWithTimeout(
        "https://www.virustotal.com/api/v3/urls",
        {
          method: "POST",
          headers: {
            "x-apikey": apiKey,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: `url=${encodeURIComponent(url)}`
        },
        15000
      );

      if (!scanResponse.ok) {
        throw new Error("Failed to submit URL for scanning");
      }

      return {
        checked: true,
        positives: 0,
        total: 0,
        scanners: [],
        error: "URL submitted for analysis. Results available shortly."
      };
    }

    if (!response.ok) {
      throw new Error(`VirusTotal API error: ${response.status}`);
    }

    const data = await response.json();
    const stats = data.data?.attributes?.last_analysis_stats || {};
    const results = data.data?.attributes?.last_analysis_results || {};

    const positives = (stats.malicious || 0) + (stats.suspicious || 0);
    const total = Object.keys(results).length;

    const scanners = Object.entries(results).slice(0, 10).map(([name, result]: [string, any]) => ({
      name,
      detected: result.category === "malicious" || result.category === "suspicious",
      result: result.result
    }));

    return {
      checked: true,
      positives,
      total,
      scanners,
      permalink: `https://www.virustotal.com/gui/url/${urlId}`
    };
  } catch (error) {
    console.error("VirusTotal error:", error);
    return {
      checked: false,
      positives: 0,
      total: 0,
      scanners: [],
      error: "Service temporarily unavailable"
    };
  }
}

// Domain Age / WHOIS check (using free RDAP/WHOIS services)
export async function checkDomainAge(domain: string): Promise<DomainAgeResult> {
  try {
    // Extract domain from URL if needed
    let cleanDomain = domain;
    try {
      const url = new URL(domain.includes("://") ? domain : `https://${domain}`);
      cleanDomain = url.hostname;
    } catch {
      // Use as-is if not a valid URL
    }

    // Remove www prefix
    cleanDomain = cleanDomain.replace(/^www\./, "");

    // Try RDAP (Registry Data Access Protocol) first - more modern and reliable
    const tld = cleanDomain.split(".").pop()?.toLowerCase();
    
    // Common RDAP servers by TLD
    const rdapServers: Record<string, string> = {
      "com": "https://rdap.verisign.com/com/v1",
      "net": "https://rdap.verisign.com/net/v1",
      "org": "https://rdap.publicinterestregistry.org/rdap",
      "io": "https://rdap.nic.io",
      "co": "https://rdap.nic.co",
      "me": "https://rdap.nic.me",
      "app": "https://rdap.nic.google",
      "dev": "https://rdap.nic.google",
    };

    const rdapServer = rdapServers[tld || ""] || "https://rdap.org";

    try {
      const response = await fetchWithTimeout(
        `${rdapServer}/domain/${cleanDomain}`,
        {
          headers: { "Accept": "application/rdap+json, application/json" }
        },
        10000
      );

      if (response.ok) {
        const data = await response.json();
        
        // Parse RDAP events for dates
        const events = data.events || [];
        const registrationEvent = events.find((e: any) => e.eventAction === "registration");
        const expirationEvent = events.find((e: any) => e.eventAction === "expiration");
        const lastUpdateEvent = events.find((e: any) => e.eventAction === "last changed");

        const createdDate = registrationEvent?.eventDate;
        const expiresDate = expirationEvent?.eventDate;
        const updatedDate = lastUpdateEvent?.eventDate;

        // Get registrar from entities
        const registrarEntity = data.entities?.find((e: any) => e.roles?.includes("registrar"));
        const registrar = registrarEntity?.vcardArray?.[1]?.find((v: any) => v[0] === "fn")?.[3] || 
                         registrarEntity?.handle || "Unknown";

        // Calculate age in days
        let ageInDays: number | undefined;
        let isNew = false;
        let riskLevel: "low" | "medium" | "high" = "low";

        if (createdDate) {
          const created = new Date(createdDate);
          const now = new Date();
          ageInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          
          if (ageInDays < 30) {
            isNew = true;
            riskLevel = "high";
          } else if (ageInDays < 180) {
            isNew = true;
            riskLevel = "medium";
          }
        }

        return {
          checked: true,
          domain: cleanDomain,
          createdDate,
          updatedDate,
          expiresDate,
          ageInDays,
          registrar,
          isNew,
          riskLevel
        };
      }
    } catch (rdapError) {
      console.log("RDAP lookup failed, trying fallback:", rdapError);
    }

    // Fallback: Use a basic heuristic for domain age estimation
    // Check if domain is from a free/suspicious TLD
    const suspiciousTlds = ["tk", "ml", "ga", "cf", "gq", "xyz", "top", "club", "online", "site", "buzz", "work", "link", "click"];
    const isSuspiciousTld = suspiciousTlds.includes(tld || "");

    return {
      checked: true,
      domain: cleanDomain,
      isNew: false,
      riskLevel: isSuspiciousTld ? "medium" : "low",
      error: "Detailed WHOIS data unavailable"
    };
  } catch (error) {
    console.error("Domain age check error:", error);
    return {
      checked: false,
      domain,
      isNew: false,
      riskLevel: "medium",
      error: "Domain lookup failed"
    };
  }
}

// SSL Certificate Analysis
export async function checkSSLCertificate(url: string): Promise<SSLCertificateResult> {
  try {
    const parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    
    if (parsedUrl.protocol !== "https:") {
      return {
        checked: true,
        valid: false,
        isExpired: false,
        isEV: false,
        isSelfSigned: false,
        riskLevel: "high",
        error: "Site does not use HTTPS"
      };
    }

    return new Promise((resolve) => {
      const options: tls.ConnectionOptions = {
        host: parsedUrl.hostname,
        port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : 443,
        servername: parsedUrl.hostname,
        rejectUnauthorized: false, // Allow inspection of invalid certs
      };

      const socket = tls.connect(options, () => {
        const cert = socket.getPeerCertificate(true);
        const cipher = socket.getCipher();
        const protocol = socket.getProtocol();
        const authorized = socket.authorized;

        socket.end();

        if (!cert || !cert.subject) {
          resolve({
            checked: true,
            valid: false,
            isExpired: false,
            isEV: false,
            isSelfSigned: false,
            riskLevel: "high",
            error: "No certificate found"
          });
          return;
        }

        const validFrom = new Date(cert.valid_from);
        const validTo = new Date(cert.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.floor((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = now > validTo || now < validFrom;

        // Check if issuer and subject are same (self-signed)
        const issuerCN = cert.issuer?.CN || cert.issuer?.O || "";
        const subjectCN = cert.subject?.CN || cert.subject?.O || "";
        const isSelfSigned = issuerCN === subjectCN && !cert.issuerCertificate;

        // Check for EV (Extended Validation) certificate
        // EV certs typically have specific issuer patterns
        const certSubject = cert.subject as unknown as Record<string, string>;
        const isEV = Boolean(
          certSubject?.businessCategory ||
          certSubject?.serialNumber ||
          (cert.issuer?.O && cert.issuer.O.includes("Extended Validation"))
        );

        // Determine risk level
        let riskLevel: "low" | "medium" | "high" | "critical" = "low";
        if (isExpired) {
          riskLevel = "critical";
        } else if (isSelfSigned) {
          riskLevel = "high";
        } else if (daysUntilExpiry < 7) {
          riskLevel = "high";
        } else if (daysUntilExpiry < 30) {
          riskLevel = "medium";
        } else if (!authorized) {
          riskLevel = "medium";
        }

        resolve({
          checked: true,
          valid: authorized && !isExpired,
          issuer: cert.issuer?.O || cert.issuer?.CN || "Unknown",
          subject: cert.subject?.CN || cert.subject?.O || "Unknown",
          validFrom: validFrom.toISOString(),
          validTo: validTo.toISOString(),
          daysUntilExpiry,
          isExpired,
          isEV,
          isSelfSigned,
          protocol: protocol || undefined,
          cipher: cipher?.name,
          riskLevel
        });
      });

      socket.on("error", (err) => {
        socket.end();
        resolve({
          checked: true,
          valid: false,
          isExpired: false,
          isEV: false,
          isSelfSigned: false,
          riskLevel: "high",
          error: `SSL connection failed: ${err.message}`
        });
      });

      // Timeout after 10 seconds
      socket.setTimeout(10000, () => {
        socket.end();
        resolve({
          checked: false,
          valid: false,
          isExpired: false,
          isEV: false,
          isSelfSigned: false,
          riskLevel: "high",
          error: "Connection timeout"
        });
      });
    });
  } catch (error) {
    console.error("SSL check error:", error);
    return {
      checked: false,
      valid: false,
      isExpired: false,
      isEV: false,
      isSelfSigned: false,
      riskLevel: "high",
      error: "SSL analysis failed"
    };
  }
}

// Phone Number Analysis
export async function checkPhoneNumber(phone: string): Promise<PhoneNumberResult> {
  // Clean the phone number
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  
  const riskIndicators: string[] = [];
  let riskLevel: "low" | "medium" | "high" = "low";

  // Basic validation patterns
  const internationalPattern = /^\+?[1-9]\d{6,14}$/;
  const usPattern = /^\+?1?\d{10}$/;
  const isValid = internationalPattern.test(cleanPhone) || usPattern.test(cleanPhone);

  // Detect country code
  let countryCode = "";
  let countryName = "";
  
  if (cleanPhone.startsWith("+1") || cleanPhone.startsWith("1")) {
    countryCode = "US/CA";
    countryName = "United States/Canada";
  } else if (cleanPhone.startsWith("+44")) {
    countryCode = "GB";
    countryName = "United Kingdom";
  } else if (cleanPhone.startsWith("+91")) {
    countryCode = "IN";
    countryName = "India";
  } else if (cleanPhone.startsWith("+86")) {
    countryCode = "CN";
    countryName = "China";
  } else if (cleanPhone.startsWith("+234")) {
    countryCode = "NG";
    countryName = "Nigeria";
    riskIndicators.push("High scam-origin country");
    riskLevel = "high";
  } else if (cleanPhone.startsWith("+233")) {
    countryCode = "GH";
    countryName = "Ghana";
    riskIndicators.push("High scam-origin country");
    riskLevel = "high";
  }

  // Check for known scam area codes (US)
  const usScamAreaCodes = ["473", "809", "284", "649", "876", "268", "664", "767", "246"];
  const areaCode = cleanPhone.replace(/^\+?1/, "").substring(0, 3);
  if (usScamAreaCodes.includes(areaCode)) {
    riskIndicators.push("Known high-risk area code (Caribbean scam hotspot)");
    riskLevel = "high";
  }

  // Check for premium rate numbers
  const premiumPrefixes = ["900", "976", "0900", "0906", "0909"];
  if (premiumPrefixes.some(p => cleanPhone.includes(p))) {
    riskIndicators.push("Premium rate number - calls may be expensive");
    riskLevel = "medium";
  }

  // Check for toll-free numbers (generally safer)
  const tollFreePrefixes = ["800", "888", "877", "866", "855", "844", "833"];
  const isTollFree = tollFreePrefixes.some(p => cleanPhone.replace(/^\+?1/, "").startsWith(p));
  if (isTollFree) {
    riskIndicators.push("Toll-free number (verify legitimacy before calling)");
  }

  // Format the number for display
  let formatted = phone;
  if (cleanPhone.length === 10) {
    formatted = `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
  } else if (cleanPhone.length === 11 && cleanPhone.startsWith("1")) {
    formatted = `+1 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
  }

  return {
    checked: true,
    number: phone,
    formatted,
    countryCode: countryCode || undefined,
    countryName: countryName || undefined,
    lineType: isTollFree ? "Toll-Free" : undefined,
    isValid,
    riskIndicators,
    riskLevel
  };
}

// Calculate comprehensive trust score
export function calculateTrustScore(
  domainAge?: DomainAgeResult,
  ssl?: SSLCertificateResult,
  googleSB?: GoogleSafeBrowsingResult,
  virusTotal?: VirusTotalResult,
  phishTank?: { isPhishing: boolean | null },
  urlhaus?: { isMalware: boolean | null }
): TrustScoreResult {
  const factors: TrustScoreResult["factors"] = [];
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Factor 1: SSL Certificate (25 points max)
  const sslMax = 25;
  maxPossibleScore += sslMax;
  if (ssl?.checked) {
    let sslScore = 0;
    let sslStatus: "good" | "warning" | "danger" = "good";
    let sslDetails = "";

    if (ssl.valid && !ssl.isExpired && !ssl.isSelfSigned) {
      sslScore = ssl.isEV ? 25 : 20;
      sslDetails = ssl.isEV ? "Extended Validation certificate" : "Valid SSL certificate";
    } else if (ssl.isSelfSigned) {
      sslScore = 5;
      sslStatus = "danger";
      sslDetails = "Self-signed certificate (not trusted)";
    } else if (ssl.isExpired) {
      sslScore = 0;
      sslStatus = "danger";
      sslDetails = "Expired certificate";
    } else if (!ssl.valid) {
      sslScore = 10;
      sslStatus = "warning";
      sslDetails = "Certificate validation issues";
    }

    totalScore += sslScore;
    factors.push({ name: "SSL Certificate", score: sslScore, maxScore: sslMax, status: sslStatus, details: sslDetails });
  } else {
    factors.push({ name: "SSL Certificate", score: 0, maxScore: sslMax, status: "danger", details: "No HTTPS or check failed" });
  }

  // Factor 2: Domain Age (20 points max)
  const domainAgeMax = 20;
  maxPossibleScore += domainAgeMax;
  if (domainAge?.checked) {
    let ageScore = 0;
    let ageStatus: "good" | "warning" | "danger" = "good";
    let ageDetails = "";

    if (domainAge.ageInDays !== undefined) {
      if (domainAge.ageInDays >= 365) {
        ageScore = 20;
        ageDetails = `Domain is ${Math.floor(domainAge.ageInDays / 365)} year(s) old`;
      } else if (domainAge.ageInDays >= 180) {
        ageScore = 15;
        ageStatus = "good";
        ageDetails = `Domain is ${domainAge.ageInDays} days old`;
      } else if (domainAge.ageInDays >= 30) {
        ageScore = 8;
        ageStatus = "warning";
        ageDetails = `Recently registered (${domainAge.ageInDays} days)`;
      } else {
        ageScore = 2;
        ageStatus = "danger";
        ageDetails = `Very new domain (${domainAge.ageInDays} days) - high risk`;
      }
    } else {
      ageScore = 10;
      ageStatus = "warning";
      ageDetails = "Domain age unavailable";
    }

    totalScore += ageScore;
    factors.push({ name: "Domain Age", score: ageScore, maxScore: domainAgeMax, status: ageStatus, details: ageDetails });
  } else {
    factors.push({ name: "Domain Age", score: 5, maxScore: domainAgeMax, status: "warning", details: "Could not verify domain age" });
    totalScore += 5;
  }

  // Factor 3: Google Safe Browsing (25 points max)
  const gsbMax = 25;
  maxPossibleScore += gsbMax;
  if (googleSB?.checked) {
    if (googleSB.isThreat) {
      factors.push({ name: "Google Safe Browsing", score: 0, maxScore: gsbMax, status: "danger", details: `Threats detected: ${googleSB.threats.join(", ")}` });
    } else {
      factors.push({ name: "Google Safe Browsing", score: 25, maxScore: gsbMax, status: "good", details: "No threats detected" });
      totalScore += 25;
    }
  } else {
    factors.push({ name: "Google Safe Browsing", score: 15, maxScore: gsbMax, status: "warning", details: "Check unavailable" });
    totalScore += 15;
  }

  // Factor 4: VirusTotal (15 points max)
  const vtMax = 15;
  maxPossibleScore += vtMax;
  if (virusTotal?.checked && virusTotal.total > 0) {
    const detectionRate = virusTotal.positives / virusTotal.total;
    let vtScore = 0;
    let vtStatus: "good" | "warning" | "danger" = "good";
    let vtDetails = "";

    if (virusTotal.positives === 0) {
      vtScore = 15;
      vtDetails = `Clean - 0/${virusTotal.total} engines detected threats`;
    } else if (detectionRate < 0.05) {
      vtScore = 10;
      vtStatus = "warning";
      vtDetails = `${virusTotal.positives}/${virusTotal.total} engines flagged (low detection)`;
    } else if (detectionRate < 0.2) {
      vtScore = 5;
      vtStatus = "warning";
      vtDetails = `${virusTotal.positives}/${virusTotal.total} engines flagged (medium detection)`;
    } else {
      vtScore = 0;
      vtStatus = "danger";
      vtDetails = `${virusTotal.positives}/${virusTotal.total} engines flagged (high detection)`;
    }

    totalScore += vtScore;
    factors.push({ name: "VirusTotal Scan", score: vtScore, maxScore: vtMax, status: vtStatus, details: vtDetails });
  } else {
    factors.push({ name: "VirusTotal Scan", score: 8, maxScore: vtMax, status: "warning", details: "Scan unavailable or pending" });
    totalScore += 8;
  }

  // Factor 5: PhishTank (10 points max)
  const ptMax = 10;
  maxPossibleScore += ptMax;
  if (phishTank?.isPhishing === true) {
    factors.push({ name: "PhishTank Database", score: 0, maxScore: ptMax, status: "danger", details: "Listed as phishing site" });
  } else if (phishTank?.isPhishing === false) {
    factors.push({ name: "PhishTank Database", score: 10, maxScore: ptMax, status: "good", details: "Not in phishing database" });
    totalScore += 10;
  } else {
    factors.push({ name: "PhishTank Database", score: 5, maxScore: ptMax, status: "warning", details: "Check unavailable" });
    totalScore += 5;
  }

  // Factor 6: URLhaus (5 points max)
  const uhMax = 5;
  maxPossibleScore += uhMax;
  if (urlhaus?.isMalware === true) {
    factors.push({ name: "URLhaus Malware DB", score: 0, maxScore: uhMax, status: "danger", details: "Listed as malware distribution" });
  } else if (urlhaus?.isMalware === false) {
    factors.push({ name: "URLhaus Malware DB", score: 5, maxScore: uhMax, status: "good", details: "Not in malware database" });
    totalScore += 5;
  } else {
    factors.push({ name: "URLhaus Malware DB", score: 3, maxScore: uhMax, status: "warning", details: "Check unavailable" });
    totalScore += 3;
  }

  // Calculate final score (0-100)
  const score = Math.round((totalScore / maxPossibleScore) * 100);

  // Determine grade
  let grade: "A" | "B" | "C" | "D" | "F";
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  // Generate summary
  let summary = "";
  if (score >= 90) {
    summary = "This website appears trustworthy with strong security indicators.";
  } else if (score >= 75) {
    summary = "This website appears generally safe, but exercise normal caution.";
  } else if (score >= 60) {
    summary = "This website has some concerning indicators. Proceed with caution.";
  } else if (score >= 40) {
    summary = "This website shows multiple warning signs. High caution advised.";
  } else {
    summary = "This website appears unsafe. Avoid sharing personal information.";
  }

  return { score, grade, factors, summary };
}

// QR Code content analysis
export interface QRCodeAnalysisResult {
  content: string;
  contentType: "url" | "text" | "phone" | "email" | "wifi" | "vcard" | "unknown";
  isSuspicious: boolean;
  riskLevel: "low" | "medium" | "high";
  warnings: string[];
  extractedData?: {
    url?: string;
    phone?: string;
    email?: string;
    ssid?: string;
  };
}

export function analyzeQRContent(content: string): QRCodeAnalysisResult {
  const warnings: string[] = [];
  let contentType: QRCodeAnalysisResult["contentType"] = "unknown";
  let isSuspicious = false;
  let riskLevel: "low" | "medium" | "high" = "low";
  const extractedData: QRCodeAnalysisResult["extractedData"] = {};

  // Detect content type
  if (/^https?:\/\//i.test(content)) {
    contentType = "url";
    extractedData.url = content;
    
    // Check for suspicious URL patterns
    try {
      const url = new URL(content);
      
      // IP address instead of domain
      if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) {
        warnings.push("URL uses IP address instead of domain name");
        isSuspicious = true;
        riskLevel = "high";
      }
      
      // Suspicious TLDs
      const suspiciousTlds = ["tk", "ml", "ga", "cf", "gq", "xyz", "top", "club", "buzz", "link"];
      const tld = url.hostname.split(".").pop()?.toLowerCase();
      if (tld && suspiciousTlds.includes(tld)) {
        warnings.push("URL uses a suspicious top-level domain");
        isSuspicious = true;
        riskLevel = riskLevel === "high" ? "high" : "medium";
      }
      
      // URL shorteners
      const shorteners = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd"];
      if (shorteners.some(s => url.hostname.includes(s))) {
        warnings.push("URL shortener detected - destination is hidden");
        isSuspicious = true;
        riskLevel = riskLevel === "high" ? "high" : "medium";
      }
      
      // Encoded characters in path
      if (content.includes("%") && /(%[0-9a-fA-F]{2}){3,}/.test(content)) {
        warnings.push("URL contains suspicious encoded characters");
        isSuspicious = true;
      }
    } catch {
      warnings.push("Invalid URL format");
      isSuspicious = true;
      riskLevel = "high";
    }
  } else if (/^tel:/i.test(content)) {
    contentType = "phone";
    extractedData.phone = content.replace(/^tel:/i, "");
    
    // Check for premium rate numbers
    const phone = extractedData.phone;
    if (/^[\+]?1?(900|976)/.test(phone)) {
      warnings.push("Premium rate phone number - may incur charges");
      isSuspicious = true;
      riskLevel = "medium";
    }
  } else if (/^mailto:/i.test(content)) {
    contentType = "email";
    extractedData.email = content.replace(/^mailto:/i, "").split("?")[0];
  } else if (/^WIFI:/i.test(content)) {
    contentType = "wifi";
    const ssidMatch = content.match(/S:([^;]+)/);
    if (ssidMatch) {
      extractedData.ssid = ssidMatch[1];
    }
    warnings.push("WiFi QR code - connecting may expose your device");
    riskLevel = "medium";
  } else if (/^BEGIN:VCARD/i.test(content)) {
    contentType = "vcard";
  } else if (/^[+\d\s\-\(\)]{7,20}$/.test(content.trim())) {
    contentType = "phone";
    extractedData.phone = content.trim();
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(content.trim())) {
    contentType = "email";
    extractedData.email = content.trim();
  } else {
    contentType = "text";
    
    // Check for suspicious text content
    if (/password|credit.?card|ssn|social.?security|bank.?account/i.test(content)) {
      warnings.push("Text contains references to sensitive information");
      isSuspicious = true;
      riskLevel = "medium";
    }
  }

  return {
    content,
    contentType,
    isSuspicious,
    riskLevel,
    warnings,
    extractedData
  };
}

// Deepfake/AI content detection indicators
export interface DeepfakeIndicators {
  contentType: "image" | "video" | "audio" | "text";
  riskIndicators: {
    indicator: string;
    severity: "low" | "medium" | "high";
    explanation: string;
  }[];
  overallRisk: "low" | "medium" | "high";
  educationalTips: string[];
}

export function getDeepfakeEducation(contentType: "image" | "video" | "audio" | "text"): DeepfakeIndicators {
  const educationalTips: string[] = [];
  const riskIndicators: DeepfakeIndicators["riskIndicators"] = [];

  switch (contentType) {
    case "video":
      educationalTips.push(
        "Look for unnatural blinking patterns or lack of blinking",
        "Check for mismatched lip movements with audio",
        "Watch for inconsistent lighting on the face vs background",
        "Notice if the face edges seem blurry or distorted",
        "Look for unnatural head movements or posture",
        "Verify the source through official channels before trusting"
      );
      riskIndicators.push(
        { indicator: "Video call requests for money", severity: "high", explanation: "Scammers use deepfakes to impersonate relatives or authority figures" },
        { indicator: "Celebrity endorsements", severity: "medium", explanation: "AI-generated videos of celebrities promoting investments are common scams" },
        { indicator: "Urgent video messages", severity: "medium", explanation: "Deepfakes combined with urgency tactics are red flags" }
      );
      break;

    case "audio":
      educationalTips.push(
        "Be suspicious of calls claiming to be from family in distress",
        "Listen for unnatural pauses or robotic speech patterns",
        "Voice cloning can now mimic someone with just a few seconds of audio",
        "Always verify by calling back on a known number",
        "Create a family code word for emergency situations"
      );
      riskIndicators.push(
        { indicator: "Grandparent scam calls", severity: "high", explanation: "AI voice cloning is used to impersonate grandchildren in distress" },
        { indicator: "CEO fraud calls", severity: "high", explanation: "Voice deepfakes impersonate executives to authorize wire transfers" },
        { indicator: "Automated voice messages", severity: "medium", explanation: "AI-generated voice messages may sound convincing but are fraudulent" }
      );
      break;

    case "image":
      educationalTips.push(
        "Look for distorted backgrounds, especially near edges of faces",
        "Check for inconsistent lighting and shadows",
        "Zoom in on ears, teeth, and jewelry for distortions",
        "Reverse image search to find original versions",
        "AI-generated faces often have asymmetric features"
      );
      riskIndicators.push(
        { indicator: "Romance scam profiles", severity: "high", explanation: "AI generates attractive profile photos for romance scams" },
        { indicator: "Fake testimonials", severity: "medium", explanation: "AI-generated faces are used for fake product reviews" },
        { indicator: "Synthetic ID documents", severity: "high", explanation: "Deepfakes are used to create fake IDs for fraud" }
      );
      break;

    case "text":
      educationalTips.push(
        "AI-generated text may sound plausible but contain factual errors",
        "Watch for unusually perfect grammar in scam messages",
        "AI can mimic writing styles - verify sender identity separately",
        "Phishing emails are increasingly AI-generated and convincing",
        "Check claims independently through official sources"
      );
      riskIndicators.push(
        { indicator: "AI-enhanced phishing", severity: "high", explanation: "AI writes personalized, grammatically perfect phishing emails" },
        { indicator: "Fake news articles", severity: "medium", explanation: "AI can generate convincing but false news stories" },
        { indicator: "Impersonation messages", severity: "high", explanation: "AI mimics writing styles of friends, family, or colleagues" }
      );
      break;
  }

  return {
    contentType,
    riskIndicators,
    overallRisk: "medium",
    educationalTips
  };
}
