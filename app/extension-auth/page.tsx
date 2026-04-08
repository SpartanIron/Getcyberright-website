import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Extension Authentication | GetCyberRight",
  description:
    "Authenticate your GCR Scam Guard browser extension with your GetCyberRight account.",
  robots: { index: false, follow: false },
};

export default function ExtensionAuthPage() {
  return <ClientApp page="extension-auth" />;
}
