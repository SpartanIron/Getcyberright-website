import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Scan Management | Admin | GetCyberRight",
  description: "Manage and monitor scan operations.",
  robots: { index: false, follow: false },
};

export default function AdminScanManagementPage() {
  return <ClientApp page="admin-scan-management" />;
}
