/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { SignInDto } from '../models/SignInDto';
import type { SignUpDto } from '../models/SignUpDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Register a new user
     * @returns AuthResponse User registered successfully
     * @throws ApiError
     */
    public static authControllerSignUp({
        requestBody,
    }: {
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
     * Refresh access token
     * @returns AuthResponse Tokens refreshed successfully
     * @throws ApiError
     */
    public static authControllerRefreshToken(): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
}
