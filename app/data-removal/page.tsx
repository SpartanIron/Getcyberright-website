import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/data-removal";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Free Data Broker Removal: Remove Your Info from 501+ Sites | GetCyberRight",
  description: "Free data broker removal service. Remove your personal information from 501+ data broker sites with step-by-step opt-out guides. No account or payment needed.",
  alternates: { canonical: `${BASE_URL}/data-removal` },
  openGraph: {
    title: "Free Data Broker Removal: Remove Your Info from 501+ Sites | GetCyberRight",
    description: "Free data broker removal service. Remove your personal information from 501+ data broker sites with step-by-step opt-out guides. No account or payment needed.",
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
