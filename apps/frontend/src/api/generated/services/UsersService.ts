/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get current user profile
     * @returns any Returns the current user profile
     * @throws ApiError
     */
    public static usersControllerGetMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Update email address
     * @returns any Email updated successfully
     * @throws ApiError
     */
    public static usersControllerUpdateEmail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/email',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
                409: `Email already exists`,
            },
        });
    }
    /**
     * Update password
     * @returns any Password updated successfully
     * @throws ApiError
     */
    public static usersControllerUpdatePassword(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/users/password',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Delete account
     * @returns void
     * @throws ApiError
     */
    public static usersControllerDeleteAccount({
        requestBody,
    }: {
        requestBody: {
            /**
             * Current password for verification
             */
            password?: string;
        },
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
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
}
