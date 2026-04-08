import type { Metadata } from "next";
import PageContent from "@/pages/search";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Search GetCyberRight: Find Cybersecurity Resources",
  description: "Search across all GetCyberRight resources including guides, tools, training courses, scam alerts, and safety checklists.",
  alternates: { canonical: `${BASE_URL}/search` },
  openGraph: {
    title: "Search GetCyberRight: Find Cybersecurity Resources",
    description: "Search across all GetCyberRight resources including guides, tools, training courses, scam alerts, and safety checklists.",
    url: `${BASE_URL}/search`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function SearchPage() {
  return <PageContent />;
}
