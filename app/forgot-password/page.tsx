import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/forgot-password";

export const metadata: Metadata = {
  title: "Reset Password | GetCyberRight",
  description: "Reset your GetCyberRight account password securely.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
