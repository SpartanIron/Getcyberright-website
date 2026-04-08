import type { Metadata } from "next";
import PageContent from "@/pages/breach-dashboard";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Data Breach Monitor | GetCyberRight",
  description: "Monitor your email addresses for data breaches. Get instant alerts when your personal information appears in known data breaches.",
  alternates: { canonical: `${BASE_URL}/breach-dashboard` },
  openGraph: {
    title: "Data Breach Monitor | GetCyberRight",
    description: "Monitor your email addresses for data breaches. Get instant alerts when your personal information appears in known data breaches.",
    url: `${BASE_URL}/breach-dashboard`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/data-shield.png`, width: 1080, height: 1080, alt: "Data Breach Monitor" }],
  },
};

export default function BreachDashboardPage() {
  return <PageContent />;
}
