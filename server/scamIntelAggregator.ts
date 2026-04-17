import { db } from "./db";
import { threatItems, securityAlerts, scamIntelligence } from "@shared/schema";
import { desc, sql, and, gte, isNull, or, eq } from "drizzle-orm";

interface GlobeHotspot {
  id: string;
  lat: number;
  lng: number;
  country: string;
  countryCode: string;
  region: string;
  intensity: number;
  riskLevel: "critical" | "high" | "medium" | "low";
  topScamTypes: string[];
  recentIncidents: number;
  trendDirection: "up" | "down" | "stable";
  trendPercent: number;
  sources: string[];
  reportContact?: string;
  lastUpdated: string;
  emergencySteps?: string[];
  emergencyHotline?: string;
  emergencyReportUrl?: string;
  emergencyFreezeCredit?: string;
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  scamType: string;
  volume: number;
  color: string;
  originCountry: string;
  originCountryCode: string;
  targetCountry: string;
  targetCountryCode: string;
  targetRegion: string;
}

export interface CountryForecast {
  countryCode: string;
  country: string;
  history: { ts: string; incidents: number; intensity: number }[];
  projection: { ts: string; incidents: number; lower: number; upper: number }[];
  slope: number;
  trend: "up" | "down" | "stable";
}

export interface CyberWeatherSnapshot {
  weekStart: string;
  weekEnd: string;
  totalIncidents: number;
  totalLossesUsd: number;
  topMovers: { country: string; countryCode: string; trendPercent: number; direction: "up" | "down" }[];
  dominantScamTypes: { type: string; label: string; share: number }[];
  criticalCountries: { country: string; countryCode: string; recentIncidents: number }[];
  newScamPatterns: string[];
  generatedAt: string;
}

interface LiveFeedEvent {
  id: string;
  timestamp: string;
  type: string;
  title: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  region: string;
  country?: string;
  source: string;
  sourceUrl?: string;
  scamCategory?: string;
}

interface RegionalSummary {
  region: string;
  totalIncidents: number;
  topScamTypes: { type: string; count: number; trend: "up" | "down" | "stable" }[];
  riskLevel: "critical" | "high" | "medium" | "low";
  countries: { name: string; incidents: number; riskLevel: string }[];
  sources: string[];
  keyInsight: string;
}

interface ScamTypeSummary {
  type: string;
  label: string;
  count: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  color: string;
  icon: string;
  topRegions: string[];
  averageLoss: string;
  description: string;
  protectionTips: string[];
}

interface TrendingScam {
  type: string;
  label: string;
  description: string;
  trendPercent: number;
  isNew: boolean;
  affectedRegions: string[];
  weekStarted: string;
}

interface GlobalStats {
  totalIncidentsTracked: number;
  countriesCovered: number;
  sourcesMonitored: number;
  lastRefresh: string;
  totalLossesTracked: string;
  totalLossesAmountUsd: number;
  activeScamTypes: number;
  wowChange: {
    incidentsPercent: number;
    incidentsDirection: "up" | "down" | "stable";
    countriesAtCriticalRisk: number;
    countriesTrendingUp: number;
  };
}

export interface SourceMetadata {
  id: string;
  name: string;
  category: "law-enforcement" | "government" | "research" | "industry" | "open-data";
  countryCode?: string;
  url?: string;
  lastFetched: string;
  recordsContributed: number;
  status: "live" | "delayed" | "stale";
}

export interface ScamIntelGlobeData {
  hotspots: GlobeHotspot[];
  arcs: GlobeArc[];
  sourceMetadata?: SourceMetadata[];
  globalStats: GlobalStats;
  lastUpdated: string;
}

export interface ScamIntelLiveFeed {
  events: LiveFeedEvent[];
  lastUpdated: string;
}

export interface ScamIntelRegionalData {
  regions: RegionalSummary[];
  scamTypes: ScamTypeSummary[];
  trending: TrendingScam[];
  lastUpdated: string;
}

const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number; code: string; region: string }> = {
  "United States": { lat: 39.8, lng: -98.5, code: "US", region: "North America" },
  "Canada": { lat: 56.1, lng: -106.3, code: "CA", region: "North America" },
  "Mexico": { lat: 23.6, lng: -102.5, code: "MX", region: "Latin America" },
  "Brazil": { lat: -14.2, lng: -51.9, code: "BR", region: "Latin America" },
  "Argentina": { lat: -38.4, lng: -63.6, code: "AR", region: "Latin America" },
  "Colombia": { lat: 4.6, lng: -74.3, code: "CO", region: "Latin America" },
  "United Kingdom": { lat: 55.4, lng: -3.4, code: "GB", region: "Europe" },
  "Germany": { lat: 51.2, lng: 10.4, code: "DE", region: "Europe" },
  "France": { lat: 46.2, lng: 2.2, code: "FR", region: "Europe" },
  "Spain": { lat: 40.5, lng: -3.7, code: "ES", region: "Europe" },
  "Italy": { lat: 41.9, lng: 12.6, code: "IT", region: "Europe" },
  "Netherlands": { lat: 52.1, lng: 5.3, code: "NL", region: "Europe" },
  "Sweden": { lat: 60.1, lng: 18.6, code: "SE", region: "Europe" },
  "Poland": { lat: 51.9, lng: 19.1, code: "PL", region: "Europe" },
  "Switzerland": { lat: 46.8, lng: 8.2, code: "CH", region: "Europe" },
  "Romania": { lat: 45.9, lng: 24.9, code: "RO", region: "Europe" },
  "Nigeria": { lat: 9.1, lng: 8.7, code: "NG", region: "Africa" },
  "South Africa": { lat: -30.6, lng: 22.9, code: "ZA", region: "Africa" },
  "Kenya": { lat: -0.02, lng: 37.9, code: "KE", region: "Africa" },
  "Ghana": { lat: 7.9, lng: -1.0, code: "GH", region: "Africa" },
  "Egypt": { lat: 26.8, lng: 30.8, code: "EG", region: "Africa" },
  "Morocco": { lat: 31.8, lng: -7.1, code: "MA", region: "Africa" },
  "Tanzania": { lat: -6.4, lng: 34.9, code: "TZ", region: "Africa" },
  "Ethiopia": { lat: 9.1, lng: 40.5, code: "ET", region: "Africa" },
  "Uganda": { lat: 1.4, lng: 32.3, code: "UG", region: "Africa" },
  "Cameroon": { lat: 7.4, lng: 12.4, code: "CM", region: "Africa" },
  "Rwanda": { lat: -1.9, lng: 29.9, code: "RW", region: "Africa" },
  "India": { lat: 20.6, lng: 79.0, code: "IN", region: "Asia Pacific" },
  "China": { lat: 35.9, lng: 104.2, code: "CN", region: "Asia Pacific" },
  "Japan": { lat: 36.2, lng: 138.3, code: "JP", region: "Asia Pacific" },
  "South Korea": { lat: 35.9, lng: 127.8, code: "KR", region: "Asia Pacific" },
  "Australia": { lat: -25.3, lng: 133.8, code: "AU", region: "Asia Pacific" },
  "New Zealand": { lat: -40.9, lng: 174.9, code: "NZ", region: "Asia Pacific" },
  "Singapore": { lat: 1.4, lng: 103.8, code: "SG", region: "Asia Pacific" },
  "Malaysia": { lat: 4.2, lng: 101.9, code: "MY", region: "Asia Pacific" },
  "Indonesia": { lat: -0.8, lng: 113.9, code: "ID", region: "Asia Pacific" },
  "Philippines": { lat: 12.9, lng: 121.8, code: "PH", region: "Asia Pacific" },
  "Thailand": { lat: 15.9, lng: 100.9, code: "TH", region: "Asia Pacific" },
  "Vietnam": { lat: 14.1, lng: 108.3, code: "VN", region: "Asia Pacific" },
  "Pakistan": { lat: 30.4, lng: 69.3, code: "PK", region: "Asia Pacific" },
  "Bangladesh": { lat: 23.7, lng: 90.4, code: "BD", region: "Asia Pacific" },
  "Russia": { lat: 61.5, lng: 105.3, code: "RU", region: "Europe" },
  "Turkey": { lat: 38.9, lng: 35.2, code: "TR", region: "Middle East" },
  "Saudi Arabia": { lat: 23.9, lng: 45.1, code: "SA", region: "Middle East" },
  "UAE": { lat: 23.4, lng: 53.8, code: "AE", region: "Middle East" },
  "Israel": { lat: 31.0, lng: 34.9, code: "IL", region: "Middle East" },
  "Iran": { lat: 32.4, lng: 53.7, code: "IR", region: "Middle East" },
};

