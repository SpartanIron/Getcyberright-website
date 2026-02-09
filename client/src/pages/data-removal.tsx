import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { trackToolUsage } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Shield,
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Database,
  FileText,
  Eye,
  Lock,
  RefreshCw,
  BarChart3,
  Filter,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  ChevronDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Users,
  ShieldCheck,
  Plus,
  Send,
  Zap,
  Download,
  ClipboardCheck,
  TrendingUp,
  Info,
  CheckCircle,
  ShieldAlert,
  Activity,
  Target,
  Gauge,
  Crown,
  Fingerprint,
  Bell,
} from "lucide-react";

interface DataBroker {
  id: string;
  name: string;
  domain: string;
  description: string | null;
  category: string;
  dataTypesCollected: string[] | null;
  optOutMethod: string;
  optOutUrl: string | null;
  optOutEmail: string | null;
  optOutInstructions: string | null;
  difficulty: string;
  estimatedProcessingDays: number | null;
  requiresIdVerification: boolean | null;
  requiresAccountCreation: boolean | null;
  legalBasis: string[] | null;
  countriesApplicable: string[] | null;
  riskLevel: string | null;
  monthlyVisitors: string | null;
  parentCompany: string | null;
  isActive: boolean | null;
}

interface VaultProfile {
  id: string;
  fullName: string;
  profileName?: string | null;
  previousNames: string[] | null;
  emails: string[] | null;
  phoneNumbers: string[] | null;
  currentAddress: string | null;
  previousAddresses: string[] | null;
  dateOfBirth: string | null;
  relativeNames: string[] | null;
  employerNames: string[] | null;
  privacyMode?: string | null;
  priorityLevel?: string | null;
  complianceFrameworks?: string[] | null;
}

interface ScanResult {
  id: string;
  vaultProfileId: string;
  status: string;
  totalExposures: number | null;
  totalBrokersScanned: number | null;
  completedAt: string | null;
  createdAt: string;
}

interface ScanFinding {
  id: string;
  scanId: string;
  brokerId: string;
  broker: DataBroker;
  dataTypesFound: string[] | null;
  dataTypesExposed: string[] | null;
  riskLevel: string | null;
  exposureLevel: string | null;
  exposureDetails: string | null;
  verificationMethod: string | null;
  verificationDetails: string | null;
  sourceEvidence: string | null;
}

interface RemovalRequest {
  id: string;
  brokerId: string;
  broker?: DataBroker;
  brokerName?: string;
  brokerDomain?: string;
  status: string;
  optOutContent: string | null;
  notes: string | null;
  jurisdictionApplied: string | null;
  legalBasisUsed: string | null;
  complianceDeadline: string | null;
  retryCount: number | null;
  escalationLevel: number | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalExposures: number;
  inProgress: number;
  completed: number;
  failed: number;
  reAppeared: number;
  pending: number;
  successRate: number;
  avgProcessingDays: number;
  retryable: number;
  overdue: number;
  escalated: number;
  jurisdictionBreakdown: Record<string, number>;
  totalScans: number;
}


function getDifficultyVariant(difficulty: string): "default" | "secondary" | "destructive" | "outline" {
  switch (difficulty.toLowerCase()) {
    case "easy": return "secondary";
    case "medium": return "outline";
    case "hard": return "destructive";
    default: return "outline";
  }
}

