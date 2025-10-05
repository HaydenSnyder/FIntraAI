export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'subscription' | 'payment';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_T9WTxtAauVYZAx',
    priceId: 'price_1SDDR0EivTQMi6mCVG9QAEJz',
    name: 'Basic',
    description: 'Unlimited templates with cloud sync and email support',
    price: 9.99,
    currency: 'usd',
    mode: 'subscription'
  },
  {
    id: 'prod_T9WU2OZsRSnslE',
    priceId: 'price_1SDDRNEivTQMi6mCSl1iIvMq',
    name: 'Pro',
    description: 'Everything in Basic plus AI analysis and advanced analytics',
    price: 20.00,
    currency: 'usd',
    mode: 'subscription'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductByName(name: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.name.toLowerCase() === name.toLowerCase());
}