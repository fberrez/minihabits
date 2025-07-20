import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { HabitColor, HabitType } from '../habits.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHabitDto {
  @ApiProperty({
    type: String,
    description: 'Name of the habit',
    example: 'Daily Exercise',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Color of the habit',
    enum: HabitColor,
    required: false,
    example: HabitColor.BLUE,
  })
  @IsOptional()
  @IsEnum(HabitColor)
  color?: HabitColor;

  @ApiProperty({
    type: String,
    description: 'Type of the habit',
    enum: HabitType,
    required: false,
    example: HabitType.BOOLEAN,
  })
  @IsOptional()
  @IsEnum(HabitType)
  type?: HabitType;

  @ApiProperty({
    type: Number,
    description:
      'Target counter value for counter-type habits (required for counter-type habits)',
    required: false,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  targetCounter?: number;
}
