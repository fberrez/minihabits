import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Plan } from './schemas/plan.schema';
import { Payment } from './schemas/payment.schema';
import { Subscription } from './schemas/subscription.schema';
import { PLAN_CODES, PlanCode } from './constants';
import { User } from '../users/users.schema';
import { EmailService } from '../email/email.service';
import { computeNextPeriodEnd } from './utils/date';
import { CheckoutDto } from './dto/checkout.dto';

// Import Mollie lazily to avoid issues in tests when key is missing
const createMollieClient = async () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { createMollieClient } = require('@mollie/api-client');
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
};

@Injectable()
export class BillingService implements OnModuleInit {
  private readonly logger = new Logger(BillingService.name);

  constructor(
    @InjectModel(Plan.name) private readonly planModel: Model<Plan>,
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.seedPlans();
    } catch (err) {
      this.logger.warn(`Failed to seed plans: ${String(err)}`);
    }
  }

  async seedPlans(): Promise<void> {
    const existing = await this.planModel.find().lean().exec();
    if (existing.length > 0) {
      return;
    }
    const plans: Array<Partial<Plan>> = [
      {
        code: PLAN_CODES.FREE,
        name: 'Free',
        priceCents: 0,
        currency: 'EUR',
        interval: 'lifetime',
        isActive: true,
        displayOrder: 0,
      },
      {
        code: PLAN_CODES.PREMIUM_MONTHLY,
        name: 'Premium Monthly',
        priceCents: 299,
        currency: 'EUR',
        interval: 'month',
        isActive: true,
        displayOrder: 1,
      },
      {
        code: PLAN_CODES.PREMIUM_YEARLY,
        name: 'Premium Yearly',
        priceCents: 899,
        currency: 'EUR',
        interval: 'year',
        isActive: true,
        displayOrder: 2,
      },
      {
        code: PLAN_CODES.PREMIUM_LIFETIME,
        name: 'Premium Lifetime',
        priceCents: 1799,
        currency: 'EUR',
        interval: 'lifetime',
        isActive: true,
        displayOrder: 3,
      },
    ];
    await this.planModel.insertMany(plans);
  }

  async listActivePlans(): Promise<Plan[]> {
    return this.planModel
      .find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean()
      .exec();
  }

  async createCheckoutSession(params: {
    userId: string;
    planCode: string;
  }): Promise<{ checkoutUrl: string }> {
    const { userId, planCode } = params;
    const plan = await this.planModel
      .findOne({ code: planCode, isActive: true })
      .lean()
      .exec();
    if (!plan || plan.code === PLAN_CODES.FREE) {
      throw new BadRequestException('Invalid plan');
    }

    const mollie = await createMollieClient();
    // Get user email
    const user = await this.userModel
      .findById(new Types.ObjectId(userId))
      .lean()
      .exec();
    if (!user?.email) {
      throw new BadRequestException('User email not found');
    }
    const redirectUrl = `${process.env.FRONTEND_URL}/billing/return`;
    const webhookUrlBase = `${process.env.APP_PUBLIC_URL}/billing/webhook`;
    const webhookUrl = process.env.MOLLIE_WEBHOOK_SECRET
      ? `${webhookUrlBase}?secret=${encodeURIComponent(process.env.MOLLIE_WEBHOOK_SECRET)}`
      : webhookUrlBase;

    const amount = {
      currency: plan.currency,
      value: (plan.priceCents / 100).toFixed(2),
    };

    if (plan.interval === 'lifetime') {
      const payment = await mollie.payments.create({
        amount,
        description: `MiniHabits ${plan.name}`,
        redirectUrl,
        webhookUrl,
        metadata: { userId, planCode: plan.code, intent: 'lifetime' },
      });
      return { checkoutUrl: payment.getCheckoutUrl() };
    }

    // Recurring: first payment via checkout
    // Try to find existing customer by email; if not found, create
    let customer = null as any;
    try {
      const search = await mollie.customers.list({ limit: 250 });
      customer =
        search._embedded?.customers?.find((c: any) => c.email === user.email) ??
        null;
    } catch (err) {
      this.logger.warn(`Failed to search customers: ${String(err)}`);
    }
    if (!customer) {
      customer = await mollie.customers.create({
        name: user.email,
        email: user.email,
      });
    }

    // If customer exists, check existing subscriptions on Mollie
    try {
      const subs = await mollie.customers_subscriptions.all({
        customerId: customer.id,
      });
      const activeSub = subs._embedded?.subscriptions?.find(
        (s: any) => s.status === 'active',
      );
      if (activeSub) {
        // Compare with desired plan
        const interval = plan.interval === 'month' ? '1 month' : '1 year';
        const value = (plan.priceCents / 100).toFixed(2);
        const isSame =
          activeSub.interval === interval &&
          activeSub.amount?.currency === plan.currency &&
          activeSub.amount?.value === value;
        if (isSame) {
          throw new BadRequestException(
            'You already have an active subscription for this plan',
          );
        }
      }
    } catch (err) {
      this.logger.warn(
        `Unable to verify existing subscriptions: ${String(err)}`,
      );
    }

    const payment = await mollie.payments.create({
      amount,
      description: `MiniHabits ${plan.name}`,
      redirectUrl,
      webhookUrl,
      sequenceType: 'first',
      customerId: customer.id,
      metadata: { userId, planCode: plan.code, intent: 'recurring_first' },
    });
    return { checkoutUrl: payment.getCheckoutUrl() };
  }

  async handleWebhook(paymentId: string): Promise<void> {
    const mollie = await createMollieClient();
    const payment = await mollie.payments.get(paymentId);
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const metadata = payment.metadata as
      | { userId?: string; planCode?: PlanCode; intent?: string }
      | undefined;
    const userId = metadata?.userId;
    const planCode = metadata?.planCode as PlanCode | undefined;
    if (!userId || !planCode) {
      this.logger.warn(`Missing metadata on payment ${payment.id}`);
      return;
    }

    // Upsert payment record
    await this.paymentModel
      .updateOne(
        { molliePaymentId: payment.id },
        {
          $set: {
            userId: new Types.ObjectId(userId),
            planCode,
            amountCents: Math.round(Number(payment.amount.value) * 100),
            currency: payment.amount.currency,
            status: payment.status,
            metadata: payment.metadata ?? {},
          },
        },
        { upsert: true },
      )
      .exec();

    // Handle states
    if (payment.status === 'paid') {
      const plan = await this.planModel
        .findOne({ code: planCode })
        .lean()
        .exec();
      if (!plan) {
        this.logger.error(`Plan ${planCode} not found during webhook`);
        return;
      }
      if (plan.interval === 'lifetime') {
        await this.subscriptionModel.updateOne(
          { userId: new Types.ObjectId(userId) },
          {
            $set: {
              planCode: plan.code,
              status: 'active',
              currentPeriodEnd: null,
              molliePaymentId: payment.id,
            },
          },
          { upsert: true },
        );
        // Send activation email for lifetime
        try {
          const user = await this.userModel.findById(userId).lean().exec();
          if (user?.email) {
            await this.emailService.sendSubscriptionActivated(
              user.email,
              plan.name,
            );
          }
        } catch (e) {
          this.logger.warn(`Failed to send subscription email: ${String(e)}`);
        }
        return;
      }

      // Recurring: if first payment, create subscription
      const customerId = payment.customerId;
      if (!customerId) {
        this.logger.error('Missing customerId for recurring payment');
        return;
      }
      if ((payment.sequenceType as string) === 'first') {
        const sub = await mollie.customers_subscriptions.create({
          customerId,
          amount: {
            currency: plan.currency,
            value: (plan.priceCents / 100).toFixed(2),
          },
          interval: plan.interval === 'month' ? '1 month' : '1 year',
          description: `MiniHabits ${plan.name}`,
          metadata: { userId, planCode },
          webhookUrl: undefined,
        });
        const currentPeriodEnd = computeNextPeriodEnd(
          plan.interval,
          new Date(),
        );
        await this.subscriptionModel.updateOne(
          { userId: new Types.ObjectId(userId) },
          {
            $set: {
              planCode: plan.code,
              status: 'active',
              mollieCustomerId: customerId,
              mollieSubscriptionId: sub.id,
              currentPeriodEnd,
              cancelAtPeriodEnd: false,
            },
          },
          { upsert: true },
        );
        try {
          const user = await this.userModel.findById(userId).lean().exec();
          if (user?.email) {
            await this.emailService.sendSubscriptionActivated(
              user.email,
              plan.name,
            );
          }
        } catch (e) {
          this.logger.warn(`Failed to send subscription email: ${String(e)}`);
        }
        return;
      }

      // Renewal payment: extend period end
      const subDoc = await this.subscriptionModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      if (subDoc) {
        const next = computeNextPeriodEnd(
          plan.interval as 'month' | 'year',
          subDoc.currentPeriodEnd ?? new Date(),
        );
        subDoc.currentPeriodEnd = next;
        subDoc.status = 'active';
        await subDoc.save();
        try {
          const user = await this.userModel.findById(userId).lean().exec();
          if (user?.email) {
            await this.emailService.sendSubscriptionRenewed(
              user.email,
              plan.name,
              subDoc.currentPeriodEnd,
            );
          }
        } catch (e) {
          this.logger.warn(`Failed to send renewal email: ${String(e)}`);
        }
      }
      return;
    }

    // Non-paid statuses
    if (
      ['failed', 'canceled', 'expired', 'charged_back'].includes(payment.status)
    ) {
      await this.subscriptionModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        {
          $set: {
            status:
              payment.status === 'canceled'
                ? 'cancel_at_period_end'
                : 'expired',
          },
        },
      );
      try {
        const user = await this.userModel.findById(userId).lean().exec();
        if (user?.email) {
          if (payment.status === 'canceled') {
            const sub = await this.subscriptionModel
              .findOne({ userId: new Types.ObjectId(userId) })
              .lean()
              .exec();
            await this.emailService.sendSubscriptionCancellationScheduled(
              user.email,
              sub?.currentPeriodEnd ?? null,
            );
          } else {
            await this.emailService.sendSubscriptionExpired(user.email);
          }
        }
      } catch (e) {
        this.logger.warn(
          `Failed to send subscription status email: ${String(e)}`,
        );
      }
    }
  }

  async getStatus(userId: string) {
    const sub = await this.subscriptionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean()
      .exec();
    if (!sub) {
      return {
        isPremium: false,
        planCode: 'free',
        status: 'none',
        currentPeriodEnd: null,
        canCancel: false,
        cancelAtPeriodEnd: false,
      };
    }
    const isLifetime = sub.planCode === PLAN_CODES.PREMIUM_LIFETIME;
    const now = new Date();
    const isActiveRecurring =
      !!sub.currentPeriodEnd &&
      now < new Date(sub.currentPeriodEnd) &&
      ['active', 'cancel_at_period_end'].includes(sub.status);
    const isPremium = isLifetime ? sub.status === 'active' : isActiveRecurring;
    const canCancel =
      !isLifetime && ['active', 'cancel_at_period_end'].includes(sub.status);
    return {
      isPremium,
      planCode: sub.planCode,
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd ?? null,
      canCancel,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
    };
  }

  async cancel(userId: string) {
    const sub = await this.subscriptionModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .lean()
      .exec();
    if (!sub) {
      throw new NotFoundException('No subscription');
    }
    if (sub.planCode === PLAN_CODES.PREMIUM_LIFETIME) {
      throw new BadRequestException('Lifetime cannot be canceled');
    }
    if (!sub.mollieSubscriptionId || !sub.mollieCustomerId) {
      throw new InternalServerErrorException(
        'Missing provider subscription reference',
      );
    }

    console.log(sub);
    const mollie = await createMollieClient();
    await mollie.customers_subscriptions.cancel(sub.mollieSubscriptionId, {
      customerId: sub.mollieCustomerId,
    });
    await this.subscriptionModel.updateOne(
      { _id: new Types.ObjectId(sub._id) },
      { $set: { status: 'cancel_at_period_end', cancelAtPeriodEnd: true } },
    );
    return { ok: true };
  }
}
