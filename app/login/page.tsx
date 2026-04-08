import type { Metadata } from "next";
import PageContent from "@/pages/login";

export const metadata: Metadata = {
  title: "Log In | GetCyberRight",
  description:
    "Sign in to your GetCyberRight account to access your dashboard, training progress, and security tools.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <PageContent />;
}
