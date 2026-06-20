/**
 * after-hours-callback.tsx
 *
 * Recommendation #4 — After-Hours Coverage & Callback Request
 *
 * Problem: The phone line is Mon–Fri 9am–5pm EST. Users who panic at
 * 11pm (a scam is happening right now, their child just got a threatening
 * message) have no human escalation path.
 *
 * Solution:
 *  1. A smart time-aware banner on the Contact page that detects whether
 *     the team is currently available and shows the right CTA.
 *  2. An after-hours callback request form so users can book a call for
 *     first-thing next business morning — with immediate Dezi triage
 *     so they're not left alone overnight.
 *
 * Usage: Import <AfterHoursCallbackBanner /> into contact-content.tsx
 * just below the existing contactMethods cards.
 */

"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Phone, Clock, CheckCircle2, MessageCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FadeIn } from "@/components/fade-in";

/** Returns true if current time is within business hours (Mon–Fri 9–17 EST). */
function isBusinessHours(): boolean {
    const now = new Date();
    // Convert to Eastern Time
  const estOffset = -5 * 60; // EST = UTC-5 (simplified; doesn't handle DST)
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const estMinutes = ((utcMinutes + estOffset) % (24 * 60) + 24 * 60) % (24 * 60);
    const estHour = Math.floor(estMinutes / 60);
    const dayOfWeek = new Date(
          now.getTime() + estOffset * 60 * 1000
        ).getUTCDay(); // 0=Sun, 6=Sat
  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
    const isDuringHours = estHour >= 9 && estHour < 17;
    return isWeekday && isDuringHours;
}

interface CallbackFormData {
    name: string;
    phone: string;
    email: string;
    urgency: "emergency" | "urgent" | "normal";
    message: string;
}

