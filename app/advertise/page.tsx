import type { Metadata } from "next";
import PageContent from "@/pages/advertise";

export const metadata: Metadata = {
  title: "Advertise with Us | GetCyberRight",
  description:
    "Partner with GetCyberRight to reach security-conscious families and businesses. Advertising and sponsorship opportunities.",
  robots: { index: false, follow: false },
};

export default function AdvertisePage() {
  return <PageContent />;
}
