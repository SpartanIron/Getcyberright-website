import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { trackToolUsage } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Trash2,
  CheckCircle2,
  Eye,
  Clock,
  Loader2,
  Send,
} from "lucide-react";

import type { VaultProfile, ScanResult, ScanFinding } from "@/components/data-removal/types";
import { formatDate } from "@/components/data-removal/utils";
import { GuestScanForm } from "@/components/data-removal/guest-scan";

export function ScanResults() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedScanId, setSelectedScanId] = useState<string | null>(null);
  const [selectedFindings, setSelectedFindings] = useState<Set<string>>(new Set());

  const handleSelectScan = (scanId: string) => {
    setSelectedScanId(scanId);
    setSelectedFindings(new Set());
  };

  const { data: vaultData } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  const { data: scansData, isLoading: scansLoading } = useQuery<{ scans: ScanResult[] }>({
    queryKey: ["/api/data-removal/scans"],
    enabled: isAuthenticated,
  });

  const { data: findingsData, isLoading: findingsLoading } = useQuery<{ findings: ScanFinding[] }>({
    queryKey: ["/api/data-removal/findings", selectedScanId],
    enabled: !!selectedScanId,
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/data-removal/scan", {
        vaultProfileId: vaultData?.id,
      });
      return res.json();
    },
    onSuccess: (data: { scan?: ScanResult }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/scans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      if (data.scan?.id) handleSelectScan(data.scan.id);
      toast({ title: "Scan Started", description: "Your privacy scan is now running." });
      trackToolUsage("data-broker-exposure-scan", true, { scanId: data.scan?.id });
    },
    onError: (error: Error) => {
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-exposure-scan", false, { error: error.message });
    },
  });

  const removalMutation = useMutation({
    mutationFn: async ({ brokerId, findingId, autoSend }: { brokerId: string; findingId?: string; autoSend?: boolean }) => {
      const res = await apiRequest("POST", "/api/data-removal/requests", {
        brokerId,
        vaultProfileId: vaultData?.id,
        findingId,
      });
      const request = await res.json();
      if (autoSend && request.id) {
        const sendRes = await apiRequest("POST", `/api/data-removal/requests/${request.id}/auto-send`);
        return sendRes.json();
      }
      return request;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      if (data.method) {
        toast({
          title: data.success ? "Removal Request Sent" : "Action Required",
          description: data.message,
        });
      } else {
        toast({ title: "Removal Requested", description: "A data removal request has been submitted." });
      }
      trackToolUsage("data-broker-removal-request", true);
    },
    onError: (error: Error) => {
      toast({ title: "Request Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-removal-request", false, { error: error.message });
    },
  });

  const bulkCreateAndSendMutation = useMutation({
    mutationFn: async (findingsList: Array<{ brokerId: string; findingId: string }>) => {
      const res = await apiRequest("POST", "/api/data-removal/requests/bulk-create-and-send", {
        findings: findingsList,
        vaultProfileId: vaultData?.id,
      });
      return res.json();
    },
    onSuccess: (data: { results: Array<{ brokerId: string; success: boolean; message: string }> }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/findings", selectedScanId] });
      const succeeded = data.results.filter((r) => r.success).length;
      const failed = data.results.filter((r) => !r.success).length;
      toast({
        title: "Bulk Removal Complete",
        description: `${succeeded} sent successfully${failed > 0 ? `, ${failed} need manual action` : ""}`,
      });
      setSelectedFindings(new Set());
      trackToolUsage("data-broker-bulk-create-send", true, { succeeded, failed, total: data.results.length });
    },
    onError: (error: Error) => {
      toast({ title: "Bulk Removal Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-bulk-create-send", false, { error: error.message });
    },
  });

  const toggleFinding = (findingId: string) => {
    setSelectedFindings((prev) => {
      const next = new Set(prev);
      if (next.has(findingId)) next.delete(findingId);
      else next.add(findingId);
      return next;
    });
  };

  const toggleAllFindings = () => {
    if (selectedFindings.size === findings.length) {
      setSelectedFindings(new Set());
    } else {
      setSelectedFindings(new Set(findings.map((f) => f.id)));
    }
  };

  if (!isAuthenticated) {
    return <GuestScanForm />;
  }

  if (!vaultData) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Set Up Your Vault First</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Add your personal information to the vault before running a scan. We use your email to check for breaches.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const scans = scansData?.scans || [];
  const findings = findingsData?.findings || [];
  const latestScan = scans[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Exposure Scan
            </CardTitle>
            <CardDescription>
              Check for confirmed breaches and verify which data broker sites are currently active.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              data-testid="button-run-scan"
              onClick={() => scanMutation.mutate()}
              disabled={scanMutation.isPending}
            >
              {scanMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {scanMutation.isPending ? "Scanning..." : "Run New Scan"}
            </Button>

            {scanMutation.isPending && (
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

            {latestScan && (
              <div className="flex items-center gap-6 p-4 rounded-md bg-muted/30">
                <div className="text-center">
                  <div className="text-2xl font-bold">{latestScan.totalExposures}</div>
                  <p className="text-xs text-muted-foreground">findings</p>
                </div>
                <div>
                  <p className="font-medium">Latest Scan Results</p>
                  <p className="text-sm text-muted-foreground">
                    {latestScan.totalExposures} finding{latestScan.totalExposures !== 1 ? "s" : ""} across {latestScan.totalBrokersScanned} brokers checked
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {latestScan.completedAt ? formatDate(latestScan.completedAt) : formatDate(latestScan.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {selectedScanId && (<div role="region" aria-label="Scan findings" aria-live="polite">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Scan Findings
              </CardTitle>
              {findings.length > 0 && (
                <CardDescription>
                  Select findings to submit removal requests in bulk, or handle them individually.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {findingsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : findings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500 opacity-70" />
                  <p className="text-muted-foreground">No findings in this scan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/30 flex-wrap">
                    <label
                      className="flex items-center gap-2 cursor-pointer select-none"
                      data-testid="checkbox-select-all-findings"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFindings.size === findings.length && findings.length > 0}
                        onChange={toggleAllFindings}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      <span className="text-sm font-medium">
                        {selectedFindings.size === findings.length ? "Deselect All" : "Select All"} ({findings.length} finding{findings.length !== 1 ? "s" : ""})
                      </span>
                    </label>
                    {selectedFindings.size > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedFindings.size} selected
                        </span>
                        <Button
                          size="sm"
                          data-testid="button-bulk-auto-send-findings"
                          onClick={() => {
                            const selected = findings
                              .filter((f) => selectedFindings.has(f.id))
                              .map((f) => ({ brokerId: f.brokerId, findingId: f.id }));
                            bulkCreateAndSendMutation.mutate(selected);
                          }}
                          disabled={bulkCreateAndSendMutation.isPending}
                        >
                          {bulkCreateAndSendMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-1" />
                          )}
                          Auto-Send {selectedFindings.size} Selected
                        </Button>
                      </div>
                    )}
                  </div>
                  {findings.map((finding) => (
                    <div
                      key={finding.id}
                      className={`flex items-start gap-3 p-4 rounded-md border ${selectedFindings.has(finding.id) ? "border-primary/50 bg-primary/5" : ""}`}
                    >
                      <label className="flex items-center pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFindings.has(finding.id)}
                          onChange={() => toggleFinding(finding.id)}
                          data-testid={`checkbox-finding-${finding.id}`}
                          className="h-4 w-4 rounded border-border accent-primary"
                        />
                      </label>
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{finding.broker?.name || "Unknown Broker"}</p>
                          {finding.verificationMethod === "breach_confirmed" ? (
                            <Badge variant="destructive">Breach Confirmed</Badge>
                          ) : finding.verificationMethod === "profile_discovered" ? (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800 no-default-hover-elevate no-default-active-elevate">
                              Profile Found
                            </Badge>
                          ) : finding.verificationMethod === "broker_verified_active" ? (
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800 no-default-hover-elevate no-default-active-elevate">
                              Active Broker
                            </Badge>
                          ) : null}
                          {finding.broker?.category && (
                            <Badge variant="secondary">{finding.broker.category}</Badge>
                          )}
                        </div>
                        {(finding.dataTypesExposed || finding.dataTypesFound) && (finding.dataTypesExposed || finding.dataTypesFound)!.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {finding.verificationMethod === "breach_confirmed" ? "Data in breach:" : "Broker collects:"} {(finding.dataTypesExposed || finding.dataTypesFound)!.join(", ")}
                          </p>
                        )}
                        {finding.verificationDetails && (
                          <p className="text-xs text-muted-foreground bg-muted/50 p-1.5 rounded-md mt-1">
                            {finding.verificationDetails}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          data-testid={`button-request-removal-${finding.brokerId}`}
                          onClick={() =>
                            removalMutation.mutate({
                              brokerId: finding.brokerId,
                              findingId: finding.id,
                            })
                          }
                          disabled={removalMutation.isPending}
                        >
                          {removalMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          Request
                        </Button>
                        <Button
                          size="sm"
                          data-testid={`button-auto-send-removal-${finding.brokerId}`}
                          onClick={() =>
                            removalMutation.mutate({
                              brokerId: finding.brokerId,
                              findingId: finding.id,
                              autoSend: true,
                            })
                          }
                          disabled={removalMutation.isPending}
                        >
                          {removalMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-1" />
                          )}
                          Auto-Send
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>)}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scan History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {scansLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : scans.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No scans yet. Run your first scan above.
              </p>
            ) : (
              <div className="space-y-2">
                {scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-md hover-elevate cursor-pointer"
                    onClick={() => handleSelectScan(scan.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-primary/10">
                        <Search className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          Scan - {formatDate(scan.createdAt)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {scan.totalExposures ?? 0} finding{(scan.totalExposures ?? 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {scan.totalExposures != null && (
                        <Badge variant={scan.totalExposures === 0 ? "default" : scan.totalExposures > 10 ? "destructive" : "outline"}>
                          {scan.totalExposures} finding{scan.totalExposures !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      <Badge variant={scan.status === "completed" ? "default" : "secondary"}>
                        {scan.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
