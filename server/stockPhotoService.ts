import * as fs from "fs";
import * as path from "path";

const SOCIAL_IMAGES_DIR = path.join(process.cwd(), ".local", "social-images");

export function ensureSocialImagesDir(): void {
  if (!fs.existsSync(SOCIAL_IMAGES_DIR)) {
    fs.mkdirSync(SOCIAL_IMAGES_DIR, { recursive: true });
  }
}

export { SOCIAL_IMAGES_DIR };

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export const TEMPLATE_STYLES = [
  "stat_card",
  "tip_card",
  "alert_card",
  "insight_card",
  "quote_card",
] as const;

export type TemplateStyle = (typeof TEMPLATE_STYLES)[number];

export function isUrlSafeForFetch(urlStr: string): boolean {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    if (parsed.username || parsed.password) return false;
    const host = parsed.hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1" || host === "0.0.0.0" || host === "::1") return false;
    if (host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("172.")) return false;
    if (host.endsWith(".local") || host.endsWith(".internal") || host === "metadata.google.internal") return false;
    if (host.startsWith("169.254.")) return false;
    return true;
  } catch {
    return false;
  }
}

export async function downloadSourceImage(url: string, title: string): Promise<string | null> {
  try {
    if (!isUrlSafeForFetch(url)) {
      console.warn(`[StockPhoto] Source image URL blocked (safety check): ${url}`);
      return null;
    }

    ensureSocialImagesDir();
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
    const filename = `source-${slug}-${Date.now()}.png`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "GetCyberRight/1.0 (Cybersecurity Education Platform)",
        "Accept": "image/*",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[StockPhoto] Source image HTTP ${response.status} for: ${url}`);
      return null;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      console.warn(`[StockPhoto] Source image not an image (${contentType}): ${url}`);
      return null;
    }

    const contentLength = parseInt(response.headers.get("content-length") || "0", 10);
    if (contentLength > MAX_IMAGE_BYTES) {
      console.warn(`[StockPhoto] Source image too large (${contentLength} bytes): ${url}`);
      return null;
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    const reader = response.body?.getReader();
    if (!reader) return null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.length;
      if (totalBytes > MAX_IMAGE_BYTES) {
        reader.cancel();
        console.warn(`[StockPhoto] Source image download exceeded ${MAX_IMAGE_BYTES} bytes, aborting: ${url}`);
        return null;
      }
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);
    if (buffer.length < 5000) {
      console.warn(`[StockPhoto] Source image too small (${buffer.length} bytes), likely a tracking pixel: ${url}`);
      return null;
    }

    const sharp = (await import("sharp")).default;
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height || metadata.width < 200 || metadata.height < 200) {
      console.warn(`[StockPhoto] Source image too small dimensions (${metadata.width}x${metadata.height}): ${url}`);
      return null;
    }

    await sharp(buffer)
      .png({ quality: 95 })
      .toFile(outputPath);

    console.log(`[StockPhoto] Downloaded source image: ${filename} (${metadata.width}x${metadata.height}, ${(buffer.length / 1024).toFixed(0)}KB)`);
    return outputPath;
  } catch (error: any) {
    console.warn(`[StockPhoto] Failed to download source image: ${error.message}`);
    return null;
  }
}

const TOPIC_SEARCH_TERMS: Record<string, string[]> = {
  "Data Breaches": ["data security", "cybersecurity lock", "digital security"],
  "Phishing": ["email security", "phishing scam", "cyber attack warning"],
  "Malware": ["computer virus", "malware code", "cybersecurity threat"],
  "Ransomware": ["ransomware lock", "encrypted files", "cyber extortion"],
  "Privacy": ["digital privacy", "data protection", "online privacy"],
  "Scams": ["online fraud", "scam alert", "internet safety"],
  "Family Safety": ["family technology", "children internet safety", "parental control"],
  "Government": ["government cybersecurity", "national security digital", "federal cyber"],
  "Business": ["corporate security", "business cybersecurity", "enterprise security"],
  "Mobile Security": ["smartphone security", "mobile device protection", "phone security"],
  "IoT": ["smart home security", "iot devices", "connected devices security"],
  "AI & Security": ["artificial intelligence security", "AI technology", "machine learning security"],
  "default": ["cybersecurity", "digital security", "internet protection"],
};

export { TOPIC_SEARCH_TERMS };

const LOCAL_STOCK_PHOTOS_DIR = path.join(process.cwd(), ".local", "stock-photos");
const PICSUM_TECH_IDS = [0, 1, 2, 60, 119, 160, 180, 201, 366, 367, 403, 453, 537, 593, 756];

async function ensureLocalStockPhotos(): Promise<void> {
  if (!fs.existsSync(LOCAL_STOCK_PHOTOS_DIR)) {
    fs.mkdirSync(LOCAL_STOCK_PHOTOS_DIR, { recursive: true });
  }
  const existing = fs.readdirSync(LOCAL_STOCK_PHOTOS_DIR).filter(f => f.endsWith(".jpg"));
  if (existing.length >= 5) return;

  console.log(`[StockPhoto] Downloading local stock photo set...`);
  const ids = PICSUM_TECH_IDS.sort(() => Math.random() - 0.5).slice(0, 8);
  for (const id of ids) {
    const filePath = path.join(LOCAL_STOCK_PHOTOS_DIR, `stock-${id}.jpg`);
    if (fs.existsSync(filePath)) continue;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const resp = await fetch(`https://picsum.photos/id/${id}/1920/1080`, {
        signal: controller.signal,
        headers: { "User-Agent": "curl/8.0" },
      });
      clearTimeout(timeout);
      if (resp.ok) {
        const buffer = Buffer.from(await resp.arrayBuffer());
        fs.writeFileSync(filePath, buffer);
        console.log(`[StockPhoto] Downloaded stock photo: stock-${id}.jpg (${buffer.length} bytes)`);
      }
    } catch {
    }
  }
}

