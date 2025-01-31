import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit, HabitSchema } from './habits.schema';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';
import { HabitsTaskService } from './services/habits.task';
import { StatsModule } from '../stats/stats.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]),
    StatsModule,
    forwardRef(() => UsersModule),
  ],
  providers: [
    HabitsService,
    HabitsCounterService,
    HabitsBooleanService,
    HabitsTaskService,
  ],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}
