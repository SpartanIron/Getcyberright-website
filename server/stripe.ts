import Stripe from "stripe";
import type { Express, Request, Response } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const PRICE_MAP: Record<string, { tier: string; name: string; amount: number; interval: "month" | "year" }> = {
  essential_monthly: { tier: "essential", name: "GCR Scam Guard Pro", amount: 599, interval: "month" },
  professional_monthly: { tier: "professional", name: "GCR Scam Guard Family", amount: 1199, interval: "month" },
};

let stripe: Stripe | null = null;
let priceIds: Record<string, string> = {};

function getStripe(): Stripe {
  if (!stripe) {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripe = new Stripe(STRIPE_SECRET_KEY);
  }
  return stripe;
}

async function ensureProductsAndPrices(): Promise<Record<string, string>> {
  if (Object.keys(priceIds).length > 0) return priceIds;

  const s = getStripe();

  const existingProducts = await s.products.list({ active: true, limit: 100 });
  const existingPrices = await s.prices.list({ active: true, limit: 100, expand: ["data.product"] });

  for (const [key, config] of Object.entries(PRICE_MAP)) {
    const existingPrice = existingPrices.data.find((p) => {
      const product = p.product as Stripe.Product;
      return (
        product.metadata?.gcr_tier === config.tier &&
        p.unit_amount === config.amount &&
        p.recurring?.interval === config.interval
      );
    });

    if (existingPrice) {
      priceIds[key] = existingPrice.id;
      continue;
    }

    let product = existingProducts.data.find((p) => p.metadata?.gcr_tier === config.tier);
    if (!product) {
      product = await s.products.create({
        name: config.name,
        metadata: { gcr_tier: config.tier },
      });
    }

    const price = await s.prices.create({
      product: product.id,
      unit_amount: config.amount,
      currency: "usd",
      recurring: { interval: config.interval },
      metadata: { gcr_tier: config.tier },
    });

    priceIds[key] = price.id;
  }

  console.log("Stripe products/prices ready:", priceIds);
  return priceIds;
}

async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const s = getStripe();

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const existing = await s.customers.list({ email, limit: 1 });
  let customerId: string;

  if (existing.data.length > 0) {
    customerId = existing.data[0].id;
  } else {
    const customer = await s.customers.create({
      email,
      metadata: { gcr_user_id: userId },
    });
    customerId = customer.id;
  }

  await db.update(users).set({
    stripeCustomerId: customerId,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));

  return customerId;
}

export function registerStripeRoutes(app: Express) {
  if (!STRIPE_SECRET_KEY) {
    console.log("Stripe routes skipped: STRIPE_SECRET_KEY not set");
    return;
  }

  app.post("/api/stripe/create-checkout", isAuthenticated, async (req: any, res: Response) => {
    try {
      const s = getStripe();
      const user = req.user;
      const { planId, returnPath } = req.body;

      if (!planId || !PRICE_MAP[planId]) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      const prices = await ensureProductsAndPrices();
      const priceId = prices[planId];

      if (!priceId) {
        return res.status(500).json({ error: "Price configuration error" });
      }

      const customerId = await getOrCreateStripeCustomer(user.id, user.email);

      const existingSubs = await s.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 1,
      });

      if (existingSubs.data.length > 0) {
        return res.status(400).json({
          error: "You already have an active subscription. Manage it from your dashboard.",
        });
      }

      const host = req.headers.host;
      const baseUrl = `https://${host}`;

      const session = await s.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}${returnPath === "/data-shield-pricing" ? "/data-shield-pricing" : "/gcr-guard-pricing"}`,
        metadata: {
          gcr_user_id: user.id,
          gcr_tier: PRICE_MAP[planId].tier,
        },
        subscription_data: {
          metadata: {
            gcr_user_id: user.id,
            gcr_tier: PRICE_MAP[planId].tier,
          },
        },
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe checkout error:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/stripe/create-portal", isAuthenticated, async (req: any, res: Response) => {
    try {
      const s = getStripe();
      const userId = req.user.id;

      const [dbUser] = await db.select({ stripeCustomerId: users.stripeCustomerId }).from(users).where(eq(users.id, userId)).limit(1);
      if (!dbUser?.stripeCustomerId) {
        return res.status(400).json({ error: "No billing account found" });
      }

      const host = req.headers.host;
      const baseUrl = `https://${host}`;

      const session = await s.billingPortal.sessions.create({
        customer: dbUser.stripeCustomerId,
        return_url: `${baseUrl}/dashboard`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Stripe portal error:", error);
      res.status(500).json({ error: "Failed to create portal session" });
    }
  });

  app.get("/api/stripe/checkout-status", isAuthenticated, async (req: any, res: Response) => {
    try {
      const s = getStripe();
      const sessionId = req.query.session_id as string;

      if (!sessionId) {
        return res.status(400).json({ error: "Session ID required" });
      }

      const session = await s.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
      });

      if (session.metadata?.gcr_user_id !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const subscription = session.subscription as Stripe.Subscription;
      const tier = session.metadata?.gcr_tier || "essential";

      res.json({
        status: session.payment_status,
        tier,
        subscriptionId: subscription?.id,
      });
    } catch (error: any) {
      console.error("Checkout status error:", error);
      res.status(500).json({ error: "Failed to check status" });
    }
  });
}

