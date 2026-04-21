import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/alerts-listing";
import { getThreatAlerts } from "../lib/data";

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

export default async function AlertsPage() {
  const initialAlerts = (await getThreatAlerts()) as unknown[];

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
      <PageContent initialAlerts={initialAlerts as never} />
    </>
  );
}
