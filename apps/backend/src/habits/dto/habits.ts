import { ApiProperty } from '@nestjs/swagger';
import { HabitType } from '../habits.schema';
import { IsNumber, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';

export class HabitTypeOutput {
  @ApiProperty({
    type: String,
    description: 'Type of the habit',
    enum: HabitType,
    required: true,
    example: HabitType.BOOLEAN,
  })
  @IsEnum(HabitType)
  @IsString()
  type: HabitType;

  @ApiProperty({
    type: String,
    description: 'Label of the habit',
    required: true,
    example: 'Boolean',
  })
  @IsString()
  label: string;
}

export class HabitStatsOutput {
  @ApiProperty({
    type: String,
    description: 'Name of the habit',
    required: true,
    example: 'Do 10 pushups',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Type of the habit',
    enum: HabitType,
    required: true,
    example: HabitType.BOOLEAN,
  })
  @IsEnum(HabitType)
  @IsString()
  type: HabitType;

  @ApiProperty({
    type: Number,
    description: 'Target counter value for counter-type habits',
    required: false,
    example: 10,
  })
  @IsNumber()
  targetCounter?: number;

  @ApiProperty({
    type: Number,
    description: 'Current streak of the habit',
    required: true,
    example: 10,
  })
  @IsNumber()
  currentStreak: number;

  @ApiProperty({
    type: Number,
    description: 'Longest streak of the habit',
    required: true,
    example: 10,
  })
  @IsNumber()
  longestStreak: number;

  @ApiProperty({
    type: Number,
    description: 'Completion rate of the habit in the last 7 days',
    required: true,
    example: 0.5,
  })
  @IsNumber()
  completionRate7Days: number;

  @ApiProperty({
    type: Number,
    description: 'Completion rate of the habit in the current month',
    required: true,
    example: 0.5,
  })
  @IsNumber()
  completionRateMonth: number;

  @ApiProperty({
    type: Number,
    description: 'Completion rate of the habit in the current year',
    required: true,
    example: 0.5,
  })
  @IsNumber()
  completionRateYear: number;

  @ApiProperty({
    type: Number,
    description: 'Total completions of the habit',
    required: true,
    example: 10,
  })
  @IsNumber()
  completions: number;
}
