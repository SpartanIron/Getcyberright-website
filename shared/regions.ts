// Regional data for cybersecurity resources and threat trends

export interface RegionInfo {
  code: string;
  name: string;
  country: string;
  reportingAgencies: ReportingAgency[];
  helpResources: HelpResource[];
  emergencyContacts: EmergencyContact[];
}

export interface ReportingAgency {
  name: string;
  description: string;
  url: string;
  type: "federal" | "state" | "local" | "international";
}

export interface HelpResource {
  name: string;
  description: string;
  url: string;
  phone?: string;
  category: "fraud" | "identity" | "senior" | "child" | "business" | "general";
}

export interface EmergencyContact {
  name: string;
  phone: string;
  description: string;
}

export interface ThreatTrend {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  region: string;
  category: string;
  reportedCases: number;
  trend: "rising" | "stable" | "declining";
  updatedAt: string;
}

// All regions with comprehensive data
export const ALL_REGION_DATA: Record<string, RegionInfo> = {
  "US": {
    code: "US",
    name: "United States",
    country: "United States",
    reportingAgencies: [
      { name: "FBI Internet Crime Complaint Center (IC3)", description: "Federal cybercrime reporting", url: "https://www.ic3.gov", type: "federal" },
      { name: "FTC Report Fraud", description: "Report scams and fraud", url: "https://reportfraud.ftc.gov", type: "federal" },
      { name: "CISA", description: "Cybersecurity & Infrastructure Security Agency", url: "https://www.cisa.gov/report", type: "federal" },
    ],
    helpResources: [
      { name: "AARP Fraud Watch Network", description: "Free fraud prevention resources for seniors", url: "https://www.aarp.org/money/scams-fraud/", category: "senior" },
      { name: "Identity Theft Resource Center", description: "Free identity theft recovery assistance", url: "https://www.idtheftcenter.org", phone: "1-888-400-5530", category: "identity" },
      { name: "Better Business Bureau", description: "Business verification and scam tracking", url: "https://www.bbb.org", category: "general" },
      { name: "National Center for Missing & Exploited Children", description: "Child online safety", url: "https://www.missingkids.org", category: "child" },
      { name: "Small Business Administration", description: "Cybersecurity resources for businesses", url: "https://www.sba.gov/business-guide/manage-your-business/strengthen-your-cybersecurity", category: "business" },
    ],
    emergencyContacts: [
      { name: "National Elder Fraud Hotline", phone: "1-833-FRAUD-11", description: "24/7 support for seniors" },
      { name: "Identity Theft Hotline", phone: "1-877-438-4338", description: "FTC identity theft support" },
      { name: "CyberTipline", phone: "1-800-843-5678", description: "Report child exploitation" },
      { name: "Medicare Fraud Hotline", phone: "1-800-MEDICARE", description: "Report Medicare scams" },
    ],
  },
  "UK": {
    code: "UK",
    name: "United Kingdom",
    country: "United Kingdom",
    reportingAgencies: [
      { name: "Action Fraud", description: "UK's national fraud reporting centre", url: "https://www.actionfraud.police.uk", type: "federal" },
      { name: "National Cyber Security Centre", description: "UK cybersecurity guidance", url: "https://www.ncsc.gov.uk", type: "federal" },
    ],
    helpResources: [
      { name: "Age UK Scam Prevention", description: "Scam protection for older adults", url: "https://www.ageuk.org.uk/information-advice/money-legal/scams-fraud/", category: "senior" },
      { name: "Citizens Advice", description: "Free consumer advice", url: "https://www.citizensadvice.org.uk", category: "general" },
      { name: "Get Safe Online", description: "Free internet safety advice", url: "https://www.getsafeonline.org", category: "general" },
    ],
    emergencyContacts: [
      { name: "Action Fraud", phone: "0300 123 2040", description: "Report fraud 24/7" },
      { name: "NCSC Report", phone: "Online only", description: "report@phishing.gov.uk" },
    ],
  },
  "CA": {
    code: "CA",
    name: "Canada",
    country: "Canada",
    reportingAgencies: [
      { name: "Canadian Anti-Fraud Centre", description: "National fraud reporting", url: "https://www.antifraudcentre-centreantifraude.ca", type: "federal" },
      { name: "RCMP Cybercrime", description: "Royal Canadian Mounted Police", url: "https://www.rcmp-grc.gc.ca/en/cyber-crime", type: "federal" },
    ],
    helpResources: [
      { name: "Canadian Centre for Cyber Security", description: "Government cybersecurity resources", url: "https://www.cyber.gc.ca", category: "general" },
      { name: "Competition Bureau", description: "Consumer protection and fraud", url: "https://www.competitionbureau.gc.ca", category: "fraud" },
    ],
    emergencyContacts: [
      { name: "Canadian Anti-Fraud Centre", phone: "1-888-495-8501", description: "Report fraud" },
      { name: "Cyber Centre", phone: "1-833-CYBER-88", description: "Cyber incidents" },
    ],
  },
  "AU": {
    code: "AU",
    name: "Australia",
    country: "Australia",
    reportingAgencies: [
      { name: "Scamwatch", description: "Australian Competition & Consumer Commission", url: "https://www.scamwatch.gov.au", type: "federal" },
      { name: "Australian Cyber Security Centre", description: "Government cyber security", url: "https://www.cyber.gov.au", type: "federal" },
      { name: "ReportCyber", description: "Report cybercrime", url: "https://www.cyber.gov.au/report", type: "federal" },
    ],
    helpResources: [
      { name: "IDCARE", description: "Identity and cyber support service", url: "https://www.idcare.org", phone: "1800 595 160", category: "identity" },
      { name: "eSafety Commissioner", description: "Online safety resources", url: "https://www.esafety.gov.au", category: "general" },
    ],
    emergencyContacts: [
      { name: "Scamwatch", phone: "1300 795 995", description: "Report scams" },
      { name: "IDCARE", phone: "1800 595 160", description: "Identity theft support" },
    ],
  },
  "EU": {
    code: "EU",
    name: "European Union",
    country: "European Union",
    reportingAgencies: [
      { name: "Europol EC3", description: "European Cybercrime Centre", url: "https://www.europol.europa.eu/about-europol/european-cybercrime-centre-ec3", type: "international" },
      { name: "ENISA", description: "EU Agency for Cybersecurity", url: "https://www.enisa.europa.eu", type: "international" },
    ],
    helpResources: [
      { name: "European Consumer Centres Network", description: "Cross-border consumer help", url: "https://ec.europa.eu/info/live-work-travel-eu/consumer-rights-and-complaints/resolve-your-consumer-complaint/european-consumer-centres-network-ecc-net_en", category: "general" },
      { name: "ENISA Awareness", description: "Cybersecurity awareness resources", url: "https://www.enisa.europa.eu/topics/cybersecurity-education", category: "general" },
    ],
    emergencyContacts: [
      { name: "Contact local authority", phone: "Varies by country", description: "Check with your national CERT" },
    ],
  },
  "AF": {
    code: "AF",
    name: "Africa",
    country: "Africa",
    reportingAgencies: [
      { name: "INTERPOL African Cybercrime", description: "International cybercrime coordination for Africa", url: "https://www.interpol.int/en/Crimes/Cybercrime", type: "international" },
      { name: "African Union Cybersecurity", description: "AU Convention on Cyber Security", url: "https://au.int/en/treaties/african-union-convention-cyber-security-and-personal-data-protection", type: "international" },
    ],
    helpResources: [
      { name: "AfricaCERT", description: "African Computer Emergency Response Team coordination", url: "https://www.africacert.org", category: "general" },
      { name: "INTERPOL I-24/7", description: "Secure global police network", url: "https://www.interpol.int", category: "general" },
      { name: "ITU Cybersecurity for Africa", description: "UN agency cybersecurity resources", url: "https://www.itu.int/en/ITU-D/Cybersecurity/Pages/default.aspx", category: "general" },
    ],
    emergencyContacts: [
      { name: "Contact local police", phone: "Varies by country", description: "Report to local law enforcement" },
      { name: "INTERPOL", phone: "Contact local NCB", description: "National Central Bureau in your country" },
    ],
  },
};

