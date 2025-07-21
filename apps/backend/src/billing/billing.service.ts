import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, SubscriptionTier, SubscriptionStatus } from '../users/users.schema';
import { GoCardlessService } from './gocardless.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private goCardlessService: GoCardlessService,
    private emailService: EmailService,
  ) {}

  async getPlans() {
    const plans = this.goCardlessService.getPlans();
    
    // Convert to frontend-friendly format
    return Object.entries(plans).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      price: plan.amount / 100, // Convert cents to euros
      currency: plan.currency,
      interval: plan.interval,
      features: this.getPlanFeatures(key),
    }));
  }

  async createSubscription(userId: string, planId: string, successRedirectUrl: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const plan = this.goCardlessService.getPlan(planId);
    if (!plan) {
      throw new BadRequestException('Invalid plan');
    }

    try {
      // Create or get GoCardless customer
      let customerId = user.goCardlessCustomerId;
      if (!customerId) {
        const customer = await this.goCardlessService.createCustomer(user.email);
        customerId = customer.id;
        
        // Update user with customer ID
        await this.userModel.findByIdAndUpdate(userId, {
          goCardlessCustomerId: customerId,
        });
      }

      // Create redirect flow
      const redirectFlow = await this.goCardlessService.createRedirectFlow(
        customerId,
        planId,
        successRedirectUrl,
      );

      this.logger.log(`Created redirect flow for user ${userId} with plan ${planId}`);
      
      return {
        redirectUrl: redirectFlow.redirect_url,
        flowId: redirectFlow.id,
      };
    } catch (error) {
      this.logger.error(`Failed to create subscription for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async completeSubscription(userId: string, flowId: string, sessionToken: string, planId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Complete the redirect flow
      const completedFlow = await this.goCardlessService.completeRedirectFlow(flowId, sessionToken);
      const mandateId = completedFlow.links.mandate;

      // Create subscription or one-off payment
      const result = await this.goCardlessService.createSubscription(
        user.goCardlessCustomerId!,
        mandateId,
        planId,
      );

      // Update user subscription
      const subscriptionTier = this.mapPlanToTier(planId);
      const updateData: Partial<User> = {
        subscriptionTier,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionStartDate: new Date(),
        habitLimit: this.getHabitLimit(subscriptionTier),
      };

      // Set subscription ID and end date based on plan
      if (planId === 'lifetime') {
        // For lifetime, no end date and no subscription ID
        updateData.subscriptionEndDate = undefined;
      } else {
        updateData.goCardlessSubscriptionId = result.id;
        updateData.subscriptionEndDate = this.calculateEndDate(planId);
      }

      const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true });

      this.logger.log(`Completed subscription for user ${userId} with tier ${subscriptionTier}`);
      
      // Send welcome email
      try {
        await this.emailService.sendSubscriptionWelcome(user.email, planId);
      } catch (error) {
        this.logger.error(`Failed to send subscription welcome email to ${user.email}: ${error.message}`);
      }
      
      return {
        user: updatedUser,
        subscriptionTier,
        habitLimit: updateData.habitLimit,
      };
    } catch (error) {
      this.logger.error(`Failed to complete subscription for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async cancelSubscription(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.goCardlessSubscriptionId) {
      throw new BadRequestException('No active subscription found');
    }

    try {
      // Cancel in GoCardless
      await this.goCardlessService.cancelSubscription(user.goCardlessSubscriptionId);

      // Update user
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        {
          subscriptionStatus: SubscriptionStatus.CANCELLED,
          goCardlessSubscriptionId: undefined,
        },
        { new: true },
      );

      // Send cancellation email
      try {
        const endDate = user.subscriptionEndDate || new Date();
        await this.emailService.sendSubscriptionCancelled(user.email, user.subscriptionTier, endDate);
      } catch (error) {
        this.logger.error(`Failed to send subscription cancellation email to ${user.email}: ${error.message}`);
      }

      this.logger.log(`Cancelled subscription for user ${userId}`);
      return updatedUser;
    } catch (error) {
      this.logger.error(`Failed to cancel subscription for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async checkUserHabitLimit(userId: string, currentHabitCount: number): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return currentHabitCount < user.habitLimit;
  }

  async getUserSubscriptionInfo(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
      habitLimit: user.habitLimit,
      canCreateHabits: user.subscriptionTier !== SubscriptionTier.FREE || 
        user.subscriptionStatus === SubscriptionStatus.ACTIVE,
    };
  }

  private mapPlanToTier(planId: string): SubscriptionTier {
    const mapping = {
      monthly: SubscriptionTier.MONTHLY,
      yearly: SubscriptionTier.YEARLY,
      lifetime: SubscriptionTier.LIFETIME,
    };
    
    return mapping[planId] || SubscriptionTier.FREE;
  }

  private getHabitLimit(tier: SubscriptionTier): number {
    const limits = {
      [SubscriptionTier.FREE]: 3,
      [SubscriptionTier.MONTHLY]: 999999,
      [SubscriptionTier.YEARLY]: 999999,
      [SubscriptionTier.LIFETIME]: 999999,
    };
    
    return limits[tier] || 3;
  }

  private calculateEndDate(planId: string): Date {
    const now = new Date();
    
    if (planId === 'monthly') {
      now.setMonth(now.getMonth() + 1);
    } else if (planId === 'yearly') {
      now.setFullYear(now.getFullYear() + 1);
    }
    
    return now;
  }

  private getPlanFeatures(planId: string): string[] {
    const features = {
      monthly: [
        'Unlimited habits',
        'All statistics',
        'Data export',
        'Premium support',
      ],
      yearly: [
        'Unlimited habits',
        'All statistics', 
        'Data export',
        'Premium support',
        '2 months free',
      ],
      lifetime: [
        'Unlimited habits',
        'All statistics',
        'Data export', 
        'Premium support',
        'One-time payment',
        'Lifetime updates',
      ],
    };
    
    return features[planId] || [];
  }
}