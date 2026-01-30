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

// US Regions with comprehensive data
export const US_REGIONS: Record<string, RegionInfo> = {
  "US-NORTHEAST": {
    code: "US-NORTHEAST",
    name: "Northeast",
    country: "United States",
    reportingAgencies: [
      { name: "FBI Internet Crime Complaint Center (IC3)", description: "Federal cybercrime reporting", url: "https://www.ic3.gov", type: "federal" },
      { name: "FTC Report Fraud", description: "Report scams and fraud", url: "https://reportfraud.ftc.gov", type: "federal" },
      { name: "NY Attorney General", description: "New York state consumer protection", url: "https://ag.ny.gov/consumer-frauds/filing-consumer-complaint", type: "state" },
    ],
    helpResources: [
      { name: "AARP Fraud Watch Network", description: "Free fraud prevention resources for seniors", url: "https://www.aarp.org/money/scams-fraud/", category: "senior" },
      { name: "Identity Theft Resource Center", description: "Free identity theft recovery assistance", url: "https://www.idtheftcenter.org", phone: "1-888-400-5530", category: "identity" },
      { name: "Better Business Bureau", description: "Business verification and scam tracking", url: "https://www.bbb.org", category: "general" },
    ],
    emergencyContacts: [
      { name: "National Elder Fraud Hotline", phone: "1-833-FRAUD-11", description: "24/7 support for seniors" },
      { name: "Identity Theft Hotline", phone: "1-877-438-4338", description: "FTC identity theft support" },
    ],
  },
  "US-SOUTHEAST": {
    code: "US-SOUTHEAST",
    name: "Southeast",
    country: "United States",
    reportingAgencies: [
      { name: "FBI IC3", description: "Federal cybercrime reporting", url: "https://www.ic3.gov", type: "federal" },
      { name: "FTC Report Fraud", description: "Report scams and fraud", url: "https://reportfraud.ftc.gov", type: "federal" },
      { name: "Florida AG Consumer Protection", description: "Florida state consumer protection", url: "https://www.myfloridalegal.com/consumer-protection", type: "state" },
    ],
    helpResources: [
      { name: "AARP Fraud Watch Network", description: "Free fraud prevention resources", url: "https://www.aarp.org/money/scams-fraud/", category: "senior" },
      { name: "Identity Theft Resource Center", description: "Free identity theft recovery", url: "https://www.idtheftcenter.org", phone: "1-888-400-5530", category: "identity" },
      { name: "Small Business Administration", description: "Cybersecurity resources for businesses", url: "https://www.sba.gov/business-guide/manage-your-business/strengthen-your-cybersecurity", category: "business" },
    ],
    emergencyContacts: [
      { name: "National Elder Fraud Hotline", phone: "1-833-FRAUD-11", description: "24/7 support for seniors" },
      { name: "Medicare Fraud Hotline", phone: "1-800-MEDICARE", description: "Report Medicare scams" },
    ],
  },
  "US-MIDWEST": {
    code: "US-MIDWEST",
    name: "Midwest",
    country: "United States",
    reportingAgencies: [
      { name: "FBI IC3", description: "Federal cybercrime reporting", url: "https://www.ic3.gov", type: "federal" },
      { name: "FTC Report Fraud", description: "Report scams and fraud", url: "https://reportfraud.ftc.gov", type: "federal" },
      { name: "Illinois AG Consumer Protection", description: "Illinois consumer protection", url: "https://www.illinoisattorneygeneral.gov/consumers", type: "state" },
    ],
    helpResources: [
      { name: "AARP Fraud Watch Network", description: "Free fraud prevention resources", url: "https://www.aarp.org/money/scams-fraud/", category: "senior" },
      { name: "Cyber Readiness Institute", description: "Free cybersecurity resources for SMBs", url: "https://cyberreadinessinstitute.org", category: "business" },
      { name: "National Center for Missing & Exploited Children", description: "Child online safety", url: "https://www.missingkids.org", category: "child" },
    ],
    emergencyContacts: [
      { name: "National Elder Fraud Hotline", phone: "1-833-FRAUD-11", description: "24/7 support for seniors" },
      { name: "CyberTipline", phone: "1-800-843-5678", description: "Report child exploitation" },
    ],
  },
  "US-SOUTHWEST": {
    code: "US-SOUTHWEST",
    name: "Southwest",
    country: "United States",
    reportingAgencies: [
      { name: "FBI IC3", description: "Federal cybercrime reporting", url: "https://www.ic3.gov", type: "federal" },
      { name: "FTC Report Fraud", description: "Report scams and fraud", url: "https://reportfraud.ftc.gov", type: "federal" },
      { name: "Texas AG Consumer Protection", description: "Texas consumer protection", url: "https://www.texasattorneygeneral.gov/consumer-protection", type: "state" },
    ],
    helpResources: [
      { name: "AARP Fraud Watch Network", description: "Free fraud prevention resources", url: "https://www.aarp.org/money/scams-fraud/", category: "senior" },
      { name: "Identity Theft Resource Center", description: "Free identity theft recovery", url: "https://www.idtheftcenter.org", phone: "1-888-400-5530", category: "identity" },
      { name: "CISA Cybersecurity Resources", description: "Federal cybersecurity guidance", url: "https://www.cisa.gov/topics/cybersecurity-best-practices", category: "general" },
    ],
    emergencyContacts: [
      { name: "National Elder Fraud Hotline", phone: "1-833-FRAUD-11", description: "24/7 support for seniors" },
      { name: "Social Security Fraud Hotline", phone: "1-800-269-0271", description: "Report SS fraud" },
    ],
  },
  "US-WEST": {
    code: "US-WEST",
    name: "West",
    country: "United States",
    reportingAgencies: [
      { name: "FBI IC3", description: "Federal cybercrime reporting", url: "https://www.ic3.gov", type: "federal" },
      { name: "FTC Report Fraud", description: "Report scams and fraud", url: "https://reportfraud.ftc.gov", type: "federal" },
      { name: "California AG Consumer Protection", description: "California consumer protection", url: "https://oag.ca.gov/consumers", type: "state" },
    ],
    helpResources: [
      { name: "AARP Fraud Watch Network", description: "Free fraud prevention resources", url: "https://www.aarp.org/money/scams-fraud/", category: "senior" },
      { name: "Privacy Rights Clearinghouse", description: "Consumer privacy and identity theft", url: "https://privacyrights.org", category: "identity" },
      { name: "Cybersecurity & Infrastructure Security Agency", description: "Federal cybersecurity resources", url: "https://www.cisa.gov", category: "general" },
    ],
    emergencyContacts: [
      { name: "National Elder Fraud Hotline", phone: "1-833-FRAUD-11", description: "24/7 support for seniors" },
      { name: "CA Dept of Justice Consumer Line", phone: "1-800-952-5225", description: "CA consumer complaints" },
    ],
  },
};

