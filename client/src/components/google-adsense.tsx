"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

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
];

function isAdAllowedPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return !PRIVATE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
  );
}

export default function GoogleAdsense() {
  const pathname = usePathname();
  if (!ADSENSE_CLIENT) return null;
  if (!isAdAllowedPath(pathname)) return null;

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
      strategy="afterInteractive"
      crossOrigin="anonymous"
      async
    />
  );
}
