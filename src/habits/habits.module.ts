import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit, HabitSchema } from './habits.schema';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';
import { StatsModule } from '../stats/stats.module';
import { HabitsNegativeBooleanService } from './services/habits.negative-boolean';
import { HabitsNegativeCounterService } from './services/habits.negative-counter';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]),
    StatsModule,
  ],
  providers: [
    HabitsService,
    HabitsCounterService,
    HabitsBooleanService,
    HabitsNegativeBooleanService,
    HabitsNegativeCounterService,
  ],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}
