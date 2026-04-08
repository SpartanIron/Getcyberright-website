import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/tools";

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

export const revalidate = 3600;

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
      "@type": "WebApplication",
      name: "GCR Scam Guard",
      description: "AI-powered tool to check if URLs, emails, phone numbers, and QR codes are scams.",
      url: `${BASE_URL}/tools`,
      applicationCategory: "SecurityApplication",
      provider: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "GCR Data Shield - Personal Data Exposure Scanner",
      description: "Scan for your exposed personal information across data broker sites and breach databases.",
      url: `${BASE_URL}/shield`,
      applicationCategory: "SecurityApplication",
      provider: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
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
      <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>
    </>
  );
}
