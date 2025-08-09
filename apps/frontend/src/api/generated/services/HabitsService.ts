/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateHabitDto } from '../models/CreateHabitDto';
import type { Habit } from '../models/Habit';
import type { HabitStatsOutput } from '../models/HabitStatsOutput';
import type { HabitTypeOutput } from '../models/HabitTypeOutput';
import type { TrackHabitDto } from '../models/TrackHabitDto';
import type { UpdateHabitDto } from '../models/UpdateHabitDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HabitsService {
    /**
     * Get all habits for the current user
     * @returns Habit List of habits
     * @throws ApiError
     */
    public static habitsControllerGetHabits(): CancelablePromise<Array<Habit>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Create a new habit
     * @returns Habit Habit created successfully
     * @throws ApiError
     */
    public static habitsControllerCreateHabit({
        requestBody,
    }: {
        /**
         * Habit data to create
         */
        requestBody: CreateHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/habits',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Get available habit types
     * @returns HabitTypeOutput List of habit types
     * @throws ApiError
     */
    public static habitsControllerGetHabitTypes(): CancelablePromise<Array<HabitTypeOutput>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/types',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Get habit limit and usage for current user
     * @returns any Limit information
     * @throws ApiError
     */
    public static habitsControllerGetHabitLimit(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/limit',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Get a habit by ID
     * @returns Habit Habit details
     * @throws ApiError
     */
    public static habitsControllerGetHabit({
        id,
    }: {
        /**
         * Habit ID
         */
        id: any,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Delete a habit
     * @returns Habit Habit deleted successfully
     * @throws ApiError
     */
    public static habitsControllerDeleteHabit({
        id,
    }: {
        /**
         * Habit ID
         */
        id: any,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/habits/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Update a habit
     * @returns Habit Habit updated successfully
     * @throws ApiError
     */
    public static habitsControllerUpdateHabit({
        id,
        requestBody,
    }: {
        /**
         * Habit ID
         */
        id: any,
        /**
         * Habit data to update
         */
        requestBody: UpdateHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/habits/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Get habit statistics
     * @returns HabitStatsOutput Habit statistics
     * @throws ApiError
     */
    public static habitsControllerGetHabitStats({
        id,
    }: {
        /**
         * Habit ID
         */
        id: any,
    }): CancelablePromise<HabitStatsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/habits/{id}/stats',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Track a habit for a specific date
     * @returns Habit Habit tracked successfully
     * @throws ApiError
     */
    public static habitsControllerTrackHabit({
        id,
        requestBody,
    }: {
        /**
         * Habit ID
         */
        id: any,
        /**
         * Date to track the habit
         */
        requestBody: TrackHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/habits/{id}/track',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Untrack a habit for a specific date
     * @returns Habit Habit untracked successfully
     * @throws ApiError
     */
    public static habitsControllerUntrackHabit({
        id,
        requestBody,
    }: {
        /**
         * Habit ID
         */
        id: any,
        /**
         * Date to untrack the habit
         */
        requestBody: TrackHabitDto,
    }): CancelablePromise<Habit> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/habits/{id}/untrack',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
}
