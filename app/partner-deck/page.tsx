import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Partner Deck | GetCyberRight",
  description:
    "GetCyberRight partnership opportunities and media kit for potential sponsors and collaborators.",
  robots: { index: false, follow: false },
};

export default function PartnerDeckPage() {
  return <ClientApp />;
}
