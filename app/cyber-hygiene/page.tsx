import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cyber Hygiene: Daily Safety Habits | GCR",
  description: "Learn essential cyber hygiene practices to protect yourself daily. Simple, actionable habits for passwords, software updates, and safe browsing.",
  alternates: { canonical: `${BASE_URL}/cyber-hygiene` },
  openGraph: {
    title: "Cyber Hygiene: Daily Safety Habits | GCR",
    description: "Learn essential cyber hygiene practices to protect yourself daily. Simple, actionable habits for passwords, software updates, and safe browsing.",
    url: `${BASE_URL}/cyber-hygiene`,
    type: "website",
  },
};

export default function CyberHygienePage() {
  return (<>
        <SSRContent
          title="Cyber Hygiene Best Practices"
          description="Essential daily security practices to protect your devices, accounts, and personal information."
          sections={[{"heading":"Daily Security Habits","text":"Simple daily habits like updating software, using strong passwords, and being cautious with links prevent most attacks."}]}
        />
        <ClientApp page="cyber-hygiene" />
      </>);
}
