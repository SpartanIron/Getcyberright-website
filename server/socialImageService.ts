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
    stat: "$10.3B",
    statLabel: "lost to scams in 2023",
  },
  identity_theft: {
    accent: "#4ECDC4",
    iconPath: `<path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 2c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zM12 14c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4zm-5.87 4c.36-.62 3.07-2 5.87-2s5.51 1.38 5.87 2H6.13z" fill="#4ECDC4"/><path d="M20 10h-2V8a1 1 0 00-2 0v2h-2a1 1 0 000 2h2v2a1 1 0 002 0v-2h2a1 1 0 000-2z" fill="#4ECDC4" opacity="0.6"/>`,
    tips: ["Freeze your credit with all 3 bureaus", "Use unique passwords everywhere", "Monitor bank statements weekly"],
    stat: "1.4M",
    statLabel: "identity theft reports in 2023",
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
    statLabel: "data breaches disclosed in 2023",
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
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if ((current + " " + word).trim().length > maxChars) {
      lines.push(current.trim());
      current = word;
    } else {
      current = (current + " " + word).trim();
    }
  }
  if (current) lines.push(current.trim());
  return lines;
}

function buildLandscapeSvg(
  width: number,
  height: number,
  title: string,
  contentType: string,
  topic: TopicConfig
): string {
  const contentLabel = contentType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const truncTitle = title.length > 90 ? title.substring(0, 87) + "..." : title;
  const titleLines = wrapText(truncTitle, 32);
  const titleFontSize = 40;
  const titleStartY = 120;

  const titleSvg = titleLines.slice(0, 3).map((line, i) =>
    `<text x="80" y="${titleStartY + i * (titleFontSize + 10)}" fill="${BRAND.white}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${titleFontSize}" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join("\n    ");

  const tipStartY = titleStartY + titleLines.slice(0, 3).length * (titleFontSize + 10) + 30;
  const tipsSvg = topic.tips.slice(0, 3).map((tip, i) => {
    const y = tipStartY + i * 36;
    return `
    <circle cx="94" cy="${y - 5}" r="4" fill="${topic.accent}"/>
    <text x="110" y="${y}" fill="${BRAND.lightGray}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="18">${escapeXml(tip)}</text>`;
  }).join("");

  const statBoxX = width - 320;
  const statBoxY = 100;
  const statBoxW = 250;
  const statBoxH = 200;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND.darkTeal}"/>
      <stop offset="100%" style="stop-color:${BRAND.navDark}"/>
    </linearGradient>
    <linearGradient id="accent-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${topic.accent}"/>
      <stop offset="100%" style="stop-color:${topic.accent};stop-opacity:0.6"/>
    </linearGradient>
    <clipPath id="stat-clip">
      <rect x="${statBoxX}" y="${statBoxY}" width="${statBoxW}" height="${statBoxH}" rx="16"/>
    </clipPath>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <rect x="0" y="0" width="6" height="${height}" fill="${topic.accent}"/>
  <rect x="0" y="${height - 5}" width="${width}" height="5" fill="${topic.accent}"/>

  <circle cx="${width - 100}" cy="80" r="180" fill="${topic.accent}" opacity="0.04"/>
  <circle cx="${width - 50}" cy="${height - 60}" r="120" fill="${topic.accent}" opacity="0.03"/>
  <circle cx="200" cy="${height + 40}" r="160" fill="${topic.accent}" opacity="0.02"/>

  <rect x="80" y="50" width="10" height="10" rx="2" fill="${topic.accent}" opacity="0.3"/>
  <rect x="100" y="50" width="10" height="10" rx="2" fill="${topic.accent}" opacity="0.5"/>
  <rect x="120" y="50" width="10" height="10" rx="2" fill="${topic.accent}" opacity="0.7"/>

  <text x="142" y="60" fill="${topic.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="14" letter-spacing="2.5">${escapeXml(contentLabel.toUpperCase())}</text>

  <rect x="80" y="75" width="60" height="3" rx="1.5" fill="${topic.accent}" opacity="0.6"/>

    ${titleSvg}

    ${tipsSvg}

  <rect x="${statBoxX}" y="${statBoxY}" width="${statBoxW}" height="${statBoxH}" rx="16" fill="${BRAND.deepTeal}" stroke="${topic.accent}" stroke-width="1.5" stroke-opacity="0.3"/>
  <text x="${statBoxX + statBoxW / 2}" y="${statBoxY + 80}" text-anchor="middle" fill="${topic.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="52">${escapeXml(topic.stat)}</text>
  <text x="${statBoxX + statBoxW / 2}" y="${statBoxY + 115}" text-anchor="middle" fill="${BRAND.lightGray}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="14">${escapeXml(topic.statLabel)}</text>

  <g transform="translate(${statBoxX + statBoxW / 2 - 16}, ${statBoxY + 130}) scale(1.3)">
    ${topic.iconPath}
  </g>

  <rect x="${statBoxX}" y="${height - 170}" width="${statBoxW}" height="80" rx="12" fill="${BRAND.deepTeal}" stroke="${BRAND.tealAccent}" stroke-width="1" stroke-opacity="0.2"/>
  <text x="${statBoxX + statBoxW / 2}" y="${height - 135}" text-anchor="middle" fill="${BRAND.mutedGray}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="11" letter-spacing="1">POWERED BY</text>
  <text x="${statBoxX + statBoxW / 2}" y="${height - 110}" text-anchor="middle" fill="${BRAND.white}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="16">8 Threat Intelligence Feeds</text>

  <line x1="80" y1="${height - 65}" x2="${width * 0.55}" y2="${height - 65}" stroke="${BRAND.tealAccent}" stroke-width="1" stroke-opacity="0.2"/>
  <text x="80" y="${height - 35}" fill="${BRAND.white}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="20" opacity="0.9">GetCyberRight.com</text>
  <text x="310" y="${height - 35}" fill="${topic.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="14" opacity="0.7">Protecting Families in the Digital World</text>
