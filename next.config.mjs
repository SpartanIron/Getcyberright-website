import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

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
        destination: '/gcr-guard-pricing',
        permanent: false,
      },
    ];
  },


  allowedDevOrigins: [
    "924e6b5f-16e9-49c9-929b-489d2a4ca32f-00-bgwqvqdliqo1.kirk.replit.dev",
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

  images: {
    unoptimized: true,
    disableStaticImages: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  env: {
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.VITE_GA_MEASUREMENT_ID || "",
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.VITE_RECAPTCHA_SITE_KEY || "",
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || "",
  },
};

export default nextConfig;
