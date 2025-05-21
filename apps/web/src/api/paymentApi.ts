import { api } from "./client"

export interface CurrencyPackage {
  id: string
  name: string
  amount: number
  price: number
  popular: boolean
}

export interface CheckoutResponse {
  success: boolean
  sessionId: string
  sessionUrl: string
  transactionId: string
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: string
  status: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export interface VerifyPaymentResponse {
  success: boolean
  alreadyProcessed?: boolean
  transaction?: Transaction
  paymentStatus?: string
}

export interface BalanceResponse {
  success: boolean
  balance: number
}

export interface TransactionResponse {
  success: boolean
  transactions: Transaction[]
}

export const paymentApi = {
  createCheckout: async (packageId: string): Promise<CheckoutResponse> => {
    return api("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ packageId }),
    })
  },

  verifyPayment: async (sessionId: string): Promise<VerifyPaymentResponse> => {
    return api("/api/payments/verify", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    })
  },

  getBalance: async (): Promise<BalanceResponse> => {
    return api("/api/payments/balance")
  },

  getTransactions: async (): Promise<TransactionResponse> => {
    return api("/api/payments/transactions")
  },
}
