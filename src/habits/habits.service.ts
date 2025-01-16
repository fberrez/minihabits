import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit } from './habits.schema';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';
import * as moment from 'moment';

@Injectable()
export class HabitsService {
  constructor(@InjectModel(Habit.name) private habitModel: Model<Habit>) {}

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

  private calculateStreak(completedDates: Map<string, number>): number {
    const today = moment().startOf('day');
    let currentDate = today;
    let streak = 0;

    while (true) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      if (completedDates.get(dateStr) !== 1) {
        break;
      }
      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }

    return streak;
  }

  async trackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');

    // Check if already tracked for target date
    if (habit.completedDates.get(targetDate) === 1) {
      return habit;
    }

    // Set target date as completed
    habit.completedDates.set(targetDate, 1);

    // Recalculate streak
    habit.currentStreak = this.calculateStreak(habit.completedDates);
    habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);

    return habit.save();
  }

  async untrackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');

    // Remove target date completion
    habit.completedDates.delete(targetDate);

    // Recalculate streak
    habit.currentStreak = this.calculateStreak(habit.completedDates);

    return habit.save();
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

    // Calculate basic stats
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce(
      (sum, habit) =>
        sum +
        Array.from(habit.completedDates.values()).filter((v) => v === 1).length,
      0,
    );
    const averageStreak =
      habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / totalHabits;

    // Calculate completion rate for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      today.clone().subtract(i, 'days').format('YYYY-MM-DD'),
    );
    const completionsLast7Days = habits.reduce((sum, habit) => {
      return (
        sum +
        last7Days.filter((date) => habit.completedDates.get(date) === 1).length
      );
    }, 0);
    const completionRate7Days =
      (completionsLast7Days / (totalHabits * 7)) * 100;

    // Calculate completion rate for current month
    const startOfMonth = today.clone().startOf('month');
    const daysInCurrentMonth = today.diff(startOfMonth, 'days') + 1; // +1 to include today
    const currentMonthDays = Array.from(
      { length: daysInCurrentMonth },
      (_, i) => startOfMonth.clone().add(i, 'days').format('YYYY-MM-DD'),
    );

    // Calculate completion rate for current year
    const startOfYear = today.clone().startOf('year');
    const daysInCurrentYear = today.diff(startOfYear, 'days') + 1; // +1 to include today
    const currentYearDays = Array.from({ length: daysInCurrentYear }, (_, i) =>
      startOfYear.clone().add(i, 'days').format('YYYY-MM-DD'),
    );

    const completionsCurrentYear = habits.reduce((sum, habit) => {
      return (
        sum +
        currentYearDays.filter((date) => habit.completedDates.get(date) === 1)
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
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        completions: Array.from(habit.completedDates.values()).filter(
          (v) => v === 1,
        ).length,
        completionRate7Days:
          Math.round(
            (last7Days.filter((date) => habit.completedDates.get(date) === 1)
              .length /
              7) *
              1000,
          ) / 10,
        completionRateYear:
          Math.round(
            (currentYearDays.filter(
              (date) => habit.completedDates.get(date) === 1,
            ).length /
              daysInCurrentYear) *
              1000,
          ) / 10,
        completionRateMonth:
          Math.round(
            (currentMonthDays.filter(
              (date) => habit.completedDates.get(date) === 1,
            ).length /
              daysInCurrentMonth) *
              1000,
          ) / 10,
      })),
    };
  }
}
