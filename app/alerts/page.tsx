import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cyber Threat Alerts | GetCyberRight",
  description:
    "Stay informed with the latest cybersecurity threat alerts. Real-time warnings about active scams, malware, data breaches, and emerging threats.",
  alternates: { canonical: `${BASE_URL}/alerts` },
  openGraph: {
    title: "Cyber Threat Alerts | GetCyberRight",
    description:
      "Stay informed with the latest cybersecurity threat alerts. Real-time warnings about active scams, malware, data breaches, and emerging threats.",
    url: `${BASE_URL}/alerts`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/news-alerts.png`, width: 1080, height: 1080, alt: "GetCyberRight Threat Alerts" }],
  },
};

export default function AlertsPage() {
  return <ClientApp />;
}
