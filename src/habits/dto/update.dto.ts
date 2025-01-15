import { IsString, IsEnum, IsOptional } from 'class-validator';
import { HabitColor } from '../habits.schema';

export class UpdateHabitDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(HabitColor)
  color?: HabitColor;
}