export function AfterHoursCallbackBanner() {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<CallbackFormData>({
          name: "",
          phone: "",
          email: "",
          urgency: "normal",
          message: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();
    const open = isBusinessHours();

  const callbackMutation = useMutation({
        mutationFn: async (data: CallbackFormData) => {
                const res = await apiRequest("POST", "/api/callback-request", {
                          ...data,
                          requestedAt: new Date().toISOString(),
                          scheduledFor: "Next available business hour (Mon–Fri 9am–5pm EST)",
                });
                return res.json();
        },
        onSuccess: () => {
                setSubmitted(true);
                toast({
                          title: "Callback scheduled.",
                          description:
                                      "We'll call you at the start of next business hours. Tonight, Dezi (bottom-right) is available 24/7 for immediate guidance.",
                          duration: 8000,
                });
        },
        onError: () => {
                toast({
                          title: "Could not schedule callback",
                          description: "Please email us at info@getcyberright.com instead.",
                          variant: "destructive",
                });
        },
  });

  const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
                toast({
                          title: "Name and phone number are required.",
                          variant: "destructive",
                });
                return;
        }
        callbackMutation.mutate(formData);
  };

  // If lines are open, show a compact "lines are open" indicator
  if (open) {
        return (
                <FadeIn>
                        <div className="mt-6 flex items-center gap-3 bg-green-500/5 border border-green-500/20 rounded-xl px-5 py-4">
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                                  <p className="text-green-400 text-sm font-medium">
                                              Lines are open right now — call us at{" "}
                                              <a
                                                              href="tel:+15715778442"
                                                              className="underline underline-offset-2 hover:text-green-300 transition-colors"
                                                            >
                                                            +1 571-577-8442
                                              </a>a>
                                  </p>p>
                        </div>div>
                </FadeIn>FadeIn>
              );
  }
  
    // After hours: show the callback banner
    return (
          <FadeIn>
                <div className="mt-6 bg-[#0d1f35] border border-white/5 rounded-xl overflow-hidden">
                  {/* Header */}
                        <div className="flex items-start gap-4 p-5 border-b border-white/5">
                                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                              <Clock className="h-5 w-5 text-amber-400" />
                                  </div>div>
                                  <div>
                                              <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="text-white font-semibold text-sm">
                                                                            Outside Business Hours
                                                            </h3>h3>
                                                            <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">
                                                                            Mon–Fri 9am–5pm EST
                                                            </span>span>
                                              </div>div>
                                              <p className="text-gray-400 text-sm leading-relaxed">
                                                            Our phone line is currently closed. You can{" "}
                                                            <button
                                                                              onClick={() => setShowForm(true)}
                                                                              className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors"
                                                                            >
                                                                            schedule a callback
                                                            </button>button>{" "}
                                                            for first-thing tomorrow morning, or{" "}
                                                            <button
                                                                              onClick={() => {
                                                                                                  const deziBtn = document.querySelector<HTMLButtonElement>(
                                                                                                                        '[data-dezi-trigger="true"]'
                                                                                                                      );
                                                                                                  if (deziBtn) deziBtn.click();
                                                                              }}
                                                                              className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors"
                                                                            >
                                                                            talk to Dezi now
                                                            </button>button>{" "}
                                                            — Dezi is available 24/7 and can handle most urgent questions immediately.
                                              </p>p>
                                  </div>div>
                        </div>div>
                
                  {/* Dezi 24/7 nudge */}
                        <div className="flex items-center gap-3 px-5 py-3 bg-teal-500/5 border-b border-teal-500/10">
                                  <MessageCircle className="h-4 w-4 text-teal-400 flex-shrink-0" />
                                  <p className="text-teal-300 text-xs">
                                              <strong>Dezi is awake right now.</strong>strong> For scams, suspicious links, or
                                              safety questions — ask Dezi in the bottom-right corner for an instant answer.
                                  </p>p>
                        </div>div>
                
                  {/* Callback form */}
                  {showForm && !submitted && (
                      <form onSubmit={handleSubmit} className="p-5 space-y-4">
                                  <p className="text-gray-300 text-sm font-medium">
                                                Schedule a callback — we'll ring you first thing tomorrow.
                                  </p>p>
                      
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                                <label className="text-gray-400 text-xs mb-1.5 block">
                                                                                  Your name *
                                                                </label>label>
                                                                <Input
                                                                                    value={formData.name}
                                                                                    onChange={(e) =>
                                                                                                          setFormData({ ...formData, name: e.target.value })
                                                                                      }
                                                                                    placeholder="Jane Smith"
                                                                                    className="bg-[#0a1628] border-white/10 text-white placeholder:text-gray-600"
                                                                                    required
                                                                                  />
                                                </div>div>
                                                <div>
                                                                <label className="text-gray-400 text-xs mb-1.5 block">
                                                                                  Phone number *
                                                                </label>label>
                                                                <Input
                                                                                    value={formData.phone}
                                                                                    onChange={(e) =>
                                                                                                          setFormData({ ...formData, phone: e.target.value })
                                                                                      }
                                                                                    placeholder="+1 (555) 000-0000"
                                                                                    type="tel"
                                                                                    className="bg-[#0a1628] border-white/10 text-white placeholder:text-gray-600"
                                                                                    required
                                                                                  />
                                                </div>div>
                                  </div>div>
                      
                                  <div>
                                                <label className="text-gray-400 text-xs mb-1.5 block">
                                                                Email (optional — for a written follow-up too)
                                                </label>label>
                                                <Input
                                                                  value={formData.email}
                                                                  onChange={(e) =>
                                                                                      setFormData({ ...formData, email: e.target.value })
                                                                  }
                                                                  placeholder="jane@example.com"
                                                                  type="email"
                                                                  className="bg-[#0a1628] border-white/10 text-white placeholder:text-gray-600"
                                                                />
                                  </div>div>
                      
                                  <div>
                                                <label className="text-gray-400 text-xs mb-2 block">
                                                                How urgent is this?
                                                </label>label>
                                                <div className="flex flex-wrap gap-2">
                                                  {(
                                          [
                                            { value: "emergency", label: "Emergency", icon: AlertTriangle, color: "border-red-500/40 text-red-400" },
                                            { value: "urgent", label: "Urgent", icon: Clock, color: "border-amber-500/40 text-amber-400" },
                                            { value: "normal", label: "Not urgent", icon: Phone, color: "border-white/10 text-gray-400" },
                                                              ] as const
                                        ).map(({ value, label, icon: Icon, color }) => (
                                                            <button
                                                                                  key={value}
                                                                                  type="button"
                                                                                  onClick={() => setFormData({ ...formData, urgency: value })}
                                                                                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
                                                                                                          formData.urgency === value
                                                                                                            ? `${color} bg-white/5`
                                                                                                            : "border-white/5 text-gray-600 hover:border-white/10"
                                                                                    }`}
                                                                                >
                                                                                <Icon className="h-3 w-3" />
                                                              {label}
                                                            </button>button>
                                                          ))}
                                                </div>div>
                                  </div>div>
                      
                                  <div>
                                                <label className="text-gray-400 text-xs mb-1.5 block">
                                                                Brief description (optional)
                                                </label>label>
                                                <Input
                                                                  value={formData.message}
                                                                  onChange={(e) =>
                                                                                      setFormData({ ...formData, message: e.target.value })
                                                                  }
                                                                  placeholder="e.g. My parent received a suspicious call asking for bank details"
                                                                  className="bg-[#0a1628] border-white/10 text-white placeholder:text-gray-600"
                                                                />
                                  </div>div>
                      
                                  <Button
                                                  type="submit"
                                                  disabled={callbackMutation.isPending}
                                                  className="w-full bg-teal-600 hover:bg-teal-500 text-white"
                                                >
                                    {callbackMutation.isPending ? "Scheduling..." : "Schedule My Callback"}
                                  </Button>Button>
                      </form>form>
                        )}
                
                  {/* Success state */}
                  {submitted && (
                      <div className="p-5 flex items-start gap-3">
                                  <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                                  <div>
                                                <p className="text-white font-semibold text-sm mb-1">
                                                                You're on the list.
                                                </p>p>
                                                <p className="text-gray-400 text-sm">
                                                                We'll call you first thing next business morning. Tonight, ask
                                                                Dezi (bottom-right) for anything urgent — Dezi is powered by
                                                                the same AI that helps our team and is available right now.
                                                </p>p>
                                  </div>div>
                      </div>div>
                        )}
                
                  {/* Show form button if not yet shown */}
                  {!showForm && !submitted && (
                      <div className="px-5 pb-5 pt-3">
                                  <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => setShowForm(true)}
                                                  className="border-white/10 text-gray-400 hover:text-white hover:border-teal-500/30 text-xs"
                                                >
                                                <Phone className="h-3 w-3 mr-1.5" />
                                                Schedule a callback for tomorrow
                                  </Button>Button>
                      </div>div>
                        )}
                </div>div>
          </FadeIn>FadeIn>
        );
}</FadeIn>
