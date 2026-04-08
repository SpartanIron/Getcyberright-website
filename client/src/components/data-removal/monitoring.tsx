"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Bell,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import type { VaultProfile } from "@/components/data-removal/types";
import { formatDate, getStatusVariant } from "@/components/data-removal/utils";

export function MonitoringPanel() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [showSetup, setShowSetup] = useState(false);
  const [frequency, setFrequency] = useState("30");
  const [autoReRemoval, setAutoReRemoval] = useState(true);
  const [darkWebMonitoring, setDarkWebMonitoring] = useState(false);

  const { data: vaultData } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  const { data: monitoringData } = useQuery<{
    id: string;
    frequencyDays: number | null;
    nextScanDate: string | null;
    lastScanDate: string | null;
    lastRunStatus: string | null;
    totalReappearances: number | null;
    totalScansCompleted: number | null;
    autoReRemoval: boolean | null;
    monitoringMode: string | null;
    darkWebMonitoring: boolean | null;
    isActive: boolean | null;
  } | null>({
    queryKey: ["/api/data-removal/monitoring"],
    enabled: isAuthenticated,
  });

  const setupMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/data-removal/monitoring", {
        vaultProfileId: vaultData?.id,
        frequencyDays: parseInt(frequency),
        autoReRemoval,
        notifyOnNewExposure: true,
        notifyOnReAppearance: true,
        notifyOnComplianceDeadline: true,
        monitoringMode: "periodic",
        darkWebMonitoring,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/monitoring"] });
      toast({ title: "Monitoring Activated", description: "Continuous monitoring has been set up for your profile." });
      setShowSetup(false);
    },
    onError: (error: Error) => {
      toast({ title: "Setup Failed", description: error.message, variant: "destructive" });
    },
  });

  const runScanMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/data-removal/monitoring/run");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/monitoring"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({ title: "Monitoring Scan Complete", description: "Re-scan completed successfully." });
    },
    onError: (error: Error) => {
      toast({ title: "Scan Failed", description: error.message, variant: "destructive" });
    },
  });

  if (!isAuthenticated) return null;

  if (!monitoringData) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card data-testid="card-monitoring-setup">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Continuous Monitoring
            </CardTitle>
            <CardDescription>
              Set up automatic re-scanning to detect when removed data reappears on broker sites
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showSetup ? (
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="p-4 rounded-full bg-primary/10">
                  <RefreshCw className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Enable continuous monitoring to automatically detect when data brokers re-list your personal information after removal.
                </p>
                <Button onClick={() => setShowSetup(true)} disabled={!vaultData} data-testid="button-setup-monitoring">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Up Monitoring
                </Button>
                {!vaultData && (
                  <p className="text-xs text-muted-foreground">Set up your privacy vault first to enable monitoring.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scan Frequency</label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger data-testid="select-monitoring-frequency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Weekly (every 7 days)</SelectItem>
                      <SelectItem value="14">Bi-weekly (every 14 days)</SelectItem>
                      <SelectItem value="30">Monthly (every 30 days)</SelectItem>
                      <SelectItem value="90">Quarterly (every 90 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer" data-testid="toggle-auto-reremoval">
                    <input type="checkbox" checked={autoReRemoval} onChange={(e) => setAutoReRemoval(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                    <div>
                      <p className="text-sm font-medium">Auto Re-Removal</p>
                      <p className="text-xs text-muted-foreground">Automatically send removal requests when re-appearances are detected</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer" data-testid="toggle-dark-web-monitoring">
                    <input type="checkbox" checked={darkWebMonitoring} onChange={(e) => setDarkWebMonitoring(e.target.checked)} className="h-4 w-4 rounded border-border accent-primary" />
                    <div>
                      <p className="text-sm font-medium">Dark Web Monitoring</p>
                      <p className="text-xs text-muted-foreground">Check if your data appears on dark web marketplaces</p>
                    </div>
                  </label>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setupMutation.mutate()} disabled={setupMutation.isPending} data-testid="button-activate-monitoring">
                    {setupMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                    Activate Monitoring
                  </Button>
                  <Button variant="outline" onClick={() => setShowSetup(false)}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const schedule = monitoringData;
  const frequencyLabel = (days: number | null) => {
    if (!days) return "Not set";
    if (days <= 1) return "Daily";
    if (days <= 7) return "Weekly";
    if (days <= 14) return "Bi-weekly";
    if (days <= 30) return "Monthly";
    if (days <= 90) return "Quarterly";
    return `Every ${days} days`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card data-testid="card-monitoring-panel">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Continuous Monitoring
          </CardTitle>
          <CardDescription>
            Real-time exposure detection with automatic re-removal triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 rounded-md bg-muted/50 space-y-1">
              <p className="text-xs text-muted-foreground">Scan Frequency</p>
              <p className="font-medium" data-testid="text-scan-frequency">{frequencyLabel(schedule.frequencyDays)}</p>
            </div>
            <div className="p-3 rounded-md bg-muted/50 space-y-1">
              <p className="text-xs text-muted-foreground">Next Scan</p>
              <p className="font-medium" data-testid="text-next-scan">
                {schedule.nextScanDate ? formatDate(schedule.nextScanDate) : "Not scheduled"}
              </p>
            </div>
            <div className="p-3 rounded-md bg-muted/50 space-y-1">
              <p className="text-xs text-muted-foreground">Total Scans Run</p>
              <p className="font-medium" data-testid="text-total-scans-run">{schedule.totalScansCompleted ?? 0}</p>
            </div>
            <div className="p-3 rounded-md bg-muted/50 space-y-1">
              <p className="text-xs text-muted-foreground">Re-appearances Detected</p>
              <p className="font-medium" data-testid="text-reappearances">{schedule.totalReappearances ?? 0}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-2.5 rounded-md border" data-testid="status-auto-reremoval">
              <div className={`h-2.5 w-2.5 rounded-full ${schedule.autoReRemoval ? "bg-green-500" : "bg-muted-foreground/30"}`} />
              <span className="text-sm">Auto Re-Removal</span>
              <Badge variant={schedule.autoReRemoval ? "default" : "outline"} className="ml-auto">
                {schedule.autoReRemoval ? "Active" : "Off"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-md border" data-testid="status-monitoring-mode">
              <div className={`h-2.5 w-2.5 rounded-full ${schedule.monitoringMode === "continuous" ? "bg-green-500" : "bg-muted-foreground/30"}`} />
              <span className="text-sm">Mode</span>
              <Badge variant="outline" className="ml-auto capitalize">
                {schedule.monitoringMode || "Periodic"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-md border" data-testid="status-dark-web-monitoring">
              <div className={`h-2.5 w-2.5 rounded-full ${schedule.darkWebMonitoring ? "bg-green-500" : "bg-muted-foreground/30"}`} />
              <span className="text-sm">Dark Web Monitoring</span>
              <Badge variant={schedule.darkWebMonitoring ? "default" : "outline"} className="ml-auto">
                {schedule.darkWebMonitoring ? "Active" : "Off"}
              </Badge>
            </div>
          </div>

          {schedule.lastRunStatus && (
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Last scan:</span>
              <Badge variant={schedule.lastRunStatus === "success" ? "default" : schedule.lastRunStatus === "failed" ? "destructive" : "outline"}>
                {schedule.lastRunStatus}
              </Badge>
              {schedule.lastScanDate && <span>{formatDate(schedule.lastScanDate)}</span>}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => runScanMutation.mutate()} disabled={runScanMutation.isPending} data-testid="button-run-monitoring-scan">
              {runScanMutation.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
              Run Scan Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ComplianceTracker() {
  const { isAuthenticated } = useAuth();

  const { data: complianceData } = useQuery<{
    totalRequests: number;
    compliant: number;
    pendingCompliance: number;
    overdueCount: number;
    nonCompliantCount: number;
    complianceRate: number;
    overdueRate: number;
    avgResponseDays: number;
    jurisdictionStats: Record<string, { total: number; compliant: number; overdue: number }>;
    overdueRequests: Array<{ requestId: string; brokerId: string; daysPastDeadline: number; jurisdiction: string }>;
    regulatoryFrameworks: Array<{ name: string; deadlineDays: number; description: string; region: string }>;
  }>({
    queryKey: ["/api/data-removal/compliance"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !complianceData || complianceData.totalRequests === 0) return null;

  const data = complianceData;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <Card data-testid="card-compliance-tracker">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Regulatory Compliance Tracker
          </CardTitle>
          <CardDescription>
            CCPA/GDPR compliance monitoring with deadline enforcement and non-compliance flagging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold text-primary" data-testid="text-compliance-rate">{data.complianceRate}%</p>
              <p className="text-xs text-muted-foreground">Compliance Rate</p>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold" data-testid="text-compliant-count">{data.compliant}</p>
              <p className="text-xs text-muted-foreground">Confirmed Removals</p>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold" data-testid="text-pending-compliance">{data.pendingCompliance}</p>
              <p className="text-xs text-muted-foreground">Awaiting Response</p>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className={`text-2xl font-bold ${data.overdueCount > 0 ? "text-destructive" : ""}`} data-testid="text-overdue-count">
                {data.overdueCount}
              </p>
              <p className="text-xs text-muted-foreground">Overdue</p>
            </div>
          </div>

          {data.avgResponseDays > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-muted/30">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">Average broker response time: <strong>{data.avgResponseDays} days</strong></span>
            </div>
          )}

          {Object.keys(data.jurisdictionStats).length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">By Legal Framework</p>
              <div className="space-y-2">
                {Object.entries(data.jurisdictionStats).map(([jurisdiction, stats]) => (
                  <div key={jurisdiction} className="flex items-center gap-3 text-sm">
                    <Badge variant="outline" className="w-16 justify-center">{jurisdiction}</Badge>
                    <div className="flex-1">
                      <Progress value={stats.total > 0 ? (stats.compliant / stats.total) * 100 : 0} className="h-2" />
                    </div>
                    <span className="text-muted-foreground w-24 text-right">
                      {stats.compliant}/{stats.total} compliant
                    </span>
                    {stats.overdue > 0 && (
                      <Badge variant="destructive">{stats.overdue} overdue</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.overdueRequests.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Non-Compliant Brokers
              </p>
              <div className="space-y-1.5">
                {data.overdueRequests.slice(0, 5).map((req) => (
                  <div key={req.requestId} className="flex items-center justify-between gap-2 p-2 rounded-md bg-destructive/5 dark:bg-destructive/10 text-sm">
                    <span className="font-medium">{req.brokerId}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{req.jurisdiction}</Badge>
                      <Badge variant="destructive">{req.daysPastDeadline} days overdue</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-2">Supported Regulatory Frameworks</p>
            <div className="flex flex-wrap gap-2">
              {data.regulatoryFrameworks.map((fw) => (
                <div key={fw.name} className="flex items-center gap-1.5 p-1.5 rounded-md border text-xs">
                  <Badge variant="secondary">{fw.name}</Badge>
                  <span className="text-muted-foreground">{fw.deadlineDays}d deadline</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
