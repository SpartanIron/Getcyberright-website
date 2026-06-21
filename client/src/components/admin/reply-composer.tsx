"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Send, Mail, CheckCircle2, AlertCircle } from "lucide-react";
import type { SupportReply } from "@shared/schema";

interface ReplyComposerProps {
  targetType: "feedback" | "contact";
  targetId: string;
  toEmail?: string | null;
  defaultSubject: string;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function ReplyComposer({ targetType, targetId, toEmail, defaultSubject }: ReplyComposerProps) {
  const base = targetType === "feedback"
    ? `/api/admin/feedback/${targetId}`
    : `/api/admin/contact-messages/${targetId}`;
  const repliesKey = [
    targetType === "feedback" ? "/api/admin/feedback" : "/api/admin/contact-messages",
    targetId,
    "replies",
  ];

  const { toast } = useToast();
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");

  const { data, isLoading } = useQuery<{ replies: SupportReply[] }>({
    queryKey: repliesKey,
    queryFn: async () => {
      const res = await fetch(`${base}/replies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load replies");
      return res.json();
    },
  });

  const replies = data?.replies || [];

  const sendMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `${base}/reply`, { subject: subject.trim(), body: body.trim() });
      return res.json();
    },
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: repliesKey });
      if (targetType === "feedback") {
        queryClient.invalidateQueries({ queryKey: ["/api/admin/feedback"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      }
      toast({ title: "Reply sent", description: `Emailed to ${toEmail}` });
    },
    onError: (err: any) => {
      toast({ title: "Could not send reply", description: err?.message || "Please try again.", variant: "destructive" });
    },
  });

  const canSend = !!toEmail && subject.trim().length > 0 && body.trim().length > 0 && !sendMutation.isPending;

  return (
    <div className="space-y-4" data-testid={`reply-composer-${targetId}`}>
      {replies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Reply history ({replies.length})</p>
          {replies.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-muted/30 p-3" data-testid={`reply-item-${r.id}`}>
              <div className="flex items-center gap-2 mb-1 text-xs text-muted-foreground">
                {r.delivered ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                )}
                <span className="font-medium text-foreground">{r.adminName || "Team"}</span>
                <span>replied to {r.toEmail}</span>
                <span className="ml-auto">{formatDate(r.createdAt)}</span>
              </div>
              <p className="text-xs font-semibold text-foreground">{r.subject}</p>
              <p className="text-sm whitespace-pre-wrap text-foreground/90 mt-1">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-2"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
      )}

      {toEmail ? (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail className="w-3.5 h-3.5" />
            <span>Replying to <span className="font-medium text-foreground">{toEmail}</span></span>
          </div>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            maxLength={200}
            data-testid={`input-reply-subject-${targetId}`}
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your reply. This will be emailed to the sender."
            rows={4}
            maxLength={5000}
            data-testid={`input-reply-body-${targetId}`}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => sendMutation.mutate()}
              disabled={!canSend}
              data-testid={`button-send-reply-${targetId}`}
            >
              {sendMutation.isPending
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <><Send className="w-3.5 h-3.5 mr-1.5" />Send reply</>}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No email address on file, so a reply cannot be sent.</p>
      )}
    </div>
  );
}
