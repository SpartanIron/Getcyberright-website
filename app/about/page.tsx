import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/about";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
  description:
    "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
    description:
      "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
    url: `${BASE_URL}/about`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "About GetCyberRight",
      },
    ],
  },
};


export default function AboutPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "About GetCyberRight: Digital Safety Has Never Mattered More",
      description: "Online scams have changed. GetCyberRight gives families, seniors, and small businesses the simple tools and clear guidance they need to stay safe online.",
      datePublished: "2024-01-15",
      dateModified: "2026-03-01",
      author: { "@type": "Organization", name: "GetCyberRight LLC", url: BASE_URL },
      publisher: { "@type": "Organization", name: "GetCyberRight LLC", logo: `${BASE_URL}/og-image.png`, contractor: { "@type": "Organization", name: "ColorCode Solutions", url: "https://colorcodesolutions.com" } },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "About",
          item: `${BASE_URL}/about`,
        },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent />
    </>
  );
}
