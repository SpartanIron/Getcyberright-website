import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Prompt Management | Admin | GetCyberRight",
  description: "Manage AI prompts and content generation settings.",
  robots: { index: false, follow: false },
};

export default function AdminPromptManagementPage() {
  return <ClientApp />;
}
