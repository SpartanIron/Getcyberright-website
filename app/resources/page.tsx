import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Resources | GetCyberRight",
  description:
    "Explore our complete library of cybersecurity resources including safety guides, interactive tools, training courses, and scam alerts.",
  alternates: { canonical: `${BASE_URL}/resources` },
  openGraph: {
    title: "Cybersecurity Resources | GetCyberRight",
    description: "Explore our complete library of cybersecurity resources including safety guides, interactive tools, training courses, and scam alerts.",
    url: `${BASE_URL}/resources`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Cybersecurity Resources" }],
  },
};

export default function ResourcesPage() {
  return (<>
        <SSRContent
          title="Cybersecurity Resources"
          description="Free cybersecurity resources including guides, checklists, cheat sheets, and glossary for families."
          sections={[{"heading":"Everything You Need","text":"Comprehensive library of cybersecurity resources including guides, checklists, and an A-Z glossary."}]}
          links={[{"label":"Glossary","href":"/resources/glossary"},{"label":"Cheat Sheets","href":"/resources/cheat-sheets"}]}
        />
        <ClientApp page="resources" />
      </>);
}
