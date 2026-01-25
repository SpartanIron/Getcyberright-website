import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { 
  securityHeaders, 
  corsConfig, 
  generalRateLimit, 
  speedLimiter, 
  sanitizeInput,
  securityLogger,
  requestSizeLimiter 
} from "./security/middleware";
import { csrfMiddlewareForAuthRoutes, csrfTokenEndpoint } from "./security/csrf";

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security headers - Apply first
app.use(securityHeaders);

// CORS configuration
app.use(corsConfig);

// Rate limiting and speed limiting
app.use(generalRateLimit);
app.use(speedLimiter);

// Request size limiting
app.use(requestSizeLimiter);

// Input sanitization
app.use(...sanitizeInput);

// Security logging
app.use(securityLogger);

// Cookie parsing for CSRF protection
app.use(cookieParser());

// Body parsing with security limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req: any, res, buf) => {
    // Store raw body for signature verification if needed
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: false, 
  limit: '10mb',
  parameterLimit: 20 
}));

// CSRF protection for authenticated routes
app.use(csrfMiddlewareForAuthRoutes);

// CSRF token endpoint
app.get('/api/csrf-token', csrfTokenEndpoint);

// Health check endpoints for domain verification
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

app.get('/.well-known/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Security.txt for responsible disclosure (configurable via env vars)
app.get('/.well-known/security.txt', (req, res) => {
  const securityEmail = process.env.SECURITY_CONTACT_EMAIL || 'hello@getcyberright.com';
  const siteUrl = process.env.SITE_URL || 'https://getcyberright.com';
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  
  res.type('text/plain').send(`# Security Policy
# This file follows the security.txt standard (RFC 9116)
# https://securitytxt.org/

Contact: mailto:${securityEmail}
Expires: ${expiryDate.toISOString()}
Preferred-Languages: en
Canonical: ${siteUrl}/.well-known/security.txt

# We appreciate responsible disclosure of security vulnerabilities.
`);
});

app.get('/security.txt', (req, res) => {
  res.redirect('/.well-known/security.txt');
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
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
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = Number(process.env.PORT) || 3000;
  
  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      log('Process terminated');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    log('SIGINT received, shutting down gracefully');
    server.close(() => {
      log('Process terminated');
      process.exit(0);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    console.error(error);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    
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
  });

  // Keep the process alive
  server.keepAliveTimeout = 61000;
  server.headersTimeout = 65000;
})();
