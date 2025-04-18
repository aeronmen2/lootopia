import { RouterProvider } from "@tanstack/react-router"
import { router } from "./router"
import { useAuth } from "./hooks/useAuth"

export function InnerApp() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}
