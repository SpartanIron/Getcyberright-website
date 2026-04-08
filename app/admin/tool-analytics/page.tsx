import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Tool Analytics | Admin | GetCyberRight",
  description: "View tool usage analytics and performance metrics.",
  robots: { index: false, follow: false },
};

export default function AdminToolAnalyticsPage() {
  return <ClientApp />;
}
