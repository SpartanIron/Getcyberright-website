import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Small Business Cybersecurity | GetCyberRight",
  description:
    "Cybersecurity resources for small businesses. Employee awareness training, security policy templates, and incident response guides.",
  alternates: { canonical: `${BASE_URL}/small-business` },
  openGraph: {
    title: "Small Business Cybersecurity | GetCyberRight",
    description:
      "Cybersecurity resources for small businesses. Employee awareness training, security policy templates, and incident response guides.",
    url: `${BASE_URL}/small-business`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/training.png`, width: 1080, height: 1080, alt: "Small Business Cybersecurity" }],
  },
};

export default function SmallBusinessPage() {
  return (<>
        <SSRContent
          title="Small Business Cybersecurity"
          description="Cybersecurity resources for small businesses with practical security guides and training."
        />
        <ClientApp page="small-business" />
      </>);
}
