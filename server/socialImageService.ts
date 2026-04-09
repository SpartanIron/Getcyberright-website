import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const SOCIAL_IMAGES_DIR = path.join(process.cwd(), ".local", "social-images");

const PLATFORM_DIMENSIONS: Record<string, { width: number; height: number }> = {
  facebook: { width: 1200, height: 630 },
  linkedin: { width: 1200, height: 627 },
  instagram: { width: 1080, height: 1080 },
  x: { width: 1200, height: 675 },
  alert: { width: 1200, height: 630 },
};

const BRAND = {
  ink: "#0A0F1A",
  deepInk: "#060911",
  surface: "#111827",
  surfaceLight: "#1F2937",
  white: "#FFFFFF",
  offWhite: "#F1F5F9",
  silver: "#94A3B8",
  slate: "#64748B",
  muted: "#334155",
  teal: "#00D4AA",
  tealDark: "#00A88A",
};

interface TopicConfig {
  accent: string;
}

const TOPIC_CONFIG: Record<string, TopicConfig> = {
  phishing: { accent: "#FF6B35" },
  scam: { accent: "#FF6B35" },
  identity_theft: { accent: "#00D4AA" },
  privacy: { accent: "#00D4AA" },
  password: { accent: "#FBBF24" },
  malware: { accent: "#EF4444" },
  data_breach: { accent: "#EF4444" },
  default: { accent: "#00D4AA" },
};

function ensureDir() {
  if (!fs.existsSync(SOCIAL_IMAGES_DIR)) {
    fs.mkdirSync(SOCIAL_IMAGES_DIR, { recursive: true });
  }
}

function detectTopic(title: string, contentType: string): string {
  const lower = (title + " " + contentType).toLowerCase();
  if (lower.includes("phish")) return "phishing";
  if (lower.includes("scam") || lower.includes("fraud")) return "scam";
  if (lower.includes("identity") || lower.includes("theft")) return "identity_theft";
  if (lower.includes("privacy") || lower.includes("data protection")) return "privacy";
  if (lower.includes("password") || lower.includes("credential")) return "password";
  if (lower.includes("malware") || lower.includes("virus") || lower.includes("ransomware")) return "malware";
  if (lower.includes("breach") || lower.includes("leak")) return "data_breach";
  return "default";
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const w = word.length > maxChars ? word.slice(0, maxChars - 1) + "." : word;
    if (current && (current + " " + w).length > maxChars) {
      lines.push(current);
      current = w;
    } else {
      current = current ? current + " " + w : w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

function buildShieldMesh(w: number, h: number, accent: string, opacity: number): string {
  const lines: string[] = [];
  const size = 60;
  const cols = Math.ceil(w / size) + 1;
  const rows = Math.ceil(h / size) + 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * size;
      const y = row * size;
      const dist = Math.sqrt(Math.pow(x - w * 0.8, 2) + Math.pow(y - h * 0.3, 2));
      const maxDist = Math.sqrt(w * w + h * h);
      const localOpacity = opacity * Math.max(0, 1 - dist / (maxDist * 0.5));
      if (localOpacity > 0.003) {
        lines.push(`<polygon points="${x},${y - size * 0.3} ${x + size * 0.5},${y} ${x + size * 0.5},${y + size * 0.4} ${x},${y + size * 0.7} ${x - size * 0.5},${y + size * 0.4} ${x - size * 0.5},${y}" fill="none" stroke="${accent}" stroke-width="0.5" opacity="${localOpacity.toFixed(4)}"/>`);
      }
    }
  }
  return lines.join("\n  ");
}

