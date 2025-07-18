/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Habit = {
    _id: string;
    name: string;
    userId: string;
    color: '#e57373' | '#64b5f6' | '#81c784' | '#ffd54f' | '#ba68c8' | '#ffb74d' | '#f06292' | '#4db6ac';
    createdAt: string;
    completedDates: Record<string, any>;
    currentStreak: number;
    longestStreak: number;
    type: 'boolean' | 'counter';
    targetCounter: number;
};

