import { useMutation, useQueryClient } from "@tanstack/react-query"
import { paymentApi } from "@/api/paymentApi"
import { balanceKeys } from "./useBalanceQuery"

export function useCreateCheckout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (packageId: string) => paymentApi.createCheckout(packageId),
    onSuccess: (response) => {
      if (response.success && response.sessionUrl) {
        window.location.href = response.sessionUrl
        queryClient.invalidateQueries({ queryKey: balanceKeys.details() })
      }
    },
  })
}
