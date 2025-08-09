/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BillingStatusOutput } from '../models/BillingStatusOutput';
import type { CheckoutDto } from '../models/CheckoutDto';
import type { CheckoutOutput } from '../models/CheckoutOutput';
import type { PlanOutput } from '../models/PlanOutput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingService {
    /**
     * List active plans
     * @returns PlanOutput
     * @throws ApiError
     */
    public static billingControllerGetPlans(): CancelablePromise<Array<PlanOutput>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/plans',
        });
    }
    /**
     * Create checkout session
     * @returns CheckoutOutput
     * @throws ApiError
     */
    public static billingControllerCheckout({
        requestBody,
    }: {
        requestBody: CheckoutDto,
    }): CancelablePromise<CheckoutOutput> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/checkout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Mollie webhook endpoint
     * @returns any
     * @throws ApiError
     */
    public static billingControllerWebhook(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/webhook',
        });
    }
    /**
     * Get current billing status
     * @returns BillingStatusOutput
     * @throws ApiError
     */
    public static billingControllerStatus(): CancelablePromise<BillingStatusOutput> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/billing/status',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Cancel auto-renew at period end (recurring only)
     * @returns void
     * @throws ApiError
     */
    public static billingControllerCancel(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/billing/cancel',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
}
