import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/providers/AuthProvider';
import { BillingService as ApiBillingService } from '@/api/generated/services/BillingService';
import type { PlanOutput } from '@/api/generated/models/PlanOutput';
import type { BillingStatusOutput } from '@/api/generated/models/BillingStatusOutput';
import { OpenAPI } from '@/api/generated';

export function useBilling() {
  const { isAuthenticated, accessToken } = useAuth();
  const queryClient = useQueryClient();

  if (accessToken) {
    OpenAPI.TOKEN = accessToken;
  }

  const plansQuery = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: async (): Promise<PlanOutput[]> => {
      return ApiBillingService.billingControllerGetPlans();
    },
  });

  const statusQuery = useQuery({
    queryKey: ['billing', 'status'],
    enabled: isAuthenticated,
    queryFn: async (): Promise<BillingStatusOutput> => {
      return ApiBillingService.billingControllerStatus();
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: async (planCode: PlanOutput['code']) => {
      return ApiBillingService.billingControllerCheckout({
        requestBody: { planCode: planCode as any },
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      await ApiBillingService.billingControllerCancel();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing', 'status'] });
    },
  });

  return {
    plans: plansQuery.data ?? [],
    isLoadingPlans: plansQuery.isLoading,
    status: statusQuery.data,
    isLoadingStatus: statusQuery.isLoading,
    refreshStatus: statusQuery.refetch,
    createCheckout: checkoutMutation.mutateAsync,
    isCreatingCheckout: checkoutMutation.isPending,
    cancelAutoRenew: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,
  };
}
