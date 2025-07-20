import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: String,
    example: '66d060e6777b2b2b2b2b2b2b',
    required: true,
  })
  _id: Types.ObjectId;

  @ApiProperty({ type: String, example: 'Do 10 pushups', required: true })
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty({
    type: String,
    example: '66d060e6777b2b2b2b2b2b2b',
    required: true,
  })
  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @ApiProperty({
    type: String,
    enum: HabitColor,
    default: HabitColor.BLUE,
    required: true,
  })
  @Prop({
    type: String,
    enum: HabitColor,
    default: HabitColor.BLUE,
    required: true,
  })
  color: HabitColor;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
    required: true,
  })
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @ApiProperty({
    type: Object,
    example: { '2023-01-01': 1 },
    required: true,
  })
  @Prop({ type: Map, of: Number, default: new Map() })
  completedDates: Map<string, number>;

  @ApiProperty({ type: Number, example: 0, required: true })
  @Prop({ type: Number, default: 0 })
  currentStreak: number;

  @ApiProperty({ type: Number, example: 0, required: true })
  @Prop({ type: Number, default: 0 })
  longestStreak: number;

  @ApiProperty({
    type: String,
    enum: HabitType,
    default: HabitType.BOOLEAN,
    required: true,
  })
  @Prop({
    type: String,
    enum: HabitType,
    default: HabitType.BOOLEAN,
    required: true,
  })
  type: HabitType;

  @ApiProperty({ type: Number, example: 0 })
  @Prop({
    type: Number,
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
}

export const HabitSchema = SchemaFactory.createForClass(Habit);
