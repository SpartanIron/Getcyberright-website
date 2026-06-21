"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
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
import { Mail, Trash2, Eye } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { ReplyComposer } from "@/components/admin/reply-composer";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { ContactMessage } from "@shared/schema";

export default function AdminMessages() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data, isLoading } = useQuery<{ messages: ContactMessage[] }>({
    queryKey: ["/api/admin/contact-messages"],
    enabled: adminCheck?.isAdmin === true,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/admin/contact-messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Message deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete message", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/api/login");
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

  const messages = data?.messages || [];

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-500",
      support: "bg-green-500",
      partnership: "bg-purple-500",
      feedback: "bg-amber-500",
      security: "bg-red-500",
    };
    return (
      <Badge className={colors[category] || "bg-gray-500"}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Mail className="w-8 h-8" />
              Contact Messages
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage contact form submissions.
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {messages.length} Messages
          </Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No messages yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id} data-testid={`row-message-${msg.id}`}>
                      <TableCell className="font-medium">{msg.name}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-primary hover:underline"
                        >
                          {msg.email}
                        </a>
                      </TableCell>
                      <TableCell>{getCategoryBadge(msg.category)}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-muted-foreground">
                        {msg.message}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {msg.createdAt
                          ? new Date(msg.createdAt).toLocaleDateString()
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
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Message from {msg.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <span className="text-sm text-muted-foreground">Email:</span>
                                  <p className="font-medium">{msg.email}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Category:</span>
                                  <p>{getCategoryBadge(msg.category)}</p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Message:</span>
                                  <p className="whitespace-pre-wrap mt-1 p-3 bg-muted rounded-md">
                                    {msg.message}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-sm text-muted-foreground">Received:</span>
                                  <p>
                                    {msg.createdAt
                                      ? new Date(msg.createdAt).toLocaleString()
                                      : "Unknown"}
                                  </p>
                                </div>
                                <div className="border-t border-border pt-4">
                                  <ReplyComposer
                                    targetType="contact"
                                    targetId={msg.id}
                                    toEmail={msg.email}
                                    defaultSubject={`Re: Your message to GetCyberRight`}
                                  />
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
                                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this message? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate(msg.id)}
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
