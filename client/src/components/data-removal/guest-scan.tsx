"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { trackToolUsage } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Lock,
  Loader2,
  User,
  ExternalLink,
  Globe,
  Phone,
  Fingerprint,
  BookOpen,
  ListChecks,
  Info,
  RotateCw,
} from "lucide-react";
import type { DataBroker, WalkthroughData, WalkthroughStep } from "@/components/data-removal/types";

export function GuestScanForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState("");
  const [walkthroughDialogBrokerId, setWalkthroughDialogBrokerId] = useState<string | null>(null);
  const [verifyResults, setVerifyResults] = useState<Record<string, "still_listed" | "not_found" | "loading" | "error">>({});

  const { data: walkthroughsData } = useQuery<WalkthroughData[]>({
    queryKey: ["/api/data-removal/walkthroughs"],
    staleTime: 1000 * 60 * 30,
  });

  const walkthroughMap = (walkthroughsData || []).reduce<Record<string, WalkthroughData>>((acc, w) => {
    acc[w.brokerId] = w;
    return acc;
  }, {});

  const selectedWalkthrough = walkthroughDialogBrokerId ? walkthroughMap[walkthroughDialogBrokerId] : null;

  const stepActionIcon = (actionType: string) => {
    switch (actionType) {
      case "navigate": return <Globe className="h-4 w-4 flex-shrink-0" />;
      case "click": return <ExternalLink className="h-4 w-4 flex-shrink-0" />;
      case "fill_form": return <FileText className="h-4 w-4 flex-shrink-0" />;
      case "verify": return <Shield className="h-4 w-4 flex-shrink-0" />;
      case "wait": return <Clock className="h-4 w-4 flex-shrink-0" />;
      case "confirm": return <CheckCircle className="h-4 w-4 flex-shrink-0" />;
      default: return <ListChecks className="h-4 w-4 flex-shrink-0" />;
    }
  };

  const verifyRemovalMutation = useMutation({
    mutationFn: async ({ brokerId }: { brokerId: string }) => {
      const nameParts = guestName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const addressParts = guestAddress.trim().split(",").map(s => s.trim());
      const city = addressParts[0] || "";
      const state = addressParts[1] || "";
      const res = await apiRequest("POST", "/api/data-removal/verify-removal", {
        brokerId,
        firstName,
        lastName,
        city,
        state,
      });
      return res.json();
    },
    onSuccess: (data: any, variables: { brokerId: string }) => {
      setVerifyResults(prev => ({
        ...prev,
        [variables.brokerId]: data.stillListed ? "still_listed" : "not_found",
      }));
    },
    onError: (_error: Error, variables: { brokerId: string }) => {
      setVerifyResults(prev => ({
        ...prev,
        [variables.brokerId]: "error",
      }));
    },
  });

  const handleVerifyRemoval = (brokerId: string) => {
    setVerifyResults(prev => ({ ...prev, [brokerId]: "loading" }));
    verifyRemovalMutation.mutate({ brokerId });
  };

  const guestScanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/data-removal/guest-scan", {
        fullName: guestName,
        emails: guestEmail ? guestEmail.split(",").map((s) => s.trim()).filter(Boolean) : [],
        phoneNumbers: guestPhone ? guestPhone.split(",").map((s) => s.trim()).filter(Boolean) : [],
        currentAddress: guestAddress || "",
      });
      return res.json();
    },
    onSuccess: () => {
      trackToolUsage("data-broker-guest-scan", true);
    },
    onError: (error: Error) => {
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-guest-scan", false, { error: error.message });
    },
  });

  const result = guestScanMutation.data as {
    totalBrokersScanned: number;
    totalBrokersInCatalog: number;
    totalExposuresFound: number;
    confirmedExposures: number;
    profilesFound: number;
    verifiedBrokers: number;
    riskLevel: string;
    scanMethod?: string;
    searchTransparency?: {
      sitesSearched: number;
      profilesFound: number;
      notFound: number;
      blocked: number;
      failed: number;
      totalSearchable: number;
      notSearchable: number;
    } | null;
    breachSummary?: Array<{
      name: string;
      domain: string;
      breachDate: string;
      dataClasses: string[];
      pwnCount: number;
      isVerified: boolean;
    }>;
    findings: Array<{
      broker: DataBroker;
      dataTypesExposed: string[];
      exposureLevel: string;
      evidenceTier?: string;
      verificationMethod?: string;
      verificationDetails?: string;
      sourceEvidence?: string;
      evidenceSummary?: string;
      profileUrl?: string | null;
      matchScore?: number;
      confidenceLabel?: string | null;
      breachDetails?: {
        breachName: string;
        breachDate: string;
        dataClasses: string[];
        pwnCount: number;
        isVerified: boolean;
        description?: string;
      } | null;
      searchStatus?: string | null;
    }>;
  } | undefined;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            Find Your Profiles on Data Broker Sites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                placeholder="John Smith"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                data-testid="input-guest-name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                placeholder="john@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                data-testid="input-guest-email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                placeholder="(555) 123-4567"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                data-testid="input-guest-phone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">City/State</label>
              <Input
                placeholder="New York, NY"
                value={guestAddress}
                onChange={(e) => setGuestAddress(e.target.value)}
                data-testid="input-guest-address"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            Your information is not stored and is only used for this one-time check.
          </div>
          <Button
            onClick={() => guestScanMutation.mutate()}
            disabled={!guestName || guestScanMutation.isPending}
            data-testid="button-guest-scan"
          >
            {guestScanMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {guestScanMutation.isPending ? "Scanning..." : "Search for My Profiles"}
          </Button>

          {guestScanMutation.isPending && (
            <div className="p-4 rounded-md bg-muted/50 space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <p className="text-sm font-medium">Scanning 500+ data broker sites...</p>
                  <p className="text-xs text-muted-foreground">This typically takes 15-25 seconds. We're checking people-search sites, background check databases, and data aggregators for your information.</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-1.5 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {(() => {
            const confirmedFindings = result.findings.filter(f => f.evidenceTier === "confirmed");
            const profileFindings = result.findings.filter(f => f.evidenceTier === "profile_found");
            const brokerFindings = result.findings.filter(f => f.evidenceTier === "verified_broker");
            const directFindings = [...confirmedFindings, ...profileFindings];
            const totalExposed = result.findings.length;
            return (
              <>
                <Card>
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-4">
                      {totalExposed > 0 ? (
                        <div className="h-12 w-12 rounded-md bg-red-100 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                          <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-md bg-green-100 dark:bg-green-950/40 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                      <div>
                        <p className="text-lg font-semibold" data-testid="text-scan-headline">
                          {totalExposed > 0
                            ? `Your data is likely exposed on ${totalExposed} site${totalExposed !== 1 ? "s" : ""}`
                            : "No exposures found"}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid="text-scan-subline">
                          {totalExposed > 0
                            ? `We scanned ${result.totalBrokersScanned.toLocaleString()} data broker sites.${directFindings.length > 0 ? ` ${directFindings.length} confirmed match${directFindings.length !== 1 ? "es" : ""}.` : ""} ${brokerFindings.length > 0 ? `${brokerFindings.length} high-risk broker${brokerFindings.length !== 1 ? "s" : ""} likely have your data.` : ""}`
                            : `We searched ${result.totalBrokersScanned.toLocaleString()} data broker sites and didn't find exposures matching your information.`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {directFindings.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Confirmed Exposures
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {directFindings.map((finding, idx) => (
                        <div key={idx} className="p-4 border border-red-200 dark:border-red-900 rounded-md bg-red-50/30 dark:bg-red-950/10" data-testid={`profile-finding-${idx}`}>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{finding.broker.name}</span>
                              {(() => {
                                const cl = finding.confidenceLabel || (finding.evidenceTier === "confirmed" ? "Confirmed" : "Likely");
                                const badgeText = cl === "Very High" || cl === "Confirmed" ? "Data Exposed" : cl === "High" ? "Profile Detected" : "Name Found";
                                const colorClass = cl === "Very High" || cl === "Confirmed"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800"
                                  : cl === "High"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
                                return (
                                  <Badge className={`${colorClass} no-default-hover-elevate no-default-active-elevate`}>
                                    {badgeText}
                                  </Badge>
                                );
                              })()}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {walkthroughMap[finding.broker.id] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setWalkthroughDialogBrokerId(finding.broker.id)}
                                  data-testid={`button-how-to-remove-${idx}`}
                                >
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  How to Remove
                                </Button>
                              )}
                              {finding.profileUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={finding.profileUrl} target="_blank" rel="noopener noreferrer" data-testid={`link-view-profile-${idx}`}>
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View Profile
                                  </a>
                                </Button>
                              )}
                              <Button variant="outline" size="sm" asChild>
                                <a href={finding.broker.optOutUrl || `https://${finding.broker.domain}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Request Removal
                                </a>
                              </Button>
                              {user && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerifyRemoval(finding.broker.id)}
                                  disabled={verifyResults[finding.broker.id] === "loading"}
                                  data-testid={`button-verify-removal-${idx}`}
                                >
                                  {verifyResults[finding.broker.id] === "loading" ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <RotateCw className="h-3 w-3 mr-1" />
                                  )}
                                  Verify Removal
                                </Button>
                              )}
                            </div>
                          </div>
                          {verifyResults[finding.broker.id] && verifyResults[finding.broker.id] !== "loading" && (
                            <div className="mt-2" data-testid={`verify-result-${idx}`}>
                              {verifyResults[finding.broker.id] === "still_listed" && (
                                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Still listed
                                </div>
                              )}
                              {verifyResults[finding.broker.id] === "not_found" && (
                                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  No longer found
                                </div>
                              )}
                              {verifyResults[finding.broker.id] === "error" && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Verification failed
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {brokerFindings.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-orange-500" />
                        High-Risk Brokers Likely Holding Your Data
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        These data brokers are known to collect the types of information you provided. We recommend requesting removal from each one.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {brokerFindings.map((finding, idx) => (
                        <div key={`broker-${idx}`} className="p-4 border border-orange-200 dark:border-orange-900 rounded-md bg-orange-50/30 dark:bg-orange-950/10" data-testid={`broker-finding-${idx}`}>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{finding.broker.name}</span>
                              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800 no-default-hover-elevate no-default-active-elevate">
                                Likely Exposed
                              </Badge>
                              {finding.dataTypesExposed.length > 0 && (
                                <span className="text-xs text-muted-foreground">
                                  Collects: {finding.dataTypesExposed.join(", ")}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {walkthroughMap[finding.broker.id] && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setWalkthroughDialogBrokerId(finding.broker.id)}
                                >
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  How to Remove
                                </Button>
                              )}
                              <Button variant="outline" size="sm" asChild>
                                <a href={finding.broker.optOutUrl || `https://${finding.broker.domain}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Request Removal
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Card data-testid="card-remove-from-google">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
                        <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-semibold" data-testid="text-google-removal-title">Also Remove from Google Search</p>
                        <p className="text-sm text-muted-foreground" data-testid="text-google-removal-desc">
                          Even after removing your profiles from broker sites, old listings may still appear in Google search results. Use Google's "Results About You" tool to request removal of search results that contain your personal information.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="https://myactivity.google.com/results-about-you" target="_blank" rel="noopener noreferrer" data-testid="link-google-results-about-you">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open Results About You
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            );
          })()}

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <p className="text-sm text-muted-foreground">
                  Create an account to automatically send removal requests, track progress, and get re-scan alerts when your data reappears.
                </p>
                <Button asChild>
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Dialog open={!!walkthroughDialogBrokerId} onOpenChange={(open) => { if (!open) setWalkthroughDialogBrokerId(null); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" data-testid="dialog-walkthrough">
          {selectedWalkthrough && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap" data-testid="text-walkthrough-title">
                  <BookOpen className="h-5 w-5" />
                  {selectedWalkthrough.brokerName}
                </DialogTitle>
                <DialogDescription>Step-by-step removal instructions</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    className={`no-default-hover-elevate no-default-active-elevate ${
                      selectedWalkthrough.difficulty === "easy"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800"
                        : selectedWalkthrough.difficulty === "medium"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                        : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800"
                    }`}
                    data-testid="badge-walkthrough-difficulty"
                  >
                    {selectedWalkthrough.difficulty}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~{selectedWalkthrough.estimatedMinutes} min
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                  {selectedWalkthrough.requiresCaptcha && (
                    <span className="flex items-center gap-1" data-testid="text-requires-captcha">
                      <Shield className="h-3 w-3" /> CAPTCHA
                    </span>
                  )}
                  {selectedWalkthrough.requiresAccount && (
                    <span className="flex items-center gap-1" data-testid="text-requires-account">
                      <User className="h-3 w-3" /> Account Required
                    </span>
                  )}
                  {selectedWalkthrough.requiresId && (
                    <span className="flex items-center gap-1" data-testid="text-requires-id">
                      <Fingerprint className="h-3 w-3" /> ID Required
                    </span>
                  )}
                  {selectedWalkthrough.requiresPhone && (
                    <span className="flex items-center gap-1" data-testid="text-requires-phone">
                      <Phone className="h-3 w-3" /> Phone Required
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {selectedWalkthrough.steps.map((step) => (
                    <div key={step.stepNumber} className="flex items-start gap-3 p-3 rounded-md bg-muted/50" data-testid={`walkthrough-step-${step.stepNumber}`}>
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex-shrink-0 mt-0.5">
                        {step.stepNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {stepActionIcon(step.actionType)}
                          <span className="text-sm font-medium">{step.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        {step.url && (
                          <a href={step.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline mt-1 inline-block" data-testid={`walkthrough-step-link-${step.stepNumber}`}>
                            {step.url}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedWalkthrough.tips.length > 0 && (
                  <div className="p-3 rounded-md bg-muted/50 space-y-2" data-testid="walkthrough-tips">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Info className="h-4 w-4" /> Tips
                    </p>
                    <ul className="space-y-1">
                      {selectedWalkthrough.tips.map((tip, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedWalkthrough.optOutUrl && (
                  <Button variant="outline" size="sm" asChild className="w-full">
                    <a href={selectedWalkthrough.optOutUrl} target="_blank" rel="noopener noreferrer" data-testid="link-walkthrough-optout">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Go to Opt-Out Page
                    </a>
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}