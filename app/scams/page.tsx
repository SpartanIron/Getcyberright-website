import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent, { type ScamGuideMeta } from "@/pages/scams-listing";
import { SCAM_PAGES } from "@shared/scam-content";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Common Scam Guides | How They Work & How to Avoid Them | GetCyberRight",
  description:
    "Plain-language guides to today's most common scams: phishing, romance, tech support, identity theft, investment fraud, and more. Learn the warning signs and how to protect your family.",
  alternates: { canonical: `${BASE_URL}/scams` },
  openGraph: {
    title: "Common Scam Guides | GetCyberRight",
    description:
      "Plain-language guides to today's most common scams. Learn warning signs and how to protect your family.",
    url: `${BASE_URL}/scams`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/scam-calls-texts.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight Scam Guides",
      },
    ],
  },
};

export const revalidate = 3600;

export default function ScamsPage() {
  const initialGuides: ScamGuideMeta[] = SCAM_PAGES.map((s) => ({
    slug: s.slug,
    title: s.title,
    description: s.metaDescription,
    cluster: s.cluster,
    lastUpdated: s.lastUpdated,
  }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Scam Guides",
          item: `${BASE_URL}/scams`,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Common Scam Guides",
      description:
        "Plain-language guides to today's most common scams. Learn warning signs and how to protect yourself and your family.",
      url: `${BASE_URL}/scams`,
      publisher: {
        "@type": "Organization",
        name: "GetCyberRight",
        url: BASE_URL,
      },
      hasPart: initialGuides.map((g) => ({
        "@type": "Article",
        headline: g.title,
        description: g.description,
        url: `${BASE_URL}/scams/${g.slug}`,
        dateModified: g.lastUpdated,
      })),
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent initialGuides={initialGuides} />
    </>
  );
}
