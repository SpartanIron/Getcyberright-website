import type { Metadata } from "next";
import PageContent from "@/pages/parents";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Parents' Guide to Online Safety — Parental Controls & Family Protection | GetCyberRight",
  description:
    "Free cybersecurity guides for parents. Set up parental controls, learn age-appropriate device settings, and protect your children from online threats, cyberbullying, and predators.",
  alternates: { canonical: `${BASE_URL}/parents` },
  openGraph: {
    title: "Parents' Guide to Online Safety — Parental Controls & Family Protection | GetCyberRight",
    description:
      "Free cybersecurity guides for parents. Set up parental controls, learn age-appropriate device settings, and protect your children from online threats, cyberbullying, and predators.",
    url: `${BASE_URL}/parents`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "Parents Hub",
      },
    ],
  },
};

export const revalidate = 3600;

export default function ParentsPage() {
  return <PageContent />;
}
