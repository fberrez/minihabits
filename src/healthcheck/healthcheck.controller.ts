import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/auth.decorator';

@Controller('healthcheck')
export class HealthcheckController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  readiness() {
    return this.health.check([
      async () => this.db.pingCheck('database', { timeout: 300 }),
    ]);
  }
}
