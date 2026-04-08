import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageSkeleton from "../../../page-skeleton";
import PageContent from "@/pages/shield-results";

type PageProps = {
  params: Promise<{ scanId: string }>;
};

export const metadata: Metadata = {
  title: "Data Shield Scan Results | GetCyberRight",
  description:
    "View your GCR Data Shield scan results and see where your personal data has been found online.",
  robots: { index: false, follow: false },
};

export default async function ShieldResultsPage({ params }: PageProps) {
  const { scanId } = await params;
  if (!scanId) notFound();
  return (
    <Suspense fallback={<PageSkeleton />}>
      <PageContent />
    </Suspense>
  );
}
