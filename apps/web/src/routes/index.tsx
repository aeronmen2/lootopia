import { LoginForm } from "@/components/auth/LoginForm"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return <LoginForm />
}
