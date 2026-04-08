import type { Metadata } from "next";
import PageContent from "@/pages/security";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Security at GetCyberRight: How We Protect Your Data",
  description: "Learn about the security measures and practices GetCyberRight uses to protect your data and privacy.",
  alternates: { canonical: `${BASE_URL}/security` },
  openGraph: {
    title: "Security at GetCyberRight: How We Protect Your Data",
    description: "Learn about the security measures and practices GetCyberRight uses to protect your data and privacy.",
    url: `${BASE_URL}/security`,
    type: "website",
  },
};

export default function SecurityPage() {
  return <PageContent />;
}
