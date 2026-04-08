"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Loader2,
  FileText,
  AlertTriangle,
  Eye,
  Zap,
  TrendingUp,
  Plus,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AiPrompt {
  id: string;
  slug: string;
  title: string;
  promptText: string;
  audience: string[];
  category: string;
  tags: string[];
  useCase: string;
  safetyNote: string | null;
  iconName: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface PromptReview {
  id: string;
  promptId: string | null;
  reviewType: string;
  proposedTitle: string | null;
  proposedPromptText: string | null;
  proposedTags: string[] | null;
  proposedUseCase: string | null;
  proposedSafetyNote: string | null;
  proposedAudience: string[] | null;
  proposedCategory: string | null;
  proposedIconName: string | null;
  rationale: string | null;
  qualityScore: number | null;
  aiModel: string | null;
  status: string;
  reviewRunId: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface PromptReviewRun {
  id: string;
  status: string;
  triggerType: string;
  promptsReviewed: number;
  improvementsSuggested: number;
  newPromptsSuggested: number;
  summary: string | null;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    case "approved":
      return <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
    case "rejected":
      return <Badge variant="outline" className="text-red-600 border-red-300 dark:text-red-400 dark:border-red-600"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

function RunStatusBadge({ status }: { status: string }) {
  switch (status) {
    case "running":
      return <Badge variant="outline" className="text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" />Running</Badge>;
    case "completed":
      return <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-600"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
    case "failed":
      return <Badge variant="outline" className="text-red-600 border-red-300 dark:text-red-400 dark:border-red-600"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function AdminPromptManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReview, setSelectedReview] = useState<PromptReview | null>(null);
  const [selectedTab, setSelectedTab] = useState("reviews");

  const { data: prompts, isLoading: promptsLoading } = useQuery<AiPrompt[]>({
    queryKey: ["/api/admin/prompts"],
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<PromptReview[]>({
    queryKey: ["/api/admin/prompt-reviews"],
  });

  const { data: runs, isLoading: runsLoading } = useQuery<PromptReviewRun[]>({
    queryKey: ["/api/admin/prompt-review-runs"],
  });

  const approveMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await apiRequest("POST", `/api/admin/prompt-reviews/${reviewId}/approve`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/prompt-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/prompts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/prompts"] });
      setSelectedReview(null);
      toast({ title: "Review approved", description: "The suggested changes have been applied." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve the review.", variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const res = await apiRequest("POST", `/api/admin/prompt-reviews/${reviewId}/reject`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/prompt-reviews"] });
      setSelectedReview(null);
      toast({ title: "Review rejected", description: "The suggestion has been dismissed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to reject the review.", variant: "destructive" });
    },
  });

  const triggerReviewMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/prompt-reviews/run");
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/prompt-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/prompt-review-runs"] });
      toast({
        title: "Review complete",
        description: `Found ${data.improvements} improvements and ${data.newSuggestions} new prompt ideas.`,
      });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to run prompt review.", variant: "destructive" });
    },
  });

  const pendingReviews = reviews?.filter(r => r.status === "pending") || [];
  const recentReviews = reviews?.slice(0, 50) || [];
  const activePrompts = prompts?.filter(p => p.isActive) || [];

  const getPromptTitle = (promptId: string | null) => {
    if (!promptId || !prompts) return "New Prompt";
    const found = prompts.find(p => p.id === promptId);
    return found?.title || "Unknown Prompt";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <Link href="/admin/security">
            <Button variant="ghost" size="icon" data-testid="button-back-admin">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-page-title">AI Prompt Management</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              AI-powered prompt review, improvement, and creation system.
            </p>
          </div>
          <Button
            onClick={() => triggerReviewMutation.mutate()}
            disabled={triggerReviewMutation.isPending}
            data-testid="button-trigger-review"
          >
            {triggerReviewMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Run AI Review Now
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card data-testid="card-stat-active">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activePrompts.length}</p>
                  <p className="text-xs text-muted-foreground">Active Prompts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-pending">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingReviews.length}</p>
                  <p className="text-xs text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-improvements">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {reviews?.filter(r => r.status === "approved").length || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Approved Changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="card-stat-runs">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{runs?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Review Runs</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              Pending Reviews {pendingReviews.length > 0 && `(${pendingReviews.length})`}
            </TabsTrigger>
            <TabsTrigger value="prompts" data-testid="tab-prompts">All Prompts</TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">Review History</TabsTrigger>
            <TabsTrigger value="runs" data-testid="tab-runs">Run Log</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews">
            {reviewsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : pendingReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1" data-testid="text-no-pending">All caught up</h3>
                  <p className="text-sm text-muted-foreground">
                    No pending AI suggestions. Run a review to check for improvements.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pendingReviews.map(review => (
                  <Card key={review.id} className="hover-elevate cursor-pointer" data-testid={`card-review-${review.id}`}>
                    <CardContent className="p-4" onClick={() => setSelectedReview(review)}>
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            {review.reviewType === "new_prompt" ? (
                              <Badge variant="secondary"><Plus className="w-3 h-3 mr-1" />New Prompt</Badge>
                            ) : (
                              <Badge variant="secondary"><Edit className="w-3 h-3 mr-1" />Improvement</Badge>
                            )}
                            <StatusBadge status={review.status} />
                            {review.qualityScore !== null && (
                              <Badge variant="outline">Score: {review.qualityScore}/100</Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-foreground text-sm">
                            {review.reviewType === "new_prompt"
                              ? review.proposedTitle || "Untitled"
                              : `Improve: ${getPromptTitle(review.promptId)}`}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {review.rationale}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedReview(review);
                            }}
                            data-testid={`button-view-review-${review.id}`}
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              approveMutation.mutate(review.id);
                            }}
                            disabled={approveMutation.isPending}
                            data-testid={`button-approve-${review.id}`}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              rejectMutation.mutate(review.id);
                            }}
                            disabled={rejectMutation.isPending}
                            data-testid={`button-reject-${review.id}`}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="prompts">
            {promptsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {prompts?.map(prompt => (
                  <Card key={prompt.id} data-testid={`card-prompt-admin-${prompt.slug}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-foreground text-sm">{prompt.title}</h4>
                            <Badge variant="secondary" className="text-xs">{prompt.category}</Badge>
                            {!prompt.isActive && (
                              <Badge variant="outline" className="text-red-600 dark:text-red-400 text-xs">Inactive</Badge>
                            )}
                            <span className="text-xs text-muted-foreground">v{prompt.version}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{prompt.useCase}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {prompt.audience?.map(a => (
                            <span key={a} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{a}</span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {reviewsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentReviews.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No review history yet. Run an AI review to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {recentReviews.map(review => (
                  <Card key={review.id} data-testid={`card-history-${review.id}`}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <StatusBadge status={review.status} />
                            <Badge variant="secondary" className="text-xs">
                              {review.reviewType === "new_prompt" ? "New" : "Improvement"}
                            </Badge>
                            {review.qualityScore !== null && (
                              <span className="text-xs text-muted-foreground">Score: {review.qualityScore}</span>
                            )}
                          </div>
                          <h4 className="font-medium text-foreground text-sm">
                            {review.reviewType === "new_prompt"
                              ? review.proposedTitle
                              : getPromptTitle(review.promptId)}
                          </h4>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="runs">
            {runsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : !runs || runs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No review runs yet. Click "Run AI Review Now" to start.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {runs.map(run => (
                  <Card key={run.id} data-testid={`card-run-${run.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <RunStatusBadge status={run.status} />
                            <Badge variant="outline" className="text-xs capitalize">{run.triggerType}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{run.summary || "In progress..."}</p>
                          {run.errorMessage && (
                            <p className="text-xs text-red-500 mt-1">{run.errorMessage}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>{new Date(run.startedAt).toLocaleString()}</p>
                          {run.completedAt && (
                            <p>
                              Duration: {Math.round((new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()) / 1000)}s
                            </p>
                          )}
                        </div>
                      </div>
                      {run.status === "completed" && (
                        <div className="flex items-center gap-4 mt-3 pt-3 border-t flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            Reviewed: <strong className="text-foreground">{run.promptsReviewed}</strong>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Improvements: <strong className="text-foreground">{run.improvementsSuggested}</strong>
                          </span>
                          <span className="text-xs text-muted-foreground">
                            New Ideas: <strong className="text-foreground">{run.newPromptsSuggested}</strong>
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 flex-wrap" data-testid="text-review-dialog-title">
                  {selectedReview.reviewType === "new_prompt" ? (
                    <>
                      <Plus className="w-4 h-4" />
                      New Prompt Suggestion
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Improvement for: {getPromptTitle(selectedReview.promptId)}
                    </>
                  )}
                </DialogTitle>
                <DialogDescription>
                  AI Model: {selectedReview.aiModel || "Unknown"}
                  {selectedReview.qualityScore !== null && ` | Quality Score: ${selectedReview.qualityScore}/100`}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-4 pr-4">
                  {selectedReview.rationale && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Why this change:</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                        {selectedReview.rationale}
                      </p>
                    </div>
                  )}

                  {selectedReview.proposedTitle && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Title:</h4>
                      <p className="text-sm text-foreground bg-green-50 dark:bg-green-900/10 rounded-md p-2">
                        {selectedReview.proposedTitle}
                      </p>
                    </div>
                  )}

                  {selectedReview.proposedPromptText && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Prompt Text:</h4>
                      <pre className="text-xs text-foreground bg-muted/50 rounded-md p-3 whitespace-pre-wrap font-mono max-h-60 overflow-auto">
                        {selectedReview.proposedPromptText}
                      </pre>
                    </div>
                  )}

                  {selectedReview.proposedUseCase && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Use Case:</h4>
                      <p className="text-sm text-muted-foreground">{selectedReview.proposedUseCase}</p>
                    </div>
                  )}

                  {selectedReview.proposedSafetyNote && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Safety Note:</h4>
                      <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-md p-2">
                        {selectedReview.proposedSafetyNote}
                      </p>
                    </div>
                  )}

                  {selectedReview.proposedTags && selectedReview.proposedTags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Tags:</h4>
                      <div className="flex gap-1 flex-wrap">
                        {selectedReview.proposedTags.map(tag => (
                          <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReview.proposedAudience && selectedReview.proposedAudience.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Audience:</h4>
                      <div className="flex gap-1 flex-wrap">
                        {selectedReview.proposedAudience.map(a => (
                          <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReview.proposedCategory && (
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-1">Category:</h4>
                      <Badge variant="outline">{selectedReview.proposedCategory}</Badge>
                    </div>
                  )}
                </div>
              </ScrollArea>
              {selectedReview.status === "pending" && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => rejectMutation.mutate(selectedReview.id)}
                    disabled={rejectMutation.isPending}
                    data-testid="button-dialog-reject"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => approveMutation.mutate(selectedReview.id)}
                    disabled={approveMutation.isPending}
                    data-testid="button-dialog-approve"
                  >
                    {approveMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    Approve Changes
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
