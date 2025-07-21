/* generated */
/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface CreateSubscriptionDto {
  /** The subscription plan ID */
  planId: "monthly" | "yearly" | "lifetime";
  /** URL to redirect to after successful payment setup */
  successRedirectUrl: string;
}

export interface CompleteSubscriptionDto {
  /** The redirect flow ID from GoCardless */
  flowId: string;
  /** The session token from GoCardless */
  sessionToken: string;
  /** The subscription plan ID */
  planId: "monthly" | "yearly" | "lifetime";
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
}

export interface SubscriptionInfo {
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  habitLimit: number;
  canCreateHabits: boolean;
}

export interface CreateSubscriptionResponse {
  redirectUrl: string;
  flowId: string;
}

export class BillingService {
  protected baseURL = 'http://localhost:3000';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async getPlans(): Promise<Plan[]> {
    return this.request<Plan[]>('/billing/plans');
  }

  async getSubscriptionInfo(): Promise<SubscriptionInfo> {
    return this.request<SubscriptionInfo>('/billing/subscription');
  }

  async createSubscription(data: CreateSubscriptionDto): Promise<CreateSubscriptionResponse> {
    return this.request<CreateSubscriptionResponse>('/billing/subscription', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completeSubscription(data: CompleteSubscriptionDto): Promise<any> {
    return this.request<any>('/billing/subscription/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async cancelSubscription(): Promise<any> {
    return this.request<any>('/billing/subscription', {
      method: 'DELETE',
    });
  }
}

export const billingService = new BillingService();