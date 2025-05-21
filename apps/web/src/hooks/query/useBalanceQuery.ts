import { useQuery } from "@tanstack/react-query"
import { paymentApi } from "@/api/paymentApi"

export const balanceKeys = {
  all: ["balance"] as const,
  details: () => [...balanceKeys.all, "details"] as const,
}

export function useBalance() {
  return useQuery({
    queryKey: balanceKeys.details(),
    queryFn: async () => {
      const response = await paymentApi.getBalance()
      if (!response.success) {
        throw new Error("Failed to fetch balance")
      }
      return response.balance
    },
  })
}
