import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Contact GetCyberRight: Get in Touch | GetCyberRight",
  description:
    "Contact the GetCyberRight team for questions about cybersecurity education, partnership opportunities, or to report a scam.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact GetCyberRight: Get in Touch | GetCyberRight",
    description:
      "Contact the GetCyberRight team for questions about cybersecurity education, partnership opportunities, or to report a scam.",
    url: `${BASE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${BASE_URL}/contact`,
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
      <ClientApp page="contact" />
    </>
  );
}
