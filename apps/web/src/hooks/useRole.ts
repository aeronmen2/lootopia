import { useAuth } from "./useAuth"

export function useRole(...roles: string[]) {
  const { user } = useAuth()
  return !!user && !!user.role && roles.includes(user.role)
}
