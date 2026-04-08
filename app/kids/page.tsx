import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Kids Online Safety Lessons (Ages 8-16) | GCR",
  description:
    "Interactive cybersecurity lessons designed for kids and teens ages 8 to 16. Learn about password safety, spotting scams, and being a good digital citizen.",
  alternates: { canonical: `${BASE_URL}/kids` },
  openGraph: {
    title: "Kids Online Safety Lessons (Ages 8-16) | GCR",
    description:
      "Interactive cybersecurity lessons designed for kids and teens ages 8 to 16. Learn about password safety, spotting scams, and being a good digital citizen.",
    url: `${BASE_URL}/kids`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Kids Online Safety" }],
  },
};

export default function KidsPage() {
  return <ClientApp />;
}