// International regions
export const INTERNATIONAL_REGIONS: Record<string, RegionInfo> = {
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
};

// Default/fallback region
export const DEFAULT_REGION: RegionInfo = {
  code: "GLOBAL",
  name: "Global",
  country: "International",
  reportingAgencies: [
    { name: "FBI IC3", description: "International cybercrime reporting", url: "https://www.ic3.gov", type: "international" },
    { name: "Europol EC3", description: "European Cybercrime Centre", url: "https://www.europol.europa.eu/about-europol/european-cybercrime-centre-ec3", type: "international" },
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

// Sample threat trends by region
export const THREAT_TRENDS: ThreatTrend[] = [
  // US Northeast
  { id: "tt-1", title: "AI Voice Clone Scams", description: "Scammers using AI to clone family members' voices in emergency scams", severity: "critical", region: "US-NORTHEAST", category: "AI/Deepfake", reportedCases: 2340, trend: "rising", updatedAt: "2026-01-30" },
  { id: "tt-2", title: "Medicare Enrollment Fraud", description: "Fake Medicare representatives collecting personal information", severity: "high", region: "US-NORTHEAST", category: "Healthcare", reportedCases: 1850, trend: "stable", updatedAt: "2026-01-28" },
  { id: "tt-3", title: "Utility Payment Scams", description: "Threats of service disconnection demanding immediate payment", severity: "medium", region: "US-NORTHEAST", category: "Impersonation", reportedCases: 980, trend: "declining", updatedAt: "2026-01-25" },
  
  // US Southeast
  { id: "tt-4", title: "Hurricane Relief Fraud", description: "Fake charities soliciting disaster relief donations", severity: "high", region: "US-SOUTHEAST", category: "Charity", reportedCases: 1520, trend: "stable", updatedAt: "2026-01-29" },
  { id: "tt-5", title: "Vacation Rental Scams", description: "Fake property listings stealing deposits", severity: "high", region: "US-SOUTHEAST", category: "Fraud", reportedCases: 890, trend: "rising", updatedAt: "2026-01-30" },
  
  // US Midwest
  { id: "tt-6", title: "Farm Equipment Scams", description: "Fraudulent sales of agricultural equipment", severity: "medium", region: "US-MIDWEST", category: "Commerce", reportedCases: 420, trend: "stable", updatedAt: "2026-01-27" },
  { id: "tt-7", title: "Grandparent Scams", description: "Callers impersonating grandchildren in distress", severity: "critical", region: "US-MIDWEST", category: "Impersonation", reportedCases: 3100, trend: "rising", updatedAt: "2026-01-30" },
  
  // US Southwest
  { id: "tt-8", title: "Immigration Scams", description: "Fake government officials demanding payments", severity: "high", region: "US-SOUTHWEST", category: "Government", reportedCases: 1890, trend: "stable", updatedAt: "2026-01-28" },
  { id: "tt-9", title: "Cryptocurrency Investment Fraud", description: "Fake crypto trading platforms stealing investments", severity: "critical", region: "US-SOUTHWEST", category: "Investment", reportedCases: 2780, trend: "rising", updatedAt: "2026-01-30" },
  
  // US West
  { id: "tt-10", title: "Tech Support Scams", description: "Fake Microsoft/Apple support collecting remote access", severity: "high", region: "US-WEST", category: "Tech Support", reportedCases: 4200, trend: "stable", updatedAt: "2026-01-29" },
  { id: "tt-11", title: "Employment Scams", description: "Fake job offers requesting personal information", severity: "high", region: "US-WEST", category: "Employment", reportedCases: 1650, trend: "rising", updatedAt: "2026-01-30" },
  
  // UK
  { id: "tt-12", title: "HMRC Tax Refund Scams", description: "Fake tax authority emails claiming refunds", severity: "high", region: "UK", category: "Government", reportedCases: 8900, trend: "stable", updatedAt: "2026-01-28" },
  { id: "tt-13", title: "Royal Mail Delivery Scams", description: "Fake delivery fee requests via SMS", severity: "medium", region: "UK", category: "Delivery", reportedCases: 5600, trend: "declining", updatedAt: "2026-01-26" },
  
  // Canada
  { id: "tt-14", title: "CRA Tax Scams", description: "Fake Canada Revenue Agency threatening arrest", severity: "high", region: "CA", category: "Government", reportedCases: 3400, trend: "stable", updatedAt: "2026-01-29" },
  
  // Australia
  { id: "tt-15", title: "Flubot Malware", description: "SMS-based Android malware spreading rapidly", severity: "critical", region: "AU", category: "Malware", reportedCases: 2100, trend: "declining", updatedAt: "2026-01-27" },
  
  // EU
  { id: "tt-16", title: "GDPR Fine Scams", description: "Fake GDPR compliance fines targeting businesses", severity: "medium", region: "EU", category: "Business", reportedCases: 1200, trend: "stable", updatedAt: "2026-01-28" },
  
  // Global
  { id: "tt-17", title: "Romance Scams", description: "Long-term relationship fraud on dating apps", severity: "critical", region: "GLOBAL", category: "Romance", reportedCases: 45000, trend: "rising", updatedAt: "2026-01-30" },
  { id: "tt-18", title: "Business Email Compromise", description: "Spoofed executive emails requesting wire transfers", severity: "critical", region: "GLOBAL", category: "Business", reportedCases: 21000, trend: "rising", updatedAt: "2026-01-30" },
];

// All available regions for selector
export const ALL_REGIONS = [
  { code: "US-NORTHEAST", name: "US - Northeast", country: "United States" },
  { code: "US-SOUTHEAST", name: "US - Southeast", country: "United States" },
  { code: "US-MIDWEST", name: "US - Midwest", country: "United States" },
  { code: "US-SOUTHWEST", name: "US - Southwest", country: "United States" },
  { code: "US-WEST", name: "US - West", country: "United States" },
  { code: "UK", name: "United Kingdom", country: "United Kingdom" },
  { code: "CA", name: "Canada", country: "Canada" },
  { code: "AU", name: "Australia", country: "Australia" },
  { code: "EU", name: "European Union", country: "European Union" },
  { code: "GLOBAL", name: "Global / Other", country: "International" },
];

// Helper to get region by code
export function getRegionByCode(code: string): RegionInfo {
  return US_REGIONS[code] || INTERNATIONAL_REGIONS[code] || DEFAULT_REGION;
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

// Map US state abbreviations to regions
export const US_STATE_TO_REGION: Record<string, string> = {
  // Northeast
  CT: "US-NORTHEAST", DE: "US-NORTHEAST", MA: "US-NORTHEAST", MD: "US-NORTHEAST",
  ME: "US-NORTHEAST", NH: "US-NORTHEAST", NJ: "US-NORTHEAST", NY: "US-NORTHEAST",
  PA: "US-NORTHEAST", RI: "US-NORTHEAST", VT: "US-NORTHEAST", DC: "US-NORTHEAST",
  // Southeast
  AL: "US-SOUTHEAST", AR: "US-SOUTHEAST", FL: "US-SOUTHEAST", GA: "US-SOUTHEAST",
  KY: "US-SOUTHEAST", LA: "US-SOUTHEAST", MS: "US-SOUTHEAST", NC: "US-SOUTHEAST",
  SC: "US-SOUTHEAST", TN: "US-SOUTHEAST", VA: "US-SOUTHEAST", WV: "US-SOUTHEAST",
  // Midwest
  IA: "US-MIDWEST", IL: "US-MIDWEST", IN: "US-MIDWEST", KS: "US-MIDWEST",
  MI: "US-MIDWEST", MN: "US-MIDWEST", MO: "US-MIDWEST", ND: "US-MIDWEST",
  NE: "US-MIDWEST", OH: "US-MIDWEST", SD: "US-MIDWEST", WI: "US-MIDWEST",
  // Southwest
  AZ: "US-SOUTHWEST", NM: "US-SOUTHWEST", OK: "US-SOUTHWEST", TX: "US-SOUTHWEST",
  // West
  AK: "US-WEST", CA: "US-WEST", CO: "US-WEST", HI: "US-WEST", ID: "US-WEST",
  MT: "US-WEST", NV: "US-WEST", OR: "US-WEST", UT: "US-WEST", WA: "US-WEST", WY: "US-WEST",
};

// Map country codes to regions
export const COUNTRY_TO_REGION: Record<string, string> = {
  US: "US-NORTHEAST", // Default, will be refined by state
  GB: "UK",
  CA: "CA",
  AU: "AU",
  // EU countries
  AT: "EU", BE: "EU", BG: "EU", HR: "EU", CY: "EU", CZ: "EU",
  DK: "EU", EE: "EU", FI: "EU", FR: "EU", DE: "EU", GR: "EU",
  HU: "EU", IE: "EU", IT: "EU", LV: "EU", LT: "EU", LU: "EU",
  MT: "EU", NL: "EU", PL: "EU", PT: "EU", RO: "EU", SK: "EU",
  SI: "EU", ES: "EU", SE: "EU",
};
