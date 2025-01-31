import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthRequest } from 'src/auth/interfaces/request.interface';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from '../auth/auth.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionStatus } from './interfaces/subscription-status.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMe(@Req() req: AuthRequest) {
    return this.usersService.findById(req.user.sub);
  }

  @Patch('email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update email address' })
  @ApiResponse({ status: 200, description: 'Email updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async updateEmail(
    @Req() req: AuthRequest,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.usersService.updateEmail(
      req.user.sub,
      updateEmailDto.newEmail,
      updateEmailDto.password,
    );
  }

  @Patch('password')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updatePassword(
    @Req() req: AuthRequest,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.usersService.updatePassword(
      req.user.sub,
      updatePasswordDto.currentPassword,
      updatePasswordDto.newPassword,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
          description: 'Current password for verification',
          example: 'currentPassword123',
        },
      },
    },
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(
    @Req() req: AuthRequest,
    @Body('password') password: string,
  ) {
    return this.usersService.deleteAccount(req.user.sub, password);
  }

  @Public()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.createPasswordResetToken(forgotPasswordDto.email);
  }

  @Public()
  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.usersService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.newPassword,
    );
  }

  @Get('subscription/status')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get subscription status and habit creation allowance',
    description:
      "Returns information about user's subscription status, including current habit count and limits",
  })
  @ApiResponse({
    status: 200,
    description: 'Returns subscription status information',
    type: SubscriptionStatus,
  })
  async getSubscriptionStatus(
    @Req() req: AuthRequest,
  ): Promise<SubscriptionStatus> {
    return this.usersService.getSubscriptionStatus(req.user.sub);
  }

  @Get('subscription/can-create-habit')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Check if user can create more habits',
    description:
      'Verifies if the user has not reached their habit limit based on their subscription',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns whether user can create more habits',
    schema: {
      type: 'object',
      properties: {
        canCreate: {
          type: 'boolean',
          description: 'Whether the user can create more habits',
        },
        currentCount: {
          type: 'number',
          description: 'Current number of habits',
        },
        maxAllowed: {
          type: 'number',
          description: 'Maximum number of habits allowed',
        },
      },
    },
  })
  async canCreateHabit(@Req() req: AuthRequest) {
    return this.usersService.canCreateHabit(req.user.sub);
  }
}
