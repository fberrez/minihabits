import { Injectable } from '@nestjs/common';
import { HabitDocument, HabitType } from '../habits.schema';
import * as moment from 'moment';
import { StatsService } from '../../stats/stats.service';

@Injectable()
export class HabitsTaskService {
  constructor(private readonly statsService: StatsService) {}

  async trackHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.TASK) {
      throw new Error('This habit is not a task type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');

    // For task type, we use 1 to indicate completion
    if (habit.completedDates.get(targetDate) === 1) {
      return habit;
    }
    habit.completedDates.set(targetDate, 1);

    // For tasks, current streak is always 0 or 1 since they are single-use
    habit.currentStreak = 1;
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    await this.statsService.incrementTotalCompleted(date);
  }

  async untrackHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.TASK) {
      throw new Error('This habit is not a task type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    habit.completedDates.delete(targetDate);

    // For tasks, current streak becomes 0 when uncompleted
    habit.currentStreak = 0;

    await habit.save();
    await this.statsService.decrementTotalCompleted(date);
  }
}