function getLocalStockPhoto(): string | null {
  if (!fs.existsSync(LOCAL_STOCK_PHOTOS_DIR)) return null;
  const photos = fs.readdirSync(LOCAL_STOCK_PHOTOS_DIR).filter(f => f.endsWith(".jpg"));
  if (photos.length === 0) return null;
  const chosen = photos[Math.floor(Math.random() * photos.length)];
  return path.join(LOCAL_STOCK_PHOTOS_DIR, chosen);
}

export function extractSearchQuery(title: string, category: string): string[] {
  const STOP_WORDS = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "can", "had",
    "her", "was", "one", "our", "out", "has", "have", "been", "will", "from",
    "they", "been", "said", "each", "she", "which", "their", "what", "about",
    "would", "make", "like", "just", "over", "such", "take", "than", "them",
    "very", "some", "could", "into", "year", "plan", "know", "time", "that",
    "with", "this", "your", "how", "why", "new", "most", "more", "after",
    "also", "made", "many", "before", "must", "through", "back", "should",
    "where", "much", "every", "same", "being", "here", "does", "puts",
    "keep", "gets", "says", "come", "look", "find", "ways", "next",
  ]);

  const CYBER_VISUAL_MAP: Record<string, string> = {
    "hack": "hacker computer dark room",
    "breach": "data breach cybersecurity",
    "ransomware": "ransomware attack locked computer",
    "phishing": "phishing email suspicious message",
    "malware": "malware virus computer code",
    "scam": "online scam fraud warning",
    "password": "password security login screen",
    "vpn": "vpn secure connection network",
    "encryption": "encryption padlock digital security",
    "privacy": "digital privacy surveillance camera",
    "identity": "identity theft stolen data",
    "android": "android smartphone mobile security",
    "iphone": "iphone smartphone mobile device",
    "apple": "apple device technology",
    "google": "google technology company office",
    "microsoft": "microsoft windows computer",
    "facebook": "social media privacy data",
    "ai": "artificial intelligence technology robot",
    "deepfake": "deepfake artificial intelligence face",
    "spyware": "spyware surveillance monitoring",
    "trojan": "trojan virus cybersecurity",
    "zero-day": "zero day exploit vulnerability code",
    "supply chain": "supply chain software development",
    "cloud": "cloud computing server data center",
    "router": "wifi router network security",
    "smart home": "smart home iot devices",
    "children": "children internet safety family",
    "family": "family using technology together",
    "bank": "online banking financial security",
    "crypto": "cryptocurrency bitcoin digital finance",
    "telegram": "messaging app encrypted communication",
    "chrome": "google chrome web browser",
    "firefox": "web browser internet security",
    "windows": "windows computer desktop security",
    "linux": "linux server technology",
    "quantum": "quantum computing technology",
    "surveillance": "surveillance camera security monitoring",
    "data": "data center server technology",
    "exploit": "cybersecurity exploit code terminal",
    "vulnerability": "software vulnerability bug code",
    "patch": "software update security patch",
  };

  const lowerTitle = title.toLowerCase();

  for (const [keyword, visualQuery] of Object.entries(CYBER_VISUAL_MAP)) {
    if (lowerTitle.includes(keyword)) {
      return [visualQuery];
    }
  }

  const words = lowerTitle
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  if (words.length >= 2) {
    return [words.slice(0, 3).join(" ") + " technology"];
  }

  const searchTerms = TOPIC_SEARCH_TERMS[category] || TOPIC_SEARCH_TERMS["default"];
  return [searchTerms[Math.floor(Math.random() * searchTerms.length)]];
}

