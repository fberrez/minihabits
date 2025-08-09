import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscription } from './schemas/subscription.schema';

export type Entitlements = {
  isPremium: boolean;
  planCode: string | 'free';
  currentPeriodEnd: Date | null;
  maxHabits: number | null;
};

@Injectable()
export class EntitlementsService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
  ) {}

  async getUserEntitlements(userId: string): Promise<Entitlements> {
    const subscription = await this.subscriptionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    if (!subscription) {
      return {
        isPremium: false,
        planCode: 'free',
        currentPeriodEnd: null,
        maxHabits: 3,
      };
    }

    const isLifetime = subscription.planCode === 'premium-lifetime';
    const now = new Date();
    const isActiveRecurring =
      !!subscription.currentPeriodEnd &&
      now < new Date(subscription.currentPeriodEnd) &&
      ['active', 'cancel_at_period_end'].includes(subscription.status);
    const isPremium = isLifetime
      ? subscription.status === 'active'
      : isActiveRecurring;

    return {
      isPremium,
      planCode: subscription.planCode,
      currentPeriodEnd: subscription.currentPeriodEnd ?? null,
      maxHabits: isPremium ? null : 3,
    };
  }
}
