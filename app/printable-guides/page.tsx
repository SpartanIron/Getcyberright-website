import type { Metadata } from "next";
import PageContent from "@/pages/printable-guides";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Printable Guides | GetCyberRight",
  description:
    "Free printable cybersecurity guides and worksheets for families, classrooms, and community groups.",
  alternates: { canonical: `${BASE_URL}/printable-guides` },
  openGraph: {
    title: "Printable Guides | GetCyberRight",
    description:
      "Free printable cybersecurity guides and worksheets for families, classrooms, and community groups.",
    url: `${BASE_URL}/printable-guides`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function PrintableGuidesPage() {
  return <PageContent />;
}
