import type { Metadata } from "next";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Cybersecurity Checklists | GetCyberRight",
  description:
    "Downloadable cybersecurity checklists for families, seniors, kids, and small businesses. Step-by-step security guides.",
  alternates: { canonical: `${BASE_URL}/checklists` },
  openGraph: {
    title: "Cybersecurity Checklists | GetCyberRight",
    description:
      "Downloadable cybersecurity checklists for families, seniors, kids, and small businesses. Step-by-step security guides.",
    url: `${BASE_URL}/checklists`,
    type: "website",
  },
};

export default function ChecklistsPage() {
  return <ClientApp />;
}
