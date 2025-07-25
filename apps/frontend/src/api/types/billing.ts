// Subscription enums matching backend
export enum SubscriptionPlan {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  LIFETIME = 'LIFETIME',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
}

// API response types
export interface SubscriptionPlanInfo {
  plan: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  interval?: string;
  habitLimit: number;
  isPopular?: boolean;
  formattedPrice: string;
}

export interface SubscriptionLimits {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  habitLimit: number;
  currentHabits: number;
  canCreateHabits: boolean;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}

export interface CreateSubscriptionRequest {
  plan: SubscriptionPlan;
  redirectUrl: string;
  cancelUrl?: string;
  webhookUrl?: string;
}

export interface CreateSubscriptionResponse {
  checkoutUrl: string;
  paymentId: string;
  message: string;
}

export interface CancelSubscriptionResponse {
  message: string;
}