// Default/fallback region
export const DEFAULT_REGION: RegionInfo = {
  code: "GLOBAL",
  name: "Global",
  country: "International",
  reportingAgencies: [
    { name: "FBI IC3", description: "International cybercrime reporting", url: "https://www.ic3.gov", type: "international" },
    { name: "Europol EC3", description: "European Cybercrime Centre", url: "https://www.europol.europa.eu/about-europol/european-cybercrime-centre-ec3", type: "international" },
    { name: "INTERPOL Cybercrime", description: "Global law enforcement coordination", url: "https://www.interpol.int/en/Crimes/Cybercrime", type: "international" },
  ],
  helpResources: [
    { name: "CISA", description: "Cybersecurity resources and guidance", url: "https://www.cisa.gov", category: "general" },
    { name: "Have I Been Pwned", description: "Check if your data was breached", url: "https://haveibeenpwned.com", category: "identity" },
    { name: "No More Ransom", description: "Ransomware decryption tools", url: "https://www.nomoreransom.org", category: "general" },
  ],
  emergencyContacts: [
    { name: "Contact local authorities", phone: "Varies", description: "Report to your local law enforcement" },
  ],
};

// Threat trends by region
export const THREAT_TRENDS: ThreatTrend[] = [
  // United States
  { id: "tt-1", title: "AI Voice Clone Scams", description: "Scammers using AI to clone family members' voices in emergency scams", severity: "critical", region: "US", category: "AI/Deepfake", reportedCases: 12500, trend: "rising", updatedAt: "2026-01-30" },
  { id: "tt-2", title: "Medicare Enrollment Fraud", description: "Fake Medicare representatives collecting personal information", severity: "high", region: "US", category: "Healthcare", reportedCases: 8400, trend: "stable", updatedAt: "2026-01-28" },
  { id: "tt-3", title: "Grandparent Scams", description: "Callers impersonating grandchildren in distress", severity: "critical", region: "US", category: "Impersonation", reportedCases: 15200, trend: "rising", updatedAt: "2026-01-30" },
  { id: "tt-4", title: "Tech Support Scams", description: "Fake Microsoft/Apple support collecting remote access", severity: "high", region: "US", category: "Tech Support", reportedCases: 21000, trend: "stable", updatedAt: "2026-01-29" },
  { id: "tt-5", title: "Cryptocurrency Investment Fraud", description: "Fake crypto trading platforms stealing investments", severity: "critical", region: "US", category: "Investment", reportedCases: 9800, trend: "rising", updatedAt: "2026-01-30" },
  
  // UK
  { id: "tt-6", title: "HMRC Tax Refund Scams", description: "Fake tax authority emails claiming refunds", severity: "high", region: "UK", category: "Government", reportedCases: 8900, trend: "stable", updatedAt: "2026-01-28" },
  { id: "tt-7", title: "Royal Mail Delivery Scams", description: "Fake delivery fee requests via SMS", severity: "medium", region: "UK", category: "Delivery", reportedCases: 5600, trend: "declining", updatedAt: "2026-01-26" },
  
  // Canada
  { id: "tt-8", title: "CRA Tax Scams", description: "Fake Canada Revenue Agency threatening arrest", severity: "high", region: "CA", category: "Government", reportedCases: 3400, trend: "stable", updatedAt: "2026-01-29" },
  { id: "tt-9", title: "SIM Swap Fraud", description: "Phone number hijacking for account takeover", severity: "high", region: "CA", category: "Identity", reportedCases: 1800, trend: "rising", updatedAt: "2026-01-30" },
  
  // Australia
  { id: "tt-10", title: "Flubot Malware", description: "SMS-based Android malware spreading rapidly", severity: "critical", region: "AU", category: "Malware", reportedCases: 2100, trend: "declining", updatedAt: "2026-01-27" },
  { id: "tt-11", title: "NBN Impersonation Scams", description: "Fake internet provider demanding payment", severity: "high", region: "AU", category: "Impersonation", reportedCases: 3200, trend: "stable", updatedAt: "2026-01-28" },
  
  // EU
  { id: "tt-12", title: "GDPR Fine Scams", description: "Fake GDPR compliance fines targeting businesses", severity: "medium", region: "EU", category: "Business", reportedCases: 1200, trend: "stable", updatedAt: "2026-01-28" },
  { id: "tt-13", title: "Energy Bill Scams", description: "Fake energy rebate offers stealing bank details", severity: "high", region: "EU", category: "Utility", reportedCases: 4500, trend: "rising", updatedAt: "2026-01-30" },
  
  // Africa
  { id: "tt-14", title: "Advance Fee Fraud", description: "Requests for upfront payment promising large returns", severity: "critical", region: "AF", category: "Fraud", reportedCases: 18000, trend: "stable", updatedAt: "2026-01-30" },
  { id: "tt-15", title: "Mobile Money Scams", description: "Fraudulent mobile payment requests and SIM swaps", severity: "critical", region: "AF", category: "Financial", reportedCases: 25000, trend: "rising", updatedAt: "2026-01-30" },
  { id: "tt-16", title: "Employment Scams", description: "Fake job offers requiring payment for processing", severity: "high", region: "AF", category: "Employment", reportedCases: 8500, trend: "rising", updatedAt: "2026-01-29" },
  { id: "tt-17", title: "Romance Scams", description: "Online dating fraud targeting international victims", severity: "high", region: "AF", category: "Romance", reportedCases: 12000, trend: "stable", updatedAt: "2026-01-28" },
  
  // Global
  { id: "tt-18", title: "Romance Scams", description: "Long-term relationship fraud on dating apps", severity: "critical", region: "GLOBAL", category: "Romance", reportedCases: 45000, trend: "rising", updatedAt: "2026-01-30" },
  { id: "tt-19", title: "Business Email Compromise", description: "Spoofed executive emails requesting wire transfers", severity: "critical", region: "GLOBAL", category: "Business", reportedCases: 21000, trend: "rising", updatedAt: "2026-01-30" },
];

