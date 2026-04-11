import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/password-generator";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Free Secure Password Generator — Create Strong Passwords | GetCyberRight",
  description: "Generate strong, unique passwords instantly. Customize length, character types, and complexity. Free to use — no account required. Runs entirely in your browser.",
  alternates: { canonical: `${BASE_URL}/password-generator` },
  openGraph: {
    title: "Free Secure Password Generator — Create Strong Passwords | GetCyberRight",
    description: "Generate strong, unique passwords instantly. Customize length, character types, and complexity. Free to use — no account required.",
    url: `${BASE_URL}/password-generator`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "Password Generator" }],
  },
};

export const revalidate = 3600;

export default function PasswordGeneratorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "GetCyberRight Secure Password Generator",
      description: "Free tool to generate strong, unique passwords with customizable length, character types, and complexity settings. Runs entirely in your browser for maximum security.",
      url: `${BASE_URL}/password-generator`,
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long should a secure password be?",
          acceptedAnswer: { "@type": "Answer", text: "Security experts recommend passwords of at least 12-16 characters. Longer passwords are exponentially harder to crack — a 16-character password with mixed characters would take millions of years to brute-force with current technology. Our generator defaults to 16 characters but you can customize the length." },
        },
        {
          "@type": "Question",
          name: "Is this password generator safe to use?",
          acceptedAnswer: { "@type": "Answer", text: "Yes. Our password generator runs entirely in your browser using the Web Crypto API. No passwords are ever sent to our servers or stored anywhere. The generation happens on your device only, making it completely private and secure." },
        },
        {
          "@type": "Question",
          name: "Should I use a different password for every account?",
          acceptedAnswer: { "@type": "Answer", text: "Absolutely. Using the same password across multiple accounts means that if one account is breached, all your accounts are compromised. Use a unique password for every account and store them in a password manager so you don't have to memorize them all." },
        },
        {
          "@type": "Question",
          name: "What makes a password strong?",
          acceptedAnswer: { "@type": "Answer", text: "A strong password is long (12+ characters), uses a mix of uppercase letters, lowercase letters, numbers, and symbols, avoids dictionary words and personal information, and is unique to each account. Our generator creates passwords that meet all these criteria automatically." },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
        { "@type": "ListItem", position: 3, name: "Password Generator", item: `${BASE_URL}/password-generator` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent />
    </>
  );
}
