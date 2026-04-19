/**
 * Evidence chart selector. Decides whether a real GCR data chart fits a
 * given social post, and if so, returns the chart spec sourced from real
 * scam-intelligence aggregator data. Returns null when no honest chart
 * applies (which is the signal to fall through to licensed_photo /
 * branded_card).
 */
import type { EvidenceChartSpec } from "./evidenceChartRenderer";
import { getGlobeData } from "./scamIntelAggregator";

export interface ChartSelectorInput {
  category?: string | null;
  title?: string | null;
  contentType?: string | null;
}

const SCAM_INTEL_KEYWORDS = [
  "scam", "fraud", "phishing", "ransomware", "breach",
  "victims", "losses", "country", "global", "trend", "intelligence",
];

function topicMatchesScamIntel(input: ChartSelectorInput): boolean {
  const hay = `${input.title || ""} ${input.category || ""}`.toLowerCase();
  if (!hay.trim()) return false;
  return SCAM_INTEL_KEYWORDS.some((kw) => hay.includes(kw));
}

/**
 * Build a "Top countries by scam intensity" bar chart from cached globe data.
 * Returns null if data is unavailable or the topic does not warrant a chart.
 */
export function selectEvidenceChartForPost(input: ChartSelectorInput): EvidenceChartSpec | null {
  if (!topicMatchesScamIntel(input)) return null;

  const globe = getGlobeData();
  if (!globe || !globe.hotspots || globe.hotspots.length === 0) return null;

  const top = [...globe.hotspots]
    .sort((a, b) => (b.intensity || 0) - (a.intensity || 0))
    .slice(0, 5)
    .filter((h) => typeof h.intensity === "number" && h.intensity > 0);

  if (top.length < 3) return null;

  return {
    kind: "bar",
    title: "Top countries by scam intensity",
    subtitle: "Live GetCyberRight scam-intelligence index (0-100)",
    series: top.map((h) => ({
      label: h.countryCode || h.countryName?.slice(0, 12) || "?",
      // Aggregator stores intensity as 0..1; scale to 0..100 for display.
      value: Math.round((h.intensity || 0) * 100),
    })),
    sourceLabel: "GetCyberRight Scam Intelligence",
    asOfIso: globe.dataAsOf || globe.lastUpdated || new Date().toISOString(),
  };
}
