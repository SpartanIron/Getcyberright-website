import type { Metadata } from "next";
import ClientApp from "../../client-app";

export const metadata: Metadata = {
  title: "Data Shield Next Steps | GetCyberRight",
  description:
    "Your personalized next steps to protect your data online based on your GCR Data Shield scan results.",
  robots: { index: false, follow: false },
};

export default function ShieldNextStepsPage() {
  return <ClientApp page="shield-next-steps" />;
}
