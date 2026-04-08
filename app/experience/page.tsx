import type { Metadata } from "next";
import { Suspense } from "react";
import PageSkeleton from "../page-skeleton";
import PageContent from "@/pages/experience";

export const metadata: Metadata = {
  title: "Experience | GetCyberRight",
  description:
    "Your GetCyberRight experience and learning journey overview.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default function ExperiencePage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
