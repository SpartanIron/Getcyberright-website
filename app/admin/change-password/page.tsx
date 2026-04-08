import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Change Password | Admin | GetCyberRight",
  description: "Change your admin account password.",
  robots: { index: false, follow: false },
};

export default function AdminChangePasswordPage() {
  return <ClientApp />;
}
