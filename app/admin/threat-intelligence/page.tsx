import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Threat Intelligence | Admin | GetCyberRight",
  description: "Monitor and manage threat intelligence feeds.",
  robots: { index: false, follow: false },
};

export default function AdminThreatIntelligencePage() {
  return <ClientApp />;
}
