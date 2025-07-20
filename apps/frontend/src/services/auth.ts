import { AuthResponse, SignInDto, SignUpDto } from "@/api/generated";

export class AuthService {
  private static BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

  static async signIn(credentials: SignInDto): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Sign in failed");
    }

    return response.json();
  }

  static async signUp(credentials: SignUpDto): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Sign up failed");
    }

    return response.json();
  }

  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await fetch(`${this.BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    return response.json();
  }

  static async fetchWithTokenRefresh(
    url: string,
    options: RequestInit,
    refreshToken: string
  ): Promise<Response> {
    let response = await fetch(url, options);

    if (response.status === 401) {
      try {
        // Get new tokens
        const newTokens = await this.refreshToken(refreshToken);

        // Update Authorization header with new access token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${newTokens.accessToken}`,
        };

        // Retry original request with new token
        response = await fetch(url, options);
      } catch {
        // If refresh fails, throw error to trigger sign out
        throw new Error("Token refresh failed");
      }
    }

    return response;
  }
}
