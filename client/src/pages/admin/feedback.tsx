"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  MessageSquare, Bug, Lightbulb, HelpCircle, Star, FileText, 
  Clock, CheckCircle2, XCircle, Loader2, Mail, Globe, ExternalLink
} from "lucide-react";
import type { UserFeedback } from "@shared/schema";

const categoryConfig: Record<string, { label: string; icon: typeof Bug; color: string }> = {
  bug: { label: "Bug Report", icon: Bug, color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  feature: { label: "Feature Request", icon: Lightbulb, color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  question: { label: "Question", icon: HelpCircle, color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  praise: { label: "Praise", icon: Star, color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  other: { label: "Other", icon: FileText, color: "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300" },
};

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  new: { label: "New", icon: MessageSquare, color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  in_progress: { label: "In Progress", icon: Loader2, color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  dismissed: { label: "Dismissed", icon: XCircle, color: "bg-gray-100 text-gray-700 dark:bg-gray-950 dark:text-gray-300" },
};

export default function AdminFeedback() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data, isLoading } = useQuery<{ feedback: UserFeedback[] }>({
    queryKey: ["/api/admin/feedback", filter],
    queryFn: async () => {
      const url = filter === "all" ? "/api/admin/feedback" : `/api/admin/feedback?status=${filter}`;
      const res = await fetch(url, { credentials: "include" });
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, adminNotes }: { id: string; status?: string; adminNotes?: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/feedback/${id}`, { status, adminNotes });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feedback"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Feedback updated" });
    },
  });

  const feedback = data?.feedback || [];
  const newCount = feedback.filter(f => f.status === "new").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground" data-testid="text-feedback-title">
              User Feedback
            </h1>
            <p className="text-muted-foreground mt-1">
              {feedback.length} total{newCount > 0 ? ` (${newCount} new)` : ""}
            </p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-feedback-filter">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feedback</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : feedback.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No feedback yet</h3>
              <p className="text-sm text-muted-foreground/70 mt-1">User feedback will appear here when submitted.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {feedback.map((item) => {
              const cat = categoryConfig[item.category] || categoryConfig.other;
              const stat = statusConfig[item.status] || statusConfig.new;
              const CatIcon = cat.icon;
              const isExpanded = expandedId === item.id;

              return (
                <Card
                  key={item.id}
                  className={`transition-all ${item.status === "new" ? "border-blue-200 dark:border-blue-800" : ""}`}
                  data-testid={`card-feedback-${item.id}`}
                >
                  <CardContent className="p-4">
                    <div
                      className="flex items-start gap-3 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      data-testid={`button-expand-${item.id}`}
                    >
                      <div className={`p-2 rounded-lg ${cat.color} flex-shrink-0`}>
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge className={cat.color} variant="secondary">{cat.label}</Badge>
                          <Badge className={stat.color} variant="secondary">{stat.label}</Badge>
                          {item.page && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {item.page}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">{item.message}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt!).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {item.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {item.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-border space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                        </div>

                        {item.email && (
                          <a
                            href={`mailto:${item.email}?subject=Re: Your feedback on GetCyberRight`}
                            className="inline-flex items-center gap-1 text-sm text-teal-600 hover:underline"
                            data-testid={`link-reply-${item.id}`}
                          >
                            <ExternalLink className="w-3 h-3" />
                            Reply via email
                          </a>
                        )}

                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Admin Notes</label>
                          <Textarea
                            placeholder="Add internal notes..."
                            value={notes[item.id] ?? item.adminNotes ?? ""}
                            onChange={(e) => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                            className="min-h-[60px] text-sm"
                            data-testid={`input-notes-${item.id}`}
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Select
                            value={item.status}
                            onValueChange={(val) => {
                              updateMutation.mutate({
                                id: item.id,
                                status: val,
                                adminNotes: notes[item.id] ?? item.adminNotes ?? undefined,
                              });
                            }}
                          >
                            <SelectTrigger className="w-[150px]" data-testid={`select-status-${item.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="resolved">Resolved</SelectItem>
                              <SelectItem value="dismissed">Dismissed</SelectItem>
                            </SelectContent>
                          </Select>

                          {(notes[item.id] !== undefined && notes[item.id] !== (item.adminNotes ?? "")) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                updateMutation.mutate({
                                  id: item.id,
                                  adminNotes: notes[item.id],
                                });
                              }}
                              disabled={updateMutation.isPending}
                              data-testid={`button-save-notes-${item.id}`}
                            >
                              Save Notes
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
