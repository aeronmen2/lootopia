import { createFileRoute } from "@tanstack/react-router"
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
import { useTransactions } from "@/hooks/query/useTransactionQueries"
import { Loader2Icon } from "lucide-react"

export const Route = createFileRoute("/dashboard/transactions")({
  component: TransactionsPage,
})

interface Transaction {
  id: string
  type: string
  amount: number
  status: string
  createdAt: string
}

const transactionTypeConfig: Record<string, { label: string; color: string }> =
  {
    STRIPE_PURCHASE: { label: "Achat", color: "text-blue-600" },
    SYSTEM_GRANT: { label: "Bonus système", color: "text-purple-600" },
    HUNT_REWARD: { label: "Récompense de chasse", color: "text-green-600" },
    HUNT_ENTRY: { label: "Inscription à une chasse", color: "text-orange-600" },
    REFUND: { label: "Remboursement", color: "text-gray-600" },
  }

const statusConfig: Record<
  string,
  {
    variant: "default" | "outline" | "secondary" | "destructive"
    label: string
  }
> = {
  PENDING: { variant: "secondary", label: "En attente" },
  COMPLETED: { variant: "default", label: "Complété" },
  FAILED: { variant: "destructive", label: "Échoué" },
  REFUNDED: { variant: "outline", label: "Remboursé" },
}

function TransactionsPage() {
  const { data: transactions = [], isLoading, error } = useTransactions()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Historique des transactions</h1>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2Icon className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-800">
            <p>
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue"}
            </p>
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
                {transactions.map((transaction: Transaction) => {
                  const typeConfig = transactionTypeConfig[
                    transaction.type
                  ] || {
                    label: transaction.type,
                    color: "text-gray-600",
                  }
                  const statusConf = statusConfig[transaction.status] || {
                    variant: "default" as const,
                    label: transaction.status,
                  }

                  return (
                    <TableRow
                      key={transaction.id}
                      className="group hover:bg-gray-50"
                    >
                      <TableCell className="font-medium">
                        {formatDate(transaction.createdAt)}
                      </TableCell>
                      <TableCell className={typeConfig.color}>
                        {typeConfig.label}
                      </TableCell>
                      <TableCell
                        className={
                          transaction.amount > 0
                            ? "text-green-600 font-medium"
                            : "text-red-600 font-medium"
                        }
                      >
                        <span className="font-semibold">
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}
                        </span>
                        <span className="ml-1 text-yellow-500">👑</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConf.variant}>
                          {statusConf.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
