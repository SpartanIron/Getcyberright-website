import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity News & Updates | GetCyberRight",
  description:
    "Stay informed with the latest cybersecurity news, data breach reports, emerging threats, and security advisories. Curated updates for families and businesses.",
  alternates: { canonical: `${BASE_URL}/news` },
  openGraph: {
    title: "Cybersecurity News & Updates | GetCyberRight",
    description:
      "Stay informed with the latest cybersecurity news, data breach reports, emerging threats, and security advisories. Curated updates for families and businesses.",
    url: `${BASE_URL}/news`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/news-alerts.png`, width: 1080, height: 1080, alt: "GetCyberRight News" }],
  },
};

export default function NewsPage() {
  return <ClientApp />;
}
