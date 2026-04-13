import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import { runMigrations } from "./migrate";
import { registerRoutes } from "./routes";
import { createServer } from "http";
import {
  configureHelmet,
  securityLoggingMiddleware,
  csrfProtection,
  requestSizeLimiter,
  registerSecurityEndpoints,
  registerSecurityMetricsEndpoint,
  apiAnomalyDetection,
  securityLogger,
} from "./security";
import { antiScrapingHeaders, botProtection, corsConfig } from "./security/middleware";
import { setupFonts } from "./fontSetup";
import next from "next";
import path from "path";

setupFonts();

const app = express();

// Trust proxy for Replit - required for secure cookies behind proxy
app.set('trust proxy', 1);

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Security: Configure Helmet (CSP handled by Next.js middleware for nonce support)
configureHelmet(app);

// Security: CORS - explicit whitelist for cross-origin requests (browser extension, etc.)
app.use(corsConfig);

// Performance: Enable gzip compression for responses
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Security: Request size limiting (100KB for JSON, 50KB for forms)
// Exempt image upload endpoint which needs up to 10MB for screenshot analysis
app.use((req, res, next) => {
  if (req.path === "/api/security/analyze-image" || req.path === "/api/security/visual-analyze") return next();
  return requestSizeLimiter(102400)(req, res, next);
});

app.get("/__health", (_req, res) => {
  res.status(200).json({ status: "ok", ts: Date.now() });
});

// Security: Parse cookies for session management
app.use(cookieParser());

// Security: Logging middleware
app.use(securityLoggingMiddleware);

// Security: API anomaly detection (MITRE ATT&CK T1071)
app.use(apiAnomalyDetection);

// Security: Anti-scraping headers for API routes
app.use(antiScrapingHeaders);

// Security: Block known scraper bots from API endpoints
app.use(botProtection);

