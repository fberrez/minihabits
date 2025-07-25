import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { MollieModule } from '../mollie/mollie.module';
import { User, UserSchema } from '../users/users.schema';
import { Habit, HabitSchema } from '../habits/habits.schema';

@Module({
  imports: [
    ConfigModule,
    MollieModule.forRootAsync(),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Habit.name, schema: HabitSchema },
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}