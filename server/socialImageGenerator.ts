import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const IMAGES_DIR = path.join(process.cwd(), "dist", "social-images");

const CATEGORY_THEMES: Record<string, { accent: string; icon: string; bg: string }> = {
  "Data Breaches": { accent: "#EF4444", icon: "🔓", bg: "#1E1B2E" },
  "Phishing": { accent: "#F59E0B", icon: "🎣", bg: "#1E1B2E" },
  "Malware": { accent: "#EF4444", icon: "🦠", bg: "#1A1A2E" },
  "Ransomware": { accent: "#DC2626", icon: "🔒", bg: "#1A1A2E" },
  "Privacy": { accent: "#8B5CF6", icon: "🛡️", bg: "#1B1B30" },
  "Scams": { accent: "#F97316", icon: "⚠️", bg: "#1E1B2E" },
  "Family Safety": { accent: "#10B981", icon: "👨‍👩‍👧‍👦", bg: "#0F1B2D" },
  "Government": { accent: "#3B82F6", icon: "🏛️", bg: "#0F1B2D" },
  "Business": { accent: "#6366F1", icon: "🏢", bg: "#1A1A2E" },
  "Mobile Security": { accent: "#14B8A6", icon: "📱", bg: "#0F1B2D" },
  "IoT": { accent: "#06B6D4", icon: "🔌", bg: "#0F1B2D" },
  "AI & Security": { accent: "#A855F7", icon: "🤖", bg: "#1B1B30" },
  "default": { accent: "#14B8A6", icon: "🛡️", bg: "#0F172A" },
};

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const w = word.length > maxCharsPerLine ? word.slice(0, maxCharsPerLine - 1) + "." : word;
    if (current && (current + " " + w).length > maxCharsPerLine) {
      lines.push(current);
      current = w;
    } else {
      current = current ? current + " " + w : w;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 5);
}

function generateSvg(
  title: string,
  category: string,
  urgency: number,
  source: string
): string {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES["default"];
  const uppercaseTitle = title.toUpperCase();
  const titleLines = wrapText(uppercaseTitle, 18);

  if (titleLines.length > 5) {
    titleLines.length = 5;
    titleLines[4] = titleLines[4].slice(0, -3) + "...";
  }

  const urgencyLabel = urgency >= 4 ? "BREAKING" : urgency >= 3 ? "ALERT" : "NEWS";
  const urgencyColor = urgency >= 4 ? "#EF4444" : urgency >= 3 ? "#F59E0B" : theme.accent;

  const sourceDisplay = source
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/.*/g, "")
    .toUpperCase();

  const fontSize = titleLines.length > 4 ? 48 : titleLines.length > 3 ? 54 : 62;
  const lineHeight = fontSize * 1.2;
  const totalTextHeight = titleLines.length * lineHeight;
  const padX = 50;
  const headlineStartY = 1080 - 140 - totalTextHeight;

  const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "SUSPENDS", "BLOCKS", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT"];

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight;
    const words = titleLines[lineIdx].split(" ");
    const tspans = words.map(word => {
      const isImportant = importantTerms.some(t => word.includes(t));
      return isImportant
        ? `<tspan fill="${theme.accent}">${escapeXml(word)}</tspan>`
        : `<tspan>${escapeXml(word)}</tspan>`;
    }).join(" ");
    headlineSvg += `<text x="${padX}" y="${y}" font-family="'DejaVu Sans','Arial',Helvetica,sans-serif" font-size="${fontSize}" font-weight="bold" fill="white" letter-spacing="0.5">${tspans}</text>`;
  }

  const gridLines: string[] = [];
  for (let i = 0; i < 11; i++) {
    const pos = 100 + i * 100;
    gridLines.push(`<line x1="${pos}" y1="0" x2="${pos}" y2="1080" stroke="${theme.accent}" stroke-width="0.5" opacity="0.04"/>`);
    gridLines.push(`<line x1="0" y1="${pos}" x2="1080" y2="${pos}" stroke="${theme.accent}" stroke-width="0.5" opacity="0.04"/>`);
  }

  return `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${theme.bg}"/>
      <stop offset="100%" stop-color="#050A12"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="25%" r="55%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect width="1080" height="1080" fill="url(#glow)"/>

  ${gridLines.join("\n  ")}

  <circle cx="800" cy="280" r="200" fill="none" stroke="${theme.accent}" stroke-width="1" opacity="0.06"/>
  <circle cx="800" cy="280" r="130" fill="none" stroke="${theme.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="800" cy="280" r="60" fill="${theme.accent}" opacity="0.03"/>

  <rect x="${padX}" y="45" width="${urgencyLabel.length * 18 + 30}" height="36" rx="4" fill="${urgencyColor}"/>
  <text x="${padX + 15}" y="70" fill="white" font-family="'DejaVu Sans','Arial',sans-serif" font-size="18" font-weight="700" letter-spacing="2">${urgencyLabel}</text>

  <text x="${padX}" y="120" font-family="'DejaVu Sans',Arial,sans-serif" font-size="18" font-weight="700" fill="white" letter-spacing="2" opacity="0.9">GETCYBERRIGHT</text>

  ${headlineSvg}

  <text x="${padX}" y="1020" fill="#6B8FA3" font-family="'DejaVu Sans',Arial,sans-serif" font-size="14" opacity="0.7">Source: ${escapeXml(sourceDisplay)}</text>
  <text x="${padX}" y="1050" fill="#6B8FA3" font-family="'DejaVu Sans',Arial,sans-serif" font-size="15" opacity="0.8">getcyberright.com</text>
</svg>`;
}

export async function generateSocialImage(
  articleId: string,
  title: string,
  category: string,
  urgency: number,
  source: string
): Promise<string | null> {
  try {
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }

    const filename = `social-${articleId}.png`;
    const outputPath = path.join(IMAGES_DIR, filename);

    if (fs.existsSync(outputPath)) {
      return outputPath;
    }

    const cleanTitle = title.replace(/\[.*?\]\s*/g, "").trim();
    const svg = generateSvg(cleanTitle, category, urgency, source);

    await sharp(Buffer.from(svg))
      .png({ quality: 90, compressionLevel: 6 })
      .toFile(outputPath);

    const stats = fs.statSync(outputPath);
    console.log(`[SocialImage] Generated branded image for "${title}" (${Math.round(stats.size / 1024)}KB): ${outputPath}`);

    return outputPath;
  } catch (error: any) {
    console.error(`[SocialImage] Failed to generate image for "${title}":`, error.message);
    return null;
  }
}

export function getSocialImagePath(articleId: string): string | null {
  const filePath = path.join(IMAGES_DIR, `social-${articleId}.png`);
  return fs.existsSync(filePath) ? filePath : null;
}
