import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/cyber-threat-radar";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Live Cyber Threat Radar | GetCyberRight",
  description: "Monitor live cybersecurity threats with our real-time Cyber Threat Radar. See active threat alerts, trending attack vectors, and security advisories.",
  alternates: { canonical: `${BASE_URL}/cyber-threat-radar` },
  openGraph: {
    title: "Live Cyber Threat Radar | GetCyberRight",
    description: "Monitor live cybersecurity threats with our real-time Cyber Threat Radar. See active threat alerts, trending attack vectors, and security advisories.",
    url: `${BASE_URL}/cyber-threat-radar`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/breaking-news.png`, width: 1080, height: 1080, alt: "Cyber Threat Radar" }],
  },
};

export const revalidate = 3600;

export default function CyberThreatRadarPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
