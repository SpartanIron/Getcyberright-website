/**
 * GCR HIBP Routes - API endpoints for breach monitoring and password health
 * These routes power Priority 3, 5, and 7 from the competitive analysis.
 *
 * POST /api/breach/check        - Email breach lookup (requires HIBP_API_KEY)
 * POST /api/password/health     - Password breach check via k-anonymity (free, no key needed)
 * GET  /api/threats/recent-breaches  - Recent breaches for Cyber Threat Radar (free)
 * GET  /api/threats/largest-breaches - Largest breaches for Data Shield context (free)
 */

import type { Express, Request, Response } from "express";
import { z } from "zod";
import {
    checkEmailBreaches,
    checkPasswordHealth,
    getRecentBreaches,
    getLargestBreaches,
} from "./hibp-service";

const emailSchema = z.object({
    email: z.string().email("Please provide a valid email address"),
});

const passwordSchema = z.object({
    password: z.string().min(1, "Password is required").max(500, "Password too long"),
});

export function registerHIBPRoutes(app: Express): void {
    // POST /api/breach/check
  app.post("/api/breach/check", async (req: Request, res: Response) => {
        try {
                const parsed = emailSchema.safeParse(req.body);
                if (!parsed.success) {
                          return res.status(400).json({ error: "Invalid email address", details: parsed.error.issues });
                }
                const result = await checkEmailBreaches(parsed.data.email);
                return res.json(result);
        } catch (error) {
                console.error("[HIBP Routes] /api/breach/check error:", error);
                return res.status(500).json({ error: "Breach check failed. Please try again.", breachCount: 0, riskLevel: "none" });
        }
  });

  // POST /api/password/health
  app.post("/api/password/health", async (req: Request, res: Response) => {
        try {
                const parsed = passwordSchema.safeParse(req.body);
                if (!parsed.success) {
                          return res.status(400).json({ error: "Invalid request", details: parsed.error.issues });
                }
                const result = await checkPasswordHealth(parsed.data.password);
                return res.json(result);
        } catch (error) {
                console.error("[HIBP Routes] /api/password/health error:", error);
                return res.status(500).json({ error: "Password health check failed.", pwned: false, riskLevel: "safe" });
        }
  });

  // GET /api/threats/recent-breaches
  app.get("/api/threats/recent-breaches", async (req: Request, res: Response) => {
        try {
                const days = Math.min(parseInt((req.query.days as string) || "30", 10), 90);
                const breaches = await getRecentBreaches(days);
                return res.json({ breaches, count: breaches.length, source: "HaveIBeenPwned", generatedAt: new Date().toISOString() });
        } catch (error) {
                console.error("[HIBP Routes] /api/threats/recent-breaches error:", error);
                return res.status(500).json({ breaches: [], count: 0, error: "Failed to fetch breach data." });
        }
  });

  // GET /api/threats/largest-breaches
  app.get("/api/threats/largest-breaches", async (req: Request, res: Response) => {
        try {
                const limit = Math.min(parseInt((req.query.limit as string) || "10", 10), 50);
                const breaches = await getLargestBreaches(limit);
                return res.json({ breaches, count: breaches.length, source: "HaveIBeenPwned", generatedAt: new Date().toISOString() });
        } catch (error) {
                console.error("[HIBP Routes] /api/threats/largest-breaches error:", error);
                return res.status(500).json({ breaches: [], count: 0, error: "Failed to fetch breach data." });
        }
  });
}
