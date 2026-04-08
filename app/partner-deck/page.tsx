import type { Metadata } from "next";
import PageContent from "@/pages/partner-deck";

export const metadata: Metadata = {
  title: "Partner Deck | GetCyberRight",
  description:
    "GetCyberRight partnership opportunities and media kit for potential sponsors and collaborators.",
  robots: { index: false, follow: false },
};

export default function PartnerDeckPage() {
  return <PageContent />;
}
