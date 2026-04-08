import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Guides for Families | GetCyberRight",
  description:
    "Browse expert cybersecurity guides covering phishing, identity theft, password security, data privacy, and online safety for families, seniors, and kids.",
  alternates: { canonical: `${BASE_URL}/guides` },
  openGraph: {
    title: "Cybersecurity Guides for Families | GetCyberRight",
    description:
      "Browse expert cybersecurity guides covering phishing, identity theft, password security, data privacy, and online safety for families, seniors, and kids.",
    url: `${BASE_URL}/guides`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "GetCyberRight Guides" }],
  },
};

export default function GuidesPage() {
  return <ClientApp />;
}
