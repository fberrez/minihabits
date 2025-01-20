import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as moment from 'moment';
import { Stats } from './stats.schema';
import { Logger } from '@nestjs/common';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(@InjectModel(Stats.name) private statsModel: Model<Stats>) {}

  private getTodayDateComponents() {
    const today = moment().utc();
    return {
      year: today.year(),
      month: today.month() + 1, // moment months are 0-based
      day: today.date(),
    };
  }

  async getHomeStats() {
    const dateComponents = this.getTodayDateComponents();
    const stats = await this.statsModel.findOne(dateComponents);
    return stats;
  }

  private async updateStats(value: number) {
    const dateComponents = this.getTodayDateComponents();
    let stats = await this.statsModel.findOne(dateComponents);

    if (!stats) {
      stats = await this.statsModel.create({
        ...dateComponents,
        totalCompleted: 0,
      });
    }

    if (stats.totalCompleted + value >= 0) {
      stats.totalCompleted += value;
      await stats.save();
    }
  }

  async incrementTotalCompleted() {
    try {
      this.updateStats(1);
    } catch (error) {
      this.logger.error('Error incrementing total completed', error);
    }
  }

  async decrementTotalCompleted() {
    try {
      this.updateStats(-1);
    } catch (error) {
      this.logger.error('Error decrementing total completed', error);
    }
  }
}
