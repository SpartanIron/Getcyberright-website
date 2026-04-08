import type { Metadata } from "next";
import PageContent from "@/pages/preferences";

export const metadata: Metadata = {
  title: "Preferences | GetCyberRight",
  description:
    "Customize your GetCyberRight notification preferences and account settings.",
  robots: { index: false, follow: false },
};

export default function PreferencesPage() {
  return <PageContent />;
}
