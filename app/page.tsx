import type { Metadata } from "next";
import PageContent from "@/pages/home";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title:
    "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Free cybersecurity education for families. AI-powered scam detection, data broker removal, and safety training. No account or expertise needed.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title:
      "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
    description:
      "Free cybersecurity education for families. AI-powered scam detection, data broker removal, and safety training. No account or expertise needed.",
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

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <PageContent />;
}
