import type { Metadata } from "next";
import PageContent from "@/pages/educators";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Educator Cybersecurity Resources | GetCyberRight",
  description:
    "Cybersecurity teaching resources for educators. Access lesson plans, classroom activities, printable guides, and curriculum materials.",
  alternates: { canonical: `${BASE_URL}/educators` },
  openGraph: {
    title: "Educator Cybersecurity Resources | GetCyberRight",
    description:
      "Cybersecurity teaching resources for educators. Access lesson plans, classroom activities, printable guides, and curriculum materials.",
    url: `${BASE_URL}/educators`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Educator Resources" }],
  },
};

export default function EducatorsPage() {
  return <PageContent />;
}
