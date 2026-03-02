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

export interface RegionalScamProfile {
  region: string;
  regionName: string;
  scams: {
    name: string;
    description: string;
    severity: "critical" | "high" | "medium";
    tip: string;
    category: string;
  }[];
}

export const REGIONAL_SCAM_PROFILES: RegionalScamProfile[] = [
  {
    region: "US",
    regionName: "United States",
    scams: [
      { name: "IRS Impersonation", description: "Calls or emails claiming you owe back taxes and threatening arrest or deportation", severity: "critical", tip: "The IRS will never call you demanding immediate payment or threaten arrest", category: "Government" },
      { name: "Social Security Fraud", description: "Callers claiming your Social Security number has been suspended or compromised", severity: "critical", tip: "Social Security will never call to threaten your benefits or ask for payment", category: "Government" },
      { name: "Medicare Enrollment Scams", description: "Fake representatives offering free equipment or demanding your Medicare number", severity: "high", tip: "Never give your Medicare number to someone who contacts you unsolicited", category: "Healthcare" },
      { name: "Student Loan Forgiveness Scams", description: "Fake companies charging fees to apply for loan forgiveness programs", severity: "high", tip: "Legitimate federal programs never charge application fees", category: "Financial" },
      { name: "AI Voice Clone Scams", description: "Scammers using AI to clone a family member's voice in fake emergency calls", severity: "critical", tip: "Use your family safety codeword to verify the caller's identity", category: "AI/Deepfake" },
      { name: "Robocall Auto Warranty Scams", description: "Automated calls about expiring car warranties pressuring you to pay immediately", severity: "medium", tip: "Hang up. Legitimate warranty companies send written notices", category: "Phone" },
    ],
  },
  {
    region: "UK",
    regionName: "United Kingdom",
    scams: [
      { name: "HMRC Tax Refund Scams", description: "Emails or texts claiming you are owed a tax refund from HMRC", severity: "critical", tip: "HMRC will never email, text, or call about tax refunds. Log in to your HMRC account directly", category: "Government" },
      { name: "Royal Mail Delivery Fraud", description: "Fake SMS claiming a parcel needs a redelivery fee", severity: "high", tip: "Royal Mail charges are paid at the door, never via text links", category: "Delivery" },
      { name: "Energy Bill Rebate Scams", description: "Fake government messages offering energy bill discounts or rebates", severity: "high", tip: "Government energy support is applied automatically through your provider", category: "Utility" },
      { name: "NHS Vaccination Scams", description: "Messages asking for payment or bank details to book health appointments", severity: "high", tip: "The NHS will never ask for payment or bank details", category: "Healthcare" },
      { name: "Action Fraud Impersonation", description: "Callers pretending to be from Action Fraud or the police asking you to move money", severity: "critical", tip: "Police and fraud agencies will never ask you to transfer money to a safe account", category: "Impersonation" },
      { name: "Council Tax Rebate Scams", description: "Fake emails about council tax rebates asking for bank details", severity: "medium", tip: "Your council will never email asking for bank details for rebates", category: "Government" },
    ],
  },
  {
    region: "CA",
    regionName: "Canada",
    scams: [
      { name: "CRA Tax Scams", description: "Calls from fake Canada Revenue Agency agents threatening arrest for unpaid taxes", severity: "critical", tip: "The CRA will never threaten you with arrest over the phone", category: "Government" },
      { name: "Immigration Scams", description: "Fake IRCC agents demanding fees to avoid deportation or speed up applications", severity: "high", tip: "IRCC will never call demanding immediate payment", category: "Government" },
      { name: "Interac e-Transfer Fraud", description: "Fake e-Transfer notifications directing you to phishing sites", severity: "high", tip: "Check your bank app directly instead of clicking email links", category: "Financial" },
      { name: "Canadian Anti-Fraud Centre Impersonation", description: "Scammers pretending to be from the CAFC to collect personal information", severity: "high", tip: "The CAFC investigates fraud. They will not call to collect personal information", category: "Impersonation" },
      { name: "SIM Swap Attacks", description: "Criminals transferring your phone number to steal banking codes", severity: "critical", tip: "Set a PIN with your mobile carrier and use authenticator apps instead of SMS codes", category: "Identity" },
    ],
  },
  {
    region: "AU",
    regionName: "Australia",
    scams: [
      { name: "MyGov Impersonation", description: "Fake myGov emails or texts asking you to verify your identity or claim a refund", severity: "critical", tip: "Always log in to myGov directly. Never click links in emails or texts", category: "Government" },
      { name: "Toll Road SMS Scams", description: "Fake texts claiming unpaid toll fees with a payment link", severity: "high", tip: "Check directly with your toll provider's official app or website", category: "Financial" },
      { name: "NBN Impersonation", description: "Callers claiming to be from the NBN offering upgrades or warning of disconnection", severity: "high", tip: "NBN Co does not make unsolicited calls about your internet connection", category: "Impersonation" },
      { name: "Flubot SMS Malware", description: "Text messages with links that install malware on Android phones", severity: "critical", tip: "Never click links in unexpected text messages. Delete them immediately", category: "Malware" },
      { name: "Bushfire and Flood Charity Scams", description: "Fake charities exploiting natural disasters to collect donations", severity: "high", tip: "Only donate through verified charities on the ACNC register", category: "Fraud" },
    ],
  },
  {
    region: "EU",
    regionName: "Europe",
    scams: [
      { name: "EU Customs and VAT Scams", description: "Fake customs notifications demanding VAT or duty payments on packages", severity: "high", tip: "Verify directly with the postal service or courier before paying any fees", category: "Delivery" },
      { name: "Bank Verification Fraud", description: "Calls or messages claiming your bank account has been compromised, asking you to verify", severity: "critical", tip: "Banks will never ask for your full PIN, password, or one-time codes", category: "Financial" },
      { name: "GDPR Compliance Scams", description: "Fake fines for GDPR violations targeting small businesses", severity: "medium", tip: "Official GDPR fines come through your national data protection authority, not email", category: "Business" },
      { name: "Energy Rebate Phishing", description: "Fake government energy rebate offers stealing banking credentials", severity: "high", tip: "Government energy support programs never require you to enter banking details via email", category: "Utility" },
      { name: "Holiday Rental Fraud", description: "Fake vacation property listings that disappear after payment", severity: "high", tip: "Use verified booking platforms and never pay by direct bank transfer", category: "Fraud" },
    ],
  },
  {
    region: "AF",
    regionName: "Africa",
    scams: [
      { name: "Mobile Money Fraud", description: "Fake M-Pesa, MTN, or Airtel Money messages tricking you into sending money or sharing PINs", severity: "critical", tip: "Your mobile money provider will never ask for your PIN via SMS or phone call", category: "Financial" },
      { name: "SIM Swap Scams", description: "Criminals taking over your phone number to access banking and mobile money accounts", severity: "critical", tip: "Set a SIM swap PIN with your carrier and use app-based authentication", category: "Identity" },
      { name: "Fake Job Offers", description: "Job postings requiring upfront fees for training, uniforms, or processing", severity: "high", tip: "Legitimate employers never charge applicants to get hired", category: "Employment" },
      { name: "Advance Fee Fraud", description: "Messages promising large sums of money in exchange for a small upfront payment", severity: "high", tip: "If someone asks for money to release money, it is always a scam", category: "Fraud" },
      { name: "Fake Government Grant Scams", description: "Social media posts or WhatsApp messages about government grants requiring registration fees", severity: "high", tip: "Verify government programs through official government websites only", category: "Government" },
      { name: "WhatsApp and Telegram Fraud", description: "Impersonators cloning contacts and requesting urgent money transfers", severity: "critical", tip: "Call the person directly on a known number before sending any money", category: "Impersonation" },
    ],
  },
  {
    region: "AS_SOUTH",
    regionName: "South Asia",
    scams: [
      { name: "UPI Payment Fraud", description: "Scammers sending collect requests disguised as payments on Google Pay, PhonePe, or Paytm", severity: "critical", tip: "Never approve a collect request to receive money. You only approve requests to send money", category: "Financial" },
      { name: "KYC Verification Scams", description: "Fake bank messages threatening account suspension unless you update KYC details", severity: "critical", tip: "Banks send KYC reminders in-app. Never share OTP or card details via phone or text", category: "Financial" },
      { name: "Fake Customer Service Numbers", description: "Search engine results showing fake toll-free numbers for banks and companies", severity: "high", tip: "Only use customer service numbers from the official app or website", category: "Impersonation" },
      { name: "Lottery and Prize Scams", description: "WhatsApp messages claiming you have won a lottery or prize requiring a processing fee", severity: "high", tip: "You cannot win a lottery you never entered. These are always scams", category: "Fraud" },
      { name: "Part-Time Job Scams", description: "Work-from-home offers on Telegram requiring an initial investment", severity: "high", tip: "Legitimate jobs pay you. You should never have to pay to work", category: "Employment" },
    ],
  },
  {
    region: "AS_SOUTHEAST",
    regionName: "Southeast Asia",
    scams: [
      { name: "QR Code Payment Fraud", description: "Tampered QR codes at shops and restaurants redirecting payments to scammers", severity: "critical", tip: "Always verify the merchant name on screen before confirming any QR payment", category: "Financial" },
      { name: "Ride-Hailing Phishing", description: "Fake Grab or Gojek messages with phishing links to steal login credentials", severity: "high", tip: "Only open ride-hailing notifications through the official app", category: "Phishing" },
      { name: "Telegram Investment Groups", description: "Fake cryptocurrency and forex trading groups promising guaranteed returns", severity: "critical", tip: "No legitimate investment guarantees returns. These groups are designed to steal your money", category: "Investment" },
      { name: "E-Commerce Fake Shops", description: "Social media ads for deeply discounted products from stores that never deliver", severity: "high", tip: "Stick to established e-commerce platforms with buyer protection", category: "Fraud" },
      { name: "WhatsApp OTP Theft", description: "Friends or contacts asking you to forward a verification code sent to your phone", severity: "high", tip: "Never share verification codes. This lets scammers take over your accounts", category: "Identity" },
    ],
  },
  {
    region: "SA",
    regionName: "Latin America",
    scams: [
      { name: "Banking Trojans", description: "Fake banking apps or links that install malware to steal your banking credentials", severity: "critical", tip: "Only download banking apps from official app stores and verify the developer name", category: "Malware" },
      { name: "Fake Delivery Notifications", description: "SMS claiming a package needs customs payment with a link to a phishing site", severity: "high", tip: "Track packages only through the official courier website or app", category: "Delivery" },
      { name: "WhatsApp Cloning", description: "Scammers duplicating your WhatsApp account to contact and defraud your family", severity: "critical", tip: "Enable two-step verification in WhatsApp settings immediately", category: "Identity" },
      { name: "Fake Boleto Scams", description: "Altered payment slips that redirect payments to scammer accounts", severity: "high", tip: "Always verify the recipient details before confirming any boleto payment", category: "Financial" },
      { name: "Prize and Lottery Scams", description: "Messages claiming you won a prize from a major company requiring a fee to claim", severity: "medium", tip: "Legitimate companies do not charge winners to collect prizes", category: "Fraud" },
    ],
  },
  {
    region: "NZ",
    regionName: "New Zealand",
    scams: [
      { name: "IRD Tax Scams", description: "Fake Inland Revenue emails or texts about tax refunds or overdue payments", severity: "high", tip: "IRD will never ask for banking details via email or text. Use myIR directly", category: "Government" },
      { name: "Waka Kotahi Toll Scams", description: "Fake road toll SMS demanding payment via a link", severity: "high", tip: "Pay tolls only through the official Waka Kotahi website", category: "Financial" },
      { name: "TradeMe and Marketplace Fraud", description: "Fake listings on online marketplaces that disappear after receiving payment", severity: "high", tip: "Use platform payment protections and never pay by direct bank transfer", category: "Fraud" },
      { name: "Fake Charity Scams", description: "Fraudulent charities soliciting donations after natural disasters", severity: "medium", tip: "Verify charities on the Charities Register before donating", category: "Fraud" },
    ],
  },
  {
    region: "GLOBAL",
    regionName: "Worldwide",
    scams: [
      { name: "Romance Scams", description: "Someone you met online builds a relationship, then asks for money due to an emergency", severity: "critical", tip: "Never send money to someone you have not met in person, no matter how long you have been talking", category: "Romance" },
      { name: "Phishing Emails", description: "Emails pretending to be from trusted companies asking you to click a link or download a file", severity: "critical", tip: "Check the sender's email address carefully and go to websites directly instead of clicking links", category: "Phishing" },
      { name: "Tech Support Scams", description: "Pop-ups or calls claiming your computer is infected and offering to fix it for a fee", severity: "high", tip: "Legitimate tech companies never call you about problems or use pop-up warnings", category: "Tech Support" },
      { name: "Business Email Compromise", description: "Emails impersonating company executives requesting urgent wire transfers", severity: "critical", tip: "Always verify payment requests through a separate communication channel", category: "Business" },
      { name: "Cryptocurrency Investment Scams", description: "Social media or messaging app groups promising guaranteed high returns on crypto investments", severity: "critical", tip: "No legitimate investment guarantees returns. If it sounds too good to be true, it is", category: "Investment" },
    ],
  },
];

export function getScamProfileByRegion(regionCode: string): RegionalScamProfile {
  const tzRegionMap: Record<string, string> = {
    "AF_WEST": "AF", "AF_EAST": "AF", "AF_SOUTH": "AF",
  };
  const mapped = tzRegionMap[regionCode] || regionCode;
  return REGIONAL_SCAM_PROFILES.find(p => p.region === mapped) ||
    REGIONAL_SCAM_PROFILES.find(p => p.region === "GLOBAL")!;
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
