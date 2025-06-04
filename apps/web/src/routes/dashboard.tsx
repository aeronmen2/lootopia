import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { LayoutDashboard, Map, Settings, FolderOpen, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { useRole } from '@/hooks/useRole';

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async ({ context, location }) => {
    console.log('Dashboard beforeLoad');
    if (context.auth.loading) return;
    if (!context.auth.isConnected) {
      throw redirect({
        to: '/',
        search: { redirect: location.href },
      });
    }
  },
  loader: async ({ context, location }) => {
    if (!context.auth.isConnected) {
      throw redirect({ to: '/', search: { redirect: location.href } });
    }
    return { isAuthenticated: context.auth.isConnected };
  },
  component: DashboardLayoutComponent,
});

function DashboardLayoutComponent() {
  const { user, logout } = useAuth();

  const canCreateHunt = useRole('admin', 'organizer');

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full flex-row">
        <Sidebar className="border-r bg-gray-50">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-5 py-4">
              <Link to="/" className="flex items-center">
                <span className="text-lg font-semibold">lootopia</span>
              </Link>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="px-3 py-2.5 font-medium">
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className="px-3 py-2.5 font-medium">
                  <Link to="/dashboard/route-a">
                    <Map className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Maps</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild className="px-3 py-2.5 font-medium">
                  <Link to="/dashboard/route-b">
                    <FolderOpen className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarSeparator className="my-3" />

            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="px-3 py-2.5 font-medium">
                  <Link to="/user">
                    <Settings className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarSeparator className="my-3" />

          <SidebarMenu className="px-2 mb-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium px-3 py-2.5 transition-colors"
              >
                <Link to="/dashboard/buy-currency">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-3 text-emerald-600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16V8M16 12H8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Acheter des couronnes</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {canCreateHunt && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="bg-red-100 hover:bg-red-200 text-red-800 font-medium px-3 py-2.5 transition-colors"
                >
                  <Link to="/dashboard/create-artifact">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 mr-3 text-red-600"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 16V8M16 12H8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Creer un Artefact</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="bg-yellow-100 hover:bg-yellowa-200 text-yellow-800 font-medium px-3 py-2.5 transition-colors"
              >
                <Link to="/dashboard/buy-currency">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-3 text-yellow-600"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 16V8M16 12H8M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Marketplace</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium px-3 py-2.5 transition-colors"
              >
                <Link to="/shop">
                  <span className="h-5 w-5 mr-3 text-purple-600">👑</span>
                  <span>Crown Shop</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium px-3 py-2.5 transition-colors"
              >
                <Link to="/my-artefacts">
                  <span className="h-5 w-5 mr-3 text-amber-600">🏺</span>
                  <span>My Collection</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="bg-green-100 hover:bg-green-200 text-green-800 font-medium px-3 py-2.5 transition-colors"
              >
                <Link to="/artefacts">
                  <span className="h-5 w-5 mr-3 text-green-600">🏪</span>
                  <span>Marketplace</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild className="px-3 py-2.5 font-medium">
                <Link to="/dashboard/transactions">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5 mr-3 text-gray-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 5H3M21 12H3M21 19H3"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Historique</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Hunt Creation Button: Only for admin or organizer */}
            {canCreateHunt && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="px-3 py-2.5 font-medium bg-blue-100 hover:bg-blue-200 text-blue-800"
                >
                  <Link to="/create">
                    <span className="mr-2">➕</span>
                    <span>Créer une chasse</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>

          <SidebarFooter className="mt-auto border-t">
            <div className="flex items-center p-4">
              <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col ml-3">
                <span className="text-sm font-medium">
                  {user?.name || 'User'}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-xs text-gray-500 hover:text-red-500 text-left mt-0.5"
                >
                  Logout
                </button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navbar */}
          <header className="border-b bg-white px-6 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Dashboard</h1>

              <div className="flex items-center space-x-4">
                <button className="relative p-1 rounded-full hover:bg-gray-100">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
