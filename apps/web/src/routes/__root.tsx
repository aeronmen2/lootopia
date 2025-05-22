import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useMatches,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { AuthContextType } from "@/context/AuthContext"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { CompassIcon, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MyRouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { user, isConnected, logout } = useAuth()

  const matches = useMatches()

  // Check if we're on a dashboard route
  const isDashboard = matches.some((match) =>
    match.routeId.includes("/dashboard"),
  )

  return (
    <>
      {!isDashboard && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <CompassIcon className="h-8 w-8 text-black" />
              <span className="font-medium text-xl">Lootopia</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Home
              </Link>
              <a
                href="#features"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#download"
                className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
              >
                Download
              </a>
            </div>

            <div className="flex items-center space-x-4">
              {isConnected && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Avatar className="h-8 w-8 border border-gray-200">
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {user.name || "User"}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="cursor-pointer flex items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer flex items-center"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="text-sm">
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-black text-white hover:bg-gray-800 text-sm">
                      Sign up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
      <Outlet />
      <TanStackRouterDevtools position="top-right" initialIsOpen={false} />
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
