import type { Metadata } from "next";
import PressClient from "./PressClient";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Press Kit - Scam Intelligence Dashboard | GetCyberRight",
  description:
    "Logos, embed snippets, raw data exports, attribution boilerplate, and press contact for the GetCyberRight scam intelligence dashboard.",
  alternates: { canonical: `${BASE_URL}/scam-intelligence/press` },
  openGraph: {
    title: "Press Kit - Scam Intelligence | GetCyberRight",
    description:
      "Embed snippets, attribution, and raw data downloads for journalists and researchers covering global scam activity.",
    url: `${BASE_URL}/scam-intelligence/press`,
    type: "website",
  },
};

export default function PressPage() {
  return <PressClient />;
}
