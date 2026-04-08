import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/guides";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

export const metadata: Metadata = {
  title: "Cybersecurity Guides for Families | GetCyberRight",
  description:
    "Browse expert cybersecurity guides covering phishing, identity theft, password security, data privacy, and online safety for families, seniors, and kids.",
  alternates: { canonical: `${BASE_URL}/guides` },
  openGraph: {
    title: "Cybersecurity Guides for Families | GetCyberRight",
    description:
      "Browse expert cybersecurity guides covering phishing, identity theft, password security, data privacy, and online safety for families, seniors, and kids.",
    url: `${BASE_URL}/guides`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight Guides",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

async function fetchGuides() {
  try {
    const res = await fetch(`${API_BASE}/api/guides`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function GuidesPage() {
  const initialGuides = await fetchGuides();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Cybersecurity Guides",
      description:
        "Expert cybersecurity guides covering phishing, identity theft, password security, data privacy, and online safety for families.",
      url: `${BASE_URL}/guides`,
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
          name: "Guides",
          item: `${BASE_URL}/guides`,
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
        <PageContent initialGuides={initialGuides} />
      </Suspense>
    </>
  );
}
