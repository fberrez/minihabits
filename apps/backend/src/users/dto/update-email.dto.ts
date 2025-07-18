import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEmailDto {
  @ApiProperty({
    description: 'The new email address',
    example: 'newemail@example.com',
  })
  @IsEmail()
  newEmail: string;

  @ApiProperty({
    description: 'Current password for verification',
    example: 'currentPassword123',
  })
  @IsString()
  password: string;
}
