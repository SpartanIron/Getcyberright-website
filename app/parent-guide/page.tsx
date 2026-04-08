import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Parent's Guide to Online Safety | GCR",
  description: "A complete guide for parents to keep children safe online. Covers parental controls, age-appropriate conversations, and device setup.",
  alternates: { canonical: `${BASE_URL}/parent-guide` },
  openGraph: {
    title: "Parent's Guide to Online Safety | GCR",
    description: "A complete guide for parents to keep children safe online. Covers parental controls, age-appropriate conversations, and device setup.",
    url: `${BASE_URL}/parent-guide`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Parent's Guide" }],
  },
};

export default function ParentGuidePage() {
  return <ClientApp page="parent-guide" />;
}
