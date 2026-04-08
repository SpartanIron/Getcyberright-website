import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity FAQ | GetCyberRight",
  description:
    "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
  alternates: { canonical: `${BASE_URL}/faq` },
  openGraph: {
    title: "Cybersecurity FAQ | GetCyberRight",
    description:
      "Find answers to common cybersecurity questions. Learn about password security, phishing prevention, identity theft protection, and online safety.",
    url: `${BASE_URL}/faq`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "GetCyberRight FAQ",
      },
    ],
  },
};

const faqItems = [
  {
    q: "What is GetCyberRight?",
    a: "GetCyberRight is a mission-driven platform dedicated to family cyber safety. We provide educational resources, tools, and guidance to help families navigate the online world safely. Our content is designed for everyone, from children learning about social media to seniors protecting themselves from scams.",
  },
  {
    q: "Is GetCyberRight free?",
    a: "Our educational content, articles, guides, and core scam checking tools are free to use. We also offer paid subscription plans (Essential and Professional) that unlock advanced features like automatic page scanning, scan history, family profiles, and ongoing data monitoring.",
  },
  {
    q: "What is GCR Scam Guard?",
    a: "GCR Scam Guard is our Chrome browser extension that protects you from scams in real time as you browse. It can automatically scan pages for threats, detect fake websites, and warn you before you interact with suspicious content.",
  },
  {
    q: "What subscription plans do you offer?",
    a: "We offer three tiers: Free (manual scans on the website and extension), Essential (adds Auto-Protect for automatic page scanning), and Professional (adds scan history, safety scores, family profiles, and priority support).",
  },
  {
    q: "What is the GCR Scam Guard tool?",
    a: "The GCR Scam Guard is a tool that helps you analyze suspicious URLs, phone numbers, emails, and situations. It uses both pattern-matching analysis and AI to identify potential scams and provide clear safety recommendations in plain language.",
  },
  {
    q: "How can I protect my children online?",
    a: "Start with open conversations about online safety. Use our Youth Safety Hub for age-appropriate resources, set up parental controls on devices, monitor online activity appropriately for their age, and teach them to recognize suspicious messages and requests.",
  },
  {
    q: "How can I help my elderly parents stay safe online?",
    a: "Our Senior Safety Center provides resources specifically designed for older adults. Focus on teaching them to recognize common scams, never share personal information with strangers, verify requests through official channels, and ask for help when something seems suspicious.",
  },
  {
    q: "What should I do if a family member falls for a scam?",
    a: "Act quickly. Contact your bank if financial information was shared. Change passwords for any compromised accounts. Report the scam to local authorities and relevant agencies like the FTC or Action Fraud. Visit our Emergency Help page for step-by-step guidance.",
  },
  {
    q: "Where can I report a scam?",
    a: "In the US, report to the FTC at reportfraud.ftc.gov or the FBI at ic3.gov. In the UK, use Action Fraud. Other countries have their own reporting agencies. Our Emergency Help page provides region-specific reporting information.",
  },
  {
    q: "How do you protect my data?",
    a: "We use industry-standard security measures including HTTPS encryption, secure authentication, and minimal data collection. We never sell your data or share it with advertisers. See our Privacy Policy for complete details.",
  },
];

export default function FAQPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "FAQ",
          item: `${BASE_URL}/faq`,
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
          title="Cybersecurity FAQ"
          description="Find answers to common cybersecurity questions about password security, phishing prevention, identity theft protection, and online safety for families."
          sections={[{"heading":"What is GetCyberRight?","text":"GetCyberRight is a mission-driven platform dedicated to family cyber safety providing educational resources, tools, and guidance."},{"heading":"Is GetCyberRight free?","text":"Our educational content, articles, guides, and core scam checking tools are free. We also offer paid plans for advanced features."},{"heading":"How can I protect my children online?","text":"Start with open conversations about online safety. Use our Youth Safety Hub, set up parental controls, and teach them to recognize suspicious messages."},{"heading":"What should I do if someone falls for a scam?","text":"Contact your bank if financial info was shared. Change passwords. Report to the FTC and local authorities. Visit our Emergency Help page."}]}
        />
        <ClientApp page="faq" />
    </>
  );
}
