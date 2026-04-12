"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Wrench,
  TrendingUp,
  Activity,
  Lock,
  Globe,
  Server,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface PostureCheckResult {
  id: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "warn" | "info";
  severity: "critical" | "high" | "medium" | "low" | "info";
  details: string;
  recommendation?: string;
  remediable: boolean;
  remediationId?: string;
}

interface PostureCategory {
  name: string;
  score: number;
  maxScore: number;
  checks: PostureCheckResult[];
}

interface PostureScanResult {
  overallScore: number;
  grade: string;
  categories: PostureCategory[];
  issues: PostureCheckResult[];
  checksRun: number;
  checksPassed: number;
  scannedAt: string;
}

interface ScanHistoryEntry {
  score: number;
  grade: string;
  date: string;
  checksRun: number;
  checksPassed: number;
}

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "text-green-500";
  if (grade.startsWith("B")) return "text-blue-500";
  if (grade.startsWith("C")) return "text-yellow-500";
  if (grade.startsWith("D")) return "text-orange-500";
  return "text-red-500";
}

function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 75) return "#3b82f6";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="relative flex items-center justify-center" data-testid="posture-score-gauge">
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/20"
        />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold" style={{ color }} data-testid="posture-score">{score}</span>
        <span className={`text-lg font-semibold ${getGradeColor(grade)}`} data-testid="posture-grade">{grade}</span>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "pass": return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "fail": return <XCircle className="w-4 h-4 text-red-500" />;
    case "warn": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default: return <Info className="w-4 h-4 text-blue-400" />;
  }
}

function SeverityBadge({ severity }: { severity: string }) {
  switch (severity) {
    case "critical": return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    case "high": return <Badge className="bg-orange-500 text-white text-xs">High</Badge>;
    case "medium": return <Badge className="bg-yellow-500 text-black text-xs">Medium</Badge>;
    case "low": return <Badge variant="secondary" className="text-xs">Low</Badge>;
    default: return <Badge variant="outline" className="text-xs">Info</Badge>;
  }
}

function CategoryIcon({ name }: { name: string }) {
  switch (name) {
    case "Headers & Transport": return <Globe className="w-4 h-4" />;
    case "Authentication": return <Lock className="w-4 h-4" />;
    case "Input Validation": return <Shield className="w-4 h-4" />;
    case "DoS Protection": return <ShieldAlert className="w-4 h-4" />;
    case "Data Protection": return <Lock className="w-4 h-4" />;
    case "Secrets Management": return <Eye className="w-4 h-4" />;
    case "Monitoring & Response": return <Activity className="w-4 h-4" />;
    case "Dependencies": return <Server className="w-4 h-4" />;
    default: return <Shield className="w-4 h-4" />;
  }
}

