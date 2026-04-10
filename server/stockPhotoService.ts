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

const CYBER_VISUAL_MAP: Record<string, string[]> = {
  "hack": ["hacker computer dark room", "cybersecurity hacking code screen"],
  "breach": ["data breach cybersecurity alert", "broken digital lock security"],
  "ransomware": ["ransomware attack locked computer screen", "encrypted files cyber extortion"],
  "phishing": ["phishing email suspicious message inbox", "fake login page credential theft"],
  "malware": ["malware virus computer code terminal", "infected computer warning screen"],
  "scam": ["online scam fraud warning smartphone", "suspicious message phone alert"],
  "password": ["password security login screen keyboard", "two factor authentication phone code"],
  "vpn": ["vpn secure connection network shield", "encrypted tunnel private browsing"],
  "encryption": ["encryption padlock digital security code", "encrypted data secure communication"],
  "privacy": ["digital privacy surveillance tracking", "person covering webcam laptop"],
  "identity": ["identity theft personal documents stolen", "social security card credit card fraud"],
  "android": ["android smartphone mobile security lock", "mobile phone malware warning screen"],
  "iphone": ["iphone smartphone security settings", "apple mobile device face id"],
  "apple": ["apple macbook laptop security", "apple device technology workspace"],
  "google": ["google chrome browser security warning", "google account security settings"],
  "microsoft": ["microsoft windows computer security", "windows laptop update screen"],
  "facebook": ["social media privacy phone scrolling", "facebook settings privacy screen"],
  "whatsapp": ["whatsapp messaging phone conversation", "encrypted messaging smartphone chat"],
  "instagram": ["instagram social media phone app", "social media smartphone scrolling"],
  "tiktok": ["tiktok social media phone video", "short video app smartphone"],
  "ai": ["artificial intelligence neural network", "AI chatbot conversation screen"],
  "chatbot": ["AI chatbot conversation screen", "artificial intelligence chat interface"],
  "deepfake": ["deepfake artificial intelligence face manipulation", "synthetic media face recognition"],
  "spyware": ["spyware surveillance phone monitoring", "hidden tracking software device"],
  "trojan": ["trojan virus hidden malware code", "disguised malicious software download"],
  "zero-day": ["zero day exploit code vulnerability", "security researcher finding software bug"],
  "supply chain": ["supply chain software development pipeline", "code repository security audit"],
  "cloud": ["cloud computing data center servers", "cloud storage security padlock"],
  "router": ["wifi router home network security", "wireless network configuration settings"],
  "smart home": ["smart home iot devices connected", "smart speaker security camera home"],
  "children": ["children using tablet internet safety", "kid learning computer parental guidance"],
  "family": ["family using technology devices together", "parents children digital literacy"],
  "teen": ["teenager smartphone social media", "teen online safety digital literacy"],
  "elderly": ["senior citizen using smartphone", "older adult computer technology help"],
  "bank": ["online banking mobile phone security", "financial transaction secure payment"],
  "crypto": ["cryptocurrency bitcoin digital wallet", "crypto trading platform screen"],
  "telegram": ["telegram encrypted messaging app", "secure messaging smartphone chat"],
  "chrome": ["google chrome browser address bar", "web browser security certificate"],
  "firefox": ["firefox web browser security", "web browser privacy settings"],
  "windows": ["windows computer desktop security settings", "windows update security patch"],
  "linux": ["linux server terminal command line", "open source operating system code"],
  "quantum": ["quantum computing technology processor", "quantum physics technology lab"],
  "surveillance": ["surveillance camera security monitoring city", "cctv security monitoring screen"],
  "data": ["data security server room protection", "digital data encryption storage"],
  "exploit": ["cybersecurity exploit code terminal screen", "hacker finding software vulnerability"],
  "vulnerability": ["software vulnerability bug security patch", "code review security audit"],
  "patch": ["software update security patch download", "system update progress screen"],
  "sim swap": ["sim card mobile phone carrier", "phone number porting identity theft"],
  "social engineering": ["person manipulation phone call scam", "suspicious phone call warning"],
  "dark web": ["dark web anonymous browsing", "hidden internet marketplace security"],
  "email": ["email inbox security warning phishing", "suspicious email attachment alert"],
  "wifi": ["public wifi coffee shop security risk", "wireless network password protection"],
  "backup": ["data backup external drive cloud", "computer backup recovery process"],
  "update": ["software update phone notification", "system security update download"],
  "gaming": ["gaming controller headset online multiplayer", "video game account security"],
  "shopping": ["online shopping credit card payment", "ecommerce secure checkout padlock"],
  "dating": ["online dating app smartphone", "dating profile catfish scam warning"],
  "job scam": ["fake job listing employment fraud", "suspicious job offer email"],
  "tax": ["tax return filing computer fraud", "irs scam phone call warning"],
  "medicare": ["medicare health insurance card fraud", "senior healthcare scam warning"],
  "car": ["connected car dashboard technology", "vehicle cybersecurity diagnostic port"],
  "travel": ["travel booking smartphone airport", "airline ticket booking scam warning"],
};

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
    "guide", "complete", "what", "need", "right", "best", "tips", "protect",
    "prevent", "safe", "secure", "avoid", "stop", "learn", "important",
  ]);

  const lowerTitle = title.toLowerCase();

  const matchedQueries: string[] = [];
  for (const [keyword, visualQueries] of Object.entries(CYBER_VISUAL_MAP)) {
    if (lowerTitle.includes(keyword)) {
      matchedQueries.push(...visualQueries);
    }
  }
  if (matchedQueries.length > 0) {
    return matchedQueries;
  }

  const words = lowerTitle
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  if (words.length >= 2) {
    return [words.slice(0, 3).join(" ") + " cybersecurity", words.slice(0, 2).join(" ") + " technology"];
  }

  const searchTerms = TOPIC_SEARCH_TERMS[category] || TOPIC_SEARCH_TERMS["default"];
  return searchTerms;
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

