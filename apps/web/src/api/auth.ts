import { api } from "./client"

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  user: User
  token?: string
  message?: string
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  logout: async (): Promise<{ success: boolean }> => {
    return api("/api/auth/logout", {
      method: "POST",
    })
  },

  getCurrentUser: async (): Promise<User> => {
    return api("/api/auth/me")
  },

  refreshToken: async (
    refreshToken: string,
  ): Promise<{
    token: string
    refreshToken: string
    expiresAt: string
    user: User
  }> => {
    return api("/api/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  },
}
