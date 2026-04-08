import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "@/lib/navigation";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Megaphone, Plus, Pencil, Trash2, AlertTriangle, Sparkles, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PlatformAnnouncement } from "@shared/schema";

const ANNOUNCEMENT_TYPES = [
  { value: "update", label: "Platform Update", icon: Megaphone },
  { value: "new_feature", label: "New Feature", icon: Sparkles },
  { value: "scam_alert", label: "Scam Alert", icon: AlertTriangle },
  { value: "info", label: "Information", icon: Info },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

interface AnnouncementForm {
  title: string;
  content: string;
  type: string;
  priority: string;
  linkUrl: string;
  linkText: string;
  isActive: boolean;
  startsAt: string;
  expiresAt: string;
}

const emptyForm: AnnouncementForm = {
  title: "",
  content: "",
  type: "update",
  priority: "normal",
  linkUrl: "",
  linkText: "",
  isActive: true,
  startsAt: "",
  expiresAt: "",
};

export default function AdminAnnouncements() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AnnouncementForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data, isLoading } = useQuery<{ announcements: PlatformAnnouncement[] }>({
    queryKey: ["/api/admin/announcements"],
    enabled: adminCheck?.isAdmin === true,
  });

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [authLoading, user, setLocation]);

  useEffect(() => {
    if (!adminCheckLoading && adminCheck && !adminCheck.isAdmin) setLocation("/");
  }, [adminCheckLoading, adminCheck, setLocation]);

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("POST", "/api/admin/announcements", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast({ title: "Announcement created" });
    },
    onError: () => toast({ title: "Failed to create announcement", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await apiRequest("PATCH", `/api/admin/announcements/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast({ title: "Announcement updated" });
    },
    onError: () => toast({ title: "Failed to update announcement", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/announcements/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setDeleteConfirmId(null);
      toast({ title: "Announcement deleted" });
    },
    onError: () => toast({ title: "Failed to delete announcement", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/announcements/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
  });

  const handleSubmit = () => {
    const payload: Record<string, unknown> = {
      title: form.title,
      content: form.content,
      type: form.type,
      priority: form.priority,
      isActive: form.isActive,
      linkUrl: form.linkUrl || null,
      linkText: form.linkText || null,
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const openEdit = (a: PlatformAnnouncement) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      content: a.content,
      type: a.type,
      priority: a.priority,
      linkUrl: a.linkUrl || "",
      linkText: a.linkText || "",
      isActive: a.isActive,
      startsAt: a.startsAt ? new Date(a.startsAt).toISOString().slice(0, 16) : "",
      expiresAt: a.expiresAt ? new Date(a.expiresAt).toISOString().slice(0, 16) : "",
    });
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  if (authLoading || adminCheckLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const announcements = data?.announcements || [];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "scam_alert": return <Badge className="bg-orange-500 text-white no-default-hover-elevate no-default-active-elevate">Scam Alert</Badge>;
      case "new_feature": return <Badge className="bg-primary text-primary-foreground no-default-hover-elevate no-default-active-elevate">New Feature</Badge>;
      case "info": return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="outline">Update</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge className="bg-red-600 text-white no-default-hover-elevate no-default-active-elevate">Urgent</Badge>;
      case "high": return <Badge className="bg-orange-500 text-white no-default-hover-elevate no-default-active-elevate">High</Badge>;
      case "low": return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-primary" />
              Announcements
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage platform updates and notifications shown to all visitors
            </p>
          </div>
          <Button onClick={openCreate} data-testid="button-create-announcement">
            <Plus className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No announcements yet</p>
                <p className="text-sm">Create one to notify your visitors about updates</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="hidden sm:table-cell">Priority</TableHead>
                    <TableHead className="hidden md:table-cell">Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {announcements.map((a) => (
                    <TableRow key={a.id} data-testid={`row-announcement-${a.id}`}>
                      <TableCell>
                        <Switch
                          checked={a.isActive}
                          onCheckedChange={(checked) =>
                            toggleActive.mutate({ id: a.id, isActive: checked })
                          }
                          aria-label={a.isActive ? "Active" : "Inactive"}
                          data-testid={`switch-active-${a.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm" data-testid={`text-title-${a.id}`}>
                            {a.title}
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                            {a.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getTypeBadge(a.type)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getPriorityBadge(a.priority)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {a.createdAt
                          ? new Date(a.createdAt).toLocaleDateString()
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(a)}
                            aria-label="Edit"
                            data-testid={`button-edit-${a.id}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteConfirmId(a.id)}
                            aria-label="Delete"
                            data-testid={`button-delete-${a.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-testid="dialog-announcement-form">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Announcement" : "New Announcement"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ann-title">Title</Label>
              <Input
                id="ann-title"
                placeholder="e.g. New Scam Patterns Added"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="input-announcement-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ann-content">Message</Label>
              <Textarea
                id="ann-content"
                placeholder="Brief description shown in the banner..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="min-h-[80px]"
                data-testid="input-announcement-content"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                  <SelectTrigger data-testid="select-announcement-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ANNOUNCEMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger data-testid="select-announcement-priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ann-link-url">Link URL (optional)</Label>
                <Input
                  id="ann-link-url"
                  placeholder="https://..."
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  data-testid="input-announcement-link-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-link-text">Link Text (optional)</Label>
                <Input
                  id="ann-link-text"
                  placeholder="Learn more"
                  value={form.linkText}
                  onChange={(e) => setForm({ ...form, linkText: e.target.value })}
                  data-testid="input-announcement-link-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ann-starts">Starts At (optional)</Label>
                <Input
                  id="ann-starts"
                  type="datetime-local"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                  data-testid="input-announcement-starts"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ann-expires">Expires At (optional)</Label>
                <Input
                  id="ann-expires"
                  type="datetime-local"
                  value={form.expiresAt}
                  onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  data-testid="input-announcement-expires"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                id="ann-active"
                data-testid="switch-announcement-active"
              />
              <Label htmlFor="ann-active">Active immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.title.trim() || !form.content.trim() || createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-announcement"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent data-testid="dialog-delete-confirm">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this announcement? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