async function searchUnsplashPhoto(query: string): Promise<{ url: string; photographer: string } | null> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`,
      { signal: controller.signal, headers: { "Authorization": `Client-ID ${accessKey}` } }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[StockPhoto] Unsplash returned ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.results?.length) return null;

    const validPhotos = data.results.filter((p: any) => (p.width || 0) >= 1200 && (p.height || 0) >= 630);
    const pool = validPhotos.length > 0 ? validPhotos : data.results;
    const photo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];
    const photoUrl = photo.urls?.raw ? `${photo.urls.raw}&w=2400&q=85&fm=jpg` : photo.urls?.full || photo.urls?.regular;
    const photographer = photo.user?.name || "Unsplash";

    if (!photoUrl) return null;

    console.log(`[StockPhoto] Unsplash photo: "${(photo.alt_description || '').substring(0, 50)}" by ${photographer} (query: "${query}", ${photo.width}x${photo.height})`);
    return { url: photoUrl, photographer };
  } catch (error: any) {
    console.warn(`[StockPhoto] Unsplash search failed: ${error.message}`);
    return null;
  }
}

async function searchShutterstockPhoto(query: string): Promise<{ url: string; photographer: string } | null> {
  const consumerKey = process.env.SHUTTERSTOCK_CONSUMER_KEY;
  const consumerSecret = process.env.SHUTTERSTOCK_CONSUMER_SECRET;
  if (!consumerKey || !consumerSecret) return null;

  try {
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://api.shutterstock.com/v2/images/search?query=${encodeURIComponent(query)}&per_page=10&orientation=horizontal&image_type=photo&sort=relevance&view=full`,
      { signal: controller.signal, headers: { "Authorization": `Basic ${auth}` } }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      console.log(`[StockPhoto] Shutterstock returned ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    if (!data.data?.length) return null;

    const photos = data.data.filter((img: any) => {
      const a = img.assets?.huge || img.assets?.preview_1500 || {};
      return (a.width || 0) >= 1000;
    });

    const pool = photos.length > 0 ? photos : data.data;
    const photo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];
    const asset = photo.assets?.huge || photo.assets?.preview_1500 || photo.assets?.preview || {};
    const photoUrl = asset.url;
    const photographer = photo.contributor?.id ? `Shutterstock #${photo.id}` : "Shutterstock";

    if (!photoUrl) return null;

    console.log(`[StockPhoto] Shutterstock photo: "${(photo.description || '').substring(0, 50)}" (query: "${query}", ${asset.width || '?'}x${asset.height || '?'})`);
    return { url: photoUrl, photographer };
  } catch (error: any) {
    console.warn(`[StockPhoto] Shutterstock search failed: ${error.message}`);
    return null;
  }
}

