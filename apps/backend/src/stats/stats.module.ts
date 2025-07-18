import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Stats, StatsSchema } from './stats.schema';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stats.name, schema: StatsSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
