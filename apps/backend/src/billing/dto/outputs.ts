import { ApiProperty } from '@nestjs/swagger';

export class PlanOutput {
  @ApiProperty({ type: String, required: true, description: 'Plan code' })
  code!: string;

  @ApiProperty({ type: String, required: true, description: 'Plan name' })
  name!: string;

  @ApiProperty({ type: Number, required: true, description: 'Price in cents' })
  priceCents!: number;

  @ApiProperty({ type: String, required: true })
  currency!: string;

  @ApiProperty({ enum: ['month', 'year', 'lifetime'] })
  interval!: 'month' | 'year' | 'lifetime';
}

export class CheckoutOutput {
  @ApiProperty({ type: String, required: true })
  checkoutUrl!: string;
}

export class BillingStatusOutput {
  @ApiProperty({ type: Boolean, required: false })
  isPremium!: boolean;

  @ApiProperty({
    enum: ['free', 'premium-monthly', 'premium-yearly', 'premium-lifetime'],
    required: false,
  })
  planCode?: string;

  @ApiProperty({
    enum: [
      'active',
      'canceled',
      'cancel_at_period_end',
      'expired',
      'incomplete',
      'past_due',
    ],
    required: false,
  })
  status?: string;

  @ApiProperty({ required: false, type: String, nullable: true })
  currentPeriodEnd?: string | null;

  @ApiProperty({ type: Boolean, required: false })
  canCancel!: boolean;

  @ApiProperty({ type: Boolean, required: false })
  cancelAtPeriodEnd?: boolean;
}
