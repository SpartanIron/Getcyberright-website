import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Plans & Pricing | GetCyberRight",
  description:
    "GetCyberRight is free to get started. Access AI-powered scam checking, data broker removal, safety training, and more.",
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: "Plans & Pricing | GetCyberRight",
    description:
      "GetCyberRight is free to get started. Access AI-powered scam checking, data broker removal, safety training, and more.",
    url: `${BASE_URL}/pricing`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/trust-metrics.png`, width: 1080, height: 1080, alt: "GetCyberRight Pricing" }],
  },
};

export default function PricingPage() {
  return <ClientApp />;
}
