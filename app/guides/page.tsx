import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

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

export default function GuidesPage() {
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
      <SSRContent
          title="Cybersecurity Safety Guides"
          description="Comprehensive cybersecurity guides covering password security, phishing prevention, social media safety, and identity protection."
          sections={[{"heading":"Expert Guides for Every Topic","text":"Library of cybersecurity guides covering everything from basic password hygiene to advanced privacy protection in plain language."}]}
        />
        <ClientApp page="guides" />
    </>
  );
}
