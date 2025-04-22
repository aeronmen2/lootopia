import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { AuthContextType } from "@/context/AuthContext"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  ),
})
