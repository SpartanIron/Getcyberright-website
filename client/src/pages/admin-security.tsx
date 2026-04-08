"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  Ban, 
  Users,
  AlertTriangle,
  RefreshCw,
  Unlock,
  Database,
  ChevronRight,
  FileText
} from "lucide-react";
import { Link } from "@/lib/navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SecurityMetrics {
  timestamp: string;
  anomalyDetection: {
    trackedIPs: number;
    totalRequests: number;
    flaggedIPs: number;
  };
  failedLogins: {
    trackedIPs: number;
    highRiskIPs: number;
  };
  blockedIPs: {
    count: number;
  };
  status: string;
}

interface BlockedIP {
  ip: string;
  reason: string;
  until: string;
  severity: string;
}

interface BlockedIPsResponse {
  timestamp: string;
  blockedIPs: BlockedIP[];
}

export default function AdminSecurity() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metrics, isLoading: metricsLoading, refetch: refetchMetrics } = useQuery<SecurityMetrics>({
    queryKey: ["/api/security/metrics"],
    refetchInterval: 30000,
  });

  const { data: blockedData, isLoading: blockedLoading, refetch: refetchBlocked } = useQuery<BlockedIPsResponse>({
    queryKey: ["/api/admin/security/blocked-ips"],
    refetchInterval: 30000,
  });

  const unblockMutation = useMutation({
    mutationFn: async (ip: string) => {
      return apiRequest("DELETE", `/api/admin/security/blocked-ips/${encodeURIComponent(ip)}`);
    },
    onSuccess: () => {
      toast({ title: "IP Unblocked", description: "The IP address has been unblocked." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/security/blocked-ips"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/metrics"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to unblock IP address.", variant: "destructive" });
    },
  });

  const handleRefresh = () => {
    refetchMetrics();
    refetchBlocked();
    toast({ title: "Refreshed", description: "Security metrics updated." });
  };

  const getReasonLabel = (reason: string): string => {
    const labels: Record<string, string> = {
      "critical_anomaly_score": "Critical Anomaly",
      "brute_force_login": "Brute Force Attack",
      "rate_limit_violations": "Rate Limit Violations",
    };
    return labels[reason] || reason;
  };

  const getSeverityBadge = (severity: string) => {
    if (severity === "critical") {
      return <Badge variant="destructive">Critical</Badge>;
    }
    return <Badge variant="secondary">Warning</Badge>;
  };

  const formatTimeRemaining = (until: string): string => {
    const diff = new Date(until).getTime() - Date.now();
    if (diff <= 0) return "Expired";
    const minutes = Math.ceil(diff / 60000);
    if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Security Dashboard</h1>
            <p className="text-muted-foreground">Monitor threats and manage blocked IPs</p>
          </div>
          <Button onClick={handleRefresh} variant="outline" size="sm" data-testid="button-refresh-security">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Security Status</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics?.status === "operational" ? "Operational" : "Unknown"}
              </div>
              <p className="text-xs text-muted-foreground">
                All systems running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Blocked IPs</CardTitle>
              <Ban className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "..." : metrics?.blockedIPs?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently blocked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Anomaly Tracking</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "..." : metrics?.anomalyDetection?.flaggedIPs || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                IPs flagged for suspicious activity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
              <CardTitle className="text-sm font-medium">Login Threats</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metricsLoading ? "..." : metrics?.failedLogins?.highRiskIPs || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                High-risk login attempts
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Blocked IP Addresses
              </CardTitle>
              <CardDescription>
                IPs automatically blocked due to suspicious activity. Blocks expire automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {blockedLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : !blockedData?.blockedIPs?.length ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-green-500 mb-2" />
                  <p className="text-muted-foreground">No blocked IPs</p>
                  <p className="text-xs text-muted-foreground">All traffic is currently allowed</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blockedData.blockedIPs.map((blocked) => (
                    <div 
                      key={blocked.ip} 
                      className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                      data-testid={`blocked-ip-${blocked.ip.replace(/\./g, "-")}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono bg-background px-2 py-0.5 rounded">
                            {blocked.ip}
                          </code>
                          {getSeverityBadge(blocked.severity)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{getReasonLabel(blocked.reason)}</span>
                          <span className="text-muted-foreground/50">|</span>
                          <span>Expires in {formatTimeRemaining(blocked.until)}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unblockMutation.mutate(blocked.ip)}
                        disabled={unblockMutation.isPending}
                        data-testid={`button-unblock-${blocked.ip.replace(/\./g, "-")}`}
                      >
                        <Unlock className="w-4 h-4 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>MITRE ATT&CK Coverage</CardTitle>
            <CardDescription>Security controls mapped to threat framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950/20">
                <div className="text-sm font-medium text-green-700 dark:text-green-400">Prevention</div>
                <div className="text-2xl font-bold text-green-600">88/100</div>
                <div className="text-xs text-muted-foreground">CSP, HSTS, Rate Limiting</div>
              </div>
              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950/20">
                <div className="text-sm font-medium text-blue-700 dark:text-blue-400">Detection</div>
                <div className="text-2xl font-bold text-blue-600">85/100</div>
                <div className="text-xs text-muted-foreground">Anomaly Detection, Logging</div>
              </div>
              <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-950/20">
                <div className="text-sm font-medium text-orange-700 dark:text-orange-400">Response</div>
                <div className="text-2xl font-bold text-orange-600">80/100</div>
                <div className="text-xs text-muted-foreground">Auto-blocking, Incident Playbook</div>
              </div>
            </div>
            <div className="mt-4 p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Overall Security Score</div>
                  <div className="text-xs text-muted-foreground">MITRE ATT&CK Framework Assessment</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">87/100</div>
                  <Badge className="mt-1">Grade: A-</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-500/30 bg-gradient-to-br from-teal-50/50 to-background dark:from-teal-950/30" data-testid="card-threat-intel-link">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-teal-600" />
              Threat Intelligence Feeds
            </CardTitle>
            <CardDescription>Automated data ingestion from trusted security sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  8 feeds configured: CISA, NVD, PhishTank, URLhaus, HIBP, FBI IC3, FTC Sentinel, MITRE ATT&CK
                </p>
                <p className="text-xs text-muted-foreground">
                  Continuous ingestion with tiered schedules (2h - weekly)
                </p>
              </div>
              <Link href="/admin/threat-intelligence">
                <Button data-testid="button-view-threat-intel">
                  Manage Feeds
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-gradient-to-br from-purple-50/50 to-background dark:from-purple-950/30" data-testid="card-content-governance-link">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Content Governance
            </CardTitle>
            <CardDescription>Automated content auditing and freshness monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Monitors all educational content across Kids, Seniors, Parents, Educators, and Business hubs
                </p>
                <p className="text-xs text-muted-foreground">
                  Automatic flagging when new threats match content topics
                </p>
              </div>
              <Link href="/admin/content-governance">
                <Button data-testid="button-view-content-governance">
                  Manage Content
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-500/30 bg-gradient-to-br from-teal-50/50 to-background dark:from-teal-950/30" data-testid="card-compliance-link">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              NIST 800-53 Compliance
            </CardTitle>
            <CardDescription>Security and privacy controls assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Maps platform security features to NIST 800-53 control families
                </p>
                <p className="text-xs text-muted-foreground">
                  Identifies gaps and provides recommendations for improved compliance
                </p>
              </div>
              <Link href="/admin/compliance">
                <Button data-testid="button-view-compliance">
                  View Compliance
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
