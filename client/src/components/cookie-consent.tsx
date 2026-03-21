import { useState, useEffect, useCallback, useRef } from "react";
import { Shield, Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  consentedAt: string;
};

const STORAGE_KEY = "gcr_cookie_consent";

export function getCookiePreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  const prefs = getCookiePreferences();
  return prefs?.analytics === true;
}

function saveCookiePreferences(prefs: CookiePreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: prefs }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkConsent = () => {
      const existing = getCookiePreferences();
      if (!existing) {
        const timer = setTimeout(() => setVisible(true), 1500);
        return () => clearTimeout(timer);
      }
    };
    checkConsent();

    const handleReopen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === null) {
        setVisible(true);
        setShowDetails(false);
        setAnalytics(false);
        setMarketing(false);
      }
    };
    window.addEventListener("cookie-consent-reopen", handleReopen);
    return () => window.removeEventListener("cookie-consent-reopen", handleReopen);
  }, []);

  useEffect(() => {
    if (visible && firstFocusRef.current) {
      firstFocusRef.current.focus();
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRejectAll();
      }
      if (e.key === "Tab" && bannerRef.current) {
        const focusable = bannerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible]);

  const handleAcceptAll = useCallback(() => {
    saveCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
      consentedAt: new Date().toISOString(),
    });
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    saveCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      consentedAt: new Date().toISOString(),
    });
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    saveCookiePreferences({
      necessary: true,
      analytics,
      marketing,
      consentedAt: new Date().toISOString(),
    });
    setVisible(false);
  }, [analytics, marketing]);

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      data-testid="cookie-consent-banner"
    >
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card shadow-2xl">
        <div className="p-5 md:p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-shrink-0 mt-0.5">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground mb-1" id="cookie-consent-title">
                Your Privacy Matters
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed" id="cookie-consent-desc">
                We use cookies to keep the site running (necessary) and to understand how people use our tools (analytics). We never sell your data. You choose what to allow.
              </p>
            </div>
            <button
              ref={firstFocusRef}
              onClick={handleRejectAll}
              className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss and reject all cookies"
              data-testid="cookie-dismiss"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {showDetails && (
            <div className="mb-4 space-y-3 border-t border-border pt-4" data-testid="cookie-details">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Necessary</p>
                  <p className="text-xs text-muted-foreground">Required for the site to function. Cannot be disabled.</p>
                </div>
                <div className="rounded-full bg-primary/20 px-3 py-0.5 text-xs font-medium text-primary" aria-label="Necessary cookies are always enabled">
                  Always on
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div id="analytics-label">
                  <p className="text-sm font-medium text-foreground">Analytics</p>
                  <p className="text-xs text-muted-foreground">Helps us understand which tools and pages are most useful.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center" data-testid="cookie-toggle-analytics">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="peer sr-only"
                    aria-labelledby="analytics-label"
                    aria-checked={analytics}
                  />
                  <div className="h-5 w-9 rounded-full bg-muted peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div id="marketing-label">
                  <p className="text-sm font-medium text-foreground">Marketing</p>
                  <p className="text-xs text-muted-foreground">Used for social media features and relevant content suggestions.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center" data-testid="cookie-toggle-marketing">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="peer sr-only"
                    aria-labelledby="marketing-label"
                    aria-checked={marketing}
                  />
                  <div className="h-5 w-9 rounded-full bg-muted peer-checked:bg-primary transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" />
                </label>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              onClick={() => setShowDetails(!showDetails)}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5 justify-start"
              data-testid="cookie-customize"
              aria-expanded={showDetails}
              aria-controls="cookie-details-panel"
            >
              <Settings className="h-3.5 w-3.5" aria-hidden="true" />
              {showDetails ? "Hide details" : "Customize"}
            </Button>

            <div className="flex-1" />

            {showDetails ? (
              <Button
                onClick={handleSavePreferences}
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-testid="cookie-save-preferences"
              >
                Save preferences
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleRejectAll}
                  variant="outline"
                  size="sm"
                  data-testid="cookie-reject-all"
                >
                  Reject all
                </Button>
                <Button
                  onClick={handleAcceptAll}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-testid="cookie-accept-all"
                >
                  Accept all
                </Button>
              </>
            )}
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Read our{" "}
            <a href="/privacy" className="underline hover:text-foreground transition-colors">
              Privacy Policy
            </a>{" "}
            for details on how we handle your data.
          </p>
        </div>
      </div>
    </div>
  );
}
