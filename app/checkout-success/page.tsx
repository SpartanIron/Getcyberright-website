import type { Metadata } from "next";
import PageContent from "@pages/checkout-success";

export const metadata: Metadata = {
  title: "Welcome to GetCyberRight Protection",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <PageContent />;
}
