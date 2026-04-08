import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Threat Trends | GetCyberRight",
  description: "Track the latest cybersecurity threat trends and attack patterns. Data-driven insights on emerging scams and security threats.",
  alternates: { canonical: `${BASE_URL}/threat-trends` },
  openGraph: {
    title: "Cybersecurity Threat Trends | GetCyberRight",
    description: "Track the latest cybersecurity threat trends and attack patterns. Data-driven insights on emerging scams and security threats.",
    url: `${BASE_URL}/threat-trends`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/breaking-news.png`, width: 1080, height: 1080, alt: "Threat Trends" }],
  },
};

export default function ThreatTrendsPage() {
  return <ClientApp />;
}
