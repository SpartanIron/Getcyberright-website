import type { Metadata } from "next";
import PageContent from "@/pages/admin/engagement-opportunities";

export const metadata: Metadata = {
  title: "Engagement Opportunities | Admin | GetCyberRight",
  description: "Manage user engagement opportunities and campaigns.",
  robots: { index: false, follow: false },
};

export default function AdminEngagementPage() {
  return <PageContent />;
}
