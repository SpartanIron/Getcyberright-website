import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Senior Online Safety Center | GetCyberRight",
  description:
    "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, protect your identity, and avoid romance fraud.",
  alternates: { canonical: `${BASE_URL}/seniors` },
  openGraph: {
    title: "Senior Online Safety Center | GetCyberRight",
    description:
      "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, protect your identity, and avoid romance fraud.",
    url: `${BASE_URL}/seniors`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Senior Online Safety" }],
  },
};

export default function SeniorsPage() {
  return <ClientApp />;
}
