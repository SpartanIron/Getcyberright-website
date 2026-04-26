import type { Metadata } from "next";
import PageContent from "@pages/gcr-guard-pricing";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GCR Scam Guard Pricing | GetCyberRight",
  description: "Check anything suspicious for free. Stay ahead of scams with continuous protection from $4.99/month.",
  robots: { index: true, follow: true },
};

export default function GcrGuardPricingPage() {
  return <PageContent />;
}
