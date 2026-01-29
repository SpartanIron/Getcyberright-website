import { getUncachableStripeClient } from './stripeClient';

interface ProductConfig {
  name: string;
  description: string;
  tier: string;
  monthlyPrice: number;
  yearlyPrice?: number;
  features: string[];
}

const SUBSCRIPTION_PRODUCTS: ProductConfig[] = [
  {
    name: 'GetCyberRight Essential',
    description: 'Perfect for families wanting comprehensive protection',
    tier: 'essential',
    monthlyPrice: 900,
    yearlyPrice: 9000,
    features: [
      'Ad-free experience',
      'Webinar archive access',
      'Monthly threat briefings',
      'Priority email support'
    ]
  },
  {
    name: 'GetCyberRight Professional',
    description: 'For professionals and small teams requiring advanced tools',
    tier: 'professional',
    monthlyPrice: 2900,
    yearlyPrice: 29000,
    features: [
      'All Essential features',
      'Training materials library',
      'Quarterly threat reports',
      'Security policy templates',
      'Priority phone support'
    ]
  },
  {
    name: 'GetCyberRight Enterprise',
    description: 'Custom solutions for organizations with specific security needs',
    tier: 'enterprise',
    monthlyPrice: 9900,
    yearlyPrice: 99000,
    features: [
      'All Professional features',
      'Custom training modules',
      'Dedicated account manager',
      'API access',
      'White-label options',
      'On-site training'
    ]
  }
];

async function seedStripeProducts() {
  console.log('Starting Stripe product seeding...');
  
  const stripe = await getUncachableStripeClient();

  for (const productConfig of SUBSCRIPTION_PRODUCTS) {
    console.log(`\nProcessing: ${productConfig.name}`);

    const existingProducts = await stripe.products.search({
      query: `name:'${productConfig.name}'`
    });

    if (existingProducts.data.length > 0) {
      console.log(`  Product already exists: ${existingProducts.data[0].id}`);
      continue;
    }

    const product = await stripe.products.create({
      name: productConfig.name,
      description: productConfig.description,
      metadata: {
        tier: productConfig.tier,
        features: JSON.stringify(productConfig.features)
      }
    });
    console.log(`  Created product: ${product.id}`);

    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: productConfig.monthlyPrice,
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        tier: productConfig.tier,
        billing_period: 'monthly'
      }
    });
    console.log(`  Created monthly price: ${monthlyPrice.id} ($${productConfig.monthlyPrice / 100}/mo)`);

    if (productConfig.yearlyPrice) {
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: productConfig.yearlyPrice,
        currency: 'usd',
        recurring: { interval: 'year' },
        metadata: {
          tier: productConfig.tier,
          billing_period: 'yearly'
        }
      });
      console.log(`  Created yearly price: ${yearlyPrice.id} ($${productConfig.yearlyPrice / 100}/yr)`);
    }
  }

  console.log('\nStripe product seeding complete!');
}

seedStripeProducts().catch(console.error);
