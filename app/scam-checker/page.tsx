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

export const revalidate = 3600;

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
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How does the GCR Scam Guard work?",
          acceptedAnswer: { "@type": "Answer", text: "The GCR Scam Guard analyzes URLs, emails, phone numbers, QR codes, and messages using multiple safety checks including AI analysis, trusted data sources, and domain reputation checks to determine if something is a scam." },
        },
        {
          "@type": "Question",
          name: "Is the GCR Scam Guard free to use?",
          acceptedAnswer: { "@type": "Answer", text: "Manual scanning on the website is free and requires no account. Just paste a suspicious link, message, or phone number and get instant results. The browser extension also includes free manual scanning, with optional paid plans for advanced protection." },
        },
        {
          "@type": "Question",
          name: "What types of scams can it detect?",
          acceptedAnswer: { "@type": "Answer", text: "The tool can detect phishing links, fraudulent websites, scam phone numbers, suspicious email content, malicious QR codes, and social engineering attempts across multiple categories of online fraud." },
        },
      ],
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
