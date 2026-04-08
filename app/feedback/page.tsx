import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Feedback | GetCyberRight",
  description:
    "Share your feedback to help improve GetCyberRight. We value your suggestions and ideas.",
  alternates: { canonical: `${BASE_URL}/feedback` },
  openGraph: {
    title: "Feedback | GetCyberRight",
    description:
      "Share your feedback to help improve GetCyberRight. We value your suggestions and ideas.",
    url: `${BASE_URL}/feedback`,
    type: "website",
  },
};

export default function FeedbackPage() {
  return <ClientApp page="feedback" />;
}