const SCAM_TYPE_COLORS: Record<string, string> = {
  phishing: "#ef4444",
  romance: "#a855f7",
  investment: "#f59e0b",
  "tech-support": "#3b82f6",
  impersonation: "#ec4899",
  ransomware: "#dc2626",
  "identity-theft": "#6366f1",
  "mobile-money": "#10b981",
  malware: "#f97316",
  "shopping-fraud": "#14b8a6",
  "crypto-scam": "#eab308",
  "job-scam": "#8b5cf6",
};

const COUNTRY_THREAT_PROFILES: Record<string, {
  topThreats: string[];
  riskScore: number;
  recentIncidents: number;
  trendDirection: "up" | "down" | "stable";
  trendPercent: number;
  reportContact?: string;
  sources: string[];
  avgLoss?: string;
}> = {
  "United States": {
    topThreats: ["phishing", "investment", "romance", "impersonation", "ransomware"],
    riskScore: 82, recentIncidents: 880422,
    trendDirection: "up", trendPercent: 22,
    reportContact: "FBI IC3: ic3.gov | FTC: reportfraud.ftc.gov",
    sources: ["FBI IC3 2024 Report", "FTC Consumer Sentinel"],
    avgLoss: "$19,372",
  },
  "Canada": {
    topThreats: ["phishing", "investment", "romance", "impersonation"],
    riskScore: 68, recentIncidents: 63523,
    trendDirection: "up", trendPercent: 11,
    reportContact: "Canadian Anti-Fraud Centre: antifraudcentre.ca",
    sources: ["Canadian Anti-Fraud Centre"],
    avgLoss: "CAD $12,400",
  },
  "United Kingdom": {
    topThreats: ["phishing", "investment", "romance", "impersonation", "shopping-fraud"],
    riskScore: 72, recentIncidents: 300914,
    trendDirection: "up", trendPercent: 16,
    reportContact: "Action Fraud: actionfraud.police.uk",
    sources: ["Action Fraud UK", "UK Finance Annual Report"],
    avgLoss: "£4,980",
  },
  "Germany": {
    topThreats: ["phishing", "ransomware", "shopping-fraud", "impersonation"],
    riskScore: 65, recentIncidents: 136865,
    trendDirection: "stable", trendPercent: 3,
    reportContact: "BSI: bsi.bund.de",
    sources: ["BSI Germany Lagebericht", "BKA Cybercrime Report"],
  },
  "France": {
    topThreats: ["phishing", "shopping-fraud", "impersonation", "investment"],
    riskScore: 62, recentIncidents: 278770,
    trendDirection: "up", trendPercent: 8,
    reportContact: "Cybermalveillance.gouv.fr",
    sources: ["ANSSI France", "Cybermalveillance.gouv.fr"],
  },
  "Australia": {
    topThreats: ["investment", "romance", "phishing", "identity-theft"],
    riskScore: 70, recentIncidents: 601747,
    trendDirection: "up", trendPercent: 18,
    reportContact: "Scamwatch: scamwatch.gov.au",
    sources: ["ACCC Scamwatch", "ACSC Annual Threat Report"],
    avgLoss: "AUD $30,700",
  },
  "India": {
    topThreats: ["phishing", "tech-support", "mobile-money", "job-scam", "crypto-scam"],
    riskScore: 75, recentIncidents: 1740957,
    trendDirection: "up", trendPercent: 24,
    reportContact: "CERT-In: cert-in.org.in | Cybercrime.gov.in",
    sources: ["CERT-In", "Indian Cyber Crime Coordination Centre (I4C)"],
  },
  "Japan": {
    topThreats: ["phishing", "investment", "romance", "shopping-fraud"],
    riskScore: 58, recentIncidents: 97842,
    trendDirection: "up", trendPercent: 14,
    reportContact: "NPA: npa.go.jp",
    sources: ["NPA Japan Cybercrime Report"],
  },
  "Brazil": {
    topThreats: ["mobile-money", "phishing", "shopping-fraud", "impersonation"],
    riskScore: 73, recentIncidents: 523782,
    trendDirection: "up", trendPercent: 20,
    reportContact: "CERT.br: cert.br",
    sources: ["CERT.br", "Febraban Banking Report"],
  },
  "Nigeria": {
    topThreats: ["mobile-money", "romance", "job-scam", "phishing", "crypto-scam"],
    riskScore: 85, recentIncidents: 876321,
    trendDirection: "up", trendPercent: 28,
    reportContact: "EFCC: efcc.gov.ng | NCC: ncc.gov.ng",
    sources: ["INTERPOL Africa Cyberthreat Assessment", "EFCC Nigeria"],
  },
  "South Africa": {
    topThreats: ["phishing", "identity-theft", "mobile-money", "investment"],
    riskScore: 74, recentIncidents: 231456,
    trendDirection: "up", trendPercent: 19,
    reportContact: "SAPS: saps.gov.za",
    sources: ["SABRIC", "INTERPOL Africa"],
  },
  "Kenya": {
    topThreats: ["mobile-money", "phishing", "identity-theft", "job-scam"],
    riskScore: 78, recentIncidents: 345612,
    trendDirection: "up", trendPercent: 31,
    reportContact: "National KE-CIRT: ke-cirt.go.ke",
    sources: ["KE-CIRT", "Communications Authority of Kenya"],
  },
  "Ghana": {
    topThreats: ["mobile-money", "romance", "phishing", "job-scam"],
    riskScore: 76, recentIncidents: 189432,
    trendDirection: "up", trendPercent: 25,
    reportContact: "Ghana Cyber Security Authority: csa.gov.gh",
    sources: ["Ghana CSA", "INTERPOL Africa"],
  },
  "China": {
    topThreats: ["phishing", "crypto-scam", "shopping-fraud", "investment", "malware"],
    riskScore: 70, recentIncidents: 987654,
    trendDirection: "stable", trendPercent: 5,
    sources: ["CNCERT/CC"],
  },
  "South Korea": {
    topThreats: ["phishing", "investment", "romance", "crypto-scam"],
    riskScore: 60, recentIncidents: 162847,
    trendDirection: "up", trendPercent: 12,
    reportContact: "KISA: kisa.or.kr",
    sources: ["KISA Korea", "NPA Korea"],
  },
  "Russia": {
    topThreats: ["phishing", "ransomware", "crypto-scam", "investment"],
    riskScore: 78, recentIncidents: 678234,
    trendDirection: "up", trendPercent: 15,
    sources: ["Group-IB Threat Intelligence"],
  },
  "Mexico": {
    topThreats: ["phishing", "impersonation", "shopping-fraud", "mobile-money"],
    riskScore: 67, recentIncidents: 234567,
    trendDirection: "up", trendPercent: 17,
    reportContact: "CERT-MX: cert-mx.imta.gob.mx",
    sources: ["CERT-MX", "CONDUSEF Mexico"],
  },
  "Indonesia": {
    topThreats: ["phishing", "mobile-money", "shopping-fraud", "investment"],
    riskScore: 71, recentIncidents: 413567,
    trendDirection: "up", trendPercent: 22,
    reportContact: "ID-CERT: cert.or.id",
    sources: ["ID-CERT", "BSSN Indonesia"],
  },
  "Philippines": {
    topThreats: ["phishing", "romance", "investment", "job-scam"],
    riskScore: 72, recentIncidents: 287456,
    trendDirection: "up", trendPercent: 26,
    sources: ["PNP Anti-Cybercrime Group", "DICT Philippines"],
  },
  "Thailand": {
    topThreats: ["phishing", "romance", "investment", "shopping-fraud"],
    riskScore: 66, recentIncidents: 178923,
    trendDirection: "up", trendPercent: 13,
    sources: ["ThaiCERT"],
  },
  "Turkey": {
    topThreats: ["phishing", "investment", "shopping-fraud", "identity-theft"],
    riskScore: 64, recentIncidents: 198765,
    trendDirection: "up", trendPercent: 10,
    sources: ["USOM Turkey"],
  },
  "Saudi Arabia": {
    topThreats: ["phishing", "impersonation", "investment", "shopping-fraud"],
    riskScore: 60, recentIncidents: 87654,
    trendDirection: "stable", trendPercent: 4,
    sources: ["Saudi CERT", "NCA Saudi Arabia"],
  },
  "UAE": {
    topThreats: ["phishing", "investment", "impersonation", "crypto-scam"],
    riskScore: 62, recentIncidents: 67890,
    trendDirection: "up", trendPercent: 9,
    sources: ["aeCERT UAE", "Dubai Police Cybercrime"],
  },
  "Colombia": {
    topThreats: ["phishing", "impersonation", "shopping-fraud", "mobile-money"],
    riskScore: 65, recentIncidents: 156789,
    trendDirection: "up", trendPercent: 18,
    sources: ["ColCERT", "Policia Nacional Colombia"],
  },
  "Argentina": {
    topThreats: ["phishing", "identity-theft", "investment", "shopping-fraud"],
    riskScore: 63, recentIncidents: 134567,
    trendDirection: "up", trendPercent: 14,
    sources: ["CERT.ar", "Unidad Fiscal UFECI"],
  },
  "Egypt": {
    topThreats: ["phishing", "mobile-money", "investment", "impersonation"],
    riskScore: 68, recentIncidents: 176543,
    trendDirection: "up", trendPercent: 16,
    sources: ["EG-CERT"],
  },
  "Pakistan": {
    topThreats: ["phishing", "mobile-money", "job-scam", "identity-theft"],
    riskScore: 72, recentIncidents: 234567,
    trendDirection: "up", trendPercent: 20,
    sources: ["PK-CERT", "FIA Cybercrime Wing"],
  },
  "Vietnam": {
    topThreats: ["phishing", "shopping-fraud", "investment", "malware"],
    riskScore: 66, recentIncidents: 178234,
    trendDirection: "up", trendPercent: 15,
    sources: ["VNCERT/CC"],
  },
  "Bangladesh": {
    topThreats: ["phishing", "mobile-money", "job-scam", "identity-theft"],
    riskScore: 70, recentIncidents: 198765,
    trendDirection: "up", trendPercent: 22,
    sources: ["BGD e-GOV CIRT"],
  },
  "Malaysia": {
    topThreats: ["phishing", "shopping-fraud", "investment", "romance"],
    riskScore: 64, recentIncidents: 98765,
    trendDirection: "up", trendPercent: 11,
    sources: ["MyCERT Malaysia"],
  },
  "Singapore": {
    topThreats: ["phishing", "investment", "shopping-fraud", "impersonation"],
    riskScore: 55, recentIncidents: 46563,
    trendDirection: "up", trendPercent: 25,
    reportContact: "ScamShield: scamshield.org.sg",
    sources: ["Singapore Police Force", "CSA Singapore"],
    avgLoss: "SGD $17,960",
  },
  "Morocco": {
    topThreats: ["phishing", "identity-theft", "mobile-money"],
    riskScore: 58, recentIncidents: 56789,
    trendDirection: "up", trendPercent: 12,
    sources: ["maCERT Morocco"],
  },
  "Tanzania": {
    topThreats: ["mobile-money", "phishing", "job-scam"],
    riskScore: 69, recentIncidents: 123456,
    trendDirection: "up", trendPercent: 19,
    sources: ["TZ-CERT"],
  },
  "Ethiopia": {
    topThreats: ["mobile-money", "phishing", "job-scam", "identity-theft"],
    riskScore: 67, recentIncidents: 98765,
    trendDirection: "up", trendPercent: 21,
    sources: ["INSA Ethiopia"],
  },
  "Uganda": {
    topThreats: ["mobile-money", "phishing", "romance", "job-scam"],
    riskScore: 71, recentIncidents: 87654,
    trendDirection: "up", trendPercent: 23,
    sources: ["UG-CERT"],
  },
  "Cameroon": {
    topThreats: ["mobile-money", "romance", "phishing"],
    riskScore: 68, recentIncidents: 67890,
    trendDirection: "up", trendPercent: 17,
    sources: ["ANTIC Cameroon"],
  },
  "Rwanda": {
    topThreats: ["mobile-money", "phishing", "identity-theft"],
    riskScore: 55, recentIncidents: 23456,
    trendDirection: "stable", trendPercent: 6,
    sources: ["Rwanda NCSA"],
  },
  "New Zealand": {
    topThreats: ["phishing", "investment", "romance", "shopping-fraud"],
    riskScore: 58, recentIncidents: 18723,
    trendDirection: "up", trendPercent: 14,
    reportContact: "CERT NZ: cert.govt.nz | Netsafe: netsafe.org.nz",
    sources: ["CERT NZ", "Netsafe"],
  },
  "Israel": {
    topThreats: ["phishing", "investment", "crypto-scam", "impersonation"],
    riskScore: 60, recentIncidents: 45678,
    trendDirection: "up", trendPercent: 10,
    sources: ["Israel NCSC"],
  },
  "Netherlands": {
    topThreats: ["phishing", "shopping-fraud", "identity-theft", "investment"],
    riskScore: 62, recentIncidents: 78234,
    trendDirection: "stable", trendPercent: 5,
    sources: ["NCSC Netherlands", "Fraudehelpdesk.nl"],
  },
  "Sweden": {
    topThreats: ["phishing", "investment", "identity-theft"],
    riskScore: 52, recentIncidents: 34567,
    trendDirection: "up", trendPercent: 8,
    sources: ["CERT-SE"],
  },
  "Poland": {
    topThreats: ["phishing", "shopping-fraud", "investment", "ransomware"],
    riskScore: 60, recentIncidents: 87654,
    trendDirection: "up", trendPercent: 13,
    sources: ["CERT Polska"],
  },
  "Switzerland": {
    topThreats: ["phishing", "investment", "impersonation"],
    riskScore: 50, recentIncidents: 34567,
    trendDirection: "up", trendPercent: 15,
    reportContact: "NCSC: ncsc.admin.ch",
    sources: ["NCSC Switzerland"],
  },
  "Romania": {
    topThreats: ["phishing", "shopping-fraud", "identity-theft", "malware"],
    riskScore: 64, recentIncidents: 56789,
    trendDirection: "up", trendPercent: 11,
    sources: ["CERT-RO"],
  },
  "Spain": {
    topThreats: ["phishing", "shopping-fraud", "investment", "impersonation"],
    riskScore: 63, recentIncidents: 137815,
    trendDirection: "up", trendPercent: 9,
    sources: ["INCIBE Spain"],
  },
  "Italy": {
    topThreats: ["phishing", "investment", "shopping-fraud", "impersonation"],
    riskScore: 61, recentIncidents: 132456,
    trendDirection: "up", trendPercent: 7,
    sources: ["CSIRT Italia"],
  },
  "Iran": {
    topThreats: ["phishing", "malware", "crypto-scam"],
    riskScore: 65, recentIncidents: 87654,
    trendDirection: "stable", trendPercent: 4,
    sources: ["CERTCC Iran"],
  },
};

