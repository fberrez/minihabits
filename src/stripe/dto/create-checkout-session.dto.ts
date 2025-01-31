import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'The ID of the price to create a checkout session for',
    example: 'price_1P2345678901234567890123',
  })
  @IsString()
  priceId: string;
}
