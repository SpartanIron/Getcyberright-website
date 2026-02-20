import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
import { TrendingUp, Plus, Pencil, Trash2, RefreshCw, MapPin, Users, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { TrendingThreat } from "@shared/schema";

const CATEGORIES = [
  { value: "scam", label: "Scam" },
  { value: "phishing", label: "Phishing" },
  { value: "malware", label: "Malware" },
  { value: "fraud", label: "Fraud" },
  { value: "data_breach", label: "Data Breach" },
  { value: "vulnerability", label: "Vulnerability" },
  { value: "identity_theft", label: "Identity Theft" },
];

const SEVERITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const REGIONS = [
  { value: "GLOBAL", label: "Global" },
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "EU", label: "Europe" },
  { value: "AU", label: "Australia" },
  { value: "NZ", label: "New Zealand" },
  { value: "AF_WEST", label: "West Africa" },
  { value: "AF_EAST", label: "East Africa" },
  { value: "AF_SOUTH", label: "Southern Africa" },
  { value: "SA", label: "South America" },
  { value: "AS_SOUTH", label: "South Asia" },
  { value: "AS_SOUTHEAST", label: "Southeast Asia" },
];

const AUDIENCES = [
  { value: "general", label: "Everyone" },
  { value: "seniors", label: "Seniors" },
  { value: "families", label: "Families" },
  { value: "children", label: "Children" },
];

interface ThreatForm {
  title: string;
  summary: string;
  source: string;
  category: string;
  severity: string;
  linkUrl: string;
  regions: string[];
  audience: string;
  isActive: boolean;
  displayOrder: number;
}

const emptyForm: ThreatForm = {
  title: "",
  summary: "",
  source: "",
  category: "scam",
  severity: "high",
  linkUrl: "",
  regions: ["GLOBAL"],
  audience: "general",
  isActive: true,
  displayOrder: 0,
};