// Body parsing with size limits
// Image upload endpoint has its own route-level parser with 10MB limit
app.use((req, res, next) => {
  if (req.path === "/api/security/analyze-image" || req.path === "/api/security/visual-analyze") return next();
  express.json({
    limit: "100kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })(req, res, next);
});

app.use(express.urlencoded({ extended: false, limit: "50kb" }));

// Security: CSRF protection for POST/PUT/DELETE requests
app.use(csrfProtection);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const CANONICAL_HOST = "www.getcyberright.com";
const PRODUCTION_DOMAIN = process.env.PRODUCTION_DOMAIN || CANONICAL_HOST;

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production" || process.env.REPL_SLUG) {
    const host = (req.hostname || req.headers.host || "").replace(/:\d+$/, "");
    const proto = req.protocol || (req.headers["x-forwarded-proto"] as string) || "https";

    if (host === PRODUCTION_DOMAIN || host === CANONICAL_HOST) {
      if (proto !== "https") {
        const target = `https://${CANONICAL_HOST}${req.originalUrl}`;
        return res.redirect(301, target);
      }
    } else if (
      host === "getcyberright.com" ||
      host === PRODUCTION_DOMAIN.replace(/^www\./, "")
    ) {
      const target = `https://${CANONICAL_HOST}${req.originalUrl}`;
      return res.redirect(301, target);
    }
  }

  const p = req.path;
  if (p !== "/" && p.endsWith("/") && !p.startsWith("/api/")) {
    const stripped = p.slice(0, -1);
    if (!/^\/[a-zA-Z0-9\-_/.]+$/.test(stripped) || stripped.includes("//")) {
      return next();
    }
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
    return res.redirect(301, stripped + query);
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const sensitiveRoutes = [
    "/api/auth",
    "/api/user",
    "/api/vault",
    "/api/shield/scan",
    "/api/subscription",
    "/api/extension/subscription",
    "/api/admin/users",
  ];

  const isSensitive = sensitiveRoutes.some((r) => path.startsWith(r));

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    if (!isSensitive) {
      capturedJsonResponse = bodyJson;
    }
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Run database migrations before any routes or queries
  await runMigrations();

  // Register security testing endpoints
  registerSecurityEndpoints(app);
  
  // Register security metrics endpoint for monitoring
  registerSecurityMetricsEndpoint(app);
  
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ error: message });
  });

  const isDev = process.env.NODE_ENV !== "production";
  if (!isDev) {
    console.log("[server] Running in production mode (NODE_ENV=production)");
  }

  const port = parseInt(process.env.PORT || "5000", 10);

  let nextReady = false;
  let nextHandler: any = null;

  if (!isDev) {
    const nextStaticDir = path.resolve(process.cwd(), ".next/static");
    app.use("/_next/static", express.static(nextStaticDir, {
      maxAge: "1y",
      immutable: true,
    }));
  }

  app.use(
    express.static(path.resolve(process.cwd(), "client/public"), {
      index: false,
      maxAge: isDev ? "0" : "1y",
      immutable: !isDev,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".html")) {
          res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        }
      },
    })
  );

  app.all("/{*path}", (req, res) => {
    if (nextHandler && nextReady) {
      return nextHandler(req, res);
    }
    if (req.path.startsWith("/_next/static/")) {
      return res.status(404).end();
    }
    res.status(503).setHeader("Retry-After", "2").send(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="2"><title>Loading...</title></head>` +
      `<body style="background:#060d1a;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui">` +
      `<div style="text-align:center"><h2>Starting up...</h2><p style="opacity:.7">The server is warming up. This page will refresh automatically.</p></div></body></html>`
    );
  });

  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    httpServer.close(() => {
      log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    httpServer.close(() => {
      log('Process terminated');
      process.exit(0);
    });
  });

  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    console.error(error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port} (accepting requests, Next.js preparing...)`);

      const nextApp = next({ dev: isDev, dir: process.cwd() });
      nextApp.prepare().then(() => {
        nextHandler = nextApp.getRequestHandler();
        nextReady = true;
        log(`Next.js ready in ${isDev ? "development" : "production"} mode`);

        const warmPaths = ["/", "/scam-intelligence"];
        warmPaths.forEach((p) => {
          fetch(`http://127.0.0.1:${port}${p}`)
            .then((res) => log(`[warmup] Pre-warmed ${p} (${res.status})`))
            .catch(() => {});
        });
      }).catch((err) => {
        log(`Next.js failed to initialize: ${err.message}`);
        console.error(err);
      });

      // Seed AI prompts on first startup
      import("./promptSeed").then(({ seedAiPrompts }) => {
        seedAiPrompts();
      }).catch(err => {
        console.error("Failed to seed AI prompts:", err);
      });

      // Seed initial content (guides, scam intel, alerts)
      import("./contentSeed").then(({ seedInitialContent }) => {
        return seedInitialContent();
      }).catch(err => {
        console.error("Failed to seed initial content:", err);
      });

      // Seed badge definitions for gamification
      import("./badgeSeed").then(({ seedBadgeDefinitions }) => {
        seedBadgeDefinitions();
      }).catch(err => {
        console.error("Failed to seed badge definitions:", err);
      });

      // Migrate any unencrypted vault data to encrypted storage
      import("./vaultEncryption").then(({ migrateUnencryptedVaultData }) => {
        migrateUnencryptedVaultData();
      }).catch(err => {
        console.error("Failed to migrate vault encryption:", err);
      });

      // Generate social posts for any published content that doesn't have them
      import("./socialPostSeed").then(({ seedSocialPosts, backfillSocialPostLinks }) => {
        seedSocialPosts().then(() => backfillSocialPostLinks());
      }).catch(err => {
        console.error("Failed to seed social posts:", err);
      });

      import("./imageStorage").then(({ bulkUploadExistingImages }) => {
        const socialImagesDir = path.join(process.cwd(), ".local", "social-images");
        bulkUploadExistingImages(socialImagesDir).catch(err => {
          console.error("[ImageStorage] Bulk upload failed:", err);
        });
      }).catch(() => {});

      // Start prompt review scheduler (runs weekly - every 168 hours)
      import("./promptReviewService").then(({ startPromptReviewScheduler }) => {
        startPromptReviewScheduler(168);
      }).catch(err => {
        console.error("Failed to start prompt review scheduler:", err);
      });

      // Start breach monitoring scheduler (checks every 24 hours)
      import("./breach-monitor").then(({ startBreachMonitoringScheduler }) => {
        startBreachMonitoringScheduler(24);
      }).catch(err => {
        console.error("Failed to start breach monitoring scheduler:", err);
      });

      // Start security alert fetcher (checks every 6 hours)
      import("./security-alert-fetcher").then(({ securityAlertFetcher }) => {
        securityAlertFetcher.startScheduler();
      }).catch(err => {
        console.error("Failed to start security alert fetcher:", err);
      });

      // Start trending threat auto-refresh (every 6 hours)
      import("./trendingThreatService").then(({ startThreatRefreshScheduler }) => {
        startThreatRefreshScheduler();
      }).catch(err => {
        console.error("Failed to start trending threat scheduler:", err);
      });

      // Start growth orchestrator (processes tasks every 15 min, schedules daily)
      import("./growthOrchestrator").then(({ startGrowthOrchestrator }) => {
        startGrowthOrchestrator();
      }).catch(err => {
        console.error("Failed to start growth orchestrator:", err);
      });

      // Start engagement discovery scheduler (scans every 4 hours)
      import("./engagementDiscoveryService").then(({ startEngagementDiscoveryScheduler }) => {
        startEngagementDiscoveryScheduler();
      }).catch(err => {
        console.error("Failed to start engagement discovery scheduler:", err);
      });

      // GCR Data Shield: 90-day auto-purge (runs daily)
      import("./shieldScanService").then(({ purgeExpiredScans }) => {
        async function runPurge() {
          try {
            const { purgedCount } = await purgeExpiredScans();
            if (purgedCount > 0) {
              console.log(`[shield-purge] Soft-deleted ${purgedCount} scans older than 90 days`);
            }
          } catch (err: any) {
            console.error("[shield-purge] Error:", err?.message || err);
          }
        }
        runPurge();
        setInterval(runPurge, 24 * 60 * 60 * 1000);
        console.log("[shield-purge] 90-day auto-purge scheduler started (daily)");
      }).catch(err => {
        console.error("Failed to start shield purge scheduler:", err);
      });

      // GCR Data Shield: Re-scan scheduler (runs every 6 hours)
      import("../jobs/rescan.job").then(({ executeRescanJob }) => {
        async function runRescan() {
          try {
            await executeRescanJob();
          } catch (err: any) {
            console.error("[rescan-scheduler] Error:", err?.message || err);
          }
        }
        setInterval(runRescan, 6 * 60 * 60 * 1000);
        console.log("[rescan-scheduler] Re-scan job scheduler started (every 6 hours)");
      }).catch(err => {
        console.error("Failed to start rescan scheduler:", err);
      });
    },
  );

  import("./newsArticleService").then(({ startNewsScheduler }) => {
    startNewsScheduler();
  }).catch(err => {
    console.error("Failed to start news scheduler:", err);
  });

  import("./security/platformPostureEngine").then(({ startPostureScheduler }) => {
    startPostureScheduler();
  }).catch(err => {
    console.error("Failed to start posture scanner:", err);
  });

  import("./scamIntelAggregator").then(({ startScamIntelScheduler }) => {
    startScamIntelScheduler();
  }).catch(err => {
    console.error("Failed to start scam intel aggregator:", err);
  });

  httpServer.keepAliveTimeout = 61000;
  httpServer.headersTimeout = 65000;
})();
