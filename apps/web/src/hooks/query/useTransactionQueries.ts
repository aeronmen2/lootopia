import { paymentApi } from "@/api/paymentApi"
import { useQuery } from "@tanstack/react-query"

export const transactionKeys = {
  all: ["transactions"] as const,
  list: () => [...transactionKeys.all, "list"] as const,
}

export function useTransactions() {
  return useQuery({
    queryKey: transactionKeys.list(),
    queryFn: async () => {
      const response = await paymentApi.getTransactions()
      if (!response.success) {
        throw new Error("Failed to fetch transactions")
      }
      return response.transactions
    },
    staleTime: 1000 * 60 * 5,
  })
}
