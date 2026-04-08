import type { Metadata } from "next";
import PageContent from "@/pages/admin/scan-management";

export const metadata: Metadata = {
  title: "Scan Management | Admin | GetCyberRight",
  description: "Manage and monitor scan operations.",
  robots: { index: false, follow: false },
};

export default function AdminScanManagementPage() {
  return <PageContent />;
}
