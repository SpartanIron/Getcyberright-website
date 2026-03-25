import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ShieldX,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Mail,
  Loader2,
  Info,
  Clock,
  Crown,
  RefreshCw,
  Bell,
} from "lucide-react";

type BrokerResult = {
  broker: string;
  status: string;
  url?: string;
  found: boolean | null;
  dataFound: string[] | null;
};

type BreachResult = {
  source: string;
  breachName: string;
  breachDate: string | null;
  dataClasses: string[];
};

type ExposureReport = {
  scanId: string;
  completedAt: string;
  brokerResults?: BrokerResult[];
  breachResults?: BreachResult[];
  exposureScore: "low" | "medium" | "high" | "critical";
  scoreBreakdown: {
    breachPoints: number;
    brokerPoints: number;
    sensitivityMultiplier: number;
    rawTotal: number;
  };
  partialResults: boolean;
  brokerCount?: number;
  breachCount?: number;
  brokerFoundCount?: number;
};

type AccessLevel = "free" | "full";

const SCORE_CONFIG = {
  low: {
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-800",
    icon: CheckCircle2,
    label: "Low Exposure",
  },
  medium: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-950/40",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: AlertCircle,
    label: "Moderate Exposure",
  },
  high: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
    icon: ShieldAlert,
    label: "High Exposure",
  },
  critical: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    icon: ShieldX,
    label: "Critical Exposure",
  },
};

