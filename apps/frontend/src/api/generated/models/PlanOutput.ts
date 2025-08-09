/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PlanOutput = {
    /**
     * Plan code
     */
    code: string;
    /**
     * Plan name
     */
    name: string;
    /**
     * Price in cents
     */
    priceCents: number;
    currency: string;
    interval: 'month' | 'year' | 'lifetime';
};

