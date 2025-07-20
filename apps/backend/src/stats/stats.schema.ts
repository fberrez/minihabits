import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type StatsDocument = HydratedDocument<Stats>;

@Schema()
export class Stats {
  _id: Types.ObjectId;

  @ApiProperty({
    type: Number,
    required: true,
    example: 2024,
  })
  @Prop({ type: Number, required: true })
  year: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  @Prop({ type: Number, required: true, min: 1, max: 12 })
  month: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 1,
  })
  @Prop({ type: Number, required: true, min: 1, max: 31 })
  day: number;

  @ApiProperty({
    type: Number,
    required: true,
    example: 150,
  })
  @Prop({ type: Number, default: 0 })
  totalCompleted: number;
}

export const StatsSchema = SchemaFactory.createForClass(Stats);

// Create a compound index for date fields to ensure uniqueness and faster queries
StatsSchema.index({ year: 1, month: 1, day: 1 }, { unique: true });
