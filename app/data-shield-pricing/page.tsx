import type { Metadata } from "next";
import PageContent from "@/pages/data-shield-pricing";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Data Shield Pricing | GetCyberRight",
  description:
    "Choose the right GCR Data Shield plan to protect your personal data. Remove your information from data broker sites.",
  alternates: { canonical: `${BASE_URL}/data-shield-pricing` },
  openGraph: {
    title: "GCR Data Shield Pricing | GetCyberRight",
    description:
      "Choose the right GCR Data Shield plan to protect your personal data. Remove your information from data broker sites.",
    url: `${BASE_URL}/data-shield-pricing`,
    type: "website",
  },
};

export default function DataShieldPricingPage() {
  return <PageContent />;
}
