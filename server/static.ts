import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seoMiddleware } from "./seo-renderer";
import { isKnownRoute } from "./known-routes";
import { resolvePageMeta, injectMeta } from "./seo-meta-resolver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let ssrRender: ((url: string) => string) | null = null;

async function loadSSRModule() {
  try {
    const ssrPath = path.resolve(__dirname, "server", "entry-server.js");
    if (fs.existsSync(ssrPath)) {
      const ssrModule = await import(ssrPath);
      ssrRender = ssrModule.render;
      console.log("[SSR] Production SSR module loaded");
    } else {
      console.warn("[SSR] No SSR bundle found at", ssrPath, "- falling back to client-only rendering");
    }
  } catch (e) {
    console.error("[SSR] Failed to load SSR module:", e instanceof Error ? e.message : e);
  }
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  loadSSRModule();

  app.use(seoMiddleware());

  app.use(express.static(distPath));

  app.use("/{*path}", async (req, res) => {
    const statusCode = isKnownRoute(req.path) ? 200 : 404;
    try {
      const htmlPath = path.resolve(distPath, "index.html");
      let template = await fs.promises.readFile(htmlPath, "utf-8");
      let meta;
      try {
        meta = await resolvePageMeta(req.originalUrl);
      } catch (e) {
        meta = {
          title: "GetCyberRight: Free Cybersecurity Education for Families",
          description: "Protect your family online with free cybersecurity education, AI-powered scam detection tools, and safety training.",
          canonicalUrl: `https://www.getcyberright.com${req.path}`,
          ogType: "website",
          jsonLd: "",
        };
      }
      template = injectMeta(template, meta);

      let ssrHtml = "";
      if (ssrRender) {
        try {
          ssrHtml = ssrRender(req.originalUrl);
        } catch (ssrError) {
          console.error("[SSR] Production render error:", ssrError instanceof Error ? ssrError.message : ssrError);
        }
      }
      template = template.replace("<!--ssr-outlet-->", ssrHtml);

      res.status(statusCode).set({ "Content-Type": "text/html" }).end(template);
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
        res.status(statusCode).set({ "Content-Type": "text/html" }).end(processed);
      } catch {
        res.status(500).send("Server error");
      }
    }
  });
}
