"use client";

import { useState } from "react";
import { CheckCircle2, Lightbulb, Bug, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";

interface ChangelogEntry {
    id: string;
    date: string;
    category: "bug-fix" | "feature" | "improvement" | "content";
    title: string;
    description: string;
    requestedBy?: string;
}

const changelogEntries: ChangelogEntry[] = [
  {
        id: "1",
        date: "June 2026",
        category: "feature",
        title: "After-Hours Callback Request Added",
        description:
                "Based on user feedback, we added an after-hours callback request option on the Contact page so families can schedule a call even outside business hours.",
        requestedBy: "Multiple users",
  },
  {
        id: "2",
        date: "June 2026",
        category: "improvement",
        title: "Instant Feedback Acknowledgment via Dezi",
        description:
                "Dezi now instantly acknowledges feedback submissions with a personalised response, so you no longer wait in silence after submitting a bug report or question.",
        requestedBy: "Community",
  },
  {
        id: "3",
        date: "June 2026",
        category: "improvement",
        title: "Feedback Urgency Triage System",
        description:
                "Bug reports and scam reports now trigger immediate notifications to our team, while feature requests are batched weekly. You get faster responses when it matters most.",
        requestedBy: "Beta users",
  },
  {
        id: "4",
        date: "June 2026",
        category: "feature",
        title: "Tool Satisfaction Pulse Added",
        description:
                "A quick thumbs-up/thumbs-down pulse now appears after every tool result (scam check, voice check, etc.) so you can rate your experience in one tap.",
        requestedBy: "User survey",
  },
  {
        id: "5",
        date: "May 2026",
        category: "bug-fix",
        title: "QR Scanner False Positive Fixed",
        description:
                "Several users reported legitimate QR codes being flagged as suspicious. We updated our detection logic and the false positive rate dropped by over 90%.",
        requestedBy: "Forum reports",
  },
  {
        id: "6",
        date: "May 2026",
        category: "content",
        title: "New Senior Safety Guide: Recognising AI Voice Scams",
        description:
                "Multiple seniors and their families asked for plain-language guidance on AI voice cloning scams. We published a dedicated step-by-step guide.",
        requestedBy: "Senior users",
  },
  ];

const categoryConfig = {
    "bug-fix": {
          label: "Bug Fix",
          icon: Bug,
          color: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    feature: {
          label: "New Feature",
          icon: Lightbulb,
          color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    },
    improvement: {
          label: "Improvement",
          icon: CheckCircle2,
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    content: {
          label: "New Content",
          icon: MessageSquare,
          color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
};

export function YouAskedWeDid() {
    const [showAll, setShowAll] = useState(false);
    const displayedEntries = showAll ? changelogEntries : changelogEntries.slice(0, 4);

  return (
        <section className="py-16 bg-[#0a1628]">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                      <FadeIn>
                                <div className="text-center mb-12">
                                            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-4">
                                                          <CheckCircle2 className="h-4 w-4 text-teal-400" />
                                                          <span className="text-teal-400 text-sm font-medium">Driven by your feedback</span>span>
                                            </div>div>
                                            <h2 className="text-3xl font-bold text-white mb-4">
                                                          You Asked. We Did.
                                            </h2>h2>
                                            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                                          Every change below came directly from users like you. When you submit feedback, we read it, act on it, and tell you what we did.
                                            </p>p>
                                </div>div>
                      </FadeIn>FadeIn>
              
                      <div className="space-y-4">
                        {displayedEntries.map((entry, index) => {
                      const config = categoryConfig[entry.category];
                      const Icon = config.icon;
                      return (
                                      <FadeIn key={entry.id} delay={index * 0.05}>
                                                      <div className="bg-[#0d1f35] border border-white/5 rounded-xl p-6 hover:border-teal-500/20 transition-colors duration-200">
                                                                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                                                                            <div className="flex-shrink-0">
                                                                                                                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                                                                                                                                          <Icon className="h-5 w-5 text-teal-400" />
                                                                                                                    </div>div>
                                                                                              </div>div>
                                                                                            <div className="flex-1 min-w-0">
                                                                                                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                                                                                                                          <Badge
                                                                                                                                                                      variant="outline"
                                                                                                                                                                      className={`text-xs ${config.color}`}
                                                                                                                                                                    >
                                                                                                                                            {config.label}
                                                                                                                                            </Badge>Badge>
                                                                                                                                          <span className="text-gray-500 text-xs">{entry.date}</span>span>
                                                                                                                    {entry.requestedBy && (
                                                                  <span className="text-gray-600 text-xs">
                                                                                              · Requested by{" "}
                                                                                              <span className="text-gray-400">{entry.requestedBy}</span>span>
                                                                  </span>span>
                                                                                                                                          )}
                                                                                                                    </div>div>
                                                                                                                  <h3 className="text-white font-semibold text-base mb-1">
                                                                                                                    {entry.title}
                                                                                                                    </h3>h3>
                                                                                                                  <p className="text-gray-400 text-sm leading-relaxed">
                                                                                                                    {entry.description}
                                                                                                                    </p>p>
                                                                                              </div>div>
                                                                        </div>div>
                                                      </div>div>
                                      </FadeIn>FadeIn>
                                    );
        })}
                      </div>div>
              
                {changelogEntries.length > 4 && (
                    <div className="text-center mt-8">
                                <Button
                                                variant="outline"
                                                onClick={() => setShowAll(!showAll)}
                                                className="border-white/10 text-gray-400 hover:text-white hover:border-teal-500/40"
                                              >
                                  {showAll ? (
                                                                <>
                                                                                  Show Less <ChevronUp className="ml-2 h-4 w-4" />
                                                                </>>
                                                              ) : (
                                                                <>
                                                                                  Show All Updates <ChevronDown className="ml-2 h-4 w-4" />
                                                                </>>
                                                              )}
                                </Button>Button>
                    </div>div>
                      )}
              
                      <FadeIn>
                                <div className="mt-12 bg-teal-500/5 border border-teal-500/15 rounded-xl p-6 text-center">
                                            <p className="text-gray-400 text-sm">
                                                          Have a suggestion or spotted a bug?{" "}
                                                          <button
                                                                            onClick={() => {
                                                                                                const btn = document.querySelector<HTMLButtonElement>(
                                                                                                                      '[data-feedback-trigger="true"]'
                                                                                                                    );
                                                                                                if (btn) btn.click();
                                                                            }}
                                                                            className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors"
                                                                          >
                                                                          Send us feedback
                                                          </button>button>{" "}
                                                          — it goes straight to the team.
                                            </p>p>
                                </div>div>
                      </FadeIn>FadeIn>
              </div>div>
        </section>section>
      );
}</></></section>
