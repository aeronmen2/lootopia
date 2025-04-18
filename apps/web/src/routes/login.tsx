import { LoginForm } from "@/components/auth/LoginForm"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/login")({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginForm />
}
