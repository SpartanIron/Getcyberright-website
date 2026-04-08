import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Plans & Pricing | GetCyberRight",
  description:
    "GetCyberRight is free to get started. Access AI-powered scam checking, data broker removal, safety training, and more.",
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: "Plans & Pricing | GetCyberRight",
    description:
      "GetCyberRight is free to get started. Access AI-powered scam checking, data broker removal, safety training, and more.",
    url: `${BASE_URL}/pricing`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight Pricing",
      },
    ],
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pricing",
        item: `${BASE_URL}/pricing`,
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
      <SSRContent
          title="GetCyberRight Pricing Plans"
          description="Compare GetCyberRight subscription plans. Free tools, Essential auto-protection, and Professional advanced features."
          sections={[{"heading":"Free Plan","text":"Manual scam checking, guides, training courses, and educational content at no cost."},{"heading":"Essential Plan","text":"Auto-Protect with automatic page scanning, enhanced scan history, and priority analysis."},{"heading":"Professional Plan","text":"Full protection with safety scores, family profiles, data broker monitoring, and all premium features."}]}
        />
        <ClientApp page="pricing" />
    </>
  );
}
