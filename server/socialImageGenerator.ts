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
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    if (currentLine.length + word.length + 1 > maxCharsPerLine) {
      if (currentLine) lines.push(currentLine.trim());
      currentLine = word;
    } else {
      currentLine += (currentLine ? " " : "") + word;
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  return lines.slice(0, 5);
}

function generateSvg(
  title: string,
  category: string,
  urgency: number,
  source: string
): string {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES["default"];
  const titleLines = wrapText(title, 30);
  const titleStartY = 340 - (titleLines.length * 48) / 2;

  const urgencyLabel = urgency >= 4 ? "BREAKING" : urgency >= 3 ? "ALERT" : "NEWS";
  const urgencyColor = urgency >= 4 ? "#EF4444" : urgency >= 3 ? "#F59E0B" : theme.accent;

  const sourceDisplay = source
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/.*/g, "")
    .toUpperCase();

  const titleTspans = titleLines
    .map((line, i) => `<tspan x="540" dy="${i === 0 ? 0 : 56}">${escapeXml(line)}</tspan>`)
    .join("\n        ");

  return `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bg}"/>
      <stop offset="100%" stop-color="#0A0A1A"/>
    </linearGradient>
    <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0"/>
      <stop offset="20%" stop-color="${theme.accent}"/>
      <stop offset="80%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottom-fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${theme.bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.08"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="20" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1080" height="1080" fill="url(#bg)"/>

  <rect y="880" width="1080" height="200" fill="url(#bottom-fade)"/>

  <circle cx="900" cy="180" r="300" fill="${theme.accent}" opacity="0.03"/>
  <circle cx="180" cy="900" r="250" fill="${theme.accent}" opacity="0.03"/>

  <rect x="60" y="120" width="960" height="3" fill="url(#accent-line)" rx="1.5"/>

  <rect x="60" y="160" width="${urgencyLabel.length * 20 + 40}" height="44" rx="6" fill="${urgencyColor}" opacity="0.15"/>
  <rect x="60" y="160" width="${urgencyLabel.length * 20 + 40}" height="44" rx="6" fill="none" stroke="${urgencyColor}" stroke-width="1.5" opacity="0.5"/>
  <text x="${80}" y="189" fill="${urgencyColor}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="20" font-weight="700" letter-spacing="3">${urgencyLabel}</text>

  <text x="540" y="${titleStartY}" fill="#FFFFFF" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="48" font-weight="800" text-anchor="middle" letter-spacing="-0.5">
        ${titleTspans}
  </text>

  <rect x="60" y="620" width="960" height="1.5" fill="url(#accent-line)" opacity="0.3"/>

  <text x="540" y="690" fill="${theme.accent}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="18" font-weight="600" text-anchor="middle" letter-spacing="2" opacity="0.8">SOURCE: ${escapeXml(sourceDisplay)}</text>

  <rect x="60" y="880" width="960" height="1" fill="url(#accent-line)" opacity="0.2"/>

  <text x="90" y="950" fill="#FFFFFF" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="32" font-weight="800" letter-spacing="1">
    <tspan fill="${theme.accent}">GCR</tspan> GetCyberRight
  </text>
  <text x="90" y="985" fill="#FFFFFF" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" opacity="0.5" letter-spacing="1">CYBERSECURITY FOR FAMILIES</text>

  <text x="990" y="955" fill="${theme.accent}" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="16" font-weight="500" text-anchor="end" opacity="0.7">getcyberright.com</text>

  <circle cx="540" cy="790" r="45" fill="${theme.accent}" opacity="0.08"/>
  <circle cx="540" cy="790" r="32" fill="none" stroke="${theme.accent}" stroke-width="1.5" opacity="0.3"/>
  <text x="540" y="800" font-size="32" text-anchor="middle">${theme.icon}</text>
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

    const svg = generateSvg(title, category, urgency, source);

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
