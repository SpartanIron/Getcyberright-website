import type { Metadata } from "next";
import PageContent from "@/pages/feedback";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Feedback | GetCyberRight",
  description:
    "Share your feedback to help improve GetCyberRight. We value your suggestions and ideas.",
  alternates: { canonical: `${BASE_URL}/feedback` },
  robots: { index: false, follow: false },  openGraph: {
    title: "Feedback | GetCyberRight",
    description:
      "Share your feedback to help improve GetCyberRight. We value your suggestions and ideas.",
    url: `${BASE_URL}/feedback`,
    type: "website",
  },
};

export const revalidate = 3600;

export default function FeedbackPage() {
  return <PageContent />;
}
