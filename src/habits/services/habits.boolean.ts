import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitType } from '../habits.schema';
import * as moment from 'moment';

@Injectable()
export class HabitsBooleanService {
  constructor(@InjectModel(Habit.name) private habitModel: Model<Habit>) {}

  async trackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

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

    return habit.save();
  }

  async untrackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    if (habit.type !== HabitType.BOOLEAN) {
      throw new Error('This habit is not a boolean type');
    }

    const targetDate = moment(date).startOf('day').format('YYYY-MM-DD');
    habit.completedDates.delete(targetDate);

    habit.currentStreak = this.calculateStreak(habit.completedDates);

    return habit.save();
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
