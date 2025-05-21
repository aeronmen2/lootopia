import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginForm } from "@/components/auth/LoginForm"

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    if (context.auth.loading) {
      return
    }
    if (context.auth.isConnected) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  return <LoginForm />
}
