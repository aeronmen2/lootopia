import { createFileRoute } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import useToast from "@/hooks/useToast"
import { paymentApi } from "@/api/paymentApi"
import { useAuth } from "@/hooks/useAuth"

export const Route = createFileRoute("/dashboard/buy-currency")({
  component: BuyCurrencyPage,
})

// Currency packages
const CURRENCY_PACKAGES = [
  {
    id: "micro",
    name: "Pack découverte",
    amount: 10,
    price: 0.99,
    popular: false,
  },
  {
    id: "small",
    name: "Pack basique",
    amount: 25,
    price: 2.49,
    popular: false,
  },
  {
    id: "medium",
    name: "Pack standard",
    amount: 50,
    price: 4.99,
    popular: true,
  },
  {
    id: "large",
    name: "Pack premium",
    amount: 100,
    price: 9.99,
    popular: false,
  },
  {
    id: "mega",
    name: "Pack méga",
    amount: 1000,
    price: 89.99,
    popular: false,
  },
]

function BuyCurrencyPage() {
  const [selectedPackage, setSelectedPackage] = useState(CURRENCY_PACKAGES[2])
  const [isLoading, setIsLoading] = useState(false)
  const [userBalance, setUserBalance] = useState<number | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await paymentApi.getBalance()
        if (response.success) {
          setUserBalance(response.balance)
        }
      } catch (err) {
        console.error("Failed to fetch balance:", err)
      }
    }

    if (user) {
      fetchBalance()
    }
  }, [user])

  const handlePurchase = async () => {
    setIsLoading(true)

    try {
      const checkoutResponse = await paymentApi.createCheckout(
        selectedPackage.id,
      )

      if (checkoutResponse.success && checkoutResponse.sessionUrl) {
        console.log("Session URL:", checkoutResponse.sessionUrl)
        window.location.href = checkoutResponse.sessionUrl
      } else {
        toast.error({
          title: "Erreur",
          message: "Impossible de créer la session de paiement.",
        })
      }
    } catch (err) {
      toast.error({
        title: "Erreur",
        message: "Une erreur est survenue lors du traitement du paiement.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Acheter des couronnes</h1>
          {userBalance !== null && (
            <div className="bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 flex items-center">
              <span className="text-sm text-gray-600 mr-2">Votre solde:</span>
              <div className="flex items-center">
                <span className="font-bold text-lg">{userBalance}</span>
                <svg
                  className="h-4 w-4 ml-1 text-yellow-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <p className="text-muted-foreground mb-8">
          Les couronnes sont la monnaie virtuelle de Lootopia. Utilisez-les pour
          participer à des chasses au trésor ou organiser vos propres
          événements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CURRENCY_PACKAGES.map((pkg) => (
            <Card
              key={pkg.id}
              className={`cursor-pointer transition-all ${
                selectedPackage.id === pkg.id
                  ? "ring-2 ring-primary"
                  : "hover:shadow-md"
              }`}
              onClick={() => setSelectedPackage(pkg)}
            >
              <CardHeader className="relative pb-2">
                {pkg.popular && (
                  <div className="absolute -top-3 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Populaire
                  </div>
                )}
                <CardTitle className="flex items-center text-lg">
                  <span className="font-bold">{pkg.amount}</span>
                  <svg
                    className="h-4 w-4 ml-1 text-yellow-500"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </CardTitle>
                <CardDescription className="text-xs">
                  {pkg.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-xl font-bold">{pkg.price} €</p>
                <p className="text-muted-foreground text-xs">
                  {((pkg.price / pkg.amount) * 100).toFixed(2)} centimes par
                  couronne
                </p>
              </CardContent>
              <CardFooter className="pt-0 pb-3">
                <Button
                  variant={
                    selectedPackage.id === pkg.id ? "default" : "outline"
                  }
                  className="w-full text-sm h-8"
                  onClick={() => setSelectedPackage(pkg)}
                >
                  {selectedPackage.id === pkg.id
                    ? "Sélectionné"
                    : "Sélectionner"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Récapitulatif de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{selectedPackage.name}</span>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {selectedPackage.amount}
                    </span>
                    <svg
                      className="h-4 w-4 ml-1 text-yellow-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <span>
                    {(
                      (selectedPackage.price / selectedPackage.amount) *
                      100
                    ).toFixed(2)}{" "}
                    centimes par couronne
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>{selectedPackage.price} €</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePurchase}
                disabled={isLoading}
              >
                {isLoading
                  ? "Traitement en cours..."
                  : `Payer ${selectedPackage.price} €`}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 text-sm text-muted-foreground max-w-md text-center">
            <p>
              Paiement sécurisé via Stripe. En effectuant cet achat, vous
              acceptez nos conditions générales de vente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
