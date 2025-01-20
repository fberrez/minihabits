import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Public } from 'src/auth/auth.decorator';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('home')
  @Public()
  async getHomeStats() {
    return this.statsService.getHomeStats();
  }
}
