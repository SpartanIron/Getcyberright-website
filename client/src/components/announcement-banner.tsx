"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Sparkles, Megaphone, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlatformAnnouncement } from "@shared/schema";

const DISMISSED_KEY = "gcr_dismissed_announcements";
const DISMISS_ALL_KEY = "gcr_dismiss_all_announcements";

function getDismissedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(DISMISSED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }


function dismissAllAnnouncements() {
  try {
    localStorage.setItem(DISMISS_ALL_KEY, "true");
  } catch {}
}
}

function dismissAnnouncement(id: string) {
  const dismissed = getDismissedIds();
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
  }
}

const typeConfig: Record<string, { icon: typeof Megaphone; accent: string; dot: string }> = {
  scam_alert: {
    icon: AlertTriangle,
    accent: "text-amber-300",
    dot: "bg-amber-400",
  },
  new_feature: {
    icon: Sparkles,
    accent: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  update: {
icon: Megaphone,
    accent: "text-sky-300",
    dot: "bg-sky-400",
  },
};

export function AnnouncementBanner() {
  const [dismissedIds, setDismissedIds] = useState<string[]>(getDismissedIds);
  const [allDismissed, setAllDismissed] = useState(() => { try { if (typeof window === "undefined") return false; return localStorage.getItem(DISMISS_ALL_KEY) === "true"; } catch { return false; } });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const { data } = useQuery<{ announcements: PlatformAnnouncement[] }>({
    queryKey: ["/api/announcements"],
    refetchInterval: 5 * 60 * 1000,
  });

  const visibleAnnouncements = (data?.announcements || []).filter(
    (a) => !dismissedIds.includes(a.id)
  );

  useEffect(() => {
    if (currentIndex >= visibleAnnouncements.length && visibleAnnouncements.length > 0) {
      setCurrentIndex(visibleAnnouncements.length - 1);
    }
  }, [visibleAnnouncements.length, currentIndex]);

  useEffect(() => {
    if (visibleAnnouncements.length <= 1 || !autoRotate) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % visibleAnnouncements.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [visibleAnnouncements.length, autoRotate]);

  const handleDismiss = (id: string) => {
    dismissAnnouncement(id);
    setDismissedIds(getDismissedIds());
  };

  const handleDismissAll = () => {
    try { localStorage.setItem(DISMISS_ALL_KEY, "true"); } catch {}
    setAllDismissed(true);
  };

  if (allDismissed) return null;

  if (visibleAnnouncements.length === 0) return null;

  const current = visibleAnnouncements[currentIndex] || visibleAnnouncements[0];
  if (!current) return null;

  const config = typeConfig[current.type] || typeConfig.update;
  const isUrgent = current.priority === "urgent";
  const Icon = isUrgent ? AlertTriangle : config.icon;
  const hasMultiple = visibleAnnouncements.length > 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={`relative z-50 ${
          isUrgent
            ? "bg-red-600 dark:bg-red-700"
            : "bg-slate-900 dark:bg-slate-800"
        } text-white`}
        role="status"
        aria-live="polite"
        data-testid="announcement-banner"
        onMouseEnter={() => setAutoRotate(false)}
        onMouseLeave={() => setAutoRotate(true)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-1.5">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="relative flex items-center justify-center">
                <span className={`absolute w-1.5 h-1.5 rounded-full ${isUrgent ? "bg-white" : config.dot} animate-pulse`} />
                <span className={`w-1.5 h-1.5 rounded-full ${isUrgent ? "bg-white/50" : config.dot + "/50"}`} />
              </span>
              <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isUrgent ? "text-white" : config.accent}`} aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0 flex items-center gap-2">
              <p className="text-[13px] leading-tight truncate sm:whitespace-normal sm:overflow-visible sm:text-clip" data-testid="text-announcement-title">
                <span className="font-semibold">{current.title}</span>
                <span className="opacity-80 ml-1.5" data-testid="text-announcement-content">
                  {current.content}
                </span>
              </p>
              {current.linkUrl && (
                <a
                  href={current.linkUrl}
                  className="inline-flex items-center gap-0.5 text-[12px] font-medium opacity-80 flex-shrink-0 underline underline-offset-2"
                  data-testid="link-announcement"
                >
                  {current.linkText || "Learn more"}
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-center gap-0.5 flex-shrink-0">
              {hasMultiple && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setCurrentIndex(
                        (currentIndex - 1 + visibleAnnouncements.length) %
                          visibleAnnouncements.length
                      )
                    }
                    aria-label="Previous announcement"
                    data-testid="button-announcement-prev"
                    className="text-white/60"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-[11px] opacity-50 tabular-nums">
                    {currentIndex + 1}/{visibleAnnouncements.length}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setCurrentIndex(
                        (currentIndex + 1) % visibleAnnouncements.length
                      )
                    }
                    aria-label="Next announcement"
                    data-testid="button-announcement-next"
                    className="text-white/60"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDismissAll()}
                aria-label="Dismiss all announcements"
                data-testid="button-dismiss-announcement"
                className="text-white/60 ml-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