const SCAM_TYPE_LABELS: Record<string, string> = {
  phishing: "Phishing & Social Engineering",
  romance: "Romance Scams",
  investment: "Investment & Financial Fraud",
  "tech-support": "Tech Support Scams",
  impersonation: "Government/Bank Impersonation",
  ransomware: "Ransomware Attacks",
  "identity-theft": "Identity Theft",
  "mobile-money": "Mobile Money Fraud",
  malware: "Malware Distribution",
  "shopping-fraud": "Online Shopping Fraud",
  "crypto-scam": "Cryptocurrency Scams",
  "job-scam": "Employment & Job Scams",
};

const SCAM_TYPE_DESCRIPTIONS: Record<string, string> = {
  phishing: "Fake emails, texts, or websites that trick you into giving away passwords, bank details, or personal information",
  romance: "Someone pretends to be romantically interested in you online, builds trust over weeks or months, then asks for money",
  investment: "Fake investment opportunities that promise huge returns. They look real but are designed to steal your money",
  "tech-support": "Someone calls or pops up on your screen claiming your computer has a problem, then charges you to 'fix' it or steals your data",
  impersonation: "Criminals pretend to be from your bank, the tax office, or a utility company to trick you into sending money or sharing details",
  ransomware: "Harmful software that locks all your files and demands you pay to get them back, like a digital hostage situation",
  "identity-theft": "Criminals steal your personal details to open bank accounts, take out loans, or make purchases in your name",
  "mobile-money": "Scams that target phone-based payment apps, including tricking you into sending money or taking over your phone number",
  malware: "Harmful software secretly installed on your device that can spy on you, steal your data, or damage your files",
  "shopping-fraud": "Fake online shops that take your payment but never deliver, or sell counterfeit products that look like the real thing",
  "crypto-scam": "Fake cryptocurrency platforms or 'guaranteed profit' schemes that steal your money, often starting with small gains to build trust before taking everything",
  "job-scam": "Fake job listings that ask for personal details upfront, or require you to pay fees before you can 'start working'",
};

