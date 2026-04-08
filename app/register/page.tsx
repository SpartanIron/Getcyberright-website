import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Create Account | GetCyberRight",
  description:
    "Create a free GetCyberRight account to access cybersecurity training, tools, and personalized safety resources.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <ClientApp page="register" />;
}
