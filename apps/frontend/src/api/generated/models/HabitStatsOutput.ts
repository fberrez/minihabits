/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HabitStatsOutput = {
    /**
     * Name of the habit
     */
    name: string;
    /**
     * Type of the habit
     */
    type: 'boolean' | 'counter';
    /**
     * Target counter value for counter-type habits
     */
    targetCounter?: number;
    /**
     * Current streak of the habit
     */
    currentStreak: number;
    /**
     * Longest streak of the habit
     */
    longestStreak: number;
    /**
     * Completion rate of the habit in the last 7 days
     */
    completionRate7Days: number;
    /**
     * Completion rate of the habit in the current month
     */
    completionRateMonth: number;
    /**
     * Completion rate of the habit in the current year
     */
    completionRateYear: number;
    /**
     * Total completions of the habit
     */
    completions: number;
};

