import type { Metadata } from "next";
import PageContent from "@/pages/home";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title:
    "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title:
      "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
    description:
      "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training.",
    url: BASE_URL,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight - Free Cybersecurity Education for Families",
      },
    ],
  },
};

export const revalidate = 3600;

export default function HomePage() {
  return <PageContent />;
}
