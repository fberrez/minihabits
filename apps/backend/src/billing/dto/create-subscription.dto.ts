import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'The subscription plan ID',
    enum: ['monthly', 'yearly', 'lifetime'],
    example: 'monthly',
  })
  @IsString()
  @IsIn(['monthly', 'yearly', 'lifetime'])
  planId: string;

  @ApiProperty({
    description: 'URL to redirect to after successful payment setup',
    example: 'http://localhost:5173/payment/success',
  })
  @IsString()
  successRedirectUrl: string;
}