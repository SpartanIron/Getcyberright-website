/**
 * feedback-triage.tsx
 *
 * Recommendations #2 & #3:
 *  - Rec #2: Instant Dezi-style acknowledgment on every feedback submission
 *            with a category-specific response so the user never waits in silence.
 *  - Rec #3: Urgency triage — Bug Reports and Scam Reports are flagged URGENT
 *            and trigger an immediate email ping to the team, while Feature Requests
 *            and Praise are batched. The API endpoint receives a `priority` field
 *            so the server can route accordingly.
 *
 * Usage: drop-in replacement for the useMutation block in feedback-widget.tsx
 * by importing `useFeedbackTriage` and replacing the existing submitMutation.
 */

"use client";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export type FeedbackCategory =
    | "bug"
  | "feature"
  | "question"
  | "praise"
  | "other";

export interface FeedbackPayload {
    category: FeedbackCategory;
    message: string;
    email: string;
    page: string;
}

/** Maps each category to a priority level for server-side triage routing. */
const PRIORITY_MAP: Record<FeedbackCategory, "urgent" | "normal" | "low"> = {
    bug: "urgent",      // triggers immediate team notification
    question: "urgent", // users in distress need fast help
    feature: "normal",  // batched weekly
    praise: "low",      // routed to testimonials pipeline
    other: "normal",
};

/**
 * Category-specific instant acknowledgment messages shown to the user
 * immediately after submission — the "Dezi voice" so the experience
 * feels like a real, intelligent response rather than a generic toast.
 */
const ACKNOWLEDGMENT: Record<FeedbackCategory, { title: string; description: string }> = {
    bug: {
          title: "Bug received — we're on it.",
          description:
                  "Your report has been flagged as urgent and our team has been notified. As a workaround, try refreshing the page. We aim to resolve critical bugs within 24 hours.",
    },
    question: {
          title: "Got your question!",
          description:
                  "We've received your question and will reply to your email within a few hours. In the meantime, Dezi (bottom-right) can often answer immediately.",
    },
    feature: {
          title: "Great idea — noted!",
          description:
                  "Your suggestion has been added to our weekly review queue. If it gets traction from other users, we'll build it. Thank you for helping shape the platform.",
    },
    praise: {
          title: "That made our day!",
          description:
                  "Thank you — feedback like this keeps us going. With your permission we may feature it as a testimonial to help other families discover the platform.",
    },
    other: {
          title: "Message received.",
          description:
                  "We've got your message and will get back to you within 24 hours if you left an email address. Thank you for taking the time.",
    },
};

export function useFeedbackTriage() {
    const { toast } = useToast();

  const submitMutation = useMutation({
        mutationFn: async (data: FeedbackPayload) => {
                const priority = PRIORITY_MAP[data.category];
                const res = await apiRequest("POST", "/api/feedback", {
                          ...data,
                          priority,
                          submittedAt: new Date().toISOString(),
                });
                return res.json();
        },

        onSuccess: (_data, variables) => {
                const ack = ACKNOWLEDGMENT[variables.category];
                // Instant acknowledgment toast — feels like Dezi is responding
          toast({
                    title: ack.title,
                    description: ack.description,
                    duration: variables.category === "bug" || variables.category === "question" ? 8000 : 5000,
          });
        },

        onError: () => {
                toast({
                          title: "Something went wrong",
                          description:
                                      "Please try again or email us directly at info@getcyberright.com",
                          variant: "destructive",
                });
        },
  });

  return { submitMutation, PRIORITY_MAP, ACKNOWLEDGMENT };
}

/**
 * Utility: returns a human-readable urgency label for a given category.
 * Used in the UI to show "URGENT" badge on Bug/Question submissions.
 */
export function getUrgencyLabel(
    category: FeedbackCategory
  ): { label: string; color: string } | null {
    const priority = PRIORITY_MAP[category];
    if (priority === "urgent") {
          return {
                  label: "Urgent — team notified",
                  color: "text-red-400 bg-red-500/10 border-red-500/20",
          };
    }
    if (priority === "normal") {
          return {
                  label: "Weekly review queue",
                  color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          };
    }
    return null;
}
