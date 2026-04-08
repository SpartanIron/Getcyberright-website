"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "@/lib/navigation";
import {
  ArrowLeft,
  RefreshCcw,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  Shield,
  Activity,
  Bell,
  ChevronRight,
  Play,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ThreatFeed {
  id: string;
  name: string;
  description: string | null;
  sourceUrl: string;
  sourceType: string;
  category: string;
  priority: number;
  scheduleInterval: number;
  isActive: boolean;
  requiresAuth: boolean;
  lastSuccessfulRun: string | null;
  lastAttemptedRun: string | null;
  lastError: string | null;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

interface FeedRun {
  id: string;
  feedId: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  itemsIngested: number;
  itemsUpdated: number;
  itemsSkipped: number;
  errorMessage: string | null;
  durationMs: number | null;
}

interface ThreatItem {
  id: string;
  feedId: string;
  externalId: string;
  title: string;
  summary: string;
  content: string;
  itemType: string;
  severity: string;
  confidence: number;
  sourceUrl: string | null;
  publishedAt: string;
  isActive: boolean;
}

interface HealthAlert {
  id: string;
  feedId: string;
  alertType: string;
  message: string;
  severity: string;
  createdAt: string;
  acknowledgedAt: string | null;
  resolvedAt: string | null;
}

interface ThreatStats {
  totalFeeds: number;
  activeFeeds: number;
  totalItems: number;
  recentItems24h: number;
  healthyFeeds: number;
  staleFeeds: number;
  criticalItems: number;
}

function formatTime(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function formatDuration(ms: number | null): string {
  if (!ms) return "-";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function getSeverityColor(severity: string): string {
  switch (severity.toLowerCase()) {
    case "critical": return "text-red-600 bg-red-100 dark:bg-red-900/30";
    case "high": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
    case "medium": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
    case "low": return "text-green-600 bg-green-100 dark:bg-green-900/30";
    default: return "text-muted-foreground bg-muted";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "running":
      return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    case "failed":
      return <XCircle className="w-4 h-4 text-red-600" />;
    default:
      return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

function getFeedHealthStatus(feed: ThreatFeed): { status: string; color: string } {
  if (feed.lastError) {
    return { status: "Error", color: "text-red-600" };
  }
  if (!feed.lastSuccessfulRun) {
    return { status: "Pending", color: "text-muted-foreground" };
  }
  const lastSuccess = new Date(feed.lastSuccessfulRun);
  const now = new Date();
  const hoursSinceSuccess = (now.getTime() - lastSuccess.getTime()) / 3600000;
  const expectedIntervalHours = feed.scheduleInterval / 3600;
  
  if (hoursSinceSuccess > expectedIntervalHours * 2) {
    return { status: "Stale", color: "text-yellow-600" };
  }
  return { status: "Healthy", color: "text-green-600" };
}

export default function AdminThreatIntelligence() {
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery<{ success: boolean; stats: ThreatStats }>({
    queryKey: ["/api/threat-intel/stats"],
  });

  const { data: feedsData, isLoading: feedsLoading, isError: feedsError } = useQuery<{ success: boolean; feeds: ThreatFeed[] }>({
    queryKey: ["/api/threat-intel/feeds"],
  });

  const { data: itemsData, isLoading: itemsLoading, isError: itemsError } = useQuery<{ success: boolean; items: ThreatItem[] }>({
    queryKey: ["/api/threat-intel/items"],
  });

  const { data: alertsData, isLoading: alertsLoading, isError: alertsError } = useQuery<{ success: boolean; alerts: HealthAlert[] }>({
    queryKey: ["/api/threat-intel/alerts"],
  });

  const { data: feedRunsData } = useQuery<{ success: boolean; runs: FeedRun[] }>({
    queryKey: ["/api/threat-intel/feeds", selectedFeed, "runs"],
    enabled: !!selectedFeed,
  });

  const triggerFeedMutation = useMutation({
    mutationFn: async (feedId: string) => {
      return apiRequest("POST", `/api/threat-intel/feeds/${feedId}/run`);
    },
    onSuccess: () => {
      toast({ title: "Feed run triggered", description: "The feed will be updated shortly." });
      queryClient.invalidateQueries({ queryKey: ["/api/threat-intel"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const acknowledgeAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest("POST", `/api/threat-intel/alerts/${alertId}/acknowledge`);
    },
    onSuccess: () => {
      toast({ title: "Alert acknowledged" });
      queryClient.invalidateQueries({ queryKey: ["/api/threat-intel/alerts"] });
    },
  });

  const isInitialLoading = statsLoading || feedsLoading || itemsLoading || alertsLoading;
  const hasError = statsError || feedsError || itemsError || alertsError;

  const stats = statsData?.stats;
  const feeds = feedsData?.feeds || [];
  const items = itemsData?.items || [];
  const alerts = alertsData?.alerts || [];
  const feedRuns = feedRunsData?.runs || [];

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading threat intelligence data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="text-muted-foreground text-sm">Failed to load threat intelligence data</p>
            <Button variant="outline" onClick={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/threat-intel"] });
            }} data-testid="button-retry">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/security">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white" data-testid="button-back-admin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Security
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Database className="w-10 h-10 text-teal-400" />
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">Threat Intelligence Feeds</h1>
              <p className="text-white/70">Automated threat data ingestion and monitoring</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card data-testid="card-stat-active-feeds">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium">Active Feeds</CardTitle>
                <Shield className="w-4 h-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-feeds-count">
                  {statsLoading ? "-" : stats?.activeFeeds || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {stats?.totalFeeds || 0} total feeds
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card data-testid="card-stat-total-items">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium">Threat Items</CardTitle>
                <Activity className="w-4 h-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-items-count">
                  {statsLoading ? "-" : stats?.totalItems?.toLocaleString() || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.recentItems24h || 0} new in last 24h
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card data-testid="card-stat-feed-health">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium">Feed Health</CardTitle>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600" data-testid="text-healthy-feeds-count">
                  {statsLoading ? "-" : stats?.healthyFeeds || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.staleFeeds || 0} stale feeds
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card data-testid="card-stat-critical">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium">Critical Items</CardTitle>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600" data-testid="text-critical-items-count">
                  {statsLoading ? "-" : stats?.criticalItems || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Requiring attention
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-900/10" data-testid="card-health-alerts">
              <CardHeader className="flex flex-row items-center gap-2 pb-3">
                <Bell className="w-5 h-5 text-yellow-600" />
                <CardTitle className="text-lg">Health Alerts</CardTitle>
                <Badge variant="secondary">{alerts.length}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 bg-background rounded-lg border" data-testid={`alert-${alert.id}`}>
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`w-5 h-5 ${alert.severity === "critical" ? "text-red-600" : "text-yellow-600"}`} />
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">{formatTime(alert.createdAt)}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlertMutation.mutate(alert.id)}
                        disabled={!!alert.acknowledgedAt}
                        data-testid={`button-acknowledge-alert-${alert.id}`}
                      >
                        {alert.acknowledgedAt ? "Acknowledged" : "Acknowledge"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <Tabs defaultValue="feeds" className="space-y-6">
          <TabsList data-testid="tabs-navigation">
            <TabsTrigger value="feeds" data-testid="tab-feeds">Feeds</TabsTrigger>
            <TabsTrigger value="items" data-testid="tab-items">Recent Items</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">Run History</TabsTrigger>
          </TabsList>

          <TabsContent value="feeds">
            <Card data-testid="card-feeds-list">
              <CardHeader>
                <CardTitle>Configured Feeds</CardTitle>
                <CardDescription>All threat intelligence data sources</CardDescription>
              </CardHeader>
              <CardContent>
                {feedsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feed Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Last Success</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeds.map((feed) => {
                        const health = getFeedHealthStatus(feed);
                        return (
                          <TableRow key={feed.id} data-testid={`feed-row-${feed.id}`}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-teal-600" />
                                {feed.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{feed.sourceType}</Badge>
                            </TableCell>
                            <TableCell>
                              {feed.scheduleInterval >= 3600
                                ? `${Math.floor(feed.scheduleInterval / 3600)}h`
                                : `${Math.floor(feed.scheduleInterval / 60)}m`}
                            </TableCell>
                            <TableCell>{formatTime(feed.lastSuccessfulRun)}</TableCell>
                            <TableCell>{feed.itemCount.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`font-medium ${health.color}`}>{health.status}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => triggerFeedMutation.mutate(feed.id)}
                                  disabled={triggerFeedMutation.isPending}
                                  data-testid={`button-trigger-feed-${feed.id}`}
                                >
                                  {triggerFeedMutation.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Play className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedFeed(feed.id)}
                                  data-testid={`button-view-feed-${feed.id}`}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items">
            <Card data-testid="card-recent-items">
              <CardHeader>
                <CardTitle>Recent Threat Items</CardTitle>
                <CardDescription>Latest intelligence data from all feeds</CardDescription>
              </CardHeader>
              <CardContent>
                {itemsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No threat items yet. Feeds will populate data on their next scheduled run.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Published</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.slice(0, 20).map((item) => (
                        <TableRow key={item.id} data-testid={`item-row-${item.id}`}>
                          <TableCell className="max-w-md">
                            <div className="truncate font-medium">{item.title}</div>
                            <div className="truncate text-sm text-muted-foreground">{item.summary?.substring(0, 100)}...</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.itemType}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSeverityColor(item.severity)}>{item.severity}</Badge>
                          </TableCell>
                          <TableCell>{item.confidence}%</TableCell>
                          <TableCell>{formatTime(item.publishedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card data-testid="card-run-history">
              <CardHeader>
                <CardTitle>Run History</CardTitle>
                <CardDescription>
                  {selectedFeed
                    ? `History for ${feeds.find((f) => f.id === selectedFeed)?.name || "selected feed"}`
                    : "Select a feed to view its run history"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedFeed ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Click the arrow icon on a feed to view its run history.
                  </div>
                ) : feedRuns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No run history for this feed yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Started</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Ingested</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead>Skipped</TableHead>
                        <TableHead>Error</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedRuns.map((run) => (
                        <TableRow key={run.id} data-testid={`run-row-${run.id}`}>
                          <TableCell>{formatTime(run.startedAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(run.status)}
                              <span className="capitalize">{run.status}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatDuration(run.durationMs)}</TableCell>
                          <TableCell className="text-green-600">+{run.itemsIngested}</TableCell>
                          <TableCell className="text-blue-600">{run.itemsUpdated}</TableCell>
                          <TableCell className="text-muted-foreground">{run.itemsSkipped}</TableCell>
                          <TableCell className="max-w-xs truncate text-red-600">
                            {run.errorMessage || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/threat-intel"] })}
            data-testid="button-refresh-all"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh All Data
          </Button>
          <Link href="/dashboard">
            <Button data-testid="button-view-dashboard">View User Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
