import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubscriptionPlan } from '../billing/enums/subscription-plan.enum';
import { SubscriptionStatus } from '../billing/enums/subscription-status.enum';

export type UserDocument = HydratedDocument<User>;

export class UserSettings {}

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Object, required: false, default: {} })
  settings: UserSettings;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: String, required: false })
  passwordResetToken?: string;

  @Prop({ type: Date, required: false })
  passwordResetExpires?: Date;

  // Subscription fields
  @Prop({ 
    type: String, 
    enum: Object.values(SubscriptionPlan),
    default: SubscriptionPlan.FREE 
  })
  subscriptionPlan: SubscriptionPlan;

  @Prop({ 
    type: String, 
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.ACTIVE 
  })
  subscriptionStatus: SubscriptionStatus;

  @Prop({ type: String, required: false })
  mollieCustomerId?: string;

  @Prop({ type: String, required: false })
  mollieSubscriptionId?: string;

  @Prop({ type: String, required: false })
  molliePaymentId?: string;

  @Prop({ type: Date, required: false })
  subscriptionStartDate?: Date;

  @Prop({ type: Date, required: false })
  subscriptionEndDate?: Date;

  @Prop({ type: Date, required: false })
  subscriptionCancelledAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
