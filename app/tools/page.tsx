import type { Metadata } from "next";
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

export default async function ToolsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : undefined;
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
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Are GetCyberRight's cybersecurity tools free?",
          acceptedAnswer: { "@type": "Answer", text: "Yes, all core tools are free to use. The GCR Scam Guard, Password Generator, Breach Monitor, and Data Broker Removal tool all offer free access with no account required for basic scanning." },
        },
        {
          "@type": "Question",
          name: "What cybersecurity tools does GetCyberRight offer?",
          acceptedAnswer: { "@type": "Answer", text: "GetCyberRight provides several free tools: GCR Scam Guard (AI-powered scam detection for URLs, emails, phone numbers, and QR codes), Secure Password Generator, Data Broker Removal (opt-out guides for 501+ broker sites), Breach Monitor (check if your email has been compromised), and a browser extension for real-time protection." },
        },
        {
          "@type": "Question",
          name: "Do I need technical knowledge to use these tools?",
          acceptedAnswer: { "@type": "Answer", text: "No. All tools are designed for everyday users with no technical background. Simply paste a suspicious link, enter your email to check for breaches, or click a button to generate a password. Results are presented in plain language with clear recommendations." },
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
      <PageContent tab={tab} />
    </>
  );
}
