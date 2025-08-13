import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Habit, HabitType } from './habits.schema';
import { CreateHabitDto } from './dto/create.dto';
import { UpdateHabitDto } from './dto/update.dto';
import { HabitsCounterService } from './services/habits.counter';
import { HabitsBooleanService } from './services/habits.boolean';
import { HabitService } from './interfaces/habit-service.interface';
import { HabitStatsOutput } from './dto/habits';
import { EntitlementsService } from '../billing/entitlements.service';
import { ForbiddenException } from '@nestjs/common';
import { APP_ERROR_CODES } from '../billing/constants';

@Injectable()
export class HabitsService {
  constructor(
    @InjectModel(Habit.name) private habitModel: Model<Habit>,
    @Inject(HabitsCounterService)
    private readonly counterService: HabitsCounterService,
    @Inject(HabitsBooleanService)
    private readonly booleanService: HabitsBooleanService,
    @Inject(EntitlementsService)
    private readonly entitlementsService: EntitlementsService,
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
    const entitlements =
      await this.entitlementsService.getUserEntitlements(userId);
    if (!entitlements.isPremium) {
      const currentCount = await this.habitModel
        .countDocuments({ userId })
        .exec();
      if (currentCount >= 3) {
        const err: any = new ForbiddenException(
          'Habit limit reached. Upgrade to Premium to add more.',
        );
        (err as any).code = APP_ERROR_CODES.PAYWALL_LIMIT_REACHED;
        throw err;
      }
    }
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

  async trackHabit(id: string, date: string, userId: string): Promise<Habit> {
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
      default:
        throw new BadRequestException('Invalid habit type');
    }

    return habit;
  }

  async untrackHabit(id: string, date: string, userId: string): Promise<Habit> {
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
      default:
        throw new BadRequestException('Invalid habit type');
    }

    return habit;
  }

  async getHabitStatsById(
    id: string,
    userId: string,
  ): Promise<HabitStatsOutput> {
    const habit = await this.getHabitById(id, userId);
    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    const service = this.getServiceForHabit(habit);
    const stats = service.getStats(habit);
    return {
      name: habit.name,
      type: habit.type,
      ...stats,
    };
  }

  private getServiceForHabit(habit: Habit): HabitService {
    switch (habit.type) {
      case HabitType.BOOLEAN:
        return this.booleanService;
      case HabitType.COUNTER:
        return this.counterService;
      default:
        throw new BadRequestException('Invalid habit type');
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
