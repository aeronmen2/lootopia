import { authApi, LoginCredentials } from "@/api/auth"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  login: () => [...authKeys.all, "login"] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const response = await authApi.getCurrentUser()
        return response.data.user
      } catch (error) {
        console.error("Failed to get current user:", error)
        return null
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(authKeys.user(), data.data.user)
      }
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null)
      queryClient.invalidateQueries({ queryKey: authKeys.user() })
      queryClient.clear()
    },
  })
}

export function useSignup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }) => authApi.signup(name, email, password),
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(authKeys.user(), data.data.user)
      }
    },
  })
}
