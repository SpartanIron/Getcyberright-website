import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Log In | GetCyberRight",
  description:
    "Sign in to your GetCyberRight account to access your dashboard, training progress, and security tools.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <ClientApp page="login" />;
}
