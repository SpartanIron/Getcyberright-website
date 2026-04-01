import sharp from "sharp";
import * as path from "path";
import * as fs from "fs";

const SOCIAL_IMAGES_DIR = path.join(process.cwd(), ".local", "social-images");

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > maxCharsPerLine && current.length > 0) {
      lines.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const ACCENT_TERMS = [
  "BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE",
  "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY",
  "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "MILLION", "BILLION",
  "COMPROMISED", "EMERGENCY", "URGENT", "THREAT", "RISK", "FLAW", "PATCH",
  "UPDATE", "BLOCKS", "BANS", "DANGEROUS", "INFECTED", "SPYWARE", "TROJAN",
  "BACKDOOR", "SUPPLY-CHAIN", "DATA", "PRIVACY", "SURVEILLANCE", "DEEPFAKE",
];

type TemplateStyle = "stat_card" | "tip_card" | "alert_card" | "insight_card" | "quote_card";

interface TemplateConfig {
  accent: string;
  categoryLabel: string;
  gradientOpacity: number;
}

const TEMPLATES: Record<TemplateStyle, TemplateConfig> = {
  alert_card:   { accent: "#EF4444", categoryLabel: "SECURITY ALERT",  gradientOpacity: 0.85 },
  stat_card:    { accent: "#F97316", categoryLabel: "CYBER NEWS",      gradientOpacity: 0.82 },
  tip_card:     { accent: "#10B981", categoryLabel: "CYBER TIP",       gradientOpacity: 0.82 },
  insight_card: { accent: "#3B82F6", categoryLabel: "INSIGHT",         gradientOpacity: 0.82 },
  quote_card:   { accent: "#8B5CF6", categoryLabel: "ANALYSIS",        gradientOpacity: 0.82 },
};

const CYBER_VISUAL_MAP: Record<string, string> = {
  "hack": "hacker computer dark room",
  "breach": "data breach cybersecurity",
  "ransomware": "ransomware attack locked computer",
  "phishing": "phishing email suspicious message",
  "malware": "malware virus computer code",
  "scam": "online scam fraud warning",
  "password": "password security login screen",
  "android": "android smartphone mobile security",
  "google": "google technology company office",
  "ai": "artificial intelligence technology robot",
  "deepfake": "deepfake artificial intelligence face",
  "supply chain": "supply chain software development",
  "router": "wifi router network security",
  "children": "children internet safety family",
  "family": "family using technology together",
};

function extractSearchQuery(title: string): string {
  const lowerTitle = title.toLowerCase();
  for (const [keyword, visualQuery] of Object.entries(CYBER_VISUAL_MAP)) {
    if (lowerTitle.includes(keyword)) return visualQuery;
  }
  return "cybersecurity technology";
}

async function fetchPexelsPhoto(query: string): Promise<Buffer | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const headers: Record<string, string> = { "Accept": "*/*" };
    const pexelsKey = process.env.PEXELS_API_KEY;
    if (pexelsKey) headers["Authorization"] = pexelsKey;
    else headers["User-Agent"] = "curl/8.0";

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&size=large`,
      { signal: controller.signal, headers }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`Pexels returned ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.photos?.length) return null;

    const validPhotos = data.photos.filter((p: any) => (p.width || 0) >= 1200);
    const pool = validPhotos.length > 0 ? validPhotos : data.photos;
    const photo = pool[0];
    const photoUrl = photo.src.original || photo.src.large2x;
    console.log(`Pexels: "${photo.alt}" by ${photo.photographer} (${photo.width}x${photo.height})`);

    const imgController = new AbortController();
    const imgTimeout = setTimeout(() => imgController.abort(), 15000);
    const imgResponse = await fetch(photoUrl, {
      signal: imgController.signal,
      headers: { "User-Agent": "curl/8.0" },
    });
    clearTimeout(imgTimeout);

    if (!imgResponse.ok) return null;
    return Buffer.from(await imgResponse.arrayBuffer());
  } catch (err: any) {
    console.warn(`Pexels fetch failed: ${err.message}`);
    return null;
  }
}

