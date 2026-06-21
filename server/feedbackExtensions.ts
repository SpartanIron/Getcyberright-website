import type { Express, Request, Response } from "express";
import { z } from "zod";
import { createRateLimitMiddleware } from "./security";

export function registerFeedbackExtensionRoutes(app: Express) {
  // POST /api/callback-request — after-hours callback scheduling (Rec #4)
  app.post("/api/callback-request", createRateLimitMiddleware("standard"), async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        name: z.string().min(1).max(100),
        phone: z.string().min(7).max(30),
        email: z.string().email().optional().or(z.literal("")),
        urgency: z.enum(["emergency", "urgent", "normal"]).default("normal"),
        message: z.string().max(1000).optional().or(z.literal("")),
        requestedAt: z.string().optional(),
        scheduledFor: z.string().optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
      }

      const { name, phone, email, urgency, message, requestedAt, scheduledFor } = parsed.data;

      // Send admin notification via Resend if configured
      try {
        const { Resend } = await import("resend");
        const resendKey = process.env.RESEND_API_KEY;
        const adminEmail = process.env.ADMIN_EMAIL;
        if (resendKey && adminEmail) {
          const resend = new Resend(resendKey);
          await resend.emails.send({
            from: "GetCyberRight <tips@getcyberright.com>",
            to: [adminEmail],
            subject: `[Callback Request] ${urgency.toUpperCase()} — ${name}`,
            html: `<div style="font-family:-apple-system,sans-serif"><h2>After-Hours Callback Request</h2><p><strong>Name:</strong> ${name}</p><p><strong>Phone:</strong> ${phone}</p>${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}<p><strong>Urgency:</strong> ${urgency}</p>${message ? `<p><strong>Message:</strong> ${message}</p>` : ""}<p><strong>Requested at:</strong> ${requestedAt || new Date().toLocaleString()}</p>${scheduledFor ? `<p><strong>Preferred callback time:</strong> ${scheduledFor}</p>` : ""}</div>`,
          });
        }
      } catch (emailErr) {
        console.error("[callback-request] Email notification error:", emailErr);
      }

      res.json({ success: true, message: "Your callback request has been received. We will contact you shortly." });
    } catch (error: any) {
      console.error("[callback-request] Error:", error);
      res.status(500).json({ error: "Failed to submit callback request. Please try again." });
    }
  });

  // POST /api/satisfaction-pulse — one-tap thumbs up/down on tool results (Rec #5)
  app.post("/api/satisfaction-pulse", createRateLimitMiddleware("standard"), async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        toolName: z.string().min(1).max(100),
        resultId: z.string().max(200).optional().or(z.literal("")),
        rating: z.enum(["up", "down"]),
        comment: z.string().max(1000).optional().or(z.literal("")),
        page: z.string().max(500).optional().or(z.literal("")),
        submittedAt: z.string().optional(),
      });

      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
      }

      const { toolName, resultId, rating, comment, page, submittedAt } = parsed.data;

      console.log(`[satisfaction-pulse] tool=${toolName} rating=${rating} page=${page || "unknown"}`);

      // Alert admin only for negative feedback with a comment
      if (rating === "down" && comment) {
        try {
          const { Resend } = await import("resend");
          const resendKey = process.env.RESEND_API_KEY;
          const adminEmail = process.env.ADMIN_EMAIL;
          if (resendKey && adminEmail) {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: "GetCyberRight <tips@getcyberright.com>",
              to: [adminEmail],
              subject: `[Tool Feedback] Thumbs down on ${toolName}`,
              html: `<div style="font-family:-apple-system,sans-serif"><h2>Negative Tool Feedback</h2><p><strong>Tool:</strong> ${toolName}</p><p><strong>Page:</strong> ${page || "unknown"}</p>${resultId ? `<p><strong>Result ID:</strong> ${resultId}</p>` : ""}<p><strong>Comment:</strong> ${comment}</p><p><strong>Submitted:</strong> ${submittedAt || new Date().toLocaleString()}</p></div>`,
            });
          }
        } catch (emailErr) {
          console.error("[satisfaction-pulse] Email notification error:", emailErr);
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("[satisfaction-pulse] Error:", error);
      res.status(500).json({ error: "Failed to record feedback." });
    }
  });
}
