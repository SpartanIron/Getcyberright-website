import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { seoMiddleware } from "./seo-renderer";
import { isKnownRoute } from "./known-routes";
import { resolvePageMeta, injectMeta } from "./seo-meta-resolver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

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
      res.status(statusCode).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      res.status(statusCode).sendFile(path.resolve(distPath, "index.html"));
    }
  });
}
