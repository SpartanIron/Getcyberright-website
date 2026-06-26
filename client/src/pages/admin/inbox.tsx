"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Inbox,
  Mail,
  MessageSquare,
  AlertTriangle,
  MessageCircle,
  Trash2,
  ExternalLink,
  Bookmark,
  Plus,
  Loader2,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { InboxReplyPanel } from "@/components/admin/inbox-reply-panel";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { SavedReply } from "@shared/schema";

type InboxType = "contact" | "feedback" | "scam" | "comment";

interface InboxItem {
  id: string;
  type: InboxType;
  name: string;
  email: string | null;
  category: string | null;
  title: string;
  preview: string;
  createdAt: string | null;
  answered: boolean;
  replyCount: number;
  canReply: boolean;
  status: string | null;
  unanswered: boolean;
  meta: {
    page?: string;
    scammerContact?: string;
    amountLost?: string;
    anonymous?: boolean;
    articleSlug?: string;
    articleTitle?: string;
  };
}

interface InboxResponse {
  items: InboxItem[];
  counts: {
    total: number;
    unanswered: number;
    contact: number;
    feedback: number;
    scam: number;
    comment: number;
  };
}

const TYPE_META: Record<
  InboxType,
  { label: string; icon: typeof Mail; badge: string }
> = {
  contact: { label: "Message", icon: Mail, badge: "bg-blue-500" },
  feedback: { label: "Feedback", icon: MessageSquare, badge: "bg-amber-500" },
  scam: { label: "Scam report", icon: AlertTriangle, badge: "bg-red-500" },
  comment: { label: "Comment", icon: MessageCircle, badge: "bg-purple-500" },
};

