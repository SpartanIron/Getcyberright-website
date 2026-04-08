import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/news";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

export const metadata: Metadata = {
  title: "Cybersecurity News & Updates | GetCyberRight",
  description:
    "Stay informed with the latest cybersecurity news, data breach reports, emerging threats, and security advisories. Curated updates for families and businesses.",
  alternates: { canonical: `${BASE_URL}/news` },
  openGraph: {
    title: "Cybersecurity News & Updates | GetCyberRight",
    description:
      "Stay informed with the latest cybersecurity news, data breach reports, emerging threats, and security advisories. Curated updates for families and businesses.",
    url: `${BASE_URL}/news`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/news-alerts.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight News",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

async function fetchNews() {
  try {
    const res = await fetch(`${API_BASE}/api/news/latest?limit=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function NewsPage() {
  const initialNews = await fetchNews();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Cybersecurity News & Updates",
      description:
        "Latest cybersecurity news, data breach reports, emerging threats, and security advisories curated for families.",
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
          name: "News",
          item: `${BASE_URL}/news`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Suspense fallback={<PageSkeleton />}>
        <PageContent initialNews={initialNews} />
      </Suspense>
    </>
  );
}
