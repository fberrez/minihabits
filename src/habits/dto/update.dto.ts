import { IsString, IsEnum, IsOptional } from 'class-validator';
import { HabitColor } from '../habits.schema';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHabitDto {
  @ApiProperty({
    description: 'New name for the habit',
    required: false,
    example: 'Morning Meditation',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'New color for the habit',
    enum: HabitColor,
    required: false,
    example: HabitColor.BLUE,
  })
  @IsOptional()
  @IsEnum(HabitColor)
  color?: HabitColor;
}
