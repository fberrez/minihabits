import { Module } from '@nestjs/common';
import { HealthcheckController } from './healthcheck.controller';
import { MongooseHealthIndicator, TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthcheckController],
  providers: [MongooseHealthIndicator],
})
export class HealthcheckModule {}
