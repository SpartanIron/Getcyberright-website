"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import { DeziAssistant } from "@/components/dezi-assistant";
import { FeedbackWidget } from "@/components/feedback-widget";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorBoundary } from "@/components/error-boundary";
import { initGA } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/use-analytics";

function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnalyticsProvider({ children }: { children: ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}

export function ClientShell({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
    if (gaMeasurementId) {
      initGA();
    }

    const handleConsentUpdate = () => {
      if (gaMeasurementId) {
        initGA();
      }
    };
    window.addEventListener("cookie-consent-updated", handleConsentUpdate);
    return () => window.removeEventListener("cookie-consent-updated", handleConsentUpdate);
  }, []);

  return (
    <>
      <ScrollToTop />
      <AnnouncementBanner />
      <Toaster />
      <ErrorBoundary>
        <AnalyticsProvider>
          {children}
        </AnalyticsProvider>
      </ErrorBoundary>
      {isClient && (
        <>
          <DeziAssistant />
          <FeedbackWidget />
          <CookieConsent />
        </>
      )}
    </>
  );
}
