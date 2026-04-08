import { ScamIntelContent } from "@/components/scam-intel-content";

export default function ScamIntelListing({ initialScams }: { initialScams?: any[] }) {
  return <ScamIntelContent initialScams={initialScams} />;
}
