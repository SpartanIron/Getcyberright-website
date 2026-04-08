import type { Metadata } from "next";
import PageContent from "@/pages/travel-safety";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Travel Cybersecurity Tips | GetCyberRight",
  description: "Protect your digital life while traveling. Tips for secure Wi-Fi use, device protection, avoiding travel scams, and keeping data safe.",
  alternates: { canonical: `${BASE_URL}/travel-safety` },
  openGraph: {
    title: "Travel Cybersecurity Tips | GetCyberRight",
    description: "Protect your digital life while traveling. Tips for secure Wi-Fi use, device protection, avoiding travel scams, and keeping data safe.",
    url: `${BASE_URL}/travel-safety`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function TravelSafetyPage() {
  return <PageContent />;
}
