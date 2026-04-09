import type { Metadata } from "next";
import PageContent from "@/pages/shield-next-steps";

export const metadata: Metadata = {
  title: "Data Shield Next Steps | GetCyberRight",
  description:
    "Your personalized next steps to protect your data online based on your GCR Data Shield scan results.",
  robots: { index: false, follow: false },
};

export const revalidate = 3600;

export default async function ShieldNextStepsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const level = typeof params.level === "string" ? params.level : undefined;
  return <PageContent level={level} />;
}
