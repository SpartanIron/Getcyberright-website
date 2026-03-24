import { Badge } from "@/components/ui/badge";
import { Zap, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface LiveNewsIndicatorProps {
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export function LiveNewsIndicator({ showRefresh = false, onRefresh }: LiveNewsIndicatorProps) {
  const { data: liveNews, isLoading, refetch } = useQuery({
    queryKey: ["/api/news/latest"],
    refetchInterval: 300000, // Check for updates every 5 minutes
    staleTime: 240000, // Consider data stale after 4 minutes
  });

  const handleRefresh = () => {
    refetch();
    onRefresh?.();
  };

  return (
    <div className="flex items-center space-x-2">
      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300">
        <Zap className="h-3 w-3 mr-1" />
        Live Feed
      </Badge>
      {liveNews && (liveNews as any)?.articles && (
        <span className="text-xs text-muted-foreground">
          {(liveNews as any).articles.length} fresh articles
        </span>
      )}
      {showRefresh && (
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="text-muted-foreground hover:text-[var(--cyber-blue)] transition-colors"
          title="Refresh live news"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}