import { Controller, Get, Inject } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { PublicRoute } from '../auth/public-route.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
  constructor(
    @Inject(HealthCheckService) private health: HealthCheckService,
    @Inject(MongooseHealthIndicator) private db: MongooseHealthIndicator,
  ) {}

  @PublicRoute()
  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);
  }
}
