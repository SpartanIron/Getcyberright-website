import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema, insertNewsletterSubscriberSchema, SUBSCRIPTION_TIERS, hasTierAccess, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createRateLimitMiddleware, securityLogger } from "./security";
import { setupAuth, registerAuthRoutes, isAuthenticated, authStorage } from "./replit_integrations/auth";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";

// URL reputation checking schemas with validation
const urlCheckSchema = z.object({
  url: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      // Block localhost, private IPs, and internal networks
      const hostname = parsed.hostname.toLowerCase();
      const blockedPatterns = [
        /^localhost$/,
        /^127\./,
        /^10\./,
        /^172\.(1[6-9]|2\d|3[01])\./,
        /^192\.168\./,
        /^0\./,
        /^169\.254\./,
        /^fc00:/,
        /^fe80:/,
        /^::1$/,
      ];
      return !blockedPatterns.some(p => p.test(hostname));
    } catch {
      return false;
    }
  }, { message: "Private or local URLs are not allowed" })
});

// Rate limiting middleware instances
const strictRateLimit = createRateLimitMiddleware("strict");
const standardRateLimit = createRateLimitMiddleware("standard");

// Fetch with timeout helper
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 10000): Promise<globalThis.Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup Replit Auth (must be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);

  // Contact form - strict rate limiting (10 req/min)
  app.post("/api/contact", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      securityLogger.info("Contact form submission", { email: validatedData.email });
      res.json({ success: true, message });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Newsletter signup - strict rate limiting (10 req/min)
  app.post("/api/newsletter", strictRateLimit, async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      
      const existing = await storage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existing) {
        res.json({ success: true, message: "Already subscribed" });
        return;
      }
      
      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      securityLogger.info("Newsletter subscription", { email: validatedData.email });
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid email address", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to subscribe" });
      }
    }
  });

  // URL reputation check - PhishTank (free, no API key required)
  app.post("/api/security/check-phishtank", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      
      const formData = new URLSearchParams();
      formData.append('url', url);
      formData.append('format', 'json');
      
      const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }, 10000);
      
      if (!response.ok) {
        throw new Error(`PhishTank API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      res.json({
        success: true,
        source: 'PhishTank',
        isPhishing: data.results?.in_database === true && data.results?.valid === true,
        inDatabase: data.results?.in_database || false,
        verified: data.results?.verified || false,
        verifiedAt: data.results?.verified_at || null,
        phishDetailPage: data.results?.phish_detail_page || null
      });
    } catch (error) {
      console.error('PhishTank check error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid URL provided', details: error.errors });
        return;
      }
      res.status(503).json({ 
        success: false, 
        source: 'PhishTank',
        error: 'PhishTank service temporarily unavailable',
        isPhishing: null 
      });
    }
  });

  // URL reputation check - URLhaus (abuse.ch - free, no API key required)
  app.post("/api/security/check-urlhaus", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      
      const formData = new URLSearchParams();
      formData.append('url', url);
      
      const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      }, 10000);
      
      if (!response.ok) {
        throw new Error(`URLhaus API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      res.json({
        success: true,
        source: 'URLhaus',
        isMalware: data.query_status === 'ok',
        queryStatus: data.query_status,
        threat: data.threat || null,
        tags: data.tags || [],
        urlhausReference: data.urlhaus_reference || null,
        dateAdded: data.date_added || null
      });
    } catch (error) {
      console.error('URLhaus check error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid URL provided', details: error.errors });
        return;
      }
      res.status(503).json({ 
        success: false, 
        source: 'URLhaus',
        error: 'URLhaus service temporarily unavailable',
        isMalware: null 
      });
    }
  });

  // Combined URL reputation check
  app.post("/api/security/check-url-reputation", standardRateLimit, async (req, res) => {
    try {
      const { url } = urlCheckSchema.parse(req.body);
      
      // Run both checks in parallel with timeouts
      const [phishTankResult, urlhausResult] = await Promise.allSettled([
        // PhishTank check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          formData.append('format', 'json');
          
          const response = await fetchWithTimeout('https://checkurl.phishtank.com/checkurl/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error('PhishTank API error');
          return response.json();
        })(),
        // URLhaus check
        (async () => {
          const formData = new URLSearchParams();
          formData.append('url', url);
          
          const response = await fetchWithTimeout('https://urlhaus-api.abuse.ch/v1/url/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
          }, 10000);
          
          if (!response.ok) throw new Error('URLhaus API error');
          return response.json();
        })()
      ]);
      
      const phishTank = phishTankResult.status === 'fulfilled' ? {
        checked: true,
        isPhishing: phishTankResult.value.results?.in_database === true && phishTankResult.value.results?.valid === true,
        verified: phishTankResult.value.results?.verified || false,
        detailPage: phishTankResult.value.results?.phish_detail_page || null
      } : { checked: false, isPhishing: null, error: 'Service unavailable' };
      
      const urlhaus = urlhausResult.status === 'fulfilled' ? {
        checked: true,
        isMalware: urlhausResult.value.query_status === 'ok',
        threat: urlhausResult.value.threat || null,
        tags: urlhausResult.value.tags || []
      } : { checked: false, isMalware: null, error: 'Service unavailable' };
      
      // Determine overall threat level
      let threatLevel: 'safe' | 'suspicious' | 'dangerous' | 'unknown' = 'unknown';
      if (phishTank.isPhishing || urlhaus.isMalware) {
        threatLevel = 'dangerous';
      } else if (phishTank.checked && urlhaus.checked && !phishTank.isPhishing && !urlhaus.isMalware) {
        threatLevel = 'safe';
      } else if (phishTank.checked || urlhaus.checked) {
        threatLevel = phishTank.isPhishing === false || urlhaus.isMalware === false ? 'safe' : 'suspicious';
      }
      
      res.json({
        success: true,
        url,
        threatLevel,
        phishTank,
        urlhaus,
        checkedAt: new Date().toISOString()
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid URL", details: error.errors });
      } else {
        console.error('URL reputation check error:', error);
        res.status(500).json({ error: "Failed to check URL reputation" });
      }
    }
  });

  // Get user subscription status (protected route)
  app.get("/api/subscription/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const now = new Date();
      const isExpired = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < now;
      const effectiveTier = isExpired ? "free" : (user.subscriptionTier || "free");
      
      res.json({
        tier: effectiveTier,
        expiresAt: user.subscriptionExpiresAt,
        isExpired,
        availableTiers: Object.values(SUBSCRIPTION_TIERS)
      });
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  });

  // Premium content access check middleware using shared tier hierarchy
  const requireSubscription = (requiredTier: string) => {
    return async (req: any, res: Response, next: Function) => {
      try {
        const userId = req.user?.claims?.sub;
        if (!userId) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        
        const user = await authStorage.getUser(userId);
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        
        const now = new Date();
        const isExpired = user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < now;
        const effectiveTier = isExpired ? "free" : (user.subscriptionTier || "free");
        
        // Use shared tier access helper
        if (!hasTierAccess(effectiveTier, requiredTier)) {
          return res.status(403).json({ 
            error: "Subscription required",
            requiredTier,
            currentTier: effectiveTier
          });
        }
        
        next();
      } catch (error) {
        console.error("Error checking subscription:", error);
        res.status(500).json({ error: "Failed to check subscription" });
      }
    };
  };

  // Example protected premium content endpoints
  app.get("/api/premium/webinar-archive", isAuthenticated, requireSubscription("essential"), async (req, res) => {
    res.json({ 
      message: "Access granted to webinar archive",
      content: [
        { id: 1, title: "Phishing Prevention Masterclass", duration: "45 min" },
        { id: 2, title: "Secure Password Strategies", duration: "30 min" },
        { id: 3, title: "Family Digital Safety Workshop", duration: "60 min" }
      ]
    });
  });

  app.get("/api/premium/training-materials", isAuthenticated, requireSubscription("professional"), async (req, res) => {
    res.json({ 
      message: "Access granted to training materials",
      content: [
        { id: 1, title: "Employee Security Training Kit", type: "PDF" },
        { id: 2, title: "Quarterly Threat Report Q1 2026", type: "PDF" },
        { id: 3, title: "Security Policy Templates", type: "DOCX" }
      ]
    });
  });

  // Get Stripe publishable key for frontend
  app.get("/api/stripe/publishable-key", async (req, res) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      console.error("Error getting Stripe publishable key:", error);
      res.status(500).json({ error: "Stripe not configured" });
    }
  });

  // Create checkout session for subscription
  app.post("/api/stripe/create-checkout-session", isAuthenticated, async (req: any, res) => {
    try {
      const { priceId } = req.body;
      if (!priceId) {
        return res.status(400).json({ error: "Price ID is required" });
      }

      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await authStorage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeService.createCustomer(user.email || '', userId);
        await stripeService.updateUserStripeInfo(userId, { stripeCustomerId: customer.id });
        customerId = customer.id;
      }

      const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
      const baseUrl = domains[0] ? `https://${domains[0]}` : 'http://localhost:5000';

      const session = await stripeService.createCheckoutSession(
        customerId,
        priceId,
        `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        `${baseUrl}/pricing`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Create customer portal session for managing subscriptions
  app.post("/api/stripe/create-portal-session", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await authStorage.getUser(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
      const baseUrl = domains[0] ? `https://${domains[0]}` : 'http://localhost:5000';

      const session = await stripeService.createCustomerPortalSession(
        user.stripeCustomerId,
        `${baseUrl}/dashboard`
      );

      res.json({ url: session.url });
    } catch (error) {
      console.error("Error creating portal session:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  // Get Stripe products and prices for pricing page
  app.get("/api/stripe/products", async (req, res) => {
    try {
      const rows = await stripeService.listProductsWithPrices(true);
      
      const productsMap = new Map();
      for (const row of rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            active: row.product_active,
            metadata: row.product_metadata,
            prices: []
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unitAmount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
            active: row.price_active,
            metadata: row.price_metadata,
          });
        }
      }

      res.json({ products: Array.from(productsMap.values()) });
    } catch (error) {
      console.error("Error fetching Stripe products:", error);
      res.json({ products: [] });
    }
  });

  return httpServer;
}