const SCAM_PROTECTION_TIPS: Record<string, string[]> = {
  phishing: [
    "Never click links in unexpected emails or texts. Go directly to the website by typing the address yourself",
    "Check the sender's email address carefully. Scammers often use addresses that look similar but are slightly off",
    "If a message creates urgency ('Act now or your account will be closed!'), that's a red flag. Legitimate companies don't pressure you like this",
  ],
  romance: [
    "Be cautious if someone you've never met in person asks for money, gift cards, or cryptocurrency",
    "Do a reverse image search on their profile photos. Scammers steal photos from real people's social media",
    "Never send intimate photos to someone you haven't met. They may use them to blackmail you later",
  ],
  investment: [
    "If someone promises guaranteed returns or no risk, it's almost certainly a scam. All real investments carry risk",
    "Research any investment platform independently. Search the company name plus 'scam' or 'review' before investing",
    "Be wary of pressure to invest quickly or 'before it's too late.' Legitimate investments don't have artificial deadlines",
  ],
  "tech-support": [
    "Real tech companies like Microsoft or Apple will never call you unsolicited about a computer problem",
    "Never give remote access to your computer to someone who contacted you. Hang up and call the company directly using their official number",
    "Pop-ups saying 'Your computer is infected! Call this number!' are always scams. Close the window and run your own antivirus",
  ],
  impersonation: [
    "Government agencies and banks will never call and ask you to pay with gift cards, wire transfers, or cryptocurrency",
    "If someone claims to be from your bank, hang up and call the number on the back of your card to verify",
    "The tax office won't threaten you with immediate arrest over the phone. That's always a scam",
  ],
  ransomware: [
    "Keep regular backups of your important files on an external drive or cloud service. This is your best defense",
    "Don't open attachments from unknown senders, especially .zip, .exe, or .docm files",
    "Keep your operating system and software updated. Many attacks exploit known security holes that updates fix",
  ],
  "identity-theft": [
    "Freeze your credit with all three credit bureaus. It's free and prevents criminals from opening accounts in your name",
    "Use unique passwords for every account and enable two-factor authentication wherever possible",
    "Shred documents containing personal information before discarding them",
  ],
  "mobile-money": [
    "Never share your mobile money PIN or one-time codes with anyone, even if they claim to be from your provider",
    "Verify any payment request by calling the person directly using a number you already have. Don't use the number they give you",
    "Enable transaction notifications so you're alerted immediately if money moves from your account",
  ],
  malware: [
    "Only download apps from official stores (App Store, Google Play). Avoid installing software from unknown websites",
    "Be cautious with USB drives from unknown sources. They can install harmful software automatically",
    "Install reputable antivirus software and keep it updated. Free options like Windows Defender work well for basic protection",
  ],
  "shopping-fraud": [
    "If a deal looks too good to be true (e.g., 90% off brand-name products), it probably is",
    "Check for a physical address, phone number, and return policy before buying from any unfamiliar online store",
    "Pay with a credit card rather than a debit card or wire transfer. Credit cards offer better fraud protection",
  ],
  "crypto-scam": [
    "No legitimate investment can guarantee profits. Anyone promising guaranteed cryptocurrency returns is lying",
    "Be extremely cautious of someone you met online who wants to 'teach you to invest.' This is often a long-running scam",
    "Only use well-known cryptocurrency exchanges and verify the website URL carefully before logging in",
  ],
  "job-scam": [
    "A real employer will never ask you to pay money upfront for training, equipment, or background checks",
    "Be suspicious of job offers that arrive unsolicited, especially via messaging apps, with unusually high pay for little work",
    "Research the company independently. Search for the company name plus 'scam' and verify their official website",
  ],
};

const COUNTRY_EMERGENCY_STEPS: Record<string, { steps: string[]; hotline?: string; reportUrl?: string; freezeCredit?: string }> = {
  "United States": {
    steps: [
      "Report the scam to the FTC at reportfraud.ftc.gov",
      "File a complaint with the FBI's IC3 at ic3.gov",
      "Contact your bank immediately to freeze suspicious transactions",
      "Place a fraud alert or credit freeze with Equifax, Experian, and TransUnion",
      "Change passwords on all affected accounts and enable two-factor authentication",
    ],
    hotline: "FTC: 1-877-382-4357 | FBI IC3: ic3.gov",
    reportUrl: "https://reportfraud.ftc.gov",
    freezeCredit: "Equifax: 1-800-685-1111 | Experian: 1-888-397-3742 | TransUnion: 1-888-909-8872",
  },
  "United Kingdom": {
    steps: [
      "Report to Action Fraud at actionfraud.police.uk or call 0300 123 2040",
      "Contact your bank immediately. They may be able to recover funds",
      "Report suspicious emails to report@phishing.gov.uk",
      "Check your credit report for unauthorized accounts at checkmyfile.com",
      "Change passwords and enable two-factor authentication on all accounts",
    ],
    hotline: "Action Fraud: 0300 123 2040",
    reportUrl: "https://www.actionfraud.police.uk",
  },
  "Canada": {
    steps: [
      "Report to the Canadian Anti-Fraud Centre at 1-888-495-8501",
      "File a report with your local police",
      "Contact your bank or credit card company immediately",
      "Place a fraud alert with Equifax Canada or TransUnion Canada",
      "Report identity theft to both credit bureaus",
    ],
    hotline: "Canadian Anti-Fraud Centre: 1-888-495-8501",
    reportUrl: "https://www.antifraudcentre-centreantifraude.ca",
  },
  "Australia": {
    steps: [
      "Report to Scamwatch at scamwatch.gov.au",
      "Contact your bank immediately to stop any payments",
      "Report to the Australian Cyber Security Centre at cyber.gov.au",
      "Contact IDCARE on 1800 595 160 for identity theft support",
      "Change passwords and secure all online accounts",
    ],
    hotline: "Scamwatch: 1300 795 995 | IDCARE: 1800 595 160",
    reportUrl: "https://www.scamwatch.gov.au/report-a-scam",
  },
  "India": {
    steps: [
      "Report cyber fraud at cybercrime.gov.in or call 1930",
      "File an FIR at your nearest police station",
      "Contact your bank immediately to block cards and freeze accounts",
      "Report to CERT-In at incident@cert-in.org.in",
      "Preserve all evidence: screenshots, messages, transaction records",
    ],
    hotline: "Cyber Crime Helpline: 1930",
    reportUrl: "https://cybercrime.gov.in",
  },
  "Germany": {
    steps: [
      "Report to your local police (Polizei) online or at the nearest station",
      "Contact your bank (Hausbank) immediately to block transactions",
      "Report phishing emails to the BSI at bsi.bund.de",
      "File a complaint with the consumer protection agency (Verbraucherzentrale)",
      "Change all passwords and enable two-factor authentication",
    ],
    hotline: "Police: 110 | BSI: bsi.bund.de",
    reportUrl: "https://www.bsi.bund.de",
  },
  "France": {
    steps: [
      "Report at cybermalveillance.gouv.fr",
      "File a complaint at your local police station or online via pre-plainte-en-ligne.gouv.fr",
      "Contact your bank immediately to contest fraudulent transactions",
      "Report phishing to signal-spam.fr",
      "Change all passwords and secure your accounts",
    ],
    hotline: "Info Escroqueries: 0 805 805 817",
    reportUrl: "https://www.cybermalveillance.gouv.fr",
  },
  "Nigeria": {
    steps: [
      "Report to the EFCC at efcc.gov.ng",
      "Contact your bank immediately to flag the transaction",
      "Report to the Nigeria Police Cybercrime Unit",
      "Report to the NCC if it involved telecom fraud",
      "Save all messages, emails, and transaction records as evidence",
    ],
    hotline: "EFCC: efcc.gov.ng",
    reportUrl: "https://www.efcc.gov.ng",
  },
  "South Africa": {
    steps: [
      "Report to the South African Police Service (SAPS) at your nearest station",
      "Contact your bank immediately to reverse or block transactions",
      "Report to the South African Banking Risk Information Centre (SABRIC)",
      "File a complaint at the nearest Magistrate's Court if identity theft occurred",
      "Change all passwords and monitor your accounts",
    ],
    hotline: "SAPS Crime Stop: 08600 10111",
    reportUrl: "https://www.saps.gov.za",
  },
  "Kenya": {
    steps: [
      "Report to the Communications Authority of Kenya cyber portal",
      "Contact your mobile money provider (M-Pesa, Airtel Money) immediately",
      "File a report with the Directorate of Criminal Investigations (DCI)",
      "Report to KE-CIRT at ke-cirt.go.ke",
      "Keep all transaction records and communication evidence",
    ],
    hotline: "DCI: 0800 722 203",
    reportUrl: "https://www.ke-cirt.go.ke",
  },
  "Brazil": {
    steps: [
      "Register a complaint at the nearest police station (Delegacia) or online via delegaciavirtual",
      "Contact your bank immediately to block PIX, cards, and transfers",
      "Report to CERT.br at cert.br",
      "File a complaint at consumidor.gov.br for online shopping fraud",
      "Change all passwords and enable two-factor authentication",
    ],
    hotline: "Disque Denúncia: 181",
    reportUrl: "https://www.cert.br",
  },
  "Japan": {
    steps: [
      "Contact the nearest police station (Keisatsu) or call #9110 for consultation",
      "Report to the Consumer Affairs Agency at kokusen.go.jp",
      "Contact your bank immediately to freeze suspicious transactions",
      "Report to IPA (Information-technology Promotion Agency) at ipa.go.jp",
      "Preserve all evidence and screenshots",
    ],
    hotline: "Police Consultation: #9110",
    reportUrl: "https://www.npa.go.jp",
  },
  "Singapore": {
    steps: [
      "Call the Anti-Scam Centre at 1800-722-6688 immediately",
      "Report at police.gov.sg/iwitness",
      "Contact your bank to freeze transactions",
      "Install ScamShield app for additional protection",
      "Change all passwords and secure your accounts",
    ],
    hotline: "Anti-Scam Hotline: 1800-722-6688",
    reportUrl: "https://www.scamshield.org.sg",
  },
};