async function createTestCard(
  photoBuffer: Buffer,
  headline: string,
  subtext: string,
  style: TemplateStyle,
  width: number,
  height: number,
  outputName: string,
): Promise<void> {
  const isSquare = width === height;
  const tmpl = TEMPLATES[style];
  const fontFamily = "'Inter','DejaVu Sans',Arial,sans-serif";
  const cleanHeadline = headline.replace(/\[.*?\]\s*/g, "").trim();

  const logoPath = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");
  let logoBuffer: Buffer | null = null;
  const logoSize = isSquare ? 36 : 30;
  if (fs.existsSync(logoPath)) {
    logoBuffer = await sharp(logoPath)
      .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  const baseImage = await sharp(photoBuffer)
    .resize(width, height, { fit: "cover", position: "center" })
    .toBuffer();

  const uppercaseHeadline = cleanHeadline.toUpperCase();
  const maxChars = isSquare ? 18 : 32;
  let headlineLines = wrapText(uppercaseHeadline, maxChars);
  const maxLines = isSquare ? 5 : 3;
  if (headlineLines.length > maxLines) {
    headlineLines = headlineLines.slice(0, maxLines);
    headlineLines[maxLines - 1] = headlineLines[maxLines - 1].slice(0, -3) + "...";
  }

  const padX = isSquare ? 48 : 56;
  const padBottom = isSquare ? 48 : 40;
  const fontSize = isSquare
    ? (headlineLines.length > 3 ? 40 : headlineLines.length > 2 ? 46 : 52)
    : (headlineLines.length > 2 ? 36 : 42);
  const lineHeight = fontSize * 1.2;
  const categoryFontSize = isSquare ? 13 : 12;
  const subtextFontSize = isSquare ? 15 : 14;
  const brandFontSize = isSquare ? 14 : 13;

  const totalHeadlineH = headlineLines.length * lineHeight;
  const categoryH = categoryFontSize + 16;
  const subtextH = subtext ? subtextFontSize + 20 : 0;
  const brandH = brandFontSize + 8;
  const spacingBetween = 16;
  const contentH = categoryH + spacingBetween + totalHeadlineH + spacingBetween + subtextH + spacingBetween + brandH;
  const gradientH = Math.max(contentH + padBottom + 40, Math.round(height * 0.55));

  const gradientStartY = height - gradientH;
  const categoryY = height - padBottom - contentH + categoryFontSize;
  const headlineStartY = categoryY + categoryH + spacingBetween;

  let headlineSvg = "";
  for (let i = 0; i < headlineLines.length; i++) {
    const y = headlineStartY + i * lineHeight + fontSize * 0.85;
    const words = headlineLines[i].split(" ");
    const tspans = words.map(w => {
      const isAccent = ACCENT_TERMS.some(t => w.includes(t));
      return isAccent
        ? `<tspan fill="${tmpl.accent}" font-weight="800">${escapeXml(w)}</tspan>`
        : `<tspan>${escapeXml(w)}</tspan>`;
    }).join(" ");
    headlineSvg += `<text x="${padX}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="700" fill="white" letter-spacing="0.5">${tspans}</text>`;
  }

  const subtextY = headlineStartY + totalHeadlineH + spacingBetween + subtextFontSize;
  const subtextClean = subtext ? escapeXml(subtext.slice(0, 70)) : "";
  const brandY = height - padBottom;
  const accentLineY = brandY - brandFontSize - 16;
  const categoryBadgeW = tmpl.categoryLabel.length * (categoryFontSize * 0.65) + 24;

  const overlaySvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)" />
      <stop offset="${Math.round((gradientStartY / height) * 100)}%" stop-color="rgba(0,0,0,0)" />
      <stop offset="${Math.round(((gradientStartY + gradientH * 0.3) / height) * 100)}%" stop-color="rgba(10,15,28,${tmpl.gradientOpacity * 0.6})" />
      <stop offset="100%" stop-color="rgba(10,15,28,${tmpl.gradientOpacity})" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)" />
  <rect x="${padX}" y="${categoryY - categoryFontSize}" width="${categoryBadgeW}" height="${categoryFontSize + 10}" rx="3" fill="${tmpl.accent}" />
  <text x="${padX + categoryBadgeW / 2}" y="${categoryY}" text-anchor="middle" font-family="${fontFamily}" font-size="${categoryFontSize}" font-weight="700" fill="white" letter-spacing="2">${tmpl.categoryLabel}</text>
  ${headlineSvg}
  ${subtextClean ? `<text x="${padX}" y="${subtextY}" font-family="${fontFamily}" font-size="${subtextFontSize}" fill="rgba(255,255,255,0.7)" letter-spacing="0.3">${subtextClean}</text>` : ""}
  <rect x="${padX}" y="${accentLineY}" width="${width - padX * 2}" height="1" fill="rgba(255,255,255,0.15)" />
  <text x="${padX + (logoBuffer ? logoSize + 10 : 0)}" y="${brandY}" font-family="${fontFamily}" font-size="${brandFontSize}" font-weight="600" fill="rgba(255,255,255,0.9)" letter-spacing="1.5">GETCYBERRIGHT</text>
  <text x="${width - padX}" y="${brandY}" text-anchor="end" font-family="${fontFamily}" font-size="${Math.round(brandFontSize * 0.85)}" fill="rgba(255,255,255,0.5)">getcyberright.com</text>
