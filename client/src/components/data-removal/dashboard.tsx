"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  BarChart3,
  Globe,
  Calendar,
  ShieldCheck,
  Send,
  CheckCircle,
  Activity,
  Target,
  Gauge,
  Fingerprint,
  Eye,
  ChevronDown,
  FileText,
} from "lucide-react";
import type { DashboardStats, VaultProfile, SmartQueueItem, DataBroker } from "@/components/data-removal/types";
import { formatDate, getRiskVariant, getStatusVariant } from "@/components/data-removal/utils";
import { GuestScanForm } from "@/components/data-removal/guest-scan";

function IdentityRiskScoreCard({ scanId }: { scanId?: string }) {
  const { isAuthenticated } = useAuth();

  const { data: automationData, isLoading, isError } = useQuery<{
    scan_id: string;
    identity_risk_score: number | null;
    total_brokers: number;
    total_findings: number;
    brokers: Array<{
      broker: string;
      brokerId: string;
      domain: string;
      category: string;
      opt_out_url: string | null;
      method: string;
      verification_needed: string[];
      removal_eta_days: number;
      reappearance_risk: string;
      reappearance_risk_percentage: number;
      compliance_notes: string;
      exposure_likelihood: number;
      tos_risk: { level: string; flags: string[] };
    }>;
  }>({
    queryKey: [`/api/data-removal/automation/${scanId}`],
    enabled: isAuthenticated && !!scanId,
  });

  if (!scanId) return null;

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <Card data-testid="card-identity-risk-score-loading">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Identity Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isError || !automationData) return null;

  const riskScore = automationData.identity_risk_score ?? 0;
  const riskColor = riskScore >= 70 ? "text-red-600 dark:text-red-400" : riskScore >= 40 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400";
  const riskLabel = riskScore >= 70 ? "High Risk" : riskScore >= 40 ? "Moderate Risk" : "Low Risk";
  const riskBg = riskScore >= 70 ? "bg-red-500" : riskScore >= 40 ? "bg-orange-500" : "bg-green-500";

  const highRiskBrokers = automationData.brokers.filter(b => b.exposure_likelihood >= 60);
  const needsIdVerification = automationData.brokers.filter(b => b.verification_needed.some(v => v.includes("photo ID")));
  const highReappearance = automationData.brokers.filter(b => b.reappearance_risk === "high");

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
      <Card data-testid="card-identity-risk-score">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Identity Risk Score
          </CardTitle>
          <CardDescription>Unified risk assessment combining breach data, broker listings, and data sensitivity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="6" strokeLinecap="round" className={riskBg} style={{ strokeDasharray: `${(riskScore / 100) * 264} 264`, opacity: 0.9 }} stroke="currentColor" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-2xl font-bold ${riskColor}`} data-testid="text-risk-score">{riskScore}</span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className={`text-lg font-semibold ${riskColor}`} data-testid="text-risk-label">{riskLabel}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on {automationData.total_findings} finding{automationData.total_findings !== 1 ? "s" : ""} across {automationData.total_brokers} broker{automationData.total_brokers !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {(highRiskBrokers.length > 0 || needsIdVerification.length > 0 || highReappearance.length > 0) && (
            <div className="space-y-2">
              {highRiskBrokers.length > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 dark:bg-destructive/20" data-testid="alert-high-risk-brokers">
                  <Target className="h-4 w-4 text-destructive flex-shrink-0" />
                  <span className="text-sm">{highRiskBrokers.length} broker{highRiskBrokers.length !== 1 ? "s" : ""} with high exposure likelihood</span>
                </div>
              )}
              {needsIdVerification.length > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted" data-testid="alert-id-verification">
                  <Fingerprint className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{needsIdVerification.length} broker{needsIdVerification.length !== 1 ? "s" : ""} require ID verification (review ToS risk flags)</span>
                </div>
              )}
              {highReappearance.length > 0 && (
                <div className="flex items-center gap-2 p-2 rounded-md bg-muted" data-testid="alert-high-reappearance">
                  <RefreshCw className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{highReappearance.length} broker{highReappearance.length !== 1 ? "s" : ""} with high re-listing risk</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SmartRemovalQueue() {
  const { isAuthenticated } = useAuth();

  const { data: queueData, isLoading } = useQuery<{ queue: SmartQueueItem[]; total: number }>({
    queryKey: ["/api/data-removal/smart-queue"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card data-testid="card-smart-queue-loading">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Smart Removal Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!queueData || queueData.total === 0) return null;

  const topItems = queueData.queue.slice(0, 5);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <Card data-testid="card-smart-removal-queue">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Smart Removal Queue
          </CardTitle>
          <CardDescription>AI-prioritized removal recommendations based on risk level, success rate, and automation feasibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topItems.map((item, idx) => (
              <div key={item.broker.id} className="flex items-center gap-3 p-3 rounded-md bg-muted/50" data-testid={`queue-item-${item.broker.id}`}>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{item.broker.name}</span>
                    <Badge variant={getRiskVariant(item.broker.riskLevel)}>{item.broker.riskLevel || "medium"}</Badge>
                    <Badge variant="outline">{item.recommendedMethod}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.priorityReason}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-bold">{item.priorityScore}</div>
                  <div className="text-xs text-muted-foreground">priority</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm">{item.estimatedSuccessRate}%</div>
                  <div className="text-xs text-muted-foreground">success</div>
                </div>
              </div>
            ))}
          </div>
          {queueData.total > 5 && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Showing top 5 of {queueData.total} pending removals
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RemovalTimeline() {
  const { isAuthenticated } = useAuth();
  const { data: auditData } = useQuery<Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    previousState: string | null;
    newState: string | null;
    createdAt: string;
  }>>({
    queryKey: ["/api/data-removal/audit-log"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !auditData || auditData.length === 0) return null;

  const recentEvents = auditData.slice(0, 8);
  const actionIcon = (action: string) => {
    if (action.includes("sent") || action.includes("submit")) return <Send className="h-3.5 w-3.5" />;
    if (action.includes("removed") || action.includes("confirmed") || action.includes("completed")) return <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />;
    if (action.includes("failed") || action.includes("error")) return <AlertTriangle className="h-3.5 w-3.5 text-destructive" />;
    if (action.includes("scan") || action.includes("search")) return <Search className="h-3.5 w-3.5" />;
    if (action.includes("created") || action.includes("request")) return <FileText className="h-3.5 w-3.5" />;
    if (action.includes("re_appeared") || action.includes("reappear")) return <RefreshCw className="h-3.5 w-3.5 text-destructive" />;
    return <Activity className="h-3.5 w-3.5" />;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
      <Card data-testid="card-removal-timeline">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Timeline of your data removal actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 relative pl-9" data-testid={`timeline-event-${event.id}`}>
                  <div className="absolute left-2 top-1 p-1 rounded-full bg-background border">
                    {actionIcon(event.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium capitalize">{event.action.replace(/_/g, " ")}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {event.newState && (
                        <Badge variant="outline" className="text-[10px]">{event.newState.replace(/_/g, " ")}</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TransparencyDashboard() {
  const { isAuthenticated } = useAuth();

  const { data: auditData } = useQuery<Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    previousState: string | null;
    newState: string | null;
    createdAt: string;
  }>>({
    queryKey: ["/api/data-removal/audit-log"],
    enabled: isAuthenticated,
  });

  const { data: dashboardData } = useQuery<DashboardStats>({
    queryKey: ["/api/data-removal/dashboard"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) return null;

  const logs = auditData || [];
  const stats = dashboardData;

  if (logs.length === 0 && (!stats || stats.totalExposures === 0)) return null;

  const removalTimeline = logs
    .filter((l) => l.action === "status_change" || l.action === "removal_request_created" || l.action === "monitoring_scan_completed")
    .slice(0, 10);

  const completedRemovals = logs.filter((l) => l.newState === "confirmed_removed").length;
  const totalActions = logs.length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
      <Card data-testid="card-transparency-dashboard">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Transparency & Audit Trail
          </CardTitle>
          <CardDescription>
            Full visibility into every action taken to protect your privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold" data-testid="text-total-actions">{totalActions}</p>
              <p className="text-xs text-muted-foreground">Total Actions Logged</p>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold text-primary" data-testid="text-verified-removals">{completedRemovals}</p>
              <p className="text-xs text-muted-foreground">Verified Removals</p>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold" data-testid="text-transparency-scans">{stats?.totalScans ?? 0}</p>
              <p className="text-xs text-muted-foreground">Scans Completed</p>
            </div>
            <div className="text-center p-3 rounded-md bg-muted/50">
              <p className="text-2xl font-bold" data-testid="text-transparency-success-rate">{stats?.successRate ?? 0}%</p>
              <p className="text-xs text-muted-foreground">Success Rate</p>
            </div>
          </div>

          {removalTimeline.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-3">Recent Activity Timeline</p>
              <div className="space-y-0">
                {removalTimeline.map((log, i) => (
                  <div key={log.id} className="flex items-start gap-3 pb-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        log.newState === "confirmed_removed" ? "bg-green-500" :
                        log.action === "monitoring_scan_completed" ? "bg-blue-500" :
                        log.newState === "failed" ? "bg-destructive" :
                        "bg-primary"
                      }`} />
                      {i < removalTimeline.length - 1 && <div className="w-px h-full bg-border min-h-[16px]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {log.action === "status_change" ? "Status Updated" :
                           log.action === "removal_request_created" ? "Removal Requested" :
                           log.action === "monitoring_scan_completed" ? "Monitoring Scan" :
                           log.action.replace(/_/g, " ")}
                        </span>
                        {log.newState && (
                          <Badge variant={getStatusVariant(log.newState)}>
                            {log.newState.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(log.createdAt)}
                        {log.entityId && <span className="ml-1">({log.entityType}: {log.entityId.slice(0, 8)}...)</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-md bg-muted/30 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Every scan, removal request, status change, and compliance action is permanently logged with timestamps.
                This audit trail provides verifiable proof of all privacy protection activities taken on your behalf.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const competitors = [
  { name: "DeleteMe", brokers: 84, monitoring: 30, discovery: 20, regulatory: 40, transparency: 60 },
  { name: "Incogni", brokers: 420, monitoring: 50, discovery: 40, regulatory: 70, transparency: 55 },
  { name: "OneRep", brokers: 230, monitoring: 50, discovery: 25, regulatory: 40, transparency: 55 },
  { name: "Optery", brokers: 200, monitoring: 60, discovery: 40, regulatory: 40, transparency: 75 },
  { name: "PrivacyBee", brokers: 300, monitoring: 45, discovery: 40, regulatory: 40, transparency: 40 },
  { name: "Kanary", brokers: 300, monitoring: 70, discovery: 40, regulatory: 40, transparency: 45 },
  { name: "GetCyberRight", brokers: 501, monitoring: 90, discovery: 85, regulatory: 80, transparency: 90 },
];

const capabilityLabels: Record<string, { label: string; description: string }> = {
  brokers: { label: "Automated Brokers", description: "Number of data broker sites covered by automated removal" },
  monitoring: { label: "Continuous Monitoring", description: "Real-time vs. periodic detection of new exposures" },
  discovery: { label: "Broker Discovery", description: "AI-driven identification of new and emerging data brokers" },
  regulatory: { label: "Regulatory Automation", description: "CCPA/GDPR compliance tracking with deadline enforcement" },
  transparency: { label: "Transparency & Proof", description: "Evidence-based removal reporting with full audit trails" },
};

function CompetitiveComparison() {
  const [expanded, setExpanded] = useState(false);

  const gcr = competitors.find((c) => c.name === "GetCyberRight")!;
  const others = competitors.filter((c) => c.name !== "GetCyberRight");
  const capabilities = ["brokers", "monitoring", "discovery", "regulatory", "transparency"] as const;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
      <Card data-testid="card-competitive-comparison">
        <CardHeader>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Industry Comparison
              </CardTitle>
              <CardDescription>How GetCyberRight compares to leading data removal services</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              data-testid="button-toggle-comparison"
            >
              {expanded ? "Summary View" : "Full Comparison"}
              <ChevronDown className={`h-4 w-4 ml-1.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!expanded ? (
            <div className="space-y-5">
              {capabilities.map((cap) => {
                const info = capabilityLabels[cap];
                const gcrValue = cap === "brokers" ? gcr.brokers : gcr[cap];
                const maxOther = Math.max(...others.map((o) => (cap === "brokers" ? o.brokers : o[cap])));
                const maxVal = cap === "brokers" ? Math.max(gcr.brokers, maxOther) : 100;
                const gcrPct = cap === "brokers" ? (gcr.brokers / (maxVal * 1.1)) * 100 : gcrValue;
                const bestOtherPct = cap === "brokers" ? (maxOther / (maxVal * 1.1)) * 100 : maxOther;

                return (
                  <div key={cap} data-testid={`comparison-${cap}`}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-medium">{info.label}</span>
                      <span className="text-xs text-muted-foreground">{info.description}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-28 text-right font-medium text-primary">GetCyberRight</span>
                        <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm bg-primary transition-all duration-700"
                            style={{ width: `${gcrPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold w-12 text-right" data-testid={`value-gcr-${cap}`}>
                          {cap === "brokers" ? `${gcrValue}+` : `${gcrValue}%`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-28 text-right text-muted-foreground">Best Competitor</span>
                        <div className="flex-1 h-5 bg-muted rounded-sm overflow-hidden">
                          <div
                            className="h-full rounded-sm bg-muted-foreground/30 transition-all duration-700"
                            style={{ width: `${bestOtherPct}%` }}
                          />
                        </div>
                        <span className="text-xs w-12 text-right text-muted-foreground">
                          {cap === "brokers" ? `${maxOther}` : `${maxOther}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground pt-2">
                Based on publicly verified data and independent research. Competitor figures represent automated coverage on standard plans.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" data-testid="table-full-comparison">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 pr-4 font-medium">Service</th>
                    {capabilities.map((cap) => (
                      <th key={cap} className="text-center py-2 px-2 font-medium">{capabilityLabels[cap].label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[gcr, ...others].map((comp) => {
                    const isGCR = comp.name === "GetCyberRight";
                    return (
                      <tr
                        key={comp.name}
                        className={`border-b last:border-b-0 ${isGCR ? "bg-primary/5 dark:bg-primary/10" : ""}`}
                        data-testid={`row-${comp.name.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <td className={`py-2.5 pr-4 font-medium ${isGCR ? "text-primary" : ""}`}>
                          {comp.name}
                          {isGCR && <Badge variant="default" className="ml-2 text-[10px]">You</Badge>}
                        </td>
                        {capabilities.map((cap) => {
                          const val = cap === "brokers" ? comp.brokers : comp[cap];
                          const best = cap === "brokers"
                            ? Math.max(...competitors.map((c) => c.brokers))
                            : Math.max(...competitors.map((c) => c[cap]));
                          const isBest = val === best;
                          return (
                            <td key={cap} className="text-center py-2.5 px-2">
                              <span className={`inline-flex items-center gap-1 ${isBest ? "font-bold text-primary" : "text-muted-foreground"}`}>
                                {cap === "brokers" ? `${val}+` : `${val}%`}
                                {isBest && <CheckCircle2 className="h-3 w-3" />}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground pt-3">
                Sources: Independent academic research, company disclosures, and verified test results. Scores for monitoring, discovery, regulatory, and transparency reflect capability depth (0-100%).
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function Dashboard() {
  const { isAuthenticated } = useAuth();
  const { data: dashboardData, isLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/data-removal/dashboard"],
    enabled: isAuthenticated,
  });

  const { data: vaultData } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  const { data: scansData } = useQuery<any[]>({
    queryKey: ["/api/data-removal/scans"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return <GuestScanForm />;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-10 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <Skeleton className="h-40 w-40 rounded-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!vaultData) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Set Up Your Privacy Vault</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Start by adding your personal information to the secure vault. We use this to search people-search sites for your public profiles and help you get them removed.
            </p>
            <Button asChild>
              <span className="cursor-pointer">Go to Personal Vault</span>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const stats = dashboardData || {
    totalExposures: 0,
    inProgress: 0,
    completed: 0,
    failed: 0,
    reAppeared: 0,
    pending: 0,
    successRate: 0,
    avgProcessingDays: 0,
    retryable: 0,
    overdue: 0,
    escalated: 0,
    jurisdictionBreakdown: {},
    totalScans: 0,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card data-testid="card-exposure-summary" className="lg:row-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Exposure Summary
              </CardTitle>
              <CardDescription>What our scans have verified so far</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className="text-center space-y-3">
                <div>
                  <div className="text-4xl font-bold text-red-600 dark:text-red-400" data-testid="text-total-exposures">{stats.totalExposures}</div>
                  <p className="text-sm font-medium mt-1">Total Findings</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold">{stats.pending + stats.inProgress}</div>
                    <p className="text-xs text-muted-foreground">Pending Removal</p>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                    <p className="text-xs text-muted-foreground">Removed</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                {stats.totalExposures === 0
                  ? "No findings yet. Run a scan to search people-search sites for your profiles."
                  : stats.completed > 0
                    ? `You've sent removal requests to ${stats.completed} broker${stats.completed !== 1 ? "s" : ""}. ${stats.pending > 0 ? `${stats.pending} request${stats.pending !== 1 ? "s" : ""} still in progress.` : "All requests sent."}`
                    : `${stats.totalExposures} profile${stats.totalExposures !== 1 ? "s" : ""} found on data broker sites. Send removal requests to opt out.`}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Findings</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-exposures">{stats.totalExposures}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.inProgress}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Removed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="text-total-removed">{stats.completed}</div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pending}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="text-success-rate">{stats.successRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.completed} of {stats.totalExposures} requests completed
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Processing</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avgProcessingDays || "--"}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.avgProcessingDays > 0 ? "days to removal" : "No completions yet"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
              <Search className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalScans}</div>
              <p className="text-xs text-muted-foreground mt-1">exposure scans run</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {(stats.reAppeared > 0 || stats.overdue > 0 || stats.escalated > 0 || stats.failed > 0) && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.reAppeared > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 dark:bg-destructive/20" data-testid="alert-reappearances">
                    <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stats.reAppeared} Data Re-appearance{stats.reAppeared > 1 ? "s" : ""}</p>
                      <p className="text-xs text-muted-foreground">Previously removed data has been re-listed by brokers</p>
                    </div>
                    <Badge variant="destructive">{stats.reAppeared}</Badge>
                  </div>
                )}
                {stats.overdue > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 dark:bg-destructive/20" data-testid="alert-overdue">
                    <Clock className="h-4 w-4 text-destructive flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stats.overdue} Overdue Request{stats.overdue > 1 ? "s" : ""}</p>
                      <p className="text-xs text-muted-foreground">Brokers have exceeded their legal compliance deadline</p>
                    </div>
                    <Badge variant="destructive">{stats.overdue}</Badge>
                  </div>
                )}
                {stats.escalated > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted" data-testid="alert-escalated">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stats.escalated} Escalated Request{stats.escalated > 1 ? "s" : ""}</p>
                      <p className="text-xs text-muted-foreground">Requests that required additional follow-up or re-submission</p>
                    </div>
                    <Badge variant="outline">{stats.escalated}</Badge>
                  </div>
                )}
                {stats.failed > 0 && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted" data-testid="alert-failed">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{stats.failed} Failed Request{stats.failed > 1 ? "s" : ""}</p>
                      <p className="text-xs text-muted-foreground">
                        {stats.retryable > 0 ? `${stats.retryable} can be automatically retried` : "Manual intervention may be required"}
                      </p>
                    </div>
                    <Badge variant="outline">{stats.failed}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}


      {Object.keys(stats.jurisdictionBreakdown).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Compliance Coverage
              </CardTitle>
              <CardDescription>Legal frameworks applied to your removal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {Object.entries(stats.jurisdictionBreakdown).map(([jurisdiction, count]) => (
                  <div key={jurisdiction} className="flex items-center gap-2 p-2 rounded-md bg-muted" data-testid={`badge-jurisdiction-${jurisdiction}`}>
                    <Badge variant="outline">{jurisdiction}</Badge>
                    <span className="text-sm text-muted-foreground">{count} request{count > 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {scansData && scansData.length > 0 && (
        <IdentityRiskScoreCard scanId={scansData[0]?.id} />
      )}

      <SmartRemovalQueue />

      <RemovalTimeline />

      <CompetitiveComparison />

      <TransparencyDashboard />
    </div>
  );
}
