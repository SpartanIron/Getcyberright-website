import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Scam Guard Chrome Extension | GCR",
  description:
    "Protect yourself while browsing with the GCR Scam Guard Chrome extension. Real-time scam detection, phishing alerts, and website safety ratings.",
  alternates: { canonical: `${BASE_URL}/browser-extension` },
  openGraph: {
    title: "GCR Scam Guard Chrome Extension | GCR",
    description:
      "Protect yourself while browsing with the GCR Scam Guard Chrome extension. Real-time scam detection, phishing alerts, and website safety ratings.",
    url: `${BASE_URL}/browser-extension`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/scam-guard.png`,
        width: 1080,
        height: 1080,
        alt: "GCR Scam Guard Extension",
      },
    ],
  },
};

export default function BrowserExtensionPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "GCR Scam Guard Chrome Extension",
      applicationCategory: "BrowserExtension",
      operatingSystem: "Chrome",
      description:
        "Chrome browser extension providing real-time scam detection, phishing alerts, and website safety ratings.",
      url: `${BASE_URL}/browser-extension`,
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
          name: "Browser Extension",
          item: `${BASE_URL}/browser-extension`,
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
          title="GCR Scam Guard Browser Extension"
          description="Chrome browser extension for real-time scam protection with auto-scanning, safety badges, and phishing warnings."
          sections={[{"heading":"Real-Time Protection","text":"Automatically scans websites as you visit them, showing safety badges and warning about suspicious sites."}]}
        />
        <ClientApp page="browser-extension" />
    </>
  );
}
