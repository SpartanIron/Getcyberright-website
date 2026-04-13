import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/data-removal";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Remove Your Personal Info from Data Broker Sites | GetCyberRight",
  description: "Find and remove your personal information from 501+ data broker sites. Free opt-out guides with step-by-step instructions. No account needed to get started.",
  alternates: { canonical: `${BASE_URL}/data-removal` },
  openGraph: {
    title: "Remove Your Personal Info from Data Broker Sites | GetCyberRight",
    description: "Find and remove your personal information from 501+ data broker sites. Free opt-out guides with step-by-step instructions. No account needed to get started.",
    url: `${BASE_URL}/data-removal`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/data-shield.png`, width: 1080, height: 1080, alt: "Data Broker Removal" }],
  },
};

export const revalidate = 3600;

export default function DataRemovalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do data brokers get my personal information?",
        acceptedAnswer: { "@type": "Answer", text: "Data brokers collect your information from public records, social media profiles, online purchases, loyalty programs, and other websites that share or sell user data. They aggregate this information and sell it to advertisers, employers, and anyone willing to pay." },
      },
      {
        "@type": "Question",
        name: "How do I remove my information from data broker sites?",
        acceptedAnswer: { "@type": "Answer", text: "Each data broker has its own opt-out process. GetCyberRight provides step-by-step opt-out instructions for over 501 data broker sites. You can search for specific brokers and follow the guided removal process. No account required to get started." },
      },
      {
        "@type": "Question",
        name: "How long does data broker removal take?",
        acceptedAnswer: { "@type": "Answer", text: "Most data brokers process removal requests within 30 to 45 days, though some may take longer. A few brokers remove your data within 24 to 48 hours. You may need to follow up periodically as brokers can re-collect your information over time." },
      },
      {
        "@type": "Question",
        name: "Is data broker removal free?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. GetCyberRight provides free opt-out guides for all 501+ data broker sites. You can search for brokers, view their opt-out instructions, and submit removal requests at no cost." },
      },
      {
        "@type": "Question",
        name: "Can data brokers re-add my information after I remove it?",
        acceptedAnswer: { "@type": "Answer", text: "Yes, data brokers can re-collect your information from public sources over time. It's recommended to check back every few months and re-submit opt-out requests as needed. Some people set calendar reminders to do this quarterly." },
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent />
    </>
  );
}
