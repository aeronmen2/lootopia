import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/route-b")(
  {
    component: LayoutBComponent,
  },
)

function LayoutBComponent() {
  return <div>I'm layout B!</div>
}
