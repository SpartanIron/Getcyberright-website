import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "GCR Data Shield | GetCyberRight",
  description:
    "Scan 500+ data brokers to find where your personal information is exposed online. Get step-by-step removal guidance or automated removal.",
  alternates: { canonical: `${BASE_URL}/shield` },
  openGraph: {
    title: "GCR Data Shield | GetCyberRight",
    description: "Scan 500+ data brokers to find where your personal information is exposed online. Get step-by-step removal guidance or automated removal.",
    url: `${BASE_URL}/shield`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/data-shield.png`, width: 1080, height: 1080, alt: "GCR Data Shield" }],
  },
};

export default function ShieldPage() {
  return <ClientApp />;
}