function ShieldResultsPage() {
  const params = useParams<{ scanId: string }>();
  const scanId = params.scanId;
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const [report, setReport] = useState<ExposureReport | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [alertEmail, setAlertEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("free");

  useEffect(() => {
    if (!scanId) return;

    let attempts = 0;
    const maxAttempts = 40;

    async function poll() {
      try {
        const res = await fetch(`/api/scan/${scanId}/status`, { credentials: "include" });
        const data = await res.json();

        if (data.accessLevel) setAccessLevel(data.accessLevel);

        if (data.status === "complete" && data.report) {
          setReport(data.report);
          setSummary(data.summary || "");
          setLoading(false);
          return;
        }

        if (data.status === "failed") {
          setError(data.error || "Scan could not be completed.");
          setLoading(false);
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 3000);
        } else {
          setError("Scan is taking longer than expected. Please try again later.");
          setLoading(false);
        }
      } catch {
        setError("Could not connect to the server. Please check your internet connection.");
        setLoading(false);
      }
    }

    poll();
  }, [scanId]);

  const leadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/scan/${scanId}/lead`, {
        alertEmail: alertEmail.trim(),
      });
      return res.json();
    },
    onSuccess: () => {
      setLeadSubmitted(true);
      toast({ title: "You're signed up!", description: "We will re-scan every 30 days and alert you if your data reappears." });
    },
    onError: (err: Error) => {
      toast({ title: "Could not save", description: err.message, variant: "destructive" });
    },
  });

  function toggleExpand(idx: number) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const hasPaidAccess = accessLevel === "full";

  if (loading) {
    return (
      <>
        <SEOHead title="Loading Results... | GCR Data Shield" />
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-lg font-medium" data-testid="text-loading">Scanning your digital footprint...</p>
            <p className="text-muted-foreground">Checking 500+ data broker sites and breach databases. This may take up to a minute.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEOHead title="Scan Error | GCR Data Shield" />
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="py-8 text-center space-y-4">
              <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto" />
              <p className="text-lg font-medium">{error}</p>
              <Link href="/shield">
                <Button data-testid="button-try-again">Try Again</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  if (!report) return null;

  const scoreConfig = SCORE_CONFIG[report.exposureScore];
  const ScoreIcon = scoreConfig.icon;

  const allSources = [
    ...(report.breachResults || []).map((b, i) => ({
      type: "breach" as const,
      title: `Data Breach: ${b.breachName}`,
      description: `Your email was found in the ${b.breachName} data breach${b.breachDate ? ` (${b.breachDate})` : ""}. The types of data exposed include: ${b.dataClasses.join(", ")}.`,
      status: "found",
      url: null as string | null,
      idx: i,
    })),
    ...(report.brokerResults || []).map((b, i) => ({
      type: "broker" as const,
      title: `Data Broker: ${b.broker}`,
      description:
        b.status === "found"
          ? `Your information was found on ${b.broker}. ${b.dataFound ? `Data types found: ${b.dataFound.join(", ")}.` : ""}`
          : b.status === "pending_verification"
          ? `${b.broker} may have your data. This requires manual verification.`
          : b.status === "rate_limited"
          ? `We could not check ${b.broker} at this time. Try again later for complete results.`
          : b.status === "timed_out"
          ? `The check for ${b.broker} timed out. Try again later.`
          : b.status === "unavailable"
          ? `${b.broker} could not be checked at this time.`
          : `${b.broker} was checked — no matching records were found.`,
      status: b.status,
      url: b.url || null,
      idx: (report.breachResults?.length || 0) + i,
    })),
  ];

  const foundSources = allSources.filter(s => s.status === "found");
  const uncheckedSources = allSources.filter(s =>
    s.status === "rate_limited" || s.status === "timed_out" || s.status === "unavailable"
  );
  const hasPartialChecks = report.partialResults || uncheckedSources.length > 0;

  return (
    <>
      <SEOHead
        title={`Your Exposure Results | GCR Data Shield`}
        description="View your personal data exposure scan results from GCR Data Shield."
      />
      <Navigation />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">

          {accessLevel === "full" && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
              data-testid="banner-full-access"
            >
              <Crown className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Ongoing protection active — auto re-scans, alerts, and removal tracking included.
              </p>
            </div>
          )}

          <Card className={`border-2 ${scoreConfig.border}`}>
            <CardContent className="py-8">
              <div className="flex items-start gap-5">
                <div className={`w-16 h-16 rounded-xl ${scoreConfig.bg} flex items-center justify-center flex-shrink-0`}>
                  <ScoreIcon className={`h-8 w-8 ${scoreConfig.color}`} aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xl font-bold ${scoreConfig.color}`}
                      data-testid="text-exposure-score"
                    >
                      {scoreConfig.label}
                    </span>
                    <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${scoreConfig.bg} ${scoreConfig.color}`}>
                      Score: {report.scoreBreakdown.rawTotal}
                    </span>
                  </div>
                  <p className="text-base text-foreground leading-relaxed" data-testid="text-exposure-summary">
                    {summary || generateSummary(report)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {hasPartialChecks && (
            <div
              className="flex items-start gap-3 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30"
              role="alert"
              data-testid="banner-partial-results"
            >
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {uncheckedSources.length > 0
                  ? `${uncheckedSources.length} site${uncheckedSources.length !== 1 ? "s" : ""} could not be checked due to timeouts or rate limits. Your actual exposure may be higher than shown.`
                  : "Some checks could not be completed. Your actual exposure may be higher than shown."
                }
              </p>
            </div>
          )}

          {allSources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg" data-testid="text-findings-title">
                  Detailed Findings ({foundSources.length} found across {allSources.length} sources)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {allSources.map((source) => {
                  const isExpanded = expandedItems.has(source.idx);
                  const statusIcon =
                    source.status === "found" ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Found" />
                    ) : source.status === "pending_verification" ? (
                      <AlertCircle className="h-4 w-4 text-yellow-500" aria-label="Pending verification" />
                    ) : source.status === "rate_limited" || source.status === "timed_out" || source.status === "unavailable" ? (
                      <Clock className="h-4 w-4 text-orange-500" aria-label="Could not be checked" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-green-500" aria-label="Not found" />
                    );

                  return (
                    <div key={source.idx} className="border rounded-lg">
                      <button
                        onClick={() => toggleExpand(source.idx)}
                        className="w-full flex items-center justify-between p-4 text-left min-h-[48px] hover:bg-muted/50 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-expanded={isExpanded}
                        data-testid={`button-expand-${source.idx}`}
                      >
                        <div className="flex items-center gap-3">
                          {statusIcon}
                          <span className="font-medium text-sm">{source.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {source.description}
                          </p>
                          {source.url && (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline min-h-[44px]"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              View on {source.title.split(": ")[1]}
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {((report.breachResults && report.breachResults.length > 0) || (report.breachCount && report.breachCount > 0)) && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground px-1">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p data-testid="text-hibp-attribution">
                Breach data provided by{" "}
                <a
                  href="https://haveibeenpwned.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-primary hover:text-primary/80"
                >
                  Have I Been Pwned
                </a>
              </p>
            </div>
          )}

          {!hasPaidAccess && foundSources.length > 0 && (
            <Card className="border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1" data-testid="text-cta-heading">
                      Keep your data protected
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Data brokers re-add your information every 30-90 days. With ongoing monitoring, we automatically re-scan and alert you when your data reappears.
                    </p>
                  </div>
                  <div className="text-left space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Automatic re-scans every 30 days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Instant alerts when your data reappears</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>Step-by-step removal tracking</span>
                    </div>
                  </div>
                  <Link href="/pricing">
                    <Button className="min-h-[44px] w-full" data-testid="button-view-plans">
                      <Crown className="h-4 w-4 mr-2" />
                      View Protection Plans
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {!hasPaidAccess && foundSources.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto">
                    <Bell className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1" data-testid="text-cta-heading">
                      Stay ahead of future breaches
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your data looks clean today, but new breaches happen constantly. Get alerts if your information appears in future scans.
                    </p>
                  </div>
                  {leadSubmitted ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                      <p className="text-sm font-medium">You're signed up for monitoring alerts.</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 max-w-md mx-auto">
                      <div className="flex-1">
                        <label htmlFor="alert-email" className="sr-only">Email for alerts</label>
                        <Input
                          id="alert-email"
                          type="email"
                          placeholder="Enter your email for alerts"
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          className="min-h-[44px] text-base"
                          data-testid="input-alert-email"
                        />
                      </div>
                      <Button
                        onClick={() => leadMutation.mutate()}
                        disabled={!alertEmail.trim() || leadMutation.isPending}
                        className="min-h-[44px]"
                        data-testid="button-get-alerts"
                      >
                        {leadMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4 mr-2" />
                        )}
                        Get Alerts
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {hasPaidAccess && (
            <Card>
              <CardContent className="py-8">
                {leadSubmitted ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="text-lg font-medium">Ongoing monitoring active</p>
                      <p className="text-muted-foreground text-sm">
                        We will re-scan every 30 days and alert you if your data reappears.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold mb-1" data-testid="text-cta-heading">
                        Set Up Monitoring Alerts
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Get notified when your data reappears. We re-scan every 30 days and send you an alert.
                      </p>
                    </div>
                    <div className="flex gap-3 max-w-md mx-auto">
                      <div className="flex-1">
                        <label htmlFor="alert-email" className="sr-only">Email for alerts</label>
                        <Input
                          id="alert-email"
                          type="email"
                          placeholder="Enter your email"
                          value={alertEmail}
                          onChange={(e) => setAlertEmail(e.target.value)}
                          className="min-h-[44px] text-base"
                          data-testid="input-alert-email"
                        />
                      </div>
                      <Button
                        onClick={() => leadMutation.mutate()}
                        disabled={!alertEmail.trim() || leadMutation.isPending}
                        className="min-h-[44px]"
                        data-testid="button-start-monitoring"
                      >
                        {leadMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4 mr-2" />
                        )}
                        Start Monitoring
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="text-center">
            <Link href="/shield">
              <Button variant="outline" className="min-h-[44px]" data-testid="button-new-scan">
                Run Another Scan
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function generateSummary(report: ExposureReport): string {
  const brokerResults = report.brokerResults || [];
  const breachResults = report.breachResults || [];
  const brokerCount = report.brokerCount || brokerResults.length;
  const breachCount = report.breachCount || breachResults.length;
  const foundBrokers = brokerResults.filter(b => b.status === "found");
  const brokerFoundCount = report.brokerFoundCount || foundBrokers.length;

  const parts: string[] = [];

  parts.push(`We scanned ${brokerCount} data broker site${brokerCount !== 1 ? "s" : ""}`);
  if (breachCount > 0) {
    parts[0] += ` and ${breachCount} breach database${breachCount !== 1 ? "s" : ""}`;
  }

  if (breachResults.length > 0 && brokerFoundCount > 0) {
    return `${parts[0]}. Your email appeared in ${breachResults.length} data breach${breachResults.length !== 1 ? "es" : ""}, and your name was found on ${brokerFoundCount} people-search site${brokerFoundCount !== 1 ? "s" : ""}. Review the details below.`;
  }

  if (breachResults.length > 0) {
    return `${parts[0]}. Your email appeared in ${breachResults.length} data breach${breachResults.length !== 1 ? "es" : ""}. Review the details below to see what was exposed.`;
  }

  if (brokerFoundCount > 0) {
    return `${parts[0]}. Your information was found on ${brokerFoundCount} people-search site${brokerFoundCount !== 1 ? "s" : ""}. Review the details below.`;
  }

  return `${parts[0]}. We did not find your information on the sites we checked. This is a good sign, but new breaches and data broker listings happen regularly.`;
}

export default ShieldResultsPage;
