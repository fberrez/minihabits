import { IsString, IsEnum, IsOptional } from 'class-validator';
import { HabitColor, HabitType } from '../habits.schema';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(HabitColor)
  color?: HabitColor;

  @IsOptional()
  @IsEnum(HabitType)
  type?: HabitType;

  @IsOptional()
  targetCounter?: number;
}
