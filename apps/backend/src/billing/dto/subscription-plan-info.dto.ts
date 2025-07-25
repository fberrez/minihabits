import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';

export class SubscriptionPlanInfoDto {
  @ApiProperty({
    description: 'The subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.MONTHLY,
  })
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Display name of the plan',
    example: 'Monthly',
  })
  name: string;

  @ApiProperty({
    description: 'Price in EUR cents',
    example: 199,
  })
  price: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'EUR',
  })
  currency: string;

  @ApiProperty({
    description: 'Billing interval (null for one-time payments)',
    example: '1 month',
    required: false,
  })
  interval?: string;

  @ApiProperty({
    description: 'Maximum number of habits allowed (-1 for unlimited)',
    example: -1,
  })
  habitLimit: number;

  @ApiProperty({
    description: 'Whether this plan is marked as popular',
    example: true,
    required: false,
  })
  isPopular?: boolean;

  @ApiProperty({
    description: 'Formatted price for display',
    example: '€1.99',
  })
  formattedPrice: string;
}