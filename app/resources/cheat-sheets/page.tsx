import type { Metadata } from "next";
import ClientApp from "../../client-app";

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

export default function CheatSheetsPage() {
  return <ClientApp page="resources-cheat-sheets" />;
}
