import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/partner-deck";

export const metadata: Metadata = {
  title: "Partner Deck | GetCyberRight",
  description:
    "GetCyberRight partnership opportunities and media kit for potential sponsors and collaborators.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function PartnerDeckPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
