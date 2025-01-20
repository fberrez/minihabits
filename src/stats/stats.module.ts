import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stats, StatsSchema } from './stats.schema';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stats.name, schema: StatsSchema }]),
  ],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
