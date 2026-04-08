import type { Metadata } from "next";
import PageContent from "@/pages/resources/cheat-sheets";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Cheat Sheets | GetCyberRight",
  description:
    "Quick-reference cybersecurity cheat sheets for password security, phishing prevention, social media safety, and more.",
  alternates: { canonical: `${BASE_URL}/resources/cheat-sheets` },
  openGraph: {
    title: "Cybersecurity Cheat Sheets | GetCyberRight",
    description:
      "Quick-reference cybersecurity cheat sheets for password security, phishing prevention, social media safety, and more.",
    url: `${BASE_URL}/resources/cheat-sheets`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function CheatSheetsPage() {
  return <PageContent />;
}
