import { Stats } from '../stats.schema';
import { ApiProperty } from '@nestjs/swagger';
export class StatsOutput {
  @ApiProperty({
    type: Stats,
    example: {
      year: 2024,
      month: 1,
      day: 1,
      totalCompleted: 150,
    },
  })
  stats: Stats;

  @ApiProperty({ type: Number })
  usersCount: number;
}