export default function AdminTrendingThreats() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ThreatForm>(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: adminCheck, isLoading: adminCheckLoading } = useQuery<{ isAdmin: boolean }>({
    queryKey: ["/api/admin/check"],
    enabled: !!user,
  });

  const { data, isLoading } = useQuery<{ threats: TrendingThreat[] }>({
    queryKey: ["/api/admin/trending-threats"],
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
      const res = await apiRequest("POST", "/api/admin/trending-threats", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trending-threats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending-threats"] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast({ title: "Trending threat created" });
    },
    onError: () => toast({ title: "Failed to create threat", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const res = await apiRequest("PATCH", `/api/admin/trending-threats/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trending-threats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending-threats"] });
      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      toast({ title: "Trending threat updated" });
    },
    onError: () => toast({ title: "Failed to update threat", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/admin/trending-threats/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trending-threats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending-threats"] });
      setDeleteConfirmId(null);
      toast({ title: "Trending threat deleted" });
    },
    onError: () => toast({ title: "Failed to delete threat", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/trending-threats/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trending-threats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending-threats"] });
    },
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/trending-threats/refresh");
      return res.json();
    },
    onSuccess: (data: { added: number; expired: number }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/trending-threats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/trending-threats"] });
      toast({ title: `Refreshed: ${data.added} new, ${data.expired} expired` });
    },
    onError: () => toast({ title: "Failed to refresh threats", variant: "destructive" }),
  });

  const handleSubmit = () => {
    const payload: Record<string, unknown> = {
      title: form.title,
      summary: form.summary,
      source: form.source,
      category: form.category,
      severity: form.severity,
      isActive: form.isActive,
      displayOrder: form.displayOrder,
      linkUrl: form.linkUrl || null,
      regions: form.regions.length > 0 ? form.regions : ["GLOBAL"],
      audience: form.audience,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleRegion = (regionValue: string) => {
    setForm((prev) => {
      const current = prev.regions;
      if (current.includes(regionValue)) {
        const filtered = current.filter((r) => r !== regionValue);
        return { ...prev, regions: filtered.length > 0 ? filtered : ["GLOBAL"] };
      } else {
        const updated = regionValue === "GLOBAL"
          ? ["GLOBAL"]
          : [...current.filter((r) => r !== "GLOBAL"), regionValue];
        return { ...prev, regions: updated };
      }
    });
  };

  const openEdit = (t: TrendingThreat) => {
    setEditingId(t.id);
    setForm({
      title: t.title,
      summary: t.summary,
      source: t.source,
      category: t.category,
      severity: t.severity,
      linkUrl: t.linkUrl || "",
      regions: (t.regions as string[]) || ["GLOBAL"],
      audience: t.audience || "general",
      isActive: t.isActive,
      displayOrder: t.displayOrder,
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

  const threats = data?.threats || [];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical": return <Badge className="bg-red-600 dark:bg-red-700 text-white no-default-hover-elevate no-default-active-elevate">Critical</Badge>;
      case "high": return <Badge className="bg-orange-500 dark:bg-orange-600 text-white no-default-hover-elevate no-default-active-elevate">High</Badge>;
      case "medium": return <Badge className="bg-amber-500 dark:bg-amber-600 text-white no-default-hover-elevate no-default-active-elevate">Medium</Badge>;
      default: return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Trending Threats
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage region-specific threats shown on the homepage. Auto-refreshes every 6 hours.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
              data-testid="button-refresh-threats"
            >
              {refreshMutation.isPending ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {refreshMutation.isPending ? "Generating..." : "AI Refresh"}
            </Button>
            <Button onClick={openCreate} data-testid="button-create-threat">
              <Plus className="w-4 h-4 mr-2" />
              Add Threat
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : threats.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No trending threats yet</p>
                <p className="text-sm">Click AI Refresh to auto-generate, or add one manually</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Active</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Severity</TableHead>
                    <TableHead className="hidden md:table-cell">Audience</TableHead>
                    <TableHead className="hidden lg:table-cell">Regions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {threats.map((t) => (
                    <TableRow key={t.id} data-testid={`row-threat-${t.id}`}>
                      <TableCell>
                        <Switch
                          checked={t.isActive}
                          onCheckedChange={(checked) =>
                            toggleActive.mutate({ id: t.id, isActive: checked })
                          }
                          data-testid={`switch-threat-active-${t.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <p className="font-medium text-sm">{t.title}</p>
                            {t.isAutoGenerated && (
                              <Sparkles className="w-3 h-3 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                            {t.summary}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="capitalize">{t.category.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {getSeverityBadge(t.severity)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary" className="text-xs capitalize">
                          <Users className="w-3 h-3 mr-1" />
                          {t.audience || "general"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-1 flex-wrap">
                          {((t.regions as string[]) || ["GLOBAL"]).slice(0, 2).map((r) => (
                            <Badge key={r} variant="outline" className="text-[10px]">
                              <MapPin className="w-2.5 h-2.5 mr-0.5" />
                              {r}
                            </Badge>
                          ))}
                          {((t.regions as string[]) || []).length > 2 && (
                            <Badge variant="outline" className="text-[10px]">
                              +{((t.regions as string[]) || []).length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => openEdit(t)} data-testid={`button-edit-threat-${t.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => setDeleteConfirmId(t.id)} data-testid={`button-delete-threat-${t.id}`}>
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="dialog-threat-form">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Trending Threat" : "Add Trending Threat"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="threat-title">Title</Label>
              <Input
                id="threat-title"
                placeholder="e.g. ATM Jackpotting on the Rise"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                data-testid="input-threat-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="threat-summary">Summary</Label>
              <Textarea
                id="threat-summary"
                placeholder="Brief description of the threat..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                className="min-h-[80px]"
                data-testid="input-threat-summary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="threat-source">Source</Label>
              <Input
                id="threat-source"
                placeholder="e.g. FBI, CISA, FTC"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                data-testid="input-threat-source"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger data-testid="select-threat-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={form.severity} onValueChange={(v) => setForm({ ...form, severity: v })}>
                  <SelectTrigger data-testid="select-threat-severity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEVERITIES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select value={form.audience} onValueChange={(v) => setForm({ ...form, audience: v })}>
                <SelectTrigger data-testid="select-threat-audience">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Regions</Label>
              <div className="grid grid-cols-2 gap-2 p-3 border rounded-md max-h-[160px] overflow-y-auto" data-testid="region-checkboxes">
                {REGIONS.map((r) => (
                  <label key={r.value} className="flex items-center gap-2 text-sm cursor-pointer">
                    <Checkbox
                      checked={form.regions.includes(r.value)}
                      onCheckedChange={() => toggleRegion(r.value)}
                      data-testid={`checkbox-region-${r.value}`}
                    />
                    <span className="text-xs">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="threat-link">Link URL (optional)</Label>
                <Input
                  id="threat-link"
                  placeholder="https://..."
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  data-testid="input-threat-link"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="threat-order">Display Order</Label>
                <Input
                  id="threat-order"
                  type="number"
                  min={0}
                  value={form.displayOrder}
                  onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-threat-order"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(checked) => setForm({ ...form, isActive: checked })}
                id="threat-active"
                data-testid="switch-threat-form-active"
              />
              <Label htmlFor="threat-active">Show on homepage</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={!form.title.trim() || !form.summary.trim() || !form.source.trim() || createMutation.isPending || updateMutation.isPending}
              data-testid="button-save-threat"
            >
              {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent data-testid="dialog-delete-threat-confirm">
          <DialogHeader>
            <DialogTitle>Delete Trending Threat</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure? This will remove it from the homepage.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete-threat"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
