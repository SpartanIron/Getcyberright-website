import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/gcr-guard-pricing";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Guard Plans & Pricing | GetCyberRight",
  description: "Choose the right GCR Guard plan for your protection needs. Free, Essential, and Professional tiers available.",
  alternates: { canonical: `${BASE_URL}/gcr-guard-pricing` },
  openGraph: {
    title: "GCR Guard Plans & Pricing | GetCyberRight",
    description: "Choose the right GCR Guard plan for your protection needs. Free, Essential, and Professional tiers available.",
    url: `${BASE_URL}/gcr-guard-pricing`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "GCR Guard Pricing" }],
  },
};

export const revalidate = 3600;

export default function GCRGuardPricingPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
