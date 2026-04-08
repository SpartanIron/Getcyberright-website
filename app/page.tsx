import type { Metadata } from "next";
import SSRContent from "./ssr-content";
import ClientApp from "./client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title:
    "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
  description:
    "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training. Trusted by thousands of families worldwide.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title:
      "GetCyberRight: Free Cybersecurity Education for Families, Parents, Kids & Seniors",
    description:
      "Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training.",
    url: BASE_URL,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight - Free Cybersecurity Education for Families",
      },
    ],
  },
};

export default function HomePage() {
  return (<>
        <SSRContent
          title="GetCyberRight: Free Cybersecurity Education for Families"
          description="Protect your family online with free cybersecurity education, AI-powered scam detection tools, data broker removal, and safety training."
          sections={[{"heading":"Cybersecurity Made Simple for Everyone","text":"GetCyberRight breaks down complex cybersecurity topics into easy-to-understand guidance for families, parents, kids, and seniors."},{"heading":"AI-Powered Scam Detection","text":"Use our free scam checker to analyze suspicious URLs, emails, phone numbers, and text messages. Our AI identifies threats in seconds."},{"heading":"Data Broker Removal","text":"GCR Data Shield scans 500+ data brokers to find where your personal information is exposed."},{"heading":"Family Safety Training","text":"Interactive learning paths designed for every family member with age-appropriate courses for kids, parents, and seniors."}]}
          links={[{"label":"Scam Checker","href":"/scam-checker"},{"label":"Training Academy","href":"/training"},{"label":"Data Shield","href":"/shield"},{"label":"Kids Hub","href":"/kids"},{"label":"Senior Safety","href":"/seniors"},{"label":"FAQ","href":"/faq"}]}
        />
        <ClientApp page="home" />
      </>);
}
