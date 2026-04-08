import { StructuredData } from "@/components/structured-data";
import type { BreadcrumbData, DatasetData } from "@/components/structured-data";
import { ScamIntelContent } from "@/components/scam-intel-content";

const breadcrumbs: BreadcrumbData = {
  type: "BreadcrumbList",
  items: [
    { name: "Home", url: "https://www.getcyberright.com/" },
    { name: "Scam Intelligence", url: "https://www.getcyberright.com/scam-intel" },
  ],
};

const datasetSchema: DatasetData = {
  type: "Dataset",
  name: "Scam Intelligence Database",
  description: "Comprehensive database of active scams with risk levels, warning signs, prevention tips, and regional targeting data. Covers phishing, romance scams, crypto fraud, tech support scams, and more.",
  url: "https://www.getcyberright.com/scam-intel",
  keywords: ["scam database", "fraud intelligence", "cybersecurity threats", "scam prevention", "phishing scams"],
  creator: { name: "GetCyberRight", url: "https://www.getcyberright.com" },
  variableMeasured: ["risk level", "report count", "average financial loss", "target audience", "platforms used"],
};

export default function ScamIntelListing({ initialScams }: { initialScams?: any[] }) {
  return (
    <>
      <StructuredData data={[breadcrumbs, datasetSchema]} />
      <ScamIntelContent initialScams={initialScams} />
    </>
  );
}
