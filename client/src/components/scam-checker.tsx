import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, AlertTriangle, CheckCircle2, XCircle, Info, ExternalLink } from "lucide-react";

type CheckResult = {
  status: "safe" | "suspicious" | "dangerous" | null;
  title: string;
  message: string;
  tips: string[];
  sources: string[];
};

const suspiciousPatterns = [
  { pattern: /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i, reason: "shortened URL that hides the real destination" },
  { pattern: /urgent|immediately|act now|limited time/i, reason: "pressure tactics commonly used in scams" },
  { pattern: /won|winner|lottery|prize|reward|claim/i, reason: "prize or lottery scam indicators" },
  { pattern: /verify.*(account|identity)|confirm.*payment/i, reason: "phishing attempt to steal credentials" },
  { pattern: /password|ssn|social security|bank account/i, reason: "request for sensitive personal information" },
  { pattern: /wire transfer|gift card|bitcoin|crypto/i, reason: "unusual payment method requests" },
  { pattern: /irs|tax.*refund|government.*grant/i, reason: "government impersonation scam" },
  { pattern: /microsoft|apple|amazon.*support.*call/i, reason: "tech support scam indicators" },
  { pattern: /nigerian|prince|inheritance|million dollars/i, reason: "classic advance-fee fraud patterns" },
  { pattern: /click here.*verify|update.*billing/i, reason: "common phishing link text" },
  { pattern: /suspended|locked.*account|unauthorized/i, reason: "fear-based manipulation tactics" },
  { pattern: /romance|love|dating.*money|send.*funds/i, reason: "romance scam warning signs" },
];

const safeIndicators = [
  { pattern: /https:\/\/(www\.)?(google|microsoft|apple|amazon|facebook|twitter|instagram|linkedin|youtube)\.com/i, reason: "legitimate major website" },
  { pattern: /\.gov\//i, reason: "government website" },
  { pattern: /\.edu\//i, reason: "educational institution" },
];

function analyzeContent(content: string): CheckResult {
  if (!content.trim()) {
    return { status: null, title: "", message: "", tips: [], sources: [] };
  }

  const foundSuspicious: string[] = [];
  const foundSafe: string[] = [];

  for (const indicator of safeIndicators) {
    if (indicator.pattern.test(content)) {
      foundSafe.push(indicator.reason);
    }
  }

  for (const indicator of suspiciousPatterns) {
    if (indicator.pattern.test(content)) {
      foundSuspicious.push(indicator.reason);
    }
  }

  if (foundSuspicious.length >= 3) {
    return {
      status: "dangerous",
      title: "High Risk - Likely a Scam",
      message: "This content contains multiple red flags commonly associated with scams. We strongly recommend not engaging with this message or clicking any links.",
      tips: [
        "Do not click any links or download attachments",
        "Do not reply or provide any personal information",
        "Block the sender and report as spam",
        "If claiming to be from a company, contact them directly through their official website"
      ],
      sources: foundSuspicious
    };
  }

  if (foundSuspicious.length >= 1) {
    return {
      status: "suspicious",
      title: "Caution - Suspicious Content Detected",
      message: "This content contains some warning signs that could indicate a scam. Proceed with caution and verify the source before taking any action.",
      tips: [
        "Verify the sender's identity through official channels",
        "Don't click links - type the website address directly in your browser",
        "When in doubt, ask a trusted friend or family member",
        "Legitimate companies never ask for passwords via email or text"
      ],
      sources: foundSuspicious
    };
  }

  if (foundSafe.length > 0) {
    return {
      status: "safe",
      title: "Appears Safe",
      message: "We didn't detect obvious scam indicators in this content. However, always stay vigilant and verify unexpected requests.",
      tips: [
        "Even legitimate-looking messages can be spoofed",
        "Check the actual URL before clicking (hover over links)",
        "Be cautious of unexpected requests even from known contacts"
      ],
      sources: foundSafe
    };
  }

  return {
    status: "safe",
    title: "No Obvious Red Flags",
    message: "We didn't detect common scam patterns in this content. This doesn't guarantee it's safe, so always use good judgment.",
    tips: [
      "Trust your instincts - if something feels off, it might be",
      "Verify unexpected messages through another communication channel",
      "Never share passwords or financial information via message"
    ],
    sources: []
  };
}

export function ScamChecker() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = () => {
    setIsChecking(true);
    setTimeout(() => {
      setResult(analyzeContent(content));
      setIsChecking(false);
    }, 800);
  };

  const getStatusIcon = () => {
    switch (result?.status) {
      case "safe":
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case "suspicious":
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case "dangerous":
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (result?.status) {
      case "safe":
        return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900";
      case "suspicious":
        return "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900";
      case "dangerous":
        return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900";
      default:
        return "";
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
            <CardTitle className="text-xl">Scam Checker</CardTitle>
            <p className="text-sm text-muted-foreground">Paste any suspicious message, email, or link</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Textarea
            placeholder="Paste the suspicious message, email content, or URL here...

Example: 'Congratulations! You've won $1,000,000! Click here to claim your prize now!'"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
            data-testid="input-scam-content"
          />
          <Button 
            className="w-full" 
            onClick={handleCheck}
            disabled={!content.trim() || isChecking}
            data-testid="button-check-scam"
          >
            {isChecking ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Check for Scam
              </>
            )}
          </Button>
        </div>

        {result && result.status && (
          <div className={`p-6 rounded-lg border ${getStatusColor()}`} data-testid="result-scam-check">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {getStatusIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg mb-2">{result.title}</h3>
                <p className="text-muted-foreground mb-4">{result.message}</p>

                {result.sources.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Detected indicators:</p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((source, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {source}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">What to do:</p>
                  <ul className="space-y-1">
                    {result.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              This tool uses pattern matching to detect common scam indicators. It's not 100% accurate.
              When in doubt, don't click links and verify through official channels.
            </p>
            <a 
              href="https://www.ic3.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary flex items-center gap-1 hover:underline"
            >
              Report scams to FBI IC3 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
