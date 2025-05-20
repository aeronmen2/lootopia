import { QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./context/AuthProvider"
import { InnerApp } from "./InnerApp"
import { queryClient } from "./queryClient"

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </QueryClientProvider>
  )
}
