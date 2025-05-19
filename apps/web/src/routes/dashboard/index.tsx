import { useCurrentUser } from "@/hooks/query/useAuthQueries"
import { useAuth } from "@/hooks/useAuth"
import { createFileRoute, useRouter, Link } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Compass, Users, User } from "lucide-react"

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
      <main className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Chasse au Trésor Virtuelle</h1>

          <div className="grid gap-6 md:grid-cols-3">
            <Link to="/create" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <Compass className="h-16 w-16 mb-4 text-emerald-600" />
                  <h2 className="text-2xl font-semibold text-center">Créer une chasse</h2>
                </CardContent>
              </Card>
            </Link>

            <Link to="/join" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <Users className="h-16 w-16 mb-4 text-blue-600" />
                  <h2 className="text-2xl font-semibold text-center">Rejoindre une chasse</h2>
                </CardContent>
              </Card>
            </Link>

            <Link to="/my-hunts" className="block">
              <Card className="h-full transition-all hover:shadow-lg">
                <CardContent className="flex flex-col items-center justify-center p-6 h-full">
                  <User className="h-16 w-16 mb-4 text-purple-600" />
                  <h2 className="text-2xl font-semibold text-center">Voir mes chasses</h2>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
