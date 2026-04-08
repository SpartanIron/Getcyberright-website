import type { Metadata } from "next";
import ClientApp from "../client-app";

export const metadata: Metadata = {
  title: "Payment Successful | GetCyberRight",
  description:
    "Your payment was processed successfully. Thank you for upgrading your GetCyberRight plan.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return <ClientApp page="checkout-success" />;
}
