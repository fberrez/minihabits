import { IsDateString } from 'class-validator';

export class TrackHabitDto {
  @IsDateString()
  date: string;
}
