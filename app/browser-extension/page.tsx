import type { Metadata } from "next";
import PageContent from "@/pages/browser-extension";

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

export const revalidate = 3600;

export default function BrowserExtensionPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "GCR Scam Guard Chrome Extension",
      applicationCategory: "BrowserExtension",
      operatingSystem: "Chrome",
      description:
        "Chrome browser extension providing real-time scam detection, phishing alerts, and website safety ratings. Uses VirusTotal, PhishTank, Google Safe Browsing, and AI analysis.",
      url: `${BASE_URL}/browser-extension`,
      installUrl: "https://chromewebstore.google.com/detail/gcr-scam-guard-by-getcybe/naopegeklahanndbpanhienlkaachjhk",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: {
        "@type": "Organization",
        name: "GetCyberRight LLC",
        url: BASE_URL,
        contractor: { "@type": "Organization", name: "ColorCode Solutions", url: "https://colorcodesolutions.com" },
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
      <PageContent />
    </>
  );
}
