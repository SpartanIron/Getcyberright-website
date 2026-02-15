import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWN_CLIENT_ROUTES = new Set([
  "/",
  "/about",
  "/tools",
  "/resources",
  "/contact",
  "/privacy",
  "/terms",
  "/emergency-help",
  "/kids",
  "/seniors",
  "/parents",
  "/parents/child-safety-scanner",
  "/support",
  "/security",
  "/pricing",
  "/dashboard",
  "/threat-trends",
  "/report-scam",
  "/checklists",
  "/data-removal",
  "/advertise",
  "/partner-deck",
  "/training",
  "/training/kids",
  "/training/parents",
  "/training/seniors",
  "/login",
  "/register",
  "/forgot-password",
  "/admin",
  "/admin/users",
  "/admin/messages",
  "/admin/subscribers",
  "/admin/scam-reports",
  "/admin/tool-analytics",
  "/admin/security",
  "/admin/threat-intelligence",
  "/admin/content-governance",
  "/admin/compliance",
  "/admin/newsletter",
  "/admin/change-password",
]);

const DYNAMIC_ROUTE_PREFIXES = [
  "/training/",
];

function isKnownRoute(url: string): boolean {
  const pathname = url.split("?")[0].split("#")[0];
  if (KNOWN_CLIENT_ROUTES.has(pathname)) {
    return true;
  }
  for (const prefix of DYNAMIC_ROUTE_PREFIXES) {
    if (pathname.startsWith(prefix) && pathname.length > prefix.length) {
      return true;
    }
  }
  return false;
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  app.use("/{*path}", (req, res) => {
    const statusCode = isKnownRoute(req.path) ? 200 : 404;
    res.status(statusCode).sendFile(path.resolve(distPath, "index.html"));
  });
}
