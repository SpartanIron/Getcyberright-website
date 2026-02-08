import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
<<<<<<< HEAD
import compression from "compression";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
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

const app = express();

// Trust proxy for Replit - required for secure cookies behind proxy
app.set('trust proxy', 1);

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Security: Configure Helmet security headers first
configureHelmet(app);

// Performance: Enable gzip compression for responses
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Security: Request size limiting (100KB for JSON, 50KB for forms)
app.use(requestSizeLimiter(102400));

// Security: Parse cookies for session management
app.use(cookieParser());

// Security: Logging middleware
app.use(securityLoggingMiddleware);

// Security: API anomaly detection (MITRE ATT&CK T1071)
app.use(apiAnomalyDetection);

// Body parsing with size limits
app.use(
  express.json({
    limit: "100kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

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
=======
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
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e

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

<<<<<<< HEAD
=======
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
      log(logLine);
    }
  });

  next();
});

(async () => {
<<<<<<< HEAD
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

    return res.status(status).json({ message });
=======
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
<<<<<<< HEAD
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
=======
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
>>>>>>> 156a695b986f8c5988d46e759385fa11907cfe5e
})();
