import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/alerts-listing";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

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
          images: [
            {
                      url: `${BASE_URL}/og/news-alerts.png`,
                      width: 1080,
                      height: 1080,
                      alt: "GetCyberRight Threat Alerts",
            },
                ],
    },
};

export const revalidate = 3600;

async function fetchAlerts() {
    try {
          const res = await fetch(`${API_BASE}/api/alerts`, {
                  next: { revalidate: 3600 },
          });
          if (!res.ok) return [];
          return res.json();
    } catch {
          return [];
    }
}

export default async function AlertsPage() {
    const initialAlerts = await fetchAlerts();

  const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
                    "@type": "ListItem",
                    position: 2,
                    name: "Threat Alerts",
                    item: `${BASE_URL}/alerts`,
          },
              ],
  };

  return (
        <>
              <JsonLd data={jsonLd} />
              <PageContent initialAlerts={initialAlerts} />
        </>>
      );
}</>
