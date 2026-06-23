"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { hasMarketingConsent } from "@/components/cookie-consent";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-4503226092429202";

const PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/account",
  "/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/change-password",
  "/preferences",
  "/checkout-success",
  "/extension-auth",
  "/feedback",
  "/contact",
  "/report",
  "/report-scam",
  "/scam-checker",
  "/password-generator",
  "/breach-dashboard",
  "/quick-assessment",
  "/safety-score",
  "/kids",
];

function isAdAllowedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return !PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export default function GoogleAdsense() {
  const pathname = usePathname();
  const [marketingAllowed, setMarketingAllowed] = useState(false);

  useEffect(() => {
    const update = () => setMarketingAllowed(hasMarketingConsent());
    update();
    window.addEventListener("cookie-consent-updated", update);
    return () => window.removeEventListener("cookie-consent-updated", update);
  }, []);

  if (!ADSENSE_CLIENT) return null;
  if (!isAdAllowedPath(pathname)) return null;
  if (!marketingAllowed) return null;

  return (
    <>
      <meta name="google-adsense-account" content={ADSENSE_CLIENT} />
      <Script
        id="google-adsense"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
        async
      />
    </>
  );
}
