"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { 
  Mail, 
  Send, 
  Eye, 
  Calendar, 
  Users, 
  Sparkles, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NewsletterIssue {
  id: string;
  subject: string;
  contentHtml: string;
  contentText: string;
  threatSummary: string | null;
  protectionTip: string | null;
  familyTopic: string | null;
  quickWins: string[] | null;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  recipientCount: number;
  openCount: number;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

interface NewsletterPreview {
  subject: string;
  threatSummary: string;
  protectionTip: string;
  familyTopic: string;
  quickWins: string[];
  contentHtml: string;
  contentText: string;
}

interface SubscriberStats {
  total: number;
  active: number;
  inactive: number;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "sent":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Sent</Badge>;
    case "scheduled":
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</Badge>;
    case "draft":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400">Draft</Badge>;
    case "pending_email_config":
      return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">Pending Config</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function AdminNewsletter() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<NewsletterPreview | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<NewsletterIssue | null>(null);
  const [issuePreviewOpen, setIssuePreviewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: statsData, isLoading: statsLoading } = useQuery<{ success: boolean; stats: SubscriberStats }>({
    queryKey: ["/api/newsletter/stats"],
  });

  const { data: issuesData, isLoading: issuesLoading } = useQuery<{ success: boolean; issues: NewsletterIssue[] }>({
    queryKey: ["/api/newsletter/issues"],
  });

  const previewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("GET", "/api/newsletter/preview");
      return response.json();
    },
    onSuccess: (data) => {
      setPreviewData(data.content);
      setPreviewOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: "Preview Failed",
        description: error.message || "Failed to generate preview",
        variant: "destructive",
      });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/newsletter/generate");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Newsletter Generated",
        description: "Newsletter has been generated and scheduled.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/issues"] });
      setPreviewOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate newsletter",
        variant: "destructive",
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (issueId: string) => {
      const response = await apiRequest("POST", `/api/newsletter/send/${issueId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? "Newsletter Sent" : "Email Not Configured",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/issues"] });
    },
    onError: (error: any) => {
      toast({
        title: "Send Failed",
        description: error.message || "Failed to send newsletter",
        variant: "destructive",
      });
    },
  });

  const stats = statsData?.stats;
  const issues = issuesData?.issues || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild data-testid="button-back-admin">
            <Link href="/admin/security">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Admin
            </Link>
          </Button>
        </div>

        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-lg bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Newsletter Management</h1>
            <p className="text-muted-foreground mt-1">
              Automated weekly cyber safety updates for your subscribers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.total || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Active Subscribers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {statsLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.active || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Newsletters Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {issuesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : issues.filter(i => i.status === "sent").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Next Scheduled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">Friday 9 AM</div>
              <p className="text-xs text-muted-foreground">Weekly automated</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Newsletter Actions</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => previewMutation.mutate()}
              disabled={previewMutation.isPending}
              data-testid="button-preview-newsletter"
            >
              {previewMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Preview Next Issue
            </Button>
            <Button 
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
              data-testid="button-generate-newsletter"
            >
              {generateMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate Newsletter
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Newsletter History
            </CardTitle>
            <CardDescription>
              View and manage past and scheduled newsletters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {issuesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No newsletters generated yet.</p>
                <p className="text-sm mt-1">Click "Generate Newsletter" to create your first issue.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {issues.map((issue) => (
                  <div 
                    key={issue.id} 
                    className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                    data-testid={`newsletter-issue-${issue.id}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{issue.subject}</span>
                        {getStatusBadge(issue.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {issue.recipientCount} recipients
                        </span>
                        {issue.sentAt && (
                          <span className="flex items-center gap-1">
                            <Send className="h-3 w-3" />
                            Sent {new Date(issue.sentAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedIssue(issue);
                          setIssuePreviewOpen(true);
                        }}
                        data-testid={`button-view-issue-${issue.id}`}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {issue.status !== "sent" && (
                        <Button 
                          size="sm"
                          onClick={() => sendMutation.mutate(issue.id)}
                          disabled={sendMutation.isPending}
                          data-testid={`button-send-issue-${issue.id}`}
                        >
                          {sendMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4 mr-1" />
                          )}
                          Send
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <p className="text-sm text-orange-800 dark:text-orange-200">
                Email sending requires an email service integration. Newsletters will be generated and saved, 
                but actual sending will begin once you configure an email provider like Resend or SendGrid.
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                Contact your administrator to set up email delivery.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]" data-testid="dialog-newsletter-preview">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Newsletter Preview
            </DialogTitle>
            <DialogDescription>
              Preview of the next AI-generated newsletter based on this week's threat intelligence
            </DialogDescription>
          </DialogHeader>
          
          {previewMutation.isPending ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Generating newsletter content...</p>
            </div>
          ) : previewData ? (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Subject Line</h3>
                  <p className="bg-muted/50 p-3 rounded-lg">{previewData.subject}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">This Week in Cyber Safety</h3>
                  <p className="text-muted-foreground">{previewData.threatSummary}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Protection Tip of the Week</h3>
                  <p className="text-muted-foreground">{previewData.protectionTip}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Family Conversation Starter</h3>
                  <p className="text-muted-foreground">{previewData.familyTopic}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Quick Security Wins</h3>
                  <ul className="space-y-2">
                    {previewData.quickWins.map((win, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
          ) : null}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending || !previewData}
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate & Schedule
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={issuePreviewOpen} onOpenChange={setIssuePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]" data-testid="dialog-issue-preview">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {selectedIssue?.subject}
            </DialogTitle>
            <DialogDescription>
              {selectedIssue && (
                <span className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedIssue.status)}
                  <span>Created {new Date(selectedIssue.createdAt).toLocaleDateString()}</span>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedIssue && (
            <ScrollArea className="max-h-[60vh]">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: selectedIssue.contentHtml }}
              />
            </ScrollArea>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIssuePreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
