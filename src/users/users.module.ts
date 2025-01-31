import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User, UserSchema } from './users.schema';
import { UsersController } from './users.controller';
import { EmailModule } from '../email/email.module';
import { HabitsModule } from 'src/habits/habits.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
    forwardRef(() => HabitsModule),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
