import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PlanDocument = HydratedDocument<Plan>;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ type: String, required: true, unique: true })
  code: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  priceCents: number;

  @Prop({ type: String, required: true, default: 'EUR' })
  currency: string;

  @Prop({ type: String, required: true, enum: ['month', 'year', 'lifetime'] })
  interval: 'month' | 'year' | 'lifetime';

  @Prop({ type: Boolean, required: true, default: true })
  isActive: boolean;

  @Prop({ type: [String], default: [] })
  features: string[];

  @Prop({ type: Number, default: 0 })
  displayOrder: number;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
