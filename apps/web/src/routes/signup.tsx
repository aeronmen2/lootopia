import { SignupForm } from "@/components/auth/SignupForm"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignupForm />
}
