import { useState, useEffect } from "react";
import { api } from "../api/generated";

interface SubscriptionInfo {
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
  habitLimit: number;
  canCreateHabits: boolean;
}

export function useSubscription() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.billing.billingControllerGetSubscriptionInfo();
      setSubscriptionInfo(data);
    } catch (err) {
      console.error("Failed to fetch subscription info:", err);
      setError("Failed to load subscription information");
      // Set default free tier on error
      setSubscriptionInfo({
        subscriptionTier: 'free',
        subscriptionStatus: 'inactive',
        habitLimit: 3,
        canCreateHabits: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionInfo();
  }, []);

  const refetch = () => {
    fetchSubscriptionInfo();
  };

  return {
    subscriptionInfo,
    loading,
    error,
    refetch
  };
}