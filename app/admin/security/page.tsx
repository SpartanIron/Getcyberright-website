import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Security Settings | Admin | GetCyberRight",
  description: "Manage security settings and configurations.",
  robots: { index: false, follow: false },
};

export default function AdminSecurityPage() {
  return <ClientApp />;
}
