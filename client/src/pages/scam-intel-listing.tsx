import { ScamIntelContent, type ScamIntel } from "@/components/scam-intel-content";

export default function ScamIntelListing({ initialScams }: { initialScams?: ScamIntel[] }) {
  return <ScamIntelContent initialScams={initialScams} />;
}
