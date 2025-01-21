import { Injectable } from '@nestjs/common';
import { HabitDocument, HabitType } from '../habits.schema';
import * as moment from 'moment';
import { StatsService } from '../../stats/stats.service';

@Injectable()
export class HabitsBooleanService {
  constructor(private readonly statsService: StatsService) {}

  async trackHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.BOOLEAN) {
      throw new Error('This habit is not a boolean type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');

    if (habit.completedDates.get(targetDate) === 1) {
      return habit;
    }
    habit.completedDates.set(targetDate, 1);

    habit.currentStreak = this.calculateStreak(habit.completedDates);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    await this.statsService.incrementTotalCompleted(date);
  }

  async untrackHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.BOOLEAN) {
      throw new Error('This habit is not a boolean type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    habit.completedDates.delete(targetDate);

    habit.currentStreak = this.calculateStreak(habit.completedDates);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    await this.statsService.decrementTotalCompleted(date);
  }

  private calculateStreak(completedDates: Map<string, number>): number {
    const today = moment().startOf('day');
    let currentDate = today;
    let streak = 0;

    while (true) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const value = completedDates.get(dateStr);

      if (!value || value !== 1) break;

      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }

    return streak;
  }
}