async function searchPexelsPhoto(query: string, category: string): Promise<{ url: string; photographer: string } | null> {
  const pexelsApiKey = process.env.PEXELS_API_KEY;
  const pexelsHeaders: Record<string, string> = { "Accept": "*/*" };
  if (pexelsApiKey) {
    pexelsHeaders["Authorization"] = pexelsApiKey;
  }
  pexelsHeaders["User-Agent"] = "curl/8.0";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape&size=large`,
      { signal: controller.signal, headers: pexelsHeaders }
    );
    clearTimeout(timeout);

    if (response.ok) {
      const data: any = await response.json();
      if (data.photos?.length) {
        const validPhotos = data.photos.filter((p: any) => {
          const w = p.width || 0;
          const h = p.height || 0;
          return w >= 1200 && h >= 630;
        });

        const pool = validPhotos.length > 0 ? validPhotos : data.photos;
        const photo = pool[Math.floor(Math.random() * Math.min(pool.length, 5))];
        const photoUrl = photo.src.original || photo.src.large2x || photo.src.large;
        console.log(`[StockPhoto] Pexels stock photo: "${photo.alt}" by ${photo.photographer} (query: "${query}", ${photo.width}x${photo.height})`);
        return { url: photoUrl, photographer: photo.photographer };
      }
    }

    const fallbackQuery = (TOPIC_SEARCH_TERMS[category] || TOPIC_SEARCH_TERMS["default"])[0];
    if (fallbackQuery !== query) {
      console.log(`[StockPhoto] Pexels no results for "${query}", trying fallback "${fallbackQuery}"...`);
      const fbController = new AbortController();
      const fbTimeout = setTimeout(() => fbController.abort(), 8000);
      const fbResponse = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(fallbackQuery)}&per_page=10&orientation=landscape&size=large`,
        { signal: fbController.signal, headers: pexelsHeaders }
      );
      clearTimeout(fbTimeout);

      if (fbResponse.ok) {
        const fbData: any = await fbResponse.json();
        if (fbData.photos?.length) {
          const photo = fbData.photos[Math.floor(Math.random() * Math.min(fbData.photos.length, 5))];
          const photoUrl = photo.src.original || photo.src.large2x || photo.src.large;
          console.log(`[StockPhoto] Pexels fallback: "${photo.alt}" by ${photo.photographer} (query: "${fallbackQuery}")`);
          return { url: photoUrl, photographer: photo.photographer };
        }
      }
    }

    return null;
  } catch (error: any) {
    console.warn(`[StockPhoto] Pexels search failed: ${error.message}`);
    return null;
  }
}

export async function searchStockPhoto(category: string, title: string): Promise<{ url: string; photographer: string; localPath?: string } | null> {
  const queries = extractSearchQuery(title, category);
  const query = queries[0];

  const unsplashResult = await searchUnsplashPhoto(query);
  if (unsplashResult) return unsplashResult;

  const pexelsResult = await searchPexelsPhoto(query, category);
  if (pexelsResult) return pexelsResult;

  console.log(`[StockPhoto] No stock photos found from Unsplash or Pexels, trying local...`);
  await ensureLocalStockPhotos();
  const localPath = getLocalStockPhoto();
  if (localPath) {
    console.log(`[StockPhoto] Using local stock photo: ${path.basename(localPath)}`);
    return { url: "", photographer: "Picsum Photos (CC0)", localPath };
  }

  return null;
}

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
  return lines;
}

