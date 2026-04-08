import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Your Cyber Safety Score | GetCyberRight",
  description: "Calculate your personal cyber safety score based on your security practices. Get a detailed breakdown and actionable steps.",
  alternates: { canonical: `${BASE_URL}/safety-score` },
  openGraph: {
    title: "Your Cyber Safety Score | GetCyberRight",
    description: "Calculate your personal cyber safety score based on your security practices. Get a detailed breakdown and actionable steps.",
    url: `${BASE_URL}/safety-score`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/trust-metrics.png`, width: 1080, height: 1080, alt: "Cyber Safety Score" }],
  },
};

export default function SafetyScorePage() {
  return <ClientApp />;
}