export function registerStripeWebhook(app: Express) {
  if (!STRIPE_SECRET_KEY) return;

  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        console.warn("Stripe webhook received but STRIPE_WEBHOOK_SECRET not configured");
        return res.status(200).json({ received: true, warning: "Webhook secret not configured" });
      }

      const s = getStripe();
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        return res.status(400).json({ error: "Missing stripe-signature header" });
      }

      let event: Stripe.Event;

      try {
        const rawBody = (req as any).rawBody;
        if (!rawBody) {
          return res.status(400).json({ error: "Raw body not available for signature verification" });
        }
        event = s.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ error: "Webhook signature verification failed" });
      }

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.gcr_user_id;
            const tier = session.metadata?.gcr_tier || "essential";

            if (userId && session.subscription) {
              const subscription = await s.subscriptions.retrieve(session.subscription as string);
              const periodEnd = new Date(subscription.current_period_end * 1000);

              await db.update(users).set({
                subscriptionTier: tier,
                subscriptionExpiresAt: periodEnd,
                stripeCustomerId: session.customer as string,
                updatedAt: new Date(),
              }).where(eq(users.id, userId));

              console.log(`Subscription activated: user=${userId}, tier=${tier}, expires=${periodEnd.toISOString()}`);
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.gcr_user_id;

            if (userId) {
              const tier = subscription.metadata?.gcr_tier || "essential";
              const periodEnd = new Date(subscription.current_period_end * 1000);
              const isActive = subscription.status === "active" || subscription.status === "trialing";

              await db.update(users).set({
                subscriptionTier: isActive ? tier : "free",
                subscriptionExpiresAt: periodEnd,
                updatedAt: new Date(),
              }).where(eq(users.id, userId));

              console.log(`Subscription updated: user=${userId}, tier=${isActive ? tier : "free"}, status=${subscription.status}`);
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.gcr_user_id;

            if (userId) {
              await db.update(users).set({
                subscriptionTier: "free",
                subscriptionExpiresAt: null,
                updatedAt: new Date(),
              }).where(eq(users.id, userId));

              console.log(`Subscription canceled: user=${userId}`);
            }
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
              const subscription = await s.subscriptions.retrieve(invoice.subscription as string);
              const userId = subscription.metadata?.gcr_user_id;

              if (userId) {
                const periodEnd = new Date(subscription.current_period_end * 1000);
                await db.update(users).set({
                  subscriptionExpiresAt: periodEnd,
                  updatedAt: new Date(),
                }).where(eq(users.id, userId));

                console.log(`Subscription renewed: user=${userId}, expires=${periodEnd.toISOString()}`);
              }
            }
            break;
          }

          case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            const customerId = invoice.customer as string;
            console.warn(`Payment failed for customer: ${customerId}`);
            break;
          }

          default:
            break;
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error("Webhook processing error:", error);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    }
  );
}
