import { createFileRoute, redirect } from "@tanstack/react-router"
import { SignupForm } from "@/components/auth/SignupForm"

export const Route = createFileRoute("/signup")({
  beforeLoad: async ({ context }) => {
    if (context.auth.loading) {
      return
    }
    if (context.auth.isConnected) {
      throw redirect({ to: "/dashboard" })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}
