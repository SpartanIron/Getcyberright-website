import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Travel Cybersecurity Tips | GetCyberRight",
  description: "Protect your digital life while traveling. Tips for secure Wi-Fi use, device protection, avoiding travel scams, and keeping data safe.",
  alternates: { canonical: `${BASE_URL}/travel-safety` },
  openGraph: {
    title: "Travel Cybersecurity Tips | GetCyberRight",
    description: "Protect your digital life while traveling. Tips for secure Wi-Fi use, device protection, avoiding travel scams, and keeping data safe.",
    url: `${BASE_URL}/travel-safety`,
    type: "website",
  },
};

export default function TravelSafetyPage() {
  return (<>
        <SSRContent
          title="Cyber Safety While Traveling"
          description="Cybersecurity tips for travelers to protect devices and data on public WiFi and abroad."
        />
        <ClientApp page="travel-safety" />
      </>);
}
