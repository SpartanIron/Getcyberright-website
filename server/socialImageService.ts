import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

const SOCIAL_IMAGES_DIR = path.join(process.cwd(), ".local", "social-images");
const LOGO_PATH = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");

const PLATFORM_DIMENSIONS: Record<string, { width: number; height: number }> = {
  facebook: { width: 1200, height: 630 },
  linkedin: { width: 1200, height: 627 },
  instagram: { width: 1080, height: 1080 },
  x: { width: 1200, height: 675 },
  alert: { width: 1200, height: 630 },
};

const BRAND = {
  darkTeal: "#0A2A3C",
  deepTeal: "#00293C",
  navDark: "#071A24",
  footerDark: "#081C26",
  orange: "#E8612D",
  orangeLight: "#F28C5A",
  tealAccent: "#1A8A8A",
  white: "#FFFFFF",
  lightGray: "#C8D8E4",
  mutedGray: "#7A96A8",
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
    accent: "#E8612D",
    iconPath: `<path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18l7 3.5v7.64l-7 3.5-7-3.5V7.68l7-3.5zM12 8a1 1 0 00-1 1v4a1 1 0 002 0V9a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" fill="#E8612D"/>`,
    tips: ["Verify the sender before clicking", "Check URLs for misspellings", "Never share passwords via email"],
    stat: "3.4B",
    statLabel: "fake emails sent daily",
  },
  scam: {
    accent: "#E8612D",
    iconPath: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.47-3.07 8.67-7 9.82-3.93-1.15-7-5.35-7-9.82V6.3l7-3.12zM11 7v6h2V7h-2zm0 8v2h2v-2h-2z" fill="#E8612D"/>`,
    tips: ["If it sounds too good, question it", "Research before you pay", "Trust your instincts on pressure tactics"],
    stat: "$20.9B",
    statLabel: "lost to cybercrime annually",
  },
  identity_theft: {
    accent: "#4ECDC4",
    iconPath: `<path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zM12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4zm-5.87 4c.36-.62 3.07-2 5.87-2s5.51 1.38 5.87 2H6.13z" fill="#4ECDC4"/><path d="M20 10h-2V8a1 1 0 00-2 0v2h-2a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2z" fill="#4ECDC4" opacity="0.6"/>`,
    tips: ["Freeze your credit with all 3 bureaus", "Use unique passwords everywhere", "Monitor bank statements weekly"],
    stat: "1M+",
    statLabel: "cybercrime complaints filed annually",
  },
  privacy: {
    accent: "#4ECDC4",
    iconPath: `<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="#4ECDC4"/>`,
    tips: ["Review app permissions regularly", "Use privacy-focused browsers", "Limit what you share online"],
    stat: "80%",
    statLabel: "of breaches involve personal data",
  },
  password: {
    accent: "#F7B731",
    iconPath: `<path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" fill="#F7B731"/>`,
    tips: ["Use 16+ character passphrases", "Enable two-factor authentication", "Use a password manager"],
    stat: "81%",
    statLabel: "of breaches use weak passwords",
  },
  malware: {
    accent: "#FF6B6B",
    iconPath: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#FF6B6B" opacity="0"/><path d="M19.07 4.93l-1.41 1.41A8.014 8.014 0 0020 12c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c2.08 0 3.97.81 5.41 2.09l1.41-1.41A9.969 9.969 0 0012 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-2.76-1.12-5.26-2.93-7.07z" fill="#FF6B6B"/><path d="M12 8a1 1 0 00-1 1v4a1 1 0 002 0V9a1 1 0 00-1-1zm0 8a1 1 0 100-2 1 1 0 000 2z" fill="#FF6B6B"/>`,
    tips: ["Keep your software updated", "Only download from trusted sources", "Use built-in security tools"],
    stat: "560K",
    statLabel: "new threats detected daily",
  },
  data_breach: {
    accent: "#FF6B6B",
    iconPath: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.47-3.07 8.67-7 9.82-3.93-1.15-7-5.35-7-9.82V6.3l7-3.12z" fill="#FF6B6B"/><path d="M10 14.5l-3.5-3.5 1.41-1.41L10 11.67l5.59-5.59L17 7.5l-7 7z" fill="#FF6B6B" opacity="0.5"/>`,
    tips: ["Check if your data has been exposed", "Change passwords immediately", "Watch for unusual account activity"],
    stat: "4,100+",
    statLabel: "data breaches disclosed annually",
  },
  default: {
    accent: "#E8612D",
    iconPath: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.47-3.07 8.67-7 9.82-3.93-1.15-7-5.35-7-9.82V6.3l7-3.12z" fill="#E8612D"/>`,
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
  topic: TopicConfig
): string {
  const uppercaseTitle = title.toUpperCase();
  const titleLines = wrapText(uppercaseTitle, 24);
  const fontSize = titleLines.length > 3 ? 42 : titleLines.length > 2 ? 48 : 54;
  const lineHeight = fontSize * 1.35;
  const totalTextHeight = Math.min(titleLines.length, 4) * lineHeight;
  const padX = 70;
  const headlineStartY = height - 90 - totalTextHeight;

  if (titleLines.length > 4) {
    titleLines.length = 4;
    titleLines[3] = titleLines[3].slice(0, -3) + "...";
  }

  const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "SUSPENDS", "BLOCKS", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT", "DATA", "SECURITY", "PRIVACY", "THREAT", "CYBER", "NEW", "MAJOR"];

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight + fontSize;
    const words = titleLines[lineIdx].split(" ");
    const tspans = words.map(w => {
      const isAccent = importantTerms.some(t => w.includes(t));
      return isAccent
        ? `<tspan fill="${topic.accent}" font-weight="900">${escapeXml(w)}</tspan>`
        : `<tspan>${escapeXml(w)}</tspan>`;
    }).join(" ");
    headlineSvg += `<text x="${padX}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="900" fill="${BRAND.white}" letter-spacing="1" word-spacing="8">${tspans}</text>`;
  }

  const gridLines: string[] = [];
  for (let i = 0; i < 12; i++) {
    gridLines.push(`<line x1="${100 + i * 100}" y1="0" x2="${100 + i * 100}" y2="${height}" stroke="${topic.accent}" stroke-width="0.5" opacity="0.05"/>`);
  }
  for (let i = 0; i < 7; i++) {
    gridLines.push(`<line x1="0" y1="${i * 100}" x2="${width}" y2="${i * 100}" stroke="${topic.accent}" stroke-width="0.5" opacity="0.05"/>`);
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stop-color="${BRAND.darkTeal}"/>
      <stop offset="100%" stop-color="#050E14"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="30%" r="60%">
      <stop offset="0%" stop-color="${topic.accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  ${gridLines.join("\n  ")}

  <circle cx="${width - 200}" cy="180" r="180" fill="none" stroke="${topic.accent}" stroke-width="1" opacity="0.06"/>
  <circle cx="${width - 200}" cy="180" r="120" fill="none" stroke="${topic.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="${width - 200}" cy="180" r="60" fill="${topic.accent}" opacity="0.03"/>

  <text x="${padX}" y="55" font-family="'Segoe UI',Arial,sans-serif" font-size="24" font-weight="700" fill="${BRAND.white}" letter-spacing="1" opacity="0.95">GetCyberRight</text>

  ${headlineSvg}

  <text x="${padX}" y="${height - 25}" font-family="'Segoe UI',Arial,sans-serif" font-size="14" fill="${BRAND.mutedGray}" opacity="0.8">getcyberright.com  |  Protecting Families in the Digital World</text>
</svg>`;
}

function buildSeverityBadgeSvg(
  width: number,
  badgeColor: string,
  badgeLabel: string
): string {
  const textWidth = badgeLabel.length * 10 + 24;
  const badgeX = width - textWidth - 20;
  return `<rect x="${badgeX}" y="12" width="${textWidth}" height="30" rx="4" fill="${badgeColor}"/>
  <text x="${badgeX + textWidth / 2}" y="33" font-family="'Segoe UI',Arial,sans-serif" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle" letter-spacing="1.5">${badgeLabel}</text>`;
}

