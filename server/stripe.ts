import Stripe from "stripe";
import type { Express, Request, Response } from "express";
import { db } from "./db";
import { users, isFreeAccessPeriod } from "@shared/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "./auth";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

type ProductType = "scamguard" | "shield" | "bundle";

interface PriceConfig {
  product: ProductType;
  tier: string;
  name: string;
  amount: number;
  interval: "month" | "year";
  bundleSgTier?: string;
  bundleDsTier?: string;
}

const PRICE_MAP: Record<string, PriceConfig> = {
  sg_essential_monthly: { product: "scamguard", tier: "essential", name: "GCR Scam Guard Pro", amount: 499, interval: "month" },
  sg_essential_annual: { product: "scamguard", tier: "essential", name: "GCR Scam Guard Pro (Annual)", amount: 4788, interval: "year" },
  sg_professional_monthly: { product: "scamguard", tier: "professional", name: "GCR Scam Guard Family", amount: 799, interval: "month" },
  sg_professional_annual: { product: "scamguard", tier: "professional", name: "GCR Scam Guard Family (Annual)", amount: 7188, interval: "year" },
  ds_essential_monthly: { product: "shield", tier: "essential", name: "GCR Data Shield Essential", amount: 899, interval: "month" },
  ds_essential_annual: { product: "shield", tier: "essential", name: "GCR Data Shield Essential (Annual)", amount: 8388, interval: "year" },
  ds_professional_monthly: { product: "shield", tier: "professional", name: "GCR Data Shield Professional", amount: 1499, interval: "month" },
  ds_professional_annual: { product: "shield", tier: "professional", name: "GCR Data Shield Professional (Annual)", amount: 14388, interval: "year" },
  bundle_complete_monthly: { product: "bundle", tier: "complete", name: "GCR Complete Protection", amount: 1199, interval: "month", bundleSgTier: "essential", bundleDsTier: "essential" },
  bundle_complete_annual: { product: "bundle", tier: "complete", name: "GCR Complete Protection (Annual)", amount: 10788, interval: "year", bundleSgTier: "essential", bundleDsTier: "essential" },
  bundle_total_monthly: { product: "bundle", tier: "total", name: "GCR Total Protection", amount: 1899, interval: "month", bundleSgTier: "professional", bundleDsTier: "professional" },
  bundle_total_annual: { product: "bundle", tier: "total", name: "GCR Total Protection (Annual)", amount: 16788, interval: "year", bundleSgTier: "professional", bundleDsTier: "professional" },
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
        product.metadata?.gcr_product === config.product &&
        product.metadata?.gcr_tier === config.tier &&
        p.unit_amount === config.amount &&
        p.recurring?.interval === config.interval
      );
    });

    if (existingPrice) {
      priceIds[key] = existingPrice.id;
      continue;
    }

    let product = existingProducts.data.find(
      (p) => p.metadata?.gcr_product === config.product && p.metadata?.gcr_tier === config.tier
    );
    if (!product) {
      product = await s.products.create({
        name: config.name,
        metadata: { gcr_product: config.product, gcr_tier: config.tier },
      });
    }

    const price = await s.prices.create({
      product: product.id,
      unit_amount: config.amount,
      currency: "usd",
      recurring: { interval: config.interval },
      metadata: { gcr_product: config.product, gcr_tier: config.tier },
    });

    priceIds[key] = price.id;
  }

  console.log("Stripe products/prices ready:", Object.keys(priceIds).length, "prices");
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

function applySubscriptionUpdate(product: ProductType, tier: string, periodEnd: Date, planKey?: string) {
  if (product === "bundle") {
    const config = planKey ? PRICE_MAP[planKey] : null;
    const sgTier = config?.bundleSgTier || "essential";
    const dsTier = config?.bundleDsTier || "essential";
    return {
      subscriptionTier: sgTier,
      subscriptionExpiresAt: periodEnd,
      shieldSubscriptionTier: dsTier,
      shieldSubscriptionExpiresAt: periodEnd,
      updatedAt: new Date(),
    };
  }
  if (product === "shield") {
    return {
      shieldSubscriptionTier: tier,
      shieldSubscriptionExpiresAt: periodEnd,
      updatedAt: new Date(),
    };
  }
  return {
    subscriptionTier: tier,
    subscriptionExpiresAt: periodEnd,
    updatedAt: new Date(),
  };
}

