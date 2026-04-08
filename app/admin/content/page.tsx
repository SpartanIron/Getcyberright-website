import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Content Manager | Admin | GetCyberRight",
  description: "Manage and organize site content.",
  robots: { index: false, follow: false },
};

export default function AdminContentManagerPage() {
  return <ClientApp />;
}
