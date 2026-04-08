import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity FAQ | GetCyberRight",
  description:
    "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "Cybersecurity FAQ | GetCyberRight",
    description:
      "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
    url: `${BASE_URL}/faq`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/trust-metrics.png`, width: 1080, height: 1080, alt: "GetCyberRight FAQ" }],
  },
};

export default function FAQPage() {
  return <ClientApp />;
}
