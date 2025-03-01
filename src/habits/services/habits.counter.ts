import { Injectable } from '@nestjs/common';
import { HabitDocument, HabitType } from '../habits.schema';
import * as moment from 'moment';
import { StatsService } from '../../stats/stats.service';
import {
  HabitService,
  HabitStats,
} from '../interfaces/habit-service.interface';

@Injectable()
export class HabitsCounterService implements HabitService {
  constructor(private readonly statsService: StatsService) {}

  async trackHabit(habit: HabitDocument, date: string): Promise<void> {
    if (habit.type !== HabitType.COUNTER) {
      throw new Error('This habit is not a counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;
    habit.completedDates.set(targetDate, currentValue + 1);

    habit.currentStreak = this.calculateStreak(habit);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue + 1 === 1) {
      await this.statsService.incrementTotalCompleted(date);
    }
  }

  async untrackHabit(habit: HabitDocument, date: string): Promise<void> {
    if (habit.type !== HabitType.COUNTER) {
      throw new Error('This habit is not a counter type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    const currentValue = habit.completedDates.get(targetDate) || 0;

    if (currentValue > 0) {
      habit.completedDates.set(targetDate, currentValue - 1);
    }

    habit.currentStreak = this.calculateStreak(habit);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    await habit.save();
    if (currentValue - 1 === 0) {
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
    return value >= habit.targetCounter;
  }

  getStats(habit: HabitDocument): HabitStats {
    const today = moment();
    // Calculate dates for stats
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      today.clone().subtract(i, 'days').format('YYYY-MM-DD'),
    );

    const startOfMonth = today.clone().startOf('month');
    const daysInCurrentMonth = today.diff(startOfMonth, 'days') + 1;
    const currentMonthDays = Array.from(
      { length: daysInCurrentMonth },
      (_, i) => startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'),
    );

    const startOfYear = today.clone().startOf('year');
    const daysInCurrentYear = today.diff(startOfYear, 'days') + 1;
    const currentYearDays = Array.from({ length: daysInCurrentYear }, (_, i) =>
      startOfYear.clone().add(i, 'days').format('YYYY-MM-DD'),
    );

    // Calculate completions (days where count is above target)
    const completions = Array.from(habit.completedDates.values()).filter(
      (value) => value >= habit.targetCounter,
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
