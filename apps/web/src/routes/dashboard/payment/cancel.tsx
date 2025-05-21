import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { XCircle } from "lucide-react"

export const Route = createFileRoute("/dashboard/payment/cancel")({
  component: PaymentCancelPage,
})

function PaymentCancelPage() {
  const navigate = useNavigate()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
        <div className="flex flex-col items-center">
          <XCircle className="text-amber-500 h-16 w-16 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Paiement annulé</h2>
          <p className="text-muted-foreground mb-6">
            Vous avez annulé votre achat de couronnes. Aucun montant n'a été
            débité de votre compte.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate({ to: "/dashboard" })}>
              Retour au tableau de bord
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/dashboard/buy-currency" })}
            >
              Revenir aux achats
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
