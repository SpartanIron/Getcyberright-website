"use client";

import { useEffect, useState } from "react";
import { hasMarketingConsent } from "@/components/cookie-consent";

export type AdFormat =
  | "in-article"
  | "multiplex"
  | "leaderboard"
  | "sidebar"
  | "auto";

interface AdSlotProps {
  slot: string;
  format?: AdFormat;
  className?: string;
  testId?: string;
}

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4503226092429202";

const FORMATS_WITH_LABEL: AdFormat[] = ["in-article", "leaderboard"];

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSlot({
  slot,
  format = "auto",
  className,
  testId,
}: AdSlotProps) {
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const update = () => setMarketingAllowed(hasMarketingConsent());
    update();
    window.addEventListener("cookie-consent-updated", update);
    return () => window.removeEventListener("cookie-consent-updated", update);
  }, []);

  useEffect(() => {
    if (!ADSENSE_CLIENT || !slot || !marketingAllowed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js may not be loaded yet on first render; silently ignore.
    }
  }, [slot, marketingAllowed]);

  if (!ADSENSE_CLIENT || !slot) return null;
  if (!marketingAllowed) return null;

  const insStyle: React.CSSProperties = { display: "block" };
  let dataAdFormat = "auto";
  let dataAdLayout: string | undefined;
  const dataFullWidthResponsive = "true";

  switch (format) {
    case "in-article":
      dataAdFormat = "fluid";
      dataAdLayout = "in-article";
      insStyle.textAlign = "center";
      break;
    case "multiplex":
      dataAdFormat = "autorelaxed";
      break;
    case "leaderboard":
    case "sidebar":
    case "auto":
    default:
      dataAdFormat = "auto";
      break;
  }

  const containerClass = ["ad-container", className].filter(Boolean).join(" ");

  return (
    <div
      className={containerClass}
      data-testid={testId || `ad-slot-${slot}`}
      aria-label="Advertisement"
      style={{ minHeight: 50 }}
    >
      {FORMATS_WITH_LABEL.includes(format) && (
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground text-center mb-1">
          Advertisement
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={insStyle}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={dataAdFormat}
        {...(dataAdLayout ? { "data-ad-layout": dataAdLayout } : {})}
        data-full-width-responsive={dataFullWidthResponsive}
      />
    </div>
  );
}
