import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useMatches,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { AuthContextType } from '@/context/AuthContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MyRouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  const { user, isConnected, logout } = useAuth();

  const matches = useMatches();

  const isDashboard = matches.some((match) =>
    match.routeId.includes('/dashboard')
  );

  return (
    <>
      {!isDashboard && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                🏝️
              </div>
              <span className="font-bold text-xl text-gray-900">Lootopia</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1 bg-gray-50/80 rounded-full px-3 py-2 backdrop-blur-sm absolute left-1/2 transform -translate-x-1/2">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center space-x-1"
              >
                <span>🏠</span>
                <span>Home</span>
              </Link>
              <a
                href="/hunts"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center space-x-1"
              >
                <span>🗺️</span>
                <span>Hunts</span>
              </a>
              <a
                href="/marketplace"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center space-x-1"
              >
                <span>🏪</span>
                <span>Marketplace</span>
              </a>
              <a
                href="/artefacts"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center space-x-1"
              >
                <span>💎</span>
                <span>Artefacts</span>
              </a>
              <a
                href="/shop"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-full transition-all duration-200 flex items-center space-x-1"
              >
                <span>🛒</span>
                <span>Shop</span>
              </a>
            </div>

            <div className="flex items-center space-x-3">
              {isConnected && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-full px-3 py-2 transition-all duration-200 group">
                      <Avatar className="h-8 w-8 border border-gray-200 group-hover:border-gray-300 transition-colors">
                        <AvatarFallback className="bg-gray-100 text-gray-700 font-medium">
                          {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {user.name || 'Adventurer'} ⚡
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/dashboard"
                        className="cursor-pointer flex items-center"
                      >
                        <span className="mr-2">🏴‍☠️</span>
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer flex items-center"
                      onClick={() => logout()}
                    >
                      <span className="mr-2">🚪</span>
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="outline" className="text-sm font-medium">
                      🔑 Sign in
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium">
                      🌟 Sign up
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
  );
}
