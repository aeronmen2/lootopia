// dashboard/_layout.tsx
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/_layout")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.loading) return
    if (!context.auth.isConnected) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      })
    }
  },
  loader: async ({ context, location }) => {
    if (!context.auth.isConnected) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
    return { isAuthenticated: context.auth.isConnected }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#f5f5f5", padding: 24 }}>
        <nav>
          <ul>
            <li>
              <a href="/dashboard">Home</a>
            </li>
            <li>
              <a href="/dashboard/settings">Settings</a>
            </li>
            <li>
              <a href="/dashboard/profile">Profile</a>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <main style={{ flex: 1, padding: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}
