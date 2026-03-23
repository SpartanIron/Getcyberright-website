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
  Lock,
  Unlock,
  Crown,
} from "lucide-react";

type BrokerResult = {
  broker: string;
  status: string;
  url: string;
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

type AccessLevel = "free" | "trial" | "full";

const SCORE_CONFIG = {
  low: {
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-100 dark:bg-green-950/40",
    border: "border-green-200 dark:border-green-800",
    icon: CheckCircle2,
    label: "Low Risk",
  },
  medium: {
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-100 dark:bg-yellow-950/40",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: AlertCircle,
    label: "Medium Risk",
  },
  high: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-100 dark:bg-orange-950/40",
    border: "border-orange-200 dark:border-orange-800",
    icon: ShieldAlert,
    label: "High Risk",
  },
  critical: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/40",
    border: "border-red-200 dark:border-red-800",
    icon: ShieldX,
    label: "Critical Risk",
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
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | undefined>();
  const [trialExpired, setTrialExpired] = useState(false);
  const [startingTrial, setStartingTrial] = useState(false);

  useEffect(() => {
    if (!scanId) return;

    let attempts = 0;
    const maxAttempts = 40;

    async function poll() {
      try {
        const res = await fetch(`/api/scan/${scanId}/status`, { credentials: "include" });
        const data = await res.json();

        if (data.accessLevel) setAccessLevel(data.accessLevel);
        if (data.trialDaysLeft !== undefined) setTrialDaysLeft(data.trialDaysLeft);
        if (data.trialExpired) setTrialExpired(true);

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

  async function handleStartTrial() {
    if (!isAuthenticated) {
      setLocation(`/login?redirect=/shield/results/${scanId}`);
      return;
    }

    setStartingTrial(true);
    try {
      const res = await apiRequest("POST", "/api/shield/start-trial", {});
      const data = await res.json();

      if (data.level === "trial" || data.level === "full") {
        setAccessLevel(data.level);
        setTrialDaysLeft(data.trialDaysLeft);
        toast({ title: "Trial activated!", description: "Your 14-day free trial has started. Refreshing your results..." });
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err: any) {
      const errorData = err?.message || "Could not start trial";
      toast({ title: "Could not start trial", description: errorData, variant: "destructive" });
    } finally {
      setStartingTrial(false);
    }
  }

  function toggleExpand(idx: number) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  const hasFullAccess = accessLevel === "trial" || accessLevel === "full";

  if (loading) {
    return (
      <>
        <SEOHead title="Loading Results... | GCR Data Shield" />
        <Navigation />
        <main className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="text-lg font-medium">Loading your results...</p>
            <p className="text-muted-foreground">Scanning 500+ data broker sites and breach databases... this may take up to a minute.</p>
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

  const allSources = hasFullAccess ? [
    ...(report.breachResults || []).map((b, i) => ({
      type: "breach" as const,
      title: `Data Breach: ${b.breachName}`,
      description: `Your email was found in the ${b.breachName} data breach${b.breachDate ? ` (${b.breachDate})` : ""}. The types of data exposed include: ${b.dataClasses.join(", ")}.`,
      status: "found",
      url: null,
      idx: i,
    })),
    ...(report.brokerResults || []).map((b, i) => ({
      type: "broker" as const,
      title: `Data Broker: ${b.broker}`,
      description:
        b.status === "found"
          ? `Your information was found on ${b.broker}. ${b.dataFound ? `Data types found: ${b.dataFound.join(", ")}.` : ""}`
          : b.status === "pending_verification"
          ? `${b.broker} may have your data. This requires manual verification — automated checking is not available for this site.`
          : b.status === "rate_limited"
          ? `We could not check ${b.broker} because we were rate limited. Try again later for complete results.`
          : b.status === "timed_out"
          ? `The check for ${b.broker} timed out. Try again later for complete results.`
          : b.status === "unavailable"
          ? `${b.broker} could not be checked at this time. This does not mean your data is not there.`
          : `${b.broker} was checked but no matching records were found.`,
      status: b.status,
      url: b.url,
      idx: (report.breachResults?.length || 0) + i,
    })),
  ] : [];

  const hasPartialChecks = report.partialResults;
  const totalSources = hasFullAccess
    ? allSources.length
    : (report.brokerCount || 0) + (report.breachCount || 0);

  return (
    <>
      <SEOHead
        title={`Your Exposure Results | GCR Data Shield`}
        description="View your personal data exposure scan results from GCR Data Shield."
      />
      <Navigation />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">

          {accessLevel === "trial" && trialDaysLeft !== undefined && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
              data-testid="banner-trial-active"
            >
              <Unlock className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <span className="font-medium">Free trial active</span> — {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining.{" "}
                <Link href="/pricing" className="underline font-medium">Upgrade</Link> for unlimited access.
              </p>
            </div>
          )}

          {accessLevel === "full" && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
              data-testid="banner-full-access"
            >
              <Crown className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Full access — your subscription includes complete GCR Data Shield reports.
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
                    {hasFullAccess
                      ? (summary || generateClientSummary(report))
                      : generateFreeSummary(report)
                    }
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
                Some checks could not be completed. Your results may be incomplete.
              </p>
            </div>
          )}

          {hasFullAccess && allSources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detailed Findings</CardTitle>
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

          {!hasFullAccess && totalSources > 0 && (
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Detailed Findings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Array.from({ length: Math.min(totalSources, 4) }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                      <div className="h-4 rounded bg-muted animate-pulse flex-1 max-w-[200px]" />
                    </div>
                  </div>
                ))}
                {totalSources > 4 && (
                  <p className="text-sm text-muted-foreground text-center pt-2">
                    + {totalSources - 4} more source{totalSources - 4 !== 1 ? "s" : ""} checked
                  </p>
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background flex items-end justify-center pb-8 pointer-events-none">
                  <div className="pointer-events-auto text-center space-y-3 max-w-sm">
                    <Lock className="h-8 w-8 text-muted-foreground mx-auto" />
                    <p className="text-lg font-semibold" data-testid="text-unlock-cta">
                      {trialExpired
                        ? "Your free trial has ended"
                        : "Unlock your full report"
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {trialExpired
                        ? "Upgrade to Essential or higher to continue viewing detailed results, broker names, breach data, and removal guidance."
                        : "See which broker sites have your data, which breaches exposed your email, and get step-by-step removal guidance."
                      }
                    </p>
                    {trialExpired ? (
                      <Link href="/pricing">
                        <Button className="min-h-[44px]" data-testid="button-upgrade">
                          <Crown className="h-4 w-4 mr-2" />
                          View Plans
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        onClick={handleStartTrial}
                        disabled={startingTrial}
                        className="min-h-[44px]"
                        data-testid="button-start-trial"
                      >
                        {startingTrial ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Unlock className="h-4 w-4 mr-2" />
                        )}
                        {isAuthenticated
                          ? "Start 14-Day Free Trial"
                          : "Sign Up to Start Free Trial"
                        }
                      </Button>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {trialExpired
                        ? "Plans start at just a few dollars per month."
                        : "No credit card required. Full access for 14 days."
                      }
                    </p>
                  </div>
                </div>
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

          {hasFullAccess && (
            <Card>
              <CardContent className="py-8">
                {leadSubmitted ? (
                  <div className="flex flex-col items-center gap-4 text-center">
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="text-lg font-medium">You're all set!</p>
                      <p className="text-muted-foreground text-sm">
                        We will re-scan every 30 days and alert you if your data reappears.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h2 className="text-lg font-semibold mb-1" data-testid="text-cta-heading">
                        Start Removing My Data
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Get notified if your data reappears. We will re-scan every 30 days and alert you.
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
                        data-testid="button-start-removing"
                      >
                        {leadMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Mail className="h-4 w-4 mr-2" />
                        )}
                        Sign Up
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

function generateFreeSummary(report: ExposureReport): string {
  const brokerCount = report.brokerCount || 0;
  const breachCount = report.breachCount || 0;
  const brokerFoundCount = report.brokerFoundCount || 0;

  let text = `We scanned ${brokerCount} data broker site${brokerCount !== 1 ? "s" : ""}`;
  if (breachCount > 0) {
    text += ` and ${breachCount} breach database${breachCount !== 1 ? "s" : ""}`;
  }
  text += ". ";

  if (report.exposureScore === "critical" || report.exposureScore === "high") {
    text += `Your personal information was found on ${brokerFoundCount} site${brokerFoundCount !== 1 ? "s" : ""}. Unlock the full report to see exactly where and get removal steps.`;
  } else if (report.exposureScore === "medium") {
    text += `We found some exposure of your personal information. Unlock the full report to see the details and recommended actions.`;
  } else if (brokerFoundCount > 0) {
    text += `Your information appeared on ${brokerFoundCount} site${brokerFoundCount !== 1 ? "s" : ""}, but your overall exposure is low. Unlock the full report for details.`;
  } else {
    text += "Good news — we didn't find your information on the sites we checked. Unlock the full report to see the complete picture.";
  }

  return text;
}

function generateClientSummary(report: ExposureReport): string {
  const parts: string[] = [];

  if (report.breachResults && report.breachResults.length > 0) {
    parts.push(
      `Your email address appeared in ${report.breachResults.length} data breach${report.breachResults.length !== 1 ? "es" : ""}`,
    );
  }

  const foundBrokers = (report.brokerResults || []).filter((b) => b.status === "found");
  if (foundBrokers.length > 0) {
    parts.push(
      `your name was found on ${foundBrokers.length} people-search site${foundBrokers.length !== 1 ? "s" : ""}`,
    );
  }

  const pendingBrokers = (report.brokerResults || []).filter(
    (b) => b.status === "pending_verification",
  );
  if (pendingBrokers.length > 0) {
    parts.push(
      `${pendingBrokers.length} additional broker${pendingBrokers.length !== 1 ? "s" : ""} may also have your data`,
    );
  }

  if (parts.length === 0) {
    return "Good news — we did not find your information on the data broker sites and breach databases we checked.";
  }

  let text = parts[0];
  for (let i = 1; i < parts.length; i++) {
    if (i === parts.length - 1) text += `, and ${parts[i]}`;
    else text += `, ${parts[i]}`;
  }
  text += ".";

  if (report.exposureScore === "high" || report.exposureScore === "critical") {
    text +=
      " This is likely contributing to the scam calls and texts you are receiving.";
  }

  return text;
}

export default ShieldResultsPage;