// All available regions for selector
export const ALL_REGIONS = [
  { code: "US", name: "United States", country: "United States" },
  { code: "UK", name: "United Kingdom", country: "United Kingdom" },
  { code: "CA", name: "Canada", country: "Canada" },
  { code: "AU", name: "Australia", country: "Australia" },
  { code: "EU", name: "European Union", country: "European Union" },
  { code: "AF", name: "Africa", country: "Africa" },
  { code: "GLOBAL", name: "Global / Other", country: "International" },
];

// Helper to get region by code
export function getRegionByCode(code: string): RegionInfo {
  return ALL_REGION_DATA[code] || DEFAULT_REGION;
}

// Helper to get threats by region
export function getThreatsByRegion(regionCode: string): ThreatTrend[] {
  const regionalThreats = THREAT_TRENDS.filter(t => t.region === regionCode);
  const globalThreats = THREAT_TRENDS.filter(t => t.region === "GLOBAL");
  return [...regionalThreats, ...globalThreats].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });
}

// Map country codes to regions
export const COUNTRY_TO_REGION: Record<string, string> = {
  // North America
  US: "US",
  GB: "UK",
  CA: "CA",
  AU: "AU",
  // EU countries
  AT: "EU", BE: "EU", BG: "EU", HR: "EU", CY: "EU", CZ: "EU",
  DK: "EU", EE: "EU", FI: "EU", FR: "EU", DE: "EU", GR: "EU",
  HU: "EU", IE: "EU", IT: "EU", LV: "EU", LT: "EU", LU: "EU",
  MT: "EU", NL: "EU", PL: "EU", PT: "EU", RO: "EU", SK: "EU",
  SI: "EU", ES: "EU", SE: "EU",
  // African countries
  DZ: "AF", AO: "AF", BJ: "AF", BW: "AF", BF: "AF", BI: "AF",
  CV: "AF", CM: "AF", CF: "AF", TD: "AF", KM: "AF", CG: "AF",
  CD: "AF", CI: "AF", DJ: "AF", EG: "AF", GQ: "AF", ER: "AF",
  SZ: "AF", ET: "AF", GA: "AF", GM: "AF", GH: "AF", GN: "AF",
  GW: "AF", KE: "AF", LS: "AF", LR: "AF", LY: "AF", MG: "AF",
  MW: "AF", ML: "AF", MR: "AF", MU: "AF", MA: "AF", MZ: "AF",
  NA: "AF", NE: "AF", NG: "AF", RW: "AF", ST: "AF", SN: "AF",
  SC: "AF", SL: "AF", SO: "AF", ZA: "AF", SS: "AF", SD: "AF",
  TZ: "AF", TG: "AF", TN: "AF", UG: "AF", ZM: "AF", ZW: "AF",
};
