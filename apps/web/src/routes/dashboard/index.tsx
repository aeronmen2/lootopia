import { useCurrentUser } from "@/hooks/query/useAuthQueries"
import { useAuth } from "@/hooks/useAuth"
import { createFileRoute, useRouter } from "@tanstack/react-router"

// dashboard/index.tsx
export const Route = createFileRoute("/dashboard/")({
  loader: async ({ context }) => {
    // loader logic here
    return { isAuthenticated: context.auth.isConnected }
  },
  component: DashboardHome,
})

function DashboardHome() {
  const { logout } = useAuth()
  const { data: user, isLoading } = useCurrentUser()
  const { isAuthenticated } = Route.useLoaderData()
  const router = useRouter()

  if (!isAuthenticated) return null
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Email: {user.email}</p>
          <button
            onClick={() => {
              logout()
              router.navigate({ to: "/" })
            }}
            className="px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