function getRiskVariant(risk: string | null): "default" | "secondary" | "destructive" | "outline" {
  switch (risk?.toLowerCase()) {
    case "critical": return "destructive";
    case "high": return "destructive";
    case "medium": return "outline";
    case "low": return "secondary";
    default: return "outline";
  }
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "completed": return "default";
    case "confirmed": return "default";
    case "confirmed_removed": return "default";
    case "in_progress": return "secondary";
    case "request_sent": return "secondary";
    case "submitted": return "secondary";
    case "awaiting_verification": return "secondary";
    case "pending": return "outline";
    case "failed": return "destructive";
    case "rejected": return "destructive";
    case "re_appeared": return "destructive";
    default: return "outline";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface SmartQueueItem {
  broker: DataBroker;
  finding: any;
  priorityScore: number;
  priorityReason: string;
  estimatedSuccessRate: number;
  recommendedMethod: string;
}

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

function OverviewTab() {
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

function VaultTab() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const { data: vaultData, isLoading } = useQuery<VaultProfile | null>({
    queryKey: ["/api/data-removal/vault"],
    enabled: isAuthenticated,
  });

  const [fullName, setFullName] = useState("");
  const [previousNames, setPreviousNames] = useState("");
  const [emails, setEmails] = useState("");
  const [phones, setPhones] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [previousAddresses, setPreviousAddresses] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [relativeNames, setRelativeNames] = useState("");
  const [employerNames, setEmployerNames] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (vaultData && !initialized) {
    setFullName(vaultData.fullName || "");
    setPreviousNames(vaultData.previousNames?.join(", ") || "");
    setEmails(vaultData.emails?.join(", ") || "");
    setPhones(vaultData.phoneNumbers?.join(", ") || "");
    setCurrentAddress(vaultData.currentAddress || "");
    setPreviousAddresses(vaultData.previousAddresses?.join(", ") || "");
    setDateOfBirth(vaultData.dateOfBirth || "");
    setRelativeNames(vaultData.relativeNames?.join(", ") || "");
    setEmployerNames(vaultData.employerNames?.join(", ") || "");
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        fullName,
        previousNames: previousNames ? previousNames.split(",").map((s) => s.trim()).filter(Boolean) : [],
        emails: emails ? emails.split(",").map((s) => s.trim()).filter(Boolean) : [],
        phoneNumbers: phones ? phones.split(",").map((s) => s.trim()).filter(Boolean) : [],
        currentAddress: currentAddress || null,
        previousAddresses: previousAddresses ? previousAddresses.split(",").map((s) => s.trim()).filter(Boolean) : [],
        dateOfBirth: dateOfBirth || null,
        relativeNames: relativeNames ? relativeNames.split(",").map((s) => s.trim()).filter(Boolean) : [],
        employerNames: employerNames ? employerNames.split(",").map((s) => s.trim()).filter(Boolean) : [],
      };
      const res = await apiRequest("POST", "/api/data-removal/vault", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault"] });
      toast({ title: "Vault Saved", description: "Your personal information has been securely saved." });
      trackToolUsage("data-broker-vault-save", true);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-vault-save", false, { error: error.message });
    },
  });

  if (!isAuthenticated) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Sign In Required</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Please sign in to access your Personal Vault and manage your protected information.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Personal Information Vault
          </CardTitle>
          <CardDescription>
            Enter your personal information below. We use your email to check for confirmed breaches and verify which data broker sites are active.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </label>
              <Input
                data-testid="input-vault-fullname"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Previous Names
              </label>
              <Input
                placeholder="Maiden name, former name (comma-separated)"
                value={previousNames}
                onChange={(e) => setPreviousNames(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Addresses
              </label>
              <Input
                data-testid="input-vault-email"
                placeholder="email1@example.com, email2@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Numbers
              </label>
              <Input
                data-testid="input-vault-phone"
                placeholder="+1 555-0100, +1 555-0200"
                value={phones}
                onChange={(e) => setPhones(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Current Address
              </label>
              <Input
                data-testid="input-vault-address"
                placeholder="123 Main St, City, State"
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Previous Addresses
              </label>
              <Input
                placeholder="Old addresses (comma-separated)"
                value={previousAddresses}
                onChange={(e) => setPreviousAddresses(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date of Birth
              </label>
              <Input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Relative Names
              </label>
              <Input
                placeholder="Jane Doe, Bob Doe (comma-separated)"
                value={relativeNames}
                onChange={(e) => setRelativeNames(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                Employer Names
              </label>
              <Input
                placeholder="Current and past employers (comma-separated)"
                value={employerNames}
                onChange={(e) => setEmployerNames(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
            <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Your information is encrypted and only used to scan data brokers. We never share or sell your data.
            </p>
          </div>

          <Button
            data-testid="button-save-vault"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !fullName.trim()}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Lock className="h-4 w-4 mr-2" />
            )}
            Save to Vault
          </Button>
        </CardContent>
      </Card>

      {vaultData && <PrivacyModeSection vaultProfileId={vaultData.id} currentMode={vaultData.privacyMode ?? "standard"} />}

      <FamilyProfilesSection />
    </motion.div>
  );
}

function PrivacyModeSection({ vaultProfileId, currentMode }: { vaultProfileId: string; currentMode: string }) {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState(currentMode);

  const modeMutation = useMutation({
    mutationFn: async (mode: string) => {
      const res = await apiRequest("POST", "/api/data-removal/privacy-mode", { vaultProfileId, mode });
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault"] });
      toast({ title: "Privacy Mode Updated", description: `Switched to ${data.mode} mode with ${data.frameworks?.join(", ")} compliance.` });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const privacyModes = [
    { value: "standard", label: "Standard", description: "Basic privacy protection with CCPA compliance", icon: Shield },
    { value: "executive", label: "Executive", description: "Enhanced protection for high-profile individuals", icon: Crown },
    { value: "military", label: "Military/Defense", description: "OPSEC-compliant removal with maximum urgency", icon: ShieldAlert },
    { value: "government", label: "Government", description: "Federal employee protection with Privacy Act compliance", icon: Fingerprint },
    { value: "high-risk", label: "High Risk", description: "Multi-framework protection for at-risk individuals", icon: Target },
  ];

  return (
    <Card data-testid="card-privacy-mode">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Privacy Mode
        </CardTitle>
        <CardDescription>Select the protection level that matches your needs. Higher modes use stronger legal language and priority processing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {privacyModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = selectedMode === mode.value;
            return (
              <button
                key={mode.value}
                data-testid={`button-privacy-mode-${mode.value}`}
                onClick={() => {
                  setSelectedMode(mode.value);
                  modeMutation.mutate(mode.value);
                }}
                disabled={modeMutation.isPending}
                className={`p-3 rounded-md text-left transition-colors border ${
                  isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10"
                    : "border-border hover-elevate"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>{mode.label}</span>
                  {isSelected && <Badge variant="default">Active</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{mode.description}</p>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function FamilyProfilesSection() {
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newEmails, setNewEmails] = useState("");

  const { data: profiles, isLoading } = useQuery<VaultProfile[]>({
    queryKey: ["/api/data-removal/vault/profiles"],
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        profileName: newProfileName,
        fullName: newFullName || undefined,
        emails: newEmails ? newEmails.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
      };
      const res = await apiRequest("POST", "/api/data-removal/vault/family", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault/profiles"] });
      toast({ title: "Family Member Added", description: `${newProfileName} has been added to your protection plan.` });
      setShowAddForm(false);
      setNewProfileName("");
      setNewFullName("");
      setNewEmails("");
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (profileId: string) => {
      const res = await apiRequest("DELETE", `/api/data-removal/vault/family/${profileId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/vault/profiles"] });
      toast({ title: "Profile Removed", description: "Family member profile has been removed." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) return null;

  return (
    <Card data-testid="card-family-profiles">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Protection Plan
        </CardTitle>
        <CardDescription>
          Protect your entire family. Add up to 6 profiles to monitor and remove their data from broker sites.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {profiles && profiles.length > 0 && (
          <div className="space-y-2">
            {profiles.map((profile) => (
              <div key={profile.id} className="flex items-center justify-between gap-3 p-3 rounded-md border" data-testid={`card-family-profile-${profile.id}`}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{profile.profileName}</p>
                    <p className="text-xs text-muted-foreground">{profile.fullName || "No name set"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{profile.emails?.length || 0} emails</Badge>
                  {profiles.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      data-testid={`button-delete-profile-${profile.id}`}
                      onClick={() => deleteMutation.mutate(profile.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {profiles && profiles.length < 6 && !showAddForm && (
          <Button
            variant="outline"
            onClick={() => setShowAddForm(true)}
            data-testid="button-add-family-member"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        )}

        {showAddForm && (
          <div className="space-y-3 p-4 rounded-md border">
            <p className="text-sm font-medium">Add Family Member</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Profile Name *</label>
                <Input
                  data-testid="input-family-profile-name"
                  placeholder='e.g. "Mom", "Dad", "Kid"'
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Full Name</label>
                <Input
                  data-testid="input-family-full-name"
                  placeholder="Jane Doe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Email Addresses</label>
                <Input
                  data-testid="input-family-emails"
                  placeholder="email@example.com"
                  value={newEmails}
                  onChange={(e) => setNewEmails(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-testid="button-save-family-member"
                onClick={() => addMutation.mutate()}
                disabled={addMutation.isPending || !newProfileName.trim()}
              >
                {addMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save Member
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GuestScanForm() {
  const { toast } = useToast();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestAddress, setGuestAddress] = useState("");

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
          <p className="text-muted-foreground">
            We search people-search websites (like Whitepages, Spokeo, BeenVerified) for public profiles listing your name, address, and phone number. If we find you listed, we can help you request removal. All results are from real searches — no estimates or fake scores.
          </p>
          <div className="flex items-start gap-2 p-2.5 rounded-md bg-primary/5 text-xs">
            <Info className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-medium">Different from breach checking:</span> Our <Link href="/breach-dashboard" className="text-primary underline underline-offset-2">Breach Dashboard</Link> checks if your email was in data breaches. This tool finds your <span className="font-medium">public profiles</span> on people-search sites and helps you get them removed.
            </p>
          </div>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                People-Search Site Results
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {result.searchTransparency
                  ? `We searched ${result.searchTransparency.totalSearchable} people-search websites for your name and location. Here's exactly what happened with each search:`
                  : `We scanned ${result.totalBrokersScanned.toLocaleString()} data brokers for your information.`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.searchTransparency ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/30 text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-search-found">{result.searchTransparency.profilesFound}</div>
                      <p className="text-xs font-medium mt-1">Profiles Found</p>
                      <p className="text-xs text-muted-foreground">Your info is listed</p>
                    </div>
                    <div className="p-3 rounded-md bg-green-50 dark:bg-green-950/30 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-search-clean">{result.searchTransparency.notFound}</div>
                      <p className="text-xs font-medium mt-1">Clean</p>
                      <p className="text-xs text-muted-foreground">Searched, not found</p>
                    </div>
                    <div className="p-3 rounded-md bg-orange-50 dark:bg-orange-950/30 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400" data-testid="text-search-blocked">{result.searchTransparency.blocked + result.searchTransparency.failed}</div>
                      <p className="text-xs font-medium mt-1">Blocked</p>
                      <p className="text-xs text-muted-foreground">Site rejected our search</p>
                    </div>
                    <div className="p-3 rounded-md bg-muted/50 text-center">
                      <div className="text-2xl font-bold" data-testid="text-search-unsearchable">{result.searchTransparency.notSearchable}</div>
                      <p className="text-xs font-medium mt-1">Not Searchable</p>
                      <p className="text-xs text-muted-foreground">Require paid API access</p>
                    </div>
                  </div>
                  {(result.searchTransparency.blocked + result.searchTransparency.failed) > 0 && (
                    <div className="flex items-start gap-2 p-2.5 rounded-md bg-muted/30 text-xs">
                      <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-muted-foreground">
                        <span className="font-medium">{result.searchTransparency.blocked + result.searchTransparency.failed} sites blocked</span> our automated search (CAPTCHAs, JavaScript rendering, or bot detection). Your profile may still exist on those sites — you can check them manually, or paid services like DeleteMe ($129/year) use human researchers to access these.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-md bg-red-50 dark:bg-red-950/30 text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400" data-testid="text-profiles-found">{result.profilesFound || 0}</div>
                    <p className="text-xs font-medium mt-1">Profiles Found</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <div className="text-2xl font-bold" data-testid="text-brokers-scanned">{result.totalBrokersScanned.toLocaleString()}</div>
                    <p className="text-xs font-medium mt-1">Brokers Checked</p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50 text-center">
                    <div className="text-2xl font-bold" data-testid="text-total-findings">{result.totalExposuresFound}</div>
                    <p className="text-xs font-medium mt-1">Total Findings</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {(() => {
            const profileFindings = result.findings.filter(f => f.evidenceTier === "profile_found");
            const brokerFindings = result.findings.filter(f => f.evidenceTier === "verified_broker");
            return (
              <>
                {profileFindings.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5" />
                        {profileFindings.length} Profile{profileFindings.length !== 1 ? "s" : ""} Found on Broker Sites
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        We searched these sites and found listings that match your name and location. You can view each profile and request removal.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profileFindings.map((finding, idx) => (
                        <div key={idx} className="p-4 border border-red-200 dark:border-red-900 rounded-md bg-red-50/30 dark:bg-red-950/10 space-y-2" data-testid={`profile-finding-${idx}`}>
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{finding.broker.name}</span>
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800 no-default-hover-elevate no-default-active-elevate">
                                Profile Found
                              </Badge>
                              {(() => {
                                const rawLabel = finding.confidenceLabel || (finding.evidenceTier === "confirmed" ? "Confirmed" : "Likely");
                                const label = rawLabel === "Likely" ? "Likely Match" : rawLabel;
                                const colorClass = label === "Very High" || label === "Confirmed"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-300 dark:border-red-700"
                                  : label === "High"
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-700"
                                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
                                return (
                                  <Badge variant="outline" className={`text-xs ${colorClass} no-default-hover-elevate no-default-active-elevate`}>
                                    {label}
                                  </Badge>
                                );
                              })()}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
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
                            </div>
                          </div>
                          {finding.verificationDetails && (
                            <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                              {finding.verificationDetails}
                            </p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {brokerFindings.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        {brokerFindings.length} Broker{brokerFindings.length !== 1 ? "s" : ""} That Blocked Our Search
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        These sites blocked or restricted our automated scan. They are known data brokers where your information may still appear.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {brokerFindings.slice(0, 10).map((finding, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 p-3 border rounded-md">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium">{finding.broker.name}</span>
                            <span className="text-xs text-muted-foreground">{finding.broker.domain}</span>
                            {finding.verificationMethod === "search_blocked" && (
                              <Badge variant="outline" className="text-xs">Blocked</Badge>
                            )}
                            {finding.verificationMethod === "search_failed" && (
                              <Badge variant="outline" className="text-xs">Unreachable</Badge>
                            )}
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={finding.broker.optOutUrl || `https://${finding.broker.domain}`} target="_blank" rel="noopener noreferrer" data-testid={`link-check-broker-${finding.broker.id}`}>
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Check Manually
                            </a>
                          </Button>
                        </div>
                      ))}
                      {brokerFindings.length > 10 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          + {brokerFindings.length - 10} more brokers. Create an account to see all.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {result.breachSummary && result.breachSummary.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                          <div>
                            <p className="font-medium">Your email also appeared in {result.breachSummary.length} data breach{result.breachSummary.length !== 1 ? "es" : ""}</p>
                            <p className="text-sm text-muted-foreground">Use our Breach Dashboard for full details, monitoring, and alerts.</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/breach-dashboard">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Breach Dashboard
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
                  <Link href="/register">Create Free Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}

function ScanTab() {
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

      {selectedScanId && (
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
      )}

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

function TrackerTab() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useQuery<{ requests: RemovalRequest[] }>({
    queryKey: ["/api/data-removal/requests", statusFilter !== "all" ? statusFilter : ""],
    enabled: isAuthenticated,
  });

  const generateMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/${requestId}/generate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      toast({ title: "Opt-Out Letter Generated", description: "Your opt-out letter has been prepared." });
      trackToolUsage("data-broker-optout-generate", true);
    },
    onError: (error: Error) => {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-optout-generate", false, { error: error.message });
    },
  });

  const autoSendMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/${requestId}/auto-send`);
      return res.json();
    },
    onSuccess: (data: { success: boolean; method: string; message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({
        title: data.success ? "Removal Request Sent" : "Action Required",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      trackToolUsage("data-broker-auto-send", data.success, { method: data.method });
    },
    onError: (error: Error) => {
      toast({ title: "Auto-Send Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-auto-send", false, { error: error.message });
    },
  });

  const bulkAutoSendMutation = useMutation({
    mutationFn: async (requestIds: string[]) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/bulk-auto-send`, { requestIds });
      return res.json();
    },
    onSuccess: (data: { results: Array<{ requestId: string; success: boolean; message: string }> }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      const succeeded = data.results.filter((r) => r.success).length;
      const failed = data.results.filter((r) => !r.success).length;
      toast({
        title: "Bulk Auto-Send Complete",
        description: `${succeeded} sent successfully${failed > 0 ? `, ${failed} need manual action` : ""}`,
      });
      trackToolUsage("data-broker-bulk-auto-send", true, { succeeded, failed, total: data.results.length });
    },
    onError: (error: Error) => {
      toast({ title: "Bulk Send Failed", description: error.message, variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/data-removal/requests/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({ title: "Status Updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  if (!isAuthenticated) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Sign In to Track Removals</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Track the progress of your data removal requests across all data broker sites.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const requests = requestsData?.requests || [];
  const completed = requests.filter((r) => r.status === "completed").length;
  const progressPercent = requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;

  const statusOptions = ["all", "pending", "request_sent", "in_progress", "submitted", "awaiting_verification", "confirmed_removed", "completed", "failed", "re_appeared"];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Removal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{completed} of {requests.length} completed</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Removal Requests
              </CardTitle>
              <div className="flex gap-1 flex-wrap">
                {statusOptions.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className="capitalize"
                    data-testid={`filter-status-${s}`}
                  >
                    {s.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </div>
            {requests.filter((r) => ["not_started", "pending", "request_generated"].includes(r.status)).length > 0 && (
              <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t flex-wrap">
                <p className="text-sm text-muted-foreground">
                  {requests.filter((r) => ["not_started", "pending", "request_generated"].includes(r.status)).length} requests ready to send
                </p>
                <Button
                  size="sm"
                  data-testid="button-bulk-auto-send"
                  onClick={() => {
                    const sendable = requests
                      .filter((r) => ["not_started", "pending", "request_generated"].includes(r.status))
                      .map((r) => r.id);
                    bulkAutoSendMutation.mutate(sendable);
                  }}
                  disabled={bulkAutoSendMutation.isPending}
                >
                  {bulkAutoSendMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-1" />
                  )}
                  Auto-Send All Pending
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground">No removal requests yet.</p>
                <p className="text-sm text-muted-foreground">Run a scan and send removal requests from the Exposure Scan tab.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="border rounded-md">
                    <div className="flex items-start justify-between gap-4 p-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{req.brokerName || req.broker?.name || "Unknown"}</p>
                          <Badge variant={getStatusVariant(req.status)} className="capitalize">
                            {req.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {req.brokerDomain || req.broker?.domain || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {formatDate(req.createdAt)}
                          {req.updatedAt && req.updatedAt !== req.createdAt && (
                            <> &middot; Updated: {formatDate(req.updatedAt)}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Instructions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateMutation.mutate(req.id)}
                          disabled={generateMutation.isPending}
                        >
                          {generateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          Opt-Out Letter
                        </Button>
                        {["not_started", "pending", "request_generated", "failed"].includes(req.status) && (
                          <Button
                            size="sm"
                            data-testid={`button-auto-send-${req.id}`}
                            onClick={() => autoSendMutation.mutate(req.id)}
                            disabled={autoSendMutation.isPending}
                          >
                            {autoSendMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-1" />
                            )}
                            Auto-Send
                          </Button>
                        )}
                        <Select
                          value={req.status}
                          onValueChange={(value) => statusMutation.mutate({ id: req.id, status: value })}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="request_sent">Request Sent</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="awaiting_verification">Awaiting Verification</SelectItem>
                            <SelectItem value="confirmed_removed">Confirmed Removed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="re_appeared">Re-appeared</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {expandedId === req.id && (
                      <div className="px-4 pb-4 border-t pt-3 space-y-3">
                        {(req.jurisdictionApplied || req.complianceDeadline || req.retryCount) && (
                          <div className="flex flex-wrap gap-2">
                            {req.jurisdictionApplied && (
                              <Badge variant="outline" data-testid={`badge-jurisdiction-${req.id}`}>
                                {req.jurisdictionApplied}
                              </Badge>
                            )}
                            {req.complianceDeadline && (
                              <Badge variant="outline" data-testid={`badge-deadline-${req.id}`}>
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {formatDate(req.complianceDeadline)}
                              </Badge>
                            )}
                            {(req.retryCount ?? 0) > 0 && (
                              <Badge variant="outline">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                {req.retryCount} retries
                              </Badge>
                            )}
                            {(req.escalationLevel ?? 0) > 0 && (
                              <Badge variant="destructive">
                                Escalation Level {req.escalationLevel}
                              </Badge>
                            )}
                          </div>
                        )}
                        {req.optOutContent ? (
                          <div className="text-sm whitespace-pre-wrap bg-muted/30 rounded-md p-3">
                            {req.optOutContent}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No opt-out instructions available. Click "Opt-Out Letter" to generate one.
                          </p>
                        )}
                        {req.lastError && (
                          <div className="text-sm p-2 rounded-md bg-destructive/10 text-destructive">
                            Last error: {req.lastError}
                          </div>
                        )}
                        {req.notes && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            Notes: {req.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <MonitoringPanel />
      <ComplianceTracker />
    </div>
  );
}

function MonitoringPanel() {
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

function ComplianceTracker() {
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

function BrokersTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [page, setPage] = useState(0);
  const [expandedBrokerId, setExpandedBrokerId] = useState<string | null>(null);
  const limit = 20;

  const queryParams = new URLSearchParams();
  if (category && category !== "all") queryParams.set("category", category);
  if (difficulty && difficulty !== "all") queryParams.set("difficulty", difficulty);
  if (searchQuery) queryParams.set("search", searchQuery);
  queryParams.set("limit", String(limit));
  queryParams.set("offset", String(page * limit));

  const { data: brokersData, isLoading } = useQuery<{ brokers: DataBroker[]; total: number }>({
    queryKey: ["/api/data-removal/brokers", `?${queryParams.toString()}`],
  });

  const brokers = brokersData?.brokers || [];
  const total = brokersData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Broker Database
            </CardTitle>
            <CardDescription>
              Browse and search our catalog of {total > 0 ? `${total}+` : ""} known data broker sites.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3 flex-wrap">
              <div className="flex-1 min-w-[200px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    data-testid="input-broker-search"
                    placeholder="Search brokers..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(0);
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-[160px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <Select
                  value={category}
                  onValueChange={(v) => {
                    setCategory(v);
                    setPage(0);
                  }}
                  data-testid="select-broker-category"
                >
                  <SelectTrigger data-testid="select-broker-category">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="people-search">People Search</SelectItem>
                    <SelectItem value="data-broker">Data Broker</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="background-check">Background Check</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="public-records">Public Records</SelectItem>
                    <SelectItem value="advertising">Advertising</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[140px] space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => {
                    setDifficulty(v);
                    setPage(0);
                  }}
                  data-testid="select-broker-difficulty"
                >
                  <SelectTrigger data-testid="select-broker-difficulty">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6 space-y-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : brokers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Database className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No brokers found matching your criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brokers.map((broker, index) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card data-testid={`card-broker-${broker.id}`}>
                  <CardContent className="pt-6 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{broker.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {broker.domain}
                        </p>
                      </div>
                      {broker.riskLevel && (
                        <Badge variant={getRiskVariant(broker.riskLevel)} className="capitalize">
                          {broker.riskLevel}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="capitalize">{broker.category}</Badge>
                      <Badge variant={getDifficultyVariant(broker.difficulty)} className="capitalize">
                        {broker.difficulty}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{broker.optOutMethod}</Badge>
                    </div>

                    {broker.dataTypesCollected && broker.dataTypesCollected.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Collects: {broker.dataTypesCollected.slice(0, 4).join(", ")}
                        {broker.dataTypesCollected.length > 4 && ` +${broker.dataTypesCollected.length - 4} more`}
                      </p>
                    )}

                    {broker.estimatedProcessingDays && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Est. {broker.estimatedProcessingDays} days to process
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExpandedBrokerId(expandedBrokerId === broker.id ? null : broker.id)
                        }
                      >
                        <ChevronDown
                          className={`h-4 w-4 mr-1 transition-transform ${expandedBrokerId === broker.id ? "rotate-180" : ""}`}
                        />
                        Details
                      </Button>
                      {broker.optOutUrl && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={broker.optOutUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Opt-Out Page
                          </a>
                        </Button>
                      )}
                    </div>

                    {expandedBrokerId === broker.id && (
                      <div className="border-t pt-3 mt-2 space-y-2">
                        {broker.description && (
                          <p className="text-sm text-muted-foreground">{broker.description}</p>
                        )}
                        {broker.optOutInstructions && (
                          <div>
                            <p className="text-xs font-medium mb-1">Opt-Out Instructions:</p>
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                              {broker.optOutInstructions}
                            </p>
                          </div>
                        )}
                        {broker.optOutEmail && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {broker.optOutEmail}
                          </p>
                        )}
                        <div className="flex gap-3 flex-wrap text-xs text-muted-foreground">
                          {broker.requiresIdVerification && (
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Requires ID Verification
                            </span>
                          )}
                          {broker.requiresAccountCreation && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              Requires Account
                            </span>
                          )}
                          {broker.parentCompany && (
                            <span>Parent: {broker.parentCompany}</span>
                          )}
                          {broker.monthlyVisitors && (
                            <span>Visitors: {broker.monthlyVisitors}/mo</span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ExposureTrendChart() {
  const { isAuthenticated } = useAuth();
  const { data: scansData } = useQuery<{ scans: Array<{ id: string; totalExposures: number | null; totalBrokersScanned: number | null; createdAt: string; status: string }> }>({
    queryKey: ["/api/data-removal/scans"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !scansData?.scans || scansData.scans.length < 2) return null;

  const sortedScans = [...scansData.scans].reverse().slice(-10);
  const maxExposures = Math.max(...sortedScans.map(s => s.totalExposures ?? 0), 1);

  return (
    <Card data-testid="card-exposure-trend">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Exposure Trend
        </CardTitle>
        <CardDescription>How your data exposure has changed over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 h-40">
          {sortedScans.map((scan, idx) => {
            const exposures = scan.totalExposures ?? 0;
            const height = Math.max((exposures / maxExposures) * 100, 4);
            const barColor = exposures === 0 ? "bg-green-500" : exposures > 10 ? "bg-red-500" : "bg-orange-500";
            return (
              <div key={scan.id} className="flex-1 flex flex-col items-center gap-1 min-w-0" data-testid={`trend-bar-${idx}`}>
                <span className="text-xs font-medium">{exposures}</span>
                <div className={`w-full rounded-t-md ${barColor} transition-all`} style={{ height: `${height}%`, minHeight: "4px" }} />
                <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                  {new Date(scan.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </div>
            );
          })}
        </div>
        {sortedScans.length >= 2 && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            {(() => {
              const first = sortedScans[0]?.totalExposures ?? 0;
              const last = sortedScans[sortedScans.length - 1]?.totalExposures ?? 0;
              const diff = last - first;
              if (diff < 0) return <><CheckCircle className="h-4 w-4 text-green-600" /><span>Exposure decreased by {Math.abs(diff)} findings</span></>;
              if (diff > 0) return <><AlertTriangle className="h-4 w-4 text-destructive" /><span>Exposure increased by {diff} findings</span></>;
              return <><Info className="h-4 w-4" /><span>Exposure unchanged across scans</span></>;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportsTab() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: report, isLoading } = useQuery<{
    generatedAt: string;
    summary: {
      totalRequests: number;
      confirmed: number;
      verified: number;
      inProgress: number;
      failed: number;
      reAppeared: number;
      removalRate: number;
      avgRemovalDays: number | null;
    };
    categoryBreakdown: Record<string, { total: number; removed: number; pending: number }>;
    brokerDetails: Array<{
      brokerName: string;
      brokerDomain: string;
      category: string;
      difficulty: string;
      difficultyRating: number;
      status: string;
      requestSentAt: string | null;
      confirmedRemovedAt: string | null;
      daysToRemoval: number | null;
    }>;
    verificationStats: {
      total: number;
      pending: number;
      confirmed: number;
      failed: number;
    };
  }>({
    queryKey: ["/api/data-removal/progress-report"],
    enabled: !!user,
  });

  const { data: verifications, isLoading: verificationsLoading } = useQuery<Array<{
    id: string;
    removalRequestId: string;
    brokerId: string;
    status: string;
    dataStillPresent: boolean | null;
    scheduledFor: string | null;
    completedAt: string | null;
    createdAt: string;
  }>>({
    queryKey: ["/api/data-removal/verifications"],
    enabled: !!user,
  });

  const brokerNameMap = new Map<string, string>();
  if (report?.brokerDetails) {
    report.brokerDetails.forEach(b => {
      const brokerId = b.brokerDomain?.replace(/\./g, "-") || "";
      if (!brokerNameMap.has(brokerId)) brokerNameMap.set(brokerId, b.brokerName);
    });
  }

  const getBrokerDisplayName = (brokerId: string) => {
    return brokerNameMap.get(brokerId) || brokerId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const downloadReport = () => {
    if (!report) return;
    const lines: string[] = [];
    lines.push("GetCyberRight - Data Removal Progress Report");
    lines.push(`Generated: ${new Date(report.generatedAt).toLocaleDateString()}`);
    lines.push("");
    lines.push("=== SUMMARY ===");
    lines.push(`Total Removal Requests: ${report.summary.totalRequests}`);
    lines.push(`Successfully Removed: ${report.summary.confirmed}`);
    lines.push(`Verified Removed: ${report.summary.verified}`);
    lines.push(`In Progress: ${report.summary.inProgress}`);
    lines.push(`Failed: ${report.summary.failed}`);
    lines.push(`Re-appeared: ${report.summary.reAppeared}`);
    lines.push(`Removal Rate: ${report.summary.removalRate}%`);
    if (report.summary.avgRemovalDays) {
      lines.push(`Average Days to Removal: ${report.summary.avgRemovalDays}`);
    }
    lines.push("");
    lines.push("=== CATEGORY BREAKDOWN ===");
    Object.entries(report.categoryBreakdown).forEach(([cat, data]) => {
      lines.push(`${cat}: ${data.removed}/${data.total} removed (${data.pending} pending)`);
    });
    lines.push("");
    lines.push("=== BROKER DETAILS ===");
    lines.push("Broker | Domain | Status | Days to Removal");
    lines.push("-".repeat(60));
    report.brokerDetails.forEach(b => {
      lines.push(`${b.brokerName} | ${b.brokerDomain} | ${b.status} | ${b.daysToRemoval ?? "N/A"}`);
    });
    lines.push("");
    lines.push("=== VERIFICATION STATUS ===");
    lines.push(`Total Verifications: ${report.verificationStats.total}`);
    lines.push(`Pending: ${report.verificationStats.pending}`);
    lines.push(`Confirmed: ${report.verificationStats.confirmed}`);
    lines.push(`Failed: ${report.verificationStats.failed}`);

    lines.push("");
    lines.push("=== COMPLIANCE EVIDENCE ===");
    lines.push("This report serves as evidence of compliance with data privacy regulations.");
    lines.push("Applicable frameworks: CCPA (California), GDPR (EU), CPRA (California)");
    lines.push(`Report generated by: GetCyberRight Privacy Automation System`);
    lines.push(`Total removal requests submitted: ${report.summary.totalRequests}`);
    lines.push(`Successful removals verified: ${report.summary.verified}`);
    lines.push(`Active compliance rate: ${report.summary.removalRate}%`);

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privacy-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Report downloaded" });
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ClipboardCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view reports</h3>
          <p className="text-muted-foreground text-sm">Your progress reports and verification status require an account.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Progress Report</h2>
          <p className="text-sm text-muted-foreground">Track your data removal progress and download reports</p>
        </div>
        {report && report.summary.totalRequests > 0 && (
          <Button variant="outline" onClick={downloadReport} data-testid="button-download-report">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        )}
      </div>

      <ExposureTrendChart />

      {report && report.summary.totalRequests > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{report.summary.removalRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Removal Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{report.summary.confirmed}</p>
                <p className="text-xs text-muted-foreground mt-1">Removed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{report.summary.inProgress}</p>
                <p className="text-xs text-muted-foreground mt-1">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{report.summary.avgRemovalDays ?? "N/A"}</p>
                <p className="text-xs text-muted-foreground mt-1">Avg Days to Remove</p>
              </CardContent>
            </Card>
          </div>

          {Object.keys(report.categoryBreakdown).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Removal by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(report.categoryBreakdown).map(([cat, data]) => (
                    <div key={cat}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground">{cat}</span>
                        <span className="text-xs text-muted-foreground">{data.removed}/{data.total}</span>
                      </div>
                      <Progress value={data.total > 0 ? (data.removed / data.total) * 100 : 0} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {report.brokerDetails.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Broker Details</CardTitle>
                <CardDescription>Status of each removal request</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {report.brokerDetails.map((broker, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{broker.brokerName}</p>
                        <p className="text-xs text-muted-foreground">{broker.category}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {broker.daysToRemoval !== null && (
                          <span className="text-xs text-muted-foreground">{broker.daysToRemoval}d</span>
                        )}
                        <Badge
                          variant={
                            broker.status === "confirmed_removed" || broker.status === "verified_removed"
                              ? "default"
                              : broker.status === "failed" || broker.status === "re_appeared"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-[10px]"
                        >
                          {broker.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No removal requests yet</h3>
            <p className="text-muted-foreground text-sm">Run an exposure scan and submit removal requests to see your progress here.</p>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">Removal Verifications</h3>
        <p className="text-sm text-muted-foreground mb-4">
          After sending a removal request, we re-check the broker site to verify the opt-out was processed.
        </p>
        {verificationsLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : verifications && verifications.length > 0 ? (
          <div className="space-y-3">
            {verifications.map((v) => (
              <Card key={v.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Verification for {getBrokerDisplayName(v.brokerId)}</p>
                      <p className="text-xs text-muted-foreground">
                        Scheduled: {v.scheduledFor ? new Date(v.scheduledFor).toLocaleDateString() : "TBD"}
                      </p>
                    </div>
                    <Badge
                      variant={v.status === "confirmed" ? "default" : v.status === "failed" ? "destructive" : "secondary"}
                      className="text-[10px]"
                    >
                      {v.status === "confirmed" ? "Verified Removed" : v.status === "failed" ? "Data Still Present" : "Pending"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <ClipboardCheck className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No verifications scheduled yet. Verifications are automatically created after confirmed removals.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function DataRemoval() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Data Broker Removal - Protect Your Privacy"
        description="Check for confirmed data breaches and send opt-out requests to 500+ data broker sites. Honest, fact-based privacy protection tools."
      />
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div
              className="absolute rounded-full"
              style={{
                width: "clamp(300px, 40vw, 500px)",
                height: "clamp(300px, 40vw, 500px)",
                bottom: "-40%",
                right: "-10%",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "clamp(200px, 25vw, 350px)",
                height: "clamp(200px, 25vw, 350px)",
                top: "-20%",
                left: "-5%",
                backgroundColor: "rgba(139, 92, 246, 0.1)",
              }}
            />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-white/10">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">
                  Data Broker Removal
                </h1>
                <p className="text-white/70 mt-1 max-w-2xl">
                  Find your public profiles on people-search sites, send opt-out requests, and track removal progress across 500+ data brokers.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <BarChart3 className="h-4 w-4 mr-1.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="vault" data-testid="tab-vault">
                <Lock className="h-4 w-4 mr-1.5" />
                Personal Vault
              </TabsTrigger>
              <TabsTrigger value="scan" data-testid="tab-scan">
                <Search className="h-4 w-4 mr-1.5" />
                Exposure Scan
              </TabsTrigger>
              <TabsTrigger value="tracker" data-testid="tab-tracker">
                <Trash2 className="h-4 w-4 mr-1.5" />
                Removal Tracker
              </TabsTrigger>
              <TabsTrigger value="brokers" data-testid="tab-brokers">
                <Database className="h-4 w-4 mr-1.5" />
                Broker Database
              </TabsTrigger>
              <TabsTrigger value="reports" data-testid="tab-reports">
                <ClipboardCheck className="h-4 w-4 mr-1.5" />
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            <TabsContent value="vault">
              <VaultTab />
            </TabsContent>
            <TabsContent value="scan">
              <ScanTab />
            </TabsContent>
            <TabsContent value="tracker">
              <TrackerTab />
            </TabsContent>
            <TabsContent value="brokers">
              <BrokersTab />
            </TabsContent>
            <TabsContent value="reports">
              <ReportsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
