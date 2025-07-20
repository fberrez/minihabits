import { ApiProperty } from '@nestjs/swagger';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    sub: string;
    email: string;
  };
}

export class AuthResponse {
  @ApiProperty({ type: String, description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ type: String, description: 'JWT refresh token' })
  refreshToken: string;
}
