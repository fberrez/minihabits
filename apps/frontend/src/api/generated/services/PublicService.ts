/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { SignInDto } from '../models/SignInDto';
import type { SignUpDto } from '../models/SignUpDto';
import type { StatsOutput } from '../models/StatsOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicService {
    /**
     * Register a new user
     * @returns AuthResponse User registered successfully
     * @throws ApiError
     */
    public static authControllerSignUp({
        requestBody,
    }: {
        /**
         * User data to register
         */
        requestBody: SignUpDto,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Email already exists`,
            },
        });
    }
    /**
     * Sign in with email and password
     * @returns AuthResponse User signed in successfully
     * @throws ApiError
     */
    public static authControllerSignIn({
        requestBody,
    }: {
        /**
         * User data to sign in
         */
        requestBody: SignInDto,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }
    /**
     * Request password reset
     * @returns any Password reset email sent
     * @throws ApiError
     */
    public static usersControllerForgotPassword(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/forgot-password',
        });
    }
    /**
     * Reset password with token
     * @returns any Password reset successful
     * @throws ApiError
     */
    public static usersControllerResetPassword(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/reset-password',
            errors: {
                401: `Invalid or expired token`,
            },
        });
    }
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
    /**
     * @returns any The Health Check is successful
     * @throws ApiError
     */
    public static healthcheckControllerReadiness(): CancelablePromise<{
        status?: string;
        info?: Record<string, Record<string, any>> | null;
        error?: Record<string, Record<string, any>> | null;
        details?: Record<string, Record<string, any>>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/healthcheck',
            errors: {
                503: `The Health Check is not successful`,
            },
        });
    }
}
