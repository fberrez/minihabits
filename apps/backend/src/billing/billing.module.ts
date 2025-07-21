import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { GoCardlessService } from './gocardless.service';
import { User, UserSchema } from '../users/users.schema';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
  ],
  controllers: [BillingController],
  providers: [BillingService, GoCardlessService],
  exports: [BillingService, GoCardlessService],
})
export class BillingModule {}