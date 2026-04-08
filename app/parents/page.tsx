import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
  description:
    "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
  alternates: { canonical: `${BASE_URL}/parents` },
  openGraph: {
    title: "Parents Hub: Keep Your Family Safe Online | GetCyberRight",
    description:
      "Cybersecurity guides for parents. Learn about parental controls, age-appropriate device settings, and how to protect your children from online threats.",
    url: `${BASE_URL}/parents`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1080, height: 1080, alt: "Parents Hub" }],
  },
};

export default function ParentsPage() {
  return <ClientApp />;
}
