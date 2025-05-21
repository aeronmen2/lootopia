import type { Context } from "hono"
import { PaymentService } from "../services/paymentService"
import Stripe from "stripe"
import config from "../config/config"

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2025-04-30.basil",
})

const paymentService = new PaymentService()

export const createCheckout = async (c: Context) => {
  try {
    const userId = c.get("user").id
    const { packageId } = await c.req.json<{ packageId: string }>()

    const result = await paymentService.createCheckoutSession(userId, packageId)

    return c.json({
      success: true,
      sessionId: result.sessionId,
      sessionUrl: result.sessionUrl,
      transactionId: result.transactionId,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)

    return c.json(
      { success: false, error: "Failed to create checkout session" },
      500,
    )
  }
}

export const handleWebhook = async (c: Context) => {
  const signature = c.req.header("stripe-signature")

  if (!signature) {
    return c.json({ success: false, error: "No signature" }, 400)
  }

  try {
    const payload = await c.req.text()
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret,
    )

    const result = await paymentService.handleWebhook(event)

    return c.json(result)
  } catch (error) {
    console.error("Error handling webhook:", error)

    return c.json({ success: false, error: "Webhook error" }, 400)
  }
}

export const verifyPayment = async (c: Context) => {
  try {
    let sessionId: string

    if (c.req.method === "GET") {
      sessionId = c.req.param("sessionId")
    } else {
      const body = await c.req.json<{ sessionId: string }>()
      sessionId = body.sessionId
    }

    if (!sessionId) {
      return c.json({ success: false, error: "No session ID provided" }, 400)
    }

    const result = await paymentService.verifyPayment(sessionId)

    return c.json(result)
  } catch (error) {
    console.error("Error verifying payment:", error)

    return c.json({ success: false, error: "Failed to verify payment" }, 500)
  }
}

export const getBalance = async (c: Context) => {
  try {
    const userId = c.get("user").id
    const balance = await paymentService.getUserBalance(userId)

    return c.json({ success: true, balance })
  } catch (error) {
    console.error("Error getting balance:", error)

    return c.json({ success: false, error: "Failed to get balance" }, 500)
  }
}

export const getTransactions = async (c: Context) => {
  try {
    const userId = c.get("user").id
    const transactions = await paymentService.getUserTransactions(userId)

    return c.json({ success: true, transactions })
  } catch (error) {
    console.error("Error getting transactions:", error)

    return c.json({ success: false, error: "Failed to get transactions" }, 500)
  }
}
