import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    type: String,
    description: 'Email address for password reset',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
