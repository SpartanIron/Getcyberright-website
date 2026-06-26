"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Loader2,
  Send,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquarePlus,
} from "lucide-react";
import type { SupportReply, SavedReply } from "@shared/schema";

type InboxType = "contact" | "feedback" | "scam" | "comment";

interface InboxReplyPanelProps {
  type: InboxType;
  id: string;
  email?: string | null;
  defaultSubject: string;
  articleSlug?: string | null;
}

function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "";
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const repliesPath: Record<Exclude<InboxType, "comment">, string> = {
  contact: "/api/admin/contact-messages",
  feedback: "/api/admin/feedback",
  scam: "/api/admin/scam-reports",
};

export function InboxReplyPanel({
  type,
  id,
  email,
  defaultSubject,
  articleSlug,
}: InboxReplyPanelProps) {
  const { toast } = useToast();
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState("");
  const isComment = type === "comment";

  // Saved replies for the insert menu
  const { data: savedData } = useQuery<{ savedReplies: SavedReply[] }>({
    queryKey: ["/api/admin/saved-replies"],
  });
  const savedReplies = savedData?.savedReplies || [];

  // Email reply history (not applicable to comments)
  const base = isComment ? "" : `${repliesPath[type]}/${id}`;
  const repliesKey = [repliesPath[type as Exclude<InboxType, "comment">] || "comment", id, "replies"];
  const { data: replyData, isLoading: repliesLoading } = useQuery<{ replies: SupportReply[] }>({
    queryKey: repliesKey,
    enabled: !isComment,
    queryFn: async () => {
      const res = await fetch(`${base}/replies`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load replies");
      return res.json();
    },
  });
  const replies = replyData?.replies || [];

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (isComment) {
        const res = await apiRequest("POST", `/api/admin/comments/${id}/reply`, {
          content: body.trim(),
        });
        return res.json();
      }
      const res = await apiRequest("POST", `${base}/reply`, {
        subject: subject.trim(),
        body: body.trim(),
      });
      return res.json();
    },
    onSuccess: () => {
      setBody("");
      if (!isComment) queryClient.invalidateQueries({ queryKey: repliesKey });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inbox"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Reply sent",
        description: isComment ? "Posted publicly in the article thread." : `Emailed to ${email}`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Could not send reply",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const canSend = isComment
    ? body.trim().length >= 2 && !sendMutation.isPending
    : !!email && subject.trim().length > 0 && body.trim().length > 0 && !sendMutation.isPending;

  const insertSaved = (reply: SavedReply) => {
    setBody((prev) => (prev.trim() ? `${prev}\n\n${reply.body}` : reply.body));
  };

  const savedPicker = savedReplies.length > 0 && (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" data-testid="button-insert-saved-reply">
          <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" />
          Saved replies
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-1">
        <div className="max-h-64 overflow-y-auto">
          {savedReplies.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => insertSaved(r)}
              className="w-full text-left rounded-md px-2 py-2 hover:bg-muted transition-colors"
              data-testid={`saved-reply-option-${r.id}`}
            >
              <p className="text-sm font-medium text-foreground">{r.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{r.body}</p>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="space-y-4" data-testid={`inbox-reply-panel-${id}`}>
      {!isComment && replies.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Reply history ({replies.length})</p>
          {replies.map((r) => (
            <div
              key={r.id}
              className="rounded-lg border border-border bg-muted/30 p-3"
              data-testid={`reply-item-${r.id}`}
            >
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

      {!isComment && repliesLoading && (
        <div className="flex justify-center py-2">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {isComment ? (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              Your reply posts publicly as the GetCyberRight Team in the article thread.
            </span>
            {savedPicker}
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write a public reply to this comment."
            rows={4}
            maxLength={2000}
            data-testid={`input-reply-content-${id}`}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => sendMutation.mutate()}
              disabled={!canSend}
              data-testid={`button-send-reply-${id}`}
            >
              {sendMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Post reply
                </>
              )}
            </Button>
          </div>
        </div>
      ) : email ? (
        <div className="space-y-2 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span>
                Replying to <span className="font-medium text-foreground">{email}</span>
              </span>
            </div>
            {savedPicker}
          </div>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            maxLength={200}
            data-testid={`input-reply-subject-${id}`}
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your reply. This will be emailed to the sender."
            rows={4}
            maxLength={5000}
            data-testid={`input-reply-body-${id}`}
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => sendMutation.mutate()}
              disabled={!canSend}
              data-testid={`button-send-reply-${id}`}
            >
              {sendMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Send reply
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          No email address on file, so a reply cannot be sent.
        </p>
      )}
    </div>
  );
}