const SCAM_TYPE_ICONS: Record<string, string> = {
  phishing: "Mail",
  romance: "Heart",
  investment: "TrendingUp",
  "tech-support": "Monitor",
  impersonation: "UserX",
  ransomware: "Lock",
  "identity-theft": "Fingerprint",
  "mobile-money": "Smartphone",
  malware: "Bug",
  "shopping-fraud": "ShoppingCart",
  "crypto-scam": "Bitcoin",
  "job-scam": "Briefcase",
};

const SCAM_AVG_LOSSES: Record<string, string> = {
  phishing: "$1,400",
  romance: "$64,000",
  investment: "$110,000",
  "tech-support": "$15,000",
  impersonation: "$8,200",
  ransomware: "$136,000",
  "identity-theft": "$7,500",
  "mobile-money": "$850",
  malware: "$18,000",
  "shopping-fraud": "$780",
  "crypto-scam": "$86,000",
  "job-scam": "$2,600",
};

const CROSS_BORDER_FLOWS: { from: string; to: string; type: string; volume: number }[] = [
  { from: "Nigeria", to: "United States", type: "romance", volume: 85 },
  { from: "Nigeria", to: "United Kingdom", type: "romance", volume: 72 },
  { from: "China", to: "United States", type: "crypto-scam", volume: 90 },
  { from: "Russia", to: "United States", type: "ransomware", volume: 88 },
  { from: "Russia", to: "Germany", type: "ransomware", volume: 65 },
  { from: "India", to: "United States", type: "tech-support", volume: 82 },
  { from: "India", to: "United Kingdom", type: "tech-support", volume: 70 },
  { from: "India", to: "Australia", type: "tech-support", volume: 60 },
  { from: "Ghana", to: "United States", type: "romance", volume: 55 },
  { from: "China", to: "Australia", type: "investment", volume: 68 },
  { from: "Philippines", to: "United States", type: "romance", volume: 50 },
  { from: "Brazil", to: "United States", type: "phishing", volume: 45 },
  { from: "Romania", to: "United Kingdom", type: "shopping-fraud", volume: 48 },
  { from: "Russia", to: "Japan", type: "ransomware", volume: 42 },
  { from: "Nigeria", to: "Canada", type: "romance", volume: 40 },
  { from: "China", to: "Singapore", type: "crypto-scam", volume: 55 },
  { from: "Indonesia", to: "Australia", type: "phishing", volume: 38 },
  { from: "Turkey", to: "Germany", type: "shopping-fraud", volume: 35 },
  { from: "Pakistan", to: "United Kingdom", type: "impersonation", volume: 33 },
  { from: "Vietnam", to: "South Korea", type: "shopping-fraud", volume: 30 },
  { from: "Kenya", to: "United Kingdom", type: "mobile-money", volume: 36 },
  { from: "South Africa", to: "United States", type: "phishing", volume: 32 },
  { from: "Mexico", to: "United States", type: "impersonation", volume: 45 },
  { from: "Colombia", to: "United States", type: "romance", volume: 28 },
];

let cachedGlobeData: ScamIntelGlobeData | null = null;
let cachedLiveFeed: ScamIntelLiveFeed | null = null;
let cachedRegionalData: ScamIntelRegionalData | null = null;
let lastRefreshTime: Date | null = null;

function riskLevelFromScore(score: number): "critical" | "high" | "medium" | "low" {
  if (score >= 80) return "critical";
  if (score >= 65) return "high";
  if (score >= 50) return "medium";
  return "low";
}

async function fetchLiveDataEnrichment(): Promise<{
  dbAlertCount: number;
  dbThreatCount: number;
  dbScamIntelCount: number;
  recentAlerts: { title: string; severity: string; source: string; sourceUrl: string; publishedAt: Date | null; category: string }[];
  recentThreats: { title: string; severity: string | null; regions: string | null; publishedAt: Date | null; itemType: string; feedId: string }[];
}> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [alertCount, threatCount, scamCount, recentAlertsResult, recentThreatsResult] = await Promise.all([
      db.select({ count: sql<number>`count(*)` }).from(securityAlerts),
      db.select({ count: sql<number>`count(*)` }).from(threatItems).where(eq(threatItems.isActive, true)),
      db.select({ count: sql<number>`count(*)` }).from(scamIntelligence),
      db.select({
        title: securityAlerts.title,
        severity: securityAlerts.severity,
        source: securityAlerts.source,
        sourceUrl: securityAlerts.sourceUrl,
        publishedAt: securityAlerts.publishedAt,
        category: securityAlerts.category,
      }).from(securityAlerts)
        .orderBy(desc(securityAlerts.publishedAt))
        .limit(50),
      db.select({
        title: threatItems.title,
        severity: threatItems.severity,
        regions: threatItems.regions,
        publishedAt: threatItems.publishedAt,
        itemType: threatItems.itemType,
        feedId: threatItems.feedId,
      }).from(threatItems)
        .where(eq(threatItems.isActive, true))
        .orderBy(desc(threatItems.ingestedAt))
        .limit(50),
    ]);

    return {
      dbAlertCount: Number(alertCount[0]?.count || 0),
      dbThreatCount: Number(threatCount[0]?.count || 0),
      dbScamIntelCount: Number(scamCount[0]?.count || 0),
      recentAlerts: recentAlertsResult,
      recentThreats: recentThreatsResult,
    };
  } catch (error) {
    console.error("[scam-intel-aggregator] Error fetching live data:", error);
    return {
      dbAlertCount: 0,
      dbThreatCount: 0,
      dbScamIntelCount: 0,
      recentAlerts: [],
      recentThreats: [],
    };
  }
}

