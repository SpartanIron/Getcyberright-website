import type { Metadata } from "next";
import PageContent from "@/pages/admin/editorial-review";

export const metadata: Metadata = {
  title: "Editorial Spine Review | Admin | GetCyberRight",
  description: "Review and approve AI-proposed editorial spines for curated articles.",
  robots: { index: false, follow: false },
};

export default function AdminEditorialReviewPage() {
  return <PageContent />;
}
