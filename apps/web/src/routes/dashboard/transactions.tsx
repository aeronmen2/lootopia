import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { paymentApi } from "@/api/paymentApi"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export const Route = createFileRoute("/dashboard/transactions")({
  component: TransactionsPage,
})

// Maps transaction types to human-readable labels
const transactionTypeLabels: Record<string, string> = {
  STRIPE_PURCHASE: "Achat",
  SYSTEM_GRANT: "Bonus système",
  HUNT_REWARD: "Récompense de chasse",
  HUNT_ENTRY: "Inscription à une chasse",
  REFUND: "Remboursement",
}

// Maps transaction status to badge variants
const statusVariants: Record<
  string,
  "default" | "outline" | "secondary" | "destructive" | "success"
> = {
  PENDING: "secondary",
  COMPLETED: "success",
  FAILED: "destructive",
  REFUNDED: "outline",
}

function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await paymentApi.getTransactions()

        if (response.success) {
          setTransactions(response.transactions)
        } else {
          setError("Impossible de récupérer l'historique des transactions")
        }
      } catch (err) {
        setError(
          "Une erreur est survenue lors de la récupération des transactions",
        )
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Historique des transactions</h1>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-800">
            <p>{error}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <p className="text-muted-foreground">
              Vous n'avez pas encore effectué de transactions.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell>
                      {transactionTypeLabels[transaction.type] ||
                        transaction.type}
                    </TableCell>
                    <TableCell
                      className={
                        transaction.amount > 0
                          ? "text-green-600 font-medium"
                          : "text-red-600 font-medium"
                      }
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          statusVariants[transaction.status] || "default"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
