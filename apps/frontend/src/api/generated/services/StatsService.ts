/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatsOutput } from '../models/StatsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatsService {
    /**
     * Get home page statistics
     * @returns StatsOutput Returns general statistics for the home page
     * @throws ApiError
     */
    public static statsControllerGetHomeStats(): CancelablePromise<StatsOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/stats/home',
        });
    }
}
