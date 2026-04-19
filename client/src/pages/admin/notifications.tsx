"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Bell, Loader2, Save, Slack, Webhook } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface NotificationSettings {
  slackWebhookUrl: string;
  webhookUrl: string;
  updatedAt?: string | null;
  updatedBy?: string | null;
}

export default function AdminNotificationsPage() {
  const { toast } = useToast();
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");

  const { data, isLoading } = useQuery<NotificationSettings>({
    queryKey: ["/api/admin/notification-settings"],
  });

  useEffect(() => {
    if (data) {
      setSlackWebhookUrl(data.slackWebhookUrl || "");
      setWebhookUrl(data.webhookUrl || "");
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: { slackWebhookUrl: string; webhookUrl: string }) => {
      const res = await apiRequest("PUT", "/api/admin/notification-settings", payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/notification-settings"] });
      toast({ title: "Notification destinations saved" });
    },
    onError: (err: Error) => {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      slackWebhookUrl: slackWebhookUrl.trim(),
      webhookUrl: webhookUrl.trim(),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notification Destinations</h1>
            <p className="text-sm text-muted-foreground">
              Choose where review-queue digests are delivered, alongside per-admin email opt-ins.
            </p>
          </div>
        </div>

        <Card data-testid="card-notification-destinations">
          <CardHeader>
            <CardTitle className="text-lg">Review queue digest</CardTitle>
            <CardDescription>
              Reactive social posts trigger a digest when they enter the review window. Configure
              optional Slack and webhook destinations below — leave a field blank to disable that channel.
              Per-admin email opt-out lives on each admin's account settings page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading current settings…
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="slackWebhookUrl" className="flex items-center gap-2">
                    <Slack className="w-4 h-4" /> Slack incoming webhook URL
                  </Label>
                  <Input
                    id="slackWebhookUrl"
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                    value={slackWebhookUrl}
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    data-testid="input-slack-webhook-url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Posts a Slack message with approve/reject buttons when posts enter the queue.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhookUrl" className="flex items-center gap-2">
                    <Webhook className="w-4 h-4" /> Generic webhook URL
                  </Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    placeholder="https://example.com/hooks/review-queue"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    data-testid="input-webhook-url"
                  />
                  <p className="text-xs text-muted-foreground">
                    Receives a JSON POST with the digest payload. Useful for relaying into custom tooling.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={saveMutation.isPending}
                    data-testid="button-save-notification-settings"
                  >
                    {saveMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" /> Save destinations
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
