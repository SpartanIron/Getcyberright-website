import { Button } from "@/components/ui/button";
import { Shield, Brain, Laptop, Calendar, AlertTriangle, Flame, GraduationCap, Lightbulb } from "lucide-react";

interface NewsFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function NewsFilter({ activeFilter, onFilterChange }: NewsFilterProps) {
  const filters = [
    { key: "all", label: "All", icon: Lightbulb },
    { key: "action-needed", label: "Action Needed", icon: Flame },
    { key: "cybersecurity", label: "Threat Intel", icon: Shield },
    { key: "ai", label: "AI Safety", icon: Brain },
    { key: "tech", label: "Tech & Privacy", icon: Laptop },
    { key: "learning", label: "Learning", icon: GraduationCap },
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
