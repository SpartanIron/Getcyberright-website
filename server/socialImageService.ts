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

const TOPIC_COLORS: Record<string, { bg: string; accent: string }> = {
  phishing: { bg: "#1a1a2e", accent: "#e94560" },
  scam: { bg: "#16213e", accent: "#e94560" },
  identity_theft: { bg: "#0f3460", accent: "#e94560" },
  privacy: { bg: "#1a1a2e", accent: "#00b4d8" },
  password: { bg: "#0f3460", accent: "#4cc9f0" },
  malware: { bg: "#1a1a2e", accent: "#e94560" },
  data_breach: { bg: "#16213e", accent: "#ff6b6b" },
  default: { bg: "#0a192f", accent: "#64ffda" },
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

function getTopicIcon(topic: string): string {
  const icons: Record<string, string> = {
    phishing: "⚠️",
    scam: "🛡️",
    identity_theft: "🔒",
    privacy: "👁️",
    password: "🔑",
    malware: "🦠",
    data_breach: "💥",
    default: "🔐",
  };
  return icons[topic] || icons.default;
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
    const colors = TOPIC_COLORS[topic] || TOPIC_COLORS.default;
    const icon = getTopicIcon(topic);

    const truncatedTitle = title.length > 80 ? title.substring(0, 77) + "..." : title;

    const contentLabel = contentType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const isSquare = platform === "instagram";
    const titleFontSize = isSquare ? 38 : 42;
    const titleY = isSquare ? dims.height * 0.38 : dims.height * 0.35;
    const maxCharsPerLine = isSquare ? 28 : 35;

    const words = truncatedTitle.split(" ");
    const lines: string[] = [];
    let currentLine = "";
    for (const word of words) {
      if ((currentLine + " " + word).trim().length > maxCharsPerLine) {
        lines.push(currentLine.trim());
        currentLine = word;
      } else {
        currentLine = (currentLine + " " + word).trim();
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    const titleLines = lines.slice(0, 3).map((line, i) => {
      const escaped = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<text x="${dims.width / 2}" y="${titleY + i * (titleFontSize + 8)}" text-anchor="middle" fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${titleFontSize}">${escaped}</text>`;
    }).join("\n    ");

    const svg = `<svg width="${dims.width}" height="${dims.height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0a0a1a;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent-line" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${colors.accent};stop-opacity:0" />
      <stop offset="50%" style="stop-color:${colors.accent};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0" />
    </linearGradient>
  </defs>

  <rect width="${dims.width}" height="${dims.height}" fill="url(#bg)" />

  <circle cx="${dims.width * 0.85}" cy="${dims.height * 0.15}" r="${dims.height * 0.3}" fill="${colors.accent}" opacity="0.05" />
  <circle cx="${dims.width * 0.1}" cy="${dims.height * 0.85}" r="${dims.height * 0.25}" fill="${colors.accent}" opacity="0.03" />

  <rect x="0" y="0" width="${dims.width}" height="4" fill="${colors.accent}" />

  <text x="${dims.width / 2}" y="${isSquare ? 80 : 60}" text-anchor="middle" fill="${colors.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="18" letter-spacing="3">${contentLabel.toUpperCase()}</text>

  <rect x="${dims.width * 0.3}" y="${isSquare ? 100 : 80}" width="${dims.width * 0.4}" height="2" fill="url(#accent-line)" />

    ${titleLines}

  <text x="${dims.width / 2}" y="${dims.height - (isSquare ? 120 : 80)}" text-anchor="middle" fill="white" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="24" opacity="0.9">GetCyberRight.com</text>

  <text x="${dims.width / 2}" y="${dims.height - (isSquare ? 85 : 50)}" text-anchor="middle" fill="${colors.accent}" font-family="Arial, Helvetica, sans-serif" font-weight="400" font-size="14" opacity="0.8">Protecting Families From Cyber Threats</text>

  <rect x="0" y="${dims.height - 4}" width="${dims.width}" height="4" fill="${colors.accent}" />
</svg>`;

    const hash = crypto.createHash("md5").update(title + platform).digest("hex").substring(0, 12);
    const filename = `social-${platform}-${hash}.webp`;
    const filepath = path.join(SOCIAL_IMAGES_DIR, filename);

    await sharp(Buffer.from(svg))
      .webp({ quality: 85 })
      .toFile(filepath);

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
    const outputPath = path.join(SOCIAL_IMAGES_DIR, `${base}-${platform}.webp`);

    await sharp(inputPath)
      .resize(dims.width, dims.height, { fit: "cover", position: "center" })
      .webp({ quality: 85 })
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
  platforms: string[] = ["linkedin", "x", "instagram", "alert"]
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
    return `data:image/webp;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export function serveImagePath(filepath: string): string {
  return `/api/social-images/${path.basename(filepath)}`;
}
