import type { Metadata } from "next";
import PageContent from "@/pages/seniors";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Online Safety for Seniors & Older Adults: Free Resources | GetCyberRight",
  description:
    "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, recognize romance fraud, protect your identity, and stay safe online.",
  alternates: { canonical: `${BASE_URL}/seniors` },
  keywords:
    "online safety for seniors, senior scam prevention, romance scams older adults, grandparent scam, Medicare scams, tech support scam seniors, IRS impersonation scam, AARP fraud watch, fraud help for older adults, senior identity theft protection",
  openGraph: {
    title: "Online Safety for Seniors & Older Adults: Free Resources | GetCyberRight",
    description:
      "Free cybersecurity resources designed for seniors and older adults. Learn to spot phone scams, recognize romance fraud, protect your identity, and stay safe online.",
    url: `${BASE_URL}/seniors`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/seniors.png`,
        width: 1200,
        height: 630,
        alt: "Online safety resources for seniors and older adults",
      },
    ],
  },
};

export const revalidate = 3600;

export default function SeniorsPage() {
  return <PageContent />;
}
