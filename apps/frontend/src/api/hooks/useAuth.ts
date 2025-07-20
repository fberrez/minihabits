import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { AuthService } from "../generated/services/AuthService";
import { OpenAPI } from "../generated/core/OpenAPI";

export function useAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("accessToken");
  });
  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem("refreshToken");
  });
  const queryClient = useQueryClient();

  const isAuthenticated = !!accessToken;

  // Set the authorization token for the OpenAPI client
  useEffect(() => {
    if (accessToken) {
      OpenAPI.TOKEN = accessToken;
    } else {
      OpenAPI.TOKEN = undefined;
    }
  }, [accessToken]);

  // Store tokens in localStorage when they change
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return AuthService.authControllerSignIn({
        requestBody: { email, password },
      });
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return AuthService.authControllerSignUp({
        requestBody: { email, password },
      });
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      // The OpenAPI client will handle sending the refresh token in cookies
      return AuthService.authControllerRefreshToken();
    },
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    },
    onError: () => {
      // If refresh fails, log the user out
      signOut();
    },
  });

  // Sign out function
  const signOut = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    // Clear all queries from the cache
    queryClient.clear();
  }, [queryClient]);

  // Wrapper functions to match the original context API
  const signIn = useCallback(
    async (email: string, password: string) => {
      await signInMutation.mutateAsync({ email, password });
    },
    [signInMutation]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      await signUpMutation.mutateAsync({ email, password });
    },
    [signUpMutation]
  );

  // Authenticated fetch function with token refresh
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
    refreshToken,
    signIn,
    signUp,
    signOut,
    authenticatedFetch,
    isSigningIn: signInMutation.isPending,
    isSigningUp: signUpMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
  };
}
