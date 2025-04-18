import { AuthProvider } from "./context/AuthProvider"
import { InnerApp } from "./InnerApp"

export function App() {
  return (
    <AuthProvider>
      <InnerApp />
    </AuthProvider>
  )
}
