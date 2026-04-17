import type { Metadata } from "next";
import EmbedContent from "@/pages/scam-intelligence-embed";

export const metadata: Metadata = {
  title: "Live Scam Intelligence Embed | GetCyberRight",
  description: "Embeddable live scam intelligence widget showing global fraud activity in real time.",
  robots: { index: false, follow: false },
};

export default function ScamIntelligenceEmbedPage({
  searchParams,
}: {
  searchParams?: { country?: string };
}) {
  const country = searchParams?.country?.toUpperCase();
  return <EmbedContent countryCode={country} />;
}
