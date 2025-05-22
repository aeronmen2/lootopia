import { createFileRoute, Link } from "@tanstack/react-router"
import { useBalance } from "@/hooks/query/useBalanceQuery"
import { useRole } from "@/hooks/useRole"

export const Route = createFileRoute("/dashboard/")({
  component: DashboardIndexComponent,
})

function DashboardIndexComponent() {
  const { data: userBalance } = useBalance()

  const canCreateHunt = useRole("admin", "organizer")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Votre solde</h2>
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-3xl font-bold">{userBalance || 0}</span>
            <svg
              className="h-6 w-6 text-yellow-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
          <div className="flex space-x-2">
            <Link
              to="/dashboard/buy-currency"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium"
            >
              Acheter des couronnes
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Marché</h2>
          <p className="text-muted-foreground mb-4">
            Découvrez notre sélection d'objets exclusifs et d'avantages
            disponibles dans la boutique.
          </p>
          <Link
            to="/dashboard/marketplace"
            className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
          >
            Voir la boutique →
          </Link>
        </div>
        {canCreateHunt && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4">Chasses au trésor</h2>
            <p className="text-muted-foreground mb-4">
              Participez à des chasses au trésor passionnantes ou créez les
              vôtres.
            </p>
            <Link
              to="/create"
              className="inline-flex items-center text-primary hover:text-primary/90 font-medium"
            >
              Créer une chasse →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
