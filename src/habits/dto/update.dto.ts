import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
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

  @ApiProperty({
    description: 'Description for task-type habits',
    required: false,
    example: 'Complete the project presentation',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Deadline for task-type habits (ISO string)',
    required: false,
    example: '2024-02-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  deadline?: string;
}
