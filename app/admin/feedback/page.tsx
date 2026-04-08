import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Feedback | Admin | GetCyberRight",
  description: "Review and manage user feedback submissions.",
  robots: { index: false, follow: false },
};

export default function AdminFeedbackPage() {
  return <ClientApp />;
}
