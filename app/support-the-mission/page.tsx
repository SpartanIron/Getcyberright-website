import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Support the Mission | GetCyberRight",
  description:
    "Help us make cybersecurity education accessible to everyone. Support GetCyberRight's mission to protect families online.",
  alternates: { canonical: `${BASE_URL}/support-the-mission` },
  openGraph: {
    title: "Support the Mission | GetCyberRight",
    description:
      "Help us make cybersecurity education accessible to everyone. Support GetCyberRight's mission to protect families online.",
    url: `${BASE_URL}/support-the-mission`,
    type: "website",
  },
};

export default function SupportTheMissionPage() {
  return (<>
        <SSRContent
          title="Support Our Mission"
          description="Help make cybersecurity education accessible for all families."
        />
        <ClientApp page="support-the-mission" />
      </>);
}
