import type { Metadata } from "next";
import SSRContent from "../ssr-content";
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
    images: [
      {
        url: `${BASE_URL}/og/howto-hacked.png`,
        width: 1080,
        height: 1080,
        alt: "Emergency Cyber Help",
      },
    ],
  },
};

export default function EmergencyHelpPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "What to Do If You've Been Scammed Online",
      description:
        "Immediate steps to take if you have been scammed online, including emergency contacts, account recovery, and financial protection.",
      step: [
        {
          "@type": "HowToStep",
          name: "Secure Your Accounts",
          text: "Change passwords immediately on all compromised accounts. Enable two-factor authentication.",
        },
        {
          "@type": "HowToStep",
          name: "Contact Your Bank",
          text: "Call your bank or credit card company to report unauthorized transactions and freeze affected accounts.",
        },
        {
          "@type": "HowToStep",
          name: "Report the Scam",
          text: "Report to the FTC at reportfraud.ftc.gov, FBI at ic3.gov, or your local authorities.",
        },
        {
          "@type": "HowToStep",
          name: "Monitor Your Credit",
          text: "Place a fraud alert or credit freeze with the major credit bureaus to prevent identity theft.",
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Emergency Help",
          item: `${BASE_URL}/emergency-help`,
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SSRContent
          title="Cybersecurity Emergency Help"
          description="Immediate step-by-step guidance if you've been hacked, scammed, or had your identity stolen."
          sections={[{"heading":"Act Fast","text":"Follow our step-by-step emergency guide to minimize damage and begin recovery."},{"heading":"Report the Incident","text":"Report scams to the FTC at reportfraud.ftc.gov or the FBI at ic3.gov."}]}
        />
        <ClientApp page="emergency-help" />
    </>
  );
}
