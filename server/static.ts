import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { isKnownRoute } from "./known-routes";
import { resolvePageMeta, injectMeta } from "./seo-meta-resolver";
import { getSSRBodyContent } from "./seo-renderer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    index: false,
    maxAge: "1y",
    immutable: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }
    },
  }));

  app.use("/{*path}", async (req, res) => {
    try {
      const htmlPath = path.resolve(distPath, "index.html");
      let template = await fs.promises.readFile(htmlPath, "utf-8");
      let meta;
      let metaResolved = false;
      try {
        meta = await resolvePageMeta(req.originalUrl);
        metaResolved = true;
      } catch (e) {
        meta = {
          title: "GetCyberRight: Free Cybersecurity Education for Families",
          description: "Protect your family online with free cybersecurity education, AI-powered scam detection tools, and safety training.",
          canonicalUrl: `https://www.getcyberright.com${req.path}`,
          ogType: "website",
          jsonLd: "",
        };
      }

      let ssrBody = "";
      try {
        ssrBody = await getSSRBodyContent(req.originalUrl);
      } catch (e) {
        console.error(`[SSR] Failed to generate body for ${req.path}:`, (e as Error).message);
      }

      const hasRealContent = metaResolved && !meta.noindex;
      const statusCode = hasRealContent || isKnownRoute(req.path) ? 200 : 404;

      template = injectMeta(template, meta, ssrBody);

      const cacheHeader = statusCode === 404
        ? "private, no-cache, no-store"
        : "private, max-age=3600, s-maxage=86400";

      res.status(statusCode).set({ 
        "Content-Type": "text/html",
        "Cache-Control": cacheHeader,
        "X-Robots-Tag": statusCode === 200 ? "index, follow" : "noindex, nofollow",
      }).end(template);
    } catch (e) {
      try {
        const rawHtml = await fs.promises.readFile(path.resolve(distPath, "index.html"), "utf-8");
        const fallbackMeta = {
          title: "GetCyberRight: Free Cybersecurity Education for Families",
          description: "Protect your family online with free cybersecurity education, AI-powered scam detection tools, and safety training.",
          canonicalUrl: `https://www.getcyberright.com${req.path}`,
          ogType: "website",
          jsonLd: "",
        };
        const processed = injectMeta(rawHtml, fallbackMeta);
        res.status(isKnownRoute(req.path) ? 200 : 404).set({ "Content-Type": "text/html" }).end(processed);
      } catch {
        res.status(500).send("Server error");
      }
    }
  });
}
