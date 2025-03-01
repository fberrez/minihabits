import { Habit, HabitDocument } from '../habits.schema';

export interface HabitStats {
  completions: number;
  completionRate7Days: number;
  completionRateMonth: number;
  completionRateYear: number;
  currentStreak: number;
  longestStreak: number;
}

export interface HabitService {
  trackHabit(habit: HabitDocument, date: string): Promise<Habit>;
  untrackHabit(habit: HabitDocument, date: string): Promise<Habit>;
  calculateStreak(habit: HabitDocument, upToDate?: string): number;
  isCompleted(habit: HabitDocument, date: string): boolean;
  getStats(habit: HabitDocument): HabitStats;
}
