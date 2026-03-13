import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
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
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status] || variants.draft}`}>
      {status === "published" && <CheckCircle className="w-3 h-3 mr-1" />}
      {status === "draft" && <Clock className="w-3 h-3 mr-1" />}
      {status === "archived" && <FileText className="w-3 h-3 mr-1" />}
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
  const { data: guides = [], isLoading } = useQuery<any[]>({
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
                    {guide.publishedAt ? new Date(guide.publishedAt).toLocaleDateString() : "Not yet"}
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
  const { data: scams = [], isLoading } = useQuery<any[]>({
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
  const { data: alerts = [], isLoading } = useQuery<any[]>({
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
                    {alert.publishedAt ? new Date(alert.publishedAt).toLocaleDateString() : "Not yet"}
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

function SocialPostsTab() {
  const { data: posts = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/social-posts"],
  });

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading social posts...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Social Posts ({posts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No social posts yet. They are auto-generated when you publish content.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Platform</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Content Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post: any) => (
                <TableRow key={post.id} data-testid={`row-social-${post.id}`}>
                  <TableCell>
                    <Badge variant="outline">{post.platform}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md text-sm line-clamp-2">{post.content}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{post.contentType}</Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={post.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
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
          <TabsList className="grid w-full grid-cols-4" data-testid="tabs-content-manager">
            <TabsTrigger value="guides" data-testid="tab-guides">Guides</TabsTrigger>
            <TabsTrigger value="scam-intel" data-testid="tab-scam-intel">Scam Intel</TabsTrigger>
            <TabsTrigger value="alerts" data-testid="tab-alerts">Alerts</TabsTrigger>
            <TabsTrigger value="social" data-testid="tab-social">Social Posts</TabsTrigger>
          </TabsList>
          <TabsContent value="guides"><GuidesTab /></TabsContent>
          <TabsContent value="scam-intel"><ScamIntelTab /></TabsContent>
          <TabsContent value="alerts"><AlertsTab /></TabsContent>
          <TabsContent value="social"><SocialPostsTab /></TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
