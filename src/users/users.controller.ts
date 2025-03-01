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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PublicRoute } from '../auth/public-route.decorator';
import { ProtectedRoute } from '../auth/protected-route.decorator';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns the current user profile' })
  async getMe(@Req() req: AuthRequest) {
    return this.usersService.findById(req.user.sub);
  }

  @Patch('email')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Update email address' })
  @ApiResponse({ status: 200, description: 'Email updated successfully' })
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
  @ProtectedRoute()
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, description: 'Password updated successfully' })
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
  @ProtectedRoute()
  @ApiOperation({ summary: 'Delete account' })
  @ApiResponse({ status: 204, description: 'Account deleted successfully' })
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

  @PublicRoute()
  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.usersService.createPasswordResetToken(forgotPasswordDto.email);
  }

  @PublicRoute()
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
}
