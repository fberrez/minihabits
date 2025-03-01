import { HabitsBooleanService } from './habits.boolean';
import { Test, TestingModule } from '@nestjs/testing';
import { StatsService } from '../../stats/stats.service';
import { HabitType } from '../habits.schema';
describe('HabitsBooleanService', () => {
  let service: HabitsBooleanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HabitsBooleanService,
        {
          provide: StatsService,
          useValue: {
            incrementHabitCount: jest.fn().mockResolvedValue(undefined),
            incrementTotalCompleted: jest.fn().mockResolvedValue(undefined),
            decrementTotalCompleted: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<HabitsBooleanService>(HabitsBooleanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackHabit', () => {
    it('should track a habit', async () => {
      const habit = {
        type: HabitType.BOOLEAN,
        completedDates: new Map(),
        save: jest.fn().mockResolvedValue(undefined),
      } as any;

      await service.trackHabit(habit, '2024-01-01');
      expect(habit.completedDates.get('2024-01-01')).toBe(1);
    });

    it('should not track a habit if it is already completed', async () => {
      const habit = {
        type: HabitType.BOOLEAN,
        completedDates: new Map([['2024-01-01', 1]]),
        save: jest.fn().mockResolvedValue(undefined),
      } as any;

      await service.trackHabit(habit, '2024-01-01');
      expect(habit.completedDates.get('2024-01-01')).toBe(1);
    });
  });

  describe('untrackHabit', () => {
    it('should untrack a habit', async () => {
      const habit = {
        type: HabitType.BOOLEAN,
        completedDates: new Map([['2024-01-01', 1]]),
        save: jest.fn().mockResolvedValue(undefined),
      } as any;

      await service.untrackHabit(habit, '2024-01-01');
      expect(habit.completedDates.get('2024-01-01')).toBeUndefined();
    });

    it('should not untrack a habit if it is not completed', async () => {
      const habit = {
        type: HabitType.BOOLEAN,
        completedDates: new Map(),
        save: jest.fn().mockResolvedValue(undefined),
      } as any;

      await service.untrackHabit(habit, '2024-01-01');
      expect(habit.completedDates.get('2024-01-01')).toBeUndefined();
    });
  });
});
