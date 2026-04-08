import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Account Settings | GetCyberRight",
  description:
    "Manage your GetCyberRight account settings, security preferences, and subscription details.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <ClientApp page="account" />;
}
