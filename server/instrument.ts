import * as Sentry from "@sentry/node";

// Only initialize Sentry if DSN is configured
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "production",
    // Capture 100% of transactions in production
    tracesSampleRate: 1.0,
    // Send default PII like IP addresses
    sendDefaultPii: false,
  });
}

export { Sentry };
