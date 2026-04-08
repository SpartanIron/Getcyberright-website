import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Contact GetCyberRight: Get in Touch | GetCyberRight",
  description:
    "Contact the GetCyberRight team for questions about cybersecurity education, partnership opportunities, or to report a scam.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact GetCyberRight: Get in Touch | GetCyberRight",
    description: "Contact the GetCyberRight team for questions about cybersecurity education, partnership opportunities, or to report a scam.",
    url: `${BASE_URL}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return <ClientApp />;
}