function CategoryCard({ category }: { category: PostureCategory }) {
  const [expanded, setExpanded] = useState(false);
  const passed = category.checks.filter(c => c.status === "pass").length;
  const failed = category.checks.filter(c => c.status === "fail").length;
  const warned = category.checks.filter(c => c.status === "warn").length;

  return (
    <Card className="overflow-hidden" data-testid={`category-card-${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <CategoryIcon name={category.name} />
          <div>
            <div className="font-medium text-sm">{category.name}</div>
            <div className="flex gap-2 mt-1">
              {passed > 0 && <span className="text-xs text-green-500">{passed} passed</span>}
              {warned > 0 && <span className="text-xs text-yellow-500">{warned} warnings</span>}
              {failed > 0 && <span className="text-xs text-red-500">{failed} failed</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-lg font-bold" style={{ color: getScoreColor(category.score) }}>
              {category.score}%
            </span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>
      {expanded && (
        <div className="border-t px-4 py-2 space-y-2">
          {category.checks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 py-2 border-b last:border-0">
              <StatusIcon status={check.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{check.name}</span>
                  <SeverityBadge severity={check.severity} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{check.details}</p>
                {check.recommendation && (
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Recommendation: {check.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function TrendChart({ history }: { history: ScanHistoryEntry[] }) {
  if (history.length < 2) {
    return (
      <div className="text-center text-muted-foreground py-8 text-sm">
        Not enough data for trend chart. Run more scans to see trends.
      </div>
    );
  }

  const reversed = [...history].reverse();
  const maxScore = 100;
  const chartHeight = 120;
  const chartWidth = reversed.length > 1 ? 100 : 50;

  return (
    <div className="w-full overflow-x-auto" data-testid="posture-trend-chart">
      <svg viewBox={`0 0 ${Math.max(chartWidth, reversed.length * 40)} ${chartHeight + 30}`} className="w-full min-w-[300px]" preserveAspectRatio="xMidYMid meet">
        {[0, 25, 50, 75, 100].map(tick => {
          const y = chartHeight - (tick / maxScore) * chartHeight;
          return (
            <g key={tick}>
              <line x1="30" y1={y} x2={Math.max(chartWidth, reversed.length * 40)} y2={y} stroke="currentColor" strokeOpacity="0.1" />
              <text x="25" y={y + 4} textAnchor="end" fontSize="8" fill="currentColor" fillOpacity="0.5">{tick}</text>
            </g>
          );
        })}
        <polyline
          points={reversed.map((entry, i) => {
            const x = 35 + i * ((Math.max(chartWidth, reversed.length * 40) - 40) / (reversed.length - 1 || 1));
            const y = chartHeight - (entry.score / maxScore) * chartHeight;
            return `${x},${y}`;
          }).join(" ")}
          fill="none"
          stroke={getScoreColor(reversed[reversed.length - 1]?.score || 0)}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {reversed.map((entry, i) => {
          const x = 35 + i * ((Math.max(chartWidth, reversed.length * 40) - 40) / (reversed.length - 1 || 1));
          const y = chartHeight - (entry.score / maxScore) * chartHeight;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="3" fill={getScoreColor(entry.score)} />
              <text x={x} y={chartHeight + 15} textAnchor="middle" fontSize="7" fill="currentColor" fillOpacity="0.5">
                {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function SecurityPostureDashboard({ token }: { token: string }) {
  const { toast } = useToast();
  const [remediatingId, setRemediatingId] = useState<string | null>(null);

  const { data: latestData, isLoading: latestLoading, refetch: refetchLatest } = useQuery<{ scan: PostureScanResult | null }>({
    queryKey: ["/api/admin/security-posture/latest"],
    queryFn: async () => {
      const response = await fetch("/api/admin/security-posture/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch posture data");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: historyData } = useQuery<{ history: ScanHistoryEntry[] }>({
    queryKey: ["/api/admin/security-posture/history"],
    queryFn: async () => {
      const response = await fetch("/api/admin/security-posture/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch history");
      return response.json();
    },
    enabled: !!token,
  });

  const scanMutation = useMutation({
    mutationFn: async () => {
      const csrfResponse = await fetch("/api/csrf-token", { credentials: "include" });
      const { csrfToken } = await csrfResponse.json();
      const response = await fetch("/api/admin/security-posture/scan", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-csrf-token": csrfToken,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to run scan");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Scan Complete", description: "Security posture scan finished successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-posture/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security-posture/history"] });
    },
    onError: () => {
      toast({ title: "Scan Failed", description: "Could not complete the security posture scan.", variant: "destructive" });
    },
  });

  const remediateMutation = useMutation({
    mutationFn: async (remediationId: string) => {
      setRemediatingId(remediationId);
      const csrfResponse = await fetch("/api/csrf-token", { credentials: "include" });
      const { csrfToken } = await csrfResponse.json();
      const response = await fetch("/api/admin/security-posture/remediate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-csrf-token": csrfToken,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ remediationId }),
      });
      if (!response.ok) throw new Error("Failed to remediate");
      return response.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      setRemediatingId(null);
      toast({
        title: data.success ? "Remediation Applied" : "Remediation Failed",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      if (data.success) {
        scanMutation.mutate();
      }
    },
    onError: () => {
      setRemediatingId(null);
      toast({ title: "Remediation Failed", description: "Could not apply the fix.", variant: "destructive" });
    },
  });

  const scan = latestData?.scan;
  const history = historyData?.history || [];

  if (latestLoading) {
    return (
      <div className="flex items-center justify-center py-12" data-testid="posture-loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="ml-3">Loading security posture...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="security-posture-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" /> Platform Security Posture
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Proactive security assessment across all platform layers
          </p>
        </div>
        <Button
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
          data-testid="btn-run-scan"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${scanMutation.isPending ? "animate-spin" : ""}`} />
          {scanMutation.isPending ? "Scanning..." : "Run Scan"}
        </Button>
      </div>

      {!scan ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No security scans yet. Run your first scan to assess platform security.</p>
            <Button onClick={() => scanMutation.mutate()} disabled={scanMutation.isPending} data-testid="btn-first-scan">
              <RefreshCw className={`w-4 h-4 mr-2 ${scanMutation.isPending ? "animate-spin" : ""}`} />
              Run First Scan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="flex flex-col items-center py-6">
                <ScoreGauge score={scan.overallScore} grade={scan.grade} />
                <p className="text-sm text-muted-foreground mt-2">Overall Security Score</p>
                <p className="text-xs text-muted-foreground">
                  Last scan: {new Date(scan.scannedAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Checks Run</span>
                    <span className="font-bold" data-testid="text-checks-run">{scan.checksRun}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Passed</span>
                    <span className="font-bold text-green-500" data-testid="text-checks-passed">{scan.checksPassed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Issues Found</span>
                    <span className="font-bold text-yellow-500" data-testid="text-issues-count">{scan.issues.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Categories</span>
                    <span className="font-bold">{scan.categories.length}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(scan.checksPassed / scan.checksRun) * 100}%`,
                        backgroundColor: getScoreColor(scan.overallScore),
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrendChart history={history} />
              </CardContent>
            </Card>
          </div>

          {scan.issues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Issues & Recommendations ({scan.issues.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scan.issues.map((issue) => (
                    <div key={issue.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50" data-testid={`issue-${issue.id}`}>
                      <StatusIcon status={issue.status} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{issue.name}</span>
                          <SeverityBadge severity={issue.severity} />
                          <Badge variant="outline" className="text-xs">{issue.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{issue.details}</p>
                        {issue.recommendation && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                            {issue.recommendation}
                          </p>
                        )}
                      </div>
                      {issue.remediable && issue.remediationId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => remediateMutation.mutate(issue.remediationId!)}
                          disabled={remediatingId === issue.remediationId}
                          data-testid={`btn-remediate-${issue.id}`}
                        >
                          <Wrench className="w-3 h-3 mr-1" />
                          {remediatingId === issue.remediationId ? "Fixing..." : "Auto-Fix"}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Category Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {scan.categories.map((cat) => (
                <CategoryCard key={cat.name} category={cat} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
