import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackHabitDto {
  @ApiProperty({
    description: 'Date to track the habit (ISO string)',
    example: '2024-01-21T00:00:00.000Z',
  })
  @IsDateString()
  date: string;
}
