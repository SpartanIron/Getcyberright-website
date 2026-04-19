import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

type SourceRecordType = "guide" | "alert" | "scam_intel";

interface SourcesReceiptLinkProps {
  recordType: SourceRecordType;
  recordId: string | undefined | null;
  className?: string;
}

export function SourcesReceiptLink({ recordType, recordId, className }: SourcesReceiptLinkProps) {
  const { data } = useQuery<{ id: string } | null>({
    queryKey: ["/api/social/posts/by-source", recordType, recordId],
    queryFn: async () => {
      const res = await fetch(`/api/social/posts/by-source/${recordType}/${recordId}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Lookup failed");
      return (await res.json()) as { id: string };
    },
    enabled: !!recordId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  if (!data?.id) return null;

  return (
    <Link href={`/social/p/${data.id}/sources`}>
      <Button
        variant="outline"
        size="sm"
        className={`gap-2 ${className || ""}`}
        data-testid={`link-sources-${recordType}-${recordId}`}
      >
        <ExternalLink className="h-3.5 w-3.5" />
        See the sources behind our post
      </Button>
    </Link>
  );
}
