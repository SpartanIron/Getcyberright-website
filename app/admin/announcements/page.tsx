import type { Metadata } from "next";
import PageContent from "@/pages/admin/announcements";

export const metadata: Metadata = {
  title: "Announcements | Admin | GetCyberRight",
  description: "Manage site-wide announcements and notifications.",
  robots: { index: false, follow: false },
};

export default function AdminAnnouncementsPage() {
  return <PageContent />;
}
