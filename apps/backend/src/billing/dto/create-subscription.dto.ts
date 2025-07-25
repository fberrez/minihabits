import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsUrl, IsOptional } from 'class-validator';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The subscription plan to create',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.MONTHLY,
  })
  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'URL to redirect to after successful payment',
    example: 'https://minihabits.app/billing/success',
  })
  @IsUrl()
  redirectUrl: string;

  @ApiProperty({
    description: 'URL to redirect to after failed payment',
    example: 'https://minihabits.app/billing/cancel',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  cancelUrl?: string;

  @ApiProperty({
    description: 'Webhook URL for payment notifications',
    example: 'https://api.minihabits.app/billing/webhook',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  webhookUrl?: string;
}