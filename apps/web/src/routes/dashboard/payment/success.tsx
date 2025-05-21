import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useSearch } from "@tanstack/react-router"
import { paymentApi } from "@/api/paymentApi"
import useToast from "@/hooks/useToast"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"

export const Route = createFileRoute("/dashboard/payment/success")({
  component: PaymentSuccessPage,
})

function PaymentSuccessPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const [amount, setAmount] = useState<number | null>(null)
  const search = useSearch({ from: "/dashboard/payment/success" })
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = search.session_id as string

      if (!sessionId) {
        setIsVerifying(false)
        return
      }

      try {
        const result = await paymentApi.verifyPayment(sessionId)
        setIsSuccess(result.success)

        if (result.success && result.transaction) {
          setAmount(result.transaction.amount)

          // Show success message
          toast.success({
            title: "Paiement réussi",
            message: `Vous avez ajouté ${result.transaction.amount} couronnes à votre compte.`,
          })
        }
      } catch (error) {
        console.error("Error verifying payment:", error)
        setIsSuccess(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyPayment()
  }, [search, toast])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
        {isVerifying ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">
              Vérification en cours
            </h2>
            <p className="text-muted-foreground">
              Nous vérifions votre paiement. Veuillez patienter...
            </p>
          </div>
        ) : isSuccess ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
            {amount && (
              <div className="mb-4 bg-green-50 p-4 rounded-lg">
                <p className="font-medium">
                  Vous avez ajouté{" "}
                  <span className="font-bold text-lg">{amount}</span>{" "}
                  <span className="text-yellow-500">couronnes</span> à votre
                  compte.
                </p>
              </div>
            )}
            <p className="text-muted-foreground mb-6">
              Votre transaction a été complétée avec succès. Vous pouvez
              maintenant utiliser vos couronnes pour participer à des chasses au
              trésor !
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: "/dashboard" })}>
                Retour au tableau de bord
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/dashboard/buy-currency" })}
              >
                Acheter plus de couronnes
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Un problème est survenu</h2>
            <p className="text-muted-foreground mb-6">
              Nous n'avons pas pu vérifier votre paiement. Si vous pensez qu'il
              s'agit d'une erreur, veuillez contacter notre support.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: "/dashboard" })}>
                Retour au tableau de bord
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/dashboard/buy-currency" })}
              >
                Réessayer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
