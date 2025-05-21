import { paymentApi } from "@/api/paymentApi"
import { useQuery } from "@tanstack/react-query"

export const paymentKeys = {
  all: ["payment"] as const,
  verification: (sessionId: string) =>
    [...paymentKeys.all, "verify", sessionId] as const,
}

export interface PaymentVerificationResult {
  success: boolean
  transaction?: {
    amount: number
  }
  paymentStatus?: string
}

export function usePaymentVerification(sessionId: string | undefined) {
  return useQuery({
    queryKey: paymentKeys.verification(sessionId || ""),
    queryFn: async (): Promise<PaymentVerificationResult> => {
      if (!sessionId) {
        throw new Error("No session ID provided")
      }
      return paymentApi.verifyPayment(sessionId)
    },
    enabled: !!sessionId,
    retry: false,
    staleTime: Infinity,
  })
}
