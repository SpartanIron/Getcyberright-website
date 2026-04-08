import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Data Broker Removal: 501+ Sites | GetCyberRight",
  description: "Protect your privacy by removing your personal information from 501+ data broker sites. No account needed to get started.",
  alternates: { canonical: `${BASE_URL}/data-removal` },
  openGraph: {
    title: "Data Broker Removal: 501+ Sites | GetCyberRight",
    description: "Protect your privacy by removing your personal information from 501+ data broker sites. No account needed to get started.",
    url: `${BASE_URL}/data-removal`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/data-shield.png`, width: 1080, height: 1080, alt: "Data Broker Removal" }],
  },
};

export default function DataRemovalPage() {
  return (<>
        <SSRContent
          title="Data Broker Removal Guide"
          description="Step-by-step guide to removing your personal information from data brokers."
          sections={[{"heading":"Take Back Your Privacy","text":"Walk through the process of finding and removing your data from common data broker sites."}]}
        />
        <ClientApp page="data-removal" />
      </>);
}
