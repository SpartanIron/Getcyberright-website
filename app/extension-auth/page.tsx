import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/extension-auth";

export const metadata: Metadata = {
  title: "Extension Authentication | GetCyberRight",
  description:
    "Authenticate your GCR Scam Guard browser extension with your GetCyberRight account.",
  robots: { index: false, follow: false },
};

export default function ExtensionAuthPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
