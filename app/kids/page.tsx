import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Kids Online Safety Lessons (Ages 8-16) | GCR",
  description:
    "Interactive cybersecurity lessons designed for kids and teens ages 8 to 16. Learn about password safety, spotting scams, and being a good digital citizen.",
  alternates: { canonical: `${BASE_URL}/kids` },
  openGraph: {
    title: "Kids Online Safety Lessons (Ages 8-16) | GCR",
    description:
      "Interactive cybersecurity lessons designed for kids and teens ages 8 to 16. Learn about password safety, spotting scams, and being a good digital citizen.",
    url: `${BASE_URL}/kids`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "Kids Online Safety",
      },
    ],
  },
};

export default function KidsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kids Safety",
        item: `${BASE_URL}/kids`,
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
          title="Kids Online Safety Hub"
          description="Age-appropriate cybersecurity education for children with interactive games, quizzes, and lessons about online safety and digital citizenship."
          sections={[{"heading":"Learn Online Safety the Fun Way","text":"Our Kids Hub uses interactive games, quizzes, and stories to teach children about staying safe online."},{"heading":"Password Power","text":"Learn how to create strong passwords that are easy to remember but hard to guess."},{"heading":"Social Media Safety","text":"Tips for using social media responsibly including privacy settings and handling cyberbullying."}]}
          links={[{"label":"Parent Guide","href":"/parent-guide"},{"label":"Training","href":"/training"}]}
        />
        <ClientApp page="kids" />
    </>
  );
}
