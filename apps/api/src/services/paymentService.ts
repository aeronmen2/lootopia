import { eq } from "drizzle-orm"
import Stripe from "stripe"
import { db } from "../db"
import { transactions } from "../db/schemas/transactions"
import { userCurrency } from "../db/schemas/userCurrency"
import config from "../config/config"

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2025-04-30.basil",
})

// Currency package definitions
const CURRENCY_PACKAGES = {
  micro: { amount: 10, price: 99 }, // 0.99€
  small: { amount: 25, price: 249 }, // 2.49€
  medium: { amount: 50, price: 499 }, // 4.99€
  large: { amount: 100, price: 999 }, // 9.99€
  mega: { amount: 1000, price: 8999 }, // 89.99€
}

export class PaymentService {
  async createCheckoutSession(userId: string, packageId: string) {
    const package_ =
      CURRENCY_PACKAGES[packageId as keyof typeof CURRENCY_PACKAGES]

    if (!package_) {
      throw new Error("Invalid package")
    }

    // Create a transaction record first
    const [transaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: "STRIPE_PURCHASE",
        status: "PENDING",
        amount: package_.amount,
        paymentAmount: package_.price,
        paymentCurrency: "EUR",
        metadata: { packageId },
      })
      .returning()

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${package_.amount} Couronnes`,
            },
            unit_amount: package_.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${config.appUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.appUrl}/dashboard/payment/cancel`,
      metadata: {
        userId,
        transactionId: transaction.id,
        packageId,
      },
    })

    // Update transaction with session ID
    await db
      .update(transactions)
      .set({
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
      })
      .where(eq(transactions.id, transaction.id))

    return {
      sessionId: session.id,
      sessionUrl: session.url,
      transactionId: transaction.id,
    }
  }

  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Find the transaction
        const [transaction] = await db
          .select()
          .from(transactions)
          .where(eq(transactions.stripeSessionId, session.id))

        if (!transaction) {
          throw new Error("Transaction not found")
        }

        if (transaction.status === "COMPLETED") {
          return { success: true, alreadyProcessed: true }
        }

        // Update user's balance
        await db.transaction(async (tx) => {
          // Update transaction status
          await tx
            .update(transactions)
            .set({ status: "COMPLETED" })
            .where(eq(transactions.id, transaction.id))

          // Update or create user currency balance
          const [existing] = await tx
            .select()
            .from(userCurrency)
            .where(eq(userCurrency.userId, transaction.userId))

          if (existing) {
            await tx
              .update(userCurrency)
              .set({ balance: existing.balance + transaction.amount })
              .where(eq(userCurrency.userId, transaction.userId))
          } else {
            await tx.insert(userCurrency).values({
              userId: transaction.userId,
              balance: transaction.amount,
            })
          }
        })

        return { success: true }
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session

        // Update transaction status to failed
        await db
          .update(transactions)
          .set({ status: "FAILED" })
          .where(eq(transactions.stripeSessionId, session.id))

        return { success: true }
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)

        return { success: true }
    }
  }

  async verifyPayment(sessionId: string) {
    const [transaction] = await db
      .select()
      .from(transactions)
      .where(eq(transactions.stripeSessionId, sessionId))

    if (!transaction) {
      throw new Error("Transaction not found")
    }

    if (transaction.status !== "COMPLETED") {
      // Check status with Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (session.payment_status === "paid") {
        await this.handleWebhook({
          type: "checkout.session.completed",
          data: { object: session },
        } as unknown as Stripe.Event)
      }
    }

    return {
      success: transaction.status === "COMPLETED",
      transaction: transaction.status === "COMPLETED" ? transaction : undefined,
    }
  }

  async getUserBalance(userId: string) {
    const [balance] = await db
      .select()
      .from(userCurrency)
      .where(eq(userCurrency.userId, userId))

    return balance?.balance || 0
  }

  async getUserTransactions(userId: string) {
    const userTransactions = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(transactions.createdAt)

    return userTransactions
  }
}
