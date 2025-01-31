import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionTier } from '../users.schema';

export class SubscriptionStatus {
  @ApiProperty({
    description: 'The type of subscription (e.g., "free", "premium")',
    example: 'FREE',
    enum: SubscriptionTier,
  })
  tier: SubscriptionTier;

  @ApiProperty({
    description: 'Number of habits currently created by the user',
    example: 5,
  })
  habitsCount: number;

  @ApiProperty({
    description: 'Maximum number of habits allowed for this subscription type',
    example: 10,
  })
  maxHabits: number;

  @ApiProperty({
    description: 'Whether the user can create more habits',
    example: true,
  })
  canCreateMore: boolean;
}
