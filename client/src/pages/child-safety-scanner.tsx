"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  Phone,
  ExternalLink,
  FileText,
  BookOpen,
  Loader2,
  ArrowLeft,
  Info,
  Users,
  MessageSquareWarning,
  ShieldAlert,
  Heart,
  Lightbulb,
  Globe
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { trackToolUsage } from "@/lib/analytics";

interface DetectedFlag {
  category: string;
  matchedText: string;
  explanation: string;
  severity: "low" | "medium" | "high" | "critical";
}

interface EmergencyResource {
  name: string;
  description: string;
  url?: string;
  phone?: string;
  type: "report" | "help" | "education";
}

interface ScanResult {
  success: boolean;
  riskLevel: "safe" | "caution" | "warning" | "danger";
  riskScore: number;
  flags: DetectedFlag[];
  summary: string;
  recommendations: string[];
  resources: EmergencyResource[];
}

interface FreeTool {
  name: string;
  description: string;
  url: string;
  type: string;
  access: string;
}

const RISK_CONFIG = {
  safe: {
    color: "bg-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-700 dark:text-green-300",
    icon: CheckCircle2,
    label: "Safe"
  },
  caution: {
    color: "bg-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-700 dark:text-yellow-300",
    icon: AlertCircle,
    label: "Caution"
  },
  warning: {
    color: "bg-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    textColor: "text-orange-700 dark:text-orange-300",
    icon: AlertTriangle,
    label: "Warning"
  },
  danger: {
    color: "bg-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-700 dark:text-red-300",
    icon: XCircle,
    label: "Danger"
  }
};

const SEVERITY_COLORS = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

