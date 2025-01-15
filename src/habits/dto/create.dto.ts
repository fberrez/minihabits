import { IsString, IsEnum, IsOptional } from 'class-validator';
import { HabitColor } from '../habits.schema';

export class CreateHabitDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEnum(HabitColor)
  color?: HabitColor;
}
