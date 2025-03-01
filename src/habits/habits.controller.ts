import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
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
import { Habit } from './habits.schema';
import { HabitStatsOutput, HabitTypeOutput } from './dto/habits';
@ApiTags('habits')
@ApiBearerAuth()
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all habits for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of habits',
    type: [Habit],
  })
  async getHabits(@Req() req: AuthRequest): Promise<Habit[]> {
    return this.habitsService.getHabits(req.user.sub);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get available habit types' })
  @ApiResponse({
    status: 200,
    description: 'List of habit types',
    type: [HabitTypeOutput],
  })
  getHabitTypes() {
    return this.habitsService.getHabitTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({ status: 200, description: 'Habit details' })
  async getHabit(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.habitsService.getHabitById(id, req.user.sub);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({
    status: 200,
    description: 'Habit details',
    type: HabitStatsOutput,
  })
  async getHabitStats(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<HabitStatsOutput> {
    return this.habitsService.getHabitStatsById(id, req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({ status: 201, description: 'Habit created successfully' })
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: AuthRequest,
  ) {
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
