import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Scam Guard: Analyze URLs, Emails, Messages & QR Codes",
  description:
    "Analyze suspicious URLs, emails, text messages, and QR codes with our AI-powered scam checker. Free manual scanning, no account required.",
  alternates: { canonical: `${BASE_URL}/scam-checker` },
  openGraph: {
    title: "GCR Scam Guard: Analyze URLs, Emails, Messages & QR Codes",
    description:
      "Analyze suspicious URLs, emails, text messages, and QR codes with our AI-powered scam checker. Free manual scanning, no account required.",
    url: `${BASE_URL}/scam-checker`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "GCR Scam Guard" }],
  },
};

export default function ScamCheckerPage() {
  return <ClientApp />;
}
