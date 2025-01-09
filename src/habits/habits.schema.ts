import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HabitDocument = HydratedDocument<Habit>;

@Schema()
export class Habit {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  userId: Types.ObjectId;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
