import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createMollieClient, MollieApiError } from '@mollie/api-client';
import type { 
  Customer, 
  Payment, 
  Subscription, 
  PaymentMethod,
} from '@mollie/api-client';

@Injectable()
export class MollieService {
  private readonly logger = new Logger(MollieService.name);
  private readonly mollieClient;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('MOLLIE_API_KEY');
    if (!apiKey) {
      throw new Error('MOLLIE_API_KEY is required');
    }
    
    this.mollieClient = createMollieClient({ apiKey });
    this.logger.log('Mollie client initialized');
  }

  /**
   * Create a new Mollie customer
   */
  async createCustomer(params: any): Promise<Customer> {
    try {
      this.logger.debug(`Creating Mollie customer: ${params.email}`);
      const customer = await this.mollieClient.customers.create(params);
      this.logger.debug(`Created Mollie customer: ${customer.id}`);
      return customer;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create Mollie customer: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a Mollie customer by ID
   */
  async getCustomer(customerId: string): Promise<Customer> {
    try {
      this.logger.debug(`Fetching Mollie customer: ${customerId}`);
      return await this.mollieClient.customers.get(customerId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get Mollie customer: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a one-time payment
   */
  async createPayment(params: any): Promise<Payment> {
    try {
      this.logger.debug(`Creating Mollie payment: ${params.amount?.value} ${params.amount?.currency}`);
      const payment = await this.mollieClient.payments.create(params);
      this.logger.debug(`Created Mollie payment: ${payment.id}`);
      return payment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create Mollie payment: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a payment by ID
   */
  async getPayment(paymentId: string): Promise<Payment> {
    try {
      this.logger.debug(`Fetching Mollie payment: ${paymentId}`);
      return await this.mollieClient.payments.get(paymentId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get Mollie payment: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(customerId: string, params: any): Promise<Subscription> {
    try {
      this.logger.debug(`Creating Mollie subscription for customer: ${customerId}`);
      const subscription = await this.mollieClient.customerSubscriptions.create(params, { customerId });
      this.logger.debug(`Created Mollie subscription: ${subscription.id}`);
      return subscription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to create Mollie subscription: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a subscription by ID
   */
  async getSubscription(customerId: string, subscriptionId: string): Promise<Subscription> {
    try {
      this.logger.debug(`Fetching Mollie subscription: ${subscriptionId}`);
      return await this.mollieClient.customerSubscriptions.get(subscriptionId, { customerId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get Mollie subscription: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(customerId: string, subscriptionId: string): Promise<Subscription> {
    try {
      this.logger.debug(`Cancelling Mollie subscription: ${subscriptionId}`);
      const subscription = await this.mollieClient.customerSubscriptions.cancel(subscriptionId, { customerId });
      this.logger.debug(`Cancelled Mollie subscription: ${subscriptionId}`);
      return subscription;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to cancel Mollie subscription: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get available payment methods
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      this.logger.debug('Fetching available payment methods');
      const methods = await this.mollieClient.methods.list();
      return methods;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to get payment methods: ${errorMessage}`);
      if (error instanceof MollieApiError) {
        throw new Error(`Mollie API Error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    try {
      // Note: Mollie webhook signature verification would go here
      // For now, we'll implement basic validation
      // In production, you should verify the webhook signature properly
      return signature && signature.length > 0;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to verify webhook signature: ${errorMessage}`);
      return false;
    }
  }
}