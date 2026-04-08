import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/preferences";

export const metadata: Metadata = {
  title: "Preferences | GetCyberRight",
  description:
    "Customize your GetCyberRight notification preferences and account settings.",
  robots: { index: false, follow: false },
};

export default function PreferencesPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