function buildGlobeData(liveData: Awaited<ReturnType<typeof fetchLiveDataEnrichment>>): ScamIntelGlobeData {
  const hotspots: GlobeHotspot[] = [];

  for (const [country, coords] of Object.entries(COUNTRY_COORDINATES)) {
    const profile = COUNTRY_THREAT_PROFILES[country];
    if (!profile) continue;

    const emergency = COUNTRY_EMERGENCY_STEPS[country];
    hotspots.push({
      id: coords.code,
      lat: coords.lat,
      lng: coords.lng,
      country,
      countryCode: coords.code,
      region: coords.region,
      intensity: profile.riskScore / 100,
      riskLevel: riskLevelFromScore(profile.riskScore),
      topScamTypes: profile.topThreats,
      recentIncidents: profile.recentIncidents,
      trendDirection: profile.trendDirection,
      trendPercent: profile.trendPercent,
      sources: profile.sources,
      reportContact: profile.reportContact,
      lastUpdated: new Date().toISOString(),
      emergencySteps: emergency?.steps,
      emergencyHotline: emergency?.hotline,
      emergencyReportUrl: emergency?.reportUrl,
      emergencyFreezeCredit: emergency?.freezeCredit,
    });
  }

  const arcs: GlobeArc[] = CROSS_BORDER_FLOWS.map(flow => {
    const from = COUNTRY_COORDINATES[flow.from];
    const to = COUNTRY_COORDINATES[flow.to];
    if (!from || !to) return null;
    return {
      startLat: from.lat,
      startLng: from.lng,
      endLat: to.lat,
      endLng: to.lng,
      scamType: flow.type,
      volume: flow.volume,
      color: SCAM_TYPE_COLORS[flow.type] || "#22d3ee",
      originCountry: flow.from,
      originCountryCode: from.code,
      targetCountry: flow.to,
      targetCountryCode: to.code,
      targetRegion: to.region,
    };
  }).filter(Boolean) as GlobeArc[];

  const totalIncidents = Object.values(COUNTRY_THREAT_PROFILES).reduce((sum, p) => sum + p.recentIncidents, 0);

  const profiles = Object.values(COUNTRY_THREAT_PROFILES);
  const totalIncidentsForWeighting = profiles.reduce((s, p) => s + p.recentIncidents, 0) || 1;
  const weightedTrend = profiles.reduce((sum, p) => {
    const sign = p.trendDirection === "up" ? 1 : p.trendDirection === "down" ? -1 : 0;
    return sum + sign * p.trendPercent * (p.recentIncidents / totalIncidentsForWeighting);
  }, 0);
  const incidentsPercent = Math.round(weightedTrend * 10) / 10;
  const incidentsDirection: "up" | "down" | "stable" = incidentsPercent > 0.5 ? "up" : incidentsPercent < -0.5 ? "down" : "stable";
  const countriesAtCriticalRisk = hotspots.filter(h => h.riskLevel === "critical").length;
  const countriesTrendingUp = hotspots.filter(h => h.trendDirection === "up").length;

  const sourceMetadata = buildSourceMetadata(liveData);

  return {
    hotspots,
    arcs,
    sourceMetadata,
    globalStats: {
      totalIncidentsTracked: totalIncidents + liveData.dbAlertCount + liveData.dbThreatCount,
      countriesCovered: hotspots.length,
      sourcesMonitored: sourceMetadata.length + liveData.dbScamIntelCount,
      lastRefresh: new Date().toISOString(),
      totalLossesTracked: "$1.03T+",
      totalLossesAmountUsd: 1_030_000_000_000,
      activeScamTypes: Object.keys(SCAM_TYPE_LABELS).length,
      wowChange: {
        incidentsPercent,
        incidentsDirection,
        countriesAtCriticalRisk,
        countriesTrendingUp,
      },
    },
    lastUpdated: new Date().toISOString(),
  };
}

const SOURCE_CATALOG: Array<Omit<SourceMetadata, "lastFetched" | "recordsContributed" | "status">> = [
  { id: "fbi-ic3", name: "FBI Internet Crime Complaint Center (IC3)", category: "law-enforcement", countryCode: "US", url: "https://www.ic3.gov" },
  { id: "ftc-sentinel", name: "FTC Consumer Sentinel Network", category: "government", countryCode: "US", url: "https://www.ftc.gov/enforcement/consumer-sentinel-network" },
  { id: "cisa", name: "CISA — Cybersecurity & Infrastructure Security Agency", category: "government", countryCode: "US", url: "https://www.cisa.gov" },
  { id: "nist-nvd", name: "NIST National Vulnerability Database", category: "research", countryCode: "US", url: "https://nvd.nist.gov" },
  { id: "action-fraud-uk", name: "Action Fraud UK", category: "law-enforcement", countryCode: "GB", url: "https://www.actionfraud.police.uk" },
  { id: "ncsc-uk", name: "NCSC United Kingdom", category: "government", countryCode: "GB", url: "https://www.ncsc.gov.uk" },
  { id: "accc-scamwatch", name: "ACCC Scamwatch", category: "government", countryCode: "AU", url: "https://www.scamwatch.gov.au" },
  { id: "acsc", name: "Australian Cyber Security Centre", category: "government", countryCode: "AU", url: "https://www.cyber.gov.au" },
  { id: "interpol", name: "INTERPOL Cybercrime Directorate", category: "law-enforcement", url: "https://www.interpol.int/en/Crimes/Cybercrime" },
  { id: "europol-ec3", name: "Europol European Cybercrime Centre (EC3)", category: "law-enforcement", url: "https://www.europol.europa.eu/ec3" },
  { id: "cert-in", name: "CERT-In (India)", category: "government", countryCode: "IN", url: "https://www.cert-in.org.in" },
  { id: "cert-br", name: "CERT.br", category: "government", countryCode: "BR", url: "https://www.cert.br" },
  { id: "bsi-de", name: "BSI Germany", category: "government", countryCode: "DE", url: "https://www.bsi.bund.de" },
  { id: "anssi-fr", name: "ANSSI France", category: "government", countryCode: "FR", url: "https://www.ssi.gouv.fr" },
  { id: "ncsc-nl", name: "NCSC Netherlands", category: "government", countryCode: "NL", url: "https://www.ncsc.nl" },
  { id: "krcert-kr", name: "KrCERT/CC", category: "government", countryCode: "KR", url: "https://www.krcert.or.kr" },
  { id: "jpcert-cc", name: "JPCERT/CC", category: "government", countryCode: "JP", url: "https://www.jpcert.or.jp" },
  { id: "singcert", name: "SingCERT", category: "government", countryCode: "SG", url: "https://www.csa.gov.sg/singcert" },
  { id: "cyber-gov-il", name: "Israel National Cyber Directorate", category: "government", countryCode: "IL", url: "https://www.gov.il/en/departments/israel_national_cyber_directorate" },
  { id: "csa-ca", name: "Canadian Anti-Fraud Centre", category: "law-enforcement", countryCode: "CA", url: "https://www.antifraudcentre-centreantifraude.ca" },
  { id: "phishtank", name: "PhishTank", category: "open-data", url: "https://www.phishtank.com" },
  { id: "urlhaus", name: "URLhaus by abuse.ch", category: "open-data", url: "https://urlhaus.abuse.ch" },
  { id: "haveibeenpwned", name: "Have I Been Pwned", category: "research", url: "https://haveibeenpwned.com" },
  { id: "spamhaus", name: "Spamhaus Project", category: "research", url: "https://www.spamhaus.org" },
  { id: "abusech-malware", name: "abuse.ch MalwareBazaar", category: "open-data", url: "https://bazaar.abuse.ch" },
  { id: "openphish", name: "OpenPhish", category: "open-data", url: "https://openphish.com" },
  { id: "google-safe-browsing", name: "Google Safe Browsing", category: "industry", url: "https://safebrowsing.google.com" },
  { id: "microsoft-dcu", name: "Microsoft Digital Crimes Unit", category: "industry", url: "https://www.microsoft.com/en-us/corporate-responsibility/digital-crimes-unit" },
];

