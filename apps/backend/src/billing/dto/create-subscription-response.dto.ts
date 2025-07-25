import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionResponseDto {
  @ApiProperty({
    description: 'URL to redirect user to for payment',
    example: 'https://www.mollie.com/payscreen/select-method/7UhSN1zuXS',
  })
  checkoutUrl: string;

  @ApiProperty({
    description: 'Payment or subscription ID from Mollie',
    example: 'tr_7UhSN1zuXS',
  })
  paymentId: string;

  @ApiProperty({
    description: 'Success message',
    example: 'Subscription created successfully',
  })
  message: string;
}