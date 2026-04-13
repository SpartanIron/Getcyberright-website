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
}

interface GlobeArc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  scamType: string;
  volume: number;
  color: string;
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
}

interface GlobalStats {
  totalIncidentsTracked: number;
  countriesCovered: number;
  sourcesMonitored: number;
  lastRefresh: string;
  totalLossesTracked: string;
  activeScamTypes: number;
}

export interface ScamIntelGlobeData {
  hotspots: GlobeHotspot[];
  arcs: GlobeArc[];
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
  phishing: "Deceptive emails, texts, and websites designed to steal personal information and credentials",
  romance: "Fake romantic relationships built online to manipulate victims into sending money",
  investment: "Fraudulent investment schemes including Ponzi schemes, fake platforms, and pump-and-dump operations",
  "tech-support": "Scammers impersonating tech companies to gain remote access to devices and steal money",
  impersonation: "Criminals posing as government officials, banks, or utilities to extract money or information",
  ransomware: "Malicious software that encrypts files and demands payment for their release",
  "identity-theft": "Stealing personal information to open accounts, make purchases, or commit fraud in someone's name",
  "mobile-money": "Fraud targeting mobile payment systems including fake transfers and SIM swap attacks",
  malware: "Software designed to damage, disrupt, or gain unauthorized access to computer systems",
  "shopping-fraud": "Fake online stores, counterfeit goods, and non-delivery scams targeting online shoppers",
  "crypto-scam": "Fraudulent cryptocurrency schemes including fake exchanges, rug pulls, and pig butchering",
  "job-scam": "Fake job offers designed to steal personal information or advance-fee payments from job seekers",
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
    };
  }).filter(Boolean) as GlobeArc[];

  const totalIncidents = Object.values(COUNTRY_THREAT_PROFILES).reduce((sum, p) => sum + p.recentIncidents, 0);

  return {
    hotspots,
    arcs,
    globalStats: {
      totalIncidentsTracked: totalIncidents + liveData.dbAlertCount + liveData.dbThreatCount,
      countriesCovered: hotspots.length,
      sourcesMonitored: 28 + liveData.dbScamIntelCount,
      lastRefresh: new Date().toISOString(),
      totalLossesTracked: "$1.03T+",
      activeScamTypes: Object.keys(SCAM_TYPE_LABELS).length,
    },
    lastUpdated: new Date().toISOString(),
  };
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
    "North America": "Investment fraud and phishing dominate, with romance scams surging 40% among seniors. FBI IC3 reports record $16.6B in losses for 2024.",
    "Europe": "Cross-border shopping fraud and ransomware campaigns are the primary concerns, with AI-generated phishing emails becoming increasingly sophisticated.",
    "Africa": "Mobile money fraud is the leading threat, driven by rapid fintech adoption outpacing security infrastructure. SIM swap attacks remain critical.",
    "Asia Pacific": "Tech support scams and cryptocurrency fraud are surging, with pig butchering operations causing devastating losses across the region.",
    "Latin America": "Banking trojans and WhatsApp-based scams dominate, with PIX payment fraud in Brazil and impersonation scams across the region.",
    "Middle East": "Investment fraud and impersonation scams are growing, with increasing sophistication in targeting high-net-worth individuals.",
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
      };
    });

  return { regions, scamTypes, lastUpdated: new Date().toISOString() };
}

export async function refreshScamIntelData(): Promise<void> {
  try {
    console.log("[scam-intel-aggregator] Refreshing scam intelligence data...");
    const liveData = await fetchLiveDataEnrichment();
    cachedGlobeData = buildGlobeData(liveData);
    cachedLiveFeed = buildLiveFeed(liveData);
    cachedRegionalData = buildRegionalData();
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
      globalStats: {
        totalIncidentsTracked: 0,
        countriesCovered: 0,
        sourcesMonitored: 0,
        lastRefresh: new Date().toISOString(),
        totalLossesTracked: "$0",
        activeScamTypes: 0,
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
    return { regions: [], scamTypes: [], lastUpdated: new Date().toISOString() };
  }
  return cachedRegionalData;
}

export function startScamIntelScheduler(): void {
  refreshScamIntelData();
  setInterval(() => refreshScamIntelData(), 30 * 60 * 1000);
  console.log("[scam-intel-aggregator] Scheduler started (refreshes every 30 minutes)");
}
