import type { Metadata } from "next";
import PageContent from "@/pages/resources";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Resources | GetCyberRight",
  description:
    "Explore our complete library of cybersecurity resources including safety guides, interactive tools, training courses, and scam alerts.",
  alternates: { canonical: `${BASE_URL}/resources` },
  openGraph: {
    title: "Cybersecurity Resources | GetCyberRight",
    description: "Explore our complete library of cybersecurity resources including safety guides, interactive tools, training courses, and scam alerts.",
    url: `${BASE_URL}/resources`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Cybersecurity Resources" }],
  },
};

export const revalidate = 3600;

export default function ResourcesPage() {
  return <PageContent />;
}
