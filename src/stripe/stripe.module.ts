import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  imports: [ConfigModule, UsersModule, EmailModule],
})
export class StripeModule {}