</svg>`;
}

function buildSquareSvg(
  width: number,
  height: number,
  title: string,
  contentType: string,
  topic: TopicConfig
): string {
  const contentLabel = contentType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const truncTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;
  const titleLines = wrapText(truncTitle, 26);
  const titleFontSize = 38;
  const titleStartY = 200;

  const titleSvg = titleLines.slice(0, 3).map((line, i) =>
    `<text x="${width / 2}" y="${titleStartY + i * (titleFontSize + 10)}" text-anchor="middle" fill="${BRAND.white}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${titleFontSize}" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join("\n    ");

  const tipStartY = titleStartY + titleLines.slice(0, 3).length * (titleFontSize + 10) + 40;
  const tipBoxPad = 60;
  const tipsSvg = topic.tips.slice(0, 3).map((tip, i) => {
    const y = tipStartY + i * 50;
    return `
    <rect x="${tipBoxPad}" y="${y - 28}" width="${width - tipBoxPad * 2}" height="42" rx="8" fill="${BRAND.deepTeal}" stroke="${topic.accent}" stroke-width="1" stroke-opacity="0.15"/>
    <circle cx="${tipBoxPad + 24}" cy="${y - 7}" r="4" fill="${topic.accent}"/>
    <text x="${tipBoxPad + 40}" y="${y - 2}" fill="${BRAND.lightGray}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="17">${escapeXml(tip)}</text>`;
  }).join("");

  const statY = 120;

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND.darkTeal}"/>
      <stop offset="100%" style="stop-color:${BRAND.navDark}"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <rect x="0" y="0" width="${width}" height="6" fill="${topic.accent}"/>
  <rect x="0" y="${height - 6}" width="${width}" height="6" fill="${topic.accent}"/>

  <circle cx="${width - 60}" cy="60" r="140" fill="${topic.accent}" opacity="0.04"/>
  <circle cx="60" cy="${height - 60}" r="120" fill="${topic.accent}" opacity="0.03"/>

  <g transform="translate(${width / 2 - 16}, ${statY - 50}) scale(1.3)">
    ${topic.iconPath}
  </g>

  <rect x="${width / 2 - 60}" y="${statY - 10}" width="120" height="48" rx="24" fill="${topic.accent}" opacity="0.15"/>
  <text x="${width / 2}" y="${statY + 26}" text-anchor="middle" fill="${topic.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="28">${escapeXml(topic.stat)}</text>
  <text x="${width / 2}" y="${statY + 52}" text-anchor="middle" fill="${BRAND.mutedGray}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="13">${escapeXml(topic.statLabel)}</text>

  <text x="${width / 2}" y="${titleStartY - 30}" text-anchor="middle" fill="${topic.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="14" letter-spacing="2.5">${escapeXml(contentLabel.toUpperCase())}</text>

    ${titleSvg}

    ${tipsSvg}

  <line x1="60" y1="${height - 90}" x2="${width - 60}" y2="${height - 90}" stroke="${BRAND.tealAccent}" stroke-width="1" stroke-opacity="0.2"/>
  <text x="${width / 2}" y="${height - 55}" text-anchor="middle" fill="${BRAND.white}" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="22" opacity="0.9">GetCyberRight.com</text>
  <text x="${width / 2}" y="${height - 28}" text-anchor="middle" fill="${topic.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="13" opacity="0.7">Protecting Families in the Digital World</text>
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

export async function generateBrandedImage(
  title: string,
  contentType: string,
  platform: string
): Promise<string | null> {
  try {
    ensureDir();

    const dims = PLATFORM_DIMENSIONS[platform] || PLATFORM_DIMENSIONS.facebook;
    const topic = detectTopic(title, contentType);
    const config = TOPIC_CONFIG[topic] || TOPIC_CONFIG.default;
    const isSquare = platform === "instagram";

    const svg = isSquare
      ? buildSquareSvg(dims.width, dims.height, title, contentType, config)
      : buildLandscapeSvg(dims.width, dims.height, title, contentType, config);

    const logoSize = isSquare ? 70 : 65;
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

    const hash = crypto.createHash("md5").update(title + platform + "v3").digest("hex").substring(0, 12);
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
