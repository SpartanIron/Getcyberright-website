import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { trackToolUsage } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import {
  Trash2,
  FileText,
  Eye,
  Globe,
  Clock,
  BarChart3,
  Loader2,
  Calendar,
  RefreshCw,
  Send,
  Zap,
} from "lucide-react";

import type { RemovalRequest, DataBroker, VaultProfile } from "@/components/data-removal/types";
import { formatDate, getStatusVariant } from "@/components/data-removal/utils";
import { MonitoringPanel, ComplianceTracker } from "@/components/data-removal/monitoring";

export function RemovalTracker() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: requestsData, isLoading } = useQuery<{ requests: RemovalRequest[] }>({
    queryKey: ["/api/data-removal/requests", statusFilter !== "all" ? statusFilter : ""],
    enabled: isAuthenticated,
  });

  const generateMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/${requestId}/generate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      toast({ title: "Opt-Out Letter Generated", description: "Your opt-out letter has been prepared." });
      trackToolUsage("data-broker-optout-generate", true);
    },
    onError: (error: Error) => {
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-optout-generate", false, { error: error.message });
    },
  });

  const autoSendMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/${requestId}/auto-send`);
      return res.json();
    },
    onSuccess: (data: { success: boolean; method: string; message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({
        title: data.success ? "Removal Request Sent" : "Action Required",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      trackToolUsage("data-broker-auto-send", data.success, { method: data.method });
    },
    onError: (error: Error) => {
      toast({ title: "Auto-Send Failed", description: error.message, variant: "destructive" });
      trackToolUsage("data-broker-auto-send", false, { error: error.message });
    },
  });

  const bulkAutoSendMutation = useMutation({
    mutationFn: async (requestIds: string[]) => {
      const res = await apiRequest("POST", `/api/data-removal/requests/bulk-auto-send`, { requestIds });
      return res.json();
    },
    onSuccess: (data: { results: Array<{ requestId: string; success: boolean; message: string }> }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      const succeeded = data.results.filter((r) => r.success).length;
      const failed = data.results.filter((r) => !r.success).length;
      toast({
        title: "Bulk Auto-Send Complete",
        description: `${succeeded} sent successfully${failed > 0 ? `, ${failed} need manual action` : ""}`,
      });
      trackToolUsage("data-broker-bulk-auto-send", true, { succeeded, failed, total: data.results.length });
    },
    onError: (error: Error) => {
      toast({ title: "Bulk Send Failed", description: error.message, variant: "destructive" });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await apiRequest("PATCH", `/api/data-removal/requests/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/data-removal/dashboard"] });
      toast({ title: "Status Updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Update Failed", description: error.message, variant: "destructive" });
    },
  });

  if (!isAuthenticated) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="p-4 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Sign In to Track Removals</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Track the progress of your data removal requests across all data broker sites.
            </p>
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const requests = requestsData?.requests || [];
  const completed = requests.filter((r) => r.status === "completed").length;
  const progressPercent = requests.length > 0 ? Math.round((completed / requests.length) * 100) : 0;

  const statusOptions = ["all", "pending", "request_sent", "in_progress", "submitted", "awaiting_verification", "confirmed_removed", "completed", "failed", "re_appeared"];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Overall Removal Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{completed} of {requests.length} completed</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Removal Requests
              </CardTitle>
              <div className="flex gap-1 flex-wrap">
                {statusOptions.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className="capitalize"
                    data-testid={`filter-status-${s}`}
                  >
                    {s.replace(/_/g, " ")}
                  </Button>
                ))}
              </div>
            </div>
            {requests.filter((r) => ["not_started", "pending", "request_generated"].includes(r.status)).length > 0 && (
              <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t flex-wrap">
                <p className="text-sm text-muted-foreground">
                  {requests.filter((r) => ["not_started", "pending", "request_generated"].includes(r.status)).length} requests ready to send
                </p>
                <Button
                  size="sm"
                  data-testid="button-bulk-auto-send"
                  onClick={() => {
                    const sendable = requests
                      .filter((r) => ["not_started", "pending", "request_generated"].includes(r.status))
                      .map((r) => r.id);
                    bulkAutoSendMutation.mutate(sendable);
                  }}
                  disabled={bulkAutoSendMutation.isPending}
                >
                  {bulkAutoSendMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-1" />
                  )}
                  Auto-Send All Pending
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-muted-foreground">No removal requests yet.</p>
                <p className="text-sm text-muted-foreground">Run a scan and send removal requests from the Exposure Scan tab.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <div key={req.id} className="border rounded-md">
                    <div className="flex items-start justify-between gap-4 p-4 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{req.brokerName || req.broker?.name || "Unknown"}</p>
                          <Badge variant={getStatusVariant(req.status)} className="capitalize">
                            {req.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {req.brokerDomain || req.broker?.domain || "N/A"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Requested: {formatDate(req.createdAt)}
                          {req.updatedAt && req.updatedAt !== req.createdAt && (
                            <> &middot; Updated: {formatDate(req.updatedAt)}</>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Instructions
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => generateMutation.mutate(req.id)}
                          disabled={generateMutation.isPending}
                        >
                          {generateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4 mr-1" />
                          )}
                          Opt-Out Letter
                        </Button>
                        {["not_started", "pending", "request_generated", "failed"].includes(req.status) && (
                          <Button
                            size="sm"
                            data-testid={`button-auto-send-${req.id}`}
                            onClick={() => autoSendMutation.mutate(req.id)}
                            disabled={autoSendMutation.isPending}
                          >
                            {autoSendMutation.isPending ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4 mr-1" />
                            )}
                            Auto-Send
                          </Button>
                        )}
                        <Select
                          value={req.status}
                          onValueChange={(value) => statusMutation.mutate({ id: req.id, status: value })}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="request_sent">Request Sent</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="awaiting_verification">Awaiting Verification</SelectItem>
                            <SelectItem value="confirmed_removed">Confirmed Removed</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="re_appeared">Re-appeared</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {expandedId === req.id && (
                      <div className="px-4 pb-4 border-t pt-3 space-y-3">
                        {(req.jurisdictionApplied || req.complianceDeadline || req.retryCount) && (
                          <div className="flex flex-wrap gap-2">
                            {req.jurisdictionApplied && (
                              <Badge variant="outline" data-testid={`badge-jurisdiction-${req.id}`}>
                                {req.jurisdictionApplied}
                              </Badge>
                            )}
                            {req.complianceDeadline && (
                              <Badge variant="outline" data-testid={`badge-deadline-${req.id}`}>
                                <Calendar className="h-3 w-3 mr-1" />
                                Due: {formatDate(req.complianceDeadline)}
                              </Badge>
                            )}
                            {(req.retryCount ?? 0) > 0 && (
                              <Badge variant="outline">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                {req.retryCount} retries
                              </Badge>
                            )}
                            {(req.escalationLevel ?? 0) > 0 && (
                              <Badge variant="destructive">
                                Escalation Level {req.escalationLevel}
                              </Badge>
                            )}
                          </div>
                        )}
                        {req.optOutContent ? (
                          <div className="text-sm whitespace-pre-wrap bg-muted/30 rounded-md p-3">
                            {req.optOutContent}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No opt-out instructions available. Click "Opt-Out Letter" to generate one.
                          </p>
                        )}
                        {req.lastError && (
                          <div className="text-sm p-2 rounded-md bg-destructive/10 text-destructive">
                            Last error: {req.lastError}
                          </div>
                        )}
                        {req.notes && (
                          <p className="text-sm mt-2 text-muted-foreground">
                            Notes: {req.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      <MonitoringPanel />
      <ComplianceTracker />
    </div>
  );
}
