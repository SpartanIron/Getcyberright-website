import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, 
  X, 
  Send, 
  Shield, 
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  ChevronDown,
  Loader2,
  Lock
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import deziAvatar from "@/assets/images/dezi-avatar.png";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  displayedContent?: string;
  isStreaming?: boolean;
  timestamp: Date;
}

interface RegionInfo {
  country: string;
  countryCode: string;
  detected: boolean;
}

interface RegionResources {
  name: string;
  fraudReport: string;
  fraudReportUrl: string;
  cyberCrime: string;
  cyberCrimeUrl: string;
  identityTheft: string;
  identityTheftUrl: string;
  consumerProtection: string;
  consumerProtectionUrl: string;
}

const regionResources: Record<string, RegionResources> = {
  US: {
    name: "United States",
    fraudReport: "FTC",
    fraudReportUrl: "ReportFraud.ftc.gov",
    cyberCrime: "FBI IC3",
    cyberCrimeUrl: "ic3.gov",
    identityTheft: "IdentityTheft.gov",
    identityTheftUrl: "IdentityTheft.gov",
    consumerProtection: "FTC Consumer Protection",
    consumerProtectionUrl: "consumer.ftc.gov",
  },
  GB: {
    name: "United Kingdom",
    fraudReport: "Action Fraud",
    fraudReportUrl: "actionfraud.police.uk",
    cyberCrime: "NCSC",
    cyberCrimeUrl: "ncsc.gov.uk",
    identityTheft: "CIFAS",
    identityTheftUrl: "cifas.org.uk",
    consumerProtection: "Citizens Advice",
    consumerProtectionUrl: "citizensadvice.org.uk",
  },
  CA: {
    name: "Canada",
    fraudReport: "Canadian Anti-Fraud Centre",
    fraudReportUrl: "antifraudcentre-centreantifraude.ca",
    cyberCrime: "Cyber Centre",
    cyberCrimeUrl: "cyber.gc.ca",
    identityTheft: "CAFC",
    identityTheftUrl: "antifraudcentre-centreantifraude.ca",
    consumerProtection: "Competition Bureau",
    consumerProtectionUrl: "competitionbureau.gc.ca",
  },
  AU: {
    name: "Australia",
    fraudReport: "Scamwatch",
    fraudReportUrl: "scamwatch.gov.au",
    cyberCrime: "ReportCyber",
    cyberCrimeUrl: "cyber.gov.au/report",
    identityTheft: "IDCARE",
    identityTheftUrl: "idcare.org",
    consumerProtection: "ACCC",
    consumerProtectionUrl: "accc.gov.au",
  },
  NZ: {
    name: "New Zealand",
    fraudReport: "Netsafe",
    fraudReportUrl: "netsafe.org.nz",
    cyberCrime: "CERT NZ",
    cyberCrimeUrl: "cert.govt.nz",
    identityTheft: "IDCARE",
    identityTheftUrl: "idcare.org",
    consumerProtection: "Commerce Commission",
    consumerProtectionUrl: "comcom.govt.nz",
  },
  IE: {
    name: "Ireland",
    fraudReport: "Garda Fraud",
    fraudReportUrl: "garda.ie",
    cyberCrime: "NCSC Ireland",
    cyberCrimeUrl: "ncsc.gov.ie",
    identityTheft: "Data Protection Commission",
    identityTheftUrl: "dataprotection.ie",
    consumerProtection: "CCPC",
    consumerProtectionUrl: "ccpc.ie",
  },
  // African Countries
  GH: {
    name: "Ghana",
    fraudReport: "Ghana Police CID Cybercrime Unit",
    fraudReportUrl: "police.gov.gh",
    cyberCrime: "Cyber Security Authority Ghana",
    cyberCrimeUrl: "csa.gov.gh",
    identityTheft: "Data Protection Commission Ghana",
    identityTheftUrl: "dataprotection.org.gh",
    consumerProtection: "Consumer Protection Agency Ghana",
    consumerProtectionUrl: "cpa.gov.gh",
  },
  NG: {
    name: "Nigeria",
    fraudReport: "EFCC (Economic and Financial Crimes Commission)",
    fraudReportUrl: "efcc.gov.ng",
    cyberCrime: "Nigeria CERT",
    cyberCrimeUrl: "cert.gov.ng",
    identityTheft: "NITDA",
    identityTheftUrl: "nitda.gov.ng",
    consumerProtection: "Federal Competition & Consumer Protection Commission",
    consumerProtectionUrl: "fccpc.gov.ng",
  },
  ZA: {
    name: "South Africa",
    fraudReport: "SAPS Cybercrime",
    fraudReportUrl: "saps.gov.za",
    cyberCrime: "CSIRT South Africa",
    cyberCrimeUrl: "cybersecurityhub.gov.za",
    identityTheft: "SAFPS",
    identityTheftUrl: "safps.org.za",
    consumerProtection: "National Consumer Commission",
    consumerProtectionUrl: "thencc.gov.za",
  },
  KE: {
    name: "Kenya",
    fraudReport: "DCI Cybercrime Unit",
    fraudReportUrl: "dci.go.ke",
    cyberCrime: "Kenya National CERT",
    cyberCrimeUrl: "ke-cirt.go.ke",
    identityTheft: "Office of Data Protection Commissioner",
    identityTheftUrl: "odpc.go.ke",
    consumerProtection: "Competition Authority of Kenya",
    consumerProtectionUrl: "cak.go.ke",
  },
  EG: {
    name: "Egypt",
    fraudReport: "Ministry of Interior Cybercrime",
    fraudReportUrl: "moiegypt.gov.eg",
    cyberCrime: "EG-CERT",
    cyberCrimeUrl: "egcert.eg",
    identityTheft: "Personal Data Protection Center",
    identityTheftUrl: "idsc.gov.eg",
    consumerProtection: "Consumer Protection Agency Egypt",
    consumerProtectionUrl: "cpa.gov.eg",
  },
  MA: {
    name: "Morocco",
    fraudReport: "DGSN Cybercrime Brigade",
    fraudReportUrl: "dgsn.gov.ma",
    cyberCrime: "maCERT",
    cyberCrimeUrl: "macert.ma",
    identityTheft: "CNDP Morocco",
    identityTheftUrl: "cndp.ma",
    consumerProtection: "Ministry of Commerce Morocco",
    consumerProtectionUrl: "mcinet.gov.ma",
  },
  TZ: {
    name: "Tanzania",
    fraudReport: "Tanzania Police Cybercrime Unit",
    fraudReportUrl: "polisi.go.tz",
    cyberCrime: "TZ-CERT",
    cyberCrimeUrl: "tzcert.go.tz",
    identityTheft: "TCRA",
    identityTheftUrl: "tcra.go.tz",
    consumerProtection: "Fair Competition Commission",
    consumerProtectionUrl: "competition.or.tz",
  },
  UG: {
    name: "Uganda",
    fraudReport: "Uganda Police Cybercrime Unit",
    fraudReportUrl: "upf.go.ug",
    cyberCrime: "CERT Uganda",
    cyberCrimeUrl: "ug-cert.ug",
    identityTheft: "Personal Data Protection Office",
    identityTheftUrl: "pdpo.go.ug",
    consumerProtection: "Uganda Consumer Protection Association",
    consumerProtectionUrl: "consumerprotection.go.ug",
  },
  // European Union countries
  DE: {
    name: "Germany",
    fraudReport: "Bundeskriminalamt (BKA)",
    fraudReportUrl: "bka.de",
    cyberCrime: "BSI (Federal Cyber Security)",
    cyberCrimeUrl: "bsi.bund.de",
    identityTheft: "BfDI Data Protection",
    identityTheftUrl: "bfdi.bund.de",
    consumerProtection: "Verbraucherzentrale",
    consumerProtectionUrl: "verbraucherzentrale.de",
  },
  FR: {
    name: "France",
    fraudReport: "Pharos Platform",
    fraudReportUrl: "internet-signalement.gouv.fr",
    cyberCrime: "ANSSI",
    cyberCrimeUrl: "ssi.gouv.fr",
    identityTheft: "CNIL",
    identityTheftUrl: "cnil.fr",
    consumerProtection: "DGCCRF",
    consumerProtectionUrl: "economie.gouv.fr/dgccrf",
  },
  IN: {
    name: "India",
    fraudReport: "National Cyber Crime Portal",
    fraudReportUrl: "cybercrime.gov.in",
    cyberCrime: "CERT-In",
    cyberCrimeUrl: "cert-in.org.in",
    identityTheft: "Cyber Crime Cell",
    identityTheftUrl: "cybercrime.gov.in",
    consumerProtection: "National Consumer Helpline",
    consumerProtectionUrl: "consumerhelpline.gov.in",
  },
  DEFAULT: {
    name: "your region",
    fraudReport: "your local police cybercrime unit",
    fraudReportUrl: "",
    cyberCrime: "your national CERT (Computer Emergency Response Team)",
    cyberCrimeUrl: "",
    identityTheft: "your data protection authority",
    identityTheftUrl: "",
    consumerProtection: "your consumer protection agency",
    consumerProtectionUrl: "",
  },
};

