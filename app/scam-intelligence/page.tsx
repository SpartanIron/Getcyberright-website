import type { Metadata } from "next";
import PageContent from "@/pages/scam-intelligence-dashboard";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Global Scam Intelligence Dashboard | Live Threat Map | GetCyberRight",
  description:
    "Real-time 3D visualization of global scam and cyber fraud activity. Track phishing, romance scams, investment fraud, and more across 40+ countries with data from FBI IC3, INTERPOL, CISA, and national CERTs worldwide.",
  alternates: { canonical: `${BASE_URL}/scam-intelligence` },
  openGraph: {
    title: "Global Scam Intelligence Dashboard | GetCyberRight",
    description:
      "Live threat map showing real-time scam activity worldwide. Data from FBI IC3, INTERPOL, CISA, and 20+ national cybersecurity agencies.",
    url: `${BASE_URL}/scam-intelligence`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og-scam-intelligence.png`,
        width: 1200,
        height: 630,
        alt: "GetCyberRight Global Scam Intelligence Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Global Scam Intelligence Dashboard | GetCyberRight",
    description:
      "Live threat map showing real-time scam activity worldwide. Track scams across 40+ countries.",
  },
};

export default function ScamIntelligencePage() {
  return <PageContent />;
}
