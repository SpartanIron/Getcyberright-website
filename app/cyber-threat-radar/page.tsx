import type { Metadata } from "next";
import ClientApp from "../client-app";

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

export default function CyberThreatRadarPage() {
  return <ClientApp page="cyber-threat-radar" />;
}
