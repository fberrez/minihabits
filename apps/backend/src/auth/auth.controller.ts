import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { PublicRoute } from './public-route.decorator';
import { ProtectedRoute } from './protected-route.decorator';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthRequest, AuthResponse } from './interfaces/request.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private authService: AuthService) {}

  @PublicRoute()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists',
  })
  @ApiBody({
    type: SignUpDto,
    description: 'User data to register',
  })
  signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }

  @PublicRoute()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign in with email and password' })
  @ApiOkResponse({
    description: 'User signed in successfully',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiBody({
    type: SignInDto,
    description: 'User data to sign in',
  })
  signIn(@Body() signInDto: SignInDto): Promise<AuthResponse> {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @ProtectedRoute()
  @Post('refresh')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiOkResponse({
    description: 'Tokens refreshed successfully',
    type: AuthResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid refresh token',
  })
  refreshToken(@Request() req: AuthRequest): Promise<AuthResponse> {
    return this.authService.refreshToken(req.user.sub);
  }
}
