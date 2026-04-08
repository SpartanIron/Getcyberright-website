import type { Metadata } from "next";
import PageContent from "@/pages/seniors";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Online Safety for Seniors & Older Adults — Free Resources | GetCyberRight",
  description:
    "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, recognize romance fraud, protect your identity, and stay safe online.",
  alternates: { canonical: `${BASE_URL}/seniors` },
  openGraph: {
    title: "Online Safety for Seniors & Older Adults — Free Resources | GetCyberRight",
    description:
      "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, recognize romance fraud, protect your identity, and stay safe online.",
    url: `${BASE_URL}/seniors`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "Senior Online Safety",
      },
    ],
  },
};

export const revalidate = 3600;

export default function SeniorsPage() {
  return <PageContent />;
}
