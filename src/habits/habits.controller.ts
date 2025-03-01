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
import { TrackHabitDto } from './dto/track.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Habit } from './habits.schema';
import { HabitStatsOutput, HabitTypeOutput } from './dto/habits';
import { ProtectedRoute } from '../auth/protected-route.decorator';

@ApiTags('habits')
@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  @ProtectedRoute()
  @ApiOperation({ summary: 'Get all habits for the current user' })
  @ApiOkResponse({
    description: 'List of habits',
    type: [Habit],
  })
  async getHabits(@Req() req: AuthRequest): Promise<Habit[]> {
    return this.habitsService.getHabits(req.user.sub);
  }

  @Get('types')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Get available habit types' })
  @ApiOkResponse({
    description: 'List of habit types',
    type: [HabitTypeOutput],
  })
  getHabitTypes(): HabitTypeOutput[] {
    return this.habitsService.getHabitTypes();
  }

  @Get(':id')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Get a habit by ID' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiOkResponse({
    description: 'Habit details',
    type: Habit,
  })
  async getHabit(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<Habit> {
    return this.habitsService.getHabitById(id, req.user.sub);
  }

  @Get(':id/stats')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Get habit statistics' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiResponse({
    status: 200,
    description: 'Habit statistics',
    type: HabitStatsOutput,
  })
  async getHabitStats(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<HabitStatsOutput> {
    return this.habitsService.getHabitStatsById(id, req.user.sub);
  }

  @Post()
  @ProtectedRoute()
  @ApiOperation({ summary: 'Create a new habit' })
  @ApiResponse({
    status: 201,
    description: 'Habit created successfully',
    type: Habit,
  })
  async createHabit(
    @Body() createHabitDto: CreateHabitDto,
    @Req() req: AuthRequest,
  ): Promise<Habit> {
    return this.habitsService.createHabit(createHabitDto, req.user.sub);
  }

  @Delete(':id')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Delete a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiOkResponse({ description: 'Habit deleted successfully', type: Habit })
  async deleteHabit(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ): Promise<Habit> {
    return this.habitsService.deleteHabit(id, req.user.sub);
  }

  @Patch(':id')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Update a habit' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiOkResponse({
    description: 'Habit updated successfully',
    type: Habit,
  })
  async updateHabit(
    @Param('id') id: string,
    @Body() updateHabitDto: UpdateHabitDto,
    @Req() req: AuthRequest,
  ): Promise<Habit> {
    return this.habitsService.updateHabit(id, updateHabitDto, req.user.sub);
  }

  @Post(':id/track')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Track a habit for a specific date' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiOkResponse({
    description: 'Habit tracked successfully',
    type: Habit,
  })
  async trackHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ): Promise<Habit> {
    return this.habitsService.trackHabit(id, trackHabitDto.date, req.user.sub);
  }

  @Delete(':id/track')
  @ProtectedRoute()
  @ApiOperation({ summary: 'Untrack a habit for a specific date' })
  @ApiParam({ name: 'id', description: 'Habit ID' })
  @ApiOkResponse({
    description: 'Habit untracked successfully',
    type: Habit,
  })
  async untrackHabit(
    @Param('id') id: string,
    @Body() trackHabitDto: TrackHabitDto,
    @Req() req: AuthRequest,
  ): Promise<Habit> {
    return this.habitsService.untrackHabit(
      id,
      trackHabitDto.date,
      req.user.sub,
    );
  }
}
