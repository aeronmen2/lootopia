import React, { useCallback } from "react"
import { AuthContext } from "./AuthContext"
import { LoginCredentials, User } from "../api/auth"
import {
  useCurrentUser,
  useLogin,
  useLogout,
} from "@/hooks/query/useAuthQueries"
import { useQueryClient } from "@tanstack/react-query"

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient()
  const { data: user, isLoading: loading, isError, refetch } = useCurrentUser()

  const isConnected = !!user && !isError

  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const result = await loginMutation.mutateAsync(credentials)
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
        return result
      } catch (error) {
        throw error
      }
    },
    [loginMutation, queryClient],
  )

  const logout = useCallback(async () => {
    await logoutMutation.mutateAsync()
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
    await queryClient.clear()
  }, [logoutMutation, queryClient])

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const result = await refetch()
      return result.data || null
    } catch {
      return null
    }
  }, [refetch])

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        loading,
        isConnected,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
