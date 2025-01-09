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

    // Update streaks
    const previousDay = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
    const hasPreviousDay = habit.completedDates.get(previousDay) === 1;

    if (hasPreviousDay) {
      habit.currentStreak++;
      habit.longestStreak = Math.max(habit.currentStreak, habit.longestStreak);
    } else {
      habit.currentStreak = 1;
    }

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

    // Update current streak if necessary
    if (habit.currentStreak > 0) {
      habit.currentStreak--;
    }

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

    const totalHabits = habits.length;
    const totalCompletions = habits.reduce(
      (sum, habit) =>
        sum +
        Array.from(habit.completedDates.values()).filter((v) => v === 1).length,
      0,
    );
    const averageStreak =
      habits.reduce((sum, habit) => sum + habit.currentStreak, 0) / totalHabits;

    return {
      totalHabits,
      totalCompletions,
      averageStreak: Math.round(averageStreak * 10) / 10,
      habits: habits.map((habit) => ({
        name: habit.name,
        currentStreak: habit.currentStreak,
        longestStreak: habit.longestStreak,
        completions: Array.from(habit.completedDates.values()).filter(
          (v) => v === 1,
        ).length,
      })),
    };
  }
}
