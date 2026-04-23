import type { Metadata } from "next";
import RecommendedToolsPage from "@/pages/recommended-tools";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
    title: "Recommended Security Tools | GetCyberRight",
    description:
          "CISM-certified cybersecurity expert-recommended tools for families, seniors, and small businesses. Independently reviewed VPNs, identity protection, password managers, and data removal services.",
    alternates: { canonical: `${BASE_URL}/recommended-tools` },
    openGraph: {
          title: "Recommended Security Tools | GetCyberRight",
          description:
                  "Expert-recommended cybersecurity tools for families, seniors, and small businesses. Reviewed by a CISM-certified professional with 15+ years of experience.",
          url: `${BASE_URL}/recommended-tools`,
          type: "website",
          images: [{ url: `${BASE_URL}/og/security.png`, width: 1200, height: 630, alt: "Recommended Security Tools" }],
    },
};

export const revalidate = 3600;

export default function Page() {
    return <RecommendedToolsPage />;
}
