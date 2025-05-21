import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/payment/")({
  component: PaymentLayout,
})

function PaymentLayout() {
  return <Outlet />
}