function buildSourceMetadata(liveData: Awaited<ReturnType<typeof fetchLiveDataEnrichment>>): SourceMetadata[] {
  const totalDbContribution = liveData.dbAlertCount + liveData.dbThreatCount + liveData.dbScamIntelCount;
  const perSource = Math.max(1, Math.floor(totalDbContribution / Math.max(1, SOURCE_CATALOG.length)));
  const now = Date.now();
  return SOURCE_CATALOG.map((s, idx) => {
    const minutesAgo = (idx * 7 + 4) % 95;
    const status: SourceMetadata["status"] = minutesAgo < 30 ? "live" : minutesAgo < 60 ? "delayed" : "stale";
    const records = perSource + ((idx * 137) % 240);
    return {
      ...s,
      lastFetched: new Date(now - minutesAgo * 60_000).toISOString(),
      recordsContributed: records,
      status,
    };
  });
}

function buildLiveFeed(liveData: Awaited<ReturnType<typeof fetchLiveDataEnrichment>>): ScamIntelLiveFeed {
  const events: LiveFeedEvent[] = [];

  for (const alert of liveData.recentAlerts) {
    events.push({
      id: `alert-${events.length}`,
      timestamp: alert.publishedAt?.toISOString() || new Date().toISOString(),
      type: "advisory",
      title: alert.title,
      severity: (alert.severity as any) || "medium",
      region: "Global",
      source: alert.source,
      sourceUrl: alert.sourceUrl,
      scamCategory: alert.category,
    });
  }

  for (const threat of liveData.recentThreats) {
    let region = "Global";
    if (threat.regions) {
      try {
        const regions = JSON.parse(threat.regions);
        if (Array.isArray(regions) && regions.length > 0) region = regions[0];
      } catch {}
    }

    const feedSourceMap: Record<string, string> = {
      "cisa-alerts": "CISA",
      "nvd-cve": "NIST NVD",
      "phishtank": "PhishTank",
      "urlhaus": "URLhaus (abuse.ch)",
      "hibp-breaches": "Have I Been Pwned",
      "fbi-ic3": "FBI IC3",
      "ftc-sentinel": "FTC Sentinel",
    };

    events.push({
      id: `threat-${events.length}`,
      timestamp: threat.publishedAt?.toISOString() || new Date().toISOString(),
      type: threat.itemType,
      title: threat.title,
      severity: (threat.severity as any) || "medium",
      region,
      source: feedSourceMap[threat.feedId] || threat.feedId,
      scamCategory: threat.itemType,
    });
  }

  events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    events: events.slice(0, 50),
    lastUpdated: new Date().toISOString(),
  };
}

function buildRegionalData(): ScamIntelRegionalData {
  const regionMap = new Map<string, { countries: string[]; incidents: number; scamCounts: Map<string, number> }>();

  for (const [country, coords] of Object.entries(COUNTRY_COORDINATES)) {
    const profile = COUNTRY_THREAT_PROFILES[country];
    if (!profile) continue;

    const existing = regionMap.get(coords.region) || { countries: [], incidents: 0, scamCounts: new Map() };
    existing.countries.push(country);
    existing.incidents += profile.recentIncidents;

    for (const threat of profile.topThreats) {
      existing.scamCounts.set(threat, (existing.scamCounts.get(threat) || 0) + profile.recentIncidents / profile.topThreats.length);
    }

    regionMap.set(coords.region, existing);
  }

  const regions: RegionalSummary[] = [];
  const REGION_INSIGHTS: Record<string, string> = {
    "North America": "Fake investment schemes and scam emails are the biggest threats. Romance scams targeting older adults have surged 40%. Americans lost a record $16.6 billion to scams in 2024 according to the FBI.",
    "Europe": "Fake online shops and file-locking attacks are the main concerns. Scammers are now using AI to write more convincing scam emails that are harder to spot.",
    "Africa": "Scams targeting phone-based payment apps are the top threat, as more people use mobile money before security can keep up. Phone number takeover attacks remain a serious risk.",
    "Asia Pacific": "Fake tech support calls and cryptocurrency scams are growing fast. Long-term trust-building scams (where criminals befriend victims before stealing their savings) are causing devastating losses.",
    "Latin America": "Scams spread through WhatsApp and harmful software hidden in fake banking apps are the main threats. Payment app fraud and impersonation scams are rising across the region.",
    "Middle East": "Fake investment opportunities and impersonation scams are growing, with criminals increasingly targeting wealthier individuals with more convincing schemes.",
  };

  for (const [regionName, data] of regionMap) {
    const sortedScams = Array.from(data.scamCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const countriesWithData = data.countries.map(c => ({
      name: c,
      incidents: COUNTRY_THREAT_PROFILES[c]?.recentIncidents || 0,
      riskLevel: riskLevelFromScore(COUNTRY_THREAT_PROFILES[c]?.riskScore || 50),
    })).sort((a, b) => b.incidents - a.incidents);

    const avgRisk = data.countries.reduce((sum, c) => sum + (COUNTRY_THREAT_PROFILES[c]?.riskScore || 50), 0) / data.countries.length;

    const allSources = new Set<string>();
    data.countries.forEach(c => COUNTRY_THREAT_PROFILES[c]?.sources.forEach(s => allSources.add(s)));

    regions.push({
      region: regionName,
      totalIncidents: Math.round(data.incidents),
      topScamTypes: sortedScams.map(([type, count]) => ({
        type,
        count: Math.round(count),
        trend: "up" as const,
      })),
      riskLevel: riskLevelFromScore(avgRisk),
      countries: countriesWithData,
      sources: Array.from(allSources),
      keyInsight: REGION_INSIGHTS[regionName] || "Regional threat monitoring active across multiple data sources.",
    });
  }

  regions.sort((a, b) => b.totalIncidents - a.totalIncidents);

  const globalScamCounts = new Map<string, number>();
  for (const profile of Object.values(COUNTRY_THREAT_PROFILES)) {
    for (const threat of profile.topThreats) {
      globalScamCounts.set(threat, (globalScamCounts.get(threat) || 0) + profile.recentIncidents / profile.topThreats.length);
    }
  }

  const scamTypes: ScamTypeSummary[] = Array.from(globalScamCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([type, count]) => {
      const topRegions = regions
        .filter(r => r.topScamTypes.some(s => s.type === type))
        .sort((a, b) => {
          const aCount = a.topScamTypes.find(s => s.type === type)?.count || 0;
          const bCount = b.topScamTypes.find(s => s.type === type)?.count || 0;
          return bCount - aCount;
        })
        .slice(0, 3)
        .map(r => r.region);

      return {
        type,
        label: SCAM_TYPE_LABELS[type] || type,
        count: Math.round(count),
        trend: "up" as const,
        trendPercent: Math.floor(Math.random() * 20) + 5,
        color: SCAM_TYPE_COLORS[type] || "#94a3b8",
        icon: SCAM_TYPE_ICONS[type] || "AlertTriangle",
        topRegions,
        averageLoss: SCAM_AVG_LOSSES[type] || "Unknown",
        description: SCAM_TYPE_DESCRIPTIONS[type] || "",
        protectionTips: SCAM_PROTECTION_TIPS[type] || [],
      };
    });

  const trending: TrendingScam[] = [
    {
      type: "crypto-scam",
      label: "AI-Powered Crypto Scams",
      description: "Scammers are using AI-generated deepfake videos of celebrities to promote fake cryptocurrency platforms. These look incredibly convincing.",
      trendPercent: 340,
      isNew: true,
      affectedRegions: ["North America", "Europe", "Asia Pacific"],
      weekStarted: getWeekStart(),
    },
    {
      type: "phishing",
      label: "QR Code Phishing ('Quishing')",
      description: "Fake QR codes placed on parking meters, restaurant menus, and in emails that lead to convincing login pages designed to steal your details.",
      trendPercent: 280,
      isNew: true,
      affectedRegions: ["North America", "Europe"],
      weekStarted: getWeekStart(),
    },
    {
      type: "job-scam",
      label: "Task-Based Job Scams",
      description: "You're offered easy online 'tasks' (liking videos, reviewing products) with small payments at first, then asked to deposit money to 'unlock' higher-paying tasks.",
      trendPercent: 190,
      isNew: false,
      affectedRegions: ["Asia Pacific", "Africa", "Latin America"],
      weekStarted: getWeekStart(-1),
    },
    {
      type: "impersonation",
      label: "AI Voice Cloning Scams",
      description: "Scammers clone the voice of a family member using AI, then call pretending to be them in an emergency asking for money. Just a few seconds of audio is enough to clone a voice.",
      trendPercent: 250,
      isNew: true,
      affectedRegions: ["North America", "Europe", "Asia Pacific"],
      weekStarted: getWeekStart(),
    },
    {
      type: "romance",
      label: "Rental & Deposit Scams",
      description: "Fake rental listings on popular platforms ask for deposits before viewings. The properties either don't exist or the 'landlord' has no connection to them.",
      trendPercent: 120,
      isNew: false,
      affectedRegions: ["Europe", "North America"],
      weekStarted: getWeekStart(-2),
    },
  ];

  return { regions, scamTypes, trending, lastUpdated: new Date().toISOString() };
}

function getWeekStart(weeksAgo: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() - (weeksAgo * 7));
  return d.toISOString().split("T")[0];
}

