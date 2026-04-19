import type { Metadata } from "next";
import PageContent from "@/pages/educators";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Educator Cybersecurity Resources | GetCyberRight",
  description:
    "Cybersecurity teaching resources for educators. Access lesson plans, classroom activities, printable guides, and curriculum materials.",
  alternates: { canonical: `${BASE_URL}/educators` },
  keywords:
    "K-12 cybersecurity curriculum, digital citizenship lesson plans, ISTE digital citizen standards, classroom cyberbullying lesson, password security lesson middle school, phishing lesson high school, free cybersecurity lesson plans, COPPA classroom resources, school cybersecurity presentation, teacher cybersecurity training",
  openGraph: {
    title: "Educator Cybersecurity Resources | GetCyberRight",
    description:
      "Cybersecurity teaching resources for educators. Access lesson plans, classroom activities, printable guides, and curriculum materials.",
    url: `${BASE_URL}/educators`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/education.png`, width: 1200, height: 630, alt: "Free K-12 cybersecurity curriculum and lesson plans for educators" }],
  },
};

export const revalidate = 3600;

export default function EducatorsPage() {
  return <PageContent />;
}