const suggestedPrompts = [
  { text: "Is this message a scam?", icon: AlertTriangle },
  { text: "How do phishing scams work?", icon: HelpCircle },
  { text: "Generate a strong password", icon: Shield },
  { text: "How can I protect my family online?", icon: Shield },
];


// Scam analysis patterns
const scamPatterns = {
  urgency: [
    /act now/i, /urgent/i, /immediately/i, /expires?\s*(today|soon|in \d+)/i,
    /limited time/i, /don't wait/i, /hurry/i, /last chance/i, /final notice/i,
    /within 24 hours/i, /account will be/i, /suspended/i, /terminated/i,
  ],
  money: [
    /gift\s*card/i, /wire\s*transfer/i, /bitcoin/i, /crypto/i, /payment/i,
    /send\s*money/i, /western\s*union/i, /moneygram/i, /zelle/i, /venmo/i,
    /\$\d+/i, /won\s*(a|the)/i, /lottery/i, /inheritance/i, /million/i,
  ],
  threats: [
    /arrest/i, /warrant/i, /legal\s*action/i, /lawsuit/i, /police/i,
    /irs/i, /tax/i, /owe/i, /debt/i, /collection/i, /jail/i, /court/i,
  ],
  impersonation: [
    /amazon/i, /apple/i, /microsoft/i, /google/i, /paypal/i, /netflix/i,
    /bank\s*of/i, /wells\s*fargo/i, /chase/i, /citibank/i, /social\s*security/i,
    /medicare/i, /ssa/i, /government/i, /federal/i,
  ],
  suspicious: [
    /click\s*(here|this|below)/i, /verify\s*(your|account)/i, /confirm\s*(your|identity)/i,
    /update\s*(your|payment)/i, /unusual\s*activity/i, /security\s*alert/i,
    /password\s*(expired|reset)/i, /login\s*attempt/i, /compromised/i,
  ],
  grammar: [
    /dear\s*(customer|user|sir|madam|friend)/i, /kindly/i, /revert\s*back/i,
    /do\s*the\s*needful/i, /hereby/i, /humbly/i,
  ],
};

