import type { Metadata } from "next";
import PageContent from "@/pages/scam-checker";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Scam Guard: Analyze URLs, Emails, Messages & QR Codes",
  description:
    "Analyze suspicious URLs, emails, text messages, and QR codes with our AI-powered scam checker. Free manual scanning, no account required.",
  alternates: { canonical: `${BASE_URL}/scam-checker` },
  openGraph: {
    title: "GCR Scam Guard: Analyze URLs, Emails, Messages & QR Codes",
    description:
      "Analyze suspicious URLs, emails, text messages, and QR codes with our AI-powered scam checker. Free manual scanning, no account required.",
    url: `${BASE_URL}/scam-checker`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/scam-guard.png`,
        width: 1080,
        height: 1080,
        alt: "GCR Scam Guard",
      },
    ],
  },
};

export default function ScamCheckerPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "GCR Scam Guard",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      description:
        "AI-powered scam detection tool that analyzes URLs, emails, text messages, and QR codes for potential threats.",
      url: `${BASE_URL}/scam-checker`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
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
          name: "Scam Guard",
          item: `${BASE_URL}/scam-checker`,
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
      <PageContent />
    </>
  );
}
