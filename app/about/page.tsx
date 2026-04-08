import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
  description:
    "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About GetCyberRight: Our Story & Mission | GetCyberRight",
    description:
      "Learn about GetCyberRight's mission to make cybersecurity education accessible to every family. Founded by real people who experienced scams firsthand.",
    url: `${BASE_URL}/about`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/trust-metrics.png`,
        width: 1080,
        height: 1080,
        alt: "About GetCyberRight",
      },
    ],
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${BASE_URL}/about`,
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
          title="About GetCyberRight"
          description="Learn about GetCyberRight's mission to make cybersecurity accessible for every family through education, tools, and community support."
          sections={[{"heading":"Our Mission","text":"GetCyberRight exists to bridge the cybersecurity knowledge gap for everyday families."},{"heading":"What We Do","text":"We provide free cybersecurity education, AI-powered scam detection tools, data broker removal services, and family-focused safety training."}]}
          links={[{"label":"Our Mission","href":"/our-mission"},{"label":"Contact Us","href":"/contact"}]}
        />
        <ClientApp page="about" />
    </>
  );
}
