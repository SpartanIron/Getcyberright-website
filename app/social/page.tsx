import type { Metadata } from "next";
import { SocialDiscoveryPage } from "@/pages/social-discovery";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Shareable Safety Cards | GetCyberRight Social",
  description:
    "Plain-language cyber safety cards your family and friends can actually use. Pick a tip, share it, save someone from a scam.",
  alternates: { canonical: `${BASE_URL}/social` },
  openGraph: {
    title: "Shareable Safety Cards | GetCyberRight",
    description:
      "Plain-language cyber safety cards your family and friends can actually use.",
    url: `${BASE_URL}/social`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function SocialPage() {
  return <SocialDiscoveryPage />;
}
