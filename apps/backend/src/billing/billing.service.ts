import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/users.schema';
import { Habit } from '../habits/habits.schema';
import { MollieService } from '../mollie/mollie.service';
import { SubscriptionPlan } from './enums/subscription-plan.enum';
import { SubscriptionStatus } from './enums/subscription-status.enum';
import { SUBSCRIPTION_CONFIGS, SubscriptionConfig } from './interfaces/subscription-config.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { CreateSubscriptionResponseDto } from './dto/create-subscription-response.dto';
import { SubscriptionLimitsDto } from './dto/subscription-limits.dto';
import { SubscriptionPlanInfoDto } from './dto/subscription-plan-info.dto';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    private readonly mollieService: MollieService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Get all available subscription plans
   */
  async getSubscriptionPlans(): Promise<SubscriptionPlanInfoDto[]> {
    this.logger.debug('Fetching subscription plans');
    
    return Object.values(SUBSCRIPTION_CONFIGS).map(config => ({
      plan: config.plan,
      name: config.name,
      price: config.price,
      currency: config.currency,
      interval: config.interval,
      habitLimit: config.habitLimit,
      isPopular: config.isPopular,
      formattedPrice: this.formatPrice(config.price, config.currency),
    }));
  }

  /**
   * Get user's subscription limits and current usage
   */
  async getSubscriptionLimits(userId: string): Promise<SubscriptionLimitsDto> {
    this.logger.debug(`Fetching subscription limits for user: ${userId}`);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentHabits = await this.habitModel.countDocuments({ userId });
    const config = SUBSCRIPTION_CONFIGS[user.subscriptionPlan];

    return {
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      habitLimit: config.habitLimit,
      currentHabits,
      canCreateHabits: config.habitLimit === -1 || currentHabits < config.habitLimit,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
    };
  }

  /**
   * Check if user can create a new habit
   */
  async canCreateHabit(userId: string): Promise<boolean> {
    this.logger.debug(`Checking habit creation limits for user: ${userId}`);

    const limits = await this.getSubscriptionLimits(userId);
    return limits.canCreateHabits;
  }

  /**
   * Create a new subscription or one-time payment
   */
  async createSubscription(userId: string, createSubscriptionDto: CreateSubscriptionDto): Promise<CreateSubscriptionResponseDto> {
    this.logger.debug(`Creating subscription for user: ${userId}, plan: ${createSubscriptionDto.plan}`);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const config = SUBSCRIPTION_CONFIGS[createSubscriptionDto.plan];
    if (!config) {
      throw new BadRequestException('Invalid subscription plan');
    }

    // Don't allow creating subscription for FREE plan
    if (createSubscriptionDto.plan === SubscriptionPlan.FREE) {
      throw new BadRequestException('Cannot create subscription for free plan');
    }

    // Ensure user has a Mollie customer
    let mollieCustomerId = user.mollieCustomerId;
    if (!mollieCustomerId) {
      const customer = await this.mollieService.createCustomer({
        name: user.email.split('@')[0], // Use email prefix as name
        email: user.email,
      });
      mollieCustomerId = customer.id;
      
      await this.userModel.findByIdAndUpdate(userId, {
        mollieCustomerId: customer.id,
      });
    }

    const baseUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const webhookUrl = this.configService.get<string>('WEBHOOK_URL', 'http://localhost:3001/billing/webhook');

    // Create payment or subscription based on plan type
    if (createSubscriptionDto.plan === SubscriptionPlan.LIFETIME) {
      // One-time payment for lifetime plan
      const payment = await this.mollieService.createPayment({
        amount: {
          currency: config.currency,
          value: (config.price / 100).toFixed(2), // Convert cents to euros
        },
        description: `MiniHabits ${config.name} Plan`,
        redirectUrl: createSubscriptionDto.redirectUrl || `${baseUrl}/billing/success`,
        cancelUrl: createSubscriptionDto.cancelUrl || `${baseUrl}/billing/cancel`,
        webhookUrl: createSubscriptionDto.webhookUrl || webhookUrl,
        metadata: {
          userId,
          plan: createSubscriptionDto.plan,
          type: 'lifetime',
        },
        customerId: mollieCustomerId,
      });

      // Update user with pending payment info
      await this.userModel.findByIdAndUpdate(userId, {
        molliePaymentId: payment.id,
        subscriptionStatus: SubscriptionStatus.PENDING,
      });

      return {
        checkoutUrl: payment.getCheckoutUrl()!,
        paymentId: payment.id,
        message: 'Lifetime payment created successfully',
      };
    } else {
      // Recurring subscription for monthly/yearly plans
      const subscription = await this.mollieService.createSubscription(mollieCustomerId, {
        amount: {
          currency: config.currency,
          value: (config.price / 100).toFixed(2),
        },
        interval: config.interval!,
        description: `MiniHabits ${config.name} Subscription`,
        webhookUrl: createSubscriptionDto.webhookUrl || webhookUrl,
        metadata: {
          userId,
          plan: createSubscriptionDto.plan,
          type: 'subscription',
        },
      });

      // Update user with subscription info
      await this.userModel.findByIdAndUpdate(userId, {
        mollieSubscriptionId: subscription.id,
        subscriptionStatus: SubscriptionStatus.PENDING,
      });

      // Create initial payment for the subscription
      const payment = await this.mollieService.createPayment({
        amount: {
          currency: config.currency,
          value: (config.price / 100).toFixed(2),
        },
        description: `MiniHabits ${config.name} Subscription - Initial Payment`,
        redirectUrl: createSubscriptionDto.redirectUrl || `${baseUrl}/billing/success`,
        cancelUrl: createSubscriptionDto.cancelUrl || `${baseUrl}/billing/cancel`,
        webhookUrl: createSubscriptionDto.webhookUrl || webhookUrl,
        metadata: {
          userId,
          plan: createSubscriptionDto.plan,
          type: 'subscription',
          subscriptionId: subscription.id,
        },
        customerId: mollieCustomerId,
      });

      return {
        checkoutUrl: payment.getCheckoutUrl()!,
        paymentId: payment.id,
        message: 'Subscription created successfully',
      };
    }
  }

  /**
   * Cancel user's subscription
   */
  async cancelSubscription(userId: string): Promise<{ message: string }> {
    this.logger.debug(`Cancelling subscription for user: ${userId}`);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.mollieSubscriptionId) {
      throw new BadRequestException('No active subscription found');
    }

    if (!user.mollieCustomerId) {
      throw new BadRequestException('No Mollie customer found');
    }

    // Cancel subscription in Mollie
    await this.mollieService.cancelSubscription(user.mollieCustomerId, user.mollieSubscriptionId);

    // Update user subscription status
    await this.userModel.findByIdAndUpdate(userId, {
      subscriptionStatus: SubscriptionStatus.CANCELLED,
      subscriptionCancelledAt: new Date(),
    });

    this.logger.log(`Subscription cancelled for user: ${userId}`);
    return { message: 'Subscription cancelled successfully' };
  }

  /**
   * Process webhook events from Mollie
   */
  async processWebhook(paymentId: string): Promise<void> {
    this.logger.debug(`Processing webhook for payment: ${paymentId}`);

    try {
      const payment = await this.mollieService.getPayment(paymentId);
      const metadata = payment.metadata as any;

      if (!metadata?.userId) {
        this.logger.warn(`No userId in payment metadata: ${paymentId}`);
        return;
      }

      const userId = metadata.userId;
      const plan = metadata.plan as SubscriptionPlan;
      const type = metadata.type;

      this.logger.debug(`Payment status: ${payment.status}, userId: ${userId}, plan: ${plan}`);

      if (payment.status === 'paid') {
        // Payment successful
        const config = SUBSCRIPTION_CONFIGS[plan];
        const now = new Date();
        
        let subscriptionEndDate: Date | undefined;
        if (plan === SubscriptionPlan.MONTHLY) {
          subscriptionEndDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        } else if (plan === SubscriptionPlan.YEARLY) {
          subscriptionEndDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        }
        // Lifetime has no end date

        await this.userModel.findByIdAndUpdate(userId, {
          subscriptionPlan: plan,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          subscriptionStartDate: now,
          subscriptionEndDate,
          molliePaymentId: payment.id,
        });

        this.logger.log(`Subscription activated for user: ${userId}, plan: ${plan}`);
      } else if (['failed', 'expired', 'canceled'].includes(payment.status)) {
        // Payment failed
        await this.userModel.findByIdAndUpdate(userId, {
          subscriptionStatus: SubscriptionStatus.EXPIRED,
        });

        this.logger.log(`Payment failed for user: ${userId}, payment: ${paymentId}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to process webhook: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Format price for display
   */
  private formatPrice(priceInCents: number, currency: string): string {
    const price = priceInCents / 100;
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }
}