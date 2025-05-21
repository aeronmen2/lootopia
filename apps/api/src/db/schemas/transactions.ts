import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core"
import { users } from "./userSchema"
import { sql } from "drizzle-orm"

export const transactions = pgTable("transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "no action" }),
  type: text("type").notNull(), // STRIPE_PURCHASE, SYSTEM_GRANT, HUNT_REWARD, HUNT_ENTRY, REFUND
  status: text("status").notNull(), // PENDING, COMPLETED, FAILED, REFUNDED
  amount: integer("amount").notNull(),
  paymentAmount: integer("payment_amount"),
  paymentCurrency: text("payment_currency").default("EUR"),
  stripeSessionId: text("stripe_session_id"),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type Transaction = typeof transactions.$inferSelect
export type TransactionInsert = typeof transactions.$inferInsert
