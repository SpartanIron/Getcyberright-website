import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/news";
import { getLatestNews } from "../lib/data";
export const dynamic = 'force-dynamic';

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "News & Insights | Cybersecurity Updates for Families | GetCyberRight",
  description:
    "Stay informed with the latest cybersecurity news, threat intelligence, AI safety insights, learning opportunities, and security advisories. Expert analysis curated for families.",
  alternates: {
    canonical: `${BASE_URL}/news`,
    types: {
      "application/rss+xml": [
        { url: `${BASE_URL}/rss.xml`, title: "GetCyberRight News & Insights RSS" },
      ],
    },
  },
  openGraph: {
    title: "News & Insights | Cybersecurity Updates for Families | GetCyberRight",
    description:
      "Stay informed with the latest cybersecurity news, threat intelligence, AI safety insights, learning opportunities, and security advisories. Expert analysis curated for families.",
    url: `${BASE_URL}/news`,
    siteName: "GetCyberRight",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/news-alerts.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight News & Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "News & Insights | GetCyberRight",
    description:
      "Expert cybersecurity analysis, threat intelligence, and learning opportunities curated for families.",
    images: [`${BASE_URL}/og/news-alerts.png`],
  },
};

export default async function NewsPage() {
  const initialNews = await getLatestNews(100);
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "News & Insights",
      description:
        "Expert cybersecurity analysis, threat intelligence, AI safety insights, and learning opportunities curated for families.",
      url: `${BASE_URL}/news`,
      publisher: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: BASE_URL,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "News & Insights",
          item: `${BASE_URL}/news`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent initialNews={initialNews} />
    </>
  );
}
