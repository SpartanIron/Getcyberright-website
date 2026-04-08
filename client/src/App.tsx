import { useLocation } from "@/lib/navigation";
import { useEffect, useState, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { DeziAssistant } from "@/components/dezi-assistant";
import { FeedbackWidget } from "@/components/feedback-widget";
import { AnnouncementBanner } from "@/components/announcement-banner";
import { CookieConsent } from "@/components/cookie-consent";
import { ErrorBoundary } from "@/components/error-boundary";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import { Loader2 } from "lucide-react";

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

function AnalyticsProvider({ children }: { children: ReactNode }) {
  useAnalytics();
  return <>{children}</>;
}

function App({ children }: { children?: ReactNode }) {
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
          <Suspense fallback={<PageLoader />}>
            {children}
          </Suspense>
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

export default App;
