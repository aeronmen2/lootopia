import { useAuth } from "@/hooks/useAuth"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/")({
  beforeLoad: ({ context, location }) => {
    console.log(context)
    // Don't return early if loading, let the redirect happen
    if (!context.auth.loading && !context.auth.isConnected) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      })
    }
  },
  // Add loader to ensure the route is sensitive to auth state changes
  loader: ({ context }) => {
    return {
      isAuthenticated: context.auth.isConnected,
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user, logout } = useAuth()

  // Add this to redirect if auth state changes while on the page
  const { isAuthenticated } = Route.useLoaderData()

  if (!isAuthenticated) {
    return null // This will prevent flash of content before redirect happens
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <button
            onClick={logout}
            className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
