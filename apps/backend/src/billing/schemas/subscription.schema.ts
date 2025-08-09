import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'cancel_at_period_end'
  | 'expired'
  | 'incomplete'
  | 'past_due';

@Schema({ timestamps: true })
export class Subscription {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  planCode: string;

  @Prop({ type: String, required: true })
  status: SubscriptionStatus;

  @Prop({ type: Date, required: false, default: null })
  currentPeriodEnd?: Date | null;

  @Prop({ type: Boolean, required: false, default: false })
  cancelAtPeriodEnd?: boolean;

  @Prop({ type: Date, required: false })
  canceledAt?: Date;

  @Prop({ type: String, required: true, default: 'mollie' })
  provider: 'mollie';

  @Prop({ type: String, required: false })
  mollieCustomerId?: string;

  @Prop({ type: String, required: false })
  mollieSubscriptionId?: string;

  @Prop({ type: String, required: false })
  molliePaymentId?: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ userId: 1, status: 1 });
SubscriptionSchema.index({ userId: 1, planCode: 1 });
