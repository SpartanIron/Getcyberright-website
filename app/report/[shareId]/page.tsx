import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import PageContent from "@/pages/scan-report";

const BASE_URL = "https://www.getcyberright.com";

type PageProps = {
  params: Promise<{ shareId: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareId } = await params;
  return {
    title: "Scam Analysis Report | GetCyberRight",
    description: "View the results of a scam analysis report. See threat assessment details and safety recommendations.",
    alternates: { canonical: `${BASE_URL}/report/${shareId}` },
    openGraph: {
      title: "Scam Analysis Report | GetCyberRight",
      description: "View the results of a scam analysis report. See threat assessment details and safety recommendations.",
      url: `${BASE_URL}/report/${shareId}`,
      type: "article",
      images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "Scam Analysis Report" }],
    },
  };
}

export default function ReportPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