function buildLandscapeSvg(
  width: number,
  height: number,
  title: string,
  topic: TopicConfig,
  badgeLabel?: string,
  badgeColor?: string,
  contentType?: string
): string {
  const titleLines = wrapText(title, 28);
  const fontSize = titleLines.length > 3 ? 40 : titleLines.length > 2 ? 46 : 52;
  const lineHeight = fontSize * 1.3;
  const contentArea = width - 80;
  const padX = 80;

  if (titleLines.length > 4) {
    titleLines.length = 4;
    titleLines[3] = titleLines[3].slice(0, -3) + "...";
  }

  const totalTextHeight = Math.min(titleLines.length, 4) * lineHeight;
  const badgeHeight = badgeLabel ? 50 : 0;
  const blockHeight = badgeHeight + totalTextHeight;
  const headlineStartY = (height - blockHeight) / 2 + badgeHeight;

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight + fontSize * 0.85;
    headlineSvg += `<text x="${padX}" y="${y}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="${BRAND.white}" letter-spacing="-1">${escapeXml(titleLines[lineIdx])}</text>`;
  }

  let badgeSvg = "";
  if (badgeLabel && badgeColor) {
    const pillW = badgeLabel.length * 8.5 + 32;
    const pillY = headlineStartY - 38;
    badgeSvg = `
    <rect x="${padX}" y="${pillY}" width="${pillW}" height="26" rx="4" fill="${badgeColor}" opacity="0.15"/>
    <rect x="${padX}" y="${pillY}" width="${pillW}" height="26" rx="4" fill="none" stroke="${badgeColor}" stroke-width="1.5" opacity="0.6"/>
    <circle cx="${padX + 14}" cy="${pillY + 13}" r="4" fill="${badgeColor}"/>
    <text x="${padX + 26}" y="${pillY + 17.5}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="11.5" font-weight="700" fill="${badgeColor}" letter-spacing="1.5">${escapeXml(badgeLabel)}</text>`;
  }

  const isGuide = contentType === "guide" || contentType === "tip" || contentType === "series";
  const categoryLabel = isGuide ? "GUIDE" : "SECURITY ALERT";
  const categoryColor = isGuide ? BRAND.teal : topic.accent;

  const accentRgb = hexToRgb(topic.accent);
  const shieldMesh = buildShieldMesh(width, height, topic.accent, 0.06);

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${BRAND.surface}"/>
      <stop offset="100%" stop-color="${BRAND.ink}"/>
    </linearGradient>
    <linearGradient id="accentGlow" x1="0.7" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.12)"/>
      <stop offset="60%" stop-color="rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.03)"/>
      <stop offset="100%" stop-color="rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0)"/>
    </linearGradient>
    <linearGradient id="topBar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${topic.accent}"/>
      <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0.4"/>
    </linearGradient>
    <clipPath id="clip"><rect width="${width}" height="${height}"/></clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#accentGlow)"/>

  <g clip-path="url(#clip)" opacity="1">
    ${shieldMesh}
  </g>

  <rect x="0" y="0" width="${width}" height="4" fill="url(#topBar)"/>

  <text x="${padX}" y="48" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="13" font-weight="600" fill="${BRAND.slate}" letter-spacing="3">${escapeXml(categoryLabel)}</text>

  <text x="${padX}" y="${height - 28}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="18" font-weight="600" fill="${BRAND.white}" opacity="0.9">GetCyberRight</text>
  <line x1="${padX + 150}" y1="${height - 42}" x2="${padX + 150}" y2="${height - 22}" stroke="${BRAND.muted}" stroke-width="1"/>
  <text x="${padX + 166}" y="${height - 28}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="13" fill="${BRAND.slate}">Protecting Families in the Digital World</text>

  <rect x="${width - 140}" y="${height - 48}" width="80" height="3" rx="1.5" fill="${topic.accent}" opacity="0.5"/>

  ${badgeSvg}
  ${headlineSvg}
</svg>`;
}

function buildSquareSvg(
  width: number,
  height: number,
  title: string,
  topic: TopicConfig,
  badgeLabel?: string,
  badgeColor?: string,
  contentType?: string
): string {
  const titleLines = wrapText(title, 16);
  const fontSize = titleLines.length > 4 ? 46 : titleLines.length > 3 ? 52 : 60;
  const lineHeight = fontSize * 1.3;
  const padX = 60;

  if (titleLines.length > 5) {
    titleLines.length = 5;
    titleLines[4] = titleLines[4].slice(0, -3) + "...";
  }

  const totalTextHeight = Math.min(titleLines.length, 5) * lineHeight;
  const badgeHeight = badgeLabel ? 50 : 0;
  const blockHeight = badgeHeight + totalTextHeight;
  const headlineStartY = (height - blockHeight) / 2 + badgeHeight + 20;

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight + fontSize * 0.85;
    headlineSvg += `<text x="${padX}" y="${y}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="${fontSize}" font-weight="700" fill="${BRAND.white}" letter-spacing="-1">${escapeXml(titleLines[lineIdx])}</text>`;
  }

  let badgeSvg = "";
  if (badgeLabel && badgeColor) {
    const pillW = badgeLabel.length * 8.5 + 32;
    const pillY = headlineStartY - 38;
    badgeSvg = `
    <rect x="${padX}" y="${pillY}" width="${pillW}" height="26" rx="4" fill="${badgeColor}" opacity="0.15"/>
    <rect x="${padX}" y="${pillY}" width="${pillW}" height="26" rx="4" fill="none" stroke="${badgeColor}" stroke-width="1.5" opacity="0.6"/>
    <circle cx="${padX + 14}" cy="${pillY + 13}" r="4" fill="${badgeColor}"/>
    <text x="${padX + 26}" y="${pillY + 17.5}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="11.5" font-weight="700" fill="${badgeColor}" letter-spacing="1.5">${escapeXml(badgeLabel)}</text>`;
  }

  const isGuide = contentType === "guide" || contentType === "tip" || contentType === "series";
  const categoryLabel = isGuide ? "GUIDE" : "SECURITY ALERT";

  const accentRgb = hexToRgb(topic.accent);
  const shieldMesh = buildShieldMesh(width, height, topic.accent, 0.05);

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="${BRAND.surface}"/>
      <stop offset="100%" stop-color="${BRAND.ink}"/>
    </linearGradient>
    <linearGradient id="accentGlow" x1="0.7" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.1)"/>
      <stop offset="60%" stop-color="rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.02)"/>
      <stop offset="100%" stop-color="rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0)"/>
    </linearGradient>
    <clipPath id="clip"><rect width="${width}" height="${height}"/></clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#accentGlow)"/>

  <g clip-path="url(#clip)" opacity="1">
    ${shieldMesh}
  </g>

  <rect x="0" y="0" width="${width}" height="5" fill="${topic.accent}"/>

  <text x="${padX}" y="65" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="13" font-weight="600" fill="${BRAND.slate}" letter-spacing="3">${escapeXml(categoryLabel)}</text>
  <text x="${padX}" y="95" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="20" font-weight="600" fill="${BRAND.white}" opacity="0.9">GetCyberRight</text>

  ${badgeSvg}
  ${headlineSvg}

  <line x1="${padX}" y1="${height - 75}" x2="${width - 60}" y2="${height - 75}" stroke="${BRAND.muted}" stroke-width="0.5" opacity="0.5"/>
  <text x="${padX}" y="${height - 40}" font-family="'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif" font-size="14" fill="${BRAND.slate}">getcyberright.com</text>
  <rect x="${width - 120}" y="${height - 55}" width="60" height="3" rx="1.5" fill="${topic.accent}" opacity="0.5"/>
