import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export const PLANS = {
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    name: 'Pro',
    price: 299, // cents
    features: [
      'Claude AI (higher quality)',
      '200 generations/month',
      '300 AI edits/month',
      'No watermark',
      'Custom URL slugs',
    ],
  },
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Gemini Flash AI',
      '10 generations/month',
      'Manual editing only',
      'Tempsite watermark',
      'Auto-generated URLs',
    ],
  },
} as const;
