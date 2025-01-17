import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitType } from '../habits.schema';
import * as moment from 'moment';

@Injectable()
export class HabitsCounterService {
  constructor(@InjectModel(Habit.name) private habitModel: Model<Habit>) {}

  async incrementHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

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

    return habit.save();
  }

  async decrementHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

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

    return habit.save();
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
