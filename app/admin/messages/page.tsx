import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Messages | Admin | GetCyberRight",
  description: "View and manage contact messages.",
  robots: { index: false, follow: false },
};

export default function AdminMessagesPage() {
  return <ClientApp />;
}
