import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2, Eye, DollarSign } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ScamReport } from "@shared/schema";

export default function AdminScamReports() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data, isLoading } = useQuery<{ reports: ScamReport[] }>({
    queryKey: ["/api/admin/scam-reports"],
    enabled: adminCheck?.isAdmin === true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/scam-reports/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/scam-reports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Report deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete report", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/login");
    }
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) {
      setLocation("/");
    }
  }, [adminCheckLoading, adminCheck, setLocation]);

  if (authLoading || adminCheckLoading || !adminCheck?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const reports = data?.reports || [];

  const getScamTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      phishing: "bg-red-500",
      romance: "bg-pink-500",
      tech_support: "bg-orange-500",
      investment: "bg-amber-500",
      lottery: "bg-purple-500",
      employment: "bg-blue-500",
      other: "bg-gray-500",
    };
    return (
      <Badge className={colors[type] || "bg-gray-500"}>
        {type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-8 h-8" />
              Scam Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              Review user-submitted scam reports to help protect others.
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {reports.length} Reports
          </Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading reports...</div>
            ) : reports.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No scam reports yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount Lost</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id} data-testid={`row-report-${report.id}`}>
                      <TableCell>{getScamTypeBadge(report.scamType)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {report.description}
                      </TableCell>
                      <TableCell>
                        {report.amountLost ? (
                          <span className="flex items-center gap-1 text-destructive">
                            <DollarSign className="w-4 h-4" />
                            {report.amountLost}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {report.anonymous === "true"
                          ? "Anonymous"
                          : report.reporterEmail || "Unknown"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {report.createdAt
                          ? new Date(report.createdAt).toLocaleDateString()
                          : "Unknown"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-destructive" />
                                  Scam Report Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">Scam Type:</span>
                                  <p className="mt-1">{getScamTypeBadge(report.scamType)}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Description:</span>
                                  <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-md">
                                    {report.description}
                                  </p>
                                </div>
                                {report.scammerContact && (
                                  <div>
                                    <span className="text-sm text-muted-foreground">
                                      Scammer Contact Info:
                                    </span>
                                    <p className="mt-1 p-3 bg-destructive/10 text-destructive rounded-md font-mono text-sm">
                                      {report.scammerContact}
                                    </p>
                                  </div>
                                )}
                                {report.amountLost && (
                                  <div>
                                    <span className="text-sm text-muted-foreground">Amount Lost:</span>
                                    <p className="text-lg font-semibold text-destructive mt-1">
                                      ${report.amountLost}
                                    </p>
                                  </div>
                                )}
                                <div>
                                  <span className="text-sm text-muted-foreground">Reporter:</span>
                                  <p className="mt-1">
                                    {report.anonymous === "true"
                                      ? "Anonymous submission"
                                      : report.reporterEmail || "Not provided"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Reported:</span>
                                  <p>
                                    {report.createdAt
                                      ? new Date(report.createdAt).toLocaleString()
                                      : "Unknown"}
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Report</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this scam report? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(report.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
