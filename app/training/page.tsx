import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Training Academy | GetCyberRight",
  description:
    "Access cybersecurity training courses designed for beginners, families, seniors, and small businesses. Core courses are free to get started.",
  alternates: { canonical: `${BASE_URL}/training` },
  openGraph: {
    title: "Cybersecurity Training Academy | GetCyberRight",
    description:
      "Access cybersecurity training courses designed for beginners, families, seniors, and small businesses. Core courses are free to get started.",
    url: `${BASE_URL}/training`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/training.png`, width: 1080, height: 1080, alt: "GetCyberRight Training" }],
  },
};

export default function TrainingPage() {
  return <ClientApp />;
}
