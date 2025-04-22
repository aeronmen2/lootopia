import { createContext, useContext } from "react"
import { User, LoginCredentials } from "../api/auth"

export interface AuthContextType {
  user: User | null
  loading: boolean
  isConnected: boolean
  login: (credentials: LoginCredentials) => Promise<unknown>
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isConnected: false,
  login: async () => ({}),
  logout: async () => {},
  refreshUser: async () => null,
})

export const useAuth = () => useContext(AuthContext)
