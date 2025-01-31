import { Injectable } from '@nestjs/common';
import stripe from './stripe.lib';
import { UsersService } from 'src/users/users.service';
import { SubscriptionTier } from 'src/users/users.schema';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class StripeService {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async createCheckoutSession(priceId: string, email: string) {
    try {
      const price = await stripe.prices.retrieve(priceId);
      if (!price) {
        throw new Error('Price not found');
      }

      const subscriptionTier = price.lookup_key as SubscriptionTier;

      const mode =
        subscriptionTier === SubscriptionTier.LIFETIME
          ? 'payment'
          : 'subscription';
      const session = await stripe.checkout.sessions.create({
        mode,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        metadata: {
          tier: subscriptionTier,
        },
        allow_promotion_codes: true,
        success_url: `${process.env.FRONTEND_URL}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        customer_email: email,
        customer_creation: mode === 'payment' ? 'always' : undefined,
      });

      return { sessionId: session.id, sessionUrl: session.url };
    } catch (err) {
      throw new Error(`Error creating checkout session: ${err.message}`);
    }
  }

  async cancelSubscription(userId: string) {
    const user = await this.usersService.findById(userId);

    if (!user || user.subscriptionTier === SubscriptionTier.FREE) {
      throw new Error('No active subscription found');
    }

    // Cancel the subscription at the end of the current period
    const subscription = await stripe.subscriptions.update(
      user.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    // Update the user's subscription status in the database
    await this.usersService.cancelSubscription(
      userId,
      new Date(subscription.current_period_end * 1000),
    );
  }

  async verifySession(userId: string, sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== 'complete') {
      throw new Error('Session not complete');
    }

    if (session.payment_status === 'paid') {
      // the subscription tier depends on the priceId
      const tier = session.metadata.tier as SubscriptionTier;
      if (!tier) {
        throw new Error('Tier not found');
      }

      let subscriptionExpiresAt: Date;
      if (
        tier === SubscriptionTier.MONTHLY ||
        tier === SubscriptionTier.YEARLY
      ) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        subscriptionExpiresAt = new Date(
          subscription.current_period_end * 1000,
        );
      }

      await this.usersService.updateSubscriptionTier(
        userId,
        session.customer as string,
        session.subscription as string,
        tier,
        subscriptionExpiresAt,
      );
    }
  }

  async webhook(body: any, signature: string) {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    if (!event) {
      throw new Error('Invalid signature');
    }

    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object;
        const user = await this.usersService.findByStripeCustomerId(
          subscription.customer as string,
        );

        if (!user) {
          throw new Error('User not found');
        }

        const price = await stripe.prices.retrieve(
          subscription.items.data[0].price.id,
        );
        const subscriptionTier = price.lookup_key as SubscriptionTier;

        await this.usersService.updateSubscriptionTier(
          user.id,
          subscription.customer as string,
          subscription.id,
          subscriptionTier,
          new Date(subscription.current_period_end * 1000),
        );

        await this.emailService.sendSubscriptionActivated(
          user.email,
          subscriptionTier,
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const user = await this.usersService.findByStripeCustomerId(
          subscription.customer as string,
        );

        if (!user) {
          throw new Error('User not found');
        }

        await this.usersService.updateSubscriptionTier(
          user.id,
          subscription.customer as string,
          subscription.id,
          SubscriptionTier.FREE,
          null,
        );

        await this.emailService.sendSubscriptionCancelled(
          user.email,
          new Date(subscription.current_period_end * 1000),
        );
        break;
      }

      case 'checkout.session.completed': {
        const session = event.data.object;

        // Handle one-time payments (LIFETIME subscription)
        if (session.mode === 'payment') {
          const price = await stripe.prices.retrieve(
            session.line_items.data[0].price.id,
          );

          if (price.lookup_key === SubscriptionTier.LIFETIME) {
            const user = await this.usersService.findByStripeCustomerId(
              session.customer as string,
            );

            if (!user) {
              throw new Error('User not found');
            }

            await this.usersService.updateSubscriptionTier(
              user.id,
              session.customer as string,
              session.subscription as string,
              SubscriptionTier.LIFETIME,
              null, // Lifetime subscription never expires
            );
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const user = await this.usersService.findByStripeCustomerId(
          invoice.customer as string,
        );

        if (!user) {
          throw new Error('User not found');
        }

        await this.emailService.sendPaymentSucceeded(user.email);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const user = await this.usersService.findByStripeCustomerId(
          invoice.customer as string,
        );

        if (!user) {
          throw new Error('User not found');
        }

        await this.emailService.sendPaymentFailed(user.email);
        break;
      }
    }

    return { received: true };
  }
}
