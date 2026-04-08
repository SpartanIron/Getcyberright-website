import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
  description:
    "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
  alternates: { canonical: `${BASE_URL}/parents` },
  openGraph: {
    title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
    description:
      "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
    url: `${BASE_URL}/parents`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "Parents Hub",
      },
    ],
  },
};

export default function ParentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Parents Hub",
        item: `${BASE_URL}/parents`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SSRContent
          title="Parent Cybersecurity Guide"
          description="Comprehensive cybersecurity guidance for parents on protecting children online, parental controls, and digital safety conversations."
          sections={[{"heading":"Protecting Your Family Online","text":"As a parent, you play a crucial role in your children's digital safety. Our guide covers parental controls to open conversations about online risks."}]}
          links={[{"label":"Kids Hub","href":"/kids"},{"label":"Family Tools","href":"/tools"}]}
        />
        <ClientApp page="parents" />
    </>
  );
}
