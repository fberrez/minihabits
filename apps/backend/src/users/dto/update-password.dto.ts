import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    description: 'Current password',
    example: 'currentPassword123',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    type: String,
    description: 'New password (minimum 8 characters)',
    example: 'newPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
