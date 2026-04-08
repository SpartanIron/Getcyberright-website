import type { Metadata } from "next";
import PageContent from "@/pages/experience";

export const metadata: Metadata = {
  title: "Experience | GetCyberRight",
  description:
    "Your GetCyberRight experience and learning journey overview.",
  robots: { index: false, follow: false },
};

export default function ExperiencePage() {
  return <PageContent />;
}