function formatDate(value: string | null): string {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminInbox() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [typeFilter, setTypeFilter] = useState<"all" | InboxType>("all");
  const [answerFilter, setAnswerFilter] = useState<"all" | "unanswered">("unanswered");

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const inboxKey = ["/api/admin/inbox", answerFilter, typeFilter];
  const { data, isLoading } = useQuery<InboxResponse>({
    queryKey: inboxKey,
    enabled: adminCheck?.isAdmin === true,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (answerFilter === "unanswered") params.set("filter", "unanswered");
      if (typeFilter !== "all") params.set("type", typeFilter);
      const qs = params.toString();
      const res = await fetch(`/api/admin/inbox${qs ? `?${qs}` : ""}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to load inbox");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (item: InboxItem) => {
      const endpoint =
        item.type === "contact"
          ? `/api/admin/contact-messages/${item.id}`
          : item.type === "scam"
            ? `/api/admin/scam-reports/${item.id}`
            : item.type === "comment"
              ? `/api/admin/comments/${item.id}`
              : `/api/admin/feedback/${item.id}`;
      if (item.type === "feedback") {
        // feedback has no hard-delete endpoint; mark as dismissed instead
        return apiRequest("PATCH", endpoint, { status: "dismissed" });
      }
      return apiRequest("DELETE", endpoint);
    },
    onSuccess: (_res, item) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inbox"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: item.type === "feedback" ? "Feedback dismissed" : "Item deleted",
      });
    },
    onError: () => {
      toast({ title: "Action failed", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) setLocation("/api/login");
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) setLocation("/");
  }, [adminCheckLoading, adminCheck, setLocation]);

  if (authLoading || adminCheckLoading || !adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const items = data?.items || [];
  const counts = data?.counts;

  const typeChips: { key: "all" | InboxType; label: string; count?: number }[] = [
    { key: "all", label: "All", count: counts?.total },
    { key: "contact", label: "Messages", count: counts?.contact },
    { key: "feedback", label: "Feedback", count: counts?.feedback },
    { key: "comment", label: "Comments", count: counts?.comment },
    { key: "scam", label: "Scam reports", count: counts?.scam },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Inbox className="w-8 h-8" />
              Inbox
            </h1>
            <p className="text-muted-foreground mt-1">
              Every message, feedback note, scam report, and comment in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {counts && counts.unanswered > 0 && (
              <Badge variant="outline" className="text-base px-3 py-1 border-amber-500 text-amber-600">
                {counts.unanswered} need a reply
              </Badge>
            )}
            <SavedRepliesManager />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border p-1">
            <Button
              variant={answerFilter === "unanswered" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAnswerFilter("unanswered")}
              data-testid="filter-unanswered"
            >
              Needs reply
            </Button>
            <Button
              variant={answerFilter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setAnswerFilter("all")}
              data-testid="filter-all"
            >
              All
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {typeChips.map((chip) => (
              <Button
                key={chip.key}
                variant={typeFilter === chip.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(chip.key)}
                data-testid={`filter-type-${chip.key}`}
              >
                {chip.label}
                {typeof chip.count === "number" && (
                  <span className="ml-1.5 text-xs opacity-70">{chip.count}</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading inbox...</div>
            ) : items.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                {answerFilter === "unanswered"
                  ? "Nothing waiting for a reply. You're all caught up."
                  : "No items found."}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const meta = TYPE_META[item.type];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex items-start gap-3 p-4 hover:bg-muted/40 transition-colors"
                      data-testid={`inbox-item-${item.id}`}
                    >
                      <div className="mt-0.5">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={`${meta.badge} text-white`}>{meta.label}</Badge>
                          <span className="font-medium text-foreground truncate">{item.name}</span>
                          {item.unanswered ? (
                            <Badge variant="outline" className="border-amber-500 text-amber-600">
                              Needs reply
                            </Badge>
                          ) : item.answered ? (
                            <Badge variant="outline" className="border-green-600 text-green-600">
                              Answered
                            </Badge>
                          ) : !item.canReply ? (
                            <Badge variant="outline" className="text-muted-foreground">
                              No reply address
                            </Badge>
                          ) : null}
                          {item.type === "feedback" && item.status && (
                            <Badge variant="secondary">{item.status}</Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground/90 mt-1 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {item.preview}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" data-testid={`button-open-${item.id}`}>
                              Open
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Badge className={`${meta.badge} text-white`}>{meta.label}</Badge>
                                {item.title}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-muted-foreground">From:</span>
                                  <p className="font-medium">{item.name}</p>
                                </div>
                                {item.email && (
                                  <div>
                                    <span className="text-muted-foreground">Email:</span>
                                    <p className="font-medium break-all">{item.email}</p>
                                  </div>
                                )}
                                {item.meta.page && (
                                  <div>
                                    <span className="text-muted-foreground">Page:</span>
                                    <p className="font-medium break-all">{item.meta.page}</p>
                                  </div>
                                )}
                                {item.meta.scammerContact && (
                                  <div>
                                    <span className="text-muted-foreground">Scammer contact:</span>
                                    <p className="font-medium break-all">{item.meta.scammerContact}</p>
                                  </div>
                                )}
                                {item.meta.amountLost && (
                                  <div>
                                    <span className="text-muted-foreground">Amount lost:</span>
                                    <p className="font-medium">{item.meta.amountLost}</p>
                                  </div>
                                )}
                                <div>
                                  <span className="text-muted-foreground">Received:</span>
                                  <p className="font-medium">{formatDate(item.createdAt)}</p>
                                </div>
                              </div>

                              <div>
                                <span className="text-sm text-muted-foreground">
                                  {item.type === "comment" ? "Comment:" : "Message:"}
                                </span>
                                <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-md text-sm">
                                  {item.preview}
                                </p>
                              </div>

                              {item.type === "comment" && item.meta.articleSlug && (
                                <a
                                  href={`/news/${item.meta.articleSlug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                                  data-testid={`link-article-${item.id}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  View article thread
                                </a>
                              )}

                              <div className="border-t border-border pt-4">
                                <InboxReplyPanel
                                  type={item.type}
                                  id={item.id}
                                  email={item.email}
                                  articleSlug={item.meta.articleSlug}
                                  defaultSubject={
                                    item.type === "contact"
                                      ? "Re: Your message to GetCyberRight"
                                      : item.type === "feedback"
                                        ? "Re: Your feedback to GetCyberRight"
                                        : "Re: Your scam report to GetCyberRight"
                                  }
                                />
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-delete-${item.id}`}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {item.type === "feedback" ? "Dismiss this feedback?" : "Delete this item?"}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {item.type === "feedback"
                                  ? "This marks the feedback as dismissed and removes it from the needs-reply queue."
                                  : "This permanently removes the item. This action cannot be undone."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(item)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                {item.type === "feedback" ? "Dismiss" : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function SavedRepliesManager() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data, isLoading } = useQuery<{ savedReplies: SavedReply[] }>({
    queryKey: ["/api/admin/saved-replies"],
    enabled: open,
  });
  const savedReplies = data?.savedReplies || [];

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/saved-replies", {
        title: title.trim(),
        body: body.trim(),
      });
      return res.json();
    },
    onSuccess: () => {
      setTitle("");
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/saved-replies"] });
      toast({ title: "Saved reply added" });
    },
    onError: (err: any) => {
      toast({ title: "Could not save", description: err?.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/admin/saved-replies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/saved-replies"] });
      toast({ title: "Saved reply removed" });
    },
  });

  const canCreate = title.trim().length > 0 && body.trim().length > 0 && !createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-manage-saved-replies">
          <Bookmark className="w-4 h-4 mr-1.5" />
          Saved replies
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved replies</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 rounded-lg border border-border p-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (e.g. Thanks for reporting)"
              maxLength={120}
              data-testid="input-saved-reply-title"
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="The canned message text..."
              rows={4}
              maxLength={5000}
              data-testid="input-saved-reply-body"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={() => createMutation.mutate()}
                disabled={!canCreate}
                data-testid="button-add-saved-reply"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 mr-1.5" />
                    Add saved reply
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : savedReplies.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved replies yet. Add one above to reuse it when responding.
            </p>
          ) : (
            <div className="space-y-2">
              {savedReplies.map((r) => (
                <div
                  key={r.id}
                  className="rounded-lg border border-border p-3 flex items-start gap-2"
                  data-testid={`saved-reply-${r.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap mt-0.5">{r.body}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(r.id)}
                    data-testid={`button-delete-saved-reply-${r.id}`}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
