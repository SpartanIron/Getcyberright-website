import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Data Shield | GetCyberRight",
  description:
    "Scan 500+ data brokers to find where your personal information is exposed online. Get step-by-step removal guidance or automated removal.",
  alternates: { canonical: `${BASE_URL}/shield` },
  openGraph: {
    title: "GCR Data Shield | GetCyberRight",
    description:
      "Scan 500+ data brokers to find where your personal information is exposed online. Get step-by-step removal guidance or automated removal.",
    url: `${BASE_URL}/shield`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/data-shield.png`,
        width: 1080,
        height: 1080,
        alt: "GCR Data Shield",
      },
    ],
  },
};

export default function ShieldPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "GCR Data Shield",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      description:
        "Personal data exposure scanner checking 500+ data brokers. Find and remove your personal information from data broker sites.",
      url: `${BASE_URL}/shield`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free personal data scan",
      },
      provider: {
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
          name: "Tools",
          item: `${BASE_URL}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Data Shield",
          item: `${BASE_URL}/shield`,
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
      <ClientApp />
    </>
  );
}
