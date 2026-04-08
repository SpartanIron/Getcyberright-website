import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cyber Awareness Hub | GetCyberRight",
  description: "Access printable cybersecurity guides, safety checklists, and awareness resources for families, schools, and organizations.",
  alternates: { canonical: `${BASE_URL}/awareness-hub` },
  openGraph: {
    title: "Cyber Awareness Hub | GetCyberRight",
    description: "Access printable cybersecurity guides, safety checklists, and awareness resources for families, schools, and organizations.",
    url: `${BASE_URL}/awareness-hub`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Cyber Awareness Hub" }],
  },
};

export default function AwarenessHubPage() {
  return (<>
        <SSRContent
          title="Cybersecurity Awareness Hub"
          description="Cybersecurity awareness resources and educational materials for families and organizations."
        />
        <ClientApp page="awareness-hub" />
      </>);
}