function applyCancellation(product: ProductType) {
  if (product === "bundle") {
    return {
      subscriptionTier: "free",
      subscriptionExpiresAt: null,
      shieldSubscriptionTier: "free",
      shieldSubscriptionExpiresAt: null,
      updatedAt: new Date(),
    };
  }
  if (product === "shield") {
    return {
      shieldSubscriptionTier: "free",
      shieldSubscriptionExpiresAt: null,
      updatedAt: new Date(),
    };
  }
  return {
    subscriptionTier: "free",
    subscriptionExpiresAt: null,
    updatedAt: new Date(),
  };
}

  // Register all routes but return 503 if Stripe is not yet configured
  const stripeConfigured = !!STRIPE_SECRET_KEY;
  if (!stripeConfigured) {
        console.log("Stripe routes registered in degraded mode: STRIPE_SECRET_KEY not set");
  }

  app.post("/api/stripe/create-checkout", isAuthenticated, async (req: any, res: Response) => {
    try {
      if (isFreeAccessPeriod()) {
        return res.status(400).json({ error: "All features are currently free! No payment needed." });
      }
        if (!stripeConfigured) {
                    return res.status(503).json({ error: "Payment processing is not yet configured. Please contact support or try again later." });
        }
      const s = getStripe();
      const user = req.user;
      const { planId, returnPath } = req.body;

      if (!planId || !PRICE_MAP[planId]) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      const config = PRICE_MAP[planId];
      const prices = await ensureProductsAndPrices();
      const priceId = prices[planId];

      if (!priceId) {
        return res.status(500).json({ error: "Price configuration error" });
      }

      const customerId = await getOrCreateStripeCustomer(user.id, user.email);

      const host = req.headers.host;
      const baseUrl = `https://${host}`;
      const defaultReturnMap: Record<string, string> = { shield: "/data-shield-pricing", bundle: "/pricing", scamguard: "/gcr-guard-pricing" };
      const cancelPath = returnPath || defaultReturnMap[config.product] || "/gcr-guard-pricing";

      const session = await s.checkout.sessions.create({
        customer: customerId,
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}${cancelPath}`,
        metadata: {
          gcr_user_id: user.id,
          gcr_product: config.product,
          gcr_tier: config.tier,
          gcr_plan_key: planId,
        },
        subscription_data: {
          trial_period_days: 30,
          metadata: {
            gcr_user_id: user.id,
            gcr_product: config.product,
            gcr_tier: config.tier,
            gcr_plan_key: planId,
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
      const product = session.metadata?.gcr_product || "scamguard";

      res.json({
        status: session.payment_status,
        tier,
        product,
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
            const product = (session.metadata?.gcr_product || "scamguard") as ProductType;

            if (userId && session.subscription) {
              const subscription = await s.subscriptions.retrieve(session.subscription as string);
              const periodEnd = new Date(subscription.current_period_end * 1000);
              const planKey = session.metadata?.gcr_plan_key;

              await db.update(users).set({
                ...applySubscriptionUpdate(product, tier, periodEnd, planKey),
                stripeCustomerId: session.customer as string,
              }).where(eq(users.id, userId));

              console.log(`Subscription activated: user=${userId}, product=${product}, tier=${tier}, planKey=${planKey}, expires=${periodEnd.toISOString()}`);
            }
            break;
          }

          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.gcr_user_id;

            if (userId) {
              const tier = subscription.metadata?.gcr_tier || "essential";
              const product = (subscription.metadata?.gcr_product || "scamguard") as ProductType;
              const planKey = subscription.metadata?.gcr_plan_key;
              const periodEnd = new Date(subscription.current_period_end * 1000);
              const isActive = subscription.status === "active" || subscription.status === "trialing";

              if (isActive) {
                await db.update(users).set(
                  applySubscriptionUpdate(product, tier, periodEnd, planKey)
                ).where(eq(users.id, userId));
              } else {
                await db.update(users).set(
                  applyCancellation(product)
                ).where(eq(users.id, userId));
              }

              console.log(`Subscription updated: user=${userId}, product=${product}, tier=${isActive ? tier : "free"}, status=${subscription.status}`);
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.gcr_user_id;

            if (userId) {
              const product = (subscription.metadata?.gcr_product || "scamguard") as ProductType;

              await db.update(users).set(
                applyCancellation(product)
              ).where(eq(users.id, userId));

              console.log(`Subscription canceled: user=${userId}, product=${product}`);
            }
            break;
          }

          case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
              const subscription = await s.subscriptions.retrieve(invoice.subscription as string);
              const userId = subscription.metadata?.gcr_user_id;
              const product = (subscription.metadata?.gcr_product || "scamguard") as ProductType;

              if (userId) {
                const periodEnd = new Date(subscription.current_period_end * 1000);
                const tier = subscription.metadata?.gcr_tier || "essential";
                const planKey = subscription.metadata?.gcr_plan_key;

                await db.update(users).set(
                  applySubscriptionUpdate(product, tier, periodEnd, planKey)
                ).where(eq(users.id, userId));

                console.log(`Subscription renewed: user=${userId}, product=${product}, expires=${periodEnd.toISOString()}`);
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
