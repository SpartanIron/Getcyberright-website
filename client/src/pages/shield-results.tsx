"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "@/lib/navigation";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Eye,
  Trash2,
  Zap,
  FileText,
  Lock,
  ShieldCheck,
} from "lucide-react";

type BrokerResult = {
  broker: string | null;
  status: string;
  url?: string;
  found: boolean | null;
  dataFound: string[] | null;
  redacted?: boolean;
  optOutUrl?: string | null;
  optOutEmail?: string | null;
  optOutMethod?: string | null;
  optOutInstructions?: string | null;
  difficultyRating?: number | null;
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
  numericScore?: number;
  scoreBreakdown: {
    breachPoints: number;
    brokerPoints: number;
    recencyPoints?: number;
    passwordExposurePoints?: number;
    sensitivityMultiplier: number;
    rawTotal: number;
  };
  partialResults: boolean;
  brokerCount?: number;
  breachCount?: number;
  brokerFoundCount?: number;
};

type UserTier = "free" | "essential" | "professional";
type AccessLevel = "free" | "full";

type RemovalStatus = {
  requestId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

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

function getDifficultyLabel(rating: number | null | undefined): { label: string; color: string } {
  if (!rating || rating <= 3) return { label: "Easy", color: "text-green-600 dark:text-green-400" };
  if (rating <= 6) return { label: "Medium", color: "text-yellow-600 dark:text-yellow-400" };
  return { label: "Hard", color: "text-orange-600 dark:text-orange-400" };
}

function getRemovalStatusDisplay(status: string): { label: string; color: string; bgColor: string } {
  switch (status) {
    case "request_sent":
      return { label: "Request Sent", color: "text-blue-700 dark:text-blue-300", bgColor: "bg-blue-100 dark:bg-blue-950/40" };
    case "acknowledged":
      return { label: "Acknowledged", color: "text-blue-700 dark:text-blue-300", bgColor: "bg-blue-100 dark:bg-blue-950/40" };
    case "in_progress":
      return { label: "In Progress", color: "text-yellow-700 dark:text-yellow-300", bgColor: "bg-yellow-100 dark:bg-yellow-950/40" };
    case "confirmed_removed":
      return { label: "Removed", color: "text-green-700 dark:text-green-300", bgColor: "bg-green-100 dark:bg-green-950/40" };
    case "failed":
      return { label: "Failed", color: "text-red-700 dark:text-red-300", bgColor: "bg-red-100 dark:bg-red-950/40" };
    case "re_appeared":
      return { label: "Re-appeared", color: "text-orange-700 dark:text-orange-300", bgColor: "bg-orange-100 dark:bg-orange-950/40" };
    default:
      return { label: "Pending", color: "text-gray-700 dark:text-gray-300", bgColor: "bg-gray-100 dark:bg-gray-800" };
  }
}

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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [alertEmail, setAlertEmail] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("free");
  const [userTier, setUserTier] = useState<UserTier>("free");
  const [showNotFound, setShowNotFound] = useState(false);
  const [guidedBroker, setGuidedBroker] = useState<string | null>(null);
  const [removalStatuses, setRemovalStatuses] = useState<Record<string, RemovalStatus>>({});
  const [removingBrokers, setRemovingBrokers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!scanId) return;

    let attempts = 0;
    const maxAttempts = 40;

    async function poll() {
      try {
        const res = await fetch(`/api/scan/${scanId}/status`, { credentials: "include" });
        const data = await res.json();

        if (data.accessLevel) setAccessLevel(data.accessLevel);
        if (data.userTier) setUserTier(data.userTier);

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

  useEffect(() => {
    if (!isAuthenticated || userTier === "free") return;
    async function fetchRemovalStatuses() {
      try {
        const res = await fetch(`/api/shield/removal-status/${scanId}`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setRemovalStatuses(data.removalStatuses || {});
        }
      } catch {}
    }
    fetchRemovalStatuses();
  }, [scanId, isAuthenticated, userTier]);

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

  async function handleRemovalRequest(brokerId: string) {
    setRemovingBrokers((prev) => new Set(prev).add(brokerId));
    try {
      const res = await apiRequest("POST", "/api/shield/removal-request", { brokerId, scanId });
      const data = await res.json();

      if (data.action === "guided") {
        setGuidedBroker(brokerId);
        toggleExpand(`broker-${brokerId}`);
      } else if (data.action === "needs_vault") {
        toast({
          title: "Setup Required",
          description: data.message,
        });
        setLocation(data.setupUrl || "/data-removal");
      } else if (data.action === "automated") {
        setRemovalStatuses((prev) => ({
          ...prev,
          [brokerId]: {
            requestId: data.requestId,
            status: data.status || "not_started",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }));
        toast({
          title: "Removal Request Submitted",
          description: data.message || "We'll handle the removal process for you.",
        });
      } else if (data.action === "already_requested") {
        setRemovalStatuses((prev) => ({
          ...prev,
          [brokerId]: {
            requestId: data.requestId,
            status: data.status || "in_progress",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }));
        toast({
          title: "Already In Progress",
          description: data.message || "A removal request is already being processed for this broker.",
        });
      } else {
        toast({
          title: "Request Received",
          description: data.message || "Your removal request has been received.",
        });
      }
    } catch (err: any) {
      toast({
        title: "Request Failed",
        description: err.message || "Could not submit removal request",
        variant: "destructive",
      });
    } finally {
      setRemovingBrokers((prev) => {
        const next = new Set(prev);
        next.delete(brokerId);
        return next;
      });
    }
  }

  function toggleExpand(key: string) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const hasPaidAccess = accessLevel === "full";

  if (loading) {
    return (
      <>
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

  const brokerResults = report.brokerResults || [];
  const redactedBrokerCount = brokerResults.filter(b => b.redacted).length;

  const foundBrokers = brokerResults.filter(b => b.status === "found" && !b.redacted);
  const redactedBrokers = brokerResults.filter(b => b.redacted);
  const notFoundBrokers = brokerResults.filter(b => b.status === "not_found");
  const uncheckedBrokers = brokerResults.filter(b =>
    b.status === "rate_limited" || b.status === "timed_out" || b.status === "unavailable"
  );
  const pendingBrokers = brokerResults.filter(b => b.status === "pending_verification");

  const breachResults = report.breachResults || [];
  const totalFoundBrokers = report.brokerFoundCount || foundBrokers.length;
  const hasPartialChecks = report.partialResults || uncheckedBrokers.length > 0;

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-2xl space-y-6">

          {userTier === "professional" && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
              data-testid="banner-professional"
            >
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Continuous protection active - monthly re-scans, auto re-submission, and alerts included.
              </p>
            </div>
          )}

          {userTier === "essential" && (
            <div
              className="flex items-center gap-2 p-3 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30"
              data-testid="banner-essential"
            >
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                Automated removal active - we submit opt-out requests on your behalf.
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
                    <span className={`text-sm px-2.5 py-1 rounded-full font-medium ${scoreConfig.bg} ${scoreConfig.color}`} data-testid="text-numeric-score">
                      {report.numericScore !== undefined ? report.numericScore : report.scoreBreakdown.rawTotal}/100
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
              data-testid="alert-partial-results"
            >
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {uncheckedBrokers.length > 0
                  ? `${uncheckedBrokers.length} site${uncheckedBrokers.length !== 1 ? "s" : ""} could not be checked due to timeouts or rate limits. Your actual exposure may be higher than shown.`
                  : "Some checks could not be completed. Your actual exposure may be higher than shown."
                }
              </p>
            </div>
          )}

          {(foundBrokers.length > 0 || redactedBrokerCount > 0) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2" data-testid="text-exposures-title">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Data Exposures Found
                    <Badge variant="destructive" className="ml-1" data-testid="badge-exposure-count">
                      {totalFoundBrokers} site{totalFoundBrokers !== 1 ? "s" : ""}
                    </Badge>
                  </CardTitle>
                  {userTier !== "free" && foundBrokers.length > 1 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        foundBrokers.forEach(b => {
                          if (b.broker && !removalStatuses[b.broker]) {
                            handleRemovalRequest(b.broker);
                          }
                        });
                      }}
                      data-testid="button-remove-all"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Remove All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {foundBrokers.map((broker) => {
                  if (!broker.broker) return null;
                  const brokerId = broker.broker;
                  const isExpanded = expandedItems.has(`broker-${brokerId}`);
                  const difficulty = getDifficultyLabel(broker.difficultyRating);
                  const existingRemoval = removalStatuses[brokerId];
                  const isRemoving = removingBrokers.has(brokerId);
                  const isGuided = guidedBroker === brokerId;

                  return (
                    <div key={brokerId} className="border rounded-lg border-red-200 dark:border-red-900/50" data-testid={`card-broker-${brokerId}`}>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <div className="min-w-0">
                              <span className="font-medium text-sm block">{brokerId}</span>
                              {broker.dataFound && broker.dataFound.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Found: {broker.dataFound.join(", ")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {existingRemoval ? (
                              <Badge
                                variant="outline"
                                className={`${getRemovalStatusDisplay(existingRemoval.status).bgColor} ${getRemovalStatusDisplay(existingRemoval.status).color} border-0 text-xs`}
                                data-testid={`badge-removal-status-${brokerId}`}
                              >
                                {getRemovalStatusDisplay(existingRemoval.status).label}
                              </Badge>
                            ) : (
                              <>
                                {userTier === "free" ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      toggleExpand(`broker-${brokerId}`);
                                      setGuidedBroker(brokerId);
                                    }}
                                    className="text-xs h-8"
                                    data-testid={`button-guide-${brokerId}`}
                                  >
                                    <FileText className="h-3 w-3 mr-1" />
                                    Remove Yourself
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => handleRemovalRequest(brokerId)}
                                    disabled={isRemoving}
                                    className="text-xs h-8"
                                    data-testid={`button-auto-remove-${brokerId}`}
                                  >
                                    {isRemoving ? (
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                    ) : (
                                      <Zap className="h-3 w-3 mr-1" />
                                    )}
                                    Auto-Remove
                                  </Button>
                                )}
                              </>
                            )}
                            <button
                              onClick={() => toggleExpand(`broker-${brokerId}`)}
                              className="p-1.5 hover:bg-muted rounded-md transition-colors"
                              aria-expanded={isExpanded}
                              data-testid={`button-expand-broker-${brokerId}`}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 border-t border-red-100 dark:border-red-900/30 space-y-3">
                          <div className="pt-3 space-y-3">
                            {broker.dataFound && broker.dataFound.length > 0 && (
                              <p className="text-sm text-muted-foreground">
                                Your information found on {brokerId}: {broker.dataFound.join(", ")}.
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {broker.optOutMethod && (
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Removal via: {broker.optOutMethod === "web-form" ? "Web Form" : broker.optOutMethod === "email" ? "Email" : broker.optOutMethod}
                                </span>
                              )}
                              {broker.difficultyRating && (
                                <span className={`flex items-center gap-1 ${difficulty.color}`}>
                                  Difficulty: {difficulty.label}
                                </span>
                              )}
                            </div>

                            {(isGuided || userTier === "free") && broker.optOutInstructions && (
                              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5 text-primary" />
                                  Step-by-Step Removal Guide
                                </p>
                                <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                                  {broker.optOutInstructions}
                                </p>
                              </div>
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                              {broker.optOutUrl && (
                                <a
                                  href={broker.optOutUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline min-h-[36px] font-medium"
                                  data-testid={`link-optout-${brokerId}`}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Go to Opt-Out Page
                                </a>
                              )}
                              {broker.url && hasPaidAccess && (
                                <a
                                  href={broker.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:underline min-h-[36px]"
                                  data-testid={`link-profile-${brokerId}`}
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  View Your Listing
                                </a>
                              )}
                            </div>

                            {userTier === "free" && (
                              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mt-2">
                                <p className="text-xs text-muted-foreground">
                                  <Lock className="h-3 w-3 inline mr-1" />
                                  Want us to handle this automatically?{" "}
                                  <Link href="/register" className="text-primary hover:underline font-medium">
                                    Create a free account
                                  </Link>
                                  {" "}and we'll submit removal requests on your behalf.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {!hasPaidAccess && redactedBrokerCount > 0 && (
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-5 text-center space-y-3" data-testid="card-redacted-brokers">
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="font-semibold text-sm">
                        + {redactedBrokerCount} more site{redactedBrokerCount !== 1 ? "s" : ""} have your personal data
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Create a free account to see all broker names, get automated removal, and ongoing monitoring.
                    </p>
                    <Link href="/register">
                      <Button size="sm" className="min-h-[40px]" data-testid="button-see-all-brokers">
                        <Crown className="h-4 w-4 mr-2" />
                        See All {totalFoundBrokers} Sites
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {breachResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2" data-testid="text-breaches-title">
                  <ShieldAlert className="h-5 w-5 text-orange-500" />
                  Data Breaches
                  <Badge variant="outline" className="ml-1 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300">
                    {breachResults.length} breach{breachResults.length !== 1 ? "es" : ""}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {breachResults.map((breach, i) => {
                  const key = `breach-${i}`;
                  const isExpanded = expandedItems.has(key);
                  return (
                    <div key={key} className="border rounded-lg">
                      <button
                        onClick={() => toggleExpand(key)}
                        className="w-full flex items-center justify-between p-4 text-left min-h-[48px] hover:bg-muted/50 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-expanded={isExpanded}
                        data-testid={`button-expand-breach-${i}`}
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-sm">{breach.breachName}</span>
                          {breach.breachDate && (
                            <span className="text-xs text-muted-foreground">({breach.breachDate})</span>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-0 space-y-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Your email was found in the {breach.breachName} data breach
                            {breach.breachDate ? ` (${breach.breachDate})` : ""}.
                            Data exposed: {breach.dataClasses.join(", ")}.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {(notFoundBrokers.length > 0 || uncheckedBrokers.length > 0 || pendingBrokers.length > 0) && (
            <div>
              <button
                onClick={() => setShowNotFound(!showNotFound)}
                className="w-full flex items-center justify-between p-3 text-left text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg"
                data-testid="button-toggle-not-found"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {notFoundBrokers.length} site{notFoundBrokers.length !== 1 ? "s" : ""} checked; no data found
                  {uncheckedBrokers.length > 0 && ` · ${uncheckedBrokers.length} could not be checked`}
                </span>
                {showNotFound ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showNotFound && (
                <Card className="mt-2">
                  <CardContent className="py-4 space-y-1.5">
                    {notFoundBrokers.map((b, i) => (
                      <div key={`nf-${i}`} className="flex items-center gap-2 py-1.5 px-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        <span>{b.broker || "Unknown"}</span>
                      </div>
                    ))}
                    {pendingBrokers.map((b, i) => (
                      <div key={`pv-${i}`} className="flex items-center gap-2 py-1.5 px-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                        <span>{b.broker || "Unknown"} - pending verification</span>
                      </div>
                    ))}
                    {uncheckedBrokers.map((b, i) => (
                      <div key={`uc-${i}`} className="flex items-center gap-2 py-1.5 px-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5 text-orange-500 flex-shrink-0" />
                        <span>{b.broker || "Unknown"} - could not be checked</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
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

          {userTier === "free" && (foundBrokers.length > 0 || redactedBrokerCount > 0) && (
            <Card className="border-2 border-primary/20">
              <CardContent className="py-8">
                <div className="text-center space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-1" data-testid="text-cta-heading">
                      Let us handle the removal
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Removing your data from {totalFoundBrokers} site{totalFoundBrokers !== 1 ? "s" : ""} manually takes time. Create a free account and we'll submit opt-out requests on your behalf.
                    </p>
                  </div>
                  <div className="text-left space-y-3 text-sm">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Zap className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Automated Removal</span>
                        <p className="text-muted-foreground text-xs mt-0.5">Automated opt-out requests + status tracking + verification re-scan</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-medium">Continuous Protection</span>
                        <p className="text-muted-foreground text-xs mt-0.5">Monthly re-scans + auto re-submission when data reappears + email alerts</p>
                      </div>
                    </div>
                  </div>
                  <Link href="/register">
                    <Button className="min-h-[44px] w-full" data-testid="button-view-plans">
                      <Crown className="h-4 w-4 mr-2" />
                      Sign Up Free
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {userTier === "essential" && foundBrokers.length > 0 && (
            <Card className="border border-blue-200 dark:border-blue-800">
              <CardContent className="py-6">
                <div className="text-center space-y-3 max-w-md mx-auto">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center mx-auto">
                    <RefreshCw className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold mb-1" data-testid="text-upgrade-pro-heading">
                      Want continuous protection?
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Data brokers re-add your information every 30-90 days. Sign up for free and get monthly re-scans and automatic re-submission.
                    </p>
                  </div>
                  <Link href="/register">
                    <Button variant="outline" size="sm" className="min-h-[40px]" data-testid="button-signup-free">
                      <Crown className="h-4 w-4 mr-2" />
                      Sign Up Free
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {userTier === "free" && foundBrokers.length === 0 && redactedBrokerCount === 0 && (
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
              <Card className="border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl overflow-hidden" data-testid="card-conversion-engine">
              <CardContent className="p-0">
                {(() => {
                  const score = report?.exposureScore;
                  const isCritical = score === "critical";
                  const isHigh = score === "high";
                  const isMedium = score === "medium";
                  const isHighRisk = isCritical || isHigh;
                  const brokersFound = report?.brokerResults?.filter(b => b.status === "found").length ?? 0;
                  const breachCount = report?.breachResults?.filter(b => !b.breachName?.startsWith("__")).length ?? 0;
                  const pendingBrokers = report?.brokerResults?.filter(b => b.status === "pending_verification" || b.status === "timed_out").length ?? 0;

                  const headerBg = isCritical ? "bg-red-900/60 border-b border-red-700/50" :
                    isHigh ? "bg-orange-900/50 border-b border-orange-700/50" :
                    isMedium ? "bg-yellow-900/40 border-b border-yellow-700/40" :
                    "bg-teal-900/30 border-b border-teal-700/30";

                  const pulseColor = isCritical ? "bg-red-400" : isHigh ? "bg-orange-400" : isMedium ? "bg-yellow-400" : "bg-teal-400";

                  const headerText = isCritical ? "CRITICAL RISK — Immediate action recommended" :
                    isHigh ? "HIGH EXPOSURE — Your data is actively circulating" :
                    isMedium ? "MEDIUM RISK — Evolving threats detected" :
                    "LOW RISK — Threats change. Stay ahead of them.";

                  const headline = isCritical ? "Your personal data is severely exposed." :
                    isHigh ? "Your data is out there. And it's being used." :
                    isMedium ? "Some exposure found. More may emerge." :
                    "Clean for now — but threats don't stand still.";

                  const body = isCritical || isHigh
                    ? "We found your information on " + brokersFound + " data broker " + (brokersFound === 1 ? "site" : "sites") + " and in " + breachCount + " confirmed " + (breachCount === 1 ? "breach" : "breaches") + ". Data at this exposure level is actively used for identity theft, targeted phishing, and financial fraud. Continuous removal and monitoring are essential."
                    : isMedium
                    ? "We found some exposure in your scan. Similar patterns appear in scams targeting people with your profile. Threats evolve — what looks clean today can surface tomorrow through new data broker listings or breach releases."
                    : "This scan found minimal exposure — which is genuinely good news. But data broker listings and breaches appear daily. A clean result today doesn't guarantee a clean result in 30 days. Ongoing monitoring is the only way to stay ahead.";

                  const ctaLabel = isHighRisk ? "Activate protection now" : "Start continuous protection";
                  const ctaBg = isHighRisk ? "bg-orange-500 hover:bg-orange-400 text-white" : "bg-teal-500 hover:bg-teal-400 text-white";
                  const nextStepsHref = "/shield/next-steps?level=" + (score || "high");

                  return (
                    <>
                      <div className={cn("px-6 py-4 flex items-center gap-3", headerBg)}>
                        <div className={cn("w-2.5 h-2.5 rounded-full animate-pulse", pulseColor)} />
                        <span className="text-xs font-semibold uppercase tracking-widest text-slate-300">{headerText}</span>
                      </div>
                      <div className="px-6 py-8">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{headline}</h3>
                            <p className="text-slate-300 text-sm mb-5 leading-relaxed">{body}</p>
                            <div className="space-y-2 mb-6">
                              {brokersFound > 0 && (
                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                  <span className="text-orange-400 mt-0.5 shrink-0">&#9888;</span>
                                  <span><strong className="text-white">{brokersFound} data broker {brokersFound === 1 ? "site has" : "sites have"} your profile</strong> — your data is listed and sold</span>
                                </div>
                              )}
                              {breachCount > 0 && (
                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                  <span className="text-red-400 mt-0.5 shrink-0">&#9888;</span>
                                  <span><strong className="text-white">{breachCount} breach{breachCount === 1 ? "" : "es"} confirmed</strong> — your email has been exposed in known breach databases</span>
                                </div>
                              )}
                              {pendingBrokers > 0 && (
                                <div className="flex items-start gap-2 text-sm text-slate-300">
                                  <span className="text-yellow-400 mt-0.5 shrink-0">&#9711;</span>
                                  <span><strong className="text-white">{pendingBrokers} sites could not be fully checked</strong> — continuous monitoring catches what a one-time scan misses</span>
                                </div>
                              )}
                              <div className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-teal-400 mt-0.5 shrink-0">&#8635;</span>
                                <span>New exposures happen <strong className="text-white">every day</strong> — this result reflects today only</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6">
                            <div className="text-center mb-5">
                              <div className="inline-flex items-center gap-1.5 bg-teal-500/15 border border-teal-500/30 rounded-full px-3 py-1 mb-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                                <span className="text-teal-300 text-xs font-semibold tracking-wide">CONTINUOUS PROTECTION</span>
                              </div>
                              <h4 className="text-white font-bold text-lg mb-1">GCR Data Shield Protection</h4>
                              <p className="text-slate-400 text-xs">Monthly re-scans · Auto removal · Breach alerts</p>
                            </div>
                            <div className="text-center mb-5">
                              <div className="flex items-end justify-center gap-1 mb-1">
                                <span className="text-slate-400 text-sm mb-1">from</span>
                                <span className="text-4xl font-black text-white">$8.99</span>
                                <span className="text-slate-400 text-sm mb-1">/mo</span>
                              </div>
                              <p className="text-slate-500 text-xs">or $83.88/year · Cancel anytime</p>
                            </div>
                            <ul className="space-y-2 mb-6 text-sm">
                              {[
                                "Monthly full re-scan across 500+ broker sites",
                                "Automatic opt-out submissions on your behalf",
                                "Real-time breach alerts when your email appears",
                                "Removal verification — we confirm it worked",
                              ].map((feature) => (
                                <li key={feature} className="flex items-start gap-2 text-slate-300">
                                  <span className="text-teal-400 shrink-0 mt-0.5">&#10003;</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                            <Link href="/data-shield-pricing">
                              <Button className={cn("w-full text-sm font-bold py-3 rounded-xl transition-all duration-200 shadow-lg", ctaBg)}>
                                {ctaLabel}
                                <span className="ml-2">&#8594;</span>
                              </Button>
                            </Link>
                            <p className="text-center text-xs text-slate-500 mt-3">
                              Free check access remains. Protection is optional.
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6 pt-6 border-t border-slate-700/50">
                          <Link href={nextStepsHref}>
                            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                              View your removal action plan
                            </Button>
                          </Link>
                          <Link href="/shield">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-200">
                              Run another scan
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </CardContent>
            </Card>
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
