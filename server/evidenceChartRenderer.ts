/**
 * Evidence chart renderer.
 *
 * Generates a press-grade PNG visualization (sparkline or bar) directly from
 * structured GCR data. Output is pure SVG composited into a PNG via sharp —
 * no native canvas dependency. Every chart is branded with a "Source:
 * GetCyberRight | as of <UTC date>" footer baked into the image so the
 * provenance travels with the asset across reshares.
 */
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

const OUTPUT_DIR = path.join(process.cwd(), ".local", "social-images");

export type EvidenceChartKind = "sparkline" | "bar";

export interface EvidenceSeriesPoint {
  label: string;
  value: number;
}

export interface EvidenceChartSpec {
  kind: EvidenceChartKind;
  title: string;
  subtitle?: string;
  series: EvidenceSeriesPoint[];
  sourceLabel?: string;
  asOfIso: string;
  /** Output dimensions; defaults to 1200x630 (OG / Twitter card aspect). */
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 630;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function fmtAsOf(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toISOString().slice(0, 10);
  } catch {
    return iso;
  }
}

function buildSparklineSvg(spec: EvidenceChartSpec, w: number, h: number): string {
  const padX = 80;
  const padTop = 170;
  const padBottom = 130;
  const innerW = w - padX * 2;
  const innerH = h - padTop - padBottom;
  const values = spec.series.map((p) => p.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 1);
  const range = max - min || 1;
  const stepX = spec.series.length > 1 ? innerW / (spec.series.length - 1) : 0;
  const points = spec.series
    .map((p, i) => {
      const x = padX + i * stepX;
      const y = padTop + innerH - ((p.value - min) / range) * innerH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const lastPt = spec.series[spec.series.length - 1];
  const lastX = padX + (spec.series.length - 1) * stepX;
  const lastY = padTop + innerH - ((lastPt.value - min) / range) * innerH;
  return `
    <polyline points="${points}" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    <circle cx="${lastX.toFixed(1)}" cy="${lastY.toFixed(1)}" r="8" fill="#0ea5e9" />
    <text x="${(lastX - 8).toFixed(1)}" y="${(lastY - 16).toFixed(1)}" font-family="Inter, system-ui, sans-serif" font-size="28" font-weight="700" fill="#0f172a" text-anchor="end">${escapeXml(String(lastPt.value))}</text>
  `;
}

function buildBarSvg(spec: EvidenceChartSpec, w: number, h: number): string {
  const padX = 80;
  const padTop = 170;
  const padBottom = 150;
  const innerW = w - padX * 2;
  const innerH = h - padTop - padBottom;
  const n = spec.series.length;
  const gap = 16;
  const barW = (innerW - gap * (n - 1)) / Math.max(n, 1);
  const max = Math.max(...spec.series.map((p) => p.value), 1);
  return spec.series
    .map((p, i) => {
      const barH = (p.value / max) * innerH;
      const x = padX + i * (barW + gap);
      const y = padTop + innerH - barH;
      const labelY = padTop + innerH + 28;
      const valueY = y - 12;
      return `
        <rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${barH.toFixed(1)}" fill="#0ea5e9" rx="6" />
        <text x="${(x + barW / 2).toFixed(1)}" y="${valueY.toFixed(1)}" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="700" fill="#0f172a" text-anchor="middle">${escapeXml(String(p.value))}</text>
        <text x="${(x + barW / 2).toFixed(1)}" y="${labelY.toFixed(1)}" font-family="Inter, system-ui, sans-serif" font-size="20" fill="#475569" text-anchor="middle">${escapeXml(p.label)}</text>
      `;
    })
    .join("");
}

function buildChartSvg(spec: EvidenceChartSpec): string {
  const w = spec.width ?? DEFAULT_WIDTH;
  const h = spec.height ?? DEFAULT_HEIGHT;
  const inner = spec.kind === "bar" ? buildBarSvg(spec, w, h) : buildSparklineSvg(spec, w, h);
  const sourceLine = `Source: ${spec.sourceLabel || "GetCyberRight"} | as of ${fmtAsOf(spec.asOfIso)} UTC`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#f1f5f9" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" />
  <rect x="0" y="0" width="${w}" height="64" fill="#0f172a" />
  <text x="40" y="42" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="800" fill="#ffffff">GetCyberRight</text>
  <text x="${w - 40}" y="42" font-family="Inter, system-ui, sans-serif" font-size="18" fill="#94a3b8" text-anchor="end">Scam Intelligence</text>
  <text x="40" y="120" font-family="Inter, system-ui, sans-serif" font-size="40" font-weight="800" fill="#0f172a">${escapeXml(spec.title)}</text>
  ${spec.subtitle ? `<text x="40" y="155" font-family="Inter, system-ui, sans-serif" font-size="22" fill="#475569">${escapeXml(spec.subtitle)}</text>` : ""}
  ${inner}
  <rect x="0" y="${h - 56}" width="${w}" height="56" fill="#0f172a" />
  <text x="40" y="${h - 22}" font-family="Inter, system-ui, sans-serif" font-size="18" fill="#cbd5e1">${escapeXml(sourceLine)}</text>
  <text x="${w - 40}" y="${h - 22}" font-family="Inter, system-ui, sans-serif" font-size="16" fill="#64748b" text-anchor="end">getcyberright.com</text>
</svg>`;
}

/**
 * Render an evidence chart to a PNG file under .local/social-images/ and
 * return the absolute file path. Returns null if rendering fails.
 */
export async function renderEvidenceChart(spec: EvidenceChartSpec): Promise<string | null> {
  if (!spec.series || spec.series.length === 0) return null;
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    const sharp = (await import("sharp")).default;
    const svg = buildChartSvg(spec);
    const hash = crypto
      .createHash("sha1")
      .update(svg)
      .digest("hex")
      .slice(0, 12);
    const filename = `evidence-${spec.kind}-${hash}.png`;
    const out = path.join(OUTPUT_DIR, filename);
    await sharp(Buffer.from(svg))
      .resize(spec.width ?? DEFAULT_WIDTH, spec.height ?? DEFAULT_HEIGHT, { fit: "contain" })
      .png({ quality: 92 })
      .toFile(out);
    return out;
  } catch (err: any) {
    console.warn(`[EvidenceChartRenderer] Failed: ${err?.message || err}`);
    return null;
  }
}
