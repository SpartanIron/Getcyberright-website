import type { Metadata } from "next";
import PageContent from "@/pages/privacy";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Privacy Policy | GetCyberRight",
  description:
    "Read the GetCyberRight privacy policy. Learn how we collect, use, and protect your personal information.",
  alternates: { canonical: `${BASE_URL}/privacy` },
  openGraph: {
    title: "Privacy Policy | GetCyberRight",
    description: "Read the GetCyberRight privacy policy. Learn how we collect, use, and protect your personal information.",
    url: `${BASE_URL}/privacy`,
    type: "website",
  },
};

export default function PrivacyPage() {
  return <PageContent />;
}
