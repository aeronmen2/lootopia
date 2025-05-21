import { pgTable, uuid, timestamp, integer } from "drizzle-orm/pg-core"
import { users } from "./userSchema"

export const userCurrency = pgTable("user_currency", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  balance: integer("balance").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export type UserCurrency = typeof userCurrency.$inferSelect
export type UserCurrencyInsert = typeof userCurrency.$inferInsert
