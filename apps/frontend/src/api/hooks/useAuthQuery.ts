import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";

// This is a placeholder until we have the generated API client
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

interface Credentials {
  email: string;
  password: string;
}

export function useAuthQuery() {
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const queryClient = useQueryClient();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const isAuthenticated = !!accessToken;

  // Store tokens in localStorage when they change
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [accessToken, refreshToken]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: Credentials): Promise<AuthResponse> => {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: Credentials): Promise<AuthResponse> => {
      const response = await fetch(`${apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async (): Promise<AuthResponse> => {
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
    onError: () => {
      // If refresh fails, log the user out
      logout();
    },
  });

  // Logout function
  const logout = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    // Clear all queries from the cache
    queryClient.clear();
  }, [queryClient]);

  // Authenticated fetch function
  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!accessToken) {
        throw new Error("No access token available");
      }

      // Add the authorization header
      const authOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      };

      let response = await fetch(url, authOptions);

      // If the response is 401 Unauthorized, try to refresh the token
      if (response.status === 401 && refreshToken) {
        try {
          const refreshResponse = await refreshTokenMutation.mutateAsync();

          // Retry the original request with the new token
          authOptions.headers = {
            ...authOptions.headers,
            Authorization: `Bearer ${refreshResponse.accessToken}`,
          };

          response = await fetch(url, authOptions);
        } catch (error: unknown) {
          // If refresh fails, throw the error
          throw new Error(
            `Authentication failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      return response;
    },
    [accessToken, refreshToken, refreshTokenMutation]
  );

  return {
    isAuthenticated,
    accessToken,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    authenticatedFetch,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}