async function generateAISearchQuery(title: string, category: string): Promise<string | null> {
  try {
    const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY;
    const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
    if (!apiKey || !baseURL) return null;

    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey, baseURL });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 60,
      messages: [{
        role: "user",
        content: `Generate a 3-5 word stock photo search query for this cybersecurity article title. The query should describe a VISUAL SCENE that relates to the topic — what a photographer would actually photograph. Return ONLY the search query, nothing else.

Title: "${title}"
Category: ${category}

Examples of good queries:
- "person typing laptop dark office" for hacking articles
- "family looking at tablet together" for family safety articles  
- "phone screen suspicious text message" for SMS scam articles
- "credit card online payment security" for financial fraud articles`,
      }],
    });

    const text = response.content.find((b: any) => b.type === "text");
    const query = text?.text?.trim().replace(/['"]/g, "");
    if (query && query.split(/\s+/).length <= 8) {
      console.log(`[StockPhoto] AI-generated search query: "${query}" (for: "${title.slice(0, 50)}")`);
      return query;
    }
    return null;
  } catch (error: any) {
    console.warn(`[StockPhoto] AI query generation failed: ${error.message}`);
    return null;
  }
}

export async function searchStockPhoto(category: string, title: string, options?: { platform?: string }): Promise<{ url: string; photographer: string; localPath?: string } | null> {
  const queries = extractSearchQuery(title, category);

  for (const query of queries) {
    const unsplashResult = await searchUnsplashPhoto(query);
    if (unsplashResult) return unsplashResult;

    const pexelsResult = await searchPexelsPhoto(query, category);
    if (pexelsResult) return pexelsResult;
  }

  const aiQuery = await generateAISearchQuery(title, category);
  if (aiQuery) {
    const unsplashResult = await searchUnsplashPhoto(aiQuery);
    if (unsplashResult) return unsplashResult;

    const pexelsResult = await searchPexelsPhoto(aiQuery, category);
    if (pexelsResult) return pexelsResult;
  }

  if (options?.platform === "instagram") {
    console.log(`[StockPhoto] No relevant stock photos found for Instagram post "${title}". Will use branded card instead.`);
    return null;
  }

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
    const fontFamily = "'SF Pro Display','Inter','Segoe UI',Helvetica,Arial,sans-serif";

    const templates: Record<TemplateStyle, { accent: string; accentRgb: string; categoryLabel: string; gradientOpacity: number }> = {
      alert_card:   { accent: "#EF4444", accentRgb: "239,68,68",  categoryLabel: "SECURITY ALERT",  gradientOpacity: 0.92 },
      stat_card:    { accent: "#F97316", accentRgb: "249,115,22", categoryLabel: "CYBER NEWS",      gradientOpacity: 0.88 },
      tip_card:     { accent: "#00D4AA", accentRgb: "0,212,170",  categoryLabel: "CYBER TIP",       gradientOpacity: 0.88 },
      insight_card: { accent: "#38BDF8", accentRgb: "56,189,248", categoryLabel: "INSIGHT",         gradientOpacity: 0.88 },
      quote_card:   { accent: "#A78BFA", accentRgb: "167,139,250", categoryLabel: "ANALYSIS",       gradientOpacity: 0.88 },
    };
    const tmpl = templates[templateStyle];

    const baseImage = await sharp(sourcePath)
      .resize(width, height, { fit: "cover", position: "center" })
      .toBuffer();

    const maxChars = isSquare ? 16 : 28;
    let headlineLines = wrapText(cleanHeadline, maxChars);
    const maxLines = isSquare ? 5 : 3;
    if (headlineLines.length > maxLines) {
      headlineLines = headlineLines.slice(0, maxLines);
      headlineLines[maxLines - 1] = headlineLines[maxLines - 1].slice(0, -3) + "...";
    }

    const padX = isSquare ? 56 : 64;
    const padBottom = isSquare ? 56 : 48;

    const fontSize = isSquare
      ? (headlineLines.length > 3 ? 46 : headlineLines.length > 2 ? 52 : 60)
      : (headlineLines.length > 2 ? 42 : 50);
    const lineHeight = fontSize * 1.2;

    const totalHeadlineH = headlineLines.length * lineHeight;
    const categoryH = 32;
    const brandH = 20;
    const spacingBetween = 14;
    const contentH = categoryH + spacingBetween + totalHeadlineH + spacingBetween * 2 + brandH;
    const gradientH = Math.max(contentH + padBottom + 60, Math.round(height * 0.6));

    const gradientStartY = height - gradientH;
    const categoryY = height - padBottom - contentH + 14;
    const headlineStartY = categoryY + categoryH + spacingBetween;

    let headlineSvg = "";
    for (let i = 0; i < headlineLines.length; i++) {
      const y = headlineStartY + i * lineHeight + fontSize * 0.85;
      headlineSvg += `<text x="${padX}" y="${y}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="700" fill="white" letter-spacing="-0.5">${escapeXml(headlineLines[i])}</text>`;
    }

    const brandY = height - padBottom;
    const dividerY = brandY - 28;

    const categoryPillW = tmpl.categoryLabel.length * 7.5 + 36;
    const categoryPillH = 24;
    const dotR = 3.5;

    const topBarSvg = `<rect x="0" y="0" width="${width}" height="4" fill="${tmpl.accent}"/>`;

    const overlaySvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="${Math.round((gradientStartY / height) * 100)}%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="${Math.round(((gradientStartY + gradientH * 0.15) / height) * 100)}%" stop-color="rgba(10,15,26,${tmpl.gradientOpacity * 0.3})"/>
      <stop offset="${Math.round(((gradientStartY + gradientH * 0.45) / height) * 100)}%" stop-color="rgba(10,15,26,${tmpl.gradientOpacity * 0.7})"/>
      <stop offset="100%" stop-color="rgba(10,15,26,${tmpl.gradientOpacity})"/>
    </linearGradient>
    <linearGradient id="accentGlow" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="${tmpl.accent}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${tmpl.accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  <rect x="0" y="${Math.round(height * 0.6)}" width="${Math.round(width * 0.4)}" height="${Math.round(height * 0.4)}" fill="url(#accentGlow)"/>

  ${topBarSvg}

  <rect x="${padX}" y="${categoryY}" width="${categoryPillW}" height="${categoryPillH}" rx="12" fill="${tmpl.accent}" opacity="0.15"/>
  <rect x="${padX}" y="${categoryY}" width="${categoryPillW}" height="${categoryPillH}" rx="12" fill="none" stroke="${tmpl.accent}" stroke-width="1" opacity="0.5"/>
  <circle cx="${padX + 14}" cy="${categoryY + categoryPillH / 2}" r="${dotR}" fill="${tmpl.accent}"/>
  <text x="${padX + 26}" y="${categoryY + categoryPillH / 2 + 4}" font-family="${fontFamily}" font-size="10" font-weight="700" fill="${tmpl.accent}" letter-spacing="2">${tmpl.categoryLabel}</text>

  ${headlineSvg}

  <line x1="${padX}" y1="${dividerY}" x2="${width - padX}" y2="${dividerY}" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>

  <text x="${padX}" y="${brandY}" font-family="${fontFamily}" font-size="17" font-weight="700" fill="rgba(255,255,255,0.95)" letter-spacing="0.5">GetCyberRight</text>
  <line x1="${padX + 145}" y1="${brandY - 12}" x2="${padX + 145}" y2="${brandY + 3}" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <text x="${padX + 159}" y="${brandY}" font-family="${fontFamily}" font-size="12" font-weight="400" fill="rgba(255,255,255,0.55)">www.getcyberright.com</text>

  <rect x="${width - padX - 50}" y="${brandY - 10}" width="50" height="3" rx="1.5" fill="${tmpl.accent}" opacity="0.7"/>
</svg>`;

    const overlayBuffer = await sharp(Buffer.from(overlaySvg))
      .png()
      .toBuffer();

    await sharp(baseImage)
      .composite([{ input: overlayBuffer, top: 0, left: 0 }])
      .jpeg({ quality: 95, mozjpeg: true })
      .toFile(outputPath);

    console.log(`[StockPhoto] Applied brand overlay: ${filename} (${width}x${height}, template: ${templateStyle})`);
    return outputPath;
  } catch (error: any) {
    console.error(`[StockPhoto] Brand overlay failed: ${error.message}`);
    return null;
  }
}
