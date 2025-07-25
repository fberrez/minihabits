import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export interface SubscriptionConfig {
  plan: SubscriptionPlan;
  name: string;
  price: number; // in EUR cents
  currency: string;
  interval?: string; // null for one-time payments
  habitLimit: number; // -1 for unlimited
  isPopular?: boolean;
}

export const SUBSCRIPTION_CONFIGS: Record<SubscriptionPlan, SubscriptionConfig> = {
  [SubscriptionPlan.FREE]: {
    plan: SubscriptionPlan.FREE,
    name: 'Free',
    price: 0,
    currency: 'EUR',
    habitLimit: 3,
  },
  [SubscriptionPlan.MONTHLY]: {
    plan: SubscriptionPlan.MONTHLY,
    name: 'Monthly',
    price: 199, // €1.99
    currency: 'EUR',
    interval: '1 month',
    habitLimit: -1,
    isPopular: true,
  },
  [SubscriptionPlan.YEARLY]: {
    plan: SubscriptionPlan.YEARLY,
    name: 'Yearly',
    price: 799, // €7.99
    currency: 'EUR',
    interval: '1 year',
    habitLimit: -1,
  },
  [SubscriptionPlan.LIFETIME]: {
    plan: SubscriptionPlan.LIFETIME,
    name: 'Lifetime',
    price: 1799, // €17.99
    currency: 'EUR',
    habitLimit: -1,
  },
};