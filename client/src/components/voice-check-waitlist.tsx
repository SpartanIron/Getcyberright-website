"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Radio, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export function VoiceCheckWaitlist() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await apiRequest("POST", "/api/experience/waitlist", {
        email: email.trim(),
        type: "voice-check",
      });
      const data = await res.json().catch(() => ({}));
      if (data?.success) {
        setSubmitted(true);
      } else {
        setError(data?.message || "Could not join the waitlist. Please try again.");
      }
    } catch (err: any) {
      setError("Could not join the waitlist. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full" data-testid="card-voice-check-waitlist">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Radio className="w-6 h-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-xl">AI Voice Authentication</CardTitle>
              <Badge variant="secondary" data-testid="badge-coming-soon">Coming Soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Detect AI-generated voice cloning in audio clips. Launching Q3 2026. Join the waitlist.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-border bg-muted/30 p-5">
          <p className="text-sm text-foreground leading-relaxed">
            We are building an AI Voice Authentication tool that will let you upload a short audio clip and check it for telltale signs of AI voice cloning. Today there is no reliable consumer-grade voice clone detector, so we are taking the time to ship something we can stand behind. Add your email to be notified when it is ready.
          </p>
        </div>

        {submitted ? (
          <div
            className="rounded-lg border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/20 p-5 flex items-start gap-3"
            data-testid="status-waitlist-submitted"
          >
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200 mb-0.5">You are on the waitlist.</p>
              <p className="text-sm text-green-700 dark:text-green-300">
                We will email you the moment AI Voice Authentication launches.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3" data-testid="form-voice-check-waitlist">
            <label htmlFor="voice-check-email" className="text-sm font-medium text-foreground block">
              Email address
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="voice-check-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                  autoComplete="email"
                  data-testid="input-voice-check-email"
                />
              </div>
              <Button type="submit" disabled={submitting} data-testid="button-join-voice-check-waitlist">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert" data-testid="text-voice-check-error">
                {error}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              We will only use your email to notify you when this tool launches. No spam.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
