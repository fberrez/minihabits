import { useQuery } from "@tanstack/react-query";
import { OpenAPI, StatsService } from "../generated";
import { useAuth } from "../../providers/AuthProvider";

export function useStats() {
  const { accessToken } = useAuth();

  // Set token if available, but don't require it
  if (accessToken) {
    OpenAPI.TOKEN = accessToken;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      return StatsService.statsControllerGetHomeStats();
    },
    // No authentication check needed for this public endpoint
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  return { data, isLoading, error };
}
