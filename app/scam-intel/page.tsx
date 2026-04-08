import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/scam-intel-listing";

const BASE_URL = "https://www.getcyberright.com";
const API_BASE = `http://localhost:${process.env.PORT || 5000}`;

export const metadata: Metadata = {
  title: "Scam Intelligence Center | GetCyberRight",
  description:
    "Deep-dive intelligence reports on how scams work, who they target, and how to protect yourself. Detailed analysis of current and emerging scam tactics.",
  alternates: { canonical: `${BASE_URL}/scam-intel` },
  openGraph: {
    title: "Scam Intelligence Center | GetCyberRight",
    description:
      "Deep-dive intelligence reports on how scams work, who they target, and how to protect yourself. Detailed analysis of current and emerging scam tactics.",
    url: `${BASE_URL}/scam-intel`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/scam-calls-texts.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight Scam Intelligence",
      },
    ],
  },
};

export const dynamic = "force-dynamic";
export const revalidate = 3600;

async function fetchScamIntel() {
  try {
    const res = await fetch(`${API_BASE}/api/scam-intel`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ScamIntelPage() {
  const initialScams = await fetchScamIntel();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Scam Intelligence",
          item: `${BASE_URL}/scam-intel`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "Scam Intelligence Database",
      description: "Comprehensive database of active scams with risk levels, warning signs, prevention tips, and regional targeting data.",
      url: `${BASE_URL}/scam-intel`,
      keywords: ["scam database", "fraud intelligence", "cybersecurity threats", "scam prevention", "phishing scams"],
      creator: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
      variableMeasured: ["risk level", "report count", "average financial loss", "target audience", "platforms used"],
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
        <PageContent initialScams={initialScams} />
      </Suspense>
    </>
  );
}
