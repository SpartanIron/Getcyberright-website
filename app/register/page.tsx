import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/register";

export const metadata: Metadata = {
  title: "Create Account | GetCyberRight",
  description:
    "Create a free GetCyberRight account to access cybersecurity training, tools, and personalized safety resources.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
