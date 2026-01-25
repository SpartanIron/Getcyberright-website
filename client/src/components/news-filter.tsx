import { Button } from "@/components/ui/button";
import { Shield, Brain, Laptop, Calendar, AlertTriangle } from "lucide-react";

interface NewsFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function NewsFilter({ activeFilter, onFilterChange }: NewsFilterProps) {
  const filters = [
    { key: "all", label: "All Alerts", icon: AlertTriangle },
    { key: "cybersecurity", label: "Scams & Threats", icon: Shield },
    { key: "ai", label: "AI Safety", icon: Brain },
    { key: "tech", label: "Data Breaches", icon: Laptop },
    { key: "conferences", label: "Events", icon: Calendar },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.key)}
            className={
              activeFilter === filter.key
                ? "bg-[var(--cyber-blue)] text-white"
                : "text-muted-foreground hover:text-[var(--cyber-blue)] hover:border-[var(--cyber-blue)]"
            }
            data-testid={`filter-${filter.key}`}
          >
            <Icon className="h-4 w-4 mr-1.5" />
            {filter.label}
          </Button>
        );
      })}
    </div>
  );
}
