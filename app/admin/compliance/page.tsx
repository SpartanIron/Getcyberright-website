import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Compliance | Admin | GetCyberRight",
  description: "Monitor compliance status and manage regulatory requirements.",
  robots: { index: false, follow: false },
};

export default function AdminCompliancePage() {
  return <ClientApp />;
}
