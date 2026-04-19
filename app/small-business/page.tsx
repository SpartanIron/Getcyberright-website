import type { Metadata } from "next";
import PageContent from "@/pages/small-business";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Small Business Cybersecurity | GetCyberRight",
  description:
    "Cybersecurity resources for small businesses. Employee awareness training, security policy templates, and incident response guides.",
  alternates: { canonical: `${BASE_URL}/small-business` },
  keywords:
    "small business cybersecurity, business email compromise prevention, employee phishing training, cyber insurance small business, security policy templates, incident response plan small business, ransomware small business, multi-factor authentication for business, vendor wire fraud prevention, cybersecurity for SMB",
  openGraph: {
    title: "Small Business Cybersecurity | GetCyberRight",
    description:
      "Cybersecurity resources for small businesses. Employee awareness training, security policy templates, and incident response guides.",
    url: `${BASE_URL}/small-business`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/training.png`, width: 1080, height: 1080, alt: "Small Business Cybersecurity" }],
  },
};

export const revalidate = 3600;

export default function SmallBusinessPage() {
  return <PageContent />;
}
