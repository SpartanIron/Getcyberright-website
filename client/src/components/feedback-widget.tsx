"use client";

import { useState } from "react";
import { MessageSquarePlus, X, Send, Bug, Lightbulb, HelpCircle, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useFeedbackTriage } from "@/components/feedback-triage";

const categories = [
{ id: "bug", label: "Bug Report", icon: Bug, color: "text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800" },
{ id: "feature", label: "Feature Request", icon: Lightbulb, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800" },
{ id: "question", label: "Question", icon: HelpCircle, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800" },
{ id: "praise", label: "Praise", icon: Star, color: "text-green-500 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800" },
{ id: "other", label: "Other", icon: FileText, color: "text-gray-500 bg-gray-50 dark:bg-gray-950/30 border-gray-200 dark:border-gray-800" },
] as const;

type Category = typeof categories[number]["id"];

export function FeedbackWidget() {
const [isOpen, setIsOpen] = useState(false);
const [category, setCategory] = useState<Category | null>(null);
const [message, setMessage] = useState("");
const [email, setEmail] = useState("");
const { submitMutation } = useFeedbackTriage();

const handleSubmit = () => {
  if (!category || !message.trim()) return;
  submitMutation.mutate(
    {
      category,
      message: message.trim(),
      email: email.trim(),
      page: window.location.pathname,
    },
    {
      onSuccess: () => {
        setIsOpen(false);
        setCategory(null);
        setMessage("");
        setEmail("");
      },
    }
  );
};

if (!isOpen) {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="feedback-widget-container fixed bottom-4 left-4 sm:left-6 z-50 flex items-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-full shadow-lg transition-shadow hover:shadow-xl"
      aria-label="Send feedback"
      data-testid="button-open-feedback"
    >
      <MessageSquarePlus className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">Feedback</span>
    </button>
  );
}

return (
  <div className="fixed bottom-4 left-4 sm:left-6 z-50 w-[340px] max-h-[85vh] overflow-y-auto bg-background border border-border rounded-xl shadow-2xl" data-testid="panel-feedback">
    <div className="sticky top-0 bg-teal-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
      <h3 className="font-semibold text-sm">Share Your Feedback</h3>
      <button
        onClick={() => { setIsOpen(false); setCategory(null); }}
        className="text-white/80 hover:text-white"
        aria-label="Close feedback"
        data-testid="button-close-feedback"
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="p-4 space-y-4">
      {!category ? (
        <>
          <p className="text-sm text-muted-foreground">What kind of feedback do you have?</p>
          <div className="space-y-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all hover:shadow-sm ${cat.color}`}
                data-testid={`button-category-${cat.id}`}
              >
                <cat.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{cat.label}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setCategory(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back-category"
          >
            &larr; Change category
          </button>

          <div className="flex items-center gap-2 mb-1">
            {(() => {
              const cat = categories.find(c => c.id === category);
              if (!cat) return null;
              return (
                <>
                  <cat.icon className={`w-4 h-4 ${cat.color.split(" ")[0]}`} />
                  <span className="text-sm font-medium">{cat.label}</span>
                </>
              );
            })()}
          </div>

          <Textarea
            placeholder="Tell us what's on your mind..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[100px] resize-none text-sm"
            maxLength={2000}
            data-testid="input-feedback-message"
          />
          <p className="text-xs text-muted-foreground text-right">{message.length}/2000</p>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Email (optional, if you'd like a response)
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm"
              data-testid="input-feedback-email"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!message.trim() || message.trim().length < 5 || submitMutation.isPending}
            className="w-full bg-teal-600 hover:bg-teal-700"
            data-testid="button-submit-feedback"
          >
            {submitMutation.isPending ? (
              "Submitting..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </>
      )}
    </div>
  </div>
);
}
