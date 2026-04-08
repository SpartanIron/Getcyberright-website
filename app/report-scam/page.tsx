import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Report a Scam: Help Protect Your Community | GetCyberRight",
  description: "Report a scam to GetCyberRight and help protect others. Submit details about suspicious emails, phone calls, text messages, or websites.",
  alternates: { canonical: `${BASE_URL}/report-scam` },
  openGraph: {
    title: "Report a Scam: Help Protect Your Community | GetCyberRight",
    description: "Report a scam to GetCyberRight and help protect others. Submit details about suspicious emails, phone calls, text messages, or websites.",
    url: `${BASE_URL}/report-scam`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-calls-texts.png`, width: 1080, height: 1080, alt: "Report a Scam" }],
  },
};

export default function ReportScamPage() {
  return <ClientApp page="report-scam" />;
}
