import type { Metadata } from "next";
import PageContent from "@/pages/data-shield-pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GCR Data Shield Pricing | GetCyberRight",
  description: "Check your data exposure for free. Stay protected with continuous monitoring from $8.99/month.",
  robots: { index: true, follow: true },
};

export default function DataShieldPricingPage() {
  return <PageContent />;
}
