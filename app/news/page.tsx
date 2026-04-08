import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

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

export default function NewsPage() {
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
      <SSRContent
          title="Cybersecurity News for Families"
          description="Latest cybersecurity news simplified for families. AI-curated articles about data breaches, scams, and online safety."
          sections={[{"heading":"Stay Informed","text":"Curated cybersecurity stories from trusted sources simplified for family audiences."}]}
        />
        <ClientApp page="news" />
    </>
  );
}
