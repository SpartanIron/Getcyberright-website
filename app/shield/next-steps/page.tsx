import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../../page-skeleton";
import PageContent from "@/pages/shield-next-steps";

export const metadata: Metadata = {
  title: "Data Shield Next Steps | GetCyberRight",
  description:
    "Your personalized next steps to protect your data online based on your GCR Data Shield scan results.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default function ShieldNextStepsPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
