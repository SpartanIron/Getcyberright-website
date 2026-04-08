import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Reset Password | GetCyberRight",
  description: "Reset your GetCyberRight account password securely.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ClientApp />;
}
