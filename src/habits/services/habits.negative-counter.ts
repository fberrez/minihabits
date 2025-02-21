import { Injectable } from '@nestjs/common';
import { HabitDocument, HabitType } from '../habits.schema';
import * as moment from 'moment';
import { StatsService } from '../../stats/stats.service';
import {
  HabitService,
  HabitStats,
} from '../interfaces/habit-service.interface';

@Injectable()
export class HabitsNegativeCounterService implements HabitService {
  constructor(private readonly statsService: StatsService) {}

  async trackHabit(habit: HabitDocument, date: string): Promise<void> {
    if (habit.type !== HabitType.NEGATIVE_COUNTER) {
      throw new Error('This habit is not a negative counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;
    habit.completedDates.set(targetDate, currentValue + 1);

    habit.currentStreak = this.calculateStreak(habit);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue === 0 && currentValue + 1 < habit.targetCounter) {
      await this.statsService.incrementTotalCompleted(date);
    } else if (
      currentValue + 1 >= habit.targetCounter &&
      currentValue < habit.targetCounter
    ) {
      await this.statsService.decrementTotalCompleted(date);
    }
  }

  async untrackHabit(habit: HabitDocument, date: string): Promise<void> {
    if (habit.type !== HabitType.NEGATIVE_COUNTER) {
      throw new Error('This habit is not a negative counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;

    if (currentValue > 0) {
      habit.completedDates.set(targetDate, currentValue - 1);
    }

    habit.currentStreak = this.calculateStreak(habit);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (
      currentValue >= habit.targetCounter &&
      currentValue - 1 < habit.targetCounter
    ) {
      await this.statsService.incrementTotalCompleted(date);
    } else if (currentValue === 1 && currentValue - 1 < habit.targetCounter) {
      await this.statsService.decrementTotalCompleted(date);
    }
  }

  calculateStreak(
    habit: HabitDocument,
    upToDate: string = moment().format('YYYY-MM-DD'),
  ): number {
    const startDate = moment(upToDate);
    let currentDate = startDate.clone();
    let streak = 0;
    const createdAt = moment(habit.createdAt).startOf('day');

    while (currentDate.isSameOrAfter(createdAt)) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      if (!this.isCompleted(habit, dateStr)) {
        break;
      }
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }

    return streak;
  }

  isCompleted(habit: HabitDocument, date: string): boolean {
    const value = habit.completedDates.get(date) || 0;
    return value < habit.targetCounter;
  }

  getStats(
    habit: HabitDocument,
    dates: {
      last7Days: string[];
      currentMonthDays: string[];
      currentYearDays: string[];
    },
  ): HabitStats {
    const { last7Days, currentMonthDays, currentYearDays } = dates;

    // Calculate completions (days where count is below target)
    const completions = Array.from(habit.completedDates.values()).filter(
      (value) => value < habit.targetCounter,
    ).length;

    // Calculate current streak and longest streak
    const currentStreak = this.calculateStreak(habit);

    // Calculate longest streak
    let longestStreak = currentStreak;
    let checkDate = moment().subtract(1, 'day');
    const createdAt = moment(habit.createdAt).startOf('day');

    while (checkDate.isSameOrAfter(createdAt)) {
      const streak = this.calculateStreak(
        habit,
        checkDate.format('YYYY-MM-DD'),
      );
      longestStreak = Math.max(longestStreak, streak);
      checkDate = checkDate.subtract(1, 'day');
    }

    // Calculate completion rates
    const completionRate7Days =
      Math.round(
        (last7Days.filter((date) => this.isCompleted(habit, date)).length / 7) *
          1000,
      ) / 10;

    const completionRateMonth =
      Math.round(
        (currentMonthDays.filter((date) => this.isCompleted(habit, date))
          .length /
          currentMonthDays.length) *
          1000,
      ) / 10;

    const completionRateYear =
      Math.round(
        (currentYearDays.filter((date) => this.isCompleted(habit, date))
          .length /
          currentYearDays.length) *
          1000,
      ) / 10;

    return {
      completions,
      completionRate7Days,
      completionRateMonth,
      completionRateYear,
      currentStreak,
      longestStreak,
    };
  }
}