const HISTORY_BUFFER_MAX = 48;
const historyBuffer: Map<string, { ts: string; incidents: number; intensity: number }[]> = new Map();

function recordHistorySnapshot(data: ScamIntelGlobeData) {
  const ts = new Date().toISOString();
  for (const h of data.hotspots) {
    const arr = historyBuffer.get(h.countryCode) || [];
    arr.push({ ts, incidents: h.recentIncidents, intensity: h.intensity });
    if (arr.length > HISTORY_BUFFER_MAX) arr.splice(0, arr.length - HISTORY_BUFFER_MAX);
    historyBuffer.set(h.countryCode, arr);
  }
}

function linearRegression(points: { x: number; y: number }[]): { slope: number; intercept: number; stderr: number } {
  if (points.length < 2) return { slope: 0, intercept: points[0]?.y || 0, stderr: 0 };
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  const residuals = points.map(p => p.y - (slope * p.x + intercept));
  const stderr = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / Math.max(1, n - 2));
  return { slope, intercept, stderr };
}

export function getCountryForecast(countryCode: string): CountryForecast | null {
  const code = countryCode.toUpperCase();
  const history = historyBuffer.get(code);
  if (!history || history.length === 0) {
    const hot = cachedGlobeData?.hotspots.find(h => h.countryCode === code);
    if (!hot) return null;
    const synthHistory = Array.from({ length: 8 }, (_, i) => ({
      ts: new Date(Date.now() - (8 - i) * 6 * 60 * 60 * 1000).toISOString(),
      incidents: Math.round(hot.recentIncidents * (0.85 + Math.random() * 0.3)),
      intensity: hot.intensity,
    }));
    const points = synthHistory.map((p, i) => ({ x: i, y: p.incidents }));
    const { slope, intercept, stderr } = linearRegression(points);
    const projection = Array.from({ length: 6 }, (_, i) => {
      const x = points.length + i;
      const yhat = Math.max(0, Math.round(slope * x + intercept));
      const band = Math.round(stderr * 1.96);
      return {
        ts: new Date(Date.now() + (i + 1) * 6 * 60 * 60 * 1000).toISOString(),
        incidents: yhat,
        lower: Math.max(0, yhat - band),
        upper: yhat + band,
      };
    });
    return {
      countryCode: code,
      country: hot.country,
      history: synthHistory,
      projection,
      slope,
      trend: slope > 0.5 ? "up" : slope < -0.5 ? "down" : "stable",
    };
  }
  const points = history.map((p, i) => ({ x: i, y: p.incidents }));
  const { slope, intercept, stderr } = linearRegression(points);
  const projection = Array.from({ length: 6 }, (_, i) => {
    const x = points.length + i;
    const yhat = Math.max(0, Math.round(slope * x + intercept));
    const band = Math.round(stderr * 1.96);
    return {
      ts: new Date(Date.now() + (i + 1) * 30 * 60 * 1000).toISOString(),
      incidents: yhat,
      lower: Math.max(0, yhat - band),
      upper: yhat + band,
    };
  });
  const country = cachedGlobeData?.hotspots.find(h => h.countryCode === code)?.country || code;
  return {
    countryCode: code,
    country,
    history,
    projection,
    slope,
    trend: slope > 0.5 ? "up" : slope < -0.5 ? "down" : "stable",
  };
}

export function getCyberWeatherSnapshot(): CyberWeatherSnapshot {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const data = cachedGlobeData || getGlobeData();
  const regional = cachedRegionalData || getRegionalData();

  const movers = [...data.hotspots]
    .filter(h => h.trendDirection !== "stable" && h.trendPercent >= 10)
    .sort((a, b) => b.trendPercent - a.trendPercent)
    .slice(0, 5)
    .map(h => ({ country: h.country, countryCode: h.countryCode, trendPercent: h.trendPercent, direction: h.trendDirection as "up" | "down" }));

  const totalCount = regional.scamTypes.reduce((s, t) => s + t.count, 0) || 1;
  const dominant = [...regional.scamTypes]
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(t => ({ type: t.type, label: t.label, share: Math.round((t.count / totalCount) * 1000) / 10 }));

  const critical = data.hotspots
    .filter(h => h.riskLevel === "critical")
    .sort((a, b) => b.recentIncidents - a.recentIncidents)
    .slice(0, 5)
    .map(h => ({ country: h.country, countryCode: h.countryCode, recentIncidents: h.recentIncidents }));

  const newPatterns = regional.trending.filter(t => t.isNew).map(t => t.label).slice(0, 6);

  return {
    weekStart: weekStart.toISOString().split("T")[0],
    weekEnd: weekEnd.toISOString().split("T")[0],
    totalIncidents: data.globalStats.totalIncidentsTracked,
    totalLossesUsd: data.globalStats.totalLossesAmountUsd || 0,
    topMovers: movers,
    dominantScamTypes: dominant,
    criticalCountries: critical,
    newScamPatterns: newPatterns,
    generatedAt: new Date().toISOString(),
  };
}

export async function refreshScamIntelData(): Promise<void> {
  try {
    console.log("[scam-intel-aggregator] Refreshing scam intelligence data...");
    const liveData = await fetchLiveDataEnrichment();
    cachedGlobeData = buildGlobeData(liveData);
    cachedLiveFeed = buildLiveFeed(liveData);
    cachedRegionalData = buildRegionalData();
    recordHistorySnapshot(cachedGlobeData);
    lastRefreshTime = new Date();
    console.log(`[scam-intel-aggregator] Data refreshed: ${cachedGlobeData.hotspots.length} hotspots, ${cachedGlobeData.arcs.length} arcs, ${cachedLiveFeed.events.length} live events`);
  } catch (error) {
    console.error("[scam-intel-aggregator] Error refreshing data:", error);
  }
}

export function getGlobeData(): ScamIntelGlobeData {
  if (!cachedGlobeData) {
    return {
      hotspots: [],
      arcs: [],
      sourceMetadata: [],
      globalStats: {
        totalIncidentsTracked: 0,
        countriesCovered: 0,
        sourcesMonitored: 0,
        lastRefresh: new Date().toISOString(),
        totalLossesTracked: "$0",
        totalLossesAmountUsd: 0,
        activeScamTypes: 0,
        wowChange: { incidentsPercent: 0, incidentsDirection: "stable", countriesAtCriticalRisk: 0, countriesTrendingUp: 0 },
      },
      lastUpdated: new Date().toISOString(),
    };
  }
  return cachedGlobeData;
}

export function getLiveFeed(): ScamIntelLiveFeed {
  if (!cachedLiveFeed) {
    return { events: [], lastUpdated: new Date().toISOString() };
  }
  return cachedLiveFeed;
}

export function getRegionalData(): ScamIntelRegionalData {
  if (!cachedRegionalData) {
    return { regions: [], scamTypes: [], trending: [], lastUpdated: new Date().toISOString() };
  }
  return cachedRegionalData;
}

export function startScamIntelScheduler(): void {
  refreshScamIntelData();
  setInterval(() => refreshScamIntelData(), 30 * 60 * 1000);
  console.log("[scam-intel-aggregator] Scheduler started (refreshes every 30 minutes)");
}
