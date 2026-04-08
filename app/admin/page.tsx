import type { Metadata } from "next";
import PageContent from "@/pages/admin/index";

export const metadata: Metadata = {
  title: "Admin Dashboard | GetCyberRight",
  description: "GetCyberRight administration dashboard.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <PageContent />;
}