interface ScamAnalysisResult {
  isLikelyScam: boolean;
  riskLevel: "low" | "medium" | "high";
  redFlags: string[];
  score: number;
}

function analyzeForScam(text: string): ScamAnalysisResult {
  const redFlags: string[] = [];
  let score = 0;

  // Check urgency patterns
  const urgencyMatches = scamPatterns.urgency.filter(p => p.test(text));
  if (urgencyMatches.length > 0) {
    redFlags.push("Creates urgency or pressure to act fast");
    score += urgencyMatches.length * 15;
  }

  // Check money/payment patterns
  const moneyMatches = scamPatterns.money.filter(p => p.test(text));
  if (moneyMatches.length > 0) {
    redFlags.push("Mentions money, payments, or financial transactions");
    score += moneyMatches.length * 20;
  }

  // Check threat patterns
  const threatMatches = scamPatterns.threats.filter(p => p.test(text));
  if (threatMatches.length > 0) {
    redFlags.push("Contains threats or mentions legal action");
    score += threatMatches.length * 25;
  }

  // Check impersonation patterns
  const impersonationMatches = scamPatterns.impersonation.filter(p => p.test(text));
  if (impersonationMatches.length > 0) {
    redFlags.push("Claims to be from a well-known company or government agency");
    score += impersonationMatches.length * 15;
  }

  // Check suspicious action patterns
  const suspiciousMatches = scamPatterns.suspicious.filter(p => p.test(text));
  if (suspiciousMatches.length > 0) {
    redFlags.push("Asks you to click links or verify account information");
    score += suspiciousMatches.length * 20;
  }

  // Check grammar patterns (common in scams)
  const grammarMatches = scamPatterns.grammar.filter(p => p.test(text));
  if (grammarMatches.length > 0) {
    redFlags.push("Uses unusual or overly formal language");
    score += grammarMatches.length * 10;
  }

  // Check for URLs
  const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
  const urls = text.match(urlPattern);
  if (urls && urls.length > 0) {
    redFlags.push("Contains links (be cautious before clicking)");
    score += 10;
  }

  // Check for phone numbers
  const phonePattern = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
  if (phonePattern.test(text)) {
    redFlags.push("Contains phone numbers (verify before calling)");
    score += 5;
  }

  // Determine risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (score >= 60) riskLevel = "high";
  else if (score >= 30) riskLevel = "medium";

  return {
    isLikelyScam: score >= 40,
    riskLevel,
    redFlags,
    score: Math.min(score, 100),
  };
}

