import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

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

export default function ScamIntelPage() {
  const jsonLd = {
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
  };

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
