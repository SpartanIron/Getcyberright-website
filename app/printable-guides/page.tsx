import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Printable Guides | GetCyberRight",
  description:
    "Free printable cybersecurity guides and worksheets for families, classrooms, and community groups.",
  alternates: { canonical: `${BASE_URL}/printable-guides` },
  openGraph: {
    title: "Printable Guides | GetCyberRight",
    description:
      "Free printable cybersecurity guides and worksheets for families, classrooms, and community groups.",
    url: `${BASE_URL}/printable-guides`,
    type: "website",
  },
};

export default function PrintableGuidesPage() {
  return (<>
        <SSRContent
          title="Printable Cybersecurity Guides"
          description="Downloadable cybersecurity guides and checklists."
        />
        <ClientApp page="printable-guides" />
      </>);
}
