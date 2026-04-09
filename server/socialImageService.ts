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
  navy: "#0B1929",
  deepNavy: "#060F1A",
  cardBg: "#101D2E",
  accentTeal: "#00C9A7",
  accentOrange: "#FF6B35",
  white: "#FFFFFF",
  offWhite: "#E8EDF2",
  lightGray: "#94A3B8",
  midGray: "#475569",
  borderSubtle: "#1E3048",
};

interface TopicConfig {
  accent: string;
  iconPath: string;
  tips: string[];
  stat: string;
  statLabel: string;
}

const TOPIC_CONFIG: Record<string, TopicConfig> = {
  phishing: {
    accent: "#FF6B35",
    iconPath: "",
    tips: ["Verify the sender before clicking", "Check URLs for misspellings", "Never share passwords via email"],
    stat: "3.4B",
    statLabel: "fake emails sent daily",
  },
  scam: {
    accent: "#FF6B35",
    iconPath: "",
    tips: ["If it sounds too good, question it", "Research before you pay", "Trust your instincts on pressure tactics"],
    stat: "$20.9B",
    statLabel: "lost to cybercrime annually",
  },
  identity_theft: {
    accent: "#00C9A7",
    iconPath: "",
    tips: ["Freeze your credit with all 3 bureaus", "Use unique passwords everywhere", "Monitor bank statements weekly"],
    stat: "1M+",
    statLabel: "cybercrime complaints filed annually",
  },
  privacy: {
    accent: "#00C9A7",
    iconPath: "",
    tips: ["Review app permissions regularly", "Use privacy-focused browsers", "Limit what you share online"],
    stat: "80%",
    statLabel: "of breaches involve personal data",
  },
  password: {
    accent: "#F59E0B",
    iconPath: "",
    tips: ["Use 16+ character passphrases", "Enable two-factor authentication", "Use a password manager"],
    stat: "81%",
    statLabel: "of breaches use weak passwords",
  },
  malware: {
    accent: "#EF4444",
    iconPath: "",
    tips: ["Keep your software updated", "Only download from trusted sources", "Use built-in security tools"],
    stat: "560K",
    statLabel: "new threats detected daily",
  },
  data_breach: {
    accent: "#EF4444",
    iconPath: "",
    tips: ["Check if your data has been exposed", "Change passwords immediately", "Watch for unusual account activity"],
    stat: "4,100+",
    statLabel: "data breaches disclosed annually",
  },
  default: {
    accent: "#00C9A7",
    iconPath: "",
    tips: ["Stay informed about new threats", "Talk to your family about safety", "Use strong, unique passwords"],
    stat: "2,200+",
    statLabel: "cyberattacks happen every day",
  },
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

function buildLandscapeSvg(
  width: number,
  height: number,
  title: string,
  topic: TopicConfig,
  badgeLabel?: string,
  badgeColor?: string
): string {
  const titleLines = wrapText(title, 30);
  const fontSize = titleLines.length > 3 ? 38 : titleLines.length > 2 ? 44 : 50;
  const lineHeight = fontSize * 1.4;
  const padX = 80;
  const accentBarWidth = 6;

  if (titleLines.length > 4) {
    titleLines.length = 4;
    titleLines[3] = titleLines[3].slice(0, -3) + "...";
  }

  const totalTextHeight = Math.min(titleLines.length, 4) * lineHeight;
  const headlineStartY = (height - totalTextHeight) / 2 - 10;

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight + fontSize;
    headlineSvg += `<text x="${padX}" y="${y}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="${fontSize}" font-weight="800" fill="${BRAND.white}" letter-spacing="-0.5">${escapeXml(titleLines[lineIdx])}</text>`;
  }

  let badgeSvg = "";
  if (badgeLabel && badgeColor) {
    const pillW = badgeLabel.length * 9.5 + 28;
    badgeSvg = `
    <rect x="${padX}" y="${headlineStartY - 40}" width="${pillW}" height="28" rx="14" fill="${badgeColor}"/>
    <text x="${padX + pillW / 2}" y="${headlineStartY - 22}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.2">${escapeXml(badgeLabel)}</text>`;
  }

  const bottomBarY = height - 56;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND.navy}"/>
      <stop offset="100%" stop-color="${BRAND.deepNavy}"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${topic.accent}"/>
      <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${topic.accent}" stop-opacity="0.06"/>
      <stop offset="50%" stop-color="${topic.accent}" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#shimmer)"/>

  <rect x="0" y="0" width="${accentBarWidth}" height="${height}" fill="url(#accentGrad)"/>

  <line x1="${padX}" y1="${bottomBarY}" x2="${width - 60}" y2="${bottomBarY}" stroke="${BRAND.borderSubtle}" stroke-width="1"/>

  <text x="${padX}" y="${bottomBarY + 32}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="14" font-weight="600" fill="${BRAND.lightGray}">GetCyberRight</text>
  <text x="${width - 60}" y="${bottomBarY + 32}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="13" fill="${BRAND.midGray}" text-anchor="end">getcyberright.com</text>

  <circle cx="${width - 120}" cy="160" r="220" fill="none" stroke="${topic.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="${width - 120}" cy="160" r="140" fill="none" stroke="${topic.accent}" stroke-width="0.6" opacity="0.03"/>

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
  badgeColor?: string
): string {
  const titleLines = wrapText(title, 18);
  const fontSize = titleLines.length > 4 ? 44 : titleLines.length > 3 ? 50 : 58;
  const lineHeight = fontSize * 1.4;
  const padX = 60;
  const accentBarHeight = 6;

  if (titleLines.length > 5) {
    titleLines.length = 5;
    titleLines[4] = titleLines[4].slice(0, -3) + "...";
  }

  const totalTextHeight = Math.min(titleLines.length, 5) * lineHeight;
  const headlineStartY = (height - totalTextHeight) / 2;

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight + fontSize;
    headlineSvg += `<text x="${padX}" y="${y}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="${fontSize}" font-weight="800" fill="${BRAND.white}" letter-spacing="-0.5">${escapeXml(titleLines[lineIdx])}</text>`;
  }

  let badgeSvg = "";
  if (badgeLabel && badgeColor) {
    const pillW = badgeLabel.length * 9.5 + 28;
    badgeSvg = `
    <rect x="${padX}" y="${headlineStartY - 20}" width="${pillW}" height="28" rx="14" fill="${badgeColor}"/>
    <text x="${padX + pillW / 2}" y="${headlineStartY - 2}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.2">${escapeXml(badgeLabel)}</text>`;
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${BRAND.navy}"/>
      <stop offset="100%" stop-color="${BRAND.deepNavy}"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${topic.accent}" stop-opacity="0.06"/>
      <stop offset="50%" stop-color="${topic.accent}" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#shimmer)"/>

  <rect x="0" y="0" width="${width}" height="${accentBarHeight}" fill="${topic.accent}"/>

  <text x="${padX}" y="60" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="22" font-weight="700" fill="${BRAND.lightGray}">GetCyberRight</text>

  <circle cx="${width - 100}" cy="200" r="240" fill="none" stroke="${topic.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="${width - 100}" cy="200" r="160" fill="none" stroke="${topic.accent}" stroke-width="0.6" opacity="0.03"/>

  ${badgeSvg}
  ${headlineSvg}

  <line x1="${padX}" y1="${height - 70}" x2="${width - 60}" y2="${height - 70}" stroke="${BRAND.borderSubtle}" stroke-width="1"/>
  <text x="${padX}" y="${height - 35}" font-family="'Inter','Segoe UI',Arial,sans-serif" font-size="14" fill="${BRAND.midGray}">getcyberright.com</text>
</svg>`;
}

const SEVERITY_COLORS: Record<string, { accent: string; badge: string; label: string }> = {
  critical: { accent: "#EF4444", badge: "#DC2626", label: "CRITICAL" },
  high: { accent: "#F97316", badge: "#EA580C", label: "HIGH RISK" },
  medium: { accent: "#F59E0B", badge: "#D97706", label: "MODERATE" },
  low: { accent: "#00C9A7", badge: "#059669", label: "LOW RISK" },
  info: { accent: "#0EA5E9", badge: "#0284C7", label: "ADVISORY" },
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
      ? buildSquareSvg(dims.width, dims.height, cleanTitle, config, severityOverrides.badgeLabel, severityOverrides.badge)
      : buildLandscapeSvg(dims.width, dims.height, cleanTitle, config, severityOverrides.badgeLabel, severityOverrides.badge);

    const hash = crypto.createHash("md5").update(title + platform + (severity || "") + "v6").digest("hex").substring(0, 12);
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
