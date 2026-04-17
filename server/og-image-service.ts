import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { Request, Response } from "express";
import { storage } from "./storage";

const FONTS_DIR = join(process.cwd(), "server", "fonts");

let cachedFonts: Array<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" }> | null = null;

function loadFonts() {
  if (cachedFonts) return cachedFonts;
  const regular = join(FONTS_DIR, "Inter-Regular.woff");
  const semi = join(FONTS_DIR, "Inter-SemiBold.woff");
  const bold = join(FONTS_DIR, "Inter-Bold.woff");
  if (!existsSync(regular) || !existsSync(semi) || !existsSync(bold)) {
    throw new Error("Inter font files missing in server/fonts/");
  }
  cachedFonts = [
    { name: "Inter", data: readFileSync(regular), weight: 400, style: "normal" },
    { name: "Inter", data: readFileSync(semi), weight: 600, style: "normal" },
    { name: "Inter", data: readFileSync(bold), weight: 700, style: "normal" },
  ];
  return cachedFonts;
}

const CATEGORY_ACCENTS: Record<string, { from: string; to: string; label: string }> = {
  Cybersecurity: { from: "#0f766e", to: "#115e59", label: "CYBERSECURITY" },
  AI: { from: "#7c3aed", to: "#4c1d95", label: "AI & TECH" },
  Tech: { from: "#1d4ed8", to: "#1e3a8a", label: "TECH" },
  Learning: { from: "#0369a1", to: "#075985", label: "LEARNING" },
  "Action Needed": { from: "#dc2626", to: "#7f1d1d", label: "ACTION NEEDED" },
};
const DEFAULT_ACCENT = { from: "#0f766e", to: "#0c1f2c", label: "GETCYBERRIGHT" };

function truncate(text: string, max: number) {
  if (!text) return "";
  return text.length <= max ? text : text.slice(0, max - 1).trimEnd() + "…";
}

interface ArticleLike {
  title: string;
  category?: string | null;
  excerpt?: string | null;
  authorName?: string | null;
  readTime?: number | null;
}

async function renderOgPng(article: ArticleLike): Promise<Buffer> {
  const fonts = loadFonts();
  const accent = CATEGORY_ACCENTS[article.category || ""] || DEFAULT_ACCENT;
  const title = truncate(article.title, 140);
  const excerpt = truncate(article.excerpt || "", 180);
  const author = article.authorName || "GetCyberRight Team";
  const readTime = article.readTime ? `${article.readTime} min read` : "";

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: `linear-gradient(135deg, ${accent.from} 0%, ${accent.to} 100%)`,
          color: "white",
          fontFamily: "Inter",
          position: "relative",
        },
        children: [
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", justifyContent: "space-between" },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", alignItems: "center", gap: "14px" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "44px",
                            height: "44px",
                            borderRadius: "10px",
                            background: "rgba(255,255,255,0.18)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "26px",
                            fontWeight: 700,
                          },
                          children: "🛡",
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px" },
                          children: "GetCyberRight",
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "2px",
                      padding: "8px 16px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.22)",
                      border: "1px solid rgba(255,255,255,0.35)",
                    },
                    children: accent.label,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", flexDirection: "column", gap: "20px" },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: title.length > 80 ? "52px" : "62px",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "-1.2px",
                      color: "white",
                    },
                    children: title,
                  },
                },
                excerpt
                  ? {
                      type: "div",
                      props: {
                        style: {
                          fontSize: "24px",
                          lineHeight: 1.4,
                          color: "rgba(255,255,255,0.85)",
                          fontWeight: 400,
                        },
                        children: excerpt,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "24px",
                borderTop: "1px solid rgba(255,255,255,0.25)",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: { display: "flex", alignItems: "center", gap: "14px" },
                    children: [
                      {
                        type: "div",
                        props: {
                          style: {
                            width: "52px",
                            height: "52px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "22px",
                            fontWeight: 700,
                          },
                          children: (author.match(/\b\w/g) || ["G"]).slice(0, 2).join("").toUpperCase(),
                        },
                      },
                      {
                        type: "div",
                        props: {
                          style: { display: "flex", flexDirection: "column" },
                          children: [
                            {
                              type: "div",
                              props: {
                                style: { fontSize: "20px", fontWeight: 600, color: "white" },
                                children: `By ${author}`,
                              },
                            },
                            readTime
                              ? {
                                  type: "div",
                                  props: {
                                    style: { fontSize: "16px", color: "rgba(255,255,255,0.75)" },
                                    children: readTime,
                                  },
                                }
                              : null,
                          ].filter(Boolean),
                        },
                      },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: { fontSize: "18px", fontWeight: 600, color: "rgba(255,255,255,0.85)" },
                    children: "getcyberright.com",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630, fonts },
  );

  const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
  return Buffer.from(png);
}

const pngCache = new Map<string, { png: Buffer; ts: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

export async function handleArticleOgImage(req: Request, res: Response) {
  try {
    const slug = (req.params.slug || "").replace(/\.png$/i, "");
    if (!slug) return res.status(400).send("Missing slug");

    const cached = pngCache.get(slug);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=21600, s-maxage=21600");
      return res.end(cached.png);
    }

    const article = await storage.getNewsArticleBySlug(slug);
    if (!article) return res.status(404).send("Article not found");

    const png = await renderOgPng({
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      authorName: article.authorName || "GetCyberRight Team",
      readTime: (article as any).readTime ?? null,
    });

    pngCache.set(slug, { png, ts: Date.now() });
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=21600, s-maxage=21600");
    return res.end(png);
  } catch (err) {
    console.error("[og-image] generation failed", err);
    return res.status(500).send("Failed to generate image");
  }
}
