import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Content Governance | Admin | GetCyberRight",
  description: "Manage content governance policies and workflows.",
  robots: { index: false, follow: false },
};

export default function AdminContentGovernancePage() {
  return <ClientApp page="admin-content-governance" />;
}
