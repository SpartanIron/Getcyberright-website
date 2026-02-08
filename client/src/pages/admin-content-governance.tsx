import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, RefreshCw, ExternalLink, Clock, Shield, TrendingUp, Eye, XCircle, Sparkles, Loader2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ContentPage {
  id: string;
  title: string;
  path: string;
  section: string;
  audience: string;
  topics: string[];
  freshnessScore: number;
  priorityLevel: string;
  needsReview: boolean;
  reviewReason: string | null;
  relatedThreatCount: number;
  lastManualUpdate: string | null;
  lastThreatMatch: string | null;
}

interface GovernanceStats {
  totalPages: number;
  pagesNeedingReview: number;
  averageFreshness: number;
  criticalPages: number;
  highPriorityPages: number;
  recentlyUpdated: number;
  topicCoverage: Record<string, number>;
}

interface AuditLogEntry {
  id: string;
  pageId: string;
  action: string;
  triggeredBy: string;
  notes: string | null;
  previousScore: number | null;
  newScore: number | null;
  performedBy: string | null;
  createdAt: string;
}

interface RefreshData {
  pageTitle: string;
  currentTopics: string[];
  relatedThreats: Array<{ title: string; description: string; source: string; severity: string }>;
  recommendations: string[];
  suggestedUpdates: string;
  urgency: "low" | "medium" | "high" | "critical";
  generatedContent: {
    sections: Array<{
      title: string;
      content: string;
      type: "new" | "update";
    }>;
    summary: string;
  } | null;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
    case "normal": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "low": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

function getFreshnessColor(score: number): string {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

function formatTimeAgo(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

function getSectionLabel(section: string): string {
  const labels: Record<string, string> = {
    "kids": "Kids Hub",
    "seniors": "Seniors Hub",
    "parents": "Parents Hub",
    "educators": "Educators Hub",
    "small-business": "Business Hub",
    "tools": "Security Tools",
    "general": "General Content",
  };
  return labels[section] || section;
}

export default function AdminContentGovernance() {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshModalOpen, setRefreshModalOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [refreshData, setRefreshData] = useState<RefreshData | null>(null);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [refreshNotes, setRefreshNotes] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statsData, isLoading: statsLoading, isError: statsError } = useQuery<{ success: boolean; stats: GovernanceStats }>({
    queryKey: ["/api/content-governance/stats"],
  });

  const { data: pagesData, isLoading: pagesLoading, isError: pagesError } = useQuery<{ success: boolean; pages: ContentPage[] }>({
    queryKey: ["/api/content-governance/pages"],
  });

  const { data: reviewPagesData, isLoading: reviewPagesLoading, isError: reviewPagesError } = useQuery<{ success: boolean; pages: ContentPage[] }>({
    queryKey: ["/api/content-governance/pages", { needsReview: true }],
    queryFn: () => fetch("/api/content-governance/pages?needsReview=true").then(r => r.json()),
  });

  const { data: auditLogData, isLoading: auditLogLoading, isError: auditLogError } = useQuery<{ success: boolean; log: AuditLogEntry[] }>({
    queryKey: ["/api/content-governance/audit-log"],
  });

  const invalidateAllGovernanceQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/content-governance/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/content-governance/pages"] });
    queryClient.invalidateQueries({ queryKey: ["/api/content-governance/pages", { needsReview: true }] });
    queryClient.invalidateQueries({ queryKey: ["/api/content-governance/audit-log"] });
  };

  const runAuditMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/content-governance/audit"),
    onSuccess: () => {
      toast({ title: "Audit Complete", description: "Content audit has been run successfully." });
      invalidateAllGovernanceQueries();
    },
    onError: (error: any) => {
      const isUnauthorized = error?.message?.includes("401") || error?.status === 401;
      toast({ 
        title: isUnauthorized ? "Admin Access Required" : "Audit Failed", 
        description: isUnauthorized ? "You must be logged in as an admin to run audits." : "Failed to run content audit.", 
        variant: "destructive" 
      });
    },
  });

  const markReviewedMutation = useMutation({
    mutationFn: (pageId: string) => apiRequest("POST", `/api/content-governance/pages/${pageId}/review`),
    onSuccess: () => {
      toast({ title: "Page Marked Reviewed", description: "Content freshness has been reset." });
      invalidateAllGovernanceQueries();
    },
    onError: (error: any) => {
      const isUnauthorized = error?.message?.includes("401") || error?.status === 401;
      toast({ 
        title: isUnauthorized ? "Admin Access Required" : "Review Failed", 
        description: isUnauthorized ? "You must be logged in as an admin to review content." : "Failed to mark page as reviewed.", 
        variant: "destructive" 
      });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: (pageId: string) => apiRequest("POST", `/api/content-governance/pages/${pageId}/dismiss`),
    onSuccess: () => {
      toast({ title: "Review Dismissed", description: "Review flag has been dismissed." });
      invalidateAllGovernanceQueries();
    },
    onError: (error: any) => {
      const isUnauthorized = error?.message?.includes("401") || error?.status === 401;
      toast({ 
        title: isUnauthorized ? "Admin Access Required" : "Dismiss Failed", 
        description: isUnauthorized ? "You must be logged in as an admin to dismiss reviews." : "Failed to dismiss review flag.", 
        variant: "destructive" 
      });
    },
  });

  const applyRefreshMutation = useMutation({
    mutationFn: ({ pageId, notes }: { pageId: string; notes: string }) => 
      apiRequest("POST", `/api/content-governance/pages/${pageId}/refresh`, { notes }),
    onSuccess: () => {
      toast({ title: "Content Refreshed", description: "Page has been marked as updated with AI recommendations applied." });
      invalidateAllGovernanceQueries();
      setRefreshModalOpen(false);
      setRefreshData(null);
      setSelectedPageId(null);
      setRefreshNotes("");
    },
    onError: (error: any) => {
      const isUnauthorized = error?.message?.includes("401") || error?.status === 401;
      toast({ 
        title: isUnauthorized ? "Admin Access Required" : "Refresh Failed", 
        description: isUnauthorized ? "You must be logged in as an admin to refresh content." : "Failed to apply content refresh.", 
        variant: "destructive" 
      });
    },
  });

  const openRefreshModal = async (pageId: string) => {
    setSelectedPageId(pageId);
    setRefreshModalOpen(true);
    setRefreshLoading(true);
    setRefreshData(null);
    setRefreshNotes("");
    
    try {
      const response = await fetch(`/api/content-governance/pages/${pageId}/refresh`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setRefreshData(data);
      } else {
        toast({ title: "Error", description: data.error || "Failed to load refresh data", variant: "destructive" });
        setRefreshModalOpen(false);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to load refresh recommendations", variant: "destructive" });
      setRefreshModalOpen(false);
    } finally {
      setRefreshLoading(false);
    }
  };

  const isInitialLoading = statsLoading || pagesLoading || reviewPagesLoading || auditLogLoading;
  const hasError = statsError || pagesError || reviewPagesError || auditLogError;

  const stats = statsData?.stats;
  const pages = pagesData?.pages || [];
  const reviewPages = reviewPagesData?.pages || [];
  const auditLog = auditLogData?.log || [];

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading content governance data...</p>
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
            <p className="text-muted-foreground text-sm">Failed to load content governance data</p>
            <Button variant="outline" onClick={() => invalidateAllGovernanceQueries()} data-testid="button-retry">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Link href="/admin/security">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Security
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">Content Governance</h1>
            <p className="text-muted-foreground">Automated content auditing and freshness monitoring</p>
          </div>
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Card key={i}><CardContent className="p-6"><Skeleton className="h-20 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card data-testid="card-stat-pages">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pages</p>
                    <p className="text-3xl font-bold">{stats?.totalPages || 0}</p>
                    <p className="text-xs text-muted-foreground">{stats?.recentlyUpdated || 0} updated this week</p>
                  </div>
                  <FileText className="h-5 w-5 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-freshness">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Freshness</p>
                    <p className={`text-3xl font-bold ${getFreshnessColor(stats?.averageFreshness || 100)}`}>
                      {stats?.averageFreshness || 100}%
                    </p>
                    <Progress value={stats?.averageFreshness || 100} className="mt-2 h-2" />
                  </div>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-review">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Needs Review</p>
                    <p className={`text-3xl font-bold ${(stats?.pagesNeedingReview || 0) > 0 ? "text-orange-600" : "text-green-600"}`}>
                      {stats?.pagesNeedingReview || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stats?.criticalPages || 0} critical, {stats?.highPriorityPages || 0} high priority
                    </p>
                  </div>
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-stat-actions">
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">Actions</p>
                  <Button 
                    onClick={() => runAuditMutation.mutate()}
                    disabled={runAuditMutation.isPending}
                    className="w-full"
                    data-testid="button-run-audit"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${runAuditMutation.isPending ? "animate-spin" : ""}`} />
                    {runAuditMutation.isPending ? "Running..." : "Run Full Audit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-navigation">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="needs-review" data-testid="tab-needs-review">
              Needs Review
              {(stats?.pagesNeedingReview || 0) > 0 && (
                <Badge variant="destructive" className="ml-2">{stats?.pagesNeedingReview}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="all-pages" data-testid="tab-all-pages">All Pages</TabsTrigger>
            <TabsTrigger value="audit-log" data-testid="tab-audit-log">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card data-testid="card-topic-coverage">
                <CardHeader>
                  <CardTitle>Topic Coverage</CardTitle>
                  <CardDescription>Pages covering each threat topic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats?.topicCoverage && Object.entries(stats.topicCoverage)
                      .sort((a, b) => b[1] - a[1])
                      .map(([topic, count]) => (
                        <div key={topic} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{topic.replace(/-/g, " ")}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(count / (stats?.totalPages || 1)) * 100} className="w-24 h-2" />
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card data-testid="card-recent-alerts">
                <CardHeader>
                  <CardTitle>Pages Needing Attention</CardTitle>
                  <CardDescription>Content flagged for review based on threat activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {reviewPages.length === 0 ? (
                    <div className="flex flex-col items-center py-8 text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="font-medium">All Content Up-to-Date</p>
                      <p className="text-sm text-muted-foreground">No pages currently need review</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviewPages.slice(0, 5).map(page => (
                        <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`alert-page-${page.id}`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{page.title}</span>
                              <Badge className={getPriorityColor(page.priorityLevel)} variant="outline">
                                {page.priorityLevel}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{page.reviewReason}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => openRefreshModal(page.id)}
                              data-testid={`button-refresh-overview-${page.id}`}
                            >
                              <Sparkles className="h-3 w-3 mr-1" />
                              Refresh
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markReviewedMutation.mutate(page.id)}
                              data-testid={`button-review-${page.id}`}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="needs-review">
            <Card data-testid="card-needs-review">
              <CardHeader>
                <CardTitle>Content Needing Review</CardTitle>
                <CardDescription>Pages flagged due to new threats matching their topics</CardDescription>
              </CardHeader>
              <CardContent>
                {reviewPages.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-xl font-medium">All Content is Current</p>
                    <p className="text-muted-foreground">No pages require review at this time</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Freshness</TableHead>
                        <TableHead>Threats</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviewPages.map(page => (
                        <TableRow key={page.id} data-testid={`review-row-${page.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{page.title}</span>
                              <a href={page.path} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getSectionLabel(page.section)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(page.priorityLevel)}>{page.priorityLevel}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`font-medium ${getFreshnessColor(page.freshnessScore)}`}>
                              {page.freshnessScore}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">{page.relatedThreatCount}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {page.reviewReason}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => openRefreshModal(page.id)}
                                data-testid={`button-refresh-${page.id}`}
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Refresh
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markReviewedMutation.mutate(page.id)}
                                disabled={markReviewedMutation.isPending}
                                data-testid={`button-mark-reviewed-${page.id}`}
                              >
                                <CheckCircle className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => dismissMutation.mutate(page.id)}
                                disabled={dismissMutation.isPending}
                                data-testid={`button-dismiss-${page.id}`}
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all-pages">
            <Card data-testid="card-all-pages">
              <CardHeader>
                <CardTitle>All Registered Content</CardTitle>
                <CardDescription>Complete inventory of monitored educational pages</CardDescription>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Section</TableHead>
                        <TableHead>Audience</TableHead>
                        <TableHead>Topics</TableHead>
                        <TableHead>Freshness</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pages.map(page => (
                        <TableRow key={page.id} data-testid={`page-row-${page.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{page.title}</span>
                              <a href={page.path} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{getSectionLabel(page.section)}</Badge>
                          </TableCell>
                          <TableCell className="capitalize">{page.audience}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {page.topics.slice(0, 3).map(topic => (
                                <Badge key={topic} variant="secondary" className="text-xs">
                                  {topic.replace(/-/g, " ")}
                                </Badge>
                              ))}
                              {page.topics.length > 3 && (
                                <Badge variant="secondary" className="text-xs">+{page.topics.length - 3}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={page.freshnessScore} className="w-16 h-2" />
                              <span className={`text-sm font-medium ${getFreshnessColor(page.freshnessScore)}`}>
                                {page.freshnessScore}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatTimeAgo(page.lastManualUpdate)}
                          </TableCell>
                          <TableCell>
                            {page.needsReview ? (
                              <Badge className={getPriorityColor(page.priorityLevel)}>
                                {page.priorityLevel}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Current
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit-log">
            <Card data-testid="card-audit-log">
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
                <CardDescription>History of content review actions</CardDescription>
              </CardHeader>
              <CardContent>
                {auditLog.length === 0 ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="font-medium">No Audit History</p>
                    <p className="text-sm text-muted-foreground">Actions will appear here as content is reviewed</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Page</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Triggered By</TableHead>
                        <TableHead>Score Change</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLog.map(entry => (
                        <TableRow key={entry.id} data-testid={`audit-row-${entry.id}`}>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatTimeAgo(entry.createdAt)}
                          </TableCell>
                          <TableCell className="font-medium">{entry.pageId}</TableCell>
                          <TableCell>
                            <Badge variant={entry.action === "reviewed" ? "default" : "secondary"}>
                              {entry.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize">{entry.triggeredBy}</TableCell>
                          <TableCell>
                            {entry.previousScore !== null && entry.newScore !== null ? (
                              <span className="text-sm">
                                <span className={getFreshnessColor(entry.previousScore)}>{entry.previousScore}%</span>
                                {" → "}
                                <span className={getFreshnessColor(entry.newScore)}>{entry.newScore}%</span>
                              </span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                            {entry.notes || "-"}
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
          <Button variant="outline" asChild data-testid="button-view-threat-intel">
            <Link href="/admin/threat-intelligence">
              <Shield className="h-4 w-4 mr-2" />
              View Threat Intelligence
            </Link>
          </Button>
          <Button variant="outline" asChild data-testid="button-back-security">
            <Link href="/admin/security">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Security Dashboard
            </Link>
          </Button>
        </div>
      </div>

      <Dialog open={refreshModalOpen} onOpenChange={setRefreshModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]" data-testid="dialog-content-refresh">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Content Refresh
            </DialogTitle>
            <DialogDescription>
              Review AI-generated recommendations based on recent threat intelligence
            </DialogDescription>
          </DialogHeader>
          
          {refreshLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Analyzing threats and generating recommendations...</p>
            </div>
          ) : refreshData ? (
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{refreshData.pageTitle}</h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {refreshData.currentTopics.map(topic => (
                      <Badge key={topic} variant="secondary" className="text-xs">{topic}</Badge>
                    ))}
                  </div>
                  <Badge 
                    className={
                      refreshData.urgency === "critical" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                      refreshData.urgency === "high" ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400" :
                      refreshData.urgency === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    }
                  >
                    {refreshData.urgency.toUpperCase()} Urgency
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Related Threats ({refreshData.relatedThreats.length})
                  </h4>
                  <div className="space-y-2">
                    {refreshData.relatedThreats.map((threat, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{threat.title}</span>
                          <Badge variant="outline" className="text-xs capitalize">{threat.severity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{threat.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Source: {threat.source}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {refreshData.generatedContent?.sections && refreshData.generatedContent.sections.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Generated Content Preview
                    </h4>
                    <div className="space-y-4">
                      {refreshData.generatedContent.sections.map((section, idx) => (
                        <div key={idx} className="border rounded-lg overflow-hidden">
                          <div className={`px-4 py-2 flex items-center justify-between ${
                            section.type === "new" 
                              ? "bg-green-50 dark:bg-green-950 border-b border-green-200 dark:border-green-800" 
                              : "bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800"
                          }`}>
                            <span className="font-medium text-sm">{section.title}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                section.type === "new" 
                                  ? "text-green-700 border-green-300 dark:text-green-400" 
                                  : "text-blue-700 border-blue-300 dark:text-blue-400"
                              }`}
                            >
                              {section.type === "new" ? "New Section" : "Update"}
                            </Badge>
                          </div>
                          <div className="p-4 bg-card">
                            <p className="text-sm leading-relaxed">{section.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Summary of Changes
                  </h4>
                  <ul className="space-y-2">
                    {refreshData.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Notes (optional)</h4>
                  <Textarea
                    placeholder="Add notes about what was updated..."
                    value={refreshNotes}
                    onChange={(e) => setRefreshNotes(e.target.value)}
                    className="resize-none"
                    rows={3}
                    data-testid="textarea-refresh-notes"
                  />
                </div>
              </div>
            </ScrollArea>
          ) : null}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setRefreshModalOpen(false)}
              data-testid="button-cancel-refresh"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedPageId && applyRefreshMutation.mutate({ 
                pageId: selectedPageId, 
                notes: refreshNotes || `AI refresh applied: ${refreshData?.recommendations.length || 0} recommendations` 
              })}
              disabled={!refreshData || applyRefreshMutation.isPending}
              data-testid="button-apply-refresh"
            >
              {applyRefreshMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Applying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Refreshed
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
