import { HabitType } from '../habits.schema';

interface HabitStat {
  name: string;
  type: HabitType;
  targetCounter?: number;
  currentStreak: number;
  longestStreak: number;
  completions: number;
  completionRate7Days: number;
  completionRateYear: number;
  completionRateMonth: number;
}

export interface HabitStats {
  totalHabits: number;
  totalCompletions: number;
  habitsCompletedToday: number;
  averageStreak: number;
  completionRate7Days: number;
  completionRateYear: number;
  maxStreak: number;
  habits: HabitStat[];
}
