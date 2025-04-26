import { createFileRoute, redirect } from "@tanstack/react-router"
import { LoginForm } from "@/components/auth/LoginForm"

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context }) => {
    if (context.auth.loading) {
      return
    }
    if (context.auth.isConnected) {
      throw redirect({ to: "/dashboard/route-b" })
    }
  },
  component: Index,
})

function Index() {
  return (
    <div>
      <LoginForm />
    </div>
  )
}
