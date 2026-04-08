import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Advertise with Us | GetCyberRight",
  description:
    "Partner with GetCyberRight to reach security-conscious families and businesses. Advertising and sponsorship opportunities.",
  robots: { index: false, follow: false },
};

export default function AdvertisePage() {
  return (<>
        <SSRContent
          title="Advertise with GetCyberRight"
          description="Partnership and advertising opportunities."
        />
        <ClientApp page="advertise" />
      </>);
}
