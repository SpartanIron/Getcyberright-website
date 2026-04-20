"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  AlertTriangle,
  Radio,
  Send,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  Image,
  ExternalLink,
  Wifi,
  WifiOff,
  Rocket,
  Hash,
  XCircle,
  RefreshCw,
  Pencil,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

function ClientDate({
  value,
  mode = "date",
  placeholder = "—",
}: {
  value?: string | Date | null;
  mode?: "date" | "time" | "datetime";
  placeholder?: string;
}) {
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    if (!value) {
      setText("");
      return;
    }
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) {
      setText("");
      return;
    }
    if (mode === "time") setText(d.toLocaleTimeString());
    else if (mode === "datetime") setText(d.toLocaleString());
    else setText(d.toLocaleDateString());
  }, [value, mode]);
  if (text === null) return <span suppressHydrationWarning>{placeholder}</span>;
  return <span suppressHydrationWarning>{text}</span>;
}

function TabErrorState({
  label,
  error,
  onRetry,
  isRetrying,
}: {
  label: string;
  error: unknown;
  onRetry: () => void;
  isRetrying: boolean;
}) {
  const message = error instanceof Error ? error.message : "Could not load data.";
  return (
    <Card data-testid={`error-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-8 text-center space-y-3">
        <XCircle className="w-8 h-8 mx-auto text-red-500" />
        <p className="text-sm font-medium">Couldn't load {label}.</p>
        <p className="text-xs text-muted-foreground line-clamp-2">{message}</p>
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          data-testid={`button-retry-${label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          {isRetrying ? (
            <><RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> Retrying…</>
          ) : (
            <><RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry</>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status] || variants.draft}`}>
      {status === "published" && <CheckCircle className="w-3 h-3 mr-1" />}
      {status === "draft" && <Clock className="w-3 h-3 mr-1" />}
      {status === "archived" && <FileText className="w-3 h-3 mr-1" />}
      {status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
      {status}
    </span>
  );
}

function RiskBadge({ level }: { level: string }) {
  const variants: Record<string, string> = {
    critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[level] || variants.medium}`}>
      {level}
    </span>
  );
}

function GuidesTab() {
  const { toast } = useToast();
  const { data: guides = [], isLoading, isError, error, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["/api/guides"],
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/admin/guides/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guides"] });
      toast({ title: "Guide published", description: "Social posts have been auto-generated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to publish guide.", variant: "destructive" });
    },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading guides...</div>;
  if (isError) return <TabErrorState label="Guides" error={error} onRetry={() => refetch()} isRetrying={isFetching} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Cyber Safety Guides ({guides.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {guides.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No guides yet. Content automation will generate drafts.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.map((guide: any) => (
                <TableRow key={guide.id} data-testid={`row-guide-${guide.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{guide.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{guide.metaDescription || guide.summary}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{guide.targetAudience || "general"}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={guide.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {guide.publishedAt ? <ClientDate value={guide.publishedAt} /> : "Not yet"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/guides/${guide.slug}`, "_blank")}
                        data-testid={`btn-view-guide-${guide.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      {guide.status !== "published" && (
                        <Button
                          size="sm"
                          onClick={() => publishMutation.mutate(guide.id)}
                          disabled={publishMutation.isPending}
                          data-testid={`btn-publish-guide-${guide.id}`}
                        >
                          <Send className="w-3 h-3 mr-1" /> Publish
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function ScamIntelTab() {
  const { toast } = useToast();
  const { data: scams = [], isLoading, isError, error, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["/api/scam-intel"],
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/admin/scam-intel/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/scam-intel"] });
      toast({ title: "Scam intel published", description: "Social posts have been auto-generated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to publish.", variant: "destructive" });
    },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading scam intelligence...</div>;
  if (isError) return <TabErrorState label="Scam Intel" error={error} onRetry={() => refetch()} isRetrying={isFetching} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Scam Intelligence ({scams.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {scams.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No scam intelligence entries yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Scam Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scams.map((scam: any) => (
                <TableRow key={scam.id} data-testid={`row-scam-${scam.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{scam.scamName}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{scam.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{scam.category || "general"}</Badge>
                  </TableCell>
                  <TableCell><RiskBadge level={scam.riskLevel || "medium"} /></TableCell>
                  <TableCell><StatusBadge status={scam.status} /></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/scam-intel/${scam.slug}`, "_blank")}
                        data-testid={`btn-view-scam-${scam.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      {scam.status !== "published" && (
                        <Button
                          size="sm"
                          onClick={() => publishMutation.mutate(scam.id)}
                          disabled={publishMutation.isPending}
                          data-testid={`btn-publish-scam-${scam.id}`}
                        >
                          <Send className="w-3 h-3 mr-1" /> Publish
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function AlertsTab() {
  const { toast } = useToast();
  const { data: alerts = [], isLoading, isError, error, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["/api/alerts"],
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/admin/threat-alerts/${id}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      toast({ title: "Alert published", description: "Social posts and email notifications triggered." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to publish alert.", variant: "destructive" });
    },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading alerts...</div>;
  if (isError) return <TabErrorState label="Alerts" error={error} onRetry={() => refetch()} isRetrying={isFetching} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radio className="w-5 h-5" />
          Threat Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No threat alerts yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Threat Name</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert: any) => (
                <TableRow key={alert.id} data-testid={`row-alert-${alert.id}`}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.threatName}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{alert.description}</div>
                    </div>
                  </TableCell>
                  <TableCell><RiskBadge level={alert.riskLevel || "medium"} /></TableCell>
                  <TableCell><StatusBadge status={alert.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {alert.publishedAt ? <ClientDate value={alert.publishedAt} /> : "Not yet"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/alerts/${alert.slug}`, "_blank")}
                        data-testid={`btn-view-alert-${alert.id}`}
                      >
                        <Eye className="w-3 h-3 mr-1" /> View
                      </Button>
                      {alert.status !== "published" && (
                        <Button
                          size="sm"
                          onClick={() => publishMutation.mutate(alert.id)}
                          disabled={publishMutation.isPending}
                          data-testid={`btn-publish-alert-${alert.id}`}
                        >
                          <Send className="w-3 h-3 mr-1" /> Publish
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

const PLATFORM_COLORS: Record<string, string> = {
  linkedin: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  x: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  instagram: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  facebook: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  alert: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  x: "X (Twitter)",
  instagram: "Instagram",
  facebook: "Facebook",
  alert: "Email Alert",
};

function ConnectedPlatforms() {
  const { data } = useQuery<{ platforms: any[]; buffer: any }>({
    queryKey: ["/api/admin/social/connected-platforms"],
  });

  const platforms = data?.platforms || [];

  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((p: any) => (
        <div
          key={p.name}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            p.isConfigured
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-muted text-muted-foreground"
          }`}
          data-testid={`status-platform-${p.name}`}
        >
          {p.isConfigured ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {PLATFORM_LABELS[p.name] || p.name}
        </div>
      ))}
    </div>
  );
}

function SocialPostCard({ post, onPublish, isPublishing }: { post: any; onPublish: (id: string) => void; isPublishing: boolean }) {
  const platformColor = PLATFORM_COLORS[post.platform] || "bg-muted text-muted-foreground";
  const content = post.postContent || post.content || "";

  return (
    <Card className="overflow-hidden" data-testid={`card-social-${post.id}`}>
      <div className="flex flex-col sm:flex-row">
        {post.imageUrl && (
          <div className="sm:w-40 h-32 sm:h-auto bg-muted flex-shrink-0">
            <img
              src={`/api/social-images/${post.imageUrl.split('/').pop()}`}
              alt="Post preview"
              className="w-full h-full object-cover"
              data-testid={`img-social-${post.id}`}
            />
          </div>
        )}
        <div className="flex-1 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${platformColor}`}>
                {PLATFORM_LABELS[post.platform] || post.platform}
              </span>
              <Badge variant="secondary" className="text-xs">{post.contentType?.replace("_", " ")}</Badge>
              <StatusBadge status={post.status} />
            </div>
            <span className="text-xs text-muted-foreground">
              {post.createdAt ? <ClientDate value={post.createdAt} /> : ""}
            </span>
          </div>

          {post.contentTitle && (
            <p className="text-sm font-medium text-foreground">{post.contentTitle}</p>
          )}

          <p className="text-sm text-muted-foreground line-clamp-3 whitespace-pre-wrap">{content}</p>

          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Hash className="w-3 h-3 text-muted-foreground" />
              {post.hashtags.slice(0, 5).map((tag: string) => (
                <span key={tag} className="text-xs text-primary/70">#{tag}</span>
              ))}
            </div>
          )}

          {post.publishError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2 py-1 rounded">
              <XCircle className="w-3 h-3 flex-shrink-0" />
              <span className="line-clamp-1">{post.publishError}</span>
            </div>
          )}

          {(post.auditVerdict || (post.citations && post.citations.length > 0)) && (
            <div className="text-xs space-y-1 border-t pt-2" data-testid={`audit-${post.id}`}>
              {post.auditVerdict && (
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Audit:</span>
                  <Badge
                    variant={post.auditVerdict === "passed" || post.auditVerdict === "approved_by_admin" ? "default" : "destructive"}
                    className="text-[10px]"
                  >
                    {post.auditVerdict}
                  </Badge>
                  {post.imageSource && (() => {
                    const labels: Record<string, string> = {
                      source_artifact: "Source artifact",
                      data_chart: "Data chart",
                      licensed_photo: "Licensed photo",
                      branded_card: "Branded card",
                      illustration_ai: "AI illustration",
                      stock_or_branded: "Branded card",
                      branded: "Branded card",
                      stock: "Licensed photo",
                      source: "Source artifact",
                      og: "Source artifact",
                      ai: "AI illustration",
                    };
                    const tone: Record<string, string> = {
                      source_artifact: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
                      data_chart: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
                      licensed_photo: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                      branded_card: "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200",
                      illustration_ai: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300",
                    };
                    const legacyToTyped: Record<string, string> = {
                      stock_or_branded: "branded_card",
                      branded: "branded_card",
                      stock: "licensed_photo",
                      source: "source_artifact",
                      og: "source_artifact",
                      ai: "illustration_ai",
                    };
                    const typedKey = legacyToTyped[post.imageSource] || post.imageSource;
                    const cls = tone[typedKey] || tone.branded_card;
                    return (
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${cls}`}
                        data-testid={`badge-image-source-${post.id}`}
                      >
                        img: {labels[post.imageSource] || post.imageSource}
                      </Badge>
                    );
                  })()}
                </div>
              )}
              {post.auditFailures && post.auditFailures.length > 0 && (
                <div className="text-red-600 dark:text-red-400">
                  {post.auditFailures.slice(0, 3).map((f: any, i: number) => {
                    let label: string;
                    if (typeof f === "string") {
                      label = f;
                    } else if (f && typeof f === "object") {
                      label = f.reason || f.claim || f.message || f.detail || JSON.stringify(f);
                    } else {
                      label = String(f);
                    }
                    return (
                      <div key={i} className="line-clamp-1" data-testid={`audit-failure-${post.id}-${i}`}>• {label}</div>
                    );
                  })}
                </div>
              )}
              {post.citations && post.citations.length > 0 && (
                <div className="text-muted-foreground">
                  Sources:{" "}
                  {post.citations.slice(0, 3).map((c: any, i: number) => (
                    <span key={i}>
                      {i > 0 && ", "}
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
                          {c.publisher || c.name}
                        </a>
                      ) : (
                        c.publisher || c.name
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            {post.status === "published" ? (
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Published
                {post.publishedAt && (
                  <>
                    {" "}on <ClientDate value={post.publishedAt} />
                  </>
                )}
              </span>
            ) : post.platform !== "alert" ? (
              <Button
                size="sm"
                variant="default"
                onClick={() => onPublish(post.id)}
                disabled={isPublishing}
                data-testid={`button-publish-${post.id}`}
                className="h-7 text-xs"
              >
                {isPublishing ? (
                  <><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Publishing...</>
                ) : (
                  <><Rocket className="w-3 h-3 mr-1" /> Publish to {PLATFORM_LABELS[post.platform] || post.platform}</>
                )}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SocialPostsTab() {
  const { toast } = useToast();
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const { data: posts = [], isLoading, isError, error, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["/api/admin/social-posts"],
  });

  const publishMutation = useMutation({
    mutationFn: async (postId: string) => {
      setPublishingId(postId);
      const res = await apiRequest("POST", `/api/admin/social-posts/${postId}/publish`);
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: data.success ? "Published!" : "Publish Failed",
        description: data.success
          ? `Post published to ${data.platform}`
          : data.error || "Could not publish post",
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-posts"] });
      setPublishingId(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to publish post", variant: "destructive" });
      setPublishingId(null);
    },
  });

  const publishAllMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/social-posts/publish-all");
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Bulk Publish Complete",
        description: `${data.succeeded} published, ${data.failed} failed out of ${data.total} posts`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-posts"] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to publish posts", variant: "destructive" });
    },
  });

  const filteredPosts = filter === "all" ? posts : posts.filter((p: any) => p.platform === filter);
  const draftCount = posts.filter((p: any) => p.status === "draft").length;
  const publishedCount = posts.filter((p: any) => p.status === "published").length;
  const failedCount = posts.filter((p: any) => p.status === "failed").length;

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading social posts...</div>;
  if (isError) return <TabErrorState label="Social Posts" error={error} onRetry={() => refetch()} isRetrying={isFetching} />;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Social Posts ({posts.length})
            </CardTitle>
            <ConnectedPlatforms />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1.5 text-sm">
                <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 font-medium">{draftCount} Drafts</span>
                <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium">{publishedCount} Published</span>
                {failedCount > 0 && <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 font-medium">{failedCount} Failed</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border rounded px-2 py-1 bg-background"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                data-testid="select-platform-filter"
              >
                <option value="all">All Platforms</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X (Twitter)</option>
                <option value="instagram">Instagram</option>
                <option value="alert">Email Alerts</option>
              </select>
              {draftCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => publishAllMutation.mutate()}
                  disabled={publishAllMutation.isPending}
                  data-testid="button-publish-all"
                >
                  {publishAllMutation.isPending ? (
                    <><RefreshCw className="w-3.5 h-3.5 mr-1 animate-spin" /> Publishing...</>
                  ) : (
                    <><Rocket className="w-3.5 h-3.5 mr-1" /> Publish All Drafts</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {filter === "all"
                ? "No social posts yet. They are auto-generated when you publish content."
                : `No ${PLATFORM_LABELS[filter] || filter} posts found.`}
            </p>
          ) : (
            <div className="grid gap-3">
              {filteredPosts.map((post: any) => (
                <SocialPostCard
                  key={post.id}
                  post={post}
                  onPublish={(id) => publishMutation.mutate(id)}
                  isPublishing={publishingId === post.id && publishMutation.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewQueueTab() {
  const { toast } = useToast();
  const [actingId, setActingId] = useState<string | null>(null);

  const { data: posts = [], isLoading, isError, error, refetch, isFetching } = useQuery<any[]>({
    queryKey: ["/api/admin/social-posts/review-queue"],
    refetchInterval: 30000,
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      setActingId(id);
      const res = await apiRequest("POST", `/api/admin/social-posts/${id}/approve`);
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: data.success ? "Approved & Published" : "Approved (publish failed)",
        description: data.success ? `Sent to ${data.platform}` : data.error || "Manual retry needed",
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-posts/review-queue"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-posts"] });
      setActingId(null);
    },
    onError: () => { toast({ title: "Error", description: "Approve failed", variant: "destructive" }); setActingId(null); },
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftContent, setDraftContent] = useState("");
  const editMutation = useMutation({
    mutationFn: async ({ id, postContent }: { id: string; postContent: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/social-posts/${id}`, { postContent });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Saved", description: "Post content updated. Re-audit will run on approve." });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-posts/review-queue"] });
      setEditingId(null);
    },
    onError: () => { toast({ title: "Error", description: "Save failed", variant: "destructive" }); },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      setActingId(id);
      const res = await apiRequest("POST", `/api/admin/social-posts/${id}/reject`, { reason: "Rejected from review queue" });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Rejected", description: "Post discarded" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/social-posts/review-queue"] });
      setActingId(null);
    },
    onError: () => { toast({ title: "Error", description: "Reject failed", variant: "destructive" }); setActingId(null); },
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading review queue...</div>;
  if (isError) return <TabErrorState label="Review Queue" error={error} onRetry={() => refetch()} isRetrying={isFetching} />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" /> Review Queue ({posts.length})
        </CardTitle>
        <p className="text-xs text-muted-foreground">Reactive trend posts awaiting admin approval. Auto-discard after 30 minutes.</p>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No posts pending review.</p>
        ) : (
          <div className="grid gap-3">
            {posts.map((post: any) => (
              <div key={post.id} className="space-y-2">
                <SocialPostCard post={post} onPublish={() => {}} isPublishing={false} />
                {editingId === post.id ? (
                  <div className="px-2 space-y-2" data-testid={`editor-${post.id}`}>
                    <Textarea
                      value={draftContent}
                      onChange={(e) => setDraftContent(e.target.value)}
                      rows={6}
                      className="font-mono text-xs"
                      data-testid={`textarea-edit-${post.id}`}
                    />
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => editMutation.mutate({ id: post.id, postContent: draftContent })}
                        disabled={editMutation.isPending || draftContent.trim().length < 20}
                        data-testid={`button-save-edit-${post.id}`}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { setEditingId(null); setDraftContent(""); }}
                        data-testid={`button-cancel-edit-${post.id}`}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-2">
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(post.id)}
                      disabled={actingId === post.id}
                      data-testid={`button-approve-${post.id}`}
                    >
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve & Publish
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingId(post.id); setDraftContent(post.postContent || ""); }}
                      disabled={actingId === post.id}
                      data-testid={`button-edit-${post.id}`}
                    >
                      <Pencil className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectMutation.mutate(post.id)}
                      disabled={actingId === post.id}
                      data-testid={`button-reject-${post.id}`}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                    {post.reviewExpiresAt && (
                      <span className="text-xs text-muted-foreground">
                        Expires <ClientDate value={post.reviewExpiresAt} mode="time" />
                      </span>
                    )}
                    {post.notifiedAt ? (
                      <Badge
                        variant="secondary"
                        className="text-xs"
                        data-testid={`badge-notified-${post.id}`}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Notified <ClientDate value={post.notifiedAt} mode="time" />
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        data-testid={`badge-not-notified-${post.id}`}
                      >
                        Awaiting digest
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminContentManager() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) setLocation("/");
  }, [adminCheckLoading, adminCheck, setLocation]);

  if (authLoading || adminCheckLoading) {
    return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-content-manager-heading">Content Manager</h1>
          <p className="text-muted-foreground">Manage, review, and publish all platform content. Publishing auto-generates social posts and sends email alerts for critical threats.</p>
        </div>

        <Tabs defaultValue="guides" className="w-full">
          <TabsList className="grid w-full grid-cols-5" data-testid="tabs-content-manager">
            <TabsTrigger value="guides" data-testid="tab-guides">Guides</TabsTrigger>
            <TabsTrigger value="scam-intel" data-testid="tab-scam-intel">Scam Intel</TabsTrigger>
            <TabsTrigger value="alerts" data-testid="tab-alerts">Alerts</TabsTrigger>
            <TabsTrigger value="review-queue" data-testid="tab-review-queue">Review Queue</TabsTrigger>
            <TabsTrigger value="social" data-testid="tab-social">Social Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="guides"><GuidesTab /></TabsContent>
          <TabsContent value="scam-intel"><ScamIntelTab /></TabsContent>
          <TabsContent value="alerts"><AlertsTab /></TabsContent>
          <TabsContent value="review-queue"><ReviewQueueTab /></TabsContent>
          <TabsContent value="social"><SocialPostsTab /></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
