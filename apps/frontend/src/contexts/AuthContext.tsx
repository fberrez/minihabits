import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { AuthService } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });
  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('refreshToken');
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }, [refreshToken]);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await AuthService.signIn({ email, password });
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const response = await AuthService.signUp({ email, password });
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
  }, []);

  const signOut = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    if (!accessToken || !refreshToken) {
      throw new Error('No authentication tokens available');
    }

    const authenticatedOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await AuthService.fetchWithTokenRefresh(
        url,
        authenticatedOptions,
        refreshToken
      );

      // If we got a new token from the refresh process, update it
      const newAccessToken = response.headers.get('X-New-Access-Token');
      if (newAccessToken) {
        setAccessToken(newAccessToken);
      }

      return response;
    } catch (error) {
      if (error instanceof Error && error.message === 'Token refresh failed') {
        signOut();
      }
      throw error;
    }
  }, [accessToken, refreshToken, signOut]);

  const value = {
    isAuthenticated: !!accessToken,
    accessToken,
    refreshToken,
    signIn,
    signUp,
    signOut,
    authenticatedFetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 