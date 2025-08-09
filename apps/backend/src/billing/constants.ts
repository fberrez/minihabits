export const PLAN_CODES = {
  FREE: 'free',
  PREMIUM_MONTHLY: 'premium-monthly',
  PREMIUM_YEARLY: 'premium-yearly',
  PREMIUM_LIFETIME: 'premium-lifetime',
} as const;

export type PlanCode = (typeof PLAN_CODES)[keyof typeof PLAN_CODES];

export type PlanInterval = 'month' | 'year' | 'lifetime';

export const APP_ERROR_CODES = {
  PAYWALL_LIMIT_REACHED: 'PAYWALL_LIMIT_REACHED',
  BILLING_INVALID_PLAN: 'BILLING_INVALID_PLAN',
  BILLING_PAYMENT_NOT_FOUND: 'BILLING_PAYMENT_NOT_FOUND',
  BILLING_PROVIDER_ERROR: 'BILLING_PROVIDER_ERROR',
  BILLING_NOT_RECURRING: 'BILLING_NOT_RECURRING',
} as const;
