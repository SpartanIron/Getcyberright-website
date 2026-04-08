"use client";

import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  ClipboardCheck,
  Info,
} from "lucide-react";
import { formatDate, getStatusVariant } from "@/components/data-removal/utils";

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

export function Reports() {
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
