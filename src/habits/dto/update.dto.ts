import { IsString } from 'class-validator';

export class UpdateHabitDto {
  @IsString()
  name: string;
}
