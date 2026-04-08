import type { Metadata } from "next";
import PageContent from "@/pages/quick-assessment";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Quick Security Assessment | GetCyberRight",
  description: "Take our free 5-minute cybersecurity assessment to evaluate your online safety habits. Get personalized recommendations.",
  alternates: { canonical: `${BASE_URL}/quick-assessment` },
  openGraph: {
    title: "Quick Security Assessment | GetCyberRight",
    description: "Take our free 5-minute cybersecurity assessment to evaluate your online safety habits. Get personalized recommendations.",
    url: `${BASE_URL}/quick-assessment`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/trust-metrics.png`, width: 1080, height: 1080, alt: "Quick Security Assessment" }],
  },
};

export default function QuickAssessmentPage() {
  return <PageContent />;
}
