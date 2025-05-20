import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import { useAuth } from "./hooks/useAuth"

export function InnerApp() {
  const auth = useAuth()
  const { loading } = useAuth()

  if (loading) return <div></div>

  return <RouterProvider router={router} context={{ auth }} />
}
