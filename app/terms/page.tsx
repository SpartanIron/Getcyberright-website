import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Terms of Service | GetCyberRight",
  description:
    "Review the GetCyberRight terms of service and guidelines for using our cybersecurity education platform.",
  alternates: { canonical: `${BASE_URL}/terms` },
  openGraph: {
    title: "Terms of Service | GetCyberRight",
    description: "Review the GetCyberRight terms of service and guidelines for using our cybersecurity education platform.",
    url: `${BASE_URL}/terms`,
    type: "website",
  },
};

export default function TermsPage() {
  return (<>
        <SSRContent
          title="Terms of Service"
          description="GetCyberRight terms of service and usage guidelines."
        />
        <ClientApp page="terms" />
      </>);
}
