import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionPlan } from '../enums/subscription-plan.enum';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class SubscriptionLimitsDto {
  @ApiProperty({
    description: 'Current subscription plan',
    enum: SubscriptionPlan,
    example: SubscriptionPlan.FREE,
  })
  plan: SubscriptionPlan;

  @ApiProperty({
    description: 'Current subscription status',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @ApiProperty({
    description: 'Maximum number of habits allowed (-1 for unlimited)',
    example: 3,
  })
  habitLimit: number;

  @ApiProperty({
    description: 'Current number of habits created',
    example: 2,
  })
  currentHabits: number;

  @ApiProperty({
    description: 'Whether the user can create more habits',
    example: true,
  })
  canCreateHabits: boolean;

  @ApiProperty({
    description: 'Subscription start date',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  subscriptionStartDate?: Date;

  @ApiProperty({
    description: 'Subscription end date',
    example: '2024-12-31T23:59:59.999Z',
    required: false,
  })
  subscriptionEndDate?: Date;
}