</svg>`;

  const overlayBuffer = await sharp(Buffer.from(overlaySvg)).png().toBuffer();

  const composites: sharp.OverlayOptions[] = [{ input: overlayBuffer, top: 0, left: 0 }];
  if (logoBuffer) {
    composites.push({ input: logoBuffer, top: Math.round(brandY - logoSize + 4), left: padX });
  }

  const outputPath = path.join(SOCIAL_IMAGES_DIR, outputName);
  await sharp(baseImage)
    .composite(composites)
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(outputPath);

  console.log(`Generated: ${outputName} (${width}x${height})`);
}

async function main() {
  const testCases = [
    {
      headline: "Hackers Breach Major Hospital Network",
      subtext: "Patient records of 2.3 million users exposed in ransomware attack",
      style: "alert_card" as TemplateStyle,
      query: "hacker computer dark room",
    },
    {
      headline: "5 Password Mistakes That Put Your Family At Risk",
      subtext: "Most families reuse the same password across 12+ accounts",
      style: "tip_card" as TemplateStyle,
      query: "family using technology together",
    },
    {
      headline: "AI Deepfakes Used In New Wave Of Financial Fraud",
      subtext: "Voice cloning attacks increased 400% this quarter",
      style: "insight_card" as TemplateStyle,
      query: "artificial intelligence technology",
    },
    {
      headline: "Google Chrome Zero-Day Exploit Found In The Wild",
      subtext: "Update your browser immediately to stay protected",
      style: "stat_card" as TemplateStyle,
      query: "google chrome web browser security",
    },
  ];

  for (const tc of testCases) {
    console.log(`\nFetching photo for: "${tc.query}"`);
    const photoBuffer = await fetchPexelsPhoto(tc.query);
    if (!photoBuffer) {
      console.log(`Skipping - no photo available`);
      continue;
    }

    const slug = tc.headline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 30);
    await createTestCard(photoBuffer, tc.headline, tc.subtext, tc.style, 1200, 630, `final-${slug}.jpeg`);
    await createTestCard(photoBuffer, tc.headline, tc.subtext, tc.style, 1080, 1080, `final-ig-${slug}.jpeg`);
  }

  console.log("\nDone!");
}

main().catch(console.error);
