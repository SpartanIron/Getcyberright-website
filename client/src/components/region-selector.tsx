import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check } from "lucide-react";
import { type Region, setUserRegion, getRegionInfo } from "@/lib/region-detect";

interface RegionOption {
  value: Region;
  label: string;
  flag: string;
}

const regions: RegionOption[] = [
  { value: "us", label: "United States", flag: "🇺🇸" },
  { value: "americas", label: "Americas", flag: "🌎" },
  { value: "europe", label: "Europe", flag: "🇪🇺" },
  { value: "africa", label: "Africa", flag: "🌍" },
  { value: "asia", label: "Asia", flag: "🌏" },
  { value: "middle-east", label: "Middle East", flag: "🌍" },
  { value: "australia", label: "Australia & Oceania", flag: "🇦🇺" },
  { value: "global", label: "Global", flag: "🌐" },
];

interface RegionSelectorProps {
  currentRegion: Region;
  onRegionChange: (region: Region) => void;
  variant?: "compact" | "full";
}

export function RegionSelector({ currentRegion, onRegionChange, variant = "compact" }: RegionSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const currentOption = regions.find(r => r.value === currentRegion) || regions[regions.length - 1];

  const handleSelect = (region: Region) => {
    setUserRegion(region);
    onRegionChange(region);
    setOpen(false);
  };

  if (variant === "full") {
    return (
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <Button
            key={region.value}
            variant={currentRegion === region.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(region.value)}
            className="gap-1.5"
          >
            <span>{region.flag}</span>
            <span>{region.label}</span>
            {currentRegion === region.value && <Check className="h-3 w-3 ml-1" />}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentOption.flag} {currentOption.label}</span>
          <span className="sm:hidden">{currentOption.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {regions.map((region) => (
          <DropdownMenuItem
            key={region.value}
            onClick={() => handleSelect(region.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>{region.flag}</span>
              <span>{region.label}</span>
            </span>
            {currentRegion === region.value && <Check className="h-4 w-4 text-teal-500" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
