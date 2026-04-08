"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, RefreshCw, Check, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { RegionInfo, ThreatTrend } from "@shared/regions";

interface RegionData {
  success: boolean;
  detectedRegion?: string;
  region: RegionInfo;
  threats: ThreatTrend[];
}

interface RegionListData {
  success: boolean;
  regions: { code: string; name: string; country: string }[];
}

const REGION_STORAGE_KEY = "getcyberright_region";

export function useRegion() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(REGION_STORAGE_KEY);
    }
    return null;
  });

  const { data: detectedData, isLoading: isDetecting } = useQuery<RegionData>({
    queryKey: ["/api/region/detect"],
    enabled: !selectedRegion,
    staleTime: 1000 * 60 * 60,
  });

  const { data: regionData, isLoading: isLoadingRegion } = useQuery<RegionData>({
    queryKey: ["/api/region", selectedRegion],
    enabled: !!selectedRegion,
    staleTime: 1000 * 60 * 30,
  });

  const { data: regionsListData } = useQuery<RegionListData>({
    queryKey: ["/api/region/list"],
    staleTime: 1000 * 60 * 60 * 24,
  });

  const currentRegionCode = selectedRegion || detectedData?.detectedRegion || "GLOBAL";
  const currentData = selectedRegion ? regionData : detectedData;

  const saveRegion = (code: string) => {
    localStorage.setItem(REGION_STORAGE_KEY, code);
    setSelectedRegion(code);
  };

  const clearSavedRegion = () => {
    localStorage.removeItem(REGION_STORAGE_KEY);
    setSelectedRegion(null);
  };

  return {
    regionCode: currentRegionCode,
    region: currentData?.region,
    threats: currentData?.threats || [],
    isLoading: isDetecting || isLoadingRegion,
    isAutoDetected: !selectedRegion,
    availableRegions: regionsListData?.regions || [],
    saveRegion,
    clearSavedRegion,
  };
}

interface RegionSelectorProps {
  compact?: boolean;
  showThreats?: boolean;
  className?: string;
}

export function RegionSelector({ compact = false, showThreats = true, className = "" }: RegionSelectorProps) {
  const {
    regionCode,
    region,
    threats,
    isLoading,
    isAutoDetected,
    availableRegions,
    saveRegion,
    clearSavedRegion,
  } = useRegion();

  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
        <span className="text-sm">Detecting your region...</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsEditing(!isEditing)}
          data-testid="button-region-selector"
        >
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>{region?.name || "Global"}</span>
          {isAutoDetected && (
            <Badge variant="secondary" className="text-xs">Auto</Badge>
          )}
        </Button>
        
        {isEditing && (
          <div className="flex items-center gap-2">
            <Select value={regionCode} onValueChange={(value) => {
              saveRegion(value);
              setIsEditing(false);
            }}>
              <SelectTrigger className="w-48" data-testid="select-region">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                {availableRegions.map((r) => (
                  <SelectItem key={r.code} value={r.code} data-testid={`option-region-${r.code}`}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {!isAutoDetected && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  clearSavedRegion();
                  setIsEditing(false);
                }}
                data-testid="button-auto-detect"
              >
                <RefreshCw className="w-4 h-4 mr-1" aria-hidden="true" />
                Auto-detect
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className={className} data-testid="card-region-selector">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-lg">Your Region</CardTitle>
          </div>
          {isAutoDetected && (
            <Badge variant="secondary" className="gap-1">
              <Check className="w-3 h-3" aria-hidden="true" />
              Auto-detected
            </Badge>
          )}
        </div>
        <CardDescription>
          Get local threat alerts and relevant help resources
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={regionCode} onValueChange={saveRegion}>
            <SelectTrigger className="flex-1" data-testid="select-region-full">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                  {region?.name || "Select your region"}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {availableRegions.map((r) => (
                <SelectItem key={r.code} value={r.code}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
                    <span>{r.name}</span>
                    <span className="text-xs text-muted-foreground">({r.country})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {!isAutoDetected && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearSavedRegion}
              data-testid="button-reset-region"
            >
              <RefreshCw className="w-4 h-4 mr-1" aria-hidden="true" />
              Reset
            </Button>
          )}
        </div>

        {showThreats && threats.length > 0 && (
          <div className="pt-3 border-t space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>Trending Threats in Your Area</span>
            </div>
            <ul className="space-y-2" aria-label="Regional threat trends">
              {threats.slice(0, 3).map((threat) => (
                <li key={threat.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                  <SeverityBadge severity={threat.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{threat.title}</span>
                      <TrendIndicator trend={threat.trend} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {threat.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: ThreatTrend["severity"] }) {
  const config = {
    critical: { bg: "bg-red-500/10 text-red-600 dark:text-red-400", label: "Critical" },
    high: { bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400", label: "High" },
    medium: { bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400", label: "Medium" },
    low: { bg: "bg-green-500/10 text-green-600 dark:text-green-400", label: "Low" },
  };
  
  const { bg, label } = config[severity];
  
  return (
    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${bg}`}>
      {label}
    </span>
  );
}

function TrendIndicator({ trend }: { trend: ThreatTrend["trend"] }) {
  if (trend === "rising") {
    return <TrendingUp className="w-3 h-3 text-red-500" aria-label="Trending up" />;
  }
  if (trend === "declining") {
    return <TrendingDown className="w-3 h-3 text-green-500" aria-label="Trending down" />;
  }
  return <Minus className="w-3 h-3 text-muted-foreground" aria-label="Stable" />;
}

export function RegionalThreatsCard({ className = "" }: { className?: string }) {
  const { region, threats, isLoading, regionCode } = useRegion();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Loading regional threats...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className} data-testid="card-regional-threats">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
          <CardTitle className="text-lg">Threats in {region?.name || "Your Area"}</CardTitle>
        </div>
        <CardDescription>
          Current scam and threat trends reported in your region
        </CardDescription>
      </CardHeader>
      <CardContent>
        {threats.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No specific threats reported for your region. Stay vigilant!
          </p>
        ) : (
          <ul className="space-y-3" aria-label="Threat list">
            {threats.map((threat) => (
              <li key={threat.id} className="p-3 rounded-lg border bg-card hover-elevate">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={threat.severity} />
                    <span className="font-medium">{threat.title}</span>
                  </div>
                  <TrendIndicator trend={threat.trend} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {threat.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{threat.reportedCases.toLocaleString()} reported cases</span>
                  <span>Category: {threat.category}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
