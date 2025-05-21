import { eq } from "drizzle-orm"
import Stripe from "stripe"
import { db } from "../db"
import { transactions } from "../db/schemas/transactions"
import { userCurrency } from "../db/schemas/userCurrency"
import { users } from "../db/schemas/userSchema"
import config from "../config/config"

const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: "2025-04-30.basil",
})

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

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new Error("User not found")
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card", "revolut_pay"],
      customer_email: user.email,
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
      success_url: `${config.clientUrl}/dashboard/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.clientUrl}/dashboard/payment/cancel`,
      metadata: {
        userId,
        transactionId: transaction.id,
        packageId,
      },
    })

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

        await db.transaction(async (tx) => {
          await tx
            .update(transactions)
            .set({ status: "COMPLETED" })
            .where(eq(transactions.id, transaction.id))

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

    // If transaction is already completed, return it
    if (transaction.status === "COMPLETED") {
      return {
        success: true,
        transaction,
      }
    }

    // Otherwise check with Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      // Process the webhook event manually if needed
      await this.handleWebhook({
        type: "checkout.session.completed",
        data: { object: session },
      } as unknown as Stripe.Event)

      // Fetch the updated transaction
      const [updatedTransaction] = await db
        .select()
        .from(transactions)
        .where(eq(transactions.stripeSessionId, sessionId))

      return {
        success: true,
        transaction: updatedTransaction,
      }
    }

    // Payment not completed yet
    return {
      success: false,
      paymentStatus: session.payment_status,
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
