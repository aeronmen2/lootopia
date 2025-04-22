import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginForm } from "@/components/auth/LoginForm"

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    // Wait for auth loading to finish
    if (context.auth.loading) {
      return
    }
    // If user is already connected, redirect to dashboard
    if (context.auth.isConnected) {
      throw redirect({ to: "/dashboard/route-a" })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  return <LoginForm />
}
