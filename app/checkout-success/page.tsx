import type { Metadata } from "next";
import PageSkeleton from "../page-skeleton";
import { Suspense } from "react";
import PageContent from "@/pages/checkout-success";

export const metadata: Metadata = {
  title: "Payment Successful | GetCyberRight",
  description:
    "Your payment was processed successfully. Thank you for upgrading your GetCyberRight plan.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <Suspense fallback={<PageSkeleton />}>
        <PageContent />
      </Suspense>;
}
