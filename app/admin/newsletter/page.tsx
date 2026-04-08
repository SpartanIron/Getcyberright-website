import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Newsletter | Admin | GetCyberRight",
  description: "Manage newsletter content and distribution.",
  robots: { index: false, follow: false },
};

export default function AdminNewsletterPage() {
  return <ClientApp />;
}
