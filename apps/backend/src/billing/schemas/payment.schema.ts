import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

export type PaymentStatus =
  | 'open'
  | 'paid'
  | 'failed'
  | 'canceled'
  | 'expired'
  | 'charged_back';

@Schema({ timestamps: true })
export class Payment {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true })
  planCode: string;

  @Prop({ type: Number, required: true })
  amountCents: number;

  @Prop({ type: String, required: true, default: 'EUR' })
  currency: string;

  @Prop({ type: String, required: true })
  molliePaymentId: string;

  @Prop({ type: String, required: true })
  status: PaymentStatus;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ molliePaymentId: 1 }, { unique: true });
