import { Controller, Get } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { StatsOutput } from './dto/stats';
import { PublicRoute } from 'src/auth/public-route.decorator';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('home')
  @PublicRoute()
  @ApiOperation({ summary: 'Get home page statistics' })
  @ApiOkResponse({
    description: 'Returns general statistics for the home page',
    type: StatsOutput,
  })
  async getHomeStats(): Promise<StatsOutput> {
    return this.statsService.getHomeStats();
  }
}
