import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/awareness-hub";

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

export const revalidate = 3600;

export default function AwarenessHubPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
