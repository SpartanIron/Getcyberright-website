import { type Express } from "express";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { isKnownRoute } from "./known-routes";
import { resolvePageMeta, injectMeta } from "./seo-meta-resolver";
import { getSSRBodyContent } from "./seo-renderer";

const viteLogger = createLogger();

export async function setupVite(server: Server, app: Express) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server, path: "/vite-hmr" },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("/{*path}", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      let meta;
      let metaResolved = false;
      try {
        meta = await resolvePageMeta(url);
        metaResolved = true;
      } catch {
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
        ssrBody = await getSSRBodyContent(url);
      } catch {}

      template = injectMeta(template, meta, ssrBody);

      const page = await vite.transformIndexHtml(url, template);
      const hasRealContent = metaResolved && !meta.noindex;
      const statusCode = hasRealContent || isKnownRoute(url) ? 200 : 404;
      const cacheHeader = statusCode === 404
        ? "private, no-cache, no-store"
        : "private, max-age=3600, s-maxage=86400";
      res.status(statusCode).set({ 
        "Content-Type": "text/html",
        "Cache-Control": cacheHeader,
        "X-Robots-Tag": statusCode === 200 ? "index, follow" : "noindex, nofollow",
      }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}