function buildSquareSvg(
  width: number,
  height: number,
  title: string,
  topic: TopicConfig
): string {
  const uppercaseTitle = title.toUpperCase();
  const titleLines = wrapText(uppercaseTitle, 16);
  const fontSize = titleLines.length > 4 ? 48 : titleLines.length > 3 ? 54 : 62;
  const lineHeight = fontSize * 1.35;
  const totalTextHeight = Math.min(titleLines.length, 5) * lineHeight;
  const padX = 50;
  const headlineStartY = height - 120 - totalTextHeight;

  if (titleLines.length > 5) {
    titleLines.length = 5;
    titleLines[4] = titleLines[4].slice(0, -3) + "...";
  }

  const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "SUSPENDS", "BLOCKS", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT", "DATA", "SECURITY", "PRIVACY", "THREAT", "CYBER", "NEW", "MAJOR"];

  let headlineSvg = "";
  for (let lineIdx = 0; lineIdx < titleLines.length; lineIdx++) {
    const y = headlineStartY + lineIdx * lineHeight + fontSize;
    const words = titleLines[lineIdx].split(" ");
    const tspans = words.map(w => {
      const isAccent = importantTerms.some(t => w.includes(t));
      return isAccent
        ? `<tspan fill="${topic.accent}" font-weight="900">${escapeXml(w)}</tspan>`
        : `<tspan>${escapeXml(w)}</tspan>`;
    }).join(" ");
    headlineSvg += `<text x="${padX}" y="${y}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="900" fill="${BRAND.white}" letter-spacing="1" word-spacing="8">${tspans}</text>`;
  }

  const gridLines: string[] = [];
  for (let i = 0; i < 11; i++) {
    const pos = 100 + i * 100;
    gridLines.push(`<line x1="${pos}" y1="0" x2="${pos}" y2="${height}" stroke="${topic.accent}" stroke-width="0.5" opacity="0.04"/>`);
    gridLines.push(`<line x1="0" y1="${pos}" x2="${width}" y2="${pos}" stroke="${topic.accent}" stroke-width="0.5" opacity="0.04"/>`);
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stop-color="${BRAND.darkTeal}"/>
      <stop offset="100%" stop-color="#050E14"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="25%" r="55%">
      <stop offset="0%" stop-color="${topic.accent}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${topic.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  ${gridLines.join("\n  ")}

  <circle cx="${width - 150}" cy="250" r="200" fill="none" stroke="${topic.accent}" stroke-width="1" opacity="0.06"/>
  <circle cx="${width - 150}" cy="250" r="130" fill="none" stroke="${topic.accent}" stroke-width="0.8" opacity="0.04"/>
  <circle cx="${width - 150}" cy="250" r="60" fill="${topic.accent}" opacity="0.03"/>

  <text x="${padX}" y="60" font-family="'Segoe UI',Arial,sans-serif" font-size="26" font-weight="700" fill="${BRAND.white}" letter-spacing="1" opacity="0.95">GetCyberRight</text>

  ${headlineSvg}

  <text x="${padX}" y="${height - 40}" font-family="'Segoe UI',Arial,sans-serif" font-size="15" fill="${BRAND.mutedGray}" opacity="0.8">getcyberright.com</text>
</svg>`;
}

async function getLogoPngBuffer(size: number): Promise<Buffer | null> {
  try {
    if (!fs.existsSync(LOGO_PATH)) {
      console.warn("[SocialImage] Logo file not found at", LOGO_PATH);
      return null;
    }
    return await sharp(LOGO_PATH)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  } catch (err: any) {
    console.warn("[SocialImage] Failed to load logo:", err.message);
    return null;
  }
}

const SEVERITY_COLORS: Record<string, { accent: string; badge: string; label: string }> = {
  critical: { accent: "#FF2D2D", badge: "#FF2D2D", label: "CRITICAL" },
  high: { accent: "#FF6B35", badge: "#FF6B35", label: "HIGH RISK" },
  medium: { accent: "#F7B731", badge: "#F7B731", label: "MODERATE" },
  low: { accent: "#4ECDC4", badge: "#4ECDC4", label: "LOW RISK" },
  info: { accent: "#1A8A8A", badge: "#1A8A8A", label: "ADVISORY" },
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

    let svg = isSquare
      ? buildSquareSvg(dims.width, dims.height, cleanTitle, config)
      : buildLandscapeSvg(dims.width, dims.height, cleanTitle, config);

    if (severityOverrides.badge && severityOverrides.badgeLabel) {
      const badgeSvg = buildSeverityBadgeSvg(dims.width, severityOverrides.badge, severityOverrides.badgeLabel);
      svg = svg.replace("</svg>", `${badgeSvg}\n</svg>`);
    }

    const logoSize = isSquare ? 90 : 75;
    const logoBuffer = await getLogoPngBuffer(logoSize);

    const composites: sharp.OverlayOptions[] = [];
    if (logoBuffer) {
      if (isSquare) {
        composites.push({
          input: logoBuffer,
          top: 16,
          left: Math.round(dims.width / 2 - logoSize / 2),
        });
      } else {
        composites.push({
          input: logoBuffer,
          top: dims.height - 75,
          left: dims.width - 340,
        });
      }
    }

    const hash = crypto.createHash("md5").update(title + platform + (severity || "") + "v4").digest("hex").substring(0, 12);
    const filename = `social-${platform}-${hash}.jpeg`;
    const filepath = path.join(SOCIAL_IMAGES_DIR, filename);

    let pipeline = sharp(Buffer.from(svg)).resize(dims.width, dims.height);
    if (composites.length > 0) {
      pipeline = pipeline.composite(composites);
    }
    await pipeline.jpeg({ quality: 90 }).toFile(filepath);

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
