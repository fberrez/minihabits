import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { PLAN_CODES } from '../constants';

export class CheckoutDto {
  @ApiProperty({
    enum: [
      PLAN_CODES.PREMIUM_MONTHLY,
      PLAN_CODES.PREMIUM_YEARLY,
      PLAN_CODES.PREMIUM_LIFETIME,
    ],
  })
  @IsIn([
    PLAN_CODES.PREMIUM_MONTHLY,
    PLAN_CODES.PREMIUM_YEARLY,
    PLAN_CODES.PREMIUM_LIFETIME,
  ])
  planCode!: string;
}
