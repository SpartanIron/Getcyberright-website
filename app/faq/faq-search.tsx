"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FAQSearchProps {
  children: (searchQuery: string) => React.ReactNode;
}

export function FAQSearch({ children }: FAQSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div className="container mx-auto px-4 max-w-2xl py-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search all questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background border-border"
            aria-label="Search FAQ"
          />
        </div>
      </div>
      {children(searchQuery)}
    </>
  );
}
