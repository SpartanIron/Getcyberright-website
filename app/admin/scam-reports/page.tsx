import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Scam Reports | Admin | GetCyberRight",
  description: "Review and manage submitted scam reports.",
  robots: { index: false, follow: false },
};

export default function AdminScamReportsPage() {
  return <ClientApp />;
}
