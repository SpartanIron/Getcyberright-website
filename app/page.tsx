import type { Metadata } from "next";
import ClientApp from "./[...slug]/client-app";

export const metadata: Metadata = {
  title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.",
  openGraph: {
    title: "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
    description:
      "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training.",
    url: "https://www.getcyberright.com",
    type: "website",
  },
};

export default function HomePage() {
  return <ClientApp />;
}
