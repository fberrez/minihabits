import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit, HabitSchema } from './habits.schema';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';
import { StatsModule } from '../stats/stats.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]),
    StatsModule,
    forwardRef(() => BillingModule),
  ],
  providers: [HabitsService, HabitsCounterService, HabitsBooleanService],
  controllers: [HabitsController],
  exports: [HabitsService],
})
export class HabitsModule {}