export async function applyBrandOverlay(
  sourcePath: string,
  headline: string,
  subtext: string,
  templateStyle: TemplateStyle,
  width: number,
  height: number
): Promise<string | null> {
  try {
    ensureSocialImagesDir();
    const isSquare = width === height;
    const cleanHeadline = headline.replace(/\[.*?\]\s*/g, "").trim();
    const slug = cleanHeadline.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 35);
    const prefix = isSquare ? "branded-ig" : "branded";
    const filename = `${prefix}-${slug}-${Date.now()}.jpeg`;
    const outputPath = path.join(SOCIAL_IMAGES_DIR, filename);

    const sharp = (await import("sharp")).default;
    const fontFamily = "'Inter','DejaVu Sans',Arial,sans-serif";

    const logoPath = path.join(process.cwd(), "client", "public", "lock-logo-transparent.png");
    let logoBuffer: Buffer | null = null;
    const logoSize = isSquare ? 36 : 30;
    if (fs.existsSync(logoPath)) {
      logoBuffer = await sharp(logoPath)
        .resize(logoSize, logoSize, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
    }

    const templates: Record<TemplateStyle, { accent: string; accentRgb: string; categoryLabel: string; gradientOpacity: number }> = {
      alert_card:   { accent: "#EF4444", accentRgb: "239,68,68",  categoryLabel: "SECURITY ALERT",  gradientOpacity: 0.85 },
      stat_card:    { accent: "#F97316", accentRgb: "249,115,22", categoryLabel: "CYBER NEWS",      gradientOpacity: 0.82 },
      tip_card:     { accent: "#10B981", accentRgb: "16,185,129", categoryLabel: "CYBER TIP",       gradientOpacity: 0.82 },
      insight_card: { accent: "#3B82F6", accentRgb: "59,130,246", categoryLabel: "INSIGHT",         gradientOpacity: 0.82 },
      quote_card:   { accent: "#8B5CF6", accentRgb: "139,92,246", categoryLabel: "ANALYSIS",        gradientOpacity: 0.82 },
    };
    const tmpl = templates[templateStyle];

    const baseImage = await sharp(sourcePath)
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

    const importantTerms = ["BREACH", "HACK", "ATTACK", "WARNING", "ALERT", "CRITICAL", "RANSOMWARE", "MALWARE", "SCAM", "FRAUD", "PHISHING", "EXPLOIT", "VULNERABILITY", "ZERO-DAY", "LEAKED", "STOLEN", "EXPOSED", "MILLION", "BILLION", "COMPROMISED", "EMERGENCY", "URGENT", "THREAT", "RISK", "FLAW", "PATCH", "UPDATE", "BLOCKS", "BANS", "DANGEROUS", "INFECTED", "SPYWARE", "TROJAN", "BACKDOOR", "SUPPLY-CHAIN", "DATA", "PRIVACY", "SURVEILLANCE", "DEEPFAKE"];

    let headlineSvg = "";
    for (let i = 0; i < headlineLines.length; i++) {
      const y = headlineStartY + i * lineHeight + fontSize * 0.85;
      const words = headlineLines[i].split(" ");
      const tspans = words.map(w => {
        const isAccent = importantTerms.some(t => w.includes(t));
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

    const overlayBuffer = await sharp(Buffer.from(overlaySvg))
      .png()
      .toBuffer();

    const composites: sharp.OverlayOptions[] = [
      { input: overlayBuffer, top: 0, left: 0 },
    ];
    if (logoBuffer) {
      composites.push({
        input: logoBuffer,
        top: Math.round(brandY - logoSize + 4),
        left: padX,
      });
    }

    await sharp(baseImage)
      .composite(composites)
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(outputPath);

    console.log(`[StockPhoto] Applied brand overlay: ${filename} (${width}x${height}, template: ${templateStyle})`);
    return outputPath;
  } catch (error: any) {
    console.error(`[StockPhoto] Brand overlay failed: ${error.message}`);
    return null;
  }
}