function generatePassword(length: number = 16): string {
  const lowercase = "abcdefghijkmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;

  let password = "";
  // Ensure at least one of each type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split("").sort(() => Math.random() - 0.5).join("");
}

function looksLikePastedContent(text: string): boolean {
  // Detect if user pasted a message to analyze
  const indicators = [
    text.length > 100,
    text.includes("\n"),
    /^(from|subject|dear|hi|hello|attention)/i.test(text.trim()),
    /"[^"]{20,}"/.test(text), // Quoted text
    /received.*message|got.*email|someone.*sent/i.test(text),
  ];
  return indicators.filter(Boolean).length >= 2;
}

function getRegionResources(countryCode: string): RegionResources {
  return regionResources[countryCode] || regionResources.DEFAULT;
}

function getResponse(userMessage: string, region: RegionInfo | null): string {
  const lowerMessage = userMessage.toLowerCase();
  const r = region ? getRegionResources(region.countryCode) : regionResources.DEFAULT;
  const regionNote = region?.detected ? `\n\nI noticed you are connecting from ${r.name}. ` : "\n\n";
  
  // Password generation request
  if (lowerMessage.includes("password") && (lowerMessage.includes("generate") || lowerMessage.includes("create") || lowerMessage.includes("make") || lowerMessage.includes("new") || lowerMessage.includes("strong"))) {
    const password = generatePassword(16);
    return `Here is a strong, randomly generated password for you:

**Your New Password:**
\`${password}\`

This password is 16 characters long and includes uppercase letters, lowercase letters, numbers, and symbols. Here are some tips:

**Best Practices:**
• Use a different password for each account
• Consider using a password manager to store your passwords securely
• Enable two factor authentication when available
• Never share your passwords with anyone

Would you like me to generate another password, or would you prefer to use our Password Generator tool for more options like custom length and character types?`;
  }

  // Check if user pasted content that looks like a message to analyze
  // Trigger analysis for: pasted content, URLs/phone numbers present, or user asking to check something
  const hasUrl = /https?:\/\/[^\s]+|www\.[^\s]+/i.test(userMessage);
  const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(userMessage);
  const isAskingToCheck = /check|analyze|is this|look at|what do you think/i.test(lowerMessage);
  const shouldAnalyze = looksLikePastedContent(userMessage) || hasUrl || hasPhone || (isAskingToCheck && userMessage.length > 50);
  
  if (shouldAnalyze) {
    const analysis = analyzeForScam(userMessage);
    
    if (analysis.redFlags.length > 0) {
      const riskText = analysis.riskLevel === "high" ? "HIGH RISK" : analysis.riskLevel === "medium" ? "MEDIUM RISK" : "LOW RISK";
      
      let response = `I analyzed the message you shared. Here is what I found:

**Risk Assessment: ${riskText}**

**Red Flags Detected:**
${analysis.redFlags.map(flag => `• ${flag}`).join("\n")}

`;
      if (analysis.isLikelyScam) {
        response += `**My Assessment:**
This message shows several warning signs commonly found in scam messages. I would recommend not clicking any links, not calling any numbers in the message, and not providing any personal information.

If you received this unexpectedly, it is best to contact the company directly using their official website or phone number you find yourself.
`;
      } else {
        response += `**My Assessment:**
While this message has some elements worth noting, it may not necessarily be a scam. However, you should still be cautious. Verify the sender through official channels before taking any action.
`;
      }
      
      response += `
**Want a Deeper Analysis?**
For a more detailed check including email header analysis and URL reputation scanning, try our full Scam Checker tool.

If this is a scam, you can report it to ${r.fraudReport}${r.fraudReportUrl ? ` at ${r.fraudReportUrl}` : ""}.`;
      
      return response;
    } else if (shouldAnalyze && userMessage.length > 30) {
      // No red flags found but user asked for analysis
      return `I looked at the message you shared and did not find any obvious red flags. That said, no automated check is perfect.

**Signs This Might Be Legitimate:**
• No urgent language or pressure tactics detected
• No obvious requests for money or personal information
• No threatening language found

**Still Not Sure?**
Trust your instincts. If something feels off, it is always worth verifying. You can:
• Contact the sender through their official website
• Look up the company's real phone number and call them directly
• Use our full Scam Checker tool for email header analysis and URL reputation checks

Stay safe, and let me know if you have any other questions!`;
    }
  }
  
  if (lowerMessage.includes("scam") || lowerMessage.includes("suspicious") || lowerMessage.includes("fraud") || lowerMessage.includes("fake")) {
    return `I can help you figure out if something is a scam! You can paste a suspicious message, email, or text directly into this chat and I will analyze it for red flags.

**What I Look For:**
• Urgency or pressure tactics
• Requests for money or gift cards
• Threats or legal action claims
• Impersonation of known companies
• Suspicious links or requests

**To Get Started:**
Just paste the message you received and I will give you a quick assessment.

**For Detailed Analysis:**
Our Scam Checker tool offers even more features like email header analysis and URL reputation checking. You can find it in the Tools section.

Go ahead and paste a message if you have one, or ask me anything about staying safe online.`;
  }

  if (lowerMessage.includes("phishing") || lowerMessage.includes("email") || lowerMessage.includes("text message")) {
    return `Phishing is one of the most common online scams, and understanding how it works can help you avoid it.

**How It Works:**
Scammers send emails, texts, or messages pretending to be from trusted organizations like banks, tech companies, or government agencies. These messages usually claim something is wrong with your account and urge you to act quickly. They include links to fake websites that look real, and when you enter your information, it goes straight to the criminals.

**Watch Out For:**
• Unexpected password reset requests
• Package delivery notifications you were not expecting
• Prize or lottery announcements
• Messages claiming to be from tax authorities about refunds

**How to Protect Yourself:**
• Never click links in unexpected messages
• When in doubt, contact the organization directly
• Check sender addresses for misspellings
• Turn on two factor authentication for your accounts
${regionNote}You can report phishing attempts to ${r.cyberCrime}${r.cyberCrimeUrl ? ` at ${r.cyberCrimeUrl}` : ""} or learn more from ${r.consumerProtection}${r.consumerProtectionUrl ? ` at ${r.consumerProtectionUrl}` : ""}.`;
  }

  if (lowerMessage.includes("family") || lowerMessage.includes("kids") || lowerMessage.includes("children") || lowerMessage.includes("protect") || lowerMessage.includes("senior") || lowerMessage.includes("parent")) {
    return `Keeping your family safe online is all about building good habits and having open conversations.

**For Children:**
Parental controls are a great starting point. Keep devices in common areas so you can stay involved, and talk about online safety in ways they can understand. Teach them never to share personal information, and set clear rules about screen time and app downloads.

**For Teenagers:**
Teens benefit from conversations about their digital reputation and how online content can stick around forever. Encourage them to come to you if something feels wrong, and help them understand the risks of oversharing personal details.

**For Seniors:**
Help set up fraud alerts on bank accounts and establish a family code word for emergencies. Review privacy settings together and encourage them to verify any unexpected requests before responding.

**For Everyone:**
Use strong, unique passwords for each account. Enable two factor authentication whenever possible, keep your devices updated, and talk as a family about the latest scam trends.
${regionNote}For additional resources, visit ${r.consumerProtection}${r.consumerProtectionUrl ? ` at ${r.consumerProtectionUrl}` : ""}.`;
  }

  if (lowerMessage.includes("clicked") || lowerMessage.includes("link") || lowerMessage.includes("what should i do") || lowerMessage.includes("accident")) {
    return `First, take a breath. Clicking a suspicious link is not the end of the world, but here is what you should do right away.

**Right Now:**
Close the browser tab or window immediately. If you have not entered any information or downloaded anything, you are probably fine. If you are worried about malware, you can disconnect from the internet temporarily.

**Check Your Device:**
Run a full antivirus scan. Look through your browser extensions for anything unfamiliar, check your downloads folder, and review your installed programs for anything you do not recognize.

**If You Entered Any Information:**
Change the password for that account right away. If you use the same password elsewhere, change those too. Turn on two factor authentication, and if you entered bank or credit card details, contact your bank immediately. Keep an eye on your accounts for any unusual activity.

**Moving Forward:**
Consider setting up fraud alerts with credit bureaus. Report the phishing attempt to ${r.fraudReport}${r.fraudReportUrl ? ` at ${r.fraudReportUrl}` : ""}, and stay alert for suspicious follow up emails or calls over the next few weeks.
${regionNote}Our Emergency Help page has more detailed guidance, and you can also contact ${r.identityTheft}${r.identityTheftUrl ? ` at ${r.identityTheftUrl}` : ""} for identity protection support.`;
  }

  // Default welcome message with region-specific resources
  const hasSpecificResources = r.fraudReportUrl !== "";
  const emergencyHelpNote = hasSpecificResources 
    ? `Visit our **Emergency Help** page at /emergency-help for step-by-step guidance and more resources for ${r.name}.`
    : `Visit our **Emergency Help** page at /emergency-help for step-by-step guidance. You can also select your region there to find specific reporting agencies for your country.`;

  return `Hello! I am Dezi, your online safety assistant.${region?.detected ? ` I see you are connecting from ${r.name}.` : ""} I am here to help you understand digital risks and learn how to protect yourself and your family.

**I Can Help You With:**
• Analyzing suspicious messages for scam indicators
• Explaining how common cyber threats work
• Sharing practical tips to keep your family safe online
• Guiding you on what to do after a security incident

**Protect Yourself Today:**
• Use strong, unique passwords for every account
• Enable two-factor authentication wherever possible
• Never click links in unexpected messages
• Verify requests by contacting organizations directly
• Keep your devices and apps updated
• Create a family safety codeword to verify emergency calls

**Free Tools Available:**
• **Scam Checker:** Analyze suspicious emails, URLs, and messages
• **Password Generator:** Create strong, secure passwords instantly
• **Voice Detector:** Check audio for AI-generated deepfakes
• **Data Broker Removal:** Remove your info from 500+ data brokers

Explore all our tools at /tools

**Need Help Right Now?**${hasSpecificResources ? `
• **Report fraud:** ${r.fraudReport} at ${r.fraudReportUrl}
• **Report cyber crimes:** ${r.cyberCrime} at ${r.cyberCrimeUrl}
• **Identity theft help:** ${r.identityTheft} at ${r.identityTheftUrl}` : `
• Report fraud to your local police cybercrime unit
• Report cyber crimes to your national CERT (Computer Emergency Response Team)
• For identity theft, contact your data protection authority`}
• **Financial concerns:** Contact your bank immediately

${emergencyHelpNote}

What would you like to learn about today?`;
}

