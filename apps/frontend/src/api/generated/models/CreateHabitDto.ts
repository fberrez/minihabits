/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateHabitDto = {
    /**
     * Name of the habit
     */
    name: string;
    /**
     * Color of the habit
     */
    color?: '#e57373' | '#64b5f6' | '#81c784' | '#ffd54f' | '#ba68c8' | '#ffb74d' | '#f06292' | '#4db6ac';
    /**
     * Type of the habit
     */
    type?: 'boolean' | 'counter';
    /**
     * Target counter value for counter-type habits (required for counter-type habits)
     */
    targetCounter?: number;
};

