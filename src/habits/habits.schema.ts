import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum HabitColor {
  RED = '#ff8c82',
  BLUE = '#99c1f1',
  GREEN = '#8ff0a4',
  YELLOW = '#f9c74f',
  PURPLE = '#dc8add',
  ORANGE = '#ffa94d',
  PINK = '#ffadc6',
  TEAL = '#94ebcd',
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
