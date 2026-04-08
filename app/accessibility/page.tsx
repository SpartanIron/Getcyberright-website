import type { Metadata } from "next";
import PageContent from "@/pages/accessibility";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Accessibility Statement | GetCyberRight",
  description: "GetCyberRight is committed to digital accessibility for all users, including those with disabilities.",
  alternates: { canonical: `${BASE_URL}/accessibility` },
  openGraph: {
    title: "Accessibility Statement | GetCyberRight",
    description: "GetCyberRight is committed to digital accessibility for all users, including those with disabilities.",
    url: `${BASE_URL}/accessibility`,
    type: "website",
  },
};

export default function AccessibilityPage() {
  return <PageContent />;
}
