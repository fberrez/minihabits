import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum HabitColor {
  RED = '#e57373',
  BLUE = '#64b5f6',
  GREEN = '#81c784',
  YELLOW = '#ffd54f',
  PURPLE = '#ba68c8',
  ORANGE = '#ffb74d',
  PINK = '#f06292',
  TEAL = '#4db6ac',
}

export type HabitDocument = HydratedDocument<Habit>;

@Schema()
export class Habit {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: HabitColor,
    default: HabitColor.BLUE,
    required: true,
  })
  color: HabitColor;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ type: Map, of: Number, default: new Map() })
  completedDates: Map<string, number>;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  longestStreak: number;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
