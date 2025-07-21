import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export class UserSettings {}

export enum SubscriptionTier {
  FREE = 'free',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  PENDING = 'pending',
}

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

  @Prop({ 
    type: String, 
    enum: SubscriptionTier, 
    default: SubscriptionTier.FREE 
  })
  subscriptionTier: SubscriptionTier;

  @Prop({ 
    type: String, 
    enum: SubscriptionStatus, 
    default: SubscriptionStatus.INACTIVE 
  })
  subscriptionStatus: SubscriptionStatus;

  @Prop({ type: Date, required: false })
  subscriptionStartDate?: Date;

  @Prop({ type: Date, required: false })
  subscriptionEndDate?: Date;

  @Prop({ type: String, required: false })
  goCardlessCustomerId?: string;

  @Prop({ type: String, required: false })
  goCardlessSubscriptionId?: string;

  @Prop({ type: Number, default: 3 })
  habitLimit: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
