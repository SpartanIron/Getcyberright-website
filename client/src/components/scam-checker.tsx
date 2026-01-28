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

type AnalysisResult = {
  overallRisk: "safe" | "low" | "medium" | "high" | "critical";
  confidenceScore: number;
  title: string;
  summary: string;
  threats: DetectedThreat[];
  urls: URLAnalysis[];
  recommendations: string[];
  educationalTips: string[];
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
  { pattern: /\.(tk|ml|ga|cf|gq|xyz|top|club|online|site|website)$/i, reason: "Free or suspicious TLD" },
  { pattern: /-login|-verify|-secure|-account|-update|-confirm/i, reason: "Suspicious subdomain/path pattern" },
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i, reason: "URL shortener hiding destination" },
];

const legitDomains = [
  /^(https?:\/\/)?(www\.)?(google|microsoft|apple|amazon|facebook|twitter|linkedin|instagram|youtube|netflix|paypal|github|dropbox|zoom|slack)\.com/i,
  /^(https?:\/\/)?(www\.)?[a-z0-9-]+\.(gov|edu|mil)/i,
];

function extractUrls(content: string): string[] {
  const urlPattern = /https?:\/\/[^\s<>"{}|\\^`\[\]]+|www\.[^\s<>"{}|\\^`\[\]]+/gi;
  return content.match(urlPattern) || [];
}

function analyzeUrl(url: string): URLAnalysis {
  const reasons: string[] = [];
  let isSuspicious = true;
  
  for (const legit of legitDomains) {
    if (legit.test(url)) {
      isSuspicious = false;
      break;
    }
  }
  
  for (const { pattern, reason } of suspiciousUrlPatterns) {
    if (pattern.test(url)) {
      reasons.push(reason);
      isSuspicious = true;
    }
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
  
  // Calculate risk score
  let totalScore = threats.reduce((sum, t) => sum + severityScores[t.severity], 0);
  totalScore += suspiciousUrls.length * 2;
  
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

  return {
    overallRisk,
    confidenceScore,
    title,
    summary,
    threats,
    urls: urlAnalyses,
    recommendations,
    educationalTips
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
