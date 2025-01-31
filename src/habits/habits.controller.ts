import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto } from './dto/create.dto';
import { AuthRequest } from '../auth/interfaces/request.interface';
import { UpdateHabitDto } from './dto/update.dto';
import { TrackHabitDto } from './dto/track.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from '../users/users.service';

@ApiTags('habits')
@ApiBearerAuth()
@Controller('habits')
export class HabitsController {
  constructor(
    private readonly habitsService: HabitsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all habits for the current user' })
  @ApiResponse({ status: 200, description: 'List of habits' })
  async getHabits(@Req() req: AuthRequest) {
    return this.habitsService.getHabits(req.user.sub);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available habit types' })
  @ApiResponse({ status: 200, description: 'List of habit types' })
  getHabitTypes() {
    return this.habitsService.getHabitTypes();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get habit statistics' })
  @ApiResponse({ status: 200, description: 'Habit statistics' })
  async getStats(@Req() req: AuthRequest) {
    return this.habitsService.getStats(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  @ApiResponse({
    status: 403,
    description: 'Subscription required for more habits',
  })
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: AuthRequest,
  ) {
    const canCreate = await this.usersService.canCreateHabit(req.user.sub);
    if (!canCreate) {
      throw new ForbiddenException(
        'You have reached the maximum number of habits for your subscription tier. Please upgrade to create more habits.',
      );
    }
    return this.habitsService.createHabit(createHabitDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Habit deleted successfully' })
  async deleteHabit(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.habitsService.deleteHabit(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Habit updated successfully' })
  async updateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.updateHabit(id, updateHabitDto, req.user.sub);
  }

  @Post(':id/track')
  @ApiOperation({ summary: 'Track a habit for a specific date' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Habit tracked successfully' })
  async trackHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.trackHabit(id, trackHabitDto.date, req.user.sub);
  }

  @Delete(':id/track')
  @ApiOperation({ summary: 'Untrack a habit for a specific date' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Habit untracked successfully' })
  async untrackHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ) {
    return this.habitsService.untrackHabit(
      id,
      trackHabitDto.date,
      req.user.sub,
    );
  }

  @Get(':id/streak')
  @ApiOperation({ summary: 'Get streak information for a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Streak information' })
  async getStreak(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.habitsService.getStreak(id, req.user.sub);
  }
}
