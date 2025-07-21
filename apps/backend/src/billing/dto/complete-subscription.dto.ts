import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CompleteSubscriptionDto {
  @ApiProperty({
    description: 'The redirect flow ID from GoCardless',
    example: 'RE123456789',
  })
  @IsString()
  flowId: string;

  @ApiProperty({
    description: 'The session token from GoCardless',
    example: 'abc123def456',
  })
  @IsString()
  sessionToken: string;

  @ApiProperty({
    description: 'The subscription plan ID',
    enum: ['monthly', 'yearly', 'lifetime'],
    example: 'monthly',
  })
  @IsString()
  @IsIn(['monthly', 'yearly', 'lifetime'])
  planId: string;
}