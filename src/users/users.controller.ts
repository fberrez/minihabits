import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthRequest } from 'src/auth/interfaces/request.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: AuthRequest) {
    const userId = req.user['_id'];
    return this.usersService.findById(userId);
  }
}
