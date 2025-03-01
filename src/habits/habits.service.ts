import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitType } from './habits.schema';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';
import * as moment from 'moment';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';
import { HabitsNegativeBooleanService } from './services/habits.negative-boolean';
import { HabitsNegativeCounterService } from './services/habits.negative-counter';
import { HabitStats } from './interfaces/habit-stats.interface';
import { HabitService } from './interfaces/habit-service.interface';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    private readonly counterService: HabitsCounterService,
    private readonly booleanService: HabitsBooleanService,
    private readonly negativeBooleanService: HabitsNegativeBooleanService,
    private readonly negativeCounterService: HabitsNegativeCounterService,
  ) {}

  async getHabitById(id: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }
    return habit;
  }

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
    // Separate null values that need to be unset
    const unsetFields = {};
    const updateFields = { ...updateHabitDto };

    // Perform the update with both $set and $unset operations if needed
    const habit = await this.habitModel.findOneAndUpdate(
      { _id: id, userId },
      {
        ...(Object.keys(updateFields).length > 0 && { $set: updateFields }),
        ...(Object.keys(unsetFields).length > 0 && { $unset: unsetFields }),
      },
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

    switch (habit.type) {
      case HabitType.BOOLEAN:
        await this.booleanService.trackHabit(habit, date);
        break;
      case HabitType.COUNTER:
        await this.counterService.trackHabit(habit, date);
        break;
      case HabitType.NEGATIVE_BOOLEAN:
        await this.negativeBooleanService.trackHabit(habit, date);
        break;
      case HabitType.NEGATIVE_COUNTER:
        await this.negativeCounterService.trackHabit(habit, date);
        break;
    }
  }

  async untrackHabit(id: string, date: string, userId: string) {
    const habit = await this.habitModel.findOne({ _id: id, userId });
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    switch (habit.type) {
      case HabitType.BOOLEAN:
        await this.booleanService.untrackHabit(habit, date);
        break;
      case HabitType.COUNTER:
        await this.counterService.untrackHabit(habit, date);
        break;
      case HabitType.NEGATIVE_BOOLEAN:
        await this.negativeBooleanService.untrackHabit(habit, date);
        break;
      case HabitType.NEGATIVE_COUNTER:
        await this.negativeCounterService.untrackHabit(habit, date);
        break;
    }
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

  // Add this helper function to calculate streaks
  private calculateStreak(
    habit: Habit,
    upToDate: string = moment().format('YYYY-MM-DD'),
  ): number {
    const startDate = moment(upToDate);
    let currentDate = startDate.clone();
    let streak = 0;
    const createdAt = moment(habit.createdAt).startOf('day');

    while (currentDate.isSameOrAfter(createdAt)) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      const value = habit.completedDates.get(dateStr) || 0;

      let isCompleted = false;
      switch (habit.type) {
        case HabitType.COUNTER:
          isCompleted = value >= habit.targetCounter;
          break;
        case HabitType.NEGATIVE_COUNTER:
          isCompleted = value < habit.targetCounter;
          break;
        case HabitType.NEGATIVE_BOOLEAN:
          isCompleted = value !== 1;
          break;
        case HabitType.BOOLEAN:
          isCompleted = value === 1;
          break;
      }

      if (!isCompleted) {
        break; // Break on first failure - streak must be continuous
      }

      streak++;
      currentDate = currentDate.subtract(1, 'day');
    }

    return streak;
  }

  async getStats(userId: string, ids?: string[]): Promise<HabitStats> {
    let habits;
    if (ids) {
      habits = await this.habitModel.find({
        _id: { $in: ids },
        userId,
      });
    } else {
      habits = await this.habitModel.find({ userId });
    }

    const today = moment().startOf('day');

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

    const dates = {
      last7Days,
      currentMonthDays,
      currentYearDays,
    };

    // Get stats for each habit using its corresponding service
    const habitStats = habits.map((habit) => {
      const service = this.getServiceForHabit(habit);

      const stats = service.getStats(habit, dates);
      return {
        name: habit.name,
        type: habit.type,
        targetCounter:
          habit.type === HabitType.COUNTER ||
          habit.type === HabitType.NEGATIVE_COUNTER
            ? habit.targetCounter
            : undefined,
        ...stats,
      };
    });

    // Calculate aggregated stats
    const totalHabits = habits.length;
    const totalCompletions = habitStats.reduce(
      (sum, stat) => sum + stat.completions,
      0,
    );
    const averageStreak =
      habitStats.reduce((sum, stat) => sum + stat.currentStreak, 0) /
      totalHabits;

    const completionsLast7Days = habits.reduce(
      (sum, habit) =>
        sum +
        last7Days.filter((date) =>
          this.getServiceForHabit(habit).isCompleted(habit, date),
        ).length,
      0,
    );

    const completionRate7Days =
      (completionsLast7Days / (totalHabits * 7)) * 100;

    const todayStr = today.format('YYYY-MM-DD');
    const habitsCompletedToday = habits.filter((habit) =>
      this.getServiceForHabit(habit).isCompleted(habit, todayStr),
    ).length;

    const maxStreak = Math.max(...habitStats.map((stat) => stat.longestStreak));

    return {
      totalHabits,
      totalCompletions,
      habitsCompletedToday,
      averageStreak: Math.round(averageStreak * 10) / 10,
      completionRate7Days: Math.round(completionRate7Days * 10) / 10,
      completionRateYear:
        Math.round(
          (habitStats.reduce((sum, stat) => sum + stat.completionRateYear, 0) /
            totalHabits) *
            10,
        ) / 10,
      maxStreak,
      habits: habitStats,
    };
  }

  private getServiceForHabit(habit: Habit): HabitService {
    switch (habit.type) {
      case HabitType.BOOLEAN:
        return this.booleanService;
      case HabitType.COUNTER:
        return this.counterService;
      case HabitType.NEGATIVE_BOOLEAN:
        return this.negativeBooleanService;
      case HabitType.NEGATIVE_COUNTER:
        return this.negativeCounterService;
    }
  }

  getHabitTypes() {
    return Object.values(HabitType).map((type) => ({
      type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }

  async deleteAllHabits(userId: string) {
    await this.habitModel.deleteMany({ userId });
  }
}
