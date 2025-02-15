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

export enum HabitType {
  BOOLEAN = 'boolean',
  COUNTER = 'counter',
}

export type HabitDocument = HydratedDocument<Habit>;

@Schema()
export class Habit {
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    enum: HabitColor,
    default: HabitColor.BLUE,
    required: true,
  })
  color: HabitColor;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Map, of: Number, default: new Map() })
  completedDates: Map<string, number>;

  @Prop({ default: 0 })
  currentStreak: number;

  @Prop({ default: 0 })
  longestStreak: number;

  @Prop({
    type: String,
    enum: HabitType,
    default: HabitType.BOOLEAN,
    required: true,
  })
  type: HabitType;

  @Prop({
    default: 0,
    validate: {
      validator: function (value: number) {
        // Only require targetCounter > 0 for counter type habits
        if (this.type === HabitType.COUNTER) {
          return value > 0;
        }
        return true;
      },
      message: 'Target counter must be greater than 0 for counter type habits',
    },
  })
  targetCounter: number;

  @Prop({ type: String, required: false })
  description?: string;

  @Prop({ type: Date, required: false })
  deadline?: Date;
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
