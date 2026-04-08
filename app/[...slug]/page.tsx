import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return {
    title: "Page Not Found | GetCyberRight",
    description:
      "The page you're looking for doesn't exist. Visit GetCyberRight for free cybersecurity education, tools, and safety resources for families.",
    robots: { index: false, follow: false },
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  notFound();
}
