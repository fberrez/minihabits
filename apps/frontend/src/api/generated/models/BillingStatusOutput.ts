/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BillingStatusOutput = {
    isPremium?: boolean;
    planCode?: 'free' | 'premium-monthly' | 'premium-yearly' | 'premium-lifetime';
    status?: 'active' | 'canceled' | 'cancel_at_period_end' | 'expired' | 'incomplete' | 'past_due';
    currentPeriodEnd?: string | null;
    canCancel?: boolean;
    cancelAtPeriodEnd?: boolean;
};

