import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
  description:
    "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
    description:
      "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
    url: `${BASE_URL}/about`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/trust-metrics.png`, width: 1080, height: 1080, alt: "About GetCyberRight" }],
  },
};

export default function AboutPage() {
  return <ClientApp />;
}