</svg>`;
}

const SEVERITY_COLORS: Record<string, { accent: string; badge: string; label: string }> = {
  critical: { accent: "#EF4444", badge: "#EF4444", label: "CRITICAL" },
  high: { accent: "#F97316", badge: "#F97316", label: "HIGH RISK" },
  medium: { accent: "#FBBF24", badge: "#FBBF24", label: "MODERATE" },
  low: { accent: "#00D4AA", badge: "#00D4AA", label: "LOW RISK" },
  info: { accent: "#38BDF8", badge: "#38BDF8", label: "ADVISORY" },
};

function getSeverityOverrides(severity?: string): Partial<TopicConfig> & { badge?: string; badgeLabel?: string } {
  if (!severity) return {};
  const sev = SEVERITY_COLORS[severity.toLowerCase()];
  if (!sev) return {};
  return { accent: sev.accent, badge: sev.badge, badgeLabel: sev.label };
}

export async function generateBrandedImage(
  title: string,
  contentType: string,
  platform: string,
  severity?: string
): Promise<string | null> {
  try {
    ensureDir();

    const cleanTitle = title.replace(/\[.*?\]\s*/g, "").trim();
    const dims = PLATFORM_DIMENSIONS[platform] || PLATFORM_DIMENSIONS.facebook;
    const topic = detectTopic(cleanTitle, contentType);
    const baseConfig = TOPIC_CONFIG[topic] || TOPIC_CONFIG.default;
    const severityOverrides = getSeverityOverrides(severity);
    const config = { ...baseConfig, ...(severityOverrides.accent ? { accent: severityOverrides.accent } : {}) };
    const isSquare = platform === "instagram";

    const svg = isSquare
      ? buildSquareSvg(dims.width, dims.height, cleanTitle, config, severityOverrides.badgeLabel, severityOverrides.badge, contentType)
      : buildLandscapeSvg(dims.width, dims.height, cleanTitle, config, severityOverrides.badgeLabel, severityOverrides.badge, contentType);

    const hash = crypto.createHash("md5").update(title + platform + (severity || "") + "v7").digest("hex").substring(0, 12);
    const filename = `social-${platform}-${hash}.jpeg`;
    const filepath = path.join(SOCIAL_IMAGES_DIR, filename);

    await sharp(Buffer.from(svg)).resize(dims.width, dims.height).jpeg({ quality: 92 }).toFile(filepath);

    return filepath;
  } catch (error: any) {
    console.error(`[SocialImage] Failed to generate image for ${platform}:`, error.message);
    return null;
  }
}

export async function resizeImageForPlatform(
  inputPath: string,
  platform: string
): Promise<string | null> {
  try {
    ensureDir();
    const dims = PLATFORM_DIMENSIONS[platform] || PLATFORM_DIMENSIONS.facebook;
    const ext = path.extname(inputPath);
    const base = path.basename(inputPath, ext);
    const outputPath = path.join(SOCIAL_IMAGES_DIR, `${base}-${platform}.jpeg`);

    await sharp(inputPath)
      .resize(dims.width, dims.height, { fit: "cover", position: "center" })
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    return outputPath;
  } catch (error: any) {
    console.error(`[SocialImage] Failed to resize image for ${platform}:`, error.message);
    return null;
  }
}

export async function generateImagesForAllPlatforms(
  title: string,
  contentType: string,
  platforms: string[] = ["facebook", "linkedin", "x", "instagram", "alert"]
): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  for (const platform of platforms) {
    const imagePath = await generateBrandedImage(title, contentType, platform);
    if (imagePath) {
      results[platform] = imagePath;
    }
  }

  return results;
}

export function getImageAsBase64(filepath: string): string | null {
  try {
    if (!fs.existsSync(filepath)) return null;
    const buffer = fs.readFileSync(filepath);
    const ext = path.extname(filepath).toLowerCase();
    const mime = ext === ".jpeg" || ext === ".jpg" ? "image/jpeg" : ext === ".png" ? "image/png" : "image/webp";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export function serveImagePath(filepath: string): string {
  return `/api/social-images/${path.basename(filepath)}`;
}
