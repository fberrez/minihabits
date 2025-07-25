import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import {
  SubscriptionPlanInfo,
  SubscriptionLimits,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  CancelSubscriptionResponse,
  SubscriptionPlan,
} from '../types/billing';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useSubscription() {
  const { authenticatedFetch, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Query for subscription plans
  const plansQuery = useQuery<SubscriptionPlanInfo[]>({
    queryKey: ['subscription', 'plans'],
    queryFn: async () => {
      const response = await authenticatedFetch(`${API_BASE_URL}/billing/plans`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription plans');
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Query for subscription limits
  const limitsQuery = useQuery<SubscriptionLimits>({
    queryKey: ['subscription', 'limits'],
    queryFn: async () => {
      const response = await authenticatedFetch(`${API_BASE_URL}/billing/limits`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription limits');
      }
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Mutation for creating subscription
  const createSubscriptionMutation = useMutation<
    CreateSubscriptionResponse,
    Error,
    CreateSubscriptionRequest
  >({
    mutationFn: async (data: CreateSubscriptionRequest) => {
      const response = await authenticatedFetch(`${API_BASE_URL}/billing/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create subscription');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  // Mutation for cancelling subscription
  const cancelSubscriptionMutation = useMutation<CancelSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await authenticatedFetch(`${API_BASE_URL}/billing/cancel-subscription`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel subscription');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });

  // Helper functions
  const createSubscription = async (plan: SubscriptionPlan) => {
    const baseUrl = window.location.origin;
    const data: CreateSubscriptionRequest = {
      plan,
      redirectUrl: `${baseUrl}/billing/success`,
      cancelUrl: `${baseUrl}/billing/cancel`,
    };

    const result = await createSubscriptionMutation.mutateAsync(data);
    
    // Redirect to Mollie checkout
    window.location.href = result.checkoutUrl;
    
    return result;
  };

  const cancelSubscription = async () => {
    return cancelSubscriptionMutation.mutateAsync();
  };

  // Computed values
  const currentPlan = limitsQuery.data?.plan || SubscriptionPlan.FREE;
  const canCreateHabits = limitsQuery.data?.canCreateHabits ?? true;
  const habitLimit = limitsQuery.data?.habitLimit ?? 3;
  const currentHabits = limitsQuery.data?.currentHabits ?? 0;
  const isUnlimited = habitLimit === -1;

  // Helper to calculate savings
  const calculateSavings = (yearlyPrice: number, monthlyPrice: number): number => {
    const yearlyMonthly = (monthlyPrice * 12) - yearlyPrice;
    return Math.round((yearlyMonthly / (monthlyPrice * 12)) * 100);
  };

  // Get savings percentage for yearly plan
  const getYearlySavings = (): number => {
    if (!plansQuery.data) return 0;
    
    const monthly = plansQuery.data.find(p => p.plan === SubscriptionPlan.MONTHLY);
    const yearly = plansQuery.data.find(p => p.plan === SubscriptionPlan.YEARLY);
    
    if (!monthly || !yearly) return 0;
    
    return calculateSavings(yearly.price, monthly.price);
  };

  return {
    // Data
    plans: plansQuery.data || [],
    limits: limitsQuery.data,
    currentPlan,
    canCreateHabits,
    habitLimit,
    currentHabits,
    isUnlimited,
    
    // Loading states
    isLoadingPlans: plansQuery.isLoading,
    isLoadingLimits: limitsQuery.isLoading,
    isCreatingSubscription: createSubscriptionMutation.isPending,
    isCancellingSubscription: cancelSubscriptionMutation.isPending,
    
    // Error states
    plansError: plansQuery.error,
    limitsError: limitsQuery.error,
    createSubscriptionError: createSubscriptionMutation.error,
    cancelSubscriptionError: cancelSubscriptionMutation.error,
    
    // Actions
    createSubscription,
    cancelSubscription,
    
    // Helpers
    getYearlySavings,
    
    // Refetch functions
    refetchPlans: plansQuery.refetch,
    refetchLimits: limitsQuery.refetch,
  };
}