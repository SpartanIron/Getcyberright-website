import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Tools & Scam Guard | GetCyberRight",
  description:
    "Access cybersecurity tools including an AI-powered GCR Scam Guard, secure Password Generator, Data Broker Removal, and Breach Monitor. Core tools are free.",
  alternates: { canonical: `${BASE_URL}/tools` },
  openGraph: {
    title: "Cybersecurity Tools & Scam Guard | GetCyberRight",
    description:
      "Access cybersecurity tools including an AI-powered GCR Scam Guard, secure Password Generator, Data Broker Removal, and Breach Monitor. Core tools are free.",
    url: `${BASE_URL}/tools`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/scam-guard.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight Tools",
      },
    ],
  },
};

export default function ToolsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Cybersecurity Tools & Scam Guard",
      description:
        "Free cybersecurity tools including AI-powered scam detection, password generator, data broker removal, and breach monitoring.",
      url: `${BASE_URL}/tools`,
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
          name: "Tools",
          item: `${BASE_URL}/tools`,
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
          title="Cybersecurity Protection Tools"
          description="Free cybersecurity tools including AI scam checker, password generator, data broker scanner, breach monitoring, and browser extension."
          sections={[{"heading":"GCR Scam Guard","text":"Analyze suspicious URLs, emails, phone numbers, QR codes, and text messages with our AI-powered scam detection."},{"heading":"GCR Data Shield","text":"Scan 500+ data brokers to discover where your personal information is exposed online."},{"heading":"Password Generator","text":"Generate strong, unique passwords with customizable length, character types, and passphrase options."},{"heading":"Browser Extension","text":"Real-time protection while you browse with automatic page scanning and safety badges."}]}
          links={[{"label":"Scam Checker","href":"/scam-checker"},{"label":"Data Shield","href":"/shield"},{"label":"Password Generator","href":"/password-generator"}]}
        />
        <ClientApp page="tools" />
    </>
  );
}