export default function ChildSafetyScannerPage() {
  const [, setLocation] = useLocation();
  const [conversationText, setConversationText] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  const { data: freeTools } = useQuery<{ success: boolean; tools: FreeTool[] }>({
    queryKey: ["/api/child-safety/tools"]
  });

  const scanMutation = useMutation({
    mutationFn: async (text: string) => {
      trackToolUsage("child-safety-scanner", false);
      const response = await apiRequest("POST", "/api/child-safety/scan", { text, region: "US" });
      return response.json();
    },
    onSuccess: (data: ScanResult) => {
      setScanResult(data);
      trackToolUsage("child-safety-scanner", true);
    }
  });

  const handleScan = () => {
    if (conversationText.trim().length >= 10) {
      scanMutation.mutate(conversationText);
    }
  };

  const handleClear = () => {
    setConversationText("");
    setScanResult(null);
  };

  const riskConfig = scanResult ? RISK_CONFIG[scanResult.riskLevel] : null;
  const RiskIcon = riskConfig?.icon || Shield;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-background dark:from-purple-950/20 dark:to-background">
      <SEOHead title="Child Safety Conversation Scanner" description="Scan conversations for grooming patterns and online safety risks. Protect children from predatory behavior." />
      <main id="main-content" tabIndex={-1}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation("/parents")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Parents Hub
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
            <ShieldAlert className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-page-title">
            Child Safety Conversation Scanner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-page-description">
            Analyze online conversations for potential grooming patterns and warning signs. 
            Powered by research-based detection of predatory behavior tactics.
          </p>
        </div>

        <Tabs defaultValue="scanner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="scanner" data-testid="tab-scanner">
              <MessageSquareWarning className="w-4 h-4 mr-2" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">
              <Phone className="w-4 h-4 mr-2" />
              Report
            </TabsTrigger>
            <TabsTrigger value="tools" data-testid="tab-tools">
              <Lightbulb className="w-4 h-4 mr-2" />
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scanner" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" data-testid="heading-paste-conversation">
                    <FileText className="w-5 h-5 text-primary" />
                    Paste Conversation
                  </CardTitle>
                  <CardDescription data-testid="text-paste-description">
                    Copy and paste the chat messages you want to analyze. All data is processed securely and not stored.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Paste the conversation here...&#10;&#10;Example:&#10;Stranger: Hey, you seem really cool and mature for your age&#10;Child: Thanks!&#10;Stranger: You're different from other kids. Don't tell your parents about our chats..."
                    value={conversationText}
                    onChange={(e) => setConversationText(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    data-testid="input-conversation"
                  />
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleScan}
                      disabled={conversationText.trim().length < 10 || scanMutation.isPending}
                      className="flex-1"
                      data-testid="button-scan"
                    >
                      {scanMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Analyze Conversation
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleClear}
                      data-testid="button-clear"
                    >
                      Clear
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid="text-privacy-notice">
                    Privacy: Conversations are analyzed in real-time and never stored on our servers.
                  </p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {!scanResult && !scanMutation.isPending && (
                  <Card className="border-dashed" data-testid="card-empty-state">
                    <CardContent className="py-12 text-center">
                      <Shield className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground" data-testid="text-empty-state">
                        Paste a conversation and click "Analyze" to check for warning signs
                      </p>
                    </CardContent>
                  </Card>
                )}

                {scanMutation.isPending && (
                  <Card data-testid="card-loading-state">
                    <CardContent className="py-12 text-center">
                      <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin mb-4" />
                      <p className="text-muted-foreground" data-testid="text-loading-state">Analyzing conversation patterns...</p>
                    </CardContent>
                  </Card>
                )}

                {scanResult && riskConfig && (
                  <>
                    <Alert className={`${riskConfig.bgColor} ${riskConfig.borderColor} border-2`} data-testid="alert-risk-level">
                      <RiskIcon className={`w-5 h-5 ${riskConfig.textColor}`} />
                      <AlertTitle className={`text-lg font-bold ${riskConfig.textColor}`} data-testid="text-risk-label">
                        Risk Level: {riskConfig.label}
                      </AlertTitle>
                      <AlertDescription className={riskConfig.textColor} data-testid="text-risk-summary">
                        {scanResult.summary}
                      </AlertDescription>
                    </Alert>

                    <Card data-testid="card-risk-score">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between" data-testid="heading-risk-score">
                          Risk Score
                          <Badge variant={scanResult.riskLevel === "safe" ? "secondary" : "destructive"} data-testid="badge-risk-score">
                            {scanResult.riskScore}/100
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full bg-muted rounded-full h-4 overflow-hidden" data-testid="progress-risk-score">
                          <div 
                            className={`h-full ${riskConfig.color} transition-all duration-500`}
                            style={{ width: `${scanResult.riskScore}%` }}
                            data-testid="progress-risk-score-bar"
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {scanResult.flags.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2" data-testid="heading-detected-flags">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            Detected Warning Signs ({scanResult.flags.length})
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {scanResult.flags.map((flag, index) => (
                            <div 
                              key={index}
                              className="p-3 rounded-lg bg-muted/50 border border-border"
                              data-testid={`card-flag-${index}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={SEVERITY_COLORS[flag.severity]} data-testid={`badge-severity-${index}`}>
                                  {flag.severity.toUpperCase()}
                                </Badge>
                                <span className="font-medium text-sm" data-testid={`text-category-${index}`}>{flag.category}</span>
                              </div>
                              <p className="text-sm text-muted-foreground italic mb-2" data-testid={`text-matched-${index}`}>
                                "{flag.matchedText}"
                              </p>
                              <p className="text-sm" data-testid={`text-explanation-${index}`}>
                                {flag.explanation}
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2" data-testid="heading-recommendations">
                          <Heart className="w-5 h-5 text-pink-500" />
                          Recommendations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2" data-testid="list-recommendations">
                          {scanResult.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm" data-testid={`item-recommendation-${index}`}>
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    {scanResult.riskLevel !== "safe" && (
                      <Card className="border-primary">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center gap-2" data-testid="heading-emergency-results">
                            <Phone className="w-5 h-5 text-primary" />
                            Emergency Resources
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {scanResult.resources.filter(r => r.type === "report").slice(0, 3).map((resource, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20"
                              data-testid={`card-emergency-resource-${index}`}
                            >
                              <div>
                                <p className="font-medium text-sm" data-testid={`text-resource-name-${index}`}>{resource.name}</p>
                                <p className="text-xs text-muted-foreground" data-testid={`text-resource-desc-${index}`}>{resource.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {resource.phone && (
                                  <Button size="sm" variant="outline" asChild data-testid={`button-call-emergency-${index}`}>
                                    <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}>
                                      <Phone className="w-3 h-3 mr-1" />
                                      Call
                                    </a>
                                  </Button>
                                )}
                                {resource.url && (
                                  <Button size="sm" asChild data-testid={`button-report-emergency-${index}`}>
                                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      Report
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </div>
            </div>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100" data-testid="heading-how-it-works">How This Works</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300" data-testid="text-how-it-works">
                      This scanner uses research-based pattern matching to detect common grooming tactics, 
                      including trust-building, isolation attempts, boundary testing, and manipulation. 
                      It analyzes language patterns that predators commonly use, but is not a replacement 
                      for professional assessment or law enforcement investigation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="heading-emergency-reporting">
                  <Phone className="w-5 h-5 text-red-500" />
                  Emergency Reporting Resources
                </CardTitle>
                <CardDescription data-testid="text-emergency-description">
                  If you suspect a child is in danger, contact these organizations immediately
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" data-testid="heading-region-us">
                    <Globe className="w-5 h-5 text-blue-500" /> United States
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ReportingCard
                      name="NCMEC CyberTipline"
                      description="Report child sexual exploitation online"
                      phone="1-800-843-5678"
                      url="https://www.cybertipline.org"
                      primary
                    />
                    <ReportingCard
                      name="FBI IC3"
                      description="Internet Crime Complaint Center"
                      url="https://www.ic3.gov"
                    />
                    <ReportingCard
                      name="National Child Abuse Hotline"
                      description="24/7 crisis support"
                      phone="1-800-422-4453"
                    />
                    <ReportingCard
                      name="Crisis Text Line"
                      description="Text HOME to 741741 for support"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" data-testid="heading-region-uk">
                    <Globe className="w-5 h-5 text-red-500" /> United Kingdom
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ReportingCard
                      name="CEOP"
                      description="Child Exploitation and Online Protection"
                      url="https://www.ceop.police.uk/ceop-reporting"
                      primary
                    />
                    <ReportingCard
                      name="Childline"
                      description="Free helpline for children"
                      phone="0800 1111"
                    />
                    <ReportingCard
                      name="NSPCC"
                      description="Child protection charity"
                      phone="0808 800 5000"
                      url="https://www.nspcc.org.uk"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" data-testid="heading-region-ca">
                    <Globe className="w-5 h-5 text-red-600" /> Canada
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ReportingCard
                      name="Cybertip.ca"
                      description="Report online child exploitation"
                      phone="1-866-658-9022"
                      url="https://www.cybertip.ca"
                      primary
                    />
                    <ReportingCard
                      name="Kids Help Phone"
                      description="24/7 support for young people"
                      phone="1-800-668-6868"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" data-testid="heading-region-au">
                    <Globe className="w-5 h-5 text-yellow-600" /> Australia
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ReportingCard
                      name="eSafety Commissioner"
                      description="Online safety reporting"
                      url="https://www.esafety.gov.au"
                      primary
                    />
                    <ReportingCard
                      name="Kids Helpline"
                      description="24/7 support"
                      phone="1800 55 1800"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2" data-testid="heading-region-intl">
                    <Globe className="w-5 h-5 text-green-500" /> International
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <ReportingCard
                      name="INHOPE"
                      description="International hotline network"
                      url="https://www.inhope.org"
                    />
                    <ReportingCard
                      name="Internet Watch Foundation"
                      description="Global CSAM removal"
                      url="https://www.iwf.org.uk"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100" data-testid="heading-before-report">Before You Report</p>
                    <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 space-y-1" data-testid="list-before-report">
                      <li data-testid="item-report-tip-0">• Preserve all evidence - take screenshots before blocking</li>
                      <li data-testid="item-report-tip-1">• Note the platform, username, and timestamps</li>
                      <li data-testid="item-report-tip-2">• Do not alert the suspected predator</li>
                      <li data-testid="item-report-tip-3">• Talk to your child in a calm, supportive manner</li>
                      <li data-testid="item-report-tip-4">• Reassure your child they are not in trouble</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="heading-tools">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Free &amp; Open Source Safety Tools
                </CardTitle>
                <CardDescription data-testid="text-tools-description">
                  Professional-grade tools available for organizations to protect children online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {freeTools?.tools?.map((tool, index) => (
                    <div 
                      key={index}
                      className="p-4 rounded-lg border border-border bg-card hover-elevate"
                      data-testid={`card-tool-${index}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold" data-testid={`text-tool-name-${index}`}>{tool.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1" data-testid={`text-tool-desc-${index}`}>{tool.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" data-testid={`badge-tool-type-${index}`}>{tool.type}</Badge>
                            <span className="text-xs text-muted-foreground" data-testid={`text-tool-access-${index}`}>{tool.access}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild data-testid={`link-tool-${index}`}>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Learn More
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" data-testid="heading-educational-resources">
                  <Users className="w-5 h-5 text-primary" />
                  Educational Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a 
                  href="https://www.netsmartz.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-border hover-elevate"
                  data-testid="link-netsmartz"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold" data-testid="text-edu-title-netsmartz">NetSmartz</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-edu-desc-netsmartz">NCMEC's online safety education for children and parents</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
                <a 
                  href="https://internetsafety101.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-border hover-elevate"
                  data-testid="link-internetsafety101"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold" data-testid="text-edu-title-internetsafety101">Internet Safety 101</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-edu-desc-internetsafety101">Free comprehensive curriculum for families</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
                <a 
                  href="https://www.thinkuknow.co.uk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg border border-border hover-elevate"
                  data-testid="link-thinkuknow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold" data-testid="text-edu-title-thinkuknow">ThinkUKnow</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-edu-desc-thinkuknow">Age-appropriate online safety education from UK CEOP</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </a>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
    </div>
  );
}

function ReportingCard({ 
  name, 
  description, 
  phone, 
  url, 
  primary = false 
}: { 
  name: string; 
  description: string; 
  phone?: string; 
  url?: string;
  primary?: boolean;
}) {
  const testIdBase = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return (
    <div 
      className={`p-4 rounded-lg border ${primary ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20' : 'border-border bg-card'}`}
      data-testid={`card-resource-${testIdBase}`}
    >
      <h4 className="font-semibold text-sm" data-testid={`text-resource-name-${testIdBase}`}>{name}</h4>
      <p className="text-xs text-muted-foreground mt-1" data-testid={`text-resource-desc-${testIdBase}`}>{description}</p>
      <div className="flex items-center gap-2 mt-3">
        {phone && (
          <Button size="sm" variant={primary ? "default" : "outline"} asChild data-testid={`button-call-${testIdBase}`}>
            <a href={`tel:${phone.replace(/[^0-9]/g, '')}`}>
              <Phone className="w-3 h-3 mr-1" />
              {phone}
            </a>
          </Button>
        )}
        {url && (
          <Button size="sm" variant="outline" asChild data-testid={`link-visit-${testIdBase}`}>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              Visit
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
