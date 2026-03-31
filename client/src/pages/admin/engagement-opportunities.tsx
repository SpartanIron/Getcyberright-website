import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ExternalLink,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface EngagementOpportunity {
  id: string;
  platform: string;
  sourceType: string;
  sourceUrl: string | null;
  sourceAuthor: string | null;
  sourceTitle: string;
  sourceSnippet: string | null;
  topic: string;
  relevanceScore: number;
  suggestedComment: string | null;
  approvedComment: string | null;
  status: string;
  discoveredAt: string;
  approvedAt: string | null;
  postedAt: string | null;
  dismissedAt: string | null;
  postError: string | null;
}

interface OpportunitySummary {
  total: number;
  discovered: number;
  approved: number;
  posted: number;
  dismissed: number;
}

function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    linkedin: "bg-blue-600 text-white",
    facebook: "bg-blue-500 text-white",
    twitter: "bg-sky-500 text-white",
    rss: "bg-orange-500 text-white",
  };
  return (
    <Badge className={colors[platform] || "bg-gray-500 text-white"} data-testid={`badge-platform-${platform}`}>
      {platform}
    </Badge>
  );
}

function TopicBadge({ topic }: { topic: string }) {
  const colors: Record<string, string> = {
    ransomware: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    phishing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    data_breach: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    vulnerability: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    malware: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    privacy: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    ai_security: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    iot_security: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    general: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  };
  return (
    <Badge className={colors[topic] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"} data-testid={`badge-topic-${topic}`}>
      {topic.replace(/_/g, " ")}
    </Badge>
  );
}

function ScoreIndicator({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 50 ? "text-yellow-600" : "text-gray-400";
  return (
    <div className={`flex items-center gap-1 font-semibold ${color}`} data-testid={`score-${score}`}>
      <Zap className="h-4 w-4" />
      {score}
    </div>
  );
}

function OpportunityCard({
  opp,
  onApprove,
  onDismiss,
  isApproving,
  isDismissing,
}: {
  opp: EngagementOpportunity;
  onApprove: (id: string, comment: string) => void;
  onDismiss: (id: string) => void;
  isApproving: boolean;
  isDismissing: boolean;
}) {
  const [editedComment, setEditedComment] = useState(opp.suggestedComment || "");
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="border border-border" data-testid={`card-opportunity-${opp.id}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <PlatformBadge platform={opp.platform} />
              <TopicBadge topic={opp.topic} />
              <ScoreIndicator score={opp.relevanceScore} />
              {opp.sourceType && (
                <span className="text-xs text-muted-foreground">{opp.sourceType}</span>
              )}
            </div>
            <h4 className="font-medium text-sm leading-tight line-clamp-2" data-testid={`text-title-${opp.id}`}>
              {opp.sourceTitle}
            </h4>
            {opp.sourceAuthor && (
              <p className="text-xs text-muted-foreground mt-0.5">by {opp.sourceAuthor}</p>
            )}
          </div>
          {opp.sourceUrl && (
            <a
              href={opp.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-muted-foreground hover:text-foreground"
              data-testid={`link-source-${opp.id}`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        {opp.sourceSnippet && (
          <p className="text-xs text-muted-foreground line-clamp-3 bg-muted/50 rounded p-2" data-testid={`text-snippet-${opp.id}`}>
            {opp.sourceSnippet}
          </p>
        )}

        {opp.status === "discovered" && (
          <>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  AI-Suggested Comment
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => setIsEditing(!isEditing)}
                  data-testid={`button-edit-${opp.id}`}
                >
                  {isEditing ? "Preview" : "Edit"}
                </Button>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                  className="text-sm min-h-[80px]"
                  data-testid={`input-comment-${opp.id}`}
                />
              ) : (
                <p className="text-sm bg-muted/30 rounded p-2 whitespace-pre-wrap" data-testid={`text-comment-${opp.id}`}>
                  {editedComment || "No comment generated"}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                onClick={() => onApprove(opp.id, editedComment)}
                disabled={isApproving || !editedComment}
                className="flex-1"
                data-testid={`button-approve-${opp.id}`}
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <ThumbsUp className="h-4 w-4 mr-1" />
                )}
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDismiss(opp.id)}
                disabled={isDismissing}
                data-testid={`button-dismiss-${opp.id}`}
              >
                {isDismissing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ThumbsDown className="h-4 w-4" />
                )}
              </Button>
            </div>
          </>
        )}

        {opp.status === "approved" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              Approved {opp.approvedAt && `on ${new Date(opp.approvedAt).toLocaleDateString()}`}
            </div>
            {opp.approvedComment && (
              <p className="text-sm bg-green-50 dark:bg-green-950 rounded p-2 whitespace-pre-wrap">
                {opp.approvedComment}
              </p>
            )}
            <div className="flex gap-2">
              {opp.approvedComment && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(opp.approvedComment!);
                  }}
                  data-testid={`button-copy-${opp.id}`}
                >
                  Copy Comment
                </Button>
              )}
              {opp.sourceUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" data-testid={`button-visit-${opp.id}`}>
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visit Source
                  </a>
                </Button>
              )}
            </div>
          </div>
        )}

        {opp.status === "posted" && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <CheckCircle className="h-4 w-4" />
            Posted {opp.postedAt && `on ${new Date(opp.postedAt).toLocaleDateString()}`}
          </div>
        )}

        {opp.status === "dismissed" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <XCircle className="h-4 w-4" />
            Dismissed
          </div>
        )}

        {opp.postError && (
          <p className="text-xs text-red-600 bg-red-50 dark:bg-red-950 rounded p-2">
            Error: {opp.postError}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(opp.discoveredAt).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminEngagementOpportunities() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discovered");
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery<{
    opportunities: EngagementOpportunity[];
    summary: OpportunitySummary;
  }>({
    queryKey: ["/api/admin/engagement-opportunities", activeTab],
    queryFn: async () => {
      const res = await fetch(`/api/admin/engagement-opportunities?status=${activeTab}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const discoverMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/admin/engagement-opportunities/discover"),
    onSuccess: () => {
      toast({ title: "Discovery scan complete", description: "New opportunities have been found." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/engagement-opportunities"] });
    },
    onError: (err: Error) => {
      toast({ title: "Discovery failed", description: err.message, variant: "destructive" });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      apiRequest("POST", `/api/admin/engagement-opportunities/${id}/approve`, { comment }),
    onSuccess: () => {
      setApprovingId(null);
      toast({ title: "Comment approved", description: "Visit the source to post the comment." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/engagement-opportunities"] });
    },
    onError: (err: Error) => {
      setApprovingId(null);
      toast({ title: "Approval failed", description: err.message, variant: "destructive" });
    },
  });

  const dismissMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("POST", `/api/admin/engagement-opportunities/${id}/dismiss`),
    onSuccess: () => {
      setDismissingId(null);
      toast({ title: "Opportunity dismissed" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/engagement-opportunities"] });
    },
    onError: (err: Error) => {
      setDismissingId(null);
      toast({ title: "Dismiss failed", description: err.message, variant: "destructive" });
    },
  });

  const handleApprove = (id: string, comment: string) => {
    setApprovingId(id);
    approveMutation.mutate({ id, comment });
  };

  const handleDismiss = (id: string) => {
    setDismissingId(id);
    dismissMutation.mutate(id);
  };

  const opportunities = data?.opportunities || [];
  const summary = data?.summary || { total: 0, discovered: 0, approved: 0, posted: 0, dismissed: 0 };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Engagement Opportunities</h1>
            <p className="text-sm text-muted-foreground">
              Discover and engage with cybersecurity conversations across the web
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => discoverMutation.mutate()}
              disabled={discoverMutation.isPending}
              data-testid="button-discover"
            >
              {discoverMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Search className="h-4 w-4 mr-1" />
              )}
              Discover Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card data-testid="card-stat-discovered">
            <CardContent className="p-3 text-center">
              <Eye className="h-5 w-5 mx-auto text-blue-500 mb-1" />
              <div className="text-2xl font-bold">{summary.discovered}</div>
              <div className="text-xs text-muted-foreground">Discovered</div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-approved">
            <CardContent className="p-3 text-center">
              <CheckCircle className="h-5 w-5 mx-auto text-green-500 mb-1" />
              <div className="text-2xl font-bold">{summary.approved}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-posted">
            <CardContent className="p-3 text-center">
              <MessageSquare className="h-5 w-5 mx-auto text-purple-500 mb-1" />
              <div className="text-2xl font-bold">{summary.posted}</div>
              <div className="text-xs text-muted-foreground">Posted</div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-dismissed">
            <CardContent className="p-3 text-center">
              <XCircle className="h-5 w-5 mx-auto text-gray-400 mb-1" />
              <div className="text-2xl font-bold">{summary.dismissed}</div>
              <div className="text-xs text-muted-foreground">Dismissed</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList data-testid="tabs-status">
            <TabsTrigger value="discovered" data-testid="tab-discovered">
              Discovered ({summary.discovered})
            </TabsTrigger>
            <TabsTrigger value="approved" data-testid="tab-approved">
              Approved ({summary.approved})
            </TabsTrigger>
            <TabsTrigger value="posted" data-testid="tab-posted">
              Posted ({summary.posted})
            </TabsTrigger>
            <TabsTrigger value="dismissed" data-testid="tab-dismissed">
              Dismissed ({summary.dismissed})
            </TabsTrigger>
            <TabsTrigger value="all" data-testid="tab-all">
              All ({summary.total})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12" data-testid="loading-indicator">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : opportunities.length === 0 ? (
              <Card data-testid="card-empty">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No opportunities found</p>
                  <p className="text-sm mt-1">Click "Discover Now" to scan for new engagement opportunities</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {opportunities.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opp={opp}
                    onApprove={handleApprove}
                    onDismiss={handleDismiss}
                    isApproving={approvingId === opp.id && approveMutation.isPending}
                    isDismissing={dismissingId === opp.id && dismissMutation.isPending}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
