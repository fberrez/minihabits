import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HabitsService } from './habits.service';
import { HabitsController } from './habits.controller';
import { Habit, HabitSchema } from './habits.schema';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Habit.name, schema: HabitSchema }]),
  ],
  providers: [HabitsService, HabitsCounterService, HabitsBooleanService],
  controllers: [HabitsController],
})
export class HabitsModule {}
