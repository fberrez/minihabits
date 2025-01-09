import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit } from './habits.schema';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';

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
}
