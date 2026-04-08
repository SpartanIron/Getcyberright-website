import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Our Mission | GetCyberRight",
  description: "GetCyberRight's mission is to make cybersecurity education simple, practical, and available to every family.",
  alternates: { canonical: `${BASE_URL}/our-mission` },
  openGraph: {
    title: "Our Mission | GetCyberRight",
    description: "GetCyberRight's mission is to make cybersecurity education simple, practical, and available to every family.",
    url: `${BASE_URL}/our-mission`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/trust-metrics.png`, width: 1080, height: 1080, alt: "Our Mission" }],
  },
};

export default function OurMissionPage() {
  return <ClientApp />;
}
