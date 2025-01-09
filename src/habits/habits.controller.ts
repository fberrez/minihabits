import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create.dto';
import { AuthRequest } from '../auth/interfaces/request.interface';
import { UpdateHabitDto } from './dto/update.dto';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getHabits(@Req() req: AuthRequest) {
    return this.habitsService.getHabits(req.user.sub);
  }

  @Post()
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.createHabit(createHabitDto, req.user.sub);
  }

  @Delete(':id')
  async deleteHabit(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.habitsService.deleteHabit(id, req.user.sub);
  }

  @Patch(':id')
  async updateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.updateHabit(id, updateHabitDto, req.user.sub);
  }
}
