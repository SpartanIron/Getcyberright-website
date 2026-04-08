import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Scam Guard Chrome Extension | GCR",
  description: "Protect yourself while browsing with the GCR Scam Guard Chrome extension. Real-time scam detection, phishing alerts, and website safety ratings.",
  alternates: { canonical: `${BASE_URL}/browser-extension` },
  openGraph: {
    title: "GCR Scam Guard Chrome Extension | GCR",
    description: "Protect yourself while browsing with the GCR Scam Guard Chrome extension. Real-time scam detection, phishing alerts, and website safety ratings.",
    url: `${BASE_URL}/browser-extension`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "GCR Scam Guard Extension" }],
  },
};

export default function BrowserExtensionPage() {
  return <ClientApp />;
}
