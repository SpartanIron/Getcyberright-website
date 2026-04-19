import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/press";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Press & Media | GetCyberRight",
  description:
    "Press kit, key facts, boilerplate, spokespeople, and media inquiry form for journalists covering GetCyberRight. Press contact: press@getcyberright.com.",
  alternates: { canonical: `${BASE_URL}/press` },
  keywords:
    "GetCyberRight press, cybersecurity press kit, scam statistics for journalists, family digital safety expert, senior fraud expert quote, small business cyber risk source, scam intelligence data, press@getcyberright.com",
  openGraph: {
    title: "Press & Media | GetCyberRight",
    description:
      "Press kit, key facts, spokespeople, and direct line to the GetCyberRight editorial team.",
    url: `${BASE_URL}/press`,
    type: "website",
  },
};

export default function PressPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Press & Media",
      description:
        "Press kit, key facts, spokespeople, and media inquiry form for GetCyberRight.",
      url: `${BASE_URL}/press`,
      publisher: {
        "@type": "Organization",
        name: "GetCyberRight LLC",
        url: BASE_URL,
        email: "press@getcyberright.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Press", item: `${BASE_URL}/press` },
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
