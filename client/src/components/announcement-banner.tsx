import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone, AlertTriangle, Sparkles, Info, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlatformAnnouncement } from "@shared/schema";

const DISMISSED_KEY = "gcr_dismissed_announcements";

function getDismissedIds(): string[] {
  try {
    const stored = localStorage.getItem(DISMISSED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function dismissAnnouncement(id: string) {
  const dismissed = getDismissedIds();
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    localStorage.setItem(DISMISSED_KEY, JSON.stringify(dismissed));
  }
}

function getTypeConfig(type: string, priority: string) {
  if (priority === "urgent") {
    return {
      icon: AlertTriangle,
      bg: "bg-red-600 dark:bg-red-700",
      text: "text-white",
      border: "",
    };
  }

  switch (type) {
    case "scam_alert":
      return {
        icon: AlertTriangle,
        bg: "bg-orange-500 dark:bg-orange-600",
        text: "text-white",
        border: "",
      };
    case "new_feature":
      return {
        icon: Sparkles,
        bg: "bg-primary",
        text: "text-primary-foreground",
        border: "",
      };
    case "update":
    default:
      return {
        icon: Megaphone,
        bg: "bg-slate-800 dark:bg-slate-700",
        text: "text-white",
        border: "",
      };
  }
}

export function AnnouncementBanner() {
  const [dismissedIds, setDismissedIds] = useState<string[]>(getDismissedIds);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleDismiss = (id: string) => {
    dismissAnnouncement(id);
    setDismissedIds(getDismissedIds());
  };

  if (visibleAnnouncements.length === 0) return null;

  const current = visibleAnnouncements[currentIndex] || visibleAnnouncements[0];
  if (!current) return null;

  const config = getTypeConfig(current.type, current.priority);
  const Icon = config.icon;
  const hasMultiple = visibleAnnouncements.length > 1;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`${config.bg} ${config.text} relative z-50`}
        role="status"
        aria-live="polite"
        data-testid="announcement-banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 py-2.5 sm:py-2">
            {hasMultiple && (
              <button
                onClick={() =>
                  setCurrentIndex(
                    (currentIndex - 1 + visibleAnnouncements.length) %
                      visibleAnnouncements.length
                  )
                }
                className="opacity-70 hover:opacity-100 flex-shrink-0"
                aria-label="Previous announcement"
                data-testid="button-announcement-prev"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium" data-testid="text-announcement-title">
                <span>{current.title}</span>
                <span className="font-normal opacity-90 ml-1" data-testid="text-announcement-content">
                  &mdash; {current.content}
                </span>
              </p>
              {current.linkUrl && (
                <a
                  href={current.linkUrl}
                  className="inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2 opacity-90 hover:opacity-100 mt-0.5"
                  data-testid="link-announcement"
                >
                  {current.linkText || "Learn more"}
                  <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>

            {hasMultiple && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-xs opacity-70 hidden sm:inline">
                  {currentIndex + 1}/{visibleAnnouncements.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentIndex(
                      (currentIndex + 1) % visibleAnnouncements.length
                    )
                  }
                  className="opacity-70 hover:opacity-100"
                  aria-label="Next announcement"
                  data-testid="button-announcement-next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => handleDismiss(current.id)}
              className="opacity-70 hover:opacity-100 flex-shrink-0 p-0.5"
              aria-label="Dismiss announcement"
              data-testid="button-dismiss-announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
