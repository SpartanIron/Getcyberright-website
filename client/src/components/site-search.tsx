import { useState, useRef, useEffect } from "react";
import { useLocation } from "@/lib/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  FileText, 
  Newspaper, 
  ArrowRight,
  Loader2,
  X
} from "lucide-react";

interface SearchResult {
  title: string;
  description: string;
  url: string;
  category: string;
  type: "page" | "article";
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  count: number;
}

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { data, isLoading } = useQuery<SearchResponse>({
    queryKey: ["/api/search", debouncedQuery],
    enabled: debouncedQuery.length >= 2,
  });

  const handleResultClick = (url: string, isExternal: boolean) => {
    setOpen(false);
    setQuery("");
    if (isExternal) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      navigate(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          aria-label="Search site"
        >
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search GetCyberRight</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides, tools, news..."
            className="pl-12 pr-12 h-14 text-lg border-0 border-b rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            aria-label="Search"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && debouncedQuery.length >= 2 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          )}

          {!isLoading && data && data.results.length > 0 && (
            <div className="p-2" role="listbox" aria-label="Search results">
              <p className="px-3 py-2 text-xs text-slate-500">
                {data.count} results
              </p>
              {data.results.slice(0, 8).map((result, index) => (
                <button
                  key={`${result.url}-${index}`}
                  onClick={() => handleResultClick(result.url, result.type === "article")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors group"
                  role="option"
                >
                  <div className={`p-2 rounded-lg ${
                    result.type === "page" 
                      ? "bg-teal-100 dark:bg-teal-900/30" 
                      : "bg-purple-100 dark:bg-purple-900/30"
                  }`}>
                    {result.type === "page" ? (
                      <FileText className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Newspaper className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400">
                      {result.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {result.category} {result.type === "article" && "• External"}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </button>
              ))}
              {data.count > 8 && (
                <button
                  onClick={handleSubmit}
                  className="w-full p-3 text-sm text-teal-600 dark:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  View all {data.count} results
                </button>
              )}
            </div>
          )}

          {!isLoading && debouncedQuery.length >= 2 && data && data.results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-slate-500">No results found for "{debouncedQuery}"</p>
            </div>
          )}

          {!isLoading && debouncedQuery.length < 2 && (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">
                Type at least 2 characters to search
              </p>
              <p className="text-xs text-slate-400 mt-2">
                Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-xs">Ctrl+K</kbd> to open search
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
