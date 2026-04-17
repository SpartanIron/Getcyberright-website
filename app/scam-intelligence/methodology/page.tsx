import type { Metadata } from "next";
import MethodologyClient from "./MethodologyClient";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Scam Intelligence Dashboard Methodology | GetCyberRight",
  description:
    "How GetCyberRight gathers, scores, and refreshes the global scam intelligence data: primary sources, scoring formulas, refresh cadence, and limitations.",
  alternates: { canonical: `${BASE_URL}/scam-intelligence/methodology` },
  openGraph: {
    title: "Scam Intelligence Methodology | GetCyberRight",
    description:
      "Primary sources, scoring formulas, refresh cadence, and limitations for the GetCyberRight scam intelligence dashboard.",
    url: `${BASE_URL}/scam-intelligence/methodology`,
    type: "article",
  },
};

export default function MethodologyPage() {
  return <MethodologyClient />;
}
