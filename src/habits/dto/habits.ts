import { ApiProperty } from '@nestjs/swagger';
import { HabitType } from '../habits.schema';
import { IsNumber, IsString } from 'class-validator';
import { IsEnum } from 'class-validator';

export class HabitTypeOutput {
  @ApiProperty({
    description: 'Type of the habit',
    enum: HabitType,
    required: true,
    example: HabitType.BOOLEAN,
  })
  @IsEnum(HabitType)
  @IsString()
  type: HabitType;

  @ApiProperty({
    description: 'Label of the habit',
    required: true,
    example: 'Boolean',
  })
  @IsString()
  label: string;
}

export class HabitStatsOutput {
  @ApiProperty({
    description: 'Name of the habit',
    required: true,
    example: 'Do 10 pushups',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Type of the habit',
    enum: HabitType,
    required: true,
    example: HabitType.BOOLEAN,
  })
  @IsEnum(HabitType)
  @IsString()
  type: HabitType;

  @ApiProperty({
    description: 'Target counter value for counter-type habits',
    required: false,
    example: 10,
  })
  @IsNumber()
  targetCounter?: number;

  @ApiProperty({
    description: 'Current streak of the habit',
    required: true,
    example: 10,
  })
  @IsNumber()
  currentStreak: number;

  @ApiProperty({
    description: 'Longest streak of the habit',
    required: true,
    example: 10,
  })
  @IsNumber()
  longestStreak: number;

  @ApiProperty({
    description: 'Completion rate of the habit in the last 7 days',
    required: true,
    example: 0.5,
  })
  @IsNumber()
  completionRate7Days: number;

  @ApiProperty({
    description: 'Completion rate of the habit in the current month',
    required: true,
    example: 0.5,
  })
  @IsNumber()
  completionRateMonth: number;

  @ApiProperty({
    description: 'Completion rate of the habit in the current year',
    required: true,
    example: 0.5,
  })
  @IsNumber()
  completionRateYear: number;

  @ApiProperty({
    description: 'Total completions of the habit',
    required: true,
    example: 10,
  })
  @IsNumber()
  completions: number;
}
