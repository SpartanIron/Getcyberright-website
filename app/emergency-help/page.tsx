import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Emergency Cyber Help | GetCyberRight",
  description:
    "Immediate steps to take if you have been scammed online. Emergency contacts, account recovery guidance, and financial protection steps.",
  alternates: { canonical: `${BASE_URL}/emergency-help` },
  openGraph: {
    title: "Emergency Cyber Help | GetCyberRight",
    description:
      "Immediate steps to take if you have been scammed online. Emergency contacts, account recovery guidance, and financial protection steps.",
    url: `${BASE_URL}/emergency-help`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/howto-hacked.png`, width: 1080, height: 1080, alt: "Emergency Cyber Help" }],
  },
};

export default function EmergencyHelpPage() {
  return <ClientApp />;
}