// Check if user has been welcomed this session
const WELCOME_KEY = "dezi_welcomed_session";

export function DeziAssistant() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [region, setRegion] = useState<RegionInfo | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  // Detect user region on mount
  useEffect(() => {
    const detectRegion = async () => {
      try {
        // Use free IP geolocation API (no API key required)
        const response = await fetch("https://ip-api.com/json/?fields=status,country,countryCode", {
          signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            setRegion({
              country: data.country,
              countryCode: data.countryCode,
              detected: true,
            });
          }
        }
      } catch (error) {
        // Silently fail, will use default resources
        console.log("Region detection unavailable, using default resources");
      }
    };

    detectRegion();
  }, []);

  // Create notification sound (soft chime)
  useEffect(() => {
    // Create audio context for notification sound
    const createNotificationSound = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (e) {
        // Audio not supported or blocked
      }
    };
    
    // Store the function for later use
    (window as any).deziNotificationSound = createNotificationSound;
  }, []);

  // Track user interaction for sound permission
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Auto-welcome after delay (only once per session)
  useEffect(() => {
    const hasBeenWelcomed = sessionStorage.getItem(WELCOME_KEY);
    
    if (!hasBeenWelcomed) {
      const timer = setTimeout(() => {
        setShowWelcomeBubble(true);
        sessionStorage.setItem(WELCOME_KEY, "true");
        
        // Play sound if user has interacted
        if (hasInteracted && (window as any).deziNotificationSound) {
          (window as any).deziNotificationSound();
        }
      }, 3000); // 3 second delay
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

  // Hide welcome bubble when panel opens
  useEffect(() => {
    if (isOpen) {
      setShowWelcomeBubble(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const dismissWelcome = () => {
    setShowWelcomeBubble(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;


    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Initial thinking delay
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

    const response = getResponse(text, region);
    const messageId = (Date.now() + 1).toString();
    
    // Add message with streaming flag
    const assistantMessage: Message = {
      id: messageId,
      role: "assistant",
      content: response,
      displayedContent: "",
      isStreaming: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);

    // Stream the response word by word
    const words = response.split(" ");
    let currentContent = "";
    
    for (let i = 0; i < words.length; i++) {
      currentContent += (i === 0 ? "" : " ") + words[i];
      const contentSnapshot = currentContent;
      
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === messageId 
            ? { ...msg, displayedContent: contentSnapshot }
            : msg
        )
      );
      
      // Variable delay for natural pacing
      const delay = words[i].includes("\n") ? 80 : (15 + Math.random() * 25);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    // Mark streaming complete
    setMessages((prev) => 
      prev.map((msg) => 
        msg.id === messageId 
          ? { ...msg, isStreaming: false, displayedContent: response }
          : msg
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handlePromptClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClose();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[70vh]"
            onKeyDown={handleKeyDown}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dezi-title"
            aria-describedby="dezi-description"
            id="dezi-dialog"
            data-testid="dezi-panel"
          >
            <Card className="shadow-2xl border-primary/20 overflow-hidden flex flex-col max-h-[70vh]">
              <CardHeader className="pb-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex-shrink-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                      <img 
                        src={deziAvatar} 
                        alt="Dezi" 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        data-testid="img-dezi-avatar"
                      />
                    </div>
                    <div>
                      <h3 id="dezi-title" className="font-semibold text-white text-sm" data-testid="text-dezi-name">Dezi</h3>
                      <p id="dezi-description" className="text-white/70 text-xs" data-testid="text-dezi-role">Your Online Safety Assistant</p>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-white/70"
                    onClick={handleClose}
                    aria-label="Close Dezi assistant"
                    data-testid="button-close-dezi"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[40vh]">
                  {messages.length === 0 ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <p className="text-muted-foreground text-sm mb-4">
                          I am here to help you understand online risks and stay safe.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          Common Questions
                        </p>
                        {suggestedPrompts.map((prompt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePromptClick(prompt.text)}
                            className="w-full flex items-center gap-3 p-3 text-left text-sm rounded-lg border bg-card hover-elevate transition-colors"
                            data-testid={`button-prompt-${idx}`}
                          >
                            <prompt.icon className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="flex-1">{prompt.text}</span>
                          </button>
                        ))}
                      </div>
                      
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          data-testid={`message-${message.role}-${message.id}`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full overflow-hidden">
                                  <img src={deziAvatar} alt="Dezi AI assistant" className="w-full h-full object-cover" loading="lazy" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground">Dezi</span>
                                {message.isStreaming && (
                                  <span className="w-1.5 h-4 bg-primary/60 animate-pulse ml-1" />
                                )}
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                              {(message.role === "assistant" && message.displayedContent !== undefined
                                ? message.displayedContent
                                : message.content
                              ).split("\n").map((line, idx) => {
                                if (line.startsWith("**") && line.endsWith("**")) {
                                  return <p key={idx} className="font-semibold mt-3 mb-1">{line.replace(/\*\*/g, "")}</p>;
                                }
                                if (line.startsWith("• ")) {
                                  return <p key={idx} className="ml-2">{line}</p>;
                                }
                                return <p key={idx}>{line}</p>;
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex justify-start" data-testid="indicator-dezi-typing">
                          <div className="bg-muted rounded-lg p-3 flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0">
                              <img src={deziAvatar} alt="Dezi AI assistant" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span 
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                                style={{ animationDelay: "0ms", animationDuration: "600ms" }} 
                              />
                              <span 
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                                style={{ animationDelay: "150ms", animationDuration: "600ms" }} 
                              />
                              <span 
                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" 
                                style={{ animationDelay: "300ms", animationDuration: "600ms" }} 
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                <div className="border-t p-3 bg-background flex-shrink-0">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Ask about online safety..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1"
                      disabled={isTyping}
                      data-testid="input-dezi-message"
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={!inputValue.trim() || isTyping}
                      data-testid="button-send-message"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                  
                  <div className="flex items-center justify-between gap-2 mt-2">
                    <p className="text-xs text-muted-foreground" data-testid="text-dezi-disclosure">
                      General guidance only, not professional advice.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Welcome bubble - mobile friendly */}
      <AnimatePresence>
        {showWelcomeBubble && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-16 right-4 sm:right-6 z-50 max-w-[280px] sm:max-w-[320px]"
            data-testid="dezi-welcome-bubble"
          >
            <div className="bg-card border shadow-lg rounded-xl p-4 relative">
              {/* Close button */}
              <button
                onClick={dismissWelcome}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                aria-label="Dismiss welcome message"
                data-testid="button-dismiss-welcome"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0">
                  <img 
                    src={deziAvatar} 
                    alt="Dezi" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 pr-4">
                  <p className="font-medium text-sm text-foreground mb-1">Hi! I'm Dezi</p>
                  <p className="text-sm text-muted-foreground">
                    Your AI security assistant. Ask me anything about staying safe online.
                  </p>
                </div>
              </div>
              
              <Button
                onClick={() => setIsOpen(true)}
                size="sm"
                className="w-full mt-3"
                data-testid="button-welcome-chat"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start a conversation
              </Button>
              
              {/* Speech bubble pointer */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-b border-r rotate-45 transform" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 sm:right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`rounded-full shadow-lg ${isOpen ? 'bg-muted text-muted-foreground' : ''} gap-2`}
          data-testid="button-open-dezi"
          aria-label={isOpen ? "Close Dezi" : "Open Dezi safety assistant"}
          aria-expanded={isOpen}
          aria-controls="dezi-dialog"
        >
          {isOpen ? (
            <>
              <ChevronDown className="w-5 h-5" />
              <span className="hidden sm:inline">Close</span>
            </>
          ) : (
            <>
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/30">
                <img src={deziAvatar} alt="Dezi AI assistant" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline">Ask Dezi</span>
              <MessageCircle className="w-5 h-5 sm:hidden" />
            </>
          )}
        </Button>
      </motion.div>
    </>
  );
}
