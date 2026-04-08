import type { Metadata } from "next";
import PageContent from "@/pages/admin/scam-reports";

export const metadata: Metadata = {
  title: "Scam Reports | Admin | GetCyberRight",
  description: "Review and manage submitted scam reports.",
  robots: { index: false, follow: false },
};

export default function AdminScamReportsPage() {
  return <PageContent />;
}
