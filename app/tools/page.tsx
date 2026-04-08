import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Tools & Scam Guard | GetCyberRight",
  description:
    "Access cybersecurity tools including an AI-powered GCR Scam Guard, secure Password Generator, Data Broker Removal, and Breach Monitor. Core tools are free.",
  alternates: { canonical: `${BASE_URL}/tools` },
  openGraph: {
    title: "Cybersecurity Tools & Scam Guard | GetCyberRight",
    description:
      "Access cybersecurity tools including an AI-powered GCR Scam Guard, secure Password Generator, Data Broker Removal, and Breach Monitor. Core tools are free.",
    url: `${BASE_URL}/tools`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "GetCyberRight Tools" }],
  },
};

export default function ToolsPage() {
  return <ClientApp />;
}
