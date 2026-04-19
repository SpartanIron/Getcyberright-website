import type { Citation } from "./scamIntelAggregator";

export function formatCitationReceipt(citations: Citation[], maxLines = 3): string {
  if (!citations || citations.length === 0) return "";
  const lines: string[] = ["Sources:"];
  const seen = new Set<string>();
  for (const c of citations) {
    if (lines.length - 1 >= maxLines) break;
    const key = c.url.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(`• ${c.publisher}: ${c.url}`);
  }
  return lines.join("\n");
}

export function appendCitationReceipt(content: string, citations: Citation[], platform: string): string {
  // Instagram captions are too long with receipts; skip there.
  if (platform === "instagram" || platform === "alert" || platform === "x") return content;
  const receipt = formatCitationReceipt(citations, 2);
  if (!receipt) return content;
  if (content.includes("Sources:")) return content;
  return `${content}\n\n${receipt}`;
}
