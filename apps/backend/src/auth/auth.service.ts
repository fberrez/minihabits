import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcryptjs';
import { AuthResponse } from './interfaces/request.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.usersService.findOne(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create new user
    const user = await this.usersService.create({
      email: signUpDto.email,
      password: signUpDto.password,
    });

    // Generate tokens
    return this.generateTokens(user._id.toString(), user.email);
  }

  async signIn(email: string, pass: string): Promise<AuthResponse> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user._id.toString(), user.email);
  }

  async refreshToken(userId: string): Promise<AuthResponse> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user._id.toString(), user.email);
  }

  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<AuthResponse> {
    const payload = { sub: userId, email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      }),
    };
  }
}
