import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MessageSquare,
  Mail,
  Server,
  LinkIcon,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Shield,
  Zap,
  Loader2,
  Info,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  Eye,
  FileText,
} from "lucide-react";
import { trackToolUsage } from "@/lib/analytics";

type ContentType = "message" | "email" | "headers" | "url";

interface AnalysisResult {
  contentTypeDetected: string;
  scamRiskLevel: "Low" | "Moderate" | "High" | "Critical";
  keyRedFlags: string[];
  technicalObservations: string[];
  recommendedActions: string[];
  confidenceLevel: string;
  summary: string;
}

const tabConfig: { value: ContentType; label: string; icon: typeof MessageSquare; placeholder: string; example: string }[] = [
  {
    value: "message",
    label: "Message",
    icon: MessageSquare,
    placeholder: "Paste the suspicious text message here...",
    example: "Example: 'URGENT: Your bank account has been compromised! Click here immediately to secure your account: bit.ly/secure-now'"
  },
  {
    value: "email",
    label: "Email",
    icon: Mail,
    placeholder: "Paste the suspicious email content here...",
    example: "Example: 'Dear valued customer, We noticed unusual activity on your PayPal account. Please verify your identity by clicking the link below...'"
  },
  {
    value: "headers",
    label: "Headers",
    icon: Server,
    placeholder: "Paste email headers here (From, Reply-To, Received, SPF, DKIM, etc.)...",
    example: "Example: 'From: support@paypa1.com\\nReply-To: scammer@gmail.com\\nReceived: from mail.suspicious-domain.xyz'"
  },
  {
    value: "url",
    label: "URL",
    icon: LinkIcon,
    placeholder: "Paste the suspicious URL or domain here...",
    example: "Example: 'https://amaz0n-security.com/verify-account?id=12345'"
  }
];

function getRiskColor(level: string) {
  switch (level) {
    case "Low": return "text-green-600 dark:text-green-400";
    case "Moderate": return "text-amber-600 dark:text-amber-400";
    case "High": return "text-orange-600 dark:text-orange-400";
    case "Critical": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

function getRiskBg(level: string) {
  switch (level) {
    case "Low": return "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800";
    case "Moderate": return "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800";
    case "High": return "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800";
    case "Critical": return "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800";
    default: return "bg-muted";
  }
}

function getRiskIcon(level: string) {
  switch (level) {
    case "Low": return <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />;
    case "Moderate": return <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    case "High": return <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />;
    case "Critical": return <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
    default: return <Shield className="w-6 h-6 text-muted-foreground" />;
  }
}

export function AIScamAnalyzer() {
  const [contentType, setContentType] = useState<ContentType>("message");
  const [tabInputs, setTabInputs] = useState<Record<ContentType, string>>({
    message: "",
    email: "",
    headers: "",
    url: "",
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputContent = tabInputs[contentType];

  const setInputContent = (value: string) => {
    setTabInputs(prev => ({ ...prev, [contentType]: value }));
  };

  const handleAnalyze = async () => {
    if (!inputContent.trim() || inputContent.trim().length < 5) return;

    setIsAnalyzing(true);
    setResult(null);
    setError(null);

    try {
      trackToolUsage("ai-scam-analyzer");

      const response = await fetch("/api/security/ai-scam-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputContent, contentType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed. Please try again.");
      }

      const data = await response.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        throw new Error(data.error || "Analysis returned no results.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setTabInputs(prev => ({ ...prev, [contentType]: "" }));
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl" data-testid="text-ai-analyzer-title">Advanced Scam Analyzer</CardTitle>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis of suspicious messages, emails, and links
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={contentType} onValueChange={(v) => setContentType(v as ContentType)}>
            <TabsList className="grid grid-cols-4 w-full">
              {tabConfig.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="gap-1.5"
                  data-testid={`tab-analyzer-${tab.value}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {tabConfig.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder={`${tab.placeholder}\n\n${tab.example}`}
                    value={inputContent}
                    onChange={(e) => setInputContent(e.target.value)}
                    className="min-h-[160px] resize-none text-sm"
                    data-testid={`input-analyzer-${tab.value}`}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="flex gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || inputContent.trim().length < 5}
              className="flex-1 gap-2"
              data-testid="button-analyze-threats"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze for Threats
                </>
              )}
            </Button>
            {(inputContent || result) && (
              <Button
                variant="outline"
                onClick={handleClear}
                data-testid="button-clear-analyzer"
              >
                Clear
              </Button>
            )}
          </div>

          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>
              This tool uses advanced AI pattern matching to detect scam indicators. While highly accurate, no automated tool is 100% reliable. When in doubt, don't engage and verify through official channels.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a href="https://reportfraud.ftc.gov/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Report to FTC <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://www.ic3.gov/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              Report to FBI IC3 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Analyzing content for threats...</p>
                <p className="text-xs text-muted-foreground">This typically takes a few seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-destructive" data-testid="text-analyzer-error">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-4" data-testid="analyzer-results">
          <Card className={`border ${getRiskBg(result.scamRiskLevel)}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  {getRiskIcon(result.scamRiskLevel)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className={`text-lg font-bold ${getRiskColor(result.scamRiskLevel)}`} data-testid="text-risk-level">
                      {result.scamRiskLevel} Risk
                    </h3>
                    <Badge variant="outline" className="text-xs" data-testid="text-content-type">
                      {result.contentTypeDetected}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground" data-testid="text-analysis-summary">{result.summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.keyRedFlags.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Key Red Flags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.keyRedFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" data-testid={`text-red-flag-${i}`}>
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{flag}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {result.technicalObservations.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  Technical Observations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.technicalObservations.map((obs, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm" data-testid={`text-tech-obs-${i}`}>
                      <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{obs}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Recommended Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.recommendedActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm" data-testid={`text-action-${i}`}>
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                Confidence Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" data-testid="text-confidence">{result.confidenceLevel}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}