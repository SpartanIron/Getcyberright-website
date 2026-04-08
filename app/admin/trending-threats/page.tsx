import type { Metadata } from "next";
import PageSkeleton from "../../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/admin/trending-threats";

export const metadata: Metadata = {
  title: "Trending Threats | Admin | GetCyberRight",
  description: "Monitor and manage trending cybersecurity threats.",
  robots: { index: false, follow: false },
};

export default function AdminTrendingThreatsPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
