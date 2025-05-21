import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useRef, useEffect } from "react"
import { useSearch } from "@tanstack/react-router"
import useToast from "@/hooks/useToast"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { usePaymentVerification } from "@/hooks/query/usePaymentQueries"

export const Route = createFileRoute("/dashboard/payment/success")({
  component: PaymentSuccessPage,
})

function PaymentSuccessPage() {
  const search = useSearch({ from: "/dashboard/payment/success" }) as {
    session_id?: string
  }
  const navigate = useNavigate()
  const { toast } = useToast()
  const toastShown = useRef(false)

  const {
    data: result,
    isLoading,
    error,
  } = usePaymentVerification(search.session_id)

  useEffect(() => {
    if (!result || toastShown.current) return

    if (result.success && result.transaction) {
      toast.success({
        title: "Paiement réussi",
        message: `Vous avez ajouté ${result.transaction.amount} couronnes à votre compte.`,
      })
      toastShown.current = true
    } else if (!result.success && result.paymentStatus) {
      switch (result.paymentStatus) {
        case "paid":
          toast.warning({
            title: "Paiement en cours de traitement",
            message:
              "Votre paiement a été reçu et est en cours de traitement. Veuillez rafraîchir la page dans quelques secondes.",
          })
          break
        case "unpaid":
          toast.error({
            title: "Paiement en attente",
            message:
              "Nous n'avons pas encore reçu votre paiement. Si vous avez déjà payé, veuillez patienter quelques instants et rafraîchir la page.",
          })
          break
        default:
          toast.error({
            title: "Statut de paiement inconnu",
            message:
              "Le statut de votre paiement est inconnu. Veuillez contacter le support si le problème persiste.",
          })
      }
    }
  }, [result, toast])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              Vérification en cours
            </h2>
            <p className="text-muted-foreground">
              Nous vérifions votre paiement. Veuillez patienter...
            </p>
          </div>
        ) : error ? (
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
        ) : result?.success ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="text-green-500 h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Paiement réussi !</h2>
            {result.transaction && (
              <div className="mb-4 bg-green-50 p-4 rounded-lg">
                <p className="font-medium">
                  Vous avez ajouté{" "}
                  <span className="font-bold text-lg">
                    {result.transaction.amount}
                  </span>{" "}
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
