import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Support | GetCyberRight",
  description:
    "Get help with your GetCyberRight account, tools, and cybersecurity questions. Contact our support team.",
  alternates: { canonical: `${BASE_URL}/support` },
  openGraph: {
    title: "Support | GetCyberRight",
    description:
      "Get help with your GetCyberRight account, tools, and cybersecurity questions. Contact our support team.",
    url: `${BASE_URL}/support`,
    type: "website",
  },
};

export default function SupportPage() {
  return <ClientApp page="support" />;
}
