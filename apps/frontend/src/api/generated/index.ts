/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from './core/ApiError';
export { CancelablePromise, CancelError } from './core/CancelablePromise';
export { OpenAPI } from './core/OpenAPI';
export type { OpenAPIConfig } from './core/OpenAPI';

export type { AuthResponse } from './models/AuthResponse';
export type { CreateHabitDto } from './models/CreateHabitDto';
export type { ForgotPasswordDto } from './models/ForgotPasswordDto';
export type { Habit } from './models/Habit';
export type { HabitStatsOutput } from './models/HabitStatsOutput';
export type { HabitTypeOutput } from './models/HabitTypeOutput';
export type { ResetPasswordDto } from './models/ResetPasswordDto';
export type { SignInDto } from './models/SignInDto';
export type { SignUpDto } from './models/SignUpDto';
export type { Stats } from './models/Stats';
export type { StatsOutput } from './models/StatsOutput';
export type { TrackHabitDto } from './models/TrackHabitDto';
export type { UpdateEmailDto } from './models/UpdateEmailDto';
export type { UpdateHabitDto } from './models/UpdateHabitDto';
export type { UpdatePasswordDto } from './models/UpdatePasswordDto';

export { AuthService } from './services/AuthService';
export { HabitsService } from './services/HabitsService';
export { HealthcheckService } from './services/HealthcheckService';
export { PublicService } from './services/PublicService';
export { StatsService } from './services/StatsService';
export { UsersService } from './services/UsersService';

export * from './BillingService';

// Temporary API structure until backend is running
export const api = {
  billing: {
    billingControllerGetPlans: () => Promise.resolve([
      {
        id: 'monthly',
        name: 'Monthly Plan',
        price: 1.99,
        currency: 'EUR',
        interval: 'monthly',
        features: ['Unlimited habits', 'All statistics', 'Data export', 'Premium support']
      },
      {
        id: 'yearly', 
        name: 'Yearly Plan',
        price: 8.99,
        currency: 'EUR',
        interval: 'yearly',
        features: ['Unlimited habits', 'All statistics', 'Data export', 'Premium support', '2 months free']
      },
      {
        id: 'lifetime',
        name: 'Lifetime Plan', 
        price: 17.99,
        currency: 'EUR',
        interval: 'one_off',
        features: ['Unlimited habits', 'All statistics', 'Data export', 'Premium support', 'One-time payment', 'Lifetime updates']
      }
    ]),
    billingControllerGetSubscriptionInfo: () => Promise.resolve({
      subscriptionTier: 'free',
      subscriptionStatus: 'inactive',
      habitLimit: 3,
      canCreateHabits: true
    }),
    billingControllerCreateSubscription: (data: any) => Promise.resolve({
      redirectUrl: 'https://pay.gocardless.com/flow/...',
      flowId: 'RF123456'
    }),
    billingControllerCompleteSubscription: (data: any) => Promise.resolve({
      success: true
    })
  }
};
