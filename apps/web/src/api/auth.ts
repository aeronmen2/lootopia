import { api } from "./client"
import { User } from "@/lib/types"

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  status: string
  message: string
  data?: {
    userId?: string
    user?: User
  }
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  },

  signup: async (
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    return api("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({
        name,
        email: email.toLowerCase(),
        password,
      }),
    })
  },

  update: async (id: string, data: Partial<User>): Promise<User> => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as any)
      }
    })

    return api(`/api/users/${id}`, {
      method: "PATCH",
      body: formData,
    })
  },

  logout: async (): Promise<{ status: string; message: string }> => {
    return api("/api/auth/logout", {
      method: "POST",
    })
  },

  delete: async (id: string): Promise<{ status: string; message: string }> => {
    return api(`/api/users/${id}`, {
      method: "DELETE",
    })
  },

  getCurrentUser: async (): Promise<{
    status: string
    data: { user: User }
  }> => {
    return api("/api/auth/me")
  },
}

export type { User }
