import { Injectable } from '@nestjs/common';
import { HabitDocument, HabitType } from '../habits.schema';
import * as moment from 'moment';
import { StatsService } from '../../stats/stats.service';

@Injectable()
export class HabitsCounterService {
  constructor(private readonly statsService: StatsService) {}

  async incrementHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.COUNTER) {
      throw new Error('This habit is not a counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;
    habit.completedDates.set(targetDate, currentValue + 1);

    habit.currentStreak = this.calculateStreak(
      habit.completedDates,
      habit.targetCounter,
    );
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue + 1 === 1) {
      await this.statsService.incrementTotalCompleted(date);
    }
  }

  async decrementHabit(habit: HabitDocument, date: string) {
    if (habit.type !== HabitType.COUNTER) {
      throw new Error('This habit is not a counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;

    // Prevent negative values
    if (currentValue > 0) {
      habit.completedDates.set(targetDate, currentValue - 1);
    }

    habit.currentStreak = this.calculateStreak(
      habit.completedDates,
      habit.targetCounter,
    );
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue - 1 === 0) {
      await this.statsService.decrementTotalCompleted(date);
    }
  }

  private calculateStreak(
    completedDates: Map<string, number>,
    targetCounter: number,
  ): number {
    const today = moment().startOf('day');
    let currentDate = today;
    let streak = 0;

    while (true) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const value = completedDates.get(dateStr);

      if (!value || value < targetCounter) break;

      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }

    return streak;
  }
}
