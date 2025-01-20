import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitType } from './habits.schema';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';
import * as moment from 'moment';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    private readonly counterService: HabitsCounterService,
    private readonly booleanService: HabitsBooleanService,
    private readonly statsService: StatsService,
  ) {}

  async getHabits(userId: string) {
    return this.habitModel.find({ userId }).exec();
  }

  async createHabit(createHabitDto: CreateHabitDto, userId: string) {
    const habit = new this.habitModel({
      ...createHabitDto,
      userId,
      createdAt: new Date(),
    });
    return habit.save();
  }

  async deleteHabit(id: string, userId: string) {
    const habit = await this.habitModel.findOneAndDelete({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    return habit;
  }

  async updateHabit(
    id: string,
    updateHabitDto: UpdateHabitDto,
    userId: string,
  ) {
    const habit = await this.habitModel.findOneAndUpdate(
      { _id: id, userId },
      updateHabitDto,
      { new: true },
    );
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    return habit;
  }

  async trackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    await this.booleanService.trackHabit(id, date, userId);
    await this.statsService.incrementTotalCompleted();
  }

  async untrackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    await this.booleanService.untrackHabit(id, date, userId);
    await this.statsService.decrementTotalCompleted();
  }

  async getStreak(id: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return {
      currentStreak: habit.currentStreak,
      longestStreak: habit.longestStreak,
    };
  }

  async getStats(userId: string) {
    const habits = await this.habitModel.find({ userId });
    const today = moment().startOf('day');

    // Helper function to check if a habit is completed for a given date
    const isHabitCompletedForDate = (habit: Habit, date: string) => {
      const value = habit.completedDates.get(date);
      if (!value) return false;

      if (habit.type === HabitType.COUNTER) {
        return value >= habit.targetCounter;
      }
      return value === 1;
    };

    // Calculate basic stats
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => {
      return (
        sum +
        Array.from(habit.completedDates.values()).filter((value) =>
          habit.type === HabitType.COUNTER
            ? value >= habit.targetCounter
            : value === 1,
        ).length
      );
    }, 0);

    const averageStreak =
      habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / totalHabits;

    // Calculate completion rate for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      today.clone().subtract(i, 'days').format('YYYY-MM-DD'),
    );
    const completionsLast7Days = habits.reduce((sum, habit) => {
      return (
        sum +
        last7Days.filter((date) => isHabitCompletedForDate(habit, date)).length
      );
    }, 0);
    const completionRate7Days =
      (completionsLast7Days / (totalHabits * 7)) * 100;

    // Calculate completion rate for current month
    const startOfMonth = today.clone().startOf('month');
    const daysInCurrentMonth = today.diff(startOfMonth, 'days') + 1;
    const currentMonthDays = Array.from(
      { length: daysInCurrentMonth },
      (_, i) => startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'),
    );

    // Calculate completion rate for current year
    const startOfYear = today.clone().startOf('year');
    const daysInCurrentYear = today.diff(startOfYear, 'days') + 1;
    const currentYearDays = Array.from({ length: daysInCurrentYear }, (_, i) =>
      startOfYear.clone().add(i, 'days').format('YYYY-MM-DD'),
    );

    const completionsCurrentYear = habits.reduce((sum, habit) => {
      return (
        sum +
        currentYearDays.filter((date) => isHabitCompletedForDate(habit, date))
          .length
      );
    }, 0);
    const completionRateYear =
      (completionsCurrentYear / (totalHabits * daysInCurrentYear)) * 100;

    // Find longest streak across all habits
    const maxStreak = Math.max(...habits.map((habit) => habit.longestStreak));

    return {
      totalHabits,
      totalCompletions,
      averageStreak: Math.round(averageStreak * 10) / 10,
      completionRate7Days: Math.round(completionRate7Days * 10) / 10,
      completionRateYear: Math.round(completionRateYear * 10) / 10,
      maxStreak,
      habits: habits.map((habit) => ({
        name: habit.name,
        type: habit.type,
        targetCounter:
          habit.type === HabitType.COUNTER ? habit.targetCounter : undefined,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        completions: Array.from(habit.completedDates.values()).filter(
          (value) =>
            habit.type === HabitType.COUNTER
              ? value >= habit.targetCounter
              : value === 1,
        ).length,
        completionRate7Days:
          Math.round(
            (last7Days.filter((date) => isHabitCompletedForDate(habit, date))
              .length /
              7) *
              1000,
          ) / 10,
        completionRateYear:
          Math.round(
            (currentYearDays.filter((date) =>
              isHabitCompletedForDate(habit, date),
            ).length /
              daysInCurrentYear) *
              1000,
          ) / 10,
        completionRateMonth:
          Math.round(
            (currentMonthDays.filter((date) =>
              isHabitCompletedForDate(habit, date),
            ).length /
              daysInCurrentMonth) *
              1000,
          ) / 10,
      })),
    };
  }

  getHabitTypes() {
    return Object.values(HabitType).map((type) => ({
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }

  async incrementHabit(id: string, date: string, userId: string) {
    const value = await this.counterService.incrementHabit(id, date, userId);
    if (value === 1) {
      await this.statsService.incrementTotalCompleted();
    }
  }

  async decrementHabit(id: string, date: string, userId: string) {
    const value = await this.counterService.decrementHabit(id, date, userId);
    if (value === 0) {
      await this.statsService.decrementTotalCompleted();
    }
  }
}
