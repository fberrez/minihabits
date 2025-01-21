import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { Public } from 'src/auth/auth.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('home')
  @Public()
  @ApiOperation({ summary: 'Get home page statistics' })
  @ApiResponse({
    status: 200,
    description: 'Returns general statistics for the home page',
  })
  async getHomeStats() {
    return this.statsService.getHomeStats();
  }
}
