import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,  typescript: { ignoreBuildErrors: true },

    async redirects() {
          return [
            {
                      source: '/partner-with-us',
                      destination: '/advertise',
                      permanent: true,
            },
            {
                      source: '/scam-guard',
                      destination: '/scam-checker',
                      permanent: true,
            },
            {
                      source: '/educate',
                      destination: '/educators',
                      permanent: true,
            },
            {
                      source: '/protection-hub',
                      destination: '/tools',
                      permanent: true,
      },
            {
                      source: '/pricing',
                      destination: '/',
                      permanent: true,
            },
            {
                      source: '/privacy-policy',
                      destination: '/privacy',
                      permanent: true,
            },
                  // Priority 1: Fix broken tool URLs
            {
                      source: '/breach-monitor',
                      destination: '/breach-dashboard',
                      permanent: false,
            },
            {
                      source: '/data-shield',
                      destination: '/shield',
                      permanent: false,
            },
            {
                      source: '/data-breach-monitor',
                      destination: '/breach-dashboard',
                      permanent: false,
            },
            {
                      source: '/voice-check',
                      destination: '/tools',
                      permanent: false,
            },
            {
                      source: '/threat-radar',
                      destination: '/cyber-threat-radar',
                      permanent: false,
            },
                      // SEO fixes: redirect deprecated/404 URLs to canonical pages
              {
                              source: '/learning-path',
                              destination: '/training',
                              permanent: true,
              },
              {
                              source: '/trend-:id',
                              destination: '/cyber-threat-radar',
                              permanent: true,
              },
                ];
    },

    allowedDevOrigins: [
          "924e6b5f-16e9-49c9-929b-489d2a4ca32f-00-bgwqvqd1iqo1.kirk.replit.dev",
          "*.kirk.replit.dev",
          "*.replit.dev",
        ],

    turbopack: {
          resolveAlias: {
                  "@": path.resolve(__dirname, "client", "src"),
                  "@shared": path.resolve(__dirname, "shared"),
                  "@assets": path.resolve(__dirname, "attached_assets"),
          },
    },

    serverExternalPackages: [
          "drizzle-orm",
          "@neondatabase/serverless",
          "postgres",
          "bcrypt",
          "bcryptjs",
          "sharp",
          "winston",
          "helmet",
          "express-rate-limit",
          "express-session",
          "connect-pg-simple",
          "stripe",
          "resend",
          "openai",
          "archiver",
          "multer",
          "jsdom",
          "tesseract.js",
          "speakeasy",
          "otplib",
          "jsonwebtoken",
          "@simplewebauthn/server",
          "rss-parser",
        ],

    webpack(config) {
          config.resolve.alias = {
                  ...config.resolve.alias,
                  "@": path.resolve(__dirname, "client", "src"),
                  "@shared": path.resolve(__dirname, "shared"),
                  "@assets": path.resolve(__dirname, "attached_assets"),
          };
          return config;
    },
};

export default nextConfig;
