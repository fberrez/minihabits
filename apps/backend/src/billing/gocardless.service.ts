import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as gocardless from 'gocardless-nodejs';

export interface BillingPlan {
  id: string;
  name: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one_off';
  intervalUnit: number;
}

@Injectable()
export class GoCardlessService {
  private readonly logger = new Logger(GoCardlessService.name);
  private client: any;
  
  // Plan definitions - amounts in cents
  private readonly plans: Record<string, BillingPlan> = {
    monthly: {
      id: 'monthly_plan',
      name: 'Monthly Plan',
      amount: 199, // €1.99 in cents
      currency: 'EUR',
      interval: 'monthly',
      intervalUnit: 1,
    },
    yearly: {
      id: 'yearly_plan', 
      name: 'Yearly Plan',
      amount: 899, // €8.99 in cents
      currency: 'EUR',
      interval: 'yearly',
      intervalUnit: 1,
    },
    lifetime: {
      id: 'lifetime_plan',
      name: 'Lifetime Plan', 
      amount: 1799, // €17.99 in cents
      currency: 'EUR',
      interval: 'one_off',
      intervalUnit: 1,
    },
  };

  constructor(private configService: ConfigService) {
    const accessToken = this.configService.get<string>('GOCARDLESS_ACCESS_TOKEN');
    const environment = this.configService.get<string>('GOCARDLESS_ENVIRONMENT', 'sandbox');
    
    if (!accessToken) {
      this.logger.warn('GoCardless access token not configured');
      return;
    }

    this.client = gocardless(
      accessToken,
      environment as 'live' | 'sandbox'
    );
  }

  async createCustomer(email: string, givenName?: string, familyName?: string) {
    try {
      const customer = await this.client.customers.create({
        email,
        given_name: givenName || '',
        family_name: familyName || '',
        country_code: 'FR', // Default to France, can be made configurable
      });
      
      this.logger.log(`Created GoCardless customer: ${customer.id} for ${email}`);
      return customer;
    } catch (error) {
      this.logger.error(`Failed to create customer: ${error.message}`);
      throw error;
    }
  }

  async createRedirectFlow(customerId: string, planId: string, successRedirectUrl: string) {
    try {
      const plan = this.plans[planId];
      if (!plan) {
        throw new Error(`Unknown plan: ${planId}`);
      }

      const redirectFlow = await this.client.redirectFlows.create({
        description: `MiniHabits ${plan.name}`,
        session_token: this.generateSessionToken(),
        success_redirect_url: successRedirectUrl,
        prefilled_customer: {
          id: customerId,
        },
      });

      this.logger.log(`Created redirect flow: ${redirectFlow.id} for customer: ${customerId}`);
      return redirectFlow;
    } catch (error) {
      this.logger.error(`Failed to create redirect flow: ${error.message}`);
      throw error;
    }
  }

  async completeRedirectFlow(flowId: string, sessionToken: string) {
    try {
      const completedFlow = await this.client.redirectFlows.complete(flowId, {
        session_token: sessionToken,
      });

      this.logger.log(`Completed redirect flow: ${flowId}`);
      return completedFlow;
    } catch (error) {
      this.logger.error(`Failed to complete redirect flow: ${error.message}`);
      throw error;
    }
  }

  async createSubscription(customerId: string, mandateId: string, planId: string) {
    try {
      const plan = this.plans[planId];
      if (!plan) {
        throw new Error(`Unknown plan: ${planId}`);
      }

      if (plan.interval === 'one_off') {
        // For lifetime plan, create a one-off payment instead of subscription
        return this.createOneOffPayment(customerId, mandateId, planId);
      }

      const subscription = await this.client.subscriptions.create({
        amount: plan.amount,
        currency: plan.currency,
        interval_unit: plan.interval,
        name: `MiniHabits ${plan.name}`,
        links: {
          mandate: mandateId,
        },
      });

      this.logger.log(`Created subscription: ${subscription.id} for customer: ${customerId}`);
      return subscription;
    } catch (error) {
      this.logger.error(`Failed to create subscription: ${error.message}`);
      throw error;
    }
  }

  async createOneOffPayment(customerId: string, mandateId: string, planId: string) {
    try {
      const plan = this.plans[planId];
      if (!plan) {
        throw new Error(`Unknown plan: ${planId}`);
      }

      const payment = await this.client.payments.create({
        amount: plan.amount,
        currency: plan.currency,
        description: `MiniHabits ${plan.name}`,
        links: {
          mandate: mandateId,
        },
      });

      this.logger.log(`Created one-off payment: ${payment.id} for customer: ${customerId}`);
      return payment;
    } catch (error) {
      this.logger.error(`Failed to create one-off payment: ${error.message}`);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const cancelledSubscription = await this.client.subscriptions.cancel(subscriptionId);
      this.logger.log(`Cancelled subscription: ${subscriptionId}`);
      return cancelledSubscription;
    } catch (error) {
      this.logger.error(`Failed to cancel subscription: ${error.message}`);
      throw error;
    }
  }

  async getSubscription(subscriptionId: string) {
    try {
      return await this.client.subscriptions.find(subscriptionId);
    } catch (error) {
      this.logger.error(`Failed to get subscription: ${error.message}`);
      throw error;
    }
  }

  async getCustomer(customerId: string) {
    try {
      return await this.client.customers.find(customerId);
    } catch (error) {
      this.logger.error(`Failed to get customer: ${error.message}`);
      throw error;
    }
  }

  getPlans(): Record<string, BillingPlan> {
    return this.plans;
  }

  getPlan(planId: string): BillingPlan | null {
    return this.plans[planId] || null;
  }

  private generateSessionToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}